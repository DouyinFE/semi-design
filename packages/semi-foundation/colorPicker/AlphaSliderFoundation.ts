import BaseFoundation, {DefaultAdapter} from "../base/foundation";
import ColorPickerFoundation, {ColorPickerAdapter, ColorPickerProps, ColorPickerState} from "./foundation";
import {HsvaColor} from "./interface";
import {CSSProperties} from "react";

export  interface AlphaSliderProps{
    width: number;
    height: number;
    hsva: HsvaColor;
    handleSize: number;
    className?: string;
    style?: CSSProperties;
    foundation: ColorPickerFoundation
}

export interface AlphaSliderState{
    handlePosition: number;
    isHandleGrabbing: boolean
}


export interface AlphaSliderAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    handleMouseDown:(e:any)=>void,
    handleMouseUp:(e:any)=>void
    getColorPickerFoundation:()=>ColorPickerFoundation
    getDOM:()=>HTMLDivElement
}


class AlphaSliderFoundation extends BaseFoundation<AlphaSliderAdapter<AlphaSliderProps, AlphaSliderState>, AlphaSliderProps, AlphaSliderState> {

    constructor(adapter: AlphaSliderAdapter<AlphaSliderProps, AlphaSliderState>) {
        super({
            ...adapter
        });
    }

    handleMouseDown = (e:any)=>{
        this._adapter.handleMouseDown(e);
    }


    handleMouseUp = (e:any)=>{
        this._adapter.handleMouseUp(e);
    }


    setHandlePositionByMousePosition = (e: MouseEvent)=>{
        const rect = this._adapter.getDOM().getBoundingClientRect()
        const { width,handleSize} = this._adapter.getProps()
        const colorPickerFoundation = this._adapter.getColorPickerFoundation()
        // const mousePosition = e.clientX - rect.x;
        // colorPickerFoundation.handleColorChangeByHandle({ h: Math.round(Math.min(Math.max(mousePosition / width, 0), 1) * 360) });
        // const handlePosition = colorPickerFoundation.getColorHandlePositionByMousePosition(mousePosition, width, handleSize);
        // this.setState({ handlePosition });

        const mousePosition = e.clientX - rect.x;
        const handlePosition = colorPickerFoundation.getAlphaHandlePositionByMousePosition(mousePosition,width, handleSize);
        colorPickerFoundation.handleAlphaChangeByHandle({ a: Number((Math.min(Math.max( mousePosition / width, 0), 1)).toFixed(2)) });
        this.setState({ handlePosition });
    }


}


export default AlphaSliderFoundation;