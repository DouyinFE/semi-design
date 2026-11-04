import { IModelContentChangeEvent } from '../common/emitterEvents';
import { FormattingOptions } from 'jsonc-parser';
import { getCurrentNameSpaceId } from '../common/nameSpace';

//TODO 修改封装方式

/**
 * JsonWorkerManager 类用于管理 JSON Worker
 */

type WorkerService = {
    init: { value: string };
    updateModel: {
        op: IModelContentChangeEvent | IModelContentChangeEvent[]
    };
    format: { options: FormattingOptions };
    foldRange: Record<string, never>;
    validate: Record<string, never>;
    undo: Record<string, never>;
    redo: Record<string, never>
};

const workerManagerMap = new Map<string, JsonWorkerManager>();

export class JsonWorkerManager {
    private _worker: Worker;
    private _callbacks: Map<number, { resolve: (result: any) => void; reject: (error: Error) => void }>;
    private _workerError: Error | null = null;

    constructor() {
        const workerRaw = decodeURIComponent(`%WORKER_RAW%`);
        const blob = new Blob([workerRaw], { type: 'application/javascript' });
        const workerURL = URL.createObjectURL(blob);
        this._worker = new Worker(workerURL);
        this._callbacks = new Map();

        this._worker.onmessage = this._handleWorkerMessage.bind(this);
        this._worker.onerror = event => this._handleWorkerError(new Error(event.message || 'JsonViewer worker failed'));
        this._worker.onmessageerror = () => this._handleWorkerError(new Error('JsonViewer worker message could not be deserialized'));
    }

    async init(value: string) {
        await this._sendRequest('init', { value });
    }

    updateModel(op: IModelContentChangeEvent | IModelContentChangeEvent[]) {
        return this._sendRequest('updateModel', { op });
    }

    undo() {
        return this._sendRequest('undo', {});
    }

    redo() {
        return this._sendRequest('redo', {});
    }

    formatJson(options: FormattingOptions) {
        return this._sendRequest('format', { options });
    }

    foldRange() {
        return this._sendRequest('foldRange', {});
    }

    validate() {
        return this._sendRequest('validate', {});
    }

    private _sendRequest<T extends keyof WorkerService>(method: T, params: WorkerService[T]): Promise<any> {
        if (this._workerError) {
            return Promise.reject(this._workerError);
        }
        return new Promise((resolve, reject) => {
            const messageId = Date.now() + Math.random();
            this._callbacks.set(messageId, { resolve, reject });
            try {
                this._worker.postMessage({ messageId, method, params });
            } catch (error) {
                this._callbacks.delete(messageId);
                reject(error);
            }
        });
    }

    private _handleWorkerError(error: Error) {
        this._workerError = error;
        this._callbacks.forEach(callback => callback.reject(error));
        this._callbacks.clear();
    }

    private _handleWorkerMessage(event: MessageEvent) {
        const { messageId, result, error } = event.data;
        const callback = this._callbacks.get(messageId);
        if (callback) {
            if (error) {
                callback.reject(new Error(error));
            } else {
                callback.resolve(result);
            }
            this._callbacks.delete(messageId);
        }
    }

    public dispose() {
        this._worker.terminate();
        this._callbacks.clear();
    }
}

export function getJsonWorkerManager() {
    const currentNameSpaceId = getCurrentNameSpaceId();
    if (!currentNameSpaceId) {
        throw new Error('No active worker ID set');
    }

    let workerManager = workerManagerMap.get(currentNameSpaceId);
    if (!workerManager) {
        workerManager = new JsonWorkerManager();
        workerManagerMap.set(currentNameSpaceId, workerManager);
    }
    return workerManager;
}

export function disposeWorkerManager(id: string) {
    const workerManager = workerManagerMap.get(id);
    if (workerManager) {
        workerManagerMap.delete(id);
        workerManager.dispose();
    }
}
