import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getComponentList } from '../utils/get-component-list.js';
import { getComponentDocuments } from '../utils/get-component-documents.js';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * 工具定义：获取 Semi Design 组件文档
 */
export const getSemiDocumentTool: Tool = {
    name: 'get_semi_document',
    description: '获取 Semi Design 组件文档或组件列表',
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
            get_path: {
                type: 'boolean',
                description: '如果为 true，将文档写入操作系统临时目录并返回路径，而不是在响应中返回文档内容。默认为 false',
                default: false,
            },
        },
        required: [],
    },
};

/**
 * 工具处理器：处理 get_semi_document 工具调用
 */
export async function handleGetSemiDocument(
    args: Record<string, unknown>
): Promise<CallToolResult> {
    const componentName = args?.componentName as string | undefined;
    const version = (args?.version as string | undefined) || 'latest';
    const getPath = (args?.get_path as boolean | undefined) || false;

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

            // 检查是否有文档行数大于 888，如果有则自动开启 get_path
            // 但只有在用户没有明确设置 get_path 时才自动开启
            const hasLargeDocument = documentsWithLines.some(doc => doc.lines > 888);
            const userExplicitlySetGetPath = 'get_path' in args;
            const shouldUsePath = getPath || (hasLargeDocument && !userExplicitlySetGetPath);

            // 如果 get_path 为 true 或自动开启，将文档写入临时目录
            if (shouldUsePath) {
                const baseTempDir = tmpdir();
                const tempDirName = `semi-docs-${componentName.toLowerCase()}-${version}-${Date.now()}`;
                const tempDir = join(baseTempDir, tempDirName);

                // 创建临时目录
                await mkdir(tempDir, { recursive: true });

                // 写入所有文档文件
                for (const doc of result.documents) {
                    const filePath = join(tempDir, doc.name);
                    await writeFile(filePath, doc.content, 'utf-8');
                }

                // 构建纯文本提示信息
                const fileList = documentsWithLines.map(doc => 
                    `  - ${join(tempDir, doc.name)} (${doc.lines.toLocaleString()} 行)`
                ).join('\n');
                
                const message = `组件 ${componentName} (版本 ${version}) 文档较大，已保存到临时目录。

文档文件列表：
${fileList}

请使用文件读取工具查看文档内容。`;

                return {
                    content: [
                        {
                            type: 'text',
                            text: message,
                        },
                    ],
                };
            }

            // 默认直接返回文档内容（纯文本）
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
