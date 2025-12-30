import { handleGetComponentFileList } from './src/tools/get-component-file-list.ts';
import { handleGetFileCode } from './src/tools/get-file-code.ts';
import { handleGetFunctionCode } from './src/tools/get-function-code.ts';

const VERSION = '2.89.2-alpha.3';

console.log('='.repeat(80));
console.log('工具 1: get_component_file_list - 获取 Table 组件文件列表');
console.log('='.repeat(80));

const fileListResult = await handleGetComponentFileList({
  componentName: 'table',
  version: VERSION,
});
console.log(fileListResult.content[0].text);

console.log('\n\n');
console.log('='.repeat(80));
console.log('工具 2: get_file_code - 获取 Table 的 foundation.ts 代码');
console.log('='.repeat(80));

const fileCodeResult = await handleGetFileCode({
  filePath: '@douyinfe/semi-foundation/table/foundation.ts',
  version: VERSION,
});
// 只显示前 2000 字符
const fileCodeText = fileCodeResult.content[0].text;
console.log(fileCodeText.slice(0, 2000));
if (fileCodeText.length > 2000) {
  console.log(`\n... (省略 ${fileCodeText.length - 2000} 字符)`);
}

console.log('\n\n');
console.log('='.repeat(80));
console.log('工具 3: get_function_code - 获取 foundation.ts 中的 init 函数');
console.log('='.repeat(80));

const funcCodeResult = await handleGetFunctionCode({
  filePath: '@douyinfe/semi-foundation/table/foundation.ts',
  functionName: 'init',
  version: VERSION,
});
console.log(funcCodeResult.content[0].text);

console.log('\n\n✅ 测试完成！');
