/**
 * css 真源编译共享模块：嵌套 css → 平面 css
 * 保留 var(--semi-cssvar-*) 引用（token 由主题包运行时提供，不在此代入）
 * 供 semi-foundation / semi-ui 的 gulpfile 使用
 */
const postcss = require('postcss');
const nested = require('postcss-nested');

function compileCssSource(cssSource) {
    const result = postcss([nested()]).process(cssSource, { from: undefined });
    return result.css;
}

module.exports = { compileCssSource };
