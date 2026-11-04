import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { Form } from '../../form';
import Slider from '../index';

afterEach(cleanup);

it.each([{ range: false, min: 0 }, { range: true, min: 0 }, { range: false, min: 10 }, { range: true, min: 10 }])('restores the field after reset, range: $range, min: $min', ({ range, min }) => {
    let api;
    const { container } = render(<Form getFormApi={value => { api = value; }}>
        <Form.Slider field="score" range={range} min={min} />
        <button type="reset">Reset</button>
    </Form>);
    const handles = container.querySelectorAll('.semi-slider-handle');
    const handle = handles[handles.length - 1];
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(handle.getAttribute('aria-valuenow')).toBe(String(min + 1));
    fireEvent.reset(container.querySelector('form'));
    expect(api.getValue('score')).toBeUndefined();
    expect(handle.getAttribute('aria-valuenow')).toBe(String(min));
});

it('keeps the last value when the value prop is removed', () => {
    const { container, rerender } = render(<Slider value={30} />);
    rerender(<Slider />);
    expect(container.querySelector('.semi-slider-handle').getAttribute('aria-valuenow')).toBe('30');
});
