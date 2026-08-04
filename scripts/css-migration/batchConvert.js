/**
 * 阶段 2：批量转换 semi-foundation 组件 scss → 嵌套 css 真源并落库
 * 每个组件目录生成 <component>.css（子文件 rtl/variables 等已内联到主文件）
 */
const path = require('path');
const fs = require('fs');
const { convertComponent } = require('./transformScss');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');

// 组件目录 → 主 scss 文件名（默认 <组件名>.scss，特殊映射）
const SPECIAL = {
    '_portal': 'portal.scss',
};

async function main() {
    const results = [];
    const entries = fs.readdirSync(FOUNDATION, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const comp = entry.name;
        if (['node_modules', 'lib', 'keyframes', 'scripts', 'base', '_utils'].includes(comp)) continue;
        const scssFile = SPECIAL[comp] || `${comp}.scss`;
        const scssPath = path.join(FOUNDATION, comp, scssFile);
        if (!fs.existsSync(scssPath)) continue;
        try {
            let css = await convertComponent(comp, scssFile);
            // 剔除 scss 冻结 banner（css 真源是活文件，不应带冻结标记）
            // postcss stringify 会把 // 行注释转成 /* */ 并可能合并，循环删除开头注释行
            for (let i = 0; i < 10; i++) {
                const next = css.replace(/^(?:\/\*[^*]*\*\/)+[^\n]*\n?/, '');
                if (next === css) break;
                css = next;
            }
            // 写入 css 真源
            const cssPath = path.join(FOUNDATION, comp, scssFile.replace(/\.scss$/, '.css'));
            fs.writeFileSync(cssPath, css);
            results.push({ comp, ok: true, lines: css.split('\n').length });
        } catch (e) {
            results.push({ comp, ok: false, error: e.message.slice(0, 80) });
        }
    }
    const ok = results.filter((r) => r.ok);
    const fail = results.filter((r) => !r.ok);
    console.log(`转换完成: ${ok.length} 成功, ${fail.length} 失败`);
    for (const f of fail) {
        console.log(`  ❌ ${f.comp}: ${f.error}`);
    }
    // 输出成功列表供验证
    fs.writeFileSync('/tmp/converted.txt', ok.map((r) => r.comp).join('\n'));
    console.log('成功组件已写入 /tmp/converted.txt');
}

main().catch((e) => { console.error(e); process.exit(1); });
