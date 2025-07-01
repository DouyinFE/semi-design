# Semi UI React 19 适配指南

## 📋 概述

本指南详细说明了如何将 Semi UI 组件库适配到 React 19，同时保持对 React 18 的向后兼容性。

由于 React 19 做了太多 breaking change，对原有用户群体的使用会有很大的升级阻塞成本。所以当前 Semi UI的常规版本仍以适配 React 18 作为主要目标，React 19中的 breaking change 将通过条件编译的方式来实现兼容。

## 🔍 发现的主要问题

### 1. PropTypes 被移除 (影响: 🔴 高)
**问题**: React 19 完全移除了 PropTypes 支持
**影响范围**: 几乎所有组件都在使用 PropTypes
**解决方案**: 构建时移除所有 PropTypes 相关代码

### 2. 过时的 ReactDOM APIs (影响: 🟡 中)
**问题**: `ReactDOM.render` 和 `ReactDOM.unmountComponentAtNode` 在 React 19 中被移除
**影响的文件**:
- `packages/semi-ui/modal/confirm.tsx`
- `packages/semi-ui/toast/index.tsx`
- `packages/semi-ui/notification/index.tsx`

**解决方案**: 替换为新的 `createRoot` API

### 3. **findDOMNode 被移除** (影响: 🔴 高)
**问题**: `ReactDOM.findDOMNode` 在 React 19 中被完全移除
**影响的文件** (共10个文件):

#### 🟢 可控场景 (组件库内部可处理，6个文件):
- `packages/semi-ui/select/index.tsx` - 内部 optionInstance  
- `packages/semi-ui/slider/index.tsx` - 内部 handleInstance
- `packages/semi-ui/cascader/index.tsx` - 内部 optionInstance
- `packages/semi-ui/rating/index.tsx` - 内部 star instances  
- `packages/semi-ui/autoComplete/index.tsx` - 内部 optionInstance
- `packages/semi-ui/treeSelect/index.tsx` - 内部 optionInstance

**解决方案**: 直接使用 ref 替代，无需用户适配

#### 🔴 不可控场景 (需要用户适配，4个文件):
- `packages/semi-ui/tooltip/index.tsx` - 用户传入的 children
- `packages/semi-ui/resizeObserver/index.tsx` - 用户传入的 children  
- `packages/semi-ui/dragMove/index.ts` - 用户传入的 children
- `packages/semi-ui/calendar/monthCalendar.tsx` - 用户传入的事件组件

**解决方案**: 需要用户确保传入的组件支持 ref 转发

#### 📋 用户迁移指南 (针对不可控场景)

对于使用以下组件的用户，在升级到 React 19 版本时需要注意：

**1. Tooltip 组件**
```tsx
// ❌ React 19 中可能出现问题的写法
<Tooltip content="tooltip">
  <div>trigger</div>  {/* 普通 div 元素 */}
</Tooltip>

// ✅ React 19 推荐写法 - 使用 forwardRef
const MyTrigger = React.forwardRef<HTMLDivElement, any>((props, ref) => (
  <div ref={ref} {...props}>trigger</div>
));

<Tooltip content="tooltip">
  <MyTrigger />
</Tooltip>

// ✅ 或者使用原生 DOM 元素 (已支持 ref)
<Tooltip content="tooltip">
  <button>trigger</button>
</Tooltip>
```

**2. ResizeObserver 组件**
```tsx
// ❌ 可能有问题的写法
<ResizeObserver onResize={handleResize}>
  <MyComponent />  {/* 如果 MyComponent 不支持 ref */}
</ResizeObserver>

// ✅ 确保被观察的组件支持 ref
const MyComponent = React.forwardRef((props, ref) => (
  <div ref={ref} {...props}>content</div>
));
```

**3. DragMove 组件**
类似处理，确保被拖拽的组件支持 ref 转发。

**4. Calendar 组件**
确保自定义事件组件支持 ref 转发。

