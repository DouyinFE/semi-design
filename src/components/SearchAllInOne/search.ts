import { withPrefix } from 'gatsby'
import { searchFuncResultItemInterface } from './index.interface';
import lodash from 'lodash-es';

export default function search(str,data,locale) {
    const { nodeMap, mdxInfoList } = data[locale];
    //搜索正文
    const getContext = (node) => {
        const context = [];
        while (node.parent) {
            context.push(nodeMap[node.parent].value);
            node = nodeMap[node.parent];
        }
        return context.reverse();
    };
    const calcHashViaAnchor=(anchor)=>{
        return '#'+encodeURI(anchor[0]==='#'?anchor.slice(1):anchor);
    }
    const typeCollection=['heading','text','code','jsx','list','listItem','root','strong','paragraph','table','tableCell'];
    const resultNodeListSortedByType={};
    //按照类型排序
    Object.entries(nodeMap)
        .map(([_, value]) => value)
        .filter((node) => {
            if (node.type === "jsx") return false;
            return new RegExp(`${lodash.escapeRegExp(str)}`,'i').test(node.value);
        }).map((item)=>{
            if(!resultNodeListSortedByType[item.type]){
                resultNodeListSortedByType[item.type]=[];
            }
            resultNodeListSortedByType[item.type].push(item);
        });        
    let resultNodeList=[];
    typeCollection.map((type)=>{
        resultNodeListSortedByType[type]&&(resultNodeList=resultNodeList.concat(resultNodeListSortedByType[type]));
    })
 
    let resultList = [];
    resultNodeList.map((node) => {
        const result:searchFuncResultItemInterface = {
            text: node.value,
            type: node.meanfulType,
            belong:node.belong,
            context: getContext(node),
            url: withPrefix(node.mdxInfo.slug + (node.anchor ?calcHashViaAnchor(node.anchor) : (node.parent?calcHashViaAnchor(nodeMap[node.parent].anchor):''))),
            mdxInfo:node.mdxInfo,
        };
        resultList.push(result);
    });

    //搜索mdx yaml (标题+brief)
    const resultMdxInfoList = mdxInfoList.filter((mdxInfo) => (new RegExp(`${lodash.escapeRegExp(str)}`,'i').test(mdxInfo.title) ) || (new RegExp(`${lodash.escapeRegExp(str)}`,'i').test(mdxInfo.brief&&mdxInfo.brief)));
    resultList = resultList.concat(
        resultMdxInfoList.map((mdxInfo) => {
            const keyInTitleOrBrief = new RegExp(`${lodash.escapeRegExp(str)}`,'i').test(mdxInfo.title) ? 'title' : 'brief';

            
            return {
                text: mdxInfo[keyInTitleOrBrief],
                type: keyInTitleOrBrief,
                belong:mdxInfo['belong'],
                url: withPrefix(mdxInfo.slug),
                mdxInfo
            };
        })
    );
  
    
    return resultList;
}