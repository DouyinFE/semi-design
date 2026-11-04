import React from 'react';
import { act } from '@testing-library/react';
import DefaultToast, { ToastFactory } from '../index';
import { semiGlobal } from '../../index';

let Toast;
const initialConfig = semiGlobal.config;
beforeEach(() => { Toast = ToastFactory.create(); });
afterEach(async () => {
    await act(async () => { Toast.destroyAll(); DefaultToast.destroyAll(); });
    semiGlobal.config = initialConfig;
    DefaultToast.config({ getPopupContainer: () => document.body });
    document.getElementById('specific-popup')?.remove();
});

it.each(['call', 'factory', 'config', 'global'])('uses the default body when the %s container callback returns null', entry => {
    const getPopupContainer = rstest.fn(() => null);
    if (entry === 'factory') Toast = ToastFactory.create({ getPopupContainer });
    if (entry === 'config') Toast.config({ getPopupContainer });
    if (entry === 'global') semiGlobal.config = { ...initialConfig, overrideDefaultProps: { ...initialConfig.overrideDefaultProps, Toast: { getPopupContainer } } };
    act(() => { Toast.info({ content: 'nullable container', duration: 0, ...(entry === 'call' ? { getPopupContainer } : {}) }); });
    expect(getPopupContainer).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.semi-toast')?.textContent).toBe('nullable container');
    expect(document.querySelector('.semi-toast-wrapper')?.parentElement).toBe(document.body);
});

it('preserves a valid custom parent', () => {
    const parent = document.createElement('section');
    parent.id = 'specific-popup';
    document.body.appendChild(parent);
    act(() => { Toast.info({ content: 'custom parent', duration: 0, getPopupContainer: () => parent }); });
    expect(parent.querySelector('.semi-toast')?.textContent).toBe('custom parent');
    expect(parent.querySelector('.semi-toast-wrapper')?.parentElement).toBe(parent);
});

it('uses the body when no container callback is configured', () => {
    act(() => { Toast.info({ content: 'default parent', duration: 0 }); });
    expect(document.querySelector('.semi-toast-wrapper')?.parentElement).toBe(document.body);
});

it('continues to propagate errors from a container callback', () => {
    const error = new Error('container callback failed');
    const getPopupContainer = rstest.fn(() => { throw error; });
    expect(() => act(() => { Toast.info({ content: 'failed parent', getPopupContainer }); })).toThrow(error);
    expect(getPopupContainer).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.semi-toast')).toBeNull();
});
