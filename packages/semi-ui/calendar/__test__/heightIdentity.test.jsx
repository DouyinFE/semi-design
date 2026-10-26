import React from 'react';
import { mount } from 'enzyme';
import Calendar from '../index';
describe('Calendar month content identity on height updates', ()=>{
    let bounds;
    beforeEach(()=>{bounds = HTMLElement.prototype.getBoundingClientRect;HTMLElement.prototype.getBoundingClientRect = function() {const rect = bounds.call(this);if (this.classList.contains('semi-calendar-month-weekrow')) {const grid = this.closest('.semi-calendar-month');return { ...rect, height: parseFloat(grid.style.height) / grid.querySelectorAll('.semi-calendar-month-weekrow').length };} return rect;};});
    afterEach(()=>{HTMLElement.prototype.getBoundingClientRect = bounds;});
    it.each([900, 400])('preserves an uncontrolled event input when height changes to %s', height=>{
        const container = document.createElement('div');document.body.appendChild(container);
        const wrapper = mount(<Calendar mode="month" height={600} displayValue={new Date(2026, 9, 12)} events={[{ key: 'event', start: new Date(2026, 9, 12, 8), end: new Date(2026, 9, 12, 9), children: <input defaultValue="initial"/> }]}/>, { attachTo: container });
        try {const input = container.querySelector('input');input.value = 'user note';const limit = wrapper.find('monthCalendar').state('itemLimit');wrapper.setProps({ height });expect(wrapper.find('monthCalendar').state('itemLimit')).not.toBe(limit);expect(container.querySelector('input')).toBe(input);expect(container.querySelector('input').value).toBe('user note');} finally {wrapper.unmount();container.remove();}
    });
});

