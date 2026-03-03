---
localeCode: zh-CN
order: 103
category: Ai
title: Sidebar 侧边信息栏
icon: doc-sidebar
width: 60%
brief: 展示 AI 场景下的配置和详情信息
showNew: true
---

## 使用场景

侧边信息栏主要用于在 AI 场景下，用于信息展示，功能配置。包括 MCP 配置、参考来源、代码预览、富文本预览及编辑等功能


## 代码演示

### 基础容器

侧边信息栏的基础容器，基础容器是[MCP 配置](#mcp-配置)、[参考来源](#参考来源)、以及[侧边消息栏](#侧边消息栏)的基础容器。

- `visible` 配置 `onCancel` 使用控制显示和隐藏
- `title`设置标题
- `motion`设置是否有展开动画
- `resizable`设置宽度是否可伸缩，为 `true` 时候可通过 `minSize`，`maxSize` 设置最小，最大宽度

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
                <Button onClick={toggleVisible}>点我{visible ? '隐藏' : '展示' }容器</Button>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>是否有动画 <Switch checked={motion} onChange={onMotionChange} /></div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>是否可伸缩 <Switch checked={resizable} onChange={onResizableChange} /></div>
            </div>
        </div>
        <Container
            motion={motion}
            resizable={resizable}
            minWidth={250}
            maxWidth={'60%'}
            visible={visible}
            title={"基础容器示例"}
            style={resizable ? {} : { width: 200 }}
            onCancel={toggleVisible}
        >   
        </Container>
    </div>;
};

render(<ContainerDemo />);
```


### MCP 配置

使用 `MCPConfigure` 进行 MCP 工具的展示、启用/关闭、配置及搜索 
- 通过 `options` 和 `customOptions` 设置内置的 MCP 工具和自定义 MCP 工具
- 通过 `visible` 设置组件的显示和隐藏, 使用 `onCancel` 监听用户的关闭行为
- 使用 `onStatusChange` 自定义处理 MCP 工具的启用/关闭
- 使用 `onAddClick` 处理自定义 MCP 页的点击添加按钮后的操作
- 可通过 `onConfigureClick` 监听内置 MCP 工具的配置，通过 `onEditClick` 监听自定义 MCP 工具的配置

其他 MCPConfigure 的 API 见 [MCPConfigureProps](#MCPConfigureProps)

传入 MCP 工具项的类型如下

```ts
interface MCPOption {
    icon?: ReactNode;
    label?: string;
    value?: string;
    desc?: ReactNode;
    active?: boolean;
    disabled?: boolean; 
    configure?: boolean //是否显示配置按钮
}
```

用例如下：

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
        desc: "支持 Semi 的文档、源码搜索，辅助开发"
    },
    {
        icon: <IconFigma />,
        value: 'figma',
        label: "Figma",
        desc: "Figma MCP Server 连接Figma与AI开发工具的功能。它通过标准化的模型上下文协MCP），将组件、变量等设计数据和上下文暴露给AI，从而实现从设计稿到代码的智能生成，显著提升开发效率。"
    }
];

const CustomOptionCreateModel = (props) => {
    const { visible, handleOk, handleCancel, formRef } = props;

    return (<Modal
        title="自定义 MCP"
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
                rules={[{ required: true, message: '请输入 MCP 名称' }]} 
                field='name' 
                label='MCP 名称' 
                style={{ width: '100%' }}
            />
            <Form.Input 
                initValue={'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png'}
                rules={[
                    { required: true, message: '请输入 MCP 图标 URL' },
                    { 
                        validator: (rule, value) => {
                            const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:\:\d+)?(?:\/[^\s]*)?$/i;
                            return urlRegex.test(value);
                        },
                        message: '请输入有效的 MCP 图标 URL'
                    }
                ]} 
                field='src' 
                label='MCP 图标 URL' 
                style={{ width: '100%' }}
                
            />
            <Form.TextArea 
                rules={[{ required: true, message: '请输入 MCP 介绍' }]} 
                field='desc' 
                label="MCP 介绍" 
                style={{ width: '100%' }}
            />
        </Form>
    </Modal>);
};

let index = 1;

const containerStyle = {
    display: 'flex',
    height: '500px',
    border: '1px solid var(--semi-color-border)',
    borderRadius: 8,
    overflow: 'hidden',
    boxSizing: 'border-box'
};

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
            <Button onClick={toggleVisible}>{visible ? '关闭' : '开始' } MCP 配置 </Button>
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


### 参考来源

使用 `Annotation` 组件可以管理参考来源的展示

- `activeKey`配合 `onChange` 管理当前展开的项
- `info` 设置参考来源的具体内容

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
            <Button onClick={toggleVisible}>{visible ? '关闭' : '展示'}参考来源 </Button>
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

### 代码展示

可通过 `Sidebar` 中的 `CodeItem` 展示代码，`CodeItem` 基于 [JsonViewer](/zh-CN/plus/jsonviewer) 以及 [CodeHighlight](/zh-CN/plus/codehighlight) 实现。

- `content`: 内容字符串
- `isJson`: 是否为 json 
- `language`: 编程语言名称，同 `CodeHighlight` 的 language
- `JsonViewerProps`: 配置其他 JsonViewer 参数
- `CodeHighlightProps`: 配置其他 CodeHighlight 参数

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

### 代码列表

用户可通过 `Sidebar` 中的 `CodeContent` 组件展示代码列表信息。

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
            placeholder="搜索... "
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


### 富文本编辑器

可通过 `Sidebar` 中的 `FileItem` 查看、编辑富文本内容， `FileItem` 基于 [tiptap](https://tiptap.dev/docs/editor/getting-started/overview) 实现。

- `content`：富文本内容， 支持类型同 TiptapContent
- `editable`: 设置是否可编辑
- `imgUploadProps`： 设置图片上传路径以及图片上传后 src 的设置，通过 `action` 设置上传地址，通过 `getUploadImageSrc` 函数返回图片上传后地址，用于富文本中 img 节点的 src

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Button, Sidebar, RadioGroup } from '@douyinfe/semi-ui';

const { FileItem } = Sidebar;

const defaultFileContent = `<h2>
  Semi Design 介绍
