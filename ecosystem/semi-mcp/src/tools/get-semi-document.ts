import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getComponentList } from '../utils/get-component-list.js';
import { getComponentDocuments } from '../utils/get-component-documents.js';

/**
 * 代码块匹配正则：匹配 markdown 代码块
 * 匹配 ```[语言/属性] ... ``` 格式的代码块
 */
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;

/**
 * 提取文档中的所有代码块
 * @param content - 文档内容
 * @returns 代码块数组
 */
export function extractCodeBlocks(content: string): string[] {
    const matches = content.match(CODE_BLOCK_REGEX);
    return matches || [];
}

/**
 * 将文档中的代码块替换为占位提示词
 * @param content - 原始文档内容
 * @param componentName - 组件名称
 * @returns 替换后的文档内容
 */
export function replaceCodeBlocksWithPlaceholders(
    content: string,
    componentName: string
): string {
    let index = 0;
    return content.replace(CODE_BLOCK_REGEX, () => {
        index++;
        return `\`\`\`text
[代码块 #${index} 已隐藏]
要查看此代码，请使用 get_semi_code_block 工具，传入参数:
- componentName: "${componentName}"
- codeBlockIndex: ${index}
\`\`\``;
    });
}

/**
 * 工具定义：获取 Semi Design 组件文档
 */
export const getSemiDocumentTool: Tool = {
    name: 'get_semi_document',
    description: '获取 Semi Design 组件文档或组件列表。对于大型文档，代码块会被替换为占位符，需要使用 get_semi_code_block 工具获取具体代码',
    inputSchema: {
        type: 'object',
        properties: {
            componentName: {
                type: 'string',
                description: '组件名称，例如 Button、Input 等。如果不提供，则返回组件列表',
            },
            version: {
                type: 'string',
                description: '版本号，例如 2.89.1。如果不提供，默认使用 latest',
            },
        },
        required: [],
    },
};

/** 文档行数阈值，超过此值会替换代码块 */
const LARGE_DOCUMENT_THRESHOLD = 888;

/**
 * 工具处理器：处理 get_semi_document 工具调用
 */
export async function handleGetSemiDocument(
    args: Record<string, unknown>
): Promise<CallToolResult> {
    const componentName = args?.componentName as string | undefined;
    const version = (args?.version as string | undefined) || 'latest';

    try {
        if (!componentName) {
            // 返回组件列表
            const components = await getComponentList(version);
            
            if (components.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `未找到组件列表，请检查版本号 ${version} 是否正确`,
                        },
                    ],
                    isError: true,
                };
            }
            
            return {
                content: [
                    {
                        type: 'text',
                        text: `Semi Design 组件列表 (版本 ${version})，共 ${components.length} 个组件：\n\n${components.join(', ')}`,
                    },
                ],
            };
        } else {
            // 返回组件文档列表
            const result = await getComponentDocuments(componentName, version);
            
            // 获取全部组件列表
            const allComponents = await getComponentList(version);
            
            if (!result) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `未找到组件 "${componentName}" 的文档 (版本 ${version})。\n\n可用组件列表：${allComponents.join(', ')}`,
                        },
                    ],
                };
            }

            // 计算每个文档的行数
            const documentsWithLines = result.documents.map(doc => ({
                ...doc,
                lines: doc.content.split('\n').length,
            }));

            // 检查是否有文档行数大于阈值
            const hasLargeDocument = documentsWithLines.some(doc => doc.lines > LARGE_DOCUMENT_THRESHOLD);

            // 如果有大文档，替换代码块为占位符
            if (hasLargeDocument) {
                const processedDocs = result.documents.map(doc => {
                    const lines = doc.content.split('\n').length;
                    if (lines > LARGE_DOCUMENT_THRESHOLD) {
                        // 大文档：替换代码块
                        const codeBlocks = extractCodeBlocks(doc.content);
                        const processedContent = replaceCodeBlocksWithPlaceholders(doc.content, componentName);
                        return {
                            ...doc,
                            content: processedContent,
                            codeBlockCount: codeBlocks.length,
                            originalLines: lines,
                        };
                    }
                    return {
                        ...doc,
                        codeBlockCount: 0,
                        originalLines: lines,
                    };
                });

                // 构建文档内容
                const docContents = processedDocs.map(doc => {
                    let header = `===== ${doc.name} =====`;
                    if (doc.codeBlockCount > 0) {
                        header += `\n[注意: 此文档原有 ${doc.originalLines} 行，包含 ${doc.codeBlockCount} 个代码块已被隐藏。使用 get_semi_code_block 工具查看具体代码]`;
                    }
                    return `${header}\n\n${doc.content}`;
                }).join('\n\n');

                return {
                    content: [
                        {
                            type: 'text',
                            text: docContents,
                        },
                    ],
                };
            }

            // 小文档：直接返回完整内容
            const docContents = result.documents.map(doc => {
                return `===== ${doc.name} =====\n\n${doc.content}`;
            }).join('\n\n');

            return {
                content: [
                    {
                        type: 'text',
                        text: docContents,
                    },
                ],
            };
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `获取文档失败: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
}
