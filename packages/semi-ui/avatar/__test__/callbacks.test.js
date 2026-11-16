import React from 'react';
import Avatar from '../index';

describe('Avatar callbacks', () => {
    it.each([undefined, { text: 'Live' }])('calls onError once with topSlot=%j', topSlot => {
        const onError = rs.fn();
        const wrapper = mount(<Avatar src="broken.png" topSlot={topSlot} onError={onError}>U</Avatar>);
        try {
            wrapper.find('img').simulate('error');
            expect(onError).toHaveBeenCalledTimes(1);
            expect(wrapper.find('img')).toHaveLength(0);
        } finally { wrapper.unmount(); }
    });

    it('keeps the image when onError returns false', () => {
        const onError = rs.fn(() => false);
        const wrapper = mount(<Avatar src="broken.png" onError={onError}>U</Avatar>);
        try {
            wrapper.find('img').simulate('error');
            expect(onError).toHaveBeenCalledTimes(1);
            expect(wrapper.find('img')).toHaveLength(1);
        } finally { wrapper.unmount(); }
    });
});
