import React from 'react';
import { mount } from 'enzyme';
import JsonViewer from '../index';

rs.mock('@douyinfe/semi-json-viewer-core', () => ({
    JsonViewer: class {
        constructor(host) {
            this.host = host;
            this.listeners = new Map();
            this.emitter = {
                on: (name, callback) => { this.listeners.set(name, callback); },
                emit: (name, event) => { this.listeners.get(name)?.(event); },
            };
            this.emitter.on('renderHoverNode', event => { this.tooltip.appendChild(event.el); });
        }
        layout() {
            this.token = document.createElement('span');
            this.token.className = 'source-token';
            this.token.textContent = 'hello';
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'hover-result';
            this.token.addEventListener('mousemove', () => { this.emitter.emit('hoverNode', { value: 'hello', target: this.token }); });
            this.host.append(this.token, this.tooltip);
        }
        dispose() { this.listeners.clear(); this.host.textContent = ''; }
    }
}));
describe('JsonViewer public hover renderer', () => {
    it('calls renderTooltip with the hovered token and displays its element', () => {
        const result = document.createElement('b');
        result.textContent = 'custom tooltip';
        const renderTooltip = rs.fn(() => result);
        const wrapper = mount(<JsonViewer value='{"message":"hello"}' renderTooltip={renderTooltip} />);
        try {
            const token = wrapper.find('.semi-json-viewer').hostNodes().getDOMNode().querySelector('.source-token');
            token.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            expect(renderTooltip).toHaveBeenCalledWith('hello', token);
            expect(wrapper.find('.semi-json-viewer').hostNodes().getDOMNode().querySelector('.hover-result').firstChild).toBe(result);
        } finally { wrapper.unmount(); }
    });
    it('does nothing when renderTooltip is omitted', () => {
        const wrapper = mount(<JsonViewer value='{"message":"hello"}' />);
        try {
            const token = wrapper.find('.semi-json-viewer').hostNodes().getDOMNode().querySelector('.source-token');
            expect(() => token.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))).not.toThrow();
            expect(wrapper.find('.semi-json-viewer').hostNodes().getDOMNode().querySelector('.hover-result').childElementCount).toBe(0);
        } finally { wrapper.unmount(); }
    });
    it('does not route a disposed token into a replacement editor', () => {
        const renderTooltip = rs.fn(() => document.createElement('b'));
        const wrapper = mount(<JsonViewer value='{"message":"hello"}' renderTooltip={renderTooltip} />);
        try {
            const oldToken = wrapper.find('.semi-json-viewer').hostNodes().getDOMNode().querySelector('.source-token');
            wrapper.setProps({ value: '{"message":"new"}' });
            oldToken.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            expect(renderTooltip).not.toHaveBeenCalled();
        } finally { wrapper.unmount(); }
    });
});
