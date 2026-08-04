/**
 * css 真源编译（新链路）：合并组件 css 真源 + token.css + global/animation → semi.css
 * 组件 css 保留 var(--semi-cssvar-*) / var(--semi-color-*) 引用（运行时由本文件头部变量定义解析）
 * postcss/postcss-nested 从 scripts/css-migration 加载（仓库内构建工具，不随 npm 分发）
 */
import path from 'path';
import fs from 'fs-extra';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// __dirname = packages/semi-scss-compile/lib/utils → ../../../../ = 仓库根
const { compileCssSource } = require('../../../../scripts/css-migration/compileCssSource');

export interface CompileCssOptions {
    foundationPath: string;
    themePath: string;
    iconPath: string;
    outputPath: string;
    isMin?: boolean
}

/**
 * 收集组件 css 真源（foundation 各组件目录下的 .css）
 * base.css（全局基础样式）放最前，其余按目录名排序（稳定输出）
 */
function collectComponentCss(foundationPath: string): string[] {
    const files: string[] = [];
    const comps: string[] = [];
    const basePath = path.join(foundationPath, 'base', 'base.css');
    if (fs.existsSync(basePath)) {
        files.push(basePath);
    }
    const entries = fs.readdirSync(foundationPath, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (['node_modules', 'lib', 'keyframes', 'scripts', 'base', '_utils'].includes(entry.name)) continue;
        // 收集目录下所有 css 真源（主文件 + 独立子文件 iconButton.css/textarea.css 等）
        const dirPath = path.join(foundationPath, entry.name);
        const cssFiles = fs.readdirSync(dirPath)
            .filter((f) => f.endsWith('.css'))
            .sort();
        // 主文件（<组件名>.css 或 _portal 的 portal.css）优先，其余按字母序
        const mainCss = entry.name === '_portal' ? 'portal.css' : `${entry.name}.css`;
        const mainIdx = cssFiles.indexOf(mainCss);
        if (mainIdx > -1) {
            cssFiles.splice(mainIdx, 1);
            cssFiles.unshift(mainCss);
        }
        for (const f of cssFiles) {
            comps.push(path.join(dirPath, f));
        }
    }
    comps.sort();
    return files.concat(comps);
}

/**
 * 编译 css 真源（新链路）
 * 产物结构：theme 变量定义（token.css + global + animation）+ 组件样式（postcss-nested 编译）
 */
export const compileCss = ({ foundationPath, themePath, iconPath, outputPath, isMin = false }: CompileCssOptions) => {
    // 1. theme 变量定义：token.css + global.scss + animation.scss（sass 编译处理 // 注释）
    const sass = require('sass');
    const sassImporter = [
        {
            findFileUrl: (url: string) => {
                if (url.startsWith('/') || url.startsWith('file:')) {
                    return new URL(url.startsWith('file:') ? url : `file://${url}`);
                }
                const resolved = path.resolve(path.join(themePath, 'scss'), url);
                if (fs.existsSync(resolved)) return new URL(`file://${resolved}`);
                return null;
            },
        },
    ];
    const compileScssFile = (file: string): string => {
        if (!fs.existsSync(file)) return '';
        return sass.compileString(fs.readFileSync(file, 'utf-8'), {
            style: 'expanded',
            charset: false,
            importers: sassImporter,
        }).css;
    };
    const tokenCss = fs.existsSync(path.join(themePath, 'css', 'token.css'))
        ? fs.readFileSync(path.join(themePath, 'css', 'token.css'), 'utf-8')
        : '';
    const globalCss = compileScssFile(path.join(themePath, 'scss', 'global.scss'));
    const animationCss = compileScssFile(path.join(themePath, 'scss', 'animation.scss'));
    const themeBlock = [tokenCss, globalCss, animationCss].filter(Boolean).join('\n');

    // 2. 组件 css 真源（含 icons）
    const componentFiles = collectComponentCss(foundationPath);
    const iconScssPath = path.join(iconPath, 'src', 'styles', 'icons.scss');
    const iconCssPath = path.join(iconPath, 'src', 'styles', 'icons.css');
    const iconCss = fs.existsSync(iconCssPath)
        ? fs.readFileSync(iconCssPath, 'utf-8')
        : iconScssPath && fs.existsSync(iconScssPath)
            ? compileScssFile(iconScssPath)
            : '';

    const componentBlock = componentFiles
        .map((f) => fs.readFileSync(f, 'utf-8'))
        .concat(iconCss ? [iconCss] : [])
        .join('\n');

    // 3. 合并 + postcss-nested 编译
    const merged = `${themeBlock}\n${componentBlock}`;
    const css = compileCssSource(merged);
    const output = isMin ? css.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1') : css;
    fs.outputFileSync(outputPath, output);
    return { outputPath, size: output.length };
};

export default compileCss;
