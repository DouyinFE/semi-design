---
localeCode: en-US
order: 103
category: Ai
title: Sidebar
icon: doc-sidebar
width: 60%
brief: Display configuration and detail information in AI scenarios
showNew: true
---

## Usage Scenarios

The Sidebar is mainly used in AI scenarios for information display and feature configuration, including MCP configuration, reference sources, code preview, rich text preview and editing, etc.


## Code Examples

### Basic Container

The basic container of the Sidebar is the base container for [MCP configuration](#mcp-configuration), [Annotation](#Annotation) and [Sidebar](#sidebar).

- `visible` together with `onCancel` is used to control show/hide
- `title` sets the title
- `motion` sets whether to enable the expand animation
- `resizable` sets whether the width is resizable. When `true`, you can use `minSize` and `maxSize` to control min and max width

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Sidebar, Button, Switch } from '@douyinfe/semi-ui';

const { Container } = Sidebar;
const containerStyle = {
    display: 'flex',
    height: '500px',
    border: '1px solid var(--semi-color-border)',
    borderRadius: 8,
    overflow: 'hidden',
    boxSizing: 'border-box'
};

const ContainerDemo = () => {
    const [visible, setVisible] = useState(true);
    const [motion, setMotion] = useState(true);
    const [resizable, setResizable] = useState(true);

    const toggleVisible = useCallback(() => {
        setVisible(visible => !visible);
    }, []);

    const onMotionChange = useCallback((checked) => {
        setMotion(checked);
    }, []);

    const onResizableChange = useCallback((checked) => {
        setResizable(checked);
    }, []);

    return <div style={containerStyle}>
        <div style={{ flexGrow: 1, flexShrink: 1, padding: 20 }}>
            <div>
                <Button onClick={toggleVisible}>Click to {visible ? 'Hide' : 'Show'} container</Button>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>Animation <Switch checked={motion} onChange={onMotionChange} /></div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>Resizable <Switch checked={resizable} onChange={onResizableChange} /></div>
            </div>
        </div>
        <Container
            motion={motion}
            resizable={resizable}
            minWidth={250}
            maxWidth={'60%'}
            visible={visible}
            title={"Basic container demo"}
            style={resizable ? {} : { width: 200 }}
            onCancel={toggleVisible}
        >   
        </Container>
    </div>;
};

render(<ContainerDemo />);
```


### MCP Configuration

Use `MCPConfigure` to display, enable/disable, configure and search MCP tools.
- Use `options` and `customOptions` to set built‑in MCP tools and custom MCP tools
- Use `visible` to control show and hide, and `onCancel` to listen to user close behavior
- Use `onStatusChange` to handle enabling/disabling of MCP tools
- Use `onAddClick` to handle actions after clicking the Add button in custom MCP page
- Use `onConfigureClick` to listen to configuration of built‑in MCP tools, and `onEditClick` to listen to configuration of custom MCP tools

For other APIs of MCPConfigure, see [MCPConfigureProps](#MCPConfigureProps).

The type of MCP tool item is as follows:

```ts
interface MCPOption {
    icon?: ReactNode;
    label?: string;
    value?: string;
    desc?: ReactNode;
    active?: boolean;
    disabled?: boolean; 
    configure?: boolean // whether to show configure button
}
```

Usage example:

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Sidebar, MCPConfigure, Button, Modal, Form } from '@douyinfe/semi-ui';
import { IconSemiLogo, IconFigma } from '@douyinfe/semi-icons';

const defaultOptions = [
    {
        icon: <IconSemiLogo />,
        value: 'Semi mcp',
        label: "Semi",
        configure: true,
        desc: "Support searching Semi docs and source code to assist development"
    },
    {
        icon: <IconFigma />,
        value: 'figma',
        label: "Figma",
        desc: "Figma MCP Server connects Figma with AI development tools. Through Model Context Protocol (MCP), it exposes design data such as components and variables to AI, enabling intelligent generation from design to code and significantly improving development efficiency."
    }
];

const CustomOptionCreateModel = (props) => {
    const { visible, handleOk, handleCancel, formRef } = props;

    return (<Modal
        title="Custom MCP"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        closeOnEsc={true}
    >
        <Form
            ref={formRef} 
            layout='vertical' 
            onValueChange={values=>console.log(values)}
        >
            <Form.Input 
                rules={[{ required: true, message: 'Please enter MCP name' }]} 
                field='name' 
                label='MCP name' 
                style={{ width: '100%' }}
            />
            <Form.Input 
                initValue={'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png'}
                rules={[
                    { required: true, message: 'Please enter MCP icon URL' },
                    { 
                        validator: (rule, value) => {
                            const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\:\d+)?(?:\/[^\s]*)?$/i;
                            return urlRegex.test(value);
                        },
                        message: 'Please enter a valid MCP icon URL'
                    }
                ]} 
                field='src' 
                label='MCP icon URL' 
                style={{ width: '100%' }}
                
            />
            <Form.TextArea 
                rules={[{ required: true, message: 'Please enter MCP description' }]} 
                field='desc' 
                label="MCP description" 
                style={{ width: '100%' }}
            />
        </Form>
    </Modal>);
};

const containerStyle = {
    display: 'flex',
    height: '500px',
    border: '1px solid var(--semi-color-border)',
    borderRadius: 8,
    overflow: 'hidden',
    boxSizing: 'border-box'
};

let index = 1;

function McpConfigureDemo() {
    const [visible, setVisible] = useState(true);
    const toggleVisible = useCallback(() => {
        setVisible(visible => !visible);
    }, []);
    const [options, setOptions] = useState(defaultOptions);
    const [mVisible, setMVisible] = useState(false);
    const [customOptions, setCustomOptions] = useState([]);
    const formRef = useRef(null);

    const handleOk = useCallback(() => {
        formRef.current.formApi.validate().then(values => {
            const newOptions = [...customOptions, {
                label: values.name,
                icon: values.src,
                value: `mcp-${index++}`,
                desc: values.desc
            }];
            setCustomOptions(newOptions);
            setMVisible(false);
        }).catch(errors => {
            console.log('errors', errors);
        });
    }, [customOptions]);

    const showDialog = useCallback(() => {
        setMVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setMVisible(false);
    }, []);

    const onStatusChange = useCallback((options, custom) => {
        if (custom) {
            setCustomOptions(options);
        } else {
            setOptions(options);
        }
    }, []);

    const onAddClick = useCallback((e) => {
        showDialog();
    }, []);

    const onConfigureClick = useCallback((e, option) => {
        console.log('configure click', option);
    }, []);

    const onEditClick = useCallback((e, option) => {
        console.log('edit click', option);
    }, []);

    return (<div style={containerStyle}>
        <div style={{ flexGrow: 1, flexShrink: 1, padding: 20 }}>
            <Button onClick={toggleVisible}>{visible ? 'Close' : 'Open' } MCP configuration </Button>
        </div>
        <MCPConfigure
            style={{ width: 500 }}
            resizable={false}
            visible={visible}
            onCancel={toggleVisible}
            options={options}
            customOptions={customOptions}
            onStatusChange={onStatusChange}
            onAddClick={onAddClick}
            onConfigureClick={onConfigureClick}
            onEditClick={onEditClick}
        />
        <CustomOptionCreateModel
            formRef={formRef}
            visible={mVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
        />
    </div>);
}

render(<McpConfigureDemo />);
```


