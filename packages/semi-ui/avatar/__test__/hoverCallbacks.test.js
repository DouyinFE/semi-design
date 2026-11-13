import React from 'react';
import { act } from 'react-dom/test-utils';
import Avatar from '../index';

describe('Avatar mouse callbacks', () => {
    it.each([false, true])('notifies once when entering and leaving the avatar (bottomSlot=%s)', bottomSlot => {
        const onMouseEnter = sinon.spy();
        const onMouseLeave = sinon.spy();
        const wrapper = mount(<div><button>Outside</button><Avatar
            bottomSlot={bottomSlot ? { text: 'Online' } : undefined}
            hoverMask="Hover content" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>U</Avatar></div>);
        try {
            const avatar = wrapper.find('.semi-avatar');
            const outer = wrapper.find('.semi-avatar-wrapper');
            // Enzyme dispatches directly; entering from outside crosses both elements.
            act(() => {
                if (outer.exists()) { outer.simulate('mouseEnter'); }
                avatar.simulate('mouseEnter');
            });
            wrapper.update();
            expect(onMouseEnter.callCount).toBe(1);
            expect(wrapper.find('.semi-avatar-hover').text()).toBe('Hover content');
            act(() => {
                avatar.simulate('mouseLeave');
                if (outer.exists()) { outer.simulate('mouseLeave'); }
            });
            wrapper.update();
            expect(onMouseLeave.callCount).toBe(1);
            expect(wrapper.find('.semi-avatar-hover').exists()).toBe(false);
        } finally { wrapper.unmount(); }
    });
});
