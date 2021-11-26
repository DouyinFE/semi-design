import generateScssMap from "./utils/generateSCSSMap";
import writeFile from "./utils/writeFile";
import compilerFromScssMap from "./utils/compiler";
import path from "path";
import fs from 'fs-extra';


export interface Options {
    isMin?: boolean,
}

const compile = (foundationPath: string, themePath: string, outputPath: string, { isMin = false }: Options = {}) => {
    const scssMap = generateScssMap(foundationPath, themePath);
    const tempDir = writeFile(scssMap);
    const result = compilerFromScssMap(path.join(tempDir, 'index.scss'), isMin);
    fs.outputFileSync(outputPath, result.css);
};


export {
    compile,
    generateScssMap,
    compilerFromScssMap,
    writeFile
};

