/**
 * CSS 真源编译共享模块：嵌套 CSS → 平面 CSS。
 * 保留 var(--semi-cssvar-*) 引用，由主题包在运行时提供变量值。
 * 该实现随 @douyinfe/semi-scss-compile 一起发布，不能依赖仓库外的 scripts 目录。
 */
// 使用 require 避免 postcss-nested 的类型声明与仓库内旧版 postcss 类型不兼容。
// eslint-disable-next-line @typescript-eslint/no-var-requires
const postcss: any = require('postcss');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nested: any = require('postcss-nested');

export default function compileCssSource(cssSource: string): string {
    return postcss([nested()]).process(cssSource, { from: undefined }).css;
}
