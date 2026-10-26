import Image from '../image';

describe('Image default preview visibility', () => {
    it('opens a defaultVisible preview after the image loads', () => {
        const wrapper = mount(<Image src="image.png" preview={{ defaultVisible: true }} />);
        expect(wrapper.state('previewVisible')).toBe(true);
        wrapper.find('img').simulate('load');
        wrapper.update();
        expect(wrapper.find('PreviewInner').prop('visible')).toBe(true);
        wrapper.unmount();
    });
    it('keeps explicit controlled visibility ahead of defaultVisible', () => {
        const wrapper = mount(<Image src="image.png" preview={{ defaultVisible: true, visible: false }} />);
        expect(wrapper.state('previewVisible')).toBe(false);
        wrapper.unmount();
    });
});
