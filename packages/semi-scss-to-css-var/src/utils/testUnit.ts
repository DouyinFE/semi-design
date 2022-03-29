import { isEqual } from "lodash";
import getReplaceCalcIndex from "./getReplaceCalcIndex";


const safeStringify = (arg:any)=>{
    try {
        return JSON.stringify(arg);
    } catch (e){
        return arg.toString();
    }
};


const testUnit = <R>(testCase:Map<any, R>,func:(...args:any)=>R)=>{

    for (const [arg, value] of testCase.entries()) {
        const result = func(arg);
        if (!isEqual(result, value)) {
            throw new Error(`Test case error: testing ${func.name} , arg is ${safeStringify(arg)} expect ${safeStringify(value)} got ${safeStringify(result)}`);

        }
    }
};

export default testUnit;
