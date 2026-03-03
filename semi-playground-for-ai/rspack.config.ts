import { defineConfig } from "@rspack/cli";
import { rspack, type SwcLoaderOptions } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import path from "path";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

// 外部仓库 packages 目录
const packagesDir = path.resolve(__dirname, "../packages");

// 需要从源码编译的 packages
const sourcePackages = [
	path.join(packagesDir, 'semi-ui'),
	path.join(packagesDir, 'semi-foundation'),
	path.join(packagesDir, 'semi-icons/src'),
	path.join(packagesDir, 'semi-icons-lab/src'),
	path.join(packagesDir, 'semi-illustrations/src'),
	path.join(packagesDir, 'semi-animation'),
	path.join(packagesDir, 'semi-animation-react'),
	path.join(packagesDir, 'semi-animation-styled'),
	path.join(packagesDir, 'semi-json-viewer-core/src'),
];

// 使用函数形式的 defineConfig，通过 argv.mode 可靠判断构建模式
export default defineConfig((env, argv) => {
	const isDev = argv.mode === "development";
	
	return {
	mode: isDev ? "development" : "production",
	devtool: isDev ? "cheap-module-source-map" : "source-map",
	experiments: {
		css: true,
	},
	entry: {
		main: "./src/main.tsx"
	},
	output: {
		filename: isDev ? "[name].js" : "[name].[contenthash:8].js",
		path: path.join(__dirname, "dist"),
		publicPath: "",
		clean: true,
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
		alias: {
			// 精确匹配（$）指向入口文件，避免读取 package.json 的 main/module 字段
			"@douyinfe/semi-ui$": path.join(packagesDir, "semi-ui/index.ts"),
			"@douyinfe/semi-foundation$": path.join(packagesDir, "semi-foundation/index.ts"),
			"@douyinfe/semi-icons$": path.join(packagesDir, "semi-icons/src/index.ts"),
			"@douyinfe/semi-icons-lab$": path.join(packagesDir, "semi-icons-lab/src/index.tsx"),
			"@douyinfe/semi-illustrations$": path.join(packagesDir, "semi-illustrations/src/index.ts"),
			"@douyinfe/semi-animation$": path.join(packagesDir, "semi-animation/index.ts"),
			"@douyinfe/semi-animation-react$": path.join(packagesDir, "semi-animation-react/index.ts"),
			"@douyinfe/semi-animation-styled$": path.join(packagesDir, "semi-animation-styled/index.ts"),
			"@douyinfe/semi-json-viewer-core$": path.join(packagesDir, "semi-json-viewer-core/src/index.ts"),
			"@douyinfe/semi-theme-default$": path.join(packagesDir, "semi-theme-default/scss/index.scss"),
			// 前缀匹配用于深层导入
			"@douyinfe/semi-ui": path.join(packagesDir, "semi-ui"),
			"@douyinfe/semi-foundation": path.join(packagesDir, "semi-foundation"),
			"@douyinfe/semi-icons": path.join(packagesDir, "semi-icons/src"),
			"@douyinfe/semi-icons-lab": path.join(packagesDir, "semi-icons-lab/src"),
			"@douyinfe/semi-illustrations": path.join(packagesDir, "semi-illustrations/src"),
			"@douyinfe/semi-animation": path.join(packagesDir, "semi-animation"),
			"@douyinfe/semi-animation-react": path.join(packagesDir, "semi-animation-react"),
			"@douyinfe/semi-animation-styled": path.join(packagesDir, "semi-animation-styled"),
			"@douyinfe/semi-json-viewer-core": path.join(packagesDir, "semi-json-viewer-core/src"),
			"@douyinfe/semi-theme-default": path.join(packagesDir, "semi-theme-default"),
			"react/jsx-runtime": path.join(require.resolve("react"), "..", "jsx-runtime.js"),
			// 确保 react-dom 从 playground 的 node_modules 解析
			"react-dom": path.dirname(require.resolve("react-dom/package.json")),
			"react": path.dirname(require.resolve("react/package.json")),
		}
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			// semi-ui 源码：先用 react19-loader 切换代码，再用 swc 编译
			{
				test: /\.(jsx?|tsx?)$/,
				include: [path.resolve(packagesDir, "semi-ui")],
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: { targets }
						} satisfies SwcLoaderOptions
					},
					// loader 从下往上执行，所以 react19-loader 先执行
					path.resolve(__dirname, "loaders/semi-react19-loader.js")
				]
			},
			// 其他源码包的 JS/TS 文件
			{
				test: /\.(jsx?|tsx?)$/,
				include: [
					path.join(__dirname, "src"),
					...sourcePackages.filter(p => p !== path.join(packagesDir, 'semi-ui')),
				],
				exclude: [path.resolve(packagesDir, "semi-ui")],
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: { targets }
						} satisfies SwcLoaderOptions
					}
				]
			},
			// JavaScript from node_modules
			{
				test: /\.m?js$/,
				resolve: {
					fullySpecified: false,
				},
			},
			// SCSS/SASS 支持
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass"),
							// 模拟 semi-ui 编译时的行为：
							// 1. 所有 SCSS 注入 index.scss（SCSS 变量）+ animation.scss
							// 2. _base/base.scss 额外注入 global.scss（CSS 变量）
							additionalData: (content: string, loaderContext: { resourcePath: string }) => {
								const themeDir = path.resolve(packagesDir, "semi-theme-default/scss").replace(/\\/g, '/');
								const scssVarStr = `@import "${themeDir}/index.scss";\n`;
								const animationStr = `@import "${themeDir}/animation.scss";\n`;
								const cssVarStr = `@import "${themeDir}/global.scss";\n`;
								
								// 只在 _base/base.scss 中注入 CSS 变量（跟 npm 包行为一致）
								if (/_base[\\/]base\.scss/.test(loaderContext.resourcePath)) {
									return scssVarStr + animationStr + cssVarStr + content;
								}
								return scssVarStr + animationStr + content;
							},
							sassOptions: {
								silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
								// 允许 @import 从 semi-theme-default 获取变量
								includePaths: [
									path.resolve(packagesDir, "semi-theme-default/scss"),
									path.resolve(packagesDir, "semi-foundation"),
								]
							}
						}
					}
				],
				type: "css/auto"
			},
			// CSS 支持
			{
				test: /\.css$/i,
				type: "css/auto"
			},
			// Images
			{
				test: /\.(png|jpe?g|gif|webp)$/i,
				type: "asset/resource",
			},
		]
	},
	optimization: {
		minimize: !isDev,
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		],
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				react: {
					test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
					name: "lib-react",
					priority: 20,
				},
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					priority: 10,
				},
			},
		},
	},
	performance: {
		maxEntrypointSize: 10485760,
		maxAssetSize: 10485760,
		hints: isDev ? false : "warning",
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.html",
			inject: true,
		}),
		isDev && new ReactRefreshPlugin(),
	].filter(Boolean),
	devServer: {
		port: 3000,
		hot: true,
		open: false,
		historyApiFallback: true,
		static: {
			directory: path.join(__dirname, "public"),
		},
	},
};
});
