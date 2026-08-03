/**
 * sass 表达式求值服务：把 scss 片段交给 sass 编译取结果
 * 用途：@for 边界、@if 条件、复杂插值、算术表达式——"利用 sass 编译器让修改可控"
 */
const path = require('path');
const fs = require('fs');
const sass = require('sass');

const ROOT = path.resolve(__dirname, '../..');
const THEME = path.join(ROOT, 'packages/semi-theme-default');

/**
 * 求值一组表达式
 * @param {string} varDefs 变量定义文本（$a: 1; $b: 2; ...）
 * @param {string[]} exprs 要求值的表达式列表（如 '$width-grid_columns'）
 * @param {string[]} [extraImports] 额外导入的 scss 文件（组件 variables.scss/animation.scss 等）
 * @returns {Map<string, string>} 表达式原文 → 求值结果字符串
 */
function evalExprs(varDefs, exprs, extraImports = []) {
    if (!exprs.length) return new Map();
    const results = new Map();
    const lines = [`@use "sass:meta";`, `@use "sass:math";`, `@import "${THEME}/scss/index.scss";`];
    for (const imp of extraImports) {
        lines.push(`@import "${imp}";`);
    }
    lines.push(varDefs);
    exprs.forEach((expr, i) => {
        // ==/!= 前后补空格（sass 词法需要，避免 solid==solid 解析失败）
        const safeExpr = String(expr).replace(/([=!]=)/g, ' $1 ');
        lines.push(`$__eval_${i}: ${safeExpr};`);
    });
    lines.push('body {');
    exprs.forEach((expr, i) => {
        // 注意：sass 在自定义属性（--xxx）值中不解析 $var 引用，必须用 #{} 插值强制求值
        lines.push(`  --__eval_${i}: #{$__eval_${i}};`);
    });
    lines.push('}');
    const src = lines.join('\n');
    try {
        const result = sass.compileString(src, {
            style: 'expanded',
            charset: false,
            importers: [
                {
                    findFileUrl(url) {
                        if (url.startsWith('/') || url.startsWith('file:')) {
                            return new URL(url.startsWith('file:') ? url : `file://${url}`);
                        }
                        const resolved = path.resolve(ROOT, 'packages/semi-foundation', url);
                        if (fs.existsSync(resolved)) return new URL(`file://${resolved}`);
                        return null;
                    },
                },
            ],
        });
        const m = result.css.match(/body\s*\{([\s\S]*)\}/);
        if (m) {
            const declRe = /--__eval_(\d+):\s*([^;]+);/g;
            let dm;
            while ((dm = declRe.exec(m[1]))) {
                results.set(exprs[Number(dm[1])], dm[2].trim());
            }
        }
    } catch (e) {
        console.warn(`[sassEval] 求值失败: ${e.message.split('\n').slice(0,4).join(" | ")}`);
    }
    return results;
}

module.exports = { evalExprs };
