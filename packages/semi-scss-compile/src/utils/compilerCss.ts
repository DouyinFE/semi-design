/**
 * css 真源编译（新链路，混合模式）：
 * - 主题部分：css 主题（token.css + global.css + animation.css，--semi-cssvar-* / --semi-color-*）
 * - 组件部分：组件有 scss → scss 编译（注入 theme index.scss，输出值版，与旧链路一致）；
 *             组件没有 scss → css 真源（var 引用版，运行时由主题 css 变量解析）
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

// 主 scss 文件名映射（_portal 特殊）
function mainScssFile(comp: string): string {
    return comp === '_portal' ? 'portal.scss' : `${comp}.scss`;
}
function mainCssFile(comp: string): string {
    return comp === '_portal' ? 'portal.css' : `${comp}.css`;
}

/**
 * 收集组件清单（目录 + 主文件 scss/css 路径）
 */
function collectComponents(foundationPath: string): { dir: string; mainScss: string | null; mainCss: string | null; subFiles: string[] }[] {
    const comps: { dir: string; mainScss: string | null; mainCss: string | null; subFiles: string[] }[] = [];
    const entries = fs.readdirSync(foundationPath, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (['node_modules', 'lib', 'keyframes', 'scripts', 'base', '_utils'].includes(entry.name)) continue;
        const dir = path.join(foundationPath, entry.name);
        const scssPath = path.join(dir, mainScssFile(entry.name));
        const cssPath = path.join(dir, mainCssFile(entry.name));
        // 独立子文件（iconButton.scss/textarea.scss 等，有样式且不被主文件 import）
        // 同时收集 .scss 与 .css（css-only 组件的子文件 css 兜底）
        const subFiles: string[] = [];
        const mainImports = fs.existsSync(scssPath) ? fs.readFileSync(scssPath, 'utf-8') : '';
        for (const f of fs.readdirSync(dir)) {
            if (!f.endsWith('.scss') && !f.endsWith('.css')) continue;
            if (/^(variables|animation|rtl|mixin)\.(scss|css)$/.test(f)) continue;
            if (f === mainScssFile(entry.name) || f === mainCssFile(entry.name)) continue;
            if (f.endsWith('.scss') && mainImports.includes(f)) continue; // 被主文件 import（已内联）
            if (f.endsWith('.css') && fs.existsSync(path.join(dir, f.replace(/\.css$/, '.scss')))) continue; // 同名 scss 已覆盖
            subFiles.push(f);
        }
        comps.push({
            dir,
            mainScss: fs.existsSync(scssPath) ? scssPath : null,
            mainCss: fs.existsSync(cssPath) ? cssPath : null,
            subFiles,
        });
    }
    // base 放最前
    const baseDir = path.join(foundationPath, 'base');
    const baseScss = path.join(baseDir, 'base.scss');
    const baseCss = path.join(baseDir, 'base.css');
    const baseComp = {
        dir: baseDir,
        mainScss: fs.existsSync(baseScss) ? baseScss : null,
        mainCss: fs.existsSync(baseCss) ? baseCss : null,
        subFiles: [] as string[],
    };
    const sorted = comps.sort((a, b) => a.dir.localeCompare(b.dir));
    return [baseComp, ...sorted];
}

/**
 * 编译 css 真源（混合模式）
 * 组件样式源选择：有 scss → scss 编译（值版）；没有 scss → css 真源（var 版）
 */
