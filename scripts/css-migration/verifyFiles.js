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
const RUNTIME_VARIABLES = new Set([
    '--semi-tooltip-arrow-offset-x',
    '--semi-tooltip-arrow-offset-y',
]);

function findUndefinedCssVariables() {
    const files = [
        ...fs.readdirSync(FOUNDATION, { withFileTypes: true })
            .filter(entry => entry.isDirectory() && !['lib', 'node_modules'].includes(entry.name))
            .flatMap(entry => fs.readdirSync(path.join(FOUNDATION, entry.name))
                .filter(file => file.endsWith('.css'))
                .map(file => path.join(FOUNDATION, entry.name, file))),
        path.join(ROOT, 'packages/semi-theme-default/css/token.css'),
        path.join(ROOT, 'packages/semi-theme-default/css/global.css'),
        path.join(ROOT, 'packages/semi-theme-default/css/animation.css'),
    ];
    const defined = new Set();
    const referenced = new Set();
    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        const css = fs.readFileSync(file, 'utf-8');
        for (const name of css.matchAll(/(--semi-[A-Za-z0-9_-]+)\s*:/g)) defined.add(name[1]);
        for (const name of css.matchAll(/var\(\s*(--semi-[A-Za-z0-9_-]+)/g)) referenced.add(name[1]);
    }
    return [...referenced].filter(name => !defined.has(name) && !RUNTIME_VARIABLES.has(name)).sort();
}

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
function substituteTokens(css) {
    const map = getTokenMap();
    return css.replace(/var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g, (m, name) => {
        const v = map.get(name);
        return v !== undefined ? v : m;
    });
}

function verifyFile(comp) {
    const scssFile = SPECIAL[comp] || `${comp}.scss`;
    const legacy = compileLegacy(comp, scssFile);
    if (legacy === null) return { comp, ok: 'not-comparable', reason: '无 scss 基线（组件已 CSS 化）' };
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
    let pass = 0, notComparable = 0, fail = 0;
    const failed = [];
    const skipped = [];
    const undefinedVariables = findUndefinedCssVariables();
    if (undefinedVariables.length) {
        fail++;
        failed.push('css-variable-resolution');
        console.log(`❌ 未定义的 CSS 变量（${undefinedVariables.length}）: ${undefinedVariables.join(', ')}`);
    }
    for (const comp of comps) {
        const r = verifyFile(comp);
        if (r.ok === true) {
            pass++;
        } else if (r.ok === 'not-comparable') {
            notComparable++;
            skipped.push(comp);
        } else {
            fail++;
            failed.push(comp);
            console.log(`❌ ${comp}: ${r.error || `${r.diffs} 处差异`}`);
        }
    }
    console.log(`落库验证: ${pass} 零差异, ${notComparable} 无旧基线, ${fail} 失败（共 ${pass + notComparable + fail} 个组件）`);
    if (skipped.length) console.log('无旧基线（CSS 已作为真源）:', skipped.join(', '));
    if (failed.length) console.log('失败:', failed.join(', '));
    process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
