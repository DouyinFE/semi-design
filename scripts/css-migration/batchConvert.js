/**
 * 阶段 2：批量转换 semi-foundation 组件 scss → 嵌套 css 真源并落库
 * 主文件 + 独立子文件（iconButton.scss/textarea.scss 等，有样式但不被主文件 import）
 */
const path = require('path');
const fs = require('fs');
const { convertComponent, convertFile } = require('./transformScss');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');

// 组件目录 → 主 scss 文件名（默认 <组件名>.scss，特殊映射）
const SPECIAL = {
    '_portal': 'portal.scss',
};

// 转换并落库单个 scss 文件
async function convertAndWrite(comp, scssFile, results) {
    try {
        const scssPath = path.join(FOUNDATION, comp, scssFile);
        const css = await convertFile(scssPath);
        // 剔除冻结 banner
        let out = css;
        for (let i = 0; i < 10; i++) {
            const next = out.replace(/^(?:\/\*[^*]*\*\/)+[^\n]*\n?/, '');
            if (next === out) break;
            out = next;
        }
        const cssPath = path.join(FOUNDATION, comp, scssFile.replace(/\.scss$/, '.css'));
        fs.writeFileSync(cssPath, out);
        results.push({ comp, scssFile, ok: true, lines: out.split('\n').length });
    } catch (e) {
        results.push({ comp, scssFile, ok: false, error: e.message.slice(0, 80) });
    }
}

async function main() {
    const results = [];
    const entries = fs.readdirSync(FOUNDATION, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const comp = entry.name;
        if (['node_modules', 'lib', 'keyframes', 'scripts', 'base', '_utils'].includes(comp)) continue;
        const compDir = path.join(FOUNDATION, comp);
        // 主文件
        const mainFile = SPECIAL[comp] || `${comp}.scss`;
        if (fs.existsSync(path.join(compDir, mainFile))) {
            await convertAndWrite(comp, mainFile, results);
        }
        // 独立子文件（有样式规则、不被主文件 import 的 scss）
        const mainImports = fs.existsSync(path.join(compDir, mainFile))
            ? fs.readFileSync(path.join(compDir, mainFile), 'utf-8')
            : '';
        for (const f of fs.readdirSync(compDir)) {
            if (!f.endsWith('.scss') || f === mainFile) continue;
            if (/^(variables|animation|rtl|mixin)\.scss$/.test(f)) continue;
            // 被主文件 import 的跳过（已内联）
            if (mainImports.includes(f)) continue;
            await convertAndWrite(comp, f, results);
        }
    }
    const ok = results.filter((r) => r.ok);
    const fail = results.filter((r) => !r.ok);
    console.log(`转换完成: ${ok.length} 成功, ${fail.length} 失败`);
    for (const f of fail) {
        console.log(`  ❌ ${f.comp}/${f.scssFile}: ${f.error}`);
    }
    fs.writeFileSync('/tmp/converted.txt', [...new Set(ok.map((r) => r.comp))].join('\n'));
    console.log('成功组件已写入 /tmp/converted.txt');
}

main().catch((e) => { console.error(e); process.exit(1); });
