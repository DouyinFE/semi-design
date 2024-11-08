/** based on https://github.com/microsoft/vscode with modifications for custom requirements */

import { IPosition, Position } from './position';

/**
 * A range in the editor. This interface is suitable for serialization.
 */
export interface IRange {
    /**
     * Line number on which the range starts (starts at 1).
     */
    readonly startLineNumber: number;
    /**
     * Column on which the range starts in line `startLineNumber` (starts at 1).
     */
    readonly startColumn: number;
    /**
     * Line number on which the range ends.
     */
    readonly endLineNumber: number;
    /**
     * Column on which the range ends in line `endLineNumber`.
     */
    readonly endColumn: number
}

/**
 * A range in the editor. (startLineNumber,startColumn) is <= (endLineNumber,endColumn)
 */
export class Range {
    /**
     * Line number on which the range starts (starts at 1).
     */
    public readonly startLineNumber: number;
    /**
     * Column on which the range starts in line `startLineNumber` (starts at 1).
     */
    public readonly startColumn: number;
    /**
     * Line number on which the range ends.
     */
    public readonly endLineNumber: number;
    /**
     * Column on which the range ends in line `endLineNumber`.
     */
    public readonly endColumn: number;

    constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number) {
        if (startLineNumber > endLineNumber || (startLineNumber === endLineNumber && startColumn > endColumn)) {
            this.startLineNumber = endLineNumber;
            this.startColumn = endColumn;
            this.endLineNumber = startLineNumber;
            this.endColumn = startColumn;
        } else {
            this.startLineNumber = startLineNumber;
            this.startColumn = startColumn;
            this.endLineNumber = endLineNumber;
            this.endColumn = endColumn;
        }
    }

    static create(start: IPosition, end: IPosition): Range {
        return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    }

}
