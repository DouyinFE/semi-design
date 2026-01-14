# 工作流：使用 MCP 工具查询组件

本文件描述如何使用 Semi MCP 工具完成常见任务。

## Semi MCP 工具概览

| 工具名称 | 功能 | 使用场景 |
|---------|------|---------|
| `get_semi_document` | 获取组件文档或组件列表 | 查找组件、了解 API |
| `get_component_file_list` | 获取组件源码文件列表 | 了解组件结构 |
| `get_file_code` | 获取文件代码内容 | 查看组件实现 |
| `get_function_code` | 获取函数完整实现 | 深入了解逻辑 |

## 基础查询流程

### 1. 查找组件

当你不确定使用哪个组件时，先查询组件列表：

```json
{
  "name": "get_semi_document"
}
```

返回所有可用组件列表，选择合适的组件。

### 2. 查询组件详情

获取指定组件的完整文档：

```json
{
  "name": "get_semi_document",
  "arguments": {
    "componentName": "Table"
  }
}
```

### 3. 查看组件源码

了解组件的内部实现：

```json
{
  "name": "get_component_file_list",
  "arguments": {
    "componentName": "Table"
  }
}
```

获取文件列表后，可以用 `get_file_code` 查看具体文件：

```json
{
  "name": "get_file_code",
  "arguments": {
    "filePath": "@douyinfe/semi-ui/table/Table.tsx"
  }
}
```

### 4. 查看函数实现

深入了解某个函数的逻辑：

```json
{
  "name": "get_function_code",
  "arguments": {
    "filePath": "@douyinfe/semi-ui/table/Table.tsx",
    "functionName": "render"
  }
}
```

## 完整任务示例

### 任务 1：创建一个带筛选功能的 Table

**目标**：创建一个支持本地筛选的 Table 组件

**步骤**：

1. **查询 Table 组件文档**
   ```json
   { "name": "get_semi_document", "arguments": { "componentName": "Table" } }
   ```

2. **获取 Table 相关文件**
   ```json
   { "name": "get_component_file_list", "arguments": { "componentName": "Table" } }
   ```

3. **查看筛选相关源码**
   - 查看 `foundation.ts` 中的筛选逻辑
   - 查看 `filter.tsx` 的实现
   - 查看 `columns.tsx` 了解列配置

4. **查看 onFilter 示例**
   ```json
   {
     "name": "get_function_code",
     "arguments": {
       "filePath": "@douyinfe/semi-ui/table/table.tsx",
       "functionName": "handleFilter"
     }
   }
   ```

5. **生成代码**
   根据查询结果，生成符合规范的 Table 筛选代码

### 任务 2：定制 Table 的列

**目标**：创建一个支持自定义列渲染的 Table

**步骤**：

1. **查询 Table 文档**，了解列配置选项
2. **查询 Column 组件**（如果有独立文档）
3. **查看 render 函数实现**，了解如何自定义单元格
4. **生成代码**，创建自定义列配置

### 任务 3：实现表单验证

**目标**：创建一个带复杂验证逻辑的表单

**步骤**：

1. **查询 Form 组件文档**
   ```json
   { "name": "get_semi_document", "arguments": { "componentName": "Form" } }
   ```

2. **获取 Form 相关文件**
   ```json
   { "name": "get_component_file_list", "arguments": { "componentName": "Form" } }
   ```

3. **查看验证相关代码**
   - 查看 `rules.ts` 或验证逻辑文件
   - 查看 `label.tsx` 了解标签配置

4. **生成表单代码**，包含：
   - 必填验证
   - 格式验证（邮箱、手机号）
   - 自定义验证函数

### 任务 4：创建级联选择器

**目标**：实现省市区三级级联选择

**步骤**：

1. **查询 Cascader 组件文档**
   ```json
   { "name": "get_semi_document", "arguments": { "componentName": "Cascader" } }
   ```

2. **查看数据结构示例**
   - 查看组件中的 data 格式
   - 了解 loadData 或 onChange 用法

3. **生成级联选择器代码**

### 任务 5：实现拖拽排序

**目标**：创建一个支持行拖拽排序的 Table

**步骤**：

1. **查询 Table 组件**，了解是否内置拖拽支持
2. **查询 Sortable 组件**（如果有）
3. **查看拖拽相关源码**
4. **生成带拖拽功能的 Table 代码**

## 常用查询技巧

### 1. 指定版本查询

```json
{
  "name": "get_semi_document",
  "arguments": {
    "componentName": "Button",
    "version": "2.89.2"
  }
}
```

### 2. 获取组件文件列表

获取组件的所有文件路径：

```json
{
  "name": "get_component_file_list",
  "arguments": {
    "componentName": "Table"
  }
}
```

### 3. 查看完整代码（不截断）

```json
{
  "name": "get_file_code",
  "arguments": {
    "filePath": "@douyinfe/semi-ui/button/Button.tsx",
    "fullCode": true
  }
}
```

## 错误排查流程

当遇到问题时，按以下步骤排查：

1. **确认组件名称正确**（大小写不敏感）
2. **确认文件路径正确**（参考 `get_path` 返回的路径）
3. **确认函数名称存在**（可在源码中搜索）
4. **查看错误信息**（通常会指明问题所在）

### 常见错误及解决

**错误 1：组件未找到**
- 确认组件名称拼写正确
- 使用 `get_semi_document` 获取完整列表

**错误 2：文件路径错误**
- 使用 `get_component_file_list` 获取正确路径
- 注意大小写和路径分隔符

**错误 3：函数不存在**
- 确认函数名称准确
- 使用 `get_file_code` 查看文件内容确认函数名
