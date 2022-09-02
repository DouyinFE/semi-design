import BaseFoundation, { DefaultAdapter } from '../base/foundation';


export interface ImageAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getIsInGroup: () => boolean;
}


export default class ImageFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<ImageAdapter<P, S>, P, S> {
    constructor(adapter: ImageAdapter<P, S>) {
        super({ ...adapter });
    }

    handleClick = (e) => {
        const { imageID, preview } = this.getProps();
        if (this._adapter.getIsInGroup()) {
            const { setCurrentIndex, handleVisibleChange } = this._adapter.getContexts();
            if (!preview) {
                return;
            }
            setCurrentIndex(imageID);
            handleVisibleChange(true);
        } else {
            if (!preview) {
                return ;
            }
            this.setState({
                previewVisible: true,
            } as any);
        }
    }

    handleLoaded = (e) => {
        const { onLoad } = this.getProps();
        onLoad && onLoad(e);
        this.setState ({
            loadStatus: 'success',
        } as any);
    }

    handleError = (e) => {
        const { onError } = this.getProps();
        onError && onError(e);
        this.setState ({
            loadStatus: 'error',
        } as any);
    }

    handlePreviewVisibleChange = (visible: boolean) => {
        this.setState({
            previewVisible: visible,
        } as any);
    }
}