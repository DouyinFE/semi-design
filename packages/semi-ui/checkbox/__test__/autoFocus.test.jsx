import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../index';

describe('Checkbox autoFocus', () => {
    it('focuses its native input on mount', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<Checkbox autoFocus>label</Checkbox>, { attachTo: container });
        try { expect(document.activeElement).toBe(wrapper.find('input').getDOMNode()); }
        finally { wrapper.unmount(); container.remove(); }
    });
    it('does not take focus when autoFocus is false', () => {
        const button = document.createElement('button');
        document.body.appendChild(button);
        button.focus();
        const wrapper = mount(<Checkbox autoFocus={false}>label</Checkbox>);
        try { expect(document.activeElement).toBe(button); }
        finally { wrapper.unmount(); button.remove(); }
    });
});
