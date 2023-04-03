import { RuleSetRule } from 'webpack';
import { SOURCE_SUFFIX_LOADER, THEME_LOADER, OMIT_CSS_LOADER, PREFIX_LOADER } from './constants';
import { SemiWebpackPluginOptions, SemiThemeOptions } from './types';
import { stringifyVariableRecord } from './utils';

export function createSourceSuffixLoaderRule(_opts?: SemiWebpackPluginOptions) {
    return {
        test: /@douyinfe\/semi-(ui|icons)\/lib\/.+\.js$/,
        use: [{ loader: SOURCE_SUFFIX_LOADER }],
    };
}

export function createThemeLoaderRule(opts?: SemiWebpackPluginOptions) {
    const themeOptions: SemiThemeOptions = {};
    if (typeof opts.theme === 'object') {
        Object.assign(themeOptions, opts.theme);
    } else {
        themeOptions.name = opts.theme;
    }
    const options = {
        ...themeOptions,
        prefixCls: opts.prefixCls,
        variables: stringifyVariableRecord(opts.variables),
        include: opts.include,
    };
    return {
        test: /@douyinfe\/semi-(ui|icons|foundation)\/lib\/.+\.scss$/,
        use: [{ loader: THEME_LOADER, options }],
    };
}

export function createOmitCssLoaderRule(_opts?: SemiWebpackPluginOptions) {
    return {
        test: /@douyinfe\/semi-[^/]+\/.+env\.js$/,
        use: [{ loader: OMIT_CSS_LOADER }],
    };
}

export function createPrefixLoaderRule(opts?: SemiWebpackPluginOptions) {
    const options = {
        replacers: { BASE_CLASS_PREFIX: opts.prefixCls },
    };
    return {
        test: /@douyinfe\/semi-[^/]+\/.+env\.js$/,
        use: [{ loader: PREFIX_LOADER, options }],
    };
}

export function applySemiRules(opts?: SemiWebpackPluginOptions) {
    const rules: RuleSetRule[] = [];
    if (this.opts.omitCss) {
        rules.push(createOmitCssLoaderRule(opts));
        return rules;
    }
    rules.push(createSourceSuffixLoaderRule(opts));
    rules.push(createThemeLoaderRule(opts));
    if (this.opts.prefixCls) {
        rules.push(createPrefixLoaderRule(opts));
    }
    return rules;
}
