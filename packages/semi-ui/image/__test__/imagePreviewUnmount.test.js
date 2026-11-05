import { ImagePreview } from '../../index';
import PreviewInner from '../previewInner';

describe('ImagePreview unmount cleanup', () => {
    it('restores body styles and removes the keydown listener when unmounted while visible', () => {
        const overflow = document.body.style.overflow;
        const width = document.body.style.width;
        document.body.style.overflow = 'auto';
        document.body.style.width = '90%';
        const remove = rs.spyOn(window, 'removeEventListener');
        const preview = mount(<ImagePreview src={['first.png']} visible />);
        const listener = preview.find(PreviewInner).instance().handleKeyDown;
        try {
            expect(document.body.style.overflow).toBe('hidden');
            preview.unmount();
            expect(document.body.style.overflow).toBe('auto');
            expect(document.body.style.width).toBe('90%');
            expect(remove).toHaveBeenCalledWith('keydown', listener);
        } finally {
            remove.mockRestore();
            document.body.style.overflow = overflow;
            document.body.style.width = width;
        }
    });

    it('does not change body styles when unmounting a preview that was never opened', () => {
        const overflow = document.body.style.overflow;
        const width = document.body.style.width;
        document.body.style.overflow = 'hidden';
        document.body.style.width = '80%';
        try {
            const preview = mount(<ImagePreview src={['first.png']} />);
            preview.unmount();
            expect(document.body.style.overflow).toBe('hidden');
            expect(document.body.style.width).toBe('80%');
        } finally {
            document.body.style.overflow = overflow;
            document.body.style.width = width;
        }
    });

    it('does not restore body styles again after the preview has already closed', () => {
        const overflow = document.body.style.overflow;
        const width = document.body.style.width;
        const preview = mount(<ImagePreview src={['first.png']} visible />);
        try {
            preview.setProps({ visible: false });
            document.body.style.overflow = 'hidden';
            document.body.style.width = '75%';
            preview.unmount();
            expect(document.body.style.overflow).toBe('hidden');
            expect(document.body.style.width).toBe('75%');
        } finally {
            document.body.style.overflow = overflow;
            document.body.style.width = width;
        }
    });
});
