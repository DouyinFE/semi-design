import { RuleSetRule } from 'webpack';
import { SOURCE_SUFFIX_LOADER, THEME_LOADER, CSS_THEME_LOADER, OMIT_CSS_LOADER, PREFIX_LOADER, WEB_COMPONENT_LOADER, EXTRACT_CSS_LOADER } from './constants';
import { SemiWebpackPluginOptions, SemiThemeOptions } from './types';
import { stringifyVariableRecord } from './utils';

export function createSourceSuffixLoaderRule(_opts?: SemiWebpackPluginOptions) {
    return {
        // Support packages like @douyinfe/semi-ui-19, @douyinfe/semi-icons-19
        test: /@douyinfe(\/|\\)+semi-(ui|icons)(-\d+)?(\/|\\)+.+\.js$/,
        use: [{ loader: SOURCE_SUFFIX_LOADER }],
    };
}

export function createThemeLoaderRule(opts?: SemiWebpackPluginOptions) {
    const themeOptions: SemiThemeOptions = {};
    const scssLoader = require.resolve('sass-loader');

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
        cssLayer: opts.cssLayer
    };
    const loaderInfo = {
        // Support packages like @douyinfe/semi-ui-19, @douyinfe/semi-foundation-19
        test: /@douyinfe(\/|\\)+semi-(ui|icons|foundation)(-\d+)?(\/|\\)+lib(\/|\\)+.+\.scss$/,
        use: [{ loader: THEME_LOADER, options }],
    };
    let commonLoader: any[] = [
        { 
            loader: scssLoader,
            options: {
                sassOptions: {
                    silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'],
                },
            }
        }
    ];
    if (opts.webComponentPath) {
        commonLoader = [
            { loader: "raw-loader" },
            { loader: EXTRACT_CSS_LOADER },
            {
                loader: 'css-loader',
                options: { sourceMap: false }
            },
            ...commonLoader,
        ];
    } 
    loaderInfo.use = [
        ...commonLoader,
        ...loaderInfo.use
    ] as any;
    return loaderInfo;
}

export function createCssThemeLoaderRule(opts?: SemiWebpackPluginOptions) {
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
        cssLayer: opts.cssLayer,
    };
    const commonLoader: any[] = [];
    if (opts.webComponentPath) {
        commonLoader.push(
            { loader: 'raw-loader' },
            { loader: EXTRACT_CSS_LOADER },
        );
    }
    return {
        // css 真源链路（新）：lib/*.css 注入主题 css 变量 + prefixCls 文本替换
        test: /@douyinfe(\/|\\)+semi-(ui|icons|foundation)(-\d+)?(\/|\\)+lib(\/|\\)+.+\.css$/,
        use: [
            ...commonLoader,
            { loader: 'css-loader', options: { sourceMap: false } },
            { loader: CSS_THEME_LOADER, options },
        ],
    };
}

export function createOmitCssLoaderRule(_opts?: SemiWebpackPluginOptions) {
    return {
        test: /@douyinfe(\/|\\)+semi-[^/]+(\/|\\)+.+env\.js$/,
        use: [{ loader: OMIT_CSS_LOADER }],
    };
}

export function createPrefixLoaderRule(opts?: SemiWebpackPluginOptions) {
    const options = {
        replacers: { BASE_CLASS_PREFIX: opts.prefixCls },
    };
    return {
        test: /@douyinfe(\/|\\)+semi-[^/]+(\/|\\)+.+env\.js$/,
        use: [{ loader: PREFIX_LOADER, options }],
    };
}

export function createWebComponentLoaderRule(opts?: SemiWebpackPluginOptions) {
    return {
        test: opts.webComponentPath instanceof RegExp ? opts.webComponentPath : /src\/([^/]+\/)*[^/]+\.(ts|tsx|js|jsx)$/,
        type: 'javascript/auto',
        exclude: /node_modules/,
        use: [{ loader: WEB_COMPONENT_LOADER }],
    };
}

export function applySemiRules(opts?: SemiWebpackPluginOptions) {
    const rules: RuleSetRule[] = [];
    if (opts.omitCss) {
        rules.push(createOmitCssLoaderRule(opts));
        if (!opts.webComponentPath) {
            return rules;
        }
    }
    rules.push(createSourceSuffixLoaderRule(opts));
    rules.push(createThemeLoaderRule(opts));
    // css 真源链路（新）：lib/*.css 注入主题变量
    rules.push(createCssThemeLoaderRule(opts));
    if (opts.prefixCls) {
        rules.push(createPrefixLoaderRule(opts));
    }
    if (opts.webComponentPath) {
        rules.push(createWebComponentLoaderRule(opts));
    }
    return rules;
}
