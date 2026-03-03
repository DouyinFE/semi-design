---
localeCode: zh-CN
order: 3
category: 生态与帮助
title:  React 19 适配
icon: doc-configprovider
dir: column
brief: React 19 适配指南
---

Semi Design 现已支持 React 19。由于 React 19 引入了一些底层 API 的变更，使用时需要进行简单的适配。

## React 19 的特殊之处

React 19 移除了两个 Semi 组件库依赖的 API：

### 1. `ReactDOM.render` 被移除

React 19 移除了传统的 `ReactDOM.render` API，改为使用 `createRoot`。Semi 的以下组件依赖此 API 来动态挂载内容：

- `Modal.info()` / `Modal.success()` / `Modal.error()` / `Modal.warning()` / `Modal.confirm()`
- `Toast.info()` / `Toast.success()` / `Toast.error()` / `Toast.warning()`
- `Notification.info()` / `Notification.success()` / `Notification.error()` / `Notification.warning()`

### 2. `ReactDOM.findDOMNode` 被移除

React 19 移除了 `ReactDOM.findDOMNode` API，该 API 用于从类组件实例获取对应的 DOM 节点。Semi 的以下组件受影响：

- `Tooltip` 及所有基于它的弹出层组件（`Popover`、`PopConfirm`、`Dropdown` 等）

### 为什么需要 adapter？

由于 Semi 需要同时支持 React 16/17/18/19，而 React 19 的 `createRoot` 位于 `react-dom/client` 子路径中，直接在库内部导入会导致低版本 React 报错。因此我们采用 adapter 模式，让 React 19 用户显式注入所需的 API。

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

### React 19 用户（重要）

如果你的项目使用 **React 19**，需要在应用入口文件的**最顶部**导入 adapter：

```jsx
// main.tsx 或 index.tsx
// ⚠️ 必须在最顶部导入，在任何 Semi 组件之前
import '@douyinfe/semi-ui/react19-adapter';

import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

然后正常使用 Semi 组件：

```jsx
// App.tsx
import { Button, Toast, Modal, Notification } from '@douyinfe/semi-ui';

function App() {
    const showToast = () => {
        Toast.success('操作成功！');
    };

    const showModal = () => {
        Modal.confirm({
            title: '确认操作',
            content: '确定要执行此操作吗？',
        });
    };

    return (
        <div>
            <Button onClick={showToast}>显示 Toast</Button>
            <Button onClick={showModal}>显示 Modal</Button>
        </div>
    );
}
```

### React 16/17/18 用户

对于 React 16、17、18 项目，**无需任何额外配置**，直接使用即可：

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

## 注意事项

### Tooltip 与类组件的限制

由于 React 19 移除了 `ReactDOM.findDOMNode`，当 `Tooltip`（及基于它的 `Popover`、`PopConfirm`、`Dropdown` 等）的 children 是**类组件**时，可能无法正确获取 DOM 节点进行定位。

**受影响的场景**：

```jsx
// ❌ 类组件作为 Tooltip 的直接子元素可能无法正确定位
class MyComponent extends React.Component {
    render() {
        return <span {...this.props}>Content</span>;
    }
}

<Tooltip content="提示">
    <MyComponent />
</Tooltip>
```

**解决方案**：用 DOM 元素包裹类组件

```jsx
// ✅ 推荐：用 DOM 元素包裹
<Tooltip content="提示">
    <span>
        <MyComponent />
    </span>
</Tooltip>
```

**不受影响的场景**：

- 函数组件配合 `forwardRef` 正确转发 ref 的情况
- 原生 DOM 元素（如 `<span>`、`<div>`、`<button>` 等）

### 错误提示

如果你在 React 19 中忘记导入 adapter，控制台会显示以下错误：

```
[Semi UI] createRoot is not available. 
If you are using React 19, please inject createRoot before using Semi components.
For details, see: https://semi.design/zh-CN/ecosystem/react19
```

看到此错误时，请在入口文件顶部添加：

```js
import '@douyinfe/semi-ui/react19-adapter';
```

## 常见问题

**Q: 在 React 18 中导入 adapter 会有问题吗？**

A: 不会。在 React 18 中，Semi 会自动检测并使用内置的 `createRoot`，adapter 的导入不会产生副作用。

**Q: adapter 做了什么？**

A: adapter 只做一件事：将 React 19 的 `createRoot` 函数注入到 Semi 内部，使 Modal、Toast、Notification 等组件能够正常工作。代码非常简单：

```js
import { createRoot } from 'react-dom/client';
import semiGlobal from './_utils/semi-global';

semiGlobal.config.createRoot = createRoot;
```

**Q: 为什么 adapter 必须在最顶部导入？**

A: 因为 adapter 需要在任何 Semi 组件渲染之前完成 `createRoot` 的注入。如果在组件已经开始渲染后才导入，可能会导致首次渲染失败。

**Q: 我之前使用的是 `@douyinfe/semi-ui-19`，如何迁移？**

A: 
1. 卸载 `@douyinfe/semi-ui-19`
2. 安装 `@douyinfe/semi-ui`（如果还没安装）
3. 将所有 `from '@douyinfe/semi-ui-19'` 改为 `from '@douyinfe/semi-ui'`
4. 在入口文件顶部添加 `import '@douyinfe/semi-ui/react19-adapter'`

## 技术细节

### 版本兼容性矩阵

| React 版本 | 是否需要 adapter | `ReactDOM.render` | `createRoot` |
|-----------|-----------------|-------------------|--------------|
| 16.x | 否 | ✅ 使用 | ❌ 不存在 |
| 17.x | 否 | ✅ 使用 | ❌ 不存在 |
| 18.x | 否 | ⚠️ 已废弃 | ✅ 自动使用 |
| 19.x | **是** | ❌ 已移除 | ✅ 需注入 |

### adapter 的工作原理

1. React 16/17：使用传统的 `ReactDOM.render` 和 `ReactDOM.unmountComponentAtNode`
2. React 18：自动检测并使用 `react-dom` 导出的 `createRoot`
3. React 19：`createRoot` 不再从 `react-dom` 直接导出，需要从 `react-dom/client` 导入，通过 adapter 注入
