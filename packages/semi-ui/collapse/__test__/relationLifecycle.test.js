import React from 'react';
import { mount } from 'enzyme';
import Collapse from '../index';

describe('Collapse panel relationship lifecycle', () => {
    let wrapper;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        wrapper.unmount();
        container.remove();
    });

    it('removes the relationship when content is destroyed and restores it on reopen', () => {
        wrapper = mount(<Collapse defaultActiveKey={['one']} motion={false}><Collapse.Panel itemKey="one" header="Panel">Content</Collapse.Panel></Collapse>, { attachTo: container });
        const id = container.querySelector('[aria-owns]').getAttribute('aria-owns');
        expect(document.getElementById(id)).not.toBeNull();
        wrapper.find('.semi-collapse-header').simulate('click');
        expect(container.querySelector('.semi-collapse-content')).toBeNull();
        expect(container.querySelector('.semi-collapse-header').getAttribute('aria-owns')).toBeNull();
        wrapper.find('.semi-collapse-header').simulate('click');
        expect(container.querySelector('.semi-collapse-header').getAttribute('aria-owns')).toBe(id);
        expect(document.getElementById(id)).not.toBeNull();
    });

    it('does not reference content that has not been rendered', () => {
        wrapper = mount(<Collapse motion={false}><Collapse.Panel itemKey="one" header="Panel">Content</Collapse.Panel></Collapse>, { attachTo: container });
        expect(container.querySelector('.semi-collapse-content')).toBeNull();
        expect(container.querySelector('.semi-collapse-header').getAttribute('aria-owns')).toBeNull();
    });

    it('preserves keepDOM content while keeping any relationship valid', () => {
        wrapper = mount(<Collapse defaultActiveKey={['one']} motion={false} keepDOM><Collapse.Panel itemKey="one" header="Panel">Content</Collapse.Panel></Collapse>, { attachTo: container });
        wrapper.find('.semi-collapse-header').simulate('click');
        expect(container.querySelector('.semi-collapse-content').textContent).toBe('Content');
        const id = container.querySelector('.semi-collapse-header').getAttribute('aria-owns');
        if (id) {
            expect(document.getElementById(id)).not.toBeNull();
        }
    });

    it('does not reference absent content in an expanded empty panel', () => {
        wrapper = mount(<Collapse defaultActiveKey={['one']} motion={false}><Collapse.Panel itemKey="one" header="Panel" /></Collapse>, { attachTo: container });
        expect(container.querySelector('.semi-collapse-header').getAttribute('aria-owns')).toBeNull();
    });
});
