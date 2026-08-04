/**
 * 视觉回归：渲染级对比（旧产物 vs 新产物 computed style）
 * 对代表性组件 DOM，分别加载旧产物（sass 编译值版）和新产物（css 真源 + token 运行时），
 * 对比所有元素的 computed style（chrome 层叠求值结果）
 *
 * 用法：node visualDiff.js [组件名...]（默认 button, input, table, tooltip, modal）
 */
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '../..');
const FOUNDATION = path.join(ROOT, 'packages/semi-foundation');
const THEME = path.join(ROOT, 'packages/semi-theme-default');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// ============ 生成测试 css 包 ============
async function buildCssPackages(components) {
    const { compileLegacy } = require('./compileLegacy');
    const sass = require('sass');

    // 主题变量（旧产物编译注入 + 新产物运行时）
    const sassImporter = [{
        findFileUrl(url) {
            if (url.startsWith('/') || url.startsWith('file:')) return new URL(url.startsWith('file:') ? url : `file://${url}`);
            const resolved = path.resolve(path.join(THEME, 'scss'), url);
            if (fs.existsSync(resolved)) return new URL(`file://${resolved}`);
            return null;
        },
    }];
    const compileScss = (file) => sass.compileString(fs.readFileSync(file, 'utf-8'), { style: 'expanded', charset: false, importers: sassImporter }).css;
    const globalCss = compileScss(path.join(THEME, 'scss/global.scss'));
    const animationCss = compileScss(path.join(THEME, 'scss/animation.scss'));
    const tokenCss = fs.readFileSync(path.join(THEME, 'css/token.css'), 'utf-8');

    const oldParts = [globalCss, animationCss]; // 旧产物也需要运行时 css 变量（--semi-grey-7 等）
    const newParts = [tokenCss, globalCss, animationCss];

    for (const comp of components) {
        // 旧产物：sass 编译（注入 theme index）
        const legacy = compileLegacy(comp);
        if (legacy === null) continue;
        oldParts.push(legacy);
        // 新产物：css 真源编译（token 引用保留，运行时由 token.css 提供）
        const cssPath = path.join(FOUNDATION, comp, `${comp}.css`);
        if (fs.existsSync(cssPath)) {
            newParts.push(fs.readFileSync(cssPath, 'utf-8'));
        }
    }
    return {
        oldCss: oldParts.join('\n'),
        newCss: newParts.join('\n'),
    };
}

// ============ 组件 DOM 模板 ============
function componentHtml(comp) {
    const templates = {
        button: `
            <div>
                <button class="semi-button semi-button-primary">主要按钮</button>
                <button class="semi-button semi-button-danger">危险按钮</button>
                <button class="semi-button semi-button-outline">描边按钮</button>
                <button class="semi-button semi-button-size-small">小按钮</button>
                <button class="semi-button semi-button-disabled" disabled>禁用</button>
                <button class="semi-button semi-button-with-icon"><span class="semi-button-content">带图标</span></button>
            </div>`,
        input: `
            <div>
                <div class="semi-input-wrapper">
                    <input class="semi-input" placeholder="请输入" value="测试" />
                </div>
                <div class="semi-input-wrapper semi-input-wrapper__with-suffix">
                    <input class="semi-input" value="带后缀" />
                    <span class="semi-input-suffix">suffix</span>
                </div>
                <textarea class="semi-input semi-input-textarea" rows="3">多行文本</textarea>
            </div>`,
        tooltip: `
            <div>
                <div class="semi-tooltip-wrapper">
                    <span class="semi-tooltip-content">提示内容</span>
                </div>
                <div class="semi-tooltip-wrapper semi-tooltip-with-arrow">
                    <span class="semi-tooltip-icon-arrow"></span>
                </div>
            </div>`,
        table: `
            <div>
                <div class="semi-table-wrapper">
                    <table class="semi-table">
                        <thead class="semi-table-thead"><tr class="semi-table-row"><th class="semi-table-th">列1</th><th>列2</th></tr></thead>
                        <tbody class="semi-table-tbody"><tr class="semi-table-row"><td class="semi-table-td">a</td><td>b</td></tr></tbody>
                    </table>
                </div>
            </div>`,
        modal: `
            <div>
                <div class="semi-modal">
                    <div class="semi-modal-content">
                        <div class="semi-modal-header"><span class="semi-modal-title">标题</span></div>
                        <div class="semi-modal-body">内容区域</div>
                        <div class="semi-modal-footer"><button class="semi-button">确定</button></div>
                    </div>
                </div>
            </div>`,
        avatar: `
            <div>
                <span class="semi-avatar semi-avatar-primary"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" /></span>
                <span class="semi-avatar semi-avatar-circle semi-avatar-large"><span class="semi-avatar-content">A</span></span>
                <span class="semi-avatar semi-avatar-square"><span class="semi-avatar-content">B</span></span>
            </div>`,
        tag: `
            <div>
                <span class="semi-tag semi-tag-primary">标签</span>
                <span class="semi-tag semi-tag-danger semi-tag-size-large">危险</span>
                <span class="semi-tag semi-tag-amber semi-tag-closable">可关闭</span>
                <span class="semi-tag-group"><span class="semi-tag">组1</span><span class="semi-tag">组2</span></span>
            </div>`,
        select: `
            <div>
                <div class="semi-select">
                    <div class="semi-select-selection">
                        <span class="semi-select-selection-text">选项一</span>
                        <span class="semi-select-arrow"><svg></svg></span>
                    </div>
                </div>
                <div class="semi-select-option-list">
                    <div class="semi-select-option semi-select-option-selected">选项一</div>
                    <div class="semi-select-option">选项二</div>
                </div>
            </div>`,
        grid: `
            <div>
                <div class="semi-row"><div class="semi-col semi-col-6">6</div><div class="semi-col semi-col-12">12</div><div class="semi-col semi-col-6">6</div></div>
                <div class="semi-row semi-row-flex"><div class="semi-col-xs-8">xs8</div><div class="semi-col-md-16">md16</div></div>
            </div>`,
    };
    return templates[comp] || templates.button;
}

