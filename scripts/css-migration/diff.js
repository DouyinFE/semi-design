/**
 * 规范化 diff：两份规范化规则列表按序对比，输出差异报告
 * 对齐策略：顺序敏感——按序推进，遇到不匹配时在对方后续中查找（处理插入/删除）
 */
const { normalizeCss, normalizeColor } = require('./normalize');

function normVal(v) {
    return normalizeColor(v);
}

function ruleKey(item) {
    if (item.kind === 'rule') return `rule:${item.selector}`;
    if (item.kind === 'keyframes') return `keyframes:${item.params}`;
    return `atrule:${item.name}:${item.params}`;
}

function declsEqual(a, b) {
    // 顺序无关比较（同规则内 decls 顺序不影响层叠语义；重复 prop 后者覆盖，Map 语义一致）
    const ma = new Map(a.map((d) => [d.prop, normVal(d.value)]));
    const mb = new Map(b.map((d) => [d.prop, normVal(d.value)]));
    if (ma.size !== mb.size) return false;
    for (const [p, v] of ma) {
        if (mb.get(p) !== v) return false;
    }
    return true;
}

function itemEqual(a, b) {
    if (a.kind !== b.kind) return false;
    if (a.kind === 'rule') {
        return a.selector === b.selector && declsEqual(a.decls, b.decls);
    }
    if (a.kind === 'keyframes') {
        if (a.params !== b.params || a.frames.length !== b.frames.length) return false;
        return a.frames.every((f, i) => {
            const g = b.frames[i];
            return f.selector === g.selector && declsEqual(f.decls, g.decls);
        });
    }
    // atrule（media/supports 等）
    if (a.name !== b.name || a.params !== b.params) return false;
    if (a.nodes) {
        if (!b.nodes || a.nodes.length !== b.nodes.length) return false;
        return a.nodes.every((x, i) => itemEqual(x, b.nodes[i]));
    }
    return declsEqual(a.decls || [], b.decls || []);
}

function describeDiff(a, b) {
    if (!a || !b) {
        return { type: 'insert-delete', detail: a ? '删除' : '新增' };
    }
    if (a.kind !== b.kind) {
        return { type: 'kind', detail: `${a.kind} vs ${b.kind}` };
    }
    if (a.kind === 'rule') {
        if (a.selector !== b.selector) {
            return { type: 'selector', oldSelector: a.selector, newSelector: b.selector };
        }
        // 声明级差异
        const oldDecls = new Map(a.decls.map((d) => [d.prop, d.value]));
        const newDecls = new Map(b.decls.map((d) => [d.prop, d.value]));
        const diffs = [];
        for (const [prop, val] of oldDecls) {
            if (!newDecls.has(prop)) {
                diffs.push({ prop, oldValue: val, newValue: undefined, diff: '删除声明' });
            } else if (newDecls.get(prop) !== val) {
                diffs.push({ prop, oldValue: val, newValue: newDecls.get(prop), diff: '值变化' });
            }
        }
        for (const [prop, val] of newDecls) {
            if (!oldDecls.has(prop)) {
                diffs.push({ prop, oldValue: undefined, newValue: val, diff: '新增声明' });
            }
        }
        return { type: 'decls', selector: a.selector, diffs };
    }
    return { type: 'other', detail: `${JSON.stringify(a).slice(0, 100)} vs ${JSON.stringify(b).slice(0, 100)}` };
}

/**
 * 对比两份 css 文本
 * @returns {{ ok: boolean, diffs: Array, totalA: number, totalB: number }}
 */
function diffCss(cssA, cssB) {
    const listA = normalizeCss(cssA);
    const listB = normalizeCss(cssB);
    const diffs = [];
    let i = 0, j = 0;
    while (i < listA.length || j < listB.length) {
        if (i >= listA.length) {
            diffs.push({ index: `B[${j}]`, ...describeDiff(null, listB[j]) });
            j++;
            continue;
        }
        if (j >= listB.length) {
            diffs.push({ index: `A[${i}]`, ...describeDiff(listA[i], null) });
            i++;
            continue;
        }
        if (itemEqual(listA[i], listB[j])) {
            i++; j++;
            continue;
        }
        // 尝试对齐：A 当前项是否在 B 后续出现（B 插入了一些项）
        let lookB = -1;
        for (let k = j; k < Math.min(j + 5, listB.length); k++) {
            if (itemEqual(listA[i], listB[k])) { lookB = k; break; }
        }
        if (lookB !== -1) {
            for (let k = j; k < lookB; k++) {
                diffs.push({ index: `B[${k}]`, ...describeDiff(null, listB[k]) });
            }
            j = lookB;
            i++; j++;
            continue;
        }
        // 尝试：B 当前项是否在 A 后续出现（A 插入了项 / B 删除了项）
        let lookA = -1;
        for (let k = i; k < Math.min(i + 5, listA.length); k++) {
            if (itemEqual(listA[k], listB[j])) { lookA = k; break; }
        }
        if (lookA !== -1) {
            for (let k = i; k < lookA; k++) {
                diffs.push({ index: `A[${k}]`, ...describeDiff(listA[k], null) });
            }
            i = lookA;
            i++; j++;
            continue;
        }
        // 真差异
        diffs.push({ index: `A[${i}]/B[${j}]`, ...describeDiff(listA[i], listB[j]) });
        i++; j++;
    }
    return { ok: diffs.length === 0, diffs, totalA: listA.length, totalB: listB.length };
}

module.exports = { diffCss, normalizeCss };

// CLI: node diff.js <fileA.css> <fileB.css>
if (require.main === module) {
    const fs = require('fs');
    const [a, b] = process.argv.slice(2);
    const cssA = fs.readFileSync(a, 'utf-8');
    const cssB = fs.readFileSync(b, 'utf-8');
    const result = diffCss(cssA, cssB);
    console.log(`A 规则数: ${result.totalA}, B 规则数: ${result.totalB}`);
    if (result.ok) {
        console.log('✅ 等价');
    } else {
        console.log(`❌ 差异 ${result.diffs.length} 处:`);
        for (const d of result.diffs.slice(0, 30)) {
            console.log('  ', JSON.stringify(d));
        }
        if (result.diffs.length > 30) console.log(`  ... 其余 ${result.diffs.length - 30} 处`);
        process.exit(1);
    }
}
