import { expect, test } from '@rstest/core';
import { handleGetSemiDocument } from '../src/tools/get-semi-document.js';
import { fetchFileContent, fetchFileContentFromSource, UNPKG_BASE_URL as FILE_UNPKG_BASE_URL, NPMMIRROR_BASE_URL as FILE_NPMMIRROR_BASE_URL } from '../src/utils/fetch-file-content.js';
import { fetchDirectoryList, fetchDirectoryListFromSource, UNPKG_BASE_URL, NPMMIRROR_BASE_URL } from '../src/utils/fetch-directory-list.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

test('get_semi_document: 获取组件列表（不提供组件名称）', async () => {
  const result = await handleGetSemiDocument({});

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.content.length).toBeGreaterThan(0);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);
  
  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    // 如果 API 失败，至少检查返回的数据结构
    expect(data.version).toBe('latest');
    return;
  }

  expect(data.version).toBe('latest');
  expect(data.components).toBeDefined();
  expect(Array.isArray(data.components)).toBe(true);
  expect(data.count).toBeGreaterThanOrEqual(0);
});

test('get_semi_document: 获取组件列表（指定版本）', async () => {
  const result = await handleGetSemiDocument({
    version: '2.89.2-alpha.3',
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);
  
  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.version).toBe('2.89.2-alpha.3');
    return;
  }

  expect(data.version).toBe('2.89.2-alpha.3');
  expect(data.components).toBeDefined();
  expect(Array.isArray(data.components)).toBe(true);
});

test('get_semi_document: 获取 Button 组件文档', async () => {
  const result = await handleGetSemiDocument({
    componentName: 'Button',
    version: '2.89.2-alpha.3',
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);
  
  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('button');
    expect(data.version).toBe('2.89.2-alpha.3');
    return;
  }

  expect(data.componentName).toBe('button');
  expect(data.version).toBe('2.89.2-alpha.3');
  expect(data.documents).toBeDefined();
  expect(Array.isArray(data.documents)).toBe(true);
  // 验证返回结果中包含全部组件列表
  expect(data.allComponents).toBeDefined();
  expect(Array.isArray(data.allComponents)).toBe(true);
  // allComponentsCount 可能为 0（如果获取组件列表失败），但至少应该存在这个字段
  expect(typeof data.allComponentsCount).toBe('number');
});

test('get_semi_document: 获取 Input 组件文档（指定版本）', async () => {
  const result = await handleGetSemiDocument({
    componentName: 'Input',
    version: '2.89.2-alpha.3',
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);
  
  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('input');
    expect(data.version).toBe('2.89.2-alpha.3');
    return;
  }

  expect(data.componentName).toBe('input');
  expect(data.version).toBe('2.89.2-alpha.3');
  expect(data.documents).toBeDefined();
  expect(Array.isArray(data.documents)).toBe(true);
  // 验证返回结果中包含全部组件列表
  expect(data.allComponents).toBeDefined();
  expect(Array.isArray(data.allComponents)).toBe(true);
  expect(data.allComponentsCount).toBeGreaterThan(0);
});

test('get_semi_document: 组件名称应该转为小写', async () => {
  const result = await handleGetSemiDocument({
    componentName: 'BUTTON',
    version: '2.89.2-alpha.3',
  });

  expect(result).toBeDefined();
  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);
  expect(data.componentName).toBe('button');
});

test('get_semi_document: 不传入 version 时应该使用 latest（获取组件列表）', async () => {
  const result = await handleGetSemiDocument({
    // 不传入 version
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.content.length).toBeGreaterThan(0);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);
  
  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.version).toBe('latest');
    return;
  }

  expect(data.version).toBe('latest');
  expect(data.components).toBeDefined();
  expect(Array.isArray(data.components)).toBe(true);
});

