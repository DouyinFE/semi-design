import React from 'react';
import { act } from 'react-dom/test-utils';
import MarkdownRender from '../index';

describe('MarkdownRender asynchronous results', () => {
    it.each(['mount', 'update'])('keeps the latest content when an older %s compilation finishes last', async start => {
        let releaseOld;
        const pending = new Promise(resolve => { releaseOld = resolve; });
        const delayOld = () => async (tree, file) => {
            if (String(file.value) === 'old content') { await pending; }
        };
        const wrapper = mount(<MarkdownRender raw={start === 'mount' ? 'old content' : 'initial'} remarkPlugins={[delayOld]} />);
        try {
            if (start === 'update') {
                await act(async () => { wrapper.setProps({ raw: 'old content' }); });
            }
            await act(async () => {
                wrapper.setProps({ raw: 'new content' });
                await new Promise(resolve => setTimeout(resolve, 0));
            });
            wrapper.update();
            expect(wrapper.text()).toBe('new content');
            await act(async () => {
                releaseOld();
                await new Promise(resolve => setTimeout(resolve, 0));
            });
            wrapper.update();
            expect(wrapper.text()).toBe('new content');
        } finally {
            releaseOld();
            wrapper.unmount();
        }
    });

    it('does not update state when compilation finishes after unmount', async () => {
        let release;
        const pending = new Promise(resolve => { release = resolve; });
        const delay = () => () => pending;
        const setState = sinon.spy(MarkdownRender.prototype, 'setState');
        const wrapper = mount(<MarkdownRender raw="content" remarkPlugins={[delay]} />);
        wrapper.unmount();
        try {
            await act(async () => {
                release();
                await new Promise(resolve => setTimeout(resolve, 0));
            });
            expect(setState.called).toBe(false);
        } finally { setState.restore(); }
    });
});
