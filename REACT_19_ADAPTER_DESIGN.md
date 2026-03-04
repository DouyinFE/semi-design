# Semi Design React 19 新兼容方案技术设计文档

## 一、为什么要做 React 19 兼容

### 1.1 React 19 带来的 Breaking Changes

React 19 于 2024 年 12 月正式发布，引入了多项底层 API 的移除和变更。对于组件库而言，以下两个变更影响最大：

`**ReactDOM.render` 被移除**

React 19 彻底移除了传统的 `ReactDOM.render` API，要求使用 `createRoot` 替代。Semi Design 中的 `Modal.info()`、`Toast.success()`、`Notification.open()` 等命令式 API 依赖 `ReactDOM.render` 将组件动态挂载到 DOM 节点上，这些功能在 React 19 中直接报错。

`**ReactDOM.findDOMNode` 被移除**

React 19 移除了 `ReactDOM.findDOMNode`，该 API 用于从类组件实例获取对应的 DOM 节点。Semi 的 `Tooltip` 组件及所有基于它的弹出层组件（`Popover`、`PopConfirm`、`Dropdown` 等）都依赖此 API 来定位触发元素。

### 1.2 用户升级的迫切需求

- **新项目**：新启动的项目倾向于直接使用最新的 React 19，享受 Actions、`use()` hook、Server Components 等新特性
- **存量项目**：越来越多的存量项目计划升级到 React 19，以获得更好的性能和开发体验
- **生态压力**：随着 Next.js 15+、Remix 等主流框架默认使用 React 19，不兼容 React 19 的组件库将逐渐被边缘化

如果 Semi Design 不做 React 19 兼容，用户将被迫在"使用 Semi"和"升级 React 19"之间做选择，这对组件库的生态发展极为不利。

---

## 二、React 17 / 18 / 19 的关键区别

### 2.1 渲染 API 演进


| 特性                                | React 17 | React 18                 | React 19                   |
| --------------------------------- | -------- | ------------------------ | -------------------------- |
| `ReactDOM.render`                 | ✅ 正常使用   | ⚠️ 已废弃（仍可用）              | ❌ 已移除                      |
| `createRoot`                      | ❌ 不存在    | ✅ 新增（`react-dom/client`） | ✅ 仅从 `react-dom/client` 导出 |
| `ReactDOM.findDOMNode`            | ✅ 正常使用   | ⚠️ 已废弃（StrictMode 下警告）   | ❌ 已移除                      |
| `ReactDOM.unmountComponentAtNode` | ✅ 正常使用   | ⚠️ 已废弃                   | ❌ 已移除                      |


### 2.2 Ref 机制变化


| 特性            | React 17 | React 18 | React 19                 |
| ------------- | -------- | -------- | ------------------------ |
| `element.ref` | ✅ 顶层属性   | ✅ 顶层属性   | ❌ 移至 `element.props.ref` |
| `forwardRef`  | ✅ 必须使用   | ✅ 必须使用   | ⚠️ 可选（ref 作为普通 prop）     |
| String refs   | ⚠️ 已废弃   | ⚠️ 已废弃   | ❌ 已移除                    |


### 2.3 其他重要变化


| 特性                 | React 17 | React 18 | React 19 |
| ------------------ | -------- | -------- | -------- |
| 并发模式               | ❌        | ✅ 可选     | ✅ 默认     |
| Automatic Batching | ❌ 仅事件处理  | ✅ 所有场景   | ✅ 所有场景   |
| `PropTypes` 运行时检查  | ✅        | ✅        | ❌ 已移除    |
| Legacy Context     | ⚠️ 已废弃   | ⚠️ 已废弃   | ❌ 已移除    |
| `use()` hook       | ❌        | ❌        | ✅ 新增     |
| Actions            | ❌        | ❌        | ✅ 新增     |


### 2.4 对组件库的核心影响

对于 Semi Design 这类需要同时支持多个 React 版本的组件库，最棘手的问题是：

1. `**createRoot` 的导入路径差异**：React 18 中 `createRoot` 可以从 `react-dom` 默认导出中获取，但 React 19 中只能从 `react-dom/client` 子路径导入。而在 React 16/17 中，`react-dom/client` 这个模块根本不存在，直接 import 会报错。
2. `**findDOMNode` 的移除**：无法通过简单的条件判断来兼容——要么用 `findDOMNode`（React 16/17/18），要么不用（React 19），两种代码路径的逻辑完全不同。
3. `**ref` 位置的变化**：React 19 中 `element.ref` 变为 `element.props.ref`，在 `cloneElement` 和 ref 转发场景中需要根据版本区分读取位置。

---

## 三、其他组件库的做法

### 3.1 Ant Design（antd v5）

**方案：兼容补丁包 + `unstableSetRender`**

Ant Design 的底层渲染逻辑封装在 `rc-util` 包的 `render.ts` 中。面对 React 19 兼容问题，antd 采取了两层方案：

**第一层：官方补丁包**

```js
// 安装 @ant-design/v5-patch-for-react-19
import '@ant-design/v5-patch-for-react-19';
```

补丁包在导入时自动将 `createRoot` 注入到 antd 内部的渲染函数中。

