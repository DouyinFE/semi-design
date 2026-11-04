import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import MarkdownRender from '../index';

async function settle(wrapper) {
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); });
    wrapper.update();
}
function appendRemark() { return tree => { tree.children.push({ type: 'paragraph', children: [{ type: 'text', value: 'remark added' }] }); }; }
function replaceRehype() { return tree => { tree.children[0].children[0].value = 'rehype added'; }; }

describe('MarkdownRender compilation options', () => {
    it('recompiles when remarkGfm changes', async () => {
        const wrapper = mount(<MarkdownRender raw="~~word~~" remarkGfm />);
        try {
            await settle(wrapper);
            expect(wrapper.find('del').length).toBe(1);
            wrapper.setProps({ remarkGfm: false });
            await settle(wrapper);
            expect(wrapper.find('del').length).toBe(0);
            expect(wrapper.text()).toContain('~~word~~');
        } finally { wrapper.unmount(); }
    });
    it('recompiles when format changes', async () => {
        const wrapper = mount(<MarkdownRender raw="text <b>word</b>" format="mdx" />);
        try {
            await settle(wrapper);
            expect(wrapper.find('b').length).toBe(1);
            wrapper.setProps({ format: 'md' });
            await settle(wrapper);
            expect(wrapper.find('b').length).toBe(0);
        } finally { wrapper.unmount(); }
    });
    it('applies changed remark plugins', async () => {
        const wrapper = mount(<MarkdownRender raw="word" remarkPlugins={[]} />);
        try {
            await settle(wrapper);
            wrapper.setProps({ remarkPlugins: [appendRemark] });
            await settle(wrapper);
            expect(wrapper.text()).toContain('remark added');
        } finally { wrapper.unmount(); }
    });
    it('applies changed rehype plugins', async () => {
        const wrapper = mount(<MarkdownRender raw="word" rehypePlugins={[]} />);
        try {
            await settle(wrapper);
            wrapper.setProps({ rehypePlugins: [replaceRehype] });
            await settle(wrapper);
            expect(wrapper.text()).toContain('rehype added');
        } finally { wrapper.unmount(); }
    });
    it('does not recompile equivalent inline plugin arrays', async () => {
        const wrapper = mount(<MarkdownRender raw="word" remarkPlugins={[]} rehypePlugins={[]} />);
        try {
            await settle(wrapper);
            const evaluate = rs.spyOn(wrapper.instance().foundation, 'evaluate');
            wrapper.setProps({ remarkPlugins: [], rehypePlugins: [] });
            await settle(wrapper);
            expect(evaluate).not.toHaveBeenCalled();
        } finally { wrapper.unmount(); }
    });
    it('updates component overrides without recompilation', async () => {
        const wrapper = mount(<MarkdownRender raw="**word**" />);
        try {
            await settle(wrapper);
            const evaluate = rs.spyOn(wrapper.instance().foundation, 'evaluate');
            wrapper.setProps({ components: { strong: ({ children }) => <em>{children}</em> } });
            await settle(wrapper);
            expect(wrapper.find('em').text()).toBe('word');
            expect(evaluate).not.toHaveBeenCalled();
        } finally { wrapper.unmount(); }
    });
});
