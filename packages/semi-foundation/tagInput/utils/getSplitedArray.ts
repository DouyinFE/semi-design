import { isString, isArray } from 'lodash-es';

/**
 * Get the splited array
 * @param {string} originString String to be splited
 * @param {string | string[]} separators
 * @returns {string[]} The splited result array
 */
const getSplitedArray = (originString: string, separators: string | string[]) => {
    let splitedValue: string | string[] = [];
    if (isString(separators)) {
        splitedValue = originString.split(separators);
    } else if (isArray(separators)) {
        const tempChar = separators[0]; // temporary splitter
        splitedValue = originString;
        for (let i = 1; i < separators.length; i++) {
            splitedValue = splitedValue.split(separators[i]).join(tempChar);
        }
        splitedValue = splitedValue.split(tempChar);
    }
    return splitedValue;
};

export default getSplitedArray;
