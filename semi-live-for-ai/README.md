# Semi Design Live Editor

一个基于 [React Live](https://github.com/FormidableLabs/react-live) 的实时代码编辑器，集成了所有 Semi Design 组件，可以在浏览器中实时编写和预览 React 代码。

## 功能特性

- 🎨 **所有 Semi 组件**: 注入了 Semi UI 的全部组件，可直接在编辑器中使用
- 🎯 **所有 Semi 图标**: 包含全部 Semi Icons，以 `Icon` 开头命名
- ⚡ **实时预览**: 代码修改后即时更新预览效果
- 🔧 **多种模式**: 
  - **Inline 模式**: 自动渲染返回的 JSX
  - **NoInline 模式**: 需要手动调用 `render()` 函数
- 📐 **灵活布局**: 支持水平/垂直布局切换
- 🔢 **行号显示**: 可切换是否显示代码行号

## 快速开始

### 安装依赖

确保在项目根目录已经执行过 `yarn install`，然后：

```bash
cd semi-live-for-ai
yarn install
```

### 启动开发服务器

```bash
yarn dev
```

### 构建生产版本

```bash
yarn build
```

## 使用说明

### 可用的组件

所有 Semi Design 组件都已注入到编辑器作用域中，可以直接使用：

```jsx
// 布局组件
Layout, Row, Col, Space

// 导航组件
Nav, Breadcrumb, Pagination, Steps, Tabs

// 输入组件
Input, Select, DatePicker, Checkbox, Radio, Switch, Slider, Upload

// 展示组件
Avatar, Badge, Card, Table, Tag, Typography, Tree, Image

// 反馈组件
Button, Modal, Toast, Notification, Progress, Spin

// 表单相关
Form, useFormApi, useFormState

// 还有更多...
```

### 可用的图标

所有 Semi Icons 都以 `Icon` 开头：

```jsx
<IconPlus />
<IconMinus />
<IconRefresh />
<IconSearch />
<IconSetting />
<IconUser />
// ... 更多图标
```

### 编辑器模式

#### Inline 模式（默认）

代码应该返回一个 React 元素，会自动渲染：

```jsx
() => {
    const [count, setCount] = useState(0);
    return (
        <Button onClick={() => setCount(c => c + 1)}>
            点击次数: {count}
        </Button>
    );
}
```

#### NoInline 模式

需要手动调用 `render()` 函数来渲染组件：

```jsx
const App = () => {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <Button onClick={() => setVisible(true)}>打开 Modal</Button>
            <Modal visible={visible} onCancel={() => setVisible(false)}>
                内容
            </Modal>
        </div>
    );
};

render(<App />);
```

## 项目结构

```
semi-live-for-ai/
├── src/
│   ├── App.tsx        # 主应用组件
│   ├── App.css        # 样式文件
│   ├── main.tsx       # 入口文件
│   ├── index.css      # 全局样式
│   └── react-env.d.ts # TypeScript 类型声明
├── loaders/
│   └── semi-react19-loader.js  # React 19 兼容 loader
├── package.json
├── rspack.config.ts   # Rspack 构建配置
├── tsconfig.json      # TypeScript 配置
└── index.html         # HTML 模板
```

## 技术栈

- **React 18** - UI 框架
- **React Live** - 实时代码编辑和预览
- **Semi Design** - UI 组件库
- **Rspack** - 构建工具
- **TypeScript** - 类型系统

## License

MIT
