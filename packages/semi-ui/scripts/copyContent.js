const fs = require('fs');
const path = require('path');

// 排除的文件（工具脚本，不需要发布）
const excludeFiles = ['order.js', 'makeLn.js', 'rename.py'];

function copyDirectory(src, dest) {
    // 确保目标目录存在
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // 读取源目录内容
    const items = fs.readdirSync(src);

    items.forEach(item => {
        // 跳过排除的文件
        if (excludeFiles.includes(item)) {
            return;
        }

        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            // 递归复制子目录
            copyDirectory(srcPath, destPath);
        } else {
            // 复制文件
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// 获取项目根目录（从 packages/semi-ui/scripts 向上两级）
const projectRoot = path.resolve(__dirname, '../../..');
const contentSrc = path.join(projectRoot, 'content');
const contentDest = path.join(__dirname, '..', 'content');

// 如果 content 目录存在，则复制
if (fs.existsSync(contentSrc)) {
    console.log('正在复制 content 目录...');
    copyDirectory(contentSrc, contentDest);
    console.log('content 目录复制完成');
} else {
    console.warn(`警告: 未找到 content 目录: ${contentSrc}`);
}

