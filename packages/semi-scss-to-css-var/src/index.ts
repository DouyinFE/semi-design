import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import postcss from "postcss";
import postcssScss from 'postcss-scss';
import transVarPlugin from "./transVarPlugin";

export interface Options {
    sourcePath: string,
    resultPath: string
}

const getAllScssFilesInPath = (filePath: string) => {
    if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(filePath);
    }

    const isScss = (filePath: string) => path.extname(filePath) === '.scss';

    const stat = fs.lstatSync(filePath);
    if (stat.isSymbolicLink()) {
        return [];
    }
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
        const pathOfCurrentFile = path.join(filePath, filename);
        const stat = fs.lstatSync(pathOfCurrentFile);
        if (stat.isSymbolicLink()) {
            return;
        } else if (stat.isFile()) {
            if (isScss(pathOfCurrentFile)) {
                scssFilePaths.push(pathOfCurrentFile);
            }
        } else {
            scssFilePaths.push(...getAllScssFilesInPath(pathOfCurrentFile));
        }
    });
    return scssFilePaths;
}


const prepareTransDir = (sourcePath: string) => {
    const tempDirPath = path.join(os.tmpdir(), `semi_scss_to_css_vars_${Math.random().toString(36).slice(-6)}`);
    fs.copySync(sourcePath, tempDirPath);
    return tempDirPath;
}


const transScssToCSSVar=(scssFilePath:string)=>{
    let test='./test/test.scss'
    const raw=fs.readFileSync(test,{encoding:'utf-8'});
    const result=postcss([transVarPlugin()]).process(raw, {syntax: postcssScss});
    const aaa = result.css;
    console.log('result ---------------------------')
    console.log(aaa)
}


const transScssVariables2CssVariables = ({sourcePath, resultPath}: Options) => {

    const transDir = prepareTransDir(sourcePath);
    const scssFileList = getAllScssFilesInPath(transDir);
    transScssToCSSVar(scssFileList[0])
    return scssFileList;
};





export {
    transScssVariables2CssVariables
};

