import { expect, test } from '@rstest/core';
import { handleGetSemiDocument } from '../src/tools/get-semi-document.js';

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

