/**
 * 规范化器：把平面 css 解析为规范化规则列表（JSON）
 * 归一化：移除注释、空白折叠、值格式统一——消除"已知无害差异"，暴露真实语义差异
 */
const postcss = require('postcss');

/**
 * 值归一化：trim + 空白折叠
 * 注意：不做括号/逗号归一化——var() 之间的空格是语义的一部分，
 * 且两侧（sass / Lightning CSS）输出格式一致，无需额外归一
 */
function normalizeValue(value, prop) {
    let v = (value || '').trim();
    v = v.replace(/\s+/g, ' ');
    // Lightning CSS 把 0px 序列化为 0（长度 0 等价）
    if (v === '0px') return '0';
    // 值末尾逗号（scss 跨行 transition 值解析残留）→ 删除
    v = v.replace(/,\s*$/, '');
    // 数字格式归一：-.1px → -0.1px、.1s → 0.1s
    v = v.replace(/(^|[\s,(])\.(\d)/g, '$10.$2');
    v = v.replace(/(^|[\s,(])-\.(\d)/g, '$1-0.$2');
    // 函数括号内首尾空格（linear-gradient( 90deg, ... ) → linear-gradient(90deg, ...)）
    v = v.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
    // 引号统一：'' 与 "" 等价（content 等），统一双引号
    v = v.replace(/'([^']*)'/g, '"$1"');
    // Lightning CSS 把 transparent 序列化为 #0000（复合值内也要替换）
    v = v.replace(/#0000\b/g, 'transparent');
    // font-family 值的引号（"Inter" 与 Inter、 "PingFang SC" 与 PingFang SC 等价——family-name 可不带引号）
    if (prop === 'font-family' || prop === 'font') {
        v = v.replace(/"/g, '').replace(/'/g, '');
    }
    // Lightning CSS 数字格式归一：.8 → 0.8、.1s → 0.1s、100ms → 0.1s
    v = v.replace(/(^|[\s,(])\.(\d)/g, '$10.$2');
    v = v.replace(/(\d+)ms\b/g, (m, n) => `${parseFloat(n) / 1000}s`);
    // scale(0.8, 0.8) → scale(0.8)（Lightning 省略相同参数，语义等价）
    v = v.replace(/scale\(\s*([^,()]+)\s*,\s*\1\s*\)/g, 'scale($1)');
    // animation 简写值顺序归一：动画名（非时间/函数/关键字的 token）移到末尾
    // （animation 值顺序自由，sass 产物 name 在前，Lightning 可能在后）
    if (prop === 'animation' && !v.includes(',')) {
        const parts = v.split(/\s+/);
        const isNameToken = (p) => !/^(-?\d[\d.]*|[\d.]+[a-z%]+|cubic-bezier\(|ease|linear|step|forwards|backwards|both|none|infinite|normal|reverse|alternate|running|paused)/.test(p);
        const nameIdx = parts.findIndex(isNameToken);
        if (nameIdx > 0 && nameIdx !== parts.length - 1) {
            const name = parts.splice(nameIdx, 1)[0];
            v = [...parts, name].join(' ');
        }
    }
    // Lightning CSS 把 -1px 序列化为 -1 * 1px 或 1px * -1（语义等价）
    v = v.replace(/(-?\d+(?:\.\d+)?) \* (\d+(?:\.\d+)?)(px|em|rem|%|ms|s|deg|vh|vw|fr|ch|ex|pt|pc|cm|mm|in)/g,
        (m, a, b, u) => `${parseFloat(a) * parseFloat(b)}${u}`);
    v = v.replace(/(\d+(?:\.\d+)?)(px|em|rem|%|ms|s|deg|vh|vw|fr|ch|ex|pt|pc|cm|mm|in) \* (-?\d+(?:\.\d+)?)/g,
        (m, a, u, b) => `${parseFloat(a) * parseFloat(b)}${u}`);
    // border 简写值重排（width/style/color 顺序任意，规范等价）：
    // sass 产物可能是 "0 transparent solid"，Lightning 可能是 "0 solid transparent"
    v = normalizeBorder(v);
    // calc 静态求值：纯数字/单位算术 → 求值（token 代入后 calc 与静态值等价）
    v = tryEvalCalc(v);
    // 任意值中函数参数内的算术求值：translateX(18px - 6px) → translateX(12px)、calc(10px / 2) → 5px
    v = v.replace(/\b([a-zA-Z][a-zA-Z0-9]*)\s*\(([^()]*)\)/g, (mm, fn, args) => {
        if (!/[+\-*/]/.test(args)) return mm;
        const parts = args.split(',');
        const evaled = [];
        for (const p of parts) {
            let r = null;
            try {
                r = evalCalcExpr(p.trim().replace(/calc\(/g, '('));
            } catch (e) { /* 求值失败 */ }
            if (r === null) return mm; // 任一参数无法求值 → 保留原样
            evaled.push(r);
        }
        const joined = evaled.join(', ');
        return fn === 'calc' ? joined : `${fn}(${joined})`;
    });
    // 裸括号算术：( -7px + 1px ) → -6px、（20px + 2px）→ 22px
    v = v.replace(/\(\s*(-?[\d.]+[a-z%]*)\s*([+\-*/])\s*(-?[\d.]+[a-z%]*)\s*\)/g, (m, a, op, b) => {
        try {
            const r = evalCalcExpr(`${a} ${op} ${b}`);
            return r !== null ? r : m;
        } catch (e) { return m; }
    });
    return v;
}

// border/border-top 等简写值归一：识别 width/style/color 并按固定顺序输出
function normalizeBorder(value) {
    const style = value.match(/\b(solid|dashed|dotted|double|none|hidden|groove|ridge|inset|outset)\b/);
    if (!style) return value;
    const styleWord = style[1];
    const rest = value.replace(styleWord, '').trim().split(/\s+/).filter(Boolean);
    if (rest.length !== 2) return value;
    // 含数字/单位的为 width
    const widthIdx = rest.findIndex((w) => /\d/.test(w));
    if (widthIdx === -1) return value;
    const width = rest[widthIdx];
    const color = rest[1 - widthIdx];
    return `${width} ${styleWord} ${color}`;
}

/**
 * 尝试静态求值 calc() 表达式（仅支持数字+单位的 + - * / 和括号）
 * 如 calc(20px * (6 - 1) + 8px) → 108px；含 % 或 var() 时无法求值，原样返回
 */
function tryEvalCalc(value) {
    const m = value.match(/^calc\((.*)\)$/);
    if (!m) return value;
    let expr = m[1].replace(/calc\(/g, '(');
    // 函数参数内的算术求值：translateX(18px - 6px) → translateX(12px)、minmax(84px - 7.5px, 84px) → minmax(76.5px, 84px)
    // 全部参数可静态求值才替换；含嵌套函数（calc 等）或混合单位时保留原样
    expr = expr.replace(/\b([a-zA-Z][a-zA-Z0-9]*)\s*\(([^()]*)\)/g, (mm, fn, args) => {
        if (!/[+\-*/]/.test(args)) return mm; // 无算术
        const parts = args.split(',');
        const evaled = [];
        for (const p of parts) {
            let r = null;
            try {
                r = evalCalcExpr(p.trim().replace(/calc\(/g, '('));
            } catch (e) { /* 求值失败 */ }
            if (r === null) return mm; // 任一参数无法求值 → 保留原样
            evaled.push(r);
        }
        return `${fn}(${evaled.join(', ')})`;
    });
    // 剥掉内层 calc 后仍有 var/rgba（未代入或无法求值）→ 原样返回
    if (/var\(|rgba?\(/.test(expr)) {
        // 至少归一冗余嵌套：calc(calc(50% + 4px)) → calc(50% + 4px)
        if (value.includes('calc(calc(')) {
            return `calc(${stripOuterParens(expr)})`;
        }
        return value;
    }
    // 纯函数（translateX(-9px)）→ 剥掉 calc 外层（calc(fn(x)) 与 fn(x) 等价）
    if (/[a-zA-Z]+\s*\(/.test(expr)) {
        return stripOuterParens(expr);
    }
    try {
        const result = evalCalcExpr(expr);
        if (result !== null) return result;
    } catch (e) { /* 无法求值，原样返回 */ }
    // 无算术（纯函数/纯值）→ 剥掉 calc 外层（calc(translateX(12px)) 与 translateX(12px) 等价）
    if (!/[+\-*/]/.test(expr)) {
        return stripOuterParens(expr);
    }
    // 求值失败（如 % 与 px 混合）：剥掉外层多余括号归一
    return `calc(${stripOuterParens(expr)})`;
}

// 剥掉表达式首尾配对的多余括号：(50% + 4px) → 50% + 4px
function stripOuterParens(expr) {
    let e = expr.trim();
    while (e.startsWith('(') && e.endsWith(')')) {
        let depth = 0;
        let closesAt = -1;
        for (let i = 0; i < e.length; i++) {
            if (e[i] === '(') depth++;
            else if (e[i] === ')') {
                depth--;
                if (depth === 0) { closesAt = i; break; }
            }
        }
        if (closesAt !== e.length - 1) break; // 首括号不配到末尾
        e = e.slice(1, -1).trim();
    }
    return e;
}

// 递归下降求值 calc 表达式（数字+单位），返回规范字符串或 null
function evalCalcExpr(expr) {
    // 词法：数字、单位、运算符、括号
    const tokens = expr.match(/(-?\d+(?:\.\d+)?)([a-z%]*)|[+\-*/()]/gi);
    if (!tokens) return null;
    let pos = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
    const expect = (t) => { const x = next(); if (x !== t) throw new Error('syntax'); };

    const parseTerm = () => {
        const tok = peek();
        if (tok === '(') { next(); const v = parseExpr(); expect(')'); return v; }
        if (tok === '-') { next(); const v = parseTerm(); return { num: -v.num, unit: v.unit }; }
        const m2 = /^(-?\d+(?:\.\d+)?)([a-z%]*)$/i.exec(tok || '');
        if (!m2) throw new Error('syntax');
        next();
        return { num: parseFloat(m2[1]), unit: m2[2] };
    };
    const parseMul = () => {
        let v = parseTerm();
        while (peek() === '*' || peek() === '/') {
            const op = next();
            const r = parseTerm();
            if (op === '*') {
                v = { num: v.num * r.num, unit: v.unit || r.unit };
            } else {
                if (r.num === 0) throw new Error('div0');
                v = { num: v.num / r.num, unit: v.unit };
            }
        }
        return v;
    };
    const parseExpr = () => {
        let v = parseMul();
        while (peek() === '+' || peek() === '-') {
            const op = next();
            const r = parseMul();
            if (v.unit !== r.unit) throw new Error('unit');
            v = { num: op === '+' ? v.num + r.num : v.num - r.num, unit: v.unit };
        }
        return v;
    };
    try {
        const v = parseExpr();
        if (pos !== tokens.length) return null;
        // 规范化数字（去尾零）
        const numStr = String(parseFloat(v.num.toFixed(6)));
        return numStr === '0' ? '0' : `${numStr}${v.unit}`;
    } catch (e) {
        return null;
    }
}

/**
 * 递归展开选择器中的所有 :is()（消除编译器优化产生的表达差异）
 * :is(.a, .b) .c → .a .c, .b .c（:is 特异性 = 最高参数特异性，展开等价）
 */
function expandIsDeep(selector) {
    let s = selector;
    for (let pass = 0; pass < 10; pass++) {
        const m = s.match(/:is\(([^()]*)\)/);
        if (!m) break;
        const innerParts = m[1].split(',').map((p) => p.trim());
        const before = s.slice(0, m.index);
        const after = s.slice(m.index + m[0].length);
        s = innerParts.map((p) => `${before}${p}${after}`).join('__OR__');
    }
    return s.split('__OR__').map((x) => x.trim()).join(', ');
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

// 选择器归一化：空白、括号空格、属性选择器引号、伪元素单冒号（:before 与 ::before 等价）
function normalizeSelector(selector) {
    const s = selector
        .replace(/\s+/g, ' ')
        // 括号内空格归一（:has( > x) 与 :has(> x) 等价，编译器输出有差异）
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')')
        .trim();
    // 属性选择器值引号归一（[a=b] 与 [a="b"] 等价）
    let noQuotes = s.replace(/\[([^\]]*?)="([^"]*)"\]/g, (m, inner, val) => {
        if (/[^a-zA-Z0-9_-]/.test(val)) return m;
        return `[${inner}=${val}]`;
    });
    noQuotes = noQuotes.replace(/\[([^\]]*?)='([^']*)'\]/g, (m, inner, val) => {
        if (/[^a-zA-Z0-9_-]/.test(val)) return m;
        return `[${inner}=${val}]`;
    });
    // 伪元素单冒号 → 双冒号（:before/:after/:first-line/:first-letter/:selection/:placeholder）
    // 前面不是冒号（避免重复处理 ::before）
    const pseudoEls = noQuotes.replace(/(?<!:):(before|after|first-line|first-letter|selection|placeholder)(?![a-z-])/g, '::$1');
    const expanded = expandIsDeep(pseudoEls);
    // 组合器空格归一（> x 与 >x 等价；排除 ~= 属性选择器）
    const normCombinators = expanded.replace(/\s*>\s*/g, ' > ').replace(/\s*\+\s*/g, ' + ').replace(/\s*~\s*(?!=)/g, ' ~ ');
    // 选择器列表排序（同规则内列表顺序与层叠语义无关；括号内逗号不拆）
    const parts = splitSelectors(normCombinators);
    parts.sort();
    return parts.join(', ');
}

/**
 * 归一化一份 css 文本 → 规则列表
 * 返回数组，元素结构：
 *  { kind: 'rule'|'atrule'|'keyframe'|'comment',
 *    selector?: string, decls?: [{prop, value}],
 *    params?: string, nodes?: [...] }
 */
function normalizeCss(cssText) {
    const root = postcss.parse(cssText);
    const walk = (nodes, out) => {
        for (const node of nodes) {
            if (node.type === 'comment') continue;
            if (node.type === 'rule') {
                const item = {
                    kind: 'rule',
                    selector: normalizeSelector(node.selector),
                    decls: [],
                };
                node.walkDecls((d) => {
                    item.decls.push({ prop: d.prop.toLowerCase(), value: normalizeValue(d.value, d.prop) });
                });
                // 嵌套 at-rule（@media 里的规则已由 postcss 展开为 rule，无嵌套）
                out.push(item);
            } else if (node.type === 'atrule') {
                if (node.name === 'media' || node.name === 'supports' || node.name === 'layer' || node.name === 'container') {
                    const item = {
                        kind: 'atrule',
                        name: node.name,
                        params: normalizeValue(node.params),
                        nodes: [],
                    };
                    walk(node.nodes || [], item.nodes);
                    out.push(item);
                } else if (node.name === 'keyframes' || node.name === '-webkit-keyframes') {
                    const item = {
                        kind: 'keyframes',
                        name: node.name,
                        params: normalizeValue(node.params),
                        frames: [],
                    };
                    for (const frame of node.nodes || []) {
                        if (frame.type === 'rule') {
                            const f = {
                                selector: frame.selector.replace(/\s+/g, ' ').trim(),
                                decls: [],
                            };
                            frame.walkDecls((d) => {
                                f.decls.push({ prop: d.prop.toLowerCase(), value: normalizeValue(d.value, d.prop) });
                            });
                            item.frames.push(f);
                        }
                    }
                    out.push(item);
                } else if (node.name === 'import' || node.name === 'charset' || node.name === 'namespace') {
                    out.push({ kind: 'atrule', name: node.name, params: normalizeValue(node.params), nodes: [] });
                } else {
                    // 未知 at-rule（font-face 等），保留 decls
                    const item = {
                        kind: 'atrule',
                        name: node.name,
                        params: normalizeValue(node.params),
                        decls: [],
                    };
                    node.walkDecls((d) => {
                        item.decls.push({ prop: d.prop.toLowerCase(), value: normalizeValue(d.value, d.prop) });
                    });
                    out.push(item);
                }
            }
        }
    };
    const rules = [];
    walk(root.nodes || [], rules);
    // 简写展开（padding/margin 2 值 → 长写）+ vendor 前缀删除 + animation 归一 + 相邻等价规则合并
    for (const r of rules) {
        if (r.kind === 'rule') r.decls = normalizeAnimation(expandShorthand(dropVendorPrefixes(r.decls)));
        if (r.kind === 'atrule' && r.nodes) {
            for (const n of r.nodes) if (n.kind === 'rule') n.decls = normalizeAnimation(expandShorthand(dropVendorPrefixes(n.decls)));
        }
    }
    // 删除空规则（postcss-nested 会留下无 decls 的容器规则，sass 不输出）
    const dropEmpty = (list) => list.filter((item) => {
        if (item.kind === 'rule') return item.decls.length > 0;
        if (item.kind === 'atrule' && item.nodes) {
            item.nodes = dropEmpty(item.nodes);
            return item.nodes.length > 0;
        }
        return true;
    });
    return mergeAdjacentRules(dropEmpty(rules));
}

/**
 * 颜色值归一化：transparent / #0000 / rgba(0, 0, 0, 0) 等价
 * （Lightning CSS 会把 transparent 归一为 #0000）
 */
function normalizeColor(value) {
    if (value === 'transparent' || value === '#0000' || value === 'rgba(0, 0, 0, 0)' || value === 'rgba(0,0,0,0)') {
        return 'transparent';
    }
    return value;
}

/**
 * animation 简写归一：提取 fill-mode（forwards/backwards/both）为独立 animation-fill-mode 声明
 * （Lightning CSS 会把 animation-fill-mode 合并进 animation 简写，sass 产物分开）
 */
function normalizeAnimation(decls) {
    const fillModes = new Set(['forwards', 'backwards', 'both']);
    const out = [];
    for (const d of decls) {
        if (d.prop === 'animation') {
            const parts = d.value.split(/\s+/);
            const fillIdx = parts.findIndex((p) => fillModes.has(p));
            if (fillIdx !== -1) {
                const fill = parts[fillIdx];
                parts.splice(fillIdx, 1);
                out.push({ prop: 'animation', value: parts.join(' ').trim() });
                // 已有 animation-fill-mode 时跳过（后者覆盖）
                if (!decls.some((x) => x.prop === 'animation-fill-mode')) {
                    out.push({ prop: 'animation-fill-mode', value: fill });
                }
                continue;
            }
        }
        out.push(d);
    }
    return out;
}

/**
 * 删除 vendor 前缀属性（-webkit-/-moz-/-ms-/-o-/-khtml-）
 * Lightning CSS 会合并/删除前缀属性（user-select 等），两侧对称处理后语义等价
 */
function dropVendorPrefixes(decls) {
    return decls.filter((d) => !/^-(webkit|moz|ms|o|khtml)-/.test(d.prop));
}

/**
 * 展开简写属性（Lightning CSS 会把 padding/margin/top-right-bottom-left 合并为简写）
 * padding/margin 的 2/3/4 值简写 → 4 个长写；inset 4 值 → top/right/bottom/left
 */
function expandShorthand(decls) {
    const out = [];
    for (const d of decls) {
        const parts = d.value.split(/\s+/);
        const isSimple = !d.value.includes('var(') && !d.value.includes('calc(');
        if (isSimple && (d.prop === 'padding' || d.prop === 'margin') && parts.length >= 1 && parts.length <= 4) {
            const [a, b, c, dd] = parts;
            const map = {
                padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
                margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
            };
            const vals = parts.length === 1 ? [a, a, a, a] : parts.length === 2 ? [a, b, a, b] : parts.length === 3 ? [a, b, c, b] : [a, b, c, dd];
            map[d.prop].forEach((p, i) => out.push({ prop: p, value: vals[i] }));
        } else if (isSimple && d.prop === 'overflow' && parts.length === 2) {
            out.push({ prop: 'overflow-x', value: parts[0] });
            out.push({ prop: 'overflow-y', value: parts[1] });
        } else if (isSimple && d.prop === 'inset' && parts.length === 4) {
            [['top', parts[0]], ['right', parts[1]], ['bottom', parts[2]], ['left', parts[3]]]
                .forEach(([p, v]) => out.push({ prop: p, value: v }));
        } else {
            out.push(d);
        }
    }
    return out;
}

/**
 * 合并相邻等价规则：
 * 1. 相同选择器的相邻规则合并 decls（Lightning 合并，sass 不合并）
 * 2. decls 完全相同的相邻规则合并选择器列表（Lightning 优化，sass 拆开）
 * 两者都是层叠语义保持的
 */
function mergeAdjacentRules(list) {
    const out = [];
    for (const item of list) {
        const last = out[out.length - 1];
        if (last && item.kind === 'rule' && last.kind === 'rule') {
            if (last.selector === item.selector) {
                // 相同选择器 → 合并 decls
                last.decls = last.decls.concat(item.decls);
                continue;
            }
            if (last.selector !== item.selector && declListsEqual(last.decls, item.decls)) {
                // 相同 decls → 合并选择器列表（合并后重新排序，括号内逗号不拆）
                last.selector = [...splitSelectors(last.selector), ...splitSelectors(item.selector)]
                    .sort().join(', ');
                continue;
            }
        }
        out.push(item);
    }
    return out;
}

function declListsEqual(a, b) {
    if (a.length !== b.length) return false;
    const ma = new Map(a.map((d) => [d.prop, d.value]));
    const mb = new Map(b.map((d) => [d.prop, d.value]));
    if (ma.size !== mb.size) return false;
    for (const [p, v] of ma) if (mb.get(p) !== v) return false;
    return true;
}

module.exports = { normalizeCss, normalizeValue, normalizeColor };