**第二层：`unstableSetRender` API**

对于 UMD、微前端等特殊场景，提供了底层注册方法：

```js
import { unstableSetRender } from 'antd';
import { createRoot } from 'react-dom/client';

unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container);
  container._reactRoot.render(node);
});
```

`**rc-util` 最新版的实现（已直接支持 React 19）：**

```ts
// rc-util/src/React/render.ts（最新版本）
import { createRoot } from 'react-dom/client';

const MARK = '__rc_react_root__';

export function render(node, container) {
  const root = container[MARK] || createRoot(container);
  root.render(node);
  container[MARK] = root;
}

export async function unmount(container) {
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();
    delete container[MARK];
  });
}
```

> **关于 antd v6 放弃低版本 React 支持**：`rc-util` 最新版直接从 `react-dom/client` 硬编码导入 `createRoot`，这意味着它**彻底放弃了对 React 16/17 的支持**——在 React 16/17 环境下 `react-dom/client` 模块不存在，import 阶段就会直接报错。antd v6 将完全基于 React 18+ 构建，不再兼容低版本 React。这是一个"向前看"的策略：通过缩小支持范围来降低维护复杂度，但代价是强制要求所有用户至少升级到 React 18。对于仍有大量 React 16/17 存量项目的国内生态来说，这种策略会导致一部分用户无法跟进升级。

**优点**：

- **补丁包方案对用户侵入性小**，一行 import 即可完成适配
- **与 antd 现有生态无缝衔接**，补丁包由官方维护，可靠性有保障
- **提供了 `unstableSetRender` 作为底层逃生舱**，满足 UMD、微前端等特殊场景的需求

**缺点**：

- **需要额外安装一个独立的 npm 包**（`@ant-design/v5-patch-for-react-19`），增加了依赖管理的复杂度
- `**unstableSetRender` 是不稳定 API**，命名中的 `unstable` 前缀明确表示后续版本可能移除或变更，用户使用时存在风险
- **antd v5 本身的 `rc-util` 旧版仍然是条件编译方式**，底层代码复杂度高，补丁包只是在上层做了一层"打补丁"
- **v5 到 v6 的升级路径不连续**：v5 支持 React 16-19，v6 直接放弃 React 16/17，用户如果同时升级 antd 和 React 版本，面临的变更面很大

### 3.2 Material UI（MUI v5/v6）

**方案：直接升级 + 版本分支**

MUI 采取了更激进的策略：

1. **Phase 1**：在保持 React 18 代码基础上，添加 React 19 兼容性
2. **Phase 2**：将整个代码库迁移到 React 19，同时通过 `forwardRef` shim 保持对 React 18 的向后兼容

MUI 的核心优势在于它主要使用函数组件和 hooks，较少依赖 `ReactDOM.render` 和 `findDOMNode` 这类命令式 API，因此迁移成本相对较低。

**优点**：

- **代码干净，不需要运行时兼容层**，没有 adapter、补丁包等额外概念
- **架构现代化**，MUI 以函数组件和 hooks 为主，天然与 React 19 的设计理念契合
- **迁移过程中引入了 `forwardRef` shim**，使得 React 18 用户无需改动代码即可继续使用

**缺点**：

- **直接放弃了 React 16/17 的支持**，只兼容 React 18 和 19
- **迁移周期长**（约一个月），对于大型组件库来说，全量迁移的工程量和风险都很大
- **两阶段迁移策略增加了过渡期的不确定性**，Phase 1 和 Phase 2 之间用户可能遇到中间状态的兼容问题
- **TypeScript 类型适配工作量大**，React 19 的类型变更无法完全通过 codemod 自动处理，需要大量手动修改

### 3.3 Arco Design

Arco Design（字节跳动另一款组件库）同样面临 `findDOMNode` 和 `ReactDOM.render` 的兼容问题。截至目前，Arco Design 尚未发布完整的 React 19 兼容方案，其 `ResizeObserver` 等组件中仍存在 `findDOMNode` 的使用。

**优点**：

- **保持了对低版本 React 的稳定支持**，现有用户不受影响

**缺点**：

- **React 19 用户完全无法使用**，在生态竞争中处于劣势
- **缺乏明确的 React 19 适配路线图**，用户无法预期何时能获得支持

### 3.4 方案对比总结


| 组件库                 | 方案                      | 支持的 React 版本 | 用户成本             | 维护成本      |
| ------------------- | ----------------------- | ------------ | ---------------- | --------- |
| antd v5             | 补丁包 + unstableSetRender | 16-19        | 低（一行 import）     | 中（需维护补丁包） |
| antd v6（rc-util 最新） | 直接使用 `react-dom/client` | 18-19        | 无                | 低（放弃旧版本）  |
| MUI                 | 版本分支 + forwardRef shim  | 18-19        | 无                | 中         |
| **Semi（旧方案）**       | **条件编译 + 双包发布**         | **16-19**    | **高（换包名）**       | **高**     |
| **Semi（新方案）**       | **Adapter 注入模式**        | **16-19**    | **低（一行 import）** | **低**     |


---

## 四、Semi Design 旧方案：条件编译 + 双包发布

