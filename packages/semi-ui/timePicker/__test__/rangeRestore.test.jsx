import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import TimePicker from '../index';

afterEach(cleanup);
function selectFirst(panel) {
    const onChange = rs.fn();
    const view = render(<TimePicker type="timeRange" defaultOpen motion={false} scrollItemProps={{ mode: 'normal', cycled: false }} onChange={onChange} />);
    const hours = document.querySelectorAll('.semi-timepicker-panel-list-hour');
    fireEvent.click(hours[panel].querySelectorAll('li')[1]);
    const result = onChange.mock.calls[0];
    view.unmount();
    return result;
}
it.each([0, 1])('restores the actual right-first range callback argument %s', argument => {
    const result = selectFirst(1);
    const onChange = rs.fn();
    const { container } = render(<TimePicker type="timeRange" defaultValue={result[argument]} motion={false} onChange={onChange} />);
    expect(container.querySelector('input').value).toBe(' ~ 01:00:00');
    expect(onChange).not.toHaveBeenCalled();
});
it('keeps the actual left-first string callback restorable', () => {
    const result = selectFirst(0);
    const { container } = render(<TimePicker type="timeRange" defaultValue={result[1]} motion={false} />);
    expect(container.querySelector('input').value).toBe('01:00:00');
});
it('preserves a complete range default value', () => {
    const { container } = render(<TimePicker type="timeRange" defaultValue={['01:00:00', '02:00:00']} motion={false} />);
    expect(container.querySelector('input').value).toBe('01:00:00 ~ 02:00:00');
});
