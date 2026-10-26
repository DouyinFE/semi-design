import { Sidebar } from '../../index';

const Container = Sidebar.Container;

describe('Sidebar.Container visibility notifications', () => {
    it('reports visibility once after each completed transition', () => {
        const afterVisibleChange = jest.fn();
        const wrapper = mount(<Container visible={false} afterVisibleChange={afterVisibleChange} />);
        wrapper.setProps({ visible: true });
        wrapper.find('.semi-sidebar-container').simulate('animationEnd');
        expect(afterVisibleChange).toHaveBeenCalledTimes(1);
        expect(afterVisibleChange).toHaveBeenLastCalledWith(true);
        wrapper.find('.semi-sidebar-container').simulate('animationEnd');
        expect(afterVisibleChange).toHaveBeenCalledTimes(1);
        wrapper.setProps({ visible: false });
        wrapper.find('.semi-sidebar-container').simulate('animationEnd');
        expect(afterVisibleChange).toHaveBeenCalledTimes(2);
        expect(afterVisibleChange).toHaveBeenLastCalledWith(false);
        wrapper.unmount();
    });

    it('reports visibility changes when motion is disabled', () => {
        const afterVisibleChange = jest.fn();
        const wrapper = mount(<Container visible={false} motion={false} afterVisibleChange={afterVisibleChange} />);
        wrapper.setProps({ visible: true });
        expect(afterVisibleChange).toHaveBeenLastCalledWith(true);
        wrapper.setProps({ visible: false });
        expect(afterVisibleChange).toHaveBeenLastCalledWith(false);
        expect(afterVisibleChange).toHaveBeenCalledTimes(2);
        wrapper.unmount();
    });
});
