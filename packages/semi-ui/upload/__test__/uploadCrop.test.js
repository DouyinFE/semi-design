import sleep from '@douyinfe/semi-ui/_test_/utils/function/sleep';
import React from 'react';
import { IconUser } from '@douyinfe/semi-icons';
import { Upload, Button } from '../../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

// Smoke tests for the crop feature added in #2889. Lives in its own file so it
// is not affected by stray async side effects from other Upload tests.

const action = 'https://semi.bytendance.com';

function getUpload(props = {}) {
    if (!props.children) {
        props.children = (
            <Button icon={<IconUser />} theme="light">
                upload
            </Button>
        );
    }
    if (!props.action) {
        props.action = action;
    }
    return mount(<Upload {...props} />);
}

function trigger(upload, event) {
    const input = upload.find(`.${BASE_CLASS_PREFIX}-upload-hidden-input`);
    input.simulate('change', event);
}

const createFile = (size = 100, name = 'avatar.png', type = 'image/png') => {
    return new File([new ArrayBuffer(size)], name, { type });
};

describe('Upload crop', () => {
    let xhr;
    let requests;

    beforeAll(() => {
        window.URL.createObjectURL = jest.fn(() => 'blob:mock');
        window.URL.revokeObjectURL = jest.fn();
    });

    beforeEach(() => {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = req => requests.push(req);
        window.URL.createObjectURL.mockImplementation(() => 'blob:mock');
    });

    afterEach(() => {
        xhr.restore();
    });

    it('opens the cropper for image files when crop is enabled', async () => {
        const upload = getUpload({ crop: true });
        trigger(upload, { target: { files: [createFile(100, 'avatar.png', 'image/png')] } });
        await sleep(50);
        upload.update();
        expect(upload.state('cropperVisible')).toBe(true);
        expect(upload.state('cropperFile').name).toBe('avatar.png');
        expect(upload.state('isReplaceOperation')).toBe(false);
        upload.unmount();
    });

    it('skips the cropper for non-image files even when crop is enabled', async () => {
        const upload = getUpload({ crop: true });
        trigger(upload, { target: { files: [createFile(100, 'note.txt', 'text/plain')] } });
        await sleep(50);
        upload.update();
        expect(upload.state('cropperVisible')).toBe(false);
        upload.unmount();
    });

    it('beforeCrop returning false bypasses the cropper', async () => {
        const beforeCrop = jest.fn(() => false);
        const upload = getUpload({ crop: true, beforeCrop });
        trigger(upload, { target: { files: [createFile(100, 'avatar.png', 'image/png')] } });
        await sleep(50);
        upload.update();
        expect(beforeCrop).toHaveBeenCalled();
        expect(upload.state('cropperVisible')).toBe(false);
        upload.unmount();
    });

    it('queues additional images for sequential cropping (not silently dropped)', async () => {
        const upload = getUpload({ crop: true, multiple: true });
        const img1 = createFile(100, 'a.png', 'image/png');
        const img2 = createFile(100, 'b.png', 'image/png');
        const txt = createFile(100, 'note.txt', 'text/plain');
        trigger(upload, { target: { files: [img1, img2, txt] } });
        await sleep(50);
        upload.update();
        expect(upload.state('cropperVisible')).toBe(true);
        expect(upload.state('cropperFile').name).toBe('a.png');
        expect(upload.state('pendingImageFiles').map(f => f.name)).toEqual(['b.png']);
        expect(upload.state('nonImageFiles').map(f => f.name)).toEqual(['note.txt']);
        upload.unmount();
    });

    it('cancelling the crop tears down the queue and resets the file input', async () => {
        const upload = getUpload({ crop: true });
        trigger(upload, { target: { files: [createFile(100, 'avatar.png', 'image/png')] } });
        await sleep(50);
        upload.update();
        const beforeKey = upload.state('inputKey');
        upload.instance().handleCropCancel();
        await sleep(20);
        upload.update();
        expect(upload.state('cropperVisible')).toBe(false);
        expect(upload.state('cropperFile')).toBeNull();
        expect(upload.state('inputKey')).not.toBe(beforeKey);
        upload.unmount();
    });
});
