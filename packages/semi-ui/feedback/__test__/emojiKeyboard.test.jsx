import React from 'react';
import { mount } from 'enzyme';
import Feedback from '../index';
import { strings } from '@douyinfe/semi-foundation/feedback/constants';
describe('Feedback emoji keyboard', () => {
    ['Enter', ' '].forEach(key => {
        it('selects an emoji with ' + key, () => {
            const onValueChange = sinon.spy();
            const wrapper = mount(<Feedback visible type="emoji" motion={false} onValueChange={onValueChange} />);
            try {
                const item = wrapper.find('.semi-feedback-emoji-item').at(0);
                expect(item.prop('tabIndex')).toBe(0);
                expect(item.prop('role')).toBe('button');
                item.simulate('keyDown', { key });
                expect(onValueChange.calledOnce).toBe(true);
                expect(onValueChange.firstCall.args[0]).toEqual({ emoji: strings.Emoji.bad });
            } finally { wrapper.unmount(); }
        });
    });
    it('does not activate on other keys', () => {
        const onValueChange = sinon.spy();
        const wrapper = mount(<Feedback visible type="emoji" motion={false} onValueChange={onValueChange} />);
        try { wrapper.find('.semi-feedback-emoji-item').at(0).simulate('keyDown', { key: 'ArrowRight' }); expect(onValueChange.called).toBe(false); }
        finally { wrapper.unmount(); }
    });
    it('keeps mouse selection', () => {
        const onValueChange = sinon.spy();
        const wrapper = mount(<Feedback visible type="emoji" motion={false} onValueChange={onValueChange} />);
        try { wrapper.find('.semi-feedback-emoji-item').at(0).simulate('click'); expect(onValueChange.calledOnce).toBe(true); }
        finally { wrapper.unmount(); }
    });
});
