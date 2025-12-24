import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { fetchDirectoryList } from '../utils/fetch-directory-list.js';

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
 * 获取组件列表（从 lib 文件夹）
 */
async function getComponentList(version: string): Promise<string[]> {
    const packageName = '@douyinfe/semi-ui';
    const files = await fetchDirectoryList(packageName, version, 'lib');

    if (!files || files.length === 0) {
        return [];
    }

    // 提取文件夹名称，转为小写
    const components = files
        .filter((file) => file.type === 'directory')
        .map((file) => {
            // 路径格式可能是 "lib/Button" 或 "Button"
            const parts = file.path.split('/');
            const componentName = parts[parts.length - 1] || parts[0];
            return componentName.toLowerCase();
        })
        .filter((name) => name && name !== 'lib'); // 过滤掉空值和 lib 本身

    return Array.from(new Set(components)).sort(); // 去重并排序
}

/**
 * 获取组件文档列表（从 content 文件夹）
 * content 文件夹结构：content/{category}/{componentName}/index.md, index-en-US.md
 */
async function getComponentDocuments(
    componentName: string,
    version: string
): Promise<{ category: string; documents: string[] } | null> {
    const packageName = '@douyinfe/semi-ui';
    const componentNameLower = componentName.toLowerCase();

    // 先获取 content 下的所有分类文件夹
    const contentDirs = await fetchDirectoryList(packageName, version, 'content');
    
    if (!contentDirs || contentDirs.length === 0) {
        return null;
    }

    // 获取所有分类文件夹名称
    const categories = contentDirs
        .filter((file) => file.type === 'directory')
        .map((file) => {
            const parts = file.path.split('/');
            return parts[parts.length - 1] || parts[0];
        })
        .filter((name) => name && name !== 'content');

    // 在每个分类文件夹下查找组件文件夹
    for (const category of categories) {
        try {
            const categoryFiles = await fetchDirectoryList(
                packageName,
                version,
                `content/${category}`
            );

            // 查找组件名称对应的文件夹
            const componentDir = categoryFiles.find(
                (file) =>
                    file.type === 'directory' &&
                    file.path.toLowerCase().endsWith(`/${componentNameLower}`)
            );

            if (componentDir) {
                // 获取组件文件夹下的文件
                const componentFiles = await fetchDirectoryList(
                    packageName,
                    version,
                    `content/${category}/${componentNameLower}`
                );

                if (componentFiles && componentFiles.length > 0) {
                    // 提取文件名称，转为小写
                    const documents = componentFiles
                        .filter((file) => file.type === 'file')
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
            }
        } catch (error) {
            // 如果某个分类查找失败，继续查找下一个
            continue;
        }
    }

    return null;
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
