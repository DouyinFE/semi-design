/**
 * 改写工具：scss 源码 → 嵌套 css 真源
 *
 * 核心策略：
 * 1. 语义求值（@for 边界、@if 条件、算术、插值）全部交给 sass（sassEval 服务）
 * 2. 工具只做语法形态变换：
 *    - 可保留的嵌套（后代选择器、& 伪类、@media）→ 保持 CSS 原生嵌套
 *    - 含 &- 拼接的子树 → 按 sass 语义平面化展开（CSS 嵌套无法表达拼接）
 *    - $var → var(--semi-cssvar-x)（值上下文）
 *    - @import variables/animation → 删除；rtl/cssVariables/其他 → 内联
 *    - mixin 调用 → AST 内联展开（参数绑定）
 */
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const scssParser = require('postcss-scss');
const { evalExprs } = require('./sassEval');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');
const THEME = path.join(ROOT, 'packages/semi-theme-default');

const CSSVAR_PREFIX = '--semi-cssvar-';

// 同名冲突变量（多组件定义且值不同，不能全局 token 化 → 组件本地求值写死）
let conflictVarsCache = null;
function getConflictVars() {
    if (conflictVarsCache) return conflictVarsCache;
    try {
        conflictVarsCache = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'conflictVars.json'), 'utf-8')));
    } catch (e) {
        conflictVarsCache = new Set();
    }
    return conflictVarsCache;
}

// 括号感知的选择器列表拆分（:not(.a, .b) 内逗号不拆）
function splitSelectors(sel) {
    const parts = [];
    let depth = 0;
    let cur = '';
    for (const ch of sel) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            parts.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    parts.push(cur);
    return parts.map((p) => p.trim()).filter(Boolean);
}

// 判断节点是否在 @mixin 定义体内（模板代码，不能独立展开——只在 mixin 被调用时展开）
function isInMixinDef(node) {
    let p = node.parent;
    while (p) {
        if (p.type === 'atrule' && p.name === 'mixin') return true;
        p = p.parent;
    }
    return false;
}

// token 值表：--semi-cssvar-x → 值（用于 sass 函数求值时代入，如 percentage(math.div($i, $width-grid_columns))）
let tokenValuesCache = null;
function getTokenValues() {
    if (tokenValuesCache) return tokenValuesCache;
    tokenValuesCache = new Map();
    try {
        const css = fs.readFileSync(path.join(ROOT, 'packages/semi-theme-default/css/token.css'), 'utf-8');
        const re = /--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([^;]+);/g;
        let m;
        while ((m = re.exec(css))) {
            // sass 变量名 -/_ 等价：登记归一化键
            tokenValuesCache.set(m[1].replace(/-/g, '_'), m[2].trim());
        }
    } catch (e) {
        // token.css 不存在时静默（函数求值会失败保留）
    }
    return tokenValuesCache;
}

// ============ 上下文 ============
class Ctx {
    constructor(componentDir, filePath) {
        this.componentDir = componentDir; // 组件目录（相对 foundation）
        this.filePath = filePath;
        this.structuralVars = new Map([['prefix', 'semi']]); // $name -> 文本值（选择器上下文用，$prefix 由构建注入默认 'semi'）
        this.mixins = new Map(); // name -> { params: [], nodes: [] }
        this.varDefs = '$prefix: semi;\n'; // 收集的变量定义文本（供 sassEval）
        this.conflictVars = getConflictVars(); // 同名冲突变量（组件本地求值）
        // 组件变量文件（@for 边界 / @each 列表等引用的 token 变量定义处）
        this.extraImports = ['variables.scss', 'animation.scss']
            .map((f) => path.join(FOUNDATION, componentDir, f))
            .filter((p) => fs.existsSync(p));
    }
}

// ============ 工具 ============
function isStructuralDecl(decl) {
    return /^\$[A-Za-z_]/.test(decl.prop);
}

