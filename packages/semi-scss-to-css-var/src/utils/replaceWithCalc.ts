import getReplaceCalcIndex from "./getReplaceCalcIndex";
import testUnit from "./testUnit";


const replaceWithCalc = (str:string)=>{
    const replaceIndexIndicator=getReplaceCalcIndex(str);
    let  shift:number=0;
    const strSplit = str.split('');

    for (const indicator of replaceIndexIndicator){
        const { start,end }=indicator;
        strSplit.splice(start+shift,0,...'calc('.split(''));
        shift+=5;
        strSplit.splice(end+1+shift,0,')');
        shift+=1;
    }
    return strSplit.join('');
};

export default replaceWithCalc;

const test_replaceWithCalc = ()=>{
    const testCase = new Map(Object.entries({
        "cubic-bezier(calc($a - ( $b + ( $c + $d ) + ( $e + $f) - $g)), $h,1, 1 + $i ,1)": "cubic-bezier(calc(calc($a - ( $b + ( $c + $d ) + ( $e + $f) - $g))), $h,1, calc(1 + $i) ,1)",
        "2px $a - ($b + ($x + $y)+ $c)": "2px calc($a - ($b + ($x + $y)+ $c))",
        "calc(1vh + 2px) (1 + $a - (1 + $c)) 2px calc(1vh + 3px)": "calc(calc(1vh + 2px)) (calc(1 + $a - (1 + $c))) 2px calc(calc(1vh + 3px))",
        "$a + 1px + $b solid var(--semi-color-primary)":'calc($a + 1px + $b) solid var(--semi-color-primary)',
        "$a + $b": "calc($a + $b)"
    }));
    testUnit(testCase,replaceWithCalc);
};

export {
    test_replaceWithCalc
};

