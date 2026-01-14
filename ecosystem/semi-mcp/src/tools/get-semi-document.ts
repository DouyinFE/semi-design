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
    description: '获取 Semi Design 组件文档、额外文档或组件列表。支持获取：1) 组件文档（如 Button、Input 等组件）；2) 额外文档，包括：advanced 分类下的文档（customize-theme、dark-mode、design-source、design-to-code）、ecosystem 分类下的文档（changelog、faq、react19、tailwind、update-to-v2、web-components）、experience 分类下的文档（accessibility、content-guidelines、internationalization）、start 分类下的文档（getting-started、introduction、overview）。注意：changelog 文档较大，需要使用分页格式获取，传入 changelog-1（第1页，最新内容）、changelog-2（第2页）等格式，每页300行。对于大型文档，代码块会被替换为占位符，需要使用 get_semi_code_block 工具获取具体代码',
    inputSchema: {
        type: 'object',
        properties: {
            componentName: {
                type: 'string',
                description: '组件名称或文档名称。组件名称例如：Button、Input、Table 等；额外文档名称例如：customize-theme、dark-mode、design-source、design-to-code、changelog-1（changelog第1页，最新）、changelog-2（changelog第2页）等、faq、react19、tailwind、update-to-v2、web-components、accessibility、content-guidelines、internationalization、getting-started、introduction、overview 等。注意：changelog 必须使用分页格式（changelog-1、changelog-2等），不能直接传入 changelog。如果不提供，则返回组件列表',
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

/** changelog 分页大小（每页行数） */
const CHANGELOG_PAGE_SIZE = 300;

/**
 * 从文档路径生成 URL
 * @param docPath - 文档路径，格式：/content/{category}/{componentName}/index.md
 * @returns URL，格式：https://semi.design/zh-CN/{category}/{componentName}
 */
export function generateDocumentUrl(docPath: string): string {
    // 路径格式：/content/{category}/{componentName}/index.md
    // 或者：content/{category}/{componentName}/index.md
    const pathParts = docPath.split('/');
    
    // 找到 content 的位置
    let contentIndex = -1;
    for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i].toLowerCase() === 'content') {
            contentIndex = i;
            break;
        }
    }
    
    // 确保 content 存在，且之后至少有 category 和 componentName 两个部分
    // 还需要一个文件名部分（如 index.md），所以至少需要 contentIndex + 3 个部分
    if (contentIndex === -1 || contentIndex + 3 >= pathParts.length) {
        return '';
    }
    
    // 提取 category 和 componentName
    const category = pathParts[contentIndex + 1];
    const componentName = pathParts[contentIndex + 2];
    
    // 确保 category 和 componentName 都存在且不为空
    if (!category || !componentName) {
        return '';
    }
    
    return `https://semi.design/zh-CN/${category}/${componentName}`;
}

/**
 * 解析 changelog 分页参数
 * @param componentName - 组件名称，可能是 changelog 或 changelog-1、changelog-2 等
 * @returns 如果是 changelog 分页格式，返回 { isChangelog: true, page: number }，否则返回 { isChangelog: false }
 */
function parseChangelogPage(componentName: string): { isChangelog: boolean; page?: number; baseName?: string } {
    const changelogMatch = componentName.match(/^(changelog)(?:-(\d+))?$/);
    if (changelogMatch) {
        const baseName = changelogMatch[1];
        const pageStr = changelogMatch[2];
        if (pageStr) {
            // changelog-1, changelog-2 等格式
            const page = parseInt(pageStr, 10);
            return { isChangelog: true, page, baseName };
        } else {
            // 只是 changelog，没有页码
            return { isChangelog: true, baseName };
        }
    }
    return { isChangelog: false };
}

/**
 * 对 changelog 文档进行分页
 * @param content - 文档内容
 * @param page - 页码（从1开始，1为最新）
 * @returns 分页后的内容
 */
function paginateChangelog(content: string, page: number): { content: string; totalPages: number; currentPage: number } {
    const lines = content.split('\n');
    const totalLines = lines.length;
    const totalPages = Math.ceil(totalLines / CHANGELOG_PAGE_SIZE);
    
    // 页码从1开始，1为最新（文档开头）
    const startIndex = (page - 1) * CHANGELOG_PAGE_SIZE;
    const endIndex = Math.min(startIndex + CHANGELOG_PAGE_SIZE, totalLines);
    
    const pageLines = lines.slice(startIndex, endIndex);
    const pageContent = pageLines.join('\n');
    
    return {
        content: pageContent,
        totalPages,
        currentPage: page,
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
            // 检查是否是 changelog 分页请求
            const changelogInfo = parseChangelogPage(componentName);
            
            if (changelogInfo.isChangelog && !changelogInfo.page) {
                // 如果只是传入 changelog，没有页码，返回提示信息
                return {
                    content: [
                        {
                            type: 'text',
                            text: `changelog 文档较大，需要使用分页方式获取。\n\n请使用以下格式获取：\n- changelog-1（第1页，最新内容）\n- changelog-2（第2页）\n- changelog-3（第3页）\n- ...\n\n页码从1开始，1为最新内容。`,
                        },
                    ],
                };
            }
            
            // 如果是指定了页码的 changelog，使用基础名称获取文档
            const actualComponentName = changelogInfo.baseName || componentName;
            
            // 返回组件文档列表
            const result = await getComponentDocuments(actualComponentName, version);
            
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
            
            // 如果是 changelog 分页请求，进行分页处理
            if (changelogInfo.isChangelog && changelogInfo.page) {
                const page = changelogInfo.page;
                
                // changelog 应该只有一个文档
                if (result.documents.length === 0) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `未找到 changelog 文档 (版本 ${version})`,
                            },
                        ],
                        isError: true,
                    };
                }
                
                const doc = result.documents[0];
                const paginated = paginateChangelog(doc.content, page);
                
                if (page < 1 || page > paginated.totalPages) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `页码 ${page} 超出范围。changelog 文档共有 ${paginated.totalPages} 页，请使用 changelog-1 到 changelog-${paginated.totalPages}。`,
                            },
                        ],
                        isError: true,
                    };
                }
                
                const nextPageHint = page < paginated.totalPages ? `使用 changelog-${page + 1} 获取下一页` : '';
                const prevPageHint = page > 1 ? `使用 changelog-${page - 1} 获取上一页` : '';
                const pageHints = [nextPageHint, prevPageHint].filter(Boolean).join('，');
                const header = `===== ${doc.name} (第 ${page}/${paginated.totalPages} 页) =====${pageHints ? `\n[提示: ${pageHints}]` : ''}`;
                const footer = `\n\n[当前页: ${page}/${paginated.totalPages} | 总行数: ${doc.content.split('\n').length} | 每页: ${CHANGELOG_PAGE_SIZE} 行]`;
                const url = generateDocumentUrl(doc.path);
                const urlFooter = url ? `\n\n文档链接: ${url}` : '';
                
                return {
                    content: [
                        {
                            type: 'text',
                            text: `${header}\n\n${paginated.content}${footer}${urlFooter}`,
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
                    const url = generateDocumentUrl(doc.path);
                    const urlFooter = url ? `\n\n文档链接: ${url}` : '';
                    return `${header}\n\n${doc.content}${urlFooter}`;
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
                const url = generateDocumentUrl(doc.path);
                const urlFooter = url ? `\n\n文档链接: ${url}` : '';
                return `===== ${doc.name} =====\n\n${doc.content}${urlFooter}`;
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
