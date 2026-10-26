import React from 'react';
import { mount } from 'enzyme';
import Radio from '../index';

describe('RadioGroup accessibility role', () => {
    ['default', 'button', 'card', 'pureCard'].forEach(type => {
        it(`identifies the labelled ${type} group and preserves validation attributes`, () => {
            const wrapper = mount(<Radio.Group type={type} name="choice" aria-label="Choices"
                aria-describedby="help" aria-errormessage="error" aria-invalid aria-required>
                <Radio value="first">First</Radio><Radio value="second">Second</Radio>
            </Radio.Group>);
            try {
                const group = wrapper.getDOMNode();
                expect(group.getAttribute('role')).toBe('radiogroup');
                expect(group.getAttribute('aria-label')).toBe('Choices');
                expect(group.getAttribute('aria-describedby')).toBe('help');
                expect(group.getAttribute('aria-errormessage')).toBe('error');
                expect(group.getAttribute('aria-invalid')).toBe('true');
                expect(group.getAttribute('aria-required')).toBe('true');
                expect(group.querySelectorAll('input[type="radio"]')).toHaveLength(2);
            } finally { wrapper.unmount(); }
        });
    });
});
