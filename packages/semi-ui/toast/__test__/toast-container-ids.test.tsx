import React from 'react';
import { act } from '@testing-library/react';
import { advanceTo, clear } from 'jest-date-mock';
import { ToastFactory } from '../index';

it('isolates factory containers created during the same millisecond', async () => {
    advanceTo(new Date(2026, 9, 26));
    let randomIndex = 0;
    const random = jest.spyOn(Math, 'random').mockImplementation(() => ((randomIndex++ % 35) + 0.5) / 36);
    const first = ToastFactory.create();
    const second = ToastFactory.create();
    try {
        act(() => {
            first.info({ content: 'First factory', duration: 0 });
            second.info({ content: 'Second factory', duration: 0 });
        });
        const firstId = first.getWrapperId();
        const secondId = second.getWrapperId();
        await act(async () => { second.destroyAll(); });
        expect(document.body.textContent).toContain('First factory');
        expect(document.body.textContent).not.toContain('Second factory');
        expect(firstId).not.toBe(secondId);
    } finally {
        await act(async () => {
            first.destroyAll();
            second.destroyAll();
        });
        document.querySelectorAll('.semi-toast-wrapper').forEach(node => node.remove());
        clear();
        random.mockRestore();
    }
});
