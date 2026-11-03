import React from 'react';
import { mount } from 'enzyme';
import { Banner, ConfigProvider } from '../../index';
import en_US from '../../locale/source/en_US';
import ja_JP from '../../locale/source/ja_JP';

describe('Banner close button label', () => {
    const labelOf = wrapper => wrapper.find('button.semi-banner-close').prop('aria-label');

    it('uses the default locale without a provider', () => {
        const wrapper = mount(<Banner description="banner" />);
        expect(labelOf(wrapper)).toBe('关闭');
        wrapper.unmount();
    });

    [[en_US, 'Close'], [ja_JP, '閉じる']].forEach(([locale, label]) => {
        it(`follows ${locale.code}`, () => {
            const wrapper = mount(<ConfigProvider locale={locale}><Banner description="banner" /></ConfigProvider>);
            expect(labelOf(wrapper)).toBe(label);
            wrapper.unmount();
        });
    });

    it('still renders with a locale that has no Banner section', () => {
        const { Banner: _, ...oldLocale } = en_US;
        const wrapper = mount(<ConfigProvider locale={oldLocale}><Banner description="banner" /></ConfigProvider>);
        expect(wrapper.exists('button.semi-banner-close')).toBe(true);
        wrapper.unmount();
    });
});
