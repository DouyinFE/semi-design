/**
 * token 生成器：扫描全部 variables.scss / animation.scss，生成
 * 1) 导出 scss（body, .semi-theme { --semi-cssvar-x: #{$x}; }）→ sass 编译 → token.css
 * 2) 变量映射表（$x → --semi-cssvar-x）JSON，供改写工具使用
 *
 * 命名规则：$<name> → --semi-cssvar-<name>（变量名原样保留，下划线/连字符不转换）
 */
const path = require('path');
const fs = require('fs');
const sass = require('sass');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');
const THEME = path.join(ROOT, 'packages/semi-theme-default');

// 主题作用域选择器：
// - 默认主题包（不传 scopeName）：body, .semi-theme（零配置全页生效 + 任意 .semi-theme 容器）
// - 自定义主题包（--scope <name>）：.semi-theme-<name>（只挂容器类，不带 body/:host，业务方局部引入不会污染全页）
const SCOPE_SELECTOR = process.argv.includes('--scope')
    // 自定义主题包：body（0,0,1 兜底版，默认主题 html body 0,0,2 存在时自动失效）+ 容器类（局部生效）
    ? `body, .semi-theme-${process.argv[process.argv.indexOf('--scope') + 1]}`
    // 默认主题包：html body（0,0,2，压过自定义主题的 body 版，保证全页默认不被覆盖）+ .semi-theme 容器
    : 'html body, .semi-theme';

// 组件变量文件的依赖顺序（参考 semi-webpack/src/componentName.ts 的注释：popover 依赖 tooltip 等）
// 为保证变量定义先于引用，按此顺序导入；新组件追加
const COMPONENT_ORDER = [
    'tooltip', 'anchor', 'autoComplete', 'avatar', 'backtop', 'badge', 'banner', 'breadcrumb',
    'button', 'calendar', 'card', 'carousel', 'cascader', 'checkbox', 'collapse', 'collapsible',
    'datePicker', 'descriptions', 'divider', 'dropdown', 'empty', 'form', 'grid', 'highlight',
    'image', 'input', 'inputNumber', 'list', 'modal', 'navigation', 'notification', 'pagination',
    'popconfirm', 'popover', 'progress', 'radio', 'rating', 'scrollList', 'select', 'sideSheet',
    'skeleton', 'slider', 'space', 'spin', 'steps', 'switch', 'table', 'tabs', 'tag', 'tagInput',
    'timePicker', 'timeline', 'toast', 'transfer', 'tree', 'treeSelect', 'typography', 'upload',
    'aiChatDialogue', 'aiChatInput', 'audioPlayer', 'chat', 'colorPicker', 'cropper', 'floatButton',
    'hotKeys', 'jsonViewer', 'markdownRender', 'pincode', 'resizable', 'sidebar', 'userGuide',
    'videoPlayer', 'lottie', 'iconButton',
];

/**
 * 扫描一个目录下的变量定义（$name: ...;），返回变量名列表
 */
function scanVariables(dir) {
    const names = new Set();
    const files = ['variables.scss', 'animation.scss'];
    for (const file of files) {
        const p = path.join(dir, file);
        if (!fs.existsSync(p)) continue;
        const content = fs.readFileSync(p, 'utf-8');
        const re = /^\s*\$([A-Za-z_][A-Za-z0-9_-]*)\s*:/gm;
        let m;
        while ((m = re.exec(content))) {
            names.add(m[1]);
        }
    }
    return [...names];
}

/**
 * 生成导出 scss：{SCOPE_SELECTOR} { --semi-cssvar-x: #{$x}; }（默认主题包 body, .semi-theme；自定义主题包 --scope 只挂容器类）
 */
