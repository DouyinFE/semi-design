/** reference from https://github.com/boenfu/vite-plugin-semi-theme */
import * as FS from 'fs';
import * as Path from 'path';
import { compileString, Logger } from 'sass';
import { pathToFileURL } from 'url';
import { transformPath, convertMapToString } from './utils';
import { semiThemeLoader, SemiThemeLoaderOptions } from './semi-theme-loader';



export interface SemiVitePluginOptions {
    theme?: string | SemiThemeOptions;
    cssLayer?: boolean;
    prefixCls?: string;
    variables?: { [key: string]: string | number };
    include?: string;
    omitCss?: boolean
}

export interface SemiThemeOptions {
    name?: string;
    cssLayer?: boolean;
    prefixCls?: string;
    variables?: { [key: string]: string | number };
    include?: string
}



export default function semiVitePlugin(options: SemiVitePluginOptions = {}) {
    return {
        name: 'vite-plugin-semi',
        load(id: string) {
            const filePath = transformPath(id);
            if (options.include) {
                options.include = transformPath(options.include);
            }
            if (/@douyinfe\/semi-(ui|icons|foundation)\/lib\/.+\.css$/.test(filePath)) {
                const scssFilePath = filePath.replace(/\.css$/, '.scss');

                const semiLoaderOptions: SemiThemeLoaderOptions = {
                    name: typeof options.theme === 'string' ? options.theme : options.theme?.name,
                    cssLayer: options.cssLayer,
                    variables: convertMapToString(options.variables || {}),
                };

                const originalScssRaw = FS.readFileSync(scssFilePath, 'utf-8');

                const newScssRaw = semiThemeLoader(originalScssRaw, semiLoaderOptions);
                return compileString(newScssRaw, {
                    importers: [
                        {
                            findFileUrl(url) {
                                if (url.startsWith('~')) {
                                    return new URL(
                                        url.substring(1),
                                        pathToFileURL(scssFilePath.match(/^(\S*\/node_modules\/)/)?.[0] ?? '')
                                    );
                                }

                                const filePath = Path.resolve(Path.dirname(scssFilePath), url);

                                if (FS.existsSync(filePath)) {
                                    return pathToFileURL(filePath);
                                }

                                return null;
                            },
                        },
                    ],
                    logger: Logger.silent, // 禁用日志输出
                }).css;
            }
            //TODO: 处理 web-component 的 loader
            return null;
        },
    };
}
