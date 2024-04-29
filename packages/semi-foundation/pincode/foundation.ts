import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { PaginationAdapter } from '../pagination/foundation';


export interface PinCodeBaseProps{
    value?: string;
    format?: "number"|"mixed"|RegExp|((value: string) => boolean);
    onChange: (value: string) => void;
    defaultValue?: string;
    count?: number;
    autoFocus?: boolean;
    onComplete?: (value: string) => void
}

export interface PinCodeBaseState{
    valueList: string[];
    currentActiveIndex: number
}
export interface PinCodeAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    onCurrentActiveIndexChange: (index: number) => void;
    changeValueList: (values: string[]) => void;
    changeSpecificInputFocusState: (index: number, state: "blur"|"focus") => void
}


class PinCodeFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PinCodeAdapter<P, S>, P, S> {

    constructor(adapter: PinCodeAdapter<P, S>) {
        super({ ...adapter });
    }

    static numberReg = /^\d*$/;
    static mixedReg = /^[0-9a-zA-Z]$/;


    completeSingleInput = (i: number, singleInputValue: string)=>{
        this._adapter.onCurrentActiveIndexChange(i+1);
        const valueList = [...this.getState("valueList")];
        valueList[i] = singleInputValue;
        this._adapter.changeValueList(valueList);
        const count = this.getProp('count');
        if (i+1>count-1) {
            this._adapter.changeSpecificInputFocusState(i, "blur");
            this.getProp("onComplete")?.(valueList.join(""));
        } else {
            this._adapter.changeSpecificInputFocusState(i+1, "focus");
        }

    }

    validateValue = (value: string = "")=>{
        const format = this.getProp("format") as PinCodeBaseProps['format'];
        let validateFunction = (value: string)=>true;
        if (typeof format==="string") {
            if (format==="number") {
                validateFunction = (value)=>value.length ===0 || PinCodeFoundation.numberReg.test(value);
            } else if (format==="mixed") {
                validateFunction = (value: string)=>value.length ===0 || PinCodeFoundation.mixedReg.test(value);
            }
        } else if (format instanceof RegExp) {
            validateFunction = (value: string)=>(format as RegExp).test(value);
        } else if (typeof format === "function") {
            validateFunction = format;
        }
        return validateFunction?.(value);
    }



}


export default PinCodeFoundation;
