import { expect, test } from '@rstest/core';
import { handleSemiComponentInfo } from '../src/tools/semi-component-info.js';

test('semi_component_info: 正常获取 Button 组件信息', async () => {
  const result = await handleSemiComponentInfo({
    componentName: 'Button',
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.content.length).toBeGreaterThan(0);
  expect(result.content[0].type).toBe('text');
  expect(result.content[0].text).toContain('Button');
});

test('semi_component_info: 正常获取 Input 组件信息', async () => {
  const result = await handleSemiComponentInfo({
    componentName: 'Input',
  });

  expect(result).toBeDefined();
  expect(result.content).toBeDefined();
  expect(result.content.length).toBeGreaterThan(0);
  expect(result.content[0].type).toBe('text');
  expect(result.content[0].text).toContain('Input');
});

test('semi_component_info: 缺少 componentName 参数应该抛出错误', async () => {
  await expect(handleSemiComponentInfo({})).rejects.toThrow('组件名称是必需的');
});

test('semi_component_info: 空字符串 componentName 应该抛出错误', async () => {
  await expect(
    handleSemiComponentInfo({
      componentName: '',
    })
  ).rejects.toThrow('组件名称是必需的');
});

