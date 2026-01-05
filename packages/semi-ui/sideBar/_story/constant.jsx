import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IconBytedanceLogo, IconFigma, IconWeibo, IconYoutube, IconSearch, IconBriefStroked, IconCodeStroked, IconModalStroked } from '@douyinfe/semi-icons';

export const defaultOptions = [
    {
        icon: <IconBytedanceLogo />,
        value: 'byteDance inner search',
        label: "字节内场搜索",
        configure: true,
        desc: "支持字节跳动的内场信息检索，支持飞书文档、Lark 百科词条、ByteCloude和ArcoSite作为搜索来源。"
    },
    {
        icon: <IconFigma />,
        value: 'figma',
        label: "Figma",
        desc: "Figma MCP Server 连接Figma与AI开发工具的功能。它通过标准化的模型上下文协MCP），将组件、变量等设计数据和上下文暴露给AI，从而实现从设计稿到代码的智能生成，显著提升开发效率。"
    },
    {
        icon: <IconWeibo />,
        value: 'weibo',
        configure: true,
        label: "微博",
        desc: "这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案"
    },
    {
        icon: <IconYoutube />,
        value: 'youtube',
        label: "Youtube",
        desc: "这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案"
    },
    {
        icon: <IconBytedanceLogo />,
        value: '1byteDance inner search',
        label: "1字节内场搜索",
        configure: true,
        desc: "1支持字节跳动的内场信息检索，支持飞书文档、Lark 百科词条、ByteCloude和ArcoSite作为搜索来源。"
    },
    {
        icon: <IconFigma />,
        value: '1figma',
        label: "1Figma",
        desc: "1Figma MCP Server 连接Figma与AI开发工具的功能。它通过标准化的模型上下文协MCP），将组件、变量等设计数据和上下文暴露给AI，从而实现从设计稿到代码的智能生成，显著提升开发效率。"
    },
    {
        icon: <IconWeibo />,
        value: '1weibo',
        configure: true,
        label: "1微博",
        desc: "1这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案"
    },
    {
        icon: <IconYoutube />,
        value: '1youtube',
        label: "1Youtube",
        desc: "1这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案"
    },
    {
        icon: <IconBytedanceLogo />,
        value: '2byteDance inner search',
        label: "2字节内场搜索",
        configure: true,
        desc: "2支持字节跳动的内场信息检索，支持飞书文档、Lark 百科词条、ByteCloude和ArcoSite作为搜索来源。"
    },
    {
        icon: <IconFigma />,
        value: '2figma',
        label: "2Figma",
        desc: "2Figma MCP Server 连接Figma与AI开发工具的功能。它通过标准化的模型上下文协MCP），将组件、变量等设计数据和上下文暴露给AI，从而实现从设计稿到代码的智能生成，显著提升开发效率。"
    },
    {
        icon: <IconWeibo />,
        value: '2weibo',
        configure: true,
        label: "2微博",
        desc: "2这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案"
    },
    {
        icon: <IconYoutube />,
        value: '2youtube',
        label: "2Youtube",
        desc: "2这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案这是一段描述文案"
    },
];

export const defaultInfoList = [
    {
        header: 'Semi design introduction',
        key: '1',
        annotations: [
            {
                order: 1,
                type: 'video',
                duration: 4432,
                title: 'Semi Design is a design system designed, developed and maintained by the Douyin front-end team and the MED product design team. ',
                url: 'https://semi.design/',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                detail: ' As a comprehensive, easy-to-use, and high-quality modern enterprise-level application UI solution, it is refined from the complex scenes of Bytedance various business lines, supports nearly a thousand platform products, and serves 100,000+ internal and external users.',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            },
            {
                order: 2,
                title: 'Quick start',
                type: 'video',
                duration: 56,
                url: 'https://semi.design/',
                detail: 'Semi Design is maintained by the Douyin front-end team and provides 70+ ready-to-use React components and the Figam Variant UI Kit. You can import and use it in any React project (new projects are recommended to be created via Rsbuild, CreateReactApp, or Vite). Currently, it supports React v16, v17, v18, and v19',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi Design',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            },
            {
                order: 3,
                title: 'Use components in a modular way',
                url: 'https://semi.design/',
                detail: `Semi provides esm format dist, and the css of the component is only imported by the corresponding js.
When used in Webpack, Rspack, create-react-app or Vite projects, there is no need to configure any compilation items.
All related resources are packaged on-demand at build process. Tree shaking will work without additional configuration.`,
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
    {
        header: 'Design to Code',
        key: '3',
        annotations: [
            {
                order: 3,
                title: 'Introduction',
                url: 'https://semi.design/',
                detail: 'D2C is the abbreviation of Design to Code, which means converting design drafts into code. As an auxiliary tool for frontend engineers, it can effectively improve the efficiency of design draft restoration and reduce the cost of manual Html/CSS coding.',
                logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
                siteName: 'Semi D2C',
                img: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg'
            }
        ]
    }
];

export const containerStyle = {
    display: 'flex',
    height: 'calc(100vh - 32px)',
    width: 'calc(100vw - 32px)',
    border: '1px solid var(--semi-color-border)',
    borderRadius: 8,
    overflow: 'hidden',
    boxSizing: 'border-box'
};

export const optionList = [
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

export const defaultCodes = [
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

export const defaultFiles = [
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

export const defaultFileContent = `
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

`;

export const imgUploadProps = {
    action: 'https://api.semi.design/upload',
    getUploadImageSrc: () => {
        return 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png';
    },
};