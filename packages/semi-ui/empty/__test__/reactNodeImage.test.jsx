import React from 'react';
import { mount } from 'enzyme';
import Empty from '../index';

describe('Empty ReactNode images', () => {
    let wrapper;
    let originalMode;
    beforeEach(() => { originalMode = document.body.getAttribute('theme-mode'); });
    afterEach(() => {
        wrapper?.unmount();
        wrapper = undefined;
        if (originalMode === null) document.body.removeAttribute('theme-mode');
        else document.body.setAttribute('theme-mode', originalMode);
    });

    it.each([[42, '42'], [0, '0'], [true, '']])('renders primitive ReactNode %s without treating it as an SVG object', (image, text) => {
        wrapper = mount(<Empty image={image} />);
        expect(wrapper.find('.semi-empty-image').text()).toBe(text);
    });

    it('keeps SVG sprite references', () => {
        wrapper = mount(<Empty image={{ id: 'empty-sprite' }} />);
        expect(wrapper.find('use').prop('xlinkHref')).toBe('#empty-sprite');
    });

    it('keeps React elements', () => {
        wrapper = mount(<Empty image={<span>Custom image</span>} />);
        expect(wrapper.find('.semi-empty-image').text()).toBe('Custom image');
    });

    it('keeps image URLs', () => {
        wrapper = mount(<Empty image="https://example.com/empty.svg" />);
        expect(wrapper.find('img').prop('src')).toBe('https://example.com/empty.svg');
    });

    it('renders a numeric darkModeImage when dark mode is active', () => {
        document.body.setAttribute('theme-mode', 'dark');
        wrapper = mount(<Empty image={<span>Light image</span>} darkModeImage={42} />);
        expect(wrapper.find('.semi-empty-image').text()).toBe('42');
    });
});
