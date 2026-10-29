import React from 'react';
import { mount } from 'enzyme';
import TimePicker from '../index';
describe('TimePicker public ref methods', () => {
    it('focuses and blurs its input', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const ref = React.createRef(), onFocus = sinon.spy();
        const wrapper = mount(<TimePicker ref={ref} motion={false} onFocus={onFocus} />, { attachTo: container });
        try {
            ref.current.focus();
            expect(document.activeElement).toBe(wrapper.find('input').getDOMNode());
            expect(onFocus.calledOnce).toBe(true);
            ref.current.blur();
            expect(document.activeElement).not.toBe(wrapper.find('input').getDOMNode());
        } finally { wrapper.unmount(); container.remove(); }
    });
    it('does not focus a disabled input', () => {
        const ref = React.createRef(), container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<TimePicker ref={ref} disabled motion={false} />, { attachTo: container });
        try { ref.current.focus(); expect(document.activeElement).not.toBe(wrapper.find('input').getDOMNode()); }
        finally { wrapper.unmount(); container.remove(); }
    });
});
