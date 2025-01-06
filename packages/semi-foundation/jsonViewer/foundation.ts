
import { JsonViewer, JsonViewerOptions } from '@douyinfe/semi-json-viewer-core';
import BaseFoundation, { DefaultAdapter, noopFunction } from '../base/foundation';

export type { JsonViewerOptions };
export interface JsonViewerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getEditorRef: () => HTMLElement;
    getSearchRef: () => HTMLInputElement;
    notifyChange: (value: string) => void;
    notifyHover: (value: string, el: HTMLElement) => HTMLElement | undefined;
    setSearchOptions: (key: string) => void;
    showSearchBar: () => void
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
            this._adapter.notifyChange(this.jsonViewer?.getModel().getValue());
            if (this.getState('showSearchBar')) {
                this.search(this._adapter.getSearchRef().value);
            }
        });
        this.jsonViewer.emitter.on('hoverNode', (e) => {
            const el = this._adapter.notifyHover(e.value, e.target);
            if (el) {
                this.jsonViewer.emitter.emit('renderHoverNode', { el });
            }
        });
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
        if (this.getProps().options.readOnly) {
            return;
        }
        this.jsonViewer?.getSearchWidget().replace(replaceText);
    }

    replaceAll(replaceText: string) {
        if (this.getProps().options.readOnly) {
            return;
        }
        this.jsonViewer?.getSearchWidget().replaceAll(replaceText);
    }

    setSearchOptions(key: string) {
        this._adapter.setSearchOptions(key);
    }

    showSearchBar() {
        this._adapter.showSearchBar();
    }
}

export default JsonViewerFoundation;