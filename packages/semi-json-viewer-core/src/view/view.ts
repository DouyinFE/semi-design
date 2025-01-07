import { JSONModel } from '../model/jsonModel';
import { elt, setStyles } from '../common/dom';
import { Token } from '../tokens/tokenize';
import { Emitter, getEmitter } from '../common/emitter';
import { SelectionModel } from '../model/selectionModel';
import { JsonViewerOptions } from '../json-viewer/jsonViewer';
import { getJsonWorkerManager, JsonWorkerManager } from '../worker/jsonWorkerManager';
import { FoldingModel } from '../model/foldingModel';
import { SearchWidget } from './search/searchWidget';
import { EditWidget } from './edit/editWidget';
import { FindMatch } from '../common/model';
import { FoldWidget } from './fold/foldWidget';
import { TokenizationJsonModelPart } from '../tokens/tokenizationJsonModelPart';
import { ScalingCellSizeAndPositionManager } from './virtualized/ScalingCellSizeAndPositionManager';
import { CompleteWidget } from './complete/completeWidget';
import { HoverWidget } from './hover/hoverWidget';
import { GlobalEvents } from '../common/emitterEvents';
import { ErrorWidget } from './error/errorWidget';
//TODO 实现ViewModel抽离代码

/**
 * View 类用于管理 JSON Viewer 的视图
 */
export class View {
    private _jsonModel: JSONModel;
    private _selectionModel: SelectionModel;
    private _foldingModel: FoldingModel;

    private _options: JsonViewerOptions | undefined;
    public _lineHeight: number;

    private _container: HTMLElement;
    private _jsonViewerDom: HTMLElement;
    private _lineNumberDom: HTMLElement;
    private _lineScrollDom: HTMLElement;
    private _contentDom: HTMLElement;
    private _scrollDom: HTMLElement;

    public startLineNumber: number = 1;
    public visibleLineCount: number = 0;

    private _verticalOffsetAdjustment: number = 0;

    private _searchWidget: SearchWidget;
    private _editWidget: EditWidget;
    private _foldWidget: FoldWidget;
    private _completeWidget: CompleteWidget;
    private _hoverWidget: HoverWidget;
    private _errorWidget: ErrorWidget;
    private _jsonWorkerManager: JsonWorkerManager = getJsonWorkerManager();
    private _tokenizationJsonModelPart: TokenizationJsonModelPart;
    private _scalingCellSizeAndPositionManager: ScalingCellSizeAndPositionManager;

    private _measuredHeights: { [index: number]: number } = {};

    private emitter: Emitter<GlobalEvents> = getEmitter();

    constructor(container: HTMLElement, model: JSONModel, options?: JsonViewerOptions) {
        this._container = container;
        this._jsonModel = model;
        this._selectionModel = new SelectionModel(1, 0, this, model);
        this._foldingModel = new FoldingModel(model);

        this._lineHeight = options?.lineHeight || 20;
        this._options = options;

        this._jsonViewerDom = this.createRenderContainer();
        this._lineNumberDom = this.createLineNumberContainer();
        this._contentDom = this.createContentContainer();
        this._scrollDom = this.createScrollElement();
        this._lineScrollDom = this.createLineScrollContainerElement();

        this._contentDom.appendChild(this._scrollDom);
        this._lineNumberDom.appendChild(this._lineScrollDom);
        this._jsonViewerDom.appendChild(this._lineNumberDom);
        this._jsonViewerDom.appendChild(this._contentDom);
        this._container.appendChild(this._jsonViewerDom);

        this._searchWidget = new SearchWidget(this, this._jsonModel);
        this._foldWidget = new FoldWidget(this, this._foldingModel);
        this._editWidget = new EditWidget(this, this._jsonModel, this._selectionModel);
        this._completeWidget = new CompleteWidget(this, this._jsonModel, this._selectionModel);
        this._hoverWidget = new HoverWidget(this);
        this._errorWidget = new ErrorWidget(this);

        this._tokenizationJsonModelPart = new TokenizationJsonModelPart(this._jsonModel);

        this._scalingCellSizeAndPositionManager = new ScalingCellSizeAndPositionManager({
            cellCount: this._jsonModel.getLineCount(),
            cellSizeGetter: ({ index }) => this.getCellSize(index),
            estimatedCellSize: this._lineHeight,
        });

        this._attachEventListeners();
    }

    get tokenizationJsonModelPart() {
        return this._tokenizationJsonModelPart;
    }

    get contentDom() {
        return this._contentDom;
    }

