---
category: 开始
title: AI Agent MCP/Skills
subTitle: AI Agent MCP/Skills
localeCode: zh-CN
icon: doc-mcp
order: 11
showNew: true
---

## 什么是 MCP？

Model Context Protocol（MCP）是一种标准化协议，用于连接 AI 助手与外部数据源和工具。通过 MCP，AI 助手可以动态发现和调用各种能力，而无需为每个工具单独集成。

**MCP 的核心价值**：
- **统一接口**：提供标准化的方式让 AI 与外部系统交互
- **动态发现**：AI 可以自动发现可用的工具和资源
- **易于扩展**：新增工具只需实现 MCP 协议即可被 AI 使用

### Semi MCP 有什么用？

Semi MCP 是基于 MCP 协议实现的 Semi Design 专用服务器，它为 AI 助手提供了以下能力：

- **查询组件文档**：AI 可以直接获取 Semi Design 任意组件的使用文档，无需人工查找
- **查看源码结构**：AI 可以浏览组件的源码文件，了解组件的内部实现
- **获取函数实现**：AI 可以查看特定函数的完整代码，深入理解组件逻辑
- **深入理解组件**：AI 可以查看组件的样式实现和内部逻辑，写出的代码更精确、样式更美观
- **版本切换**：支持查询不同版本的组件信息，适配各种项目环境

通过 Semi MCP，AI 助手在编写 Semi Design 代码时可以做到「有据可查」，大幅提升代码的准确性和开发效率。

## 什么是 Skills？

Skills（技能）是一种模块化的能力扩展方式，允许 AI 助手通过添加预定义的指令和工具来增强其功能。每个 Skill 包含详细的说明文档和相关的代码资源，使 AI 能够在特定任务中表现得更加专业和高效。

**Skills 的核心价值**：
- **领域专长**：为 AI 添加特定领域的专业知识和最佳实践
- **标准化**：统一团队的开发流程和规范
- **可复用**：快速复用成功经验和解决方案

### Semi Skills 有什么用？

Semi Skills 是一套预配置的 Semi Design 专家知识库，它帮助 AI 助手：

- **遵循最佳实践**：了解组件的正确引入方式、主题定制方法、常见陷阱规避
- **掌握工作流程**：知道如何使用 MCP 工具完成常见任务（查询组件、实现功能、排查问题）
- **处理复杂场景**：当 props 无法满足需求时，如何通过继承扩展组件或修改内部 UI
- **兼容新版本**：获取 React 19 等新环境的组件使用指导

通过 Semi Skills，AI 助手可以像专业的 Semi Design 开发者一样思考和编码。

## 安装指南

<Notice type="warning" title='⚠️ 版本建议'>
在开始安装之前，建议你的环境满足以下版本要求：

- **Node.js**: 建议版本大于 20.19.0
- **npm**: 建议版本大于 11.3.0

如果版本不满足要求，MCP 可能无法正常运行。你可以通过以下命令检查当前版本：

```bash
node -v
npm -v
```
</Notice>

### 安装 MCP

MCP 的安装方式因客户端而异，以下是常见客户端的配置方法：

<Notice title='💡 字节跳动内网用户'>
外网 MCP 在内网无法使用。如果你是字节跳动内网用户，请将包名修改为 `@ies/semi-mcp-bytedance`，或在字节云 MCP 市场搜索 "Semi" 一键添加。
</Notice>

#### Claude Desktop

在配置文件 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "npx",
      "args": ["-y", "@douyinfe/semi-mcp"] // 内网用户请将包名修改为 @ies/semi-mcp-bytedance
    }
  }
}
```

#### Cursor & Trae

在设置中找到 MCP 配置，添加：

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "npx",
      "args": ["-y", "@douyinfe/semi-mcp"] // 内网用户请将包名修改为 @ies/semi-mcp-bytedance
    }
  }
}
```

#### Claude CLI (Claude Code)

