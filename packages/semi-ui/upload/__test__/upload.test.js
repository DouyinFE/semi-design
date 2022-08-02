import sleep from '@douyinfe/semi-ui/_test_/utils/function/sleep';
import { IconUser } from '@douyinfe/semi-icons';
import { Upload, Button } from '../../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

let action = 'https://semi.bytendance.com';

const PROGRESS_COEFFICIENT = 0.95;

function getUpload(props, formProps = {}) {
    if (!props.children) {
        props.children = (
            <Button icon={<IconUser />} theme="light">
                点击上传
            </Button>
        );
    }
    if (!props.action) {
        props.action = action;
    }
    return mount(<Upload {...props}></Upload>);
}
function trigger(upload, event) {
    const input = upload.find(`.${BASE_CLASS_PREFIX}-upload-hidden-input`);
    input.simulate('change', event);
}

const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

const createFile = (size = 44320, name = 'semi-logo.png', type = 'image/png') => {
    return new File([new ArrayBuffer(size)], name, {
        type: type,
    });
};

const createEvent = file => {
    let event = { target: { files: [file] } };
    return event;
};

const defaultFileList = [
    {
        uid: '1',
        name: 'vigo.png',
        status: 'success',
        size: '130KB',
        preview: true,
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
    },
    {
        uid: '2',
        name: 'test.jpeg',
        status: 'uploadFail',
        size: '222KB',
        preview: false,
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
    },
];

// TODO
/**
 * 1、unitTest无法测试点击Upload Children自动弹出文件浏览器的case，需要在e2e里完成
 * 2、multiple 属性无法测试，理由同上
 * 3、disabled时点击不弹出文件浏览器的行为无法测试，理由同上
 */

