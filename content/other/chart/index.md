---
localeCode: zh-CN
order: 76
category: 其他
title:  VCharts 图表
icon: doc-vchart
dir: column
brief: 开箱即用的多端图表库。
---

## 什么是 VCharts

[VChart](https://visactor.io/vchart) 不只是开箱即用的多端图表库，更是生动灵活的数据故事讲述者。

[VChart](https://visactor.io/vchart) 是字节跳动开源可视化解决方案 [VisActor](https://visactor.io) 的核心图表组件库。它基于可视化语法库 [VGrammar](https://visactor.io/vgrammar) 和渲染引擎 [VRender](https://visactor.io/vrender) 进行封装，在满足数据呈现的同时，还支持面向叙事场景的动画编排、丰富的交互能力和定制化的图表风格，简单易用的配置大大降低了用户的学习成本。

<!-- 这里插入若干 live demo，默认应用 @visactor/vchart-semi-theme 包 -->
```chart
```

VChart GitHub 链接：[https://github.com/VisActor/VChart](https://github.com/VisActor/VChart)

VChart 官网链接：[https://visactor.io/vchart](https://visactor.io/vchart)

## 安装和使用 VChart

在 React 工程中，可以使用以下命令安装 react-vchart：

```bash
# 使用 npm 安装
npm install @visactor/react-vchart
# 使用 yarn 安装
yarn add @visactor/react-vchart
```

绘制图表以及更详细的指引详见[教程](https://visactor.io/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react)。

## 适用于 Semi Design 的图表主题包

为了使 VChart 在 Semi 页面环境中获得更好的体验，VisActor 额外推出了 `@visactor/vchart-semi-theme` 主题包。这个包有以下特性：

- 开箱即用：经过简单的配置，就可以使 VChart 样式自动融入 Semi 设计语言，也会自动适配用户通过 Semi DSM 自定义的主题包。
- 响应式：`@visactor/vchart-semi-theme` 支持监听页面上的亮暗模式变化以及主题切换，自动对页面上的 VChart 图表的主题进行热更新。

### DEMO

完整 demo 请访问 [codeSandBox 页面](https://vp4y9p.csb.app/)。

### 安装

在 React 工程中，可以使用以下命令安装该主题包：

```bash
# npm
npm install @visactor/vchart-semi-theme

# yarn
yarn add @visactor/vchart-semi-theme
```

主题包的更多信息见 [https://www.npmjs.com/package/@visactor/vchart-semi-theme](https://www.npmjs.com/package/@visactor/vchart-semi-theme)


### 使用

实现默认的功能，只需要在全局执行一次 `initVChartSemiTheme` 方法进行初始化。这个语句通常可以放在 React 项目的入口文件中。如以下示例：

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx';
import { initVChartSemiTheme } from '@visactor/vchart-semi-theme';

// initialization
initVChartSemiTheme();

const dom = document.querySelector('#root');
const root = createRoot(dom);
root.render(<App />);
```

`initVChartSemiTheme` 方法支持传入一个对象作为 option，其类型声明为：

```typescript
interface IInitVChartSemiThemeOption {
  /** 初始亮暗色模式 */
  defaultMode?: 'light' | 'dark';
  /** 是否监听亮暗色模式自动更改图表主题，默认为 true */
  isWatchingMode?: boolean;
  /** 是否监听主题变化自动更改图表主题，默认为 false（适用于 semi 官方主题切换接口：https://semi.design/dsm/install_switcher）*/
  isWatchingThemeSwitch?: boolean;
}
```

例如，如果要开启监听用户侧的主题切换，初始化语句可以改为这样：

```javascript
// initialization
initVChartSemiTheme({
  isWatchingThemeSwitch: true
});
```

### Token 映射

在图表主题的功能上，VChart 支持数据色板和语义色板的自定义配置。`@visactor/vchart-semi-theme` 基于这个特性实现了和 Semi Design 的结合。

#### 数据色板

数据色板是在图表中用于区分数据组的离散色板，也通常用于区分图例项。如以下两个图表中不同数据组的色板，在颜色队列中按顺序取色：

![demo](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-demo.png)

Semi Design 为 VChart 声明了数据色板对应的 token。用户可以在 DSM 自定义主题时配置以下 token，来自定义 VChart 的数据色板。VChart 图表的数据色板会自动应用这些变量，用户则不需要介入。这个功能由 `@visactor/vchart-semi-theme` 主题包实现。

- `--semi-color-data-0`
- `--semi-color-data-1`
- `--semi-color-data-2`
- `--semi-color-data-3`
- `--semi-color-data-4`
- `--semi-color-data-5`
- `--semi-color-data-6`
- `--semi-color-data-7`
- `--semi-color-data-8`
- `--semi-color-data-9`
- `--semi-color-data-10`
- `--semi-color-data-11`
- `--semi-color-data-12`
- `--semi-color-data-13`
- `--semi-color-data-14`
- `--semi-color-data-15`
- `--semi-color-data-16`
- `--semi-color-data-17`
- `--semi-color-data-18`
- `--semi-color-data-19`

这些 token 的对应颜色组成了 VChart 在 Semi 下默认的 20 色色板。

VChart 数据色板也可以是动态的、渐进式的。在一般情况下，色板会根据数据项数量的范围来动态调整：

![数据色板](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vcharts-data-color.png)


如以上规则，数据组不超过 10 个时，采用 10 色的色板；数据组超过 10 个时，采用 20 色的色板。如果数据组超过 20 个，则会重复应用色板颜色，从第 1 个开始。

`@visactor/vchart-semi-theme` 会自动从上文中的 20 色色板抽 10 个颜色形成小数据量下的 10 色色板。当前逻辑是取偶数索引的颜色，也就是说默认的 10 色色板由以下 token 对应的色值组成：

- `--semi-color-data-0`
- `--semi-color-data-2`
- `--semi-color-data-4`
- `--semi-color-data-6`
- `--semi-color-data-8`
- `--semi-color-data-10`
- `--semi-color-data-12`
- `--semi-color-data-14`
- `--semi-color-data-16`
- `--semi-color-data-18`

#### 语义色板

除了上文提到的 token 以外，`@visactor/vchart-semi-theme` 也会自动在页面环境爬取当前 Semi 主题的其他 token 来自动生成 VChart 图表主题。这些 token 主要用于各个图表组件的样式。具体可以参阅以下两篇文档：

- [VChart 主题概念和设计规范](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules)
- [VChart 扩展主题包](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Extension)
