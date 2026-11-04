import React from 'react';
import { mount } from 'enzyme';
import Anchor from '../index';

function padding(wrapper) {
    return wrapper.find('.semi-anchor-link-title').map(node => node.getDOMNode().style.paddingLeft);
}

describe('Anchor Fragment indentation', () => {
    it('keeps Fragment children at the same indentation level', () => {
        const wrapper = mount(<Anchor><><Anchor.Link href="#first" title="first" /><Anchor.Link href="#second" title="second" /></></Anchor>);
        try { expect(padding(wrapper)).toEqual(['8px', '8px']); }
        finally { wrapper.unmount(); }
    });

    it('keeps nested Fragment children at their parent link depth', () => {
        const wrapper = mount(<Anchor><Anchor.Link href="#parent" title="parent"><><Anchor.Link href="#child" title="child" /></></Anchor.Link></Anchor>);
        try { expect(padding(wrapper)).toEqual(['8px', '16px']); }
        finally { wrapper.unmount(); }
    });

    it('preserves indentation for normal parent and child links', () => {
        const wrapper = mount(<Anchor><Anchor.Link href="#parent" title="parent"><Anchor.Link href="#child" title="child" /></Anchor.Link></Anchor>);
        try { expect(padding(wrapper)).toEqual(['8px', '16px']); }
        finally { wrapper.unmount(); }
    });
});
