/**
 * 三向验证管线：真源（嵌套 css）→ Lightning CSS 编译 → 与 sass 产物 diff
 * 用法：node verify.js <component> [scssFile]
 */
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const nested = require('postcss-nested');
const { compileLegacy } = require('./compileLegacy');
const { convertComponent } = require('./transformScss');
const { diffCss } = require('./diff');

const ROOT = path.resolve(__dirname, '../..');
const TOKEN_CSS = path.join(ROOT, 'packages/semi-theme-default/css/token.css');

// 读取 token 值表：--semi-cssvar-x → 值
let tokenMap = null;
function getTokenMap() {
    if (tokenMap) return tokenMap;
    tokenMap = new Map();
    const css = fs.readFileSync(TOKEN_CSS, 'utf-8');
    const re = /--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(css))) {
        tokenMap.set(m[1], m[2].trim());
    }
    return tokenMap;
}

// 把 css 中的 var(--semi-cssvar-x) 代入 token 值（验证用：新产物是 var 引用版）
// sass 变量名中 -/_ 等价：定义处与引用处拼写可能不同（transform_scale-button vs transform-scale_button）
// 因此按"归一化键"（统一 _）匹配
function tokenKey(name) {
    return name.replace(/-/g, '_');
}

function substituteTokens(css) {
    const map = getTokenMap();
    // 构建归一化索引
    const normIndex = new Map();
    for (const [name, val] of map) {
        normIndex.set(tokenKey(name), val);
    }
    return css.replace(/var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g, (m, name) => {
        const v = normIndex.get(tokenKey(name));
        return v !== undefined ? v : m;
    });
}

// 嵌套编译：postcss-nested（sass 风格展开，输出 A B 无 :is，与 sass 产物一致）
function compileNested(css) {
    const result = postcss([nested()]).process(css, { from: undefined });
    return result.css;
}

async function verify(component, scssFile = null) {
    const legacy = compileLegacy(component, scssFile);
    const nested = await convertComponent(component, scssFile);
    let flat;
    try {
        // 先 token 代入（媒体查询里的 var 也必须代入，Lightning 不支持 media query 中的 var()）
        // 再 Lightning 编译嵌套
        flat = compileNested(substituteTokens(nested));
    } catch (e) {
        return {
            ok: false,
            error: `Lightning CSS 编译失败: ${e.message.split('\n')[0]}`,
            legacyLen: legacy.length,
            nestedLen: nested.length,
        };
    }
    const result = diffCss(legacy, flat);
    return { ok: result.ok, diffs: result.diffs, totalLegacy: result.totalA, totalFlat: result.totalB, legacyLen: legacy.length, nestedLen: nested.length };
}

module.exports = { verify, compileNested };

if (require.main === module) {
    const [component, scssFile] = process.argv.slice(2);
    verify(component, scssFile || null).then((r) => {
        if (r.error) {
            console.log(`❌ ${component}/${scssFile || ''}: ${r.error}`);
            process.exit(1);
        }
        console.log(`旧产物规则: ${r.totalLegacy}, 新产物规则: ${r.totalFlat}`);
        if (r.ok) {
            console.log(`✅ ${component}/${scssFile || ''} 三向验证通过（零差异）`);
        } else {
            console.log(`❌ ${component}/${scssFile || ''} 差异 ${r.diffs.length} 处:`);
            for (const d of r.diffs.slice(0, 15)) console.log('  ', JSON.stringify(d));
            if (r.diffs.length > 15) console.log(`  ... 其余 ${r.diffs.length - 15} 处`);
            process.exit(1);
        }
    }).catch((e) => { console.error('❌ 验证异常:', e.message); process.exit(1); });
}
