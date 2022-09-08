import { trim } from "lodash";

const destroyDeps = (variablesRaw: string) => {
    const variables = variablesRaw.split('\n');
    const variablesMap = new Map<string, string>();
    const ignoreKeys = new Set<string>();
    variables.forEach(variable => {
        let [key, value] = variable.split(':');
        if (!value){
            return;
        }

        if (variable.includes("ignore-semi-css-trans")){
            ignoreKeys.add(key);
        }
        //remove comment
        if (value.includes('//')) {
            value = value.split('//')[0];
        }
        value = trim(value.trim(), ";");
        variablesMap.set(key, value);
    });
    const variablesMapCopy = new Map(variablesMap);
    variablesMap.forEach((value, key) => {
        const valueTrimmed = value.trim();
        if (ignoreKeys.has(key)){
            variablesMapCopy.set(key, value);
            return;
        }
        // @ts-ignore
        variablesMapCopy.set(key, valueTrimmed.replaceAll(/(\$[\w\d-_]+)/g, (match, p1) => {
            return variablesMapCopy.get(p1) || p1;
        }));

    });
    let result = '';
    variablesMapCopy.forEach((value, key) => {
        result += `${key}:${value};${ignoreKeys.has(key)?"//ignore-semi-css-trans":""}\n`;
    });

    return result;
};

export default destroyDeps;
