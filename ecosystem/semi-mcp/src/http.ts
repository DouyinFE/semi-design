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

// 会话存储：sessionId -> transport
interface SessionInfo {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
  requestQueue: Array<() => Promise<void>>;
  isProcessing: boolean;
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
    }
  }
}

// 每分钟清理一次过期会话
setInterval(cleanupSessions, 60 * 1000);

// 处理会话请求（串行化）
async function processSessionRequest(sessionId: string, handler: () => Promise<void>): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }
  
  const requestPromise = handler();
  session.requestQueue.push(() => requestPromise);
  
  if (!session.isProcessing) {
    session.isProcessing = true;
    
    try {
      while (session.requestQueue.length > 0) {
        const nextHandler = session.requestQueue.shift()!;
        await nextHandler();
      }
    } finally {
      session.isProcessing = false;
    }
  }
  
  return requestPromise;
}

async function main() {
  const { port, hosts, stateless, timeout } = parseArgs();
  const version = getPackageVersion();

  // 智能处理 hosts
  let processedHosts = hosts;
  const hasIPv4All = hosts.includes('0.0.0.0');
  const hasIPv6All = hosts.includes('::');

  if (hasIPv4All && hasIPv6All) {
    processedHosts = hosts.filter(h => h !== '0.0.0.0');
  }

  if (processedHosts.length === 0) {
    processedHosts = ['::'];
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

      // 读取请求体
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      await new Promise<void>((resolve) => {
        req.on('end', async () => {
          try {
            let transport: StreamableHTTPServerTransport;

            if (stateless) {
              transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: undefined,
              });
              await server.connect(transport);
            } else {
              if (sessionId && sessions.has(sessionId)) {
                transport = sessions.get(sessionId)!.transport;
                sessions.get(sessionId)!.lastActivity = Date.now();
              } else {
                const newSessionId = sessionId || crypto.randomUUID();
                transport = new StreamableHTTPServerTransport({
                  sessionIdGenerator: () => newSessionId,
                });
                await server.connect(transport);
                
                sessions.set(newSessionId, {
                  transport,
                  lastActivity: Date.now(),
                  requestQueue: [],
                  isProcessing: false,
                });
              }
            }

            // GET 请求（SSE 流）特殊处理
            if (req.method === 'GET') {
              transport.handleRequest(req, res).catch(() => {});
              resolve();
              return;
            }
            
            // POST 请求：解析请求体
            let parsedBody: Record<string, any> | undefined;
            if (body.trim()) {
              try {
                parsedBody = JSON.parse(body);
              } catch {
                parsedBody = undefined;
              }
            }
            
            // 使用串行处理
            if (sessionId && sessions.has(sessionId)) {
              await processSessionRequest(sessionId, async () => {
                await transport.handleRequest(req, res, parsedBody);
              });
            } else {
              await transport.handleRequest(req, res, parsedBody);
            }

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
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

    // 根路径
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
          mcp: { POST: '/mcp', GET: '/mcp (SSE)' },
          health: '/health',
        },
      }, null, 2));
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unknown endpoint' }));
  });

  const servers: ReturnType<typeof createServer>[] = [];
  let startedCount = 0;

  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║        Semi MCP Server (Streamable HTTP) v${version.padEnd(10)}        ║
╠══════════════════════════════════════════════════════════════════════╣
║  模式: ${stateless ? '无状态 (Stateless)' : '有状态 (Stateful) '}                                 ║
║  会话超时: ${String(timeout).padEnd(3)} 分钟                                        ║
║                                                              ║`);

  const formatHost = (h: string): string => {
    if (h === '::') return ':: (所有 IPv6)';
    if (h === '0.0.0.0') return '0.0.0.0 (所有 IPv4)';
    if (h === '::1') return '::1 (IPv6 本地)';
    if (h === '127.0.0.1') return '127.0.0.1 (IPv4 本地)';
    return h;
  };

  processedHosts.forEach((host, index) => {
    httpServer.on('error', (err) => {
      const displayHost = formatHost(host);
      console.log(`║  ✗ 端点 ${index + 1}: http://${displayHost}:${port}`);
      console.error(`[${new Date().toISOString()}] 启动失败 [${host}]:`, err.message);
    });

    httpServer.listen(port, host, () => {
      startedCount++;
      const displayHost = formatHost(host);
      console.log(`║  ✓ 端点 ${index + 1}: http://${displayHost}:${port}`);

      if (startedCount === processedHosts.length) {
        console.log(`║                                                              ║
║  可用端点:                                                   ║
║    POST   /mcp      发送 MCP 请求                            ║
║    GET    /mcp      SSE 流 (服务器推送)                      ║
║    GET    /health   健康检查                                 ║
╚══════════════════════════════════════════════════════════════════════╝
`);
        console.log(`[${new Date().toISOString()}] 所有服务器已启动，监听 ${processedHosts.length} 个地址`);
        console.log(`[${new Date().toISOString()}] 总计监听: ${processedHosts.join(', ')}`);
      }
    });

    servers.push(httpServer);
  });

  const shutdown = async () => {
    console.log('\n正在关闭服务器...');

    for (const [sessionId, info] of sessions) {
      try {
        await info.transport.close();
      } catch {
        // 忽略关闭错误
      }
    }
    sessions.clear();

    let closedCount = 0;
    servers.forEach((server, index) => {
      server.close(() => {
        closedCount++;
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

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Semi MCP Server (Streamable HTTP) 启动失败: ${errorMessage}`);
  process.exit(1);
});
