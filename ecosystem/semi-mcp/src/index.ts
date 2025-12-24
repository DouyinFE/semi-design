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
import { getComponentList } from './utils/get-component-list.js';

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

    if (uri === 'semi://components' || uri.startsWith('semi://components')) {
      // 默认使用 latest 版本，资源 URI 不支持查询参数，所以固定使用 latest
      // 如果需要指定版本，应该使用工具 get_semi_document
      const version = 'latest';
      
      try {
        const components = await getComponentList(version);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  version,
                  components,
                  count: components.length,
                  description: 'Semi Design 组件列表',
                  note: '如需指定版本，请使用 get_semi_document 工具',
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  version,
                  error: errorMessage,
                  components: [],
                  count: 0,
                },
                null,
                2
              ),
            },
          ],
        };
      }
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
