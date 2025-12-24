/**
 * 从 unpkg 或 npmmirror 获取具体文件内容
 * 同时向两个数据源发送请求，使用第一个成功返回的结果
 */

const UNPKG_BASE_URL = 'https://unpkg.com';
const NPMMIRROR_BASE_URL = 'https://registry.npmmirror.com';

/**
 * 从单个源获取文件内容
 */
async function fetchFromSource(
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
 */
export async function fetchFileContent(
  packageName: string,
  version: string,
  filePath: string
): Promise<string> {
  // 同时向两个源发送请求
  const unpkgPromise = fetchFromSource(UNPKG_BASE_URL, packageName, version, filePath, false);
  const npmmirrorPromise = fetchFromSource(NPMMIRROR_BASE_URL, packageName, version, filePath, true);

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

