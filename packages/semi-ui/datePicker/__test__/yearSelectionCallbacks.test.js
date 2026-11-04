import React from 'react';
import DatePicker from '../index';

describe('DatePicker year and month selection callbacks', () => {
    it.each([false, true])('notifies once when selecting a year, autoSwitchDate=%s', autoSwitchDate => {
        const onPanelChange = sinon.spy();
        const onChange = sinon.spy();
        const wrapper = mount(<DatePicker motion={false} defaultOpen defaultValue={new Date(2026, 9, 15)} autoSwitchDate={autoSwitchDate} onPanelChange={onPanelChange} onChange={onChange} />);
        wrapper.find('.semi-datepicker-navigation-month button').simulate('click', { nativeEvent: { stopImmediatePropagation() {} } });
        wrapper.find('.semi-scrolllist-item li').filterWhere(node => node.text() === '2027').simulate('click');
        expect(onPanelChange.callCount).toBe(1);
        expect(onChange.callCount).toBe(autoSwitchDate ? 1 : 0);
        expect(onPanelChange.firstCall.args[0].getFullYear()).toBe(2027);
        wrapper.unmount();
    });

    it('updates year and month together without overshooting the target', () => {
        const onPanelChange = sinon.spy();
        const wrapper = mount(<DatePicker motion={false} defaultOpen defaultValue={new Date(2026, 9, 15)} onPanelChange={onPanelChange} />);
        wrapper.find('.semi-datepicker-navigation-month button').simulate('click', { nativeEvent: { stopImmediatePropagation() {} } });
        wrapper.find('.semi-scrolllist-item li').filterWhere(node => node.text() === '2027').simulate('click');
        wrapper.find('.semi-scrolllist-item li').filterWhere(node => node.text() === '3').simulate('click');
        expect(onPanelChange.callCount).toBe(2);
        expect(onPanelChange.lastCall.args[0].getFullYear()).toBe(2027);
        expect(onPanelChange.lastCall.args[0].getMonth()).toBe(2);
        wrapper.unmount();
    });

    it.each([0, 1])('notifies once when selecting a year in range panel %s', panelIndex => {
        const onPanelChange = sinon.spy();
        const wrapper = mount(<DatePicker type="dateRange" motion={false} defaultOpen defaultValue={[new Date(2026, 0, 15), new Date(2026, 1, 15)]} onPanelChange={onPanelChange} />);
        wrapper.find('.semi-datepicker-navigation-month button').at(panelIndex).simulate('click', { nativeEvent: { stopImmediatePropagation() {} } });
        wrapper.find('.semi-scrolllist-item li').filterWhere(node => node.text() === '2027').simulate('click');
        expect(onPanelChange.callCount).toBe(1);
        expect(onPanelChange.firstCall.args[0][panelIndex].getFullYear()).toBe(2027);
        wrapper.unmount();
    });
});

