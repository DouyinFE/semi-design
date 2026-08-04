/**
 * webpack 集成测试（rule 方式，webpack 5 推荐）：
 * css 真源链路（semiCssThemeLoader）在 webpack 5 中完整工作
 * 1. prefixCls 文本替换（.semi- → .my-）
 * 2. token 注入（token.css/global.css/animation.css → --semi-cssvar / --semi-color）
 */
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '../../..');
const cwd = path.resolve(__dirname, '..');
const OUT_DIR = path.join(cwd, 'test/.tmp8');

async function main() {
    // 模拟真实安装：test/node_modules/@douyinfe/semi-foundation → 本地 packages
    const testNm = path.join(cwd, 'test/node_modules');
    const douyinfe = path.join(testNm, '@douyinfe');
    fs.mkdirSync(douyinfe, { recursive: true });
    for (const [name, pkg] of [['semi-foundation', 'semi-foundation'], ['semi-theme-default', 'semi-theme-default']]) {
        const linkPath = path.join(douyinfe, name);
        try {
            fs.symlinkSync(path.join(ROOT, 'packages', pkg), linkPath, 'dir');
        } catch (e) {
            if (e.code !== 'EEXIST') throw e;
        }
    }
    const entry = path.join(cwd, 'test/entry.js');
    fs.writeFileSync(entry, `import '@douyinfe/semi-foundation/lib/es/button/button.css';\nimport '@douyinfe/semi-foundation/lib/es/_portal/portal.css';\nconsole.log('ok');\n`);

    const compiler = webpack({
        mode: 'development',
        devtool: false,
        entry,
        output: { path: OUT_DIR, filename: 'bundle.js' },
        module: {
            rules: [
                {
                    // css 真源链路：注入主题变量 + prefixCls 替换
                    test: /@douyinfe[\\/]+semi-(ui|icons|foundation)[\\/]+lib[\\/]+.+\.css$/,
                    use: [
                        { loader: require.resolve('style-loader') },
                        { loader: require.resolve('css-loader') },
                        {
                            loader: path.join(cwd, 'lib/semi-css-theme-loader'),
                            options: { name: '@douyinfe/semi-theme-default', prefixCls: 'my' },
                        },
                    ],
                },
            ],
        },
        resolve: {
            modules: [path.join(cwd, 'test/node_modules'), 'node_modules'],
            symlinks: false,
        },
        stats: 'errors-only',
    });

    await new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) return reject(err);
            if (stats.hasErrors()) return reject(new Error(stats.toString({ errors: true })));
            resolve();
        });
    });

    const bundle = fs.readFileSync(path.join(OUT_DIR, 'bundle.js'), 'utf-8');
    const checks = [
        ['prefixCls 类名替换（.my-button，无 .semi-button）', bundle.includes('.my-button') && !bundle.includes('.semi-button')],
        ['token 注入（--semi-cssvar）', bundle.includes('--semi-cssvar-')],
        ['global 注入（--semi-color-primary）', bundle.includes('--semi-color-primary')],
        ['组件样式（.my-button-split）', bundle.includes('.my-button-split')],
        ['portal 样式（.my-portal）', bundle.includes('.my-portal')],
    ];
    let allPass = true;
    for (const [name, pass] of checks) {
        console.log(`${pass ? '✅' : '❌'} ${name}`);
        if (!pass) allPass = false;
    }
    process.exit(allPass ? 0 : 1);
}

main().catch((e) => { console.error('❌ 测试失败:', e.message); process.exit(1); });