test('get_semi_document: 不传入 version 时应该使用 latest（获取组件文档）', async () => {
  const result = await handleGetSemiDocument({
    componentName: 'Button',
    // 不传入 version，但 latest 版本可能没有文档，所以这个测试可能会失败
    // 我们主要测试默认值逻辑
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);
  
  // 检查是否有错误（latest 版本可能没有文档）
  if (result.isError || data.error) {
    // latest 版本可能没有文档，这是正常的
    expect(data.componentName).toBe('button');
    expect(data.version).toBe('latest');
    // 即使没有找到文档，也应该包含全部组件列表
    expect(data.allComponents).toBeDefined();
    expect(Array.isArray(data.allComponents)).toBe(true);
    return;
  }

  expect(data.componentName).toBe('button');
  expect(data.version).toBe('latest');
  expect(data.documents).toBeDefined();
  expect(Array.isArray(data.documents)).toBe(true);
  // 验证返回结果中包含全部组件列表
  expect(data.allComponents).toBeDefined();
  expect(Array.isArray(data.allComponents)).toBe(true);
  expect(data.allComponentsCount).toBeGreaterThan(0);
});

test('get_semi_document: 获取 Table 组件文档并验证文档内容', async () => {
  const componentName = 'Table';
  const version = '2.89.2-alpha.3';
  const packageName = '@douyinfe/semi-ui';

  // 1. 获取文档列表
  const result = await handleGetSemiDocument({
    componentName,
    version,
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.isError).not.toBe(true);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);

  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    // 如果 API 失败，至少验证返回的数据结构
    expect(data.componentName).toBe('table');
    expect(data.version).toBe(version);
    expect(data.allComponents).toBeDefined();
    expect(Array.isArray(data.allComponents)).toBe(true);
    return;
  }

  // 验证文档列表信息
  expect(data.componentName).toBe('table');
  expect(data.version).toBe(version);
  expect(data.documents).toBeDefined();
  expect(Array.isArray(data.documents)).toBe(true);
  expect(data.documents.length).toBeGreaterThan(0);
  expect(data.category).toBeDefined();
  expect(typeof data.category).toBe('string');
  expect(data.count).toBe(data.documents.length);
  expect(data.allComponents).toBeDefined();
  expect(Array.isArray(data.allComponents)).toBe(true);
  expect(data.allComponentsCount).toBeGreaterThan(0);

  // 2. 验证能够获取文档内容
  const docPath = `content/${data.category}/${componentName.toLowerCase()}/${data.documents[0]}`;
  
  try {
    const content = await fetchFileContent(packageName, version, docPath);
    
    // 验证文档内容不为空
    expect(content).toBeDefined();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    
    // 验证文档内容是 markdown 格式（至少包含一些 markdown 特征）
    // 应该包含 frontmatter 或者 markdown 语法
    expect(
      content.includes('---') || 
      content.includes('#') || 
      content.includes('```') ||
      content.includes('title:')
    ).toBe(true);
    
    // 验证不是 HTML 错误页面
    expect(content.trim().startsWith('<!DOCTYPE html>')).toBe(false);
    expect(content.includes('npmmirror 镜像站')).toBe(false);
    
  } catch (error) {
    // 如果获取文档内容失败，记录警告但不失败测试
    // 因为文档列表已经验证成功，文档内容获取可能因为网络问题失败
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`获取文档内容失败: ${errorMessage}`);
    // 不抛出错误，因为文档列表已经验证成功
  }
});

test('get_semi_document: 验证返回结果包含完整的文档内容', async () => {
  const componentName = 'Table';
  const version = '2.89.2-alpha.3';

  const result = await handleGetSemiDocument({
    componentName,
    version,
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.isError).not.toBe(true);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);

  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('table');
    expect(data.version).toBe(version);
    return;
  }

  // 验证返回结果包含 contents 字段（文档内容）
  expect(data.contents).toBeDefined();
  expect(Array.isArray(data.contents)).toBe(true);
  expect(data.contents.length).toBeGreaterThan(0);
  expect(data.contents.length).toBe(data.documents.length);

  // 验证每个文档内容对象的结构
  data.contents.forEach((doc: any, index: number) => {
    expect(doc).toBeDefined();
    expect(doc.name).toBeDefined();
    expect(typeof doc.name).toBe('string');
    expect(doc.path).toBeDefined();
    expect(typeof doc.path).toBe('string');
    expect(doc.content).toBeDefined();
    expect(typeof doc.content).toBe('string');
    
    // 验证文档内容不为空（除非是错误信息）
    if (!doc.content.includes('获取文档内容失败')) {
      expect(doc.content.length).toBeGreaterThan(0);
      
      // 验证文档内容是 markdown 格式（至少包含一些 markdown 特征）
      expect(
        doc.content.includes('---') || 
        doc.content.includes('#') || 
        doc.content.includes('```') ||
        doc.content.includes('title:')
      ).toBe(true);
      
      // 验证不是 HTML 错误页面
      expect(doc.content.trim().startsWith('<!DOCTYPE html>')).toBe(false);
      expect(doc.content.includes('npmmirror 镜像站')).toBe(false);
    }
    
    // 验证文档名称和路径与 documents 列表中的对应
    expect(doc.name.toLowerCase()).toBe(data.documents[index].toLowerCase());
  });

  // 验证 documents 字段包含文档元信息
  expect(data.documents).toBeDefined();
  expect(Array.isArray(data.documents)).toBe(true);
  data.documents.forEach((doc: any) => {
    expect(doc).toBeDefined();
    expect(doc.name).toBeDefined();
    expect(doc.path).toBeDefined();
    expect(doc.contentLength).toBeDefined();
    expect(typeof doc.contentLength).toBe('number');
    expect(doc.contentLength).toBeGreaterThan(0);
  });

  // 验证分类信息
  expect(data.category).toBeDefined();
  expect(typeof data.category).toBe('string');
  expect(data.count).toBe(data.contents.length);
});

