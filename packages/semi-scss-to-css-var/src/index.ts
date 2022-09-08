import path from 'path';
import fs from 'fs-extra';
import postcss from "postcss";
import postcssScss from 'postcss-scss';
import { transVarPlugin } from "./transVarPlugin";
import destroyDeps from "./utils/destroyDeps";


export interface Options {
    sourcePath: string,
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
    const ignoreFileList = ['semi-foundation/grid'];

    return scssFilePaths.filter(filepath => {
        for (const rule of ignoreFileList) {
            if (filepath.includes(rule)) {
                return false;
            }
        }
        return true;
    });
};


// const prepareTransDir = (sourcePath: string) => {
//     const tempDirPath = path.join(os.tmpdir(), `semi_scss_to_css_vars_${Math.random().toString(36).slice(-6)}`);
//     fs.copySync(sourcePath, tempDirPath);
//     return tempDirPath;
// }

const trimEnd = (str: string, end: string) => {
    str = str.trimEnd();
    end = end.trimEnd();
    if (str.slice(str.length - end.length) === end) {
        return str.slice(0, str.length - end.length);
    } else {
        return str;
    }
};

const transScssToCSSVar = (scssFilePathList: string[]) => {
    //scssFilePathList=['./test/test.scss'];
    //   let allCssDefine:{key:string,value:string}[] =[];
    for (const scssFilePath of scssFilePathList) {
        try {
            let raw = fs.readFileSync(scssFilePath, { encoding: 'utf-8' });
            // const scssVariableInSelectorSet = new Set<string>();
            // postcss([getScssVariableNotUsedInSelectorSetPlugin(scssVariableInSelectorSet)]).process(raw, { syntax: postcssScss }).css;

            if (scssFilePath.includes('variables.scss')){
                raw = destroyDeps(raw);
            }

            const cssDefine: { key: string, value: string }[] = [];

            const result = postcss([transVarPlugin(scssFilePath.includes('variables.scss'), cssDefine)]).process(raw, { syntax: postcssScss });
            const resultSCSS = result.css; //Real call postcss
            const rawCSSDefine = `.allCSSVar{\n${cssDefine.map(({ key, value }) => {
                return `${key}: #{${trimEnd(value, '!default')}};`;
            }).join('\n')}\n}`;
            fs.writeFileSync(scssFilePath, resultSCSS + '\n' + rawCSSDefine, "utf8");
            // allCssDefine=[...allCssDefine,...cssDefine];

        } catch (e) {
            console.error(e);
            console.error(`Error While processing ${scssFilePath}`);
        }

    }

    // fs.writeFileSync(path.join(resultPath),(()=>{
    //     return `$prefix:semi;\n.allCSSVar{\n${allCssDefine.map(({ key,value })=>{return `${key}:${value};`;}).join('\n')}\n}`;
    // })(),'utf-8');

};


const transScssVariables2CssVariables = ({ sourcePath }: Options) => {

    const transDir = sourcePath;
    const scssFileList = getAllScssFilesInPath(transDir);
    //transScssToCSSVar(["/Users/daiqiang/Project/semi-design/packages/semi-foundation/popover/variables.scss"]);
    transScssToCSSVar(scssFileList);
    return scssFileList;
};


export {
    transScssVariables2CssVariables
};

