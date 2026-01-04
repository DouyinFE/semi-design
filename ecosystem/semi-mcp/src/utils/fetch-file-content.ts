/**
 * 从 unpkg 或 npmmirror 获取具体文件内容
 * 同时向两个数据源发送请求，使用第一个成功返回的结果
 */

import {
  readCache,
  writeCache,
  getFileContentCacheDir,
  clearCacheDir,
  getCacheDirSize,
} from './file-cache.js';
import { resolveVersion } from './resolve-version.js';

export const UNPKG_BASE_URL = 'https://unpkg.com';
export const NPMMIRROR_BASE_URL = 'https://registry.npmmirror.com';

/**
 * 生成缓存 key
 */
function getCacheKey(packageName: string, version: string, filePath: string): string {
  return `${packageName}@${version}/${filePath}`;
}

/**
 * 清除文件内容缓存
 */
export async function clearFileContentCache(): Promise<number> {
  return clearCacheDir(getFileContentCacheDir());
}

/**
 * 获取文件内容缓存大小
 */
export async function getFileContentCacheSize(): Promise<number> {
  return getCacheDirSize(getFileContentCacheDir());
}

/**
 * 从单个源获取文件内容
 * 导出用于测试
 */
export async function fetchFileContentFromSource(
  baseUrl: string,
  packageName: string,
  version: string,
  filePath: string,
  isNpmMirror: boolean = false
): Promise<string> {
  // npmmirror 使用不同的 URL 格式：/package/version/files/path
  // unpkg 使用格式：/package@version/path
  const url = isNpmMirror
    ? `${baseUrl}/${packageName}/${version}/files/${filePath}`
    : `${baseUrl}/${packageName}@${version}/${filePath}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'text/plain, application/json, */*',
    },
  });

  if (!response.ok) {
    throw new Error(`获取文件失败: ${response.status} ${response.statusText}`);
  }

  const content = await response.text();
  
  // 检查是否是 HTML 错误页面
  if (content.trim().startsWith('<!DOCTYPE html>') || content.includes('npmmirror 镜像站')) {
    throw new Error('返回了 HTML 错误页面');
  }

  return content;
}

/**
 * 从 unpkg 或 npmmirror 获取具体文件内容
 * 同时向两个数据源发送请求，使用第一个成功返回的结果
 * 支持文件缓存：相同的 packageName、version、filePath 会使用缓存
 * 
 * 注意：如果 version 是 "latest" 等标签，会先解析为实际版本号再缓存
 * 这样当远端版本更新时，缓存会自动失效
 */
export async function fetchFileContent(
  packageName: string,
  version: string,
  filePath: string
): Promise<string> {
  // 解析版本号（将 "latest" 等标签解析为实际版本号）
  const resolvedVersion = await resolveVersion(packageName, version);
  
  // 使用解析后的版本号作为缓存 key
  const cacheKey = getCacheKey(packageName, resolvedVersion, filePath);
  const cacheDir = getFileContentCacheDir();
  const cachedContent = await readCache(cacheDir, cacheKey);
  
  if (cachedContent) {
    return cachedContent;
  }

  // 同时向两个源发送请求（使用解析后的版本号）
  const unpkgPromise = fetchFileContentFromSource(UNPKG_BASE_URL, packageName, resolvedVersion, filePath, false);
  const npmmirrorPromise = fetchFileContentFromSource(NPMMIRROR_BASE_URL, packageName, resolvedVersion, filePath, true);

  // 使用 Promise.race 获取第一个成功的结果
  // 将错误转换为永远不会 resolve 的 promise，这样另一个请求有机会成功
  const unpkgWithFallback = unpkgPromise.catch(() => new Promise<never>(() => {}));
  const npmmirrorWithFallback = npmmirrorPromise.catch(() => new Promise<never>(() => {}));

  // 同时等待两个请求，使用 race 获取第一个成功的结果
  const raceResult = await Promise.race([unpkgWithFallback, npmmirrorWithFallback]).catch(
    () => null
  );

  if (raceResult) {
    // 写入文件缓存
    await writeCache(cacheDir, cacheKey, raceResult);
    return raceResult;
  }

  // 如果 race 没有结果（两个都失败），等待所有请求完成以获取错误信息
  const results = await Promise.allSettled([unpkgPromise, npmmirrorPromise]);
  
  // 收集所有错误
  const errors: Error[] = [];
  for (const result of results) {
    if (result.status === 'rejected') {
      errors.push(result.reason instanceof Error ? result.reason : new Error(String(result.reason)));
    }
  }

  throw new Error(`所有数据源都失败了: ${errors.map((e) => e.message).join('; ')}`);
}
