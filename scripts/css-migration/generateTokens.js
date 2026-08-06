/**
 * token 生成器：优先读取 CSS 真源生成主题变量；外部主题仍可扫描 variables.scss / animation.scss，生成
 * 1) 导出 scss（html body, .semi-theme, :host { --semi-cssvar-x: #{$x}; }）→ sass 编译 → token.css
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

function getScopeName(argv = process.argv) {
    const scopeIndex = argv.indexOf('--scope');
    if (scopeIndex === -1) return '';
    const scopeName = argv[scopeIndex + 1];
    if (!scopeName || scopeName.startsWith('-')) {
        throw new Error('--scope 需要提供主题名称');
    }
    if (!/^[A-Za-z0-9_-]+$/.test(scopeName)) {
        throw new Error('--scope 主题名称只能包含字母、数字、下划线和连字符');
    }
    return scopeName;
}

const SCOPE_NAME = getScopeName();
const DEFAULT_TOKEN_SELECTOR = 'html body, .semi-theme, :host';
const LEGACY_TOKEN_SELECTOR = 'html body, .semi-theme';
const DEFAULT_LIGHT_SELECTOR = 'html body, body .semi-always-light, .semi-theme, .semi-theme .semi-always-light, :host, :host .semi-always-light';
const DEFAULT_DARK_SELECTOR = 'html body[theme-mode=dark], body.semi-always-dark, body .semi-always-dark, .semi-theme[theme-mode=dark], .semi-theme.semi-always-dark, .semi-theme .semi-always-dark, :host([theme-mode=dark]), :host.semi-always-dark, :host .semi-always-dark';
const DEFAULT_LIGHT_DARK_SELECTOR = 'html body, body[theme-mode=dark] .semi-always-light, .semi-theme, .semi-theme[theme-mode=dark] .semi-always-light, :host, :host .semi-always-light';

function scopeCss(css, scopeName) {
    if (!scopeName) return css;
    const scope = `.semi-theme-${scopeName}`;
    return css
        .split(DEFAULT_LIGHT_SELECTOR).join(`${scope}, ${scope} .semi-always-light`)
        .split(DEFAULT_DARK_SELECTOR).join(`${scope}[theme-mode=dark], ${scope}.semi-always-dark, ${scope} .semi-always-dark`)
        .split(DEFAULT_LIGHT_DARK_SELECTOR).join(`${scope}, ${scope}[theme-mode=dark] .semi-always-light`)
        .split(DEFAULT_TOKEN_SELECTOR).join(scope)
        .split(LEGACY_TOKEN_SELECTOR).join(scope);
}

function cssTokenMap(css) {
    const map = {};
    const re = /--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\s*:/g;
    let m;
    while ((m = re.exec(css))) {
        map[m[1]] = `--semi-cssvar-${m[1]}`;
    }
    return map;
}

// 主题作用域选择器：
// - 默认主题包（不传 --scope）：html body, .semi-theme, :host（全页默认 + 任意容器 + Shadow DOM）
// - 自定义主题包（--scope <name>）：.semi-theme-<name>（单一选择器容器版，体积最小，不污染全页）
// - 自定义主题包 body 兜底版（--scope <name> --global）：单独生成 <name>.global.css（body 单一选择器，
//   仅当 body 上没有其他主题时生效——默认主题 html body 0,0,2 存在时自动失效；按需引入，避免变量双份膨胀）
const SCOPE_SELECTOR = SCOPE_NAME ? `.semi-theme-${SCOPE_NAME}` : DEFAULT_TOKEN_SELECTOR;

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
 * 生成导出 scss：{SCOPE_SELECTOR} { --semi-cssvar-x: #{$x}; }（默认主题含 html body/.semi-theme/:host；自定义主题只挂容器类）
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
    // 生产主题已切换为 CSS 真源；没有 SCSS 时直接读取落库的 token.css。
    // 保留下面的 Sass 分支，以兼容尚未完成 CSS 化的外部主题目录。
    if (!fs.existsSync(path.join(THEME, 'scss', 'index.scss'))) {
        const tokenPath = path.join(THEME, 'css', 'token.css');
        if (!fs.existsSync(tokenPath)) {
            throw new Error(`找不到 token source: ${tokenPath}`);
        }
        const tokenCss = scopeCss(fs.readFileSync(tokenPath, 'utf-8'), SCOPE_NAME);
        return { tokenCss, map: cssTokenMap(tokenCss) };
    }
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
    if (!fs.existsSync(path.join(THEME, 'scss'))) return [];
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

// CLI: node generateTokens.js [outputDir] [--scope name] [--global]
if (require.main === module) {
    const args = process.argv.slice(2);
    let outputDir = '';
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--scope') {
            i++;
        } else if (args[i] !== '--global' && !outputDir) {
            outputDir = args[i];
        }
    }
    if (SCOPE_NAME && !outputDir) {
        throw new Error('--scope 模式需要显式提供 outputDir，避免误覆盖默认主题');
    }
    if (args.includes('--global') && !SCOPE_NAME) {
        throw new Error('--global 必须与 --scope <name> 一起使用');
    }
    outputDir = outputDir || path.join(ROOT, 'packages/semi-theme-default/css');
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
    const scopeName = SCOPE_NAME;
    for (const name of ['global', 'animation']) {
        const scssFile = path.join(themeScss, `${name}.scss`);
        const cssFile = path.join(THEME, 'css', `${name}.css`);
        if (fs.existsSync(cssFile) || fs.existsSync(scssFile)) {
            let css = fs.existsSync(cssFile)
                ? fs.readFileSync(cssFile, 'utf-8')
                : sass.compileString(fs.readFileSync(scssFile, 'utf-8'), { style: 'expanded', charset: false, importers: sassImporter }).css;
            // 自定义主题包模式：body/:host 选择器替换为容器类（避免局部引入污染全局）
            if (process.argv.includes('--scope')) {
                // 自定义主题包容器版：选择器全部替换为 .semi-theme-<name>（单一选择器，不带 body/:host）
                css = css
                    .replace(/html body, body \.semi-always-light, :host, :host \.semi-always-light/g, `.semi-theme-${scopeName}, .semi-theme-${scopeName} .semi-always-light`)
                    .replace(/html body\[theme-mode=dark\], body \.semi-always-dark, :host\(\[theme-mode=dark\]\), :host \.semi-always-dark/g, `.semi-theme-${scopeName}[theme-mode=dark], .semi-theme-${scopeName} .semi-always-dark`)
                    .replace(/html body, body\[theme-mode=dark\] \.semi-always-light, :host, :host \.semi-always-light/g, `.semi-theme-${scopeName}, .semi-theme-${scopeName}[theme-mode=dark] .semi-always-light`)
                    .replace(/html body, .semi-theme, :host/g, `.semi-theme-${scopeName}`);
            }
            // CSS 真源使用的选择器可能包含额外的同元素暗色选择器，统一走当前作用域转换。
            css = scopeCss(css, SCOPE_NAME);
            fs.writeFileSync(path.join(outputDir, `${name}.css`), css);
            // --global：额外生成 body 兜底版（单一选择器 body，默认主题 html body 0,0,2 存在时自动失效）
            if (process.argv.includes('--global')) {
                const bodyCss = css
                    .replace(new RegExp(`\\.semi-theme-${scopeName}, `, 'g'), 'body, ')
                    .replace(new RegExp(`\\.semi-theme-${scopeName}\\[`, 'g'), 'body[')
                    .replace(new RegExp(`\\.semi-theme-${scopeName} `, 'g'), 'body ')
                    .replace(new RegExp(`\\.semi-theme-${scopeName}`, 'g'), 'body');
                fs.writeFileSync(path.join(outputDir, `${name}.global.css`), bodyCss);
            }
        }
    }
    // --global：token 兜底版（body 单一选择器）
    if (process.argv.includes('--global')) {
        const tokenBodyCss = tokenCss.replace(`.semi-theme-${scopeName}`, 'body');
        fs.writeFileSync(path.join(outputDir, 'token.global.css'), tokenBodyCss);
    }
    const conflicts = detectConflicts();
    // 当前 CSS 真源没有可重新求值的 SCSS 定义，保留历史冲突记录，避免运行生成器时把它覆盖成空数组。
    const conflictPath = path.join(__dirname, 'conflictVars.json');
    if (fs.existsSync(path.join(THEME, 'scss')) || !fs.existsSync(conflictPath)) {
        fs.writeFileSync(conflictPath, JSON.stringify(conflicts, null, 0));
    }
    console.log(`token.css 生成: ${outputDir}/token.css (${tokenCss.length} bytes, ${Object.keys(map).length} 个变量)`);
    console.log(`同名冲突变量 ${conflicts.length} 个: ${conflicts.join(', ')}`);
}
