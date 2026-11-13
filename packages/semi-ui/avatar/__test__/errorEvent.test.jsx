import React from 'react';
import { mount } from 'enzyme';
import Avatar from '../index';

describe('Avatar public image-error event', () => {
    it('forwards the actual error event to onError', () => {
        const received = [];
        const onError = event => received.push({ type: event?.type, target: event?.currentTarget?.tagName });
        const wrapper = mount(<Avatar src="missing" onError={onError}>fallback</Avatar>);
        try {
            wrapper.find('img').simulate('error');
            expect(received[0]).toEqual({ type: 'error', target: 'IMG' });
        } finally { wrapper.unmount(); }
    });
    it('retains the image when onError returns false', () => {
        const wrapper = mount(<Avatar src="missing" onError={() => false}>fallback</Avatar>);
        try {
            wrapper.find('img').simulate('error', { type: 'error' });
            expect(wrapper.find('img')).toHaveLength(1);
        } finally { wrapper.unmount(); }
    });
    it('keeps the default fallback when onError is omitted', () => {
        const wrapper = mount(<Avatar src="missing">fallback</Avatar>);
        try {
            wrapper.find('img').simulate('error', { type: 'error' });
            expect(wrapper.find('img')).toHaveLength(0);
            expect(wrapper.text()).toBe('fallback');
        } finally { wrapper.unmount(); }
    });
});
