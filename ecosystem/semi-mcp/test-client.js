#!/usr/bin/env node

/**
 * MCP Client Test Script
 * 
 * 测试连接到 semi-mcp 服务器
 * 
 * 用法: node test-client.js [--url URL]
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  // let url = 'https://api.semi.design/mcp';
  let url = 'https://api.semi.design/mcp';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      url = args[i + 1];
      i++;
    } else if (args[i] === '--help') {
      console.log(`
MCP Client Test Script

Usage: node test-client.js [options]

Options:
  --url URL    MCP 服务器地址 (默认: https://api.semi.design/mcp)
  --help       显示帮助信息

Examples:
  node test-client.js
  node test-client.js --url http://localhost:3000/mcp
`);
      process.exit(0);
    }
  }

  return { url };
}

async function main() {
  const { url } = parseArgs();

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              MCP Client Test - Semi Design                   ║
╠══════════════════════════════════════════════════════════════╣
║  服务器: ${url.padEnd(56)}║
╚══════════════════════════════════════════════════════════════╝
`);

  // 创建客户端
  const client = new Client({
    name: 'mcp-test-client',
    version: '1.0.0',
  });

  let transport;

  try {
    console.log('[1/5] 连接到 MCP 服务器...');
    
    // 创建 Streamable HTTP 传输层
    transport = new StreamableHTTPClientTransport(
      new URL(url)
    );

    // 连接（SDK 会自动处理 initialize）
    await client.connect(transport);
    console.log('    ✅ 连接成功\n');

    console.log('[2/5] 初始化完成（SDK 自动处理）');
    console.log('    ✅ 连接成功\n');

    console.log('[3/5] 发送 ListTools 请求...');
    // SDK 1.25+ 的 API 变了，使用 listTools 代替 request
    const toolsResult = await client.listTools();
    console.log(`    可用工具数量: ${toolsResult.tools?.length || 0}`);
    if (toolsResult.tools?.length > 0) {
      console.log('    工具列表:');
      for (const tool of toolsResult.tools.slice(0, 5)) {
        console.log(`      - ${tool.name}: ${tool.description?.substring(0, 50)}...`);
      }
      if (toolsResult.tools.length > 5) {
        console.log(`      ... 还有 ${toolsResult.tools.length - 5} 个工具`);
      }
    }
    console.log('    ✅ 工具列表获取成功\n');

    // 如果有工具，测试调用
    if (toolsResult.tools?.length > 0) {
      console.log('[4/5] 测试调用工具...');
      const firstTool = toolsResult.tools[0];
      console.log(`    调用工具: ${firstTool.name}`);
      
      try {
        // SDK 1.25+ 使用 callTool 方法
        const callResult = await client.callTool({
          name: firstTool.name,
          arguments: {},
        });
        
        if (callResult.content) {
          console.log('    响应内容类型:', callResult.content.map((c) => c.type).join(', '));
          console.log('    ✅ 工具调用成功\n');
        }
      } catch (toolError) {
        console.log(`    ⚠️ 工具调用失败 (可能是预期行为): ${toolError instanceof Error ? toolError.message : String(toolError)}\n`);
      }
    }

    console.log('[5/5] 发送 Ping 测试连接...');
    await client.ping();
    console.log('    ✅ 连接正常\n');

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  🎉 所有测试通过！');
    console.log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('\n❌ 测试失败:');
    console.error(`  错误类型: ${error instanceof Error ? error.constructor.name : typeof error}`);
    console.error(`  错误信息: ${error instanceof Error ? error.message : String(error)}`);
    
    if (error instanceof Error && error.stack) {
      console.error(`\n  堆栈跟踪:`);
      console.error(`  ${error.stack.split('\n').slice(0, 5).join('\n  ')}`);
    }

    // 提供诊断信息
    console.error('\n📋 诊断建议:');
    console.error('  1. 检查服务器是否正常运行');
    console.error('  2. 确认 URL 地址正确');
    console.error('  3. 检查网络连接');
    console.error('  4. 查看服务器日志获取更多错误信息');
    
    process.exit(1);
  } finally {
    // 关闭连接
    if (transport) {
      console.log('\n正在关闭连接...');
      try {
        await transport.close();
        console.log('连接已关闭');
      } catch (closeError) {
        console.error('关闭连接时出错:', closeError);
      }
    }
  }
}

// 启动
main().catch((error) => {
  console.error('未捕获的错误:', error);
  process.exit(1);
});
