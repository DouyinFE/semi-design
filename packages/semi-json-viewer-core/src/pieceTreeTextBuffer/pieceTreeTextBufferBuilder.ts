/** reference from https://github.com/microsoft/vscode */

import { CharCode } from '../common/charCode';
import { StringBuffer, createLineStarts, createLineStartsFast, PieceTreeBase } from './pieceTreeBase';

export const UTF8_BOM_CHARACTER = String.fromCharCode(CharCode.UTF8_BOM);

export function startsWithUTF8BOM(str: string): boolean {
    return !!(str && str.length > 0 && str.charCodeAt(0) === CharCode.UTF8_BOM);
}

export const enum DefaultEndOfLine {
    /**
     * Use line feed (\n) as the end of line character.
     */
    LF = 1,
    /**
     * Use carriage return and line feed (\r\n) as the end of line character.
     */
    CRLF = 2,
}

export class PieceTreeTextBufferFactory {
    constructor(
        private readonly _chunks: StringBuffer[],
        private readonly _bom: string,
        private readonly _cr: number,
        private readonly _lf: number,
        private readonly _crlf: number,
        private readonly _normalizeEOL: boolean
    ) {}

    private _getEOL(defaultEOL: DefaultEndOfLine): '\r\n' | '\n' {
        const totalEOLCount = this._cr + this._lf + this._crlf;
        const totalCRCount = this._cr + this._crlf;
        if (totalEOLCount === 0) {
            // This is an empty file or a file with precisely one line
            return defaultEOL === DefaultEndOfLine.LF ? '\n' : '\r\n';
        }
        if (totalCRCount > totalEOLCount / 2) {
            // More than half of the file contains \r\n ending lines
            return '\r\n';
        }
        // At least one line more ends in \n
        return '\n';
    }

    public create(defaultEOL: DefaultEndOfLine): PieceTreeBase {
        const eol = this._getEOL(defaultEOL);
        const chunks = this._chunks;

        if (
            this._normalizeEOL &&
            ((eol === '\r\n' && (this._cr > 0 || this._lf > 0)) || (eol === '\n' && (this._cr > 0 || this._crlf > 0)))
        ) {
            // Normalize pieces
            for (let i = 0, len = chunks.length; i < len; i++) {
                const str = chunks[i].buffer.replace(/\r\n|\r|\n/g, eol);
                const newLineStart = createLineStartsFast(str);
                chunks[i] = new StringBuffer(str, newLineStart);
            }
        }

        return new PieceTreeBase(chunks, eol, this._normalizeEOL);
    }

    public getFirstLineText(lengthLimit: number): string {
        return this._chunks[0].buffer.substr(0, 100).split(/\r\n|\r|\n/)[0];
    }
}

export class PieceTreeTextBufferBuilder {
    private readonly chunks: StringBuffer[];
    private BOM: string;

    private _hasPreviousChar: boolean;
    private _previousChar: number;
    private readonly _tmpLineStarts: number[];

    private cr: number;
    private lf: number;
    private crlf: number;

    constructor() {
        this.chunks = [];
        this.BOM = '';

        this._hasPreviousChar = false;
        this._previousChar = 0;
        this._tmpLineStarts = [];

        this.cr = 0;
        this.lf = 0;
        this.crlf = 0;
    }

    public acceptChunk(chunk: string): void {
        if (chunk.length === 0) {
            return;
        }

        if (this.chunks.length === 0) {
            if (startsWithUTF8BOM(chunk)) {
                this.BOM = UTF8_BOM_CHARACTER;
                chunk = chunk.substr(1);
            }
        }

        const lastChar = chunk.charCodeAt(chunk.length - 1);
        if (lastChar === CharCode.CarriageReturn || (lastChar >= 0xd800 && lastChar <= 0xdbff)) {
            // last character is \r or a high surrogate => keep it back
            this._acceptChunk1(chunk.substr(0, chunk.length - 1), false);
            this._hasPreviousChar = true;
            this._previousChar = lastChar;
        } else {
            this._acceptChunk1(chunk, false);
            this._hasPreviousChar = false;
            this._previousChar = lastChar;
        }
    }

    private _acceptChunk1(chunk: string, allowEmptyStrings: boolean): void {
        if (!allowEmptyStrings && chunk.length === 0) {
            // Nothing to do
            return;
        }

        if (this._hasPreviousChar) {
            this._acceptChunk2(String.fromCharCode(this._previousChar) + chunk);
        } else {
            this._acceptChunk2(chunk);
        }
    }

    private _acceptChunk2(chunk: string): void {
        const lineStarts = createLineStarts(this._tmpLineStarts, chunk);

        this.chunks.push(new StringBuffer(chunk, lineStarts.lineStarts));
        this.cr += lineStarts.cr;
        this.lf += lineStarts.lf;
        this.crlf += lineStarts.crlf;
    }

    public finish(normalizeEOL: boolean = true): PieceTreeTextBufferFactory {
        this._finish();
        return new PieceTreeTextBufferFactory(this.chunks, this.BOM, this.cr, this.lf, this.crlf, normalizeEOL);
    }

    private _finish(): void {
        if (this.chunks.length === 0) {
            this._acceptChunk1('', true);
        }

        if (this._hasPreviousChar) {
            this._hasPreviousChar = false;
            // recreate last chunk
            const lastChunk = this.chunks[this.chunks.length - 1];
            lastChunk.buffer += String.fromCharCode(this._previousChar);
            const newLineStarts = createLineStartsFast(lastChunk.buffer);
            lastChunk.lineStarts = newLineStarts;
            if (this._previousChar === CharCode.CarriageReturn) {
                this.cr++;
            }
        }
    }
}
