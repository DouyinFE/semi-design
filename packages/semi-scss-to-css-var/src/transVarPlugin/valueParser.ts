

const valueParser = () => {
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
        const splitWithSpace = str.split(' ');

        const mergeBracket = (str: string) => {
            const stack: string[] = [];
            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                if (char === '(') {
                    stack.push('(');
                } else if (char === ')') {
                    let tempStr='';
                    while(true){
                        const topChar=stack[stack.length-1];
                        if(topChar!=='('){
                            tempStr+=stack.pop();
                        }else{
                            stack.pop();
                            stack.push(...replaceWithCalc(tempStr.split('').reverse().join('')).split(''))
                            break;
                        }
                    }
                }else{
                    stack.push(char);
                }
            }
            return `calc[${stack.join('')}]`;
        }


        const isStrInfluenceLeft=(str:string)=>{
            const trimmed=str.trim();
            return ['+','-','*','/'].includes(trimmed[0]);
        }

        const isStrInfluenceRight=(str:string)=>{
            const trimmed=str.trim();
            return ['+','-','*','/'].includes(trimmed[trimmed.length-1]);
        }

        let i=0;
        while (i<splitWithSpace.length){
            const start=splitWithSpace[i];
            if(start.includes('$')){
                let j=i+1;
                while (j<splitWithSpace.length){
                    const afterEnd=splitWithSpace[j];
                    if(afterEnd.includes('$'))
                    j++;
                }

            }
        }

        return mergeBracket(str)


    };

    console.log(replaceWithCalc(`xxxxx xxx $a - ($b + ($x + $y)+ $c)`))
}

valueParser()

