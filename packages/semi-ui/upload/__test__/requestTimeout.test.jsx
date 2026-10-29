import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Upload from '../index';
describe('Upload native request timeout', ()=>{
    let NativeRequest, requests, wrapper;
    beforeEach(()=>{
        NativeRequest = global.XMLHttpRequest;requests = [];
        global.XMLHttpRequest = class {
            constructor() {this.upload = {};this.timeout = 0;this.status = 200;this.responseText = '{"ok":true}';requests.push(this);}
            open() {}
            send() {}
            setRequestHeader() {}
            abort() {}
        };
    });
    afterEach(()=>{wrapper?.unmount();wrapper = null;global.XMLHttpRequest = NativeRequest;});
    async function select(props = {}) {
        wrapper = mount(<Upload action="/upload" {...props}/>);
        await act(async()=>{wrapper.find('input[type="file"]').at(0).simulate('change', { target: { files: [new File(['text'], 'file.txt', { type: 'text/plain' })] } });await new Promise(resolve=>setTimeout(resolve, 0));});
        wrapper.update();return requests[0];
    }
    it('sets the configured timeout on the native request', async()=>{
        const xhr = await select({ timeout: 120 });expect(xhr.timeout).toBe(120);
    });
    it('routes a native timeout through the existing error callback and file state', async()=>{
        const onError = rs.fn();const xhr = await select({ timeout: 120, onError });xhr.status = 0;
        await act(async()=>{xhr.ontimeout?.(new ProgressEvent('timeout'));});wrapper.update();
        expect(onError).toHaveBeenCalledTimes(1);expect(wrapper.state('fileList')[0].status).toBe('uploadFail');
    });
    it('preserves the default unlimited request and success callback', async()=>{
        const onSuccess = rs.fn();const xhr = await select({ onSuccess });expect(xhr.timeout).toBe(0);
        await act(async()=>{xhr.onload(new ProgressEvent('load'));});expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    it('keeps the custom request callback in control', async()=>{
        const onSuccess = rs.fn(), customRequest = rs.fn(({ onSuccess })=>onSuccess({ ok: true }));
        await select({ timeout: 120, customRequest, onSuccess });expect(customRequest).toHaveBeenCalledTimes(1);expect(onSuccess).toHaveBeenCalledTimes(1);
    });
});

