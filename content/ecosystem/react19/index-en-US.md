---
localeCode: en-US
order: 3
category: Ecosystem
title: React 19 Adaptation
icon: doc-configprovider
dir: column
brief: React 19 adaptation guide
---

Semi Design now supports React 19. Due to some underlying API changes in React 19, a simple adaptation is required.

## What's Special About React 19

React 19 removed two APIs that Semi components depend on:

### 1. `ReactDOM.render` Removed

React 19 removed the legacy `ReactDOM.render` API in favor of `createRoot`. The following Semi components rely on this API to dynamically mount content:

- `Modal.info()` / `Modal.success()` / `Modal.error()` / `Modal.warning()` / `Modal.confirm()`
- `Toast.info()` / `Toast.success()` / `Toast.error()` / `Toast.warning()`
- `Notification.info()` / `Notification.success()` / `Notification.error()` / `Notification.warning()`

### 2. `ReactDOM.findDOMNode` Removed

React 19 removed the `ReactDOM.findDOMNode` API, which was used to get the DOM node from a class component instance. The following Semi components are affected:

- `Tooltip` and all popup components based on it (`Popover`, `PopConfirm`, `Dropdown`, etc.)

### Why Do We Need an Adapter

Since Semi needs to support React 16/17/18/19 simultaneously, and React 19's `createRoot` is located in the `react-dom/client` subpath, directly importing it in the library would cause errors in older React versions. Therefore, we use an adapter pattern that allows React 19 users to explicitly inject the required API.

## Quick Start

### Installation

Use the same package regardless of whether you're using React 16, 17, 18, or 19:

```bash
# npm
npm install @douyinfe/semi-ui

# yarn
yarn add @douyinfe/semi-ui

# pnpm
pnpm add @douyinfe/semi-ui
```

### React 19 Users (Important)

If your project uses **React 19**, you need to import the adapter at the **very top** of your entry file:

```jsx
// main.tsx or index.tsx
// ⚠️ Must be imported at the top, before any Semi components
import '@douyinfe/semi-ui/react19-adapter';

import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

Then use Semi components as usual:

```jsx
// App.tsx
import { Button, Toast, Modal, Notification } from '@douyinfe/semi-ui';

function App() {
    const showToast = () => {
        Toast.success('Operation successful!');
    };

    const showModal = () => {
        Modal.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to proceed?',
        });
    };

    return (
        <div>
            <Button onClick={showToast}>Show Toast</Button>
            <Button onClick={showModal}>Show Modal</Button>
        </div>
    );
}
```

### React 16/17/18 Users

For React 16, 17, or 18 projects, **no additional configuration is needed**:

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

## Notes

### Tooltip and Class Component Limitations

Due to the removal of `ReactDOM.findDOMNode` in React 19, when the children of `Tooltip` (and components based on it like `Popover`, `PopConfirm`, `Dropdown`, etc.) is a **class component**, it may not be able to correctly get the DOM node for positioning.

**Affected scenarios**:

```jsx
// ❌ Class component as direct child of Tooltip may not position correctly
class MyComponent extends React.Component {
    render() {
        return <span {...this.props}>Content</span>;
    }
}

<Tooltip content="Tip">
    <MyComponent />
</Tooltip>
```

**Solution**: Wrap the class component with a DOM element

```jsx
// ✅ Recommended: wrap with a DOM element
<Tooltip content="Tip">
    <span>
        <MyComponent />
    </span>
</Tooltip>
```

**Unaffected scenarios**:

- Function components that correctly forward ref using `forwardRef`
- Native DOM elements (like `<span>`, `<div>`, `<button>`, etc.)

### Error Messages

If you forget to import the adapter in React 19, the console will display:

```
[Semi UI] createRoot is not available. 
If you are using React 19, please inject createRoot before using Semi components.
For details, see: https://semi.design/zh-CN/ecosystem/react19
```

When you see this error, add the following at the top of your entry file:

```js
import '@douyinfe/semi-ui/react19-adapter';
```

## FAQ

**Q: Will importing the adapter in React 18 cause issues?**

A: No. In React 18, Semi automatically detects and uses the built-in `createRoot`. Importing the adapter has no side effects.

**Q: What does the adapter do?**

A: The adapter does one thing: inject React 19's `createRoot` function into Semi's internals, enabling Modal, Toast, Notification, and similar components to work properly. The code is very simple:

```js
import { createRoot } from 'react-dom/client';
import semiGlobal from './_utils/semi-global';

semiGlobal.config.createRoot = createRoot;
```

**Q: Why must the adapter be imported at the very top?**

A: Because the adapter needs to inject `createRoot` before any Semi components are rendered. If imported after components have started rendering, the first render may fail.

**Q: I was using `@douyinfe/semi-ui-19`, how do I migrate?**

A: 
1. Uninstall `@douyinfe/semi-ui-19`
2. Install `@douyinfe/semi-ui` (if not already installed)
3. Change all `from '@douyinfe/semi-ui-19'` to `from '@douyinfe/semi-ui'`
4. Add `import '@douyinfe/semi-ui/react19-adapter'` at the top of your entry file

## Technical Details

### Version Compatibility Matrix

| React Version | Adapter Required | `ReactDOM.render` | `createRoot` |
|--------------|------------------|-------------------|--------------|
| 16.x | No | ✅ Used | ❌ Not available |
| 17.x | No | ✅ Used | ❌ Not available |
| 18.x | No | ⚠️ Deprecated | ✅ Auto-detected |
| 19.x | **Yes** | ❌ Removed | ✅ Needs injection |

### How the Adapter Works

1. React 16/17: Uses legacy `ReactDOM.render` and `ReactDOM.unmountComponentAtNode`
2. React 18: Automatically detects and uses `createRoot` exported from `react-dom`
3. React 19: `createRoot` is no longer exported directly from `react-dom`, needs to be imported from `react-dom/client` and injected via adapter
