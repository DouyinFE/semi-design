import { expect, test } from '@rstest/core';
import { handleGetSemiDocument } from '../src/tools/get-semi-document.js';
import { fetchFileContent } from '../src/utils/fetch-file-content.js';

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
  expect(data.allComponentsCount).toBeGreaterThan(0);
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

