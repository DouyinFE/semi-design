---
localeCode: zh-CN
order: 0
category: Plus
title:  CodeHighlight 代码高亮
icon: doc-configprovider
dir: column
brief: 根据语法高亮页面中的代码块
---

Semi 代码高亮组件使用了 prismjs，支持297 种编程语言的高亮（已自动配置 `JavaScript` `CSS` `类 C` `html` `svg` 等，其他语言需要手动引入），同时具有高扩展性和丰富的插件生态。

向 `code` props 传入代码纯文本，并在 `language` 传入编程语言名称。支持的编程语言和对应名称在 [Prismjs 官网](https://prismjs.com/#supported-languages) 查看


## 代码演示

### 如何引入


```jsx
import { CodeHighlight } from '@douyinfe/semi-ui';
import "prismjs/themes/prism.min.css";  // 手动引入高亮主题
```

另有多个主题均在 node_modules 内 prismjs/themes 下。（如果你使用 pnpm，请自行查找具体安装路径或在项目中手动安装 prismjs）

### 基本用法

```jsx live=true dir=column
import { CodeHighlight } from '@douyinfe/semi-ui';
import "prismjs/themes/prism.min.css";

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
import { CodeHighlight } from '@douyinfe/semi-ui';
import "prismjs/themes/prism.min.css";

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


### 支持其他语言

支持 297 种语言，除去 `JavaScript` `CSS` `类 C` `html` `svg` 外，支持其他语言需要手动引入配置。 


例如，高亮用于编写 GTK 程序前端 UI 的 Vala 语言，需要引入 `prism-vala.js` 

```javascript
import "prismjs/components/prism-vala.js"
```

```jsx live=true dir=column
import { CodeHighlight } from '@douyinfe/semi-ui';
import "prismjs/themes/prism.min.css";
import "prismjs/components/prism-vala.js"

function Demo() {
    return <CodeHighlight 
        className="codeHighlightDemo" // 用于防止 Semi 文档站样式影响 Demo 展示效果，实际项目不需要该 ClassName
        language={"vala"} code={
        `public class ExampleApp : Gtk.Application {
    public ExampleApp () {
        Object (application_id: "com.example.App");
    }

    public override void activate () {
        var win = new Gtk.ApplicationWindow (this);

        var btn = new Gtk.Button.with_label ("Hello World");
        btn.clicked.connect (win.close);

        win.child = btn;
        win.present ();
    }

    public static int main (string[] args) {
        var app = new ExampleApp ();
        return app.run (args);
    }
}
`
    }/>
}

```


### API

| 属性        | 说明    | 类型     | 默认值 |
|-----------|-------|--------|-----|
| className | 类名    | string | -   |
| code      | 代码纯文本 | string | -   |
| language  | 语言类型  | string | -   |
|lineNumber | 是佛开启行数显示 | boolean | true |
| style | 样式 | CSSProperties | - |

## 设计变量

<DesignToken/>


