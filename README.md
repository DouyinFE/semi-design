<div align="center">
<article style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <p align="center"><img width="300" src="https://lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/SemiLogo/Logo_1576122865926.png" /></p>
    <h1 style="width: 100%; text-align: center;">Semi-UI</h1>
    <p>
        A modern, comprehensive, flexible design system and UI library. Quickly build beautiful React apps.
    </p>
</article>
    
<div align="center">

[![NPM][npm-badge]][npm-url] [![FIGMA][figma-badge]][figma-url] [![LICENSE][license-badge]][license-url]
[![BUILD-JS][build-js-badge]][build-js-url] [![BUILD-CSS][build-css-badge]][build-css-url] [![CODECOV][codecov-badge]][codecov-url] [![Chromatic][chromatic-badge]][chromatic-url]


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

[build-js-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/umd/semi-ui.min.js?label=semi.min.js&compression=gzip
[build-js-url]: https://unpkg.com/browse/@douyinfe/semi-ui@2.1.1/dist/umd/semi-ui.min.js
[build-css-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/css/semi.min.css?label=semi.min.css&compression=gzip
[build-css-url]: https://unpkg.com/browse/@douyinfe/semi-ui@2.1.1/dist/css/semi.min.css

</div>

<p>
    <img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-info-1.gif" />
</p>

English | [简体中文](./README-zh_CN.md)

</div>

# 🎉 Features

- 💪 Up to 58 high-quality Components.
- 💅 Thousands Design Tokens. Powerful Themes Customizing.
- 🌍 Internationalization Support for Dozens of Languages.
- 👏 Written in Typescript, Friendly Static Type Support.
- 🥳 SSR (Server Side Rendering) Compatible.

# 🔥 Install

```sh
# with npm
npm install @douyinfe/semi-ui

# with yarn
yarn add @douyinfe/semi-ui

```

# 👍 Usage

Here is a quick example to get you started, it's all you need:

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

And [Semi UI Doc Site](https://semi.design/en-US/) has hundreds of editable examples and live preview, welcome to play with those examples.

# 📌 Documentation

* [Quick Start](https://semi.design/zh-CN/start/getting-started)
* [Components Overview](https://semi.design/zh-CN/start/overview)
* [Customizing Themes](https://semi.design/zh-CN/start/customize-theme)
* [Design Tokens](https://semi.design/zh-CN/basic/tokens)
* [Dark Mode](https://semi.design/zh-CN/start/dark-mode)
* [Semi Icons](https://semi.design/zh-CN/basic/icon)
* [Global Config](https://semi.design/zh-CN/other/configprovider)
* [Internationalization](https://semi.design/zh-CN/other/locale)
* [FAQ](https://semi.design/zh-CN/start/faq)
* [CHANGELOG](https://semi.design/zh-CN/start/changelog)

# 👌 Platform Support

Semi UI supports all major modern browsers.

|[<img alt="chrome" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/chrome/chrome.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/chrome/chrome.png)<br>chrome|[<img alt="firefox" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/firefox/firefox.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/firefox/firefox.png)<br>firefox|[<img alt="safari" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/safari/safari.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/safari/safari.png)<br>safari|[<img alt="IE/Edge" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/edge/edge.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/edge/edge.png)<br> IE/Edge|[<img alt="electron" height="24px" src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/electron/electron.png" />](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/70.4.0/electron/electron.png)<br>Electron|
|--|--|--|--|--|
| latest 2 versions | latest 2 versions | latest 2 versions | Edge | latest 2 versions |

# 👐 Contributing

Read the contributing guide to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Semi UI.

See [CONTRIBUTING](CONTRIBUTING-en-US.md) documentation.


# 👨‍👨‍👧‍👦 User Group

Join [User Group](https://bytedance.feishu.cn/docs/doccnw93Dujm3UCkHRDTMTm1qwe#).

# 💖 Thanks

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.

# 🎈 License

Semi UI is [MIT Licensed](LICENSE)
