/** reference from https://github.com/boenfu/vite-plugin-semi-theme */
import * as FS from 'fs';
import * as Path from 'path';
import { compileString, Logger } from 'sass';
import { pathToFileURL, fileURLToPath } from 'url';
import { transformPath, convertMapToString } from './utils';
import { semiThemeLoader, SemiThemeLoaderOptions } from './semi-theme-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

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
                                if (url.startsWith("~")) {
                                    url = url.substring(1);

                                    // 尝试多种可能的路径
                                    const possiblePaths = [
                                        // 从node_modules直接解析
                                        Path.resolve(process.cwd(), "node_modules", url),
                                        // 从上级目录解析
                                        Path.resolve(process.cwd(), "..", "node_modules", url),
                                        // 从插件目录解析
                                        Path.resolve(__dirname, "..", "node_modules", url)
                                    ];

                                    // 尝试pnpm特有的路径结构
                                    const [packageName, ...rest] = url.split('/');
                                    const packagePath = packageName.startsWith('@') ?
                                        packageName + '/' + rest.shift() :
                                        packageName;
                                    const remainingPath = rest.join('/');

                                    const pnpmDir = Path.resolve(process.cwd(), "node_modules", ".pnpm");
                                    if (FS.existsSync(pnpmDir)) {
                                        try {
                                            const entries = FS.readdirSync(pnpmDir);
                                            const formattedPackageName = packagePath.replace(/\//g, "+");
                                            const matchingEntries = entries.filter(entry => entry.startsWith(formattedPackageName));

                                            for (const entry of matchingEntries) {
                                                const fullPath = Path.resolve(pnpmDir, entry, "node_modules", packagePath, remainingPath);
                                                if (FS.existsSync(fullPath)) {
                                                    possiblePaths.unshift(fullPath); // 优先使用pnpm路径
                                                    break;
                                                }
                                            }
                                        } catch (e) {
                                            // 忽略错误
                                        }
                                    }

                                    // 检查所有可能的路径
                                    for (const possiblePath of possiblePaths) {
                                        if (FS.existsSync(possiblePath)) {
                                            return pathToFileURL(possiblePath);
                                        }
                                    }

                                    // 原始逻辑作为后备
                                    return new URL(
                                        url,
                                        pathToFileURL(scssFilePath.match(/^(\S*\/node_modules\/)/)?.[0] ?? "")
                                    );
                                }

                                // 处理相对路径
                                const filePath2 = Path.resolve(Path.dirname(scssFilePath), url);
                                if (FS.existsSync(filePath2)) {
                                    return pathToFileURL(filePath2);
                                }

                                return null;
                            }
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
