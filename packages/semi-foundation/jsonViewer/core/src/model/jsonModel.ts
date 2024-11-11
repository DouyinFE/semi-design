import { IModelContentChangeEvent } from '../common/emitterEvents';
import { BufferCursor, DefaultEndOfLine, PieceTreeBase, PieceTreeTextBufferBuilder } from '../pieceTreeTextBuffer';
import { Range } from '../common/range';
import { emitter } from '../common/emitter';
import { IPosition, Position } from '../common/position';
import { EndOfLinePreference, FindMatch, SearchData } from '../common/model';
import { SearchParams, TextModelSearch } from './textModelSearch';
import { getJsonWorkerManager, JsonWorkerManager } from '../worker/jsonWorkerManager';
import { isInWorkerThread } from '../common/worker';

/**
 * JSONModel 类用于管理 JSON 数据模型
 */
export class JSONModel {
    private _pieceTree: PieceTreeBase;
    private _normalizeEOL: boolean;
    private _undoStack: IModelContentChangeEvent[] = [];
    private _redoStack: IModelContentChangeEvent[] = [];
    private readonly MAX_STACK_SIZE = 20;
    public lastChangeBufferPos = {
        lineNumber: 1,
        column: 0,
    };

    private _jsonWorkerManager: JsonWorkerManager | null = null;

    constructor(value: string, normalizeEOL: boolean = true) {
        this._normalizeEOL = normalizeEOL;
        this._pieceTree = this.createTextBuffer(value);
        if (!isInWorkerThread()) {
            this._jsonWorkerManager = getJsonWorkerManager();
        }
    }

    createTextBufferFactory(value: string) {
        const builder = new PieceTreeTextBufferBuilder();
        builder.acceptChunk(value);
        return builder.finish(this._normalizeEOL);
    }

    createTextBuffer(value: string) {
        return this.createTextBufferFactory(value).create(DefaultEndOfLine.LF);
    }

    /**
     * 获取行数
     * @returns 行数
     */
    getLineCount(): number {
        return this._pieceTree.getLineCount();
    }

    /**
     * 获取行内容
     * @param lineNumber 行号
     * @returns 行内容
     */
    getLineContent(lineNumber: number): string {
        return this._pieceTree.getLineContent(lineNumber);
    }

    /**
     * 获取行长度
     * @param lineNumber 行号
     * @returns 行内容
     */
    getLineLength(lineNumber: number): number {
        return this._pieceTree.getLineLength(lineNumber);
    }

    /**
     * 获取偏移
     * @param lineNumber 行号
     * @param column 列号
     * @returns 行偏移
     */
    getOffsetAt(lineNumber: number, column: number): number {
        return this._pieceTree.getOffsetAt(lineNumber, column);
    }

    positionAt(offset: number): Position {
        offset = Math.min(this._pieceTree.getLength(), Math.max(0, offset));
        return this._pieceTree.getPositionAt(offset);
    }

    /**
     * 获取行首偏移
     * @param lineNumber 行号
     * @returns 行首偏移
     */
    getLineStartOffset(lineNumber: number): number {
        return this.getOffsetAt(lineNumber, 1);
    }

    /**
     * 获取行尾偏移
     * @param lineNumber 行号
     * @returns 行尾偏移
     */
    getLineEndOffset(lineNumber: number): number {
        const lineLength = this.getLineLength(lineNumber);
        return this.getOffsetAt(lineNumber, lineLength + 1);
    }

    applyOperation(op: IModelContentChangeEvent | IModelContentChangeEvent[]) {
        if (Array.isArray(op)) {
            op.forEach(o => this.applyOperation(o));
            return;
        }

        this._updateLastChangeBufferPos(op);

        switch (op.type) {
            case 'insert':
                this._pieceTree.insert(op.rangeOffset + 1, op.newText);
                break;
            case 'delete':
                this._pieceTree.delete(op.rangeOffset + 1, op.rangeLength);

                break;
            case 'replace':
                this._pieceTree.delete(op.rangeOffset + 1, op.oldText.length);
                this._pieceTree.insert(op.rangeOffset + 1, op.newText);
                break;
        }
        if (!isInWorkerThread()) {
            emitter.emit('contentChanged', op);
        }
        if (this._jsonWorkerManager) {
            this._jsonWorkerManager
                .updateModel(op)
                .then(res => {
                    return this._jsonWorkerManager?.validate();
                })
                .then(result => {
                    emitter.emit('problemsChanged', {
                        problems: result.problems,
                        root: result.root,
                    });
                });
        }
    }

    private _updateLastChangeBufferPos(op: IModelContentChangeEvent) {
        switch (op.type) {
            case 'insert':
                this.lastChangeBufferPos.column += op.newText.length;
                if (op.newText === '\n') {
                    this.lastChangeBufferPos.lineNumber += 1;
                    this.lastChangeBufferPos.column = 0;
                }
                break;
            case 'delete':
                if (this.lastChangeBufferPos.column === 0) {
                    this.lastChangeBufferPos.lineNumber -= 1;
                    this.lastChangeBufferPos.column = this.getLineLength(this.lastChangeBufferPos.lineNumber);
                } else {
                    const startColumn = op.range.startColumn;
                    const newColumn = op.rangeLength === 1 ? startColumn - 1 : startColumn;
                    this.lastChangeBufferPos.column = newColumn;
                }
                break;
            case 'replace':
                const newLineNumber = op.range.startLineNumber;
                const newColumn = op.range.startColumn + op.newText.length;
                this.lastChangeBufferPos.lineNumber = newLineNumber;
                this.lastChangeBufferPos.column = newColumn;
                break;
        }
    }