### References

Use the `Annotation` component to manage the display of reference sources.

- Use `activeKey` together with `onChange` to manage the currently expanded item
- `info` sets the reference content list

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Button, Annotation } from '@douyinfe/semi-ui';

const containerStyle = {
    display: 'flex',
    height: '500px',
    border: '1px solid var(--semi-color-border)',
    borderRadius: 8,
    overflow: 'hidden',
    boxSizing: 'border-box'
};

const defaultInfoList = [
    {
        header: 'Semi design introduction',
        key: '1',
        annotations: [
            {
                order: 1,
                type: 'video',
                duration: 4432,
                title: 'Semi Design is a design system',
                url: 'https://semi.design/',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                detail: 'A comprehensive, easy-to-use, and high-quality modern enterprise-level application UI solution',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            },
            {
                order: 2,
                title: 'Quick start',
                type: 'video',
                duration: 56,
                url: 'https://semi.design/',
                detail: 'A comprehensive, easy-to-use, and high-quality modern enterprise-level application UI solution',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            },
            {
                order: 3,
                title: 'Use components in a modular way',
                url: 'https://semi.design/',
                detail: `Semi provides dist in esm format, and the css of the component is only imported by the corresponding js.
When used in Webpack, Rspack, create-react-app or Vite projects, there is no need to configure any extra compilation items.`,
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            }
        ]
    },
    {
        header: 'Design resource',
        key: '2',
        annotations: [
            {
                order: 2,
                title: 'Semi Design resource',
                url: 'https://semi.design/',
                detail: 'Semi Design provides a wealth of design resources to help designers and developers collaborate efficiently. Whether you are a community user or an internal ByteDance designer, you can find UI kits and Figma plugins that fit your needs.',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design resource',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            }
        ]
    },
];

function Demo() {
    const [visible, setVisible] = useState(true);
    const [activeKey, setActiveKey] = useState('1');

    const toggleVisible = useCallback(() => {
        setVisible(visible => !visible);
    }, []);

    const onChange = useCallback((key) => {
        console.log('onChange', key);
        setActiveKey(key);
    }, []);

    const onClick = useCallback((e, item) => {
        console.log('onClick', e, item);
    }, []);

    return <div style={containerStyle}>
        <div style={{ flexGrow: 1, flexShrink: 1, padding: 20 }}>
            <Button onClick={toggleVisible}>{visible ? 'Show' : 'Hide'} references </Button>
        </div>
        <Annotation
            defaultSize={{ width: 420 }}
            visible={visible}
            onCancel={toggleVisible}
            activeKey={activeKey}
            info={defaultInfoList}
            onChange={onChange}
            onClick={onClick}
        />
    </div>;
}

render(<Demo />);

```

### Code Display

You can use `CodeItem` in `Sidebar` to display code. `CodeItem` is built based on [JsonViewer](/plus/jsonviewer) and [CodeHighlight](/plus/codehighlight).

- `content`: content string
- `isJson`: whether the content is json 
- `language`: programming language name, same as `language` in `CodeHighlight`
- `JsonViewerProps`: configure other JsonViewer props
- `CodeHighlightProps`: configure other CodeHighlight props

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Sidebar, RadioGroup, Radio } from '@douyinfe/semi-ui';

const { CodeItem } = Sidebar;

const code = `.semi-animation-react-demo-auto {
    button {
        height: 50px;
        border: 0;
        cursor: pointer !important;
        background: #777;
        color: white;
        outline: none;
        -webkit-appearance: none;
    }

    button:hover {
        background: #878787;
    }

    .auto-main {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto 1fr;
        background: #575757;
    }

    .content {
        grid-column: span 3;
    }

    .item {
        background: indianred;
        width: 100%;
        overflow: hidden;
        color: white;
    }

    .item p {
        margin: 0;
        padding: 10px;
    }
}
`;

const json = `{
    "axisX": {
        "title": {
            "visible": false,
            "position": "center"
        },
        "label": {
            "visible": true,
            "style": {
                "fontSize": 12,
                "fontWeight": 400,
                "lineHeight": 16,
                "fontFamily": [
                    "Inter"
                ],
                "fill": "rgba(0, 0, 0, 0.47843137254901963)"
            },
            "space": 12
        }
    }
}`;

const codeProps = {
    content: code,
    language: 'css',
};

const jsonProps = {
    isJson: true,
    content: json,
};

const CodeDemo = () => {
    const [type, setType] = useState('json');
    const onRadioChange = useCallback((e) => {
        setType(e.target.value);
    }, []);

    return <>
        <RadioGroup
            type='button'
            buttonSize='middle' 
            value={type}
            onChange={onRadioChange}
            style={{ marginBottom: 10 }}
        >
            <Radio value={'json'}>JSON</Radio>
            <Radio value={'css'}>CSS</Radio>
        </RadioGroup>
        <div style={{ height: 200, overflow: 'auto' }}>
            <CodeItem
                {...(type === 'json' ? jsonProps : codeProps)}
            />
        </div>
    </>;
};

render(<CodeDemo />);

```

### Code List

You can use `CodeContent` in `Sidebar` to display a list of code blocks.

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Sidebar } from '@douyinfe/semi-ui';

