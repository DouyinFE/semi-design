[中文](README-zh_CN.md) | [English](README.md)

# Semi MCP Server

基于 Model Context Protocol (MCP) SDK 实现的 MCP 服务器，提供 Semi Design 组件文档和组件列表查询功能。

## 简介

Semi MCP Server 是一个 MCP (Model Context Protocol) 服务器，通过 stdio 传输层与支持 MCP 协议的客户端通信。它提供了获取 Semi Design 组件文档、组件列表等功能。

## 安装

### 全局安装

```bash
npm install -g @douyinfe/semi-mcp
```

### 本地安装

```bash
npm install @douyinfe/semi-mcp
```

## 使用方法

### 作为命令行工具

全局安装后，可以直接使用：

```bash
semi-mcp
```

### 在 MCP 客户端中配置

在支持 MCP 的客户端（如 Claude Desktop）中配置：

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "npx",
      "args": ["-y", "@douyinfe/semi-mcp"]
    }
  }
}
```

或者如果已全局安装：

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "semi-mcp"
    }
  }
}
```

### 在 Claude CLI (Claude Code) 中配置

在终端中运行以下命令添加 MCP：

```bash
claude mcp add semi-mcp -- npx -y @douyinfe/semi-mcp
```

## 功能

### 工具 (Tools)

#### `get_semi_document`

获取 Semi Design 组件文档或组件列表。

**参数：**
- `componentName` (可选): 组件名称，例如 `Button`、`Input` 等。如果不提供，则返回组件列表
- `version` (可选): 版本号，例如 `2.89.2-alpha.3`。如果不提供，默认使用 `latest`

**示例：**

获取组件列表：
```json
{
  "name": "get_semi_document"
}
```

获取指定组件文档：
```json
{
  "name": "get_semi_document",
  "arguments": {
    "componentName": "Button",
    "version": "2.89.2-alpha.3"
  }
}
```

---

#### `get_component_file_list`

获取 Semi Design 组件的所有文件路径列表。

**参数：**
- `componentName` (必填): 组件名称，例如 `Table`、`DatePicker` 等（大小写不敏感）
- `version` (可选): 版本号，默认为 `2.89.2-alpha.3`

**示例：**
```json
{
  "name": "get_component_file_list",
  "arguments": {
    "componentName": "Table"
  }
}
```

**返回格式：**
```
组件: table
版本: 2.89.2-alpha.3
总文件数: 38

文件类型统计:
  .ts:   11
  .tsx:  21
  .scss: 6

===== 文件列表 =====

@douyinfe/semi-foundation/table/foundation.ts
@douyinfe/semi-foundation/table/constants.ts
@douyinfe/semi-ui/table/Table.tsx
@douyinfe/semi-ui/table/index.tsx
...
```

---

#### `get_file_code`

获取指定文件的代码内容。

**参数：**
- `filePath` (必填): 文件完整路径，如 `@douyinfe/semi-ui/table/Table.tsx`
- `version` (可选): 版本号，默认为 `2.89.2-alpha.3`
- `fullCode` (可选): 是否获取完整代码（包含函数体），默认为 `false`

**行为说明：**
- `.ts/.tsx` 文件且行数 >= 500：函数体被替换为 `{ ... }`，只显示代码结构
- `.ts/.tsx` 文件且行数 < 500：显示完整代码
- 其他文件（`.scss` 等）：显示完整内容
- `fullCode: true`：强制显示完整代码

**示例：**
```json
{
  "name": "get_file_code",
  "arguments": {
    "filePath": "@douyinfe/semi-ui/table/Table.tsx"
  }
}
```

---

#### `get_function_code`

获取指定文件中某个函数的完整实现。

**参数：**
- `filePath` (必填): 文件完整路径
- `functionName` (必填): 函数名称，如 `render`、`handleClick` 等
- `version` (可选): 版本号，默认为 `2.89.2-alpha.3`

**支持的函数类型：**
- 普通函数声明: `function foo() {}`
- 箭头函数: `const foo = () => {}`
- 类方法: `class Foo { bar() {} }`
- getter/setter: `get foo() {}` / `set foo() {}`

**示例：**
```json
{
  "name": "get_function_code",
  "arguments": {
    "filePath": "@douyinfe/semi-foundation/table/foundation.ts",
    "functionName": "init"
  }
}
```

**返回格式：**
```
文件: @douyinfe/semi-foundation/table/foundation.ts
函数: init
版本: 2.89.2-alpha.3

============================================================

init() {
    const dataSource = [...this.getProp('dataSource')];
    // ... 完整函数实现
}
```

---

### 推荐使用流程

1. **获取文件列表**: 使用 `get_component_file_list` 获取组件所有文件
2. **查看代码结构**: 使用 `get_file_code` 查看感兴趣的文件（大文件自动过滤函数体）
3. **获取函数实现**: 使用 `get_function_code` 获取具体函数的完整代码

### 资源 (Resources)

#### `semi://components`

Semi Design 组件列表资源。

## 开发

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 构建

构建生产版本：

```bash
npm run build
```

开发模式（监听文件变化并自动重建）：

```bash
npm run dev
```

### 测试

运行测试：

```bash
npm test
```

### 运行

构建完成后运行服务器：

```bash
npm start
```

或者直接运行构建后的文件：

```bash
node dist/index.js
```

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **Rslib**: 快速构建工具
- **@modelcontextprotocol/sdk**: MCP 官方 SDK

## 项目结构

```
semi-mcp/
├── src/
│   ├── index.ts              # 主入口文件
│   ├── tools/                # 工具定义
│   │   ├── index.ts
│   │   └── get-semi-document.ts
│   └── utils/                # 工具函数
│       ├── fetch-directory-list.ts
│       ├── fetch-file-content.ts
│       └── get-component-list.ts
├── tests/                    # 测试文件
│   └── get-semi-document.test.ts
├── dist/                     # 构建输出
├── package.json
└── README.md
```

## 许可证

MIT

## 相关链接

- [Semi Design 官网](https://semi.design)
- [Model Context Protocol 文档](https://modelcontextprotocol.io)
