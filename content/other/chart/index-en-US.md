---
localeCode: en-US
order: 76
category: Other
title: VChart
icon: doc-vchart
dir: column
brief: Out-of-the-box multi-terminal charting library.
---

Semi currently does not have an official charting library. We recommend using [VChart](https://visactor.io/vchart) to implement charting functionality. VChart is the core charting component library of [VisActor](https://visactor.io), an open-source visualization solution by ByteDance. It supports multiple types of charts, is easy to use, and offers powerful features. Utilizing the VChart charting library in a Semi-based project provides the following advantages:

- Out-of-the-box experience: With simple configuration, VChart seamlessly integrates with the Semi design language, automatically adapting to the default Semi theme or a custom theme defined through Semi DSM.
- Responsive: VChart supports monitoring changes between light and dark modes on the page, and automatically applies hot updates to VChart charts on the page.

## Introducing VChart

>VChart GitHub link：[https://github.com/VisActor/VChart](https://github.com/VisActor/VChart) <br /> 
VChart official website link ：[https://visactor.io/vchart](https://visactor.io/vchart)

VChart is not just a ready-to-use multi-platform charting library, but also a vivid and flexible storyteller of data.

VChart is the core charting component library of VisActor, an open-source visualization solution by ByteDance. It is built on top of the visualization grammar library VGrammar and the rendering engine VRender. Along with data presentation, VChart also supports animated storytelling, rich interactivity, and customizable chart styles. Its easy-to-use configuration greatly reduces the learning curve for users.

VChart supports various different chart types, allowing users to visualize abstract data through simple configuration, including combination chart, line chart, area chart, bar/column chart, pie/doughnut chart, scatter plot, heat map, histogram, box plot, waterfall chart, progress bar, funnel chart, time series chart, interval column chart, interval area chart, word cloud, dashboard, treemap, Sankey diagram, rose chart, radar chart, map, Circle Packing, sunburst diagram, etc. For detailed chart examples, please refer to [VChart Examples](https://visactor.io/vchart/example). Below are some showcases of VChart with Semi Design's default theme:

```chart
```

## Installing and Using VChart

### 1.Installation

In a React project, you can use the following command to install `@visactor/react-vchart`:

```bash
# npm
npm i @visactor/react-vchart
# yarn
yarn add @visactor/react-vchart
```

Additionally, you need to install `@visactor/vchart-semi-theme` to enable compatibility with the default Semi theme or user-configured themes

```bash
# npm
npm i @visactor/vchart-semi-theme

# yarn
yarn add @visactor/vchart-semi-theme
```

### 2.Usage

To adapt VCharts to the Semi theme, you only need to execute the initVChartSemiTheme method once globally for initialization. This statement is typically placed in the entry file of your React project. Here's an example:

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

The `initVChartSemiTheme` method supports accepting an object as an option, which is declared as follows:

```typescript
interface IInitVChartSemiThemeOption {
  /** initial theme mode */
  defaultMode?: 'light' | 'dark';
}
```

You don't need to perform any additional steps apart from the initialization statement. You can directly use the VChart chart components. Here's an example of using a pie chart:

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

## VChart Adapting to Semi Theme

VChart supports overall configuration and reuse of chart themes. For more details, please refer to the [VChart Theme Concept and Design Rules](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules). The most important aspect of theme configuration is the color palette. VChart provides two types of color palettes: data palettes and semantic palettes. To adapt to the default Semi Design theme or user-defined themes, VChart utilizes the tokens from the Semi Design theme through @visactor/vchart-semi-theme. These tokens are mapped to the data palette and semantic palette of VChart' themes.

### Data Palette

The data palette is a discrete color palette used in charts to differentiate between data groups, often utilized for distinguishing legend items as well. In the following two charts, the data groups are assigned colors from the color queue in sequential order:

![demo](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-demo.png)

The data palette in VChart can also be dynamic and progressive. In general, the palette is adjusted dynamically based on the range of data items.

![data palette](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-data-color-en.png)

When the number of data groups is less than or equal to 10, a 10-color palette is used. When the number of data groups exceeds 10, a 20-color palette is used. If the number of data groups exceeds 20, the colors from the palette will be repeated starting from the first color.

Semi Design has declared tokens corresponding to the data palette in VChart. Users can customize the VChart data palette by configuring the following tokens in the DSM (Design System Manager) for custom themes. The VChart chart will automatically apply these variables, and users do not need to intervene.

| Tokens for 20-color palette|Tokens for 10-color palette|
|-----|----|
|--semi-color-data-0<br /> --semi-color-data-1<br /> --semi-color-data-2<br /> --semi-color-data-3<br /> --semi-color-data-4<br /> --semi-color-data-5<br /> --semi-color-data-6<br /> --semi-color-data-7<br /> --semi-color-data-8<br /> --semi-color-data-9<br /> --semi-color-data-10<br /> --semi-color-data-11<br /> --semi-color-data-12<br /> --semi-color-data-13<br /> --semi-color-data-14<br /> --semi-color-data-15<br /> --semi-color-data-16<br /> --semi-color-data-17<br />--semi-color-data-18<br /> --semi-color-data-19<br />|--semi-color-data-0<br /> --semi-color-data-2 <br /> --semi-color-data-4<br /> --semi-color-data-6<br /> --semi-color-data-8<br /> --semi-color-data-10<br /> --semi-color-data-12<br /> --semi-color-data-14<br /> --semi-color-data-16<br /> --semi-color-data-18 |

#### Semantic Color Palette

The semantic Color palette primarily defines the common styles for chart components, such as background color, border color, sliders, pop-ups, fonts, and text color. The @visactor/vchart-semi-theme package automatically crawls the token values of similar scenarios in the current Semi theme in the page environment to generate the VChart chart theme. Users who configure themes in the Semi DSM usually do not need to consider additional configurations in this aspect. For more information, please refer to the following two documents:

- [VChart Theme Concept and Design Rules](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules)
- [VChart Theme Extension Package](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Extension)
