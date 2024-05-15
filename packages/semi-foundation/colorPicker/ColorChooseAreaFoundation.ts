import BaseFoundation, { DefaultAdapter } from "../base/foundation";

export interface ColorChooseAreaBaseProps {

}

export interface ColorChooseAreaBaseState {

}


export interface ColorChooseAreaAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {

}


class ColorChooseAreaFoundation extends BaseFoundation<ColorChooseAreaAdapter<ColorChooseAreaBaseProps, ColorChooseAreaBaseState>, ColorChooseAreaBaseProps, ColorChooseAreaBaseState> {

    constructor(adapter: ColorChooseAreaAdapter<ColorChooseAreaBaseProps, ColorChooseAreaBaseState>) {
        super({
            ...adapter
        });
    }


}


export default ColorChooseAreaFoundation;