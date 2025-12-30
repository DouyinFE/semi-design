#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tools, toolHandlers } from './tools/index.js';
import { getComponentList } from './utils/get-component-list.js';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json 获取版本号
// 尝试多个可能的路径（开发环境和生产环境）
let packageJson: { version: string };
try {
  // 生产环境：dist/index.js -> ../package.json
  const packageJsonPath = join(__dirname, '../package.json');
  packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
} catch {
  try {
    // 开发环境：src/index.ts -> ../../package.json
    const packageJsonPath = join(__dirname, '../../package.json');
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  } catch {
    // 如果都失败，使用默认版本号
    packageJson = { version: '1.0.0' };
  }
}

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
      version: packageJson.version,
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
  
  // 注意：不要在这里输出任何内容到 stdout/stderr，因为会干扰 JSON-RPC 通信
  // MCP 服务器通过 stdio 进行 JSON-RPC 通信，任何非 JSON 输出都会导致协议错误
}

// 启动服务器
main().catch((error) => {
  // 只在真正出错时输出错误信息，并确保格式正确
  const errorMessage = error instanceof Error ? error.message : String(error);
  // 使用 stderr 输出错误，但要注意不要干扰 JSON-RPC 通信
  // 如果是在初始化之前出错，可以输出；如果是在运行中出错，应该通过 JSON-RPC 错误响应返回
  process.stderr.write(`Semi MCP Server 启动失败: ${errorMessage}\n`);
  process.exit(1);
});