function buildExportScss() {
    const lines = [];
    lines.push(`@use "sass:meta";`);
    lines.push(`@import "${THEME}/scss/index.scss";`);
    // semi-icons 变量（icons.css 引用）
    const iconsVars = path.join(ROOT, 'packages/semi-icons/src/styles/variables.scss');
    if (fs.existsSync(iconsVars)) {
        lines.push(`@import "${iconsVars}";`);
    }
    // 按依赖顺序导入各组件变量文件
    const importedDirs = new Set();
    for (const comp of COMPONENT_ORDER) {
        const dir = path.join(FOUNDATION, comp);
        if (!fs.existsSync(dir)) continue;
        const hasVars = ['variables.scss', 'animation.scss'].some((f) => fs.existsSync(path.join(dir, f)));
        if (hasVars) {
            for (const f of ['variables.scss', 'animation.scss']) {
                if (fs.existsSync(path.join(dir, f))) {
                    lines.push(`@import "${path.join(dir, f)}";`);
                }
            }
            importedDirs.add(comp);
        }
    }
    // 兜底：扫描目录中所有含变量的组件（防止 COMPONENT_ORDER 遗漏）
    for (const entry of fs.readdirSync(FOUNDATION)) {
        const dir = path.join(FOUNDATION, entry);
        if (!fs.statSync(dir).isDirectory()) continue;
        if (importedDirs.has(entry)) continue;
        if (['node_modules', 'lib', 'keyframes', 'scripts', 'base', '_portal', '_utils'].includes(entry)) continue;
        const hasVars = ['variables.scss', 'animation.scss'].some((f) => fs.existsSync(path.join(dir, f)));
        if (hasVars) {
            for (const f of ['variables.scss', 'animation.scss']) {
                if (fs.existsSync(path.join(dir, f))) {
                    lines.push(`@import "${path.join(dir, f)}";`);
                }
            }
        }
    }
    // 变量声明
    lines.push('');
    lines.push(SCOPE_SELECTOR + ' {');
    const allVars = [];
    for (const comp of fs.readdirSync(FOUNDATION)) {
        const dir = path.join(FOUNDATION, comp);
        if (!fs.statSync(dir).isDirectory()) continue;
        if (['node_modules', 'lib', 'keyframes', 'scripts', 'base', '_portal', '_utils'].includes(comp)) continue;
        allVars.push(...scanVariables(dir).map((v) => ({ v, comp })));
    }
    // semi-icons 变量（semi-icons/src/styles/variables.scss，icons.css 引用）
    const iconsVarsPath = path.join(ROOT, 'packages/semi-icons/src/styles/variables.scss');
    if (fs.existsSync(iconsVarsPath)) {
        const re = /^\s*\$([A-Za-z_][A-Za-z0-9_-]*)\s*:/gm;
        const content = fs.readFileSync(iconsVarsPath, 'utf-8');
        let m;
        while ((m = re.exec(content))) {
            allVars.push({ v: m[1], comp: '__icons__' });
        }
    }
    // theme 变量（index.scss 已导入）
    const themeVars = scanVariables(THEME + '/scss').map((v) => ({ v, comp: '__theme__' }));
    const merged = new Map();
    for (const { v, comp } of [...themeVars, ...allVars]) {
        if (!merged.has(v)) merged.set(v, comp);
    }
    for (const [v, comp] of merged) {
        // 用 meta.inspect 保留字符串引号（#{} 插值会去引号，inspect 保留）
        // font-family 等变量值必须保留引号（与 sass 变量引用语义一致）
        lines.push(`    --semi-cssvar-${v}: #{meta.inspect($${v})};`);
    }
    lines.push('}');
    return lines.join('\n');
}

/**
 * 生成 token.css + 映射表
 * @returns {{ tokenCss: string, map: Object<string, string> }}
 */
function generateTokens() {
    const exportScss = buildExportScss();
    const result = sass.compileString(exportScss, {
        style: 'expanded',
        charset: false,
        importers: [
            {
                findFileUrl(url) {
                    if (url.startsWith('/') || url.startsWith('file:')) {
                        return new URL(url.startsWith('file:') ? url : `file://${url}`);
                    }
                    const resolved = path.resolve(FOUNDATION, url);
                    if (fs.existsSync(resolved)) return new URL(`file://${resolved}`);
                    return null;
                },
            },
        ],
    });
    // 映射表：$name → --semi-cssvar-name
    const map = {};
    const re = /--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)/g;
    let m;
    while ((m = re.exec(result.css))) {
        map[m[1]] = `--semi-cssvar-${m[1]}`;
    }
    return { tokenCss: result.css, map };
}

/**
 * 检测同名变量冲突：多个文件定义同名变量且值不同 → 不能全局 token 化
 * （如 tooltip $height-tooltip_arrow: 7px vs popover $height-tooltip_arrow: 8px）
 * 返回冲突变量名数组
 */
