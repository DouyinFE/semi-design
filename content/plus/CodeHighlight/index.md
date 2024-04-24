---
localeCode: zh-CN
order: 0
category: Plus
title:  代码高亮
icon: doc-configprovider
dir: column
brief: 根据语法高亮页面中的代码块
---


## 代码演示

### 如何引入

Semi 代码高亮组件使用了 prismjs，支持297 种编程语言的高亮，同时具有高扩展性和丰富的插件生态。

```jsx
import { CodeHighlight } from '@douyinfe/semi-ui';
import "prismjs/themes/prism.min.css";  // 手动引入高亮主题
```

另有多个主题均在 node_modules 内 prismjs/themes 下。（如果你使用 pnpm，请自行查找具体安装路径或在项目中手动安装 prismjs）

### 基本用法

```jsx live=true dir=column

function Demo() {

    return <CodeHighlight 
        className="codeHighlightDemo" // 用于防止 Semi 文档站样式影响 Demo 展示效果，实际项目不需要该 ClassName
        language={"javascript"} code={
        `
import * as React from 'react"
const Test = ()=>{
    const handleClick = ()=>{
        alert("Click")
    }
    return <div onClick={handleClick}>test</div>
}`
    }/>
}

```

**CSS**

```jsx live=true dir=column

function Demo() {

    return <CodeHighlight 
        className="codeHighlightDemo" // 用于防止 Semi 文档站样式影响 Demo 展示效果，实际项目不需要该 ClassName
        language={"css"} code={
        `.grid {
    .semi-row,
    .semi-row-flex {
        text-align: center;
        .semi-col {
            min-height: 30px;
            line-height: 30px;
            background: var(--semi-color-primary-light-default);
            outline: 1px solid var(--semi-color-primary-light-active);
        }
    }
}
`
    }/>
}

```


