import React from 'react';
import { mount } from 'enzyme';
import Anchor from '../index';

describe('Anchor keyboard activation', () => {
    it('ignores printable keys and Space and activates with Enter', () => {
        const clicks = [];
        const wrapper = mount(<Anchor onClick={(event, link) => clicks.push(link)}><Anchor.Link href="#first" title="First" /></Anchor>);
        try {
            const link = wrapper.find('[role="link"]');
            link.simulate('keypress', { key: 'a' });
            link.simulate('keypress', { key: ' ' });
            expect(clicks).toEqual([]);
            link.simulate('keypress', { key: 'Enter' });
            expect(clicks).toEqual(['#first']);
        } finally { wrapper.unmount(); }
    });
    it('keeps disabled keyboard and pointer activation inert', () => {
        const clicks = [];
        const wrapper = mount(<Anchor onClick={() => clicks.push('called')}><Anchor.Link href="#first" title="First" disabled /></Anchor>);
        try {
            wrapper.find('[role="link"]').simulate('keypress', { key: 'Enter' });
            wrapper.find('[role="link"]').simulate('click');
            expect(clicks).toEqual([]);
        } finally { wrapper.unmount(); }
    });
});