const { CodeContent } = Sidebar;

const defaultCodes = [
    {
        name: 'Component.js',
        key: 'code1',
        language: 'javascript',
        content: `import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

() => {
    const [stringData, setStringData] = useState([]);
    const [value, setValue] = useState('');
    const handleStringSearch = (value) => {
        let result;
        if (value) {
            result = ['gmail.com', '163.com', 'qq.com'].map(domain => value+domain);
        } else {
            result = [];
        }
        setStringData(result);
    };

    const handleChange = (value) => {
        console.log('onChange', value);
        setValue(value);
    };
    return (
        <AutoComplete
            data={stringData}
            value={value}
            showClear
            prefix={<IconSearch />}
            placeholder="Search... "
            onSearch={handleStringSearch}
            onChange={handleChange}
            style={{ width: 200 }}
        />
    );
};
` 
       
    }, 
    {
        name: 'Style.css',
        key: 'code2',
        language: 'css',
        content: `.semi-animation-react-demo-auto {
    button {
        height: 50px;
        border: 0;
        cursor: pointer !important;
        background: #777;
        color: white;
        outline: none;
        -webkit-appearance: none;
    }

    button:hover {
        background: #878787;
    }

    .auto-main {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto 1fr;
        background: #575757;
    }

    .content {
        grid-column: span 3;
    }

    .item {
        background: indianred;
        width: 100%;
        overflow: hidden;
        color: white;
    }

    .item p {
        margin: 0;
        padding: 10px;
    }
}
`
        
    },
    {
        name: 'Chart.json',
        key: 'code3',
        isJson: true,
        language: 'html',
        content: `{
    "axisX": {
        "title": {
            "visible": false,
            "position": "center"
        },
        "label": {
            "visible": true,
            "style": {
                "fontSize": 12,
                "fontWeight": 400,
                "lineHeight": 16,
                "fontFamily": [
                    "Inter"
                ],
                "fill": "rgba(0, 0, 0, 0.47843137254901963)"
            },
            "space": 12
        },
        "domainLine": {
            "visible": true,
            "style": {
                "lineWidth": 1,
                "stroke": "rgba(0, 0, 0, 0.12156862745098039)",
                "lineDash": []
            }
        },
        "tick": {
            "visible": false,
            "style": {
                "lineWidth": 1,
                "stroke": "rgba(255, 255, 255, 0)"
            }
        },
        "subTick": {
            "visible": false
        },
        "grid": {
            "visible": false
        },
        "subGrid": {
            "visible": false
        }
    }
}`
       
    },
];

const Demo = () => {
    const [activeKey, setActiveKey] = useState('code1');

    const onChange = useCallback((key) => {
        setActiveKey(key);
    }, []);

    return <div className='semi-sidebar-main'>
        <CodeContent
            style={{ width: 600 }}
            activeKey={activeKey}
            codes={defaultCodes}
            onChange={onChange}
        />
    </div>;
};

render(<Demo />);
```


### Rich Text Editor

You can use `FileItem` in `Sidebar` to view and edit rich text content. `FileItem` is implemented based on [tiptap](https://tiptap.dev/docs/editor/getting-started/overview).

- `content`: rich text content, supports the same types as TiptapContent
- `editable`: whether the content is editable
- `imgUploadProps`: configure image upload endpoint and how to set the src after upload. Use `action` to set upload url and `getUploadImageSrc` to return the uploaded image url, which will be used as src of img node in rich text

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Button, Sidebar, RadioGroup } from '@douyinfe/semi-ui';

const { FileItem } = Sidebar;

const defaultFileContent = `<h2>
  Semi Design Introduction
