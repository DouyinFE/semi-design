import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Upload from '../index';

describe('Upload pending request cleanup', () => {
    let xhr;
    let requests;
    const createObjectURL = URL.createObjectURL;
    const revokeObjectURL = URL.revokeObjectURL;

    beforeEach(() => {
        requests = [];
        xhr = sinon.useFakeXMLHttpRequest();
        xhr.onCreate = request => requests.push(request);
        URL.createObjectURL = rs.fn(() => 'blob:test-upload');
        URL.revokeObjectURL = rs.fn();
    });
    afterEach(() => {
        rs.restoreAllMocks();
        xhr.restore();
        URL.createObjectURL = createObjectURL;
        URL.revokeObjectURL = revokeObjectURL;
    });

    const select = (wrapper, names = ['a.txt']) => wrapper.find('input.semi-upload-hidden-input').simulate('change', {
        target: { files: names.map(name => new File(['test'], name, { type: 'text/plain' })) },
    });

    it('aborts every pending native request immediately on unmount without callbacks or URL revocation', () => {
        const onSuccess = rs.fn();
        const onError = rs.fn();
        const wrapper = mount(<Upload action="/upload" multiple onSuccess={onSuccess} onError={onError} />);
        select(wrapper, ['a.txt', 'b.txt']);
        expect(requests).toHaveLength(2);
        wrapper.unmount();
        expect(requests.every(request => request.aborted)).toBe(true);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
        expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    });

    it.each(['load', 'error', 'abort'])('does not abort a request that already ended via %s', event => {
        const wrapper = mount(<Upload action="/upload" />);
        try {
            select(wrapper);
            const request = requests[0];
            if (event === 'load') { request.respond(200, {}, '{}'); }
            if (event === 'error') { request.error(); }
            if (event === 'abort') { request.abort(); }
            const abort = rs.spyOn(request, 'abort');
            wrapper.unmount();
            expect(abort).not.toHaveBeenCalled();
        } finally { if (wrapper.exists()) { wrapper.unmount(); } }
    });

    it('does not retain native requests when customRequest handles uploading', () => {
        const customRequest = rs.fn();
        const wrapper = mount(<Upload action="/upload" customRequest={customRequest} />);
        select(wrapper);
        expect(customRequest).toHaveBeenCalledTimes(1);
        const abort = rs.spyOn(requests[0], 'abort');
        wrapper.unmount();
        expect(abort).not.toHaveBeenCalled();
    });

    it('tracks new uploads after a destroy and init cycle', () => {
        const wrapper = mount(<Upload action="/upload" />);
        select(wrapper);
        wrapper.instance().foundation.destroy();
        expect(requests[0].aborted).toBe(true);
        wrapper.instance().foundation.init();
        select(wrapper, ['b.txt']);
        expect(requests[1].aborted).not.toBe(true);
        wrapper.unmount();
        expect(requests[1].aborted).toBe(true);
    });

    it('does not retain a request whose send throws synchronously', () => {
        const wrapper = mount(<Upload action="/upload" />);
        const error = new Error('send failed');
        rs.spyOn(xhr.prototype, 'send').mockImplementation(() => { throw error; });
        try {
            expect(() => wrapper.instance().foundation.post({ fileInstance: new File(['test'], 'a.txt') })).toThrow(error);
            const abort = rs.spyOn(requests[0], 'abort');
            wrapper.unmount();
            expect(abort).not.toHaveBeenCalled();
        } finally { if (wrapper.exists()) { wrapper.unmount(); } }
    });
});
