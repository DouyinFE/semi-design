# Semi Design Playground for AI

这是一个用于 AI 开发和测试 Semi Design 组件的 playground 项目。

## 特性

- 直接引用外部仓库 `packages/` 目录下的 Semi Design 源码
- 修改源码后实时热更新，无需重新编译
- 基于 Rspack 构建，启动快速

## 使用方法

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 如何引用组件

直接像使用 npm 包一样引用即可，rspack 会自动解析到源码目录：

```tsx
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
```

## 支持的包

- `@douyinfe/semi-ui` → `packages/semi-ui`
- `@douyinfe/semi-foundation` → `packages/semi-foundation`
- `@douyinfe/semi-icons` → `packages/semi-icons/src`
- `@douyinfe/semi-icons-lab` → `packages/semi-icons-lab/src`
- `@douyinfe/semi-illustrations` → `packages/semi-illustrations/src`
- `@douyinfe/semi-theme-default` → `packages/semi-theme-default`
- `@douyinfe/semi-animation` → `packages/semi-animation`
- `@douyinfe/semi-animation-react` → `packages/semi-animation-react`
- `@douyinfe/semi-animation-styled` → `packages/semi-animation-styled`
- `@douyinfe/semi-json-viewer-core` → `packages/semi-json-viewer-core/src`
