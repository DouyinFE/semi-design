import ResizeObserverComponent from '../index';

describe('ResizeObserver observeParent', () => {
    it('observes an SVG parent as well as its child', () => {
        const wrapper = mount(<svg><g><ResizeObserverComponent observeParent><rect /></ResizeObserverComponent></g></svg>);
        const component = wrapper.find(ResizeObserverComponent).instance();
        const observe = sinon.spy(component.observer, 'observe');
        component.observeElement(true);
        expect(observe.args.map(args => args[0].tagName)).toEqual(['rect', 'g']);
        wrapper.unmount();
    });
    it('keeps observing an HTML parent', () => {
        const wrapper = mount(<section><ResizeObserverComponent observeParent><div /></ResizeObserverComponent></section>);
        const component = wrapper.find(ResizeObserverComponent).instance();
        const observe = sinon.spy(component.observer, 'observe');
        component.observeElement(true);
        expect(observe.args.map(args => args[0].tagName)).toEqual(['DIV', 'SECTION']);
        wrapper.unmount();
    });
    it('does not observe the parent when observeParent is false', () => {
        const wrapper = mount(<svg><g><ResizeObserverComponent><rect /></ResizeObserverComponent></g></svg>);
        const component = wrapper.find(ResizeObserverComponent).instance();
        const observe = sinon.spy(component.observer, 'observe');
        component.observeElement(true);
        expect(observe.args.map(args => args[0].tagName)).toEqual(['rect']);
        wrapper.unmount();
    });
});
