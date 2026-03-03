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

### Configuration in Claude CLI (Claude Code)

Run the following command in terminal to add MCP:

```bash
claude mcp add semi-mcp -- npx -y @douyinfe/semi-mcp
```

## Features

### Tools

#### `get_semi_document`

Get Semi Design component documentation or component list.

**Parameters:**
- `componentName` (optional): Component name, e.g., `Button`, `Input`, etc. If not provided, returns the component list
- `version` (optional): Version number, e.g., `2.89.2-alpha.3`. If not provided, defaults to `latest`

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

---

#### `get_component_file_list`

Get all file paths for a Semi Design component.

**Parameters:**
- `componentName` (required): Component name, e.g., `Table`, `DatePicker`, etc. (case-insensitive)
- `version` (optional): Version number, defaults to `2.89.2-alpha.3`

**Example:**
```json
{
  "name": "get_component_file_list",
  "arguments": {
    "componentName": "Table"
  }
}
```

**Response Format:**
```
Component: table
Version: 2.89.2-alpha.3
Total files: 38

File type statistics:
  .ts:   11
  .tsx:  21
  .scss: 6

===== File List =====

@douyinfe/semi-foundation/table/foundation.ts
@douyinfe/semi-foundation/table/constants.ts
@douyinfe/semi-ui/table/Table.tsx
@douyinfe/semi-ui/table/index.tsx
...
```

---

#### `get_file_code`

Get the code content of a specific file.

**Parameters:**
- `filePath` (required): Full file path, e.g., `@douyinfe/semi-ui/table/Table.tsx`
- `version` (optional): Version number, defaults to `2.89.2-alpha.3`
- `fullCode` (optional): Whether to get full code (including function bodies), defaults to `false`

**Behavior:**
- `.ts/.tsx` files with >= 500 lines: Function bodies replaced with `{ ... }`, showing only code structure
- `.ts/.tsx` files with < 500 lines: Full code displayed
- Other files (`.scss`, etc.): Full content displayed
- `fullCode: true`: Force display full code

**Example:**
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

Get the full implementation of a specific function from a file.

**Parameters:**
- `filePath` (required): Full file path
- `functionName` (required): Function name, e.g., `render`, `handleClick`, etc.
- `version` (optional): Version number, defaults to `2.89.2-alpha.3`

**Supported function types:**
- Function declarations: `function foo() {}`
- Arrow functions: `const foo = () => {}`
- Class methods: `class Foo { bar() {} }`
- Getters/Setters: `get foo() {}` / `set foo() {}`

**Example:**
```json
{
  "name": "get_function_code",
  "arguments": {
    "filePath": "@douyinfe/semi-foundation/table/foundation.ts",
    "functionName": "init"
  }
}
```

**Response Format:**
```
File: @douyinfe/semi-foundation/table/foundation.ts
Function: init
Version: 2.89.2-alpha.3

============================================================

init() {
    const dataSource = [...this.getProp('dataSource')];
    // ... full function implementation
}
```

---

### Recommended Workflow

1. **Get file list**: Use `get_component_file_list` to get all component files
2. **View code structure**: Use `get_file_code` to view files of interest (large files auto-filter function bodies)
3. **Get function implementation**: Use `get_function_code` to get specific function's full code

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
