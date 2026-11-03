import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Feedback, Modal } from '../../index';

const flush = () => act(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
});

const enabled = { disabled: false };
const modalFooter = '.semi-modal-footer button';
const popupFooter = '.semi-feedback-footer button';

describe('Modal and Feedback with a rejected callback promise', () => {
    let rejections;
    const onRejection = reason => rejections.push(reason);
    beforeEach(() => {
        rejections = [];
        process.on('unhandledRejection', onRejection);
    });
    afterEach(() => {
        process.off('unhandledRejection', onRejection);
    });

    [
        ['Modal onOk', handler => <Modal visible motion={false} title="title" onOk={handler}>content</Modal>, modalFooter, 1],
        ['Modal onCancel', handler => <Modal visible motion={false} title="title" onCancel={handler}>content</Modal>, modalFooter, 0],
        ['Feedback modal onOk', handler => <Feedback visible mode="modal" type="text" motion={false} okButtonProps={enabled} onOk={handler} />, modalFooter, 1],
        ['Feedback modal onCancel', handler => <Feedback visible mode="modal" type="text" motion={false} onCancel={handler} />, modalFooter, 0],
        ['Feedback popup onOk', handler => <Feedback visible mode="popup" type="text" motion={false} okButtonProps={enabled} onOk={handler} />, popupFooter, 1],
        ['Feedback popup onCancel', handler => <Feedback visible mode="popup" type="text" motion={false} onCancel={handler} />, popupFooter, 0],
    ].forEach(([name, render, selector, index]) => {
        it(`${name} restores the button without an unhandled rejection`, async () => {
            const handler = sinon.spy(() => Promise.reject(new Error(name)));
            const wrapper = mount(render(handler));
            try {
                document.querySelectorAll(selector)[index].click();
                await flush();
                expect(handler.callCount).toBe(1);
                expect(rejections).toEqual([]);
                const button = document.querySelectorAll(selector)[index];
                expect(button.classList.contains('semi-button-loading')).toBe(false);
            } finally {
                wrapper.unmount();
            }
        });
    });

    it('does not report a promise the caller already handled', async () => {
        const onOk = () => {
            const result = Promise.reject(new Error('handled'));
            result.catch(() => {});
            return result;
        };
        const wrapper = mount(<Modal visible motion={false} title="title" onOk={onOk}>content</Modal>);
        try {
            document.querySelectorAll(modalFooter)[1].click();
            await flush();
            expect(rejections).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });
});
