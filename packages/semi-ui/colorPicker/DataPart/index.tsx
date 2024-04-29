import React, { ReactNode } from 'react';
import { HsvaColor, RgbaColor } from '@douyinfe/semi-foundation/colorPicker/types';
import Input from "../../input";
import InputGroup from "../../input/inputGroup";
import InputNumber from "../../inputNumber";
import Select from "../../select";
import Button from "../../button";
import split from "@douyinfe/semi-foundation/colorPicker/utils/split";
import ColorPickerFoundation, { ColorPickerProps } from '@douyinfe/semi-foundation/colorPicker/foundation';
import { isEqual } from 'lodash';
import { IconEyedropper } from '@douyinfe/semi-icons';



type Value = ColorPickerProps['value']
interface DataPartProps {
    currentColor: Value;
    defaultFormat: 'hex'|'rgba'|'hsva';
    width: number;
    alpha?: boolean;
    foundation: ColorPickerFoundation

}

interface DataPartState{
    format: 'hex'|'rgba'|'hsva';
    inputValue: string
}


class DataPart extends React.Component<DataPartProps, DataPartState> {

    constructor(props: DataPartProps) {
        super(props);
        this.state = {
            format: this.props.defaultFormat,
            inputValue: ''
        };
    }

    componentDidMount() {
        this.setState({ inputValue: this.getInputValue() });
    }

    componentDidUpdate(prevProps: Readonly<DataPartProps>, prevState: Readonly<DataPartState>, snapshot?: any) {
        if (!isEqual(prevProps.currentColor, this.props.currentColor)|| prevState.format !== this.state.format) {
            this.setState({ inputValue: this.getInputValue() });
        }

    }

    getInputValue = ()=>{
        const rgba = this.props.currentColor.rgba;
        const hsva = this.props.currentColor.hsva;
        const hex = this.props.currentColor.hex;
        if (this.state.format === 'rgba') {
            return `${rgba.r},${rgba.g},${rgba.b}`;
        } else if (this.state.format === 'hsva') {
            return `${hsva.h},${hsva.s},${hsva.v}`;
        } else {
            return hex.slice(0, 7);
        }
    }


    handleChange = (newColor: RgbaColor|HsvaColor|string)=>{
        this.props.foundation.handleChange(newColor, this.state.format);
    }

    getValueByInputValue = (value: string)=>{
        if (this.state.format==='rgba') {
            const result = split(value, this.state.format);
            if (result) {
                return result as RgbaColor;
            }

        } else if (this.state.format==='hsva') {
            const result = split(value, this.state.format);
            if (result) {
                return result as HsvaColor;
            }
        } else if (this.state.format==='hex') {
            if (!value.startsWith('#')) {
                value = '#'+value;
            }
            if (/#[\d\w]{6,8}/.test(value)) {
                return value;
            }
        }
        return false;
    }

    handlePickValueWithStraw = async ()=>{
        if (!window['EyeDropper']) {
            return;
        }
        //@ts-ignore
        const eyeDropper = new EyeDropper();

        try {
            const result = await eyeDropper.open();
            const color = result['sRGBHex'];
            if (color.startsWith("#")) {
                this.props.foundation.handleChange(color, 'hex');
            } else if (color.startsWith('rgba')) {
                console.log("color",color);
                const rgba = ColorPickerFoundation.rgbaStringToRgba(color);
                this.props.foundation.handleChange(rgba, 'rgba');
            }
        } catch (e) {

        }
    }




    render() {
        const rgba = this.props.currentColor.rgba;
        return <div className={'dataPart'} style={{ width: this.props.width }}>
            <div className={'colorDemoBlock'} style={{ minWidth: 20, minHeight: 20, backgroundColor:
                    `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})` }}>
            </div>
            <InputGroup size={'small'} className={'inputGroup'} >
                <Input className={'colorPickerInput'}
                    value={this.state.inputValue}
                    onChange={(v)=>{
                        const value = this.getValueByInputValue(v);
                        if (value) {
                            this.handleChange(value);
                        }
                        this.setState({ inputValue: v });

                    }}
                />
                {
                    this.props.alpha && <InputNumber
                        min={0}
                        max={100}
                        className={'colorPickerInputNumber'}
                        value={Number(Math.round(this.props.currentColor.rgba.a*100))}
                        onNumberChange={v=>{
                            if (this.state.format==='rgba') {
                                this.handleChange({ ...this.props.currentColor.rgba, a: Number((v/100).toFixed(2)) });
                            } else if (this.state.format==='hex') {
                                const rgba = { ...this.props.currentColor.rgba, a: Number((v/100).toFixed(2)) };
                                const hex = ColorPickerFoundation.rgbaToHex(rgba);
                                this.handleChange(hex);
                            } else if (this.state.format==='hsva') {
                                const rgba = { ...this.props.currentColor.hsva, a: Number((v/100).toFixed(2)) };
                                this.handleChange(rgba);
                            }
                        }}
                        suffix={<span className={'inputNumberSuffix'}>%</span>} hideButtons={true} />
                }
                <Select className={'formatSelect'}
                    size={'small'}
                    value={this.state.format}
                    onSelect={v=>this.setState({ format: v as DataPartState['format'] })}
                    optionList={['hex', 'rgba', 'hsva'].map(type=>({ label: type, value: type }))}/>
            </InputGroup>

            <Button type={'tertiary'} theme={"borderless"} size={'small'} onClick={this.handlePickValueWithStraw} icon={<IconEyedropper />}/>

        </div>;
    }

}

export default DataPart;
