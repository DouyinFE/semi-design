import { Sidebar } from '../../index';

const Container = Sidebar.Container;

describe('Sidebar.Container listener ownership', () => {
    it('removes the Escape listener when unmounted during its leave animation', () => {
        const onCancel = jest.fn();
        const wrapper = mount(<Container visible closeOnEsc onCancel={onCancel} />);
        wrapper.setProps({ visible: false });
        wrapper.unmount();
        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27, bubbles: true }));
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('still closes an open container with Escape', () => {
        const onCancel = jest.fn();
        const wrapper = mount(<Container visible closeOnEsc onCancel={onCancel} />);
        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27, bubbles: true }));
        expect(onCancel).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });
});