export const compileCss = ({ foundationPath, themePath, iconPath, outputPath, isMin = false }: CompileCssOptions) => {
    const sass = require('sass');
    const themeIndexPath = path.join(themePath, 'scss', 'index.scss');
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
    const compileScssFile = (file: string, injectTheme = false): string => {
        if (!fs.existsSync(file)) return '';
        const src = injectTheme ? `@import "${themeIndexPath}";\n${fs.readFileSync(file, 'utf-8')}` : fs.readFileSync(file, 'utf-8');
        return sass.compileString(src, {
            style: 'expanded',
            charset: false,
            importers: sassImporter,
        }).css;
    };
    const compileScssFileWithImporter = (file: string, baseDir: string): string => {
        // theme index 可能不存在（主题包已 css 化）：存在才注入
        const themeImport = fs.existsSync(themeIndexPath) ? `@import "${themeIndexPath}";\n` : '';
        const src = `${themeImport}${fs.readFileSync(file, 'utf-8')}`;
        return sass.compileString(src, {
            style: 'expanded',
            charset: false,
            importers: [
                {
                    findFileUrl: (url: string) => {
                        if (url.startsWith('/') || url.startsWith('file:')) {
                            return new URL(url.startsWith('file:') ? url : `file://${url}`);
                        }
                        const resolved = path.resolve(baseDir, url);
                        if (fs.existsSync(resolved)) return new URL(`file://${resolved}`);
                        // theme 相对（scss 主题保留时）
                        const themeResolved = path.resolve(path.join(themePath, 'scss'), url);
                        if (fs.existsSync(themeResolved)) return new URL(`file://${themeResolved}`);
                        return null;
                    },
                },
            ],
        }).css;
    };

    // 1. 主题部分：css 主题（token.css + global.css + animation.css，css 产物；scss 保留时回退编译）
    const tokenCss = fs.existsSync(path.join(themePath, 'css', 'token.css'))
        ? fs.readFileSync(path.join(themePath, 'css', 'token.css'), 'utf-8')
        : '';
    const globalCss = fs.existsSync(path.join(themePath, 'css', 'global.css'))
        ? fs.readFileSync(path.join(themePath, 'css', 'global.css'), 'utf-8')
        : compileScssFile(path.join(themePath, 'scss', 'global.scss'));
    const animationCss = fs.existsSync(path.join(themePath, 'css', 'animation.css'))
        ? fs.readFileSync(path.join(themePath, 'css', 'animation.css'), 'utf-8')
        : compileScssFile(path.join(themePath, 'scss', 'animation.scss'));
    const themeBlock = [tokenCss, globalCss, animationCss].filter(Boolean).join('\n');

    // 2. 组件部分：混合（有 scss → scss 编译值版；没有 scss → css 真源 var 版）
    const componentParts: string[] = [];
    const components = collectComponents(foundationPath);
    for (const comp of components) {
        // 主文件
        if (comp.mainScss) {
            // scss 优先：注入 theme index.scss 编译（值版，与旧链路一致）
            componentParts.push(compileScssFileWithImporter(comp.mainScss, comp.dir));
        } else if (comp.mainCss) {
            // 没有 scss → css 真源（var 版，postcss-nested 编译）
            componentParts.push(fs.readFileSync(comp.mainCss, 'utf-8'));
        }
        // 独立子文件
        for (const sub of comp.subFiles) {
            const subScss = sub.endsWith('.scss') ? path.join(comp.dir, sub) : null;
            const subCss = sub.endsWith('.css') ? path.join(comp.dir, sub) : null;
            if (subScss && fs.existsSync(subScss)) {
                componentParts.push(compileScssFileWithImporter(subScss, comp.dir));
            } else if (subCss && fs.existsSync(subCss)) {
                componentParts.push(fs.readFileSync(subCss, 'utf-8'));
            }
        }
    }

    // 3. icons：有 scss → scss 编译；否则 css 真源
    const iconScssPath = path.join(iconPath, 'src', 'styles', 'icons.scss');
    const iconCssPath = path.join(iconPath, 'src', 'styles', 'icons.css');
    if (fs.existsSync(iconScssPath)) {
        componentParts.push(compileScssFileWithImporter(iconScssPath, path.join(iconPath, 'src', 'styles')));
    } else if (fs.existsSync(iconCssPath)) {
        componentParts.push(fs.readFileSync(iconCssPath, 'utf-8'));
    }

    // 4. 合并 + postcss-nested 编译（scss 输出已是平面，css 真源嵌套在此展开）
    const merged = `${themeBlock}\n${componentParts.join('\n')}`;
    const css = compileCssSource(merged);
    const output = isMin ? css.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1') : css;
    fs.outputFileSync(outputPath, output);
    return { outputPath, size: output.length };
};

export default compileCss;
