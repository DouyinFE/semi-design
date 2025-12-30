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

## 功能

### 工具 (Tools)

#### `get_semi_document`

获取 Semi Design 组件文档或组件列表。

**参数：**
- `componentName` (可选): 组件名称，例如 `Button`、`Input` 等。如果不提供，则返回组件列表
- `version` (可选): 版本号，例如 `2.89.2-alpha.3`。如果不提供，默认使用 `latest`
- `get_path` (可选): 如果为 `true`，将文档写入操作系统临时目录并返回路径，而不是在响应中返回文档内容。默认为 `false`

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

**返回格式：**

所有响应均以纯文本形式返回，方便 AI 直接阅读。

获取组件列表时：
```
Semi Design 组件列表 (版本 2.89.2-alpha.3)，共 70 个组件：

button, input, select, table, ...
```

获取小型组件文档时（< 888 行）：
```
===== index.md =====

---
title: Button
...
---

## 使用方法
...

===== index-en-US.md =====

---
title: Button
...
---

## Usage
...
```

获取大型组件文档时（> 888 行），工具会自动保存到临时目录：
```
组件 Table (版本 2.89.2-alpha.3) 文档较大，已保存到临时目录。

文档文件列表：
  - /tmp/semi-docs-table-2.89.2-alpha.3-1234567890/index.md (6,055 行)
  - /tmp/semi-docs-table-2.89.2-alpha.3-1234567890/index-en-US.md (5,660 行)

请使用文件读取工具查看文档内容。
```

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