### 4.1 方案描述

旧方案通过在源码中嵌入条件编译标记，在构建时生成两个不同的 npm 包：

- `@douyinfe/semi-ui`：适用于 React 16/17/18
- `@douyinfe/semi-ui-19`：适用于 React 19

### 4.2 实现方式

**源码中的条件编译标记：**

```tsx
// modal/confirm.tsx
import React from 'react';
/* REACT_18_START */
import ReactDOM from 'react-dom';
/* REACT_18_END */
/* REACT_19_START */
// import { createRoot } from 'react-dom/client';
/* REACT_19_END */

function render(renderProps) {
    /* REACT_18_START */
    ReactDOM.render(<ConfirmModal {...renderProps} />, div);
    /* REACT_18_END */

    /* REACT_19_START */
    // if (!root) {
    //     root = createRoot(div);
    // }
    // root.render(<ConfirmModal {...renderProps} />);
    /* REACT_19_END */
}
```

React 19 版本的代码以注释形式存在于源码中，通过构建脚本 `scripts/react19-build.js` 进行转换：

```js
// 构建脚本的核心逻辑
const REACT_18_START = /\/\* REACT_18_START \*\/([\s\S]*?)\/\* REACT_18_END \*\//g;
const REACT_19_START = /\/\* REACT_19_START \*\/([\s\S]*?)\/\* REACT_19_END \*\//g;

function processReact19Code(content) {
    content = content.replace(REACT_18_START, '');  // 移除 React 18 代码块
    content = content.replace(REACT_19_START, (match, codeBlock) => {
        return codeBlock.replace(/^(\s*)\/\/ /gm, '$1').trim();  // 取消注释 React 19 代码
    });
    return content;
}
```

### 4.3 涉及的文件

旧方案涉及 13 个文件的条件编译改造：


| 类别                 | 文件                           | 改动内容                             |
| ------------------ | ---------------------------- | -------------------------------- |
| ReactDOM.render 替换 | `modal/confirm.tsx`          | `ReactDOM.render` → `createRoot` |
|                    | `toast/index.tsx`            | `ReactDOM.render` → `createRoot` |
|                    | `notification/index.tsx`     | `ReactDOM.render` → `createRoot` |
| findDOMNode 可控场景   | `select/index.tsx`           | `findDOMNode` → 直接使用 ref         |
|                    | `slider/index.tsx`           | `findDOMNode` → 直接使用 ref         |
|                    | `cascader/index.tsx`         | `findDOMNode` → 直接使用 ref         |
|                    | `rating/index.tsx`           | `findDOMNode` → 直接使用 ref         |
|                    | `autoComplete/index.tsx`     | `findDOMNode` → 直接使用 ref         |
|                    | `treeSelect/index.tsx`       | `findDOMNode` → 直接使用 ref         |
| findDOMNode 不可控场景  | `tooltip/index.tsx`          | 5 处条件编译                          |
|                    | `resizeObserver/index.tsx`   | 条件编译                             |
|                    | `calendar/monthCalendar.tsx` | 条件编译                             |
|                    | `dragMove/index.ts`          | 条件编译                             |


### 4.4 缺点

**1. 用户体验差——需要更换包名**

用户从 React 18 升级到 React 19 时，需要：

- 卸载 `@douyinfe/semi-ui`
- 安装 `@douyinfe/semi-ui-19`
- 全局替换所有 import 路径

这对于大型项目来说是一个非常大的迁移成本，尤其是当项目中有几百个文件引用了 Semi 组件时。

**2. 维护成本极高——双包同步更新**

每次发版都需要同时构建和发布两个 npm 包，任何一个组件的改动都需要确保两个版本的行为一致。这意味着：

- CI/CD 流水线复杂度翻倍
- 测试矩阵翻倍（每个组件 × 两个 React 版本 × 两个包）
- 版本号需要同步管理

**3. 代码可读性极差**

条件编译标记让源码变得难以阅读和维护。React 19 的代码以注释形式散落在各处，IDE 无法对注释中的代码进行类型检查、自动补全和重构支持。开发者在修改代码时很容易遗漏某个版本的改动。

```tsx
// 实际源码中的样子——难以阅读
/* REACT_18_START */
ReactDOM.render(React.createElement(
    ToastList,
    { ref: instance => (ToastList.ref = instance) }
),
div,
() => {
    ToastList.ref.add({ ...opts, id });
    ToastList.ref.stack = Boolean(opts.stack);
});
/* REACT_18_END */

/* REACT_19_START */
// if (!this.root) {
//     this.root = createRoot(div);
// }
// this.root.render(React.createElement(
//     ToastList,
//     { ref: instance => {
//         ToastList.ref = instance;
//         while (ToastList.toastQueue.length && ToastList.ref && typeof ToastList.ref.add === 'function') {
//             const { opts: queuedOpts, id: queuedId } = ToastList.toastQueue.shift();
//             ToastList.ref.add({ ...queuedOpts, id: queuedId });
//             ToastList.ref.stack = Boolean(queuedOpts.stack);
//         }
//     } }
// ));
/* REACT_19_END */
```

**4. 构建脚本脆弱**