describe('Upload', () => {
    let requests;
    let xhr;
    window.URL.createObjectURL = jest.fn();

    beforeEach(() => {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = req => requests.push(req);
        window.URL.createObjectURL.mockReset();
    });

    afterEach(() => {
        xhr.restore();
    });

    it('className & style', () => {
        let props = {
            className: 'test',
            style: { color: 'red' },
            action: '',
        };
        const upload = getUpload(props);
        expect(upload.find('div.test').length).toEqual(1);
    });

    it('action / withCredentials', () => {
        let props = {
            action,
            withCredentials: true,
            data: { semiKey: 123456 },
        };
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        expect(requests[0].url).toEqual(action);
        expect(requests[0].withCredentials).toEqual(true);
    });

    it('data / headers / name', () => {
        let headers = { 'x-tt-header': 'semi' };
        let name = 'bytedance.jpeg';
        let props = {
            data: { semiKey: 123456 },
            name,
            headers,
        };
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        let requestBody = Array.from(requests[0].requestBody);
        expect(requestBody[0][0]).toEqual('semiKey');
        expect(requestBody[0][1]).toEqual('123456');
        let requestHeaders = requests[0].requestHeaders;
        expect(requestHeaders).toEqual(headers);
        expect(requestBody[1][0]).toEqual(name);
    });

    it('data / headrs : function', () => {
        let headers = { 'x-tt-header': 'semi' };
        let data = { semiKey: 123456 };
        let getHeaders = file => {
            return headers;
        };
        let getData = file => {
            return data;
        };
        let spyGetData = sinon.spy(getData);
        let spyGetHeaders = sinon.spy(getHeaders);
        let props = {
            data: spyGetData,
            headers: spyGetHeaders,
        };
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        // test data
        let requestBody = Array.from(requests[0].requestBody);
        expect(requestBody[0][0]).toEqual('semiKey');
        expect(requestBody[0][1]).toEqual('123456');
        expect(spyGetData.calledOnce).toEqual(true);
        expect(spyGetData.calledWithMatch(file)).toEqual(true);

        // test headers
        let requestHeaders = requests[0].requestHeaders;
        expect(requestHeaders).toEqual(headers);
        expect(spyGetHeaders.calledOnce).toEqual(true);
        expect(spyGetHeaders.calledWithMatch(file)).toEqual(true);
    });

    it('accept', () => {
        let accept = 'application/pdf,image/png,image/jpeg';
        let props = {
            accept,
        };
        const upload = getUpload(props);
        expect(upload.find(`input.${BASE_CLASS_PREFIX}-upload-hidden-input`).instance().accept).toEqual(accept);
    });

    it('minSize / maxSize / onSizeError', () => {
        let kb1 = 1024 * 1024;
        let onSizeError = (file, fileList) => {};
        let spyOnSizeError = sinon.spy(onSizeError);
        let props = {
            maxSize: kb1 * 3,
            minSize: kb1 * 2,
            onSizeError: spyOnSizeError,
        };
        const upload = getUpload(props);
        const bigFile = createFile(kb1 * 4, 'bigSemi.jpeg');
        const smallFile = createFile(kb1, 'smallSemi.jpeg');
        let bigEvent = { target: { files: [bigFile] } };
        let smallEvent = { target: { files: [smallFile] } };

        // choose file over maxSize
        trigger(upload, bigEvent);
        // choose file below minSize
        trigger(upload, smallEvent);
        expect(spyOnSizeError.callCount).toEqual(2);
        let firstCall = spyOnSizeError.getCall(0);
        let secondCall = spyOnSizeError.getCall(1);
        let firstArgs = firstCall.args;
        let secondArgs = secondCall.args;
        // 如果是calledWithMatch({}, []) 这种写法，即使放空object，和空数组也能过，可能只判断了类型？但实际上第一个参数是File
        // 这里借助文件name来判断一下
        expect(firstArgs[0] instanceof File).toEqual(true);
        expect(firstArgs[0].name).toEqual('bigSemi.jpeg');
        expect(Array.isArray(firstArgs[1]) && firstArgs[1].length === 0).toEqual(true);
        // expect(firstCall.calledWithMatch({}, [])).toEqual(true);
        expect(secondArgs[0] instanceof File).toEqual(true);
        expect(secondArgs[0].name).toEqual('smallSemi.jpeg');
        expect(
            Array.isArray(secondArgs[1]) && secondArgs[1].length === 1 && secondArgs[1][0].name === 'bigSemi.jpeg'
        ).toEqual(true);
    });

    it('prompt / promptPosition', () => {
        let prompt = 'Some info for extra text';
        let props = {
            prompt,
            promptPosition: 'right',
        };
        const upload = getUpload(props);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-prompt`).text()).toEqual(prompt);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload`).instance().getAttribute('x-prompt-pos')).toEqual('right');
        upload.setProps({ promptPosition: 'bottom' });
        upload.update();
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload`).instance().getAttribute('x-prompt-pos')).toEqual('bottom');
        upload.setProps({ promptPosition: 'left' });
        upload.update();
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload`).instance().getAttribute('x-prompt-pos')).toEqual('left');
    });

    it('limit / onExceed', () => {
        let onExceed = (file, fileList) => {
            // debugger;
        };
        let spyOnExceed = sinon.spy(onExceed);
        let props = {
            limit: 2,
            onExceed: spyOnExceed,
        };
        const upload = getUpload(props);
        let fileA = createFile(1024, 'fileA');
        let fileB = createFile(1024, 'fileB');
        let fileC = createFile(1024, 'fileC');
        let files = [fileA, fileB, fileC];
        let event = {
            target: { files },
        };
        trigger(upload, event);
        expect(spyOnExceed.calledOnce).toEqual(true);
        // expect(spyOnExceed.calledWithMatch(fileC, files)).toEqual(true);
    });

    it('beforeUpload - return boolean', () => {
        let beforeUpload = ({ file, fileList }) => {
            if (file.name === 'pass.jpg') {
                return true;
            }
            return false;
        };
        let spyBefore = sinon.spy(beforeUpload);
        const props = {
            beforeUpload: spyBefore,
        };
        const upload = getUpload(props);
        let event = createEvent(createFile(10, 'pass.jpg'));
        trigger(upload, event);

        expect(upload.state().fileList[0].name).toEqual('pass.jpg');
        event = createEvent(createFile(20, 'fail.jpg'));
        trigger(upload, event);
        const fileList = upload.state().fileList;
        expect(fileList.length).toEqual(2);
        expect(fileList[0].status === 'uploading').toEqual(true);
        expect(fileList[1].status === 'validateFail').toEqual(true);
        expect(spyBefore.callCount).toEqual(2);
    });

    it('beforeUpload - return object sync', () => {
        // beforeUploadResult:
        // {
        //     fileInstance?: File,
        //     status?: 'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait',
        //     validateMessage?: React.ReactNode | string, // 文件的校验信息
        //     shouldUpload: boolean, // 是否需要上传。默认为true，如果为false，该fileItem只会被展示在列表中，不会触发上传操作
        //     autoRemove?: boolean, // 是否从fileList中移除该文件，默认为false
        // }

        let beforeUpload = ({ file, fileList }) => {
            let result = {
                shouldUpload: false,
                autoRemove: false,
            };
            if (file.name === 'pass.jpg') {
                result.shouldUpload = true;
            }
            if (file.name === 'invalid.jpg') {
                result.validateMessage = 'not valid file';
                result.status = 'validateFail';
            }
            if (file.name === 'autoRemove.jpg') {
                result.autoRemove = true;
            }
            return result;
        };
        let spyBefore = sinon.spy(beforeUpload);
        const props = {
            beforeUpload: spyBefore,
        };
        const upload = getUpload(props);
        // pass a file will pass validate
        let eventA = createEvent(createFile(10, 'pass.jpg'));
        trigger(upload, eventA);

        expect(upload.state().fileList[0].name).toEqual('pass.jpg');

        // pass a file invalid & change it's validateMessage & status
        let eventB = createEvent(createFile(20, 'invalid.jpg'));
        trigger(upload, eventB);

        // pass a file invalid & auto remove this file from fileList
        let eventC = createEvent(createFile(30, 'autoRemove.jpg'));
        trigger(upload, eventC);

        const fileList = upload.state().fileList;

        expect(fileList.length).toEqual(2);
        expect(fileList[0].status === 'uploading').toEqual(true);
        expect(fileList[1].status === 'validateFail').toEqual(true);
        expect(fileList[1].validateMessage === 'not valid file').toEqual(true);
        expect(fileList.every(item => item !== 'autoRemove.jpg')).toEqual(true);
        expect(spyBefore.callCount).toEqual(3);
    });

    // 1、promise reject：not upload file
    // 2、promise resolve: upload file
    // 3、promise reslove / reject object
    it('beforeUpload - return promise', async () => {
        function selectFile(filename, upload) {
            let file = createFile(50, filename);
            let event = createEvent(file);
            trigger(upload, event);
        }
        let beforeUpload = ({ file, fileList }) => {
            let result;
            switch (file.name) {
                case 'reject.jpg':
                    result = new Promise((resolve, reject) => setTimeout(reject, 10));
                    break;
                case 'resolve.jpg':
                    result = new Promise((resolve, reject) => setTimeout(resolve, 10));
                    break;
                case 'resloveObject.jpg':
                    let pro = new Promise((resolve, reject) => {
                        let newFile = createFile(200, 'afterProcess.jpg');
                        let result = {
                            fileInstance: newFile,
                            // shouldUpload: true,
                        };
                        setTimeout(() => resolve(result), 10);
                    });
                    result = pro;
                    break;
                case 'rejectObject.jpg':
                    let pro2 = new Promise((resolve, reject) => {
                        let result = {
                            status: 'validateFail',
                            validateMessage: 'not valid',
                            // shouldUpload: false,
                        };
                        setTimeout(() => reject(result), 10);
                    });
                    result = pro2;
                    break;
                default:
                    break;
            }
            return result;
        };
        let spyBefore = sinon.spy(beforeUpload);
        const props = {
            beforeUpload: spyBefore,
        };
        const upload = getUpload(props);
        selectFile('reject.jpg', upload);
        await sleep(60);
        selectFile('resolve.jpg', upload);
        await sleep(60);
        selectFile('resloveObject.jpg', upload);
        await sleep(60);
        selectFile('rejectObject.jpg', upload);
        await sleep(100);
        expect(spyBefore.callCount).toEqual(4);
        const fileList = upload.state().fileList;
        expect(fileList.length).toEqual(4);
        expect(fileList[0].status === 'validateFail').toEqual(true);
        expect(fileList[1].status === 'uploading').toEqual(true);
        expect(fileList[2].status === 'uploading' && fileList[2].fileInstance.name === 'afterProcess.jpg').toEqual(
            true
        );
        expect(fileList[3].status === 'validateFail' && fileList[3].validateMessage === 'not valid').toEqual(true);
    });

    it('onFileChange', () => {
        let onFileChange = files => {};
        let spyOnFileChange = sinon.spy(onFileChange);
        const props = {
            onFileChange: spyOnFileChange,
        };
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        expect(spyOnFileChange.calledOnce).toEqual(true);
        expect(spyOnFileChange.calledWithMatch([file])).toEqual(true);
    });

    it('onProgress', () => {
        let onProgress = (percent, file, fileList) => {};
        let spyProgress = sinon.spy(onProgress);
        let props = {
            onProgress: spyProgress,
        };
        const server = sinon.fakeServer.create();
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        server.requests[0].uploadProgress({ loaded: 40, total: 100 });
        server.requests[0].uploadProgress({ loaded: 80, total: 100 });
        expect(spyProgress.callCount).toEqual(2);
        expect(spyProgress.getCall(0).calledWithMatch(40 * PROGRESS_COEFFICIENT)).toEqual(true);
        expect(spyProgress.getCall(1).calledWithMatch(80 * PROGRESS_COEFFICIENT)).toEqual(true);
    });

    it('onError', () => {
        let onError = (responseBody, file, fileList, xhr) => {};
        let spyOnError = sinon.spy(onError);
        const props = {
            onError: spyOnError,
        };
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        requests[0].respond(404, { 'Content-Type': 'application/json' }, '[{ "id": 12, "comment": "Hey there" }]');
        expect(spyOnError.calledOnce).toEqual(true);
        const [error, fileInstance, fileList, xhr] = spyOnError.args[0];
        expect(error.method).toEqual('post');
        expect(fileInstance instanceof File).toEqual(true);
        expect(Array.isArray(fileList)).toEqual(true);
        expect(xhr instanceof XMLHttpRequest).toEqual(true);
    });

    it('onRetry', () => {
        const onRetry = f => {};
        const spyOnRetry = sinon.spy(onRetry);
        const fileInstance = createFile(200, 'semi.jpg');
        const file = {
            uid: '2',
            name: 'test.jpeg',
            status: 'uploadFail',
            size: '222KB',
            preview: true,
            fileInstance,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
        };
        const props = {
            fileList: [file],
            onRetry: spyOnRetry,
        };
        const upload = getUpload(props);
        upload.find(`.${BASE_CLASS_PREFIX}-upload-file-card-info-retry`).simulate('click');
        expect(spyOnRetry.calledOnce).toEqual(true);
        const [f] = spyOnRetry.args[0];
        expect(f.fileInstance instanceof File).toEqual(true);
    });

    it('onOpenFileDialog', () => {
        const onOpenFileDialog = () => {};
        const spyOnOpenFileDialog = sinon.spy(onOpenFileDialog);
        const props = {
            onOpenFileDialog: spyOnOpenFileDialog,
        };
        const upload = getUpload(props);
        upload.find(`div.${BASE_CLASS_PREFIX}-upload-add`).simulate('click');
        expect(spyOnOpenFileDialog.calledOnce).toEqual(true);
    });

    it('onSuccess', () => {
        let body = [{ id: 12, comment: 'Hey there' }];
        let onSuccess = (responseBody, file, fileList) => {
            console.log(body);
            // debugger;
        };
        let spyOnSuccess = sinon.spy(onSuccess);
        const props = {
            onSuccess: spyOnSuccess,
        };
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(body));
        expect(spyOnSuccess.calledOnce).toEqual(true);
        // TODO check argument，凡是涉及到fileList的都会failed
        expect(spyOnSuccess.calledWith([{ id: 12, comment: 'Hey there' }], file)).toEqual(true);
    });

    it('onRemove', () => {
        let onRemove = (file, fileList) => {};
        const spyOnRemove = sinon.spy(onRemove);
        let fileInstance = createFile(200, 'semi.jpg');
        let file = {
            uid: '2',
            name: 'test.jpeg',
            status: 'error',
            size: '222KB',
            preview: true,
            fileInstance,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
        };
        let props = {
            defaultFileList: [file],
            onRemove: spyOnRemove,
        };
        const upload = getUpload(props);
        upload.find(`button.${BASE_CLASS_PREFIX}-upload-file-card-close`).simulate('click', {});
        setTimeout(() => {
            expect(spyOnRemove.calledOnce).toEqual(true);
            expect(spyOnRemove.calledOnceWith(fileInstance, [])).toEqual(true);
        });
    });

    it('defaultFileList', () => {
        let props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-file-list`).children().length).toEqual(2);
        // TODO check item name, size, preview
    });

    it('showUploadList', () => {
        let props = {
            showUploadList: false,
            defaultFileList: [
                {
                    uid: '2',
                    name: 'test.jpeg',
                    status: 'error',
                    size: '222KB',
                    preview: true,
                    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
                },
            ],
        };
        const upload = getUpload(props);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-file-list`)).toEqual(false);
    });

    it('listType', () => {
        let props = {
            listType: 'picture',
        };
        const upload = getUpload(props);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload.${BASE_CLASS_PREFIX}-upload-picture`)).toEqual(true);
    });

    it('previewFile', () => {
        let specificContent = <div>2</div>;
        let previewFile = () => specificContent;
        let spyPreview = sinon.spy(previewFile);
        let props = {
            previewFile: spyPreview,
        };
        const upload = getUpload(props);
        let event = { target: { files: [file] } };
        trigger(upload, event);
        requests[0].respond(200, { 'Content-Type': 'application/json' }, 'success');
        const previewContent = upload.find(`.${BASE_CLASS_PREFIX}-upload-file-card-preview`);
        expect(previewContent.contains(specificContent)).toEqual(true);
        upload.unmount();
    });

    it('afterUpload', () => {
        // afterUploadResult:
        // {
        //     status?: 'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait',
        //     validateMessage?: React.ReactNode | string, // 文件的校验信息
        //     autoRemove: boolean, // 是否从fileList中移除该文件，默认为false
        //     name: string,
        // }
        let codeStatusMaps = {
            0: 'success',
            1: 'uploadFail',
            2: 'validateFail',
        };
        let afterUpload = ({ response, file, fileList }) => {
            let result = {};
            result.status = codeStatusMaps[response.code];
            if (response.message) {
                result.validateMessage = response.message;
            }
            if (response.autoRemove) {
                result.autoRemove = true;
            }
            if (response.newName) {
                result.name = response.newName;
            }
            return result;
        };
        let spyAfterUpload = sinon.spy(afterUpload);
        let props = {
            afterUpload: spyAfterUpload,
        };
        const upload = getUpload(props);
        // test status-success
        let eventA = { target: { files: [createFile(234, 'uploadSuccess.jpg')] } };
        let resA = { code: 0 };
        trigger(upload, eventA);
        requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(resA));

        // test status-uploadFail & validateMessage
        let eventB = { target: { files: [createFile(123, 'uploadFail.jpg')] } };
        trigger(upload, eventB);
        let uploadFailMessage = 'upload request fail';
        let resB = { code: 1, message: uploadFailMessage };
        requests[1].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(resB));

        // test status-validateFail  & validateMessage
        let eventC = { target: { files: [createFile(123, 'validateFail.jpg')] } };
        trigger(upload, eventC);
        let validateFailMessage = 'what u upload is invalid';
        let resC = { code: 2, message: validateFailMessage };
        requests[2].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(resC));

        // test autoRemove,  should auto remove this file
        let eventD = { target: { files: [createFile(123, 'remove.jpg')] } };
        trigger(upload, eventD);
        let resD = { code: 2, autoRemove: true };
        requests[3].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(resD));

        // test rename
        let eventE = { target: { files: [createFile(123, 'semi.jpg')] } };
        trigger(upload, eventE);
        let rename = 'renameByAfterUpload.jpg';
        let resE = { code: 1, newName: rename };
        requests[4].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(resE));

        const stateFileList = upload.state().fileList;
        expect(stateFileList.length).toEqual(4);
        expect(stateFileList[0].status === 'success').toEqual(true);
        expect(
            stateFileList[1].status === 'uploadFail' && stateFileList[1].validateMessage === uploadFailMessage
        ).toEqual(true);
        expect(
            stateFileList[2].status === 'validateFail' && stateFileList[2].validateMessage === validateFailMessage
        ).toEqual(true);
        expect(stateFileList.every(item => item.name !== 'remove.jpg')).toEqual(true);
        expect(stateFileList[3].status === 'uploadFail' && stateFileList[3].name === rename).toEqual(true);
        upload.unmount();
    });

    it('uploadTrigger', () => {
        let props = {
            uploadTrigger: 'custom',
        };
        const upload = getUpload(props);
        let eventA = { target: { files: [createFile(234, 'semi.jpg')] } };
        trigger(upload, eventA);
        expect(upload.state().fileList.length).toEqual(1);
        console.log(requests);
        expect(requests.length).toEqual(0);
        upload.instance().upload();
        // only new XHR after trigger upload instance (by ref) method: upload()
        expect(requests.length).toEqual(1);
    });

    it('auto hide trigger when limit & listType="picture"', () => {
        let props = {
            limit: 2,
            listType: 'picture',
            defaultFileList,
        };
        const upload = getUpload(props);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-file-list-main`).children().length).toEqual(2);
    });

    it('showClear', () => {
        let props = {
            defaultFileList,
            showClear: false,
        };
        const upload = getUpload(props);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`)).toEqual(false);

        let props2 = {
            defaultFileList,
        };
        const upload2 = getUpload(props2);
        expect(upload2.exists(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`)).toEqual(true);
    });

    it('showRetry', () => {
        let props = {
            defaultFileList,
            showRetry: false,
        };
        const upload = getUpload(props);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-file-card-info-retry`)).toEqual(false);
    });

    it('validateMessage', () => {
        let props = {
            defaultFileList,
            validateMessage: 'test',
        };
        const upload = getUpload(props);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-validate-message`).text()).toEqual('test');
    });

    it('renderFileItem', () => {
        let props = {
            defaultFileList,
            renderFileItem: fileItem => <div className="customRender">{fileItem.name}</div>,
        };
        const upload = getUpload(props);
        expect(upload.find('.customRender').length).toEqual(2);
        expect(upload.find('.customRender').at(0).text()).toEqual(defaultFileList[0].name);
        expect(upload.find('.customRender').at(1).text()).toEqual(defaultFileList[1].name);
    });

    it('limit=1,file replace', () => {
        let props = {
            limit: 1,
            defaultFileList,
        };
        const upload = getUpload(props);
        const file = createFile(100, 'a.png');
        const event = createEvent(file);
        trigger(upload, event);
        expect(upload.state().fileList.length).toEqual(1);
        expect(upload.state().fileList[0].name).toEqual('a.png');
    });

    it('onAcceptInvalid when file change', () => {
        const fakeOnAcceptInvalid = sinon.spy();
        let props = {
            accept: 'image/png',
            onAcceptInvalid: fakeOnAcceptInvalid,
        };
        const upload = getUpload(props);
        const input = upload.find(`.${BASE_CLASS_PREFIX}-upload-hidden-input`).at(0);
        const file = createFile(100, 'a.jpg', 'image/jpg');
        const event = { target: { files: [file] } };
        input.simulate('change', event);
        const arg = fakeOnAcceptInvalid.firstCall.args[0];
        expect(fakeOnAcceptInvalid.calledOnce).toEqual(true);
        expect(Array.isArray(arg)).toEqual(true);
        expect(arg.length === 1).toEqual(true);
        expect(arg[0].name === 'a.jpg').toEqual(true);
    });

    it('onAcceptInvalid when file replace', () => {
        const fakeOnAcceptInvalid = sinon.spy();
        let props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'vigo.png',
                    status: 'success',
                    size: '130KB',
                    preview: true,
                    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
                },
            ],
            showReplace: true,
            accept: 'image/png',
            onAcceptInvalid: fakeOnAcceptInvalid,
        };
        const upload = getUpload(props);
        const input = upload.find(`.${BASE_CLASS_PREFIX}-upload-hidden-input-replace`).at(0);
        const file = createFile(100, 'a.jpg', 'image/jpg');
        const event = { target: { files: [file] } };
        upload.setState({ replaceIdx: 0 }, () => {
            input.simulate('change', event);
            const arg = fakeOnAcceptInvalid.firstCall.args[0];
            expect(fakeOnAcceptInvalid.calledOnce).toEqual(true);
            expect(Array.isArray(arg)).toEqual(true);
            expect(arg.length === 1).toEqual(true);
            expect(arg[0].name === 'a.jpg').toEqual(true);
        });
    });

    it('beforeRemove effects', () => {
        const props = {
            fileList: [
                {
                    uid: '1',
                    name: 'vigo.png',
                    status: 'success',
                    size: '130KB',
                    preview: true,
                    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
                },
            ],
        };
        const spyOnChange = sinon.spy();
        const spyOnRemove = sinon.spy();

        const spyOnChangePass = sinon.spy();
        const spyOnRemovePass = sinon.spy();

        const upload = getUpload({
            ...props,
            beforeRemove: () => false,
            onChange: spyOnChange,
            onRemove: spyOnRemove,
        });

        const uploadPass = getUpload({
            ...props,
            beforeRemove: () => true,
            onChange: spyOnChangePass,
            onRemove: spyOnRemovePass,
        });

        const removeBtn = upload.find(`.${BASE_CLASS_PREFIX}-upload-file-card-close`).at(0);
        const removeBtnPass = uploadPass.find(`.${BASE_CLASS_PREFIX}-upload-file-card-close`).at(0);

        const event = { target: {} };

        removeBtn.simulate('click', event);
        removeBtnPass.simulate('click', event);

        setTimeout(() => {
            expect(spyOnChange.callCount).toEqual(0);
            expect(spyOnRemove.callCount).toEqual(0);

            expect(spyOnChangePass.callCount).toEqual(1);
            expect(Array.isArray(spyOnChangePass.firstCall.args[0].fileList)).toEqual(true);
            expect(spyOnChangePass.firstCall.args[0].fileList.length).toEqual(0);
            expect(spyOnRemovePass.callCount).toEqual(1);
            expect(spyOnRemovePass.firstCall.args[0].uid).toEqual('1');
        });
    });

    it('beforeClear effects', () => {
        const props = {
            fileList: [
                {
                    uid: '1',
                    name: 'vigo.png',
                    status: 'success',
                    size: '130KB',
                    preview: true,
                    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
                },
            ],
        };
        const spyOnChange = sinon.spy();
        const spyOnClear = sinon.spy();

        const spyOnChangePass = sinon.spy();
        const spyOnClearPass = sinon.spy();

        const spyOnChangeReject = sinon.spy();
        const spyOnClearReject = sinon.spy();

        const upload = getUpload({
            ...props,
            beforeClear: () => Promise.resolve(false),
            onChange: spyOnChange,
            onClear: spyOnClear,
        });

        const uploadPass = getUpload({
            ...props,
            beforeClear: () => Promise.resolve(true),
            onChange: spyOnChangePass,
            onClear: spyOnClearPass,
        });

        const uploadReject = getUpload({
            ...props,
            beforeClear: () => Promise.reject(),
            onChange: spyOnChangeReject,
            onClear: spyOnClearReject,
        });

        const clearBtn = upload.find(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`).at(0);
        const clearBtnPass = uploadPass.find(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`).at(0);
        const clearBtnReject = uploadReject.find(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`).at(0);

        const event = { target: {} };

        clearBtn.simulate('click', event);
        clearBtnPass.simulate('click', event);
        clearBtnReject.simulate('click', event);

        setTimeout(() => {
            expect(spyOnChange.callCount).toEqual(0);
            expect(spyOnClear.callCount).toEqual(0);

            expect(spyOnChangePass.callCount).toEqual(1);
            expect(Array.isArray(spyOnChangePass.firstCall.args[0].fileList)).toEqual(true);
            expect(spyOnChangePass.firstCall.args[0].fileList.length).toEqual(0);

            expect(spyOnChangeReject.callCount).toEqual(0);
            expect(spyOnClearReject.callCount).toEqual(0);
        });
    });

    it('insert method', () => {
        const props = {
            defaultFileList: [],
        };
        const upload = getUpload(props);
        const uploadInstance = upload.instance();

        const file_0 = new File([new ArrayBuffer(1024)], 'chucknorris_0.png', { type: 'image/png' });
        const file_1 = new File([new ArrayBuffer(1024)], 'chucknorris_1.png', { type: 'image/png' });
        const file_2 = new File([new ArrayBuffer(1024)], 'chucknorris_2.png', { type: 'image/png' });

        expect(uploadInstance instanceof Upload).toEqual(true);
        expect(Object.prototype.hasOwnProperty.call(uploadInstance, 'insert')).toEqual(true);

        /**
         * test fileList state should be [] => [file_0] => [file_1, file_0] => [file_1, file_2, file_0]
         */
        upload.instance().insert([file_0]);
        upload.instance().insert([file_1], 0);
        upload.instance().insert([file_2], 1);

        expect(Array.isArray(upload.state('fileList'))).toEqual(true);
        expect(upload.state('fileList').length).toEqual(3);
        expect(upload.state('fileList')[0].name).toEqual('chucknorris_1.png');
        expect(upload.state('fileList')[1].name).toEqual('chucknorris_2.png');
        expect(upload.state('fileList')[2].name).toEqual('chucknorris_0.png');
    });

    it('showPicInfo works', () => {
        const props = {
            listType: 'picture',
            defaultFileList: [
                {
                    uid: '1',
                    name: 'jiafang1.jpeg',
                    status: 'success',
                    size: '130kb',
                    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
                },
            ],
            showPicInfo: true,
        };
        const upload = getUpload(props);

        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload`)).toEqual(true);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-file-list-main`)).toEqual(true);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-picture-file-card-pic-info`)).toEqual(true);
    });
});
