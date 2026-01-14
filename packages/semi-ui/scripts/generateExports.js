const fs = require('fs');
const path = require('path');

/**
 * 扫描目录，找到所有需要导出的文件
 */
function scanDirectory(dir, basePath = '') {
    const exports = {};
    
    if (!fs.existsSync(dir)) {
        return exports;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
            // 检查目录是否有 index.js
            const indexJsPath = path.join(fullPath, 'index.js');
            if (fs.existsSync(indexJsPath)) {
                // 为目录生成导出映射（指向 index.js）
                const exportKey = `./lib/es/${relativePath}`;
                const esPath = `lib/es/${relativePath}/index.js`;
                const cjsPath = `lib/cjs/${relativePath}/index.js`;
                const typesPath = `lib/es/${relativePath}/index.d.ts`;

                exports[exportKey] = {
                    types: `./${typesPath}`,
                    import: `./${esPath}`,
                    require: `./${cjsPath}`,
                    default: `./${esPath}`
                };
            }
            // 递归扫描子目录
            const subExports = scanDirectory(fullPath, relativePath);
            Object.assign(exports, subExports);
        } else if (entry.isFile()) {
            if (entry.name.endsWith('.js')) {
                // 找到 .js 文件，生成导出映射
                // relativePath 已经是相对于 lib/es 的路径
                // 生成两个键：带 .js 和不带 .js（因为导入时可能不带扩展名）
                const pathWithoutExt = relativePath.replace(/\.js$/, '');
                const exportKeyWithExt = `./lib/es/${relativePath}`;
                const exportKeyWithoutExt = `./lib/es/${pathWithoutExt}`;
                const esPath = `lib/es/${relativePath}`;
                const cjsPath = `lib/cjs/${relativePath}`;
                const typesPath = `lib/es/${relativePath.replace(/\.js$/, '.d.ts')}`;

                const exportValue = {
                    types: `./${typesPath}`,
                    import: `./${esPath}`,
                    require: `./${cjsPath}`,
                    default: `./${esPath}`
                };

                // 添加带扩展名的键
                exports[exportKeyWithExt] = exportValue;
                // 添加不带扩展名的键（如果不同）
                if (exportKeyWithExt !== exportKeyWithoutExt) {
                    exports[exportKeyWithoutExt] = exportValue;
                }
            } else if (entry.name.endsWith('.css')) {
                // 找到 .css 文件，生成导出映射
                const exportKey = `./lib/es/${relativePath}`;
                const esPath = `lib/es/${relativePath}`;
                const cjsPath = `lib/cjs/${relativePath}`;

                exports[exportKey] = {
                    import: `./${esPath}`,
                    require: `./${cjsPath}`,
                    default: `./${esPath}`
                };
            }
        }
    }

    return exports;
}

/**
 * 生成 exports 字段
 */
function generateExports() {
    const libEsPath = path.join(__dirname, '../lib/es');
    
    if (!fs.existsSync(libEsPath)) {
        console.error('Error: lib/es directory does not exist. Please run build:lib first.');
        process.exit(1);
    }

    console.log('Scanning lib/es directory...');
    const exports = scanDirectory(libEsPath, '');

    // 添加主入口
    const mainExports = {
        '.': {
            types: './lib/es/index.d.ts',
            import: './lib/es/index.js',
            require: './lib/cjs/index.js'
        }
    };

    // 添加 CSS 文件的通配符规则（作为回退）
    const cssExports = {
        './lib/es/*/*.css': {
            import: './lib/es/*/*.css',
            require: './lib/cjs/*/*.css',
            default: './lib/es/*/*.css'
        },
        './lib/es/*.css': {
            import: './lib/es/*.css',
            require: './lib/cjs/*.css',
            default: './lib/es/*.css'
        },
        './lib/cjs/*/*.css': {
            import: './lib/es/*/*.css',
            require: './lib/cjs/*/*.css',
            default: './lib/cjs/*/*.css'
        },
        './lib/cjs/*.css': {
            import: './lib/es/*.css',
            require: './lib/cjs/*.css',
            default: './lib/cjs/*.css'
        }
    };

    // 合并所有 exports
    const allExports = {
        ...mainExports,
        ...exports,
        ...cssExports
    };

    console.log(`Generated ${Object.keys(exports).length} export paths`);
    return allExports;
}

/**
 * 更新 package.json
 */
function updatePackageJson() {
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // 生成新的 exports
    const newExports = generateExports();

    // 更新 package.json
    packageJson.exports = newExports;

    // 写回文件
    fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 4) + '\n',
        'utf-8'
    );

    console.log('Successfully updated package.json exports field');
    console.log(`Total exports: ${Object.keys(newExports).length}`);
}

// 运行脚本
if (require.main === module) {
    try {
        updatePackageJson();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

module.exports = { generateExports, updatePackageJson };
