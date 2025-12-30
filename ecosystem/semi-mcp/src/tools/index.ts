import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getSemiDocumentTool, handleGetSemiDocument } from './get-semi-document.js';
import { getSemiCodeBlockTool, handleGetSemiCodeBlock } from './get-semi-code-block.js';
import { getComponentFileListTool, handleGetComponentFileList } from './get-component-file-list.js';
import { getFileCodeTool, handleGetFileCode } from './get-file-code.js';
import { getFunctionCodeTool, handleGetFunctionCode } from './get-function-code.js';

/**
 * 所有工具的定义
 */
export const tools: Tool[] = [
  getSemiDocumentTool,
  getSemiCodeBlockTool,
  getComponentFileListTool,
  getFileCodeTool,
  getFunctionCodeTool,
];

/**
 * 工具名称到处理器的映射
 */
export const toolHandlers: Record<
  string,
  (args: Record<string, unknown>) => Promise<CallToolResult>
> = {
  [getSemiDocumentTool.name]: handleGetSemiDocument,
  [getSemiCodeBlockTool.name]: handleGetSemiCodeBlock,
  [getComponentFileListTool.name]: handleGetComponentFileList,
  [getFileCodeTool.name]: handleGetFileCode,
  [getFunctionCodeTool.name]: handleGetFunctionCode,
};