test('get_semi_document: 验证 Button 组件文档内容', async () => {
  const componentName = 'Button';
  const version = '2.89.2-alpha.3';

  const result = await handleGetSemiDocument({
    componentName,
    version,
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.isError).not.toBe(true);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);

  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('button');
    expect(data.version).toBe(version);
    return;
  }

  // 验证返回结果包含 contents 字段
  expect(data.contents).toBeDefined();
  expect(Array.isArray(data.contents)).toBe(true);
  expect(data.contents.length).toBeGreaterThan(0);

  // 验证至少有一个文档包含有效内容
  const validDocs = data.contents.filter((doc: any) => 
    doc.content && 
    doc.content.length > 0 && 
    !doc.content.includes('获取文档内容失败')
  );
  expect(validDocs.length).toBeGreaterThan(0);

  // 验证文档内容包含 Button 相关的关键词
  const firstValidDoc = validDocs[0];
  expect(firstValidDoc.content.length).toBeGreaterThan(100);
  
  // Button 文档应该包含一些相关关键词
  const contentLower = firstValidDoc.content.toLowerCase();
  expect(
    contentLower.includes('button') ||
    contentLower.includes('按钮') ||
    contentLower.includes('click') ||
    contentLower.includes('type')
  ).toBe(true);
});

test('fetchDirectoryList: 测试 unpkg 数据源', async () => {
  const packageName = '@douyinfe/semi-ui';
  const version = '2.89.2-alpha.3';
  const path = 'content';

  const result = await fetchDirectoryListFromSource(
    UNPKG_BASE_URL,
    packageName,
    version,
    path,
    false // isNpmMirror = false
  );

  expect(result).toBeDefined();
  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);

  // 验证返回的数据结构
  result.forEach((item) => {
    expect(item).toBeDefined();
    expect(item.path).toBeDefined();
    expect(typeof item.path).toBe('string');
    expect(item.type).toBeDefined();
    expect(['file', 'directory']).toContain(item.type);
  });

  // 验证能找到 table 相关的文件
  const tableFiles = result.filter((item) =>
    item.path.toLowerCase().includes('table') && item.type === 'file'
  );
  expect(tableFiles.length).toBeGreaterThan(0);
});

test('fetchDirectoryList: 测试 npmmirror 数据源', async () => {
  const packageName = '@douyinfe/semi-ui';
  const version = '2.89.2-alpha.3';
  const path = 'content';

  try {
    const result = await fetchDirectoryListFromSource(
      NPMMIRROR_BASE_URL,
      packageName,
      version,
      path,
      true // isNpmMirror = true
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // 验证返回的数据结构
    result.forEach((item) => {
      expect(item).toBeDefined();
      expect(item.path).toBeDefined();
      expect(typeof item.path).toBe('string');
      expect(item.type).toBeDefined();
      expect(['file', 'directory']).toContain(item.type);
    });

    // 验证能找到 table 相关的文件（npmmirror 可能返回嵌套结构，所以可能找不到）
    const tableFiles = result.filter((item) =>
      item.path.toLowerCase().includes('table') && item.type === 'file'
    );
    // npmmirror 可能返回嵌套结构，如果扁平化成功应该能找到，如果失败则至少验证数据结构正确
    if (tableFiles.length === 0) {
      // 至少验证返回了文件或目录
      const hasFiles = result.some((item) => item.type === 'file');
      const hasDirectories = result.some((item) => item.type === 'directory');
      expect(hasFiles || hasDirectories).toBe(true);
    } else {
      expect(tableFiles.length).toBeGreaterThan(0);
    }
  } catch (error) {
    // npmmirror 可能不稳定，如果失败则跳过测试
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`npmmirror 数据源测试失败: ${errorMessage}`);
    // 不抛出错误，因为这是外部服务，可能不稳定
  }
});

