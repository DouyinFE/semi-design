#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, toolHandlers } from './tools/index.js';

/**
 * Semi MCP Server
 * 基于 Model Context Protocol SDK 实现的 MCP 服务器
 * 使用 stdio 作为传输层
 */
async function main() {
  // 创建 MCP 服务器实例
  const server = new Server(
    {
      name: 'semi-mcp',
      version: '0.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // 注册工具列表处理器
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools,
    };
  });

  // 注册工具调用处理器
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const handler = toolHandlers[name];
    if (!handler) {
      throw new Error(`未知的工具: ${name}`);
    }

    return handler(args || {});
  });

  // 注册资源列表处理器
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'semi://components',
          name: 'Semi Components',
          description: 'Semi Design 组件列表',
          mimeType: 'application/json',
        },
      ],
    };
  });

  // 注册资源读取处理器
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === 'semi://components') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                components: ['Button', 'Input', 'Select', 'Table', 'Form'],
                description: 'Semi Design 组件列表',
              },
              null,
              2
            ),
          },
        ],
      };
    }

    throw new Error(`未知的资源 URI: ${uri}`);
  });

  // 创建 stdio 传输层
  const transport = new StdioServerTransport();

  // 连接服务器到传输层
  await server.connect(transport);

  console.error('Semi MCP Server 已启动，使用 stdio 传输');
}

// 启动服务器
main().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});
