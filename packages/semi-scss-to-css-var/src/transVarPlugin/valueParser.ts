import {trimEnd, trimStart} from "lodash";

const valueParser = (str:string)=>{
    const splitToGroup=(()=>{
//
//
//xxxxx xxx $a + $b
//
//xxxxx xxx $a + 1 + $b
//
//xxxxx  xxx  $a + $b + 1 xxxxx  $c + $6
//  xxxx xxx  calc($a + $b + 1 xxxxx  $c + $6)
//
//xxxxx xxx $a - ($b + ($x + $y)+ $c)
//
//xxxxx xxx  (1 + $a - (1 + $c))
//
        const splitWithSpace = str.split('\s');

        const isStrInfluenceLeft = (str: string) => {
            if (str{
                const trimmed = str.trim();
                return ['+', '-', '*', '/', ')'].includes(trimmed[0]);
            }
            return false;

        }

        const isStrInfluenceRight = (str: string) => {
            if (str) {
                const trimmed = str.trim();
                return ['+', '-', '*', '/', '('].includes(trimmed[trimmed.length - 1]);
            }
            return false;
        }

        let groupIndex:{start:number,end:number}[]=[];
        let i =0;
        let start: number | null = null
        let end: number | null = null;
        while (i < splitWithSpace.length) {
            const str = splitWithSpace[i];
            let calcStartFlag=false;
            let calcEndFlag = false;

            if (isStrInfluenceLeft(str)) {
                calcEndFlag = true;
            }


            if (calcEndFlag) {
                (() => {
                    //find Start
                    let j = i - 1;
                    let currentStrIsInfluenced = true;
                    let currentStrIsInBucket = splitWithSpace[i].includes(')') || splitWithSpace[j]?.includes(')');
                    while (j >= 0) {
                        const str = splitWithSpace[j];
                        if (str.includes('(')) {
                            currentStrIsInBucket = false;
                        }
                        if (isStrInfluenceRight(str)) {

                        } else if (isStrInfluenceLeft(str)) {
                            currentStrIsInfluenced = true;
                        } else {

                        }
                        j--;


                    }
                })()
            }
            if(calcStartFlag){
            }

            if(!calcStartFlag && !calcEndFlag){
                i++;
            }
        }



        return str;

    })()
}


const oldValueParser = () => {
    const mergeArrayItem = (array: string[], start: number, end: number) => {
        let newArray = [];
        newArray.push(...array.slice(0, start));
        newArray.push(array.slice(start, end + 1).join(' '));
        newArray.push(...array.slice(end + 1));
        return newArray;
    }

    const stringReplace = (str: string, start: number, end: number, replaceStr: string) => {
        return str.slice(0, start) + replaceStr + str.slice(end + 1);
    }

    const replaceWithCalc = (str: string): string => {


        const codeGroup = []
        const format = (str: string) => {
            str = (() => {
                //remove css func in start
                if (/^([a-z]+)\(/.test(str)) {
                    return trimEnd(trimStart(str.replace(/^([a-z]+)/, ''), '('), ')');
                } else {
                    return str;
                }
            })();
            let newStr = '';
            for (let i = 0; i < str.length; i++) {
                if (/\+|\-|\*|\/|\)|((?<=(\+|\-|\*|\/))\()|([a-z]+\()/.test(str[i])) {
                    newStr += ` ${str[i]} `
                } else {
                    newStr += str[i];
                }
            }
            return newStr;
        }
        const splitWithSpace = (() => {
            let splitWithSpace = str.split('\s');

            let temp: string[] = [];
            splitWithSpace.forEach(s => {
                let formatted = format(s).split('\s');
                temp.concat(formatted);
            })
            splitWithSpace = temp;
            return splitWithSpace;
        })();


        const mergeBracket = (str: string) => {
            const stack: string[] = [];
            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                if (char === '(') {
                    stack.push('(');
                } else if (char === ')') {
                    let tempStr = '';
                    while (true) {
                        const topChar = stack[stack.length - 1];
                        if (topChar !== '(') {
                            tempStr += stack.pop();
                        } else {
                            stack.pop();
                            stack.push(...replaceWithCalc(tempStr.split('').reverse().join('')).split(''))
                            break;
                        }
                    }
                } else {
                    stack.push(char);
                }
            }
            return `calc[${stack.join('')}]`;
        }


        const isStrInfluenceLeft = (str: string) => {
            if (str{
                const trimmed = str.trim();
                return ['+', '-', '*', '/', ')'].includes(trimmed[0]);
            }
            return false;

        }

        const isStrInfluenceRight = (str: string) => {
            if (str) {
                const trimmed = str.trim();
                return ['+', '-', '*', '/', '('].includes(trimmed[trimmed.length - 1]);
            }
            return false;
        }

        console.log('start', splitWithSpace)
        let i = 0;
        let mergeToCalcGroupIndex: { start: number, end: number }[] = [];
        while (i < splitWithSpace.length) {
            const str = splitWithSpace[i];
            let start: number | null = null
            let end: number | null = null;
            let calcEndFlag = false;

            if (isStrInfluenceLeft(str)) {
                calcEndFlag = true;
            }


            if (calcEndFlag) {
                (() => {
                    //find Start
                    let j = i - 1;
                    let currentStrIsInfluenced = true;
                    let currentStrIsInBucket = splitWithSpace[i].includes(')') || splitWithSpace[j]?.includes(')');
                    while (j >= 0) {
                        const str = splitWithSpace[j];
                        if (str.includes('(')) {
                            currentStrIsInBucket = false;
                        }
                        if (isStrInfluenceRight(str)) {

                        } else if (isStrInfluenceLeft(str)) {
                            currentStrIsInfluenced = true;
                        } else {

                        }
                        j--;


                    }
                })()
            }


        }
        console.log(str)
        return mergeBracket(str)


    };

    console.log(replaceWithCalc(`xxxxx rgba(1,1,1,1) xxx cubic-bezier(calc($a - ( $b + ( $x + $y ) + ( $x + $y) - $c)) $z,1,calc( 1 + $z ),1)`));
}

valueParser()