    get jsonViewerDom() {
        return this._jsonViewerDom;
    }

    get scrollDom() {
        return this._scrollDom;
    }

    get lineScrollDom() {
        return this._lineScrollDom;
    }

    get options() {
        return this._options;
    }

    get completeWidget() {
        return this._completeWidget;
    }

    get editWidget() {
        return this._editWidget;
    }

    get scalingCellSizeAndPositionManager() {
        return this._scalingCellSizeAndPositionManager;
    }

    get searchWidget() {
        return this._searchWidget;
    }

    public dispose() {
        this._container.removeChild(this._jsonViewerDom);
    }

    private _attachEventListeners() {
        this._jsonViewerDom.addEventListener('scroll', e => {
            this.onScroll(this._jsonViewerDom.scrollTop);
        });

        this._jsonViewerDom.addEventListener('click', e => {
            e.preventDefault();
            this._selectionModel.toLastPosition();
        });

        this._contentDom.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            this._completeWidget.hide();
            this._selectionModel.isSelectedAll = false;
            this._selectionModel.updateFromSelection();
        });

        this.emitter.on('contentChanged', () => {
            this.resetScalingManagerConfigAndCell(0);
            if (this._jsonModel.lastChangeBufferPos.lineNumber >= this.visibleLineCount + this.startLineNumber) {
                this.scrollToLine(this._jsonModel.lastChangeBufferPos.lineNumber - this.visibleLineCount + 1);
                return;
            }
            this.layout();
        });
        this.emitter.on('forceRender', () => {
            this.resetScalingManagerConfigAndCell(0);
            this.layout();
            this._errorWidget.renderErrorLine();
        });
    }

    public getLineElement(lineNumber: number): HTMLElement | null {
        return this.scrollDom.querySelector(`[data-line-number="${lineNumber}"]`);
    }

    public updateVisibleRange(start: number, end: number) {
        this.startLineNumber = start;
        this.visibleLineCount = end - start + 1;
    }

    public onScroll(scrollTop: number) {
        this._jsonViewerDom.scrollTop = scrollTop;
        this.layout();
        this._errorWidget.renderErrorLine();
    }

    public scrollToLine(lineNumber: number): void {
        const scrollTop = (lineNumber - 1) * this._lineHeight;
        this._contentDom.scrollTop = scrollTop;
        this.onScroll(scrollTop);
    }

    private createRenderContainer(): HTMLElement {
        const renderContainer = elt('div', 'json-viewer-container');
        setStyles(renderContainer, {
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'auto',
        });
        return renderContainer;
    }

    private createLineNumberContainer(): HTMLElement {
        const lineNumberClass = 'semi-json-viewer-line-number-container';
        const lineNumberContainer = elt('div', lineNumberClass);
        setStyles(lineNumberContainer, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '50px',
        });
        return lineNumberContainer;
    }

    private createLineScrollContainerElement(): HTMLElement {
        const lineScrollContainer = elt('div', 'line-scroll-container');
        setStyles(lineScrollContainer, {
            position: 'absolute',
            top: '0',
            left: '0',
            height: `${this._lineHeight * this._jsonModel.getLineCount()}px`,
            width: '100%',
            overflow: 'hidden',
        });
        return lineScrollContainer;
    }

    private createContentContainer(): HTMLElement {
        const contentClass = 'semi-json-viewer-content-container';
        const contentContainer = elt('div', contentClass);
        setStyles(contentContainer, {
            position: 'absolute',
            left: '50px',
            top: '0',
            right: '0',
            overflowX: 'auto',
            overflowY: 'scroll',
            outline: 'none',
        });
        if (!this._options?.readOnly) {
            contentContainer.contentEditable = 'true';
            contentContainer.style.caretColor = 'black';
            contentContainer.spellcheck = false;
        }
        return contentContainer;
    }

    private createLineNumberElement(actualLineNumber: number, visibleLineNumber: number): HTMLElement {
        const lineNumberClass = 'semi-json-viewer-line-number';
        const lineNumberElement = elt('div', lineNumberClass);
        const rowDatum = this._scalingCellSizeAndPositionManager.getSizeAndPositionOfCell(visibleLineNumber);
        setStyles(lineNumberElement, {
            position: 'absolute',
            width: '50px',
            height: `${this._lineHeight}px`,
            lineHeight: `${this._lineHeight}px`,
            top: `${rowDatum.offset + this._verticalOffsetAdjustment}px`,
        });
        const lineNumber = elt('span', 'line-number-text', {
            position: 'absolute',
            left: '0',
            top: '0',
            textAlign: 'right',
            width: '60%',
            height: '100%',
        });
        lineNumber.innerHTML = actualLineNumber.toString();
        lineNumberElement.appendChild(lineNumber);
        lineNumberElement.dataset.lineNumber = actualLineNumber.toString();
        return lineNumberElement;
    }

    private createScrollElement(): HTMLElement {
        const scrollEl = elt('div', 'lines-content');

        setStyles(scrollEl, {
            position: 'relative',
            overflow: 'hidden',
            top: '0',
            left: '0',
            tabSize: (this._options?.formatOptions?.tabSize || 4).toString(),
            height: `${this._lineHeight * this._jsonModel.getLineCount()}px`,
        });
        if (this._options?.autoWrap) {
            scrollEl.style.width = '100%';
        }
        return scrollEl;
    }

    private createLineContentElement(
        lineContent: string,
        actualLineNumber: number,
        visibleLineNumber: number
    ): HTMLElement {
        const rowDatum = this._scalingCellSizeAndPositionManager.getSizeAndPositionOfCell(visibleLineNumber);
        const lineElementClass = 'semi-json-viewer-view-line';
        const lineElement = elt('div', lineElementClass);
        lineElement.setAttribute('data-line-element', 'true');
        setStyles(lineElement, {
            lineHeight: `${this._lineHeight}px`,
            width: '100%',
            position: 'absolute',
            top: `${rowDatum.offset + this._verticalOffsetAdjustment}px`,
        });
        if (!this._options?.autoWrap) {
            lineElement.style.height = `${this._lineHeight}px`;
        }
        lineElement.innerHTML = lineContent;
        lineElement.dataset.lineNumber = actualLineNumber.toString();
        // @ts-ignore
        lineElement.lineNumber = actualLineNumber;
        return lineElement;
    }

    private getCellSize(index: number): number {
        if (this._options?.autoWrap) {
            return this._measuredHeights[index] || this._lineHeight;
        }
        return this._lineHeight;
    }

    private _measureAndUpdateItemHeight(item: HTMLElement, index: number) {
        const height = item.offsetHeight;
        const width = item.textContent?.length * 10;
        if (!this._options?.autoWrap && width > this._scrollDom.offsetWidth) {
            this._scrollDom.style.width = `${width}px`;
        }
        if (height === 0) {
            item.style.height = `${this._lineHeight}px`;
            return;
        }
        if (height !== this._measuredHeights[index]) {
            this._measuredHeights[index] = height;
            this._scalingCellSizeAndPositionManager.resetCell(index);
            this._scrollDom.style.height = `${this._scalingCellSizeAndPositionManager.getTotalSize()}px`;
        }
    }

    private clearContainers() {
        this._lineScrollDom.innerHTML = '';
        this._scrollDom.innerHTML = '';
    }

    public resetScalingManagerConfigAndCell(index: number) {
        this._scalingCellSizeAndPositionManager.configure({
            cellCount: this._jsonModel.getLineCount(),
            cellSizeGetter: ({ index }) => this.getCellSize(index),
            estimatedCellSize: this._lineHeight,
        });
        this._scalingCellSizeAndPositionManager.resetCell(index);
    }

    public layout() {
        this.clearContainers();

        const visibleLineCount = this._foldingModel.getVisibleLineCount();
        this._scalingCellSizeAndPositionManager.configure({
            cellCount: visibleLineCount,
            cellSizeGetter: ({ index }) => this.getCellSize(index),
            estimatedCellSize: this._lineHeight,
        });

        const visibleRange = this._scalingCellSizeAndPositionManager.getVisibleCellRange({
            containerSize: this._container.clientHeight,
            offset: this._jsonViewerDom.scrollTop,
        });

        const verticalOffsetAdjustment = this._scalingCellSizeAndPositionManager.getOffsetAdjustment({
            containerSize: this._container.clientHeight,
            offset: this._jsonViewerDom.scrollTop,
        });
        this._verticalOffsetAdjustment = verticalOffsetAdjustment;
        this.renderVisibleLines(visibleRange.start!, visibleRange.stop!);
        this.updateVisibleRange(visibleRange.start! + 1, visibleRange.stop! + 1);

        if (!this._options?.readOnly) {
            this._selectionModel.toViewPosition();
            this._completeWidget.show();
        }
        const totalSize = this._scalingCellSizeAndPositionManager.getTotalSize();
        this._scrollDom.style.height = `${totalSize}px`;
        this._lineScrollDom.style.height = `${totalSize}px`;
    }

    private renderVisibleLines(startVisibleLine: number, endVisibleLine: number) {
        this._tokenizationJsonModelPart.forceTokenize(endVisibleLine + 1);
        let actualLineNumber = this._foldingModel.getActualLineNumber(startVisibleLine + 1);
        let visibleLineNumber = startVisibleLine;
        while (visibleLineNumber <= endVisibleLine && actualLineNumber <= this._jsonModel.getLineCount()) {
            if (!this._foldingModel.isLineCollapsed(actualLineNumber)) {
                this.renderLine(actualLineNumber, visibleLineNumber);
                visibleLineNumber++;
            }
            actualLineNumber = this._foldingModel.getNextVisibleLine(actualLineNumber);
        }
    }

    private renderLine(actualLineNumber: number, visibleLineNumber: number) {
        const line = this._jsonModel.getLineContent(actualLineNumber);

        const tokens = this._tokenizationJsonModelPart.getLineTokens(actualLineNumber);

        const lineNumberElement = this.renderLineNumber(actualLineNumber, visibleLineNumber);
        const lineElement = this.renderLineContent(actualLineNumber, visibleLineNumber, tokens, line);
    }

    private renderLineNumber(actualLineNumber: number, visibleLineNumber: number) {
        const lineNumberElement = this.createLineNumberElement(actualLineNumber, visibleLineNumber);
        this._lineScrollDom.appendChild(lineNumberElement);
        return lineNumberElement;
    }

    private renderLineContent(actualLineNumber: number, visibleLineNumber: number, tokens: Token[], line: string) {
        const lineContent = this.renderTokensWithHighlight(tokens, line, actualLineNumber);
        const lineElement = this.createLineContentElement(lineContent, actualLineNumber, visibleLineNumber);
        this._scrollDom.appendChild(lineElement);

        this._measureAndUpdateItemHeight(lineElement, visibleLineNumber);
        return lineElement;
    }

    private renderTokensWithHighlight(tokens: Token[], text: string, lineNumber: number): string {
        let html = '';
        let currentOffset = 0;

        const searchResults = this._searchWidget.binarySearchByLine(lineNumber);
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const start = token.startIndex;
            const end = i + 1 < tokens.length ? tokens[i + 1].startIndex : text.length;
            let content = text.substring(start, end);

            if (searchResults && searchResults.length > 0) {
                html += this.highlightContent(content, currentOffset, searchResults, token.scopes);
            } else {
                content = this.escapeHtml(content);
                html += `<span class="${token.scopes}">${content}</span>`;
            }

            currentOffset += content.length;
        }

        return html;
    }

    private highlightContent(content: string, offset: number, searchResults: FindMatch[], tokenClass: string): string {
        let result = '';
        let lastIndex = 0;

        for (const match of searchResults) {
            const startIndex = Math.max(0, match.range.startColumn - 1 - offset);
            const endIndex = Math.min(content.length, match.range.endColumn - 1 - offset);

            if (startIndex >= content.length || endIndex <= 0) continue;

            if (startIndex > lastIndex) {
                result += `<span class="${tokenClass}">${this.escapeHtml(
                    content.substring(lastIndex, startIndex)
                )}</span>`;
            }

            const highlightedText = this.escapeHtml(content.substring(startIndex, endIndex));
            const currentMatch = this._searchWidget.searchResults?.[this._searchWidget._currentResultIndex];
            const searchResultClass = 'semi-json-viewer-search-result';
            const currentSearchResultClass = 'semi-json-viewer-current-search-result';
            if (
                match.range.startLineNumber === currentMatch?.range.startLineNumber &&
                match.range.endLineNumber === currentMatch?.range.endLineNumber &&
                match.range.startColumn === currentMatch?.range.startColumn &&
                match.range.endColumn === currentMatch?.range.endColumn
            ) {
                result += `<span class="${tokenClass} ${searchResultClass} ${currentSearchResultClass}" data-start-column="${match.range.startColumn}" data-end-column="${match.range.endColumn}">${highlightedText}</span>`;
            } else {
                result += `<span class="${tokenClass} ${searchResultClass}" data-start-column="${match.range.startColumn}" data-end-column="${match.range.endColumn}">${highlightedText}</span>`;
            }

            lastIndex = endIndex;
        }

        if (lastIndex < content.length) {
            result += `<span class="${tokenClass}">${this.escapeHtml(content.substring(lastIndex))}</span>`;
        }

        return result;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/ /g, '&nbsp;')
            .replace(/\t/g, '&#9;');
    }
}
