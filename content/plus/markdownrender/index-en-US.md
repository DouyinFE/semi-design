---
localeCode: en-US
order: 22
category: Plus
title:  Markdown Render
icon: doc-configprovider
dir: column
brief: Instantly render Markdown and MDX in web pages
---

## When to use

Markdown is a document markup language that can implement basic common rich text functions such as titles, pictures, tables, links, bolding, etc. through simple tags.
MDX is based on Markdown and allows the introduction of JSX to achieve more complex and customized document writing and display requirements.

The MarkdownRender component provided by Semi supports rendering Markdown and MDX. No special configuration is required. By passing in plain text, rich text content that conforms to Semi style specifications can be rendered.


Usually used in the following scenarios:
- Document site writing and rendering
- Front-end rendering when the server dynamically generates rich text content
- A light interactive website that focuses on content display


## Demos

### How to import

```jsx
import { MarkdownRender } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"
```



### Basic usage
After importing MarkdownRender, just pass in Markdown or MDX plain text directly.

Introducing SemiMarkdownComponents and passing it into MarkdownRender, basic elements in the document such as text, titles, hyperlinks, pictures, tables, etc. will be rendered using Semi components. Not everyone needs these document elements, so in order to reduce the package size, they need to be introduced manually.

```jsx live=true dir="column"
import { MarkdownRender } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"


function Demo(){
    return <MarkdownRender components={SemiMarkdownComponents} raw={`
# Title No. 1
## Title No. 2
### Title No. 3

The main text content is ordinary text, and it can also be **bold**~~strikethrough~~ and <u>underline</u> [Hyperlink](https://semi.design) etc. Basic syntax of Markdown and HTML Supported rich text

#### List syntax support
- Eat well
- sleep well
- Have fun
- Study hard
- have a good chat
- Have a good argument
- Live an ordinary day

![Colorful World](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg)
    
| Support | Markdown tables | c | d |
| - | :- | -: | :-: |
| 1 | 2 | 3 | 4 |
| 21 | 22 | 23 | 24 |
| 31 | 32 | 33 | 34 |
| 41 | 42 | 43 | 44 |
    `}/>
}

```

### Modify element style

You can arbitrarily replace the display effect of document elements in Markdown or MDX documents. Just pass your rendering component override to the `components` props.

For example, now you need to set the color of all headings No. 1 to the main color

```jsx live=true dir="column"
import { MarkdownRender, Typography } from '@douyinfe/semi-ui';
import * as SemiMarkdownComponents from "@douyinfe/semi-ui/markdownRender/components"


function Demo() {
    const components ={...SemiMarkdownComponents};
    
    components['h2'] = ({children}) => <Typography.Title heading={2} style={{color:"var(--semi-color-primary)"}}>{children}</Typography.Title>
    
    return <MarkdownRender raw={`## From Semi Design to Any Design, quickly define your design system and apply it in design drafts and codes`} components={components} />
}


```

Basic element tag support that can be overridden `a blockquote br code em h1 h2 h3 h4 h5 hr img li ol p pre strong ul table`



### Add custom components

By passing in custom components to `components` Props, you can write JSX directly in Markdown, and the component will be rendered to the final page, supporting JS events.
The default Markdown components can be obtained from `MarkdownRender.defaultComponents` and can be used for secondary packaging.

<Notice type="primary" title="Note">
   <div>Try to ensure that the JSX code in the rendered Markdown is trustworthy to prevent XSS. </div>
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
        raw={`
#### Below is a button rendered in Markdown
<MyButton onClick={()=>alert("MyButton is clicked")}>MyButton click me</MyButton>

Just write JSX directly in Markdown
        `}
        components={{...MarkdownRender.defaultComponents,...components}} />
}


```


### API

| Properties | Description | Type | Default Value |
|------------|-----------------------------|------ ------------------------|-------|
| className | class name | string | - |
| components | Used to override Markdown elements and add custom components | Record<string, JSXElementConstructor> | - |
| format | The incoming raw type, whether it is pure Markdown | 'md'\|'mdx' | 'mdx' |
| raw | plain text in Markdown or MDX | string | - |
| style | style | CSSProperties | - |

## Design Token

<DesignToken/>

