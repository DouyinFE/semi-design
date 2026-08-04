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
    const tempDir = writeFile(scssMap);
    const result = compilerFromScssMap(path.join(tempDir, 'index.scss'), isMin);
    fs.outputFileSync(outputPath, result.css);
};


export {
    compile,
    compileCss,
    generateScssMap,
    compilerFromScssMap,
    writeFile
};

