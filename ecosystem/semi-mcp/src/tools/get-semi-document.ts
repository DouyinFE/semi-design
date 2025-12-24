import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fetchDirectoryList } from '../utils/fetch-directory-list.js';
import { getComponentList } from '../utils/get-component-list.js';

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
        },
        required: [],
    },
};

/**
 * 获取组件文档列表（从 content 文件夹）
 * content 文件夹结构：content/{category}/{componentName}/index.md, index-en-US.md
 * unpkg 返回的是扁平的文件列表，需要从文件路径中提取信息
 */
async function getComponentDocuments(
    componentName: string,
    version: string
): Promise<{ category: string; documents: string[] } | null> {
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

    // 提取所有文档文件名
    const documents = componentFiles
        .map((file) => {
            const parts = file.path.split('/');
            return parts[parts.length - 1].toLowerCase();
        })
        .filter((name) => name);

    return {
        category,
        documents: Array.from(new Set(documents)).sort(),
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

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                componentName: componentName.toLowerCase(),
                                version,
                                category: result.category,
                                documents: result.documents,
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