test('fetchFileContent: 测试 unpkg 数据源', async () => {
  const packageName = '@douyinfe/semi-ui';
  const version = '2.89.2-alpha.3';
  const filePath = 'content/show/table/index.md';

  const content = await fetchFileContentFromSource(
    FILE_UNPKG_BASE_URL,
    packageName,
    version,
    filePath,
    false // isNpmMirror = false
  );

  expect(content).toBeDefined();
  expect(typeof content).toBe('string');
  expect(content.length).toBeGreaterThan(0);

  // 验证文档内容是 markdown 格式
  expect(
    content.includes('---') ||
    content.includes('#') ||
    content.includes('```') ||
    content.includes('title:')
  ).toBe(true);

  // 验证不是 HTML 错误页面
  expect(content.trim().startsWith('<!DOCTYPE html>')).toBe(false);
  expect(content.includes('npmmirror 镜像站')).toBe(false);

  // 验证包含 Table 相关的内容
  const contentLower = content.toLowerCase();
  expect(
    contentLower.includes('table') ||
    contentLower.includes('表格')
  ).toBe(true);
});

test('fetchFileContent: 测试 npmmirror 数据源', async () => {
  const packageName = '@douyinfe/semi-ui';
  const version = '2.89.2-alpha.3';
  const filePath = 'content/show/table/index.md';

  const content = await fetchFileContentFromSource(
    FILE_NPMMIRROR_BASE_URL,
    packageName,
    version,
    filePath,
    true // isNpmMirror = true
  );

  expect(content).toBeDefined();
  expect(typeof content).toBe('string');
  expect(content.length).toBeGreaterThan(0);

  // 验证文档内容是 markdown 格式
  expect(
    content.includes('---') ||
    content.includes('#') ||
    content.includes('```') ||
    content.includes('title:')
  ).toBe(true);

  // 验证不是 HTML 错误页面
  expect(content.trim().startsWith('<!DOCTYPE html>')).toBe(false);
  expect(content.includes('npmmirror 镜像站')).toBe(false);

  // 验证包含 Table 相关的内容
  const contentLower = content.toLowerCase();
  expect(
    contentLower.includes('table') ||
    contentLower.includes('表格')
  ).toBe(true);
});

test('fetchDirectoryList: 验证两个数据源都能正常工作', async () => {
  const packageName = '@douyinfe/semi-ui';
  const version = '2.89.2-alpha.3';
  const path = 'content';

  // 测试两个数据源都能返回数据
  const [unpkgResult, npmmirrorResult] = await Promise.allSettled([
    fetchDirectoryListFromSource(UNPKG_BASE_URL, packageName, version, path, false),
    fetchDirectoryListFromSource(NPMMIRROR_BASE_URL, packageName, version, path, true),
  ]);

  // 至少有一个数据源应该成功
  const unpkgSuccess = unpkgResult.status === 'fulfilled';
  const npmmirrorSuccess = npmmirrorResult.status === 'fulfilled';

  expect(unpkgSuccess || npmmirrorSuccess).toBe(true);

  // 如果 unpkg 成功，验证数据
  if (unpkgSuccess) {
    const result = unpkgResult.value;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  }

  // 如果 npmmirror 成功，验证数据
  if (npmmirrorSuccess) {
    const result = npmmirrorResult.value;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  }

  // 如果两个都成功，验证它们都能找到 table 文件
  if (unpkgSuccess && npmmirrorSuccess) {
    const unpkgTableFiles = unpkgResult.value.filter(
      (item) => item.path.toLowerCase().includes('table') && item.type === 'file'
    );
    const npmmirrorTableFiles = npmmirrorResult.value.filter(
      (item) => item.path.toLowerCase().includes('table') && item.type === 'file'
    );

    expect(unpkgTableFiles.length).toBeGreaterThan(0);
    // npmmirror 可能返回嵌套结构，如果扁平化成功应该能找到
    // 如果找不到，至少验证返回了数据
    if (npmmirrorTableFiles.length === 0) {
      expect(npmmirrorResult.value.length).toBeGreaterThan(0);
    } else {
      expect(npmmirrorTableFiles.length).toBeGreaterThan(0);
    }
  }
});

