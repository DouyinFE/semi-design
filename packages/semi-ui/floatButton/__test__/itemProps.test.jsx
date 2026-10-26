import React from 'react';
import { mount } from 'enzyme';
import FloatButtonGroup from '../floatButtonGroup';

describe('FloatButtonGroup item props', () => {
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
    const render = props => {
        wrapper = mount(<FloatButtonGroup {...props} />, { attachTo: container });
        return container.querySelector('.semi-floatButtonGroup-item');
    };
    const click = node => node.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    it.each([undefined, { count: 3 }])('passes className and style to an item with badge %s', badge => {
        const item = render({ items: [{ value: 'help', content: 'Help', badge, className: 'consumer-item', style: { color: 'red' } }] });
        expect(item.classList.contains('consumer-item')).toBe(true);
        expect(item.style.color).toBe('red');
        expect(container.querySelectorAll('.semi-floatButtonGroup-item').length).toBe(1);
    });
    it.each([undefined, { count: 3 }])('runs the item callback before its click bubbles with badge %s', badge => {
        const calls = [];
        let currentTarget;
        const item = render({
            items: [{ value: 'help', content: <span>Help</span>, badge, onClick: event => { currentTarget = event.currentTarget; calls.push('item'); } }],
            onClick: () => calls.push('group'),
        });
        click(item.querySelector('span'));
        expect(calls).toEqual(['item', 'group']);
        expect(currentTarget).toBe(item);
    });
    it.each([undefined, { count: 3 }])('does not activate a disabled item with badge %s', badge => {
        const calls = [];
        const item = render({ items: [{ value: 'help', content: <span>Help</span>, disabled: true, badge, onClick: () => calls.push('item') }], onClick: () => calls.push('group') });
        click(item.querySelector('span'));
        expect(calls).toEqual([]);
    });
    it('reads the latest item disabled state', () => {
        const calls = [];
        const onClick = () => calls.push('item');
        const item = render({ items: [{ value: 'help', content: 'Help', disabled: true, onClick }], onClick: () => calls.push('group') });
        click(item);
        wrapper.setProps({ items: [{ value: 'help', content: 'Help', disabled: false, onClick }] });
        click(item);
        expect(calls).toEqual(['item', 'group']);
    });
    it('does not run item actions when the whole group is disabled', () => {
        const calls = [];
        const item = render({ disabled: true, items: [{ value: 'help', content: 'Help', onClick: () => calls.push('item') }], onClick: () => calls.push('group') });
        click(item);
        expect(calls).toEqual([]);
    });
    it('respects stopPropagation in the item callback', () => {
        const calls = [];
        const item = render({ items: [{ value: 'help', content: 'Help', onClick: event => { calls.push('item'); event.stopPropagation(); } }], onClick: () => calls.push('group') });
        click(item);
        expect(calls).toEqual(['item']);
    });
    it('navigates to the item href before invoking its callback', () => {
        const previousHash = window.location.hash;
        const observed = [];
        try {
            const item = render({ items: [{ value: 'help', content: 'Help', href: '#float-group-destination', onClick: () => observed.push(window.location.hash) }] });
            click(item);
            expect(window.location.hash).toBe('#float-group-destination');
            expect(observed).toEqual(['#float-group-destination']);
        } finally {
            window.location.hash = previousHash;
        }
    });
    it('uses the item target for a new window and blocks disabled links', () => {
        const open = rs.spyOn(window, 'open').mockImplementation(() => null);
        try {
            const item = render({ items: [{ value: 'help', content: 'Help', href: 'https://semi.design/', target: '_blank' }] });
            click(item);
            expect(open).toHaveBeenCalledExactlyOnceWith('https://semi.design/', '_blank');
            wrapper.setProps({ items: [{ value: 'help', content: 'Help', href: 'https://semi.design/', target: '_blank', disabled: true }] });
            click(item);
            expect(open).toHaveBeenCalledTimes(1);
        } finally {
            open.mockRestore();
        }
    });
});
