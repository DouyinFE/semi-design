import React from 'react';
import { mount } from 'enzyme';
import { ConfigProvider } from '../../index';
import Feedback from '../index';
import en_US from '../../locale/source/en_US';
import ja_JP from '../../locale/source/ja_JP';

describe('Feedback placeholder', () => {
    const placeholderOf = wrapper => wrapper.find('textarea').prop('placeholder');
    const openEmojiReason = wrapper => wrapper.find('.semi-feedback-emoji-item').at(0).simulate('click');

    it('uses the default locale without a provider', () => {
        const wrapper = mount(<Feedback visible type="text" motion={false} />);
        expect(placeholderOf(wrapper)).toBe('请提供更多反馈');
        wrapper.unmount();
    });

    [[en_US, 'Provide additional feedback'], [ja_JP, '追加のフィードバックを入力してください']].forEach(([locale, text]) => {
        it(`follows ${locale.code} for the text type`, () => {
            const wrapper = mount(<ConfigProvider locale={locale}><Feedback visible type="text" motion={false} /></ConfigProvider>);
            expect(placeholderOf(wrapper)).toBe(text);
            wrapper.unmount();
        });
    });

    [[en_US, 'Provide additional feedback (optional)'], [ja_JP, '追加のフィードバックを入力してください（任意）']].forEach(([locale, text]) => {
        it(`follows ${locale.code} for the emoji reason`, () => {
            const wrapper = mount(<ConfigProvider locale={locale}><Feedback visible type="emoji" motion={false} /></ConfigProvider>);
            openEmojiReason(wrapper);
            wrapper.update();
            expect(placeholderOf(wrapper)).toBe(text);
            wrapper.unmount();
        });
    });

    it('lets textAreaProps override the placeholder', () => {
        const wrapper = mount(<Feedback visible type="text" motion={false} textAreaProps={{ placeholder: 'custom' }} />);
        expect(placeholderOf(wrapper)).toBe('custom');
        wrapper.unmount();
    });
});
