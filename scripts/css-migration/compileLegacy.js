/**
 * 旧产物基准编译器：复刻 semi-foundation gulpfile compileScss 的编译逻辑
 * 注入 theme index.scss 后编译组件 scss，产出"线上现行"平面 css（旧产物 C）
 */
const path = require('path');
const fs = require('fs');
const sass = require('sass');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');
const THEME = path.join(ROOT, 'packages/semi-theme-default');

// foundation gulpfile 中 compileScss 排除的文件（它们是被 @import 的片段，不独立编译）
const EXCLUDE = [
    'rtl.scss',
    'variables.scss',
    'animation.scss',
    'splitButtonGroup.scss',
    'steps/bacisSteps.scss',
    'steps/fillSteps.scss',
    'steps/navSteps.scss',
    'table/operationPanel.scss',
    'tooltip/arrow.scss',
    'autoComplete/option.scss',
    'select/option.scss',
];

/**
 * 编译一个组件 scss 文件（旧链路）
 * @param {string} component 组件目录名，如 'button'
 * @param {string} scssFile scss 文件名，如 'button.scss'
 */
function compileLegacy(component, scssFile = null) {
    const compDir = path.join(FOUNDATION, component);
    const targetFile = scssFile || `${component}.scss`;
    const scssPath = path.join(compDir, targetFile);
    if (!fs.existsSync(scssPath)) {
        // 无 scss 文件（纯逻辑组件）→ 返回 null 表示跳过
        return null;
    }
    const scssRaw = fs.readFileSync(scssPath, 'utf-8');
    // 与 gulpfile 一致：头部注入 theme index.scss
    const scssVarStr = `@import "${THEME}/scss/index.scss";\n`;
    const fullSrc = `${scssVarStr}\n${scssRaw}`;

    const result = sass.compileString(fullSrc, {
        style: 'expanded',
        charset: false,
        importers: [
            {
                // 相对导入从 scss 所在目录解析（sass 会去掉 ./ 前缀后传入）
                findFileUrl(url) {
                    if (url.startsWith('/') || url.startsWith('file:')) {
                        return new URL(url.startsWith('file:') ? url : `file://${url}`);
                    }
                    const resolved = path.resolve(compDir, url);
                    if (fs.existsSync(resolved)) {
                        return new URL(`file://${resolved}`);
                    }
                    return null;
                },
            },
        ],
    });
    return result.css;
}

module.exports = { compileLegacy, FOUNDATION, THEME, EXCLUDE };

// CLI: node compileLegacy.js <component> [scssFile]
if (require.main === module) {
    const [component, scssFile] = process.argv.slice(2);
    try {
        const css = compileLegacy(component, scssFile);
        if (css === null) {
            console.error(`无 scss 文件（跳过）: ${component}/${scssFile || ''}`);
            process.exit(2);
        }
        process.stdout.write(css);
    } catch (e) {
        console.error(`编译失败 ${component}/${scssFile || ''}:`, e.message);
        process.exit(1);
    }
}
