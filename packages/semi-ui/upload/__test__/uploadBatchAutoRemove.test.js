import UploadFoundation from '../../../semi-foundation/upload/foundation';

/**
 * Regression tests for #3335:
 * When multiple files are uploaded at once and `beforeUpload` returns
 * `{ shouldUpload: false, autoRemove: true }` for several of them, every file
 * should be removed from fileList.
 *
 * The bug only reproduces when setState is batched (React 18 automatic batching):
 * `startUpload` iterates synchronously and each `autoRemove` used to read the
 * React state snapshot, which is not flushed between iterations, so later
 * removals overwrite earlier ones and some files "revive".
 *
 * Semi's own test harness runs on React 16 (synchronous flush), so we drive the
 * foundation directly with a mock adapter that simulates batching: updateFileList
 * does NOT reflect into getState synchronously; only the last update is committed
 * when the synchronous batch finishes.
 */
describe('Upload foundation - batched autoRemove (#3335)', () => {
    function createFoundation({ initialFileList, beforeUpload, ...uploadProps }) {
        // committed React state; getState/getStates read this
        let committedFileList = initialFileList.slice();
        // pending (batched) update; not visible via getState until flushed
        let pendingFileList = null;
        const changes = [];

        const adapter = {
            getContext: () => undefined,
            getContexts: () => ({}),
            getProp: key => ({ beforeUpload, ...uploadProps })[key],
            getProps: () => ({ beforeUpload, ...uploadProps }),
            getState: key => ({ fileList: committedFileList })[key],
            getStates: () => ({ fileList: committedFileList }),
            updateFileList: (fileList) => {
                // simulate React 18 batching: keep the latest scheduled value but
                // do NOT flush it into committed state during the synchronous loop
                pendingFileList = fileList;
            },
            notifyChange: ({ fileList }) => changes.push(fileList),
            notifyProgress: () => {},
            updateLocalUrls: () => {},
            notifyBeforeUpload: ({ file, fileList }) => beforeUpload({ file, fileList }),
        };

        const foundation = new UploadFoundation(adapter);
        // flush the last batched update, mimicking React committing setState
        const flush = () => {
            if (pendingFileList !== null) {
                committedFileList = pendingFileList;
                pendingFileList = null;
            }
            return committedFileList;
        };
        const setCommittedFileList = fileList => {
            committedFileList = fileList.slice();
            pendingFileList = null;
        };
        return { foundation, flush, setCommittedFileList, getChanges: () => changes };
    }

    const makeFile = uid => ({ uid, name: `${uid}.png`, size: '10KB', status: 'wait', fileInstance: { uid } });

    it('removes every file when multiple files return autoRemove synchronously', () => {
        const fileA = makeFile('a');
        const fileB = makeFile('b');

        const beforeUpload = () => ({ shouldUpload: false, autoRemove: true });
        const { foundation, flush } = createFoundation({ initialFileList: [fileA, fileB], beforeUpload });

        foundation.startUpload([fileA, fileB]);

        // after the synchronous batch is committed, no file should remain
        expect(flush()).toEqual([]);
    });

    it('keeps only the non-autoRemove file when removals are interleaved', () => {
        const fileA = makeFile('a');
        const fileB = makeFile('b');
        const fileC = makeFile('c');

        // remove a and c, keep b
        const beforeUpload = ({ file }) =>
            file.uid === 'b'
                ? { shouldUpload: false, autoRemove: false }
                : { shouldUpload: false, autoRemove: true };
        const { foundation, flush } = createFoundation({ initialFileList: [fileA, fileB, fileC], beforeUpload });

        foundation.startUpload([fileA, fileB, fileC]);

        const result = flush();
        expect(result.map(f => f.uid)).toEqual(['b']);
    });

    it('falls back to React state outside a startUpload batch and clears the working copy', () => {
        const fileA = makeFile('a');
        const fileB = makeFile('b');

        const beforeUpload = () => ({ shouldUpload: false, autoRemove: true });
        const { foundation, flush } = createFoundation({ initialFileList: [fileA, fileB], beforeUpload });

        // a single upload (e.g. the replace flow) is not part of a startUpload batch
        foundation.upload(fileA);
        expect(flush().map(f => f.uid)).toEqual(['b']);
        // the batch working copy must not leak outside startUpload
        expect(foundation._batchFileList).toBeNull();
    });

    it('composes mixed sync + async beforeUpload results (sync remove then async remove)', async () => {
        const fileA = makeFile('a');
        const fileB = makeFile('b');

        // file A: synchronous autoRemove; file B: async autoRemove
        const beforeUpload = ({ file }) => {
            if (file.uid === 'a') {
                return { shouldUpload: false, autoRemove: true };
            }
            return Promise.resolve({ shouldUpload: false, autoRemove: true });
        };
        const { foundation, flush } = createFoundation({ initialFileList: [fileA, fileB], beforeUpload });

        foundation.startUpload([fileA, fileB]);
        // sync part of the batch is done; flush what React would have committed so far
        expect(flush().map(f => f.uid)).toEqual(['b']);

        // async result resolves later, must build on the latest snapshot ([b]) not a stale one
        await Promise.resolve();
        await Promise.resolve();
        expect(flush()).toEqual([]);
    });

    it('does not resurrect files replaced by an externally controlled fileList', async () => {
        const fileA = makeFile('a');
        const fileB = makeFile('b');
        const externalFile = makeFile('external');
        let resolveFileB;

        const beforeUpload = ({ file }) => {
            if (file.uid === 'a') {
                return { shouldUpload: false, autoRemove: true };
            }
            return new Promise(resolve => {
                resolveFileB = resolve;
            });
        };
        const { foundation, flush, setCommittedFileList, getChanges } = createFoundation({
            initialFileList: [fileA, fileB],
            beforeUpload,
        });

        foundation.startUpload([fileA, fileB]);
        expect(flush().map(f => f.uid)).toEqual(['b']);

        // Simulate getDerivedStateFromProps + componentDidUpdate after the parent
        // replaces the controlled list while file B's beforeUpload is pending.
        setCommittedFileList([externalFile]);
        foundation.syncLatestFileList([externalFile]);
        resolveFileB({ shouldUpload: false, status: 'uploadFail' });
        await Promise.resolve();
        await Promise.resolve();

        expect(flush().map(f => f.uid)).toEqual(['external']);
        expect(getChanges()).toHaveLength(1);
    });

    it('does not resurrect a removed file when customRequest reports progress synchronously', () => {
        const fileA = makeFile('a');
        const fileB = makeFile('b');
        const beforeUpload = ({ file }) =>
            file.uid === 'a' ? { shouldUpload: false, autoRemove: true } : true;
        const customRequest = ({ onProgress }) => {
            onProgress({ total: 100, loaded: 50 });
        };
        const originalXMLHttpRequest = global.XMLHttpRequest;
        const originalFormData = global.FormData;
        global.XMLHttpRequest = jest.fn();
        global.FormData = jest.fn();
        try {
            const { foundation, flush } = createFoundation({
                initialFileList: [fileA, fileB],
                beforeUpload,
                customRequest,
            });

            foundation.startUpload([fileA, fileB]);

            const result = flush();
            expect(result.map(f => f.uid)).toEqual(['b']);
            expect(result[0]).toMatchObject({ status: 'uploading', percent: 48 });
        } finally {
            global.XMLHttpRequest = originalXMLHttpRequest;
            global.FormData = originalFormData;
        }
    });

    it('clears the working copy even when beforeUpload throws', () => {
        const fileA = makeFile('a');
        const fileB = makeFile('b');

        const beforeUpload = ({ file }) => {
            if (file.uid === 'b') {
                throw new Error('boom');
            }
            return { shouldUpload: false, autoRemove: true };
        };
        const { foundation, flush } = createFoundation({ initialFileList: [fileA, fileB], beforeUpload });

        expect(() => foundation.startUpload([fileA, fileB])).toThrow('boom');
        // working copy must be cleared by try/finally even on exception
        expect(foundation._batchFileList).toBeNull();
        expect(flush().map(f => f.uid)).toEqual(['b']);
    });
});
