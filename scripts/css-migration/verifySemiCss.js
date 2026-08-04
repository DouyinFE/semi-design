/**
 * semi.css 聚合产物验证：
 * 1. 规则集等价（key 集合相同，忽略重复次数——重复规则幂等无害）
 * 2. 无 FROZEN 残留 / 无 $var 残留
 * 用法：node verifySemiCss.js [newSemiCssPath]
 */
const path = require('path');
const fs = require('fs');
const { normalizeCss, normalizeColor } = require('./normalize');

const ROOT = path.resolve(__dirname, '../..');
const OLD_SEMI_CSS = path.join(ROOT, 'packages/semi-ui/dist/css/semi.css');
const TOKEN_CSS = path.join(ROOT, 'packages/semi-theme-default/css/token.css');

function ruleKey(r) {
    if (r.kind === 'rule') {
        // 选择器列表拆开（合并/拆分差异语义等价）
        const decls = r.decls.map((d) => `${d.prop}:${normalizeColor(d.value)}`).sort().join(';');
        return r.selector.split(',').map((s) => `rule:${s.trim()}{${decls}}`);
    }
    if (r.kind === 'atrule') {
        return [`at:${r.name}:${r.params}{${(r.nodes || []).flatMap(ruleKey).join('|')}}`];
    }
    return [`${r.kind}:${r.params || ''}`];
}

function main() {
    const newPath = process.argv[2] || '/tmp/semi-new.css';
    const oldCss = fs.readFileSync(OLD_SEMI_CSS, 'utf-8');
    const newCss = fs.readFileSync(newPath, 'utf-8');

    // token 代入（验证用：新产物是 var 引用版）
    const tokenCss = fs.readFileSync(TOKEN_CSS, 'utf-8');
    const map = new Map();
    const re = /--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(tokenCss))) map.set(m[1], m[2].trim());
    const norm = new Map();
    for (const [k, v] of map) norm.set(k.replace(/-/g, '_'), v);
    const sub = newCss.replace(/var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g, (mm, name) => norm.get(name.replace(/-/g, '_')) ?? mm);

    const a = normalizeCss(oldCss);
    const b = normalizeCss(sub);
    const aKeys = new Set(a.flatMap(ruleKey));
    const bKeys = new Set(b.flatMap(ruleKey));

    // 残留检查（$var 排除注释：normalize 已去注释，用 normalize 后的 decls 检查）
    const frozen = (newCss.match(/FROZEN/g) || []).length;
    const dollar = b.some((r) => r.kind === 'rule' && r.decls.some((d) => /\$[A-Za-z_]/.test(d.value)));
    const baseFirst = newCss.indexOf('.semi-light-scrollbar') !== -1 && newCss.indexOf('.semi-light-scrollbar') < newCss.indexOf('.semi-button {');

    // 规则集差异（忽略 count）
    const onlyA = [...aKeys].filter((k) => !bKeys.has(k) && !k.includes('cssvar'));
    const onlyB = [...bKeys].filter((k) => !aKeys.has(k) && !k.includes('cssvar'));

    console.log(`旧规则(去重): ${aKeys.size}, 新规则(去重): ${bKeys.size}`);
    console.log(`仅旧有: ${onlyA.length}, 仅新有: ${onlyB.length}`);
    console.log(`FROZEN 残留: ${frozen}, \$var 残留: ${dollar}, base 在最前: ${baseFirst}`);
    if (onlyA.length || onlyB.length) {
        onlyA.slice(0, 5).forEach((k) => console.log('  仅旧:', k.slice(0, 100)));
        onlyB.slice(0, 5).forEach((k) => console.log('  仅新:', k.slice(0, 100)));
        process.exit(1);
    }
    if (frozen || dollar || !baseFirst) {
        process.exit(1);
    }
    console.log('✅ semi.css 聚合产物验证通过（规则集等价 + 无残留）');
}

main();
