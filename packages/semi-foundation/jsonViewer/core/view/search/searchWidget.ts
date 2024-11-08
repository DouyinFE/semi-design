import { FindMatch } from '../../common/model';
import { View } from '../view';
import { elt, setStyles } from '../../common/dom';
import { JSONModel } from '../../model/jsonModel';
import { IModelContentChangeEvent } from '../../common/emitterEvents';

//TODO 修改searchResults存储数据结构
export class SearchWidget {
    private _view: View;
    private _searchInput: HTMLInputElement;
    private _replaceInput: HTMLInputElement;
    private _container: HTMLElement;
    private _jsonModel: JSONModel;
    public searchResults: FindMatch[] | null = null;
    public _currentResultIndex: number = -1;
    public matchCase: boolean = false;
    public wordSeparators: string | null = null;
    public isRegex: boolean = false;
    private _searchDiv: HTMLElement;
    private _replaceDiv: HTMLElement;

    constructor(view: View, jsonModel: JSONModel) {
        this._view = view;
        this._jsonModel = jsonModel;
        this._container = this.createSearchContainer();
        this._searchInput = this.createSearchInput();
        this._replaceInput = this.createReplaceInput();
        this._searchDiv = this.createSearchDiv();
        this._replaceDiv = this.createReplaceDiv();
        this._container.appendChild(this._searchDiv);
        this._container.appendChild(this._replaceDiv);
        this._view.jsonViewerDom.appendChild(this._container);
        this.attachEventListeners();
    }

