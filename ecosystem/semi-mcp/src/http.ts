#!/usr/bin/env node

/**
 * Semi MCP Server - HTTP (Streamable) 入口
 * 
 * 使用 Streamable HTTP 作为传输层的 MCP 服务器
 * 这是 MCP 推荐的新传输方案，支持无状态通信和连接恢复
 * 
 * 启动方式: node dist/http.js [--port PORT] [--host HOST] [--stateless] [--timeout MINUTES]
 * 默认端口: 3000
 * 默认主机: 0.0.0.0 (监听所有网络接口)
 * 默认超时: 30 分钟
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMCPServer, getPackageVersion } from './server.js';

// 解析命令行参数
function parseArgs(): { port: number; host: string; stateless: boolean; timeout: number } {
  const args = process.argv.slice(2);
  let port = 3000;
  let host = '0.0.0.0';
  let stateless = false;
  let timeout = 30; // 默认 30 分钟

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--host' && args[i + 1]) {
      host = args[i + 1];
      i++;
    } else if (args[i] === '-p' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '-h' && args[i + 1]) {
      host = args[i + 1];
      i++;
    } else if (args[i] === '--stateless') {
      stateless = true;
    } else if (args[i] === '--timeout' && args[i + 1]) {
      timeout = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '-t' && args[i + 1]) {
      timeout = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--help') {
      console.log(`
Semi MCP Server (Streamable HTTP)

Usage: semi-mcp-http [options]

Options:
  --port, -p PORT       指定监听端口 (默认: 3000)
  --host, -h HOST       指定监听地址 (默认: 0.0.0.0)
  --stateless           无状态模式，不生成 session ID
  --timeout, -t MINUTES 会话超时时间，单位分钟 (默认: 30)
  --help                显示帮助信息

Endpoints:
  POST /mcp         MCP 消息端点 (Streamable HTTP)
  GET  /mcp         SSE 流端点 (用于服务器推送)
  GET  /health      健康检查端点
`);
      process.exit(0);
    }
  }

  return { port, host, stateless, timeout };
}

async function main() {
  const { port, host, stateless, timeout } = parseArgs();
  const version = getPackageVersion();

  // 创建 MCP 服务器
  const server = createMCPServer();

  // 创建 Streamable HTTP 传输层
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: stateless ? undefined : () => crypto.randomUUID(),
  });

  // 连接服务器和传输层
  await server.connect(transport);

  console.log(`[${new Date().toISOString()}] MCP 服务器已启动`);
  console.log(`[${new Date().toISOString()}] 模式: ${stateless ? '无状态 (Stateless)' : '有状态 (Stateful)'}`);

  // 创建 HTTP 服务器
  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id');
    res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // 健康检查端点
    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        name: 'semi-mcp',
        version,
        transport: 'streamable-http',
        stateless,
        sessionTimeout: `${timeout} minutes`,
      }));
      return;
    }

    // MCP 端点
    if (url.pathname === '/mcp') {
      // 读取请求体
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      await new Promise<void>((resolve) => {
        req.on('end', async () => {
          try {
            const parsedBody = body ? JSON.parse(body) : undefined;
            
            // 将请求委托给 transport 处理
            // StreamableHTTPServerTransport 会自动处理 session ID 和初始化流程
            await transport.handleRequest(req, res, parsedBody);
            
            console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname} - ${res.statusCode}`);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[${new Date().toISOString()}] 请求处理错误:`, errorMessage);
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                jsonrpc: '2.0',
                error: { code: -32000, message: errorMessage },
                id: null,
              }));
            }
          }
          resolve();
        });
      });
      return;
    }

    // 根路径 - 返回服务信息
    if (url.pathname === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        name: 'semi-mcp',
        version,
        description: 'Semi Design MCP Server (Streamable HTTP)',
        transport: 'streamable-http',
        stateless,
        sessionTimeout: `${timeout} minutes`,
        endpoints: {
          mcp: {
            POST: '/mcp - 发送 MCP 请求',
            GET: '/mcp - SSE 流 (需要 Mcp-Session-Id 头)',
          },
          health: '/health - 健康检查',
        },
        headers: {
          'Mcp-Session-Id': '会话 ID (初始化响应后获取，后续请求需携带)',
        },
        usage: {
          step1: '客户端发送 initialize 请求',
          step2: '服务器返回响应并包含 Mcp-Session-Id header',
          step3: '后续请求携带 Mcp-Session-Id header',
        },
      }, null, 2));
      return;
    }

    // 404 - 未知端点
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '未知的端点' }));
  });

  // 启动服务器
  httpServer.listen(port, host, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║        Semi MCP Server (Streamable HTTP) v${version.padEnd(10)}        ║
╠══════════════════════════════════════════════════════════════╣
║  服务地址: http://${(host === '0.0.0.0' ? 'localhost' : host).padEnd(15)}:${String(port).padEnd(5)}                  ║
║  模式: ${stateless ? '无状态 (Stateless)' : '有状态 (Stateful) '}                                 ║
║  会话超时: ${String(timeout).padEnd(3)} 分钟                                        ║
║                                                              ║
║  端点:                                                       ║
║    POST   /mcp      发送 MCP 请求                            ║
║    GET    /mcp      SSE 流 (服务器推送)                      ║
║    GET    /health   健康检查                                 ║
╚══════════════════════════════════════════════════════════════╝
`);
  });

  // 优雅关闭
  const shutdown = async () => {
    console.log('\n正在关闭服务器...');
    
    try {
      await transport.close();
      console.log('Transport 已关闭');
    } catch (error) {
      console.error('关闭 transport 时出错:', error);
    }
    
    httpServer.close(() => {
      console.log('服务器已关闭');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// 启动服务器
main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Semi MCP Server (Streamable HTTP) 启动失败: ${errorMessage}`);
  process.exit(1);
});
