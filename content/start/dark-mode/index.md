---
category: 开始
title:  Dark Mode 暗色模式
icon: doc-darkmode
localeCode: zh-CN
order: 4
---


## 暗色模式

Semi 的默认主题和通过主题商店配置的定制主题都自带了亮色模式与暗色模式，可以方便地进行切换。

## 如何切换
Semi 暗色模式的切换是通过给 `body` 添加属性 `[theme-mode='dark']` 来实现的。你可以使用任何你喜欢的方式来进行切换。比如：
```jsx
const body = document.body;
if (body.hasAttribute('theme-mode')) {
    body.removeAttribute('theme-mode');
} else {
    body.setAttribute('theme-mode', 'dark');
}
```

这里也有一个🌰：
```jsx live=true
import React from 'react';
import { Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
        // 为了通知官网记录当前模式，这里引入了监听模式变化
        // 不同的业务场景可能会采取不同方式，请留意
    }

    switchMode() {
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
            // 通知官网更新当前模式，下同
            window.setMode('light');
        } else {
            body.setAttribute('theme-mode', 'dark');
            window.setMode('dark');
        }
    }

    render() {
        return (
            <Button
                onClick={this.switchMode}
            >
                Switch Mode
            </Button>
        );
    }
}
```

## 和系统主题保持一致

如果你希望页面的亮色/暗色模式能自动和系统主题保持一致，可以参考 [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 属性。该属性目前处于实验阶段，请留意浏览器兼容性 (Chrome >= 76, Safari >= 12.1) 及未来可能发生的改变。

macOS 下的系统主题可以通过 系统偏好设置 -> 通用 -> 外观 来配置。

由于我们不建议直接修改 npm 主题包的内容，你可以通过 JS 的方式监听该属性的变化，这里也有一个🌰：
```jsx
const mql = window.matchMedia('(prefers-color-scheme: dark)');

function matchMode(e) {
    const body = document.body;
    if (e.matches) {
        if (!body.hasAttribute('theme-mode')) {
            body.setAttribute('theme-mode', 'dark');
        }
    } else {
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
        }
    }
}

mql.addListener(matchMode);
```