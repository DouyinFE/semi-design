import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import PinCode from '../index';
import { Form } from '../../form';

describe('PinCode form attributes', () => {
    let wrapper;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        wrapper.unmount();
        container.remove();
    });

    it('associates the form label with only the first input', () => {
        wrapper = mount(<Form><Form.PinCode field="pin" label="Code" autoFocus={false} count={4} /></Form>, { attachTo: container });
        const label = container.querySelector('label');
        const inputs = container.querySelectorAll('input');
        expect(document.getElementById(label.htmlFor)).toBe(inputs[0]);
        expect([...inputs].filter(input => input.id === label.htmlFor)).toHaveLength(1);
        expect([...inputs].map(input => input.getAttribute('aria-labelledby'))).toEqual(Array(4).fill(label.id));
    });

    it('applies form validation status and error associations to every input', async () => {
        let api;
        wrapper = mount(<Form getFormApi={value => { api = value; }}><Form.PinCode field="pin" label="Code" autoFocus={false} count={4} extraText="Four digits" rules={[{ required: true, message: 'Required' }]} /></Form>, { attachTo: container });
        await act(async () => {
            await api.validate().catch(() => {});
        });
        wrapper.update();
        for (const input of container.querySelectorAll('input')) {
            expect(input.closest('.semi-input-wrapper').classList.contains('semi-input-wrapper-error')).toBe(true);
            expect(input.getAttribute('aria-invalid')).toBe('true');
            expect(input.getAttribute('aria-required')).toBe('true');
            expect(document.getElementById(input.getAttribute('aria-errormessage')).textContent).toContain('Required');
            expect(document.getElementById(input.getAttribute('aria-describedby')).textContent).toBe('Four digits');
        }
    });

    it('passes supported accessibility attributes and tabIndex to each input', () => {
        wrapper = mount(<PinCode id="code" count={2} autoFocus={false} tabIndex={-1} aria-label="Code" aria-describedby="hint" validateStatus="warning" />, { attachTo: container });
        const inputs = container.querySelectorAll('input');
        expect(inputs[0].id).toBe('code');
        expect(inputs[1].id).toBe('');
        for (const input of inputs) {
            expect(input.tabIndex).toBe(-1);
            expect(input.getAttribute('aria-label')).toBe('Code');
            expect(input.getAttribute('aria-describedby')).toBe('hint');
            expect(input.closest('.semi-input-wrapper').classList.contains('semi-input-wrapper-warning')).toBe(true);
        }
    });
});
