[中文](README-zh_CN.md) | [English](README.md)

# Semi MCP Server

An MCP (Model Context Protocol) server implementation based on the MCP SDK, providing Semi Design component documentation and component list query functionality.

## Introduction

Semi MCP Server is an MCP (Model Context Protocol) server that communicates with MCP-compatible clients through stdio transport. It provides functionality to fetch Semi Design component documentation, component lists, and more.

## Installation

### Global Installation

```bash
npm install -g @douyinfe/semi-mcp
```

### Local Installation

```bash
npm install @douyinfe/semi-mcp
```

## Usage

### As a Command Line Tool

After global installation, you can use it directly:

```bash
semi-mcp
```

### Configuration in MCP Clients

Configure in MCP-compatible clients (such as Claude Desktop):

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

Or if installed globally:

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "semi-mcp"
    }
  }
}
```

## Features

### Tools

#### `get_semi_document`

Get Semi Design component documentation or component list.

**Parameters:**
- `componentName` (optional): Component name, e.g., `Button`, `Input`, etc. If not provided, returns the component list
- `version` (optional): Version number, e.g., `2.89.2-alpha.3`. If not provided, defaults to `latest`
- `get_path` (optional): If `true`, saves documents to the system temporary directory and returns the path instead of returning document content in the response. Defaults to `false`

**Examples:**

Get component list:
```json
{
  "name": "get_semi_document"
}
```

Get specific component documentation:
```json
{
  "name": "get_semi_document",
  "arguments": {
    "componentName": "Button",
    "version": "2.89.2-alpha.3"
  }
}
```

**Response Format:**

When getting component list:
```json
{
  "version": "2.89.2-alpha.3",
  "components": ["button", "input", "select", ...],
  "count": 70
}
```

When getting component documentation:
```json
{
  "componentName": "button",
  "version": "2.89.2-alpha.3",
  "category": "basic",
  "documents": ["index.md", "index-en-us.md"],
  "count": 2,
  "allComponents": ["button", "input", "select", ...],
  "allComponentsCount": 70
}
```

**Note:** For large documents (over 888 lines), the tool will automatically save them to a temporary directory and return the file paths instead of content.

### Resources

#### `semi://components`

Semi Design component list resource.

## Development

### Requirements

- Node.js >= 18.0.0
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Build

Build production version:

```bash
npm run build
```

Development mode (watch for file changes and auto-rebuild):

```bash
npm run dev
```

### Test

Run tests:

```bash
npm test
```

### Run

Run the server after building:

```bash
npm start
```

Or run the built file directly:

```bash
node dist/index.js
```

## Tech Stack

- **TypeScript**: Type-safe JavaScript
- **Rslib**: Fast build tool
- **@modelcontextprotocol/sdk**: Official MCP SDK

## Project Structure

```
semi-mcp/
├── src/
│   ├── index.ts              # Main entry file
│   ├── tools/                # Tool definitions
│   │   ├── index.ts
│   │   └── get-semi-document.ts
│   └── utils/                # Utility functions
│       ├── fetch-directory-list.ts
│       ├── fetch-file-content.ts
│       └── get-component-list.ts
├── tests/                    # Test files
│   └── get-semi-document.test.ts
├── dist/                     # Build output
├── package.json
└── README.md
```

## License

MIT

## Related Links

- [Semi Design Official Website](https://semi.design)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
