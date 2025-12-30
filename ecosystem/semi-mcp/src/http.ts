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
import { randomUUID } from 'crypto';
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
  DELETE /mcp       关闭会话
  GET  /health      健康检查端点
`);
      process.exit(0);
    }
  }

  return { port, host, stateless, timeout };
}

// 会话信息（包含最后活动时间）
interface SessionInfo {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
}

// 存储活跃的传输实例（按 session ID）
const sessions = new Map<string, SessionInfo>();

// 更新会话活动时间
function touchSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.lastActivity = Date.now();
  }
}

// 清理超时会话
async function cleanupExpiredSessions(timeoutMs: number): Promise<void> {
  const now = Date.now();
  const expiredSessions: string[] = [];
  
  sessions.forEach((session, sessionId) => {
    if (now - session.lastActivity > timeoutMs) {
      expiredSessions.push(sessionId);
    }
  });
  
  for (const sessionId of expiredSessions) {
    const session = sessions.get(sessionId);
    if (session) {
      console.log(`[${new Date().toISOString()}] 会话超时清理: ${sessionId} (空闲 ${Math.round((now - session.lastActivity) / 1000 / 60)} 分钟)`);
      try {
        await session.transport.close();
      } catch {
        // 忽略关闭错误
      }
      sessions.delete(sessionId);
    }
  }
}

async function main() {
  const { port, host, stateless, timeout } = parseArgs();
  const version = getPackageVersion();
  const timeoutMs = timeout * 60 * 1000; // 转换为毫秒

  // 启动会话清理定时器（每分钟检查一次）
  const cleanupInterval = setInterval(() => {
    cleanupExpiredSessions(timeoutMs).catch((error) => {
      console.error(`[${new Date().toISOString()}] 会话清理错误:`, error);
    });
  }, 60 * 1000);

  // 创建 HTTP 服务器
  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
    res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');

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
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      
      // POST 请求 - 发送消息
      if (req.method === 'POST') {
        // 读取请求体
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        
        await new Promise<void>((resolve) => {
          req.on('end', async () => {
            try {
              const parsedBody = body ? JSON.parse(body) : undefined;
              
              // 检查是否是初始化请求
              const isInitialize = parsedBody?.method === 'initialize';
              
              if (isInitialize) {
                // 初始化请求 - 创建新的 transport 和 server
                const server = createMCPServer();
                const transport = new StreamableHTTPServerTransport({
                  sessionIdGenerator: stateless ? undefined : () => randomUUID(),
                });
                
                // 连接服务器和传输层
                await server.connect(transport);
                
                // 设置关闭回调
                transport.onclose = () => {
                  const sid = transport.sessionId;
                  if (sid) {
                    console.log(`[${new Date().toISOString()}] 会话关闭: ${sid}`);
                    sessions.delete(sid);
                  }
                };
                
                // 处理请求（这会设置 session ID）
                await transport.handleRequest(req, res, parsedBody);
                
                // 保存 session（在 handleRequest 后 sessionId 才可用）
                const newSessionId = transport.sessionId;
                if (newSessionId) {
                  sessions.set(newSessionId, {
                    transport,
                    lastActivity: Date.now(),
                  });
                  console.log(`[${new Date().toISOString()}] 新会话创建: ${newSessionId}`);
                }
              } else {
                // 非初始化请求 - 需要 session ID
                if (!sessionId) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    error: { code: -32000, message: 'Bad Request: Missing mcp-session-id header' },
                    id: parsedBody?.id ?? null,
                  }));
                  resolve();
                  return;
                }
                
                const session = sessions.get(sessionId);
                if (!session) {
                  res.writeHead(404, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    error: { code: -32000, message: 'Not Found: Session not found or expired' },
                    id: parsedBody?.id ?? null,
                  }));
                  resolve();
                  return;
                }
                
                // 更新活动时间
                touchSession(sessionId);
                
                await session.transport.handleRequest(req, res, parsedBody);
              }
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
      
      // GET 请求 - SSE 流
      if (req.method === 'GET') {
        if (!sessionId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            error: { code: -32000, message: 'Bad Request: Missing mcp-session-id header' },
            id: null,
          }));
          return;
        }
        
        const session = sessions.get(sessionId);
        if (!session) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            error: { code: -32000, message: 'Not Found: Session not found' },
            id: null,
          }));
          return;
        }
        
        // 更新活动时间
        touchSession(sessionId);
        
        await session.transport.handleRequest(req, res);
        return;
      }
      
      // DELETE 请求 - 关闭会话
      if (req.method === 'DELETE') {
        if (!sessionId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing mcp-session-id header' }));
          return;
        }
        
        const session = sessions.get(sessionId);
        if (session) {
          await session.transport.close();
          sessions.delete(sessionId);
          console.log(`[${new Date().toISOString()}] 会话已删除: ${sessionId}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: '会话已关闭' }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '会话不存在' }));
        }
        return;
      }
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
            POST: '/mcp - 发送 MCP 请求 (初始化请求无需 session ID)',
            GET: '/mcp - SSE 流 (需要 mcp-session-id 头)',
            DELETE: '/mcp - 关闭会话',
          },
          health: '/health - 健康检查',
        },
        headers: {
          'mcp-session-id': '会话 ID (初始化响应后获取，后续请求需携带)',
        },
        usage: {
          step1: '发送 initialize 请求获取 session ID',
          step2: '后续请求携带 mcp-session-id 头',
          example: `curl -X POST http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/mcp -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}},"id":1}'`,
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
║    DELETE /mcp      关闭会话                                 ║
║    GET    /health   健康检查                                 ║
╚══════════════════════════════════════════════════════════════╝
`);
  });

  // 优雅关闭
  const shutdown = async () => {
    console.log('\n正在关闭服务器...');
    
    // 停止清理定时器
    clearInterval(cleanupInterval);
    
    // 关闭所有活跃会话
    const sessionEntries = Array.from(sessions.entries());
    for (const [sessionId, session] of sessionEntries) {
      console.log(`关闭会话: ${sessionId}`);
      await session.transport.close();
    }
    sessions.clear();
    
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
