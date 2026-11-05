import React from 'react';
import { mount } from 'enzyme';
import { ConfigProvider, Modal } from '../../index';
import en_US from '../../locale/source/en_US';
import ja_JP from '../../locale/source/ja_JP';

describe('Modal close button label', () => {
    const labelOf = wrapper => wrapper.find('button.semi-modal-close').prop('aria-label');

    it('uses the default locale without a provider', () => {
        const wrapper = mount(<Modal visible motion={false} title="title">modal</Modal>);
        expect(labelOf(wrapper)).toBe('关闭');
        wrapper.unmount();
    });

    [[en_US, 'Close'], [ja_JP, '閉じる']].forEach(([locale, label]) => {
        it(`follows ${locale.code} with and without a header`, () => {
            [{ title: 'title' }, {}].forEach(props => {
                const wrapper = mount(
                    <ConfigProvider locale={locale}><Modal visible motion={false} {...props}>modal</Modal></ConfigProvider>
                );
                expect(labelOf(wrapper)).toBe(label);
                wrapper.unmount();
            });
        });
    });
});
