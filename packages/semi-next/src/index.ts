// import { NextConfig } from 'next';
import SemiWebpackPlugin, { SemiWebpackPluginOptions } from '@douyinfe/semi-webpack-plugin';

export type SemiNextOptions = SemiWebpackPluginOptions;

export default function(options: SemiNextOptions = {}) {
    return (nextConfig: any = {}) => {
        const actualConfig: any = {
            ...nextConfig,
            webpack(config: any, { isServer, webpack, ...rest }: any) {
                const { omitCss = true, webpackContext, ...restOptions } = options;
                config.plugins.push(new SemiWebpackPlugin({
                    omitCss,
                    ...restOptions,
                    // Ensure SemiWebpackPlugin can access NormalModule under Next.
                    // Keep backward compatible with user-provided webpackContext.
                    webpackContext: {
                        ...webpackContext,
                        NormalModule: webpack.NormalModule
                    },
                }));
                if (isServer) {
                    if (
                        Array.isArray(config.externals) &&
                        typeof config.externals[0] === 'function'
                    ) {
                        const [ origin ] = config.externals;
                        // Because css is referenced in SemiUI and SemiIcons, 
                        // an error will be reported at the ssg or ssr stage because the code will be executed in Node.
                        config.externals = [
                            (context: any) => {
                                return new Promise((resolve) => {
                                    if (
                                        /@douyinfe\/semi-(ui|icons)/.test(context.request)
                                    ) {
                                        resolve(undefined);
                                    } else {
                                        resolve(origin(context));
                                    }
                                });
                            }
                        ];
                    }
                }
                if (typeof nextConfig.webpack === 'function') {
                    return nextConfig.webpack(config, { isServer, webpack, ...rest });
                }
                return config;
            }
        };
        return actualConfig;
    };
}
