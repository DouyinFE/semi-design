const { compileCss } = require('@douyinfe/semi-scss-compile');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '../..', dir);
}

compileCss({
    foundationPath: resolve('semi-foundation/'),
    themePath: resolve('semi-theme-default/'),
    iconPath: resolve('semi-icons/'),
    /* REACT_18_START */
    outputPath: resolve('semi-ui/dist/css/semi.min.css'),
    /* REACT_18_END */
    /* REACT_19_START */
    // outputPath: resolve('semi-ui-19/dist/css/semi.min.css'),
    /* REACT_19_END */
    isMin: true
});

compileCss({
    foundationPath: resolve('semi-foundation/'),
    themePath: resolve('semi-theme-default/'),
    iconPath: resolve('semi-icons/'),
    /* REACT_18_START */
    outputPath: resolve('semi-ui/dist/css/semi.css'),
    /* REACT_18_END */
    /* REACT_19_START */
    // outputPath: resolve('semi-ui-19/dist/css/semi.css'),
    /* REACT_19_END */
    isMin: false
});

// 生成 layer 入口（Tailwind 等原子类库搭配使用：@import ... layer(semi) 归层，产物本身零 @layer）
const fs = require('fs');
const distCssDir = resolve('semi-ui/dist/css');
if (!fs.existsSync(distCssDir)) {
    fs.mkdirSync(distCssDir, { recursive: true });
}
fs.writeFileSync(
    path.join(distCssDir, 'semi.layer.css'),
    `/* Semi 聚合产物 layer 入口（Tailwind 等原子类库搭配使用）\n * 用法：入口声明 @layer theme, base, semi, utilities; 后 import 本文件\n * 原理：semi.css 本身零 @layer（普通规则），通过 @import ... layer(semi) 归入 semi 层\n */\n@import './semi.css' layer(semi);\n`
);
fs.writeFileSync(
    path.join(distCssDir, 'semi.layer.min.css'),
    `@import './semi.min.css' layer(semi);\n`
);
console.log('layer 入口已生成: dist/css/semi.layer.css');
