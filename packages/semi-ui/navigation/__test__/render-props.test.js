import Nav from '../index';

describe('Navigation rendered item props', () => {
    it('updates submenu rendering props without replacing items', () => {
        const items = [{ itemKey: 'parent', text: 'Parent', items: [{ itemKey: 'child', text: 'Child' }] }];
        const nav = mount(<Nav items={items} expandIcon={<span>Before</span>} subDropdownProps={{ className: 'before' }} />);
        nav.setProps({ className: 'rerender' });
        nav.setProps({ expandIcon: <span>After</span>, subDropdownProps: { className: 'after' } });
        expect(nav.find(Nav.Sub).prop('expandIcon').props.children).toBe('After');
        expect(nav.find(Nav.Sub).prop('subDropdownProps').className).toBe('after');
        nav.unmount();
    });
});
