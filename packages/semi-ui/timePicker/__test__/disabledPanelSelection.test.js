import TimePickerFoundation from '@douyinfe/semi-foundation/timePicker/foundation';

it('ignores a panel selection after the TimePicker is disabled', () => {
    const props = { disabled: false, format: 'HH:mm', onChangeWithDateFirst: true };
    const state = { value: [new Date(2026, 0, 1, 10)], inputValue: '10:00', isAM: [true] };
    const changes = [];
    const foundation = new TimePickerFoundation({
        getProp: key => props[key],
        getProps: () => props,
        getState: key => state[key],
        setState: update => Object.assign(state, update),
        isRangePicker: () => false,
        notifyChange: (_value, inputValue) => changes.push(inputValue),
    });
    const selection = { isAM: true, value: '11:00', timeStampValue: new Date(2026, 0, 1, 11).getTime() };

    props.disabled = true;
    foundation.handlePanelChange(selection);
    expect(state.inputValue).toBe('10:00');
    expect(changes).toEqual([]);

    props.disabled = false;
    foundation.handlePanelChange(selection);
    expect(state.inputValue).toBe('11:00');
    expect(changes).toEqual(['11:00']);
});
