---
name: semi-design-guide
description: 使用 Semi Design 组件的完整指南，包括 MCP 工具使用流程、常见模式、最佳实践。当你需要查询 Semi Design 组件、生成组件代码或解决使用问题时，请使用此技能。
---

# Semi Design 使用指南

此 Skill 帮助你高效使用 Semi Design 组件库完成常见开发任务。

## 文件说明

本 Skill 由以下文件组成，每个文件专注于特定方面的指导：

### WORKFLOWS.md

**内容**：使用 Semi MCP 工具的完整工作流程。

**包含**：
- MCP 工具概览：介绍 `get_semi_document`、`get_component_file_list`、`get_file_code`、`get_function_code` 四个工具的功能和使用场景
- 基础查询流程：查找组件 → 查询详情 → 查看源码 → 查看函数实现的四步走流程
- 完整任务示例：包含 Table 筛选、表单验证、级联选择器、拖拽排序等常见场景的详细步骤
- 常用查询技巧：指定版本查询、获取完整代码、错误排查流程等

**何时使用**：当你需要查询组件文档、了解组件 API、实现某个具体功能但不确定如何下手时。

### BEST_PRACTICES.md

**内容**：使用 Semi Design 组件的最佳实践和注意事项。

**包含**：
- 组件引入方式：推荐直接 import 导入组件、图标、样式的方式
- 主题定制指南：引导 AI 查阅官方定制文档
- React 19 兼容性：说明如何获取 React 19 相关的组件使用说明
- 组件扩展方法：当 props 无法满足需求时，如何通过继承扩展 Semi 组件 和 修改组件内部UI

**何时使用**：当你需要确保代码符合最佳实践、解决组件使用中的疑难问题时。

## 快速导航

| 需求 | 查看 |
|------|------|
| 如何使用 MCP 工具查询组件 | [WORKFLOWS.md](WORKFLOWS.md) |
| 组件使用的最佳实践 | [BEST_PRACTICES.md](BEST_PRACTICES.md) |

## 概述

Semi Design 是字节跳动推出的企业级 UI 组件库。此 Skill 配合 [Semi MCP](/start/ai-mcp) 工具使用，提供：

- **工作流**：使用 MCP 工具查询组件、生成代码的完整流程
- **实践**：避免常见陷阱的最佳实践

## 前置条件

使用此技能前，请确保已配置 Semi MCP：

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
