const { convertFile } = require('./transformScss');
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const nested = require('postcss-nested');
const sass = require('sass');
const { diffCss } = require('./diff');
const ROOT = path.resolve(__dirname, '../..');

// 剔除冻结 banner（循环，banner 可能被 postcss 合并成多行）
function stripBanner(css) {
    let out = css;
    for (let i = 0; i < 10; i++) {
        const next = out.replace(/^(?:\/\*[^*]*\*\/)+[^\n]*\n?/, '');
        if (next === out) break;
        out = next;
    }
    return out;
}

async function main() {
    if (!fs.existsSync(path.join(ROOT, 'packages/semi-foundation/base/base.scss')) ||
        !fs.existsSync(path.join(ROOT, 'packages/semi-ui/_base/base.scss'))) {
        console.log('CSS 真源已存在，跳过 SCSS base 转换。');
        return;
    }
    // 1. foundation/base/base.scss → base.css
    const baseCss = await convertFile(path.join(ROOT, 'packages/semi-foundation/base/base.scss'));
    fs.writeFileSync(path.join(ROOT, 'packages/semi-foundation/base/base.css'), stripBanner(baseCss));
    console.log('foundation/base/base.css 落库');

    // 2. semi-ui/_base/base.scss → _base/base.css
    const uiBaseCss = await convertFile(path.join(ROOT, 'packages/semi-ui/_base/base.scss'));
    fs.writeFileSync(path.join(ROOT, 'packages/semi-ui/_base/base.css'), stripBanner(uiBaseCss));
    console.log('semi-ui/_base/base.css 落库');

    // 3. 验证 semi-ui base：旧产物（sass 编译，注入 theme+global+animation）vs 新产物
    const scssSrc = fs.readFileSync(path.join(ROOT, 'packages/semi-ui/_base/base.scss'), 'utf-8');
    const theme = path.join(ROOT, 'packages/semi-theme-default/scss/index.scss');
    const global = path.join(ROOT, 'packages/semi-theme-default/scss/global.scss');
    const anim = path.join(ROOT, 'packages/semi-theme-default/scss/animation.scss');
    const fullSrc = `@import "${theme}";\n@import "${global}";\n@import "${anim}";\n` + scssSrc;
    let legacy;
    try {
        legacy = sass.compileString(fullSrc, {
            style: 'expanded', charset: false,
            importers: [{
                findFileUrl(url) {
                    if (url.startsWith('~@douyinfe/semi-foundation/')) {
                        const rel = url.replace('~@douyinfe/semi-foundation/', '');
                        return new URL('file://' + path.join(ROOT, 'packages/semi-foundation', rel));
                    }
                    if (url.startsWith('/') || url.startsWith('file:')) return new URL(url.startsWith('file:') ? url : 'file://' + url);
                    return null;
                }
            }]
        }).css;
    } catch (e) {
        console.log('旧产物编译失败:', e.message.split('\n').slice(0, 3).join(' | '));
        return;
    }
    const tokenCss = fs.readFileSync(path.join(ROOT, 'packages/semi-theme-default/css/token.css'), 'utf-8');
    const map = new Map();
    const re = /--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(tokenCss))) map.set(m[1], m[2].trim());
    const sub = uiBaseCss.replace(/var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g, (mm, name) => map.get(name) ?? mm);
    const flat = postcss([nested()]).process(sub, { from: undefined }).css;
    // 新链路运行时 = base.css 编译 + global.scss + animation.scss（主题包提供 CSS 变量）
    // 旧链路 = sass 编译（注入 global + animation），需拼入对比（同样用 sass 编译以统一格式）
    const themeDir = path.join(ROOT, 'packages/semi-theme-default/scss');
    const sassImporter = [{
        findFileUrl(url) {
            if (url.startsWith('/') || url.startsWith('file:')) return new URL(url.startsWith('file:') ? url : 'file://' + url);
            const resolved = path.resolve(themeDir, url);
            if (fs.existsSync(resolved)) return new URL('file://' + resolved);
            return null;
        }
    }];
    const bGlobal = sass.compileString(fs.readFileSync(global, 'utf-8'), { style: 'expanded', charset: false, importers: sassImporter }).css;
    const bAnim = sass.compileString(fs.readFileSync(anim, 'utf-8'), { style: 'expanded', charset: false, importers: sassImporter }).css;
    const bFull = `${bGlobal}\n${bAnim}\n${flat}`;
    const result = diffCss(legacy, bFull);
    console.log('semi-ui base 三向验证:', result.ok ? '✅ 零差异' : `❌ ${result.diffs.length} 处`);
    if (!result.ok) console.log(JSON.stringify(result.diffs.slice(0, 5)).slice(0, 600));
}

main().catch((e) => { console.error(e); process.exit(1); });
