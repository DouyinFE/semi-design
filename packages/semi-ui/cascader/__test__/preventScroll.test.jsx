import React from 'react';
import { mount } from 'enzyme';
import Cascader from '../index';
describe('Cascader preventScroll', () => {
    [true, false].forEach(preventScroll => {
        it('uses preventScroll=' + preventScroll + ' when focusing the multiple input', () => {
            const ref = React.createRef();
            const wrapper = mount(<Cascader ref={ref} multiple filterTreeNode preventScroll={preventScroll} />);
            const focus = sinon.spy(wrapper.find('input').getDOMNode(), 'focus');
            try { ref.current.focus(); expect(focus.calledWith({ preventScroll })).toBe(true); }
            finally { focus.restore(); wrapper.unmount(); }
        });
    });
});
