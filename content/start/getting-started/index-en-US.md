---
category: Getting Started
title: Quick Start
subTitle: Quick Start
icon: doc-gettingstarted
localeCode: en-US
order: 2
---

## 1. Installation of Semi

```bash
# with npm
npm i @douyinfe/semi-ui

# with yarn
yarn add @douyinfe/semi-ui
```
## 2、Use components in a modular way 💫

```jsx
import React, { Component } from 'react';
import { Button, Toast } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <Button onClick={() => Toast.warning({ content: 'welcome' })}>Hello Semi</Button>;
    }
}
```

> It is recommended to introduce [reset.css](https://www.npmjs.com/package/reset-css) into the project, which can avoid introducing the default style of the browser.

## Use UMD import in browser

> We do not recommend using the built file directly, as this will introduce all components in full and cannot be loaded on demand. But if there is indeed a need for non-construction scenarios, you can quote in the following ways

Use script and link tags to import files directly in the browser, and use the global variable `SemiUI`

1. Please make sure you have import `react` and `react-dom` in advance
2. Import the JS file, the following example URL 2.0.0 is the version identifier, if you want to use a different version of Semi, just replace the corresponding value in version (note that the build file is only available after v1.3.0)
    - min：`https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/umd/semi-ui-react.min.js`
    - normal: `https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/umd/semi-ui-react.js`
3. Import the CSS style file of the Semi default theme
   `https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/css/semi.css`  

```diff
<!DOCTYPE html>
    <html lang="zh-cn">
    <head>
        <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
+       <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
+       <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

+       <script src="https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/umd/semi-ui-react.min.js"></script>
+       <link rel="stylesheet" href="https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/css/semi.css">

    </head>
    <body>
        <div id="root">1</div>
    </body>
</html>
```

```jsx
<script type="text/babel">
    const {(Input, Button, Toast, Icon, Form)} = SemiUI; ReactDOM.render(
    <div>
        <Button onClick={() => Toast.warning({ duration: 0, content: 'Semi Design' })}>test</Button>
        <Input defaultValue="semi" onChange={value => Toast.info('abc')}></Input>
    </div>, document.getElementById("root") );
</script>
```
