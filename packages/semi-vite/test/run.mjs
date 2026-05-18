#!/usr/bin/env node
import { build } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import assert from 'node:assert';

import { semiTheming } from '../lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixture = path.join(__dirname, 'fixture');

function write(p, content) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
}

function setupFixtureNodeModules() {
    const nm = path.join(fixture, 'node_modules', '@douyinfe');
    fs.rmSync(nm, { recursive: true, force: true });

    write(path.join(nm, 'semi-theme-default/package.json'), JSON.stringify({
        name: '@douyinfe/semi-theme-default',
        version: '0.0.0',
        main: 'scss/index.scss'
    }, null, 2));
    write(path.join(nm, 'semi-theme-default/scss/index.scss'), "$theme-marker: 'fake-theme-default';\n$color-primary: red;\n");
    write(path.join(nm, 'semi-theme-default/scss/global.scss'), '/* fake global.scss */\n');
    write(path.join(nm, 'semi-theme-default/scss/animation.scss'), '/* fake animation.scss */\n');

    write(path.join(nm, 'semi-foundation/package.json'), JSON.stringify({ name: '@douyinfe/semi-foundation', version: '0.0.0' }, null, 2));
    write(path.join(nm, 'semi-foundation/lib/button.css'), '/* placeholder */\n');
    write(path.join(nm, 'semi-foundation/lib/button.scss'),
        "@import './variables.scss';\n\n.#{$prefix}-button {\n    color: $color-primary;\n    font-size: $font-size-small;\n}\n\n.semi-base {\n    color: $color-primary;\n}\n"
    );
    write(path.join(nm, 'semi-foundation/lib/variables.scss'), '$font-size-small: 12px;\n');
    write(path.join(nm, 'semi-foundation/lib/env.js'),
        '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\nexports.BASE_CLASS_PREFIX = void 0;\nexports.BASE_CLASS_PREFIX = \'semi\';\n'
    );

    write(path.join(nm, 'semi-ui/package.json'), JSON.stringify({ name: '@douyinfe/semi-ui', version: '0.0.0' }, null, 2));
    write(path.join(nm, 'semi-ui/lib/button.js'), "import './button.css';\n\nexport function Button() {\n    return 'button';\n}\n");
    write(path.join(nm, 'semi-ui/lib/button.css'), '/* placeholder */\n');
    write(path.join(nm, 'semi-ui/lib/button.scss'),
        "@import './variables.scss';\n\n.#{$prefix}-button {\n    color: $color-primary;\n    font-size: $font-size-small;\n}\n\n.semi-base {\n    color: $color-primary;\n}\n"
    );
    write(path.join(nm, 'semi-ui/lib/variables.scss'), '$font-size-small: 12px;\n');
}

setupFixtureNodeModules();

async function runCase(label, options, entry = 'src/entry.js') {
    const outDir = path.join(__dirname, 'dist', label);
    if (fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true, force: true });
    }

    await build({
        root: fixture,
        logLevel: 'error',
        configFile: false,
        build: {
            outDir,
            emptyOutDir: true,
            lib: {
                entry: path.join(fixture, entry),
                name: 'fixture',
                formats: ['es'],
                fileName: 'entry'
            },
            cssCodeSplit: false,
            rollupOptions: {
                output: { assetFileNames: 'assets/[name][extname]' }
            }
        },
        plugins: [semiTheming(options)]
    });

    const jsFile = fs.readdirSync(outDir).find(f => /\.(c|m)?js$/.test(f));
    const assetsDir = path.join(outDir, 'assets');
    const cssFile = fs.existsSync(assetsDir)
        ? fs.readdirSync(assetsDir).find(f => f.endsWith('.css'))
        : undefined;

    const jsContent = jsFile ? fs.readFileSync(path.join(outDir, jsFile), 'utf-8') : '';
    const cssContent = cssFile ? fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8') : '';

    return { jsContent, cssContent, hasCss: Boolean(cssFile) };
}

console.log('== case 1: full options (theme + prefix + variables + cssLayer) ==');
{
    const { jsContent, cssContent } = await runCase('full', {
        theme: '@douyinfe/semi-theme-default',
        prefixCls: 'qiang',
        variables: { '$font-size-small': '20px' },
        cssLayer: true
    });
    console.log('CSS:', cssContent);
    assert.match(cssContent, /@layer\s+semi/, 'cssLayer wrapper should be present');
    assert.match(cssContent, /\.qiang-button/, 'prefixCls should rewrite selector');
    assert.match(cssContent, /font-size:\s*20px/, 'variables should override $font-size-small');
    assert.match(cssContent, /color:\s*red/, 'theme variable $color-primary should resolve to red');
    assert.doesNotMatch(cssContent, /\.semi-button/, 'old prefix should not appear');
    assert.match(jsContent, /BASE_CLASS_PREFIX\s*=\s*["']qiang["']/, 'env.js BASE_CLASS_PREFIX should be rewritten');
}

console.log('\n== case 2: defaults (no prefix, no cssLayer, no variables) ==');
{
    const { jsContent, cssContent } = await runCase('defaults', {
        theme: '@douyinfe/semi-theme-default'
    });
    console.log('CSS:', cssContent);
    assert.doesNotMatch(cssContent, /@layer\s+semi/, 'no cssLayer when not requested');
    assert.match(cssContent, /\.semi-button/, 'default prefix `semi` should be kept');
    assert.match(cssContent, /font-size:\s*12px/, 'untouched $font-size-small should be 12px');
    assert.match(jsContent, /BASE_CLASS_PREFIX\s*=\s*["']semi["']/, 'env.js BASE_CLASS_PREFIX should be untouched');
}

console.log('\n== case 3: omitCss (semi pkg .css imports should be stripped) ==');
{
    const { hasCss } = await runCase(
        'omit-css',
        {
            theme: '@douyinfe/semi-theme-default',
            omitCss: true
        },
        'src/omit-entry.js'
    );
    assert.ok(!hasCss, 'no CSS bundle should be emitted when omitCss is true');
}

console.log('\n== case 3b: without omitCss (semi pkg .css imports should produce CSS) ==');
{
    const { hasCss, cssContent } = await runCase(
        'omit-css-disabled',
        {
            theme: '@douyinfe/semi-theme-default'
        },
        'src/omit-entry.js'
    );
    assert.ok(hasCss, 'CSS bundle should be emitted when omitCss is false');
    assert.match(cssContent, /\.semi-button/, 'CSS from semi pkg should pass through');
}

console.log('\n== case 4: include (local.scss overrides $font-size-small) ==');
{
    const includePath = path.join(fixture, 'src/local.scss');
    fs.writeFileSync(includePath, '$font-size-small: 30px;\n');
    const { cssContent } = await runCase('include', {
        theme: '@douyinfe/semi-theme-default',
        include: includePath
    });
    console.log('CSS:', cssContent);
    assert.match(cssContent, /font-size:\s*30px/, 'include scss should override $font-size-small');
}

console.log('\nAll assertions passed ✓');