基于正则表达式的代码转换容易出错，无法处理嵌套的条件编译标记，也无法保证转换后代码的正确性。

**5. React 19 版本的代码质量无法保证**

由于 React 19 的代码始终以注释形式存在，TypeScript 编译器无法对其进行类型检查，ESLint 也无法检测其中的问题。Bug 只能在构建后通过运行时测试发现。

**6. 异步渲染问题**

旧方案中 React 19 版本的 Toast 和 Notification 需要引入消息队列机制来处理 `createRoot` 的异步 ref 回调问题，增加了额外的复杂度和潜在的竞态条件。

---

## 五、Semi Design 新方案：Adapter 注入模式

### 5.1 方案描述

新方案采用**运行时 Adapter 注入**模式，通过一个统一的 `@douyinfe/semi-ui` 包支持 React 16/17/18/19 所有版本。React 19 用户只需在入口文件顶部添加一行 import：

```js
import '@douyinfe/semi-ui/react19-adapter';
```

### 5.2 设计思路

新方案的核心思路是：**不在编译时区分 React 版本，而是在运行时根据环境自动选择正确的 API 调用路径**。

面对 `createRoot` 无法在 React 16/17 中直接 import 的问题，我们没有选择条件编译，也没有选择放弃低版本支持，而是借鉴了依赖注入（Dependency Injection）的思想——让需要 `createRoot` 的一方（Semi 组件）不直接 import 它，而是由使用方（用户的应用入口）在运行时注入。

这个思路可以拆解为三个层次：

1. **全局配置层**（`semi-global.ts`）：扩展 Semi 已有的全局配置对象，增加 `createRoot` 字段作为注入点
2. **渲染抽象层**（`reactRender.ts`）：封装所有与 React 版本相关的 API 差异，对外暴露版本无关的统一接口
3. **用户适配层**（`react19-adapter.ts`）：一个极简的 side-effect-only 模块，执行注入动作

### 5.3 核心架构详解

#### 5.3.1 全局配置层：`_utils/semi-global.ts` 的改造

Semi Design 原本就有一个全局配置单例 `SemiGlobal`，用于 `overrideDefaultProps` 等功能。新方案在其 config 接口中增加了 `createRoot` 字段：

```ts
interface SemiGlobalConfig {
    /**
     * Inject `createRoot` from `react-dom/client` for React 19 compatibility.
     * See https://semi.design/zh-CN/ecosystem/react19
     */
    createRoot?: (container: Element | DocumentFragment) => {
        render(children: any): void;
        unmount(): void;
    };
    overrideDefaultProps?: {
        // ... 原有的组件默认 props 覆盖配置
    }
}

class SemiGlobal {
    config: SemiGlobalConfig = {}
}

export default new SemiGlobal();
```

这个改造非常轻量——只是在已有的类型定义中增加了一个可选字段，不影响任何现有功能。`createRoot` 的类型签名与 `react-dom/client` 中的 `createRoot` 返回值一致，确保类型安全。

#### 5.3.2 用户适配层：`react19-adapter.ts`

```ts
/**
 * React 19 adapter for Semi Design.
 *
 * Usage: import this module before using any Semi components in React 19.
 *
 * ```js
 * import '@douyinfe/semi-ui/react19-adapter';
 * ```
 */
import { createRoot } from 'react-dom/client';
import semiGlobal from './_utils/semi-global';

semiGlobal.config.createRoot = createRoot;
```

仅 3 行有效代码，职责单一：将 `createRoot` 注入到 Semi 的全局配置中。

这个文件的关键设计决策：

- **Side-effect-only import**：用户只需 `import '@douyinfe/semi-ui/react19-adapter'`，不需要导出任何东西，不需要调用任何函数。这是最简洁的用户接口。
- `**from 'react-dom/client'` 只在这个文件中出现**：这意味着只有 React 19 用户会触发这个 import，React 16/17/18 用户永远不会加载这个文件，因此不会遇到模块不存在的错误。
- **打包产物中包含此文件**：`package.json` 的 `files` 字段中显式添加了 `react19-adapter.ts`、`lib/es/react19-adapter.js`、`lib/cjs/react19-adapter.js`，确保 ESM 和 CJS 两种模块格式都可用。

#### 5.3.3 渲染抽象层：`_utils/reactRender.ts`

这是新方案的核心模块（166 行），提供四个工具函数，完整封装了所有与 React 版本相关的 API 差异：


| 函数                        | 作用               | 替代的旧 API                            |
| ------------------------- | ---------------- | ----------------------------------- |
| `render(node, container)` | 将 React 元素渲染到容器  | `ReactDOM.render`                   |
| `unmount(container)`      | 卸载容器中的 React 组件  | `ReactDOM.unmountComponentAtNode`   |
| `resolveDOM(instance)`    | 从组件实例获取 DOM 节点   | `ReactDOM.findDOMNode`              |
| `getRef(element)`         | 获取 React 元素的 ref | `element.ref` / `element.props.ref` |


**模块初始化——安全地获取旧 API 引用：**

