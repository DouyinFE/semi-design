import { fetchDirectoryList } from './fetch-directory-list.js';
import { fetchFileContent } from './fetch-file-content.js';

export interface ComponentDocument {
  name: string;
  path: string;
  content: string;
}

export interface ComponentDocumentsResult {
  category: string;
  documents: ComponentDocument[];
}

/**
 * 获取组件文档内容（从 content 文件夹）
 * content 文件夹结构：content/{category}/{componentName}/index.md, index-en-US.md
 * unpkg 返回的是扁平的文件列表，需要从文件路径中提取信息
 * 
 * 这个函数可以在浏览器和 Node.js 环境中运行
 */
export async function getComponentDocuments(
  componentName: string,
  version: string = 'latest'
): Promise<ComponentDocumentsResult | null> {
  const packageName = '@douyinfe/semi-ui';
  const componentNameLower = componentName.toLowerCase();

  // 获取 content 下的所有文件（unpkg 返回扁平列表）
  const contentFiles = await fetchDirectoryList(packageName, version, 'content');

  if (!contentFiles || contentFiles.length === 0) {
    return null;
  }

  // 从文件路径中查找匹配的组件文档（只要中文文档 index.md）
  // 路径格式：/content/{category}/{componentName}/index.md
  const componentFiles = contentFiles.filter((file) => {
    if (file.type !== 'file') {
      return false;
    }
    const path = file.path.toLowerCase();
    // 只匹配中文文档 index.md，排除 index-en-US.md
    const pathPattern = new RegExp(`/content/[^/]+/${componentNameLower}/index\\.md$`);
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

