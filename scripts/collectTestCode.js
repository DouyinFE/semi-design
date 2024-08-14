const fs = require('fs');
const path = require('path');

function countLinesInFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    return lines.length;
}

function countTestFilesLines(directoryPath) {
    let totalLines = 0;

    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const testDirectoryPath = path.join(filePath, '__test__');
            if (fs.existsSync(testDirectoryPath)) {
                const testFiles = fs.readdirSync(testDirectoryPath);
                testFiles.forEach(testFile => {
                    if (testFile.endsWith('.test.js')) {
                        const testFilePath = path.join(testDirectoryPath, testFile);
                        totalLines += countLinesInFile(testFilePath);
                    }
                });
            }
        }
    });

    return totalLines;
}

const semiUiDirectoryPath = './packages/semi-ui'; // 替换成 semi-ui 文件夹的实际路径
const totalTestLines = countTestFilesLines(semiUiDirectoryPath);

console.log(`Total lines in test files: ${totalTestLines}`);