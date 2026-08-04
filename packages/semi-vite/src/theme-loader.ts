import { readFileSync } from 'fs';
import componentVariablePathList from './componentName';
import { tryResolve } from './utils';

export interface SemiThemeLoaderQuery {
    name?: string;
    prefixCls?: string;
    variables?: string;
    include?: string;
    cssLayer?: boolean
}

/**
 * Transform a raw SCSS source (the original `lib/**\/*.scss` of semi-ui/semi-icons/semi-foundation)
 * by injecting theme variables, prefix and (optionally) wrapping with a CSS layer.
 *
 * This is a port of `semi-webpack/src/semi-theme-loader.ts` for sass.compileString environment.
 *
 * @param source        the raw scss source code
 * @param importer      absolute path of the source file, used as the base directory for resolving `~` imports
 * @param query         loader options
 */
export function transformSemiTheme(source: string, importer: string, query: SemiThemeLoaderQuery): string {
    const theme = query.name || '@douyinfe/semi-theme-default';
    const cssLayer = query.cssLayer ?? false;

    const scssVarStr = `@import "~${theme}/scss/index.scss";\n`;
    const cssVarStr = `@import "~${theme}/scss/global.scss";\n`;
    let animationStr = `@import "~${theme}/scss/animation.scss";\n`;

    if (!tryResolve(importer, `${theme}/scss/animation.scss`)) {
        animationStr = '';
    }

    const shouldInject = source.includes('semi-base');

    let fileStr = source;

    const componentVariables = tryResolve(importer, `${theme}/scss/local.scss`);

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
        } catch (e) {
            // ignore
        }
    }

    const prefixCls = query.prefixCls || 'semi';
    const prefixClsStr = `$prefix: '${prefixCls}';\n`;

    let finalCSS = '';
    if (shouldInject) {
        const customStr = (() => {
            const resolvedCustom = tryResolve(importer, `${theme}/scss/custom.scss`);
            if (!resolvedCustom) {
                return '';
            }
            let addBodySelector = true;
            try {
                const customFileContent = readFileSync(resolvedCustom, 'utf-8');
                const regex = /body\s*\{/;
                if (regex.test(customFileContent)) {
                    addBodySelector = false;
                }
            } catch (e) {
                return '';
            }
            const collectAllVariablesPath: string[] = [
                ...componentVariablePathList,
            ];
            if (componentVariables) {
                collectAllVariablesPath.push(`${theme}/scss/local.scss`);
            }
            collectAllVariablesPath.push(`${theme}/scss/custom.scss`);
            const inner = collectAllVariablesPath.map(p => `@import "~${p}";`).join('\n');
            return addBodySelector ? `body:not(:not(body)){${inner}};` : inner;
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

/**
 * css 真源链路：注入主题 css 变量（token/global/animation）+ prefixCls 文本替换
 * 对应 scss 版 transformSemiTheme（css 版：运行时 css 变量而非编译期 scss 变量）
 */
export function transformSemiCssTheme(
    source: string,
    query: {
        name?: string;
        prefixCls?: string;
        variables?: string;
        include?: string;
        cssLayer?: boolean
    }
): string {
    const theme = query.name || '@douyinfe/semi-theme-default';
    const inject = [
        `@import "${theme}/css/token.css";`,
        `@import "${theme}/css/global.css";`,
        `@import "${theme}/css/animation.css";`,
    ];
    if (query.include) {
        inject.push(`@import "${query.include}";`);
    }
    if (query.variables) {
        inject.push(query.variables);
    }
    // prefixCls 文本替换（只作用于组件源码；css 变量名 --semi- 不替换）
    let result = source;
    if (query.prefixCls && query.prefixCls !== 'semi') {
        result = result.replace(/\.semi-/g, `.${query.prefixCls}-`);
        result = result.replace(/(?<![\w.-])semi-/g, `${query.prefixCls}-`);
    }
    const cssLayerStr = query.cssLayer ? `@layer semi{` : '';
    const cssLayerEnd = query.cssLayer ? '}' : '';
    return `${inject.join('\n')}\n${cssLayerStr}${result}${cssLayerEnd}`;
}
