import React from 'react';
import Nav from '..';

const items = [
    { itemKey: 'home', text: 'Home' },
    { itemKey: 'team', text: 'Team', items: [{ itemKey: 'members', text: 'Members' }] },
];
const children = () => [<Nav.Item key="home" itemKey="home" text="Home" />,
    <Nav.Sub key="team" itemKey="team" text="Team"><Nav.Item itemKey="members" text="Members" /></Nav.Sub>];
const open = wrapper => wrapper.find('.semi-navigation-sub-title').hostNodes().simulate('click');
const selectMember = wrapper => wrapper.find('.semi-navigation-item-normal').hostNodes().last().simulate('click');

describe('Navigation defaults only initialize state', () => {
    ['items', 'children'].forEach(mode => {
        const content = () => mode === 'items' ? { items: items.map(item => ({ ...item })) } : { children: children() };
        it(`keeps selection and open keys when ${mode} are recreated`, () => {
            const wrapper = mount(<Nav {...content()} defaultSelectedKeys={['home']} defaultOpenKeys={[]} subNavMotion={false} />);
            open(wrapper);
            selectMember(wrapper);
            wrapper.setProps(content());
            expect(wrapper.state('selectedKeys')).toContain('members');
            expect(wrapper.state('selectedKeys')).not.toContain('home');
            expect(wrapper.state('openKeys')).toEqual(['team']);
            wrapper.setProps(content());
            expect(wrapper.state('selectedKeys')).toEqual(['members', 'team']);
            wrapper.unmount();
        });

        it(`does not reopen a manually closed default menu after ${mode} change`, () => {
            const wrapper = mount(<Nav {...content()} defaultSelectedKeys={['members']} subNavMotion={false} />);
            expect(wrapper.state('openKeys')).toEqual(['team']);
            open(wrapper);
            wrapper.setProps(content());
            expect(wrapper.state('openKeys')).toEqual([]);
            wrapper.unmount();
        });

        it(`still accepts controlled values when ${mode} also change`, () => {
            const wrapper = mount(<Nav {...content()} selectedKeys={['home']} openKeys={[]} subNavMotion={false} />);
            wrapper.setProps({ ...content(), selectedKeys: ['members'], openKeys: ['team'] });
            expect(wrapper.state('selectedKeys')).toContain('members');
            expect(wrapper.state('openKeys')).toEqual(['team']);
            wrapper.unmount();
        });
    });

    it('preserves manually opened keys when controlled selection changes', () => {
        const wrapper = mount(<Nav items={items} selectedKeys={['home']} defaultOpenKeys={[]} subNavMotion={false} />);
        open(wrapper);
        wrapper.setProps({ selectedKeys: ['members'] });
        expect(wrapper.state('openKeys')).toEqual(['team']);
        wrapper.unmount();
    });

    it('keeps defaults when items are loaded after the first render', () => {
        const wrapper = mount(<Nav items={[]} defaultSelectedKeys={['members']} defaultOpenKeys={['team']} />);
        wrapper.setProps({ items });
        expect(wrapper.state('selectedKeys')).toContain('members');
        expect(wrapper.state('openKeys')).toEqual(['team']);
        wrapper.unmount();
    });

    it('opens the parent of defaultSelectedKeys when items are loaded after the first render', () => {
        const wrapper = mount(<Nav items={[]} defaultSelectedKeys={['members']} subNavMotion={false} />);
        wrapper.setProps({ items });
        expect(wrapper.state('openKeys')).toEqual(['team']);
        wrapper.unmount();
    });
});
