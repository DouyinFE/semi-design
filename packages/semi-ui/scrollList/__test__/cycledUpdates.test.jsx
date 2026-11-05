import React, { useState } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { stub, useFakeTimers } from 'sinon';
import ScrollList from '../index';
import ScrollItem from '../scrollItem';

const makeList = size => Array.from({ length: size }, (_, value) => ({ value, text: String(value), disabled: value === 2 }));
const outerSelector = '.semi-scrolllist-list-outer';
const nodes = wrapper => Array.from(wrapper.find('ul').getDOMNode().children);

function Example({ cycled = true, controlled = true, onSelect = () => {} }) {
    const [list, setList] = useState(makeList(12));
    const [selected, setSelected] = useState(0);
    return <>
        <button id="grow" onClick={() => setList(makeList(16))}>Grow</button>
        <button id="growAndSelect5" onClick={() => { setSelected(5); setList(makeList(16)); }}>Grow and select 5</button>
        <button id="select9" onClick={() => setSelected(9)}>Select 9</button>
        <button id="shrink" onClick={() => { setSelected(0); setList(makeList(8)); }}>Shrink</button>
        <output>{selected}</output>
        <ScrollList>
            <ScrollItem cycled={cycled} list={list} selectedIndex={controlled ? selected : undefined} motion={false}
                onSelect={data => { setSelected(data.index); onSelect(data); }} />
        </ScrollList>
    </>;
}

