---
localeCode: en-US
order: 17
category: Basic
title:  Typography
subTitle: Typography
icon: doc-typography
brief: The basic format of text, images, and paragraphs.
---


## When to Use

-   To display the text content of articles, blogs, logs, etc.
-   To take basic operations such as copying and omitting text.

## Demos

### How to import

```jsx import
import { Typography } from '@douyinfe/semi-ui';
```
### Title

Use `heading` to set different levels of headint title.

```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Title } = Typography;
    return (
        <div>
            <Title style={{ margin: '8px 0' }} >h1. Semi Design</Title>
            <Title with={2} style={{ margin: '8px 0' }} >h2. Semi Design</Title>
            <Title heading={3} style={{ margin: '8px 0' }} >h3. Semi Design</Title>
            <Title heading={4} style={{ margin: '8px 0' }} >h4. Semi Design</Title>
            <Title heading={5} style={{ margin: '8px 0' }} >h5. Semi Design</Title>
            <Title heading={6} style={{ margin: '8px 0' }} >h6. Semi Design</Title>
        </div>
    );
}
```

### Text

Text component has different built-in styles. You could also pass `icon` to use the build-in styles for icon. Different from passing icon to children, using `icon` for link will have no underline in compliance with Semi Design principles.

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
            <Text type="tertiary">{'Tertiary v>=1.2.0'}</Text>
            <br />
            <br />
            <Text type="quaternary">{'Quaternary v>=1.2.0'}</Text>
            <br />
            <br />
            <Text type="warning">Warning</Text>
            <br />
            <br />
            <Text type="success">{'Success v>=1.7.0'}</Text>
            <br />
            <br />
            <Text type="danger">Danger</Text>
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

You could pass object to `link`, which will be mounted on `<a>`.

```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { IconLink } from '@douyinfe/semi-icons';

function Demo() {
    const { Text } = Typography;
    return (
        <div>
            <Text link={{ href: 'https://semi.design/' }}>Link</Text>
            <br />
            <br />
            <Text link={{ href: 'https://semi.design/' }}>Open Website</Text>
            <br />
            <br />
            <Text link icon={<IconLink />} underline>Link</Text>
        </div>
    );
}
```

### Paragraph

Paragraph component has two spacings. You could set`spacing='extended'` for a looser spacing.

