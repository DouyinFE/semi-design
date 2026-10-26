import PreviewInnerFoundation from '@douyinfe/semi-foundation/image/previewInnerFoundation';

describe('Image preview preload index', () => {
    let setSrc;
    beforeEach(() => {
        setSrc = jest.spyOn(Image.prototype, 'src', 'set');
    });
    afterEach(() => setSrc.mockRestore());

    const create = (props, index) => new PreviewInnerFoundation({
        getProps: () => ({ preLoad: true, preLoadGap: 2, ...props }),
        getStates: () => ({ currentIndex: index, imgSrc: ['/first.svg', '/second.svg', '/third.svg'] }),
    });

    it('preloads adjacent images using the current uncontrolled index', () => {
        create({}, 0).preloadGapImage();
        expect(setSrc).toHaveBeenCalledWith('/second.svg');
    });

    it('continues to preload next to a controlled index', () => {
        create({ currentIndex: 1 }, 1).preloadGapImage();
        expect(setSrc).toHaveBeenCalledWith('/third.svg');
    });
});