    private createSearchContainer(): HTMLElement {
        const container = elt('div', 'search-container');
        setStyles(container, {
            position: 'absolute',
            display: 'none',
            width: '500px',
            right: '20px',
            top: '20px',
            zIndex: '1000',
            borderRadius: '3px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        });
        return container;
    }

    private createSearchDiv(): HTMLElement {
        const searchDiv = elt('div', 'search-div');
        setStyles(searchDiv, {
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid #eee',
        });

        const optionsFragment = this.createSearchOptions();
        const actionsFragment = this.createSearchActions();

        searchDiv.appendChild(this._searchInput);
        searchDiv.appendChild(optionsFragment);
        searchDiv.appendChild(actionsFragment);

        return searchDiv;
    }

    private createReplaceDiv(): HTMLElement {
        const replaceDiv = elt('div', 'replace-div');
        setStyles(replaceDiv, {
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
        });

        this._replaceInput = this.createReplaceInput();
        const replaceActionsFragment = this.createReplaceActions();

        replaceDiv.appendChild(this._replaceInput);
        replaceDiv.appendChild(replaceActionsFragment);

        return replaceDiv;
    }

    private createSearchInput(): HTMLInputElement {
        const input = elt('input', 'search-input') as HTMLInputElement;
        input.placeholder = '查找';
        setStyles(input, {
            flex: '1',
            marginRight: '10px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '3px',
        });
        return input;
    }

    private createReplaceInput(): HTMLInputElement {
        const input = elt('input', 'replace-input') as HTMLInputElement;
        input.placeholder = '替换';
        setStyles(input, {
            flex: '1',
            marginRight: '10px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '3px',
        });
        return input;
    }

    private createSearchOptions(): DocumentFragment {
        const fragment = document.createDocumentFragment();
        const options = [
            { text: 'Aa', title: '区分大小写', field: 'matchCase' },
            { text: '.*', title: '正则表达式', field: 'isRegex' },
            { text: 'ab', title: '全字匹配', field: 'wordSeparators' },
        ];

        options.forEach(option => {
            const optionElement = elt('button', 'search-option');
            optionElement.textContent = option.text;
            optionElement.title = option.title;
            setStyles(optionElement, {
                marginRight: '5px',
                padding: '5px 8px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
            });

            optionElement.addEventListener('click', () => {
                // @ts-ignore
                this[option.field] = !this[option.field];
                // @ts-ignore
                this.updateOptionStyle(optionElement, this[option.field]);
                this.search();
            });

            fragment.appendChild(optionElement);
        });
        return fragment;
    }

    private createSearchActions(): DocumentFragment {
        const fragment = document.createDocumentFragment();
        const prevButton = this.createActionButton('◀', '上一个匹配项', () => this.navigateResults(-1));
        const nextButton = this.createActionButton('▶', '下一个匹配项', () => this.navigateResults(1));
        fragment.appendChild(prevButton);
        fragment.appendChild(nextButton);
        return fragment;
    }

    private createReplaceActions(): DocumentFragment {
        const fragment = document.createDocumentFragment();
        const replaceButton = this.createActionButton('替换', '替换当前匹配项', () => this.replace());
        const replaceAllButton = this.createActionButton('全部替换', '替换所有匹配项', () => this.replaceAll());
        fragment.appendChild(replaceButton);
        fragment.appendChild(replaceAllButton);
        return fragment;
    }

    private createActionButton(text: string, title: string, onClick: () => void): HTMLButtonElement {
        const button = elt('button', 'search-action') as HTMLButtonElement;
        button.textContent = text;
        button.title = title;
        setStyles(button, {
            marginLeft: '5px',
            padding: '5px 10px',
            border: '1px solid #ccc',
            background: '#f0f0f0',
            cursor: 'pointer',
            borderRadius: '3px',
        });
        button.addEventListener('click', onClick);
        return button;
    }

    private updateOptionStyle(element: HTMLElement, isActive: boolean): void {
        setStyles(element, {
            backgroundColor: isActive ? '#e0e0e0' : 'transparent',
            fontWeight: isActive ? 'bold' : 'normal',
        });
    }

    private attachEventListeners(): void {
        this._view.contentDom.addEventListener('keydown', e => {
            if (e.key === 'f' && e.ctrlKey) {
                this.toggleSearchWidget();
            }
        });
        this._searchInput.addEventListener('input', e => {
            this.onSearchInputChange(e);
        });
    }

    private toggleSearchWidget() {
        if (this._container.style.display === 'none') {
            this._container.style.display = 'block';
            this._searchInput.focus();
        } else {
            this._container.style.display = 'none';
        }
        this.searchResults = null;
        this._view.layout();
    }

    private onSearchInputChange(event: Event): void {
        event.preventDefault();

        this.search();
    }

    private search(): void {
        this._currentResultIndex = -1;
        const searchText = this._searchInput.value;
        const isRegex = this.isRegex;
        const matchCase = this.matchCase;
        const wordSeparators = !this.wordSeparators ? this.wordSeparators : '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
        const searchScope = null; // 搜索整个文档
        const captureMatches = false;
        const limitResultCount = Infinity;
        this.searchResults = this._jsonModel.findMatches(
            searchText,
            searchScope,
            isRegex,
            matchCase,
            wordSeparators,
            captureMatches,
            limitResultCount
        );

        this._view.layout();
        this._searchInput.focus();
    }

    private navigateResults(direction: number): void {
        if (!this.searchResults || this.searchResults.length === 0) return;

        this._currentResultIndex += direction;
        if (this._currentResultIndex < 0) {
            this._currentResultIndex = this.searchResults.length - 1;
        } else if (this._currentResultIndex >= this.searchResults.length) {
            this._currentResultIndex = 0;
        }
        const currentMatch = this.searchResults[this._currentResultIndex];
        if (!currentMatch) return;
        if (
            currentMatch.range.startLineNumber > this._view.startLineNumber + this._view.visibleLineCount ||
            currentMatch.range.startLineNumber < this._view.startLineNumber
        ) {
            this._view.scrollToLine(currentMatch.range.startLineNumber);
        } else {
            this._view.layout();
        }
    }

    private replace(): void {
        if (!this._replaceInput.value || !this.searchResults) return;
        if (this._currentResultIndex < 0) {
            this._currentResultIndex = 0;
        }
        const currentMatch = this.searchResults[this._currentResultIndex];
        const startOffset = this._jsonModel.getOffsetAt(
            currentMatch.range.startLineNumber,
            currentMatch.range.startColumn - 1
        );
        const endOffset = this._jsonModel.getOffsetAt(
            currentMatch.range.endLineNumber,
            currentMatch.range.endColumn - 1
        );
        const op: IModelContentChangeEvent = {
            range: currentMatch.range,
            newText: this._replaceInput.value,
            oldText: this._jsonModel.getValueInRange(currentMatch.range),
            type: 'replace',
            rangeOffset: startOffset,
            rangeLength: endOffset - startOffset,
        };
        this.searchResults.splice(this._currentResultIndex, 1);

        this._jsonModel.applyOperation(op);
    }

    private replaceAll(): void {
        if (!this._replaceInput.value || !this.searchResults) return;
        const op: IModelContentChangeEvent[] = [];
        for (let i = this.searchResults.length - 1; i >= 0; i--) {
            const match = this.searchResults[i];
            const startOffset = this._jsonModel.getOffsetAt(match.range.startLineNumber, match.range.startColumn - 1);
            const endOffset = this._jsonModel.getOffsetAt(match.range.endLineNumber, match.range.endColumn - 1);
            op.push({
                range: match.range,
                newText: this._replaceInput.value,
                oldText: this._jsonModel.getValueInRange(match.range),
                type: 'replace',
                rangeOffset: startOffset,
                rangeLength: endOffset - startOffset,
            });
        }
        this.searchResults = null;
        this._jsonModel.applyOperation(op);
    }

    public binarySearchByLine(targetLine: number): FindMatch[] | null {
        const matches: FindMatch[] = [];
        if (!this.searchResults) return null;
        // 二分查找第一个匹配的位置
        let left = 0;
        let right = this.searchResults.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const currentLine = this.searchResults[mid].range.startLineNumber;

            if (currentLine === targetLine) {
                // 找到匹配项，收集所有相同行号的结果
                let i = mid;
                while (i >= 0 && this.searchResults[i].range.startLineNumber === targetLine) {
                    matches.unshift(this.searchResults[i]);
                    i--;
                }
                i = mid + 1;
                while (i < this.searchResults.length && this.searchResults[i].range.startLineNumber === targetLine) {
                    matches.push(this.searchResults[i]);
                    i++;
                }
                return matches;
            }

            if (currentLine < targetLine) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return matches;
    }
}
