import Modal from '../Modal';

describe('Modal body scroll lock', () => {
    let wrappers;
    let containers;
    let originalStyle;

    const open = (props = {}) => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        containers.push(container);
        const wrapper = mount(<Modal visible motion={false} footer={null} {...props}>Content</Modal>, { attachTo: container });
        wrappers.push(wrapper);
        return wrapper;
    };
    const close = wrapper => { wrapper.setProps({ visible: false }); wrapper.update(); };

    beforeEach(() => {
        wrappers = [];
        containers = [];
        originalStyle = document.body.style.cssText;
        document.body.style.overflow = 'auto';
        document.body.style.width = '90%';
    });

    afterEach(() => {
        wrappers.forEach(wrapper => { if (wrapper.length) { wrapper.unmount(); } });
        containers.forEach(container => container.remove());
        document.body.style.cssText = originalStyle;
    });

    it.each([0, 1])('retains the lock when modal %s closes first', first => {
        const modals = [open(), open()];
        const lockedWidth = document.body.style.width;
        close(modals[first]);
        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.width).toBe(lockedWidth);
        close(modals[1 - first]);
        expect(document.body.style.overflow).toBe('auto');
        expect(document.body.style.width).toBe('90%');
    });

    it('does not unlock another modal when a closed modal unmounts', () => {
        const first = open();
        close(first);
        const second = open();
        first.unmount();
        expect(document.body.style.overflow).toBe('hidden');
        second.unmount();
        expect(document.body.style.overflow).toBe('auto');
        expect(document.body.style.width).toBe('90%');
    });

    it('keeps the lock when the first visible modal unmounts', () => {
        const first = open();
        const second = open();
        first.unmount();
        expect(document.body.style.overflow).toBe('hidden');
        close(second);
        expect(document.body.style.overflow).toBe('auto');
        expect(document.body.style.width).toBe('90%');
    });

    it('acquires and releases a new lock when the same modal reopens', () => {
        const modal = open();
        close(modal);
        document.body.style.width = '80%';
        modal.setProps({ visible: true });
        close(modal);
        expect(document.body.style.overflow).toBe('auto');
        expect(document.body.style.width).toBe('80%');
    });

    it('holds the lock through leave animation and reopening before it ends', () => {
        const modal = open({ motion: true });
        modal.setProps({ visible: false });
        expect(document.body.style.overflow).toBe('hidden');
        modal.setProps({ visible: true });
        modal.setProps({ visible: false });
        modal.find('.semi-modal-content').simulate('animationEnd');
        modal.update();
        expect(document.body.style.overflow).toBe('auto');
        expect(document.body.style.width).toBe('90%');
    });

    it('leaves custom containers and existing hidden overflow unchanged', () => {
        const custom = document.createElement('div');
        document.body.appendChild(custom);
        containers.push(custom);
        const modal = open({ getPopupContainer: () => custom });
        expect(document.body.style.overflow).toBe('auto');
        close(modal);
        expect(document.body.style.width).toBe('90%');
        document.body.style.overflow = 'hidden';
        const first = open();
        const second = open();
        close(first);
        close(second);
        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.width).toBe('90%');
    });
});
