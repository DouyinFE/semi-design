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
    it('ignores inputs of a popup nested under a custom trigger', () => {
        const ref = React.createRef(), container = document.createElement('div');
        document.body.appendChild(container);
        const popupContainer = () => document.getElementById('nested-popup');
        const wrapper = mount(
            <TimePicker
                ref={ref}
                open
                motion={false}
                getPopupContainer={popupContainer}
                panelHeader={<input id="popup-input" />}
                triggerRender={() => <div><button id="trigger">open</button><div id="nested-popup" /></div>}
            />,
            { attachTo: container }
        );
        try {
            expect(container.querySelector('#popup-input')).not.toBeNull();
            ref.current.focus();
            expect(document.activeElement).not.toBe(container.querySelector('#popup-input'));
        } finally { wrapper.unmount(); container.remove(); }
    });
    it('focuses the input of a custom trigger instead of a popup input', () => {
        const ref = React.createRef(), container = document.createElement('div');
        document.body.appendChild(container);
        const popupContainer = () => document.getElementById('nested-popup');
        const wrapper = mount(
            <TimePicker
                ref={ref}
                open
                motion={false}
                getPopupContainer={popupContainer}
                panelHeader={<input id="popup-input" />}
                triggerRender={() => <div><div id="nested-popup" /><input id="trigger-input" /></div>}
            />,
            { attachTo: container }
        );
        try {
            ref.current.focus();
            expect(document.activeElement).toBe(container.querySelector('#trigger-input'));
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
