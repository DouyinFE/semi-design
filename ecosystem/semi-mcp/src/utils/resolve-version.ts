/**
 * 版本号解析模块
 * 将 "latest" 等标签解析为实际版本号
 * 
 * 缓存策略：
 * - 每天只在第一次调用时查询 npm registry
 * - 当天后续调用使用缓存版本号
 * - 版本号不设过期时间（只有日期变化才重新查询）
 */

import {
  readCache,
  writeCache,
  getCacheDir,
} from './file-cache.js';
import { join } from 'path';
import { lt } from 'semver';

/**
 * 最低支持版本号
 * 低于此版本的请求会自动 fallback 到 latest
 */
const MIN_SUPPORTED_VERSION = '2.90.2';

/**
 * 版本缓存数据结构
 */
interface VersionCacheData {
  version: string;
  date: string; // 缓存日期，格式：YYYY-MM-DD
}

/**
 * 获取版本缓存目录
 */
function getVersionCacheDir(): string {
  return join(getCacheDir(), 'version');
}

/**
 * 生成版本缓存 key
 * 格式：packageName@tag (如 @douyinfe/semi-ui@latest)
 */
function getVersionCacheKey(packageName: string, tag: string): string {
  return `${packageName}@${tag}`;
}

/**
 * 获取当前日期字符串
 * 格式：YYYY-MM-DD
 */
function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
 * 
 * @param packageName 包名
 * @param version 版本号或标签（如 "latest"、"next"、具体版本号）
 * @returns 实际版本号
 * 
 * 工作原理：
 * 1. 如果是具体版本号（如 2.89.2），直接返回
 * 2. 如果是标签（如 latest）：
 *    - 检查缓存：如果缓存日期等于今天，直接返回缓存版本
 *    - 缓存无效：从 npm registry 获取版本，并缓存（带今天日期）
 */
export async function resolveVersion(packageName: string, version: string): Promise<string> {
  // 如果是具体版本号（包含数字和点），检查是否低于最低支持版本
  // 例如：2.89.2、2.89.2-alpha.3、1.0.0-beta.1
  if (/^\d+\.\d+\.\d+/.test(version)) {
    // 如果版本号低于最低支持版本，自动 fallback 到 latest
    if (lt(version, MIN_SUPPORTED_VERSION)) {
      version = 'latest';
    } else {
      return version;
    }
  }

  // 是标签（如 latest、next、beta 等）或需要 fallback 到 latest，需要解析
  const cacheDir = getVersionCacheDir();
  const cacheKey = getVersionCacheKey(packageName, version);
  const today = getCurrentDate();

  // 检查缓存
  const cachedContent = await readCache(cacheDir, cacheKey);
  if (cachedContent) {
    try {
      const cached = JSON.parse(cachedContent) as VersionCacheData;
      
      // 如果缓存日期等于今天，直接使用缓存版本
      if (cached.date === today) {
        return cached.version;
      }
    } catch {
      // 缓存解析失败，忽略缓存
    }
  }

  // 缓存无效或过期，从 registry 获取实际版本号
  const resolvedVersion = await fetchVersionFromRegistry(packageName, version);

  // 写入缓存（带今天日期）
  const cacheData: VersionCacheData = {
    version: resolvedVersion,
    date: today,
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
