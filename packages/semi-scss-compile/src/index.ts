import generateScssMap from './utils/generateSCSSMap';
import writeFile from './utils/writeFile';
import compilerFromScssMap from './utils/compiler';
import compileCss from './utils/compilerCss';
import path from 'path';
import fs from 'fs-extra';


export interface Options {
    foundationPath: string;
    themePath: string;
    iconPath: string;
    outputPath: string;
    isMin?: boolean
}

const compile = ({ foundationPath, themePath, iconPath, outputPath, isMin = false }: Options) => {
    const scssMap = generateScssMap(foundationPath, themePath, iconPath);
    const hasComponentScss = Object.values(scssMap.components).some((map: any) => map && Object.keys(map).length > 0);
    const hasThemeScss = scssMap.theme && Object.keys(scssMap.theme).length > 0;
    if (hasComponentScss && hasThemeScss) {
        // 旧链路：sass 编译（theme scss 注入，值版产物）
        const tempDir = writeFile(scssMap);
        const result = compilerFromScssMap(path.join(tempDir, 'index.scss'), isMin);
        fs.outputFileSync(outputPath, result.css);
    } else {
        // 智能链路：组件有 scss 走 scss 编译，没有走 css 真源；主题 css 产物（token/global/animation）优先
        compileCss({ foundationPath, themePath, iconPath, outputPath, isMin });
    }
};


export {
    compile,
    compileCss,
    generateScssMap,
    compilerFromScssMap,
    writeFile
};

