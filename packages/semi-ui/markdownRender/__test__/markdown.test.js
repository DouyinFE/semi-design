import MarkdownRender from '../index'
import React from 'react';
import { mount } from 'enzyme';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import { act } from 'react-dom/test-utils';


async function waitForRender(wrapper, selector, maxTries = 20) {
    // MarkdownRender renders MDX asynchronously in componentDidMount.
    // Enzyme does not automatically wait for async setState, so we poll until the expected node exists.
    for (let i = 0; i < maxTries; i++) {
        wrapper.update();
        if (!selector || wrapper.exists(selector)) {
            return;
        }
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    }
    wrapper.update();
}


describe(`MarkdownRender`, () => {
    it(`test table render`, async () => {
        const content = `
        | Name | Brand | Count | Price |
        | - | :- | -: | :-: |
        | Book | Semi | 10 | ￥100 |
        | Pen | Semi Design | 20 | ￥200 |
        `;

        const render = mount(
            <MarkdownRender raw={content} />
        );

        await waitForRender(render, `.${BASE_CLASS_PREFIX}-table-container`);

        // check if has table container
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-container`)).toEqual(true);
        // check if has table head & body
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-thead`)).toEqual(true);
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-tbody`)).toEqual(true);
        // check has row is two
        expect(render.find(`.${BASE_CLASS_PREFIX}-table-tbody .${BASE_CLASS_PREFIX}-table-row`).length).toBe(2);
    });

    it(`test table only header`, async () => {
        const content = `
        | Title | Name | Count | Price |
        | - | :- | -: | :-: |
        `;

        const render = mount(
            <MarkdownRender raw={content} />
        );

        await waitForRender(render, `.${BASE_CLASS_PREFIX}-table-container`);

        // check if has table container
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-container`)).toEqual(true);
        // check if has table head & body
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-thead`)).toEqual(true);
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-tbody`)).toEqual(true);
    });

    it(`test table with bold header`, async () => {
        const content = `
        | Name | **Brand** | Count | **Price** |
        | - | :- | -: | :-: |
        | Book | Semi | 10 | ￥100 |
        | Pen | Semi Design | 20 | ￥200 |
        `;

        const render = mount(
            <MarkdownRender raw={content} />
        );

        await waitForRender(render, `.${BASE_CLASS_PREFIX}-table-container`);

        // check if has table container
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-container`)).toEqual(true);
        // check if has table head & body
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-thead`)).toEqual(true);
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-tbody`)).toEqual(true);
        // check has row is two
        expect(render.find(`.${BASE_CLASS_PREFIX}-table-tbody .${BASE_CLASS_PREFIX}-table-row`).length).toBe(2);
        // exist 'Semi Design' text
        expect(render.contains('Semi Design')).toEqual(true);
        // exist 'Semi' text
        expect(render.contains('Semi')).toEqual(true);
        // exist '￥100' text
        expect(render.contains('￥100')).toEqual(true);
        // exist '￥200' text
        expect(render.contains('￥200')).toEqual(true);
    });

    it(`test table with bold and component header`, async () => {
        const content = `
        | Name | <h1>Brand</h1> | Count | **Price** |
        | - | :- | -: | :-: |
        | Book | Semi | 10 | ￥100 |
        | Pen | Semi Design | 20 | ￥200 |
        `;

        const render = mount(
            <MarkdownRender raw={content} format="mdx"/>
        );

        await waitForRender(render, `.${BASE_CLASS_PREFIX}-table-container`);

        // check if has table container
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-container`)).toEqual(true);
        // check if has table head & body
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-thead`)).toEqual(true);
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-tbody`)).toEqual(true);
        // check has row is two
        expect(render.find(`.${BASE_CLASS_PREFIX}-table-tbody .${BASE_CLASS_PREFIX}-table-row`).length).toBe(2);
        // exist 'Semi Design' text
        expect(render.contains('Semi Design')).toEqual(true);
        // exist 'Semi' text
        expect(render.contains('Semi')).toEqual(true);
        // exist '￥100' text
        expect(render.contains('￥100')).toEqual(true);
        // exist '￥200' text
        expect(render.contains('￥200')).toEqual(true);
    });

    it(`test single column gfm table should not lose cell content`, async () => {
        const content = `
        | 标题 |
        | - |
        | 内容 |
        `;

        const render = mount(
            <MarkdownRender raw={content} />
        );

        await waitForRender(render, `.${BASE_CLASS_PREFIX}-table-container`);

        // should render cell content
        expect(render.contains('内容')).toEqual(true);
        // check if has table container
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-container`)).toEqual(true);
    });
});
