---
category: Start
title: AI MCP and Skills
subTitle: AI MCP and Skills
localeCode: en-US
icon: doc-intro
order: 0
---

## Model Context Protocol (MCP)

Model Context Protocol (MCP) is a standardized protocol for connecting AI assistants with external data sources and tools. Through MCP, AI assistants can dynamically discover and invoke various capabilities without having to integrate each tool separately.

<Notice type="primary" title="Why Use MCP?">
MCP provides a unified way for AI assistants to:
- Access external data sources and file systems
- Invoke various tools and APIs
- Port and reuse configurations across different environments
</Notice>

## Semi MCP

Semi MCP is a server implemented based on Model Context Protocol (MCP) that provides documentation queries and code viewing capabilities for Semi Design components. Through this tool, AI assistants can quickly obtain usage documentation, source code structure, and other information about Semi Design components, improving development efficiency.

### Configuration

Configure it in clients that support the MCP protocol. Taking Claude Desktop as an example, add the following to the configuration file `claude_desktop_config.json`:

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

### Features

#### Tools

Semi MCP provides multiple tools for AI assistants to call:

- **get_semi_document**: Get Semi Design component documentation or component list
- **get_component_file_list**: Get the list of all source file paths for Semi Design components
- **get_file_code**: Get the code content of a specified file
- **get_function_code**: Get the complete implementation of a specific function in a file

#### Resources

- **semi://components**: Provides Semi Design component list resource

## Skills

Skills are modular capability extensions that allow AI assistants to enhance their functionality by adding pre-defined instructions and tools. Each Skill contains detailed documentation and related code resources, enabling AI to perform more professionally and efficiently in specific tasks.

### What are Skills?

Skills are pre-configured capability modules containing:
- **Instruction documentation** (SKILL.md): Defines the skill's functionality, usage methods, and best practices
- **Supporting files**: Related scripts, templates, and resource files

Through Skills, you can:
- Add domain-specific expertise to AI assistants
- Standardize team development processes and best practices
- Quickly reuse successful experiences and solutions

### Skills Paths for Common Programming Tools

Different AI programming tools use different directories to store Skills:

| Programming Tool | Skills Path |
|-----------------|-------------|
| Trae | `.trae/skills/` |
| Cursor | `.cursor/skills/` |
| CodeBuddy (Tencent Cloud) | `.codebuddy/skills/` |
| Claude Code | `.claude/skills/` |
| Qwen Code | `.qwen/skills/` |
| OpenAI Codex CLI | `.codex/skills/` |
| Generic Standard | `.skills/` |

<SkillsWriter />

## Version Notes

Semi MCP supports querying Semi Design content for different versions. By specifying the `version` parameter, you can query the latest released version, specific versions, or pre-release version component information.

## Related Resources

- [Semi Design Official Website](https://semi.design)
- [Semi Design GitHub](https://github.com/DouyinFE/semi-design)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
