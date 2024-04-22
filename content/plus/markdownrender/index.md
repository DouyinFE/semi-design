---
localeCode: zh-CN
order: 20
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
    
| Markdown 中的表格 | 也是支持的 |  c |  d  |
| - | :- | -: | :-: |
| 1 | 2 | 3 | 4 |
| 21 | 22 | 23 | 24 |
| 31 | 32 | 33 | 34 |
| 41 | 42 | 43 | 44 |

    `} components={SemiMarkdownComponents}/>
}

```

### 基本示例
导入 MarkdownRender 后，直接传入 Markdown 或 MDX 纯文本即可。

引入 SemiMarkdownComponents 并传入 MarkdownRender 可以美化文档，文档中的基础元素例如文本、标题、超链接、图片、表格等会使用 Semi 组件渲染，因为这些文档组件不是每个开发者必须，为了减少包体积，需要手动引入。


### 修改元素样式

你可以任意替换 Markdown 或 MDX 文档中的文档元素的显示效果，只需向 `components` props 中传入你的渲染组件覆盖即可

比如，现在需要将所有1号标题的颜色设置成红色

```jsx live=true
import { MarkdownRender, Typography } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"


function Demo() {
    const components ={...SemiMarkdownComponents};
    
    components['h1'] = ({children}) => <Typography.Title heading={1} style={{color:"var(--semi-color-danger)"}}>{children}</Typography.Title>
    
    return <MarkdownRender mdxRaw={`# 红色标题`} components={components} />
}


```


### 添加自定义组件

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

