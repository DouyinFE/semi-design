import React from 'react';
import { mount } from 'enzyme';
import Modal from '../Modal';

describe('Modal keepDOM interaction lifecycle', () => {
    let wrapper;
    let host;
    let first;
    let second;
    const escape = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    const render = (props = {}) => {
        wrapper = mount(<Modal visible keepDOM motion={false} footer={null} title="Modal" {...props}><input id="modal-input"/></Modal>, { attachTo: host });
    };

    beforeEach(() => {
        host = document.createElement('div');
        first = document.createElement('button');
        second = document.createElement('button');
        document.body.append(first, second, host);
        first.focus();
    });

    afterEach(() => {
        wrapper?.unmount();
        first.remove();
        second.remove();
        host.remove();
        document.body.style.overflow = '';
        document.body.style.width = '';
    });

    it('restores focus when the kept modal becomes hidden', () => {
        render();
        wrapper.setProps({ visible: false });
        expect(document.activeElement).toBe(first);
    });

    it('preserves the original focus snapshot when the default footer autofocuses', () => {
        wrapper = mount(<Modal visible motion={false} title="Modal"><input/></Modal>, { attachTo: host });
        expect(document.activeElement.getAttribute('aria-label')).toBe('cancel');
        wrapper.setProps({ visible: false });
        expect(document.activeElement).toBe(first);
    });

    it('ignores Escape while hidden', () => {
        const onCancel = jest.fn();
        render({ onCancel });
        wrapper.setProps({ visible: false });
        escape();
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('focuses again on reopen and restores the latest trigger', () => {
        render();
        wrapper.setProps({ visible: false });
        second.focus();
        wrapper.setProps({ visible: true });
        expect(document.querySelector('[role="dialog"]').contains(document.activeElement)).toBe(true);
        wrapper.setProps({ visible: false });
        expect(document.activeElement).toBe(second);
    });

    it('does not acquire focus or Escape while initially hidden without lazy rendering', () => {
        const onCancel = jest.fn();
        render({ visible: false, lazyRender: false, onCancel });
        expect(document.activeElement).toBe(first);
        escape();
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('releases its hidden Escape priority so the underlying modal responds', () => {
        const onCancel = jest.fn();
        const HiddenPair = ({ visible }) => <><Modal visible motion={false} onCancel={onCancel}/><Modal visible={visible} keepDOM motion={false}/></>;
        wrapper = mount(<HiddenPair visible/>, { attachTo: host });
        wrapper.setProps({ visible: false });
        escape();
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('releases interaction after the leave animation finishes', () => {
        const onCancel = jest.fn();
        render({ motion: true, onCancel });
        wrapper.setProps({ visible: false });
        document.querySelector('.semi-modal-wrap').dispatchEvent(new Event('animationend', { bubbles: true }));
        escape();
        expect(onCancel).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(first);
    });
});
