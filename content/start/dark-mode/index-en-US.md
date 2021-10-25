---
category: Getting Started
title:  Dark Mode
subTitle: Dark Mode
icon: doc-darkmode
localeCode: en-US
order: 4
---

## Dark mode

Semi's default theme and custom themes configured through Theme Store come with both light and dark modes, which can be easily switched. 

## How to switch
To use Dark Mode, you could simply add `[theme-mode='dark']` to `body` in any way you prefer. Here is a quick idea:
```jsx
const body = document.body;
if (body.hasAttribute('theme-mode')) {
    body.removeAttribute('theme-mode');
} else {
    body.setAttribute('theme-mode', 'dark');
}
```

For instance:
```jsx live=true
import React from 'react';
import { Button } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
    }

    switchMode() {
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
           // Notify our site to update current mode
            window.setMode('light');
        } else {
            body.setAttribute('theme-mode', 'dark');
            // Notify our site to update current mode
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

## Keep Consistency with System Theme

If you want the mode of the site to change with the system setting, you may find this property  [Prefers-color-scheme
](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) helpful. Please pay attention that this property is experimental. It asks for browser compatibility (Chrome >= 76, Safari >= 12.1) and you may expect behavior to change in the future.

To change system setting in MacOs, go to System Preferences -> General -> Appearance

Since we do not recommend modifying the content of the npm theme package directly, you could add a listener for this property using js. Here is another example:
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