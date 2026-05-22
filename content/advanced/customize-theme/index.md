---
category: 设计协作
title:  Customized Themes 定制主题
icon: doc-theme
localeCode: zh-CN
order: 4
---

## 定制方式

Semi 提供完整的主题配置流程，既保持颜色、字体、圆角、阴影、布局等在视觉语言上的统一连贯，又能满足业务和品牌多样化的视觉需求。  
你可以前往 [Semi 设计系统管理站点](https://semi.design/dsm/) （又称DSM） 选择或者创造一套符合你的需求的主题风格。

目前DSM支持全局、组件级别的样式定制，并在 Figma 和线上代码之间保持同步。**使用 DSM，将 Semi Design 适配为 Any Design**

- 🎨 全局样式 变量管理  
支持色盘、圆角、字体排版、描边、阴影的可视化编辑预览  

- 🔁 设计变量双向同步  
设计变量可以在 Web 端与 Figma 插件侧双向实时同步。  

- 🧩 深度的组件样式定制  
对单个组件的样式进行深度定制，例如组件的 高度 / 间距等样式定制；  

### 创造主题

你也可以从已发布的主题出发，或者选择 **立即创造** 来创造一个新的主题，也可以更新已发布的主题。选取主色后，我们的颜色算法会为你生成一套高可用的色盘。在此基础上你可以修改通用变量并产出对应的主题包。一键发布即可推送到 npm 中。

![主题创建](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_welcome.png)

![主题编辑](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_console.png)

![基础色调整](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_palette.png)

![色盘调整](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_usage.png)

## 接入主题

创建完成主题下载后，使用 Semi 插件可以快速地接入选择的主题。每种构建工具都可以通过下面三种方式自定义主题，**优先级由低到高**：

1. 通过 DSM 生成的 npm 主题包
2. 通过项目内本地的 Scss 文件
3. 通过插件参数传入键值对覆盖

### 使用 Webpack 作为构建工具时

对于使用 Webpack 的用户，可以使用 SemiWebpackPlugin 来接入定制主题。

安装：`yarn add -D @douyinfe/semi-webpack-plugin` 或 `npm i -D @douyinfe/semi-webpack-plugin`

#### 通过 npm 包接入

```js
// webpack.config.js
const SemiWebpackPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    // ...
    plugins: [
        new SemiWebpackPlugin({
            theme: '你的主题npm包名称'
        })
    ]
};
```

#### 通过本地 Scss 文件

```scss
// local.scss
$font-size-small: 16px;
```

```js
// webpack.config.js
const path = require('path');
const SemiWebpackPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    plugins: [
        new SemiWebpackPlugin({
            include: path.join(__dirname, 'local.scss')
        })
    ]
};
```

#### 通过参数覆盖变量

```js
// webpack.config.js
const SemiWebpackPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    plugins: [
        new SemiWebpackPlugin({
            variables: {
                '$font-size-small': '16px'
            }
        })
    ]
};
```

#### 替换 CSS 选择器前缀

Semi Design 的 CSS 选择器默认以 `semi` 作为前缀（如 `.semi-button`），可以通过 `prefixCls` 替换：

```js
// webpack.config.js
const SemiWebpackPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    plugins: [
        new SemiWebpackPlugin({
            prefixCls: 'custom'
        })
    ]
};
```

替换后选择器将变为 `.custom-button`。

### 使用 Vite 作为构建工具时

对于使用 Vite 的用户，可以使用 SemiVitePlugin 来接入定制主题。

安装：`yarn add -D @douyinfe/semi-vite-plugin` 或 `npm i -D @douyinfe/semi-vite-plugin`

#### 通过 npm 包接入

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import semiTheming from '@douyinfe/semi-vite-plugin';

export default defineConfig({
    plugins: [
        semiTheming({
            theme: '你的主题npm包名称'
        })
    ]
});
```

#### 通过本地 Scss 文件

```scss
// local.scss
$font-size-small: 16px;
```

```ts
// vite.config.ts
import path from 'path';
import { defineConfig } from 'vite';
import semiTheming from '@douyinfe/semi-vite-plugin';

export default defineConfig({
    plugins: [
        semiTheming({
            include: path.resolve(__dirname, 'local.scss')
        })
    ]
});
```

#### 通过参数覆盖变量

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import semiTheming from '@douyinfe/semi-vite-plugin';

export default defineConfig({
    plugins: [
        semiTheming({
            variables: {
                '$font-size-small': '16px'
            }
        })
    ]
});
```

#### 替换 CSS 选择器前缀

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import semiTheming from '@douyinfe/semi-vite-plugin';

export default defineConfig({
    plugins: [
        semiTheming({
            prefixCls: 'custom'
        })
    ]
});
```

替换后选择器将变为 `.custom-button`。

> 同时支持 `cssLayer: true`（将编译产物包裹在 `@layer semi { ... }` 中）和 `omitCss: true`（注释掉 semi 包内的 `.css` 引入，适用于 Next.js 等不允许从 `node_modules` 引入全局 CSS 的场景）。

更多工程化方案（如 Next.js）的主题接入，可参考 [DSM 文档](https://semi.design/dsm_manual/zh-CN/web/use#dsm_%E5%A6%82%E4%BD%95%E6%B6%88%E8%B4%B9%E4%B8%BB%E9%A2%98)

### 使组件级变量的改动生效

如果在定制主题的过程中你修改了组件级别的变量，`theme` 字段需要用如下配置使改动生效：

```js
{
    theme: {
        name: '你的主题npm包名称',
        include: '~你的主题npm包名称/scss/local.scss'
    }
}
```


## 更新主题

Semi 在开发过程中，有可能出于设计考虑更新或者添加部分通用变量。如果你使用的是定制主题，当 Semi 发布了新的通用变量后（我们会在更新日志里标注），我们建议你前往 [Semi DSM](https://semi.design/dsm/) 更新该主题（大部分情况下仅需重新执行一次发布操作即可）

