import React from 'react';
import { mount } from 'enzyme';
import ColorPicker from '../index';

describe('ColorPicker panel style', () => {
    it('applies and updates style on the inline panel alongside className', () => {
        const wrapper = mount(<ColorPicker className="custom-panel" style={{ border: '1px solid red' }} />);
        try {
            const panel = wrapper.find('.semi-colorPicker.custom-panel').getDOMNode();
            expect(panel.style.border).toBe('1px solid red');
            wrapper.setProps({ style: { border: '2px solid blue' } });
            expect(panel.style.border).toBe('2px solid blue');
            wrapper.setProps({ style: undefined });
            expect(panel.style.border).toBe('');
        } finally { wrapper.unmount(); }
    });

    it('styles the panel inside a popover without styling the trigger', () => {
        const wrapper = mount(<ColorPicker usePopover className="custom-panel"
            style={{ border: '1px solid red' }} popoverProps={{ trigger: 'custom', visible: true }} />);
        try {
            expect(wrapper.find('.semi-colorPicker.custom-panel').getDOMNode().style.border).toBe('1px solid red');
            expect(wrapper.find('.semi-colorPicker-popover-defaultChildren').getDOMNode().style.border).toBe('');
        } finally { wrapper.unmount(); }
    });
});
