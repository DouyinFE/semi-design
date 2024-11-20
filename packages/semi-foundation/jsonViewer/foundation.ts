
export * from '@douyinfe/semi-json-viewer-core';
import { JsonViewer, JsonViewerOptions } from '@douyinfe/semi-json-viewer-core';
import BaseFoundation, { DefaultAdapter, noopFunction } from '../base/foundation';

export interface JsonViewerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getEditorRef: () => HTMLElement;
    onValueChange: (value: string) => void;
    onValueHover: (value: string, el: HTMLElement) => HTMLElement | undefined
}


class JsonViewerFoundation extends BaseFoundation<JsonViewerAdapter> {
    constructor(adapter: JsonViewerAdapter) {
        super({ ...JsonViewerFoundation, ...adapter });
    }

    jsonViewer: JsonViewer | null = null;

    init() {
        const props = this.getProps();
        const editorRef = this._adapter.getEditorRef();
        this.jsonViewer = new JsonViewer(editorRef, props.value, props.options);
        this.jsonViewer.layout();
        this.jsonViewer.emitter.on('contentChanged', (e) => {
            this.onValueChange(this.jsonViewer?.getModel().getValue());
        });
        this.jsonViewer.emitter.on('hoverNode', (e) => {
            const el = this.onValueHover(e.value, e.target);
            if (el) {
                this.jsonViewer.emitter.emit('renderHoverNode', { el });
            }
        });
    }

    onValueChange(value: string) {
        this._adapter.onValueChange(value);
    }

    onValueHover(value: string, el: HTMLElement): HTMLElement | undefined {
        return this._adapter.onValueHover(value, el);
    }

    search(searchText: string) {
        const state = this.getState('searchOptions');
        const { caseSensitive, wholeWord, regex } = state;
        this.jsonViewer?.getSearchWidget().search(searchText, caseSensitive, wholeWord, regex);
    }

    prevSearch() {
        this.jsonViewer?.getSearchWidget().navigateResults(-1);
    }

    nextSearch() {
        this.jsonViewer?.getSearchWidget().navigateResults(1);
    }

    replace(replaceText: string) {
        this.jsonViewer?.getSearchWidget().replace(replaceText);
    }

    replaceAll(replaceText: string) {
        this.jsonViewer?.getSearchWidget().replaceAll(replaceText);
    }
}

export default JsonViewerFoundation;