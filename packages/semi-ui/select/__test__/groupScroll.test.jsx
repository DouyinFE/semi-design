import React from 'react';
import { mount } from 'enzyme';
import Select from '../index';

describe('Select keyboard scrolling', () => {
    it.each([false, true])('scrolls options past group headings with custom rendering %s', custom => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<Select motion={false} defaultActiveFirstOption={false}
            {...custom ? { renderOptionItem: ({ className, label }) => <div className={className}>{label}</div> } : {}}>
            <Select.OptGroup label="Group 1"><Select.Option value="a">Alpha</Select.Option><Select.Option value="b">Beta</Select.Option></Select.OptGroup>
            <Select.OptGroup label="Group 2"><Select.Option value="c">Charlie</Select.Option><Select.Option value="d">Delta</Select.Option></Select.OptGroup>
        </Select>, { attachTo: container });
        try {
            wrapper.find('.semi-select').simulate('click');
            const list = document.querySelector('.semi-select-option-list');
            const options = list.querySelectorAll(custom ? '.semi-select-option-custom' : '.semi-select-option');
            Object.defineProperty(list, 'clientHeight', { configurable: true, value: 100 });
            Object.defineProperty(list, 'offsetTop', { configurable: true, value: 0 });
            options.forEach((option, index) => {
                Object.defineProperty(option, 'offsetTop', { configurable: true, value: index * 40 + (index < 2 ? 20 : 40) });
                Object.defineProperty(option, 'clientHeight', { configurable: true, value: 40 });
            });
            for (let i = 0; i < 3; i++) wrapper.find('.semi-select').simulate('keydown', { keyCode: 40 });
            expect(wrapper.state('focusIndex')).toBe(2);
            expect(list.scrollTop).toBe(90);
        } finally {
            wrapper.unmount();
            container.remove();
        }
    });

    it('keeps scrolling ungrouped options by their option index', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<Select motion={false} defaultActiveFirstOption={false} optionList={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />, { attachTo: container });
        try {
            wrapper.find('.semi-select').simulate('click');
            const list = document.querySelector('.semi-select-option-list');
            Object.defineProperty(list, 'clientHeight', { configurable: true, value: 100 });
            Object.defineProperty(list, 'offsetTop', { configurable: true, value: 0 });
            list.querySelectorAll('.semi-select-option').forEach((option, index) => {
                Object.defineProperty(option, 'offsetTop', { configurable: true, value: index * 40 });
                Object.defineProperty(option, 'clientHeight', { configurable: true, value: 40 });
            });
            for (let i = 0; i < 2; i++) wrapper.find('.semi-select').simulate('keydown', { keyCode: 40 });
            expect(list.scrollTop).toBe(10);
        } finally {
            wrapper.unmount();
            container.remove();
        }
    });
});