### 4. 好消息 ✅
- defaultProps 主要用在类组件中，React 19 仍然支持
- 没有发现 UNSAFE_ 生命周期方法
- 没有发现过时的 Context API 使用

## 🛠️ 适配方案

### 方案概述
采用条件编译的方式，在代码中使用注释标记来区分不同版本的实现，构建时根据目标 React 版本进行代码转换。

### 核心实现

#### 1. 条件编译标记
```typescript
/* REACT_18_START */
// React 18 兼容的代码
import ReactDOM from 'react-dom';
ReactDOM.render(<Component />, div);
/* REACT_18_END */

/* REACT_19_START */
// React 19 兼容的代码（在 React 18 版本中被注释）
// import { createRoot } from 'react-dom/client';
// const root = createRoot(div);
// root.render(<Component />);
/* REACT_19_END */
```

#### 2. 构建脚本
- `scripts/react19-build.js`: 处理版本转换的核心脚本
- 自动移除 PropTypes 相关代码
- 激活对应版本的代码块

#### 3. CI/CD 流程
- 同时构建 React 18 和 React 19 版本
- 发布到不同的包名: `@douyinfe/semi-ui` 和 `@douyinfe/semi-ui-19`

## 📦 包结构

```
packages/
├── semi-ui/                    # React 18 版本 (默认)
└── semi-ui-19/                 # React 19 版本 (构建生成)
```

## 🚀 使用方式

### React 18 用户 (继续使用现有包)
```bash
npm install @douyinfe/semi-ui
```

### React 19 用户 (使用新包)
```bash
npm install @douyinfe/semi-ui-19
```

## 📝 需要修改的具体文件

### 1. Modal/confirm.tsx
```typescript
// 添加条件编译标记
/* REACT_18_START */
import ReactDOM from 'react-dom';
/* REACT_18_END */
/* REACT_19_START */
// import { createRoot } from 'react-dom/client';
/* REACT_19_END */

export default function confirm<T>(props: ConfirmProps) {
    const div = document.createElement('div');
    document.body.appendChild(div);

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
        //     if (div.parentNode) {
        //         div.parentNode.removeChild(div);
        //     }
        // }
        /* REACT_19_END */
    };

    function render(renderProps: ConfirmProps) {
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
}
```

### 2. Toast/index.tsx
类似的修改模式，将 `ReactDOM.render` 和 `ReactDOM.unmountComponentAtNode` 替换为 `createRoot` API。

### 3. Notification/index.tsx  
同样的修改模式。

### 4. findDOMNode 替换示例

#### Select/index.tsx (点击外部检测)
```typescript
// React 18 版本
/* REACT_18_START */
const clickOutsideHandler: (e: MouseEvent) => void = e => {
    const optionInstance = this.optionsRef && this.optionsRef.current;
    const optionsDom = ReactDOM.findDOMNode(optionInstance as ReactInstance);
    const target = e.target as Element;
    
    if (!(optionsDom && optionsDom.contains(target))) {
        cb(e);
    }
};
/* REACT_18_END */

// React 19 版本
/* REACT_19_START */
// const clickOutsideHandler: (e: MouseEvent) => void = e => {
//     const optionsDom = this.optionsRef && this.optionsRef.current;
//     const target = e.target as Element;
//     
//     if (!(optionsDom && optionsDom.contains(target))) {
//         cb(e);
//     }
// };
/* REACT_19_END */
```

#### Tooltip/index.tsx (获取触发器DOM)
```typescript
// React 18 版本
/* REACT_18_START */
getTriggerDOM: () => {
    if (this.triggerEl.current) {
        return ReactDOM.findDOMNode(this.triggerEl.current as ReactInstance) as HTMLElement;
    } else {
        return null;
    }
}
/* REACT_18_END */

// React 19 版本
/* REACT_19_START */
// getTriggerDOM: () => {
//     return this.triggerEl.current as HTMLElement;
// }
/* REACT_19_END */
```

