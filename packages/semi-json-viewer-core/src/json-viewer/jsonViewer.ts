import { View } from '../view/view';
import { JSONModel } from '../model/jsonModel';
import { emitter } from '../common/emitter';
import { createModel } from '../model';
import { getJsonWorkerManager, JsonWorkerManager } from '../worker/jsonWorkerManager';
import { CompletionItem } from '../service/jsonTypes';
/**
 * JsonViewer 主类
 */
export interface JsonViewerOptions {
    lineHeight?: number;
    autoWrap?: boolean;
    formatOptions?: FormattingOptions;
    completionOptions?: CompletionOptions
}

export interface CompletionOptions {
    staticCompletions?: CompletionItem[]
}

export interface FormattingOptions {
    tabSize?: number;
    insertSpaces?: boolean;
    eol?: string
}

export class JsonViewer {
    private _container: HTMLElement;
    private _jsonModel: JSONModel;
    private _view: View;
    private _jsonWorkerManager: JsonWorkerManager = getJsonWorkerManager();
    public emitter = emitter;

    constructor(container: HTMLElement, value: string, options?: JsonViewerOptions) {
        this._container = container;
        this._jsonModel = createModel(value);
        this._jsonWorkerManager.init(value);
        this._view = new View(container, this._jsonModel, options);
    }

    layout() {
        this._view.layout();
    }

    getModel() {
        return this._jsonModel;
    }

    getSearchWidget() {
        return this._view.searchWidget;
    }

    dispose() {
        this.emitter.offAll();
        this._view.dispose();
    }
}
