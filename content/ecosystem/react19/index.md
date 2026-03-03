---
localeCode: zh-CN
order: 3
category: 生态与帮助
title:  React 19 适配
icon: doc-configprovider
dir: column
brief: React 19 适配指南
---

Semi Design 现已支持 React 19。本指南将帮助你了解如何在 React 19 项目中使用 Semi 组件。

## 快速开始

### 安装

无论你使用的是 React 16、17、18 还是 19，都使用同一个包：

```bash
# npm
npm install @douyinfe/semi-ui

# yarn
yarn add @douyinfe/semi-ui

# pnpm
pnpm add @douyinfe/semi-ui
```

### React 19 适配

如果你的项目使用 React 19，需要在应用入口处导入适配器：

```jsx
// 在入口文件（如 main.tsx 或 index.tsx）的最顶部导入
import '@douyinfe/semi-ui/react19-adapter';

// 然后正常使用 Semi 组件
import { Button, Toast } from '@douyinfe/semi-ui';
```

完整示例：

```jsx
// main.tsx
import '@douyinfe/semi-ui/react19-adapter';  // 必须在最顶部导入
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

```jsx
// App.tsx
import { Button, Toast, Modal, Notification } from '@douyinfe/semi-ui';

function App() {
    return (
        <Button onClick={() => Toast.success('Hello Semi!')}>
            Click me
        </Button>
    );
}
```

### React 16/17/18

对于 React 16、17、18 项目，无需任何额外配置，直接使用即可：

```jsx
import { Button, Toast } from '@douyinfe/semi-ui';

function App() {
    return (
        <Button onClick={() => Toast.success('Hello Semi!')}>
            Click me
        </Button>
    );
}
```

## 工作原理

React 19 移除了 `ReactDOM.render` 和 `ReactDOM.findDOMNode` 这两个 API。Semi 的 `Modal`、`Toast`、`Notification` 等组件依赖 `ReactDOM.render` 来动态挂载内容。

`react19-adapter` 的作用是将 React 19 的 `createRoot` API 注入到 Semi 内部，使这些组件能够正常工作。

## 注意事项

### Tooltip 与类组件

React 19 移除了 `ReactDOM.findDOMNode`，这意味着无法自动获取类组件对应的 DOM 节点。

对于 `Tooltip` 及基于它的弹出层组件（`Popover`、`PopConfirm`、`Dropdown` 等），如果 children 是一个**类组件**，需要用真实的 DOM 元素包裹：

```jsx
// ❌ 不推荐：类组件作为 Tooltip 的直接子元素
class MyComponent extends React.Component {
    render() {
        return <span {...this.props}>Content</span>;
    }
}

<Tooltip content="提示">
    <MyComponent />  {/* React 19 中可能无法正常定位 */}
</Tooltip>

// ✅ 推荐：用 DOM 元素包裹
<Tooltip content="提示">
    <span>
        <MyComponent />
    </span>
</Tooltip>
```

**注意**：Semi 内置的组件（如 `Button`、`Input` 等）已经做了适配，可以直接作为 Tooltip 的子元素使用。

### 常见问题

**Q: 忘记导入 adapter 会怎样？**

A: 控制台会显示错误提示，指引你导入 adapter：

```
[Semi UI] createRoot is not available. 
If you are using React 19, please inject createRoot before using Semi components.
For details, see: https://semi.design/zh-CN/ecosystem/react19
```

**Q: 在 React 18 中导入 adapter 会有问题吗？**

A: 不会。在 React 18 中，Semi 会自动检测并使用内置的 `createRoot`，adapter 的导入不会产生副作用。

**Q: 为什么不默认支持 React 19？**

A: React 19 的 `createRoot` 位于 `react-dom/client` 子路径中。由于 Semi 需要同时支持 React 16/17/18/19，无法在库内部直接导入这个子路径（会导致低版本 React 报错）。通过 adapter 模式，用户可以显式地在 React 19 环境中注入所需的 API。
