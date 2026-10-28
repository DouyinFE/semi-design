import React from 'react';
import { fireEvent, render, waitFor, cleanup } from '@testing-library/react';
import InputBox from '../inputBox';
import Chat from '../index';

afterEach(cleanup);

describe('Chat attachment removal', () => {
    it.each([false, Promise.resolve(false)])('keeps the attachment when beforeRemove rejects removal', async result => {
        const beforeRemove = sinon.stub().returns(result);
        const onRemove = sinon.spy();
        const { container } = render(<InputBox placeholder="输入" clickUpload uploadProps={{ action: '/upload', customRequest: () => {}, beforeRemove, onRemove }} />);
        const file = new File(['example'], 'example.txt', { type: 'text/plain' });
        fireEvent.change(container.querySelector('input.semi-upload-hidden-input'), { target: { files: [file] } });
        await waitFor(() => expect(container.querySelector('.semi-chat-attachment-file-title')?.textContent).toBe('example.txt'));
        fireEvent.click(container.querySelector('.semi-chat-attachment-clear'));
        await waitFor(() => expect(beforeRemove.calledOnce).toBe(true));
        expect(container.querySelector('.semi-chat-attachment-file-title')?.textContent).toBe('example.txt');
        expect(onRemove.called).toBe(false);
    });

    it('notifies Upload and input callbacks after removal is allowed', async () => {
        const beforeRemove = sinon.stub().returns(Promise.resolve(true));
        const onRemove = sinon.spy();
        const onInputChange = sinon.spy();
        const { container } = render(<InputBox placeholder="输入" clickUpload onInputChange={onInputChange} uploadProps={{ action: '/upload', customRequest: () => {}, beforeRemove, onRemove }} />);
        const file = new File(['example'], 'example.txt', { type: 'text/plain' });
        fireEvent.change(container.querySelector('input.semi-upload-hidden-input'), { target: { files: [file] } });
        await waitFor(() => expect(container.querySelector('.semi-chat-attachment-file-title')?.textContent).toBe('example.txt'));
        fireEvent.click(container.querySelector('.semi-chat-attachment-clear'));
        await waitFor(() => expect(container.querySelector('.semi-chat-attachment-file-title')).toBeNull());
        expect(beforeRemove.calledOnce).toBe(true);
        expect(onRemove.calledOnce).toBe(true);
        expect(onInputChange.lastCall.args[0].attachment).toEqual([]);
    });
});

describe('Chat upload modes', () => {
    it.each(['drag', 'paste'])('uploads by %s when click upload is disabled', async mode => {
        const customRequest = sinon.spy();
        const { container } = render(<Chat chats={[]} hints={[]} roleConfig={{}} enableUpload={{ clickUpload: false, dragUpload: true, pasteUpload: true }} uploadProps={{ action: '/upload', customRequest }} />);
        const file = new File(['example'], 'example.txt', { type: 'text/plain' });
        if (mode === 'drag') {
            fireEvent.dragOver(container.querySelector('.semi-chat'));
            fireEvent.drop(container.querySelector('.semi-chat-dropArea'), { dataTransfer: { files: [file] } });
        } else {
            fireEvent.paste(container.querySelector('textarea'), { clipboardData: { items: [{ getAsFile: () => file }] } });
        }
        await waitFor(() => expect(customRequest.calledOnce).toBe(true));
        expect(container.querySelector('.semi-chat-inputBox-uploadButton').closest('span[style="display: none;"]')).toBeTruthy();
    });

    it('does not mount Upload when all upload modes are disabled', () => {
        const { container } = render(<Chat chats={[]} hints={[]} roleConfig={{}} enableUpload={false} />);
        expect(container.querySelector('input[type="file"]')).toBeNull();
    });
});
