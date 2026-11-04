import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Calendar from '../index';
const date = new Date(2026, 9, 12);
const events = Array.from({ length: 8 }, (_, index)=>({ key: String(index), start: new Date(2026, 9, 12, 8 + index), end: new Date(2026, 9, 12, 9 + index), children: <span>event {index}</span> }));
describe('Calendar month close event', ()=>{
    let wrapper;
    afterEach(()=>{wrapper?.unmount();wrapper = null;});
    async function open(onClose) {
        wrapper = mount(<Calendar mode="month" displayValue={date} events={events} height={320} onClose={onClose}/>);
        const more = wrapper.find('.semi-calendar-month-event-card-wrapper').hostNodes().at(0);
        await act(async()=>{more.simulate('click', { stopPropagation: ()=>{}, target: more.getDOMNode() });await new Promise(resolve=>setTimeout(resolve, 30));});wrapper.update();
    }
    it('forwards the actual outside mousedown event', async()=>{
        const received = [];await open(event=>received.push(event));
        const event = new MouseEvent('mousedown', { bubbles: true });
        await act(async()=>{document.body.dispatchEvent(event);});wrapper.update();
        expect(received).toHaveLength(1);expect(received[0]).toBe(event);
    });
    it('keeps the close button event', async()=>{
        const received = [];await open(event=>received.push(event));
        wrapper.find('.semi-calendar-month-event-card-close').hostNodes().at(0).simulate('click', { type: 'click' });
        expect(received).toHaveLength(1);expect(received[0].type).toBe('click');
    });
});

