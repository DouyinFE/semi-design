/**
 * 获取组件文件列表工具
 * 返回组件在 semi-foundation 和 semi-ui 中的所有文件路径
 */

import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { fetchDirectoryList } from '../utils/fetch-directory-list.js';

const FOUNDATION_PACKAGE = '@douyinfe/semi-foundation';
const UI_PACKAGE = '@douyinfe/semi-ui';

/**
 * 需要排除的目录
 */
const EXCLUDE_DIRS = [
  '/lib/',
  '/es/',
  '/dist/',
  '/cjs/',
  '/__test__/',
  '/__tests__/',
  '/_story/',
  '/_stories/',
  '/node_modules/',
];

/**
 * 检查路径是否应该被排除
 */
function shouldExcludePath(filePath: string): boolean {
  for (const excludeDir of EXCLUDE_DIRS) {
    if (filePath.includes(excludeDir)) {
      return true;
    }
  }
  return false;
}

/**
 * 在目录列表中查找匹配的组件文件夹（大小写不敏感）
 */
function findComponentDirectory(
  directories: Array<{ path: string; type: string }>,
  componentName: string
): string | null {
  const normalizedName = componentName.toLowerCase();

  for (const dir of directories) {
    if (dir.type !== 'directory') continue;

    const dirPath = dir.path.replace(/^\//, '').replace(/\/$/, '');
    const dirName = dirPath.split('/').pop() || '';

    if (dirName.toLowerCase() === normalizedName) {
      return dirPath;
    }
  }

  return null;
}

/**
 * 获取组件在指定包中的所有文件路径
 */
async function getPackageComponentFiles(
  packageName: string,
  componentName: string,
  version: string
): Promise<string[]> {
  try {
    const rootFiles = await fetchDirectoryList(packageName, version, '');
    const componentDir = findComponentDirectory(rootFiles, componentName);

    if (!componentDir) {
      return [];
    }

    const componentDirPrefix = `/${componentDir}/`;
    const files: string[] = [];

    for (const file of rootFiles) {
      if (file.type === 'file' && file.path.startsWith(componentDirPrefix)) {
        if (!shouldExcludePath(file.path)) {
          // 返回完整路径格式：@douyinfe/semi-ui/table/index.tsx
          const relativePath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
          files.push(`${packageName}/${relativePath}`);
        }
      }
    }

    return files;
  } catch (error) {
    console.error(`获取包 ${packageName} 的组件文件列表失败:`, error);
    return [];
  }
}

export const getComponentFileListTool: Tool = {
  name: 'get_component_file_list',
  description: `获取 Semi Design 组件的所有文件路径列表。

返回组件在 @douyinfe/semi-foundation 和 @douyinfe/semi-ui 中的所有文件路径。

路径格式示例：
- @douyinfe/semi-foundation/table/foundation.ts
- @douyinfe/semi-ui/table/index.tsx
- @douyinfe/semi-ui/table/Body/BaseRow.tsx

使用场景：
1. 先调用此工具获取组件文件列表
2. 再使用 get_file_code 获取感兴趣的文件代码
3. 如需查看具体函数实现，使用 get_function_code`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      componentName: {
        type: 'string',
        description: '组件名称，如 Table、DatePicker、Modal 等（大小写不敏感）',
      },
      version: {
        type: 'string',
        description: '版本号，默认为 "2.89.2-alpha.3"。注意：latest 版本可能只有编译后的代码',
      },
    },
    required: ['componentName'],
  },
};

export async function handleGetComponentFileList(
  args: Record<string, unknown>
): Promise<CallToolResult> {
  const componentName = args?.componentName as string | undefined;
  const version = (args?.version as string | undefined) || '2.89.2-alpha.3';

  if (!componentName) {
    return {
      content: [
        {
          type: 'text',
          text: '错误：请提供组件名称 (componentName)',
        },
      ],
      isError: true,
    };
  }

  try {
    const [foundationFiles, uiFiles] = await Promise.all([
      getPackageComponentFiles(FOUNDATION_PACKAGE, componentName, version),
      getPackageComponentFiles(UI_PACKAGE, componentName, version),
    ]);

    if (foundationFiles.length === 0 && uiFiles.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `未找到组件 "${componentName}" 的文件。请检查组件名称是否正确。`,
          },
        ],
        isError: true,
      };
    }

    const allFiles = [...foundationFiles, ...uiFiles];
    
    // 按文件类型分组统计
    const stats = {
      ts: allFiles.filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts')).length,
      tsx: allFiles.filter(f => f.endsWith('.tsx')).length,
      dts: allFiles.filter(f => f.endsWith('.d.ts')).length,
      scss: allFiles.filter(f => f.endsWith('.scss')).length,
      other: allFiles.filter(f => !f.match(/\.(tsx?|d\.ts|scss)$/)).length,
    };

    const output = [
      `组件: ${componentName}`,
      `版本: ${version}`,
      `总文件数: ${allFiles.length}`,
      ``,
      `文件类型统计:`,
      `  .ts:   ${stats.ts}`,
      `  .tsx:  ${stats.tsx}`,
      `  .d.ts: ${stats.dts}`,
      `  .scss: ${stats.scss}`,
      `  其他:  ${stats.other}`,
      ``,
      `===== 文件列表 =====`,
      ``,
      ...allFiles,
      ``,
      `提示: 使用 get_file_code 工具传入上述路径获取文件代码`,
    ];

    return {
      content: [
        {
          type: 'text',
          text: output.join('\n'),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `获取组件文件列表失败: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

