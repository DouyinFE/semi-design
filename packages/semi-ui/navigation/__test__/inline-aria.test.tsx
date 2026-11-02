import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import Nav from '../index';

afterEach(cleanup);

describe.each([true, false])('inline submenu semantics with motion=%s', subNavMotion => {
    it('keeps state on the menuitem and groups nested menuitems', () => {
        const { container } = render(
            <Nav subNavMotion={subNavMotion} defaultOpenKeys={['parent', 'nested']}>
                <Nav.Sub itemKey="parent" text="Parent">
                    <Nav.Sub itemKey="nested" text="Nested"><Nav.Item itemKey="child" text="Child" /></Nav.Sub>
                </Nav.Sub>
            </Nav>
        );
        container.querySelectorAll('.semi-navigation-item-sub').forEach(wrapper => {
            expect(wrapper.getAttribute('role')).toBe('none');
            expect(wrapper.hasAttribute('tabindex')).toBe(false);
            expect(wrapper.hasAttribute('aria-expanded')).toBe(false);
            expect(wrapper.hasAttribute('aria-disabled')).toBe(false);
        });
        container.querySelectorAll('.semi-navigation-sub-title').forEach(title => {
            expect(title.getAttribute('role')).toBe('menuitem');
            expect(title.getAttribute('aria-expanded')).toBe('true');
            expect(title.getAttribute('aria-disabled')).toBe('false');
        });
        expect(container.querySelectorAll('ul[role="group"]').length).toBe(2);
    });
});

it('preserves Enter toggling, item selection, and disabled submenu state', () => {
    const onSelect = sinon.spy();
    const { container, getByText } = render(
        <Nav subNavMotion={false} onSelect={onSelect}>
            <Nav.Sub itemKey="parent" text="Parent"><Nav.Item itemKey="child" text="Child" /></Nav.Sub>
            <Nav.Sub disabled itemKey="disabled" text="Disabled"><Nav.Item itemKey="hidden" text="Hidden" /></Nav.Sub>
        </Nav>
    );
    const title = container.querySelector('.semi-navigation-sub-title');
    const enter = { key: 'Enter', charCode: 13 };
    fireEvent.keyPress(title, enter);
    expect(title.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyPress(getByText('Child').closest('[role="menuitem"]'), enter);
    expect(onSelect.calledOnce).toBe(true);
    fireEvent.keyPress(title, enter);
    expect(title.getAttribute('aria-expanded')).toBe('false');
    const disabled = getByText('Disabled').closest('[role="menuitem"]');
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    fireEvent.keyPress(disabled, enter);
    expect(disabled.getAttribute('aria-expanded')).toBe('false');
});
