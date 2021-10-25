const fs = require("fs");
const readline = require("readline");

function search(str) {
    const locale = "zh-CN";
    const { nodeMap, mdxInfoList } = JSON.parse(fs.readFileSync("data_client.json"))[locale];

    //搜索正文
    const getContext = (node) => {
        let context = [];
        while (node.parent) {
            context.push(nodeMap[node.parent].value);
            node = nodeMap[node.parent];
        }
        return context.reverse();
    };
    const resultNodeList = Object.entries(nodeMap)
        .map(([_, value]) => value)
        .filter((node) => {
            if (node.type === "jsx") return false;
            return node.value.indexOf(str) !== -1;
        });

    let resultList = [];
    resultNodeList.map((node) => {
        const result = {
            text: node.value,
            type: node.meanfulType,
            context: getContext(node).join(" => "),
            url: "https://semi.design/design/" + node.mdxInfo.slug + (node.anchor ? node.anchor : nodeMap[node.parent].anchor),
        };
        resultList.push(result);
    });

    //搜索mdx yaml (标题+brief)
    const resultMdxInfoList = mdxInfoList.filter((mdxInfo) => mdxInfo.title.indexOf(str) !== -1 || (mdxInfo.brief&&mdxInfo.brief.indexOf(str) !== -1));
    resultList = resultList.concat(
        resultMdxInfoList.map((mdxInfo) => {
            const keyInTitleOrBrief = mdxInfo.title.indexOf(str) !== -1 ? "title" : "brief";
            return {
                text: mdxInfo[keyInTitleOrBrief],
                type: keyInTitleOrBrief,
                url: "https://semi.design/design/" + mdxInfo.slug,
            };
        })
    );
    return resultList;
}

function readSyncByRl(tips) {
    tips = tips || "> ";

    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

readSyncByRl("请输入搜索关键词：").then((res) => {
    search(res);
});
