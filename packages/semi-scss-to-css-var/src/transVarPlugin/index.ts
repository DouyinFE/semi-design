import {AcceptedPlugin, Declaration, Postcss, Root} from "postcss";

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
            console.log(decl.variable,decl.prop,decl.value);
        },
    } as AcceptedPlugin
}


transVarPlugin.postcss=true;




export default transVarPlugin;
