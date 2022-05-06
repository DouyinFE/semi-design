---
localeCode: zh-CN
order: 16
category: 基础
title:  Typography 版式
icon: doc-typography
brief: 文字，图片，段落的基本格式。
---

## 使用场景
- 对文章、博客、日志等的文本内容进行展示时。
- 对文本进行复制和省略等基础操作时。

## 代码演示

### 如何引入

```jsx import
import { Typography } from '@douyinfe/semi-ui';
```
### 标题组件
通过设置 heading 可以展示不同级别的标题。
```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Title } = Typography;
    return (
        <div>
            <Title  style={{margin: '8px 0'}} >h1. Semi Design</Title>
            <Title heading={2} style={{margin: '8px 0'}} >h2. Semi Design</Title>
            <Title heading={3} style={{margin: '8px 0'}} >h3. Semi Design</Title>
            <Title heading={4} style={{margin: '8px 0'}} >h4. Semi Design</Title>
            <Title heading={5} style={{margin: '8px 0'}} >h5. Semi Design</Title>
            <Title heading={6} style={{margin: '8px 0'}} >h6. Semi Design</Title>
        </div>
    );
}
```

### 文本组件
内置不同样式的文本。可以通过 `icon` 属性传入图标，这种方式传入的图标默认与文本有间距，同时在链接文本的情况不会出现下划线符合设计规范。
```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Text } = Typography;
    return (
        <div>
            <Text>Text</Text>
            <br />
            <br />
            <Text type="secondary">Secondary</Text>
            <br />
            <br />
            <Text type="tertiary">{`Tertiary v>=1.2.0`}</Text>
            <br />
            <br />
            <Text type="quaternary">{`Quaternary v>=1.2.0`}</Text>
            <br />
            <br />
            <Text type="warning">Warning</Text>
            <br />
            <br />
            <Text type="danger">Danger</Text>
            <br />
            <br />
            <Text type="success">{`Success v>=1.7.0`}</Text>
            <br />
            <br />
            <Text disabled>Disabled</Text>
            <br />
            <br />
            <Text mark>Default Mark</Text>
            <br />
            <br />
            <Text code>Example Code</Text>
            <br />
            <br />
            <Text underline>Underline</Text>
            <br />
            <br />
            <Text delete>Deleted</Text>
            <br />
            <br />
            <Text strong>Strong</Text>
        </div>
    );
}
```
链接文本支持传入 `object`，将对应的属性挂在 `<a>` 标签上。  
**v>=1.0** 后默认不再有下划线，可以配合 underline 属性在 hover，active 态增加下划线的样式。
```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { IconLink } from '@douyinfe/semi-icons';

function Demo() {
    const { Text } = Typography;
    return (
        <div>
            <Text link={{ href: 'https://semi.design/' }}>链接文本</Text>
            <br />
            <br />
            <Text link={{ href: 'https://semi.design/' }}>打开网站</Text>
            <br />
            <br />
            <Text link icon={<IconLink />} underline>带下划线的网页链接</Text>
        </div>
    );
}
```

### 段落组件
段落组件拥有两种行距，可以通过设置 `spacing='extended'` 使用更宽松的行距。
```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Title } = Typography;
    return (
        <div>
            <Title heading={5}>默认行距</Title>
            <Paragraph>
                Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
            </Paragraph>
            <br />
            <Title heading={5}>宽松行距</Title>
            <Paragraph spacing="extended">
                Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
            </Paragraph>
        </div>
    );
}
```

### 文本大小
段落组件和文本组件支持两种尺寸，`small`（12px） 和 `normal`（14px），默认为`normal`。
```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Text } = Typography;
    return (
        <div>
            <Text>正常文本</Text>
            <Paragraph spacing="extended">
                Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
            </Paragraph>
            <br />
            <Text size='small'>小文本</Text>
            <Paragraph size='small'>
                Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
            </Paragraph>
        </div>
    );
}
```

### 可交互文本
支持文本的复制。
```jsx live=true
import React from 'react';
import { Typography, TextArea } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Text } = Typography;

    return (
        <div>
            <Paragraph copyable>点击右边的图标复制文本。</Paragraph>
            <Paragraph copyable={{ content: 'Hello, Semi Design!' }}>点击复制文本。</Paragraph>
            <Paragraph copyable={{ onCopy: () => Toast.success({ content: '复制文本成功'}) }}>点击右边的图标复制文本。</Paragraph>
            <br/>
            <Text type="secondary">粘贴区域：</Text>
            <br/>
            <TextArea autosize style={{width: 320, marginTop: 4}} rows={3} />
        </div>
    );
}
```