</h2>
<p>
  Semi Design is a design system designed, developed and maintained by the <strong>Douyin front-end team</strong> and the MED product design team. As a comprehensive, easy-to-use and high-quality modern application UI solution, Semi Design is refined from complex scenarios of various ByteDance business lines. It currently supports nearly a thousand platform products and serves more than 100,000 internal and external users. For details, see https://semi.design/start/introduction. The main features of Semi Design include:
</p>
<ul>
  <li>
    Simple and modern design.
  </li>
  <li>
    Theming solution with deeply customizable styles.
  </li>
</ul>
<p>
  Internationalization support for Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Portuguese and 20+ other languages. Date and time components support global time zones, and all components automatically adapt to RTL layout for Arabic.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  Based on the Foundation and Adapter cross-framework technical solution, it is easy to extend.
</p>
<blockquote>
  Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team.
  <br />
  — Semi Design
</blockquote>`;

const imgUploadProps = {
    action: 'https://api.semi.design/upload',
    getUploadImageSrc: (response) => {
        // response is the result returned from action. This is only a demo.
        // In real use you can read response and return the actual image url.
        return 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png';
    },
};

const FileDemo = () => {
    const [editable, setEditable] = useState(true);
    const [content, setContent] = useState(defaultFileContent);
    const toggleEditable = useCallback(() => {
        setEditable(editable => !editable);
    }, []);

    return <>
        <Button onClick={toggleEditable}>Editable: {editable ? 'Yes' : 'No'}</Button>
        <br /><br />
        <FileItem
            content={content}
            // onContentChange={(props) => { console.log('onContentChange', props); }}
            editable={editable}
            style={{ border: '1px solid var(--semi-color-border)', padding: 12 }}
            imgUploadProps={imgUploadProps}
        />
    </>;
};

render(<FileDemo />);

```


### Rich Text List

You can use `FileContent` in `Sidebar` to display a list of rich text documents.

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Sidebar } from '@douyinfe/semi-ui';

const { FileContent } = Sidebar;

const defaultFiles = [
    {
        key: 'file1',
        name: 'Semi Design Introduction',
        content: `
<h2>
  Semi Design Introduction
</h2>
<p>
  Semi Design is a design system designed, developed and maintained by the <strong>Douyin front-end team</strong> and the MED product design team. As a comprehensive, easy-to-use and high-quality modern application UI solution, Semi Design is refined from complex scenarios of various ByteDance business lines. It currently supports nearly a thousand platform products and serves more than 100,000 internal and external users. For details, see https://semi.design/start/introduction. The main features of Semi Design include:
</p>
<ul>
  <li>
    Simple and modern design.
  </li>
  <li>
    Theming solution with deeply customizable styles.
  </li>
</ul>
<p>
  Internationalization support for Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Portuguese and 20+ other languages. Date and time components support global time zones, and all components automatically adapt to RTL layout for Arabic.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  Based on the Foundation and Adapter cross-framework technical solution, it is easy to extend.
</p>
<blockquote>
  Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team.
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design is a design system designed, developed and maintained by the <strong>Douyin front-end team</strong> and the MED product design team. As a comprehensive, easy-to-use and high-quality modern application UI solution, Semi Design is refined from complex scenarios of various ByteDance business lines. It currently supports nearly a thousand platform products and serves more than 100,000 internal and external users. For details, see https://semi.design/start/introduction. The main features of Semi Design include:
</p>
<ul>
  <li>
    Simple and modern design.
  </li>
  <li>
    Theming solution with deeply customizable styles.
  </li>
</ul>
<p>
  Internationalization support for Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Portuguese and 20+ other languages. Date and time components support global time zones, and all components automatically adapt to RTL layout for Arabic.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  Based on the Foundation and Adapter cross-framework technical solution, it is easy to extend.
</p>
<blockquote>
  Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team.
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design is a design system designed, developed and maintained by the <strong>Douyin front-end team</strong> and the MED product design team. As a comprehensive, easy-to-use and high-quality modern application UI solution, Semi Design is refined from complex scenarios of various ByteDance business lines. It currently supports nearly a thousand platform products and serves more than 100,000 internal and external users. For details, see https://semi.design/start/introduction. The main features of Semi Design include:
</p>
<ul>
  <li>
    Simple and modern design.
  </li>
  <li>
    Theming solution with deeply customizable styles.
  </li>
</ul>
<p>
  Internationalization support for Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Portuguese and 20+ other languages. Date and time components support global time zones, and all components automatically adapt to RTL layout for Arabic.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  Based on the Foundation and Adapter cross-framework technical solution, it is easy to extend.
</p>
<blockquote>
  Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team.
  <br />
  — Semi Design
</blockquote>
`,
    },
    {
        key: 'file2',
        name: 'Semi Design DSM',
        content: `<h2>
  Semi Design DSM
</h2>
<p>Semi DSM is a design system management tool provided by Semi Design. It supports global and component-level style customization and keeps synchronization between Figma and front-end code. It is suitable for teams of all sizes. Whether you need to simplify workflows, improve team collaboration, or increase productivity, we provide features that work for you.</p>
`
    },
    {
        key: 'file3',
        name: 'React v19 Adaptation',
        content: `<h2>
  React v19 Adaptation
</h2>
<p>Since the release of React v19, React has introduced numerous underlying mechanism and API changes, including upgrades and adjustments to the render mechanism, ref, context, TypeScript types, and related deprecated APIs. To ensure that the Semi Design component library is smoothly compatible with both React v19 and lower versions, we provide the original component package @douyinfe/semi-ui for React versions below v19, as well as a new package @douyinfe/semi-ui-19 specifically adapted for React v19, so users can choose as needed. This guide will help you understand how to install, use, and the precautions to take.
Installation & Usage
If your project is using React v19, please use @douyinfe/semi-ui-19. For React versions below v19, continue using @douyinfe/semi-ui as before.</p>
`
    },
];

