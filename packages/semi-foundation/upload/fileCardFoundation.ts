import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface FileCardAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    updateFallbackPreview: (fallback: boolean) => void
}

class FileCardFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<FileCardAdapter<P, S>, P, S> {
    constructor(adapter: FileCardAdapter<P, S>) {
        super({ ...adapter });
    }

    handleImageError(error: any) {
        this._adapter.updateFallbackPreview(true);
    }
}

export default FileCardFoundation;
