import { SelectionModel } from '../../model/selectionModel';
import { View } from '../view';
import { JSONModel } from '../../model/jsonModel';
import { applyEdits, Edit } from 'jsonc-parser';
import { getJsonWorkerManager, JsonWorkerManager } from '../../worker/jsonWorkerManager';
import { FoldingModel } from '../../model/foldingModel';
import { Emitter, getEmitter } from '../../common/emitter';
import { GlobalEvents, IModelContentChangeEvent } from '../../common/emitterEvents';
import { Range } from '../../common/range';
import { IndentAction, processJsonEnterAction } from './getEnterAction';
import { firstNonWhitespaceIndex, getLeadingWhitespace } from '../../common/strings';
/**
 * EditWidget 类用于管理 JSON Viewer 中的编辑功能
 */
export class EditWidget {
    private _view: View;
    private _selectionModel: SelectionModel;
    private _jsonModel: JSONModel;
    private _foldingModel: FoldingModel;
    private _autoClosingPairs: Record<string, string> = {
        '{': '}',
        '[': ']',
        '(': ')',
        '"': '"',
    };
    private emitter: Emitter<GlobalEvents> = getEmitter();
    constructor(
        view: View,
        jsonModel: JSONModel,
        selectionModel: SelectionModel,
        foldingModel: FoldingModel,
        private _jsonWorkerManager: JsonWorkerManager = getJsonWorkerManager()
    ) {
        this._view = view;
        this._jsonModel = jsonModel;
        this._selectionModel = selectionModel;
        this._foldingModel = foldingModel;

        this.attachEventListeners();
    }

    private attachEventListeners() {
        this._jsonWorkerManager.validate().then(result => {
            this.emitter.emit('problemsChanged', {
                problems: result.problems,
                root: result.root,
            });
        });

        this._view.contentDom.addEventListener('beforeinput', (e: InputEvent) => {
            this._handleBeforeInput(e);
        });

        this._view.contentDom.addEventListener('keydown', (e: KeyboardEvent) => {
            this._handleKeyDown(e);
        });
    }

    private _handleBeforeInput(e: InputEvent) {
        e.preventDefault();
        this._selectionModel.updateFromSelection();
        const startRow = this._selectionModel.startRow;
        const startCol = this._selectionModel.startCol;
        const endRow = this._selectionModel.endRow;
        const endCol = this._selectionModel.endCol;
        const startOffset = this._jsonModel.getOffsetAt(startRow, startCol);
        const endOffset = this._jsonModel.getOffsetAt(endRow, endCol);
        const op: IModelContentChangeEvent = {
            type: 'insert',
            range: {
                startLineNumber: startRow,
                startColumn: startCol,
                endLineNumber: endRow,
                endColumn: endCol,
            },
            rangeOffset: startOffset,
            rangeLength: endOffset - startOffset,
            oldText: '',
            newText: '',
        };

        switch (e.inputType) {
            case 'insertText':
                if (this._selectionModel.isCollapsed) {
                    op.type = 'insert';
                } else {
                    op.type = 'replace';
                }
                op.newText = e.data || '';
                op.oldText = this._jsonModel.getValueInRange({
                    startLineNumber: startRow,
                    startColumn: startCol,
                    endLineNumber: endRow,
                    endColumn: endCol,
                } as Range);
                if (this._autoClosingPairs[op.newText]) {
                    op.newText += this._autoClosingPairs[op.newText];
                    op.keepPosition = {
                        lineNumber: startRow,
                        column: endCol + 1,
                    };
                }
                break;
            case 'insertParagraph':
                op.newText = '\n';
                op.keepPosition = {
                    lineNumber: startRow + 1,
                    column: 1,
                };
                const enterAction = processJsonEnterAction(this._jsonModel, {
                    startLineNumber: startRow,
                    startColumn: startCol,
                    endLineNumber: endRow,
                    endColumn: endCol,
                } as Range);
                if (enterAction) {
                    if (enterAction.indentAction === IndentAction.Indent) {
                        op.newText = '\n' + this.normalizeIndentation(enterAction.appendText + enterAction.indentation) || '';
                        op.keepPosition = {
                            lineNumber: startRow + 1,
                            column: enterAction.appendText.length + enterAction.indentation.length + 1,
                        };
                    } else {
                        const normalIndent = this.normalizeIndentation(enterAction.indentation);
                        const increasedIndent = this.normalizeIndentation(enterAction.indentation + enterAction.appendText);
                        op.newText = '\n' + increasedIndent + '\n' + normalIndent;
                        op.keepPosition = {
                            lineNumber: startRow + 1,
                            column: increasedIndent.length + 1,
                        };
                    }
                } else {
                    const lineText = this._jsonModel.getLineContent(startRow);
                    const indentation = getLeadingWhitespace(lineText).substring(0, startCol - 1);
                    op.newText = '\n' + this.normalizeIndentation(indentation) || '';
                    op.keepPosition = {
                        lineNumber: startRow + 1,
                        column: indentation.length + 1,
                    };
                }
                break;
            case 'deleteContentBackward':
                let oldText = '';
                if (this._selectionModel.isCollapsed) {
                    op.rangeOffset = startOffset - 1;
                    oldText = this._jsonModel.getValueInRange({
                        startLineNumber: startRow,
                        startColumn: startCol - 1,
                        endLineNumber: endRow,
                        endColumn: endCol,
                    } as Range);
                } else {
                    oldText = this._jsonModel.getValueInRange({
                        startLineNumber: startRow,
                        startColumn: startCol,
                        endLineNumber: endRow,
                        endColumn: endCol,
                    } as Range);
                }
                op.oldText = oldText;
                op.type = 'delete';
                op.rangeLength = oldText.length;
                break;
            case 'insertFromPaste':
                const pasteData = e.dataTransfer?.getData('text/plain');
                op.type = 'replace';
                op.newText = pasteData || '';
                op.oldText = this._jsonModel.getValueInRange({
                    startLineNumber: startRow,
                    startColumn: startCol,
                    endLineNumber: endRow,
                    endColumn: endCol,
                } as Range);
                break;
        }
        if (this._selectionModel.isSelectedAll) {
            op.range = {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: this._jsonModel.getLineCount(),
                endColumn: this._jsonModel.getLineLength(this._jsonModel.getLineCount()),
            };
            op.rangeOffset = 0;
            op.rangeLength = this._jsonModel.getValue().length;
            op.oldText = this._jsonModel.getValue();
        }
        this._selectionModel.isSelectedAll = false;

        this._jsonModel.applyOperation(op);
    }

