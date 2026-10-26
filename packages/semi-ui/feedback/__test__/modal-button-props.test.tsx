import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import Feedback from '../index';

afterEach(cleanup);
const base = { visible: true, motion: false, mode: 'modal' as const, type: 'radio' as const, radioGroupProps: { options: ['satisfied', 'unsatisfied'] } };
const submit = () => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.semi-modal-footer button');
    return buttons[buttons.length - 1];
};

it('keeps the empty-feedback submit button disabled by default', () => {
    render(<Feedback {...base} />);
    expect(submit().disabled).toBe(true);
});

it('keeps automatic disabled state when only the submit button appearance changes', () => {
    render(<Feedback {...base} okButtonProps={{ id: 'submit-feedback', style: { minWidth: 110 } }} />);
    expect(submit().id).toBe('submit-feedback');
    expect(submit().disabled).toBe(true);
});

it('respects an explicit disabled override', () => {
    render(<Feedback {...base} okButtonProps={{ disabled: false }} />);
    expect(submit().disabled).toBe(false);
});

it('calls the public onOk after selecting a value', () => {
    const onOk = rstest.fn();
    const onValueChange = rstest.fn();
    render(<Feedback {...base} onOk={onOk} onValueChange={onValueChange} okButtonProps={{ id: 'submit-feedback' }} />);
    fireEvent.click(document.querySelector('input[type=radio]'));
    expect(onValueChange).toHaveBeenCalledWith('satisfied');
    fireEvent.click(submit());
    expect(onOk).toHaveBeenCalledTimes(1);
});

it.each(['ok', 'cancel'])('keeps the public asynchronous %s loading chain', async action => {
    let resolve = () => {};
    const pending = new Promise<void>(done => { resolve = done; });
    const callback = rstest.fn(() => pending);
    render(<Feedback {...base} {...(action === 'ok' ? { onOk: callback } : { onCancel: callback })}
        okButtonProps={{ id: 'submit-feedback', disabled: false }} />);
    const button = () => action === 'ok' ? submit() : document.querySelectorAll<HTMLButtonElement>('.semi-modal-footer button')[0];
    fireEvent.click(button());
    expect(callback).toHaveBeenCalledTimes(1);
    expect(button().className).toContain('semi-button-loading');
    await act(async () => { resolve(); });
    expect(button().className).not.toContain('semi-button-loading');
});

it('keeps an explicit loading prop', () => {
    render(<Feedback {...base} okButtonProps={{ disabled: false, loading: true }} />);
    expect(submit().className).toContain('semi-button-loading');
});

it('keeps an explicit button onClick override', () => {
    const onOk = rstest.fn();
    const onClick = rstest.fn();
    render(<Feedback {...base} onOk={onOk} okButtonProps={{ disabled: false, onClick }} />);
    fireEvent.click(submit());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOk).not.toHaveBeenCalled();
});
