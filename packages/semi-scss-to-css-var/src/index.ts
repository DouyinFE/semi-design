import path from 'path';
import fs from 'fs-extra';
import postcss from "postcss";
import postcssScss from 'postcss-scss';

export interface Options {
    targetPath: string,
    resultPath: string
}


const transScssVariables2CssVariables = ({targetPath, resultPath}: Options) => {


    const findScssFiles = (filePath: string): string[] => {

        const isScss = (filePath: string) => path.extname(filePath) === '.scss';

        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            if (isScss(filePath)) {
                return [filePath];
            } else {
                return [];
            }
        }
        const scssFilePaths: string[] = [];
        const fileList = fs.readdirSync(filePath);
        fileList.forEach(filename => {
            const stat = fs.statSync(path.join(filePath, filename));
            if (stat.isFile()) {
                if (isScss(filePath)) {
                    scssFilePaths.push(filePath);
                }
            } else {
                scssFilePaths.push(...findScssFiles(filePath));
            }
        });
        return scssFilePaths;
    }

    const scssFileList = findScssFiles(targetPath)

    console.log(scssFileList);

    // postcss().process('', {syntax: postcssScss}).


};


export {
    transScssVariables2CssVariables
};

