import { JSONModel } from './jsonModel';
import { View } from '../view/view';
import { getLineElement } from '../common/dom';
import { Position } from '../common/position';

/**
 * 选择模型，管理JSON的选中范围和选中状态
 */
export class SelectionModel {
    private _row: number;
    private _col: number;
    public startRow: number;
    public startCol: number;
    public endRow: number;
    public endCol: number;
    public preStartRow: number;
    public preStartCol: number;
    public preEndRow: number;
    public preEndCol: number;
    public isCollapsed: boolean;
    public isSelectedAll: boolean = false;
    public isSelecting: boolean = false;
    private _view: View;
    private _jsonModel: JSONModel;
    constructor(row: number, col: number, view: View, jsonModel: JSONModel) {
        this._row = row;
        this._col = col;
        this._view = view;
        this.startRow = row;
        this.startCol = col;
        this.endRow = row;
        this.endCol = col;
        this.isCollapsed = true;
        this._jsonModel = jsonModel;
    }


    updateSelection(row: number, col: number) {
        this._row = row;
        this._col = col;
    }

    getSelection() {
        return {
            row: this._row,
            col: this._col,
        };
    }

    getPosition(): Position {
        return {
            lineNumber: this._row,
            column: this._col,
        } as Position;
    }

    /**
     * 同步 DOM 选区到模型，更新完整选区
     */
    public updateFromSelection() {
        const selection = this._getValidSelection();
        if (!selection) return;
        this.isCollapsed = selection.isCollapsed;
        const startContainer = selection.anchorNode;
        const endContainer = selection.focusNode;

        let { row: row1, col: col1 } = this.convertRangeToModelPosition(startContainer, selection, true);
        let { row: row2, col: col2 } = this.convertRangeToModelPosition(endContainer, selection, false);
        // 保证 row1/col1 是起点，row2/col2 是终点
        if (row1 > row2 || (row1 === row2 && col1 > col2)) {
            [row1, row2] = [row2, row1];
            [col1, col2] = [col2, col1];
        }
        this._setSelection(row1, col1, row2, col2);
        this._jsonModel.lastChangeBufferPos = {
            lineNumber: this._row,
            column: this._col,
        };
    }

    /**
     * 仅更新选区起点（如拖拽选择时）
     */
    public updateFromSelectingStart() {
        const selection = this._getValidSelection();
        if (!selection) return;
        this.isCollapsed = selection.isCollapsed;
        const startContainer = selection.anchorNode;
        let { row, col } = this.convertRangeToModelPosition(startContainer, selection, true);
        this._setSelection(row, col, this.endRow, this.endCol);
    }

    /**
     * 仅更新选区终点（如拖拽选择时）
     */
    public updateFromSelectingEnd() {
        const selection = this._getValidSelection();
        if (!selection) return;
        this.isCollapsed = selection.isCollapsed;
        const endContainer = selection.focusNode;
        let { row, col } = this.convertRangeToModelPosition(endContainer, selection, false);
        this._setSelection(this.startRow, this.startCol, row, col);
        this._jsonModel.lastChangeBufferPos = {
            lineNumber: this._row,
            column: this._col,
        };
    }

