import React from 'react';
import { mount } from 'enzyme';
import HotKeys from '../index';

describe('HotKeys without hotKeys', () => {
    const press = () => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', bubbles: true }));

    [
        ['nothing', {}, ''],
        ['content', { content: ['Ctrl', 'K'] }, 'Ctrl+K'],
        ['render', { render: <span>custom</span> }, 'custom'],
    ].forEach(([name, props, text]) => {
        it(`renders ${name} and ignores key presses`, () => {
            const onHotKey = sinon.spy();
            const wrapper = mount(<HotKeys {...props} onHotKey={onHotKey} />);
            try {
                expect(wrapper.text()).toBe(text);
                press();
                expect(onHotKey.callCount).toBe(0);
            } finally {
                wrapper.unmount();
            }
        });
    });

    it('still rejects an invalid combination', () => {
        const error = rs.spyOn(console, 'error').mockImplementation(() => {});
        try {
            expect(() => mount(<HotKeys hotKeys={['Control']} />)).toThrow('HotKeys must have one common key');
        } finally {
            error.mockRestore();
        }
    });
});
