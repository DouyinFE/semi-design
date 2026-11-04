import React from 'react';
import { mount } from 'enzyme';
import ScrollList from '../index';
import { act } from 'react-dom/test-utils';
import { spy, useFakeTimers } from 'sinon';

const list = Array.from({ length: 6 }, (_, value) => ({ value, text: `option ${value}`, disabled: value === 3 }));

describe('ScrollList selected option semantics', () => {
    it('updates the selected option after an uncontrolled wheel item click', () => {
        const clock = useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] }), onSelect = spy();
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<ScrollList.Item list={list} motion={false} onSelect={onSelect} />, { attachTo: container });
        try {
            act(() => { wrapper.find('li').at(2).getDOMNode().dispatchEvent(new MouseEvent('click', { bubbles: true })); clock.tick(100); });
            const selected = wrapper.getDOMNode().querySelectorAll('[role="option"][aria-selected="true"]');
            expect(selected.length).toBe(1);
            expect(selected[0].textContent).toBe('option 2');
            expect(onSelect.lastCall.args[0].index).toBe(2);
        } finally { wrapper.unmount(); container.remove(); clock.restore(); }
    });
    [{ mode: 'normal', cycled: false }, { mode: 'wheel', cycled: false }, { mode: 'wheel', cycled: true }].forEach(props => {
        it(`exposes one selected option for ${props.mode}, cycled=${props.cycled}`, () => {
            const wrapper = mount(<ScrollList.Item {...props} list={list} selectedIndex={2} motion={false} />);
            try {
                let selected = wrapper.getDOMNode().querySelectorAll('[role="option"][aria-selected="true"]');
                expect(selected.length).toBe(1);
                expect(selected[0].textContent).toBe('option 2');
                wrapper.setProps({ selectedIndex: 4 });
                selected = wrapper.getDOMNode().querySelectorAll('[role="option"][aria-selected="true"]');
                expect(selected.length).toBe(1);
                expect(selected[0].textContent).toBe('option 4');
                expect(wrapper.getDOMNode().querySelector('[aria-disabled="true"]').textContent).toBe('option 3');
            } finally { wrapper.unmount(); }
        });
    });
});