// 从 decl 值中提取"纯文本"（用于结构性变量）
function evalStructuralValue(raw) {
    // 展开 #{$prefix} 等（$prefix 由构建注入，真源写死 'semi'）
    return raw
        .replace(/#\{\$prefix\}/g, 'semi')
        .replace(/#\{\$module\}/g, (m) => m); // 递归引用保留，后续处理
}

// 求值结构性变量定义（简单文本情况），复杂情况由调用方用 sassEval
function tryEvalStructural(expr) {
    if (/^#\{\$prefix\}[A-Za-z0-9_-]*$/.test(expr)) {
        return expr.replace('#{$prefix}', 'semi');
    }
    return null;
}

// 值上下文：$var / #{$var} → var(--semi-cssvar-var)
function replaceVarRefs(text) {
    // 先处理 #{$name} 插值（值上下文）
    let t = text.replace(/#\{\$([A-Za-z_][A-Za-z0-9_-]*)\}/g, (m, name) => `var(${CSSVAR_PREFIX}${name})`);
    // 再处理裸 $name 引用（单词边界；支持负号/运算符前导 -$x、*$x、/$x；排除变量定义行）
    t = t.replace(/(^|[\s(,:;+*/\-])[\$]([A-Za-z_][A-Za-z0-9_-]*)/g, (m, pre, name) => `${pre}var(${CSSVAR_PREFIX}${name})`);
    return t;
}

// 值是否需要包 calc（含 var 引用的算术）
// 先遮罩函数内容（linear-gradient(..., 50% - 1px, ...) 里的算术不该触发 calc 包裹），
// 再检测"数值/单位/右括号" 与 "数值/左括号" 之间的二元运算符
function needsCalc(value, prop) {
    // font/font-family/font-size 等含 /（字号/行高）和 -（字重），不包 calc
    if (prop && /^font(-|$)/.test(prop)) return false;
    // 递归遮罩括号内容（嵌套函数/var）
    let masked = value;
    for (let i = 0; i < 6; i++) {
        const next = masked.replace(/\([^()]*\)/g, '(1)').replace(/var\([^)]*\)/g, '1');
        if (next === masked) break;
        masked = next;
    }
    // 运算符两侧须有值：数字(含单位)/右括号/百分号 与 数字/左括号/百分号
    return /[\d.)%1][a-z%]*\s*[+\-*/]\s*[\d.(%1]/.test(masked);
}

// ============ mixin 收集与展开 ============
function collectMixinsFromNodes(nodes, ctx) {
    for (const node of nodes) {
        if (node.type === 'atrule' && node.name === 'mixin') {
            const m = (node.params || '').trim().match(/^([A-Za-z_-][A-Za-z0-9_-]*)/);
            if (m) {
                ctx.mixins.set(m[1], {
                    params: node.params.trim(),
                    nodes: node.nodes || [],
                });
            }
        }
        if (node.nodes) collectMixinsFromNodes(node.nodes, ctx);
    }
}

// 移除 mixin 定义节点（保留到展开后移除，先收集后移除）
function removeMixinDefs(root, ctx) {
    root.walkAtRules('mixin', (at) => at.remove());
}

// 加载 theme 的所有 mixin（index.scss 及其全部 @import 文件）
function loadThemeMixins(ctx) {
    const indexFile = path.join(THEME, 'scss', 'index.scss');
    const loaded = new Set();
    const loadFile = (filePath) => {
        if (!fs.existsSync(filePath) || loaded.has(filePath)) return;
        loaded.add(filePath);
        const root = scssParser.parse(fs.readFileSync(filePath, 'utf-8'), { from: filePath });
        // 递归加载相对 import（mixin.scss、_font.scss 等）
        root.walkAtRules('import', (at) => {
            const url = (at.params || '').replace(/['"]/g, '').trim();
            if (/\.scss$/.test(url)) {
                loadFile(path.resolve(path.dirname(filePath), url));
            }
        });
        collectMixinsFromNodes(root.nodes || [], ctx);
    };
    loadFile(indexFile);
}

// 参数绑定：mixin 体内 $param 替换为实参（始终返回深拷贝，避免 replaceWith 移动原节点）
function bindParams(nodes, paramDef, argStr, ctx) {
    if (!paramDef) return nodes.map((n) => n.clone());
    // 解析参数名与默认值：$gutter: $width-grid_gutter、$class: '' 等
    const paramList = paramDef.match(/\$[A-Za-z_][A-Za-z0-9_-]*(?:\s*:\s*[^,)]*)?/g) || [];
    const paramNames = [];
    const defaults = [];
    for (const p of paramList) {
        const mm = p.match(/^\$([A-Za-z_][A-Za-z0-9_-]*)(?:\s*:\s*(.*))?$/);
        if (mm) {
            paramNames.push(mm[1]);
            defaults.push(mm[2] !== undefined ? mm[2].trim() : undefined);
        }
    }
    if (!paramNames.length) return nodes.map((n) => n.clone());
    // 解析实参（无实参时为空数组，避免 [''] 被当作实参替换成空字符串）
    const args = argStr ? argStr.split(',').map((s) => s.trim()) : [];
    const replaceIn = (text) => {
        let t = text;
        paramNames.forEach((name, i) => {
            // 实参优先，缺省用默认值
            const val = args[i] !== undefined ? args[i] : defaults[i];
            if (val !== undefined) {
                // 插值 #{$name}：sass 插值语义去引号（$class: '' → #{$class} 输出空）
                // 裸 $name：保留原值（带引号字符串）
                const unquoted = val.replace(/^['"]|['"]$/g, '');
                t = t.replace(new RegExp(`#\{\\$${name}\\}`, 'g'), unquoted);
                t = t.replace(new RegExp(`\\$${name}(?![A-Za-z0-9_-])`, 'g'), val);
            }
        });
        return t;
    };
    // 深拷贝节点并替换
    const clone = (node) => {
        if (node.type === 'decl') {
            const d = node.clone();
            d.prop = replaceIn(d.prop);
            d.value = replaceIn(d.value);
            return d;
        }
        if (node.type === 'rule') {
            const r = node.clone();
            r.selector = replaceIn(r.selector);
            if (r.nodes) r.nodes = r.nodes.map(clone);
            return r;
        }
        if (node.type === 'atrule') {
            const a = node.clone();
            a.params = replaceIn(a.params || '');
            if (a.nodes) a.nodes = a.nodes.map(clone);
            return a;
        }
        return node.clone();
    };
    return nodes.map(clone);
}

// 展开 @include（迭代直到无 @include）
// 注意：postcss 的 walkAtRules 回调中 replaceWith 会跳过后续节点，必须快照收集
function expandIncludes(root, ctx) {
    let pass = 0;
    while (pass++ < 20) {
        const includes = [];
        root.walkAtRules('include', (at) => {
            if (!isInMixinDef(at)) includes.push(at);
        });
        if (!includes.length) break;
        for (const at of includes) {
            const parts = at.params.trim().split(/\s*\(\s*/);
            const name = parts[0].trim();
            const argStr = parts.length > 1 ? at.params.trim().slice(name.length).replace(/^\(\s*/, '').replace(/\s*\)$/, '') : '';
            const def = ctx.mixins.get(name);
            if (!def) {
                console.warn(`[mixin] 未找到定义: @include ${name} in ${ctx.filePath}`);
                at.remove();
                continue;
            }
            const expanded = bindParams(def.nodes, def.params, argStr, ctx);
            at.replaceWith(...expanded);
        }
    }
}

// ============ @for / @each / @if ============
// 循环体内变量赋值（$item: '...';）→ 作用域内求值并替换引用（#{$item} / $item），删除赋值 decl
// 按"最近的 rule/atrule 作用域"独立解析；子作用域继承祖先已解析的变量
// （mixin 参数传递链：loop-grid-columns-rtl($index) 的实参是外层局部变量）
function resolveLoopVars(nodes, ctx, inheritedDefs = '') {
    for (const n of nodes) {
        if (n.type === 'rule' || n.type === 'atrule') {
            // 跳过 mixin 定义体内的变量（模板代码）
            if (n.type === 'atrule' && n.name === 'mixin') continue;
            const resolvedDefs = resolveScope(n, ctx, inheritedDefs);
            if (n.nodes) resolveLoopVars(n.nodes, ctx, inheritedDefs + resolvedDefs);
        }
    }
}

// 解析单个作用域内的变量赋值，返回成功解析的定义文本（供子作用域继承）
function resolveScope(scopeNode, ctx, inheritedDefs) {
    const defs = [];
    const collect = (list) => {
        for (const n of list) {
            if (n.type === 'decl' && isStructuralDecl(n)) {
                defs.push({ name: n.prop.slice(1), raw: n.value.trim(), node: n });
            }
            if (n.nodes) collect(n.nodes);
        }
    };
    collect(scopeNode.nodes || []);
    if (!defs.length) return '';
    // 多轮求值（变量间依赖逐步解析；上下文含祖先已解析变量）
    let localDefs = ctx.varDefs + inheritedDefs;
    const resolved = new Map();
    for (let pass = 0; pass < 6; pass++) {
        for (const d of defs) {
            if (resolved.has(d.name)) continue;
            const r = evalExprs(localDefs + `$${d.name}: ${d.raw};`, [`$${d.name}`], ctx.extraImports).get(`$${d.name}`);
            if (r !== undefined) {
                resolved.set(d.name, r);
                localDefs += `$${d.name}: ${d.raw};\n`;
            }
        }
    }
    if (!resolved.size) return '';
    // 替换作用域内的引用并删除赋值 decl
    const replaceIn = (list) => {
        for (const n of list) {
            if (n.type === 'decl') {
                n.value = n.value.replace(/#\{\$([A-Za-z_][A-Za-z0-9_-]*)\}/g, (m, name) => {
                    const v = resolved.get(name);
                    return v !== undefined ? v : m;
                }).replace(/\$([A-Za-z_][A-Za-z0-9_-]*)/g, (m, name) => {
                    const v = resolved.get(name);
                    return v !== undefined ? v : m;
                });
            }
            if (n.selector) {
                n.selector = n.selector.replace(/#\{\$([A-Za-z_][A-Za-z0-9_-]*)\}/g, (m, name) => {
                    const v = resolved.get(name);
                    return v !== undefined ? v : m;
                });
            }
            if (n.params) {
                n.params = n.params.replace(/\$([A-Za-z_][A-Za-z0-9_-]*)/g, (m, name) => {
                    const v = resolved.get(name);
                    return v !== undefined ? v : m;
                });
            }
            if (n.nodes) replaceIn(n.nodes);
        }
    };
    replaceIn(scopeNode.nodes || []);
    let inherited = '';
    for (const d of defs) {
        if (resolved.has(d.name)) {
            if (d.node.parent) {
                d.node.remove();
            } else if (scopeNode.nodes && Array.isArray(scopeNode.nodes)) {
                // 无 parent（clone 的节点数组，如 @for 展开产物）→ splice 移除
                const idx = scopeNode.nodes.indexOf(d.node);
                if (idx > -1) scopeNode.nodes.splice(idx, 1);
            }
            inherited += `$${d.name}: ${d.raw};\n`;
        }
    }
    return inherited;
}

function expandLoops(root, ctx) {
    // 先解析体内的变量赋值（$index: 1 等，@for 边界可能引用）
    resolveLoopVars(root.nodes, ctx);
    // 快照收集（walkAtRules 回调中 replaceWith 会跳过后续节点；跳过 mixin 定义体内的模板）
    const collect = (re) => {
        const list = [];
        root.walkAtRules(re, (at) => {
            if (!isInMixinDef(at)) list.push(at);
        });
        return list;
    };
    const ats = collect(/for|each|if|else/);
    for (const at of ats) {
        if (at.name === 'for') {
            // 解析 @for 的兄弟变量声明（$index: 1 在 @for 前，sass 作用域可见；
            // 这些 decl 不在 rule/atrule 内，resolveLoopVars 按节点作用域处理不到）
            const parent = at.parent;
            if (parent && parent.nodes) {
                const siblingDefs = [];
                for (const n of parent.nodes) {
                    if (n.type === 'decl' && isStructuralDecl(n)) siblingDefs.push({ name: n.prop.slice(1), raw: n.value.trim() });
                }
                if (siblingDefs.length) {
                    let localDefs = ctx.varDefs;
                    const resolved = new Map();
                    for (let pass = 0; pass < 6; pass++) {
                        for (const d of siblingDefs) {
                            if (resolved.has(d.name)) continue;
                            const r = evalExprs(localDefs + `$${d.name}: ${d.raw};`, [`$${d.name}`], ctx.extraImports).get(`$${d.name}`);
                            if (r !== undefined) {
                                resolved.set(d.name, r);
                                localDefs += `$${d.name}: ${d.raw};\n`;
                            }
                        }
                    }
                    if (resolved.size) {
                        at.params = at.params.replace(/\$([A-Za-z_][A-Za-z0-9_-]*)/g, (m, name) => {
                            return resolved.get(name) !== undefined ? resolved.get(name) : m;
                        });
                        // 不删除兄弟 decl：多个 @for 共享同一批 $index（不同 mixin 展开产物），
                        // 删除会让后续 @for 失去变量；统一由步骤 6 的 walkDecls 清理
                    }
                }
            }
            const m = at.params.match(/^\$(\w+)\s+from\s+(.+?)\s+through\s+(.+)$/);
            if (!m) { at.remove(); continue; }
            const [, varName, fromExpr, toExpr] = m;
            const values = evalExprs(ctx.varDefs, [fromExpr, toExpr], ctx.extraImports);
            const from = parseFloat(values.get(fromExpr));
            const to = parseFloat(values.get(toExpr));
            if (Number.isNaN(from) || Number.isNaN(to)) { at.remove(); continue; }
            const expanded = [];
            let allResolved = true;
            for (let i = from; i <= to; i++) {
                const cloneNodes = at.nodes.map((n) => n.clone());
                // $i 替换为数值（含 #{$i} 插值形式）
                const replaceI = (nodes) => {
                    for (const n of nodes) {
                        if (n.type === 'decl') n.value = n.value.replace(new RegExp(`#\{\\$${varName}\\}`, 'g'), String(i)).replace(new RegExp(`\\$${varName}(?![A-Za-z0-9_-])`, 'g'), String(i));
                        if (n.selector) n.selector = n.selector.replace(new RegExp(`#\{\\$${varName}\\}`, 'g'), String(i)).replace(new RegExp(`\\$${varName}(?![A-Za-z0-9_-])`, 'g'), String(i));
                        if (n.params) n.params = n.params.replace(new RegExp(`#\{\\$${varName}\\}`, 'g'), String(i)).replace(new RegExp(`\\$${varName}(?![A-Za-z0-9_-])`, 'g'), String(i));
                        if (n.nodes) replaceI(n.nodes);
                    }
                };
                replaceI(cloneNodes);
                // 每份独立解析体内变量（$item 与 #{$item} 同作用域；同名不同值各自绑定，
                // 不能整体 resolveScope——同名 Map 会只保留第一个值）
                const pending = cloneNodes.filter((n) => n.type === 'decl' && isStructuralDecl(n)).length;
                if (pending > 0) {
                    resolveScope({ nodes: cloneNodes }, ctx, '');
                    const remaining = cloneNodes.filter((n) => n.type === 'decl' && isStructuralDecl(n)).length;
                    if (remaining > 0) {
                        allResolved = false;
                        break;
                    }
                }
                expanded.push(...cloneNodes);
            }
            if (!allResolved) {
                continue; // 依赖未满足（如 mixin 参数），保留 @for 下一轮重试
            }
            at.replaceWith(...expanded);
        } else if (at.name === 'each') {
            // @each $c in $colors { ... } —— 列表求值交给 sass 输出逗号分隔
            const m = at.params.match(/^\$(\w+)\s+in\s+(.+)$/);
            if (!m) { at.remove(); continue; }
            const [, varName, listExpr] = m;
            const values = evalExprs(ctx.varDefs, [listExpr], ctx.extraImports);
            const listRaw = values.get(listExpr);
            const items = listRaw ? listRaw.split(',').map((s) => s.trim()) : [];
            const expanded = [];
            for (const item of items) {
                const cloneNodes = at.nodes.map((n) => n.clone());
                const replaceI = (nodes) => {
                    for (const n of nodes) {
                        if (n.type === 'decl') n.value = n.value.replace(new RegExp(`#\{\\$${varName}\\}`, 'g'), item).replace(new RegExp(`\\$${varName}(?![A-Za-z0-9_-])`, 'g'), item);
                        if (n.selector) n.selector = n.selector.replace(new RegExp(`#\{\\$${varName}\\}`, 'g'), item).replace(new RegExp(`\\$${varName}(?![A-Za-z0-9_-])`, 'g'), item);
                        if (n.params) n.params = n.params.replace(new RegExp(`#\{\\$${varName}\\}`, 'g'), item).replace(new RegExp(`\\$${varName}(?![A-Za-z0-9_-])`, 'g'), item);
                        if (n.nodes) replaceI(n.nodes);
                    }
                };
                replaceI(cloneNodes);
                expanded.push(...cloneNodes);
            }
            at.replaceWith(...expanded);
        } else if (at.name === 'if' || at.name === 'else') {
            // @if 条件求值（@else if xxx 的 params 含 "if " 前缀，去掉）
            const cond = at.params.trim().replace(/^if\s+/i, '');
            const values = evalExprs(ctx.varDefs, [cond], ctx.extraImports);
            const result = values.get(cond);
            const truthy = result === 'true' || result === '1' || (result && !/^(false|0|null|$)/.test(result));
            if (at.name === 'if') {
                if (truthy) {
                    at.replaceWith(...(at.nodes || []));
                } else {
                    at.remove();
                }
            } else {
                // @else 或 @else if：条件为真则保留节点内容，否则删除
                // 注意：@else 无参数视为 true；@else if 由上面的 cond 判定
                const isElseIf = /^if\s+/i.test(at.params.trim());
                if (!isElseIf || truthy) {
                    at.replaceWith(...(at.nodes || []));
                } else {
                    at.remove();
                }
            }
        }
    }
}

// ============ @import 处理 ============
async function inlineImports(root, ctx) {
    const imports = [];
    root.walkAtRules('import', (at) => {
        const url = (at.params || '').replace(/['"]/g, '').trim();
        if (/\.scss$/.test(url)) {
            imports.push({ at, url });
        } else {
            at.remove(); // 组件 scss 里无 css import
        }
    });
    for (const { at, url } of imports) {
        // 解析路径：支持 ~@douyinfe/semi-foundation/xxx（semi-ui 引用 foundation 样式）
        let abs;
        if (url.startsWith('~')) {
            const rel = url.slice(1).replace(/^@douyinfe\/semi-foundation\//, 'semi-foundation/');
            abs = path.join(ROOT, 'packages', rel);
        } else {
            const base = url.startsWith('/') ? '' : path.dirname(ctx.filePath);
            abs = path.resolve(ROOT, base, url);
        }
        if (!fs.existsSync(abs)) {
            console.warn(`[import] 未找到: ${url} (${abs})`);
            at.remove();
            continue;
        }
        const fname = path.basename(url);
        if (fname === 'variables.scss' || fname === 'animation.scss') {
            // 变量定义文件：token 化后不需要（$var → var(--semi-cssvar-*) 已替换）
            at.remove();
            continue;
        }
        const subRoot = scssParser.parse(fs.readFileSync(abs, 'utf-8'), { from: abs });
        // mixin 定义收集到主 ctx（主文件可能 @include）
        collectMixinsFromNodes(subRoot.nodes || [], ctx);
        if (fname === 'mixin.scss') {
            // 纯 mixin 文件：splice 进来（定义由主文件 removeMixinDefs 删除），无独立规则转换
            at.replaceWith(...(subRoot.nodes || []).map((n) => n.clone()));
            continue;
        }
        // 其他子文件（rtl/cssVariables/bacisSteps/navSteps/arrow/option 等）：
        // sass 的 @import 是按位置作用域——子文件有自己的 $module 等变量定义，
        // 因此独立转换（继承主 ctx 的变量/mixin 作初始值，子文件定义覆盖）
        const subCtx = new Ctx(ctx.componentDir, abs);
        subCtx.structuralVars = new Map(ctx.structuralVars);
        subCtx.varDefs = ctx.varDefs;
        subCtx.mixins = ctx.mixins; // 共享 mixin 表（theme + 主文件 + 已收集的子文件 mixin）
        await processFile(subRoot, subCtx);
        // 子文件定义的变量合并回主 ctx（sass 语义：import 后变量对后续代码可见，
        // 如 rtl.scss 引用 navSteps 的 $item）
        for (const [name, val] of subCtx.structuralVars) {
            ctx.structuralVars.set(name, val);
        }
        ctx.varDefs = subCtx.varDefs;
        at.replaceWith(...(subRoot.nodes || []).map((n) => n.clone()));
    }
}

// ============ 选择器处理 ============
// sass 式 & 文本替换（平面化用）
// 父选择器可能是逗号列表：sass 语义中 & = 完整父列表，展开时每处 & 独立取父列表的一项
// （&:last-child → 每项父 + :last-child；& + & → N 维笛卡尔积）
function sassReplaceAmp(sel, parentText) {
    const parents = parentText.split(',').map((p) => p.trim()).filter(Boolean);
    if (parents.length <= 1) return sel.replace(/&/g, parentText);
    const ampCount = (sel.match(/&/g) || []).length;
    let results = [sel];
    for (let i = 0; i < ampCount; i++) {
        const next = [];
        for (const r of results) {
            for (const p of parents) {
                next.push(r.replace(/&/, p));
            }
        }
        results = next;
    }
    return results.join(', ');
}

// 子选择器相对父选择器的展开：父列表 × 子列表 笛卡尔积
function expandChildSelector(part, parentFlat) {
    const parents = parentFlat.split(',').map((p) => p.trim()).filter(Boolean);
    if (part.includes('&')) {
        // 多 & 时每处独立笛卡尔积（sass 语义）
        return sassReplaceAmp(part, parentFlat);
    }
    // 裸选择器（sass 嵌套语义 = 后代）：每项父 + 空格 + 子
    return parents.map((p) => `${p} ${part}`).join(', ');
}

// 选择器插值展开：使用结构性变量（值中若还有插值，递归展开）
function expandSelectorInterp(sel, ctx) {
    let s = sel;
    for (let pass = 0; pass < 5; pass++) {
        const before = s;
        s = s.replace(/#\{\$([A-Za-z_][A-Za-z0-9_-]*)\}/g, (m, name) => {
            const v = ctx.structuralVars.get(name);
            if (v !== undefined) return v;
            return m;
        });
        if (s === before) break;
    }
    return s;
}

// 检测规则子树中是否含 &- 拼接（CSS 嵌套无法表达，需平面化）
function hasSuffixJoinInTree(rule) {
    if (/&-[A-Za-z0-9_-]/.test(rule.selector || '')) return true;
    for (const n of rule.nodes || []) {
        if (n.type === 'rule' && hasSuffixJoinInTree(n)) return true;
        if (n.type === 'atrule' && n.nodes) {
            for (const sub of n.nodes) {
                if (sub.type === 'rule' && hasSuffixJoinInTree(sub)) return true;
            }
        }
    }
    return false;
}

// 处理嵌套规则
// parentFlat: 父规则在"平面世界"的完整展开选择器（用于平面化的正确展开）
function processNestedRule(rule, parentFlat, ctx) {
    const rawSel = expandSelectorInterp(rule.selector, ctx);

    if (parentFlat === null) {
        // 顶层规则
        rule.selector = rawSel;
        if (hasSuffixJoinInTree(rule)) {
            // 含 &- 拼接（子树内）→ 整棵树平面化（保证与 sass 深度优先顺序一致）
            return flattenRule(rule, rawSel, ctx);
        }
        rule.__flat = rawSel;
        rule.nodes = processChildren(rule.nodes || [], rule.__flat, ctx);
        return [rule];
    }

    if (hasSuffixJoinInTree(rule)) {
        // 含 &- 拼接 → 整棵子树按 sass 语义平面化
        const flatSel = splitSelectors(rawSel).map((part) => {
            const p = part.trim();
            return expandChildSelector(p, parentFlat);
        }).join(', ');
        return flattenRule(rule, flatSel, ctx);
    }

    // 保持嵌套：裸选择器 & 前缀化（消除 CSS 嵌套的 :is 语义差异）；
    // 已含 & 的（&:hover、.semi-rtl & 等）保留原样（postcss-nested 支持 & 在末尾）
    rule.selector = splitSelectors(rawSel).map((part) => {
        const p = part.trim();
        if (p.startsWith('&') || p.includes('&')) return p;
        return `& ${p}`;
    }).join(', ');
    // 记录平面展开（子规则平面化时使用完整祖先链）
    rule.__flat = splitSelectors(rawSel).map((part) => {
        const p = part.trim();
        return expandChildSelector(p, parentFlat);
    }).join(', ');
    rule.nodes = processChildren(rule.nodes || [], rule.__flat, ctx);
    return [rule];
}

// 递归处理子节点，返回处理后的 nodes
function processChildren(nodes, parentFlat, ctx) {
    const out = [];
    for (const node of nodes) {
        if (node.type === 'rule') {
            out.push(...processNestedRule(node, parentFlat, ctx));
        } else if (node.type === 'atrule' && (node.name === 'media' || node.name === 'supports' || node.name === 'container') && node.nodes) {
            node.nodes = processChildren(node.nodes, parentFlat, ctx);
            out.push(node);
        } else {
            out.push(node);
        }
    }
    return out;
}

// 平面化规则：该规则及其所有子规则按 sass 语义展开为平面选择器列表
// 返回独立的顶层规则列表（不嵌套）
function flattenRule(rule, flatSelector, ctx) {
    const clone = rule.clone();
    clone.selector = flatSelector;
    // 分离自身 decls 与子节点
    const ownDecls = [];
    const rest = [];
    for (const node of clone.nodes || []) {
        if (node.type === 'decl') ownDecls.push(node);
        else rest.push(node);
    }
    clone.nodes = ownDecls;
    const result = [clone];
    for (const node of rest) {
        if (node.type === 'rule') {
            // 子规则：& 文本替换（含 &- 拼接继续递归平面化）
            const rawSub = expandSelectorInterp(node.selector, ctx);
            const subFlat = splitSelectors(rawSub).map((part) => {
                const p = part.trim();
                return expandChildSelector(p, flatSelector);
            }).join(', ');
            result.push(...flattenRule(node, subFlat, ctx));
        } else if (node.type === 'atrule' && (node.name === 'media' || node.name === 'supports') && node.nodes) {
            const mediaChildren = [];
            for (const sub of node.nodes) {
                if (sub.type === 'rule') {
                    const rawSub = expandSelectorInterp(sub.selector, ctx);
                    const subFlat = splitSelectors(rawSub).map((part) => {
                        const p = part.trim();
                        return expandChildSelector(p, flatSelector);
                    }).join(', ');
                    mediaChildren.push(...flattenRule(sub, subFlat, ctx));
                } else {
                    mediaChildren.push(sub);
                }
            }
            node.nodes = mediaChildren;
            result.push(node);
        } else {
            result.push(node);
        }
    }
    return result;
}

// ============ decl 值处理 ============
function transformDeclValue(value, ctx, prop) {
    let v = value;
    // sass unquote("X") → X（字符串去引号函数，css 无此函数）
    v = v.replace(/unquote\(\s*"([^"]*)"\s*\)/g, '$1').replace(/unquote\(\s*'([^']*)'\s*\)/g, '$1');
    // 同名冲突变量 → 组件本地求值写死（evalExprs 导入组件变量文件）
    if (ctx.conflictVars.size && /\$[A-Za-z_]/.test(v)) {
        const refs = [...v.matchAll(/\$([A-Za-z_][A-Za-z0-9_-]*)/g)].map((m) => m[1])
            .filter((n) => ctx.conflictVars.has(n));
        if (refs.length) {
            const results = evalExprs(ctx.varDefs, refs.map((r) => `$${r}`), ctx.extraImports);
            v = v.replace(/\$([A-Za-z_][A-Za-z0-9_-]*)/g, (m, name) => {
                if (ctx.conflictVars.has(name)) {
                    return results.get(`$${name}`) !== undefined ? results.get(`$${name}`) : m;
                }
                return m;
            });
        }
    }
    // 结构性插值展开（#{$module} 等 → 文本值；含算术的 #{$a * 2} → sassEval 求值）
    v = v.replace(/#\{\$([A-Za-z_][A-Za-z0-9_-]*)([^}]*)\}/g, (m, name, rest) => {
        const sv = ctx.structuralVars.get(name);
        if (rest.trim() === '') {
            return sv !== undefined ? sv : m; // 未定义的保留，走 token 替换
        }
        // 含算术/引用的插值（#{$a * 2}）→ sass 求值写死
        const expr = `$${name}${rest}`;
        const r = evalExprs(ctx.varDefs, [expr], ctx.extraImports).get(expr);
        return r !== undefined ? r : m;
    });
    // 结构性变量裸引用（主文件定义的 $half_corner_width 等值变量）→ 文本替换
    // （这类变量不在 variables.scss，token.css 无对应，直接展开为值）
    if (ctx.structuralVars.size) {
        v = v.replace(/\$([A-Za-z_][A-Za-z0-9_-]*)/g, (m, name) => {
            const sv = ctx.structuralVars.get(name);
            return sv !== undefined ? sv : m;
        });
    }
    // 1. 值上下文变量替换（剩余 $var / #{$var} → token）
    v = replaceVarRefs(v);
    // 1.5 sass 函数（percentage/math.div）→ evalExprs 整体求值写死
    // （token 化后 math.div 等无法用 var 表达，必须编译期求值；sass 一次编译保留精度）
    v = evalSassFunctions(v, ctx);
    // 2. calc 包裹
    if (needsCalc(v, prop)) {
        v = `calc(${v})`;
    }
    return v;
}

// 平衡括号提取函数调用（支持嵌套），返回 [{start, end, fn, args}]
function extractFnCalls(value, fnRe) {
    const calls = [];
    const re = new RegExp(`\\b(${fnRe})\\s*\\(`, 'g');
    let m;
    while ((m = re.exec(value))) {
        let depth = 1;
        let i = m.index + m[0].length;
        let j = i;
        while (j < value.length && depth > 0) {
            if (value[j] === '(') depth++;
            else if (value[j] === ')') depth--;
            j++;
        }
        if (depth === 0) {
            calls.push({ start: m.index, end: j, fn: m[1], args: value.slice(i, j - 1) });
        }
    }
    return calls;
}

// sass 函数求值：最外层整体求值（sass 处理嵌套调用，保留内部精度）
// 只处理 sass 特有函数（percentage/math.div），避免误伤 CSS 同名函数
function evalSassFunctions(value, ctx) {
    const tokenValues = getTokenValues();
    const fnRe = 'percentage|math\\.div';
    let v = value;
    for (let pass = 0; pass < 6; pass++) {
        const calls = extractFnCalls(v, fnRe);
        if (!calls.length) break;
        // 最外层调用：整体 evalExprs（percentage(math.div(1, 24)) → 4.1666666667%）
        const target = calls.find((c) => !calls.some((o) => o.start < c.start && o.end > c.end)) || calls[0];
        const substituted = target.args.replace(/var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g, (mm, name) => {
            const tv = tokenValues.get(name.replace(/-/g, '_'));
            return tv !== undefined ? tv : mm;
        });
        if (/\$|#\{|var\(/.test(substituted)) break;
        const expr = `${target.fn}(${substituted})`;
        const r = evalExprs(ctx.varDefs, [expr], ctx.extraImports).get(expr);
        if (r === undefined) break;
        v = v.slice(0, target.start) + r + v.slice(target.end);
    }
    return v;
}

// ============ 主流程 ============
// 收集结构性变量定义并移除（$module 等），并入 ctx
// 注意：跳过 mixin 定义体内的 decl（局部变量，如 grid 的 $index/$item，不进全局上下文）
function collectStructuralVars(root, ctx) {
    root.walkDecls((decl) => {
        if (!isStructuralDecl(decl)) return;
        // mixin 体内的局部变量不进全局 varDefs（避免未定义依赖污染 evalExprs）
        let p = decl.parent;
        while (p) {
            if (p.type === 'atrule' && p.name === 'mixin') return;
            p = p.parent;
        }
        const name = decl.prop.slice(1);
        const val = decl.value.trim();
        ctx.structuralVars.set(name, val);
        ctx.varDefs += `${decl.prop}: ${val};\n`;
        decl.remove();
    });
    // 简单情况：以 #{$prefix} 开头的纯文本值
    for (const [name, val] of ctx.structuralVars) {
        if (/^#\{\$prefix\}[A-Za-z0-9_-]*$/.test(val)) {
            ctx.structuralVars.set(name, val.replace('#{$prefix}', 'semi'));
        }
    }
    // 复杂插值（引用其他结构性变量的）用 sassEval
    const complex = [...ctx.structuralVars.entries()].filter(([, v]) => v.includes('#{'));
    if (complex.length) {
        const exprs = complex.map(([, v]) => v);
        const results = evalExprs(ctx.varDefs, exprs, ctx.extraImports);
        complex.forEach(([name, v]) => {
            const r = results.get(v);
            if (r !== undefined) ctx.structuralVars.set(name, r);
        });
    }
}

async function processFile(root, ctx) {
    // 1. 结构性变量（含内联文件的，在 inlineImports 中收集）
    collectStructuralVars(root, ctx);
    // 2. mixin 收集
    collectMixinsFromNodes(root.nodes || [], ctx);
    // 3. import 内联（内联文件收集变量/mixin 到同一 ctx，splice 后统一处理）
    await inlineImports(root, ctx);
    // 4+5. @for/@each/@if 与 mixin 交替展开：
    // 先展开循环（@each 局部变量），再展开 mixin（参数替换）；
    // mixin 展开后暴露的 @for（依赖 mixin 参数）由后续轮次处理
    for (let i = 0; i < 15; i++) {
        const before = root.toString().length;
        expandLoops(root, ctx);
        expandIncludes(root, ctx);
        if (root.toString().length === before) break;
    }
    removeMixinDefs(root, ctx);
    // 6. decl 值变换 + atrule params 处理（@media/@keyframes 等值上下文）
    // 删除所有 FROZEN 冻结注释（含内联子文件带来的，如 rtl.scss 的 banner）
    root.walkComments((c) => {
        if (/FROZEN/.test(c.text)) c.remove();
    });
    root.walkAtRules('use', (at) => at.remove()); // @use 是 sass 模块指令，css 无此语法
    root.walkDecls((decl) => {
        if (isStructuralDecl(decl)) { decl.remove(); return; }
        decl.value = transformDeclValue(decl.value, ctx, decl.prop);
    });
    root.walkAtRules((at) => {
        if (at.name === 'media' || at.name === 'supports' || at.name === 'container') {
            if (at.params) {
                // 媒体查询中的变量 → 编译期代入 token 值（Chrome 不支持 @media 里的 var()，
                // 必须静态值；与 sass 产物一致）
                at.params = transformDeclValue(at.params, ctx);
                at.params = at.params.replace(/var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g, (m, name) => {
                    const tv = getTokenValues().get(name.replace(/-/g, '_'));
                    return tv !== undefined ? tv : m;
                });
            }
        }
        if (at.name === 'keyframes' || at.name === '-webkit-keyframes') {
            if (at.params) {
                at.params = expandSelectorInterp(at.params, ctx);
            }
        }
        if (at.name === 'font-face') {
            // 无 params
        }
        if (at.name === 'error') {
            // @error 是 sass 运行时检查，css 中无意义 → 删除
            at.remove();
        }
    });
    // 7. 嵌套处理（顶层规则）
    const topOut = [];
    for (const node of root.nodes || []) {
        if (node.type === 'rule') {
            topOut.push(...processNestedRule(node, null, ctx));
        } else if (node.type === 'atrule' && (node.name === 'media' || node.name === 'supports' || node.name === 'container') && node.nodes) {
            node.nodes = processChildren(node.nodes, null, ctx);
            topOut.push(node);
        } else {
            topOut.push(node);
        }
    }
    root.nodes = topOut;
    // 8. 清理空规则（无 decls 无子规则；sass 产物不输出空容器，真源应保持一致）
    // 循环清理：删除子规则后父规则可能变空；快照收集再删除（walkRules 回调中 remove 会跳过后续节点）
    for (let pass = 0; pass < 5; pass++) {
        const emptyRules = [];
        root.walkRules((r) => {
            if (r.nodes && r.nodes.length === 0) emptyRules.push(r);
        });
        if (!emptyRules.length) break;
        for (const r of emptyRules) {
            if (r.parent) {
                r.remove();
            } else {
                // flattenRule 的 clone 规则 parent 为 null（remove 检查 parent 不删）→ 直接从 root.nodes splice
                const idx = root.nodes.indexOf(r);
                if (idx > -1) root.nodes.splice(idx, 1);
            }
        }
    }
}

/**
 * 转换一个组件 scss → 嵌套 css 真源文本
 * @param {string} component 组件名
 * @param {string} scssFile 文件名（默认 <component>.scss）
 */
async function convertComponent(component, scssFile = null) {
    const filePath = path.join(FOUNDATION, component, scssFile || `${component}.scss`);
    if (!fs.existsSync(filePath)) throw new Error(`文件不存在: ${filePath}`);
    return convertFile(filePath);
}

// 通用转换：任意 scss 文件路径 → 嵌套 css（semi-ui/_base/base.scss 等）
async function convertFile(filePath) {
    const component = path.basename(path.dirname(filePath));
    const ctx = new Ctx(component, filePath);
    loadThemeMixins(ctx);
    const root = scssParser.parse(fs.readFileSync(filePath, 'utf-8'), { from: filePath });
    await processFile(root, ctx);
    return root.toString();
}

module.exports = { convertComponent, convertFile, Ctx };

// CLI: node transformScss.js <component> [scssFile]
if (require.main === module) {
    const [component, scssFile] = process.argv.slice(2);
    convertComponent(component, scssFile || null)
        .then((css) => process.stdout.write(css))
        .catch((e) => { console.error('转换失败:', e.message); process.exit(1); });
}