const Demo = () => {
    const [activeKey, setActiveKey] = useState('file1');

    const onChange = useCallback((key) => {
        setActiveKey(key);
    }, []);

    return <div className='semi-sidebar-main'>
        <FileContent
            style={{ width: 600 }}
            activeKey={activeKey}
            files={defaultFiles}
            onChange={onChange}
        />
    </div>;
};

render(<Demo />);
```


### Sidebar

The `Sidebar` has a main view (`mode` is `main`) and detail views (`mode` is `code`, `text` and other custom values).

In the main view you can configure the title through `title`, decide whether to show close button through `showClose`, and configure top button group through `options`.

For content rendering in the main view, you can pass a render function via `renderMainContent`. You can use `AnnotationContent` in `Annotation` to render references, `FileContent` in `Sidebar` to render rich text, and `CodeContent` to render code.

For detail views, if the content is rich text or code, set `mode` to `code` or `text` and provide `detailContent` to display the content with built-in code display component / rich text editor. If you want to customize how the detail view is rendered, you can use `renderDetailContent` to handle it yourself.


```jsx live=true dir="column" noInline=true
import React from 'react';
import { Sidebar, Annotation } from '@douyinfe/semi-ui';
import { IconSearch, IconBriefStroked, IconCodeStroked, IconModalStroked } from '@douyinfe/semi-icons';

const { FileContent, CodeContent } = Sidebar;
const { AnnotationContent } = Annotation;

const containerStyle = {
    display: 'flex',
    height: '800px',
    border: '1px solid var(--semi-color-border)',
    borderRadius: 8,
    overflow: 'hidden',
    boxSizing: 'border-box'
};

const optionList = [
    {
        icon: <IconSearch />,
        name: 'Search result',
        key: 'searchResult'
    },
    {
        icon: <IconBriefStroked />,
        name: 'File preview',
        key: 'filePreview'
    },
    {
        icon: <IconCodeStroked />,
        name: 'Code preview',
        key: 'codePreview'
    },
    {
        icon: <IconModalStroked />,
        name: 'Browser',
        key: 'network'
    }
];

const defaultCodes = [
    {
        name: 'Component.js',
        key: 'code1',
        language: 'javascript',
        content: `import React from 'react';
import { AutoComplete } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

() => {
    const [stringData, setStringData] = useState([]);
    const [value, setValue] = useState('');
    const handleStringSearch = (value) => {
        let result;
        if (value) {
            result = ['gmail.com', '163.com', 'qq.com'].map(domain => value+domain);
        } else {
            result = [];
        }
        setStringData(result);
    };

    const handleChange = (value) => {
        console.log('onChange', value);
        setValue(value);
    };
    return (
        <AutoComplete
            data={stringData}
            value={value}
            showClear
            prefix={<IconSearch />}
            placeholder="Search... "
            onSearch={handleStringSearch}
            onChange={handleChange}
            style={{ width: 200 }}
        />
    );
};
`
       
    }, 
    {
        name: 'Style.css',
        key: 'code2',
        language: 'css',
        content: `.semi-animation-react-demo-auto {
    button {
        height: 50px;
        border: 0;
        cursor: pointer !important;
        background: #777;
        color: white;
        outline: none;
        -webkit-appearance: none;
    }

    button:hover {
        background: #878787;
    }

    .auto-main {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto 1fr;
        background: #575757;
    }

    .content {
        grid-column: span 3;
    }

    .item {
        background: indianred;
        width: 100%;
        overflow: hidden;
        color: white;
    }

    .item p {
        margin: 0;
        padding: 10px;
    }
}
`
        
    },
    {
        name: 'Chart.json',
        key: 'code3',
        isJson: true,
        language: 'html',
        content: `{
    "axisX": {
        "title": {
            "visible": false,
            "position": "center"
        },
        "label": {
            "visible": true,
            "style": {
                "fontSize": 12,
                "fontWeight": 400,
                "lineHeight": 16,
                "fontFamily": [
                    "Inter"
                ],
                "fill": "rgba(0, 0, 0, 0.47843137254901963)"
            },
            "space": 12
        },
        "domainLine": {
            "visible": true,
            "style": {
                "lineWidth": 1,
                "stroke": "rgba(0, 0, 0, 0.12156862745098039)",
                "lineDash": []
            }
        },
        "tick": {
            "visible": false,
            "style": {
                "lineWidth": 1,
                "stroke": "rgba(255, 255, 255, 0)"
            }
        },
        "subTick": {
            "visible": false
        },
        "grid": {
            "visible": false
        },
        "subGrid": {
            "visible": false
        }
    }
}`
    },
];

