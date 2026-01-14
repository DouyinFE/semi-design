/**
 * 移除函数体和提取函数的工具函数
 * 使用 oxc-parser 进行 AST 解析
 */

import { parseSync } from 'oxc-parser';

/**
 * 函数信息
 */
export interface FunctionInfo {
  /** 函数名 */
  name: string;
  /** 函数体开始位置 */
  bodyStart: number;
  /** 函数体结束位置 */
  bodyEnd: number;
  /** 完整函数代码 */
  fullCode: string;
  /** 函数起始位置 */
  start: number;
  /** 函数结束位置 */
  end: number;
}

/**
 * AST 节点类型定义
 */
interface ASTNode {
  type: string;
  start: number;
  end: number;
  body?: ASTNode | ASTNode[];
  id?: { name: string; start: number; end: number };
  key?: { name: string; start: number; end: number };
  name?: string;
  kind?: string;
  declarations?: ASTNode[];
  init?: ASTNode;
  value?: ASTNode;
  expression?: ASTNode;
  left?: ASTNode;
  right?: ASTNode;
  properties?: ASTNode[];
  elements?: ASTNode[];
  [key: string]: unknown;
}

/**
 * 递归遍历 AST 节点
 */
function traverse(node: ASTNode | ASTNode[] | null | undefined, callback: (node: ASTNode) => void): void {
  if (!node) return;
  
  if (Array.isArray(node)) {
    for (const child of node) {
      traverse(child, callback);
    }
    return;
  }
  
  callback(node);
  
  // 遍历所有可能包含子节点的属性
  const childKeys = [
    'body', 'declarations', 'init', 'expression', 'left', 'right',
    'properties', 'elements', 'argument', 'arguments', 'params',
    'consequent', 'alternate', 'test', 'object', 'property',
    'callee', 'value', 'key', 'computed', 'members', 'cases',
    'discriminant', 'handler', 'block', 'finalizer', 'param',
    'declaration', 'specifiers', 'source', 'exported', 'local',
    'imported', 'superClass', 'decorators', 'typeAnnotation',
    'returnType', 'typeParameters', 'implements', 'extends',
  ];
  
  for (const key of childKeys) {
    const child = node[key];
    if (child && typeof child === 'object') {
      traverse(child as ASTNode | ASTNode[], callback);
    }
  }
}

/**
 * 从 AST 中提取所有函数信息
 */
function extractFunctionsFromAST(ast: ASTNode, code: string): FunctionInfo[] {
  const functions: FunctionInfo[] = [];
  
  traverse(ast, (node) => {
    let funcName: string | undefined;
    let bodyStart: number | undefined;
    let bodyEnd: number | undefined;
    let funcStart: number | undefined;
    let funcEnd: number | undefined;
    
    // 处理不同类型的函数节点
    switch (node.type) {
      // 函数声明: function name() {}
      case 'FunctionDeclaration': {
        if (node.id?.name && node.body && typeof node.body === 'object' && !Array.isArray(node.body)) {
          funcName = node.id.name;
          bodyStart = node.body.start;
          bodyEnd = node.body.end;
          funcStart = node.start;
          funcEnd = node.end;
        }
        break;
      }
      
      // 函数表达式: const name = function() {}
      case 'FunctionExpression': {
        // 函数表达式本身可能有名字，也可能没有
        // 我们需要从父节点获取名字（如 VariableDeclarator）
        if (node.body && typeof node.body === 'object' && !Array.isArray(node.body)) {
          funcName = node.id?.name;
          bodyStart = node.body.start;
          bodyEnd = node.body.end;
          funcStart = node.start;
          funcEnd = node.end;
        }
        break;
      }
      
      // 箭头函数: const name = () => {}
      case 'ArrowFunctionExpression': {
        if (node.body && typeof node.body === 'object' && !Array.isArray(node.body) && node.body.type === 'BlockStatement') {
          bodyStart = node.body.start;
          bodyEnd = node.body.end;
          funcStart = node.start;
          funcEnd = node.end;
        }
        break;
      }
      
      // 类方法: class A { method() {} }
      case 'MethodDefinition': {
        if (node.key && node.value && typeof node.value === 'object') {
          const keyNode = node.key as ASTNode;
          funcName = keyNode.name || (keyNode as unknown as { value: string }).value;
          const valueNode = node.value as ASTNode;
          if (valueNode.body && typeof valueNode.body === 'object' && !Array.isArray(valueNode.body)) {
            bodyStart = valueNode.body.start;
            bodyEnd = valueNode.body.end;
            funcStart = node.start;
            funcEnd = node.end;
          }
        }
        break;
      }
      
      // 类属性（箭头函数）: class A { method = () => {} }
      case 'PropertyDefinition': {
        if (node.key && node.value && typeof node.value === 'object') {
          const keyNode = node.key as ASTNode;
          const valueNode = node.value as ASTNode;
          if (valueNode.type === 'ArrowFunctionExpression' || valueNode.type === 'FunctionExpression') {
            funcName = keyNode.name || (keyNode as unknown as { value: string }).value;
            if (valueNode.body && typeof valueNode.body === 'object' && !Array.isArray(valueNode.body) && valueNode.body.type === 'BlockStatement') {
              bodyStart = valueNode.body.start;
              bodyEnd = valueNode.body.end;
              funcStart = node.start;
              funcEnd = node.end;
            }
          }
        }
        break;
      }
      
      // 对象方法: { method() {} }
      case 'Property': {
        if (node.key && node.value && typeof node.value === 'object') {
          const keyNode = node.key as ASTNode;
          const valueNode = node.value as ASTNode;
          if (valueNode.type === 'FunctionExpression' || valueNode.type === 'ArrowFunctionExpression') {
            funcName = keyNode.name || (keyNode as unknown as { value: string }).value;
            if (valueNode.body && typeof valueNode.body === 'object' && !Array.isArray(valueNode.body) && valueNode.body.type === 'BlockStatement') {
              bodyStart = valueNode.body.start;
              bodyEnd = valueNode.body.end;
              funcStart = node.start;
              funcEnd = node.end;
            }
          }
        }
        break;
      }
    }
    
    // 如果找到了有效的函数信息，添加到列表
    if (bodyStart !== undefined && bodyEnd !== undefined && funcStart !== undefined && funcEnd !== undefined) {
      functions.push({
        name: funcName || '<anonymous>',
        bodyStart,
        bodyEnd,
        fullCode: code.slice(funcStart, funcEnd),
        start: funcStart,
        end: funcEnd,
      });
    }
  });
  
  // 按位置排序
  functions.sort((a, b) => a.start - b.start);
  
  return functions;
}

