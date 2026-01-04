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
import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { createMCPServer, getPackageVersion } from './server.js';

// 会话存储：sessionId -> transport
interface SessionInfo {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
}

const sessions = new Map<string, SessionInfo>();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 分钟

// 解析命令行参数
function parseArgs(): { port: number; hosts: string[]; stateless: boolean; timeout: number } {
  const args = process.argv.slice(2);
  let port = 3000;
  let hosts: string[] = []; // 默认监听 IPv4 和 IPv6
  let stateless = false;
  let timeout = 30; // 默认 30 分钟

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--host' && args[i + 1]) {
      hosts = args[i + 1].split(',').map(h => h.trim());
      i++;
    } else if (args[i] === '-p' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '-h' && args[i + 1]) {
      hosts = args[i + 1].split(',').map(h => h.trim());
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
  --host, -h HOSTS      指定监听地址，多个地址用逗号分隔 (默认: ::)
                        :: 表示 IPv6 任意地址（自动支持 IPv4）
                        0.0.0.0 表示 IPv4 任意地址
                        ::1 表示 IPv6 本地回环
                        127.0.0.1 表示 IPv4 本地回环
                        注意: 如果同时指定 0.0.0.0 和 ::，只使用 ::
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

  return { port, hosts, stateless, timeout };
}

// 清理过期会话
function cleanupSessions() {
  const now = Date.now();
  for (const [sessionId, info] of sessions) {
    if (now - info.lastActivity > SESSION_TIMEOUT) {
      sessions.delete(sessionId);
      console.log(`[${new Date().toISOString()}] 会话 ${sessionId} 已过期清理`);
    }
  }
}

// 每分钟清理一次过期会话
setInterval(cleanupSessions, 60 * 1000);

async function main() {
  const { port, hosts, stateless, timeout } = parseArgs();
  const version = getPackageVersion();

  // 智能处理 hosts：如果同时包含 0.0.0.0 和 ::，只保留 ::
  // 因为在支持双栈的系统上，:: 会同时监听 IPv4 和 IPv6
  let processedHosts = hosts;
  const hasIPv4All = hosts.includes('0.0.0.0');
  const hasIPv6All = hosts.includes('::');

  if (hasIPv4All && hasIPv6All) {
    processedHosts = hosts.filter(h => h !== '0.0.0.0');
    console.log(`[${new Date().toISOString()}] 检测到同时监听 IPv4 和 IPv6，使用 :: (IPv6) 统一监听`);
  }

  // 如果没有指定主机，默认监听 IPv6（会自动支持 IPv4）
  if (processedHosts.length === 0) {
    processedHosts = ['::'];
    console.log(`[${new Date().toISOString()}] 使用默认配置: 监听 IPv6 (::)`);
  }

  // 创建 MCP 服务器
  const server = createMCPServer();

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
        activeSessions: sessions.size,
      }));
      return;
    }

    // MCP 端点
    if (url.pathname === '/mcp') {
      const sessionId = req.headers['mcp-session-id'] as string;

      try {
        // 获取或创建 transport
        let transport: StreamableHTTPServerTransport;

        if (stateless) {
          // 无状态模式：为每个请求创建新的 transport
          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
          });
          await server.connect(transport);
        } else {
          // 有状态模式
          if (sessionId && sessions.has(sessionId)) {
            // 使用已存在的 session
            transport = sessions.get(sessionId)!.transport;
            sessions.get(sessionId)!.lastActivity = Date.now();
          } else {
            // 创建新的 session
            const newSessionId = crypto.randomUUID();
            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => newSessionId,
            });

            await server.connect(transport);

            // 保存会话信息
            sessions.set(newSessionId, {
              transport,
              lastActivity: Date.now(),
            });
          }
        }

        // 处理请求
        await transport.handleRequest(req, res);

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

  // 为每个主机地址启动监听
  const servers: ReturnType<typeof createServer>[] = [];
  let startedCount = 0;

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║        Semi MCP Server (Streamable HTTP) v${version.padEnd(10)}        ║
╠══════════════════════════════════════════════════════════════╣
║  模式: ${stateless ? '无状态 (Stateless)' : '有状态 (Stateful) '}                                 ║
║  会话超时: ${String(timeout).padEnd(3)} 分钟                                        ║
║                                                              ║`);

  // 格式化主机地址用于显示
  const formatHost = (h: string): string => {
    if (h === '::') return ':: (所有 IPv6)';
    if (h === '0.0.0.0') return '0.0.0.0 (所有 IPv4)';
    if (h === '::1') return '::1 (IPv6 本地)';
    if (h === '127.0.0.1') return '127.0.0.1 (IPv4 本地)';
    return h;
  };

  // 启动每个服务器
  processedHosts.forEach((host, index) => {
    // 直接使用 httpServer 监听
    httpServer.on('error', (err) => {
      const displayHost = formatHost(host);
      console.log(`║  ✗ 端点 ${index + 1}: http://${displayHost}:${port}`);
      console.error(`[${new Date().toISOString()}] 启动失败 [${host}]:`, err.message);
    });

    httpServer.listen(port, host, () => {
      startedCount++;
      const displayHost = formatHost(host);
      console.log(`║  ✓ 端点 ${index + 1}: http://${displayHost}:${port}`);

      // 所有服务器都启动完成后显示底部的信息
      if (startedCount === processedHosts.length) {
        console.log(`║                                                              ║
║  可用端点:                                                   ║
║    POST   /mcp      发送 MCP 请求                            ║
║    GET    /mcp      SSE 流 (服务器推送)                      ║
║    GET    /health   健康检查                                 ║
╚══════════════════════════════════════════════════════════════╝
`);
        console.log(`[${new Date().toISOString()}] 所有服务器已启动，监听 ${processedHosts.length} 个地址`);
        console.log(`[${new Date().toISOString()}] 总计监听: ${processedHosts.join(', ')}`);
      }
    });

    servers.push(httpServer);
  });

  // 优雅关闭
  const shutdown = async () => {
    console.log('\n正在关闭服务器...');

    // 关闭所有会话
    for (const [sessionId, info] of sessions) {
      try {
        await info.transport.close();
        console.log(`[${new Date().toISOString()}] 会话 ${sessionId} 已关闭`);
      } catch (error) {
        console.error(`关闭会话 ${sessionId} 时出错:`, error);
      }
    }
    sessions.clear();

    let closedCount = 0;
    servers.forEach((server, index) => {
      server.close(() => {
        closedCount++;
        console.log(`[${new Date().toISOString()}] 服务器 ${index + 1}/${servers.length} 已关闭`);

        if (closedCount === servers.length) {
          console.log('所有服务器已关闭');
          process.exit(0);
        }
      });
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
