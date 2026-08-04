/**
 * css 主题 loader（新链路）：组件 css 真源 → 注入主题 css 变量 + prefixCls 文本替换
 */
import { LoaderContext } from 'webpack';

export interface SemiCssThemeLoaderOptions {
    prefixCls?: string;
    variables?: string;
    include?: string;
    name?: string;
    cssLayer?: boolean
}

export default function SemiCssThemeLoader(this: LoaderContext<SemiCssThemeLoaderOptions>, source: string) {
    const query = this.getOptions();
    const theme = query.name || '@douyinfe/semi-theme-default';
    const prefixCls = query.prefixCls || 'semi';
    const cssLayer = query.cssLayer ?? false;

    // 注入主题 css 变量（token + global + animation，--semi-cssvar-* / --semi-color-* 等）
    const inject = [
        `@import "~${theme}/css/token.css";`,
        `@import "~${theme}/css/global.css";`,
        `@import "~${theme}/css/animation.css";`,
    ];
    if (query.include) {
        inject.push(`@import "${query.include}";`);
    }
    if (query.variables) {
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
    return `${inject.join('\n')}\n${cssLayerStr}\n${result}\n${cssLayerEnd}`;
}
