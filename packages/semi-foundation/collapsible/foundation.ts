import BaseFoundation, {DefaultAdapter} from "../base/foundation";
import {CollapseAdapter} from "../collapse/foundation";
import {Motion} from "@douyinfe/semi-ui/_base/base";
import React from "react";


export interface CollapsibleFoundationProps{
    isOpen?: boolean;
    duration?: number;
    keepDOM?: boolean;
    className?: string;
    collapseHeight?: number;
    reCalcKey?: number | string;
    id?:string,
}

export interface CollapsibleFoundationState{

}



export interface CollapsibleAdapter<P = Record<string, any>, S = Record<string, any>>  extends DefaultAdapter<P, S>{

}

class CollapsibleFoundation extends BaseFoundation<CollapsibleAdapter>{

    constructor(adapter: CollapseAdapter) {
        super({
            ...adapter
        });
    }
}


export default CollapsibleFoundation;