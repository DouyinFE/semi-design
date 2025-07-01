#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * React 19 构建脚本
 * 用于将 React 18 兼容的代码转换为 React 19 兼容的代码
 */

const REACT_18_START = /\/\* REACT_18_START \*\/([\s\S]*?)\/\* REACT_18_END \*\//g;
const REACT_19_START = /\/\* REACT_19_START \*\/([\s\S]*?)\/\* REACT_19_END \*\//g;

function processReact19Code(content) {
    // 移除 React 18 的代码块
    content = content.replace(REACT_18_START, '');
    
    // 启用 React 19 的代码块（移除注释标记和注释符号）
    content = content.replace(REACT_19_START, (match, codeBlock) => {
        // 移除每行开头的 // （注意处理缩进）
        return codeBlock.replace(/^(\s*)\/\/ /gm, '$1').trim();
    });
    
    return content;
}

function processReact18Code(content) {
    // 移除 React 19 的代码块  
    content = content.replace(REACT_19_START, '');
    
    // 启用 React 18 的代码块（仅移除标记）
    content = content.replace(REACT_18_START, (match, codeBlock) => {
        return codeBlock.trim();
    });
    
    return content;
}

function removePropTypes(content) {
    // 移除 PropTypes 导入
    content = content.replace(/import PropTypes from 'prop-types';\n?/g, '');
    content = content.replace(/import.*PropTypes.*from.*;\n?/g, '');
    
    // 移除 propTypes 静态属性
    content = content.replace(/static propTypes = \{[\s\S]*?\};\n?/g, '');
    
    // 移除 propTypes 赋值
    content = content.replace(/\.propTypes = \{[\s\S]*?\};\n?/g, '');
    
    return content;
}

function removeFindDOMNode(content) {
    // 移除 findDOMNode 导入
    content = content.replace(/import.*findDOMNode.*from 'react-dom';\n?/g, '');
    content = content.replace(/, findDOMNode/g, '');
    content = content.replace(/findDOMNode,?\s*/g, '');
    
    // 注意：不直接替换 findDOMNode 的使用，因为需要根据具体情况处理
    // 这部分需要通过条件编译标记来处理
    
    return content;
}

function buildForReact19() {
    const sourcePattern = 'packages/semi-ui/**/*.{ts,tsx}';
    const outputDir = 'packages/semi-ui-for-react19';
    
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const files = glob.sync(sourcePattern);
    
    files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 处理 React 19 兼容性
        let processedContent = processReact19Code(content);
        
        // 移除 PropTypes
        processedContent = removePropTypes(processedContent);
        
        // 移除 findDOMNode
        processedContent = removeFindDOMNode(processedContent);
        
        // 计算输出路径
        const relativePath = path.relative('packages/semi-ui', filePath);
        const outputPath = path.join(outputDir, relativePath);
        
        // 确保输出目录存在
        const outputDirPath = path.dirname(outputPath);
        if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true });
        }
        
        // 写入处理后的文件
        fs.writeFileSync(outputPath, processedContent);
    });
    
    console.log(`✅ React 19 版本构建完成，输出目录: ${outputDir}`);
}

function buildForReact18() {
    const sourcePattern = 'packages/semi-ui/**/*.{ts,tsx}';
    
    const files = glob.sync(sourcePattern);
    
    files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 处理 React 18 兼容性（保持当前状态）
        const processedContent = processReact18Code(content);
        
        // 直接覆盖原文件（或者你可以选择输出到其他目录）
        fs.writeFileSync(filePath, processedContent);
    });
    
    console.log('✅ React 18 版本构建完成');
}

// 命令行参数处理
const args = process.argv.slice(2);
const version = args[0];

if (version === '19') {
    buildForReact19();
} else if (version === '18') {
    buildForReact18();
} else {
    console.log('用法: node scripts/react19-build.js [18|19]');
    console.log('  18: 构建 React 18 兼容版本');
    console.log('  19: 构建 React 19 兼容版本到 packages/semi-ui-for-react19');
} 