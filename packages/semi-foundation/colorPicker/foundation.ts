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
    hsva: HsvaColor;
    rgba: RgbaColor;
    hex: string
}
export interface ColorPickerProps {
    defaultValue?: Value;
    value?: Value;
    onChange: (value: Value) => void;
    alpha: boolean;
    width?: number;
    height?: number;
    defaultFormat: 'hex' | 'rgba' | 'hsva'
}

export interface ColorPickerState {
    currentColor: Value
}


export interface ColorPickerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifyChange: (value: Value) => void;

    notifyAlphaChangeByHandle: (newAlpha: { a: number }) => void;
    notifyColorChangeByHandle: (newHue: { h: number }) => void
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


    handleChangeH = (currentColor: Value, newH: number) => {

        const hsva = {
            ...currentColor.hsva,
            h: newH
        };
        const rgba = hsvaToRgba(hsva);
        const hex = hsvaToHex(hsva);

        currentColor = {
            rgba,
            hsva,
            hex
        };

        this._adapter.notifyChange(currentColor);
        this._adapter.setState({ currentColor: currentColor });

    }


    handleChangeA = (currentColor: Value, newAlpha: number) => {
        let alpha = this._adapter.getProp('alpha');
        if (!alpha) {
            newAlpha = 1;
        }
        const rgba = {
            ...currentColor.rgba,
            a: newAlpha
        };
        const hex = rgbaToHex(rgba);
        currentColor = {
            rgba,
            hex: alpha ? hex : hex.slice(0, 7),
            hsva: {
                ...currentColor.hsva,
                a: newAlpha
            }
        };
        this._adapter.notifyChange(currentColor);
        this._adapter.setState({ currentColor: currentColor });

    }

    handleChange = (color: HsvaColor|RgbaColor|string, format: 'hex'|'rgba'|'hsva')=>{
        let currentColor;

        if (format==='hsva') {
            currentColor = {
                hsva: color as HsvaColor,
                rgba: ColorPickerFoundation.hsvaToRgba(color as HsvaColor),
                hex: ColorPickerFoundation.hsvaToHex(color as HsvaColor)
            };
        } else if (format==='rgba') {
            currentColor = {
                rgba: color as RgbaColor,
                hsva: ColorPickerFoundation.rgbaToHsva(color as RgbaColor),
                hex: ColorPickerFoundation.rgbaToHex(color as RgbaColor)
            };
        } else if (format==='hex') {
            currentColor = {
                hex: color as string,
                hsva: ColorPickerFoundation.hexToHsva(color as string),
                rgba: ColorPickerFoundation.hexToRgba(color as string)
            };
        } else {
            throw new Error('format error');
        }

        this._adapter.notifyChange(currentColor);
        this._adapter.setState({ currentColor: currentColor });
    }


    handleAlphaChangeByHandle = (newAlpha: {a: number})=>{
        this._adapter.notifyAlphaChangeByHandle(newAlpha);
    }

    handleColorChangeByHandle = (newHue: {h: number})=>{
        this._adapter.notifyColorChangeByHandle(newHue);
    }


    getHandlePositionByHSVA = (hsva: HsvaColor, { width, height }: {width: number;height: number}, handleSize: number)=>{

        const defaultColorPosition = { x: hsva.s/100 * width, y: (1 - hsva.v/100) * height };
        return { x: defaultColorPosition.x - handleSize / 2, y: defaultColorPosition.y - handleSize / 2 };
    }

    getHandlePositionByMousePosition = (mousePosition: {x: number;y: number}, { width, height }: {width: number;height: number}, handleSize: number)=>{
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

        return handlePosition;
    }


    getAlphaHandlePositionByMousePosition = (mousePosition: number, width: number, handleSize: number)=>{
        if (mousePosition < 0 || mousePosition > width) {
            return null;
        }
        return mousePosition - handleSize / 2;
    }

    getColorHandlePositionByMousePosition = (mousePosition: number, width: number, handleSize: number)=>{
        if (mousePosition<0 || mousePosition > width) {
            return null;
        }

        return mousePosition - handleSize/2;
    }


    




}

export default ColorPickerFoundation;

