import { SelectionModel } from '../../model/selectionModel';
import { View } from '../view';
import { JSONModel } from '../../model/jsonModel';
import { applyEdits, Edit } from 'jsonc-parser';
import { getJsonWorkerManager, JsonWorkerManager } from '../../worker/jsonWorkerManager';
import { FoldingModel } from '../../model/foldingModel';
import { emitter } from '../../common/emitter';
import { IModelContentChangeEvent } from '../../common/emitterEvents';
import { Range } from '../../common/range';

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
            emitter.emit('problemsChanged', {
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
                }
                break;
            case 'insertParagraph':
                op.newText = '\n';
                op.rangeLength = 1;
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
        this._jsonModel.pushUndoStack(op);
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
                //TODO: 格式化后更新模型
                this._jsonModel.setValue(applyEdits(this._jsonModel.getValue(), edits));
                this._view.tokenizationJsonModelPart.requestTokens({
                    from: 1,
                    to: this._jsonModel.getLineCount(),
                });
                this._view.layout();
            });
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
        console.log('cut');
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
        this._jsonModel.pushUndoStack(op);
    }
}
