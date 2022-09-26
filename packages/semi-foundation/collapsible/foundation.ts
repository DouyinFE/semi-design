import BaseFoundation, {DefaultAdapter} from "../base/foundation";

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
    setDOMInRenderTree: (isInRenderTree:boolean) => void;
    setDOMHeight: (domHeight:number) => void;
    setVisible: (visible:boolean) => void;
}

class CollapsibleFoundation extends BaseFoundation<CollapsibleAdapter,CollapsibleFoundationProps,CollapsibleFoundationState>{

    constructor(adapter: CollapsibleAdapter) {
        super({
            ...adapter
        });
    }


    updateDOMInRenderTree = (isInRenderTree) => {
        this._adapter.setDOMInRenderTree(isInRenderTree);
    }

    updateDOMHeight = (domHeight:number) => {
        this._adapter.setDOMHeight(domHeight);
    }

    updateVisible = (visible:boolean) => {
        this._adapter.setVisible(visible);
    }


}


export default CollapsibleFoundation;