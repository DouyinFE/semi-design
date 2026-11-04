import React from 'react';
import { mount } from 'enzyme';
import Typography from '../index';

describe('Numeral decimal precision', () => {
    it.each([
        ['0.29', 'text', 2, 'floor', '0.29'],
        ['0.07', 'text', 2, 'ceil', '0.07'],
        ['-0.29', 'text', 2, 'ceil', '-0.29'],
        ['-0.07', 'text', 2, 'floor', '-0.07'],
        ['1.005', 'text', 2, 'round', '1.01'],
        ['-1.005', 'text', 2, 'round', '-1.00'],
        ['1.234', 'text', 2, 'floor', '1.23'],
        ['1.234', 'text', 2, 'ceil', '1.24'],
        ['1e-7', 'text', 8, 'round', '0.00000010'],
        ['0.07', 'percentages', 0, 'ceil', '7%'],
        ['0.29', 'percentages', 0, 'floor', '29%'],
        ['-0.07', 'percentages', 0, 'floor', '-7%'],
        ['1e-7', 'percentages', 5, 'ceil', '0.00001%'],
        ['0.07123', 'percentages', 2, 'floor', '7.12%'],
        ['0.07123', 'percentages', 2, 'ceil', '7.13%'],
        ['0.01005', 'percentages', 2, 'round', '1.01%'],
    ])('formats %s with %s precision %s and %s', (content, rule, precision, truncate, expected) => {
        const wrapper = mount(<Typography.Numeral rule={rule} precision={precision} truncate={truncate}>{content}</Typography.Numeral>);
        try {
            expect(wrapper.text()).toBe(expected);
        } finally {
            wrapper.unmount();
        }
    });
});
