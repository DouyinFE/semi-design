import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import JsonViewer from '../index';

rs.mock('@douyinfe/semi-json-viewer-core', () => ({
    JsonViewer: class {
        constructor(host, value, options) {
            this.host = host;
            this.value = value;
            this.options = options;
            this.handlers = {};
            this.emitter = { on: (name, handler) => { this.handlers[name] = handler; } };
        }
        layout() {
            if (this.options.readOnly && this.value.includes('hello') && this.options.customRenderRule?.length) {
                const target = document.createElement('span');
                this.host.appendChild(target);
                this.handlers.customRender({ customRenderMap: new Map([[target, this.options.customRenderRule[0].render()]]) });
            } else {
                this.host.textContent = this.value;
            }
        }
        dispose() { this.host.textContent = ''; }
    }
}));
describe('JsonViewer custom-render lifecycle', () => {
    it.each([
        [{ options: { readOnly: false } }],
        [{ value: '{"message":"other"}' }],
    ])('unmounts a no-longer-rendered custom component: %j', async next => {
        const cleanup = rs.fn();
        function Token() { useEffect(() => cleanup, []); return <strong>custom</strong>; }
        const rules = [{ match: () => true, render: () => <Token /> }];
        let wrapper;
        await act(async () => { wrapper = mount(<JsonViewer value='{"message":"hello"}' options={{ readOnly: true, customRenderRule: rules }} />); });
        try {
            wrapper.update();
            expect(wrapper.find(Token)).toHaveLength(1);
            await act(async () => { wrapper.setProps(next); });
            wrapper.update();
            expect(cleanup).toHaveBeenCalledTimes(1);
            expect(wrapper.find(Token)).toHaveLength(0);
        } finally { wrapper.unmount(); }
    });
    it('retains custom rendering in the replacement editor', async () => {
        const cleanup = rs.fn();
        function Token() { useEffect(() => cleanup, []); return <strong>custom</strong>; }
        const rules = [{ match: () => true, render: () => <Token /> }];
        let wrapper;
        await act(async () => { wrapper = mount(<JsonViewer value='{"message":"hello"}' options={{ readOnly: true, customRenderRule: rules }} />); });
        try {
            await act(async () => { wrapper.setProps({ options: { readOnly: true, autoWrap: false, customRenderRule: rules } }); });
            wrapper.update();
            expect(cleanup).toHaveBeenCalledTimes(1);
            expect(wrapper.find(Token)).toHaveLength(1);
        } finally { wrapper.unmount(); }
    });
});
