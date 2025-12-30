/**
 * 版本号解析模块
 * 将 "latest" 等标签解析为实际版本号，确保缓存正确失效
 */

import {
  readCache,
  writeCache,
  getCacheDir,
} from './file-cache.js';
import { join } from 'path';

// 版本缓存有效期：5 分钟（毫秒）
const VERSION_CACHE_TTL = 5 * 60 * 1000;

/**
 * 版本缓存数据结构
 */
interface VersionCacheData {
  version: string;
  timestamp: number;
}

/**
 * 获取版本缓存目录
 */
function getVersionCacheDir(): string {
  return join(getCacheDir(), 'version');
}

/**
 * 生成版本缓存 key
 */
function getVersionCacheKey(packageName: string, tag: string): string {
  return `${packageName}@${tag}`;
}

/**
 * 从 npm registry 获取包的实际版本号
 * 优先使用 npmmirror，失败后使用 npmjs
 */
async function fetchVersionFromRegistry(packageName: string, tag: string): Promise<string> {
  const registries = [
    `https://registry.npmmirror.com/${packageName}/${tag}`,
    `https://registry.npmjs.org/${packageName}/${tag}`,
  ];

  let lastError: Error | null = null;

  for (const url of registries) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json() as { version?: string };
      
      if (data && data.version) {
        return data.version;
      }
      
      throw new Error('响应中没有 version 字段');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // 继续尝试下一个 registry
    }
  }

  throw new Error(`无法获取 ${packageName}@${tag} 的版本号: ${lastError?.message}`);
}

/**
 * 解析版本号
 * 如果是标签（如 "latest"），解析为实际版本号
 * 如果已经是具体版本号，直接返回
 * 
 * @param packageName 包名
 * @param version 版本号或标签
 * @returns 实际版本号
 */
export async function resolveVersion(packageName: string, version: string): Promise<string> {
  // 如果是具体版本号（包含数字和点），直接返回
  // 例如：2.89.2、2.89.2-alpha.3、1.0.0-beta.1
  if (/^\d+\.\d+\.\d+/.test(version)) {
    return version;
  }

  // 是标签（如 latest、next、beta 等），需要解析
  const cacheDir = getVersionCacheDir();
  const cacheKey = getVersionCacheKey(packageName, version);

  // 检查缓存
  const cachedContent = await readCache(cacheDir, cacheKey);
  if (cachedContent) {
    try {
      const cached = JSON.parse(cachedContent) as VersionCacheData;
      const now = Date.now();
      
      // 检查缓存是否过期
      if (now - cached.timestamp < VERSION_CACHE_TTL) {
        return cached.version;
      }
    } catch {
      // 缓存解析失败，忽略
    }
  }

  // 从 registry 获取实际版本号
  const resolvedVersion = await fetchVersionFromRegistry(packageName, version);

  // 写入缓存
  const cacheData: VersionCacheData = {
    version: resolvedVersion,
    timestamp: Date.now(),
  };
  await writeCache(cacheDir, cacheKey, JSON.stringify(cacheData));

  return resolvedVersion;
}

/**
 * 批量解析版本号（用于同时查询多个包）
 */
export async function resolveVersions(
  packages: Array<{ packageName: string; version: string }>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  await Promise.all(
    packages.map(async ({ packageName, version }) => {
      const resolved = await resolveVersion(packageName, version);
      results.set(`${packageName}@${version}`, resolved);
    })
  );

  return results;
}

