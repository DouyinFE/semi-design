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
    it('only observes the images of its own preview group', () => {
        const targetA = document.createElement('div');
        const targetB = document.createElement('div');
        document.body.append(targetA, targetB);
        const a = mount(<Preview lazyLoad><Image src="a.png" /></Preview>, { attachTo: targetA });
        const b = mount(<Preview lazyLoad><Image src="b.png" /></Preview>, { attachTo: targetB });
        const imgA = a.find('img').getDOMNode();
        const imgB = b.find('img').getDOMNode();
        const [observerA, observerB] = observers;
        expect(observerA.options.root).not.toBe(observerB.options.root);
        expect(observerA.observe.mock.calls.map(([node]) => node)).toEqual([imgA]);
        expect(observerB.observe.mock.calls.map(([node]) => node)).toEqual([imgB]);
        a.unmount();
        expect(observerA.disconnect).toHaveBeenCalledTimes(1);
        expect(observerB.disconnect).not.toHaveBeenCalled();
        b.unmount();
        targetA.remove();
        targetB.remove();
    });
    it('keeps a replaced observer from touching the current one', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        let lastCallback;
        const Base = global.IntersectionObserver;
        global.IntersectionObserver = class extends Base {
            constructor(callback, options) {
                super(callback, options);
                lastCallback = callback;
            }
        };
        const wrapper = mount(<Preview lazyLoad lazyLoadMargin="0px"><Image src="image.png" /></Preview>, { attachTo: target });
        const staleCallback = lastCallback;
        wrapper.setProps({ lazyLoadMargin: '400px' });
        const img = document.createElement('img');
        img.dataset.src = 'late.png';
        staleCallback([{ target: img, isIntersecting: true }]);
        expect(observers[0].unobserve).toHaveBeenCalledWith(img);
        expect(observers[1].unobserve).not.toHaveBeenCalled();
        wrapper.unmount();
        target.remove();
    });
});
