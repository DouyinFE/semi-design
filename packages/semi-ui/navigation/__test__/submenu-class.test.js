import Nav from '../index';

describe('Navigation item className', () => {
    it('preserves a custom className on the submenu root', () => {
        const wrapper = mount(<Nav items={[{ itemKey: 'sub', text: 'Submenu', className: 'custom-submenu', items: [{ itemKey: 'leaf', text: 'Leaf' }] }]} />);
        expect(wrapper.getDOMNode().querySelector('li.custom-submenu')).not.toBeNull();
        wrapper.unmount();
    });

    it('continues to preserve a custom className on leaf items', () => {
        const wrapper = mount(<Nav items={[{ itemKey: 'leaf', text: 'Leaf', className: 'custom-leaf' }]} />);
        expect(wrapper.getDOMNode().querySelector('li.custom-leaf')).not.toBeNull();
        wrapper.unmount();
    });
});