// ============ 渲染对比 ============
async function compareInBrowser(cssOld, cssNew, html) {
    const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
    try {
        const page = await browser.newPage();
        // 收集 computed style 的属性集
        const props = [
            'color', 'background-color', 'border-radius', 'border-top-width', 'border-bottom-width',
            'font-size', 'font-weight', 'line-height', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'height', 'min-height', 'width', 'min-width', 'display', 'justify-content', 'align-items',
            'opacity', 'overflow', 'z-index', 'box-shadow',
        ];
        async function snapshot(css) {
            await page.setContent(`<style>${css}</style>${html}`);
            return page.evaluate((props) => {
                const result = {};
                const elements = document.querySelectorAll('*');
                elements.forEach((el, i) => {
                    const cs = getComputedStyle(el);
                    const tag = el.tagName.toLowerCase();
                    const cls = (el.className || '').toString().split(' ').slice(0, 3).join('.');
                    const key = `${tag}.${cls}:${i}`;
                    result[key] = {};
                    for (const p of props) {
                        result[key][p] = cs.getPropertyValue(p);
                    }
                });
                return result;
            }, props);
        }
        const oldSnap = await snapshot(cssOld);
        const newSnap = await snapshot(cssNew);
        return { oldSnap, newSnap };
    } finally {
        await browser.close();
    }
}

async function main() {
    const components = process.argv.slice(2).length ? process.argv.slice(2) : ['button', 'input', 'tooltip', 'table', 'modal'];
    const { oldCss, newCss } = await buildCssPackages(components);

    let totalDiff = 0;
    for (const comp of components) {
        const html = componentHtml(comp);
        const { oldSnap, newSnap } = await compareInBrowser(oldCss, newCss, html);
        // 对比
        let diffCount = 0;
        const diffs = [];
        const allKeys = new Set([...Object.keys(oldSnap), ...Object.keys(newSnap)]);
        for (const key of allKeys) {
            const a = oldSnap[key] || {};
            const b = newSnap[key] || {};
            for (const p of Object.keys({ ...a, ...b })) {
                const va = a[p] || '';
                const vb = b[p] || '';
                if (va !== vb) {
                    diffCount++;
                    if (diffs.length < 5) diffs.push({ key, prop: p, old: va, new: vb });
                }
            }
        }
        totalDiff += diffCount;
        console.log(`${diffCount === 0 ? '✅' : '❌'} ${comp}: ${diffCount} 处 computed style 差异`);
        for (const d of diffs.slice(0, 3)) {
            console.log(`    ${d.key} [${d.prop}]: "${d.old}" vs "${d.new}"`);
        }
    }
    console.log(totalDiff === 0 ? '✅ 视觉回归全部通过（渲染语义等价）' : `❌ 共 ${totalDiff} 处差异`);
    process.exit(totalDiff === 0 ? 0 : 1);
}

main().catch((e) => { console.error('❌ 视觉回归失败:', e.message); process.exit(1); });
