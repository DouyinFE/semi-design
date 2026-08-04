/**
 * css 主题 loader（新链路）：组件 css 真源 → 注入主题 css 变量 + prefixCls 文本替换
 * 对应 scss 版 semi-theme-loader：
 * - scss 版注入 theme index.scss（编译期变量）→ css 版注入 token.css/global.css/animation.css（运行时变量）
 * - scss 版注入 $prefix → css 版文本替换 .semi- 类名
 */
import loaderUtils from 'loader-utils';

export default function SemiCssThemeLoader(source: string) {
    const query = loaderUtils.getOptions ? loaderUtils.getOptions(this) : loaderUtils.parseQuery(this.query);
    const theme = query.name || '@douyinfe/semi-theme-default';
    const prefixCls = query.prefixCls || 'semi';
    const cssLayer = query.cssLayer ?? false;

    // 1. 注入主题 css 变量（token + global + animation，--semi-cssvar-* / --semi-color-* 等）
    const inject = [
        `@import "~${theme}/css/token.css";`,
        `@import "~${theme}/css/global.css";`,
        `@import "~${theme}/css/animation.css";`,
    ];
    // 自定义主题覆盖（local.css 等价物：用户直接覆盖 css 变量）
    if (typeof query.include === 'string') {
        inject.push(`@import "${query.include}";`);
    }
    if (typeof query.variables === 'string') {
        inject.push(query.variables);
    }
    const cssLayerStr = cssLayer ? `@layer ${typeof cssLayer === 'string' ? cssLayer : 'semi'} {` : '';
    const cssLayerEnd = cssLayer ? '}' : '';
    // prefixCls 文本替换：只作用于组件源码（注入的 import 行不受影响）
    let result = source;
    if (prefixCls && prefixCls !== 'semi') {
        // 类名：.semi-xxx（含 .semi-always-light/dark、.semi-rtl、.semi-portal-rtl）
        result = result.replace(/\.semi-/g, `.${prefixCls}-`);
        // 动画名：semi-xxx-zoomIn 等（非 . 开头、非 -- 开头的 semi- 前缀）
        result = result.replace(/(?<![\w.-])semi-/g, `${prefixCls}-`);
    }
    // 注入主题 css 变量
    return `${inject.join('\n')}\n${cssLayerStr}\n${result}\n${cssLayerEnd}`;
}
