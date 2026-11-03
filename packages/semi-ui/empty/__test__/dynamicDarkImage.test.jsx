import Empty from '../index';

describe('Empty dynamic darkModeImage', () => {
    let OriginalObserver;
    let observers;
    const image = <div data-image="light">Light</div>;
    const darkModeImage = <div data-image="dark">Dark</div>;
    beforeEach(() => {
        OriginalObserver = global.MutationObserver;
        observers = [];
        global.MutationObserver = class {
            constructor(callback) {
                this.callback = callback;
                this.observe = sinon.spy();
                this.disconnect = sinon.spy();
                observers.push(this);
            }
        };
        document.body.removeAttribute('theme-mode');
    });
    afterEach(() => {
        global.MutationObserver = OriginalObserver;
        document.body.removeAttribute('theme-mode');
    });
    it('observes theme changes when darkModeImage is added after mount', () => {
        const wrapper = mount(<Empty image={image} />);
        wrapper.setProps({ darkModeImage });
        expect(observers.length).toBe(1);
        document.body.setAttribute('theme-mode', 'dark');
        observers[0].callback([{ type: 'attributes', attributeName: 'theme-mode' }]);
        wrapper.update();
        expect(wrapper.find('[data-image="dark"]').exists()).toBe(true);
        wrapper.unmount();
        expect(observers[0].disconnect.calledOnce).toBe(true);
    });
    it('reads the current theme when darkModeImage is added', () => {
        document.body.setAttribute('theme-mode', 'dark');
        const wrapper = mount(<Empty image={image} />);
        wrapper.setProps({ darkModeImage });
        wrapper.update();
        expect(wrapper.find('[data-image="dark"]').exists()).toBe(true);
        wrapper.unmount();
    });
    it('reuses the observer when darkModeImage is removed and added again', () => {
        const wrapper = mount(<Empty image={image} darkModeImage={darkModeImage} />);
        wrapper.setProps({ darkModeImage: undefined });
        wrapper.setProps({ darkModeImage });
        expect(observers.length).toBe(1);
        expect(observers[0].observe.calledOnce).toBe(true);
        wrapper.unmount();
        expect(observers[0].disconnect.calledOnce).toBe(true);
    });
    it('subscribes again after the StrictMode unmount and remount cycle', () => {
        const wrapper = mount(<Empty image={image} darkModeImage={darkModeImage} />);
        const component = wrapper.instance();
        component.componentWillUnmount();
        component.componentDidMount();
        expect(observers.length).toBe(2);
        expect(observers[0].disconnect.calledOnce).toBe(true);
        expect(observers[1].observe.calledOnce).toBe(true);
        wrapper.unmount();
        expect(observers[1].disconnect.calledOnce).toBe(true);
    });
});
