import React from 'react';
import { mount } from 'enzyme';
import Feedback from '../index';
import { strings } from '@douyinfe/semi-foundation/feedback/constants';
describe('Feedback textarea change', () => {
    ['text', 'emoji'].forEach(type => {
        it('updates the value and notifies both callbacks for ' + type, () => {
            const onChange = sinon.spy(), onValueChange = sinon.spy();
            const wrapper = mount(<Feedback visible type={type} motion={false} textAreaProps={{ onChange }} onValueChange={onValueChange} />);
            try {
                if (type === 'emoji') wrapper.find('.semi-feedback-emoji-item').at(0).simulate('click');
                onValueChange.resetHistory();
                wrapper.find('textarea').simulate('change', { target: { value: 'reason' } });
                expect(onChange.calledOnce).toBe(true);
                expect(onChange.firstCall.args[0]).toBe('reason');
                expect(onValueChange.calledOnce).toBe(true);
                expect(onValueChange.firstCall.args[0]).toEqual(type === 'text' ? 'reason' : { emoji: strings.Emoji.bad, text: 'reason' });
            } finally { wrapper.unmount(); }
        });
    });
});
