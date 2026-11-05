import React from 'react';
import { mount } from 'enzyme';
import { ConfigProvider, TabPane, Tabs } from '../../index';
import en_US from '../../locale/source/en_US';
import ja_JP from '../../locale/source/ja_JP';

describe('Tabs close icon label', () => {
    const tabs = (
        <Tabs type="card">
            <TabPane tab="tab" itemKey="1" closable>content</TabPane>
        </Tabs>
    );
    const labelOf = wrapper => wrapper.find('.semi-tabs-tab-icon-close').hostNodes().prop('aria-label');

    it('uses the default locale without a provider', () => {
        const wrapper = mount(tabs);
        expect(labelOf(wrapper)).toBe('关闭');
        wrapper.unmount();
    });

    [[en_US, 'Close'], [ja_JP, '閉じる']].forEach(([locale, label]) => {
        it(`follows ${locale.code}`, () => {
            const wrapper = mount(<ConfigProvider locale={locale}>{tabs}</ConfigProvider>);
            expect(labelOf(wrapper)).toBe(label);
            wrapper.unmount();
        });
    });
});
