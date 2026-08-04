/**
 * 验证落库的 css 真源文件：读 <component>.css → token 代入 → postcss-nested 编译 → diff vs 旧产物
 * 用法：node verifyFiles.js [component...]（不传则验证 /tmp/converted.txt 全部）
 */
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const nested = require('postcss-nested');
const { compileLegacy } = require('./compileLegacy');
const { diffCss } = require('./diff');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');
const SPECIAL = { '_portal': 'portal.scss' };

// token 值表 + 代入（同 verify.js 逻辑）
let tokenMap = null;
function getTokenMap() {
    if (tokenMap) return tokenMap;
    tokenMap = new Map();
    const css = fs.readFileSync(path.join(ROOT, 'packages/semi-theme-default/css/token.css'), 'utf-8');
    const re = /--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(css))) tokenMap.set(m[1], m[2].trim());
    return tokenMap;
}
function tokenKey(name) {
    return name.replace(/-/g, '_');
}
function substituteTokens(css) {
    const map = getTokenMap();
    const normIndex = new Map();
    for (const [name, val] of map) normIndex.set(tokenKey(name), val);
    return css.replace(/var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g, (m, name) => {
        const v = normIndex.get(tokenKey(name));
        return v !== undefined ? v : m;
    });
}

function verifyFile(comp) {
    const scssFile = SPECIAL[comp] || `${comp}.scss`;
    const legacy = compileLegacy(comp, scssFile);
    if (legacy === null) return { comp, ok: 'skip', reason: '无 scss（组件无样式）' };
    const cssPath = path.join(FOUNDATION, comp, scssFile.replace(/\.scss$/, '.css'));
    if (!fs.existsSync(cssPath)) return { comp, ok: false, error: 'css 真源不存在（未转换）' };
    const cssSource = fs.readFileSync(cssPath, 'utf-8');
    let flat;
    try {
        flat = postcss([nested()]).process(substituteTokens(cssSource), { from: undefined }).css;
    } catch (e) {
        return { comp, ok: false, error: `postcss-nested: ${e.message.split('\n')[0]}` };
    }
    const result = diffCss(legacy, flat);
    return { comp, ok: result.ok, diffs: result.diffs ? result.diffs.length : 0 };
}

async function main() {
    const args = process.argv.slice(2);
    let comps = args;
    if (!comps.length) {
        comps = fs.readFileSync('/tmp/converted.txt', 'utf-8').trim().split('\n');
        // 补充无 scss 的组件（完整 80 个）
        for (const c of ['dragMove', 'icons', 'lottie', 'utils']) {
            if (!comps.includes(c)) comps.push(c);
        }
    }
    let pass = 0, skip = 0, fail = 0;
    const failed = [];
    const skipped = [];
    for (const comp of comps) {
        const r = verifyFile(comp);
        if (r.ok === true) {
            pass++;
        } else if (r.ok === 'skip') {
            skip++;
            skipped.push(comp);
        } else {
            fail++;
            failed.push(comp);
            console.log(`❌ ${comp}: ${r.error || `${r.diffs} 处差异`}`);
        }
    }
    console.log(`落库验证: ${pass} 零差异, ${skip} 无 scss 跳过, ${fail} 失败（共 ${pass + skip + fail} 个组件）`);
    if (skipped.length) console.log('无 scss（跳过）:', skipped.join(', '));
    if (failed.length) console.log('失败:', failed.join(', '));
    process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
