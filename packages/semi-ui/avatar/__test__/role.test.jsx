import React from 'react';
import { mount } from 'enzyme';
import Avatar from '../index';
import AvatarGroup from '../avatarGroup';

describe('Avatar role', () => {
    let wrapper;
    afterEach(() => wrapper.unmount());

    it('does not expose a list item outside an avatar group', () => {
        wrapper = mount(<Avatar>U</Avatar>);
        expect(wrapper.find('span.semi-avatar').prop('role')).toBeUndefined();
    });

    it('preserves an explicit role', () => {
        wrapper = mount(<Avatar role="img" aria-label="用户 V">V</Avatar>);
        expect(wrapper.find('span.semi-avatar').prop('role')).toBe('img');
    });

    it('keeps list items for grouped avatars, including the overflow avatar', () => {
        wrapper = mount(<AvatarGroup maxCount={1}><Avatar>A</Avatar><Avatar>B</Avatar></AvatarGroup>);
        expect(wrapper.find('span.semi-avatar').map(avatar => avatar.prop('role'))).toEqual(['listitem', 'listitem']);
    });

    it('provides the group role to a custom overflow avatar', () => {
        wrapper = mount(<AvatarGroup maxCount={1} renderMore={() => <Avatar>更多</Avatar>}><Avatar>A</Avatar><Avatar>B</Avatar></AvatarGroup>);
        expect(wrapper.find('span.semi-avatar').map(avatar => avatar.prop('role'))).toEqual(['listitem', 'listitem']);
    });

    it('preserves an explicit role inside a group', () => {
        wrapper = mount(<AvatarGroup><Avatar role="img">A</Avatar></AvatarGroup>);
        expect(wrapper.find('span.semi-avatar').prop('role')).toBe('img');
    });
});