describe('ScrollItem list updates after cycling', () => {
    let clock;
    const restores = [];
    const rowHeight = 36;
    const wrapperHeight = 247;
    const selectedTop = (wrapperHeight - rowHeight) / 2;
    const itemTop = element => {
        const wrapper = element.closest('.semi-scrolllist-item-wheel').querySelector(outerSelector);
        const padding = wrapper.classList.contains('semi-scrolllist-list-outer-nocycle') ? selectedTop : 0;
        return Array.from(element.parentElement.children).indexOf(element) * rowHeight + padding;
    };

    beforeEach(() => {
        clock = useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
        const rect = HTMLElement.prototype.getBoundingClientRect;
        restores.push(stub(HTMLElement.prototype, 'offsetHeight').get(function () {
            return this.matches(outerSelector) ? wrapperHeight : this.tagName === 'LI' ? rowHeight : 0;
        }));
        restores.push(stub(HTMLElement.prototype, 'offsetTop').get(function () {
            return this.tagName === 'LI' ? itemTop(this) : 0;
        }));
        restores.push(stub(HTMLElement.prototype, 'getBoundingClientRect').callsFake(function () {
            if (this.matches(outerSelector)) {
                return { top: 0, bottom: wrapperHeight, height: wrapperHeight };
            }
            if (this.classList.contains('semi-scrolllist-selector')) {
                return { top: selectedTop, height: rowHeight };
            }
            if (this.tagName === 'LI' && this.closest('.semi-scrolllist-item-wheel')) {
                const outer = this.closest('.semi-scrolllist-item-wheel').querySelector(outerSelector);
                const top = itemTop(this) - outer.scrollTop;
                return { top, bottom: top + rowHeight, height: rowHeight };
            }
            return rect.call(this);
        }));
    });

    afterEach(() => {
        restores.splice(0).reverse().forEach(method => method.restore());
        clock.restore();
    });

    const scroll = (wrapper, top) => {
        wrapper.find(outerSelector).getDOMNode().scrollTop = top;
        expect(nodes(wrapper).length).toBe(48);
        wrapper.find(outerSelector).simulate('scroll');
        act(() => { clock.tick(100); });
        wrapper.update();
    };

    const centerText = wrapper => {
        return nodes(wrapper).reduce((nearest, node) => Math.abs(node.getBoundingClientRect().top - selectedTop) <
            Math.abs(nearest.getBoundingClientRect().top - selectedTop) ? node : nearest).textContent;
    };

    it.each([0, 1480])('keeps React node order when cycling from scrollTop %s', top => {
        const wrapper = mount(<Example />);
        try {
            const before = nodes(wrapper);
            scroll(wrapper, top);
            nodes(wrapper).forEach((item, index) => {
                expect(item).toBe(before[index]);
            });
        } finally {
            wrapper.unmount();
        }
    });

    it.each([0, 1480])('keeps new options and click values in order after cycling from %s', top => {
        const selections = [];
        const wrapper = mount(<Example onSelect={data => selections.push(data.value)} />);
        try {
            scroll(wrapper, top);
            wrapper.find('#grow').simulate('click');
            expect(nodes(wrapper).map(item => item.textContent)).toEqual(
                Array.from({ length: nodes(wrapper).length }, (_, index) => String(index % 16))
            );
            const item = nodes(wrapper)[5];
            const expected = Number(item.textContent);
            wrapper.find('ul').simulate('click', { target: item, nativeEvent: new MouseEvent('click') });
            act(() => { clock.tick(100); });
            expect(selections[selections.length - 1]).toBe(expected);
        } finally {
            wrapper.unmount();
        }
    });

    it.each([false, true])('uses the current selectedIndex after shortening a list, cycled=%s', cycled => {
        const wrapper = mount(<Example cycled={cycled} />);
        try {
            wrapper.find('#select9').simulate('click');
            wrapper.find('#shrink').simulate('click');
            act(() => { clock.tick(100); });
            expect(wrapper.find('output').text()).toBe('0');
            expect(centerText(wrapper)).toBe('0');
        } finally {
            wrapper.unmount();
        }
    });

    it('does not select a disabled option after cycling and growing', () => {
        const selections = [];
        const wrapper = mount(<Example onSelect={data => selections.push(data.value)} />);
        try {
            scroll(wrapper, 1480);
            wrapper.find('#grow').simulate('click');
            selections.length = 0;
            const disabled = wrapper.find('ul').getDOMNode().querySelector('.semi-scrolllist-item-disabled');
            wrapper.find('ul').simulate('click', { target: disabled, nativeEvent: new MouseEvent('click') });
            act(() => { clock.tick(100); });
            expect(selections).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });

    it('discards an old pending scroll selection when shortening the list', () => {
        const wrapper = mount(<Example />);
        try {
            wrapper.find('#select9').simulate('click');
            wrapper.find(outerSelector).simulate('scroll');
            wrapper.find(outerSelector).simulate('scroll');
            wrapper.find('#shrink').simulate('click');
            act(() => { clock.tick(100); });
            expect(wrapper.find('output').text()).toBe('0');
            expect(centerText(wrapper)).toBe('0');
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps an existing uncontrolled selection when growing the list', () => {
        const wrapper = mount(<Example controlled={false} />);
        try {
            const item = nodes(wrapper)[33];
            wrapper.find('ul').simulate('click', { target: item, nativeEvent: new MouseEvent('click') });
            act(() => { clock.tick(100); });
            wrapper.find('#grow').simulate('click');
            wrapper.find(outerSelector).simulate('scroll');
            act(() => { clock.tick(100); });
            expect(wrapper.find('output').text()).toBe('9');
            expect(centerText(wrapper)).toBe('9');
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps the current controlled selection when growing from the middle copy', () => {
        const wrapper = mount(<Example />);
        try {
            expect(centerText(wrapper)).toBe('0');
            wrapper.find('#grow').simulate('click');
            wrapper.find(outerSelector).simulate('scroll');
            act(() => { clock.tick(100); });
            expect(wrapper.find('output').text()).toBe('0');
            expect(centerText(wrapper)).toBe('0');
        } finally {
            wrapper.unmount();
        }
    });

    it('uses an explicitly changed selectedIndex when growing the list', () => {
        const wrapper = mount(<Example />);
        try {
            wrapper.find('#growAndSelect5').simulate('click');
            act(() => { clock.tick(100); });
            expect(wrapper.find('output').text()).toBe('5');
            expect(centerText(wrapper)).toBe('5');
        } finally {
            wrapper.unmount();
        }
    });
});
