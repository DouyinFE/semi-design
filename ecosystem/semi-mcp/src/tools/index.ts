import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { semiComponentInfoTool, handleSemiComponentInfo } from './semi-component-info.js';

/**
 * 所有工具的定义
 */
export const tools: Tool[] = [semiComponentInfoTool];

/**
 * 工具名称到处理器的映射
 */
export const toolHandlers: Record<
  string,
  (args: Record<string, unknown>) => Promise<CallToolResult>
> = {
  [semiComponentInfoTool.name]: handleSemiComponentInfo,
};

