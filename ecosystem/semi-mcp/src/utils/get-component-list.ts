import { fetchDirectoryList } from './fetch-directory-list.js';

/**
 * 获取组件列表（从 lib 文件夹）
 * 从 @douyinfe/semi-ui 包的 lib 目录中提取组件名称
 */
export async function getComponentList(version: string): Promise<string[]> {
  const packageName = '@douyinfe/semi-ui';
  const files = await fetchDirectoryList(packageName, version, 'lib');

  if (!files || files.length === 0) {
    return [];
  }

  // 从文件路径中提取组件目录名称
  // 路径格式: /lib/cjs/Button/index.js 或 /lib/es/Button/index.js
  const componentSet = new Set<string>();
  
  for (const file of files) {
    const path = file.path;
    // 移除开头的 /lib/ 前缀
    const pathWithoutLib = path.replace(/^\/lib\//, '').replace(/^lib\//, '');
    const parts = pathWithoutLib.split('/');
    
    // 跳过 cjs、es 等构建目录
    if (parts.length >= 2 && (parts[0] === 'cjs' || parts[0] === 'es')) {
      const componentName = parts[1];
      if (componentName && componentName !== 'lib') {
        componentSet.add(componentName.toLowerCase());
      }
    } else if (parts.length >= 1) {
      // 如果没有 cjs/es 前缀，直接取第一部分
      const componentName = parts[0];
      if (componentName && componentName !== 'lib' && componentName !== 'cjs' && componentName !== 'es') {
        componentSet.add(componentName.toLowerCase());
      }
    }
  }

  return Array.from(componentSet).sort(); // 去重并排序
}