function detectConflicts() {
    const defs = new Map(); // name -> [{file, comp}]
    for (const comp of fs.readdirSync(FOUNDATION)) {
        const dir = path.join(FOUNDATION, comp);
        if (!fs.statSync(dir).isDirectory()) continue;
        if (['node_modules', 'lib', 'keyframes', 'scripts', 'base', '_portal', '_utils'].includes(comp)) continue;
        for (const f of ['variables.scss', 'animation.scss']) {
            const p = path.join(dir, f);
            if (!fs.existsSync(p)) continue;
            const content = fs.readFileSync(p, 'utf-8');
            const re = /^\s*\$([A-Za-z_][A-Za-z0-9_-]*)\s*:/gm;
            let m;
            while ((m = re.exec(content))) {
                if (!defs.has(m[1])) defs.set(m[1], []);
                defs.get(m[1]).push({ file: p, comp });
            }
        }
    }
    const conflicts = [];
    for (const [name, defsList] of defs) {
        if (defsList.length < 2) continue;
        // 逐定义求值（导入 theme + 对应组件目录的全部变量文件）
        const values = new Set();
        for (const d of defsList) {
            const compDir = path.join(FOUNDATION, d.comp);
            const imports = [];
            for (const f of ['variables.scss', 'animation.scss']) {
                const fp = path.join(compDir, f);
                if (fs.existsSync(fp)) imports.push(`@import "${fp}";`);
            }
            const src = `@import "${THEME}/scss/index.scss";\n${imports.join('\n')}\nbody { --__v: #{$${name}}; }`;
            const result = sass.compileString(src, {
                style: 'expanded',
                charset: false,
                importers: [
                    {
                        findFileUrl(url) {
                            if (url.startsWith('/') || url.startsWith('file:')) {
                                return new URL(url.startsWith('file:') ? url : `file://${url}`);
                            }
                            const resolved = path.resolve(compDir, url);
                            if (fs.existsSync(resolved)) return new URL(`file://${resolved}`);
                            return null;
                        },
                    },
                ],
            }).css;
            const vm = result.match(/--__v:\s*([^;]+);/);
            if (vm) values.add(vm[1].trim());
        }
        if (values.size > 1) conflicts.push(name);
    }
    return conflicts;
}

module.exports = { generateTokens, buildExportScss, scanVariables, COMPONENT_ORDER, detectConflicts };

// CLI: node generateTokens.js [outputDir]
if (require.main === module) {
    const outputDir = process.argv[2] || path.join(ROOT, 'packages/semi-theme-default/css');
    const { tokenCss, map } = generateTokens();
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'token.css'), tokenCss);
    fs.writeFileSync(path.join(__dirname, 'varMap.json'), JSON.stringify(map, null, 0));
    // 纯 css 版 global/animation（css-loader 无法处理 scss；--semi-color-* 等运行时变量）
    const sass = require('sass');
    const themeScss = path.join(THEME, 'scss');
    const sassImporter = [{
        findFileUrl(url) {
            if (url.startsWith('/') || url.startsWith('file:')) return new URL(url.startsWith('file:') ? url : `file://${url}`);
            const resolved = path.resolve(themeScss, url);
            if (fs.existsSync(resolved)) return new URL(`file://${resolved}`);
            return null;
        },
    }];
    const scopeName = process.argv.includes('--scope') ? process.argv[process.argv.indexOf('--scope') + 1] : '';
    for (const name of ['global', 'animation']) {
        const scssFile = path.join(themeScss, `${name}.scss`);
        if (fs.existsSync(scssFile)) {
            let css = sass.compileString(fs.readFileSync(scssFile, 'utf-8'), { style: 'expanded', charset: false, importers: sassImporter }).css;
            // 自定义主题包模式：body/:host 选择器替换为容器类（避免局部引入污染全局）
            if (process.argv.includes('--scope')) {
                // 自定义主题包：body 保留（0,0,1 兜底，默认主题 html body 存在时自动失效），
                // :host 去除，容器变体挂 .semi-theme-<name>
                css = css
                    .replace(/html body, body \.semi-always-light, :host, :host \.semi-always-light/g, `body, body .semi-always-light, .semi-theme-${scopeName}, .semi-theme-${scopeName} .semi-always-light`)
                    .replace(/html body\[theme-mode=dark\], body \.semi-always-dark, :host\(\[theme-mode=dark\]\), :host \.semi-always-dark/g, `body[theme-mode=dark], body .semi-always-dark, .semi-theme-${scopeName}[theme-mode=dark], .semi-theme-${scopeName} .semi-always-dark`)
                    .replace(/html body, body\[theme-mode=dark\] \.semi-always-light, :host, :host \.semi-always-light/g, `body, body[theme-mode=dark] .semi-always-light, .semi-theme-${scopeName}, .semi-theme-${scopeName}[theme-mode=dark] .semi-always-light`)
                    .replace(/html body, .semi-theme, :host/g, `body, .semi-theme-${scopeName}`);
            }
            fs.writeFileSync(path.join(outputDir, `${name}.css`), css);
        }
    }
    const conflicts = detectConflicts();
    fs.writeFileSync(path.join(__dirname, 'conflictVars.json'), JSON.stringify(conflicts, null, 0));
    console.log(`token.css 生成: ${outputDir}/token.css (${tokenCss.length} bytes, ${Object.keys(map).length} 个变量)`);
    console.log(`同名冲突变量 ${conflicts.length} 个: ${conflicts.join(', ')}`);
}
