import React, { CSSProperties } from 'react';
import { hsvaToHslaString, hsvaToRgbaString } from "@douyinfe/semi-foundation/colorPicker/utils/convert";
import { round } from "@douyinfe/semi-foundation/colorPicker/utils/round";
import { HsvaColor } from "@douyinfe/semi-foundation/colorPicker/types";
import ColorPickerFoundation from '@douyinfe/semi-foundation/colorPicker/foundation';

interface AlphaSliderProps {
    width: number;
    height: number;
    hsva: HsvaColor;
    handleSize: number;
    className?: string;
    style?: CSSProperties;
    foundation: ColorPickerFoundation

}

interface AlphaSliderState {
    handlePosition: number;
    isHandleGrabbing: boolean
}

class ColorSlider extends React.Component<AlphaSliderProps, AlphaSliderState> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        this.state = {
            handlePosition: props.hsva.a * props.width - props.handleSize/2,
            isHandleGrabbing: false
        };
        this.ref = React.createRef<HTMLDivElement>();
    }

    componentDidUpdate(prevProps: Readonly<AlphaSliderProps>, prevState: Readonly<AlphaSliderState>, snapshot?: any) {
        if (prevProps.hsva.a!==this.props.hsva.a) {
            this.setState({ handlePosition: this.props.hsva.a * this.props.width - this.props.handleSize/2 });
        }
    }

    handleHandleMouseDown = (e: React.MouseEvent) => {
        this.setState({ isHandleGrabbing: true });
        window.addEventListener('mousemove', this.setHandlePositionByMousePosition);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    setHandlePositionByMousePosition = (e: MouseEvent) => {
        const mousePosition = e.clientX - this.ref.current.getBoundingClientRect().x;
        const handlePosition = this.props.foundation.getAlphaHandlePositionByMousePosition(mousePosition, this.props.width, this.props.handleSize);
        this.props.foundation.handleAlphaChangeByHandle({ a: Number((Math.min(Math.max( mousePosition/this.props.width, 0), 1)).toFixed(2)) });
        this.setState({ handlePosition });
    }

    handleMouseUp = (e: MouseEvent) => {
        this.setState({ isHandleGrabbing: false });
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mousemove', this.setHandlePositionByMousePosition);
    }

    handleClick = (e: React.MouseEvent)=>{
        this.setHandlePositionByMousePosition(e);
        this.handleHandleMouseDown(e);
    }


    render() {
        const colorFrom = hsvaToHslaString({ ...this.props.hsva, a: 0 });
        const colorTo = hsvaToHslaString({ ...this.props.hsva, a: 1 });

        const alphaSliderBackground = `linear-gradient(90deg, ${colorFrom}, ${colorTo})`;
        return <div className={'alphaSlider '+(this.props.className ?? '')} ref={this.ref}
            aria-label="Alpha"
            aria-valuetext={`${round(this.props.hsva.a * 100)}%`}
            onMouseDown={this.handleClick}
            style={{
                width: this.props.width,
                height: this.props.height,
                ...this.props.style
            }}>
            <div className={'alphaSliderInner'} style={{ background: alphaSliderBackground }}>
                <div className={'alphaHandle'}
                    style={{
                        width: this.props.handleSize,
                        height: this.props.handleSize,
                        left: this.state.handlePosition,
                        top: `50%`,
                        transform: `translateY(-50%)`,
                        backgroundColor: hsvaToRgbaString(this.props.hsva)
                    }}
                    onMouseDown={(e) => this.handleHandleMouseDown(e)}>
                </div>
            </div>


        </div>;
    }

}

export default ColorSlider;
