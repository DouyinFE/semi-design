import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../index';
import Tooltip from '../../tooltip';

describe('Checkbox wrapped by Tooltip', () => {
    ['default', 'card', 'pureCard'].forEach(type => {
        it(`keeps only the native input in the default Tab order for ${type}`, () => {
            const wrapper = mount(<Tooltip content="help"><Checkbox type={type}>option</Checkbox></Tooltip>);
            try {
                const checkbox = wrapper.find(Checkbox).getDOMNode();
                expect(checkbox.tabIndex).toBe(-1);
                expect(checkbox.querySelector('input').tabIndex).toBe(0);
            } finally { wrapper.unmount(); }
        });

        it(`preserves an explicitly requested wrapper tabIndex for ${type}`, () => {
            const wrapper = mount(<Tooltip content="help"><Checkbox type={type} tabIndex={0}>option</Checkbox></Tooltip>);
            try { expect(wrapper.find(Checkbox).getDOMNode().tabIndex).toBe(0); }
            finally { wrapper.unmount(); }
        });
    });
});
