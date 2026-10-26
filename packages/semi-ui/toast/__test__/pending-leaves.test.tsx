import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { ToastFactory } from '../index';

let Toast;
beforeEach(() => { Toast = ToastFactory.create(); });
afterEach(async () => {
    await act(async () => { Toast.destroyAll(); });
});

function add(id) {
    act(() => { Toast.info({ id, content: id, duration: 0 }); });
}

function getToast(id) {
    return Array.from(document.querySelectorAll('.semi-toast')).find(node => node.textContent === id);
}

it.each(['add', 'update'])('retains a pending leave when another toast is %s', operation => {
    add('a');
    add('b');
    const leaving = getToast('a');
    act(() => { Toast.close('a'); });
    if (operation === 'add') add('c');
    else act(() => { Toast.info({ id: 'b', content: 'updated', duration: 0 }); });
    expect(document.body.contains(leaving)).toBe(true);
    expect(leaving.classList.contains('semi-toast-animation-hide')).toBe(true);
    fireEvent.animationEnd(leaving);
    expect(document.body.contains(leaving)).toBe(false);
});

it('finishes each pending leave without removing another unfinished animation', () => {
    add('a');
    add('b');
    const first = getToast('a');
    const second = getToast('b');
    act(() => { Toast.close('a'); });
    act(() => { Toast.close('b'); });
    expect(document.body.contains(first)).toBe(true);
    expect(document.body.contains(second)).toBe(true);
    fireEvent.animationEnd(first);
    expect(document.body.contains(first)).toBe(false);
    expect(document.body.contains(second)).toBe(true);
    fireEvent.animationEnd(second);
    expect(document.body.contains(second)).toBe(false);
});

it('keeps a reopened toast after the old leave was interrupted', () => {
    add('a');
    act(() => { Toast.close('a'); });
    add('a');
    const reopened = getToast('a');
    fireEvent.animationEnd(reopened);
    expect(document.body.contains(reopened)).toBe(true);
    expect(reopened.classList.contains('semi-toast-animation-hide')).toBe(false);
});
