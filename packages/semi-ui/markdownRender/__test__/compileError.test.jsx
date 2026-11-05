import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import MarkdownRender from '../index';

const flush = () => act(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
});

describe('MarkdownRender compile errors', () => {
    let error;
    let rejections;
    const onRejection = reason => rejections.push(reason);
    beforeEach(() => {
        rejections = [];
        error = rs.spyOn(console, 'error').mockImplementation(() => {});
        process.on('unhandledRejection', onRejection);
    });
    afterEach(() => {
        process.off('unhandledRejection', onRejection);
        error.mockRestore();
    });

    it('reports invalid MDX on mount without an unhandled rejection', async () => {
        const wrapper = mount(<MarkdownRender raw={'<div>'} />);
        try {
            await flush();
            wrapper.update();
            expect(wrapper.text()).toBe('');
            expect(rejections).toEqual([]);
            expect(error.mock.calls.some(([, cause]) => String(cause).includes('closing tag'))).toBe(true);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps the previous content until valid MDX arrives', async () => {
        const wrapper = mount(<MarkdownRender raw="before" />);
        try {
            await flush();
            wrapper.setProps({ raw: '<div>' });
            await flush();
            wrapper.update();
            expect(wrapper.text()).toBe('before');
            expect(rejections).toEqual([]);
            wrapper.setProps({ raw: 'after' });
            await flush();
            wrapper.update();
            expect(wrapper.text()).toBe('after');
        } finally {
            wrapper.unmount();
        }
    });

    it('ignores the error of a compilation that is no longer current', async () => {
        const wrapper = mount(<MarkdownRender raw={'<div>'} />);
        wrapper.setProps({ raw: 'after' });
        try {
            await flush();
            wrapper.update();
            expect(wrapper.text()).toBe('after');
            expect(rejections).toEqual([]);
            expect(error.mock.calls.some(([message]) => String(message).includes('[Semi MarkdownRender]'))).toBe(false);
        } finally {
            wrapper.unmount();
        }
    });
});
