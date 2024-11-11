import { JSONModel } from './jsonModel';
import { getFoldingRanges, FoldingRange } from '../service/jsonService';
import { emitter } from '../common/emitter';
import { getJsonWorkerManager, JsonWorkerManager } from '../worker/jsonWorkerManager';

/**
 * 折叠模型，管理JSON的折叠范围
 */
//TODO 修改range数据结构
export class FoldingModel {
    private _jsonModel: JSONModel;
    private _foldingRanges: FoldingRange[] = [];
    private _collapsedRanges: Map<number, number> = new Map(); // startLine -> endLine
    private _jsonWorkerManager: JsonWorkerManager = getJsonWorkerManager();
    constructor(jsonModel: JSONModel) {
        this._jsonModel = jsonModel;
        this.updateFoldingRanges();
        emitter.on('problemsChanged', e => {
            this.updateFoldingRanges();
        });
    }

    public updateFoldingRanges(): void {
        this._jsonWorkerManager.foldRange().then(ranges => {
            this._foldingRanges = ranges;
            this.updateCollapsedRanges();
        });
    }

    private updateCollapsedRanges(): void {
        const newCollapsedRanges = new Map<number, number>();

        for (const [startLine, endLine] of this._collapsedRanges) {
            const range = this._foldingRanges.find(r => r.startLine === startLine);
            if (range) {
                newCollapsedRanges.set(startLine, range.endLine);
            }
        }

        this._collapsedRanges = newCollapsedRanges;
    }

    public getFoldingRanges(): FoldingRange[] {
        return this._foldingRanges;
    }

    public toggleFoldingRange(startLine: number): void {
        if (this._collapsedRanges.has(startLine)) {
            this._collapsedRanges.delete(startLine);
        } else {
            const range = this._foldingRanges.find(r => r.startLine === startLine);
            if (range) {
                this._collapsedRanges.set(startLine, range.endLine);
            }
        }
    }

    public isCollapsed(lineNumber: number): boolean {
        return this._collapsedRanges.has(lineNumber);
    }

    public isLineCollapsed(lineNumber: number): boolean {
        if (this._collapsedRanges.has(lineNumber)) {
            return false;
        }
        for (const [startLine, endLine] of this._collapsedRanges) {
            if (lineNumber > startLine && lineNumber <= endLine) {
                return true;
            }
        }
        return false;
    }

    public getVisibleLineNumber(actualLineNumber: number): number {
        let visibleLine = actualLineNumber;
        for (const [startLine, endLine] of this._collapsedRanges) {
            if (startLine < actualLineNumber) {
                if (endLine < actualLineNumber) {
                    visibleLine -= endLine - startLine;
                } else if (actualLineNumber > startLine) {
                    return -1;
                }
            } else {
                break;
            }
        }
        return visibleLine;
    }

    public getNextVisibleLine(actualLineNumber: number): number {
        for (const [startLine, endLine] of this._collapsedRanges) {
            if (actualLineNumber >= startLine && actualLineNumber <= endLine) {
                return actualLineNumber === startLine ? startLine + 1 : endLine + 1;
            }
        }
        return actualLineNumber + 1;
    }

    public getActualLineNumber(visibleLineNumber: number): number {
        let actualLine = visibleLineNumber;
        for (const [startLine, endLine] of this._collapsedRanges) {
            if (startLine < actualLine) {
                actualLine += endLine - startLine;
            } else {
                break;
            }
        }
        return actualLine;
    }

    public isFoldable(lineNumber: number): boolean {
        return this._foldingRanges.some(range => range.startLine === lineNumber);
    }

    public expandLine(lineNumber: number): void {
        for (const [startLine, endLine] of this._collapsedRanges) {
            if (lineNumber > startLine && lineNumber <= endLine) {
                this._collapsedRanges.delete(startLine);
            }
        }
    }

    public getVisibleLineCount(): number {
        let visibleCount = 0;
        let lineNumber = 1;

        while (lineNumber <= this._jsonModel.getLineCount()) {
            if (!this.isLineCollapsed(lineNumber)) {
                visibleCount++;
            }
            lineNumber = this.getNextVisibleLine(lineNumber);
        }

        return visibleCount;
    }
}
