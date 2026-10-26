import React from 'react';
import { mount } from 'enzyme';
import Avatar from '../index';

function scale(wrapper) {
    const style = wrapper.find('.semi-avatar-content').getDOMNode().style.transform;
    return Number(style.slice(6, -1));
}
describe('Avatar text measurement updates', () => {
    let originalWidth;
    beforeEach(() => {
        originalWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get() {
            if (this.classList.contains('semi-avatar')) return parseFloat(this.style.width) || 48;
            if (this.tagName === 'IMG') return 48;
            return 75;
        } });
    });
    afterEach(() => { Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalWidth); });
    it('remeasures after custom size changes', () => {
        const wrapper = mount(<Avatar size="64px" gap={4}>LONGTEXT</Avatar>);
        try {
            expect(scale(wrapper)).toBeCloseTo(56 / 75);
            wrapper.setProps({ size: '24px' });
            expect(scale(wrapper)).toBeCloseTo(16 / 75);
        } finally { wrapper.unmount(); }
    });
    it('remeasures after gap changes', () => {
        const wrapper = mount(<Avatar size="64px" gap={4}>LONGTEXT</Avatar>);
        try {
            wrapper.setProps({ gap: 10 });
            expect(scale(wrapper)).toBeCloseTo(44 / 75);
        } finally { wrapper.unmount(); }
    });
    it('measures the text after the image falls back', () => {
        const wrapper = mount(<Avatar src="missing" size="large" gap={3}>LONGTEXT</Avatar>);
        try {
            wrapper.find('img').simulate('error');
            expect(wrapper.find('img')).toHaveLength(0);
            expect(scale(wrapper)).toBeCloseTo(42 / 75);
        } finally { wrapper.unmount(); }
    });
    it('retains text-content updates and one-scale short text', () => {
        const wrapper = mount(<Avatar size="100px" gap={4}>LONGTEXT</Avatar>);
        try {
            expect(scale(wrapper)).toBe(1);
            wrapper.setProps({ size: '64px', children: 'CHANGED' });
            expect(scale(wrapper)).toBeCloseTo(56 / 75);
        } finally { wrapper.unmount(); }
    });
});
