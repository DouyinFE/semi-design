import React from 'react';
import { mount } from 'enzyme';
import Calendar from '../index';
import { amendEvent, parseEvent } from '@douyinfe/semi-foundation/calendar/eventUtil';

describe('Calendar event input', () => {
    const date = hour => new Date(2026, 9, 15, hour);
    const createEvents = mode => mode === 'month' ? [
        { key: 'later', start: date(16), end: date(17), children: <div className="input-event">Later</div> },
        { key: 'earlier', start: date(9), end: date(10), children: <div className="input-event">Earlier</div> },
    ] : [
        { key: 'no-end', start: date(9), children: <div className="input-event">No end</div> },
        { key: 'no-start', end: date(12), children: <div className="input-event">No start</div> },
        { key: 'reversed', start: date(16), end: date(14), children: <div className="input-event">Reversed</div> },
    ];

    it.each(['month', 'day', 'week', 'range'])('preserves event objects and order in %s mode', mode => {
        const events = createEvents(mode);
        const before = events.map(event => ({ ...event }));
        const wrapper = mount(<Calendar
            mode={mode}
            displayValue={date(0)}
            events={events}
            range={[new Date(2026, 9, 12), new Date(2026, 9, 18)]}
            showCurrTime={false}
        />);
        try {
            expect(events).toEqual(before);
            expect(events.map(event => event.key)).toEqual(before.map(event => event.key));
            if (mode === 'day') {
                expect(wrapper.find('.input-event')).toHaveLength(3);
            }
        } finally {
            wrapper.unmount();
        }
    });

    it.each(['month', 'day', 'week', 'range'])('accepts frozen event input in %s mode', mode => {
        const events = Object.freeze(createEvents(mode).map(event => Object.freeze(event)));
        const wrapper = mount(<Calendar
            mode={mode}
            displayValue={date(0)}
            events={events}
            range={[new Date(2026, 9, 12), new Date(2026, 9, 18)]}
            showCurrTime={false}
        />);
        wrapper.unmount();
    });

    it.each([
        ['missing end', { start: date(9) }, date(9), date(10)],
        ['missing start', { end: date(12) }, date(11), date(12)],
        ['start near midnight', { start: new Date(2026, 9, 15, 23, 30) },
            new Date(2026, 9, 15, 23, 30), new Date(2026, 9, 15, 23, 59, 59, 999)],
        ['end near midnight', { end: new Date(2026, 9, 15, 0, 30) },
            date(0), new Date(2026, 9, 15, 0, 30)],
    ])('fills %s only in the parsed result', (name, dates, start, end) => {
        const event = { key: 'event', ...dates };
        const before = { ...event };
        const result = amendEvent(event);
        expect(event).toEqual(before);
        expect(result.start).toEqual(start);
        expect(result.end).toEqual(end);
    });

    it('normalizes a reversed event without swapping the original dates', () => {
        const event = { key: 'reversed', start: date(16), end: date(14) };
        const before = { ...event };
        const [parsed] = parseEvent(event);
        expect(event).toEqual(before);
        expect(parsed.start).toEqual(date(14));
        expect(parsed.end).toEqual(date(16));
    });
});