```ts
import * as ReactDOM from 'react-dom';

const fullClone: Record<string, any> = { ...ReactDOM };
const legacyRender: any = fullClone.render;
const legacyUnmount: any = fullClone.unmountComponentAtNode;
const legacyFindDOMNode: any = fullClone.findDOMNode;

const { version } = ReactDOM;
const mainVersion = Number((version || '').split('.')[0]);
```

通过展开 `ReactDOM` 到一个普通对象中，安全地获取 `render`、`unmountComponentAtNode`、`findDOMNode` 的引用。在 React 19 中这些 API 不存在，对应变量为 `undefined`，不会报错。同时解析 React 主版本号，用于后续的版本判断。

`**resolveCreateRoot` 的三级降级策略：**

```
resolveCreateRoot():
  1. semiGlobal.config.createRoot  → 用户注入（React 19 必需）
  2. fullClone.createRoot          → 自动发现（React 18 可用）
  3. undefined                     → 降级到 legacyRender（React 16/17）
```

```ts
function resolveCreateRoot(): CreateRootFn | undefined {
    // 优先级 1：用户通过 adapter 注入的 createRoot
    if (typeof semiGlobal.config?.createRoot === 'function') {
        return semiGlobal.config.createRoot as CreateRootFn;
    }
    // 优先级 2：从 react-dom 默认导出中自动发现（React 18）
    if (typeof fullClone.createRoot === 'function') {
        return fullClone.createRoot;
    }
    // 优先级 3：不可用
    return undefined;
}
```

这个三级降级策略的精妙之处在于：

- **React 19**：`fullClone.createRoot` 为 `undefined`（React 19 不再从 `react-dom` 直接导出 `createRoot`），但用户通过 adapter 注入了 `semiGlobal.config.createRoot`，走优先级 1
- **React 18**：`fullClone.createRoot` 存在（React 18 的 `react-dom` 默认导出中包含 `createRoot`），自动走优先级 2，用户无需任何配置
- **React 16/17**：两者都为 `undefined`，返回 `undefined`，后续降级到 `legacyRender`

`**render` 函数——统一的渲染入口：**

```ts
const MARK = '__semi_react_root__';

type ContainerType = (Element | DocumentFragment) & {
    [MARK]?: ReturnType<CreateRootFn>;
};

export function render(node: React.ReactElement, container: ContainerType) {
    checkVersionCompatibility();
    const createRoot = resolveCreateRoot();
    if (createRoot) {
        toggleWarning(true);
        const root = container[MARK] || createRoot(container);
        toggleWarning(false);
        root.render(node);
        container[MARK] = root;
    } else if (legacyRender) {
        legacyRender(node, container);
    } else {
        warnCreateRootNotFound();
    }
}
```

关键设计细节：

- **Root 缓存**：通过在容器 DOM 元素上挂载 `__semi_react_root__` 属性来缓存 `createRoot` 创建的 root 实例，避免重复创建。这与 `rc-util` 的 `__rc_react_root__` 标记是同一思路。
- `**toggleWarning`**：在调用 `createRoot` 前后切换 React 内部的 `usingClientEntryPoint` 标记，避免 React 18 在非 `react-dom/client` 入口调用 `createRoot` 时输出的控制台警告。
- **版本兼容性检查**：`checkVersionCompatibility()` 会检测异常配置（如在 React 16 中注入了 `createRoot`），给出友好的警告。

`**unmount` 函数——安全的卸载逻辑：**

```ts
export function unmount(container: ContainerType) {
    if (container[MARK]) {
        container[MARK].unmount();
        delete container[MARK];
    } else if (legacyUnmount) {
        legacyUnmount(container);
    }
}
```

卸载逻辑的关键在于：**优先检查容器上是否有缓存的 root 实例，而不是检查 `createRoot` 是否可用**。这样可以正确处理一种边缘情况——用 `legacyRender` 渲染后，用户又注入了 `createRoot`。

`**resolveDOM` 函数——`findDOMNode` 的优雅替代：**

```ts
export function resolveDOM(instance: any): Element | null {
    if (!instance) return null;
    // 已经是 Element，直接返回
    if (instance instanceof Element) return instance;
    // 尝试使用 findDOMNode (React 16/17/18)
    if (legacyFindDOMNode) {
        try {
            const node = legacyFindDOMNode(instance as React.ReactInstance);
            if (node instanceof Element) return node;
            return null;
        } catch (e) {
            return null;
        }
    }
    // React 19：findDOMNode 不可用，返回 null
    return null;
}
```

设计要点：

- **快速路径**：如果传入的已经是 DOM Element，直接返回，无需调用 `findDOMNode`
- **安全降级**：在 React 19 中 `legacyFindDOMNode` 为 `undefined`，直接返回 `null`。调用方（如 Tooltip）需要处理 `null` 的情况——这实际上意味着在 React 19 中，如果 Tooltip 的 children 是类组件且没有正确转发 ref，定位功能将无法工作，但不会报错崩溃
- **异常捕获**：`findDOMNode` 在 StrictMode 下或组件已卸载时可能抛出错误，用 try-catch 兜底
- **类型过滤**：`findDOMNode` 可能返回 Text 节点，但我们只返回 Element 类型，保证类型安全

