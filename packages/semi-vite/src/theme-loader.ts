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
