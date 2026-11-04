import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Calendar from '../index';

describe('Calendar month outside listener cleanup', () => {
    let wrapper;
    let outsideListener;
    const date = new Date(2026, 9, 12);
    const events = Array.from({ length: 8 }, (_, index) => ({
        key: String(index),
        start: new Date(2026, 9, 12, 8 + index),
        end: new Date(2026, 9, 12, 9 + index),
        children: <span>event {index}</span>,
    }));

    afterEach(() => {
        wrapper?.unmount();
        wrapper = null;
        if (outsideListener) {
            document.removeEventListener('mousedown', outsideListener, false);
            outsideListener = null;
        }
        rs.restoreAllMocks();
    });

    async function open(onClose) {
        wrapper = mount(<Calendar mode="month" displayValue={date} events={events} height={320} onClose={onClose} />);
        const more = wrapper.find('.semi-calendar-month-event-card-wrapper').hostNodes().at(0);
        await act(async () => {
            more.simulate('click', { stopPropagation: () => {}, target: more.getDOMNode() });
            await new Promise(resolve => setTimeout(resolve, 30));
        });
        wrapper.update();
    }

    it('removes the document listener when an open calendar is unmounted', async () => {
        const add = rs.spyOn(document, 'addEventListener');
        const remove = rs.spyOn(document, 'removeEventListener');
        const onClose = rs.fn();
        await open(onClose);
        outsideListener = wrapper.find('monthCalendar').instance().clickOutsideHandler;
        expect(add.mock.calls.some(([type, listener]) => type === 'mousedown' && listener === outsideListener)).toBe(true);
        wrapper.unmount();
        wrapper = null;
        expect(remove.mock.calls.some(([type, listener]) => type === 'mousedown' && listener === outsideListener)).toBe(true);
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(onClose).not.toHaveBeenCalled();
    });

    it('keeps normal outside closing before unmount', async () => {
        const onClose = rs.fn();
        await open(onClose);
        await act(async () => {
            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        });
        expect(onClose).toHaveBeenCalledTimes(1);
        wrapper.unmount();
        wrapper = null;
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
