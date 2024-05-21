const semiCode = "下是一个 Semi 代码的使用示例：\n```jsx \nimport React from 'react';\nimport { Button } from 'semi-design';\nconst MyComponent = () => {\n  const handleClick = () => {\n  console.log('Button clicked');\n};\n  return (\n    <div>\n      <h1>Hello, Semi Design!</h1>\n      <Button onClick={handleClick}>Click me</Button>\n    </div>\n  );\n};\nexport default MyComponent;\n```";
const semiInfo = `
Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户[[1]](https://semi.design/zh-CN/start/introduction)。

Semi Design的愿景是成为企业应用前端不可或缺的一半，为企业应用前端提供坚实且优质的基础。设计系统的真正价值在于降低前端的搭建成本，同时提供优秀的设计和工程化标准，充分解放设计师与开发者的生产力，从而不断孵化出优秀的产品[[1]](https://semi.design/zh-CN/start/introduction)。

Semi Design的特点包括：

1. 设计：Semi Design通过提炼简洁轻量、现代化的设计风格，细致打磨原子组件的交互，并在字节跳动的海量业务场景下进行迭代，沉淀了一套优质的默认基础。它将保证Semi Design打造的企业应用产品具有连贯一致的"语言"，并且质量优于陈旧系统的基线。此外，Semi Design还充分进行模块化解耦，并开放自定义能力，方便用户进行二次裁剪与定制，搭建适用于不同形态产品的前端资产[[1]](https://semi.design/zh-CN/start/introduction)。

2. 主题化：Semi Design提供了强大的主题化方案，通过对数千个设计变量的分层和梳理，设计师和开发者可以在全局、乃至组件级别对表现层进行深度定制。这使得Semi Design可以轻松实现品牌一键定制，满足业务和品牌多样化的视觉需求。主题化方案还支持从线上到设计工具的实时同步，提高设计和研发的持续对齐效率，降低产研间的沟通成本[[1]](https://semi.design/zh-CN/start/introduction)。

3. 深色模式：为了兼容更多用户群体在不同生产环境下的使用偏好，Semi Design的任意主题均自动支持深色模式，并能在应用运行时动态切换。此外，Semi Design还允许用户在应用内局部区域开启深色模式，以兼容SDK或插件型产品的使用场景。用户还可以通过进阶设置实现应用和系统主题的自动保持一致。为了提升开发体验，Semi Design还提供了将未规范化的存量旧工程一键兼容到Semi暗色模式的CLI工具，通过自动化的方式规避迁移成本[[1]](https://semi.design/zh-CN/start/introduction)。

4. 国际化：Semi Design经过30+版本迭代，已具备完善的国际化特性。它覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。同时，Semi Design也支持海外地区的开发者使用，对站点和文档进行了双语适配，以保证开发无障碍[[1]](https://semi.design/zh-CN/start/introduction)。

5. 跨框架技术方案：Semi Design采用了一套跨前端框架技术方案，将每个组件的JavaScript拆分为Foundation和Adapter两部Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户[[1]](https://semi.design/zh-CN/start/introduction)。

---
Learn more:
1. [Introduction 介绍 - Semi Design](https://semi.design/zh-CN/start/introduction)
2. [Getting Started 快速开始 - Semi Design](https://semi.design/zh-CN/start/getting-started)
3. [Semi D2C 设计稿转代码的演进之路 - 知乎](https://zhuanlan.zhihu.com/p/667189184)
`;

const tempAttachment = [
    {
        uid: '1',
        name: 'dyBag.jpeg',
        status: 'success',
        size: '130KB',
        preview: true,
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
    },
    {
        name: "a.txt",
        size: "0.03KB",
        uid: "3defa077-2fc3-49fe-962e-4d6aca983cfe",
        percent: 0,
        fileInstance: {
            uid: "3defa077-2fc3-49fe-962e-4d6aca983cfe",
            lastModified: 1713927714309,
            type: "text/plain",
            webkitRelativePath: ""
        },
        url: "blob:http://localhost:6006/57479c3d-3daf-4920-9689-e11f7fff7cd0"
    },
    {
        name: "avatar.jpeg",
        percent: 0,
        preview: true,
        size: "161.6KB",
        uid: "976c04d6-3f3c-4cf8-bf34-e063068908c9",
        url: "blob:http://localhost:6006/de2528d3-490c-4231-bbef-11118a48242f"
    }
];

const initMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design",
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: semiInfo,
    },
    {
        role: 'user',
        id: '4',
        createAt: 1715676751919,
        content: "semi design Button 使用示例",
    },
    {
        role: 'assistant',
        id: '5',
        createAt: 1715676751919,
        content: semiCode
    },
];

const infoWithAttachment = [
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "用于查附件的样式",
        attachment: [tempAttachment[0], tempAttachment[1]],
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: '用于查看附件的样式',
        attachment: [tempAttachment[0], tempAttachment[1]],
    },
];


const roleInfo = {
    user: {
        name: 'User Test',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
    },
    assistant: {
        name: 'Assistant Test',
        avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
    },
    system: {
        name: 'System Test'
    }
};

const commonOuterStyle = {
    border: '1px solid var(--semi-color-border)',
    borderRadius: '16px',
};

const hintsExample = [
    "告诉我更多",
    "Semi Design 的组件有哪些？",
    "Semi Design 官网及 github 仓库地址是？",
];

const simpleInitMessage = [
    {
        role: 'system',
        id: '1',
        createAt: 1715676751919,
        content: "Hello, I'm your AI assistant.",   
    },
    {
        role: 'user',
        id: '2',
        createAt: 1715676751919,
        content: "介绍一下 semi design",
    },
    {
        role: 'assistant',
        id: '3',
        createAt: 1715676751919,
        content: "Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统。",
    },
];

export {
    initMessage,
    roleInfo,
    commonOuterStyle,
    hintsExample,
    infoWithAttachment,
    simpleInitMessage,
    semiCode
};