#### ResizeObserver/index.tsx (获取观察元素)
```typescript
// React 18 版本
/* REACT_18_START */
getElement = () => {
    try {
        return findDOMNode(this.childNode || this);
    } catch (error) {
        return null;
    }
};
/* REACT_18_END */

// React 19 版本
/* REACT_19_START */
// getElement = () => {
//     try {
//         // 直接使用 ref，需要确保组件正确传递了 ref
//         return this.childNode || this.elementRef?.current;
//     } catch (error) {
//         return null;
//     }
// };
/* REACT_19_END */
```

## 🔧 构建和发布流程

### 开发阶段
```bash
# 正常开发，默认为 React 18 兼容
yarn dev

# 测试 React 19 兼容性
node scripts/react19-build.js 19
```

### CI/CD 阶段
1. 同时测试 React 18 和 React 19 版本
2. 构建两个版本的包
3. 发布到不同的 npm 包名

### 发布命令
```bash
# 构建 React 19 版本
node scripts/react19-build.js 19

# 发布 React 18 版本 (默认)
cd packages/semi-ui && npm publish

# 发布 React 19 版本
cd packages/semi-ui-19 && npm publish
```

## ⚠️ 注意事项

1. **PropTypes 移除**: React 19 版本将完全移除 PropTypes，依赖类型检查的代码需要使用 TypeScript
2. **测试覆盖**: 需要确保两个版本都有充分的测试覆盖
3. **文档更新**: 需要更新文档说明不同版本的使用方式
4. **向后兼容**: React 18 版本需要继续维护，直到大部分用户迁移到 React 19

## 📊 影响评估

| 组件类型 | 影响程度 | 工作量 | 需要修改 |
|---------|---------|---------|---------|
| findDOMNode - 不可控场景 (4个) | 🔴 高 | 大 | 需要用户适配 |
| findDOMNode - 可控场景 (6个) | 🟡 中 | 中 | 组件库内部处理 |
| Modal/Toast/Notification APIs | 🟡 中 | 小 | 替换 ReactDOM APIs |
| PropTypes 使用 (所有组件) | 🟢 低 | 无 | 构建时自动移除 |
| 其他组件 | 🟢 低 | 无 | 无需修改 |

## 🎯 总结

通过这套适配方案，Semi UI 可以：
1. 继续支持 React 18 用户，保持向后兼容
2. 为 React 19 用户提供专门的优化版本
3. 在代码层面保持单一维护，避免代码分叉
4. 通过 CI/CD 自动化构建和发布流程

## 🎯 适配工作量评估

**高优先级 (必须修改)**:
- 🔴 **findDOMNode - 不可控场景** - 4个组件，需要 **Breaking Changes** 和用户适配
- 🟡 **findDOMNode - 可控场景** - 6个组件，组件库内部处理
- 🟡 **ReactDOM APIs** - 3个文件需要修改 (相对简单)

**中等优先级 (构建时处理)**:
- ✅ **PropTypes 移除** - 所有组件 (构建脚本自动处理)

**低优先级 (无需修改)**:
- ✅ **defaultProps** - 继续使用 (React 19 类组件仍支持)
- ✅ **生命周期方法** - 无过时方法使用

## 🚀 实施建议

1. **第一阶段**: ReactDOM APIs 替换 (3个文件，相对简单)
2. **第二阶段**: findDOMNode 可控场景处理 (6个组件，组件库内部)  
3. **第三阶段**: findDOMNode 不可控场景处理 (4个组件，**Breaking Changes**)
4. **第四阶段**: 完善构建脚本和 CI/CD 流程
5. **第五阶段**: 全面测试、文档更新和发布

### ⚠️ 重要提醒

不可控场景的 4个组件 (Tooltip、ResizeObserver、DragMove、Calendar) 在 React 19 版本中将要求用户传入的组件必须支持 ref 转发，这是一个 **Breaking Change**，需要：

1. 在文档中明确说明
2. 提供详细的迁移指南  
3. 考虑在 React 19 版本中增加更好的错误提示
