const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const { mergeWith } = require("lodash");


const isComment = codeLine => lodash.startsWith(codeLine, '//') || lodash.startsWith(codeLine, '/*');
const getTokenCategory = codeLine => {
    const categorySet = new Set(['color', 'width', 'height', 'spacing', 'radius', 'font', 'motion', "animation", "transition"]);
    const firstWord = lodash.get(codeLine.match(/\$([\w\W]+?)[-_]/), 1, { toLowerCase: () => null }).toLowerCase();
    if (firstWord) {
        return categorySet.has(firstWord) ? firstWord : 'other';
    } else {
        return 'other';
    }
};
const codeLineSplit = codeLine => {
    const [key, value, comment] = codeLine.split(/:|\/\/|\/\*/).map(code => code.trim()).filter(code => code);
    let category = getTokenCategory(codeLine);
    if (category === 'transition') {
        category = "animation";
    }
    return { key, value: lodash.trimEnd(value, ';'), comment: comment && comment.replace("ignore-semi-css-trans", ""), category: category, raw: codeLine };
};

const cssTokenCategory = key => {
    const name = key.replace(/^--semi-(?:cssvar-)?/, '');
    const category = name.split(/[-_]/)[0];
    return category === 'transition' ? 'animation' : category;
};

const parseCssDeclarations = css => {
    const result = [];
    const re = /(--semi-[A-Za-z0-9_-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = re.exec(css))) {
        const [raw, key, value] = match;
        result.push({
            key,
            value: value.trim(),
            category: cssTokenCategory(key),
            raw: raw.trim(),
        });
    }
    return result;
};

const getCssDesignToken = () => {
    const themeCssDir = path.join(__dirname, '../packages/semi-theme-default/css');
    const tokenCss = fs.readFileSync(path.join(themeCssDir, 'token.css'), 'utf-8');
    const globalCss = fs.readFileSync(path.join(themeCssDir, 'global.css'), 'utf-8');
    const animationCss = fs.readFileSync(path.join(themeCssDir, 'animation.css'), 'utf-8');

    // global.css 当前由四个平面 block 组成：亮/暗 palette + 亮/暗 semantic。
    const blocks = [...globalCss.matchAll(/[^{}]+\{([\s\S]*?)\}/g)].map(match => match[1]);
    const parseBlock = content => parseCssDeclarations(content).filter(token => !token.key.startsWith('--semi-cssvar-'));
    const tokenList = parseCssDeclarations(tokenCss);
    const normal = tokenList
        .filter(token => token.key.startsWith('--semi-cssvar-'))
        .map(token => ({
            ...token,
            key: `$${token.key.replace('--semi-cssvar-', '')}`,
            category: cssTokenCategory(token.key),
        }));

    return {
        global: {
            light: parseBlock(blocks[2] || ''),
            dark: parseBlock(blocks[3] || ''),
        },
        palette: {
            light: parseBlock(blocks[0] || ''),
            dark: parseBlock(blocks[1] || ''),
        },
        normal,
        animation: parseCssDeclarations(animationCss),
    };
};

const getGlobalDesignToken = () => {
    if (!fs.existsSync(path.join(__dirname, '../packages/semi-theme-default/scss/global.scss'))) {
        return getCssDesignToken();
    }
    const globalScssContentArray = fs.readFileSync(path.join(__dirname, '../packages/semi-theme-default/scss/global.scss'), { encoding: 'utf-8' }).split('\n');
    const paletteScssContentArray = fs.readFileSync(path.join(__dirname, '../packages/semi-theme-default/scss/_palette.scss'), { encoding: 'utf-8' }).split('\n');
    const animationScssContentArray = fs.readFileSync(path.join(__dirname, '../packages/semi-theme-default/scss/animation.scss'), { encoding: 'utf-8' }).split('\n');
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

    const animationContent = animationScssContentArray.map(codeLine => codeLine.trim())
        .filter(codeLine => codeLine && !isComment(codeLine))
        .filter(codeLine => !codeLine.startsWith('body'))
        .filter(codeLine => !codeLine.startsWith('}'))
        .filter(codeLine => !codeLine.startsWith('@'))
        .map(codeLine => codeLineSplit(codeLine)).map(token => {
            token.category = "animation";
            return token;
        });
    return { global: globalScssContent, palette: paletteContent, normal: normalContent, animation: animationContent };
};

// 官网组件 design token 注入
async function main() {
    const componentVariablesMap = {};
    const animationVariablesMap = {};
    const semiUIDir = path.join(__dirname, '../packages/semi-foundation');
    const themeScssExists = fs.existsSync(path.join(__dirname, '../packages/semi-theme-default/scss'));
    fs.readdirSync(semiUIDir).map(dirname => {
        const variableSCSSPath = path.join(semiUIDir, dirname, 'variables.scss');
        if (fs.existsSync(variableSCSSPath)) {
            const raw = fs.readFileSync(variableSCSSPath, { encoding: 'utf-8' });
            const scssCodeLineList = raw.split('\n').filter(codeLine => codeLine && !isComment(codeLine));
            componentVariablesMap[dirname.toLowerCase()] = scssCodeLineList.map(codeLine => codeLineSplit(codeLine));
        }
        const animationSCSSPath = path.join(semiUIDir, dirname, 'animation.scss');
        if (fs.existsSync(animationSCSSPath)) {
            const raw = fs.readFileSync(animationSCSSPath, { encoding: 'utf-8' });
            const scssCodeLineList = raw.split('\n').filter(codeLine => codeLine && !isComment(codeLine));
            animationVariablesMap[dirname.toLowerCase()] = scssCodeLineList.map(codeLine => codeLineSplit(codeLine));
        }
        if (!themeScssExists) {
            const cssPath = path.join(semiUIDir, dirname, `${dirname}.css`);
            if (!fs.existsSync(cssPath)) return;
            const tokenMap = new Map(getCssDesignToken().normal.map(token => [token.key.slice(1), token.value]));
            const refs = new Set();
            const css = fs.readFileSync(cssPath, 'utf-8');
            const refRe = /var\(--semi-cssvar-([A-Za-z_][A-Za-z0-9_-]*)\)/g;
            let match;
            while ((match = refRe.exec(css))) refs.add(match[1]);
            componentVariablesMap[dirname.toLowerCase()] = [...refs].map(name => ({
                key: `$${name}`,
                value: tokenMap.get(name) || '',
                category: getTokenCategory(`$${name}`),
                raw: `$${name}: ${tokenMap.get(name) || ''};`,
            }));
        }
    });
    mergeWith(componentVariablesMap, animationVariablesMap, (objValue, srcValue)=>{
        if (Array.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    });
    componentVariablesMap.global = getGlobalDesignToken();
    const [_, __, savePath] = process.argv;
    fs.writeFileSync(savePath || './designToken.json', JSON.stringify(componentVariablesMap));
}

main();
