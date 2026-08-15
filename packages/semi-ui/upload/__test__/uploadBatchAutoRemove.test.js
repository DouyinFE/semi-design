import UploadFoundation from '../../../semi-foundation/upload/foundation';

/**
 * Regression test for #3335:
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
    function createFoundation(initialFileList, beforeUpload) {
        // committed React state; getState/getStates read this
        let committedFileList = initialFileList.slice();
        // pending (batched) update; not visible via getState until flushed
        let pendingFileList = null;
        const changes = [];

        const adapter = {
            getContext: () => undefined,
            getContexts: () => ({}),
            getProp: key => ({ beforeUpload })[key],
            getProps: () => ({ beforeUpload }),
            getState: key => ({ fileList: committedFileList })[key],
            getStates: () => ({ fileList: committedFileList }),
            updateFileList: (fileList) => {
                // simulate React 18 batching: keep the latest scheduled value but
                // do NOT flush it into committed state during the synchronous loop
                pendingFileList = fileList;
            },
            notifyChange: ({ fileList }) => changes.push(fileList),
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
        return { foundation, flush, getChanges: () => changes };
    }

    it('removes every file when multiple files return autoRemove synchronously', () => {
        const fileA = { uid: 'a', name: 'a.png', size: '10KB', status: 'wait', fileInstance: {} };
        const fileB = { uid: 'b', name: 'b.png', size: '10KB', status: 'wait', fileInstance: {} };

        const beforeUpload = () => ({ shouldUpload: false, autoRemove: true });
        const { foundation, flush } = createFoundation([fileA, fileB], beforeUpload);

        foundation.startUpload([fileA, fileB]);

        // after the synchronous batch is committed, no file should remain
        expect(flush()).toEqual([]);
    });

    it('keeps only the non-autoRemove file when removals are interleaved', () => {
        const fileA = { uid: 'a', name: 'a.png', size: '10KB', status: 'wait', fileInstance: {} };
        const fileB = { uid: 'b', name: 'b.png', size: '10KB', status: 'wait', fileInstance: {} };
        const fileC = { uid: 'c', name: 'c.png', size: '10KB', status: 'wait', fileInstance: {} };

        // remove a and c, keep b
        const beforeUpload = ({ file }) =>
            file.uid === 'b'
                ? { shouldUpload: false, autoRemove: false }
                : { shouldUpload: false, autoRemove: true };
        const { foundation, flush } = createFoundation([fileA, fileB, fileC], beforeUpload);

        foundation.startUpload([fileA, fileB, fileC]);

        const result = flush();
        expect(result.map(f => f.uid)).toEqual(['b']);
    });

    it('falls back to React state outside a startUpload batch and clears the working copy', () => {
        const fileA = { uid: 'a', name: 'a.png', size: '10KB', status: 'wait', fileInstance: {} };
        const fileB = { uid: 'b', name: 'b.png', size: '10KB', status: 'wait', fileInstance: {} };

        const beforeUpload = () => ({ shouldUpload: false, autoRemove: true });
        const { foundation, flush } = createFoundation([fileA, fileB], beforeUpload);

        // a single upload (e.g. the replace flow) is not part of a startUpload batch
        foundation.upload(fileA);
        expect(flush().map(f => f.uid)).toEqual(['b']);
        // the batch working copy must not leak outside startUpload
        expect(foundation._batchFileList).toBeNull();
    });
});