`**getRef` 函数——跨版本的 ref 读取：**

```ts
export function getRef(element: any): React.Ref<any> | null {
    if (!element) return null;
    // React 19+: ref 在 props 中
    if (mainVersion >= 19) {
        return element.props?.ref ?? null;
    }
    // React 16/17/18: ref 在顶层
    return element.ref ?? null;
}
```

这个函数解决了 React 19 中 `element.ref` 被移至 `element.props.ref` 的问题。使用版本号判断而非特性检测，是因为在 React 18 中 `element.props.ref` 虽然存在但行为不同（会触发 DEV 警告），直接按版本区分更安全。

**错误提示机制：**

```ts
let hasWarnedCreateRoot = false;

function warnCreateRootNotFound() {
    if (hasWarnedCreateRoot) return;
    hasWarnedCreateRoot = true;
    console.error(
        '[Semi UI] createRoot is not available. ' +
        'If you are using React 19, please inject createRoot before using Semi components. ' +
        'For details, see: https://semi.design/zh-CN/ecosystem/react19\n' +
        '[Semi UI] createRoot 不可用。' +
        '如果您正在使用 React 19，请在使用 Semi 组件前注入 createRoot。' +
        '详情请参阅：https://semi.design/zh-CN/ecosystem/react19'
    );
}
```

中英双语错误提示，且通过 `hasWarnedCreateRoot` 标记确保只输出一次，避免控制台被大量重复警告淹没。

### 5.4 组件层面的改造详解

改造后的组件代码干净统一，不再有条件编译标记。以下逐一分析每个受影响组件的改造方式：

#### 5.4.1 Modal（命令式弹窗）

Modal 的 `confirm()` 等静态方法需要动态创建 DOM 容器并渲染组件。

**改造前（条件编译，46 行 → 改造后 13 行）：**

```tsx
// ❌ 改造前：条件编译，代码冗长
import ReactDOM from 'react-dom';

/* REACT_19_START */
// let root: any = null;
/* REACT_19_END */

const destroy = () => {
    /* REACT_18_START */
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
    }
    /* REACT_18_END */
    /* REACT_19_START */
    // if (root) {
    //     root.unmount();
    //     if (div.parentNode) { div.parentNode.removeChild(div); }
    // }
    /* REACT_19_END */
};

function render(renderProps) {
    /* REACT_18_START */
    ReactDOM.render(<ConfirmModal {...renderProps} afterClose={(...args) => {
        afterClose?.(...args);
        destroy();
    }} motion={props.motion}/>, div);
    /* REACT_18_END */
    /* REACT_19_START */
    // if (!root) { root = createRoot(div); }
    // root.render(<ConfirmModal ... />);
    /* REACT_19_END */
}
```

**改造后：**

```tsx
// ✅ 改造后：统一调用，简洁清晰
import { render as reactRender, unmount as reactUnmount } from '../_utils/reactRender';

const destroy = () => {
    reactUnmount(div);
    if (div.parentNode) {
        div.parentNode.removeChild(div);
    }
};

function render(renderProps) {
    const { afterClose } = renderProps;
    reactRender(<ConfirmModal {...renderProps} afterClose={() => {
        afterClose?.();
        destroy();
    }} motion={props.motion}/>, div);
}
```

改造要点：不再需要手动管理 `root` 变量，`reactRender` 内部通过 `MARK` 自动缓存和复用 root 实例。

#### 5.4.2 Toast / Notification（命令式通知）

Toast 和 Notification 的改造模式与 Modal 类似，但有一个额外的关键改进——**消除了旧方案中的消息队列和竞态问题**。

**旧方案的问题**：在 React 19 中，`createRoot` 后调用 `root.render()` 时，ref 回调不再像 `ReactDOM.render` 的第三个参数那样在渲染完成后同步执行。旧方案为此引入了一个消息队列：

```tsx
// ❌ 旧方案：需要消息队列处理异步 ref
static toastQueue: Array<{ opts: ToastReactProps, id: string }> = [];

// ref 回调中 flush 队列
ref: instance => {
    ToastList.ref = instance;
    while (ToastList.toastQueue.length && ToastList.ref) {
        const { opts, id } = ToastList.toastQueue.shift();
        ToastList.ref.add({ ...opts, id });
    }
}

// 调用时需要判断 ref 是否就绪
if (ToastList.ref && typeof ToastList.ref.add === 'function') {
    ToastList.ref.add({ ...opts, id });
} else {
    ToastList.toastQueue.push({ opts, id });
}
```

**新方案直接在 ref 回调中执行操作**，利用 React 保证 ref 回调在组件挂载后一定会被调用的特性：

```tsx
// ✅ 新方案：ref 回调中直接操作，无需队列
reactRender(React.createElement(
    ToastList,
    { ref: (instance: ToastList) => {
        if (instance) {
            ToastList.ref = instance;
            instance.add({ ...opts, id });
            instance.stack = Boolean(opts.stack);
        }
    } }
), div);
```

`if (instance)` 的判断确保只在组件挂载时执行（React 在卸载时会以 `null` 调用 ref 回调），完全消除了竞态条件。

