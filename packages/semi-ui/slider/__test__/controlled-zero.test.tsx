import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Slider from '../index';
afterEach(cleanup);
it('prefers a controlled zero over defaultValue on the initial render', () => {
    const { getByRole } = render(<Slider value={0} defaultValue={40} />);
    expect(getByRole('slider').getAttribute('aria-valuenow')).toBe('0');
});
it('uses defaultValue when value is absent', () => {
    const { getByRole } = render(<Slider defaultValue={40} />);
    expect(getByRole('slider').getAttribute('aria-valuenow')).toBe('40');
});
