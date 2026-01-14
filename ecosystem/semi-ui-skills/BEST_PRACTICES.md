# 最佳实践

本文件提供使用 Semi Design 组件的最佳实践。

## 组件引入

### 推荐方式

直接按需引入组件，无需额外配置：

```jsx
import { Button, Input, Table, Form, Modal } from '@douyinfe/semi-ui';
```

Semi Design 的构建产物已内置按需加载支持，无需配置 babel-plugin-import 或其他插件。

### 图标引入

```jsx
import { IconUser, IconHome, IconSearch } from '@douyinfe/semi-icons';
```

使用 tool  get_semi_document 传入 Icon 来查看所有可用的 icon

## 主题定制

如果需要自定义主题（如 Design Token、颜色、字体等），请参考官方定制文档：

文档中包含：
- 主题变量配置方法
- 暗黑模式支持

使用 MCP 工具获取相关文档：

```json
{
  "name": "get_semi_document",
  "arguments": {
    "componentName": "customize-theme"
  }
}
```

## React 19 兼容

如果项目使用 React 19，部分组件可能有特殊的用法或注意事项。

使用 MCP 工具获取 React 19 相关文档：

```json
{
  "name": "get_semi_document",
  "arguments": {
    "componentName": "react19"
  }
}
```

文档中包含：
- React 19 新特性使用示例
- 已知兼容性问题及解决方案
- 性能优化建议

## 扩展组件

如果通过传入 Props 或者 ref 的方法不能实现需求的时候，当 Semi Design 的默认功能不满足需求，或需要修改组件内部逻辑/样式时，推荐通过继承来扩展组件。

### 步骤 1：读取组件源码

使用 MCP 工具获取目标组件的源码：

```json
{
  "name": "get_component_file_list",
  "arguments": {
    "componentName": "Select"
  }
}
```

获取文件列表后，查看具体实现：

```json
{
  "name": "get_file_code",
  "arguments": {
    "filePath": "@douyinfe/semi-ui/select/index.tsx"
  }
}
```

### 步骤 2：创建扩展组件

使用 class 组件继承 Semi 组件，覆盖相应方法：

```jsx
import { Select } from '@douyinfe/semi-ui';

class CustomSelect extends Select {
  // 覆盖渲染方法，修改 UI
  render() {
    const original = super.render();
    // 在原 Select 前后添加自定义内容
    return (
      <div className="custom-select-wrapper">
        <span className="label">{this.props.label}</span>
        {original}
      </div>
    );
  }
  
  // 覆盖选项选择处理，添加额外逻辑
  onSelect(option, optionIndex, e) {
    console.log('自定义选择逻辑', option);
    // 调用原始逻辑
    super.onSelect(option, optionIndex, e);
  }
  
  // 覆盖生命周期方法
  componentDidMount() {
    super.componentDidMount();
    console.log('Select 已挂载');
  }
}
```

### 步骤 3：使用扩展组件

```jsx
import { CustomSelect } from './components';

<CustomSelect 
  label="请选择"
  dataSource={[
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' }
  ]}
  onChange={value => console.log('选择了', value)}
/>
```

### 覆盖内部逻辑示例

修改 Table 的排序行为：

```jsx
import { Table } from '@douyinfe/semi-ui';

class CustomTable extends Table {
  handleSorterChange = (column, order) => {
    // 添加自定义排序逻辑
    if (this.props.onCustomSort) {
      this.props.onCustomSort(column, order);
    }
    // 调用原始逻辑
    super.handleSorterChange(column, order);
  }
}
```

### 注意事项

- 只覆盖必要的方法，避免破坏组件封装
- 调用 `super.xxx()` 保留原始逻辑

### 使用场景

继承扩展是一种较重的方案，应优先尝试通过 props 实现：

**优先使用 props**：
```jsx
// 大多数需求可以通过 props 满足
<Button type="primary" loading={loading} onClick={handleClick}>
  按钮
</Button>
```

**当 props 无法满足时**，才考虑扩展：
- 需要修改组件内部方法的默认行为
- 需要劫持组件的生命周期逻辑
- 需要在渲染流程中插入自定义逻辑，或修改组件内部 UI

例如：需要修改 Table 排序的默认算法、覆盖 Modal 的某些默认配置等。


# tailwind
如果项目使用 tailwind, 请使用 MCP 工具获取相关文档：

```json
{
  "name": "get_semi_document",
  "arguments": {
    "componentName": "tailwind"
  }
}
```