#### 5.4.3 Tooltip（弹出层定位）

Tooltip 是改造最复杂的组件，涉及 5 处 `findDOMNode` 和 1 处 ref 读取的替换。

`**clickOutsideHandler` 中的 DOM 获取：**

```tsx
// ❌ 改造前
let el = this.triggerEl && this.triggerEl.current;
/* REACT_18_START */
el = ReactDOM.findDOMNode(el as React.ReactInstance);
/* REACT_18_END */
/* REACT_19_START */
// el = el as HTMLElement;
/* REACT_19_END */

// ✅ 改造后
let el: any = this.triggerEl && this.triggerEl.current;
el = resolveDOM(el) ?? el;
```

`resolveDOM(el) ?? el` 的含义是：尝试通过 `findDOMNode` 解析真实 DOM，如果失败（React 19 或 el 本身就是 DOM），则保持原值。

`**getTriggerNode` 中的增强错误处理：**

```tsx
// ❌ 改造前：React 19 路径只能打印 warning，无法真正获取 DOM
/* REACT_19_START */
// console.warn(`[Semi Tooltip] triggerDOM should be a valid DOM element...`);
// triggerDOM = this.triggerEl.current;
/* REACT_19_END */

// ✅ 改造后：尝试解析，失败时给出明确的开发者警告
getTriggerNode: () => {
    let triggerDOM = this.triggerEl.current;
    if (!isHTMLElement(triggerDOM)) {
        const resolved = resolveDOM(triggerDOM);
        if (resolved) {
            triggerDOM = resolved;
        } else {
            if (triggerDOM) {
                warning(true, '[Semi Tooltip] The trigger element\'s ref did not return a DOM node. Please ensure the trigger component forwards ref correctly.');
            }
            return null;
        }
    }
    return triggerDOM as Element;
},
```

`**cloneElement` 中的 ref 合并：**

```tsx
// ❌ 改造前
/* REACT_18_START */
const { ref } = children as any;
/* REACT_18_END */
/* REACT_19_START */
// const { ref } = (children as any).props;
/* REACT_19_END */

// ✅ 改造后
const ref = getRef(children);
if (typeof ref === 'function') {
    ref(node);
} else if (ref && typeof ref === 'object') {
    (ref as React.MutableRefObject<any>).current = node;
}
```

#### 5.4.4 DragMove / ResizeObserver

这两个组件的改造模式与 Tooltip 类似，都是将 `findDOMNode` 替换为 `resolveDOM`，将 `element.ref` / `element.props.ref` 替换为 `getRef`。

**ResizeObserver 的 `getElement` 方法：**

```tsx
// ❌ 改造前
getElement = () => {
    try {
        /* REACT_18_START */
        return findDOMNode(this.childNode || this);
        /* REACT_18_END */
        /* REACT_19_START */
        // return this.childNode || null;
        /* REACT_19_END */
    } catch (error) {
        return null;
    }
};

// ✅ 改造后
getElement = () => {
    try {
        const node = this.childNode || this;
        return resolveDOM(node) || (node instanceof Element ? node : null);
    } catch (error) {
        return null;
    }
};
```

### 5.5 涉及的文件变更


| 文件                         | 变更类型   | 改动量    | 说明                                                         |
| -------------------------- | ------ | ------ | ---------------------------------------------------------- |
| `react19-adapter.ts`       | **新增** | +15 行  | 用户侧 adapter 入口（含 JSDoc 注释）                                 |
| `_utils/reactRender.ts`    | **新增** | +166 行 | 统一渲染抽象层，包含 `render`、`unmount`、`resolveDOM`、`getRef` 四个核心函数 |
| `_utils/semi-global.ts`    | 修改     | ±146 行 | 提取 `SemiGlobalConfig` 接口，添加 `createRoot` 类型定义              |
| `modal/confirm.tsx`        | 简化     | -46 行  | 移除条件编译和 root 变量管理，使用 `reactRender` / `reactUnmount`        |
| `toast/index.tsx`          | 简化     | -74 行  | 移除条件编译、消息队列和 root 变量，使用 `reactRender` / `reactUnmount`     |
| `notification/index.tsx`   | 简化     | -63 行  | 移除条件编译和 root 变量，使用 `reactRender` / `reactUnmount`          |
| `tooltip/index.tsx`        | 简化     | -65 行  | 移除 5 处条件编译，使用 `resolveDOM` / `getRef`，增强错误提示               |
| `dragMove/index.ts`        | 简化     | -19 行  | 移除条件编译，使用 `resolveDOM` / `getRef`                          |
| `resizeObserver/index.tsx` | 简化     | -22 行  | 移除条件编译，使用 `resolveDOM` / `getRef`                          |
| `package.json`             | 修改     | +5 行   | 添加 `react19-adapter` 相关文件到 `files` 字段                      |


**净效果**：新增 502 行，删除 422 行。新增的主要是 `reactRender.ts`（166 行高质量工具模块）和 `react19-adapter.ts`（15 行含注释），而删除的是散落在 7 个组件文件中的重复条件编译代码。代码的信息密度和可维护性大幅提升。

### 5.6 优点

**1. 用户体验极佳——零包名变更**

