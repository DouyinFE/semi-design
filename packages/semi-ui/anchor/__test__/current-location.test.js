import React from 'react';
import { mount } from 'enzyme';
import Anchor from '../index';

describe('Anchor current location', () => {
    it('exposes only the activated link as the current location', () => {
        const wrapper = mount(<Anchor>
            <Anchor.Link href="#first" title="First" />
            <Anchor.Link href="#second" title="Second" />
        </Anchor>);
        expect(wrapper.find('[aria-current="location"]')).toHaveLength(0);
        wrapper.find('.semi-anchor-link-title').at(0).simulate('click');
        expect(wrapper.find('[aria-current="location"]').text()).toEqual('First');
        expect(wrapper.find('[aria-details]')).toHaveLength(0);
        wrapper.find('.semi-anchor-link-title').at(1).simulate('click');
        expect(wrapper.find('[aria-current="location"]')).toHaveLength(1);
        expect(wrapper.find('[aria-current="location"]').text()).toEqual('Second');
        wrapper.unmount();
    });
});
