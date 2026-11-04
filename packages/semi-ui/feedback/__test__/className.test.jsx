import React from 'react';
import { mount } from 'enzyme';
import Feedback from '../index';
describe('Feedback className', () => {
    ['popup', 'modal'].forEach(mode => {
        it('keeps the supplied class in ' + mode + ' mode', () => {
            const wrapper = mount(<Feedback visible mode={mode} type="text" className="custom-feedback" motion={false} />);
            try {
                expect(document.querySelector('.semi-feedback.custom-feedback')).not.toBeNull();
                expect(document.querySelector('.semi-feedback.className')).toBeNull();
            } finally { wrapper.unmount(); }
        });
    });
});
