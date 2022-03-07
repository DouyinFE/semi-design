import path from 'path';
import fs from 'fs-extra';


export interface Options {
    path:string
}

const transScssVariables2CssVariables = ({path}: Options) => {
    console.log(path);
};


export {
    transScssVariables2CssVariables
};

