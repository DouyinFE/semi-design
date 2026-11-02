import React from 'react';
import { getByRole } from '@testing-library/dom';
import TagInput from '../index';

describe('TagInput input accessible name', () => {
    it.each([false, true])('uses aria-label on the textbox with disabled=%s', disabled => {
        const wrapper = mount(<TagInput aria-label="Recipients" disabled={disabled} />);
        try {
            expect(getByRole(wrapper.getDOMNode(), 'textbox', { name: 'Recipients' })).toEqual(wrapper.find('input').getDOMNode());
        } finally {
            wrapper.unmount();
        }
    });

    it('updates the textbox name when aria-label changes', () => {
        const wrapper = mount(<TagInput aria-label="Recipients" />);
        try {
            wrapper.setProps({ 'aria-label': 'Reviewers' });
            expect(getByRole(wrapper.getDOMNode(), 'textbox', { name: 'Reviewers' })).toEqual(wrapper.find('input').getDOMNode());
        } finally {
            wrapper.unmount();
        }
    });

    it('retains the default input label', () => {
        const wrapper = mount(<TagInput />);
        try {
            expect(getByRole(wrapper.getDOMNode(), 'textbox', { name: 'input value' })).toEqual(wrapper.find('input').getDOMNode());
        } finally {
            wrapper.unmount();
        }
    });
});
