---
category: 开始
title:  Customized Themes 定制主题
icon: doc-theme
localeCode: zh-CN
order: 3
---



## 定制方式

Semi 提供完整的主题配置流程，既保持颜色、字体、圆角、阴影、布局等在视觉语言上的统一连贯，又能满足业务和品牌多样化的视觉需求。你可以前往 [Semi 设计系统管理站点](https://semi.design/dsm/) 选择或者创造一套符合你的需求的主题风格。目前 [Semi 设计系统管理站点](https://semi.design/dsm/) 支持主题色的配置，包括字体、圆角、等。


### 创造主题

你也可以从已发布的主题出发，或者选择 **立即创造** 来创造一个新的主题，也可以更新已发布的主题。选取主色后，我们的颜色算法会为你生成一套高可用的色盘。在此基础上你可以修改通用变量并产出对应的主题包。一键发布即可推送到 bnpm 中。

![主题创建](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_welcome.png)

![主题编辑](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_console.png)

![基础色调整](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_palette.png)

![色盘调整](https://lf9-static.bytednsdoc.com/obj/eden-cn/nuhpxphk/dsm/dsm_usage.png)

## 接入主题

创建完成主题下载后，使用 Semi 插件可以快速地接入选择的主题。

下载主题后，自行发布 npm 包。(临时行为，平台发包功能即将上线)。

之后需要在 配置文件 中指定需要使用的主题。

### 使用 Webpack 作为构建工具时

对于使用 Webpack 的用户，在 SemiWebpackPlugin 加入 `theme` 参数即可。

SemiWebpackPlugin  `yarn add -D @douyinfe/semi-webpack-plugin` or `npm i -D @douyinfe/semi-webpack-plugin`

```jsx
new SemiWebpackPlugin({
    theme: `你的主题npm包名称`
    /* ...options */
})
```
### 使组件级变量的改动生效

如果在定制主题的过程中你修改了组件级别的变量，`theme` 字段需要用如下配置使改动生效：
```javascript
{
    theme: {
        name: '你的主题npm包名称',
        include: '~你的主题npm包名称/scss/local.scss'
    }
}
```


## 更新主题

Semi 在开发过程中，有可能出于设计考虑更新或者添加部分通用变量。如果你使用的是定制主题，当 Semi 发布了新的通用变量后（我们会在更新日志里标注），我们建议你前往 [主题商店](https://semi.design/dsm/) 重新生成该主题。

