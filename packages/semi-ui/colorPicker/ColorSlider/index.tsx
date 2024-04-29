import React, { CSSProperties } from 'react';
import ColorPickerFoundation from '@douyinfe/semi-foundation/colorPicker/foundation';

interface ColorSliderProps{
    width: number;
    height: number;
    hue: number;
    handleSize: number;
    className?: string;
    style?: CSSProperties;
    foundation: ColorPickerFoundation
}

interface ColorSliderState{
    handlePosition: number;
    isHandleGrabbing: boolean
}

class ColorSlider extends React.Component<ColorSliderProps, ColorSliderState> {
    private readonly ref: React.RefObject<HTMLDivElement>;
    constructor(props: ColorSliderProps) {
        super(props);
        this.state={
            handlePosition: props.hue/360 * props.width - props.handleSize/2,
            isHandleGrabbing: false
        };
        this.ref = React.createRef<HTMLDivElement>();
    }

    componentDidUpdate(prevProps: Readonly<ColorSliderProps>, prevState: Readonly<ColorSliderState>, snapshot?: any) {
        if (prevProps.hue!==this.props.hue) {
            this.setState({ handlePosition: this.props.hue/360 * this.props.width - this.props.handleSize/2 });
        }
    }

    handleHandleMouseDown = (e: React.MouseEvent)=>{
        this.setState({ isHandleGrabbing: true });
        window.addEventListener('mousemove', this.setHandlePositionByMousePosition);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    setHandlePositionByMousePosition = (e: MouseEvent)=>{
        const mousePosition = e.clientX - this.ref.current.getBoundingClientRect().x;
        this.props.foundation.handleColorChangeByHandle({ h: Math.round(Math.min(Math.max(mousePosition/this.props.width, 0), 1) * 360) });
        const handlePosition = this.props.foundation.getColorHandlePositionByMousePosition(mousePosition, this.props.width, this.props.handleSize);
        this.setState({ handlePosition });
    }

    handleMouseUp = (e: MouseEvent)=>{
        this.setState({ isHandleGrabbing: false });
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mousemove', this.setHandlePositionByMousePosition);
    }

    handleClick = (e: React.MouseEvent)=>{
        this.setHandlePositionByMousePosition(e);
        this.handleHandleMouseDown(e);
    }



    render() {
        return <div className={'colorSlider ' + (this.props.className ?? '')} ref={this.ref}
            onMouseDown={this.handleClick}
            style={{
                width: this.props.width,
                height: this.props.height,
                ...this.props.style
            }}>

            <div className={'handle'}
                style={{
                    width: this.props.handleSize,
                    height: this.props.handleSize,
                    left: this.state.handlePosition,
                    top: `50%`,
                    transform: `translateY(-50%)`,
                    backgroundColor: ColorPickerFoundation.hsvaToHslString({ h: this.props.hue, s: 100, v: 100, a: 1 })
                }}
                onMouseDown={(e) => this.handleHandleMouseDown(e)}>
            </div>

        </div>;
    }

}

export default ColorSlider;
