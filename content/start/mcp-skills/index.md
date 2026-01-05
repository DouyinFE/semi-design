---
category: 开始
title: AI MCP 与 Skills
subTitle: AI MCP 与 Skills
localeCode: zh-CN
icon: doc-intro
order: 0
---

## Model Context Protocol (MCP)

Model Context Protocol（MCP）是一种标准化协议，用于连接 AI 助手与外部数据源和工具。通过 MCP，AI 助手可以动态发现和调用各种能力，而无需为每个工具单独集成。

<Notice type="primary" title="为什么使用 MCP？">
MCP 提供了一种统一的方式，让 AI 助手可以：
- 访问外部数据源和文件系统
- 调用各种工具和 API
- 在不同环境间移植和复用配置
</Notice>

## Semi MCP

Semi MCP 是基于 Model Context Protocol（MCP）实现的服务器，为 Semi Design 组件提供文档查询、代码查看等功能。通过该工具，AI 助手可以快速获取 Semi Design 组件的使用文档、源码结构等信息，提升开发效率。

### 配置方式

在支持 MCP 协议的客户端中配置即可使用。以 Claude Desktop 为例，在配置文件 `claude_desktop_config.json` 中添加：

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

### 功能特性

#### 工具（Tools）

Semi MCP 提供了多个工具供 AI 助手调用：

- **get_semi_document**：获取 Semi Design 组件文档或组件列表
- **get_component_file_list**：获取 Semi Design 组件的所有源码文件路径列表
- **get_file_code**：获取指定文件的代码内容
- **get_function_code**：获取指定文件中某个函数的完整实现

#### 资源（Resources）

- **semi://components**：提供 Semi Design 组件列表资源

## Skills

Skills（技能）是一种模块化的能力扩展方式，允许 AI 助手通过添加预定义的指令和工具来增强其功能。每个 Skill 包含详细的说明文档和相关的代码资源，使 AI 能够在特定任务中表现得更加专业和高效。

### Skills 是什么？

Skills 是预配置的能力模块，包含：
- **指令说明**（SKILL.md）：定义技能的功能、使用方法和最佳实践
- **支持文件**：相关的脚本、模板和资源文件

通过 Skills，你可以：
- 为 AI 助手添加特定领域的专业知识
- 标准化团队的开发流程和最佳实践
- 快速复用成功经验和解决方案

### 常见编程工具的 Skills 路径

不同的 AI 编程工具使用不同的目录来存储 Skills：

| 编程工具 | Skills 路径 |
|---------|------------|
| Trae | `.trae/skills/` |
| Cursor | `.cursor/skills/` |
| CodeBuddy (腾讯云) | `.codebuddy/skills/` |
| Claude Code | `.claude/skills/` |
| Qwen Code (通义千问) | `.qwen/skills/` |
| OpenAI Codex CLI | `.codex/skills/` |
| 通用标准 | `.skills/` |

<SkillsWriter />

## 版本说明

Semi MCP 支持查询 Semi Design 的不同版本内容。通过指定 `version` 参数，你可以查询最新发布版本、特定版本或预发布版本的组件信息。

## 相关资源

- [Semi Design 官网](https://semi.design)
- [Semi Design GitHub](https://github.com/DouyinFE/semi-design)
- [Model Context Protocol 文档](https://modelcontextprotocol.io)
