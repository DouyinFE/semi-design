import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { isUndefined, isFunction } from 'util';
import KeyCode from '../utils/keyCode';

export interface PreviewInnerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getIsInGroup: () => boolean;
    downloadImage: (src: string, picName: string) => void;
    notifyChange: (index: number) => void;
    notifyZoom: (zoom: number, increase: boolean ) => void;
    notifyClose: () => void;
    notifyVisibleChange: (visible: boolean) => void;
    notifyRatioChange: (type: string) => void;
    notifyRotateChange: (angle: number) => void;
    notifyDownload: (src: string, index: number) => void;
    setOnKeyDownListener: () => void;
    removeKeyDownListener: () => void;
}

export default class PreviewInnerFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PreviewInnerAdapter<P, S>, P, S> {
    constructor(adapter: PreviewInnerAdapter<P, S>) {
        super({ ...adapter });
    }

    beforeShow() {
        this._adapter.setOnKeyDownListener();
    }

    afterHide() {
        this._adapter.removeKeyDownListener();
    }

    handleKeyDown(e: any) {
        const { closeOnEsc } = this.getProps();
        if (closeOnEsc && e.keyCode === KeyCode.ESC) {
            e.stopPropagation();
            this._adapter.notifyVisibleChange(false);
            this._adapter.notifyClose();
            return;
        }
    }

    handleSwitchImage = (direction: string) => {
        const step = direction === 'prev' ? -1 : 1;
        const { imgSrc, currentIndex: currentIndexInState } = this.getStates();
        const srcLength = imgSrc.length;
        const newIndex = (currentIndexInState + step + srcLength) % srcLength;
        const { currentIndex } = this.getProps();
        if (!isUndefined(currentIndex)) {
            if (this._adapter.getIsInGroup()) {
                const setCurrentIndex = this._adapter.getContext('setCurrentIndex');
                setCurrentIndex(newIndex);
            }
            this._adapter.notifyChange(newIndex);
        } else {
            this.setState({
                currentIndex: newIndex,
            } as any);
        }
        this.setState({
            rotation: 0,
        } as any);
        this._adapter.notifyRotateChange(0);
    }  

    handleDownload = () => {
        const { currentIndex, imgSrc } = this.getStates();
        const downloadSrc = imgSrc[currentIndex];
        const downloadName = downloadSrc.slice(downloadSrc.lastIndexOf('/') + 1);
        this._adapter.downloadImage(downloadSrc, downloadName);
        this._adapter.notifyDownload(downloadSrc, currentIndex);
    }

    handlePreviewClose = () => {
        this._adapter.notifyVisibleChange(false);
        this._adapter.notifyClose();
    }

    handleAdjustRatio = (type: string) => {
        this.setState({
            ratio: type,
        } as any);
        this._adapter.notifyRatioChange(type);
    }

    
    handleRotateImage = () => {
        const { rotation } = this.getStates();
        const newRotation = rotation + 90;
        this.setState({
            rotation: newRotation,
        } as any);
        this._adapter.notifyRotateChange(newRotation);
    }

    handleZoomImage = (newZoom: number) => {
        const { zoom } =this.getStates();
        this._adapter.notifyZoom(newZoom, newZoom > zoom);
        this.setState({
            zoom: newZoom,
        } as any);
    }
}
