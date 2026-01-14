const fs = require('fs');
const path = require('path');

/**
 * 检查 exports 是否有遗漏
 */
function checkExports() {
    const libEsPath = path.join(__dirname, '../lib/es');
    const packageJsonPath = path.join(__dirname, '../package.json');
    
    if (!fs.existsSync(libEsPath)) {
        console.error('Error: lib/es directory does not exist.');
        process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const exports = packageJson.exports || {};

    // 收集所有实际存在的文件
    const actualFiles = {
        js: new Set(),
        css: new Set(),
        dts: new Set()
    };

    function scanDirectory(dir, basePath = '') {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                scanDirectory(fullPath, relativePath);
            } else if (entry.isFile()) {
                if (entry.name.endsWith('.js')) {
                    actualFiles.js.add(`./lib/es/${relativePath}`);
                    actualFiles.js.add(`./lib/es/${relativePath.replace(/\.js$/, '')}`);
                } else if (entry.name.endsWith('.css')) {
                    actualFiles.css.add(`./lib/es/${relativePath}`);
                } else if (entry.name.endsWith('.d.ts')) {
                    actualFiles.dts.add(`./lib/es/${relativePath}`);
                }
            }
        }
    }

    scanDirectory(libEsPath, '');

    // 检查目录（有 index.js 的目录）
    function checkDirectories(dir, basePath = '') {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                const indexJsPath = path.join(fullPath, 'index.js');
                if (fs.existsSync(indexJsPath)) {
                    actualFiles.js.add(`./lib/es/${relativePath}`);
                }
                checkDirectories(fullPath, relativePath);
            }
        }
    }

    checkDirectories(libEsPath, '');

    // 收集 exports 中已定义的键
    const exportedKeys = new Set(Object.keys(exports));

    // 找出遗漏的文件
    const missing = {
        js: [],
        css: [],
        dts: []
    };

    // 检查 JS 文件
    for (const file of actualFiles.js) {
        if (!exportedKeys.has(file)) {
            missing.js.push(file);
        }
    }

    // 检查 CSS 文件
    for (const file of actualFiles.css) {
        if (!exportedKeys.has(file)) {
            missing.css.push(file);
        }
    }

    // 检查类型文件（通过 JS 文件推断）
    for (const jsFile of actualFiles.js) {
        if (jsFile.endsWith('.js')) {
            const dtsFile = jsFile.replace(/\.js$/, '.d.ts');
            const dtsPath = path.join(__dirname, '../', dtsFile.replace('./', ''));
            if (fs.existsSync(dtsPath)) {
                actualFiles.dts.add(dtsFile);
                // 检查对应的导出是否有 types 字段
                const exportKey = jsFile.replace(/\.js$/, '');
                const exportWithExt = jsFile;
                const exportEntry = exports[exportKey] || exports[exportWithExt];
                if (exportEntry && !exportEntry.types) {
                    missing.dts.push(dtsFile);
                }
            }
        }
    }

    // 输出结果
    console.log('=== 检查结果 ===\n');
    console.log(`实际 JS 文件数: ${actualFiles.js.size}`);
    console.log(`实际 CSS 文件数: ${actualFiles.css.size}`);
    console.log(`实际类型文件数: ${actualFiles.dts.size}`);
    console.log(`已导出键数: ${exportedKeys.size}\n`);

    if (missing.js.length > 0) {
        console.log(`❌ 遗漏的 JS 文件映射 (${missing.js.length}):`);
        missing.js.slice(0, 20).forEach(file => console.log(`  - ${file}`));
        if (missing.js.length > 20) {
            console.log(`  ... 还有 ${missing.js.length - 20} 个`);
        }
        console.log('');
    }

    if (missing.css.length > 0) {
        console.log(`❌ 遗漏的 CSS 文件映射 (${missing.css.length}):`);
        missing.css.slice(0, 20).forEach(file => console.log(`  - ${file}`));
        if (missing.css.length > 20) {
            console.log(`  ... 还有 ${missing.css.length - 20} 个`);
        }
        console.log('');
    }

    if (missing.dts.length > 0) {
        console.log(`⚠️  缺少 types 字段的导出 (${missing.dts.length}):`);
        missing.dts.slice(0, 20).forEach(file => console.log(`  - ${file}`));
        if (missing.dts.length > 20) {
            console.log(`  ... 还有 ${missing.dts.length - 20} 个`);
        }
        console.log('');
    }

    if (missing.js.length === 0 && missing.css.length === 0 && missing.dts.length === 0) {
        console.log('✅ 所有文件都已正确导出！');
    }

    return {
        missing,
        stats: {
            actualJs: actualFiles.js.size,
            actualCss: actualFiles.css.size,
            actualDts: actualFiles.dts.size,
            exported: exportedKeys.size
        }
    };
}

if (require.main === module) {
    try {
        checkExports();
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

module.exports = { checkExports };
