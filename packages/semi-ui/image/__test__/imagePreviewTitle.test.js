import { Image, ImagePreview } from '../../index';

describe('Image preview titles', () => {
    it('renders the standalone Image preview title', () => {
        const image = mount(<Image src="first.png" preview={{ visible: true, previewTitle: <strong>Image title</strong> }} />);
        try {
            image.find('img.semi-image-img').simulate('load');
            expect(image.find('.semi-image-preview-header-title').text()).toBe('Image title');
        } finally {
            image.setProps({ preview: { visible: false } });
            image.unmount();
        }
    });

    it('renders and updates the ImagePreview title for src images', () => {
        const preview = mount(<ImagePreview visible src={['first.png']} previewTitle="Preview title" />);
        try {
            expect(preview.find('.semi-image-preview-header-title').text()).toBe('Preview title');
            preview.setProps({ previewTitle: <strong>Updated title</strong> });
            expect(preview.find('.semi-image-preview-header-title').text()).toBe('Updated title');
        } finally {
            preview.setProps({ visible: false });
            preview.unmount();
        }
    });

    it('keeps child image titles ahead of the group title, including zero', () => {
        const preview = mount(<ImagePreview visible lazyLoad={false} previewTitle="Group title">
            <Image src="first.png" preview={{ previewTitle: 0 }} />
            <Image src="second.png" />
        </ImagePreview>);
        try {
            expect(preview.find('.semi-image-preview-header-title').text()).toBe('0');
            preview.setProps({ currentIndex: 1 });
            expect(preview.find('.semi-image-preview-header-title').text()).toBe('Group title');
        } finally {
            preview.setProps({ visible: false });
            preview.unmount();
        }
    });

    it('passes the preview title to renderHeader', () => {
        const renderHeader = sinon.spy(title => <span>{title}</span>);
        const preview = mount(<ImagePreview visible src={['first.png']} previewTitle="Custom title" renderHeader={renderHeader} />);
        try {
            expect(preview.find('.semi-image-preview-header-title').text()).toBe('Custom title');
            expect(renderHeader.lastCall.args[0]).toBe('Custom title');
        } finally {
            preview.setProps({ visible: false });
            preview.unmount();
        }
    });
});
