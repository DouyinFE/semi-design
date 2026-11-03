import React from 'react';
import { mount } from 'enzyme';
import Avatar from '../index';
import Tooltip from '../../tooltip';

describe('Avatar focus inside Tooltip', () => {
    let container;
    let wrapper;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        wrapper?.unmount();
        wrapper = undefined;
        container.remove();
    });
    const mountTooltip = (props, children = 'A', tooltipProps = {}) => {
        wrapper = mount(<Tooltip content="Profile" motion={false} {...tooltipProps}><Avatar {...props}>{children}</Avatar></Tooltip>, { attachTo: container });
        return container.querySelector('.semi-avatar');
    };
    const press = (node, key = 'Enter') => node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

    it.each([{}, { src: '/avatar.png' }, { bottomSlot: { text: 'Online' } }])('keeps one working tab stop with props %s', props => {
        const clicks = [];
        const root = mountTooltip({ ...props, onClick: () => clicks.push('avatar') });
        expect(container.querySelectorAll('[tabindex="0"]').length).toBe(1);
        expect(root.tabIndex).toBe(0);
        expect(root.getAttribute('aria-describedby')).toBeTruthy();
        press(root);
        expect(clicks).toEqual(['avatar']);
    });
    it('keeps the existing inner focus target for a standalone Avatar', () => {
        const clicks = [];
        wrapper = mount(<Avatar onClick={() => clicks.push('avatar')}>A</Avatar>, { attachTo: container });
        const root = container.querySelector('.semi-avatar');
        const label = container.querySelector('.semi-avatar-label');
        expect(root.getAttribute('tabindex')).toBeNull();
        expect(label.tabIndex).toBe(0);
        press(label);
        expect(clicks).toEqual(['avatar']);
    });
    it('keeps custom children and their own click behavior', () => {
        const clicks = [];
        mountTooltip({ onClick: () => clicks.push('avatar') }, <button id="custom-child" onClick={() => clicks.push('child')}>Action</button>);
        const button = container.querySelector('#custom-child');
        expect(button.getAttribute('tabindex')).toBeNull();
        button.click();
        expect(clicks).toEqual(['child', 'avatar']);
    });
    it('keeps the custom slot as a separate keyboard target', () => {
        const clicks = [];
        const root = mountTooltip({ onClick: () => clicks.push('avatar'), bottomSlot: { render: () => <button id="slot-action" onClick={() => clicks.push('slot')}>Slot action</button> } });
        expect(container.querySelectorAll('[tabindex="0"],button').length).toBe(2);
        press(root);
        const button = container.querySelector('#slot-action');
        press(button);
        expect(clicks).toEqual(['avatar']);
        button.click();
        expect(clicks).toEqual(['avatar', 'slot', 'avatar']);
    });
    it('does not activate Avatar from a custom hover descendant key event', () => {
        const clicks = [];
        mountTooltip({ onClick: () => clicks.push('avatar'), hoverMask: <button id="hover-action">Action</button> });
        wrapper.find(Avatar).find('.semi-avatar').simulate('mouseenter');
        wrapper.update();
        const button = container.querySelector('#hover-action');
        expect(button).not.toBeNull();
        press(button);
        expect(clicks).toEqual([]);
    });
    it('retains the Tooltip Escape handler', () => {
        const calls = [];
        const root = mountTooltip({ onClick: () => calls.push('avatar') }, 'A', { closeOnEsc: true, onEscKeyDown: () => calls.push('escape') });
        press(root, 'Escape');
        expect(calls).toEqual(['escape']);
    });
    it('does not activate Avatar when an earlier handler prevented the key event', () => {
        const clicks = [];
        wrapper = mount(<div onKeyDownCapture={event => event.preventDefault()}><Tooltip content="Profile" motion={false}><Avatar onClick={() => clicks.push('avatar')}>A</Avatar></Tooltip></div>, { attachTo: container });
        press(container.querySelector('.semi-avatar'));
        expect(clicks).toEqual([]);
    });
});
