/**
 * 从 unpkg 或 npmmirror 获取目录列表
 * 同时向两个数据源发送请求，使用第一个成功返回的结果
 */

import {
  readCache,
  writeCache,
  getDirectoryListCacheDir,
  clearCacheDir,
  getCacheDirSize,
} from './file-cache.js';
import { resolveVersion } from './resolve-version.js';

export const UNPKG_BASE_URL = 'https://unpkg.com';
export const NPMMIRROR_BASE_URL = 'https://registry.npmmirror.com';

/**
 * 生成缓存 key
 */
function getCacheKey(packageName: string, version: string, path: string): string {
  return `${packageName}@${version}/${path}`;
}

/**
 * 清除目录列表缓存
 */
export async function clearDirectoryListCache(): Promise<number> {
  return clearCacheDir(getDirectoryListCacheDir());
}

/**
 * 获取目录列表缓存大小
 */
export async function getDirectoryListCacheSize(): Promise<number> {
  return getCacheDirSize(getDirectoryListCacheDir());
}

/**
 * 递归扁平化嵌套的目录结构（用于处理 npmmirror 返回的嵌套格式）
 */
function flattenDirectoryStructure(
  item: { path: string; type?: string; size?: number; files?: Array<{ path: string; type?: string; size?: number; files?: Array<{ path: string; type?: string; size?: number }> }> },
  result: Array<{ path: string; type?: string; size?: number }> = []
): Array<{ path: string; type?: string; size?: number }> {
  // 将当前项添加到结果中
  result.push({
    path: item.path,
    type: item.type,
    size: item.size,
  });

  // 如果有嵌套的 files 数组，递归处理
  if (item.files && Array.isArray(item.files)) {
    for (const file of item.files) {
      flattenDirectoryStructure(file, result);
    }
  }

  return result;
}

/**
 * 递归获取 NPMMIRROR 的目录列表（因为 NPMMIRROR 返回的嵌套结构中子目录的 files 是空的，需要递归请求）
 */
async function fetchNpmMirrorDirectoryRecursive(
  baseUrl: string,
  packageName: string,
  version: string,
  path: string,
  maxDepth: number = 10
): Promise<Array<{ path: string; type: string }>> {
  if (maxDepth <= 0) {
    return [];
  }

  const url = `${baseUrl}/${packageName}/${version}/files/${path}/?meta`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`获取目录列表失败: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`API 返回了非 JSON 格式: ${contentType}`);
  }

  const data = await response.json() as
    | { path: string; type?: string; files?: Array<{ path: string; type?: string; files?: Array<{ path: string; type?: string }> }> };

  const normalizeType = (item: { path: string; type?: string }): { path: string; type: string } => {
    const path = item.path;
    if (path.endsWith('/')) {
      return { path, type: 'directory' };
    }
    if (item.type && item.type.includes('/')) {
      return { path, type: 'file' };
    }
    if (item.type === 'directory') {
      return { path, type: 'directory' };
    }
    return { path, type: 'file' };
  };

  const result: Array<{ path: string; type: string }> = [];

  if (data && typeof data === 'object' && 'files' in data && Array.isArray(data.files)) {
    // 递归处理每个子项
    const promises: Promise<Array<{ path: string; type: string }>>[] = [];

    for (const item of data.files) {
      const normalized = normalizeType(item);
      result.push(normalized);

      // 如果是目录且 files 数组为空，需要递归请求
      if (normalized.type === 'directory' && (!item.files || item.files.length === 0)) {
        // 移除路径开头的 /，因为 URL 中不需要
        const subPath = normalized.path.startsWith('/') ? normalized.path.slice(1) : normalized.path;
        promises.push(
          fetchNpmMirrorDirectoryRecursive(baseUrl, packageName, version, subPath, maxDepth - 1)
            .then(subFiles => {
              // 移除当前目录本身，只保留子文件
              return subFiles.filter(f => f.path !== normalized.path);
            })
            .catch(() => []) // 如果子目录请求失败，忽略错误
        );
      } else if (item.files && Array.isArray(item.files) && item.files.length > 0) {
        // 如果已经有嵌套的 files，递归扁平化
        const flattened: Array<{ path: string; type?: string; size?: number }> = [];
        flattenDirectoryStructure(item, flattened);
        const subFiles = flattened
          .filter(f => f.path !== normalized.path) // 排除当前目录本身
          .map(normalizeType);
        result.push(...subFiles);
      }
    }

    // 等待所有递归请求完成
    if (promises.length > 0) {
      const subResults = await Promise.all(promises);
      for (const subFiles of subResults) {
        result.push(...subFiles);
      }
    }
  }

  return result;
}

/**
 * 从单个源获取目录列表
 * 导出用于测试
 */
export async function fetchDirectoryListFromSource(
  baseUrl: string,
  packageName: string,
  version: string,
  path: string,
  isNpmMirror: boolean = false
): Promise<Array<{ path: string; type: string }>> {
  // NPMMIRROR 需要递归请求，因为返回的嵌套结构中子目录的 files 是空的
  if (isNpmMirror) {
    return fetchNpmMirrorDirectoryRecursive(baseUrl, packageName, version, path);
  }

  // unpkg 使用格式：/package@version/path/?meta
  const url = `${baseUrl}/${packageName}@${version}/${path}/?meta`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`获取目录列表失败: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`API 返回了非 JSON 格式: ${contentType}`);
  }

  const data = (await response.json()) as
    | Array<{ path: string; type?: string; size?: number }>
    | { files?: Array<{ path: string; type?: string; size?: number }> }
    | { path: string; type?: string; size?: number; files?: Array<{ path: string; type?: string; size?: number; files?: Array<{ path: string; type?: string; size?: number }> }> };

  // 将 MIME 类型转换为 file/directory 类型
  const normalizeType = (item: { path: string; type?: string; size?: number }): { path: string; type: string } => {
    const path = item.path;
    // 如果路径以 / 结尾，认为是目录
    if (path.endsWith('/')) {
      return { path, type: 'directory' };
    }
    // 如果 type 是 MIME 类型（包含 /），认为是文件
    if (item.type && item.type.includes('/')) {
      return { path, type: 'file' };
    }
    // 如果 type 是 'directory'，认为是目录
    if (item.type === 'directory') {
      return { path, type: 'directory' };
    }
    // 默认认为是文件
    return { path, type: 'file' };
  };

  // 处理不同的响应格式
  if (Array.isArray(data)) {
    // unpkg 返回的是扁平数组
    return data.map(normalizeType);
  }
  
  // unpkg 可能返回 { package, version, prefix, files: [...] } 格式
  if (data && typeof data === 'object' && 'files' in data) {
    const filesData = data as { files?: Array<{ path: string; type?: string; size?: number }> };
    if (Array.isArray(filesData.files)) {
      // files 是数组，直接映射
      return filesData.files.map(normalizeType);
    }
  }
  
  // 如果返回单个文件对象，检查是否有嵌套结构
  if (data && typeof data === 'object' && 'path' in data) {
    const singleItem = data as { path: string; type?: string; size?: number; files?: Array<{ path: string; type?: string; size?: number; files?: Array<{ path: string; type?: string; size?: number }> }> };
    // 如果有嵌套的 files，需要扁平化
    if (singleItem.files && Array.isArray(singleItem.files)) {
      const flattened: Array<{ path: string; type?: string; size?: number }> = [];
      flattenDirectoryStructure(singleItem, flattened);
      return flattened.map(normalizeType);
    }
    // 否则直接返回单个项
    return [normalizeType(singleItem)];
  }

  throw new Error('无法解析目录列表数据格式');
}

