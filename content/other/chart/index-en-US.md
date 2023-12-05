---
localeCode: en-US
order: 76
category: Other
title: VCharts
icon: doc-vchart
dir: column
brief: Out-of-the-box multi-terminal charting library.
---

## Introducing VChart

[VChart](https://visactor.io/vchart) is not just a multi-terminal chart library for Out Of The Box, but also a vivid and flexible data storyteller.

[VChart](https://visactor.io/vchart) is the core chart component library of ByteDance's open-source visualization solution [VisActor](https://visactor.io). It is encapsulated based on the visualization syntax library [VGrammar](https://visactor.io/vgrammar) and the rendering engine [VRender](https://visactor.io/vrender). While meeting the needs of data presentation, it also supports animation arrangement for narrative scenes, rich interactive capabilities, and customized chart styles. The simple and easy-to-use configuration greatly reduces the learning cost for users.

<!-- 这里插入若干 live demo，默认应用 @visactor/vchart-semi-theme 包 -->
```chart
```

VChart GitHub Link：[https://github.com/VisActor/VChart](https://github.com/VisActor/VChart)

VChart official website link：[https://visactor.io/vchart](https://visactor.io/vchart)

## Installing and Using VChart

In the React project, you can use the following command to install react-vchart:

```bash
# npm
npm install @visactor/react-vchart
# yarn
yarn add @visactor/react-vchart
```

The method of drawing charts and more detailed guidance can be found in [tutorial](https://visactor.io/vchart/guide/tutorial_docs/Cross-terminal_and_Developer_Ecology/react).

## Chart Theme Package for Semi Design

In order to provide a better experience for VChart in the Semi page environment, VisActor has launched an additional theme package called `@visactor/vchart-semi-theme`. This package has the following features:

- Ready to use out of the box: With simple configuration, VChart styles can be automatically integrated into the Semi design language and also automatically adapted to theme packages customized by users through Semi DSM.
- Responsive: `@visactor/vchart-semi-theme` supports listening for changes of light/dark mode and theme switching on the page, and automatically updates the theme of the charts on the page.

### DEMO

For a complete demo, please visit the [codeSandBox page](https://vp4y9p.csb.app/).

### Installation

In the React project, you can use the following command to install the theme package:

```bash
# npm
npm install @visactor/vchart-semi-theme

# yarn
yarn add @visactor/vchart-semi-theme
```

For more information on theme packages, see [https://www.npmjs.com/package/@visactor/vchart-semi-theme](https://www.npmjs.com/package/@visactor/vchart-semi-theme )

### Usage

To access the default functionality, simply execute the `initVChartSemiTheme` method once globally for initialization. This statement can usually be placed in the entry file of a React project. As an example:

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

The `initVChartSemiTheme` method supports passing in an object as a parameter, whose type declaration is:

```typescript
interface IInitVChartSemiThemeOption {
  /** Initial light/dark mode */
  defaultMode?: 'light' | 'dark';
  /** Whether to listen for the light/dark mode switching and automatically change the chart theme. The default setting is true */
  isWatchingMode?: boolean;
  /** Whether to listen for theme switching and automatically change the chart theme. The default setting is false (applicable to the official theme switching interface of Semi: https://semi.design/dsm/install_switcher) */
  isWatchingThemeSwitch?: boolean;
}
```

For example, if you want to enable listening for theme switching on the user side, the initialization statement can be changed as follows:

```javascript
// initialization
initVChartSemiTheme({
  isWatchingThemeSwitch: true
});
```

### Token Mapping

In terms of functional design of chart themes, VChart supports custom configuration of data palettes and semantic color palettes. Based on this feature, the combination of VChart and Semi Design has been implemented by `@visactor/vchart-semi-theme`.

#### Data Palette

A data palette is a discrete color palette used in charts to distinguish data groups, and is also commonly used to distinguish legend items. The colors of different data groups in the following two charts are selected in order in the color queue of the data palette:

![demo](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-demo.png)

Semi Design declared the corresponding token for the data palette for VChart. Users can configure the following tokens when customizing themes in DSM to customize the data palette for VChart. The data palette of charts will automatically apply these variables, and users do not need to intervene. This feature is implemented by `@visactor/vchart-semi-theme`.

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

The corresponding colors of these tokens form VChart's default 20 color palette in Semi Design.

The VChart data palette can also be dynamic and progressive. In general, the color palette will be dynamically adjusted based on the range of data item quantities:

![数据色板](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vcharts-data-color.png)

According to the above rules, when there are no more than 10 data groups, a 10 color palette should be used; When there are more than 10 data groups, a 20 color palette is used. If there are more than 20 data groups, the palette colors will be applied repeatedly, starting from the first one.

`@visactor/vchart-semi-theme` will automatically draw 10 colors from the 20 color palette mentioned earlier to form a 10 color palette that is compatible with small amounts of data. The current method is to take even indexed colors, which means that the default 10 color palette consists of the color values corresponding to the following tokens:

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

#### Semantic Color Palette

In addition to the tokens mentioned earlier, `@visactor/vchart-semi-theme` will also automatically crawl other tokens of the current Semi theme in the page environment to generate a VChart chart theme. These tokens are mainly used for the styles of various chart components. You can refer to the following two documents for details:

- [VChart Theme Concept and Design Rules](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules)
- [VChart Theme Extension Package](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Extension)
