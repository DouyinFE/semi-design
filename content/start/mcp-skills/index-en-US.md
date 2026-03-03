---
category: Start
title: AI Agent MCP/Skills
subTitle: AI Agent MCP/Skills
localeCode: en-US
icon: doc-mcp
order: 11
showNew: true
---

## What is MCP?

Model Context Protocol (MCP) is a standardized protocol for connecting AI assistants with external data sources and tools. Through MCP, AI assistants can dynamically discover and invoke various capabilities without having to integrate each tool separately.

**Core Values of MCP**:
- **Unified Interface**: Provides a standardized way for AI to interact with external systems
- **Dynamic Discovery**: AI can automatically discover available tools and resources
- **Easy to Extend**: New tools only need to implement the MCP protocol to be used by AI

### What is Semi MCP useful for?

Semi MCP is a Semi Design-specific server implemented based on the MCP protocol. It provides the following capabilities for AI assistants:

- **Query Component Documentation**: AI can directly obtain usage documentation for any Semi Design component without manual searching
- **View Source Code Structure**: AI can browse component source files to understand internal implementations
- **Get Function Implementations**: AI can view the complete code of specific functions to deeply understand component logic
- **Deep Component Understanding**: AI can view component style implementations and internal logic to write more precise code with better styling
- **Version Switching**: Supports querying component information for different versions to fit various project environments

Through Semi MCP, AI assistants can write Semi Design code with "reference available," significantly improving code accuracy and development efficiency.

## What is Skills?

Skills are modular capability extensions that allow AI assistants to enhance their functionality by adding pre-defined instructions and tools. Each Skill contains detailed documentation and related code resources, enabling AI to perform more professionally and efficiently in specific tasks.

**Core Values of Skills**:
- **Domain Expertise**: Adds domain-specific knowledge and best practices to AI assistants
- **Standardization**: Unifies team development processes and conventions
- **Reusability**: Quickly reuse successful experiences and solutions

### What is Semi Skills useful for?

Semi Skills is a pre-configured Semi Design expert knowledge base that helps AI assistants:

- **Follow Best Practices**: Understand correct component import methods, theme customization approaches, and common pitfall avoidance
- **Master Workflows**: Know how to use MCP tools to complete common tasks (querying components, implementing features, troubleshooting issues)
- **Handle Complex Scenarios**: When props cannot meet requirements, how to extend components via inheritance or modify internal UI
- **Compatibility with New Versions**: Obtain guidance for using components in new environments like React 19

Through Semi Skills, AI assistants can think and code like professional Semi Design developers.

## Installation Guide

<Notice type="warning" title='⚠️ Version Recommendations'>
Before starting the installation, it is recommended that your environment meets the following version requirements:

- **Node.js**: Recommended version greater than 20.19.0
- **npm**: Recommended version greater than 11.3.0

If the versions do not meet the requirements, MCP may not run properly. You can check your current versions with the following commands:
```bash
node -v
npm -v
```
</Notice>

### Install MCP

Installation methods vary by client. Here are the configuration methods for common clients:

<Notice title='💡 ByteDance Intranet Users'>
Public network MCP cannot be used within the intranet. If you are a ByteDance intranet user, please change the package name to `@ies/semi-mcp-bytedance`, or search for "Semi" in the ByteDance Cloud MCP Marketplace to add with one click.
</Notice>

#### Claude Desktop

Add the following to the configuration file `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "npx",
      "args": ["-y", "@douyinfe/semi-mcp"] // For intranet users: change package to @ies/semi-mcp-bytedance
    }
  }
}
```

#### Cursor & Trae

Find MCP configuration in settings and add:

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "npx",
      "args": ["-y", "@douyinfe/semi-mcp"] // For intranet users: change package to @ies/semi-mcp-bytedance
    }
  }
}
```

#### Claude CLI (Claude Code)

Run the following command in terminal to add MCP:

```bash
claude mcp add semi-mcp -- npx -y @douyinfe/semi-mcp
# For intranet users: claude mcp add semi-mcp -- npx -y @ies/semi-mcp-bytedance
```

#### Troubleshooting

<Notice type="warning" title='⚠️ oxc-parser Related Errors'>
If you encounter `oxc-parser` or similar dependency resolution errors when running MCP, this is a known npm bug. Please follow these steps to resolve: First, upgrade npm to the latest version `npm install -g npm@latest`, then manually install globally in the terminal `npm i -g @douyinfe/semi-mcp` (ByteDance intranet users should replace the package name), and finally try configuring MCP again.
</Notice>

### Install Skills

The installation panel below helps you install Semi Skills to your project with one click. Select the programming tool you use, click "Add to My Project," choose the target directory, and the installation is complete.

<SkillsWriter />

If your programming tool is not in the list, you can manually download the [skills.zip](/skills.zip) file, refer to the Skills paths for other programming tools in the table above, and extract the archive to the corresponding directory.

## Semi MCP Detailed

Semi MCP is a server implemented based on Model Context Protocol (MCP) that provides documentation queries and code viewing capabilities for Semi Design components. Through this tool, AI assistants can quickly obtain usage documentation, source code structure, and other information about Semi Design components, improving development efficiency.

Please note that knowledge within MCP has been stably updated starting from Semi version 2.90.2. If your project uses a Semi version lower than this, there may be discrepancies between the knowledge obtained by AI and the actual low-version Semi in your project. You need to carefully verify or upgrade your project to version 2.90.2 or later. For subsequent versions, AI will pass the version number when calling tools to obtain version-specific knowledge.

### Tools

Semi MCP provides the following tools for AI assistants to call:

| Tool Name | Function | Use Case |
|-----------|----------|----------|
| `get_semi_document` | Get component documentation or list | Find components, understand APIs |
| `get_semi_code_block` | Get hidden code blocks in large documents | View detailed code examples |
| `get_component_file_list` | Get component source file list | Understand component structure |
| `get_file_code` | Get file code content | View component implementation |
| `get_function_code` | Get complete function implementation | Deeply understand logic |

## Semi Skills Detailed

Semi Design Skills is a pre-configured capability module containing Semi Design component usage guides, best practices, and workflows.

### File Description

This Skill consists of the following files, each focusing on specific guidance:

#### WORKFLOWS.md

**Content**: Complete workflow for using Semi MCP tools.

**Contains**:
- MCP Tool Overview: Introduction to the five tools' functions and use cases
- Basic Query Process: Four-step flow - find component → query details → view source → view function implementation
- Complete Task Examples: Detailed steps for common scenarios like Table filtering, form validation, cascade selector, drag-and-drop sorting
- Common Query Tips: Version-specific queries, getting complete code, error troubleshooting

**When to Use**: When you need to query component documentation, understand component APIs, or implement specific features but are unsure how to start.

#### BEST_PRACTICES.md

**Content**: Best practices and considerations for using Semi Design components.

**Contains**:
- Component Import Methods: Recommended approach to directly import components, icons, and styles
- Theme Customization Guide: Directing AI to consult official customization documentation
- React 19 Compatibility: Instructions on obtaining React 19-specific component usage guidance
- Component Extension Methods: How to extend Semi components via inheritance and gracefully modify internal UI without breaking version compatibility

**When to Use**: When you need to ensure code follows best practices or solve component usage issues.

## Related Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Agent Skills Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [OpenAI Codex Skills Documentation](https://developers.openai.com/codex/skills/)
