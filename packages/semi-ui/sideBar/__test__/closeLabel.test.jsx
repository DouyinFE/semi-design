import React from 'react';
import { mount } from 'enzyme';
import { ConfigProvider, Sidebar } from '../../index';
import en_US from '../../locale/source/en_US';
import ja_JP from '../../locale/source/ja_JP';

const Container = Sidebar.Container;

describe('Sidebar.Container close button label', () => {
    const labelOf = wrapper => wrapper.find('button.semi-sidebar-container-header-closeBtn').prop('aria-label');

    it('uses the default locale without a provider', () => {
        const wrapper = mount(<Container visible title="title" />);
        expect(labelOf(wrapper)).toBe('关闭');
        wrapper.unmount();
    });

    [[en_US, 'Close'], [ja_JP, '閉じる']].forEach(([locale, label]) => {
        it(`follows ${locale.code}`, () => {
            const wrapper = mount(<ConfigProvider locale={locale}><Container visible title="title" /></ConfigProvider>);
            expect(labelOf(wrapper)).toBe(label);
            wrapper.unmount();
        });
    });

    it('still renders with a locale that has no Sidebar section', () => {
        const { Sidebar: _, ...oldLocale } = en_US;
        const wrapper = mount(<ConfigProvider locale={oldLocale}><Container visible title="title" /></ConfigProvider>);
        expect(wrapper.exists('button.semi-sidebar-container-header-closeBtn')).toBe(true);
        wrapper.unmount();
    });
});
