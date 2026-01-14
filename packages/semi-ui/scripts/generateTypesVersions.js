const fs = require('fs');
const path = require('path');

/**
 * 生成 typesVersions 字段
 */
function generateTypesVersions() {
    const libEsPath = path.join(__dirname, '../lib/es');
    
    if (!fs.existsSync(libEsPath)) {
        console.error('Error: lib/es directory does not exist. Please run build:lib first.');
        process.exit(1);
    }

    const typesVersions = {
        '*': {}
    };

    /**
     * 扫描目录，收集所有需要类型映射的路径
     */
    function scanDirectory(dir, basePath = '') {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                // 检查目录是否有 index.d.ts
                const indexDtsPath = path.join(fullPath, 'index.d.ts');
                if (fs.existsSync(indexDtsPath)) {
                    const key = `lib/es/${relativePath}`;
                    typesVersions['*'][key] = [
                        `${key}/index.d.ts`,
                        `${key}/index`
                    ];
                }
                // 递归扫描子目录
                scanDirectory(fullPath, relativePath);
            } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
                // 找到 .d.ts 文件
                const pathWithoutExt = relativePath.replace(/\.d\.ts$/, '');
                const key = `lib/es/${pathWithoutExt}`;
                
                // 添加映射
                if (!typesVersions['*'][key]) {
                    typesVersions['*'][key] = [];
                }
                typesVersions['*'][key].push(`${key}.d.ts`);
                typesVersions['*'][key].push(key);
            }
        }
    }

    scanDirectory(libEsPath, '');

    // 添加通配符规则作为回退（放在最后，确保明确映射优先）
    typesVersions['*']['lib/es/*'] = [
        'lib/es/*/index',
        'lib/es/*'
    ];
    typesVersions['*']['lib/es/*/*'] = [
        'lib/es/*/*.d.ts',
        'lib/es/*/*',
        'lib/es/*/*/index.d.ts',
        'lib/es/*/*/index'
    ];
    typesVersions['*']['lib/cjs/*'] = [
        'lib/cjs/*.d.ts',
        'lib/cjs/*',
        'lib/cjs/*/index.d.ts',
        'lib/cjs/*/index'
    ];
    typesVersions['*']['lib/cjs/*/*'] = [
        'lib/cjs/*/*.d.ts',
        'lib/cjs/*/*',
        'lib/cjs/*/*/index.d.ts',
        'lib/cjs/*/*/index'
    ];

    return typesVersions;
}

/**
 * 更新 package.json
 */
function updatePackageJson() {
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // 生成新的 typesVersions
    const newTypesVersions = generateTypesVersions();

    // 更新 package.json
    packageJson.typesVersions = newTypesVersions;

    // 写回文件
    fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 4) + '\n',
        'utf-8'
    );

    console.log('Successfully updated package.json typesVersions field');
    console.log(`Total type mappings: ${Object.keys(newTypesVersions['*']).length}`);
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

module.exports = { generateTypesVersions, updatePackageJson };
