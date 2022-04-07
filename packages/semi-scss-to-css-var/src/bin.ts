#!/usr/bin/env node

import arg from 'arg';
import { transScssVariables2CssVariables } from './index';
import { generateScssMap, writeFile, compilerFromScssMap } from '@douyinfe/semi-scss-compile';
import path from 'path';
import fs from 'fs-extra';

const main = () => {
    console.log('bin exec');
    const foundationPath = path.resolve("../semi-foundation");
    const themePath = path.resolve('../semi-theme-default');
    const iconPath = path.resolve('../semi-icons');
    const distPath= path.resolve('./dist');
    //const cssVarPath  = path.join(distPath,'allCSSVar.scss');
    fs.emptyDirSync(distPath);
    transScssVariables2CssVariables({ sourcePath:foundationPath });
    const isMin = false;
    const scssMap = generateScssMap(foundationPath, themePath,iconPath);
    // scssMap.theme["index.scss"]=scssMap.theme["index.scss"]+`\n@import "${cssVarPath}";\n`;
    const tempDir = writeFile(scssMap);
    const result = compilerFromScssMap(path.join(tempDir, 'index.scss'), isMin);
    fs.outputFileSync(path.join(distPath,'semi.cssvar.css'), result.css);

};

main();
