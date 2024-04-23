---
localeCode: zh-CN
order: 20
category: Plus
title:  Markdown 渲染器
icon: doc-configprovider
dir: column
brief: 在网页中即时渲染 Markdown 和 MDX
---

## 使用场景

Markdown 是一种文档标记语言，可以通过简单的标记实现例如标题，图片，表格，链接，加粗等基本常用富文本功能。
MDX 是在 Markdown 基础上，允许引入 JSX 实现更加复杂定制化的文档撰写与展示需求。

Semi 提供的 MarkdownRender 组件支持渲染 Markdown 和 MDX，无需特别配置，传入纯文本即可渲染出符合 Semi 样式规范的富文本内容。


通常用于下列场景：
- 文档站编写与渲染
- 服务端动态生成富文本内容时，前端渲染
- 偏内容展示的轻交互网站


## 代码演示

### 如何引入

```jsx
import { MarkdownRender } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"
```



### 基本用法
导入 MarkdownRender 后，直接传入 Markdown 或 MDX 纯文本即可。

引入 SemiMarkdownComponents 并传入 MarkdownRender，文档中的基础元素例如文本、标题、超链接、图片、表格等会使用 Semi 组件渲染，这些文档元素并非所有人都需要，因此为了减少包体积，需要手动引入。
```jsx live=true dir="column"
import { MarkdownRender } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"


function Demo(){
    return <MarkdownRender components={SemiMarkdownComponents} mdxRaw={`
# 1号标题
## 2号标题
### 3号标题

正文内容是普通的文本，也可以**加粗**~~删除线~~和<u>下划线</u> [超链接](https://semi.design) 等 Markdown 与 HTML 的基本语法所支持的富文本

#### 列表语法支持
- 好好地吃饭
- 好好地睡觉
- 好好地游玩
- 好好地学习
- 好好地聊天
- 好好地吵架
- 过着平凡普通的每日 

![Colorful World](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg)
    
| 支持 | Markdown 表格 |  c |  d  |
| - | :- | -: | :-: |
| 1 | 2 | 3 | 4 |
| 21 | 22 | 23 | 24 |
| 31 | 32 | 33 | 34 |
| 41 | 42 | 43 | 44 |

    `}/>
}

```

### 修改元素样式

你可以任意替换 Markdown 或 MDX 文档中的文档元素的显示效果，只需向 `components` props 中传入你的渲染组件覆盖即可

比如，现在需要将所有1号标题的颜色设置成主色

```jsx live=true
import { MarkdownRender, Typography } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"


function Demo() {
    const components ={...SemiMarkdownComponents};
    
    components['h1'] = ({children}) => <Typography.Title heading={1} style={{color:"var(--semi-color-primary)"}}>{children}</Typography.Title>
    
    return <MarkdownRender mdxRaw={`# 主色标题`} components={components} />
}


```

可以覆盖的基本元素 tag 支持 `a blockquote br code em h1 h2 h3 h4 h5 hr img li ol p pre strong ul table`



### 添加自定义组件

通过传入自定义组件到 `components` Props，能够实现在 Markdown 中直接书写 JSX，组件会被渲染到最终页面上，支持 JS 事件。

<Notice type="primary" title="注意事项">
  <div>注意尽量确保被渲染的 Markdown 内 JSX 代码可信，防止 XSS。</div>
</Notice>


```jsx live=true
import { Button, MarkdownRender, Typography } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"


function Demo() {
    const components = { ...SemiMarkdownComponents };

    components['MyButton'] = ({ children,onClick }) => {
        return <Button type={"primary"} onClick={onClick} style={{marginBottom:"12px"}}> {children} </Button>
    }

    return <MarkdownRender 
        mdxRaw={`
#### 下面是一个渲染在 Markdown 中的按钮
<MyButton onClick={()=>alert("点击了 MyButton")}>MyButton 点我</MyButton>

直接在 Markdown 中书写 JSX 即可
        `} 
        components={components} />
}


```


### MarkdownRender

| 属性         | 说明                         | 类型                                    | 默认值 |
|------------|----------------------------|---------------------------------------| --- |
| mdxRaw     | Markdown 或 MDX 的纯文本        | string                                | - |
| components | 用于覆盖 Markdown 元素，也可添加自定义组件 | Record<string, JSXElementConstructor> | - |

## 设计变量

<DesignToken/>

