const fs = require('fs');
const path = require('path');
const lodash = require('lodash');


const isComment = codeLine => lodash.startsWith(codeLine, '//') || lodash.startsWith(codeLine, '/*');
const getTokenCategory = codeLine => {
    const categorySet = new Set(['color', 'width', 'height', 'spacing', 'radius', 'font', 'motion']);
    const firstWord = lodash.get(codeLine.match(/\$([\w\W]+?)-/), 1, { toLowerCase: () => null }).toLowerCase();
    if (firstWord) {
        return categorySet.has(firstWord) ? firstWord : 'other';
    } else {
        return 'other';
    }
};
const codeLineSplit = codeLine => {
    const [key, value, comment] = codeLine.split(/:|\/\/|\/\*/).map(code => code.trim()).filter(code => code);
    return { key, value: lodash.trimEnd(value, ';'), comment:comment && comment.replace("ignore-semi-css-trans", ""), category: getTokenCategory(codeLine), raw: codeLine };
};

const getGlobalDesignToken = () => {
    const globalScssContentArray = fs.readFileSync(path.join(__dirname, '../packages/semi-theme-default/scss/global.scss'), { encoding: 'utf-8' }).split('\n');
    const paletteScssContentArray = fs.readFileSync(path.join(__dirname, '../packages/semi-theme-default/scss/_palette.scss'), { encoding: 'utf-8' }).split('\n');
    const normalContentArray = fs.readFileSync(path.join(__dirname, '../packages/semi-theme-default/scss/variables.scss'), { encoding: 'utf-8' }).split('\n');
    const getLightAndDarkScss = scssFileContentArray => {
        const contentArray = scssFileContentArray.map(codeLine => codeLine.trim())
            .filter(codeLine => codeLine && !isComment(codeLine))
            .filter(codeLine => !codeLine.startsWith('}'))
            .filter(codeLine => !codeLine.startsWith('@'));
        // {key,value,category,raw};
        const rawData = {
            light: [],
            dark: []
        };
        let currentMode = 'light';
        for (let i in contentArray) {
            i = Number(i);
            const codeLine = contentArray[i];
            if (/body/.test(codeLine)) {
                if (/semi-always-dark/.test(codeLine)) {
                    currentMode = 'dark';
                }
                continue;
            }

            rawData[currentMode].push(codeLineSplit(codeLine));
        }
        return rawData;
    };

    let globalScssContent = getLightAndDarkScss(globalScssContentArray);
    let paletteContent = getLightAndDarkScss(paletteScssContentArray);

    const mergeCommentLightToDark = content => {
        const map = new Map();
        content.light.forEach(token => {
            const { key } = token;
            map.set(key, { light: token });
        });
        content.dark.forEach(token => {
            const { key } = token;
            const data = map.get(key);
            if (!data) {
                console.warn(`${key} in dark but not in light`);
                return;
            }
            data.dark = token;
        });
        Array.from(map.values()).forEach(({ light, dark }) => {
            if (!dark.comment) {
                dark.comment = light.comment;
            }
        });
        return content;
    };
    globalScssContent = mergeCommentLightToDark(globalScssContent);
    paletteContent = mergeCommentLightToDark(paletteContent);

    const normalContent = normalContentArray.map(codeLine => codeLine.trim())
        .filter(codeLine => codeLine && !isComment(codeLine))
        .map(codeLine => codeLineSplit(codeLine));
    return { global: globalScssContent, palette: paletteContent, normal: normalContent };
};

// 官网组件 design token 注入
async function main() {
    const componentVariablesMap = {};
    const semiUIDir = path.join(__dirname, '../packages/semi-foundation');
    fs.readdirSync(semiUIDir).map(dirname => {
        const variableSCSSPath = path.join(semiUIDir, dirname, 'variables.scss');
        if (fs.existsSync(variableSCSSPath)) {
            const raw = fs.readFileSync(variableSCSSPath, { encoding: 'utf-8' });
            const scssCodeLineList = raw.split('\n').filter(codeLine => codeLine && !isComment(codeLine));
            componentVariablesMap[dirname.toLowerCase()] = scssCodeLineList.map(codeLine => codeLineSplit(codeLine));
        }
    });
    componentVariablesMap.global = getGlobalDesignToken();
    const [_, __, savePath] = process.argv;
    fs.writeFileSync(savePath || './designToken.json', JSON.stringify(componentVariablesMap));
}

main();