</h2>
<p>
  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：
</p>
<ul>
  <li>
    设计简洁、现代化。
  </li>
  <li>
    提供主题方案，可深度样式定制。
  </li>
</ul>
<p>
  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。
</p>
<blockquote>
  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统
  <br />
  — Semi Design
</blockquote>`;

const imgUploadProps = {
    action: 'https://api.semi.design/upload',
    getUploadImageSrc: (response) => {
        // response 是 action 结果的返回值，此处仅为示例，实际使用时可 response 返回图片上传后的 src
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
        <Button onClick={toggleEditable}>是否可编辑: {editable ? '是' : '否'}</Button>
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


### 富文本列表

用户可通过 `Sidebar` 中的 `FileContent` 组件展示富文本列表信息。

```jsx live=true dir="column" noInline=true
import React from 'react';
import { Sidebar } from '@douyinfe/semi-ui';

const { FileContent } = Sidebar;

const defaultFiles = [
    {
        key: 'file1',
        name: 'Semi Design 介绍',
        content: `
<h2>
  Semi Design 介绍
</h2>
<p>
  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：
</p>
<ul>
  <li>
    设计简洁、现代化。
  </li>
  <li>
    提供主题方案，可深度样式定制。
  </li>
</ul>
<p>
  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。
</p>
<blockquote>
  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：
</p>
<ul>
  <li>
    设计简洁、现代化。
  </li>
  <li>
    提供主题方案，可深度样式定制。
  </li>
</ul>
<p>
  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。
</p>
<blockquote>
  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：
</p>
<ul>
  <li>
    设计简洁、现代化。
  </li>
  <li>
    提供主题方案，可深度样式定制。
  </li>
</ul>
<p>
  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。
</p>
<blockquote>
  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统
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
<p>Semi DSM is a design system management tool provided by Semi Design. It supports global and component-level style customization and keeps synchronization between Figma and front-end code. Suitable for teams of all sizes. Whether you need to simplify workflow, improve team collaboration, or increase productivity, we have features suitable for you.</p>
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


### 侧边信息栏

侧边信息栏 `Sidebar` 有主视图（`mode` 为 `main`）和详情视图（`mode` 为 `code`、`text` 及其他）。

主视图可以通过 `title` 配置标题，通过 `showClose` 决定是否展示关闭按钮，通过 `options` 设置顶部的按钮组。

对于主视图的内容渲染，可通过 `renderMainContent` 传入渲染函数。可使用 `Annotation` 中的 `AnnotationContent` 渲染参考来源，使用 `Sidebar` 中内置的 `FileContent` 渲染富文本, `CodeContent` 渲染代码。

对于详情视图，如果是富文本或者代码，分别设置 `mode` 为 `code`、`text`，通过 `detailContent` 设置显示内容，即可通过内置的代码显示组件， 富文本编辑器进行显示，如果想要自定义详情视图的展示，则通过 `renderDetailContent` 自行处理渲染即可。


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
        name: '查看搜索',
        key: 'searchResult'
    },
    {
        icon: <IconBriefStroked />,
        name: '文件预览',
        key: 'filePreview'
    },
    {
        icon: <IconCodeStroked />,
        name: '代码预览',
        key: 'codePreview'
    },
    {
        icon: <IconModalStroked />,
        name: '浏览器',
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
            placeholder="搜索... "
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
        name: 'Semi Design 介绍',
        content: `
<h2>
  Semi Design 介绍
</h2>
<p>
  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：
</p>
<ul>
  <li>
    设计简洁、现代化。
  </li>
  <li>
    提供主题方案，可深度样式定制。
  </li>
</ul>
<p>
  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。
</p>
<blockquote>
  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：
</p>
<ul>
  <li>
    设计简洁、现代化。
  </li>
  <li>
    提供主题方案，可深度样式定制。
  </li>
</ul>
<p>
  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。
</p>
<blockquote>
  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统
  <br />
  — Semi Design
</blockquote>
<p>
  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：
</p>
<ul>
  <li>
    设计简洁、现代化。
  </li>
  <li>
    提供主题方案，可深度样式定制。
  </li>
</ul>
<p>
  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。
</p>
<blockquote>
  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统
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
<p>Semi DSM is a design system management tool provided by Semi Design. It supports global and component-level style customization and keeps synchronization between Figma and front-end code. Suitable for teams of all sizes. Whether you need to simplify workflow, improve team collaboration, or increase productivity, we have features suitable for you.</p>
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
        <div style={{ flexGrow: 1, flexShrink: 1, padding: 20 }}>工作区占位</div>
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


## API 参考

### Container

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| afterVisibleChange | 可见状态变化后的回调函数 | (isVisible: boolean) => void |-  |
| className | 自定义类名 | string | - |
| containerRef | 容器元素的 Ref 引用 | React.RefObject<HTMLDivElement\> | - |
| defaultSize | 默认尺寸（宽度/高度）, 仅在 resizable 为 true 时生效 | { width?: number \| string; height?: number \| string } | - |
| maxWidth | 最大宽度, 仅在 resizable 为 true 时生效 | string \| number | - |
| minWidth | 最小宽度, 仅在 resizable 为 true 时生效 | string \| number | -  |
| motion | 是否开启动画效果 | boolean | true |
| onCancel | 取消操作的回调函数 | (e: any) => void | - |
| renderHeader | 自定义头部渲染函数 | () => ReactNode | - |
| resizable | 是否可拉伸 | boolean | true |
| showClose | 是否显示关闭按钮 | boolean | true  |
| style | 自定义内联样式 | CSSProperties | - |
| title | 标题内容 | ReactNode | - |
| visible | 是否可见 | boolean | - |

### MCPConfigure

支持 [Container](#Container) 的所有参数

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| className | 自定义类名 | string | - |
| customOptions | 自定义选项列表 | [MCPReactOption](#MCPReactOption)[] | - |
| filter | 筛选函数，用于根据输入值过滤选项 | (inputValue: string, option: MCPReactOption) => boolean | - |
| onAddClick | 新增按钮点击事件回调 | (e: MouseEvent) => void | - |
| onConfigureClick | 配置按钮点击事件回调 | (e: MouseEvent, option: MCPReactOption) => void | - |
| onEditClick | 编辑按钮点击事件回调 | (e: MouseEvent, option: MCPReactOption) => void | - |
| onSearch | 搜索事件回调，返回输入值和是否为自定义标识 | (inputValue: string, custom: boolean) => void | - |
| onStatusChange | 状态变化事件回调，返回选项列表和是否为自定义标识 | (options: MCPReactOption[], custom: boolean) => void | - |
| options | 基础选项列表 | MCPReactOption[] | - |
| placeholder | 输入框占位提示文字 | string | 请输入 |
| renderItem | 自定义选项渲染函数 | (option: MCPReactOption,custom: boolean) => ReactNode | - |
| style | 自定义内联样式 | CSSProperties | - |

#### MCPReactOption

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| active | 是否处于激活状态 | boolean | false |
| configure | 是否显示配置相关操作/标识 | boolean | false |
| desc | 描述内容 | ReactNode | - |
| disabled | 是否禁用，为 true 时用户无法更改配置的激活与否状态 | boolean | false |
| icon | 图标元素 | ReactNode | - |
| label | 标签文本 | string | - |
| value | 对应的值 | string | - |

### Annotation

支持 [Container](#Container) 的所有参数

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| activeKey | 当前激活项的键值，支持单个或多个 | string \| string[] | - |
| className | 自定义类名 | string | - |
| info | 注解信息列表，包含头部、键值、参考来源详情等内容 | { header: React.ReactNode; key: string; annotations: [AnnotationItem](#AnnotationItem)[] }[] | - |
| onChange | 激活项变更时的回调函数，返回当前激活的键值 | (key: string \| string[]) => void | - |
| onClick | 点击参考来源时的回调函数，返回鼠标事件和对应的参考来源 | (e: MouseEvent, item: AnnotationItem) => void | - |
| renderItem | 自定义参考来源的渲染函数 | (annotation: AnnotationItem) => void | - |
| style | 自定义内联样式 | React.CSSProperties | - |

#### AnnotationItem
| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| detail | 内容详情/补充说明（如视频简介、文本备注等） | string | - |
| duration | 时长（通常为视频时长，单位：秒） | number | - |
| img | 图片地址（如视频封面图、文本配图地址） | string | - |
| logo | 站点/内容所属平台的 logo 图片地址 | string | - |
| onClick | 点击事件回调函数，返回点击事件对象和当前参考来源数据 | (event: MouseEvent, item: AnnotationItem) => void | - |
| order | 引用序号（用于内容排序/标注序号展示） | number | - |
| siteName | 内容所属的站点/平台名称 | string | - |
| title | 内容标题 | string | - |
| type | 内容类型 | 'video' \| 'text' | - |
| url | 资源链接，点击参考来源将跳转此地址 | string | - |

### Sidebar

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| className | 自定义类名 | string | - |
| detailContent | 详情区域的内容 | <ApiType detail='[CodeItemProps](#CodeItemProps) \| [FileItemProps](#FileItemProps) \| any'>DetailContent</ApiType>  | - |
| fileEditable | 文件内容是否可编辑 | boolean | true |
| imgUploadProps | 图片上传相关配置属性 | ImageUploadNodeOptions | - |
| mode | 展示模式，可选值为 main、code、file 或其他自定义字符串 | string | - |
| onActiveOptionChange | 激活选项变更时的回调函数，返回鼠标事件和当前激活项键值 | (e: MouseEvent, activeKey: string) => void | - |
| onBackWard | 返回操作的回调函数，返回鼠标事件和当前模式，支持异步处理 | (e: MouseEvent, mode: string) => void \| Promise<any\> | - |
| onDetailContentCopy | 详情内容复制操作的回调函数，返回鼠标事件、复制的内容和复制结果 | (e: MouseEvent, content: string, res: boolean) => void | - |
| onFileContentChange | 文件内容变更时的回调函数，返回变更后的文件内容 | (content: string) => void | - |
| renderDetailContent | 自定义详情区域内容的渲染函数，接收当前模式作为参数 | (mode: string) => ReactNode | - |
| renderDetailHeader | 自定义详情区域头部的渲染函数，接收当前模式作为参数 | (mode: string, detailContent: <ApiType detail='[CodeItemProps](#CodeItemProps) \| [FileItemProps](#FileItemProps) \| any'>DetailContent</ApiType>) => ReactNode | - |
| renderMainContent | 自定义主内容区域的渲染函数，接收当前激活项键值作为参数 | (activeKey: string) => ReactNode | - |
| style | 自定义内联样式 | React.CSSProperties | - |

### Code

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| activeKey | 当前激活项的标识，支持单个字符串（单选）或字符串数组（多选） | string \| string[] | - |
| className | 自定义类名，用于覆盖组件样式 | string | - |
| codes | 代码详情列表 | [CodeItemProps](#CodeItemProps)[] | - |
| onChange | 激活项变更时的回调函数，返回当前激活的项标识 | (activeKey: string \| string[]) => void | - |
| onExpand | 展开操作的回调函数，返回鼠标事件和对应的代码详情项 | (e: MouseEvent, code: [CodeItemProps](#CodeItemProps), mode: string) => void | - |
| style | 自定义内联样式 | React.CSSProperties | - |


#### CodeItemProps

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| codeHighlightProps | codeHighlight 的参数 | [CodeHighlightProps](/zh-CN/plus/codehighlight#API) |
| content | 代码/文本内容 | string | - |
| isJson | 是否为 JSON 格式内容 | boolean | - |
| jsonViewerProps | JsonViewer 的参数 | [JsonViewerProps](/zh-CN/plus/jsonviewer#JsonViewer) | - |
| language | 代码语言类型（如 js、ts、json 等）， 同 codeHighlight 的| string | - |


### File

#### FileContent

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| activeKey | 当前激活项的标识，支持单个字符串（单选）或字符串数组（多选） | string \| string[] | - |
| className | 自定义类名，用于覆盖组件样式 | string | - |
| files | 文件信息列表 | [FileItemProps](#FileItemProps)[] | - |
| onChange | 激活项变更时的回调函数，返回当前激活的项标识 | (activeKey: string \| string[]) => void | - |
| onExpand | 展开文件项的回调函数，返回鼠标事件和对应的文件信息项 | (e: MouseEvent, file: FileItemProps, mode: string) => void | - |
| style | 自定义内联样式，用于调整组件样式 | React.CSSProperties | - |


#### FileItemProps

| 属性 | 说明 | 类型 | 默认值 |
|------|----|------|-------|
| className | 自定义类名 | string | - |
| content | 编辑区域的文本/内容 | string | - |
| editable | 是否可编辑 | boolean | - |
| extensions | 扩展插件列表 | Extension[] | - |
| imgUploadProps | 图片上传相关配置属性 | ImageUploadNodeOptions | - |
| key | 唯一标识键值 | string | - |
name | 名称 | string | -'
| onContentChange | 内容变更时的回调函数，返回变更后的内容 | (content: string) => void | - |
| style | 自定义内联样式 | React.CSSProperties | - |
