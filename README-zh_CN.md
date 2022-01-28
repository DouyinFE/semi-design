<div align="center">
<article style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <p align="center"><img width="300" src="https://lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/SemiLogo/Logo_1576122865926.png" /></p>
    <h1 style="width: 100%; text-align: center;">Semi-UI</h1>
    <p>
        现代、全面、灵活的设计系统和 UI 库。 快速搭建美观的 React 应用。
    </p>
</article>
    
<div align="center">

[![NPM][npm-badge]][npm-url] [![FIGMA][figma-badge]][figma-url] [![LICENSE][license-badge]][license-url] 
[![BUILD-JS][build-js-badge]][build-js-url] [![BUILD-CSS][build-css-badge]][build-css-url] [![CODECOV][codecov-badge]][codecov-url] [![Chromatic][chromatic-badge]][chromatic-url] [![Cypress][cypress-badge]][cypress-url]


[npm-badge]: https://img.shields.io/npm/v/@douyinfe/semi-ui.svg
[npm-url]: https://www.npmjs.com/package/@douyinfe/semi-ui
[figma-badge]: https://img.shields.io/badge/Figma-UIKit-%2318a0fb
[figma-url]: https://www.figma.com/@semi

[license-badge]: https://img.shields.io/npm/l/@douyinfe/semi-ui
[license-url]: https://github.com/DouyinFE/semi-design/blob/main/LICENSE
[codecov-badge]: https://img.shields.io/codecov/c/gh/DouyinFE/semi-design
[codecov-url]: https://app.codecov.io/gh/DouyinFE/semi-design
[chromatic-badge]: https://img.shields.io/badge/test-chromatic-f52
[chromatic-url]: https://www.chromatic.com/
[cypress-badge]: https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/k83u7j&style=flat&logo=cypress
[cypress-url]: https://dashboard.cypress.io/projects/k83u7j/runs

[build-js-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/umd/semi-ui.min.js?label=semi.min.js&compression=gzip
[build-js-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/umd/semi-ui.min.js
[build-css-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/css/semi.min.css?label=semi.min.css&compression=gzip
[build-css-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/css/semi.min.css

</div>

<p>
    <img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-info-1.gif" />
</p>

简体中文 | [English](./README.md)

</div>

# 🎉 特性

- 💪 58+高质量组件
- 💅 强大的主题定制，多达两千多个 Design Token，深入定制每一处细节
- 🌍 国际化支持 14 种语言
- 👏 使用 TypeScript，良好的类型定义
- 🥳 支持 SSR

# 🔥 安装

```sh
# 使用 npm
npm install @douyinfe/semi-ui

# 使用 yarn
yarn add @douyinfe/semi-ui

```

# 👍 使用

这是一个快速开始的例子：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Switch } from '@douyinfe/semi-ui';

const App = () => (
  <>
    <Button type='primary'>primary button</Button>
    <Switch size='large' />
  </>
);

ReactDOM.render(<App />, document.querySelector('#app'));
```

[Semi UI 官网](https://semi.design) 拥有上千个支持实时调试的例子，欢迎体验使用。

# 📌 文档

* [快速开始](https://semi.design/zh-CN/start/getting-started)
* [组件总览](https://semi.design/zh-CN/start/overview)
* [自定义主题](https://semi.design/zh-CN/start/customize-theme)
* [Design Tokens](https://semi.design/zh-CN/basic/tokens)
* [暗色模式](https://semi.design/zh-CN/start/dark-mode)
* [Icons](https://semi.design/zh-CN/basic/icon)
* [全局配置](https://semi.design/zh-CN/other/configprovider)
* [国际化](https://semi.design/zh-CN/other/locale)
* [常见问题](https://semi.design/zh-CN/start/faq)
* [CHANGELOG](https://semi.design/zh-CN/start/changelog)

# 👌 平台支持

Semi UI 支持所有主流浏览器。

|[<img alt="chrome" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/chrome/chrome.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/chrome/chrome.png)<br>chrome|[<img alt="firefox" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/firefox/firefox.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/firefox/firefox.png)<br>firefox|[<img alt="safari" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/safari/safari.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/safari/safari.png)<br>safari|[<img alt="IE/Edge" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/edge/edge.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/edge/edge.png)<br> IE/Edge|[<img alt="electron" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/electron/electron.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/electron/electron.png)<br>Electron|
|--|--|--|--|--|
| latest 2 versions | latest 2 versions | latest 2 versions | Edge | latest 2 versions |

# 👐 贡献指南

阅读贡献指南了解我们的开发流程，包括开发规范、测试规范和构建规范等。

[CONTRIBUTING](CONTRIBUTING.md)


# 👨‍👨‍👧‍👦 交流群

有任何问题可以进群交流，我们会及时给予解答和反馈。

加入[用户群](https://bytedance.feishu.cn/docs/doccnw93Dujm3UCkHRDTMTm1qwe#).

# 💖 Thanks

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

感谢 [Chromatic](https://www.chromatic.com/) 提供可视化测试平台，帮助我们审查 UI 更改和提供视觉回归测试。

<a href="https://www.cypress.io/"><img src="https://user-images.githubusercontent.com/26477537/147624641-1274a91d-bc4c-463e-af1a-dbf15de54c49.png" width="90" height="30" alt="Cypress" /></a>

感谢 [Cypress](https://www.cypress.io/) 提供 E2E 测试。

# 🎈 协议

Semi UI 使用 [MIT 协议](LICENSE)
