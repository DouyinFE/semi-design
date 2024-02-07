---
localeCode: en-US
order: 67
category: Other
title: VChart
icon: doc-vchart
dir: column
brief: Out-of-the-box multi-terminal charting library.
---

For charting scenarios, we recommend using [VChart](https://visactor.io/vchart). VChart is the core chart component library of [VisActor](https://visactor.io), an open-source visualization solution by ByteDance. It supports various types of charts, is easy to use, and offers powerful functionality. Utilizing the VChart charting library in a project based on Semi framework provides the following advantages:

- Out-of-the-box experience: with simple configuration, VChart seamlessly integrates with the Semi design language, automatically adapting to the default Semi theme or a custom theme.
- Responsive: VChart supports monitoring changes between light and dark modes on the page, and automatically applies hot updates to VChart charts on the page.

## Introducing VChart

VChart is not just a ready-to-use multi-platform charting library, but also a vivid and flexible storyteller of data.

VChart is built on top of the visualization grammar library [VGrammar](https://visactor.io/vgrammar) and the rendering engine [VRender](https://visactor.io/vrender). Along with data presentation, VChart also supports animated storytelling, rich interactivity, and customizable chart styles. Its easy-to-use configuration greatly reduces the learning curve for users.

VChart supports various different chart types, allowing users to visualize abstract data through simple configuration, including <strong>combination chart, line chart, area chart, bar/column chart, pie/doughnut chart, scatter plot, heat map, histogram, box plot, waterfall chart, progress bar, funnel chart, time series chart, interval column chart, interval area chart, word cloud, dashboard, treemap, Sankey diagram, rose chart, radar chart, map, Circle Packing, sunburst diagram</strong>, etc. For detailed chart examples, please refer to [VChart Examples](https://visactor.io/vchart/example). Below are some showcases of VChart with Semi Design's default theme:

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

To adapt VChart to the Semi theme/user-defined themes, you only need to execute the `initVChartSemiTheme` method once globally for initialization. This statement is typically placed in the entry file of your React project. Here's an example:

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

## Configuring VChart Theme

VChart supports overall configuration and reuse of chart themes. For more details, please refer to [VChart Theme Concept and Design Guidelines](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules). The most important aspect of theme configuration is the color palette. VChart supports two types of palettes: data palettes and semantic palettes. VChart retrieves tokens from the Semi theme/user-defined theme through `@visactor/vchart-semi-theme` and maps them to the data and semantic palettes of VChart themes, achieving compatibility with the Semi default theme/user-defined theme. If you want to configure VChart themes in a project based on Semi, you can use [DSM](https://semi.design/dsm/) to set the corresponding tokens for data palettes and semantic palettes.

### Data Palette

The data palette is a discrete color palette used in charts to differentiate between data groups, often utilized for distinguishing legend items as well. In the following two charts, the data groups are assigned colors from the color queue in sequential order:

![demo](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-demo.png)

The data palette in VChart can also be dynamic and progressive. In general, the palette is adjusted dynamically based on the range of data items. When the number of data groups is less than or equal to 10, a 10-color palette is used. When the number of data groups exceeds 10, a 20-color palette is used. If the number of data groups exceeds 20, the colors from the palette will be repeated starting from the first color.

![data palette](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/vchart/vchart-data-color-en.png)

Semi Design has defined 20 tokens corresponding to the data palette for VChart, as shown in the table below. Users can customize the data palette of VChart by configuring these tokens when customizing themes in DSM. These 20 tokens represent a palette of 20 colors, and the tokens with names like --semi-color-data-n(where n is 0, 2, 4, 6, 8, 10, 12, 14, 16, 18) represent a palette of 10 colors.

<DesignToken componentName='global' reg={/--semi-color-data/} hasTab={false}/>

#### Semantic Color Palette

The semantic Color palette primarily defines the common styles for chart components, such as background color, border, sliders, pop-ups, fonts, and text color. The `@visactor/vchart-semi-theme` package automatically crawls the token values of similar scenarios in the current Semi theme in the page environment to generate the VChart chart theme. <strong>Users who configure themes in the DSM usually do not need to consider additional configurations in this aspect</strong>.

For more information, please refer to the following two documents:

- [VChart Theme Concept and Design Rules](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Concept_and_Design_Rules)
- [VChart Theme Extension Package](https://visactor.io/vchart/guide/tutorial_docs/Theme/Theme_Extension)

Contact VChart:
```chartcontact 
```