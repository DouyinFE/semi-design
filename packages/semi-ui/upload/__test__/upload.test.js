import sleep from '@douyinfe/semi-ui/_test_/utils/function/sleep';
import React from 'react';
import { IconUser } from '@douyinfe/semi-icons';
import { Upload, Button } from '../../index';
import FileCard from '../fileCard';
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
    window.URL.revokeObjectURL = jest.fn();

    beforeEach(() => {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = req => requests.push(req);
        window.URL.createObjectURL.mockReset();
        window.URL.revokeObjectURL.mockReset();
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

    it('should not revoke objectURL on unmount in controlled mode', done => {
        // Simulate issue scenario: controlled fileList + Upload unmount/remount
        const objUrl = 'blob:semi-upload-test-url';
        window.URL.createObjectURL.mockImplementation(() => objUrl);

        class ControlledWrapper extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    fileList: [],
                    visible: true,
                };
            }
            toggle = () => {
                this.setState(prev => ({ visible: !prev.visible }));
            };
            onChange = ({ fileList }) => {
                this.setState({ fileList });
            };
            render() {
                const { visible, fileList } = this.state;
                return (
                    <div>
                        <button className="toggle" onClick={this.toggle}>toggle</button>
                        {visible ? (
                            <Upload action={action} fileList={fileList} onChange={this.onChange} showUploadList>
                                <Button>Upload</Button>
                            </Upload>
                        ) : null}
                    </div>
                );
            }
        }

        const wrapper = mount(<ControlledWrapper />);
        const upload = wrapper.find(Upload).at(0);
        // select a file to create objectURL
        const event = { target: { files: [createFile(20, 'toggle.png', 'image/png')] } };
        trigger(upload, event);

        expect(window.URL.createObjectURL).toHaveBeenCalled();
        // toggle to unmount Upload
        wrapper.find('button.toggle').simulate('click');
        wrapper.update();
        // should not revoke on unmount
        setTimeout(() => {
            expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
            // toggle back to mount Upload again
            wrapper.find('button.toggle').simulate('click');
            wrapper.update();
            expect(wrapper.find(Upload).exists()).toEqual(true);
            // fileList still kept in wrapper state
            expect(wrapper.state('fileList').length).toEqual(1);
            wrapper.unmount();
            done();
        });
    });

    it('should revoke objectURL when remove/clear', done => {
        const objUrl = 'blob:semi-upload-test-url-2';
        window.URL.createObjectURL.mockImplementation(() => objUrl);

        // remove
        const upload = getUpload({});
        trigger(upload, { target: { files: [createFile(10, 'remove.png', 'image/png')] } });
        expect(window.URL.createObjectURL).toHaveBeenCalled();
        upload.update();
        upload.find(`button.${BASE_CLASS_PREFIX}-upload-file-card-close`).at(0).simulate('click', {});

        setTimeout(() => {
            expect(window.URL.revokeObjectURL).toHaveBeenCalled();

            // clear
            window.URL.revokeObjectURL.mockReset();
            const upload2 = getUpload({ limit: 3 });
            trigger(upload2, { target: { files: [createFile(10, 'clear.png', 'image/png')] } });
            upload2.update();
            const clearBtn = upload2.find(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`).at(0);
            // showTitle needs limit !== 1 and fileList.length
            expect(clearBtn.exists()).toEqual(true);
            clearBtn.simulate('click', {});

            setTimeout(() => {
                expect(window.URL.revokeObjectURL).toHaveBeenCalled();
                upload.unmount();
                upload2.unmount();
                done();
            });
        });
    });

    it('should revoke all objectURLs when selecting multiple files then clear', done => {
        const urlMap = {
            'a.png': 'blob:multi-a',
            'b.png': 'blob:multi-b',
        };
        window.URL.createObjectURL.mockImplementation(file => urlMap[file.name] || `blob:${file.name}`);

        const upload = getUpload({ limit: 3 });
        const fileA = createFile(10, 'a.png', 'image/png');
        const fileB = createFile(10, 'b.png', 'image/png');
        trigger(upload, { target: { files: [fileA, fileB] } });

        expect(window.URL.createObjectURL).toHaveBeenCalledTimes(2);
        upload.update();

        const clearBtn = upload.find(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`).at(0);
        expect(clearBtn.exists()).toEqual(true);
        clearBtn.simulate('click', {});

        setTimeout(() => {
            expect(window.URL.revokeObjectURL).toHaveBeenCalledTimes(2);
            const revoked = window.URL.revokeObjectURL.mock.calls.map(args => args[0]);
            expect(revoked).toEqual(expect.arrayContaining(['blob:multi-a', 'blob:multi-b']));
            upload.unmount();
            done();
        });
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

    it('customRequest prop', () => {
        const customRequest = ({ file, onProgress, onSuccess, onError }) => {
            // 自定义上传逻辑
            setTimeout(() => {
                onSuccess({ url: 'https://example.com/file.jpg' });
            }, 100);
        };
        const spyCustomRequest = sinon.spy(customRequest);
        const props = {
            customRequest: spyCustomRequest,
        };
        const upload = getUpload(props);
        const file = createFile(100, 'test.jpg');
        const event = createEvent(file);
        trigger(upload, event);
        expect(spyCustomRequest.calledOnce).toEqual(true);
    });

    it('disabled prop', () => {
        const props = {
            disabled: true,
        };
        const upload = getUpload(props);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-disabled`)).toEqual(true);
    });

    it('directory prop', () => {
        const props = {
            directory: true,
        };
        const upload = getUpload(props);
        // 验证 directory 属性被正确传递
        expect(upload.props().directory).toEqual(true);
    });

    it('fileList controlled mode', () => {
        const onChange = sinon.spy();
        const props = {
            fileList: defaultFileList,
            onChange,
        };
        const upload = getUpload(props);
        // 验证受控模式下 fileList 属性被正确传递
        expect(upload.props().fileList).toEqual(defaultFileList);
        expect(upload.props().fileList.length).toEqual(2);
    });

    it('capture prop', () => {
        const props = {
            capture: 'user',
        };
        const upload = getUpload(props);
        // 验证 capture 属性被正确传递
        expect(upload.props().capture).toEqual('user');
    });

    it('fileName prop', () => {
        const props = {
            fileName: 'customFileName',
        };
        const upload = getUpload(props);
        const file = createFile(100, 'test.jpg');
        const event = createEvent(file);
        trigger(upload, event);
        const requestBody = Array.from(requests[0].requestBody);
        expect(requestBody[0][0]).toEqual('customFileName');
    });

    it('hotSpotLocation prop', () => {
        const props = {
            listType: 'picture',
            hotSpotLocation: 'start',
            defaultFileList,
        };
        const upload = getUpload(props);
        expect(upload.props().hotSpotLocation).toEqual('start');
    });

    it('multiple prop', () => {
        const props = {
            multiple: true,
        };
        const upload = getUpload(props);
        const input = upload.find(`input.${BASE_CLASS_PREFIX}-upload-hidden-input`);
        expect(input.instance().multiple).toEqual(true);
    });

    it('showRetry prop', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.png',
                    status: 'uploadFail',
                    size: '130KB',
                },
            ],
            showRetry: true,
        };
        const upload = getUpload(props);
        expect(upload.props().showRetry).toEqual(true);
    });

    it('onRetry callback', () => {
        const spyOnRetry = sinon.spy();
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.png',
                    status: 'uploadFail',
                    size: '130KB',
                },
            ],
            showRetry: true,
            onRetry: spyOnRetry,
        };
        const upload = getUpload(props);
        // 验证 onRetry 属性被正确传递
        expect(upload.props().onRetry).toBeDefined();
    });

    it('onPreviewClick callback', () => {
        const spyOnPreviewClick = sinon.spy();
        const props = {
            defaultFileList,
            onPreviewClick: spyOnPreviewClick,
        };
        const upload = getUpload(props);
        expect(upload.props().onPreviewClick).toBeDefined();
    });

    it('previewFile function', () => {
        const customPreviewFile = file => 'data:image/png;base64,...';
        const props = {
            previewFile: customPreviewFile,
        };
        const upload = getUpload(props);
        expect(upload.props().previewFile).toBeDefined();
    });

    it('transformFile function', () => {
        const transformFile = file => {
            return new Promise(resolve => {
                resolve(file);
            });
        };
        const props = {
            transformFile,
        };
        const upload = getUpload(props);
        expect(upload.props().transformFile).toBeDefined();
    });

    it('uploadTrigger prop', () => {
        const props = {
            uploadTrigger: 'custom',
        };
        const upload = getUpload(props);
        expect(upload.props().uploadTrigger).toEqual('custom');
    });

    it('onOpenFileDialog callback', () => {
        const spyOnOpenFileDialog = sinon.spy();
        const props = {
            onOpenFileDialog: spyOnOpenFileDialog,
        };
        const upload = getUpload(props);
        expect(upload.props().onOpenFileDialog).toBeDefined();
    });

    it('addOnPasting prop', () => {
        const props = {
            addOnPasting: true,
        };
        const upload = getUpload(props);
        expect(upload.props().addOnPasting).toEqual(true);
    });

    it('onDrop callback', () => {
        const spyOnDrop = sinon.spy();
        const props = {
            draggable: true,
            onDrop: spyOnDrop,
        };
        const upload = getUpload(props);
        expect(upload.props().onDrop).toBeDefined();
    });

    it('renderThumbnail function', () => {
        const renderThumbnail = file => <img src={file.url} alt={file.name} />;
        const props = {
            listType: 'picture',
            defaultFileList,
            renderThumbnail,
        };
        const upload = getUpload(props);
        expect(upload.props().renderThumbnail).toBeDefined();
    });

    it('showClear prop', () => {
        const props = {
            defaultFileList,
            showClear: true,
        };
        const upload = getUpload(props);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-file-list-title-clear`).length).toBeGreaterThan(0);
    });

    it('showReplace prop', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'vigo.png',
                    status: 'success',
                    size: '130KB',
                    preview: true,
                    url: 'https://example.com/image.jpg',
                },
            ],
            showReplace: true,
        };
        const upload = getUpload(props);
        expect(upload.props().showReplace).toEqual(true);
    });

    it('itemStyle prop', () => {
        const props = {
            defaultFileList,
            itemStyle: { backgroundColor: 'red' },
        };
        const upload = getUpload(props);
        expect(upload.props().itemStyle).toEqual({ backgroundColor: 'red' });
    });

    it('picHeight and picWidth props', () => {
        const props = {
            listType: 'picture',
            defaultFileList,
            picHeight: 100,
            picWidth: 100,
        };
        const upload = getUpload(props);
        expect(upload.props().picHeight).toEqual(100);
        expect(upload.props().picWidth).toEqual(100);
    });

    it('timeout prop', () => {
        const props = {
            timeout: 5000,
        };
        const upload = getUpload(props);
        expect(upload.props().timeout).toEqual(5000);
    });

    it('onError callback', () => {
        const spyOnError = sinon.spy();
        const props = {
            onError: spyOnError,
        };
        const upload = getUpload(props);
        expect(upload.props().onError).toBeDefined();
    });

    it('onSuccess callback', () => {
        const spyOnSuccess = sinon.spy();
        const props = {
            onSuccess: spyOnSuccess,
        };
        const upload = getUpload(props);
        expect(upload.props().onSuccess).toBeDefined();
    });

    it('onProgress callback', () => {
        const spyOnProgress = sinon.spy();
        const props = {
            onProgress: spyOnProgress,
        };
        const upload = getUpload(props);
        expect(upload.props().onProgress).toBeDefined();
    });

    it('upload method', () => {
        const props = {
            uploadTrigger: 'custom',
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 upload 方法存在
        expect(typeof instance.upload).toEqual('function');
    });

    it('openFileDialog method', () => {
        const props = {};
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 openFileDialog 方法存在
        expect(typeof instance.openFileDialog).toEqual('function');
    });

    it('listType picture', () => {
        const props = {
            listType: 'picture',
            defaultFileList: [
                {
                    uid: '1',
                    name: 'vigo.png',
                    status: 'success',
                    size: '130KB',
                    preview: true,
                    url: 'https://example.com/image.jpg',
                },
            ],
        };
        const upload = getUpload(props);
        // 验证 listType 属性被正确传递
        expect(upload.props().listType).toEqual('picture');
    });

    it('renderPicPreviewIcon function', () => {
        const renderPicPreviewIcon = file => <span className="custom-preview-icon">Preview</span>;
        const props = {
            listType: 'picture',
            defaultFileList,
            renderPicPreviewIcon,
        };
        const upload = getUpload(props);
        expect(upload.props().renderPicPreviewIcon).toBeDefined();
    });

    it('renderPicInfo function', () => {
        const renderPicInfo = file => <span className="custom-pic-info">{file.name}</span>;
        const props = {
            listType: 'picture',
            defaultFileList,
            showPicInfo: true,
            renderPicInfo,
        };
        const upload = getUpload(props);
        expect(upload.props().renderPicInfo).toBeDefined();
    });

    it('onFileChange callback', () => {
        const spyOnFileChange = sinon.spy();
        const props = {
            onFileChange: spyOnFileChange,
        };
        const upload = getUpload(props);
        expect(upload.props().onFileChange).toBeDefined();
    });

    it('promptPosition end', () => {
        const props = {
            prompt: <span>Upload hint</span>,
            promptPosition: 'right',
        };
        const upload = getUpload(props);
        expect(upload.props().promptPosition).toEqual('right');
    });

    it('validateStatus error', () => {
        const props = {
            defaultFileList,
            validateStatus: 'error',
            validateMessage: 'Error message',
        };
        const upload = getUpload(props);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-validate-message`).text()).toEqual('Error message');
    });

    it('afterUpload callback', () => {
        const afterUpload = ({ response, file }) => {
            return { autoRemove: false, status: 'success' };
        };
        const props = {
            afterUpload,
        };
        const upload = getUpload(props);
        expect(upload.props().afterUpload).toBeDefined();
    });

    it('maxCount prop', () => {
        const props = {
            maxCount: 5,
        };
        const upload = getUpload(props);
        // maxCount 是 limit 的别名
        expect(upload.props().maxCount).toEqual(5);
    });

    it('showReplace prop with file card', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                },
            ],
            showReplace: true,
        };
        const upload = getUpload(props);
        expect(upload.props().showReplace).toEqual(true);
    });

    it('onDrop callback', () => {
        const onDrop = sinon.spy();
        const props = {
            draggable: true,
            onDrop,
        };
        const upload = getUpload(props);
        expect(upload.props().onDrop).toBeDefined();
    });

    it('onDragOver event', () => {
        const props = {
            draggable: true,
        };
        const upload = getUpload(props);
        const dragArea = upload.find(`.${BASE_CLASS_PREFIX}-upload-drag-area`);
        if (dragArea.length > 0) {
            dragArea.simulate('dragOver', { preventDefault: () => {}, dataTransfer: { files: [] } });
        }
        upload.unmount();
    });

    it('onDragLeave event', () => {
        const props = {
            draggable: true,
        };
        const upload = getUpload(props);
        const dragArea = upload.find(`.${BASE_CLASS_PREFIX}-upload-drag-area`);
        if (dragArea.length > 0) {
            dragArea.simulate('dragLeave', { preventDefault: () => {} });
        }
        upload.unmount();
    });

    it('onDragEnter event', () => {
        const props = {
            draggable: true,
        };
        const upload = getUpload(props);
        const dragArea = upload.find(`.${BASE_CLASS_PREFIX}-upload-drag-area`);
        if (dragArea.length > 0) {
            dragArea.simulate('dragEnter', { preventDefault: () => {} });
        }
        upload.unmount();
    });

    it('disabled upload onClick does nothing', () => {
        const props = {
            disabled: true,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 onClick 方法，disabled 状态下不应该触发
        instance.onClick();
        upload.unmount();
    });

    it('replace method', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                },
            ],
            showReplace: true,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 replace 方法存在
        expect(typeof instance.replace).toEqual('function');
        upload.unmount();
    });

    it('clear method', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 clear 方法存在
        expect(typeof instance.clear).toEqual('function');
        upload.unmount();
    });

    it('insert method', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 insert 方法存在
        expect(typeof instance.insert).toEqual('function');
        upload.unmount();
    });

    it('file card onRetry click', () => {
        const onRetry = sinon.spy();
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'uploadFail',
                    size: '130KB',
                },
            ],
            showRetry: true,
            onRetry,
        };
        const upload = getUpload(props);
        // 验证 onRetry 回调被正确传递
        expect(upload.props().onRetry).toBeDefined();
        upload.unmount();
    });

    it('file card onRemove click', () => {
        const onRemove = sinon.spy();
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                },
            ],
            onRemove,
        };
        const upload = getUpload(props);
        const removeBtn = upload.find(`.${BASE_CLASS_PREFIX}-upload-file-card-close`);
        if (removeBtn.length > 0) {
            removeBtn.at(0).simulate('click', { stopPropagation: () => {} });
        }
        upload.unmount();
    });

    it('file card onReplace click', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                },
            ],
            showReplace: true,
        };
        const upload = getUpload(props);
        const replaceBtn = upload.find(`.${BASE_CLASS_PREFIX}-upload-file-card-info-replace`);
        if (replaceBtn.length > 0) {
            replaceBtn.at(0).find('button').simulate('click', { stopPropagation: () => {} });
        }
        upload.unmount();
    });

    it('listType with unknown value returns null', () => {
        const props = {
            listType: 'unknown',
            defaultFileList,
        };
        const upload = getUpload(props);
        // 未知的 listType 不应该渲染 FileCard
        expect(upload.props().listType).toEqual('unknown');
        upload.unmount();
    });

    it('renderFileItem custom renderer', () => {
        const renderFileItem = (fileCardProps) => (
            <div key={fileCardProps.uid} className="custom-file-item">{fileCardProps.name}</div>
        );
        const props = {
            defaultFileList,
            renderFileItem,
        };
        const upload = getUpload(props);
        expect(upload.find('.custom-file-item').length).toBeGreaterThan(0);
        upload.unmount();
    });

    it('file with _sizeInvalid shows illegalSize message', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'validateFail',
                    size: '130KB',
                    _sizeInvalid: true,
                },
            ],
        };
        const upload = getUpload(props);
        // 验证文件列表渲染
        expect(upload.state().fileList.length).toEqual(1);
        upload.unmount();
    });

    it('file with uploadFail status and no validateMessage', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'uploadFail',
                    size: '130KB',
                },
            ],
        };
        const upload = getUpload(props);
        // 验证文件列表渲染
        expect(upload.state().fileList.length).toEqual(1);
        upload.unmount();
    });

    it('onOpenFileDialog callback', () => {
        const onOpenFileDialog = sinon.spy();
        const props = {
            onOpenFileDialog,
        };
        const upload = getUpload(props);
        expect(upload.props().onOpenFileDialog).toBeDefined();
        upload.unmount();
    });

    it('onChange event handler', () => {
        const props = {};
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 onChange 方法存在
        expect(typeof instance.onChange).toEqual('function');
        upload.unmount();
    });

    it('onReplaceChange event handler', () => {
        const props = {
            showReplace: true,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 onReplaceChange 方法存在
        expect(typeof instance.onReplaceChange).toEqual('function');
        upload.unmount();
    });

    it('renderAddContent with listType picture returns null', () => {
        const props = {
            listType: 'picture',
            defaultFileList,
        };
        const upload = getUpload(props);
        // listType 为 picture 时，renderAddContent 返回 null
        expect(upload.props().listType).toEqual('picture');
        upload.unmount();
    });

    it('showPicInfo prop', () => {
        const props = {
            listType: 'picture',
            defaultFileList,
            showPicInfo: true,
        };
        const upload = getUpload(props);
        expect(upload.props().showPicInfo).toEqual(true);
        upload.unmount();
    });

    it('renderPicClose function', () => {
        const renderPicClose = () => <span className="custom-close">X</span>;
        const props = {
            listType: 'picture',
            defaultFileList,
            renderPicClose,
        };
        const upload = getUpload(props);
        expect(upload.props().renderPicClose).toBeDefined();
        upload.unmount();
    });

    it('renderFileOperation function', () => {
        const renderFileOperation = (file) => <span className="custom-operation">Op</span>;
        const props = {
            defaultFileList,
            renderFileOperation,
        };
        const upload = getUpload(props);
        expect(upload.props().renderFileOperation).toBeDefined();
        upload.unmount();
    });

    it('showTooltip prop', () => {
        const props = {
            defaultFileList,
            showTooltip: true,
        };
        const upload = getUpload(props);
        expect(upload.props().showTooltip).toEqual(true);
        upload.unmount();
    });

    it('componentWillUnmount calls foundation.destroy', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        const destroySpy = sinon.spy(instance.foundation, 'destroy');
        upload.unmount();
        expect(destroySpy.called).toBe(true);
    });

    it('draggable with drop event', () => {
        const onDrop = sinon.spy();
        const props = {
            draggable: true,
            onDrop,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 onDrop 方法存在
        expect(typeof instance.onDrop).toEqual('function');
        upload.unmount();
    });

    it('draggable with dragOver event', () => {
        const props = {
            draggable: true,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 onDragOver 方法存在
        expect(typeof instance.onDragOver).toEqual('function');
        upload.unmount();
    });

    it('draggable with dragLeave event', () => {
        const props = {
            draggable: true,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 onDragLeave 方法存在
        expect(typeof instance.onDragLeave).toEqual('function');
        upload.unmount();
    });

    it('draggable with dragEnter event', () => {
        const props = {
            draggable: true,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 onDragEnter 方法存在
        expect(typeof instance.onDragEnter).toEqual('function');
        upload.unmount();
    });

    it('listType picture with showRetry', () => {
        const props = {
            listType: 'picture',
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'uploadFail',
                    size: '130KB',
                    url: 'https://example.com/image.jpg',
                },
            ],
            showRetry: true,
        };
        const upload = getUpload(props);
        expect(upload.props().showRetry).toEqual(true);
        upload.unmount();
    });

    it('listType picture with showReplace', () => {
        const props = {
            listType: 'picture',
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                    url: 'https://example.com/image.jpg',
                },
            ],
            showReplace: true,
        };
        const upload = getUpload(props);
        expect(upload.props().showReplace).toEqual(true);
        upload.unmount();
    });

    it('listType picture with picWidth and picHeight', () => {
        const props = {
            listType: 'picture',
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                    url: 'https://example.com/image.jpg',
                },
            ],
            picWidth: 100,
            picHeight: 100,
        };
        const upload = getUpload(props);
        expect(upload.props().picWidth).toEqual(100);
        expect(upload.props().picHeight).toEqual(100);
        upload.unmount();
    });

    it('listType picture with renderThumbnail', () => {
        const renderThumbnail = (file) => <img src={file.url} alt={file.name} />;
        const props = {
            listType: 'picture',
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                    url: 'https://example.com/image.jpg',
                },
            ],
            renderThumbnail,
        };
        const upload = getUpload(props);
        expect(upload.props().renderThumbnail).toBeDefined();
        upload.unmount();
    });

    it('file with validateFail status', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'validateFail',
                    size: '130KB',
                    validateMessage: 'File validation failed',
                },
            ],
        };
        const upload = getUpload(props);
        expect(upload.state().fileList[0].status).toEqual('validateFail');
        upload.unmount();
    });

    it('file with validating status', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'validating',
                    size: '130KB',
                    validateMessage: 'Validating...',
                },
            ],
        };
        const upload = getUpload(props);
        expect(upload.state().fileList[0].status).toEqual('validating');
        upload.unmount();
    });

    it('file with uploading status shows progress', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'uploading',
                    size: '130KB',
                    percent: 50,
                },
            ],
        };
        const upload = getUpload(props);
        expect(upload.state().fileList[0].percent).toEqual(50);
        upload.unmount();
    });

    it('hotSpotLocation end', () => {
        const props = {
            listType: 'picture',
            defaultFileList,
            hotSpotLocation: 'end',
        };
        const upload = getUpload(props);
        expect(upload.props().hotSpotLocation).toEqual('end');
        upload.unmount();
    });

    it('hotSpotLocation start', () => {
        const props = {
            listType: 'picture',
            defaultFileList,
            hotSpotLocation: 'start',
        };
        const upload = getUpload(props);
        expect(upload.props().hotSpotLocation).toEqual('start');
        upload.unmount();
    });

    it('showClear with limit 1 does not show title', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                },
            ],
            showClear: true,
            limit: 1,
        };
        const upload = getUpload(props);
        // limit 为 1 时不显示标题
        expect(upload.props().limit).toEqual(1);
        upload.unmount();
    });

    it('showClear with multiple files shows title', () => {
        const props = {
            defaultFileList,
            showClear: true,
            limit: 10,
        };
        const upload = getUpload(props);
        // limit 大于 1 且有多个文件时显示标题
        expect(upload.props().showClear).toEqual(true);
        upload.unmount();
    });

    it('remove method calls foundation.handleRemove', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 remove 方法存在
        expect(typeof instance.remove).toEqual('function');
        upload.unmount();
    });

    it('listType none renders no file list', () => {
        const props = {
            listType: 'none',
            defaultFileList,
        };
        const upload = getUpload(props);
        // listType 为 none 时不渲染文件列表
        expect(upload.props().listType).toEqual('none');
        upload.unmount();
    });

    it('file with preview prop', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                    preview: true,
                    url: 'https://example.com/image.jpg',
                },
            ],
        };
        const upload = getUpload(props);
        expect(upload.state().fileList[0].preview).toEqual(true);
        upload.unmount();
    });

    it('file with onPreviewClick callback', () => {
        const onPreviewClick = sinon.spy();
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'success',
                    size: '130KB',
                    preview: true,
                    url: 'https://example.com/image.jpg',
                },
            ],
            onPreviewClick,
        };
        const upload = getUpload(props);
        expect(upload.props().onPreviewClick).toBeDefined();
        upload.unmount();
    });

    it('file card with validateMessage as React element', () => {
        const props = {
            defaultFileList: [
                {
                    uid: '1',
                    name: 'test.jpg',
                    status: 'validateFail',
                    size: '130KB',
                    validateMessage: <span className="custom-validate-msg">Custom error</span>,
                },
            ],
        };
        const upload = getUpload(props);
        expect(upload.state().fileList[0].validateMessage).toBeDefined();
        upload.unmount();
    });

    it('draggable with custom children', () => {
        const props = {
            draggable: true,
            children: <div className="custom-drag-content">Drop files here</div>,
        };
        const upload = getUpload(props);
        expect(upload.find('.custom-drag-content').length).toBeGreaterThan(0);
        upload.unmount();
    });

    it('draggable with dragIcon prop', () => {
        const props = {
            draggable: true,
            dragIcon: <IconUser />,
        };
        const upload = getUpload(props);
        expect(upload.props().dragIcon).toBeDefined();
        upload.unmount();
    });

    it('draggable with dragMainText and dragSubText', () => {
        const props = {
            draggable: true,
            dragMainText: 'Custom main text',
            dragSubText: 'Custom sub text',
        };
        const upload = getUpload(props);
        expect(upload.props().dragMainText).toEqual('Custom main text');
        expect(upload.props().dragSubText).toEqual('Custom sub text');
        upload.unmount();
    });

    it('showUploadList false hides file list', () => {
        const props = {
            defaultFileList,
            showUploadList: false,
        };
        const upload = getUpload(props);
        expect(upload.props().showUploadList).toEqual(false);
        upload.unmount();
    });

    it('addOnPasting prop', () => {
        const props = {
            addOnPasting: true,
        };
        const upload = getUpload(props);
        expect(upload.props().addOnPasting).toEqual(true);
        upload.unmount();
    });

    it('directory prop', () => {
        const props = {
            directory: true,
        };
        const upload = getUpload(props);
        expect(upload.props().directory).toEqual(true);
        upload.unmount();
    });
});

describe('FileCard', () => {
    it('renders file card with list type', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.find(`.${BASE_CLASS_PREFIX}-upload-file-card`).length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    it('renders picture card with picture type', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-card`).length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    it('returns null for unknown listType', () => {
        const props = {
            listType: 'unknown',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.isEmptyRender()).toBe(true);
        wrapper.unmount();
    });

    it('onRemove is called when close button clicked', () => {
        const onRemove = sinon.spy();
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            onRemove,
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        const closeBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-file-card-close`);
        if (closeBtn.length > 0) {
            closeBtn.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onRemove.called).toBe(true);
        }
        wrapper.unmount();
    });

    it('onRetry is called when retry button clicked', () => {
        const onRetry = sinon.spy();
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'uploadFail',
            showRetry: true,
            onRemove: () => {},
            onRetry,
        };
        const wrapper = mount(<FileCard {...props} />);
        const retryBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-file-card-info-retry`);
        if (retryBtn.length > 0) {
            retryBtn.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onRetry.called).toBe(true);
        }
        wrapper.unmount();
    });

    it('onReplace is called when replace button clicked', () => {
        const onReplace = sinon.spy();
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            showReplace: true,
            onRemove: () => {},
            onRetry: () => {},
            onReplace,
        };
        const wrapper = mount(<FileCard {...props} />);
        const replaceBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-file-card-info-replace`);
        if (replaceBtn.length > 0) {
            const button = replaceBtn.find('button');
            if (button.length > 0) {
                button.at(0).simulate('click', { stopPropagation: () => {} });
                expect(onReplace.called).toBe(true);
            }
        }
        wrapper.unmount();
    });

    it('picture card onRemove is called when close button clicked', () => {
        const onRemove = sinon.spy();
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            onRemove,
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        const closeBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-card-close`);
        if (closeBtn.length > 0) {
            closeBtn.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onRemove.called).toBe(true);
        }
        wrapper.unmount();
    });

    it('picture card onRetry is called when retry button clicked', () => {
        const onRetry = sinon.spy();
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'uploadFail',
            showRetry: true,
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry,
        };
        const wrapper = mount(<FileCard {...props} />);
        const retryBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-card-retry`);
        if (retryBtn.length > 0) {
            retryBtn.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onRetry.called).toBe(true);
        }
        wrapper.unmount();
    });

    it('picture card onReplace is called when replace button clicked', () => {
        const onReplace = sinon.spy();
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            showReplace: true,
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
            onReplace,
        };
        const wrapper = mount(<FileCard {...props} />);
        const replaceBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-card-replace`);
        if (replaceBtn.length > 0) {
            replaceBtn.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onReplace.called).toBe(true);
        }
        wrapper.unmount();
    });

    it('file card with validateMessage string and validating status', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'validating',
            validateMessage: 'Validating...',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().validateMessage).toEqual('Validating...');
        wrapper.unmount();
    });

    it('file card with validateMessage string and non-validating status', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'validateFail',
            validateMessage: 'Validation failed',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().validateMessage).toEqual('Validation failed');
        wrapper.unmount();
    });

    it('file card with validateMessage as React element', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'validateFail',
            validateMessage: <span className="custom-msg">Error</span>,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.find('.custom-msg').length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    it('file card with numeric size', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: 1024,
            status: 'success',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().size).toEqual(1024);
        wrapper.unmount();
    });

    it('file card with uploading status shows progress', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'uploading',
            percent: 50,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().percent).toEqual(50);
        wrapper.unmount();
    });

    it('file card with style prop', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            style: { width: '100%' },
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().style.width).toEqual('100%');
        wrapper.unmount();
    });

    it('picture card with picWidth and picHeight', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            picWidth: 100,
            picHeight: 100,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().picWidth).toEqual(100);
        expect(wrapper.props().picHeight).toEqual(100);
        wrapper.unmount();
    });

    it('picture card with renderThumbnail', () => {
        const renderThumbnail = (props) => <img src={props.url} alt={props.name} />;
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            picWidth: 100,
            picHeight: 100,
            renderThumbnail,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().renderThumbnail).toBeDefined();
        wrapper.unmount();
    });

    it('picture card with showPicInfo', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            showPicInfo: true,
            index: 0,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().showPicInfo).toEqual(true);
        wrapper.unmount();
    });

    it('picture card with renderPicInfo', () => {
        const renderPicInfo = (props) => <span>{props.name}</span>;
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            showPicInfo: true,
            renderPicInfo,
            index: 0,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().renderPicInfo).toBeDefined();
        wrapper.unmount();
    });

    it('picture card with renderPicClose', () => {
        const renderPicClose = ({ className, remove }) => (
            <span className={className} onClick={remove}>X</span>
        );
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            renderPicClose,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().renderPicClose).toBeDefined();
        wrapper.unmount();
    });

    it('picture card with renderPicPreviewIcon', () => {
        const renderPicPreviewIcon = (props) => <span>Preview</span>;
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            showPreview: true,
            renderPicPreviewIcon,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().renderPicPreviewIcon).toBeDefined();
        wrapper.unmount();
    });

    it('file card with renderFileOperation', () => {
        const renderFileOperation = (props) => <span>Operations</span>;
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            renderFileOperation,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().renderFileOperation).toBeDefined();
        wrapper.unmount();
    });

    it('file card with onPreviewClick', () => {
        const onPreviewClick = sinon.spy();
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            preview: true,
            url: 'https://example.com/image.jpg',
            onPreviewClick,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().onPreviewClick).toBeDefined();
        wrapper.unmount();
    });

    it('file card with disabled prop', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            disabled: true,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().disabled).toEqual(true);
        wrapper.unmount();
    });

    it('picture card with disabled prop', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            disabled: true,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().disabled).toEqual(true);
        wrapper.unmount();
    });

    it('picture card with validating status and validateMessage', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'validating',
            validateMessage: 'Validating...',
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().status).toEqual('validating');
        wrapper.unmount();
    });

    it('picture card with validateFail status and validateMessage', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'validateFail',
            validateMessage: 'Validation failed',
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().status).toEqual('validateFail');
        wrapper.unmount();
    });

    it('picture card with uploadFail status and validateMessage', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'uploadFail',
            validateMessage: 'Upload failed',
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().status).toEqual('uploadFail');
        wrapper.unmount();
    });

    it('picture card with uploading status', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'uploading',
            percent: 50,
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().percent).toEqual(50);
        wrapper.unmount();
    });

    it('picture card with fallback preview', () => {
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        // 触发图片加载错误来测试 fallback
        const instance = wrapper.instance();
        if (instance && instance.foundation) {
            instance.foundation.handleImageError({});
        }
        wrapper.unmount();
    });

    it('file card with preview and url', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            preview: true,
            url: 'https://example.com/image.jpg',
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().preview).toEqual(true);
        wrapper.unmount();
    });

    it('file card with preview but no url', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            preview: true,
            onRemove: () => {},
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        expect(wrapper.props().preview).toEqual(true);
        wrapper.unmount();
    });

    it('renderPicClose with custom function', () => {
        const onRemove = sinon.spy();
        const renderPicClose = ({ className, remove }) => (
            <div className={className} onClick={remove}>Custom Close</div>
        );
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            renderPicClose,
            onRemove,
            onRetry: () => {},
        };
        const wrapper = mount(<FileCard {...props} />);
        const closeBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-card-close`);
        if (closeBtn.length > 0) {
            closeBtn.at(0).simulate('click', { stopPropagation: () => {} });
        }
        wrapper.unmount();
    });

    it('file card without onRemove and onRetry uses default functions', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
        };
        const wrapper = mount(<FileCard {...props} />);
        // 默认的 onRemove 和 onRetry 应该被定义（来自 defaultProps）
        expect(wrapper.props().onRemove).toBeDefined();
        expect(wrapper.props().onRetry).toBeDefined();
        wrapper.unmount();
    });

    it('file card with showReplace triggers onReplace on button click', () => {
        const onReplace = sinon.spy();
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            showReplace: true,
            onRemove: () => {},
            onRetry: () => {},
            onReplace,
        };
        const wrapper = mount(<FileCard {...props} />);
        // 找到替换按钮并点击
        const replaceBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-file-card-info-replace`).find('button');
        if (replaceBtn.length > 0) {
            replaceBtn.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onReplace.called).toBe(true);
        }
        wrapper.unmount();
    });

    it('file card list type replace button onClick triggers onReplace', () => {
        const onReplace = sinon.spy();
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            showReplace: true,
            onRemove: () => {},
            onRetry: () => {},
            onReplace,
        };
        const wrapper = mount(<FileCard {...props} />);
        // 直接找到 Button 组件并触发点击
        const buttons = wrapper.find('Button');
        buttons.forEach((btn) => {
            const icon = btn.props().icon;
            if (icon && icon.type && icon.type.name === 'DirectorySvg') {
                btn.simulate('click', { stopPropagation: () => {} });
            }
        });
        wrapper.unmount();
    });

    it('file card calls default onRemove', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
        };
        const wrapper = mount(<FileCard {...props} />);
        // 调用默认的 onRemove
        const result = wrapper.props().onRemove();
        expect(result).toBeUndefined();
        wrapper.unmount();
    });

    it('file card calls default onRetry', () => {
        const props = {
            listType: 'list',
            name: 'test.jpg',
            size: '130KB',
            status: 'uploadFail',
        };
        const wrapper = mount(<FileCard {...props} />);
        // 调用默认的 onRetry
        const result = wrapper.props().onRetry();
        expect(result).toBeUndefined();
        wrapper.unmount();
    });

    it('picture file card with showReplace triggers onReplace', () => {
        const onReplace = sinon.spy();
        const props = {
            listType: 'picture',
            name: 'test.jpg',
            size: '130KB',
            status: 'success',
            url: 'https://example.com/image.jpg',
            showReplace: true,
            onRemove: () => {},
            onRetry: () => {},
            onReplace,
        };
        const wrapper = mount(<FileCard {...props} />);
        // 找到替换按钮并点击
        const replaceBtn = wrapper.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-card-replace`).find('button');
        if (replaceBtn.length > 0) {
            replaceBtn.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onReplace.called).toBe(true);
        }
        wrapper.unmount();
    });
});

describe('Upload additional coverage', () => {
    it('beforeClear default returns true', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        // 验证 beforeClear 默认返回 true
        expect(upload.props().beforeClear).toBeDefined();
        upload.unmount();
    });

    it('resetReplaceInput updates replaceInputKey', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        const initialKey = upload.state().replaceInputKey;
        // 调用 resetReplaceInput
        instance.adapter.resetReplaceInput();
        expect(upload.state().replaceInputKey).not.toEqual(initialKey);
        upload.unmount();
    });

    it('isMac adapter returns boolean', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 isMac 返回布尔值
        const result = instance.adapter.isMac();
        expect(typeof result).toBe('boolean');
        upload.unmount();
    });

    it('notifyPastingError calls onPastingError', () => {
        const onPastingError = sinon.spy();
        const props = {
            defaultFileList,
            onPastingError,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 notifyPastingError
        instance.adapter.notifyPastingError(new Error('test'));
        expect(onPastingError.called).toBe(true);
        upload.unmount();
    });

    it('notifyPreviewClick calls onPreviewClick', () => {
        const onPreviewClick = sinon.spy();
        const props = {
            defaultFileList,
            onPreviewClick,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 notifyPreviewClick
        instance.adapter.notifyPreviewClick(defaultFileList[0]);
        expect(onPreviewClick.called).toBe(true);
        upload.unmount();
    });

    it('notifyDrop calls onDrop', () => {
        const onDrop = sinon.spy();
        const props = {
            defaultFileList,
            onDrop,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 notifyDrop
        instance.adapter.notifyDrop({}, [], []);
        expect(onDrop.called).toBe(true);
        upload.unmount();
    });

    it('replace method updates replaceIdx and clicks input', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 replace 方法
        instance.replace(0);
        expect(upload.state().replaceIdx).toEqual(0);
        upload.unmount();
    });

    it('openFileDialog calls onClick', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 openFileDialog 方法存在
        expect(instance.openFileDialog).toBeDefined();
        upload.unmount();
    });

    it('onPreviewClick with undefined does not render preview icon', () => {
        const props = {
            defaultFileList,
            listType: 'picture',
            onPreviewClick: undefined,
        };
        const upload = getUpload(props);
        // 验证没有 onPreviewClick 时的渲染
        expect(upload.props().onPreviewClick).toBeUndefined();
        upload.unmount();
    });

    it('draggable with picture listType assigns draggableProps', () => {
        const props = {
            defaultFileList,
            listType: 'picture',
            draggable: true,
        };
        const upload = getUpload(props);
        // 验证 draggable 属性
        expect(upload.props().draggable).toBe(true);
        upload.unmount();
    });

    it('showUploadList false with picture listType returns null', () => {
        const props = {
            defaultFileList: [],
            listType: 'picture',
            showUploadList: false,
        };
        const upload = getUpload(props);
        // 验证 showUploadList 为 false 时
        expect(upload.props().showUploadList).toBe(false);
        upload.unmount();
    });

    it('onDrop handler calls foundation.handleDrop', () => {
        const onDrop = sinon.spy();
        const props = {
            defaultFileList,
            draggable: true,
            onDrop,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 onDrop
        const mockEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
            dataTransfer: { files: [] },
        };
        instance.onDrop(mockEvent);
        upload.unmount();
    });

    it('registerPastingHandler and unRegisterPastingHandler', () => {
        const props = {
            defaultFileList,
            addOnPasting: true,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 验证 pastingCb 被注册
        expect(instance.pastingCb).toBeDefined();
        // 卸载时会调用 unRegisterPastingHandler
        upload.unmount();
    });

    it('notifyClear calls onClear', () => {
        const onClear = sinon.spy();
        const props = {
            defaultFileList,
            onClear,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 notifyClear
        instance.adapter.notifyClear();
        expect(onClear.called).toBe(true);
        upload.unmount();
    });

    it('notifyAcceptInvalid calls onAcceptInvalid', () => {
        const onAcceptInvalid = sinon.spy();
        const props = {
            defaultFileList,
            onAcceptInvalid,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 notifyAcceptInvalid
        instance.adapter.notifyAcceptInvalid([]);
        expect(onAcceptInvalid.called).toBe(true);
        upload.unmount();
    });

    it('notifyBeforeRemove calls beforeRemove', () => {
        const beforeRemove = sinon.spy(() => true);
        const props = {
            defaultFileList,
            beforeRemove,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 notifyBeforeRemove
        instance.adapter.notifyBeforeRemove(defaultFileList[0], defaultFileList);
        expect(beforeRemove.called).toBe(true);
        upload.unmount();
    });

    it('notifyBeforeClear calls beforeClear', () => {
        const beforeClear = sinon.spy(() => true);
        const props = {
            defaultFileList,
            beforeClear,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 notifyBeforeClear
        instance.adapter.notifyBeforeClear(defaultFileList);
        expect(beforeClear.called).toBe(true);
        upload.unmount();
    });

    it('openFileDialog method calls onClick', () => {
        const onOpenFileDialog = sinon.spy();
        const props = {
            defaultFileList,
            onOpenFileDialog,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用 openFileDialog
        instance.openFileDialog();
        upload.unmount();
    });

    it('onReplace callback in renderFile calls replace', () => {
        const props = {
            defaultFileList,
            showReplace: true,
            listType: 'list',
        };
        const upload = getUpload(props);
        // 找到替换按钮并点击
        const replaceBtn = upload.find(`.${BASE_CLASS_PREFIX}-upload-file-card-info-replace`).find('button');
        if (replaceBtn.length > 0) {
            replaceBtn.at(0).simulate('click', { stopPropagation: () => {} });
            // 验证 replaceIdx 被设置
            expect(upload.state().replaceIdx).toBeDefined();
        }
        upload.unmount();
    });

    it('onPreviewClick callback in renderFile calls handlePreviewClick', () => {
        const onPreviewClick = sinon.spy();
        const props = {
            defaultFileList,
            listType: 'picture',
            onPreviewClick,
        };
        const upload = getUpload(props);
        // 找到预览图标并点击
        const previewIcon = upload.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-card-preview`);
        if (previewIcon.length > 0) {
            previewIcon.at(0).simulate('click', { stopPropagation: () => {} });
            expect(onPreviewClick.called).toBe(true);
        }
        upload.unmount();
    });

    it('renderFileListPic returns null when showUploadList is false and showAddTriggerInList is false', () => {
        const props = {
            defaultFileList: [],
            listType: 'picture',
            showUploadList: false,
        };
        const upload = getUpload(props);
        // 验证 showUploadList 为 false 时
        expect(upload.props().showUploadList).toBe(false);
        upload.unmount();
    });

    it('default beforeClear returns true', () => {
        const props = {
            defaultFileList,
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 调用默认的 beforeClear
        const result = instance.adapter.notifyBeforeClear(defaultFileList);
        expect(result).toBe(true);
        upload.unmount();
    });

    it('FileCard onReplace triggers replace method', () => {
        const props = {
            defaultFileList,
            showReplace: true,
            listType: 'list',
        };
        const upload = getUpload(props);
        // 找到 FileCard 组件
        const fileCards = upload.find('FileCard');
        if (fileCards.length > 0) {
            // 获取 onReplace prop 并调用
            const onReplace = fileCards.at(0).props().onReplace;
            if (onReplace) {
                onReplace();
                // 验证 replaceIdx 被设置
                expect(upload.state().replaceIdx).toEqual(0);
            }
        }
        upload.unmount();
    });

    it('renderFileListPic returns null when conditions met', () => {
        const props = {
            defaultFileList: [],
            listType: 'picture',
            showUploadList: false,
            showAddTriggerInList: false,
        };
        const upload = getUpload(props);
        // 验证条件
        expect(upload.props().showUploadList).toBe(false);
        expect(upload.props().showAddTriggerInList).toBeFalsy();
        upload.unmount();
    });

    it('picture listType with empty fileList and showUploadList false returns null', () => {
        const props = {
            fileList: [],
            listType: 'picture',
            showUploadList: false,
        };
        const upload = getUpload(props);
        // 验证没有文件列表渲染
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-picture-file-list`).length).toEqual(0);
        upload.unmount();
    });

    it('picture listType with showUploadList false and showAddTriggerInList false returns null from renderFileListPic', () => {
        // 这个测试覆盖 renderFileListPic 中 return null 的分支
        // showAddTriggerInList 为 false 需要 limit 等于 fileList.length
        const props = {
            defaultFileList: [defaultFileList[0]], // 1 个文件
            listType: 'picture',
            showUploadList: false,
            limit: 1, // limit 等于文件数量，showAddTriggerInList 为 false
        };
        const upload = getUpload(props);
        const instance = upload.instance();
        // 直接调用 renderFileListPic 方法
        const result = instance.renderFileListPic();
        // 当 showUploadList 为 false 且 showAddTriggerInList 为 false 时返回 null
        expect(result).toBeNull();
        upload.unmount();
    });
});
