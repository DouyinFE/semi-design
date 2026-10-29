import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Upload from '../index';

describe('Upload crop paste permission errors', () => {
    let wrapper;
    let permissions;
    let clipboard;

    beforeEach(() => {
        permissions = Object.getOwnPropertyDescriptor(navigator, 'permissions');
        clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    });

    afterEach(() => {
        wrapper?.unmount();
        wrapper = null;
        if (permissions) {
            Object.defineProperty(navigator, 'permissions', permissions);
        } else {
            delete navigator.permissions;
        }
        if (clipboard) {
            Object.defineProperty(navigator, 'clipboard', clipboard);
        } else {
            delete navigator.clipboard;
        }
    });

    async function paste(query, read = rs.fn().mockResolvedValue([])) {
        Object.defineProperty(navigator, 'permissions', { configurable: true, value: { query } });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { read } });
        const onPastingError = rs.fn();
        wrapper = mount(<Upload action="/upload" crop addOnPasting onPastingError={onPastingError} />);
        await act(async () => {
            document.body.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyV', ctrlKey: true, metaKey: true }));
            // Errors are held back for the paste fallback delay (100ms) in case a native paste event follows.
            await new Promise(resolve => setTimeout(resolve, 150));
        });
        return { onPastingError, read };
    }

    it('reports denied permission without reading the clipboard', async () => {
        const denied = { state: 'denied', name: 'clipboard-read' };
        const { onPastingError, read } = await paste(rs.fn().mockResolvedValue(denied));
        expect(onPastingError).toHaveBeenCalledTimes(1);
        expect(onPastingError).toHaveBeenCalledWith(denied);
        expect(read).not.toHaveBeenCalled();
    });

    it('keeps an allowed empty clipboard free from errors', async () => {
        const { onPastingError, read } = await paste(rs.fn().mockResolvedValue({ state: 'granted' }));
        expect(read).toHaveBeenCalledTimes(1);
        expect(onPastingError).not.toHaveBeenCalled();
    });

    it('preserves errors from the permission query', async () => {
        const error = new Error('permission query failed');
        const { onPastingError, read } = await paste(rs.fn().mockRejectedValue(error));
        expect(onPastingError).toHaveBeenCalledWith(error);
        expect(read).not.toHaveBeenCalled();
    });
});
