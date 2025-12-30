/**
 * 文件缓存模块
 * 将缓存存储到用户家目录的 .semi-mcp/cache 文件夹中
 * 支持 Windows、macOS、Linux
 */

import { homedir } from 'os';
import { join } from 'path';
import { mkdir, readFile, writeFile, readdir, unlink, stat } from 'fs/promises';
import { existsSync } from 'fs';

/**
 * 获取缓存根目录
 * Windows: C:\Users\username\.semi-mcp\cache
 * macOS: /Users/username/.semi-mcp/cache
 * Linux: /home/username/.semi-mcp/cache
 */
export function getCacheDir(): string {
  return join(homedir(), '.semi-mcp', 'cache');
}

/**
 * 获取目录列表缓存目录
 */
export function getDirectoryListCacheDir(): string {
  return join(getCacheDir(), 'directory-list');
}

/**
 * 获取文件内容缓存目录
 */
export function getFileContentCacheDir(): string {
  return join(getCacheDir(), 'file-content');
}

/**
 * 将缓存 key 转换为安全的文件名
 * 替换特殊字符，避免文件系统问题
 */
export function keyToFileName(key: string): string {
  return key
    .replace(/@/g, '_at_')
    .replace(/\//g, '_')
    .replace(/\\/g, '_')
    .replace(/:/g, '_')
    .replace(/\*/g, '_')
    .replace(/\?/g, '_')
    .replace(/"/g, '_')
    .replace(/</g, '_')
    .replace(/>/g, '_')
    .replace(/\|/g, '_');
}

/**
 * 确保目录存在
 */
async function ensureDir(dir: string): Promise<void> {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * 读取缓存
 * @param cacheDir 缓存目录
 * @param key 缓存 key
 * @returns 缓存内容，如果不存在返回 null
 */
export async function readCache(cacheDir: string, key: string): Promise<string | null> {
  try {
    const fileName = keyToFileName(key);
    const filePath = join(cacheDir, fileName);
    
    if (!existsSync(filePath)) {
      return null;
    }
    
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch {
    return null;
  }
}

/**
 * 写入缓存
 * @param cacheDir 缓存目录
 * @param key 缓存 key
 * @param content 缓存内容
 */
export async function writeCache(cacheDir: string, key: string, content: string): Promise<void> {
  try {
    await ensureDir(cacheDir);
    const fileName = keyToFileName(key);
    const filePath = join(cacheDir, fileName);
    await writeFile(filePath, content, 'utf-8');
  } catch {
    // 写入缓存失败不影响主流程
  }
}

/**
 * 清除指定目录的所有缓存
 */
export async function clearCacheDir(cacheDir: string): Promise<number> {
  try {
    if (!existsSync(cacheDir)) {
      return 0;
    }
    
    const files = await readdir(cacheDir);
    let count = 0;
    
    for (const file of files) {
      try {
        await unlink(join(cacheDir, file));
        count++;
      } catch {
        // 忽略单个文件删除失败
      }
    }
    
    return count;
  } catch {
    return 0;
  }
}

/**
 * 获取缓存目录中的文件数量
 */
export async function getCacheDirSize(cacheDir: string): Promise<number> {
  try {
    if (!existsSync(cacheDir)) {
      return 0;
    }
    
    const files = await readdir(cacheDir);
    return files.length;
  } catch {
    return 0;
  }
}

/**
 * 获取缓存统计信息
 */
export async function getCacheStats(): Promise<{
  cacheDir: string;
  directoryListCount: number;
  fileContentCount: number;
  totalCount: number;
}> {
  const cacheDir = getCacheDir();
  const directoryListCount = await getCacheDirSize(getDirectoryListCacheDir());
  const fileContentCount = await getCacheDirSize(getFileContentCacheDir());
  
  return {
    cacheDir,
    directoryListCount,
    fileContentCount,
    totalCount: directoryListCount + fileContentCount,
  };
}

/**
 * 清除所有缓存
 */
export async function clearAllCache(): Promise<{
  directoryListCleared: number;
  fileContentCleared: number;
  totalCleared: number;
}> {
  const directoryListCleared = await clearCacheDir(getDirectoryListCacheDir());
  const fileContentCleared = await clearCacheDir(getFileContentCacheDir());
  
  return {
    directoryListCleared,
    fileContentCleared,
    totalCleared: directoryListCleared + fileContentCleared,
  };
}

