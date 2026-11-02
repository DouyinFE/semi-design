import Modal from '../Modal';
import SideSheet from '../../sideSheet';

describe.each([false, true])('Modal and SideSheet with motion=%s', motion => {
    it.each([false, true])('restores body styles when the Modal closes first=%s', modalFirst => {
        const originalStyle = document.body.style.cssText;
        document.body.style.overflow = 'auto';
        document.body.style.width = '90%';
        const containers = [document.createElement('div'), document.createElement('div')];
        containers.forEach(container => document.body.appendChild(container));
        const sheet = mount(<SideSheet visible motion={motion}>Sheet</SideSheet>, { attachTo: containers[0] });
        const modal = mount(<Modal visible motion={motion} footer={null}>Modal</Modal>, { attachTo: containers[1] });
        const close = (wrapper, selector) => {
            wrapper.setProps({ visible: false });
            if (motion) {
                wrapper.find(selector).simulate('animationEnd');
            }
            wrapper.update();
        };
        try {
            expect(document.body.style.overflow).toBe('hidden');
            const actions = [
                () => close(sheet, '.semi-sidesheet-inner'),
                () => close(modal, '.semi-modal-content'),
            ];
            if (modalFirst) { actions.reverse(); }
            actions.forEach(action => action());
            expect(document.querySelector('.semi-modal-content')).toBeNull();
            expect(document.querySelector('.semi-sidesheet-inner')).toBeNull();
            expect(document.body.style.overflow).toBe('auto');
            expect(document.body.style.width).toBe('90%');
            sheet.unmount();
            modal.unmount();
            expect(document.body.style.overflow).toBe('auto');
            expect(document.body.style.width).toBe('90%');
        } finally {
            if (sheet.length) { sheet.unmount(); }
            if (modal.length) { modal.unmount(); }
            containers.forEach(container => container.remove());
            document.body.style.cssText = originalStyle;
        }
    });
});
