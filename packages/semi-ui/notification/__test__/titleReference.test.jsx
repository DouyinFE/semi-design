import React from 'react';
import { mount } from 'enzyme';
import Notice from '../notice';

describe('Notification title reference', () => {
    let wrapper;
    afterEach(() => wrapper.unmount());

    it('keeps the title reference when the content changes', () => {
        wrapper = mount(<Notice title="Title" content="v1" duration={0} />);
        const titleID = wrapper.find('[role="alert"]').prop('aria-labelledby');
        wrapper.setProps({ content: 'v2' });
        expect(wrapper.find('[role="alert"]').prop('aria-labelledby')).toBe(titleID);
        expect(wrapper.find('.semi-notification-notice-title').prop('id')).toBe(titleID);
    });

    it('does not reference a missing title', () => {
        wrapper = mount(<Notice content="无标题" duration={0} />);
        expect(wrapper.find('[role="alert"]').prop('aria-labelledby')).toBeUndefined();
        expect(wrapper.find('.semi-notification-notice-title').exists()).toBe(false);
    });

    it('removes and restores the title reference when a title is toggled', () => {
        wrapper = mount(<Notice title="Title" duration={0} />);
        const titleID = wrapper.find('.semi-notification-notice-title').prop('id');
        wrapper.setProps({ title: '' });
        expect(wrapper.find('[role="alert"]').prop('aria-labelledby')).toBeUndefined();
        wrapper.setProps({ title: 'New title' });
        expect(wrapper.find('[role="alert"]').prop('aria-labelledby')).toBe(titleID);
        expect(wrapper.find('.semi-notification-notice-title').prop('id')).toBe(titleID);
    });

    it('uses separate title references for concurrent notifications', () => {
        wrapper = mount(<div><Notice title="First" duration={0} /><Notice title="Second" duration={0} /></div>);
        const references = wrapper.find('[role="alert"]').map(notice => notice.prop('aria-labelledby'));
        expect(references[0]).not.toBe(references[1]);
        expect(wrapper.find('.semi-notification-notice-title').map(title => title.prop('id'))).toEqual(references);
    });
});
