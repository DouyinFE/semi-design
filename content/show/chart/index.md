---
localeCode: zh-CN
order: 86
category: 展示类
title:  Semi DV 数据可视化
icon: doc-vchart
dir: column
brief: Semi DV 是 Semi 设计系统中的数据可视化解决方案
---

[Semi DV](/dsm_vchart) 是基于字节跳动开源可视化解决方案 [VChart](https://visactor.io/vchart) 的底层能力，所封装的一套符合 Semi Design 风格的数据可视化解决方案。

VChart 基于可视化语法库 VGrammar 和渲染引擎 VRender 进行封装，在满足数据呈现的同时，还支持面向叙事场景的动画编排、丰富的交互能力和定制化的图表风格。Semi DV 在此基础上支持图表主题配置，帮助用户在保障页面 UI 整体性的同时，灵活实现个性化视觉表达。

Semi DV 支持简易模式和高级模式两种配置
- 简易模式：定制主题色，选择色板，以及圆角、间距、粗细风格即可获取轻松获取一套图表主题
- 高级模式：支持从基础 Token（颜色、字体、圆角、间距、线段、动画），元素（标题、坐标轴、图列、交互元素），图表（柱状图、折线图、面积图、饼图、漏斗图）等层级进行配置，满足用户精细化配置需求


### 创建图表主题
访问[创建设计系统](/dsm/design_system_list?type=vcharts), 点击创建图表设计系统按钮。完成配置后，一键发布即可推送到 npm 中。

![创建](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/chart-create.jpeg)

![简易模式](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/chart-easy.jpeg)

![高级模式](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/chart-advance.jpeg)

关于配置主题的更详细使用文档请参考[创建主题](https://semi.design/dsm_vchart/doc/zh-CN/theme/customized-theme-tutorial#dsm_创建主题)


### 接入主题

安装 VChart

```shell
# 使用 npm 安装
npm install @visactor/react-vchart
# 使用 yarn 安装
yarn add @visactor/react-vchart
```

主题包由设计师在 Semi DV 上配置完主题后发布，请向设计师询问主题包名称，假设主题包名为`@ies/semi-vchart-theme-test`，安装命令为

```shell
npm install @ies/semi-vchart-theme-test
# 或
yarn add @ies/semi-vchart-theme-test
```

引入主题

```js
// vchart 亮色
import vchartLight from "@ies/semi-vchart-theme-test/light.json";
// vchart 暗色
import vchartDark from "@ies/semi-vchart-theme-test/dark.json";
```

注册主题
```js
import VChart from '@visactor/vchart';

VChart.ThemeManager.registerTheme("myLightTheme", vchartLight);
// apply a theme
VChart.ThemeManager.setCurrentTheme('myLightTheme');
```


### 在 Figma 中使用图表主题

安装 [Figma 插件](/zh-CN/start/design-source) ，可选择主题，并在设计稿上绘制带有主题的图表
