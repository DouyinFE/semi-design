import React from 'react';
import ScrollItem from '../scrollItem';
import { mount } from 'enzyme';

const list = Array.from({ length: 15 }, (_, value) => ({ value }));

describe('ScrollList empty data', () => {
    let wrappers;

    beforeEach(() => {
        wrappers = [];
        rstest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
            return this.tagName === 'LI' ? 20 : 80;
        });
        rstest.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function () {
            return this.tagName === 'LI' && this.parentNode ? Array.from(this.parentNode.children).indexOf(this) * 20 : 0;
        });
    });

    afterEach(() => {
        wrappers.forEach(wrapper => wrapper.unmount());
        rstest.restoreAllMocks();
    });

    const render = props => {
        const wrapper = mount(<ScrollItem motion={false} {...props} />);
        wrappers.push(wrapper);
        return wrapper;
    };

    it('supports the default empty list', () => {
        expect(render({}).find('li').length).toBe(0);
    });

    ['wheel', 'normal'].forEach(mode => {
        it(`supports an empty ${mode} list and selected index updates`, () => {
            const wrapper = render({ list: [], mode });
            wrapper.setProps({ selectedIndex: 8 });
            expect(wrapper.find('li').length).toBe(0);
        });
    });

    [false, true].forEach(cycled => {
        it(`positions asynchronously loaded data with cycled=${cycled}`, () => {
            const wrapper = render({ list: [], selectedIndex: 8, cycled });
            wrapper.setProps({ list });
            const instance = wrapper.instance();
            expect(instance.wrapper.scrollTop).toBe(130);
            expect(instance.selectedNode.textContent).toBe('8');
            expect(instance.willSelectNode).toBe(instance.selectedNode);
        });
    });

    it('uses the selected index supplied with loaded data', () => {
        const wrapper = render({ list: [], cycled: true });
        wrapper.setProps({ list, selectedIndex: 8 });
        expect(wrapper.instance().wrapper.scrollTop).toBe(130);
    });

    it('positions data again after clearing and restoring it', () => {
        const wrapper = render({ list, selectedIndex: 2 });
        wrapper.setProps({ list: [], selectedIndex: 8 });
        wrapper.setProps({ list });
        expect(wrapper.instance().wrapper.scrollTop).toBe(130);
        expect(wrapper.instance().selectedNode.textContent).toBe('8');
    });
});