### 省略文本
支持文本的省略，可以通过 `ellipsis` 配置相关参数，具体参考 [Ellipsis Config](#Ellipsis-Config)。

> 目前只支持纯文本的截断

```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Title, Text } = Typography;

    return (
        <div>
            <Title heading={5} ellipsis={{ showTooltip: true }} style={{ width: 250 }}>
                是一个很长很长很长很长5号标题
            </Title>
            <br />
            <Text 
                ellipsis={{ 
                    showTooltip:{
                        opts: { content: '这是自定义要展示的内容' }
                    }
                }}
                style={{ width: 150 }}
            >
                可以自定义浮层里的展示内容试试看吧
            </Text>
            <br/>
            {/* link还可以传入object，如link={{ href: 'https://semi.design/zh-CN/basic/typography', target: '_blank' }} */}
            <Text link ellipsis={{ showTooltip: true, pos: 'middle' }} style={{ width: 150 }}>
                是一个很长很长很长很长的链接
            </Text>
            <br/>
            <Paragraph ellipsis={{ suffix: '小尾巴' }} style={{ width: 300 }}>
                有后缀的情况：Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
            </Paragraph>
            <br/>
            <Paragraph ellipsis={{ rows: 3 }} style={{ width: 300 }}>
                这是一个多行截断的例子：Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
            </Paragraph>
            <br/>
            <Paragraph ellipsis={{ rows: 3, showTooltip: {type: 'popover', opts: {style: {width: 300}}} }} style={{ width: 300 }}>
                多行截断，展示 Popover：Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
            </Paragraph>
            <br/>
            <Paragraph ellipsis={{ rows: 3, expandable: true, collapsible: true, collapseText: '折叠我吧', onExpand: (bool, e) => console.log(bool, e) }} style={{ width: 300 }}>
                支持展开和折叠：Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的 Web 应用。
            </Paragraph>
        </div>
    );
}
```

<Notice type="primary" title="注意事项">
    <div>当发生超长文本在弹出的 tooltip 没有换行时，请手动设置一下 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break" target="_blank" rel="noopener noreferrer">word-break</a>。我们没有内置的原因是不同语言内容（纯英文、中文、中英文混合）对 word-break 的需求不太一致，所以组件层没有做这个预设。</div>
</Notice>

```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Text } = Typography;

    return (
        <div>
            <Text 
                ellipsis={{ 
                    showTooltip:{
                        opts: { content: '架构|Semi-inf|graph.cheet.relation' }
                    }
                }}
                style={{ width: 150 }}
            >
                有问题的超长文本发生截断时可按需进行自定义配置
            </Text>
            <br />
            <Text 
                ellipsis={{ 
                    showTooltip:{
                        opts: { content: '架构|Semi-inf|graph.cheet.relation', className: 'components-typography-demo' }
                    }
                }}
                style={{ width: 150 }}
            >
                覆盖类名超长文本发生截断时可使用类名覆盖进行自定义配置
            </Text>
            <br />
            <Text 
                ellipsis={{
                    showTooltip:{
                        opts: { content: '架构|Semi-inf|graph.cheet.relation', style: { wordBreak: 'break-all' } }
                    }
                }}
                style={{ width: 150 }}
            >
                覆盖style超长文本发生截断时可使用style进行自定义配置
            </Text>
        </div>
    );
}
```

```scss
// 按需配置 word-break

.components-typography-demo {
    word-break: break-word;
    // 或
    word-break: break-all;
}
```

## API参考

### Typography.Text

| 属性      | 说明                                                                                                                                      | 类型                              | 默认值    | 版本   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------- | ------ |
| component | 自定义渲染元素                                                                                                                            | html element                      | span      |        |
| code      | 是否被 `code` 元素包裹                                                                                                                            | boolean                      | -      |        |
| copyable  | 是否可拷贝                                                                                                                                | boolean \| object:[Copyable Config](#Copyable-Config) | false     | 0.27.0 |
| delete    | 添加删除线样式                                                                                                                            | boolean                           | false     | 0.27.0 |
| disabled  | 禁用文本                                                                                                                                  | boolean                           | false     | 0.27.0 |
| ellipsis  | 设置自动溢出省略                                                                                                                          | boolean\|object:Ellipsis Config   | false     | 0.34.0 |
| icon      | 前缀图标                                                                                                                                  | ReactNode                         | -         | 0.27.0 |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                 | boolean\|object                   | false     | 0.27.0 |
| mark      | 添加标记样式                                                                                                                              | boolean                           | false     | 0.27.0 |
| size      | 文本大小，可选`normal`，`small`                                                                                                           | string                            | `normal`  | 0.27.0 |
| strong    | 是否加粗                                                                                                                                  | boolean                           | false     | 0.27.0 |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                            | `primary` | 0.27.0 |
| underline | 添加下划线样式                                                                                                                            | boolean                           | false     | 0.27.0 |

### Typography.Title

| 属性      | 说明                                                                                                                                      | 类型                              | 默认值    | 版本   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------- | ------ |
| component | 自定义渲染元素，默认由 heading 决定                                                                                                       | html element                      | h1~h6     |        |
| copyable  | 是否可拷贝                                                                                                                                | boolean \| object:[Copyable Config](#Copyable-Config) | false     | 0.27.0 |
| delete    | 添加删除线样式                                                                                                                            | boolean                           | false     | 0.27.0 |
| disabled  | 禁用文本                                                                                                                                  | boolean                           | false     | 0.27.0 |
| ellipsis  | 设置自动溢出省略                                                                                                                          | boolean\|object:Ellipsis Config   | false     | 0.34.0 |
| heading   | 标题级别，可选1， 2， 3，4，5，6，对应相应的标题                                                                                          | number                            | 1         | 0.27.0 |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                 | boolean\|object                   | false     | 0.27.0 |
| mark      | 添加标记样式                                                                                                                              | boolean                           | false     | 0.27.0 |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                            | `primary` | 0.27.0 |
| underline | 添加下划线样式                                                                                                                            | boolean                           | false     | 0.27.0 |

### Typography.Paragraph
| 属性      | 说明                                                                                                                                      | 类型                              | 默认值    | 版本   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------- | ------ |
| component | 自定义渲染元素                                                                                                                            | html element                      | p         |        |
| copyable  | 是否可拷贝                                                                                                                                | boolean \| object:[Copyable Config](#Copyable-Config) | false     | 0.27.0 |
| delete    | 添加删除线样式                                                                                                                            | boolean                           | false     | 0.27.0 |
| disabled  | 禁用文本                                                                                                                                  | boolean                           | false     | 0.27.0 |
| ellipsis  | 设置自动溢出省略                                                                                                                          | boolean\|object:Ellipsis Config   | false     | 0.34.0 |
| link      | 是否为链接，传object时，属性将透传给a标签                                                                                                 | boolean\|object                   | false     | 0.27.0 |
| mark      | 添加标记样式                                                                                                                              | boolean                           | false     | 0.27.0 |
| size      | 文本大小，可选`normal`，`small`                                                                                                           | string                            | `normal`  | 0.27.0 |
| spacing   | 行距大小，可选`normal`，`extended`                                                                                                           | string                            | `normal`  | 0.27.0 |
| strong    | 是否加粗                                                                                                                                  | boolean                           | false     | 0.27.0 |
| type      | 文本类型，可选 `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                            | `primary` | 0.27.0 |
| underline | 添加下划线样式                                                                                                                            | boolean                           | false     | 0.27.0 |

### Ellipsis Config
**v >= 0.34.0**

| 属性         | 说明                                                                                                              | 类型                                                | 默认值 |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------ |
| collapseText | 折叠的展示文本                                                                                                    | string                                              | `收起` |
| collapsible  | 是否支持折叠                                                                                                      | boolean                                             | false  |
| expandText   | 展开的展示文本                                                                                                    | string                                              | `展开` |
| expandable   | 是否支持展开                                                                                                      | boolean                                             | false  |
| pos          | 省略截断的位置，支持末尾和中间截断：`end`, `middle`                                                               | string                                              | `end`  |
| rows         | 省略溢出行数                                                                                                      | number                                              | 1      |
| showTooltip  | 是否展示 tooltip 及相关配置: type，浮层内容承载的组件，支持 Tooltip\| Popover；opts，其他需要透传给浮层组件的属性 | boolean\|{type: 'tooltip'\|'popover', opts: object} | false  |
| suffix       | 始终展示的后缀                                                                                                    | string                                              | -      |
| onExpand     | 展开/收起的回调                                                                                                   | function(expanded: bool, Event: e)                  | -      |

### Copyable Config
| 属性       | 说明                        | 类型                                           | 默认值 | 版本   |
| ---------- | --------------------------- | ---------------------------------------------- | ------ | ------ |
| content    | 复制出的文本                | string                                         | -      | 0.27.0 |
| copyTip    | 复制图标的 tooltip 展示内容 | React.node                                     | -      | 1.0.0  |
| successTip | 复制成功的展示内容          | React.node                                     | -      | 0.33.0 |
| onCopy     | 复制回调                    | Function(e:Event, content:string, res:boolean) | -      | 0.27.0 |

## 设计变量
<DesignToken/>