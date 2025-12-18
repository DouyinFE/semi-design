/**
 * 将 semi-ui 源码中的 React 18 代码切换为 React 19 代码
 * 
 * 源码中使用特殊注释标记：
 * - REACT_18_START ... REACT_18_END 包裹 React 18 代码
 * - REACT_19_START ... REACT_19_END 包裹 React 19 代码（默认被注释）
 */
module.exports = function semiReact19Loader(source) {
    // 删除 REACT_18 代码块（包括标记）
    let result = source.replace(
        /\/\*\s*REACT_18_START\s*\*\/[\s\S]*?\/\*\s*REACT_18_END\s*\*\//g,
        ''
    );
    
    // 取消注释 REACT_19 代码块
    result = result.replace(
        /\/\*\s*REACT_19_START\s*\*\/([\s\S]*?)\/\*\s*REACT_19_END\s*\*\//g,
        (match, code) => {
            // 移除每行开头的 // 注释
            return code.replace(/^\s*\/\/\s?/gm, '');
        }
    );
    
    return result;
};
