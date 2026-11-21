import React from 'react';
import { act } from 'react-dom/test-utils';
import Select from '../index';

describe('Select outside listener ownership', () => {
    it.each(['close', 'unmount'])('removes every listener after repeated open and %s', action => {
        const onBlur = sinon.spy();
        const onDropdownVisibleChange = sinon.spy();
        const wrapper = mount(<Select motion={false} optionList={[{ value: 'a', label: 'Alpha' }]} onBlur={onBlur} onDropdownVisibleChange={onDropdownVisibleChange} />);
        act(() => {
            wrapper.instance().open();
            wrapper.instance().open();
        });
        if (action === 'close') {
            act(() => wrapper.instance().close());
        } else {
            wrapper.unmount();
        }
        onBlur.resetHistory();
        onDropdownVisibleChange.resetHistory();
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(onBlur.callCount).toBe(0);
        expect(onDropdownVisibleChange.callCount).toBe(0);
        if (action === 'close') {
            wrapper.unmount();
        }
    });

    it('closes once when clicking outside after repeated open', () => {
        const onBlur = sinon.spy();
        const onDropdownVisibleChange = sinon.spy();
        const wrapper = mount(<Select motion={false} optionList={[{ value: 'a', label: 'Alpha' }]} onBlur={onBlur} onDropdownVisibleChange={onDropdownVisibleChange} />);
        act(() => {
            wrapper.instance().open();
            wrapper.instance().open();
        });
        onDropdownVisibleChange.resetHistory();
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(onBlur.callCount).toBe(1);
        expect(onDropdownVisibleChange.callCount).toBe(1);
        expect(onDropdownVisibleChange.firstCall.args[0]).toBe(false);
        wrapper.unmount();
    });
});

