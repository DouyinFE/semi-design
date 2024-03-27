import React from 'react';
import { HsvaColor, RgbaColor } from '@douyinfe/semi-foundation/colorPicker/types';
import { Input, InputGroup, InputNumber, Select } from '@douyinfe/semi-ui';
import { hexToRgba, hsvaToRgba } from '@douyinfe/semi-foundation/colorPicker/utils/convert';
import split from "@douyinfe/semi-foundation/colorPicker/utils/split"
import ColorPickerFoundation from '@douyinfe/semi-foundation/colorPicker/foundation';

interface DataPartProps {
    currentColor: RgbaColor;
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

    constructor(props) {
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
        if (JSON.stringify(prevProps.currentColor) !== JSON.stringify(this.props.currentColor) || prevState.format !== this.state.format) {
            const currentRGBA = this.getRGBAByInputValue(this.state.inputValue);
            if (JSON.stringify(currentRGBA)!==JSON.stringify(this.props.currentColor)) {
                this.setState({ inputValue: this.getInputValue() });
            }

        }

    }

    getInputValue = ()=>{
        const rgba = this.props.currentColor;
        const hsva = ColorPickerFoundation.rgbaToHsva(this.props.currentColor);
        const hex = ColorPickerFoundation.rgbaToHex(this.props.currentColor);
        if (this.state.format === 'rgba') {
            return `${rgba.r},${rgba.g},${rgba.b}`;
        } else if (this.state.format === 'hsva') {
            return `${hsva.h},${hsva.s},${hsva.v}`;
        } else {
            return hex.slice(0, 7);
        }
    }


    handleChange = (newColor: RgbaColor)=>{
        this.props.foundation.handleChangeRGBA(newColor)
    }

    getRGBAByInputValue = (value: string)=>{
        if (this.state.format==='rgba') {
            const result = split(value, this.state.format);
            if (result) {
                return result as RgbaColor;
            }
        } else if (this.state.format==='hsva') {
            const result = split(value, this.state.format);
            if (result) {
                return hsvaToRgba(result as HsvaColor) as RgbaColor;
            }
        } else if (this.state.format==='hex') {
            if (/#[\d\w]{6,8}/.test(value)) {
                return hexToRgba(value);
            } else if (/#[\d\w]{6,8}/.test("#"+value)) {
                return hexToRgba("#"+value) as RgbaColor;
            }
        }
        return false;
    }



    render() {
        const rgba = this.props.currentColor;
        return <div className={'dataPart'} style={{ width: this.props.width }}>
            <div className={'colorDemoBlock'} style={{ minWidth: 20, minHeight: 20, backgroundColor:
                    `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})` }}>
            </div>
            <InputGroup size={'small'} className={'inputGroup'} >
                <Input className={'colorPickerInput'}
                    value={this.state.inputValue}
                    onChange={(v)=>{
                        const rgba = this.getRGBAByInputValue(v);
                        if (rgba) {
                            this.handleChange(rgba as RgbaColor);
                        }
                        this.setState({ inputValue: v });

                    }}
                />
                {
                    this.props.alpha && <InputNumber
                        min={0}
                        max={100}
                        className={'colorPickerInputNumber'}
                        value={Number(Math.round(this.props.currentColor.a*100))}
                        onNumberChange={v=>{
                            this.handleChange({ ...this.props.currentColor, a: Number((v/100).toFixed(2)) });
                        }}
                        suffix={<span className={'inputNumberSuffix'}>%</span>} hideButtons={true} />
                }
            </InputGroup>
            <Select className={'formatSelect'}
                size={'small'}
                value={this.state.format}
                onSelect={v=>this.setState({ format: v as DataPartState['format'] })}
                optionList={['hex', 'rgba', 'hsva'].map(type=>({ label: type, value: type }))}/>
        </div>;
    }

}

export default DataPart;
