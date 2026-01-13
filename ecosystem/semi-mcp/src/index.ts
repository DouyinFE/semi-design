#!/usr/bin/env node

/**
 * Semi MCP Server - stdio 入口
 * 
 * 使用 stdio 作为传输层的 MCP 服务器
 * 通过标准输入输出与客户端通信
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMCPServer, getPackageVersion } from './server.js';
import { toolHandlers, tools } from './tools/index.js';
import { getComponentList } from './utils/get-component-list.js';

async function main() {
  // 创建 MCP 服务器实例
  const server = createMCPServer();

  // 创建 stdio 传输层
  const transport = new StdioServerTransport();

  // 连接服务器到传输层
  await server.connect(transport);
  
  // 注意：不要在这里输出任何内容到 stdout/stderr，因为会干扰 JSON-RPC 通信
  // MCP 服务器通过 stdio 进行 JSON-RPC 通信，任何非 JSON 输出都会导致协议错误
}

// 启动服务器
main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Semi MCP Server (stdio) 启动失败: ${errorMessage}\n`);
  process.exit(1);
});

export { tools, toolHandlers, createMCPServer, getPackageVersion, getComponentList };