import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Select from '../index';
import OverflowList from '../../overflowList';

describe('Select collapsed tag counts after removing an option', () => {
    const options = ['a', 'b', 'c', 'd'].map(value => ({ value, label: value }));
    let observers;
    let originalObserver;
    let widthDescriptor;
    let containerWidth;

    beforeEach(() => {
        observers = new Set();
        containerWidth = 170;
        originalObserver = global.ResizeObserver;
        global.ResizeObserver = class {
            targets = new Set();
            widths = new Map();
            constructor(callback) { this.callback = callback; observers.add(this); }
            observe(target) { if (!this.targets.has(target)) this.widths.delete(target); this.targets.add(target); }
            unobserve(target) { this.targets.delete(target); this.widths.delete(target); }
            disconnect() { this.targets.clear(); this.widths.clear(); }
        };
        widthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            configurable: true,
            get() {
                if (this.classList.contains('semi-overflow-list')) return containerWidth;
                if (this.classList.contains('semi-overflow-list-item') || this.classList.contains('semi-overflow-list-overflow')) return 70;
                return 0;
            },
        });
    });

    afterEach(() => {
        global.ResizeObserver = originalObserver;
        if (widthDescriptor) Object.defineProperty(HTMLElement.prototype, 'clientWidth', widthDescriptor);
        else delete HTMLElement.prototype.clientWidth;
    });

    const measure = wrapper => {
        // Deliver deterministic browser measurements without relying on JSDOM layout.
        for (let pass = 0; pass < 3; pass++) {
            act(() => {
                [...observers].forEach(observer => {
                    const changed = [...observer.targets].filter(target => observer.widths.get(target) !== target.clientWidth);
                    changed.forEach(target => observer.widths.set(target, target.clientWidth));
                    if (changed.length) observer.callback(changed.map(target => ({ target, contentRect: { width: target.clientWidth, height: 32 } })));
                });
            });
            wrapper.update();
        }
    };

    [false, true].forEach(controlled => {
        it(`keeps every selected option represented, controlled=${controlled}`, () => {
            const props = controlled ? { value: ['a', 'b', 'c', 'd'] } : { defaultValue: ['a', 'b', 'c', 'd'] };
            const wrapper = mount(<Select multiple ellipsisTrigger maxTagCount={3} optionList={options} {...props} />);
            try {
                measure(wrapper);
                const list = wrapper.find(OverflowList).instance();
                const plus = () => wrapper.find('.semi-select-content-wrapper-collapse-tag').hostNodes().map(tag => tag.text()).join('');
                expect(plus()).toBe('+2');
                if (controlled) wrapper.setProps({ value: ['b', 'c', 'd'] });
                else wrapper.find('.semi-tag-close').hostNodes().first().simulate('click', { nativeEvent: { stopImmediatePropagation() {} } });
                measure(wrapper);
                expect(wrapper.find(OverflowList).instance()).toBe(list);
                expect(wrapper.state('selections').size).toBe(3);
                expect(plus()).toBe('+1');
                expect(wrapper.find('.semi-tag-content').hostNodes().map(tag => tag.text())).toEqual(['b', 'c', '+1']);
                containerWidth = 400;
                measure(wrapper);
                expect(wrapper.find('.semi-select-content-wrapper-collapse-tag').exists()).toBe(false);
                expect(wrapper.find('.semi-tag-content').hostNodes().map(tag => tag.text())).toEqual(['b', 'c', 'd']);
            } finally {
                wrapper.unmount();
            }
        });
    });
});
