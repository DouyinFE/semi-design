/**
 * Semi MCP Server 共享配置
 * 
 * 这个模块导出 MCP 服务器的配置和处理器注册逻辑，
 * 可以被 stdio 和 HTTP 两种入口共用
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
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
function getPackageVersion(): string {
  try {
    // 生产环境：dist/server.js -> ../package.json
    const packageJsonPath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
  } catch {
    try {
      // 开发环境：src/server.ts -> ../../package.json
      const packageJsonPath = join(__dirname, '../../package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.version;
    } catch {
      return '1.0.0';
    }
  }
}

/**
 * 创建并配置 MCP 服务器实例
 */
export function createMCPServer(): Server {
  const version = getPackageVersion();
  
  // 创建 MCP 服务器实例
  const server = new Server(
    {
      name: 'semi-mcp',
      version,
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

  return server;
}

export { getPackageVersion };

