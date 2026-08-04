/**
 * scss 冻结标记：给 semi-foundation 全部 .scss 文件头部插入冻结注释（幂等）
 * 表明该文件已被 css 真源取代，仅保留用于旧版构建链路兼容
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');

const FROZEN_BANNER = `// ============================================================
// FROZEN: 本文件已由同目录 .css 真源取代（css 化迁移），停止维护。
// 样式修改请编辑同目录下的 .css 文件。
// 本文件仅保留用于旧版构建链路兼容（semi-webpack 主题注入等）。
// ============================================================
`;

function freeze(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.startsWith('// ============================================================\n// FROZEN')) {
        return false; // 已冻结
    }
    // 保留开头的注释？直接在最前面插入冻结标记
    fs.writeFileSync(filePath, FROZEN_BANNER + content);
    return true;
}

let total = 0;
let frozen = 0;
function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === 'lib') continue;
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(p);
        } else if (entry.name.endsWith('.scss')) {
            total++;
            if (freeze(p)) frozen++;
        }
    }
}

walk(FOUNDATION);
console.log(`scss 文件总数: ${total}, 新增冻结: ${frozen}`);
