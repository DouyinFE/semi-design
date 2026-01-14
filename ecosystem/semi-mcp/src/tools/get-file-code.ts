/**
 * 获取文件代码工具
 * 根据文件路径获取代码内容
 * ts/tsx 文件默认过滤函数体，可通过参数获取完整代码
 */

import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { fetchFileContent } from '../utils/fetch-file-content.js';
import { removeFunctionBodies } from '../utils/remove-function-body.js';

/**
 * 解析文件路径
 * 输入: @douyinfe/semi-ui/table/index.tsx
 * 输出: { packageName: '@douyinfe/semi-ui', filePath: 'table/index.tsx' }
 */
function parseFilePath(fullPath: string): { packageName: string; filePath: string } | null {
  // 匹配 @douyinfe/semi-foundation/xxx 或 @douyinfe/semi-ui/xxx
  const match = fullPath.match(/^(@douyinfe\/semi-(?:foundation|ui))\/(.+)$/);
  if (!match) {
    return null;
  }
  return {
    packageName: match[1],
    filePath: match[2],
  };
}

/**
 * 判断是否为 TypeScript 文件
 */
function isTypeScriptFile(filePath: string): boolean {
  return filePath.endsWith('.ts') || filePath.endsWith('.tsx');
}

/** 代码行数阈值，超过此行数才会过滤函数体 */
const LINE_THRESHOLD = 500;

export const getFileCodeTool: Tool = {
  name: 'get_file_code',
  description: `获取 Semi Design 组件文件的代码内容。

输入文件路径（从 get_component_file_list 工具获取），返回文件代码。

默认行为：
- .ts/.tsx 文件且行数 >= ${LINE_THRESHOLD}：函数体被替换为 "{ ... }"，只显示代码结构
- .ts/.tsx 文件且行数 < ${LINE_THRESHOLD}：显示完整代码
- 其他文件（.scss 等）：显示完整内容

可通过 fullCode 参数强制获取完整代码（包含函数体）。

路径格式示例：
- @douyinfe/semi-foundation/table/foundation.ts
- @douyinfe/semi-ui/table/index.tsx`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      filePath: {
        type: 'string',
        description: '文件完整路径，如 @douyinfe/semi-ui/table/index.tsx',
      },
      version: {
        type: 'string',
        description: '版本号，默认为 "2.89.2-alpha.3"',
      },
      fullCode: {
        type: 'boolean',
        description: '是否获取完整代码（包含函数体），默认为 false',
      },
    },
    required: ['filePath'],
  },
};

export async function handleGetFileCode(
  args: Record<string, unknown>
): Promise<CallToolResult> {
  const filePath = args?.filePath as string | undefined;
  const version = (args?.version as string | undefined) || '2.89.2-alpha.3';
  const fullCode = (args?.fullCode as boolean | undefined) || false;

  if (!filePath) {
    return {
      content: [
        {
          type: 'text',
          text: '错误：请提供文件路径 (filePath)',
        },
      ],
      isError: true,
    };
  }

  const parsed = parseFilePath(filePath);
  if (!parsed) {
    return {
      content: [
        {
          type: 'text',
          text: `错误：无效的文件路径格式。路径应为 @douyinfe/semi-foundation/xxx 或 @douyinfe/semi-ui/xxx 格式。\n\n提供的路径: ${filePath}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const content = await fetchFileContent(parsed.packageName, version, parsed.filePath);
    const lineCount = content.split('\n').length;

    let outputContent = content;
    let processInfo = '';

    // 对 ts/tsx 文件进行函数体过滤（行数 >= 888 且未指定 fullCode）
    const shouldFilterFunctionBodies = isTypeScriptFile(filePath) && !fullCode && lineCount >= LINE_THRESHOLD;
    
    if (shouldFilterFunctionBodies) {
      outputContent = removeFunctionBodies(content);
      processInfo = '（代码较长，函数体已替换为 "{ ... }"，推荐使用 get_function_code 工具读取具体函数实现）';
    }

    const output = [
      `文件: ${filePath}`,
      `版本: ${version}`,
      `行数: ${lineCount}`,
      `大小: ${content.length} 字符`,
      processInfo ? `处理: ${processInfo}` : '',
      '',
      '='.repeat(60),
      '',
      outputContent,
    ].filter(Boolean);

    return {
      content: [
        {
          type: 'text',
          text: output.join('\n'),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `获取文件内容失败: ${error instanceof Error ? error.message : String(error)}\n\n文件路径: ${filePath}\n版本: ${version}`,
        },
      ],
      isError: true,
    };
  }
}

