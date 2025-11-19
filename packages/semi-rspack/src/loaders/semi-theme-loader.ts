import { LoaderContext } from 'webpack';
import resolve from 'enhanced-resolve';
import componentVariablePathList from '../componentName';
import fs from 'fs';
import { CustomSelector } from '../types';

export interface SemiThemeLoaderOptions {
    prefixCls: string;
    variables: string;
    include: string;
    name?: string;
    cssLayer?: boolean;
    selector?: CustomSelector
}

export default function SemiThemeLoader(this: LoaderContext<SemiThemeLoaderOptions>, source: string) {
    const query = this.getOptions();
    const theme = query.name || '@douyinfe/semi-theme-default';
    const cssLayer = query.cssLayer ?? false as boolean;
    // always inject
    const scssVarStr = `@import "~${theme}/scss/index.scss";\n`;
    // inject once
    let cssVarStr = `@import "~${theme}/scss/global.scss";\n`;
    let animationStr = `@import "~${theme}/scss/animation.scss";\n`;

    try {
        require.resolve(`${theme}/scss/animation.scss`);
    } catch (e) {
        animationStr = ''; // fallback to empty string
    }

    const shouldInject = source.includes('semi-base');

    if (shouldInject && query.selector) {
        const scssStr = getScssStr(query.selector, theme);
        scssStr.animationStr && (animationStr = scssStr.animationStr);
        scssStr.cssVarStr && (cssVarStr = scssStr.cssVarStr);
    }

    let fileStr = source;

    let componentVariables: string | boolean;
    try {
        componentVariables = resolve.sync(this.context, `${theme}/scss/local.scss`);
    } catch (e) {}

    if (query.include || query.variables || componentVariables) {
        let localImport = '';
        if (componentVariables) {
            localImport += `\n@import "~${theme}/scss/local.scss";`;
        }
        if (query.include) {
            localImport += `\n@import "${query.include}";`;
        }
        if (query.variables) {
            localImport += `\n${query.variables}`;
        }
        try {
            const regex = /(@import '.\/variables.scss';?|@import ".\/variables.scss";?)/g;
            const fileSplit = source.split(regex).filter(item => Boolean(item));
            if (fileSplit.length > 1) {
                fileSplit.splice(fileSplit.length - 1, 0, localImport);
                fileStr = fileSplit.join('');
            }
        } catch (error) {}
    }

    // inject prefix
    const prefixCls = query.prefixCls || 'semi';

    const prefixClsStr = `$prefix: '${prefixCls}';\n`;
    let finalCSS: string = "";
    if (shouldInject) {

        const customStr = (() => {
            let customStr = '';
            try {
                if (!resolve.sync(this.context, `${theme}/scss/custom.scss`)) {
                    return '';
                }
                const collectAllVariablesPath: string[] = [
                    ...componentVariablePathList,
                ];
                if (componentVariables) {
                    collectAllVariablesPath.push(`${theme}/scss/local.scss`);
                }
                collectAllVariablesPath.push(`${theme}/scss/custom.scss`);
                customStr = collectAllVariablesPath.map(p => {
                    return `@import "~${p}";`;
                }).join('\n') + '\n' + customStr;

            } catch (e) {
                customStr = ''; // fallback to empty string
            }
            return `body:not(:not(body)){${customStr}};`;
        })();

        finalCSS = `${animationStr}${cssVarStr}${scssVarStr}${prefixClsStr}${fileStr}${customStr}`;
    } else {
        finalCSS = `${scssVarStr}${prefixClsStr}${fileStr}`;
    }
    if (cssLayer) {
        finalCSS = `@layer semi{${finalCSS}}`;
    }
    return finalCSS;
}

function replaceSelector(blockStr: string, newSelector: string): string {
    const braceIdx = blockStr.indexOf('{');
    if (braceIdx === -1) return blockStr;
    return newSelector + blockStr.slice(braceIdx);
}

function splitScssBlocks(content: string): [string, string] {
    // 拆分成第一个选择器（light），第二个选择器（dark）
    const firstClose = content.indexOf('}') + 1;
    const light = content.slice(0, firstClose);
    const dark = content.slice(firstClose);
    return [light, dark];
}

function getScssStr(selector: CustomSelector, theme: string) {
    let animationStr, cssVarStr;

    if (selector.animation) {
        const animationScssPath = require.resolve(`${theme}/scss/animation.scss`);
        let animationContent = fs.readFileSync(animationScssPath, 'utf8');
        animationStr = replaceSelector(animationContent, selector.animation);
    }

    if (selector.dark || selector.light) {
        const globalScssPath = require.resolve(`${theme}/scss/global.scss`);
        const paletteScssPath = require.resolve(`${theme}/scss/_palette.scss`);
        let globalScssContent = fs.readFileSync(globalScssPath, 'utf8');
        let paletteScssContent = fs.readFileSync(paletteScssPath, 'utf8');

        // 跳过头部import行
        if (globalScssContent.startsWith('@import')) {
            globalScssContent = globalScssContent.replace(/^@import.*?;/, '').trim();
        }

        const [globalLight, globalDark] = splitScssBlocks(globalScssContent);
        const [paletteLight, paletteDark] = splitScssBlocks(paletteScssContent);

        const realGlobalLight = selector.light ? replaceSelector(globalLight, selector.light) : globalLight;
        const realGlobalDark = selector.dark ? replaceSelector(globalDark, selector.dark) : globalDark;
        const realPaletteLight = selector.light ? replaceSelector(paletteLight, selector.light) : paletteLight;
        const realPaletteDark = selector.dark ? replaceSelector(paletteDark, selector.dark) : paletteDark;

        cssVarStr = [realPaletteLight, realPaletteDark, realGlobalLight, realGlobalDark].join('\n');
    }

    return { animationStr, cssVarStr };
}
