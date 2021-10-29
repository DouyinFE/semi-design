const fs = require("fs");
// function decycle(object, replacer) {
//     let objects = new WeakMap(); // object to path mappings
//     return (function derez(value, path) {
//         let old_path; // The path of an earlier occurance of value
//         let nu; // The new object or array

//         if (replacer !== undefined) {
//             value = replacer(value);
//         }
//         if (typeof value === "object" && value !== null && !(value instanceof Boolean) && !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) && !(value instanceof String)) {
//             old_path = objects.get(value);
//             if (old_path !== undefined) {
//                 return { $ref: old_path };
//             }
//             objects.set(value, path);
//             if (Array.isArray(value)) {
//                 nu = [];
//                 value.forEach(function(element, i) {
//                     nu[i] = derez(element, path + "[" + i + "]");
//                 });
//             } else {
//                 nu = {};
//                 Object.keys(value).forEach(function(name) {
//                     nu[name] = derez(value[name], path + "[" + JSON.stringify(name) + "]");
//                 });
//             }
//             return nu;
//         }
//         return value;
//     })(object, "$");
// }

// function retrocycle($) {
//     let px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;
//     (function rez(value) {
//         if (value && typeof value === "object") {
//             if (Array.isArray(value)) {
//                 value.forEach(function(element, i) {
//                     if (typeof element === "object" && element !== null) {
//                         let path = element.$ref;
//                         if (typeof path === "string" && px.test(path)) {
//                             value[i] = eval(path);
//                         } else {
//                             rez(element);
//                         }
//                     }
//                 });
//             } else {
//                 Object.keys(value).forEach(function(name) {
//                     let item = value[name];
//                     if (typeof item === "object" && item !== null) {
//                         let path = item.$ref;
//                         if (typeof path === "string" && px.test(path)) {
//                             value[name] = eval(path);
//                         } else {
//                             rez(item);
//                         }
//                     }
//                 });
//             }
//         }
//     })($);
//     return $;
// }
class SingleMdxProcessor {
    constructor(mdxNode) {
        this.belong=`component`;
        this.mdxID = mdxNode.id;
        this.slug = mdxNode.fields.slug;
        this.headingContext=mdxNode.tableOfContents.items;
        this.locale = this.slug.indexOf("en-US") === -1 ? "zh-CN" : "en-US";
        this.nodeMap={}
        this.mdxInfo = {
            slug: this.slug,
            belong:this.belong,
            brief: mdxNode.frontmatter.brief,
            title: mdxNode.frontmatter.title,
            folder:mdxNode.fields.type,
            nodeUniqueIDList: [],
        };
        this.closestAnchorAncestorUniqueID=null;
        this.headingNodeMap={}
        this.processChildNode(mdxNode.mdxAST,null,null);
        this.processHeadingParent();

    }

    getMdxInfo(){
        //暂时无用 删除以缩小文件体积
        delete this.mdxInfo['nodeUniqueIDList'];
        return {mdxInfo:this.mdxInfo,locale:this.locale,nodeMap:this.nodeMap};
    }

    processHeadingParent(ancestor=null,items=this.headingContext){
        if(!items)
            return;
        for(let item of items){
            let headingNode=this.headingNodeMap[item.title];
            if(!headingNode)
                continue;
            headingNode.parent=ancestor?ancestor.uniqueID:null;
            //使用 heading context 修正 anchor
            headingNode.anchor=item.url?item.url:headingNode.value;
            if(item.items){
                this.processHeadingParent(headingNode,item.items);
            }
        }
    }


    processChildNode(childNode, meaningfulType) {
        const belong=this.belong;
        const mdxID = this.mdxID;
        const mdxInfo = this.mdxInfo;
        const type=childNode.type;
        const uniqueID = `${mdxID}#${type}#${Math.random()}`;
        if (type === "heading") {
            const value = childNode.children[0].value;
            const anchor = '#'+value;
            const node = {
                uniqueID,
                belong,
                type,
                value,
                parent:null,
                anchor,
                mdxInfo,
                meaningfulType: "heading",
            };
            this.nodeMap[uniqueID] = node;
            this.closestAnchorAncestorUniqueID=node.uniqueID;
            this.mdxInfo.nodeUniqueIDList.push(uniqueID);
            this.headingNodeMap[value]=node;
            return;
        }
        if (type === "text") {
            const value = childNode.value;
            const node = {
                uniqueID,
                belong,
                type,
                value,
                parent:this.closestAnchorAncestorUniqueID,
                mdxInfo,
                meaningfulType,
            };
            this.nodeMap[uniqueID] = node;
            this.mdxInfo.nodeUniqueIDList.push(uniqueID);
            return;
        }
        if (type === "code" || type === "jsx") {
            return;
            const value = childNode.value;
            const node = {
                uniqueID,
                belong,
                type,
                value,
                parent:this.closestAnchorAncestorUniqueID,
                mdxInfo,
                meaningfulType: type,
            };
            this.nodeMap[uniqueID] = node;
            this.mdxInfo.nodeUniqueIDList.push(uniqueID);
            return;
        }


        if (type === "list"||type==='listItem'||type==='root'||type==='strong') {
            for (let child of childNode.children) {
                this.processChildNode(child,type);
            }
            return;
        }
    
        if (type === "paragraph" || type === "table" || type === "tableCell") {
            for (let child of childNode.children) {
                this.processChildNode(child, type === "paragraph" ? "paragraph" : "table");
            }
            return;
        }
    }
}

function processGraphQLData(rawGraphQLData,extraDataCallback) {
    const {data}=rawGraphQLData;
    // let data = null;
    // try {
    //     data = JSON.parse(fs.readFileSync("search/data_graphQL.json")).data;
    //     if (!data) {
    //         console.error("FATAL ERROR: GraphQL data in empty. Data:", data);
    //         process.exit(1);
    //     }
    // } catch (e) {
    //     console.error("FATAL ERROR: Run GraphQL for searching failed! Error message: " + e);
    //     process.exit(1);
    // }

    let dataToClient = {
        'zh-CN': { mdxInfoList: [], nodeMap: {} },
        'en-US': { mdxInfoList: [], nodeMap: {} },
    };
    const nodeArray = data.allMdx.nodes;
    //开始解析mdxNode
    nodeArray.map(mdxNode=>{
        const {mdxInfo,locale,nodeMap}=(new SingleMdxProcessor(mdxNode,dataToClient)).getMdxInfo();
        dataToClient[locale].mdxInfoList.push(mdxInfo);
        Object.assign(dataToClient[locale].nodeMap,nodeMap);
    })

    //暂时无用 删除以缩小文件体积
    dataToClient['zh-CN'].mdxInfoList;
    dataToClient['en-US'].mdxInfoList;

    extraDataCallback&&extraDataCallback(dataToClient);
    try {
        fs.writeFileSync("search/data_client.json",JSON.stringify(dataToClient));
    } catch (e) {
        console.error("FATAL ERROR: Can not write search data to disk.");
        process.exit(1);
    }
}

module.exports=processGraphQLData;
