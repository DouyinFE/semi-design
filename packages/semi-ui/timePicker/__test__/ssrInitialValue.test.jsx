import React from 'react';
import { renderToString } from 'react-dom/server';
import TimePicker from '../index';

it.each([
    [{ defaultValue: '10:20:30' }, '10:20:30'],
    [{ value: '10:20:30' }, '10:20:30'],
    [{ type: 'timeRange', defaultValue: ['10:20:30', '12:30:40'] }, '10:20:30 ~ 12:30:40'],
    [{ defaultValue: new Date('2026-10-26T00:20:30Z'), timeZone: 'GMT+08:00' }, '08:20:30'],
    [{}, ''],
])('renders the initial input value on the server for %s', (props, expected) => {
    const onChange = rs.fn();
    const html = renderToString(<TimePicker {...props} onChange={onChange} />);
    const container = document.createElement('div');
    container.innerHTML = html;
    expect(container.querySelector('input').value).toBe(expected);
    expect(onChange).not.toHaveBeenCalled();
});