    pushUndoStack(op: IModelContentChangeEvent) {
        this._undoStack.push({ ...op });
        if (this._undoStack.length > this.MAX_STACK_SIZE) {
            this._undoStack.shift();
        }
    }

    pushRedoStack(op: IModelContentChangeEvent) {
        this._redoStack.push({ ...op });
        if (this._redoStack.length > this.MAX_STACK_SIZE) {
            this._redoStack.shift();
        }
    }

    canUndo(): boolean {
        return this._undoStack.length > 0;
    }

    canRedo(): boolean {
        return this._redoStack.length > 0;
    }

    undo() {
        if (!this.canUndo()) return;

        const op = this._undoStack.pop()!;
        const reverseOp = this._createReverseOperation(op);

        this.pushRedoStack(op);
        this.applyOperation(reverseOp);
    }

    redo() {
        if (!this.canRedo()) return;
        const op = this._redoStack.pop()!;

        this.pushUndoStack(op);
        this.applyOperation(op);
    }

    private _createReverseOperation(op: IModelContentChangeEvent): IModelContentChangeEvent {
        const reverseOp: IModelContentChangeEvent = {
            ...op,
            oldText: op.newText,
            newText: op.oldText,
        };

        switch (op.type) {
            case 'insert':
                reverseOp.type = 'delete';
                reverseOp.rangeLength = op.newText.length;
                break;
            case 'delete':
                reverseOp.type = 'insert';
                reverseOp.rangeLength = 0;
                break;
            case 'replace':
                reverseOp.rangeLength = op.newText.length;
                const preNewText = op.newText;
                reverseOp.oldText = preNewText;
                reverseOp.newText = op.oldText;

                break;
        }

        return reverseOp;
    }

    /**
     * 获取值
     * @returns 值
     */
    getValue(): string {
        return this._pieceTree.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: this._pieceTree.getLineCount(),
            endColumn: this._pieceTree.getLineContent(this._pieceTree.getLineCount()).length + 1,
        } as Range);
    }

    /**
     * 设置值
     * @param value 值
     */
    setValue(value: string): void {
        const builder = new PieceTreeTextBufferBuilder();
        builder.acceptChunk(value);
        this._pieceTree = builder.finish(this._normalizeEOL).create(1);
    }

    getEOL() {
        return this._pieceTree.getEOL();
    }

    private _getEndOfLine(eol: EndOfLinePreference): string {
        switch (eol) {
            case EndOfLinePreference.LF:
                return '\n';
            case EndOfLinePreference.CRLF:
                return '\r\n';
            case EndOfLinePreference.TextDefined:
                return this.getEOL();
            default:
                throw new Error('Unknown EOL preference');
        }
    }

    getValueInRange(range: Range, eol: EndOfLinePreference = EndOfLinePreference.TextDefined) {
        return this._pieceTree.getValueInRange(range, this._getEndOfLine(eol));
    }

    getFullModelRange(): Range {
        const lineCount = this.getLineCount();
        return new Range(1, 1, lineCount, this.getLineLength(lineCount) + 1);
    }

    findMatchesLineByLine(
        searchRange: Range,
        searchData: SearchData,
        captureMatches: boolean,
        limitResultCount: number
    ) {
        return this._pieceTree.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
    }

    /**
     * 查找匹配
     * @param searchString 搜索字符串
     * @param rawSearchScope 搜索范围
     * @param isRegex 是否为正则表达式
     * @param matchCase 是否匹配大小写
     * @param wordSeparators 分隔符
     * @param captureMatches 是否捕获匹配
     * @param limitResultCount 限制结果数量
     * @returns 匹配结果
     * Based on https://github.com/microsoft/vscode with modifications for custom requirements
     */
    findMatches(
        searchString: string,
        rawSearchScope: unknown,
        isRegex: boolean,
        matchCase: boolean,
        wordSeparators: string | null,
        captureMatches: boolean,
        limitResultCount: number = Infinity
    ) {
        let searchRanges: Range[] | null = null;

        if (searchRanges === null) {
            searchRanges = [this.getFullModelRange()];
        }

        searchRanges = searchRanges.sort(
            (d1, d2) => d1.startLineNumber - d2.startLineNumber || d1.startColumn - d2.startColumn
        );

        const uniqueSearchRanges: Range[] = [];
        uniqueSearchRanges.push(
            searchRanges.reduce((prev, curr) => {
                if (Range.areIntersecting(prev, curr)) {
                    return prev.plusRange(curr);
                }

                uniqueSearchRanges.push(prev);
                return curr;
            })
        );

        let matchMapper: (value: Range, index: number, array: Range[]) => FindMatch[];
        if (!isRegex && searchString.indexOf('\n') < 0) {
            // not regex, not multi line
            const searchParams = new SearchParams(searchString, isRegex, matchCase, wordSeparators);
            const searchData = searchParams.parseSearchRequest();
            if (!searchData) {
                return [];
            }

            matchMapper = (searchRange: Range) =>
                this.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
        } else {
            matchMapper = (searchRange: Range) =>
                TextModelSearch.findMatches(
                    this,
                    new SearchParams(searchString, isRegex, matchCase, wordSeparators),
                    searchRange,
                    captureMatches,
                    limitResultCount
                );
        }
        return uniqueSearchRanges.map(matchMapper).reduce((arr, matches: FindMatch[]) => arr.concat(matches), []);
    }
}
