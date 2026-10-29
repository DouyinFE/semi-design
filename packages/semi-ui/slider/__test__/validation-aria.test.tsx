import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Slider from '../index';
afterEach(cleanup);
it.each([false, true])('passes validation ARIA to every handle with range=%s', range => {
    const { getAllByRole } = render(<><p id="help">帮助</p><p id="error">数值无效</p>
        <Slider range={range} defaultValue={range ? [20, 60] : 20} aria-invalid="true" aria-describedby="help error" aria-errormessage="error" />
    </>);
    getAllByRole('slider').forEach(handle => {
        expect(handle.getAttribute('aria-invalid')).toBe('true');
        expect(handle.getAttribute('aria-describedby')).toBe('help error');
        expect(handle.getAttribute('aria-errormessage')).toBe('error');
    });
});
