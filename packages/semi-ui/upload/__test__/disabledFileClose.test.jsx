import React from 'react';
import { mount } from 'enzyme';
import { rstest } from '@rstest/core';
import FileCard from '../fileCard';

describe('Upload disabled file close action', () => {
    let wrapper;
    const file = { name: 'done.png', status: 'success', size: '130KB' };
    afterEach(() => { wrapper?.unmount(); });

    it('disables the default close button in a disabled list', () => {
        wrapper = mount(<FileCard {...file} listType="list" disabled />);

        expect(wrapper.find('button.semi-upload-file-card-close')).toHaveLength(1);
        expect(wrapper.find('button.semi-upload-file-card-close').prop('disabled')).toBe(true);
    });

    it('updates the close action when disabled changes', () => {
        const onRemove = rstest.fn();
        wrapper = mount(<FileCard {...file} listType="list" onRemove={onRemove} />);
        expect(wrapper.find('button.semi-upload-file-card-close')).toHaveLength(1);

        wrapper.setProps({ disabled: true });
        expect(wrapper.find('button.semi-upload-file-card-close').prop('disabled')).toBe(true);
        wrapper.setProps({ disabled: false });
        expect(wrapper.find('button.semi-upload-file-card-close').prop('disabled')).toBe(false);
        wrapper.find('button.semi-upload-file-card-close').simulate('click');

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('keeps caller-provided operations available when disabled', () => {
        const renderFileOperation = rstest.fn(props => <button data-disabled={String(props.disabled)}>详情</button>);
        wrapper = mount(<FileCard {...file} listType="list" disabled renderFileOperation={renderFileOperation} />);

        expect(wrapper.find('button[data-disabled="true"]')).toHaveLength(1);
        expect(wrapper.find('button.semi-upload-file-card-close')).toHaveLength(0);
    });

    it('keeps the picture close action hidden when disabled', () => {
        wrapper = mount(<FileCard {...file} listType="picture" disabled />);

        expect(wrapper.find('.semi-upload-picture-file-card-close')).toHaveLength(0);
    });
});
