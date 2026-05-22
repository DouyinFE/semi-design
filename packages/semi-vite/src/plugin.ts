import { existsSync, readFileSync } from 'fs';
import { fileURLToPath, URL } from 'url';
import type { Plugin } from 'vite';

import { convertMapToString, createCssImportResolver, normalizePath } from './utils';
import { transformSemiTheme } from './theme-loader';
import type { SemiThemeOptions, SemiVitePluginOptions } from './types';

const SEMI_CSS_RE = /@douyinfe[\\/]+semi-(ui|icons|foundation)(-\d+)?[\\/]+lib[\\/]+.+\.css(\?.*)?$/;
const SEMI_JS_RE = /@douyinfe[\\/]+semi-(ui|icons)(-\d+)?[\\/]+lib[\\/]+.+\.js(\?.*)?$/;
const SEMI_ENV_JS_RE = /@douyinfe[\\/]+semi-[^\\/]+[\\/]+.+env\.js(\?.*)?$/;

const PREFIX_REGEX = /(BASE_CLASS_PREFIX\s*[:=]\s*['"])([^'"]+)(['"])/g;
const CSS_IMPORT_REGEX = /(import\s+['"][^'"]+\.css['"])/g;
const CSS_REQUIRE_REGEX = /(require\(['"][^'"]+\.css['"]\))/g;

/**
 * Create a Vite plugin that customizes Semi Design themes, replaces selector prefix,
 * and optionally omits CSS imports inside Semi packages.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite';
 * import semiTheming from '@douyinfe/semi-vite-plugin';
 *
 * export default defineConfig({
 *     plugins: [
 *         semiTheming({
 *             theme: '@semi-bot/semi-theme-feishu',
 *             prefixCls: 'my-semi',
 *         }),
 *     ],
 * });
 * ```
 */
export function semiTheming(rawOptions: SemiVitePluginOptions = {}): Plugin {
    const { theme, ...options } = rawOptions;
    const themeOptions: SemiThemeOptions =
        typeof theme === 'object' && theme !== null ? { ...theme } : { name: theme as string | undefined };
    const include = options.include ? normalizePath(options.include) : undefined;
    const variables = convertMapToString(options.variables || {});

    return {
        name: 'semi-theme',
        enforce: 'pre',

        config() {
            // In dev mode Vite pre-bundles `@douyinfe/semi-ui` and friends
            // into `.vite/deps` via esbuild *before* this plugin's
            // `transform` hook can rewrite `BASE_CLASS_PREFIX` in `env.js`.
            // To make the prefix replacement work for the pre-bundled
            // output, we register an esbuild plugin that intercepts the
            // raw `base/env.js` files during pre-bundling and inlines the
            // user-defined prefix. The same `transform` hook continues to
            // cover non-bundled paths (build mode, SSR, lazy imports).
            if (!options.prefixCls) {
                return undefined as any;
            }
            const prefixCls = options.prefixCls;
            return {
                optimizeDeps: {
                    esbuildOptions: {
                        plugins: [
                            {
                                name: 'semi-vite-prefix-env',
                                setup(build: any) {
                                    build.onLoad(
                                        { filter: /@douyinfe[/\\]+semi-[^/\\]+[/\\]+lib[/\\]+(es|cjs)[/\\]+(base[/\\]+)?env\.js$/ },
                                        () => ({
                                            contents: `export const BASE_CLASS_PREFIX = ${JSON.stringify(prefixCls)};\n`,
                                            loader: 'js'
                                        })
                                    );
                                }
                            }
                        ]
                    }
                }
            };
        },

        async load(id) {
            const filePath = normalizePath(id.split('?')[0]);
            if (!SEMI_CSS_RE.test(filePath)) {
                return null;
            }

            const scssFilePath = filePath.replace(/\.css$/, '.scss');
            if (!existsSync(scssFilePath)) {
                return null;
            }

            const rawSource = readFileSync(scssFilePath, 'utf-8');
            const transformed = transformSemiTheme(rawSource, scssFilePath, {
                name: themeOptions.name,
                prefixCls: options.prefixCls,
                variables,
                include,
                cssLayer: options.cssLayer,
            });

            const { default: sass } = await import('sass');
            const resolverCache = new Map<string, ReturnType<typeof createCssImportResolver>>();
            const getResolver = (importer: string) => {
                let resolver = resolverCache.get(importer);
                if (!resolver) {
                    resolver = createCssImportResolver(importer);
                    resolverCache.set(importer, resolver);
                }
                return resolver;
            };
            const compileOptions: any = {
                importers: [
                    {
                        findFileUrl(url: string, context?: { containingUrl?: URL }) {
                            const baseFile = context?.containingUrl
                                ? fileURLToPath(context.containingUrl)
                                : scssFilePath;
                            return getResolver(baseFile)(url);
                        },
                    },
                ],
                logger: sass.Logger.silent,
            };
            try {
                compileOptions.silenceDeprecations = ['import', 'legacy-js-api', 'global-builtin'];
                const result = sass.compileString(transformed, compileOptions);
                return result.css;
            } catch (e) {
                delete compileOptions.silenceDeprecations;
                const result = sass.compileString(transformed, compileOptions);
                return result.css;
            }
        },

        transform(code, id) {
            const filePath = normalizePath(id.split('?')[0]);
            let nextCode = code;
            let changed = false;

            if (options.omitCss && SEMI_JS_RE.test(filePath)) {
                const replaced = nextCode.replace(CSS_IMPORT_REGEX, '// $1').replace(CSS_REQUIRE_REGEX, '// $1');
                if (replaced !== nextCode) {
                    nextCode = replaced;
                    changed = true;
                }
            }

            if (options.prefixCls && SEMI_ENV_JS_RE.test(filePath)) {
                const replaced = nextCode.replace(PREFIX_REGEX, `$1${options.prefixCls}$3`);
                if (replaced !== nextCode) {
                    nextCode = replaced;
                    changed = true;
                }
            }

            return changed ? { code: nextCode, map: null } : null;
        },
    };
}

export default semiTheming;