在终端中运行以下命令添加 MCP：

```bash
claude mcp add semi-mcp -- npx -y @douyinfe/semi-mcp
# 内网用户请使用：claude mcp add semi-mcp -- npx -y @ies/semi-mcp-bytedance
```

#### 故障排除

<Notice type="warning" title='⚠️ oxc-parser 相关错误'>
如果运行 MCP 时遇到 `oxc-parser` 或类似的依赖解析错误，这是 npm 的已知 bug。请按以下步骤解决：首先升级 npm 到最新版本 `npm install -g npm@latest`，然后在终端中手动全局安装 `npm i -g @douyinfe/semi-mcp`（字节跳动内网用户注意替换包名），最后重新尝试配置 MCP 即可。
</Notice>

### 安装 Skills

下面的安装面板可以帮助你一键安装 Semi Skills 到你的项目中。选中你使用的编程工具，点击「添加到我的项目」，选择目标目录，即可完成安装。

<SkillsWriter />

如果你的编程工具不在列表中，可以手动下载 [skills.zip](/skills.zip) 文件，参考上方表格中其他编程工具的 Skills 路径，将压缩包解压到对应的目录即可。

## Semi MCP 详解

Semi MCP 是基于 Model Context Protocol（MCP）实现的服务器，为 Semi Design 组件提供文档查询、代码查看等功能。通过该工具，AI 助手可以快速获取 Semi Design 组件的使用文档、源码结构等信息，提升开发效率。

注意，mcp 内的知识是从 semi 2.90.2 版本开始稳定更新，如果项目 Semi 低于此版本可能出现 AI 获取到的知识和项目低版本 Semi 实际不符，需要仔细甄别或者升级项目版本到 2.90.2 之后。对于之后的版本，AI 会在调用工具的时候传入版本号来获得特定版本的知识。

### 工具（Tools）

Semi MCP 提供了以下工具供 AI 助手调用：

| 工具名称 | 功能 | 使用场景 |
|---------|------|---------|
| `get_semi_document` | 获取组件文档或组件列表 | 查找组件、了解 API |
| `get_semi_code_block` | 获取大文档中被隐藏的代码块 | 查看详细代码示例 |
| `get_component_file_list` | 获取组件源码文件列表 | 了解组件结构 |
| `get_file_code` | 获取文件代码内容 | 查看组件实现 |
| `get_function_code` | 获取函数完整实现 | 深入了解逻辑 |


## Semi Skills 详解

Semi Design Skills 是一套预配置的能力模块，包含 Semi Design 组件的使用指南、最佳实践和工作流程。

### 文件说明

本 Skill 由以下文件组成，每个文件专注于特定方面的指导：

#### WORKFLOWS.md

**内容**：使用 Semi MCP 工具的完整工作流程。

**包含**：
- MCP 工具概览：介绍五个工具的功能和使用场景
- 基础查询流程：查找组件 → 查询详情 → 查看源码 → 查看函数实现的四步走流程
- 完整任务示例：包含 Table 筛选、表单验证、级联选择器、拖拽排序等常见场景的详细步骤
- 常用查询技巧：指定版本查询、获取完整代码、错误排查流程等


#### BEST_PRACTICES.md

**内容**：使用 Semi Design 组件的最佳实践和注意事项。

**包含**：
- 组件引入方式：推荐直接 import 导入组件、图标、样式的方式
- 主题定制指南：引导 AI 查阅官方定制文档
- React 19 兼容性：说明如何获取 React 19 相关的组件使用说明
- 组件扩展方法：当 props 无法满足需求时，如何通过继承扩展 Semi 组件和优雅修改组件内部 UI 而不破坏版本兼容性




## 相关资源

- [Model Context Protocol 文档](https://modelcontextprotocol.io)
- [Claude Agent Skills 文档](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [OpenAI Codex Skills 文档](https://developers.openai.com/codex/skills/)
