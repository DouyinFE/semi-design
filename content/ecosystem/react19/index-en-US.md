---
localeCode: en-US
order: 3
category: Ecosystem
title: React 19 Adaptation
icon: doc-configprovider
dir: column
brief: React 19 adaptation guide
---

Semi Design now supports React 19. This guide will help you understand how to use Semi components in React 19 projects.

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

### React 19 Adaptation

If your project uses React 19, import the adapter at the top of your entry file:

```jsx
// Import at the very top of your entry file (e.g., main.tsx or index.tsx)
import '@douyinfe/semi-ui/react19-adapter';

// Then use Semi components as usual
import { Button, Toast } from '@douyinfe/semi-ui';
```

Complete example:

```jsx
// main.tsx
import '@douyinfe/semi-ui/react19-adapter';  // Must be imported at the top
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

For React 16, 17, or 18 projects, no additional configuration is needed:

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

## How It Works

React 19 removed the `ReactDOM.render` and `ReactDOM.findDOMNode` APIs. Semi's `Modal`, `Toast`, `Notification`, and similar components rely on `ReactDOM.render` to dynamically mount content.

The `react19-adapter` injects React 19's `createRoot` API into Semi's internals, enabling these components to work properly.

## Notes

### Tooltip and Class Components

React 19 removed `ReactDOM.findDOMNode`, which means it's no longer possible to automatically get the DOM node corresponding to a class component.

For `Tooltip` and popup components based on it (`Popover`, `PopConfirm`, `Dropdown`, etc.), if the children is a **class component**, wrap it with a real DOM element:

```jsx
// ❌ Not recommended: class component as direct child of Tooltip
class MyComponent extends React.Component {
    render() {
        return <span {...this.props}>Content</span>;
    }
}

<Tooltip content="Tip">
    <MyComponent />  {/* May not position correctly in React 19 */}
</Tooltip>

// ✅ Recommended: wrap with a DOM element
<Tooltip content="Tip">
    <span>
        <MyComponent />
    </span>
</Tooltip>
```

**Note**: Semi's built-in components (like `Button`, `Input`, etc.) are already adapted and can be used directly as Tooltip children.

### FAQ

**Q: What happens if I forget to import the adapter?**

A: The console will display an error message guiding you to import the adapter:

```
[Semi UI] createRoot is not available. 
If you are using React 19, please inject createRoot before using Semi components.
For details, see: https://semi.design/zh-CN/ecosystem/react19
```

**Q: Will importing the adapter in React 18 cause issues?**

A: No. In React 18, Semi automatically detects and uses the built-in `createRoot`. Importing the adapter has no side effects.

**Q: Why isn't React 19 supported by default?**

A: React 19's `createRoot` is located in the `react-dom/client` subpath. Since Semi needs to support React 16/17/18/19 simultaneously, it cannot directly import this subpath internally (which would cause errors in older React versions). The adapter pattern allows users to explicitly inject the required API in React 19 environments.