```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Title } = Typography;
    return (
        <div>
            <Title heading={5}>Default Spacing</Title>
            <Paragraph>
                {`Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
            <br />
            <Title heading={5}>Extended Spacing</Title>
            <Paragraph spacing="extended">
                {`Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
        </div>
    );
}
```

### Size

Paragraph and Text component support two sizes, `small`(12px) and `normal`(14px). By default it is set to `normal`。

```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Text } = Typography;
    return (
        <div>
            <Text>Normal</Text>
            <Paragraph spacing="extended">
                {`Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
            <br />
            <Text size='small'>Small</Text>
            <Paragraph size='small'>
                {`Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
        </div>
    );
}
```

### Interactive

Copyable text.

```jsx live=true
import React from 'react';
import { Typography, TextArea } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Text } = Typography;

    return (
        <div>
            <Paragraph copyable>Click the right icon to copy text.</Paragraph>
            <Paragraph copyable={{ content: 'Hello, Semi Design!' }}>Click to copy text.</Paragraph>
            <Paragraph copyable={{ onCopy: () => Toast.success({ content: 'Successfully copied.' }) }}>Click the right icon to copy.</Paragraph>
            <br/>
            <Text type="secondary">Paste here: </Text>
            <br/>
            <TextArea autosize style={{ width: 320, marginTop: 4 }} rows={3} />
        </div>
    );
}
```

### Ellipsis

Show ellipsis if text is overflowed. Refer to [Ellipsis Config](#Ellipsis-Config) for detailed configuration.
> At this moment, only pure text truncation is supported.

```jsx live=true
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';

function Demo() {
    const { Paragraph, Text, Title } = Typography;

    return (
        <div>
            <Title heading={5} ellipsis={{ showTooltip: true }} style={{ width: 250 }}>
                This is a supercalifragilisticexpialidocious title
            </Title>
            <br />
            <Text 
                ellipsis={{ 
                    showTooltip: {
                        opts: { content: 'This is a supercalifragilisticexpialidocious tooltip' }
                    }
                }}
                style={{ width: 150 }}
            >
                Custom tooltip text if you need
            </Text>
            <br />
            <Text link ellipsis={{ showTooltip: true, pos: 'middle' }} style={{ width: 150 }}>
                This is a supercalifragilisticexpialidocious link
            </Text>
            <br/>
            <Paragraph ellipsis={{ suffix: '-Macbeth' }} style={{ width: 300 }}>
                {`With suffix: Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
            <br/>
            <Paragraph ellipsis={{ rows: 3 }} style={{ width: 300 }}>
                {`Multi-line ellipsis: Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
            <br/>
            <Paragraph ellipsis={{ rows: 3, showTooltip: { type: 'popover', opts: { style: { width: 300 } } } }} style={{ width: 300 }}>
                {`With Popover: Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
            <br/>
            <Paragraph ellipsis={{ rows: 3, expandable: true, collapsible: true, collapseText: 'Show Less', onExpand: (bool, e) => console.log(bool, e) }} style={{ width: 300 }}>
                {`Expandable and collapsible: Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then is heard no more; it is a tale told by an idiot, full of sound and fury, signifying nothing.`}
            </Paragraph>
        </div>
    );
}
```

<Notice type="primary" title="Tips">
    <div>When the tooltip does not wrap in the pop-up tooltip when the long text occurs, please set it manually <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break" target="_blank"  rel="noopener noreferrer">word-break</a>. The reason why we did not have built-in content is that different language content (pure English, Chinese, mixed Chinese and English) have different requirements for word-break, so the component layer does not make this preset.</div>
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
                    showTooltip: {
                        opts: { content: 'Insfrastructure|Data-inf|bytegraph.cheetah.user_relation' }
                    }
                }}
                style={{ width: 150 }}
            >
                Customized configuration can be made on demand when long text is truncated
            </Text>
            <br />
            <Text 
                ellipsis={{ 
                    showTooltip: {
                        opts: { content: 'Insfrastructure|Data-inf|bytegraph.cheetah.user_relation', className: 'components-typography-demo' }
                    }
                }}
                style={{ width: 150 }}
            >
                Customized configuration can be made on demand when long text is truncated
            </Text>
            <br />
            <Text 
                ellipsis={{
                    showTooltip: {
                        opts: { content: 'Insfrastructure|Data-inf|bytegraph.cheetah.user_relation', style: { wordBreak: 'break-all' } }
                    }
                }}
                style={{ width: 150 }}
            >
                Customized configuration can be made on demand when long text is truncated
            </Text>
        </div>
    );
}
```

```scss
// config word-break

.components-typography-demo {
    word-break: break-word;
    // or
    word-break: break-all;
}
```

## API Reference

### Typography.Text

| Properties | Instructions                                                                                                                             | type                                                  | Default   | version |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------- |
| copyable   | Toggle whether to be copyable                                                                                                            | boolean \| object:[Copyable Config](#Copyable-Config) | false     | 0.27.0  |
| code       | wrap with `code` element                                                                                                                 | boolean                                               | -         |         |
| component  | Custom rendering html element                                                                                                            | html element                                          | span      |         |
| delete     | Deleted style                                                                                                                            | boolean                                               | false     | 0.27.0  |
| disabled   | Disabled style                                                                                                                           | boolean                                               | false     | 0.27.0  |
| ellipsis   | Display ellipsis when text overflows                                                                                                     | boolean\|object:Ellipsis Config                       | false     | 0.34.0  |
| icon       | Prefix icon.                                                                                                                             | ReactNode                                             | -         | 0.27.0  |
| link       | Toggle whether to display as a link. When passing object, the attributes will be transparently passed to the a tag                       | boolean\|object                                       | false     | 0.27.0  |
| mark       | Marked style                                                                                                                             | boolean                                               | false     | 0.27.0  |
| size       | Size, one of `normal`，`small`                                                                                                           | string                                                | `normal`  | 0.27.0  |
| strong     | Bold style                                                                                                                               | boolean                                               | false     | 0.27.0  |
| type       | Type, one of `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**) , `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` | 0.27.0  |
| underline  | Underlined style                                                                                                                         | boolean                                               | false     | 0.27.0  |

### Typography.Title

| Properties | Instructions                                                                                                                            | type                                                  | Default   | version |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------- |
| copyable   | Toggle whether to be copyable                                                                                                           | boolean \| object:[Copyable Config](#Copyable-Config) | false     | 0.27.0  |
| component  | Custom rendering html element. The default is determined by heading prop                                                                | html element                                          | h1~h6     |         |
| delete     | Deleted style                                                                                                                           | boolean                                               | false     | 0.27.0  |
| disabled   | Disabled style                                                                                                                          | boolean                                               | false     | 0.27.0  |
| ellipsis   | Display ellipsis when text overflows                                                                                                    | boolean\|object:Ellipsis Config                       | false     | 0.34.0  |
| heading    | Heading level, one of 1， 2， 3，4，5，6                                                                                                | number                                                | 1         | 0.27.0  |
| link       | Toggle whether to display as a link. When passing object, the attributes will be transparently passed to the a tag                      | boolean\|object                                       | false     | 0.27.0  |
| mark       | Marked style                                                                                                                            | boolean                                               | false     | 0.27.0  |
| type       | Type, one of `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` | 0.27.0  |
| underline  | Underlined style                                                                                                                        | boolean                                               | false     | 0.27.0  |

### Typography.Paragraph

| Properties | Instructions                                                                                                                            | type                                                  | Default   | version |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------- |
| copyable   | Toggle whether to be copyable                                                                                                           | boolean \| object:[Copyable Config](#Copyable-Config) | false     | 0.27.0  |
| component  | Custom rendering html element                                                                                                           | html element                                          | p         |         |
| delete     | Deleted style                                                                                                                           | boolean                                               | false     | 0.27.0  |
| disabled   | Disabled style                                                                                                                          | boolean                                               | false     | 0.27.0  |
| ellipsis   | Display ellipsis when text overflows                                                                                                    | boolean\|object:Ellipsis Config                       | false     | 0.34.0  |
| link       | Toggle whether to display as a link. When passing object, the attributes will be transparently passed to the a tag                      | boolean\|object                                       | false     | 0.27.0  |
| mark       | Marked style                                                                                                                            | boolean                                               | false     | 0.27.0  |
| size       | Size, one of `normal`，`small`                                                                                                          | string                                                | `normal`  | 0.27.0  |
| spacing    | paragraph spacing, one of `normal`, `extended`                                                                                          | string                                                | `normal`  | 0.27.0  |
| strong     | Bold style                                                                                                                              | boolean                                               | false     | 0.27.0  |
| type       | Type, one of `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` | 0.27.0  |
| underline  | Underlined style                                                                                                                        | boolean                                               | false     | 0.27.0  |


### Ellipsis Config
**v >= 0.34.0**

| Properties   | Instructions                                                                                                                                                                                 | type                                                | Default    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------- |
| collapseText | Displayed text to collapse                                                                                                                                                                   | string                                              | `Collapse` |
| collapsible  | Toggle whether text is collapsible                                                                                                                                                           | boolean                                             | false      |
| expandText   | Displayed text to expand                                                                                                                                                                     | string                                              | `Expand`   |
| expandable   | Toggle whether text is expandable                                                                                                                                                            | boolean                                             | false      |
| pos          | Position to start ellipsis, one of `end`, `middle`                                                                                                                                           | string                                              | `end`      |
| rows         | Number of rows that should not be truncated                                                                                                                                                  | number                                              | 1          |
| showTooltip  | Toggle whether to show tooltip, if passed in as object: type，type of component to show tooltip, one of `Tooltip`, `Popover`; opts, properties that will be passed directly to the component | boolean\|{type: 'tooltip'\|'popover', opts: object} | false      |
| suffix       | Text suffix that will not be truncated                                                                                                                                                       | string                                              | -          |
| onExpand     | Callback when expand or collapse                                                                                                                                                             | function(expanded: bool, Event: e)                  | -          |


### Copyable Config
| Properties | Instructions                            | Type                                           | Default | Version |
| ---------- | --------------------------------------- | ---------------------------------------------- | ------- | ------- |
| content    | Copied content                          | string                                         | -       | 0.27.0  |
| copyTip    | Tooltip content when hovering over icon | React.node                                     | -       | 1.0.0   |
| successTip | Successful tip content                  | React.node                                     | -       | 0.33.0  |
| onCopy     | Callback for copy action                | Function(e:Event, content:string, res:boolean) | -       | 0.27.0  |

## Content Guidelines

- Link
  - Text links need to be clear and predictable, users should be able to predict what will happen when they click on the link
  - Do not mislead users by mislabeling links
  - Avoid using "Click here" or "Here" as stand-alone links

| ✅ Recommended usage | ❌ Deprecated usage |   
| --- | --- | 
| No spaces yet? <PureA> Create space </PureA>| No spaces yet? <PureA>Click here</PureA> |

- Avoid using entire sentences as clickable text links, and instead use text that describes where to go as the link content

| ✅ Recommended usage | ❌ Deprecated usage |   
| --- | --- | 
| Views <PureA>user documentation</PureA> for details|<PureA>View user documentation for details</PureA> |

- Using short terms or words as link text is more conducive to internationalization, to avoid the problem of link text being split due to different grammar and word order in different languages

| ✅ Recommended usage | ❌ Deprecated usage |   
| --- | --- | 
| Manage <PureA>notifications </PureA>to| <PureA>Manage notifications</PureA> to |

- When ending with a text link, there is no need to follow punctuation, except for the question mark "?"

| ✅ Recommended usage | ❌ Deprecated usage |   
| --- | --- | 
| No spaces yet? <PureA> Create space </PureA> | No spaces yet? <PureA>Click here</PureA> |
| <PureA> Forgot password ？</PureA> |<PureA>Forgot password</PureA> |

- Link text does not contain the articles "the, a, an"

| ✅ Recommended usage | ❌ Deprecated usage |   
| --- | --- | 
| View <PureA> user documentation </PureA> for details| View the<PureA> user documentation</PureA> for details |

## Design Tokens
<DesignToken/>