const defaultFiles = [
    {
        key: 'file1',
        name: 'Semi Design Introduction',
        content: `
<h2>
  Semi Design Introduction
</h2>
<p>
  Semi Design is a design system designed, developed and maintained by the <strong>Douyin front-end team</strong> and the MED product design team. As a comprehensive, easy-to-use and high-quality modern application UI solution, Semi Design is refined from complex scenarios of various ByteDance business lines. It currently supports nearly a thousand platform products and serves more than 100,000 internal and external users. For details, see https://semi.design/start/introduction. The main features of Semi Design include:
</p>
<ul>
  <li>
    Simple and modern design.
  </li>
  <li>
    Theming solution with deeply customizable styles.
  </li>
</ul>
<p>
  Internationalization support for Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Portuguese and 20+ other languages. Date and time components support global time zones, and all components automatically adapt to RTL layout for Arabic.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  Based on the Foundation and Adapter cross-framework technical solution, it is easy to extend.
</p>
<blockquote>
  Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team.
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design is a design system designed, developed and maintained by the <strong>Douyin front-end team</strong> and the MED product design team. As a comprehensive, easy-to-use and high-quality modern application UI solution, Semi Design is refined from complex scenarios of various ByteDance business lines. It currently supports nearly a thousand platform products and serves more than 100,000 internal and external users. For details, see https://semi.design/start/introduction. The main features of Semi Design include:
</p>
<ul>
  <li>
    Simple and modern design.
  </li>
  <li>
    Theming solution with deeply customizable styles.
  </li>
</ul>
<p>
  Internationalization support for Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Portuguese and 20+ other languages. Date and time components support global time zones, and all components automatically adapt to RTL layout for Arabic.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  Based on the Foundation and Adapter cross-framework technical solution, it is easy to extend.
</p>
<blockquote>
  Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team.
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design is a design system designed, developed and maintained by the <strong>Douyin front-end team</strong> and the MED product design team. As a comprehensive, easy-to-use and high-quality modern application UI solution, Semi Design is refined from complex scenarios of various ByteDance business lines. It currently supports nearly a thousand platform products and serves more than 100,000 internal and external users. For details, see https://semi.design/start/introduction. The main features of Semi Design include:
</p>
<ul>
  <li>
    Simple and modern design.
  </li>
  <li>
    Theming solution with deeply customizable styles.
  </li>
</ul>
<p>
  Internationalization support for Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Portuguese and 20+ other languages. Date and time components support global time zones, and all components automatically adapt to RTL layout for Arabic.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  Based on the Foundation and Adapter cross-framework technical solution, it is easy to extend.
</p>
<blockquote>
  Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team.
  <br />
  — Semi Design
</blockquote>
`,
    },
    {
        key: 'file2',
        name: 'Semi Design DSM',
        content: `<h2>
  Semi Design DSM
</h2>
<p>Semi DSM is a design system management tool provided by Semi Design. It supports global and component-level style customization and keeps synchronization between Figma and front-end code. It is suitable for teams of all sizes. Whether you need to simplify workflows, improve team collaboration, or increase productivity, we provide features that work for you.</p>
`
    },
    {
        key: 'file3',
        name: 'React v19 Adaptation',
        content: `<h2>
  React v19 Adaptation
</h2>
<p>Since the release of React v19, React has introduced numerous underlying mechanism and API changes, including upgrades and adjustments to the render mechanism, ref, context, TypeScript types, and related deprecated APIs. To ensure that the Semi Design component library is smoothly compatible with both React v19 and lower versions, we provide the original component package @douyinfe/semi-ui for React versions below v19, as well as a new package @douyinfe/semi-ui-19 specifically adapted for React v19, so users can choose as needed. This guide will help you understand how to install, use, and the precautions to take.
Installation & Usage
If your project is using React v19, please use @douyinfe/semi-ui-19. For React versions below v19, continue using @douyinfe/semi-ui as before.</p>
`
    },
];

