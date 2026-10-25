import React from 'react';
import { mount } from 'enzyme';
import BackTop from '../index';

describe('BackTop prop updates', () => {
    let wrapper;
    beforeEach(() => {
        rstest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => callback());
    });
    afterEach(() => { wrapper?.unmount(); window.requestAnimationFrame.mockRestore(); });

    it('uses scroll events from the new target', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        wrapper = mount(<BackTop target={() => first} visibilityHeight={100} />);
        expect(wrapper.exists('.semi-backtop')).toBe(false);
        wrapper.setProps({ target: () => second });
        second.scrollTop = 200;
        second.dispatchEvent(new Event('scroll'));
        wrapper.update();
        expect(wrapper.exists('.semi-backtop')).toBe(true);
    });

    it('updates visibility immediately when switching targets', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        first.scrollTop = 200;
        wrapper = mount(<BackTop target={() => first} visibilityHeight={100} />);
        expect(wrapper.exists('.semi-backtop')).toBe(true);
        wrapper.setProps({ target: () => second });
        wrapper.update();
        expect(wrapper.exists('.semi-backtop')).toBe(false);
    });

    it('updates visibility when visibilityHeight changes without scrolling', () => {
        const target = document.createElement('div');
        target.scrollTop = 200;
        wrapper = mount(<BackTop target={() => target} visibilityHeight={1000} />);
        expect(wrapper.exists('.semi-backtop')).toBe(false);
        wrapper.setProps({ visibilityHeight: 100 });
        wrapper.update();
        expect(wrapper.exists('.semi-backtop')).toBe(true);
        wrapper.setProps({ visibilityHeight: 1000 });
        wrapper.update();
        expect(wrapper.exists('.semi-backtop')).toBe(false);
    });

    it('does not stop an animation when a new target callback returns the same node', () => {
        const target = document.createElement('div');
        wrapper = mount(<BackTop target={() => target} />);
        const animation = { destroy: rstest.fn() };
        wrapper.instance().foundation.animation = animation;
        wrapper.setProps({ target: () => target });
        expect(animation.destroy).not.toHaveBeenCalled();
    });

    it('tracks a new DOM target returned by a stable getter after a parent update', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        function Consumer() {
            const [changed, setChanged] = React.useState(false);
            const current = React.useRef(first);
            current.current = changed ? second : first;
            const getTarget = React.useCallback(() => current.current, []);
            return <>
                <button className="switch-target" onClick={() => setChanged(true)}>Switch</button>
                <BackTop target={getTarget} visibilityHeight={100} />
            </>;
        }
        wrapper = mount(<Consumer />);
        wrapper.find('.switch-target').simulate('click');
        second.scrollTop = 200;
        second.dispatchEvent(new Event('scroll'));
        wrapper.update();
        expect(wrapper.exists('.semi-backtop')).toBe(true);
    });
});
