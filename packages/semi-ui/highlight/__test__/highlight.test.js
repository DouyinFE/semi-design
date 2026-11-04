import React from 'react';
import Highlight from '../index';

describe('Highlight optional search words', () => {
    it.each([
        [[undefined, 'Semi'], ['Semi']],
        [[undefined], []],
        [['', undefined, 'Design'], ['Design']],
    ])('renders text with searchWords=%j', (searchWords, matches) => {
        const wrapper = mount(<Highlight sourceString="Semi Design" searchWords={searchWords} />);
        try {
            expect(wrapper.text()).toBe('Semi Design');
            expect(wrapper.find('mark').map(node => node.text())).toEqual(matches);
        } finally { wrapper.unmount(); }
    });

    it('does not warn propTypes when searchWords contains objects', () => {
        const errorSpy = rs.spyOn(console, 'error').mockImplementation(() => {});
        const wrapper = mount(
            <Highlight sourceString="Semi Design" searchWords={[{ text: 'Semi', className: 'custom' }, 'Design']} />
        );
        try {
            expect(errorSpy).not.toHaveBeenCalled();
            expect(wrapper.find('mark.custom').length).toBe(1);
        } finally {
            wrapper.unmount();
            errorSpy.mockRestore();
        }
    });
});
