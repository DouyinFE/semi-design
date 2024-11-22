import { JSONModel } from './jsonModel';
import { IModelContentChangeEvent } from '../common/emitterEvents';

export interface Command {
    execute(): void;
    undo(): void;
    readonly operation: IModelContentChangeEvent;
    readonly oldPos: { lineNumber: number; column: number };
    readonly newPos: { lineNumber: number; column: number }
}

export abstract class BaseCommand implements Command {
    public readonly oldPos: { lineNumber: number; column: number };
    public readonly newPos: { lineNumber: number; column: number }

    constructor(protected model: JSONModel, public readonly operation: IModelContentChangeEvent) {
        this.oldPos = { ...model.lastChangeBufferPos };
        this.model.updateLastChangeBufferPos(operation);
        this.newPos = { ...model.lastChangeBufferPos };
    }

    abstract execute(): void;
    abstract undo(): void;

    protected updateBufferPos(isUndo: boolean): void {
        this.model.lastChangeBufferPos = {
            ...(isUndo ? this.oldPos : this.newPos),
        };
    }
}

export class InsertCommand extends BaseCommand {
    execute(): void {
        this.model.pieceTree.insert(this.operation.rangeOffset, this.operation.newText);
        this.updateBufferPos(false);
    }

    undo(): void {
        this.model.pieceTree.delete(this.operation.rangeOffset, this.operation.newText.length);
        this.updateBufferPos(true);
    }
}

export class DeleteCommand extends BaseCommand {
    execute(): void {
        this.model.pieceTree.delete(this.operation.rangeOffset, this.operation.rangeLength);
        this.updateBufferPos(false);
    }

    undo(): void {
        this.model.pieceTree.insert(this.operation.rangeOffset, this.operation.oldText);
        this.updateBufferPos(true);
    }
}

export class ReplaceCommand extends BaseCommand {
    execute(): void {
        this.model.pieceTree.delete(this.operation.rangeOffset, this.operation.oldText.length);
        this.model.pieceTree.insert(this.operation.rangeOffset, this.operation.newText);
        this.updateBufferPos(false);
    }

    undo(): void {
        this.model.pieceTree.delete(this.operation.rangeOffset, this.operation.newText.length);
        this.model.pieceTree.insert(this.operation.rangeOffset, this.operation.oldText);
        this.updateBufferPos(true);
    }
}
