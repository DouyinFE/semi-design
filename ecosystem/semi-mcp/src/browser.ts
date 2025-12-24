/**
 * Semi MCP Browser Entry
 * 
 * 这个入口导出所有可以在浏览器环境中运行的原子功能
 * 这些功能只使用 fetch API，不依赖 Node.js 特有的模块
 */

// ============ 核心工具函数 ============

// 获取目录列表
export {
  fetchDirectoryList,
  fetchDirectoryListFromSource,
  UNPKG_BASE_URL,
  NPMMIRROR_BASE_URL,
} from './utils/fetch-directory-list.js';

// 获取文件内容
export {
  fetchFileContent,
  fetchFileContentFromSource,
  UNPKG_BASE_URL as FILE_UNPKG_BASE_URL,
  NPMMIRROR_BASE_URL as FILE_NPMMIRROR_BASE_URL,
} from './utils/fetch-file-content.js';

// 获取组件列表
export { getComponentList } from './utils/get-component-list.js';

// 获取组件文档
export {
  getComponentDocuments,
  type ComponentDocument,
  type ComponentDocumentsResult,
} from './utils/get-component-documents.js';

// ============ 便捷 API ============

/**
 * 获取 Semi Design 组件文档
 * 这是一个便捷的高级 API，封装了获取文档的完整流程
 * 
 * @param componentName - 组件名称，如 'Button', 'Table' 等。如果不提供，返回组件列表
 * @param version - 版本号，如 '2.89.1'。默认为 'latest'
 * @returns 文档内容或组件列表
 * 
 * @example
 * // 获取组件列表
 * const components = await getSemiDocument();
 * console.log(components.components); // ['button', 'table', ...]
 * 
 * @example
 * // 获取特定组件文档
 * const doc = await getSemiDocument('Button');
 * console.log(doc.documents[0].content); // 文档内容
 */
export async function getSemiDocument(
  componentName?: string,
  version: string = 'latest'
): Promise<
  | { type: 'list'; version: string; components: string[]; count: number }
  | { type: 'document'; componentName: string; version: string; category: string; documents: Array<{ name: string; path: string; content: string }> }
  | { type: 'error'; message: string }
> {
  const { getComponentList } = await import('./utils/get-component-list.js');
  const { getComponentDocuments } = await import('./utils/get-component-documents.js');

  try {
    if (!componentName) {
      // 返回组件列表
      const components = await getComponentList(version);
      return {
        type: 'list',
        version,
        components,
        count: components.length,
      };
    } else {
      // 返回组件文档
      const result = await getComponentDocuments(componentName, version);

      if (!result) {
        const allComponents = await getComponentList(version);
        return {
          type: 'error',
          message: `未找到组件 "${componentName}" 的文档 (版本 ${version})。可用组件列表：${allComponents.join(', ')}`,
        };
      }

      return {
        type: 'document',
        componentName,
        version,
        category: result.category,
        documents: result.documents,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      type: 'error',
      message: `获取文档失败: ${errorMessage}`,
    };
  }
}

