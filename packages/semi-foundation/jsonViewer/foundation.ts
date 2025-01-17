
import { JsonViewer, JsonViewerOptions, CustomRenderRule } from '@douyinfe/semi-json-viewer-core';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export type { JsonViewerOptions, CustomRenderRule };
export interface JsonViewerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getEditorRef: () => HTMLElement;
    getSearchRef: () => HTMLInputElement;
    notifyChange: (value: string) => void;
    notifyHover: (value: string, el: HTMLElement) => HTMLElement | undefined;
    setSearchOptions: (key: string) => void;
    showSearchBar: () => void;
    notifyCustomRender: (customRenderMap: Map<HTMLElement, any>) => void
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
        this.jsonViewer.emitter.on('customRender', (e) => {
            this._adapter.notifyCustomRender(e.customRenderMap);
        });
        this.jsonViewer.layout();
        this.jsonViewer.emitter.on('contentChanged', (e) => {
            this._adapter.notifyChange(this.jsonViewer?.getModel().getValue());
            if (this.getState('showSearchBar')) {
                this.search(this._adapter.getSearchRef().value);
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