const defaultInfoList = [
    {
        header: 'Semi design introduction',
        key: '1',
        annotations: [
            {
                order: 1,
                type: 'video',
                duration: 4432,
                title: 'Semi Design is a design system designed',
                url: 'https://semi.design/',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                detail: ' As a comprehensive, easy-to-use, and high-quality modern enterprise-level application UI solution',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            },
            {
                order: 2,
                title: 'Quick start',
                type: 'video',
                duration: 56,
                url: 'https://semi.design/',
                detail: ' As a comprehensive, easy-to-use, and high-quality modern enterprise-level application UI solution',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            },
            {
                order: 3,
                title: 'Use components in a modular way',
                url: 'https://semi.design/',
                detail: `Semi provides esm format dist, and the css of the component is only imported by the corresponding js.
When used in Webpack, Rspack, create-react-app or Vite projects, there is no need to configure any compilation items.`,
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            }
        ]
    },
    {
        header: 'Design resource',
        key: '2',
        annotations: [
            {
                order: 2,
                title: 'Semi Design resource',
                url: 'https://semi.design/',
                detail: 'Semi Design provides a wealth of design resources to help designers and developers collaborate efficiently. Whether you are a community user or a ByteDance internal designer, you can find UI Kit resource and Figma plug-ins that suit you here.',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design resource',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            }
        ]
    },
];

const imgUploadProps = {
    action: 'https://api.semi.design/upload',
    getUploadImageSrc: (response) => {
        // response is the result returned from action. This is only a demo.
        // In real use you can read response and return the actual image url.
        return 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png';
    },
};

const SideBarDemo = () => {
    const [mode, setMode] = useState('main');
    const [activeKey, setActiveKey] = useState('codePreview');
    const [activeCodeKey, setActiveCodeKey] = useState('code1');
    const [activeFileKey, setActiveFileKey] = useState('file1');
    const [activeReferKey, setActiveReferKey] = useState('1');
    const [currentDetail, setCurrentDetail] = useState();

    const onExpand = useCallback((e, content, mode) => {
        setMode(mode);
        setCurrentDetail(content);
    }, []);

    const onActiveCodeKeyChange = useCallback((codeKey) => {
        setActiveCodeKey(codeKey);
    }, []);

    const onActiveFileKeyChange = useCallback((fileKey) => {
        setActiveFileKey(fileKey);
    }, []);

    const onActiveReferKeyChange = useCallback((referKey) => {
        setActiveReferKey(referKey);
    }, []);

    const renderMainContent = useCallback((activeKey) => {
        switch (activeKey) {
            case 'searchResult':
                return <AnnotationContent
                    activeKey={activeReferKey}
                    info={defaultInfoList}
                    onChange={onActiveReferKeyChange}
                />;
            case 'filePreview':
                return <FileContent
                    activeKey={activeFileKey}
                    files={defaultFiles}
                    onExpand={onExpand}
                    onChange={onActiveFileKeyChange}
                />;
            case 'codePreview':
                return <CodeContent
                    activeKey={activeCodeKey}
                    codes={defaultCodes}
                    onExpand={onExpand}
                    onChange={onActiveCodeKeyChange}
                />;
            case 'network':
                return <img
                    alt='network' 
                    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/test.jpg"
                    style={{ width: '100%' }}
                />;
            default:
                return;
        } 
    }, [activeCodeKey, activeFileKey, activeReferKey]);

    const renderDetailContent = useCallback((mode) => {
        switch (mode) {
            default:
                return;
        }
    }, []);
    
    const onActiveOptionChange = useCallback((e, key) => {
        setActiveKey(key);
    }, []);

    const onBackWard = useCallback((e, mode) => {
        setMode(mode);
    }, []);

    return <div style={containerStyle}>
        <div style={{ flexGrow: 1, flexShrink: 1, padding: 20 }}>Workspace placeholder</div>
        <Sidebar
            showClose={false}
            visible={true}
            motion={false}
            title="Agent 的工作空间"
            mode={mode}
            defaultSize={{ width: '60%' }}
            onActiveOptionChange={onActiveOptionChange}
            activeKey={activeKey}
            options={optionList}
            onBackWard={onBackWard}
            renderMainContent={renderMainContent}
            renderDetailContent={renderDetailContent}
            onExpand={onExpand}
            detailContent={currentDetail}
            imgUploadProps={imgUploadProps}
        />
    </div>;
};

render(<SideBarDemo />);
```


## API Reference

### Container

| Property | Description | Type | Default |
|------|----|------|-------|
| afterVisibleChange | Callback fired after visible state changes | (isVisible: boolean) => void |-  |
| className | Custom class name | string | - |
| containerRef | Ref of the container element | React.RefObject<HTMLDivElement\> | - |
| defaultSize | Default size (width/height), only effective when resizable is true | { width?: number \| string; height?: number \| string } | - |
| maxWidth | Max width, only effective when resizable is true | string \| number | - |
| minWidth | Min width, only effective when resizable is true | string \| number | -  |
| motion | Whether to enable animation | boolean | true |
| onCancel | Callback fired when user cancels/closes | (e: any) => void | - |
| renderHeader | Custom header render function | () => ReactNode | - |
| resizable | Whether the container is resizable | boolean | true |
| showClose | Whether to show close button | boolean | true  |
| style | Custom inline style | CSSProperties | - |
| title | Title content | ReactNode | - |
| visible | Whether the container is visible | boolean | - |

### MCPConfigure

Supports all props of [Container](#Container).

| Property | Description | Type | Default |
|------|----|------|-------|
| className | Custom class name | string | - |
| customOptions | Custom MCP options | [MCPReactOption](#MCPReactOption)[] | - |
| filter | Filter function to filter options by input value | (inputValue: string, option: MCPReactOption) => boolean | - |
| onAddClick | Callback when Add button is clicked | (e: MouseEvent) => void | - |
| onConfigureClick | Callback when configure button of built‑in MCP is clicked | (e: MouseEvent, option: MCPReactOption) => void | - |
| onEditClick | Callback when edit button of custom MCP is clicked | (e: MouseEvent, option: MCPReactOption) => void | - |
| onSearch | Callback when search is triggered, returns input value and whether it targets custom MCP | (inputValue: string, custom: boolean) => void | - |
| onStatusChange | Callback when status changes, returns options and whether they are custom | (options: MCPReactOption[], custom: boolean) => void | - |
| options | Built‑in MCP options | MCPReactOption[] | - |
| placeholder | Input placeholder | string | Please enter |
| renderItem | Custom option render function | (option: MCPReactOption,custom: boolean) => ReactNode | - |
| style | Custom inline style | CSSProperties | - |

#### MCPReactOption

| Property | Description | Type | Default |
|------|----|------|-------|
| active | Whether this MCP is active | boolean | false |
| configure | Whether to show configuration related operation/indicator | boolean | false |
| desc | Description content | ReactNode | - |
| disabled | Whether this MCP is disabled. When true, users cannot toggle its active state | boolean | false |
| icon | Icon element | ReactNode | - |
| label | Label text | string | - |
| value | Value | string | - |

### Annotation

Supports all props of [Container](#Container).

| Property | Description | Type | Default |
|------|----|------|-------|
| activeKey | Active key(s). Supports single or multiple values | string \| string[] |  |
| className | Custom class name | string |  |
| info | Annotation info list including header, key and reference details | { header: React.ReactNode; key: string; annotations: [AnnotationItem](#AnnotationItem)[] }[] |  |
| onChange | Callback when active item changes, returns current active key(s) | (key: string \| string[]) => void |  |
| onClick | Callback when a reference is clicked, returns mouse event and reference item | (e: MouseEvent, item: AnnotationItem) => void |  |
| renderItem | Custom render function for reference item | (annotation: AnnotationItem) => void |  |
| style | Custom inline style | React.CSSProperties |  |

#### AnnotationItem
| Property | Description | Type | Default |
|------|----|------|-------|
| detail | Extra detail text such as video description or text note | string | - |
| duration | Duration, usually used for videos, in seconds | number | - |
| img | Image url, such as video cover or illustration | string | - |
| logo | Logo url of the site/platform to which the content belongs | string | - |
| onClick | Callback when item is clicked, returns event and current reference item | (event: MouseEvent, item: AnnotationItem) => void | - |
| order | Order/index number | number | - |
| siteName | Name of the site/platform where the content belongs | string | - |
| title | Title | string | - |
| type | Content type | 'video' \| 'text' | - |
| url | Resource url. Clicking the reference will open this link | string | - |

### Sidebar

| Property | Description | Type | Default |
|------|----|------|-------|
| className | Custom class name | string | - |
| detailContent | Content in detail view | <ApiType detail='[CodeItemProps](#CodeItemProps) \| [FileItemProps](#FileItemProps) \| any'>DetailContent</ApiType> | - |
| fileEditable | Whether file content is editable | boolean | true |
| imgUploadProps | Image upload related config | ImageUploadNodeOptions | - |
| mode | Display mode, can be main, code, file or other custom strings | string | - |
| onActiveOptionChange | Callback when active option changes, returns mouse event and current active key | (e: MouseEvent, activeKey: string) => void | - |
| onBackWard | Callback when Back is clicked, returns mouse event and current mode, supports async | (e: MouseEvent, mode: string) => void \| Promise<any\> | - |
| onDetailContentCopy | Callback when content in detail view is copied, returns mouse event, content and copy result | (e: MouseEvent, content: string, res: boolean) => void | - |
| onFileContentChange | Callback when file content changes, returns updated content | (content: string) => void | - |
| renderDetailContent | Custom render function for detail view, receives current mode | (mode: string) => ReactNode | - |
| renderDetailHeader | Custom render function for detail header, receives current mode | (mode: string, detailContent: <ApiType detail='[CodeItemProps](#CodeItemProps) \| [FileItemProps](#FileItemProps) \| any'>DetailContent</ApiType>) => ReactNode | - |
| renderMainContent | Custom render function for main content, receives current active key | (activeKey: string) => ReactNode | - |
| style | Custom inline style | React.CSSProperties | - |

### Code

| Property | Description | Type | Default |
|------|----|------|-------|
| activeKey | Active key(s). Supports single string (single select) or string array (multi-select) | string \| string[] | - |
| className | Custom class name | string | - |
| codes | Code detail list | [CodeItemProps](#CodeItemProps)[] | - |
| onChange | Callback when active key changes, returns current active key(s) | (activeKey: string \| string[]) => void | - |
| onExpand | Callback when expand is clicked, returns mouse event, corresponding code item and current mode | (e: MouseEvent, code: [CodeItemProps](#CodeItemProps), mode: string) => void | - |
| style | Custom inline style | React.CSSProperties | - |

#### CodeItemProps

| Property | Description | Type | Default |
|------|----|------|-------|
| codeHighlightProps | Props for CodeHighlight | [CodeHighlightProps](/plus/codehighlight#API) |
| content | Code/text content | string | - |
| isJson | Whether content is JSON | boolean | false |
| jsonViewerProps | Props for JsonViewer | [JsonViewerProps](/plus/jsonviewer#JsonViewer) | - |
| language | Language type of the code (js, ts, json, etc.). Same as `language` in CodeHighlight | string | - |
| name | Name | string | - |

### File

#### FileContent

| Property | Description | Type | Default |
|------|----|------|-------|
| activeKey | Active key(s). Supports single string (single select) or string array (multi-select) | string \| string[] | - |
| className | Custom class name | string | - |
| files | File info list | [FileItemProps](#FileItemProps)[] | - |
| onChange | Callback when active key changes, returns current active key(s) | (activeKey: string \| string[]) => void | - |
| onExpand | Callback when a file item is expanded, returns mouse event, file item and current mode | (e: MouseEvent, file: FileItemProps, mode: string) => void | - |
| style | Custom inline style | React.CSSProperties | - |


#### FileItemProps

| Property | Description | Type | Default |
|------|----|------|-------|
| className | Custom class name | string |  |
| content | Text/content in the editor area | string |  |
| editable | Whether content is editable | boolean |  |
| extensions | Extension plugins list | Extension[] |  |
| imgUploadProps | Image upload related config | ImageUploadNodeOptions |  |
| key | Unique key | string |  |
| onContentChange | Callback when content changes, returns updated content | (content: string) => void |  |
| style | Custom inline style | React.CSSProperties |  |
