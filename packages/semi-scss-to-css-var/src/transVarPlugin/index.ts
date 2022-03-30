import { AcceptedPlugin, Declaration, Postcss, Root } from "postcss";
import fs from 'fs-extra';
import parse from 'postcss-value-parser';
import replaceWithCalc from "../utils/replaceWithCalc";
import replaceOther from "../utils/replaceOther";
import { trimStart } from "lodash";



//
// let extraScss="";


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


            //@ts-ignore
            if (!decl.isVisited){
                let value = decl.value;
                value = replaceOther(value);
                value = replaceWithCalc(value);
                decl.value=value;


                //inject css variable define
                if (/\$[\w\d]+$/.test(decl.prop)){
                    const scssVariable=trimStart(decl.prop,'$');
                    const cssVariable =`--semi-css-${scssVariable}`;
                    const cssDeclaration=new Declaration({ prop:cssVariable,value:decl.value });
                    //@ts-ignore
                    cssDeclaration.isVisited=true;
                    decl.after(cssDeclaration);
                    decl.value=`var(${cssVariable})`;
                }
                //@ts-ignore
                decl.isVisited=true;
            }


        },
    } as AcceptedPlugin;
};


transVarPlugin.postcss=true;




export default transVarPlugin;
