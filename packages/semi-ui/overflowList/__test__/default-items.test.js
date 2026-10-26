import React from 'react';
import { mount } from 'enzyme';
import OverflowList from '../index';

describe('OverflowList optional items', () => {
    ['collapse', 'scroll'].forEach(renderMode => {
        it(`renders omitted items and later data in ${renderMode} mode`, () => {
            const wrapper = mount(<OverflowList renderMode={renderMode}
                visibleItemRenderer={item => <span>{item.key}</span>}
                overflowRenderer={() => <span>More</span>} />);
            expect(wrapper.find('.semi-overflow-list').exists()).toEqual(true);
            wrapper.setProps({ items: [{ key: 'first' }] });
            expect(wrapper.text()).toContain('first');
            wrapper.setProps({ items: undefined });
            expect(wrapper.text()).not.toContain('first');
            wrapper.unmount();
        });
    });
});