    /**
     * 获取有效的 Selection 对象
     */
    private _getValidSelection(): Selection | null {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !selection.anchorNode || !selection.focusNode) {
            return null;
        }
        return selection;
    }

    /**
     * 批量设置选区
     */
    private _setSelection(startRow: number, startCol: number, endRow: number, endCol: number) {
        this._row = startRow;
        this._col = startCol;
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }

    public toViewPosition() {
        const selection = window.getSelection();
        if (!selection) return;

        if (this.isSelectedAll) {
            const firstChild = this._view.scrollDom.firstChild;
            const lastChild = this._view.scrollDom.lastChild;

            if (!firstChild || !lastChild) {
                selection.removeAllRanges();
                return;
            }

            const range = new Range();
            range.setStartBefore(firstChild);
            range.setEndAfter(lastChild);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }

        // Handle multi-selection (non-collapsed selection)
        if (!this.isCollapsed) {
            this._restoreMultiSelection(selection);
            return;
        }

        const row = this._jsonModel.lastChangeBufferPos.lineNumber;
        const col = this._jsonModel.lastChangeBufferPos.column - 1;
        const firstVisibleLineElement = this._view.scrollDom.firstElementChild as HTMLElement | null;
        const lastVisibleLineElement = this._view.scrollDom.lastElementChild as HTMLElement | null;

        if (!firstVisibleLineElement || !lastVisibleLineElement) {
            selection.removeAllRanges();
            return;
        }

        const lineElement = this._view.getLineElement(row);

        const range = new Range();

        if (!lineElement) {
            const firstVisibleLineNumber = Number(firstVisibleLineElement.dataset.lineNumber || 0);
            const lastVisibleLineNumber = Number(lastVisibleLineElement.dataset.lineNumber || 0);

            if (row < firstVisibleLineNumber) {
                range.setStartBefore(firstVisibleLineElement);
                range.setEndBefore(firstVisibleLineElement);
            } else if (row > lastVisibleLineNumber) {
                range.setStartAfter(lastVisibleLineElement);
                range.setEndAfter(lastVisibleLineElement);
            } else {
                selection.removeAllRanges();
                return;
            }
        } else {
            const position = this._findPositionInLine(lineElement, col);

            if (position) {
                range.setStart(position.node, position.offset);
                range.setEnd(position.node, position.offset);
            } else {
                range.setStart(lineElement, 0);
                range.setEnd(lineElement, 0);
            }
        }

        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Restore multi-selection (non-collapsed selection) after DOM re-render
     */
    private _restoreMultiSelection(selection: Selection) {
        const firstVisibleLineElement = this._view.scrollDom.firstElementChild as HTMLElement | null;
        const lastVisibleLineElement = this._view.scrollDom.lastElementChild as HTMLElement | null;

        if (!firstVisibleLineElement || !lastVisibleLineElement) {
            selection.removeAllRanges();
            return;
        }

        const startLineElement = this._view.getLineElement(this.startRow);
        const endLineElement = this._view.getLineElement(this.endRow);
        const firstVisibleLineNumber = Number(firstVisibleLineElement.dataset.lineNumber || 0);
        const lastVisibleLineNumber = Number(lastVisibleLineElement.dataset.lineNumber || 0);

        const isSelectionAboveViewport = this.endRow < firstVisibleLineNumber;
        const isSelectionBelowViewport = this.startRow > lastVisibleLineNumber;

        // Entire selection is above the viewport, keep browser selection constrained inside JsonViewer.
        if (isSelectionAboveViewport) {
            const range = new Range();
            range.setStartBefore(firstVisibleLineElement);
            range.setEndBefore(firstVisibleLineElement);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }

        // Entire selection is below the viewport, keep browser selection constrained inside JsonViewer.
        if (isSelectionBelowViewport) {
            const range = new Range();
            range.setStartAfter(lastVisibleLineElement);
            range.setEndAfter(lastVisibleLineElement);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }

        const range = new Range();

        // Set start position
        if (startLineElement) {
            const startPos = this._findPositionInLine(startLineElement, this.startCol - 1);
            if (startPos) {
                range.setStart(startPos.node, startPos.offset);
            } else {
                // Fallback: set to start of line
                range.setStart(startLineElement, 0);
            }
        } else {
            // Start line is not visible (scrolled above), extend selection to the beginning of scrollDom
            range.setStartBefore(firstVisibleLineElement);
        }

        // Set end position
        if (endLineElement) {
            const endPos = this._findPositionInLine(endLineElement, this.endCol - 1);
            if (endPos) {
                range.setEnd(endPos.node, endPos.offset);
            } else {
                // Fallback: set to end of line
                const lastChild = endLineElement.lastChild;
                if (lastChild) {
                    if (lastChild.nodeType === Node.TEXT_NODE) {
                        range.setEnd(lastChild, lastChild.textContent?.length || 0);
                    } else {
                        range.setEnd(endLineElement, endLineElement.childNodes.length);
                    }
                }
            }
        } else {
            // End line is not visible (scrolled below), extend selection to the end of scrollDom
            range.setEndAfter(lastVisibleLineElement);
        }

        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * Find the text node and offset for a given column position in a line element
     */
    private _findPositionInLine(lineElement: HTMLElement, col: number): { node: Text; offset: number } | null {
        if (col === 0) {
            // Find the first text node
            const walker = document.createTreeWalker(lineElement, NodeFilter.SHOW_TEXT, null);
            const firstNode = walker.nextNode() as Text;
            if (firstNode) {
                return { node: firstNode, offset: 0 };
            }
            return null;
        }

        const walker = document.createTreeWalker(lineElement, NodeFilter.SHOW_TEXT, null);
        let node: Text | null = walker.nextNode() as Text;
        let currentOffset = 0;

        while (node) {
            const nodeLength = node.length;
            if (currentOffset + nodeLength >= col) {
                return { node, offset: col - currentOffset };
            }
            currentOffset += nodeLength;
            node = walker.nextNode() as Text;
        }

        // If col is beyond the line, return the end of the last text node
        walker.currentNode = lineElement;
        let lastNode: Text | null = null;
        while (walker.nextNode()) {
            lastNode = walker.currentNode as Text;
        }
        if (lastNode) {
            return { node: lastNode, offset: lastNode.length };
        }

        return null;
    }

    public toLastPosition() {
        this.isCollapsed = true;
        this.isSelectedAll = false;
        const lineCount = this._jsonModel.getLineCount();
        const lineLength = this._jsonModel.getLineLength(lineCount);
        this._row = lineCount;
        this._col = lineLength + 1;
        this.startRow = lineCount;
        this.startCol = lineLength + 1;
        this.endRow = lineCount;
        this.endCol = lineLength + 1;
        this._jsonModel.lastChangeBufferPos = {
            lineNumber: lineCount,
            column: lineLength + 1,
        };
        this.toViewPosition();
    }

    public convertRangeToModelPosition(node: Node, selection: Selection, isStart: boolean) {
        let row = 1;
        let col = 0;
        if (!node) return { row, col };
        
        let lineElement: HTMLElement | null;
        if (node instanceof HTMLElement) {
            lineElement = node.closest(`.${this._view.prefixCls}-view-line`);
        } else {
            lineElement = getLineElement(node);
            if (!lineElement) return { row, col };

            const walker = document.createTreeWalker(
                lineElement,
                NodeFilter.SHOW_TEXT,
                null
            );

            let currentNode: Text | null = walker.nextNode() as Text;
            let totalOffset = 0;
            
            while (currentNode) {
                if (currentNode === node) {
                    totalOffset += isStart ? selection.anchorOffset : selection.focusOffset;
                    break;
                }
                if (currentNode.parentNode === node.parentNode) {
                    if (currentNode === node) {
                        totalOffset += isStart ? selection.anchorOffset : selection.focusOffset;
                        break;
                    }
                }
                
                totalOffset += currentNode.length;
                currentNode = walker.nextNode() as Text;
            }
            
            col = totalOffset;
        }
        row = (lineElement as any)?.lineNumber || 1;
        return { row, col: col + 1 };
    }

    public savePreviousSelection() {
        this.preStartRow = this.startRow;
        this.preStartCol = this.startCol;
        this.preEndRow = this.endRow;
        this.preEndCol = this.endCol;
    }

    public restorePreviousSelection() {
        this.startRow = this.preStartRow;
        this.startCol = this.preStartCol;
        this.endRow = this.preEndRow;
        this.endCol = this.preEndCol;
        this._jsonModel.lastChangeBufferPos = {
            lineNumber: this.startRow,
            column: this.startCol,
        };
    }
    
}
