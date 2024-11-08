import { IModelContentChangeEvent } from '../common/emitterEvents';
import { FormattingOptions } from 'jsonc-parser';
// import Worker from './json.worker.ts';

//TODO 修改封装方式

/**
 * JsonWorkerManager 类用于管理 JSON Worker
 */
type WorkerMethod = 'init' | 'updateModel' | 'format' | 'foldRange' | 'validate';
type WorkerParams = {
    value?: string;
    options?: FormattingOptions;
    op?: IModelContentChangeEvent
};

export class JsonWorkerManager {
    private _worker: Worker;
    private _callbacks: Map<number, (result: any) => void>;

    constructor() {
        this._worker = new Worker(new URL('../worker/json.worker.ts', import.meta.url), { type: 'module' });
        // this._worker = new Worker();
        this._callbacks = new Map();

        this._worker.onmessage = this._handleWorkerMessage.bind(this);
    }

    async init(value: string) {
        await this._sendRequest('init', { value });
    }

    updateModel(op: IModelContentChangeEvent) {
        return this._sendRequest('updateModel', { op });
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

    private _sendRequest(method: WorkerMethod, params: WorkerParams): Promise<any> {
        return new Promise((resolve, reject) => {
            const messageId = Date.now() + Math.random();
            this._callbacks.set(messageId, resolve);
            this._worker.postMessage({ messageId, method, params });
        });
    }

    private _handleWorkerMessage(event: MessageEvent) {
        const { messageId, result, error } = event.data;
        const callback = this._callbacks.get(messageId);
        if (callback) {
            if (error) {
                callback(new Error(error));
            } else {
                callback(result);
            }
            this._callbacks.delete(messageId);
        }
    }
}
let jsonWorkerManager: JsonWorkerManager | null = null;

export function getJsonWorkerManager() {
    if (!jsonWorkerManager) {
        jsonWorkerManager = new JsonWorkerManager();
    }
    return jsonWorkerManager;
}
