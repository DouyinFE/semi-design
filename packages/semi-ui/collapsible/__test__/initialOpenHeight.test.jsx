import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mount } from 'enzyme';
import Collapsible from '../index';
import Nav from '../../navigation';

describe('Collapsible initial open height', () => {
    const parse = element => {
        const container = document.createElement('div');
        container.innerHTML = renderToStaticMarkup(element);
        return container;
    };

    [true, false].forEach(motion => {
        it(`keeps open SSR content visible with motion=${motion}`, () => {
            const node = parse(<Collapsible isOpen motion={motion}>content</Collapsible>);
            expect(node.firstChild.style.height).toBe('auto');
            expect(node.textContent).toBe('content');
        });
    });

    it('keeps default open navigation children visible in SSR', () => {
        const node = parse(<Nav defaultOpenKeys={['parent']}>
            <Nav.Sub itemKey="parent" text="parent"><Nav.Item itemKey="child" text="child" /></Nav.Sub>
        </Nav>);
        expect(node.querySelector('.semi-collapsible-wrapper').style.height).toBe('auto');
    });

    it('keeps initially closed content collapsed in SSR', () => {
        const node = parse(<Collapsible keepDOM>content</Collapsible>);
        expect(node.firstChild.style.height).toBe('0px');
    });

    it('uses measured height and preserves the first closing transition', () => {
        rstest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(80);
        rstest.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(80);
        const wrapper = mount(<Collapsible isOpen duration={250}>content</Collapsible>);
        try {
            expect(wrapper.find('.semi-collapsible-wrapper').prop('style').height).toBe(80);
            wrapper.setProps({ isOpen: false });
            const style = wrapper.find('.semi-collapsible-wrapper').prop('style');
            expect(style.height).toBe(0);
            expect(style.transitionDuration).toBe('250ms');
        } finally {
            wrapper.unmount();
            rstest.restoreAllMocks();
        }
    });
});
