import React from 'react';
import { renderToString } from 'react-dom/server';
import { mount } from 'enzyme';
import Radio from '../index';

function nativeChecks(element) {
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    return [...container.querySelectorAll('input')].map(input => input.checked);
}
describe('Radio initial selection', () => {
    [
        [0, 1],
        [false, true],
        ['first', 'second'],
    ].forEach(([value, other]) => {
        it('renders the controlled group selection in server HTML for ' + value, () => {
            expect(nativeChecks(<Radio.Group value={value} defaultValue={other} name="server-group">
                <Radio value={value}>selected</Radio><Radio value={other}>other</Radio>
            </Radio.Group>)).toEqual([true, false]);
        });
    });
    it('renders a defaultValue of zero in server HTML', () => {
        expect(nativeChecks(<Radio.Group defaultValue={0} name="default-group"><Radio value={0}>zero</Radio><Radio value={1}>one</Radio></Radio.Group>)).toEqual([true, false]);
    });
    it('renders a controlled checked Radio in server HTML', () => {
        expect(nativeChecks(<Radio checked>selected</Radio>)).toEqual([true]);
    });
    it('keeps controlled false ahead of defaultChecked in server HTML', () => {
        expect(nativeChecks(<Radio checked={false} defaultChecked>unselected</Radio>)).toEqual([false]);
    });
    it('keeps controlled false ahead of defaultChecked after mounting', () => {
        const wrapper = mount(<Radio checked={false} defaultChecked>unselected</Radio>);
        try { expect(wrapper.find('input').getDOMNode().checked).toBe(false); }
        finally { wrapper.unmount(); }
    });
});
