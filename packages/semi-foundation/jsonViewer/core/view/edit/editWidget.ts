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
                    startColumn: startCol + 1,
                    endLineNumber: endRow,
                    endColumn: endCol + 1,
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
                if (this._selectionModel.isCollapsed) {
                    // if (this._selectionModel.col === 0) {
                    // 	this._selectionModel.row -= 1;
                    // 	this._selectionModel.col = this._jsonModel.getLineLength(
                    // 		this._selectionModel.row
                    // 	);
                    // 	if (this._foldingModel.isLineCollapsed(this._selectionModel.row)) {
                    // 		this._foldingModel.expandLine(this._selectionModel.row);
                    // 	}
                    // } else {
                    // 	this._selectionModel.col -= 1;
                    // }
                    op.oldText = this._jsonModel.getValueInRange({
                        startLineNumber: startRow,
                        startColumn: startCol + 1,
                        endLineNumber: endRow,
                        endColumn: endCol,
                    } as Range);
                    op.rangeOffset = startOffset - 1;
                    op.rangeLength = 1;
                }
                op.type = 'delete';
                break;
            case 'insertFromPaste':
                const pasteData = e.dataTransfer?.getData('text/plain');
                op.type = 'replace';
                op.newText = pasteData || '';
                op.oldText = this._jsonModel.getValueInRange({
                    startLineNumber: startRow,
                    startColumn: startCol + 1,
                    endLineNumber: endRow,
                    endColumn: endCol + 1,
                } as Range);
                break;
        }
        if (this._selectionModel.isSelectedAll) {
            op.range = {
                startLineNumber: 1,
                startColumn: 0,
                endLineNumber: this._jsonModel.getLineCount(),
                endColumn: this._jsonModel.getLineLength(this._jsonModel.getLineCount()),
            };
            op.rangeOffset = -1;
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
                    insertText = '    ';
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
        let startOffset, endOffset;
        let oldText = '';
        const op: IModelContentChangeEvent = {
            type: 'replace',
            range: {
                startLineNumber: startRow,
                startColumn: 1,
                endLineNumber: endRow,
                endColumn: this._jsonModel.getLineLength(endRow),
            },
            rangeOffset: 0,
            rangeLength: 0,
            oldText: '',
            newText: '',
        };
        if (!this._selectionModel.isCollapsed) {
            startOffset = this._jsonModel.getOffsetAt(startRow, startCol);
            endOffset = this._jsonModel.getOffsetAt(endRow, endCol);
            oldText = this._jsonModel.getValueInRange({
                startLineNumber: startRow,
                startColumn: startCol + 1,
                endLineNumber: endRow,
                endColumn: endCol + 1,
            } as Range);
            op.rangeLength = endOffset - startOffset;
            op.rangeOffset = startOffset;
            op.range = {
                startLineNumber: startRow,
                startColumn: startCol,
                endLineNumber: endRow,
                endColumn: endCol,
            };
        } else {
            startOffset = this._jsonModel.getOffsetAt(startRow - 1, this._jsonModel.getLineEndOffset(startRow - 1));
            endOffset = this._jsonModel.getOffsetAt(endRow, this._jsonModel.getLineEndOffset(endRow));
            oldText = this._jsonModel.getValueInRange({
                startLineNumber: startRow,
                startColumn: 1,
                endLineNumber: endRow,
                endColumn: this._jsonModel.getLineEndOffset(endRow),
            } as Range);
            op.rangeLength = endOffset - startOffset;
            op.rangeOffset = startOffset;
        }

        op.oldText = oldText;

        if (this._selectionModel.isSelectedAll) {
            op.range = {
                startLineNumber: 1,
                startColumn: 0,
                endLineNumber: this._jsonModel.getLineCount(),
                endColumn: this._jsonModel.getLineLength(this._jsonModel.getLineCount()) + 1,
            };
            op.rangeOffset = -1;
            op.rangeLength = this._jsonModel.getValue().length;
            op.oldText = this._jsonModel.getValue();
        }
        navigator.clipboard.writeText(op.oldText);
        this._jsonModel.applyOperation(op);
    }
}
