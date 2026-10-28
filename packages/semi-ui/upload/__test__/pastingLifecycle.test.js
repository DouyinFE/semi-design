import React from 'react';
import { act } from 'react-dom/test-utils';
import Upload from '../index';

function pasteFile() {
    const event = new Event('paste', { bubbles: true, cancelable: true });
    const file = new File(['image'], 'pasted.png', { type: 'image/png' });
    Object.defineProperty(event, 'clipboardData', {
        value: { items: [{ kind: 'file', getAsFile: () => file }] },
    });
    document.body.dispatchEvent(event);
}

describe('Upload pasting lifecycle', () => {
    let wrapper;
    let instance;
    afterEach(() => {
        if (wrapper) { wrapper.unmount(); }
        if (instance) {
            document.body.removeEventListener('paste', instance.pasteEventCb);
            document.body.removeEventListener('keydown', instance.pastingCb);
        }
        sinon.restore();
    });
    function render(props) {
        wrapper = mount(<Upload action="https://example.invalid/upload" {...props} />);
        instance = wrapper.instance();
        return wrapper;
    }
    async function paste() {
        await act(async () => {
            pasteFile();
            await new Promise(resolve => setTimeout(resolve, 150));
        });
    }

    it.each([false, true])('stops accepting files after disabled becomes true (crop=%s)', async crop => {
        const request = sinon.spy();
        render({ addOnPasting: true, customRequest: request, crop });
        const cropFiles = sinon.stub(instance, 'handleCropFiles');
        wrapper.setProps({ disabled: true });
        await paste();
        expect(request.called).toBe(false);
        expect(cropFiles.called).toBe(false);
    });

    it.each(['disabled', 'addOnPasting'])('starts accepting files when %s enables pasting', async prop => {
        const request = sinon.spy();
        render({ addOnPasting: prop !== 'addOnPasting', disabled: prop === 'disabled', customRequest: request });
        wrapper.setProps({ [prop]: prop === 'addOnPasting' });
        await paste();
        expect(request.callCount).toBe(1);
    });

    it.each([false, true])('stops accepting files after addOnPasting becomes false (crop=%s)', async crop => {
        const request = sinon.spy();
        render({ addOnPasting: true, customRequest: request, crop });
        const cropFiles = sinon.stub(instance, 'handleCropFiles');
        wrapper.setProps({ addOnPasting: false });
        await paste();
        expect(request.called).toBe(false);
        expect(cropFiles.called).toBe(false);
    });

    it('removes both listeners when disabled and does not duplicate them on re-enable', async () => {
        const request = sinon.spy();
        render({ addOnPasting: true, customRequest: request });
        const oldPaste = instance.pasteEventCb;
        const oldKeydown = instance.pastingCb;
        const remove = sinon.spy(document.body, 'removeEventListener');
        wrapper.setProps({ disabled: true });
        expect(remove.calledWith('paste', oldPaste)).toBe(true);
        expect(remove.calledWith('keydown', oldKeydown)).toBe(true);
        wrapper.setProps({ disabled: false });
        wrapper.setProps({ disabled: true });
        wrapper.setProps({ disabled: false });
        await paste();
        expect(request.callCount).toBe(1);
        const pasteListener = instance.pasteEventCb;
        const keydown = instance.pastingCb;
        wrapper.unmount();
        wrapper = null;
        expect(remove.calledWith('paste', pasteListener)).toBe(true);
        expect(remove.calledWith('keydown', keydown)).toBe(true);
    });

    it.each([false, true])('handles each native image paste once, including when crop=%s', async crop => {
        const permissions = Object.getOwnPropertyDescriptor(navigator, 'permissions');
        const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
        Object.defineProperty(navigator, 'permissions', {
            configurable: true, value: { query: async () => ({ state: 'granted' }) },
        });
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { read: async () => [{ types: ['image/png'], getType: async () => ({ arrayBuffer: async () => new ArrayBuffer(1) }) }] },
        });
        try {
            const request = sinon.spy();
            render({ addOnPasting: true, customRequest: request, crop });
            const cropFiles = sinon.stub(instance, 'handleCropFiles');
            await act(async () => {
                for (let i = 0; i < 2; i++) {
                    document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', ctrlKey: true, metaKey: true, bubbles: true }));
                    pasteFile();
                }
                await new Promise(resolve => setTimeout(resolve, 150));
            });
            expect(crop ? cropFiles.callCount : request.callCount).toBe(2);
        } finally {
            if (permissions) { Object.defineProperty(navigator, 'permissions', permissions); } else { delete navigator.permissions; }
            if (clipboard) { Object.defineProperty(navigator, 'clipboard', clipboard); } else { delete navigator.clipboard; }
        }
    });

    it.each([false, true])('ignores a clipboard read already in progress after a native paste (crop=%s)', async crop => {
        const permissions = Object.getOwnPropertyDescriptor(navigator, 'permissions');
        const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
        let finishRead;
        let notifyRead;
        const started = new Promise(resolve => { notifyRead = resolve; });
        Object.defineProperty(navigator, 'permissions', { configurable: true, value: { query: async () => ({ state: 'granted' }) } });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { read: () => { notifyRead(); return new Promise(resolve => { finishRead = resolve; }); } } });
        try {
            const request = sinon.spy();
            render({ addOnPasting: true, customRequest: request, crop });
            const cropFiles = sinon.stub(instance, 'handleCropFiles');
            document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', ctrlKey: true, metaKey: true, bubbles: true }));
            await started;
            await act(async () => {
                pasteFile();
                finishRead([{ types: ['image/png'], getType: async () => ({ arrayBuffer: async () => new ArrayBuffer(1) }) }]);
                await new Promise(resolve => setTimeout(resolve, 150));
            });
            expect(crop ? cropFiles.callCount : request.callCount).toBe(1);
        } finally {
            if (permissions) { Object.defineProperty(navigator, 'permissions', permissions); } else { delete navigator.permissions; }
            if (clipboard) { Object.defineProperty(navigator, 'clipboard', clipboard); } else { delete navigator.clipboard; }
        }
    });

    it.each([false, true])('keeps keyboard clipboard fallback working without a native file paste (crop=%s)', async crop => {
        const permissions = Object.getOwnPropertyDescriptor(navigator, 'permissions');
        const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
        Object.defineProperty(navigator, 'permissions', { configurable: true, value: { query: async () => ({ state: 'granted' }) } });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { read: async () => [{ types: ['image/png'], getType: async () => ({ arrayBuffer: async () => new ArrayBuffer(1) }) }] } });
        try {
            const request = sinon.spy();
            render({ addOnPasting: true, customRequest: request, crop });
            const cropFiles = sinon.stub(instance, 'handleCropFiles');
            await act(async () => {
                document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', ctrlKey: true, metaKey: true, bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 150));
            });
            expect(crop ? cropFiles.callCount : request.callCount).toBe(1);
        } finally {
            if (permissions) { Object.defineProperty(navigator, 'permissions', permissions); } else { delete navigator.permissions; }
            if (clipboard) { Object.defineProperty(navigator, 'clipboard', clipboard); } else { delete navigator.clipboard; }
        }
    });

    it.each([false, true])('handles a later independent native paste after keyboard fallback (crop=%s)', async crop => {
        const permissions = Object.getOwnPropertyDescriptor(navigator, 'permissions');
        const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
        Object.defineProperty(navigator, 'permissions', { configurable: true, value: { query: async () => ({ state: 'granted' }) } });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { read: async () => [{ types: ['image/png'], getType: async () => ({ arrayBuffer: async () => new ArrayBuffer(1) }) }] } });
        try {
            const request = sinon.spy();
            render({ addOnPasting: true, customRequest: request, crop });
            const cropFiles = sinon.stub(instance, 'handleCropFiles');
            await act(async () => {
                document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', ctrlKey: true, metaKey: true, bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 150));
                pasteFile();
                await new Promise(resolve => setTimeout(resolve, 150));
            });
            expect(crop ? cropFiles.callCount : request.callCount).toBe(2);
        } finally {
            if (permissions) { Object.defineProperty(navigator, 'permissions', permissions); } else { delete navigator.permissions; }
            if (clipboard) { Object.defineProperty(navigator, 'clipboard', clipboard); } else { delete navigator.clipboard; }
        }
    });

    it.each([false, true])('ignores clipboard reads that finish after disabling (crop=%s)', async crop => {
        const permissions = Object.getOwnPropertyDescriptor(navigator, 'permissions');
        const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
        let finishRead;
        const pending = new Promise(resolve => { finishRead = resolve; });
        let notifyRead;
        const started = new Promise(resolve => { notifyRead = resolve; });
        Object.defineProperty(navigator, 'permissions', {
            configurable: true, value: { query: async () => ({ state: 'granted' }) },
        });
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true, value: { read: () => { notifyRead(); return pending; } },
        });
        try {
            const request = sinon.spy();
            render({ addOnPasting: true, customRequest: request, crop });
            const cropFiles = sinon.stub(instance, 'handleCropFiles');
            document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', ctrlKey: true, metaKey: true }));
            await started;
            wrapper.setProps({ disabled: true });
            await act(async () => {
                finishRead([{ types: ['image/png'], getType: async () => ({ arrayBuffer: async () => new ArrayBuffer(1) }) }]);
                await new Promise(resolve => setTimeout(resolve, 150));
            });
            expect(request.called).toBe(false);
            expect(cropFiles.called).toBe(false);
        } finally {
            if (permissions) { Object.defineProperty(navigator, 'permissions', permissions); } else { delete navigator.permissions; }
            if (clipboard) { Object.defineProperty(navigator, 'clipboard', clipboard); } else { delete navigator.clipboard; }
        }
    });
});
