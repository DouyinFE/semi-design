/**
 * 获取函数代码工具
 * 根据文件路径和函数名获取完整函数实现
 */

import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { fetchFileContent } from '../utils/fetch-file-content.js';
import { extractFunction, getFunctionNames } from '../utils/remove-function-body.js';

/**
 * 解析文件路径
 */
function parseFilePath(fullPath: string): { packageName: string; filePath: string } | null {
  const match = fullPath.match(/^(@douyinfe\/semi-(?:foundation|ui))\/(.+)$/);
  if (!match) {
    return null;
  }
  return {
    packageName: match[1],
    filePath: match[2],
  };
}

export const getFunctionCodeTool: Tool = {
  name: 'get_function_code',
  description: `获取 Semi Design 组件文件中指定函数的完整实现。

输入文件路径和函数名，返回函数的完整代码（包含函数体）。

支持的函数类型：
- 普通函数声明: function foo() {}
- 箭头函数: const foo = () => {}
- 类方法: class Foo { bar() {} }
- getter/setter: get foo() {} / set foo() {}

路径格式示例：
- @douyinfe/semi-foundation/table/foundation.ts
- @douyinfe/semi-ui/table/Table.tsx`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      filePath: {
        type: 'string',
        description: '文件完整路径，如 @douyinfe/semi-ui/table/Table.tsx',
      },
      functionName: {
        type: 'string',
        description: '函数名称，如 render、handleClick、adapter 等',
      },
      version: {
        type: 'string',
        description: '版本号，默认为 "2.89.2-alpha.3"',
      },
    },
    required: ['filePath', 'functionName'],
  },
};

export async function handleGetFunctionCode(
  args: Record<string, unknown>
): Promise<CallToolResult> {
  const filePath = args?.filePath as string | undefined;
  const functionName = args?.functionName as string | undefined;
  const version = (args?.version as string | undefined) || '2.89.2-alpha.3';

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

  if (!functionName) {
    return {
      content: [
        {
          type: 'text',
          text: '错误：请提供函数名称 (functionName)',
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

    // 提取函数代码
    const functionCode = extractFunction(content, functionName);

    if (!functionCode) {
      // 获取文件中所有函数名，帮助用户找到正确的函数名
      const allFunctions = getFunctionNames(content);
      
      return {
        content: [
          {
            type: 'text',
            text: [
              `未找到函数 "${functionName}"`,
              '',
              `文件: ${filePath}`,
              `版本: ${version}`,
              '',
              `文件中可用的函数/方法 (共 ${allFunctions.length} 个):`,
              ...allFunctions.map(name => `  - ${name}`),
            ].join('\n'),
          },
        ],
        isError: true,
      };
    }

    const output = [
      `文件: ${filePath}`,
      `函数: ${functionName}`,
      `版本: ${version}`,
      '',
      '='.repeat(60),
      '',
      functionCode,
    ];

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
          text: `获取函数代码失败: ${error instanceof Error ? error.message : String(error)}\n\n文件路径: ${filePath}\n函数名: ${functionName}\n版本: ${version}`,
        },
      ],
      isError: true,
    };
  }
}

