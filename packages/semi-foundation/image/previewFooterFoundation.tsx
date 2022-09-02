import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface PreviewFooterAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    setStartMouseOffset: (time: number) => void;
}

export default class PreviewFooterFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PreviewFooterAdapter<P, S>, P, S> {
    
    changeSliderValue = (type): void => {
        const { zoom, step, min, max } = this.getProps();
        let newValue = type === 'plus' ? zoom + step : zoom - step;
        if (newValue > max) {
            newValue = max;
        } else if (newValue < min) {
            newValue = min;
        }
        this.handleValueChange(newValue);
    };

    handleValueChange = (value): void => {
        const { onZoomIn, onZoomOut, zoom } = this.getProps();
        if (value > zoom) {
            onZoomIn(value / 100);
        } else {
            onZoomOut(value / 100);
        }
        this._adapter.setStartMouseOffset(value);
    };

    handleRatioClick = (): void => {
        const { ratio, onAdjustRatio } = this.getProps();
        const type = ratio === 'adaptation' ? 'realSize' : 'adaptation';
        onAdjustRatio(type);
    }
    
}