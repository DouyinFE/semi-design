import { Compiler } from 'webpack';
import { SOURCE_SUFFIX_LOADER, THEME_LOADER, OMIT_CSS_LOADER, PREFIX_LOADER } from './constants';
import { stringifyVariableRecord } from './utils';

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

export class SemiRspackPlugin {
    opts: SemiWebpackPluginOptions;

    constructor(options?: SemiWebpackPluginOptions) {
        this.opts = options;
    }

    apply(compiler: Compiler) {
        if (this.opts.omitCss) {
            return this.applyOmitCssLoader(compiler);
        }
        this.applySourceSuffixLoader(compiler);
        this.applyThemeLoader(compiler);
        if (this.opts.prefixCls) {
            this.applyPrefixLoader(compiler);
        }
    }

    applySourceSuffixLoader(compiler: Compiler) {
        compiler.options.module.rules.push({
            test: /@douyinfe\/semi-(ui|icons)\/lib\/.+\.js$/,
            use: [{ loader: SOURCE_SUFFIX_LOADER }],
        });
    }

    applyThemeLoader(compiler: Compiler) {
        const themeOptions: SemiThemeOptions = {};
        if (typeof this.opts.theme === 'object') {
            Object.assign(themeOptions, this.opts.theme);
        } else {
            themeOptions.name = this.opts.theme;
        }
        const options = {
            ...themeOptions,
            prefixCls: this.opts.prefixCls,
            variables: stringifyVariableRecord(this.opts.variables),
            include: this.opts.include,
        };
        compiler.options.module.rules.push({
            test: /@douyinfe\/semi-(ui|icons|foundation)\/lib\/.+\.scss$/,
            use: [{ loader: THEME_LOADER, options }],
        });
    }

    applyOmitCssLoader(compiler: Compiler) {
        compiler.options.module.rules.push({
            test: /@douyinfe\/semi-[^/]+\/.+env\.js$/,
            use: [{ loader: OMIT_CSS_LOADER }],
        });
    }

    applyPrefixLoader(compiler: Compiler) {
        const options = {
            replacers: { BASE_CLASS_PREFIX: this.opts.prefixCls },
        };
        compiler.options.module.rules.push({
            test: /@douyinfe\/semi-[^/]+\/.+env\.js$/,
            use: [{ loader: PREFIX_LOADER, options }],
        });
    }
}
