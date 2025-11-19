export interface SemiWebpackPluginOptions {
    theme?: SemiThemeOptions | SemiThemeOptions['name'];
    cssLayer?: boolean;
    prefixCls?: string;
    variables?: Record<string, string | number>;
    include?: string;
    omitCss?: boolean;
    webComponentPath?: boolean | RegExp;
    selector?: CustomSelector
}

export interface SemiThemeOptions {
    name?: string
}

export interface CustomSelector {
    dark?: string;
    light?: string;
    animation?: string
}
