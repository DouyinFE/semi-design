import React from 'react';
import Carousel from '..';

describe('Carousel autoPlay updates', () => {
    let clock;
    let wrapper;
    beforeEach(() => { clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] }); });
    afterEach(() => { wrapper?.unmount(); clock.restore(); });
    const render = props => mount(<Carousel speed={20} {...props}><div>One</div><div>Two</div><div>Three</div></Carousel>);

    it('starts when autoPlay is enabled after mounting', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: false, onChange });
        wrapper.setProps({ autoPlay: { interval: 100, hoverToPause: false } });
        clock.tick(120);
        expect(onChange.callCount).toBe(1);
    });

    it('stops immediately when autoPlay is disabled', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: { interval: 100 }, onChange });
        clock.tick(30);
        wrapper.setProps({ autoPlay: false });
        clock.tick(1000);
        expect(onChange.callCount).toBe(0);
    });

    it('uses a new interval without waiting for the old one', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: { interval: 100 }, onChange });
        clock.tick(30);
        wrapper.setProps({ autoPlay: { interval: 300 } });
        clock.tick(319);
        expect(onChange.callCount).toBe(0);
        clock.tick(1);
        expect(onChange.callCount).toBe(1);
    });

    it('uses a new speed without waiting for the old interval', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: { interval: 100 }, onChange });
        clock.tick(30);
        wrapper.setProps({ speed: 200 });
        clock.tick(299);
        expect(onChange.callCount).toBe(0);
        clock.tick(1);
        expect(onChange.callCount).toBe(1);
    });

    it('does not restart for an equivalent autoPlay object', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: { interval: 100 }, onChange });
        clock.tick(30);
        wrapper.setProps({ autoPlay: { interval: 100 } });
        clock.tick(90);
        expect(onChange.callCount).toBe(1);
    });

    it('keeps hover pause when the interval changes', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: { interval: 1000, hoverToPause: true }, onChange });
        wrapper.instance().handleMouseEnter();
        wrapper.setProps({ autoPlay: { interval: 200, hoverToPause: true } });
        clock.tick(1000);
        expect(onChange.callCount).toBe(0);
        wrapper.instance().handleMouseLeave();
        clock.tick(220);
        expect(onChange.callCount).toBe(1);
    });

    it('does not start controlled autoplay on a prop update', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: false, activeIndex: 0, onChange });
        wrapper.setProps({ autoPlay: { interval: 100 } });
        clock.tick(1000);
        expect(onChange.callCount).toBe(0);
    });

    it('keeps an explicitly started controlled carousel running', () => {
        const onChange = sinon.spy();
        wrapper = render({ autoPlay: { interval: 100 }, activeIndex: 0, onChange });
        wrapper.instance().play();
        wrapper.setProps({ speed: 200 });
        clock.tick(120);
        expect(onChange.callCount).toBe(1);
    });
});