/**
 * 从 unpkg 或 npmmirror 获取目录列表
 * 同时向两个数据源发送请求，优先使用返回更多文件的结果
 * 支持文件缓存：相同的 packageName、version、path 会使用缓存
 * 
 * 注意：如果 version 是 "latest" 等标签，会先解析为实际版本号再缓存
 * 这样当远端版本更新时，缓存会自动失效
 */
export async function fetchDirectoryList(
  packageName: string,
  version: string,
  path: string
): Promise<Array<{ path: string; type: string }>> {
  // 解析版本号（将 "latest" 等标签解析为实际版本号）
  const resolvedVersion = await resolveVersion(packageName, version);
  
  // 使用解析后的版本号作为缓存 key
  const cacheKey = getCacheKey(packageName, resolvedVersion, path);
  const cacheDir = getDirectoryListCacheDir();
  const cachedContent = await readCache(cacheDir, cacheKey);
  
  if (cachedContent) {
    try {
      const cachedResult = JSON.parse(cachedContent) as Array<{ path: string; type: string }>;
      return cachedResult;
    } catch {
      // 缓存解析失败，忽略缓存
    }
  }

  // 同时向两个源发送请求（使用解析后的版本号）
  const unpkgPromise = fetchDirectoryListFromSource(UNPKG_BASE_URL, packageName, resolvedVersion, path, false);
  const npmmirrorPromise = fetchDirectoryListFromSource(NPMMIRROR_BASE_URL, packageName, resolvedVersion, path, true);

  // 等待所有请求完成（无论成功或失败）
  const results = await Promise.allSettled([unpkgPromise, npmmirrorPromise]);
  
  // 收集成功的结果和错误
  const successfulResults: Array<{ source: string; files: Array<{ path: string; type: string }> }> = [];
  const errors: Error[] = [];
  
  if (results[0].status === 'fulfilled') {
    successfulResults.push({ source: 'unpkg', files: results[0].value });
  } else {
    errors.push(results[0].reason instanceof Error ? results[0].reason : new Error(String(results[0].reason)));
  }
  
  if (results[1].status === 'fulfilled') {
    successfulResults.push({ source: 'npmmirror', files: results[1].value });
  } else {
    errors.push(results[1].reason instanceof Error ? results[1].reason : new Error(String(results[1].reason)));
  }

  // 如果没有成功的结果，抛出错误
  if (successfulResults.length === 0) {
    throw new Error(`所有数据源都失败了: ${errors.map((e) => e.message).join('; ')}`);
  }

  // 优先使用返回更多文件的结果
  // 如果文件数量相同，优先使用 unpkg（通常更可靠）
  successfulResults.sort((a, b) => {
    if (b.files.length !== a.files.length) {
      return b.files.length - a.files.length; // 文件数量多的优先
    }
    // 文件数量相同时，unpkg 优先
    return a.source === 'unpkg' ? -1 : 1;
  });

  const result = successfulResults[0].files;

  // 写入文件缓存
  await writeCache(cacheDir, cacheKey, JSON.stringify(result));

  return result;
}
