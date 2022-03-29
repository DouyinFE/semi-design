import { AcceptedPlugin, Declaration, Postcss, Root } from "postcss";
import fs from 'fs-extra';
import parse from 'postcss-value-parser';
import replaceWithCalc from "../utils/replaceWithCalc";
import replaceOther from "../utils/replaceOther";









const transVarPlugin=()=>{


    return {
        postcssPlugin:"semi-scss-to-css-var-plugin",
        Root(root:Root,postcss:Postcss){
            //console.log(root)
        },
        Once(root:Root){
            //  console.log(root)
        },
        Declaration(decl:Declaration){

            console.log(decl.value);

            //@ts-ignore
            if (!decl.isVisited){
                let value = decl.value;
                value = replaceOther(value);
                value = replaceWithCalc(value);
                decl.value=value;
                //@ts-ignore
                decl.isVisited=true;
            }

            // console.log(decl.value)
            // let valueRoot=parse(decl.value);
            // console.log(JSON.stringify(valueRoot,null,'    '))
            // console.log('-----')
            // fs.writeFileSync('./test.json',JSON.stringify(valueRoot,null,'    '),{encoding:'utf-8'})
            // console.log(parse(decl.value));
        },
    } as AcceptedPlugin;
};


transVarPlugin.postcss=true;




export default transVarPlugin;
