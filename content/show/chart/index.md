---
localeCode: zh-CN
order: 67
category: 其他
title:  VChart 图表
icon: doc-vchart
dir: column
brief: 开箱即用的多端图表库。
---

对于图表场景，我们推荐使用 [VChart](https://visactor.io/vchart)。VChart 是字节跳动开源可视化解决方案 [VisActor](https://visactor.io) 的核心图表组件库，支持多种图表，简单易用，功能强大。在基于 Semi 的项目中使用 VChart 图表库具有以下优势：

- 开箱即用：经过简单的配置，就可以使 VChart 样式自动融入 Semi 设计语言，自动适配 Semi 默认主题或用户自定义主题。
- 响应式：支持监听页面上的亮暗模式变化，自动对页面上的 VChart 图表进行热更新。

## 什么是 VChart

VChart 不只是开箱即用的多端图表库，更是生动灵活的数据故事讲述者。

VChart 基于可视化语法库 [VGrammar](https://visactor.io/vgrammar) 和渲染引擎 [VRender](https://visactor.io/vrender) 进行封装，在满足数据呈现的同时，还支持面向叙事场景的动画编排、丰富的交互能力和定制化的图表风格，简单易用的配置大大降低了用户的学习成本。

VChart 支持多种不同的图表类型，包括<strong>组合图、折线图、面积图、柱状图/条形图、饼/环图、散点图、色块图、直方图、箱形图、瀑布图、进度条、漏斗图、时序图、区间柱图、区间面积图、词云、仪表盘、矩形树图、桑基图、玫瑰图、雷达图、地图、Circle Packing、旭日图</strong>等，图表示例详情见 [VChart 图表示例](https://visactor.io/vchart/example)。以下是基于 Semi Design 默认主题的 VChart 部分图表能力展示：

```chart zh
```

## 安装和使用 VChart

### 1、安装

在 React 工程中，可以使用以下命令安装 `@visactor/react-vchart`：

```bash
# npm
npm i @visactor/react-vchart

# yarn
yarn add @visactor/react-vchart
```

此外，还需安装 `@visactor/vchart-semi-theme` 来适配 Semi 默认主题或用户自定义主题。

```bash
# npm
npm i @visactor/vchart-semi-theme

# yarn
yarn add @visactor/vchart-semi-theme
```

### 2、使用

实现 VChart 对 Semi 主题/用户自定义主题的适配，只需要在全局执行一次 `initVChartSemiTheme` 方法进行初始化。该语句通常可以放在 React 项目的入口文件中。如：

```javascript
//index.jsx
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
}
```

除去初始化语句外，无需其他操作，直接使用 VChart 图表组件即可。以下是一个饼图的使用代码示例：

```javascript
// app.jsx
import React from "react";
import { VChart } from "@visactor/react-vchart";

const chart = {
  spec: {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'oxygen', value: '46.60' },
          { type: 'silicon', value: '27.72' },
          { type: 'aluminum', value: '8.13' },
          { type: 'iron', value: '5' },
          { type: 'calcium', value: '3.63' },
          { type: 'sodium', value: '2.83' },
          { type: 'potassium', value: '2.59' },
          { type: 'others', value: '3.5' }
        ]
      }
    ],
    valueField: 'value',
    categoryField: 'type',
    title: {
      visible: true,
      text: 'Statistics of Surface Element Content'
    },
    legends: {
      visible: true,
      orient: 'left',
      title: {
        visible: true,
        text: 'Elements'
      }
    },
    label: {
      visible: true
    }
  }
}

const App = () => {
  return (
    <VChart
        spec={{
            height: 400,
            ...chart.spec,
        }}
        option={{
            mode: "desktop-browser",
        }}
    />
  )
}
```

>主题包的更多信息见 [@visactor/vchart-semi-theme](https://www.npmjs.com/package/@visactor/vchart-semi-theme) <br />
绘制图表以及更详细的指引详见 [VChart 教程文档](https://visactor.io/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react)。


## 配置 VChart 主题

VChart 支持对图表主题的整体配置和复用，详见 [VChart 主题概念和设计规范](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules)。 主题配置中最主要的是色板的配置。VChart 支持的色板分为两大类，数据色板和语义色板。VChart 通过 `@visactor/vchart-semi-theme` 获取 Semi 主题/用户自定义主题中的 token，并映射到 VChart 主题的数据色板和语义色板中，从而实现和 Semi 默认主题/用户自定义主题的适配。基于 Semi 的项目如果想要配置 VCharts 主题，可以通过 [DSM](https://semi.design/dsm/) 设置数据色板和语义色板相应的 token。

### 数据色板

数据色板是在图表中用于区分数据组的离散色板，也通常用于区分图例项。如以下两个图表中不同数据组的色板，在颜色队列中按顺序取色：

![demo](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-demo.png)

VChart 数据色板也可以是动态的、渐进式的。在一般情况下，色板会根据数据项数量的范围来动态调整。数据组不超过 10 个时，采用 10 色的色板；数据组超过 10 个时，采用 20 色的色板。如果数据组超过 20 个，则会从第 1 个色值开始重复应用色板颜色。

![数据色板](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-data-color.png)

Semi Design 为 VChart 声明了数据色板对应的 20 个 token， 详见下表。用户可以在 DSM 自定义主题时配置这些 token，来自定义 VChart 的数据色板。这 20 个 token 值是 20 色的色板，其中的名称为 --semi-color-data-n(n 为 0, 2, 4, 6, 8, 10, 12, 14, 16, 18)的 token 值是 10 色的色板。

<DesignToken componentName='global' reg={/--semi-color-data/} hasTab={false}/>

### 语义色板

语义色板中主要定义了图表组件的公共样式，比如背景色、边框、滑块、弹层、字体、字色等。`@visactor/vchart-semi-theme` 也会自动在页面环境爬取当前 Semi 主题的类似场景的 token 值来自动生成 VChart 图表主题。在 DSM 配置主题的用户，<strong>通常无需额外考虑此部分的配置</strong>。

更多信息可以参阅以下两篇文档：

- [VChart 主题概念和设计规范](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules)
- [VChart 扩展主题包](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Extension)

联系 VChart：
```chartcontact 
```