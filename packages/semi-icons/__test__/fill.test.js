import React from 'react';
import IconAILoading from '../src/icons/IconAILoading';
import { getFillColor } from '../src/utils';

describe('gradient icon fill', () => {
    it.each([
        [['red', 'blue'], ['red', 'blue', 'red', 'blue']],
        [['red', 'orange', 'green', 'blue'], ['blue', 'green', 'orange', 'red']],
        [['red', 'orange', 'green', 'blue', 'purple'], ['blue', 'green', 'orange', 'red']],
    ])('preserves caller colors %j', (fill, expected) => {
        const previous = [...fill];
        expect(getFillColor(fill, 4)).toEqual(expected);
        expect(fill).toEqual(previous);
    });

    it('accepts a frozen four-color array', () => {
        const fill = Object.freeze(['red', 'orange', 'green', 'blue']);
        expect(getFillColor(fill, 4)).toEqual(['blue', 'green', 'orange', 'red']);
    });

    it('keeps SVG colors stable across renders', () => {
        const fill = ['red', 'orange', 'green', 'blue'];
        const wrapper = mount(<IconAILoading fill={fill} />);
        try {
            const colors = () => wrapper.find('stop').map(node => node.prop('stopColor'));
            const first = colors();
            wrapper.setProps({ className: 'updated' });
            expect(colors()).toEqual(first);
            expect(fill).toEqual(['red', 'orange', 'green', 'blue']);
        } finally { wrapper.unmount(); }
    });
});
