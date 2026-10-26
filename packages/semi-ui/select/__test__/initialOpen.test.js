import React from 'react';
import Select from '../index';

describe('Select initial visibility', () => {
    it.each([
        [false, 'trigger'],
        [true, 'trigger'],
        [false, 'dropdown'],
        [true, 'dropdown'],
    ])('opens once with defaultOpen and autoFocus, multiple=%s searchPosition=%s', (multiple, searchPosition) => {
        const onDropdownVisibleChange = sinon.spy();
        const wrapper = mount(<Select motion={false} filter defaultOpen autoFocus multiple={multiple} searchPosition={searchPosition} optionList={[{ value: 'a', label: 'Alpha' }]} onDropdownVisibleChange={onDropdownVisibleChange} />);
        expect(onDropdownVisibleChange.callCount).toBe(1);
        expect(onDropdownVisibleChange.firstCall.args[0]).toBe(true);
        expect(wrapper.state('isOpen')).toBe(true);
        wrapper.unmount();
    });

    it('still opens on autoFocus without defaultOpen', () => {
        const onDropdownVisibleChange = sinon.spy();
        const wrapper = mount(<Select motion={false} filter autoFocus optionList={[{ value: 'a', label: 'Alpha' }]} onDropdownVisibleChange={onDropdownVisibleChange} />);
        expect(onDropdownVisibleChange.callCount).toBe(1);
        expect(onDropdownVisibleChange.firstCall.args[0]).toBe(true);
        wrapper.unmount();
    });
});

