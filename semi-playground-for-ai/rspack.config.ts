import { defineConfig } from "@rspack/cli";
import { rspack, type SwcLoaderOptions } from "@rspack/core";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

// 外部仓库 packages 目录
const packagesDir = path.resolve(__dirname, "../packages");

export default defineConfig({
	entry: {
		main: "./src/main.tsx"
	},
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"],
		// 从根目录 node_modules 和 playground 的 node_modules 中解析依赖
		modules: [
			path.resolve(__dirname, "node_modules"),
			path.resolve(__dirname, "../node_modules"),
			"node_modules"
		],
		alias: {
			// Semi UI 组件库 - 指向源码
			"@douyinfe/semi-ui": path.resolve(packagesDir, "semi-ui"),
			"@douyinfe/semi-foundation": path.resolve(packagesDir, "semi-foundation"),
			"@douyinfe/semi-icons": path.resolve(packagesDir, "semi-icons/src"),
			"@douyinfe/semi-icons-lab": path.resolve(packagesDir, "semi-icons-lab/src"),
			"@douyinfe/semi-illustrations": path.resolve(packagesDir, "semi-illustrations/src"),
			"@douyinfe/semi-theme-default": path.resolve(packagesDir, "semi-theme-default"),
			
			// Semi 动画相关
			"@douyinfe/semi-animation": path.resolve(packagesDir, "semi-animation"),
			"@douyinfe/semi-animation-react": path.resolve(packagesDir, "semi-animation-react"),
			"@douyinfe/semi-animation-styled": path.resolve(packagesDir, "semi-animation-styled"),
			
			// Semi JSON Viewer
			"@douyinfe/semi-json-viewer-core": path.resolve(packagesDir, "semi-json-viewer-core/src"),
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
			// 其他 JS/TS 文件
			{
				test: /\.(jsx?|tsx?)$/,
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
								// 允许 @import 从 semi-theme-default 获取变量
								includePaths: [
									path.resolve(packagesDir, "semi-theme-default/scss"),
									path.resolve(packagesDir, "semi-foundation"),
								]
							}
						}
					}
				],
				type: "css"
			},
			// CSS 支持
			{
				test: /\.css$/i,
				type: "css"
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		isDev ? new ReactRefreshRspackPlugin() : null
	],
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		]
	},
	experiments: {
		css: true
	}
});
