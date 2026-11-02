import React from 'react';
import { createPortal } from 'react-dom';
import { mount } from 'enzyme';
import List from '../index';

describe('List renderItem ReactNode results', () => {
    it.each([
        [null, ''],
        [undefined, ''],
        [false, ''],
        ['内容', '内容'],
        [42, '42'],
    ])('renders %s without treating it as an element', (value, expected) => {
        const wrapper = mount(<List dataSource={[1]} renderItem={() => value} />);
        try {
            expect(wrapper.find('.semi-list-items').text()).toBe(expected);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps remaining items when one renderer returns null', () => {
        const wrapper = mount(<List dataSource={[1, 2]} renderItem={value => value === 1 ? null : <List.Item key="visible">Visible</List.Item>} />);
        try {
            expect(wrapper.find('li').text()).toBe('Visible');
        } finally {
            wrapper.unmount();
        }
    });

    it('preserves normal item content and click handling', () => {
        const clicks = [];
        const wrapper = mount(<List dataSource={[1, 2]} renderItem={value => <List.Item key={'item-' + value}>{value}</List.Item>}
            onClick={() => clicks.push('clicked')} />);
        try {
            expect(wrapper.find('li').map(node => node.text())).toEqual(['1', '2']);
            wrapper.find('li').first().simulate('click');
            expect(clicks).toEqual(['clicked']);
        } finally {
            wrapper.unmount();
        }
    });

    it('renders portal content without cloning the portal as an element', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        let wrapper;
        try {
            wrapper = mount(<List dataSource={[1]} renderItem={() => createPortal(<span>Portal content</span>, target)} />);
            expect(target.textContent).toBe('Portal content');
        } finally {
            if (wrapper) wrapper.unmount();
            target.remove();
        }
    });
});
