import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fetchDirectoryList } from '../utils/fetch-directory-list.js';
import { fetchFileContent } from '../utils/fetch-file-content.js';
import { getComponentList } from '../utils/get-component-list.js';
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
 * 获取组件文档内容（从 content 文件夹）
 * content 文件夹结构：content/{category}/{componentName}/index.md, index-en-US.md
 * unpkg 返回的是扁平的文件列表，需要从文件路径中提取信息
 */
async function getComponentDocuments(
    componentName: string,
    version: string
): Promise<{ category: string; documents: Array<{ name: string; path: string; content: string }> } | null> {
    const packageName = '@douyinfe/semi-ui';
    const componentNameLower = componentName.toLowerCase();

    // 获取 content 下的所有文件（unpkg 返回扁平列表）
    const contentFiles = await fetchDirectoryList(packageName, version, 'content');
    
    if (!contentFiles || contentFiles.length === 0) {
        return null;
    }

    // 从文件路径中查找匹配的组件文档
    // 路径格式：/content/{category}/{componentName}/index.md
    const componentFiles = contentFiles.filter((file) => {
        if (file.type !== 'file') {
            return false;
        }
        const path = file.path.toLowerCase();
        // 匹配路径：content/{category}/{componentName}/文件名
        const pathPattern = new RegExp(`/content/[^/]+/${componentNameLower}/[^/]+$`);
        return pathPattern.test(path);
    });

    if (componentFiles.length === 0) {
        return null;
    }

    // 从第一个文件路径中提取分类
    const firstPath = componentFiles[0].path;
    const pathParts = firstPath.split('/');
    // 路径格式：/content/{category}/{componentName}/文件名
    // 或者：content/{category}/{componentName}/文件名
    let categoryIndex = -1;
    for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i].toLowerCase() === 'content') {
            categoryIndex = i + 1;
            break;
        }
    }
    
    if (categoryIndex === -1 || categoryIndex >= pathParts.length) {
        return null;
    }

    const category = pathParts[categoryIndex];

    // 获取所有文档文件的内容
    // 移除路径开头的 /，因为 fetchFileContent 需要相对路径
    const documentPromises = componentFiles.map(async (file) => {
        const filePath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
        const parts = file.path.split('/');
        const fileName = parts[parts.length - 1];
        
        try {
            const content = await fetchFileContent(packageName, version, filePath);
            return {
                name: fileName,
                path: file.path,
                content: content,
            };
        } catch (error) {
            // 如果获取文件内容失败，返回错误信息
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                name: fileName,
                path: file.path,
                content: `获取文档内容失败: ${errorMessage}`,
            };
        }
    });

    const documents = await Promise.all(documentPromises);

    return {
        category,
        documents: documents.sort((a, b) => a.name.localeCompare(b.name)),
    };
}

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
                            text: JSON.stringify(
                                {
                                    version,
                                    error: `未找到组件列表，请检查版本号 ${version} 是否正确`,
                                    components: [],
                                    count: 0,
                                },
                                null,
                                2
                            ),
                        },
                    ],
                    isError: true,
                };
            }
            
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                version,
                                components,
                                count: components.length,
                            },
                            null,
                            2
                        ),
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
                            text: JSON.stringify(
                                {
                                    componentName: componentName.toLowerCase(),
                                    version,
                                    error: '未找到组件文档',
                                    documents: [],
                                    count: 0,
                                    allComponents,
                                    allComponentsCount: allComponents.length,
                                },
                                null,
                                2
                            ),
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
                const filePaths: string[] = [];
                for (const doc of result.documents) {
                    const filePath = join(tempDir, doc.name);
                    await writeFile(filePath, doc.content, 'utf-8');
                    filePaths.push(filePath);
                }

                // 构建提示信息
                const largeDocs = documentsWithLines.filter(doc => doc.lines > 888);
                let message = `文档已保存到临时目录: ${tempDir}\n请使用文件读取工具查看文档内容。`;
                
                if (hasLargeDocument && !userExplicitlySetGetPath) {
                    // 自动开启的情况，添加文件大小提示
                    const largeDocNames = largeDocs.map(doc => `${doc.name} (${doc.lines.toLocaleString()} 行)`).join(', ');
                    message = `文档已保存到临时目录: ${tempDir}\n注意：以下文档文件较大，已自动保存到临时目录：${largeDocNames}\n请使用文件读取工具查看文档内容。`;
                } else if (hasLargeDocument) {
                    // 用户明确设置 get_path 的情况
                    const largeDocNames = largeDocs.map(doc => `${doc.name} (${doc.lines.toLocaleString()} 行)`).join(', ');
                    message = `文档已保存到临时目录: ${tempDir}\n注意：以下文档文件较大：${largeDocNames}\n请使用文件读取工具查看文档内容。`;
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(
                                {
                                    componentName: componentName.toLowerCase(),
                                    version,
                                    category: result.category,
                                    tempDirectory: tempDir,
                                    files: documentsWithLines.map(doc => ({
                                        name: doc.name,
                                        path: join(tempDir, doc.name),
                                        contentLength: doc.content.length,
                                        lines: doc.lines,
                                    })),
                                    count: result.documents.length,
                                    message,
                                    autoGetPath: hasLargeDocument && !userExplicitlySetGetPath, // 标记是否自动开启
                                    allComponents,
                                    allComponentsCount: allComponents.length,
                                },
                                null,
                                2
                            ),
                        },
                    ],
                };
            }

            // 默认返回文档内容
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                componentName: componentName.toLowerCase(),
                                version,
                                category: result.category,
                                documents: result.documents.map(doc => ({
                                    name: doc.name,
                                    path: doc.path,
                                    contentLength: doc.content.length,
                                })),
                                contents: result.documents.map(doc => ({
                                    name: doc.name,
                                    path: doc.path,
                                    content: doc.content,
                                })),
                                count: result.documents.length,
                                allComponents,
                                allComponentsCount: allComponents.length,
                            },
                            null,
                            2
                        ),
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
                    text: JSON.stringify(
                        {
                            error: errorMessage,
                            componentName: componentName?.toLowerCase(),
                            version,
                        },
                        null,
                        2
                    ),
                },
            ],
            isError: true,
        };
    }
}