/**
 * 处理变量声明中的函数赋值，提取函数名
 */
function extractVariableDeclarationFunctions(ast: ASTNode, code: string, existingFunctions: FunctionInfo[]): void {
  const existingStarts = new Set(existingFunctions.map(f => f.bodyStart));
  
  traverse(ast, (node) => {
    if (node.type === 'VariableDeclaration' && node.declarations) {
      for (const decl of node.declarations as ASTNode[]) {
        if (decl.type === 'VariableDeclarator' && decl.id && decl.init) {
          const idNode = decl.id as ASTNode;
          const initNode = decl.init as ASTNode;
          
          if ((initNode.type === 'ArrowFunctionExpression' || initNode.type === 'FunctionExpression') &&
              initNode.body && typeof initNode.body === 'object' && !Array.isArray(initNode.body) &&
              initNode.body.type === 'BlockStatement') {
            
            const bodyStart = initNode.body.start;
            
            // 更新已存在的匿名函数的名字
            for (const func of existingFunctions) {
              if (func.bodyStart === bodyStart && func.name === '<anonymous>') {
                func.name = idNode.name || '<anonymous>';
                break;
              }
            }
            
            // 如果这个函数还没有被添加，添加它
            if (!existingStarts.has(bodyStart)) {
              existingFunctions.push({
                name: idNode.name || '<anonymous>',
                bodyStart,
                bodyEnd: initNode.body.end,
                fullCode: code.slice(node.start, node.end),
                start: node.start,
                end: node.end,
              });
            }
          }
        }
      }
    }
  });
}

/**
 * 解析代码并获取所有函数
 */
export function findAllFunctions(code: string, filename: string = 'code.tsx'): FunctionInfo[] {
  try {
    const result = parseSync(filename, code);
    
    if (result.errors && result.errors.length > 0) {
      // 解析有错误，但可能仍然有部分 AST
      console.warn('解析代码时有错误:', result.errors);
    }
    
    const ast = result.program as unknown as ASTNode;
    const functions = extractFunctionsFromAST(ast, code);
    
    // 处理变量声明中的函数
    extractVariableDeclarationFunctions(ast, code, functions);
    
    // 重新排序
    functions.sort((a, b) => a.start - b.start);
    
    return functions;
  } catch (error) {
    console.error('解析代码失败:', error);
    return [];
  }
}

/**
 * 将代码中所有函数体替换为 { ... }
 * @param code 源代码
 * @param filename 文件名（用于确定解析模式，如 .ts, .tsx）
 * @returns 替换后的代码
 */
export function removeFunctionBodies(code: string, filename: string = 'code.tsx'): string {
  const functions = findAllFunctions(code, filename);
  
  if (functions.length === 0) {
    return code;
  }
  
  // 过滤掉嵌套的函数，只处理非嵌套的函数体
  // 从最深层开始替换，避免位置偏移问题
  const sortedByBodyStart = [...functions].sort((a, b) => b.bodyStart - a.bodyStart);
  
  let result = code;
  const replacedRanges: Array<{ start: number; end: number }> = [];
  
  for (const func of sortedByBodyStart) {
    // 检查这个函数体是否已经被包含在另一个已替换的范围内
    const isNested = replacedRanges.some(
      range => func.bodyStart >= range.start && func.bodyEnd <= range.end
    );
    
    if (isNested) {
      continue;
    }
    
    // 替换函数体
    const before = result.slice(0, func.bodyStart);
    const after = result.slice(func.bodyEnd);
    result = before + '{ ... }' + after;
    
    replacedRanges.push({ start: func.bodyStart, end: func.bodyEnd });
  }
  
  return result;
}

/**
 * 从代码中提取指定名称的函数
 * @param code 源代码
 * @param functionName 函数名
 * @param filename 文件名
 * @returns 函数的完整代码，如果未找到返回 null
 */
export function extractFunction(code: string, functionName: string, filename: string = 'code.tsx'): string | null {
  const functions = findAllFunctions(code, filename);
  
  const targetFunction = functions.find(f => f.name === functionName);
  
  if (!targetFunction) {
    return null;
  }
  
  return targetFunction.fullCode;
}

/**
 * 获取代码中所有函数的名称列表
 * @param code 源代码
 * @param filename 文件名
 * @returns 函数名列表（去重）
 */
export function getFunctionNames(code: string, filename: string = 'code.tsx'): string[] {
  const functions = findAllFunctions(code, filename);
  const names = functions.map(f => f.name).filter(name => name !== '<anonymous>');
  return Array.from(new Set(names));
}
