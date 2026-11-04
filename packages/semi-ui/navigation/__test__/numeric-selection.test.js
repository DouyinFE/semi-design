import Nav from '../index';

[false, true].forEach(numeric => {
    it(`highlights the parent submenu for a selected ${numeric ? 'numeric' : 'string'} itemKey`, () => {
        const parent = numeric ? 1 : '1';
        const child = numeric ? 2 : '2';
        const wrapper = mount(<Nav defaultSelectedKeys={[child]} items={[{ itemKey: parent, text: 'Parent', items: [{ itemKey: child, text: 'Child' }] }]} />);
        expect(wrapper.find('.semi-navigation-sub-title-selected')).toHaveLength(1);
        wrapper.unmount();
    });
});

[[1, 0], [0, 2]].forEach(([parent, child]) => {
    it(`selects and opens the ancestor when the path parent=${parent}, child=${child} contains 0`, () => {
        const wrapper = mount(<Nav defaultSelectedKeys={[child]} items={[{ itemKey: parent, text: 'Parent', items: [{ itemKey: child, text: 'Child' }] }]} />);
        expect(wrapper.find('.semi-navigation-sub-title-selected')).toHaveLength(1);
        expect(wrapper.find('.semi-navigation-item-selected').hostNodes()).toHaveLength(1);
        expect(wrapper.state('openKeys')).toEqual([parent]);
        wrapper.unmount();
    });
});
