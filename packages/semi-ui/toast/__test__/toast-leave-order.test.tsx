import React from 'react';
import { act } from '@testing-library/react';
import { ToastFactory } from '../index';

it.each(['a', 'b'])('preserves DOM order while %s leaves', async closing => {
    const Toast = ToastFactory.create();
    try {
        act(() => {
            ['a', 'b', 'c'].forEach(id => Toast.info({ id, content: id, duration: 0 }));
        });
        act(() => { Toast.close(closing); });
        expect(Array.from(document.querySelectorAll('.semi-toast-content-text'), node => node.textContent)).toEqual(['a', 'b', 'c']);
    } finally {
        await act(async () => { Toast.destroyAll(); });
    }
});
