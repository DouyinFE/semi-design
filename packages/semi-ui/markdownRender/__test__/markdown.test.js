import MarkdownRender from '../index'
import React from 'react';
import { mount } from 'enzyme';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import { sleep } from '../../_test_/utils';


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

        // wait for async markdown evaluation to complete
        await sleep(100);
        render.update();

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

        // wait for async markdown evaluation to complete
        await sleep(100);
        render.update();

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

        // wait for async markdown evaluation to complete
        await sleep(100);
        render.update();

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

        // wait for async markdown evaluation to complete
        await sleep(100);
        render.update();

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
});
