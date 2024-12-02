import { IModelContentChangeEvent } from '../common/emitterEvents';
import { FormattingOptions } from 'jsonc-parser';


//TODO 修改封装方式

/**
 * JsonWorkerManager 类用于管理 JSON Worker
 */
type WorkerMethod = 'init' | 'updateModel' | 'format' | 'foldRange' | 'validate';
type WorkerParams = {
    value?: string;
    options?: FormattingOptions;
    op?: IModelContentChangeEvent | IModelContentChangeEvent[]
};

export class JsonWorkerManager {
    private _worker: Worker;
    private _callbacks: Map<number, (result: any) => void>;

    constructor() {
        const workerRaw = decodeURIComponent("%WORKER_RAW%");
        const blob = new Blob([workerRaw], { type: 'application/javascript' });
        const workerURL = URL.createObjectURL(blob);
        this._worker = new Worker(workerURL);
        this._callbacks = new Map();

        this._worker.onmessage = this._handleWorkerMessage.bind(this);
    }

    async init(value: string) {
        await this._sendRequest('init', { value });
    }

    updateModel(op: IModelContentChangeEvent | IModelContentChangeEvent[]) {
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
