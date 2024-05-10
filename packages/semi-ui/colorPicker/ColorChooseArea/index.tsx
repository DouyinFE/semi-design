import React, { CSSProperties } from 'react';
import { HsvaColor } from "@douyinfe/semi-foundation/colorPicker/interface";
import { hsvaToHslString, hsvaToRgba } from "@douyinfe/semi-foundation/colorPicker/utils/convert";
import ColorPickerFoundation from '@douyinfe/semi-foundation/colorPicker/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/colorPicker/constants';
import cls from 'classnames';
const round = (number: number, digits = 0, base = Math.pow(10, digits)): number => {
    return Math.round(base * number) / base;
};


interface ColorChooseAreaProps {
    hsva: HsvaColor;
    onChange: (newColor: { s: number; v: number }) => void;
    handleSize: number;
    className?: string;
    style?: CSSProperties;
    width: number;
    height: number;
    foundation: ColorPickerFoundation
}

interface ColorChooseAreaState {
    handlePosition: { x: number; y: number };
    isHandleGrabbing: boolean
}

class ColorChooseArea extends React.Component<ColorChooseAreaProps, ColorChooseAreaState> {
    ref: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        this.state = {
            handlePosition: this.getHandlePositionByHSVA(),
            isHandleGrabbing: false,
        };
        this.ref = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<ColorChooseAreaProps>, prevState: Readonly<ColorChooseAreaState>, snapshot?: any) {
        if (JSON.stringify(prevProps.hsva)!==JSON.stringify(this.props.hsva)) {
            this.setState({ handlePosition: this.getHandlePositionByHSVA() });
        }
    }

    getHandlePositionByHSVA = ()=>{
        const { hsva, width, height, handleSize } = this.props;

        return this.props.foundation.getHandlePositionByHSVA(hsva, { width: width, height: height }, handleSize);

    }


    handleHandleMouseDown = (e: React.MouseEvent) => {
        this.setState({ isHandleGrabbing: true });
        this.ref.current.addEventListener('mousemove', this.setHandlePositionByMousePosition);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    setHandlePositionByMousePosition = (e: globalThis.MouseEvent|React.MouseEvent) => {
        const rect = this.ref.current.getBoundingClientRect();
        const mousePosition = {
            x: e.clientX - rect.x,
            y: e.clientY - rect.y
        };
        const { width, height, handleSize } = this.props;
        const handlePosition = this.props.foundation.getHandlePositionByMousePosition(mousePosition, { width, height }, handleSize);
        if (handlePosition) {
            this.setState({ handlePosition });
            this.props.onChange({
                s: Math.round(mousePosition.x / this.props.width * 100),
                v: Math.round(100 - (Math.min(Math.max(mousePosition.y / this.props.height, 0), 1)) * 100),
            });
        }

    }

    handleMouseUp = () => {
        this.ref.current.removeEventListener('mousemove', this.setHandlePositionByMousePosition);
        window.removeEventListener('mouseup', this.handleMouseUp);
        this.setState({ isHandleGrabbing: false });
    }

    handleClick = (e: React.MouseEvent)=>{
        this.setHandlePositionByMousePosition(e);
        this.handleHandleMouseDown(e);
    }




    render() {
        const areaBgStyle = hsvaToHslString({ h: this.props.hsva.h, s: 100, v: 100, a: 1 });
        const currentColor = hsvaToRgba(this.props.hsva);
        return <div className={cls(`${cssClasses.PREFIX}-colorChooseArea`,this.props.className )}
            style={{
                backgroundColor: areaBgStyle,
                width: this.props.width, height: this.props.height,
                cursor: this.state.isHandleGrabbing ? 'grabbing' : 'pointer',
                ...this.props.style
            }}
            ref={this.ref}
            aria-label="Color"
            onMouseDown={this.handleClick}
            aria-valuetext={`Saturation ${round(this.props.hsva.s)}%, Brightness ${round(this.props.hsva.v)}%`}
        >
            <div className={`${cssClasses.PREFIX}-handle`}
                style={{
                    width: this.props.handleSize,
                    height: this.props.handleSize,
                    left: this.state.handlePosition.x,
                    top: this.state.handlePosition.y,
                    backgroundColor: `rgba(${currentColor.r},${currentColor.g},${currentColor.b},${currentColor.a})`
                }}

                onMouseDown={(e) => this.handleHandleMouseDown(e)}>

            </div>
        </div>;
    }

}

export default ColorChooseArea;
