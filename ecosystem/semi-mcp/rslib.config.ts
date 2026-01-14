import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    // MCP Server 导出入口 - 仅导出，不包含启动逻辑
    {
      source: {
        entry: {
          index: './src/index.ts',
        },
      },
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
    // MCP Server 入口 - stdio 模式
    {
      source: {
        entry: {
          stdio: './src/stdio.ts',
        },
      },
      format: 'esm',
      syntax: ['node 18'],
      dts: false,
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
    // MCP Server 入口 - HTTP/SSE 模式
    {
      source: {
        entry: {
          http: './src/http.ts',
        },
      },
      format: 'esm',
      syntax: ['node 18'],
      dts: false,
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
  ],
});
