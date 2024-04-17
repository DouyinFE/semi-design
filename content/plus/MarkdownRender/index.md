---
localeCode: zh-CN
order: 0
category: Plus
title:  Markdown 渲染器
icon: doc-configprovider
dir: column
brief: 在网页中即时渲染 Markdown 和 MDX
---



## 代码演示

### 如何引入

```jsx live=true dir="column"
import { MarkdownRender } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"


function Demo(){
    return <MarkdownRender mdxRaw={`
    
    `} components={SemiMarkdownComponents}/>
}

```

### 基本示例
导入 MarkdownRender 后，直接传入 Markdown 或 MDX 纯文本即可。

引入 SemiMarkdownComponents 并传入 MarkdownRender 可以美化文档，文档中的基础元素例如文本、标题、超链接、图片、表格等会使用 Semi 组件渲染，因为这些文档组件不是每个开发者必须，为了减少包体积，需要手动引入。


### 文档中的自定义渲染

你可以任意替换 Markdown 或 MDX 文档中的文档元素的显示效果，只需向 `components` props 中传入对于组件名称和你的渲染组件即可

比如，现在需要将所有文本的颜色设置成蓝色

```jsx

```
