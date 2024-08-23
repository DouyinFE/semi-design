import MarkdownRender from '../index'
import React from 'react';
import { mount } from 'enzyme';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';


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

        // check if has table container
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-container`)).toEqual(true);
        // check if has table head & body
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-thead`)).toEqual(true);
        expect(render.exists(`.${BASE_CLASS_PREFIX}-table-tbody`)).toEqual(true);
    });
});
