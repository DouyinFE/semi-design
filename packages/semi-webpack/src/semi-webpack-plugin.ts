import path from 'path';
import { transformPath } from './utils';
const _NormalModule_ = require('webpack/lib/NormalModule');

export interface WebpackContext {
    NormalModule?: any;
}
export interface SemiWebpackPluginOptions {
    theme?: string | SemiThemeOptions;
    prefixCls?: string;
    variables?: {[key: string]: string | number};
    include?: string;
    omitCss?: boolean;
    webpackContext?: WebpackContext
}

export interface SemiThemeOptions {
    name?: string;
}

export default class SemiWebpackPlugin {

    options: SemiWebpackPluginOptions;
    constructor(options: SemiWebpackPluginOptions) {
        this.options = options;
    }

    apply(compiler: any) {
        const NormalModule = this.options.webpackContext?.NormalModule || _NormalModule_;
        compiler.hooks.compilation.tap('SemiPlugin', (compilation: any) => {
            if (this.options.theme || this.options.prefixCls || this.options.omitCss) {
                if (NormalModule.getCompilationHooks) {
                    NormalModule.getCompilationHooks(compilation).loader.tap('SemiPlugin', (context: any, module: any) => {
                        if (this.options.omitCss) {
                            this.omitCss(module);
                            return;
                        }
                        this.customTheme(module);
                        if (this.options.prefixCls) {
                            this.customPrefix(module, this.options.prefixCls);
                        }
                    })
                } else {
                    compilation.hooks.normalModuleLoader.tap('SemiPlugin', (context: any, module: any) => {
                        if (this.options.omitCss) {
                            this.omitCss(module);
                            return;
                        }
                        this.customTheme(module);
                        if (this.options.prefixCls) {
                            this.customPrefix(module, this.options.prefixCls);
                        }
                    })
                }
            }
        });
    }

    omitCss(module: any) {
        const compatiblePath = transformPath(module.resource);
        if (/@douyinfe\/semi-(ui|icons)\/lib\/.+\.js$/.test(compatiblePath)) {
            module.loaders = module.loaders || [];
            module.loaders.push({
                loader: path.join(__dirname, 'semi-omit-css-loader')
            });
        }
    }

    customTheme(module: any) {
        const compatiblePath = transformPath(module.resource);
        if (/@douyinfe\/semi-(ui|icons)\/lib\/.+\.js$/.test(compatiblePath)) {
            module.loaders = module.loaders || [];
            module.loaders.push({
                loader: path.join(__dirname, 'semi-source-suffix-loader')
            });
        }
        if (/@douyinfe\/semi-(ui|icons|foundation)\/lib\/.+\.scss$/.test(compatiblePath)) {
            const scssLoader = require.resolve('sass-loader');
            const cssLoader = require.resolve('css-loader');
            const styleLoader = require.resolve('style-loader');
            const semiSemiLoaderOptions = typeof this.options.theme === 'object' ? this.options.theme : {
                name: this.options.theme
            };
            if (!this.hasSemiThemeLoader(module.loaders)) {
                module.loaders = [
                    {
                        loader: styleLoader
                    },
                    {
                        loader: cssLoader
                    }, {
                        loader: scssLoader
                    },
                    {
                        loader: path.join(__dirname, 'semi-theme-loader'),
                        options: {
                            ...semiSemiLoaderOptions,
                            prefixCls: this.options.prefixCls,
                            variables: this.convertMapToString(this.options.variables || {}),
                            include: this.options.include
                        }
                    }];
            }
        }
    }

    customPrefix(module: any, prefix: string) {
        const compatiblePath = transformPath(module.resource);
        if (/@douyinfe\/semi-[^/]+\/.+env\.js$/.test(compatiblePath)) {
            module.loaders = module.loaders || [];
            module.loaders.push({
                loader: path.join(__dirname, 'semi-prefix-loader'),
                options: {
                    replacers: {
                        BASE_CLASS_PREFIX: prefix
                    }
                }
            });
        }
    }

    hasSemiThemeLoader(loaders: any[]) {
        return (loaders || []).some((loader) => /semi-theme-loader/.test(loader.loader));
    }

    convertMapToString(map: {[key: string]: string | number}): string {
        return Object.keys(map).reduce(function (prev, curr) {
            return prev + `${curr}: ${map[curr]};\n`;
        }, '');
    }
}

