import React from 'react';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import Tooltip from '../index';

describe('Tooltip Escape propagation', () => {
    let wrapper;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        wrapper.unmount();
        container.remove();
    });

    it.each([
        [false, true, 1, 0],
        [true, false, 1, 0],
        [true, true, 0, 1],
    ])('visible=%s closeOnEsc=%s only consumes Escape when it can close', async (visible, closeOnEsc, expectedParent, expectedEscape) => {
        let parent = 0;
        let escape = 0;
        wrapper = mount(<div onKeyDown={() => parent++}><Tooltip trigger="custom" visible={visible} closeOnEsc={closeOnEsc} content="Hint" motion={false} onEscKeyDown={() => escape++}><button>Trigger</button></Tooltip></div>, { attachTo: container });
        await waitFor(() => expect(wrapper.find(Tooltip).state('visible')).toBe(visible));
        container.querySelector('button').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
        expect(parent).toBe(expectedParent);
        expect(escape).toBe(expectedEscape);
    });
});
