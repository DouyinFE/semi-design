import { Image } from '../../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import PreviewInner from '../previewInner';


describe('Image', () => {
    [
        ['preview', true, false],
        ['outer', false, true],
        ['outer takes precedence', true, true],
    ].forEach(([name, nested, outer]) => {
        it(`uses ${name} download name`, () => {
            const previewName = sinon.spy(() => 'preview.png');
            const outerName = sinon.spy(() => 'outer.png');
            const image = mount(<Image
                src="image.png"
                preview={{ visible: true, ...(nested ? { setDownloadName: previewName } : {}) }}
                {...(outer ? { setDownloadName: outerName } : {})}
            />);
            image.find(`img.${BASE_CLASS_PREFIX}-image-img`).simulate('load');
            image.find(PreviewInner).instance().handleDownload();
            expect((outer ? outerName : previewName).calledOnceWithExactly('image.png')).toBe(true);
            if (nested && outer) {
                expect(previewName.called).toBe(false);
            }
            image.setProps({ preview: { visible: false } });
            image.unmount();
        });
    });

    it('custom imgCls & imgStyle', () => {
        let spyOnClick = sinon.spy(() => { });
        const imageComponent = (<Image 
            imgCls="custom-img-cls"
            imgStyle={{ maxWidth: 300}}
            src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg"
        />);
        const image = mount(imageComponent, { attachTo: document.getElementById('container') });
        expect(image.find(`.${BASE_CLASS_PREFIX}-image-img`).at(0).hasClass('custom-img-cls')).toBe(true);
        expect(image.find(`.${BASE_CLASS_PREFIX}-image-img`).at(0).getDOMNode().style.maxWidth).toBe('300px');
    });
})