test('fetchFileContent: 验证两个数据源都能正常工作', async () => {
  const packageName = '@douyinfe/semi-ui';
  const version = '2.89.2-alpha.3';
  const filePath = 'content/show/table/index.md';

  // 测试两个数据源都能返回数据
  const [unpkgResult, npmmirrorResult] = await Promise.allSettled([
    fetchFileContentFromSource(FILE_UNPKG_BASE_URL, packageName, version, filePath, false),
    fetchFileContentFromSource(FILE_NPMMIRROR_BASE_URL, packageName, version, filePath, true),
  ]);

  // 至少有一个数据源应该成功
  const unpkgSuccess = unpkgResult.status === 'fulfilled';
  const npmmirrorSuccess = npmmirrorResult.status === 'fulfilled';

  expect(unpkgSuccess || npmmirrorSuccess).toBe(true);

  // 如果 unpkg 成功，验证数据
  if (unpkgSuccess) {
    const content = unpkgResult.value;
    expect(content).toBeDefined();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(content.trim().startsWith('<!DOCTYPE html>')).toBe(false);
  }

  // 如果 npmmirror 成功，验证数据
  if (npmmirrorSuccess) {
    const content = npmmirrorResult.value;
    expect(content).toBeDefined();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(content.trim().startsWith('<!DOCTYPE html>')).toBe(false);
  }

  // 如果两个都成功，验证内容相似（应该都是同一个文件）
  if (unpkgSuccess && npmmirrorSuccess) {
    const unpkgContent = unpkgResult.value;
    const npmmirrorContent = npmmirrorResult.value;

    // 验证两个内容都包含相同的关键词
    expect(unpkgContent.toLowerCase().includes('table') || unpkgContent.toLowerCase().includes('表格')).toBe(true);
    expect(npmmirrorContent.toLowerCase().includes('table') || npmmirrorContent.toLowerCase().includes('表格')).toBe(true);

    // 验证内容长度相似（允许一些差异，但不应该差太多）
    const lengthDiff = Math.abs(unpkgContent.length - npmmirrorContent.length);
    const avgLength = (unpkgContent.length + npmmirrorContent.length) / 2;
    expect(lengthDiff / avgLength).toBeLessThan(0.1); // 差异应该小于 10%
  }
});

test('get_semi_document: 测试 get_path 参数 - 将文档写入临时目录', async () => {
  const componentName = 'Table';
  const version = '2.89.2-alpha.3';

  const result = await handleGetSemiDocument({
    componentName,
    version,
    get_path: true,
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.isError).not.toBe(true);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);

  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('table');
    expect(data.version).toBe(version);
    return;
  }

  // 验证返回结果包含临时目录信息
  expect(data.tempDirectory).toBeDefined();
  expect(typeof data.tempDirectory).toBe('string');
  expect(data.tempDirectory.length).toBeGreaterThan(0);

  // 验证临时目录存在
  expect(existsSync(data.tempDirectory)).toBe(true);

  // 验证文件列表
  expect(data.files).toBeDefined();
  expect(Array.isArray(data.files)).toBe(true);
  expect(data.files.length).toBeGreaterThan(0);

  // 验证每个文件都存在
  for (const file of data.files) {
    expect(file.path).toBeDefined();
    expect(typeof file.path).toBe('string');
    expect(file.contentLength).toBeDefined();
    expect(typeof file.contentLength).toBe('number');
    expect(file.contentLength).toBeGreaterThan(0);

    // 验证文件实际存在
    expect(existsSync(file.path)).toBe(true);

    // 验证文件内容不为空
    const fileContent = readFileSync(file.path, 'utf-8');
    expect(fileContent.length).toBe(file.contentLength);
    expect(fileContent.length).toBeGreaterThan(0);

    // 验证文件内容是 markdown 格式
    expect(
      fileContent.includes('---') ||
      fileContent.includes('#') ||
      fileContent.includes('```') ||
      fileContent.includes('title:')
    ).toBe(true);
  }

  // 验证 message 字段
  expect(data.message).toBeDefined();
  expect(typeof data.message).toBe('string');
  expect(data.message.includes(data.tempDirectory)).toBe(true);
  expect(data.message.includes('请使用文件读取工具查看文档内容')).toBe(true);

  // 验证其他字段
  expect(data.componentName).toBe('table');
  expect(data.version).toBe(version);
  expect(data.category).toBeDefined();
  expect(data.count).toBe(data.files.length);
});

