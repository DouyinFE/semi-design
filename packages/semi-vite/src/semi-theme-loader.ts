import componentVariablePathList from "./componentName";
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export interface SemiThemeLoaderOptions {
    name?: string;
    cssLayer?: boolean;
    variables?: string;
    prefixCls?: string;
    include?: string
}

function resolveThemePath(themeName: string, file: string) {
    try {
        // 尝试从不同位置解析
        const possiblePaths = [
            path.resolve(process.cwd(), 'node_modules', themeName, 'scss', file),
            path.resolve(process.cwd(), '..', 'node_modules', themeName, 'scss', file),
            path.resolve(__dirname, '..', 'node_modules', themeName, 'scss', file)
        ];

        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                return possiblePath;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

export function semiThemeLoader(source: string, options: SemiThemeLoaderOptions) {
    const { name = '@douyinfe/semi-theme-default', cssLayer, variables, prefixCls = 'semi', include } = options;

    const theme = name;

    // always inject
    const scssVarStr = `@import "~${theme}/scss/index.scss";\n`;
    // inject once
    const cssVarStr = `@import "~${theme}/scss/global.scss";\n`;

    let animationStr = `@import "~${theme}/scss/animation.scss";\n`;

    const animationPath = resolveThemePath(theme, 'animation.scss');
    if (animationPath) {
        animationStr = `@import "~${theme}/scss/animation.scss";\n`;
    }

    const shouldInject = source.includes('semi-base');

    let componentVariables: string | boolean;
    const componentVariablesPath = resolveThemePath(theme, 'local.scss');
    if (componentVariablesPath) {
        componentVariables = true;
    }

    if (include || variables || componentVariables) {
        let localImport = '';
        if (componentVariables) {
            localImport += `\n@import "~${theme}/scss/local.scss";`;
        }
        if (include) {
            localImport += `\n@import "${include}";`;
        }
        if (variables) {
            localImport += `\n${variables}`;
        }
        try {
            const regex = /(@import '.\/variables.scss';?|@import ".\/variables.scss";?)/g;
            const fileSplit = source.split(regex).filter(item => Boolean(item));
            if (fileSplit.length > 1) {
                fileSplit.splice(fileSplit.length - 1, 0, localImport);
                source = fileSplit.join('');
            }
        } catch (error) {
        }
    }

    const prefixClsStr = `$prefix: '${prefixCls}';\n`;

    let finalCSSStr = '';

    if (shouldInject) {
        const customStr = (() => {
            let customStr = '';
            try {
                require.resolve(`${theme}/scss/custom.scss`);
                const collectAllVariablesPath: string[] = [...componentVariablePathList];
                if (componentVariables) {
                    collectAllVariablesPath.push(`${theme}/scss/local.scss`);
                }
                collectAllVariablesPath.push(`${theme}/scss/custom.scss`);
                customStr =
                    collectAllVariablesPath
                        .map(p => {
                            return `@import "~${p}";`;
                        })
                        .join('\n') +
                    '\n' +
                    customStr;
            } catch (e) {
                customStr = ''; // fallback to empty string
            }
            return `body:not(:not(body)){${customStr}};`;
        })();
        finalCSSStr = `${animationStr}${cssVarStr}${scssVarStr}${prefixClsStr}${source}${customStr}`;
    } else {
        finalCSSStr = `${scssVarStr}${prefixClsStr}${source}`;
    }

    if (cssLayer) {
        finalCSSStr = `@layer semi{${finalCSSStr}}`;
    }

    return finalCSSStr;
}
