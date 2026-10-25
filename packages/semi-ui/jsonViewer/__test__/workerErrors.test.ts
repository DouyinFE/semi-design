import { JsonWorkerManager } from '@douyinfe/semi-json-viewer-core/src/worker/jsonWorkerManager';

describe('JsonViewer worker request failures', () => {
    let worker;
    let manager;

    beforeEach(() => {
        const decode = decodeURIComponent;
        rstest.spyOn(globalThis, 'decodeURIComponent').mockImplementation(value => value === '%WORKER_RAW%' ? '' : decode(value));
        rstest.stubGlobal('Worker', class {
            onmessage;
            onerror;
            onmessageerror;
            postMessage = rstest.fn();
            terminate = rstest.fn();
            constructor() { worker = this; }
        });
        rstest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:worker-test');
        manager = new JsonWorkerManager();
    });

    afterEach(() => {
        manager?.dispose();
        rstest.restoreAllMocks();
        rstest.unstubAllGlobals();
    });

    const reply = data => worker.onmessage({ data });
    const requestId = () => worker.postMessage.mock.calls[worker.postMessage.mock.calls.length - 1][0].messageId;

    it('rejects an error response instead of resolving an Error value', async () => {
        const request = manager.validate();
        const rejected = expect(request).rejects.toThrow('invalid document');
        reply({ messageId: requestId(), error: 'invalid document' });
        await rejected;
        expect(manager._callbacks.size).toBe(0);
    });

    it('rejects all pending requests on a worker error', async () => {
        const requests = [manager.validate(), manager.foldRange()];
        const results = requests.map(request => request.then(() => 'resolved', error => error.message));
        expect(typeof worker.onerror).toBe('function');
        worker.onerror({ message: 'worker crashed' });
        expect(await Promise.all(results)).toEqual(['worker crashed', 'worker crashed']);
        expect(manager._callbacks.size).toBe(0);
        await expect(manager.validate()).rejects.toThrow('worker crashed');
    });

    it('rejects pending requests when a message cannot be deserialized', async () => {
        const request = manager.validate();
        const result = request.then(() => 'resolved', error => error.message);
        expect(typeof worker.onmessageerror).toBe('function');
        worker.onmessageerror({});
        expect(await result).toMatch(/worker/i);
        expect(manager._callbacks.size).toBe(0);
    });

    it('removes a callback if posting the request throws', async () => {
        worker.postMessage.mockImplementation(() => { throw new Error('cannot clone'); });
        await expect(manager.validate()).rejects.toThrow('cannot clone');
        expect(manager._callbacks.size).toBe(0);
    });

    it('keeps successful requests and later replies working', async () => {
        const failed = manager.validate();
        const result = failed.catch(error => error.message);
        reply({ messageId: requestId(), error: 'invalid document' });
        expect(await result).toBe('invalid document');
        const request = manager.foldRange();
        reply({ messageId: requestId(), result: [] });
        expect(await request).toEqual([]);
        expect(manager._callbacks.size).toBe(0);
    });
});
