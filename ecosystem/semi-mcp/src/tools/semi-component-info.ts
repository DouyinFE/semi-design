import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * 工具定义：获取 Semi Design 组件信息
 */
export const semiComponentInfoTool: Tool = {
  name: 'semi_component_info',
  description: '获取 Semi Design 组件信息',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: {
        type: 'string',
        description: '组件名称，例如 Button、Input 等',
      },
    },
    required: ['componentName'],
  },
};

/**
 * 工具处理器：处理 semi_component_info 工具调用
 */
export async function handleSemiComponentInfo(
  args: Record<string, unknown>
): Promise<CallToolResult> {
  const componentName = args?.componentName as string;

  if (!componentName) {
    throw new Error('组件名称是必需的');
  }

  return {
    content: [
      {
        type: 'text',
        text: `Semi Design 组件 "${componentName}" 的信息已获取。这是一个示例实现，你可以根据需要扩展功能。`,
      },
    ],
  };
}