    private _format() {
        this._jsonWorkerManager
            .formatJson(
                this._view.options?.formatOptions || {
                    tabSize: 2,
                    insertSpaces: true,
                }
            )
            .then((edits: Edit[]) => {
                const newValue = applyEdits(this._jsonModel.getValue(), edits);
                const op: IModelContentChangeEvent = {
                    type: 'replace',
                    range: {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: this._jsonModel.getLineCount(),
                        endColumn: this._jsonModel.getLineLength(this._jsonModel.getLineCount()) + 1,
                    },
                    rangeOffset: 0,
                    rangeLength: this._jsonModel.getValue().length,
                    oldText: this._jsonModel.getValue(),
                    newText: newValue,
                };
                this._jsonModel.applyOperation(op);
            });
    }

    private normalizeIndentation(str: string) {
        const indentSize = this._view.options?.formatOptions?.tabSize || 4;
        const insertSpaces = !!this._view.options?.formatOptions?.insertSpaces;
        let firstIndex = firstNonWhitespaceIndex(str);
        if (firstIndex === -1) {
            firstIndex = str.length;
        }
        return (
            this._normalizeIndentationFromWhitespace(str.substring(0, firstIndex), indentSize, insertSpaces) +
            str.substring(firstIndex)
        );
    }

    private _normalizeIndentationFromWhitespace(str: string, indentSize: number, insertSpaces: boolean) {
        let spacesCnt = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i) === '\t') {
                spacesCnt = this.nextIndentTabStop(spacesCnt, indentSize);
            } else {
                spacesCnt++;
            }
        }

        let result = '';
        if (!insertSpaces) {
            const tabsCnt = Math.floor(spacesCnt / indentSize);
            spacesCnt = spacesCnt % indentSize;
            for (let i = 0; i < tabsCnt; i++) {
                result += '\t';
            }
        }

        for (let i = 0; i < spacesCnt; i++) {
            result += ' ';
        }

        return result;
    }

    private nextIndentTabStop(spacesCnt: number, indentSize: number) {
        return spacesCnt + indentSize - (spacesCnt % indentSize);
    }

    private _handleKeyDown(e: KeyboardEvent) {
        this._selectionModel.updateFromSelection();
        const startRow = this._selectionModel.startRow;
        const startCol = this._selectionModel.startCol;
        const endRow = this._selectionModel.endRow;
        const endCol = this._selectionModel.endCol;
        const startOffset = this._jsonModel.getOffsetAt(startRow, startCol);
        const endOffset = this._jsonModel.getOffsetAt(endRow, endCol);
        switch (e.key) {
            case 'Tab':
                if (this._view.completeWidget.isVisible) {
                    e.preventDefault();
                    this._view.completeWidget._handleKeyDown(e);
                    return;
                }
                e.preventDefault();
                let insertText = '';

                if (this._view.options?.formatOptions?.insertSpaces) {
                    const tabSize = this._view.options?.formatOptions?.tabSize || 4;
                    for (let i = 0; i < tabSize; i++) {
                        insertText += ' ';
                    }
                } else {
                    insertText = '\t';
                }
                const op: IModelContentChangeEvent = {
                    type: 'insert',
                    range: {
                        startLineNumber: startRow,
                        startColumn: startCol,
                        endLineNumber: endRow,
                        endColumn: endCol,
                    },
                    rangeOffset: startOffset,
                    rangeLength: endOffset - startOffset,
                    oldText: '',
                    newText: insertText,
                };
                this._jsonModel.applyOperation(op);
                break;
            case 'f':
                if (e.shiftKey && e.metaKey) {
                    e.preventDefault();
                    this._format();
                }
                break;
            case 'ArrowRight':
            case 'ArrowLeft':
                if (this._view.completeWidget.isVisible) {
                    this._view.completeWidget.hide();
                }
                break;
            case 'ArrowDown':
            case 'ArrowUp':
                if (this._view.completeWidget.isVisible) {
                    e.preventDefault();
                    this._view.completeWidget._handleKeyDown(e);
                }
                break;
            case 'Enter':
                if (this._view.completeWidget.isVisible) {
                    e.preventDefault();
                    this._view.completeWidget._handleKeyDown(e);
                }
                break;
            case 'a':
                if (e.metaKey) {
                    this._selectionModel.isSelectedAll = true;
                }
                break;
            case 'x':
                if (e.metaKey) {
                    e.preventDefault();
                    this._cutHandler();
                }
                break;
            case 'z':
                if (e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    this._jsonModel.undo();
                } else {
                    e.preventDefault();
                    this._jsonModel.redo();
                }
                break;
        }
    }

    private _cutHandler() {
        const startRow = this._selectionModel.startRow;
        const startCol = this._selectionModel.startCol;
        const endRow = this._selectionModel.endRow;
        const endCol = this._selectionModel.endCol;
        let startOffset;
        let oldText = '';
        const op: IModelContentChangeEvent = {
            type: 'replace',
            range: {
                startLineNumber: startRow,
                startColumn: startCol,
                endLineNumber: endRow,
                endColumn: endCol,
            },
            rangeOffset: 0,
            rangeLength: 0,
            oldText: '',
            newText: '',
        };
        if (!this._selectionModel.isCollapsed) {
            oldText = this._jsonModel.getValueInRange({
                startLineNumber: startRow,
                startColumn: startCol,
                endLineNumber: endRow,
                endColumn: endCol,
            } as Range);
            startOffset = this._jsonModel.getOffsetAt(startRow, startCol);
        } else {
            oldText = this._jsonModel.getValueInRange({
                startLineNumber: startRow,
                startColumn: 1,
                endLineNumber: endRow,
                endColumn: this._jsonModel.getLineLength(endRow) + 1,
            } as Range);
            op.range = {
                startLineNumber: startRow,
                startColumn: 1,
                endLineNumber: endRow,
                endColumn: this._jsonModel.getLineLength(endRow) + 1,
            };
            startOffset = this._jsonModel.getOffsetAt(startRow, 1);
        }

        op.oldText = oldText;
        op.rangeOffset = startOffset;
        op.rangeLength = oldText.length;

        if (this._selectionModel.isSelectedAll) {
            op.range = {
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: this._jsonModel.getLineCount(),
                endColumn: this._jsonModel.getLineLength(this._jsonModel.getLineCount()) + 1,
            };
            op.rangeOffset = 0;
            op.rangeLength = this._jsonModel.getValue().length;
            op.oldText = this._jsonModel.getValue();
        }
        navigator.clipboard.writeText(op.oldText);
        this._jsonModel.applyOperation(op);
    }
}
