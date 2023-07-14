import loaderUtils from 'loader-utils';
import resolve from 'enhanced-resolve';

export default function SemiThemeLoader(source: string) {
    const query = loaderUtils.getOptions ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query);
    const theme = query.name || '@douyinfe/semi-theme-default';
    // always inject
    const scssVarStr = `@import "~${theme}/scss/index.scss";\n`;
    // inject once
    const cssVarStr = `@import "~${theme}/scss/global.scss";\n`;
    let animationStr = `@import "~${theme}/scss/animation.scss";\n`;

    try {
        resolve.sync(this.context, `${theme}/scss/animation.scss`);
    } catch (e) {
        animationStr = ""; // fallback to empty string
    }


    const shouldInject = source.includes('semi-base');

    let fileStr = source;

    let componentVariables: string | boolean;
    try {
        componentVariables = resolve.sync(this.context, `${theme}/scss/local.scss`);
    } catch (e) {
    }

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
        } catch (error) {
        }
    }

    // inject prefix
    const prefixCls = query.prefixCls || 'semi';

    const prefixClsStr = `$prefix: '${prefixCls}';\n`;

    if (shouldInject) {
        return `${animationStr}${cssVarStr}${scssVarStr}${prefixClsStr}${fileStr}`;
    } else {
        return `${scssVarStr}${prefixClsStr}${fileStr}`;
    }
}

