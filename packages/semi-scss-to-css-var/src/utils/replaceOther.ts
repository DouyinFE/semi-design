const replaceOther = (str:string)=>{
    return str.replace(/-(\$[\w\d]+)/,"-1 * $1");

};

export default replaceOther;
