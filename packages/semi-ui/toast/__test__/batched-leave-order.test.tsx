import React from 'react';
import { act, fireEvent, render, cleanup } from '@testing-library/react';
import { ToastFactory } from '../index';

it('preserves a middle leaving toast when creation and close share one React event', async () => {
    const Toast = ToastFactory.create();
    const view = render(<button onClick={() => {
        ['a', 'b', 'c'].forEach(id => Toast.info({ id, content: id, duration: 0 }));
        Toast.close('b');
    }}>Notify</button>);
    try {
        fireEvent.click(view.getByText('Notify'));
        expect(Array.from(document.querySelectorAll('.semi-toast-content-text'), node => node.textContent)).toEqual(['a', 'b', 'c']);
    } finally {
        await act(async () => { Toast.destroyAll(); });
        cleanup();
    }
});
