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

    public updateFromSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        this.isCollapsed = range.collapsed;
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;

        let { row: row1, col: col1 } = this.convertRangeToModelPosition(startContainer, selection, true);
        let { row: row2, col: col2 } = this.convertRangeToModelPosition(endContainer, selection, false);
        if (row1 > row2) {
            [row1, row2] = [row2, row1];
            [col1, col2] = [col2, col1];
        } else if (row1 === row2 && col1 > col2) {
            [col1, col2] = [col2, col1];
        }

        this._row = row1;
        this._col = col1;
        this.startRow = row1;
        this.startCol = col1;
        this.endRow = row2;
        this.endCol = col2;
        this._jsonModel.lastChangeBufferPos = {
            lineNumber: this._row,
            column: this._col,
        };
    }

    public toViewPosition() {
        const selection = window.getSelection();

        if (!selection) return;
        const range = new Range();

        if (this.isSelectedAll) {
            range.setStartBefore(this._view.scrollDom.firstChild!);
            range.setEndAfter(this._view.scrollDom.lastChild!);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }
        const row = this._jsonModel.lastChangeBufferPos.lineNumber;
        const col = this._jsonModel.lastChangeBufferPos.column - 1;

        const lineElement = this._view.getLineElement(row);
        if (!lineElement) return;
        if (col === 0) {
            range.setStart(lineElement, 0);
            range.setEnd(lineElement, 0);
        } else {
            let offset = col;
            for (let i = 0; i < lineElement.childNodes.length; i++) {
                const childNode = lineElement.childNodes[i];
                if (childNode.textContent && offset <= childNode.textContent.length) {
                    range.setStart(childNode.childNodes[0], offset);
                    range.setEnd(childNode.childNodes[0], offset);
                    break;
                }
                offset -= (childNode as Text).textContent?.length || 0;
            }
        }

        if (!selection) return;
        selection.removeAllRanges();
        selection.addRange(range);
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
            lineElement = node.closest('.semi-json-viewer-view-line');
        } else {
            lineElement = getLineElement(node);
            if (!lineElement) return { row, col };
            let totalOffset = 0;
            for (let i = 0; i < lineElement.childNodes.length; i++) {
                const childNode = lineElement.childNodes[i];

                if (childNode === node.parentElement) {
                    totalOffset += isStart ? selection.anchorOffset : selection.focusOffset;
                    break;
                }
                totalOffset += childNode.textContent?.length || 0;
            }

            col = totalOffset;
        }
        row = (lineElement as any).lineNumber || 1;
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
