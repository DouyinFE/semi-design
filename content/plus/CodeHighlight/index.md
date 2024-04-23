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

```jsx live=true

function Demo() {

    return <CodeHighlight language={"javascript"} code={
        `import * as React from 'react"
const Test = ()=>{
return <div>test</div>
}
        `
    }/>
}

```


