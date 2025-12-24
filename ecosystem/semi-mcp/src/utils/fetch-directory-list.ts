/**
 * 从 unpkg 或 npmmirror 获取目录列表
 * 同时向两个数据源发送请求，使用第一个成功返回的结果
 */

export const UNPKG_BASE_URL = 'https://unpkg.com';
export const NPMMIRROR_BASE_URL = 'https://registry.npmmirror.com';

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
  // npmmirror 使用不同的 URL 格式：/package/version/files/path/?meta
  // unpkg 使用格式：/package@version/path/?meta
  const url = isNpmMirror
    ? `${baseUrl}/${packageName}/${version}/files/${path}/?meta`
    : `${baseUrl}/${packageName}@${version}/${path}/?meta`;

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
  
  // npmmirror 返回格式：{ path: "/content", type: "directory", files: [...] }
  // 可能是嵌套结构，需要递归扁平化
  if (data && typeof data === 'object' && 'files' in data) {
    // 检查是否是嵌套结构（有 files 数组）
    if (Array.isArray(data.files)) {
      // 如果 files 数组中的项还有嵌套的 files，需要递归扁平化
      const flattened: Array<{ path: string; type?: string; size?: number }> = [];
      for (const item of data.files) {
        flattenDirectoryStructure(item, flattened);
      }
      return flattened.map(normalizeType);
    }
    // 如果没有 files 数组，返回空数组
    return [];
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
 * 同时向两个数据源发送请求，使用第一个成功返回的结果
 */
export async function fetchDirectoryList(
  packageName: string,
  version: string,
  path: string
): Promise<Array<{ path: string; type: string }>> {
  // 同时向两个源发送请求
  const unpkgPromise = fetchDirectoryListFromSource(UNPKG_BASE_URL, packageName, version, path, false);
  const npmmirrorPromise = fetchDirectoryListFromSource(NPMMIRROR_BASE_URL, packageName, version, path, true);

  // 使用 Promise.race 获取第一个成功的结果
  // 将错误转换为永远不会 resolve 的 promise，这样另一个请求有机会成功
  const unpkgWithFallback = unpkgPromise.catch(() => new Promise<never>(() => {}));
  const npmmirrorWithFallback = npmmirrorPromise.catch(() => new Promise<never>(() => {}));

  // 同时等待两个请求，使用 race 获取第一个成功的结果
  const raceResult = await Promise.race([unpkgWithFallback, npmmirrorWithFallback]).catch(
    () => null
  );

  if (raceResult) {
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

