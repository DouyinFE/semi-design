import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getSemiDocumentTool, handleGetSemiDocument } from './get-semi-document.js';

/**
 * 所有工具的定义
 */
export const tools: Tool[] = [getSemiDocumentTool];

/**
 * 工具名称到处理器的映射
 */
export const toolHandlers: Record<
  string,
  (args: Record<string, unknown>) => Promise<CallToolResult>
> = {
  [getSemiDocumentTool.name]: handleGetSemiDocument,
};

