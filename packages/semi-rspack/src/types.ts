export interface SemiWebpackPluginOptions {
    theme?: SemiThemeOptions | SemiThemeOptions['name'];
    prefixCls?: string;
    variables?: Record<string, string | number>;
    include?: string;
    omitCss?: boolean
}

export interface SemiThemeOptions {
    name?: string
}