用户升级 React 19 时，只需在入口添加一行 import，所有 Semi 组件的 import 路径保持不变：

```js
// 仅需添加这一行
import '@douyinfe/semi-ui/react19-adapter';

// 所有组件 import 不变
import { Button, Modal, Toast } from '@douyinfe/semi-ui';
```

对于大型项目，这意味着零迁移成本（除了那一行 adapter import）。相比旧方案需要全局替换包名，新方案的迁移体验是质的飞跃。

**2. 维护成本大幅降低——单包发布**

只需维护一个 `@douyinfe/semi-ui` 包，CI/CD 流水线、测试矩阵、版本管理都回归简单。不再需要：

- 维护 `react19-build.js` 构建脚本
- 同步发布两个 npm 包
- 管理两套版本号
- 在两个包之间同步 bug 修复

**3. 代码质量显著提升**

- 所有代码都是"活代码"，TypeScript 编译器可以完整检查
- IDE 支持完整的自动补全、跳转、重构
- ESLint 可以检测所有代码路径
- 没有注释中的"暗代码"
- 每个组件文件减少了 20-70 行条件编译代码，可读性大幅提升

**4. 架构清晰——关注点分离**

渲染兼容性逻辑集中在 `reactRender.ts` 一个文件中（166 行），组件层面只需调用统一的 API（`reactRender`、`reactUnmount`、`resolveDOM`、`getRef`），不需要关心底层的版本差异。这遵循了单一职责原则，未来如果 React 20 再次变更 API，只需修改 `reactRender.ts` 一个文件。

**5. 与 Ant Design 方案一致——降低用户学习成本**

新方案的使用方式与 Ant Design 的 `@ant-design/v5-patch-for-react-19` 高度一致，都是"在入口导入一个 adapter"。对于同时使用 Semi 和 antd 的项目，用户的心智模型是统一的。但相比 antd 需要安装额外的 npm 包，Semi 的 adapter 内置在主包中，更加简洁。

**6. 全版本覆盖——不放弃任何用户**

三级降级策略确保了 React 16/17/18/19 全版本支持：

- React 16/17 用户：自动使用 `ReactDOM.render`，无需任何配置
- React 18 用户：自动发现 `createRoot`，无需任何配置
- React 19 用户：通过 adapter 注入 `createRoot`，一行代码搞定

这一点优于 antd v6（放弃 React 16/17）和 MUI（放弃 React 16/17），对于国内大量存量 React 16/17 项目的用户来说尤为重要。

**7. 友好的错误提示**

当 React 19 用户忘记导入 adapter 时，控制台会输出清晰的中英双语错误提示，引导用户到文档页面：

```
[Semi UI] createRoot is not available.
If you are using React 19, please inject createRoot before using Semi components.
For details, see: https://semi.design/zh-CN/ecosystem/react19

[Semi UI] createRoot 不可用。
如果您正在使用 React 19，请在使用 Semi 组件前注入 createRoot。
详情请参阅：https://semi.design/zh-CN/ecosystem/react19
```

同时，异常配置（如在 React 16 中注入 `createRoot`）也会给出警告，帮助开发者排查问题。

**8. 消除了异步渲染的竞态问题**

旧方案中 React 19 版本的 Toast/Notification 需要消息队列来处理异步 ref，存在竞态条件风险。新方案通过在 ref 回调中直接执行操作（`if (instance) { instance.add(...) }`），利用 React 的 ref 回调保证，优雅地消除了这个问题，代码更简洁也更可靠。

**9. 可扩展性强**

如果未来需要注入其他 React 版本相关的 API（例如 React 20 可能引入的新变更），只需：

1. 在 `SemiGlobalConfig` 中添加新字段
2. 在 `reactRender.ts` 中添加对应的降级逻辑
3. 更新 `react19-adapter.ts`（或新建 `react20-adapter.ts`）

整个扩展过程不影响任何现有组件代码。

---

## 六、总结


| 维度              | 旧方案（条件编译 + 双包） | 新方案（Adapter 注入） |
| --------------- | -------------- | --------------- |
| npm 包数量         | 2 个            | 1 个             |
| 用户迁移成本          | 高（全局替换包名）      | 极低（一行 import）   |
| 支持的 React 版本    | 16-19          | 16-19           |
| 代码可读性           | 差（条件编译标记）      | 好（统一 API）       |
| TypeScript 类型安全 | 差（注释代码无检查）     | 好（全部可检查）        |
| 维护成本            | 高（双包同步）        | 低（单包）           |
| CI/CD 复杂度       | 高              | 低               |
| 构建脚本依赖          | 是（正则替换）        | 否               |
| 错误提示            | 无              | 有（中英双语）         |
| 与业界方案一致性        | 低              | 高（与 antd 一致）    |


新方案通过引入一个轻量的渲染抽象层（`reactRender.ts`，166 行）和一个极简的 adapter 入口（`react19-adapter.ts`，3 行有效代码），以最小的架构变更实现了对 React 16/17/18/19 全版本的统一支持，同时大幅提升了代码质量和开发体验。这是一个在用户体验、维护成本和架构优雅性之间取得良好平衡的方案。