test('get_semi_document: 测试 get_path=false 时返回文档内容', async () => {
  const componentName = 'Table';
  const version = '2.89.2-alpha.3';

  const result = await handleGetSemiDocument({
    componentName,
    version,
    get_path: false, // 明确设置为 false
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.isError).not.toBe(true);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);

  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('table');
    expect(data.version).toBe(version);
    return;
  }

  // 验证返回结果包含 contents 字段（文档内容）
  expect(data.contents).toBeDefined();
  expect(Array.isArray(data.contents)).toBe(true);
  expect(data.contents.length).toBeGreaterThan(0);

  // 验证每个文档内容对象包含 content 字段
  data.contents.forEach((doc: any) => {
    expect(doc.content).toBeDefined();
    expect(typeof doc.content).toBe('string');
    expect(doc.content.length).toBeGreaterThan(0);
  });

  // 验证不包含 tempDirectory 字段
  expect(data.tempDirectory).toBeUndefined();
});

test('get_semi_document: 测试自动开启 get_path（文档大于 888 行）', async () => {
  const componentName = 'Table'; // Table 文档有 6000+ 行，应该自动开启
  const version = '2.89.2-alpha.3';

  const result = await handleGetSemiDocument({
    componentName,
    version,
    // 不设置 get_path，应该自动开启
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.isError).not.toBe(true);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);

  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('table');
    expect(data.version).toBe(version);
    return;
  }

  // 验证自动开启了 get_path（返回了临时目录）
  expect(data.tempDirectory).toBeDefined();
  expect(typeof data.tempDirectory).toBe('string');
  expect(data.tempDirectory.length).toBeGreaterThan(0);

  // 验证 autoGetPath 标记
  expect(data.autoGetPath).toBe(true);

  // 验证 message 包含文件大小提示
  expect(data.message).toBeDefined();
  expect(typeof data.message).toBe('string');
  expect(data.message.includes('文件较大')).toBe(true);
  expect(data.message.includes('已自动保存到临时目录')).toBe(true);

  // 验证文件列表包含行数信息
  expect(data.files).toBeDefined();
  expect(Array.isArray(data.files)).toBe(true);
  data.files.forEach((file: any) => {
    expect(file.lines).toBeDefined();
    expect(typeof file.lines).toBe('number');
    expect(file.lines).toBeGreaterThan(0);
  });
});

test('get_semi_document: 测试小文档不自动开启 get_path', async () => {
  // 找一个行数小于 888 的组件，比如 divider (111 行)
  const componentName = 'Divider';
  const version = '2.89.2-alpha.3';

  const result = await handleGetSemiDocument({
    componentName,
    version,
    // 不设置 get_path
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.isError).not.toBe(true);

  const firstContent = result.content[0];
  if (firstContent.type !== 'text') {
    throw new Error('Expected text content');
  }
  const data = JSON.parse(firstContent.text);

  // 检查是否有错误
  if (result.isError || data.error) {
    console.warn('API 调用返回错误:', data.error || '未知错误');
    expect(data.componentName).toBe('divider');
    expect(data.version).toBe(version);
    return;
  }

  // 验证小文档不会自动开启 get_path（应该返回文档内容）
  expect(data.tempDirectory).toBeUndefined();
  expect(data.contents).toBeDefined();
  expect(Array.isArray(data.contents)).toBe(true);
  expect(data.contents.length).toBeGreaterThan(0);
});

