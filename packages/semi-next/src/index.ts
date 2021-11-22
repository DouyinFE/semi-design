import { NextConfig } from 'next';
import SemiWebpackPlugin from '@douyinfe/semi-webpack-plugin';

export interface SemiNextOptions {
    omitCss?: boolean;
}

export default function(options: SemiNextOptions = {}) {
    return (nextConfig: NextConfig = {}) => {
        const actualConfig: NextConfig = {
            ...nextConfig,
            webpack(config, { isServer, webpack }) {
                config.plugins.push(new SemiWebpackPlugin({
                    omitCss: options.omitCss === undefined ? true : options.omitCss,
                    webpackContext: {
                        NormalModule: webpack.NormalModule
                    }
                }));
                if (isServer) {
                    if (
                        Array.isArray(config.externals) &&
                        typeof config.externals[0] === 'function'
                    ) {
                        const [ origin ] = config.externals;
                        config.externals = [
                            (context: any) => {
                                return new Promise((resolve) => {
                                    if (
                                        /@douyinfe\/semi-(ui|icons)/.test(context.request) ||
                                        /lodash-es/.test(context.request)
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
                return config;
            }
        };
        return actualConfig;
    };
}
