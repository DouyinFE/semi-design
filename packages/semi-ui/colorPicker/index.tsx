import React, { CSSProperties } from 'react';
import ColorPickerFoundation, { ColorPickerProps, ColorPickerState } from '@douyinfe/semi-foundation/colorPicker/foundation';
import { BaseComponent } from '@douyinfe/semi-ui';
import Button from "../button";
import { PopoverProps } from '@douyinfe/semi-ui/popover';
import ColorChooseArea from './ColorChooseArea';
import { ColorPickerAdapter } from '@douyinfe/semi-foundation/colorPicker/foundation';
import { HsvaColor, RgbaColor } from '@douyinfe/semi-foundation/colorPicker/types';
import AlphaSlider from './AlphaSlider';
import ColorSlider from './ColorSlider';
import DataPart from './DataPart';
import { IconEyedropper,IconEyeOpened } from '@douyinfe/semi-icons';


export interface ColorPickerReactProps extends ColorPickerProps{
    usePopover?: boolean;
    popoverProps?: PopoverProps;
    className: string;
    style?: CSSProperties

}


export interface ColorPickerReactState extends ColorPickerState{
}


class ColorPicker extends BaseComponent<ColorPickerReactProps, ColorPickerReactState> {
    static __SemiComponentName__ = "ColorPicker";
    public foundation: ColorPickerFoundation;

    constructor(props: ColorPickerReactProps) {
        super(props);
        this.foundation = new ColorPickerFoundation(this.adapter);
        const initValue = (props.value ?? props.defaultValue);
        const currentColorRGBA = initValue?ColorPickerFoundation.transValueToRGBA(initValue):{ r: 50, g: 50, b: 50, a: 1 };
        this.state = {
            currentColor: currentColorRGBA,
            currentColorHSVA: ColorPickerFoundation.rgbaToHsva(currentColorRGBA),
        };
    }

    get adapter(): ColorPickerAdapter<ColorPickerReactProps, ColorPickerReactState> {
        return {
            ...super.adapter,
            notifyChange: (value)=>{
                this.props.onChange?.(value);
            },
            notifyAlphaChangeByHandle: (newAlpha)=>{
                this.foundation.handleChangeRGBA( { ...this.getCurrentColor(), a: newAlpha.a });
            },
            notifyColorChangeByHandle: ({ h })=>{
                this.foundation.handleChangeHSVA({ ...ColorPickerFoundation.rgbaToHsva(this.getCurrentColor()), h });
            }
        };
    }
    

    getCurrentColor = ()=>{
        return this.props.value ? (this.props.value.value as RgbaColor) : this.state.currentColor;
    }

    handlePickValueWithStraw = async ()=>{
        if (!window['EyeDropper']) {
            return;
        }
        const eyeDropper = new EyeDropper();

        try {
            const result = await eyeDropper.open();
            const color = result['sRGBHex'];
            if (color.startsWith("#")) {
                const rgba = ColorPickerFoundation.hexToRgba(color);
                this.foundation.handleChangeRGBA(rgba);
            } else if (color.startsWith('rgba')) {
                const rgba = ColorPickerFoundation.rgbaStringToRgba(color);
                this.foundation.handleChangeRGBA(rgba)
            }
        } catch (e) {

        }
    }


    render() {
        if (this.props.value && this.props.value.format!=='rgba') {
            throw "[semi] Error: value must be passed in rgba format when using controlled mode, because rbg->hsv->rgb is lossless.You can use the util method exported by ColorPicker Class.";
        }
        const currentColor = this.getCurrentColor();
        return <div className={'colorPicker'}>

            <ColorChooseArea hsva={this.state.currentColorHSVA} foundation={this.foundation} onChange={({ s, v }) => {
                this.foundation.handleChangeHSVA( { ...this.state.currentColorHSVA, s, v });
            }} handleSize={20} width={this.props.width ?? 280} height={this.props.height ?? 280}/>
            <ColorSlider width={this.props.width ?? 280}
                height={10}
                handleSize={18}
                hue={ColorPickerFoundation.rgbaToHsva(currentColor).h}
                className={'colorSliderWrapper'}
                foundation={this.foundation}
            />
            <AlphaSlider width={this.props.width ?? 280}
                height={10}
                handleSize={18}
                hsva={ColorPickerFoundation.rgbaToHsva(currentColor)}
                className={'alphaSliderWrapper'}
                foundation={this.foundation}
            />
            <DataPart currentColor={currentColor}
                alpha={this.props.alpha}
                width={this.props.width ?? 280 }
                foundation={this.foundation}
                defaultFormat={this.props.defaultFormat} />
            <Button onClick={this.handlePickValueWithStraw} icon={<IconEyedropper />}></Button>
        </div>;
    }
}


export default ColorPicker;
