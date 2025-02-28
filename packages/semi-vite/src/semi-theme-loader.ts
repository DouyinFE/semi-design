import componentVariablePathList from "./componentName";


export interface SemiThemeLoaderOptions {
    name?: string;
    cssLayer?: boolean;
    variables?: string;
    prefixCls?: string;
    include?: string
}

export function semiThemeLoader(source: string, options: SemiThemeLoaderOptions) {
    const { name = '@douyinfe/semi-theme-default', cssLayer, variables, prefixCls = 'semi', include } = options;

    const theme = name;

    // always inject
    const scssVarStr = `@import "~${theme}/scss/index.scss";\n`;
    // inject once
    const cssVarStr = `@import "~${theme}/scss/global.scss";\n`;

    let animationStr = `@import "~${theme}/scss/animation.scss";\n`;

    try {
        require.resolve(`${theme}/scss/animation.scss`);
    } catch (e) {
        animationStr = ''; // fallback to empty string
    }

    const shouldInject = source.includes('semi-base');

    let componentVariables: string | boolean;

    try {
        componentVariables = require.resolve(`${theme}/scss/local.scss`);
    } catch (e) {
        componentVariables = false;
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
            console.warn(error);
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
