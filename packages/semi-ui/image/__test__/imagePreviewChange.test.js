import { Image, ImagePreview } from '../../index';

const src = ['first.png', 'second.png'];

describe('ImagePreview onChange', () => {
    it('notifies once when opening an image and switching in either direction', () => {
        const onChange = sinon.spy();
        const onNext = sinon.spy();
        const onPrev = sinon.spy();
        const preview = mount(<ImagePreview lazyLoad={false} onChange={onChange} onNext={onNext} onPrev={onPrev}>
            {src.map(item => <Image key={item} src={item} />)}
        </ImagePreview>);
        try {
            preview.find('.semi-image-img').at(0).simulate('click');
            expect(onChange.args).toEqual([[0]]);
            onChange.resetHistory();
            preview.find('.semi-image-preview-next').simulate('click');
            expect(onChange.args).toEqual([[1]]);
            expect(onNext.args).toEqual([[1]]);
            preview.find('.semi-image-preview-prev').simulate('click');
            expect(onChange.args).toEqual([[1], [0]]);
            expect(onPrev.args).toEqual([[0]]);
        } finally {
            preview.setProps({ visible: false });
            preview.unmount();
        }
    });

    it('notifies once without changing a controlled currentIndex', () => {
        const onChange = sinon.spy();
        const preview = mount(<ImagePreview src={src} visible currentIndex={0} onChange={onChange} />);
        try {
            preview.find('.semi-image-preview-next').simulate('click');
            expect(onChange.args).toEqual([[1]]);
            expect(preview.state('currentIndex')).toBe(0);
            preview.setProps({ currentIndex: 1 });
            preview.find('.semi-image-preview-prev').simulate('click');
            expect(onChange.args).toEqual([[1], [0]]);
            expect(preview.state('currentIndex')).toBe(1);
        } finally {
            preview.setProps({ visible: false });
            preview.unmount();
        }
    });
});
