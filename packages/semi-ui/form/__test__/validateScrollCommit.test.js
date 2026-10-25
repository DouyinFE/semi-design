import FormFoundation from '@douyinfe/semi-foundation/form/foundation';
import { cloneDeep } from 'lodash';

describe('Form validation scrolling after the error DOM commits', () => {
    const createForm = async ({ valid = false, autoScroll = true } = {}) => {
        const element = document.createElement('div');
        document.body.appendChild(element);
        const scrolled = [];
        let foundation;
        const adapter = {
            getProps: () => ({}),
            getFormProps: () => ({
                autoScrollToError: autoScroll ? {
                    behavior: () => { scrolled.push(element.querySelector('[data-error]').textContent); },
                } : false,
            }),
            cloneDeep,
            notifyChange: () => {},
            notifyValueChange: () => {},
            notifyErrorChange: () => {},
            getAllErrorDOM: () => element.querySelectorAll('[data-error]'),
            forceUpdate: callback => {
                Promise.resolve().then(() => {
                    if (foundation.getError('name')) {
                        const control = document.createElement('div');
                        const error = document.createElement('div');
                        error.dataset.error = 'name';
                        error.textContent = foundation.getError('name');
                        control.appendChild(error);
                        element.appendChild(control);
                    }
                    if (callback) {
                        callback();
                    }
                });
            },
        };
        foundation = new FormFoundation(adapter);
        foundation.register('name', { value: '' }, {
            field: 'name',
            keepState: false,
            allowEmpty: false,
            fieldApi: {
                validate: () => {
                    const error = valid ? undefined : 'Name is required';
                    foundation.updateStateError('name', error, { notNotify: true, notUpdate: true });
                    return Promise.resolve(error);
                },
                setTouched: () => {},
            },
        });
        await Promise.resolve();
        return { api: foundation.getFormApi(), element, scrolled };
    };

    it('scrolls to the rendered error after a deferred update', async () => {
        const { api, element, scrolled } = await createForm();
        try {
            await expect(api.validate()).rejects.toEqual({ name: 'Name is required' });
            expect(element.querySelector('[data-error]').textContent).toEqual('Name is required');
            expect(scrolled).toEqual(['Name is required']);
        } finally {
            element.remove();
        }
    });

    it('does not render errors or scroll for silent validation', async () => {
        const { api, element, scrolled } = await createForm();
        try {
            await expect(api.validate({ silent: true })).rejects.toEqual({ name: 'Name is required' });
            expect(element.querySelector('[data-error]')).toBeNull();
            expect(scrolled).toEqual([]);
        } finally {
            element.remove();
        }
    });

    it('does not scroll when validation succeeds', async () => {
        const { api, element, scrolled } = await createForm({ valid: true });
        try {
            await expect(api.validate()).resolves.toEqual({});
            expect(scrolled).toEqual([]);
        } finally {
            element.remove();
        }
    });

    it('does not scroll when autoScrollToError is disabled', async () => {
        const { api, element, scrolled } = await createForm({ autoScroll: false });
        try {
            await expect(api.validate()).rejects.toEqual({ name: 'Name is required' });
            expect(element.querySelector('[data-error]')).not.toBeNull();
            expect(scrolled).toEqual([]);
        } finally {
            element.remove();
        }
    });
});
