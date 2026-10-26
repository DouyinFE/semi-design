import Preview from '../preview';
import Image from '../image';

describe('Image Preview lazy loading updates', () => {
    let originalObserver;
    let observers;
    beforeEach(() => {
        originalObserver = global.IntersectionObserver;
        observers = [];
        global.IntersectionObserver = class {
            constructor(callback, options) {
                this.options = options;
                this.observe = rs.fn();
                this.unobserve = rs.fn();
                this.disconnect = rs.fn();
                observers.push(this);
            }
        };
    });
    afterEach(() => { global.IntersectionObserver = originalObserver; });

    it('observes unchanged children when lazy loading is enabled', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        const wrapper = mount(<Preview lazyLoad={false}><Image src="image.png" /></Preview>, { attachTo: target });
        wrapper.setProps({ lazyLoad: true });
        expect(observers).toHaveLength(1);
        expect(observers[0].observe).toHaveBeenCalledWith(wrapper.find('img').getDOMNode());
        wrapper.unmount();
        target.remove();
    });
    it('recreates the observer with an updated preload margin', () => {
        const wrapper = mount(<Preview lazyLoad lazyLoadMargin="0px"><Image src="image.png" /></Preview>);
        wrapper.setProps({ lazyLoadMargin: '400px' });
        expect(observers).toHaveLength(2);
        expect(observers[0].disconnect).toHaveBeenCalledTimes(1);
        expect(observers[1].options.rootMargin).toBe('400px');
        wrapper.unmount();
    });
});
