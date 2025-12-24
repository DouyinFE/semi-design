// 直接实现函数，因为代码被打包了
const UNPKG_BASE_URL = 'https://unpkg.com';
const NPMMIRROR_BASE_URL = 'https://registry.npmmirror.com';

function flattenDirectoryStructure(item, result = []) {
  result.push({
    path: item.path,
    type: item.type,
    size: item.size,
  });
  if (item.files && Array.isArray(item.files)) {
    for (const file of item.files) {
      flattenDirectoryStructure(file, result);
    }
  }
  return result;
}

async function fetchDirectoryListFromSource(baseUrl, packageName, version, path, isNpmMirror = false) {
  const url = isNpmMirror
    ? `${baseUrl}/${packageName}/${version}/files/${path}/?meta`
    : `${baseUrl}/${packageName}@${version}/${path}/?meta`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`获取目录列表失败: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`API 返回了非 JSON 格式: ${contentType}`);
  }

  const data = await response.json();

  const normalizeType = (item) => {
    const path = item.path;
    if (path.endsWith('/')) return { path, type: 'directory' };
    if (item.type && item.type.includes('/')) return { path, type: 'file' };
    if (item.type === 'directory') return { path, type: 'directory' };
    return { path, type: 'file' };
  };

  if (Array.isArray(data)) {
    return data.map(normalizeType);
  }

  if (data && typeof data === 'object' && 'files' in data) {
    if (Array.isArray(data.files)) {
      const flattened = [];
      for (const item of data.files) {
        flattenDirectoryStructure(item, flattened);
      }
      return flattened.map(normalizeType);
    }
    return [];
  }

  if (data && typeof data === 'object' && 'path' in data) {
    const singleItem = data;
    if (singleItem.files && Array.isArray(singleItem.files)) {
      const flattened = [];
      flattenDirectoryStructure(singleItem, flattened);
      return flattened.map(normalizeType);
    }
    return [normalizeType(singleItem)];
  }

  throw new Error('无法解析目录列表数据格式');
}

async function fetchFileContentFromSource(baseUrl, packageName, version, filePath, isNpmMirror = false) {
  const url = isNpmMirror
    ? `${baseUrl}/${packageName}/${version}/files/${filePath}`
    : `${baseUrl}/${packageName}@${version}/${filePath}`;

  const response = await fetch(url, {
    headers: { Accept: 'text/plain, application/json, */*' },
  });

  if (!response.ok) {
    throw new Error(`获取文件失败: ${response.status} ${response.statusText}`);
  }

  const content = await response.text();

  if (content.trim().startsWith('<!DOCTYPE html>') || content.includes('npmmirror 镜像站')) {
    throw new Error('返回了 HTML 错误页面');
  }

  return content;
}

const packageName = '@douyinfe/semi-ui';
const version = '2.89.2-alpha.3';
const componentName = 'table';

async function testUnpkg() {
  console.log('\n' + '='.repeat(80));
  console.log('测试 UNPKG 数据源');
  console.log('='.repeat(80));
  
  try {
    console.log('\n1. 获取目录列表...');
    const files = await fetchDirectoryListFromSource(
      UNPKG_BASE_URL,
      packageName,
      version,
      'content',
      false
    );
    
    console.log(`   找到 ${files.length} 个文件/目录`);
    
    const tableFiles = files.filter((file) => {
      const path = file.path.toLowerCase();
      return path.includes(componentName) && file.type === 'file';
    });
    
    console.log(`   找到 ${tableFiles.length} 个 table 相关文件:`);
    tableFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.path} (${file.type})`);
    });
    
    if (tableFiles.length > 0) {
      console.log('\n2. 获取文档内容...');
      for (const file of tableFiles.slice(0, 2)) { // 只获取前两个文件
        const filePath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
        console.log(`\n   文件: ${file.path}`);
        console.log('   ' + '-'.repeat(76));
        
        try {
          const content = await fetchFileContentFromSource(
            UNPKG_BASE_URL,
            packageName,
            version,
            filePath,
            false
          );
          
          console.log(`   内容长度: ${content.length} 字符`);
          console.log(`   内容预览 (前500字符):`);
          console.log('   ' + content.substring(0, 500).replace(/\n/g, '\n   '));
          console.log('   ...');
        } catch (error) {
          console.error(`   获取失败: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`\n错误: ${error.message}`);
    console.error(error.stack);
  }
}

async function testNpmMirror() {
  console.log('\n' + '='.repeat(80));
  console.log('测试 NPMMIRROR 数据源');
  console.log('='.repeat(80));
  
  try {
    console.log('\n1. 获取目录列表...');
    const files = await fetchDirectoryListFromSource(
      NPMMIRROR_BASE_URL,
      packageName,
      version,
      'content',
      true
    );
    
    console.log(`   找到 ${files.length} 个文件/目录`);
    
    const tableFiles = files.filter((file) => {
      const path = file.path.toLowerCase();
      return path.includes(componentName) && file.type === 'file';
    });
    
    console.log(`   找到 ${tableFiles.length} 个 table 相关文件:`);
    tableFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.path} (${file.type})`);
    });
    
    if (tableFiles.length > 0) {
      console.log('\n2. 获取文档内容...');
      for (const file of tableFiles.slice(0, 2)) { // 只获取前两个文件
        const filePath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
        console.log(`\n   文件: ${file.path}`);
        console.log('   ' + '-'.repeat(76));
        
        try {
          const content = await fetchFileContentFromSource(
            NPMMIRROR_BASE_URL,
            packageName,
            version,
            filePath,
            true
          );
          
          console.log(`   内容长度: ${content.length} 字符`);
          console.log(`   内容预览 (前500字符):`);
          console.log('   ' + content.substring(0, 500).replace(/\n/g, '\n   '));
          console.log('   ...');
        } catch (error) {
          console.error(`   获取失败: ${error.message}`);
        }
      }
    } else {
      console.log('\n   注意: 未找到 table 文件，可能是嵌套结构未完全扁平化');
      console.log(`   前10个文件/目录示例:`);
      files.slice(0, 10).forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.path} (${file.type})`);
      });
    }
  } catch (error) {
    console.error(`\n错误: ${error.message}`);
    console.error(error.stack);
  }
}

async function compareSources() {
  console.log('\n' + '='.repeat(80));
  console.log('对比两个数据源');
  console.log('='.repeat(80));
  
  const filePath = 'content/show/table/index.md';
  
  try {
    console.log('\n同时从两个数据源获取文件...');
    const [unpkgResult, npmmirrorResult] = await Promise.allSettled([
      fetchFileContentFromSource(UNPKG_BASE_URL, packageName, version, filePath, false),
      fetchFileContentFromSource(NPMMIRROR_BASE_URL, packageName, version, filePath, true),
    ]);
    
    console.log('\nUNPKG 结果:');
    if (unpkgResult.status === 'fulfilled') {
      const content = unpkgResult.value;
      console.log(`  ✓ 成功获取，内容长度: ${content.length} 字符`);
      console.log(`  预览: ${content.substring(0, 100).replace(/\n/g, ' ')}...`);
    } else {
      console.log(`  ✗ 失败: ${unpkgResult.reason?.message || '未知错误'}`);
    }
    
    console.log('\nNPMMIRROR 结果:');
    if (npmmirrorResult.status === 'fulfilled') {
      const content = npmmirrorResult.value;
      console.log(`  ✓ 成功获取，内容长度: ${content.length} 字符`);
      console.log(`  预览: ${content.substring(0, 100).replace(/\n/g, ' ')}...`);
    } else {
      console.log(`  ✗ 失败: ${npmmirrorResult.reason?.message || '未知错误'}`);
    }
    
    if (unpkgResult.status === 'fulfilled' && npmmirrorResult.status === 'fulfilled') {
      const unpkgContent = unpkgResult.value;
      const npmmirrorContent = npmmirrorResult.value;
      
      console.log('\n对比结果:');
      console.log(`  内容长度差异: ${Math.abs(unpkgContent.length - npmmirrorContent.length)} 字符`);
      console.log(`  内容是否相同: ${unpkgContent === npmmirrorContent ? '是' : '否'}`);
      
      if (unpkgContent !== npmmirrorContent) {
        // 找出第一个不同的位置
        let diffIndex = 0;
        const minLength = Math.min(unpkgContent.length, npmmirrorContent.length);
        for (let i = 0; i < minLength; i++) {
          if (unpkgContent[i] !== npmmirrorContent[i]) {
            diffIndex = i;
            break;
          }
        }
        console.log(`  第一个差异位置: 第 ${diffIndex} 个字符`);
        console.log(`  UNPKG 片段: ${unpkgContent.substring(diffIndex, diffIndex + 50)}`);
        console.log(`  NPMMIRROR 片段: ${npmmirrorContent.substring(diffIndex, diffIndex + 50)}`);
      }
    }
  } catch (error) {
    console.error(`\n对比失败: ${error.message}`);
  }
}

async function main() {
  console.log('Table 组件文档测试脚本');
  console.log(`包名: ${packageName}`);
  console.log(`版本: ${version}`);
  console.log(`组件: ${componentName}`);
  
  await testUnpkg();
  await testNpmMirror();
  await compareSources();
  
  console.log('\n' + '='.repeat(80));
  console.log('测试完成');
  console.log('='.repeat(80));
}

main().catch(console.error);

