import sinon from 'sinon';
import AIChatInputFoundation from '@douyinfe/semi-foundation/aiChatInput/foundation';

describe('AIChatInputFoundation', () => {
    describe('sending multiline content', () => {
        function createFoundation(content, props = {}, attachments = []) {
            const notifyMessageSend = sinon.spy();
            const foundation = new AIChatInputFoundation({
                getProp: key => props[key],
                getProps: () => props,
                getStates: () => ({ attachments }),
                getEditor: () => ({ getJSON: () => ({ type: 'doc', content }) }),
                getConfigureValue: () => ({}),
                notifyMessageSend,
                setState: () => {},
            });
            return { foundation, notifyMessageSend };
        }

        it.each([1, 2])('should send text after %i empty paragraphs', count => {
            const content = [
                ...Array.from({ length: count }, () => ({ type: 'paragraph' })),
                { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
            ];
            const { foundation, notifyMessageSend } = createFoundation(content);

            expect(foundation.canSend()).toEqual(true);
            foundation.handleSend();

            expect(notifyMessageSend.callCount).toEqual(1);
            expect(notifyMessageSend.firstCall.args[0].inputContents).toEqual([
                { type: 'text', text: 'Hello' },
            ]);
        });

        it('should keep a document containing only empty paragraphs disabled', () => {
            const { foundation, notifyMessageSend } = createFoundation([
                { type: 'paragraph' },
                { type: 'paragraph' },
            ]);

            expect(foundation.canSend()).toEqual(false);
            foundation.handleSend();
            expect(notifyMessageSend.callCount).toEqual(0);
        });

        it('should allow a slot after an empty paragraph', () => {
            const { foundation, notifyMessageSend } = createFoundation([
                { type: 'paragraph' },
                { type: 'paragraph', content: [{ type: 'selectSlot', attrs: { value: 'English' } }] },
            ]);

            expect(foundation.canSend()).toEqual(true);
            foundation.handleSend();
            expect(notifyMessageSend.firstCall.args[0].inputContents).toEqual([
                { type: 'text', text: 'English' },
            ]);
        });

        it('should continue allowing attachments with an empty document', () => {
            const attachments = [{ uid: '1', name: 'a.png', status: 'success' }];
            const { foundation, notifyMessageSend } = createFoundation([{ type: 'paragraph' }], {}, attachments);

            expect(foundation.canSend()).toEqual(true);
            foundation.handleSend();
            expect(notifyMessageSend.firstCall.args[0].attachments).toEqual(attachments);
        });

        it.each([false, true])('should respect an explicit canSend=%s', canSend => {
            const { foundation } = createFoundation([
                { type: 'paragraph' },
                { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
            ], { canSend });

            expect(foundation.canSend()).toEqual(canSend);
        });
    });

    it('should trigger uploadProps.onRemove when deleting uploaded file', async () => {
        const attachment = {
            uid: '1',
            name: 'a.png',
            size: '1KB',
            status: 'success',
            fileInstance: { name: 'a.png' },
        };

        const attachments = [attachment];
        const spyOnRemove = sinon.spy();
        const spyOnUploadChange = sinon.spy();
        const spyUploadOnChange = sinon.spy();

        const adapter = {
            getProps: () => ({
                onUploadChange: spyOnUploadChange,
                uploadProps: {
                    action: 'https://semi.test/upload',
                    onRemove: spyOnRemove,
                    onChange: spyUploadOnChange,
                },
            }),
            getStates: () => ({ attachments }),
            setState: () => {},
        };

        const foundation = new AIChatInputFoundation(adapter);
        foundation.handleUploadFileDelete(attachment);

        // wait for Promise.resolve().then
        await Promise.resolve();

        expect(spyOnRemove.callCount).toEqual(1);
        expect(spyOnRemove.firstCall.args[0]).toEqual(attachment.fileInstance);
        expect(Array.isArray(spyOnRemove.firstCall.args[1])).toEqual(true);
        expect(spyOnRemove.firstCall.args[1].length).toEqual(0);
        expect(spyOnRemove.firstCall.args[2].uid).toEqual('1');

        // still trigger onUploadChange + uploadProps.onChange via onUploadChange
        expect(spyOnUploadChange.callCount).toEqual(1);
        expect(spyUploadOnChange.callCount).toEqual(1);
        expect(spyOnUploadChange.firstCall.args[0].fileList.length).toEqual(0);
    });

    it('should respect uploadProps.beforeRemove returning false', async () => {
        const attachment = {
            uid: '1',
            name: 'a.png',
            size: '1KB',
            status: 'success',
        };
        const attachments = [attachment];

        const spyOnRemove = sinon.spy();
        const spyOnUploadChange = sinon.spy();
        const spyUploadOnChange = sinon.spy();
        const spyBeforeRemove = sinon.spy(() => false);

        const adapter = {
            getProps: () => ({
                onUploadChange: spyOnUploadChange,
                uploadProps: {
                    action: 'https://semi.test/upload',
                    beforeRemove: spyBeforeRemove,
                    onRemove: spyOnRemove,
                    onChange: spyUploadOnChange,
                },
            }),
            getStates: () => ({ attachments }),
            setState: () => {},
        };

        const foundation = new AIChatInputFoundation(adapter);
        foundation.handleUploadFileDelete(attachment);

        await Promise.resolve();

        expect(spyBeforeRemove.callCount).toEqual(1);
        expect(spyOnRemove.callCount).toEqual(0);
        expect(spyOnUploadChange.callCount).toEqual(0);
        expect(spyUploadOnChange.callCount).toEqual(0);
    });

    it('should support uploadProps.beforeRemove returning Promise', async () => {
        const attachment = {
            uid: '1',
            name: 'a.png',
            size: '1KB',
            status: 'success',
        };
        const attachments = [attachment];

        const spyOnRemove = sinon.spy();
        const spyOnUploadChange = sinon.spy();
        const spyBeforeRemove = sinon.spy(() => Promise.resolve(true));

        const adapter = {
            getProps: () => ({
                onUploadChange: spyOnUploadChange,
                uploadProps: {
                    action: 'https://semi.test/upload',
                    beforeRemove: spyBeforeRemove,
                    onRemove: spyOnRemove,
                },
            }),
            getStates: () => ({ attachments }),
            setState: () => {},
        };

        const foundation = new AIChatInputFoundation(adapter);
        foundation.handleUploadFileDelete(attachment);

        // flush both: outer Promise.resolve and beforeRemove Promise.resolve(true)
        await Promise.resolve();
        await Promise.resolve();

        expect(spyBeforeRemove.callCount).toEqual(1);
        expect(spyOnRemove.callCount).toEqual(1);
        expect(spyOnUploadChange.callCount).toEqual(1);
    });

    it('should do nothing when deleting non-existent uid', async () => {
        const attachment = {
            uid: 'not-exist',
            name: 'a.png',
            size: '1KB',
            status: 'success',
            fileInstance: { name: 'a.png' },
        };
        const attachments = [{ ...attachment, uid: '1' }];

        const spyOnRemove = sinon.spy();
        const spyOnUploadChange = sinon.spy();
        const spyUploadOnChange = sinon.spy();

        const adapter = {
            getProps: () => ({
                onUploadChange: spyOnUploadChange,
                uploadProps: {
                    action: 'https://semi.test/upload',
                    onRemove: spyOnRemove,
                    onChange: spyUploadOnChange,
                },
            }),
            getStates: () => ({ attachments }),
            setState: () => {},
        };

        const foundation = new AIChatInputFoundation(adapter);
        foundation.handleUploadFileDelete(attachment);

        await Promise.resolve();

        expect(spyOnRemove.callCount).toEqual(0);
        expect(spyOnUploadChange.callCount).toEqual(0);
        expect(spyUploadOnChange.callCount).toEqual(0);
    });
});
