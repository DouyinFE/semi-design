import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getComponentDocuments } from '../utils/get-component-documents.js';
import { extractCodeBlocks } from './get-semi-document.js';

/**
 * 工具定义：获取 Semi Design 组件文档中的特定代码块
 */
export const getSemiCodeBlockTool: Tool = {
    name: 'get_semi_code_block',
    description: '获取 Semi Design 组件文档中的特定代码块。当文档较大时，代码块会被隐藏，使用此工具可以获取指定序号的代码块内容',
    inputSchema: {
        type: 'object',
        properties: {
            componentName: {
                type: 'string',
                description: '组件名称，例如 Button、Input、Form 等',
            },
            codeBlockIndex: {
                type: 'number',
                description: '代码块序号（从 1 开始）',
            },
            version: {
                type: 'string',
                description: '版本号，例如 2.89.1。如果不提供，默认使用 latest',
            },
        },
        required: ['componentName', 'codeBlockIndex'],
    },
};

/**
 * 工具处理器：处理 get_semi_code_block 工具调用
 */
export async function handleGetSemiCodeBlock(
    args: Record<string, unknown>
): Promise<CallToolResult> {
    const componentName = args?.componentName as string | undefined;
    const codeBlockIndex = args?.codeBlockIndex as number | undefined;
    const version = (args?.version as string | undefined) || 'latest';

    // 参数验证
    if (!componentName) {
        return {
            content: [
                {
                    type: 'text',
                    text: '错误: 必须提供 componentName 参数',
                },
            ],
            isError: true,
        };
    }

    if (codeBlockIndex === undefined || codeBlockIndex === null) {
        return {
            content: [
                {
                    type: 'text',
                    text: '错误: 必须提供 codeBlockIndex 参数',
                },
            ],
            isError: true,
        };
    }

    if (typeof codeBlockIndex !== 'number' || codeBlockIndex < 1 || !Number.isInteger(codeBlockIndex)) {
        return {
            content: [
                {
                    type: 'text',
                    text: '错误: codeBlockIndex 必须是大于等于 1 的整数',
                },
            ],
            isError: true,
        };
    }

    try {
        // 获取组件文档
        const result = await getComponentDocuments(componentName, version);

        if (!result) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `错误: 未找到组件 "${componentName}" 的文档 (版本 ${version})`,
                    },
                ],
                isError: true,
            };
        }

        // 从所有文档中提取代码块
        const allCodeBlocks: Array<{ block: string; docName: string; indexInDoc: number }> = [];
        
        for (const doc of result.documents) {
            const codeBlocks = extractCodeBlocks(doc.content);
            codeBlocks.forEach((block, idx) => {
                allCodeBlocks.push({
                    block,
                    docName: doc.name,
                    indexInDoc: idx + 1,
                });
            });
        }

        if (allCodeBlocks.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `组件 "${componentName}" 的文档中没有代码块`,
                    },
                ],
            };
        }

        // 检查序号是否有效
        if (codeBlockIndex > allCodeBlocks.length) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `错误: 代码块序号 ${codeBlockIndex} 超出范围。组件 "${componentName}" 的文档中共有 ${allCodeBlocks.length} 个代码块 (序号范围: 1-${allCodeBlocks.length})`,
                    },
                ],
                isError: true,
            };
        }

        // 获取指定的代码块
        const targetBlock = allCodeBlocks[codeBlockIndex - 1];

        return {
            content: [
                {
                    type: 'text',
                    text: `组件 ${componentName} 代码块 #${codeBlockIndex} (来自 ${targetBlock.docName}):\n\n${targetBlock.block}`,
                },
            ],
        };
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `获取代码块失败: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
}

