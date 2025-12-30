import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    // MCP Server 入口 - 仅 Node.js 环境
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
    // 浏览器兼容入口 - 可在浏览器和 Node.js 中运行
    {
      source: {
        entry: {
          browser: './src/browser.ts',
        },
      },
      format: 'esm',
      syntax: ['es2020'],
      dts: true,
      output: {
        distPath: {
          root: './dist',
        },
      },
    },
  ],
});
