# Semi MCP Server

基于 Model Context Protocol (MCP) SDK 实现的 MCP 服务器，使用 stdio 作为传输层。

## 安装

```bash
npm install
```

## 构建

构建项目：

```bash
npm run build
```

开发模式（监听文件变化）：

```bash
npm run dev
```

## 运行

构建完成后运行服务器：

```bash
npm start
```

或者直接运行构建后的文件：

```bash
node dist/index.js
```

## 功能

当前实现的功能包括：

- **工具 (Tools)**
  - `semi_component_info`: 获取 Semi Design 组件信息

- **资源 (Resources)**
  - `semi://components`: Semi Design 组件列表资源

## 使用方式

MCP 服务器通过 stdio（标准输入/输出）进行通信，适用于与支持 MCP 协议的客户端集成。

## 开发

项目使用 TypeScript 和 Rslib 构建工具。

- `npm run build` - 构建生产版本
- `npm run dev` - 开发模式，监听文件变化并自动重建
- `npm run test` - 运行测试
