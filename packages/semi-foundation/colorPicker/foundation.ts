import { HsvaColor, RgbaColor } from './types';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import {
    hexToHsva,
    hexToRgba,
    hsvaToHex,
    hsvaToHslaString,
    hsvaToHslString,
    hsvaToRgba, rgbaStringToHsva, rgbaStringToRgba,
    rgbaToHex,
    rgbaToHsva,
} from './utils/convert';


type Value = {
    format: 'hex' | 'rgba' | 'hsva';
    value: HsvaColor|RgbaColor|string
}
export interface ColorPickerProps {
    defaultFormat: 'hex' | 'rgba' | 'hsva';
    defaultValue?: Value;
    value?: Value;
    onChange: (value: {
        rgba: RgbaColor;
        hex: string;
        hsva: HsvaColor
    }) => void;
    alpha: boolean;
    width?: number;
    height?: number
}

export interface ColorPickerState {
    currentColor: RgbaColor;
    currentColorHSVA: HsvaColor
}


export interface ColorPickerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifyChange: (value: {
        rgba: RgbaColor;
        hex: string;
        hsva: HsvaColor
    }) => void

    notifyAlphaChangeByHandle: (newAlpha: { a: number }) => void;
    notifyColorChangeByHandle: (newHue: { h: number }) => void;
}


class ColorPickerFoundation extends BaseFoundation<ColorPickerAdapter<ColorPickerProps, ColorPickerState>, ColorPickerProps, ColorPickerState> {

    constructor(adapter: ColorPickerAdapter<ColorPickerProps, ColorPickerState>) {
        super({
            ...adapter
        });
    }

    static hsvaToRgba =hsvaToRgba
    static rgbaToHsva = rgbaToHsva
    static rgbaToHex = rgbaToHex
    static hsvaToHex = hsvaToHex
    static hexToRgba = hexToRgba
    static hexToHsva = hexToHsva
    static hsvaToHslaString = hsvaToHslaString
    static hsvaToHslString = hsvaToHslString
    static rgbaStringToHsva = rgbaStringToHsva
    static rgbaStringToRgba = rgbaStringToRgba


    handleChangeHSVA = (currentColor: HsvaColor) => {
        const alpha = this._adapter.getProp('alpha');
        if (!alpha) {
            currentColor.a = 1;
        }
        const rgba = hsvaToRgba(currentColor);
        const hex = rgbaToHex(rgba);
        
        this._adapter.notifyChange({
            hex,
            rgba,
            hsva: currentColor
        });
        this._adapter.setState({ currentColor: hsvaToRgba(currentColor), currentColorHSVA: currentColor });

    }


    handleChangeRGBA = (currentColor: RgbaColor) => {
        const alpha = this._adapter.getProp('alpha');
        if (!alpha) {
            currentColor.a = 1;
        }
        const rgba = currentColor;
        const hsva = rgbaToHsva(currentColor);
        const hex = rgbaToHex(rgba);
        this._adapter.notifyChange({
            hex,
            rgba,
            hsva
        });
        this._adapter.setState({ currentColor: currentColor, currentColorHSVA: hsva });

    }

    handleAlphaChangeByHandle = (newAlpha:{a:number})=>{
        this._adapter.notifyAlphaChangeByHandle(newAlpha)
    }

    handleColorChangeByHandle = (newHue:{h:number})=>{
        this._adapter.notifyColorChangeByHandle(newHue)
    }


    getHandlePositionByHSVA = (hsva:HsvaColor,{width,height}:{width:number,height:number},handleSize:number)=>{

        const defaultColorPosition = { x: hsva.s/100 * width, y: (1 - hsva.v/100) * height };
        return { x: defaultColorPosition.x - handleSize / 2, y: defaultColorPosition.y - handleSize / 2 };
    }

    getHandlePositionByMousePosition = (mousePosition:{x:number,y:number},{width,height}:{width:number,height:number},handleSize:number)=>{
        if (mousePosition.x > width || mousePosition.x < 0) {
            return null;
        }

        if (mousePosition.y > height || mousePosition.y < 0) {
            return null;
        }

        const handlePosition = {
            x: mousePosition.x - handleSize/2,
            y: mousePosition.y - handleSize/2
        };

        return handlePosition
    }


    getAlphaHandlePositionByMousePosition = (mousePosition:number,width:number,handleSize:number)=>{
        if (mousePosition < 0 || mousePosition > width) {
            return null;
        }
        return  mousePosition - handleSize / 2;
    }

    getColorHandlePositionByMousePosition = (mousePosition:number,width:number,handleSize:number)=>{
        if (mousePosition<0 || mousePosition > width) {
            return null;
        }

        return mousePosition - handleSize/2;
    }


    static transValueToRGBA = (value: Value)=>{
        if (value.format==='hex') {
            return hexToRgba(value.value as string);
        } else if (value.format==='hsva') {
            return hsvaToRgba(value.value as HsvaColor);
        } else {
            return value.value as RgbaColor;
        }
    }
    





}

export default ColorPickerFoundation

