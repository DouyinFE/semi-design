import React from 'react';
import { mount } from 'enzyme';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import Tag from '../index';
import SplitTagGroup from '../splitTagGroup';

const PREFIX = `${BASE_CLASS_PREFIX}-tag`;

describe('SplitTagGroup', () => {
    it('renders the wrapper with role=group and forwards aria-label / className / style', () => {
        const wrapper = mount(
            <SplitTagGroup
                aria-label="my group"
                className="custom-class"
                style={{ marginTop: 10 }}
            >
                <Tag color="blue">A</Tag>
                <Tag color="cyan">B</Tag>
            </SplitTagGroup>
        );
        const root = wrapper.find(`div.${PREFIX}-split`).at(0);
        expect(root.length).toBe(1);
        expect(root.prop('role')).toBe('group');
        expect(root.prop('aria-label')).toBe('my group');
        expect(root.hasClass('custom-class')).toBe(true);
        expect(root.prop('style')).toMatchObject({ marginTop: 10 });
    });

    it('injects semi-tag-first / semi-tag-last on the boundary children only', () => {
        const wrapper = mount(
            <SplitTagGroup>
                <Tag color="blue">A</Tag>
                <Tag color="cyan">B</Tag>
                <Tag color="teal">C</Tag>
            </SplitTagGroup>
        );
        const tags = wrapper.find(`.${PREFIX}-split`).find(`.${PREFIX}`).hostNodes();
        expect(tags.length).toBe(3);
        expect(tags.at(0).hasClass(`${PREFIX}-first`)).toBe(true);
        expect(tags.at(0).hasClass(`${PREFIX}-last`)).toBe(false);
        expect(tags.at(1).hasClass(`${PREFIX}-first`)).toBe(false);
        expect(tags.at(1).hasClass(`${PREFIX}-last`)).toBe(false);
        expect(tags.at(2).hasClass(`${PREFIX}-first`)).toBe(false);
        expect(tags.at(2).hasClass(`${PREFIX}-last`)).toBe(true);
    });

    it('treats a single child as both first and last', () => {
        const wrapper = mount(
            <SplitTagGroup>
                <Tag color="blue">Only</Tag>
            </SplitTagGroup>
        );
        const tag = wrapper.find(`.${PREFIX}-split`).find(`.${PREFIX}`).hostNodes().at(0);
        expect(tag.hasClass(`${PREFIX}-first`)).toBe(true);
        expect(tag.hasClass(`${PREFIX}-last`)).toBe(true);
    });

    it('preserves existing className on children', () => {
        const wrapper = mount(
            <SplitTagGroup>
                <Tag color="blue" className="user-cls-1">A</Tag>
                <Tag color="cyan" className="user-cls-2">B</Tag>
            </SplitTagGroup>
        );
        const tags = wrapper.find(`.${PREFIX}-split`).find(`.${PREFIX}`).hostNodes();
        expect(tags.at(0).hasClass('user-cls-1')).toBe(true);
        expect(tags.at(0).hasClass(`${PREFIX}-first`)).toBe(true);
        expect(tags.at(1).hasClass('user-cls-2')).toBe(true);
        expect(tags.at(1).hasClass(`${PREFIX}-last`)).toBe(true);
    });

    it('only decorates direct children (nested Tag inside another Tag is left alone)', () => {
        const wrapper = mount(
            <SplitTagGroup>
                <Tag color="blue">
                    outer
                    {/* nested tag should NOT receive first/last class */}
                    <Tag color="cyan" className="nested">nested</Tag>
                </Tag>
                <Tag color="teal">B</Tag>
            </SplitTagGroup>
        );
        const nested = wrapper.find('.nested').hostNodes().at(0);
        expect(nested.hasClass(`${PREFIX}-first`)).toBe(false);
        expect(nested.hasClass(`${PREFIX}-last`)).toBe(false);
    });

    it('updates first / last classes synchronously when children change', () => {
        const wrapper = mount(
            <SplitTagGroup>
                <Tag key="a" color="blue">A</Tag>
                <Tag key="b" color="cyan">B</Tag>
            </SplitTagGroup>
        );
        let tags = wrapper.find(`.${PREFIX}-split`).find(`.${PREFIX}`).hostNodes();
        expect(tags.at(0).hasClass(`${PREFIX}-first`)).toBe(true);
        expect(tags.at(1).hasClass(`${PREFIX}-last`)).toBe(true);

        wrapper.setProps({
            children: [
                <Tag key="a" color="blue">A</Tag>,
                <Tag key="b" color="cyan">B</Tag>,
                <Tag key="c" color="teal">C</Tag>,
            ],
        });
        wrapper.update();
        tags = wrapper.find(`.${PREFIX}-split`).find(`.${PREFIX}`).hostNodes();
        expect(tags.length).toBe(3);
        expect(tags.at(0).hasClass(`${PREFIX}-first`)).toBe(true);
        expect(tags.at(1).hasClass(`${PREFIX}-first`)).toBe(false);
        expect(tags.at(1).hasClass(`${PREFIX}-last`)).toBe(false);
        expect(tags.at(2).hasClass(`${PREFIX}-last`)).toBe(true);
    });

    it('skips falsy / non-element children gracefully', () => {
        const wrapper = mount(
            <SplitTagGroup>
                {null}
                <Tag color="blue">A</Tag>
                {false}
                <Tag color="cyan">B</Tag>
            </SplitTagGroup>
        );
        const tags = wrapper.find(`.${PREFIX}-split`).find(`.${PREFIX}`).hostNodes();
        expect(tags.length).toBe(2);
        expect(tags.at(0).hasClass(`${PREFIX}-first`)).toBe(true);
        expect(tags.at(1).hasClass(`${PREFIX}-last`)).toBe(true);
    });
});
