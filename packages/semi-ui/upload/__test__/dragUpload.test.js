import { Upload, Icon } from '../../index';
import { noop } from 'lodash';
import { cssClasses } from '@douyinfe/semi-foundation/icons/constants';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import { IconBolt } from '@douyinfe/semi-icons';

const prefixCls = cssClasses.PREFIX;

let action = 'https://semi.bytendance.com';

function getUpload(props, formProps = {}) {
    if (!props.action) {
        props.action = action;
    }
    return mount(<Upload {...props} draggable></Upload>);
}

function trigger(upload, event) {
    const dragArea = upload.find(`.${BASE_CLASS_PREFIX}-upload-drag-area`);
    dragArea.simulate('drop', event);
}

const createFile = (size = 1024, name = 'semi-logo.png', type = 'image/png') => {
    return new File([new ArrayBuffer(size)], name, {
        type: type,
    });
};

const createEvent = files => {
    let event = {
        dataTransfer: {
            files,
            effectAllowed: 'none',
        },
    };
    return event;
};

describe('Drag Upload', () => {
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

    // 1、Should start upload after drag
    it('draggable', () => {
        let spyOnSuccess = sinon.spy((res, file) => { });
        let props = {
            onSuccess: spyOnSuccess,
        };
        const upload = getUpload(props);
        const file = createFile(200, 'drag.jpg');
        const event = createEvent([file]);
        trigger(upload, event);
        let response = { code: 0, message: 'success' };
        requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(response));
        expect(spyOnSuccess.calledWith(response, file)).toEqual(true);
    });

    it('shouldn not trigger upload when upload is disabled', () => {
        let spyFileChange = sinon.spy(file => { });
        let props = {
            disabled: true,
            onFileChange: spyFileChange,
        };
        const upload = getUpload(props);
        const file = createFile(200, 'drag.jpg');
        const event = createEvent([file]);
        trigger(upload, event);
        expect(spyFileChange.callCount).toEqual(0);
    });

    it('dragMainText / dragIcon / dragSubText', () => {
        let dragMainText = <span>Drop files here to upload or Click to browse files</span>;
        let dragSubText = <span>Only support jpeg / pdf</span>;
        let dragIcon = <IconBolt />;
        let props = {
            dragIcon,
            dragMainText,
            dragSubText,
        };
        const upload = getUpload(props);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-drag-area-icon .${BASE_CLASS_PREFIX}-icon-bolt`)).toEqual(true);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-drag-area-main-text`).contains(dragMainText)).toEqual(true);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-drag-area-sub-text`).contains(dragSubText)).toEqual(true);
    });

    it('draggable & accept', () => {
        let accept = 'application/pdf';
        let spyFileChange = sinon.spy(file => { });
        let props = {
            accept,
            onFileChange: spyFileChange,
        };
        const upload = getUpload(props);
        const invalidFile = createFile(200, 'drag.jpg');
        const validFile = createFile(200, 'drag.pdf', 'application/pdf');
        trigger(upload, createEvent([invalidFile]));
        expect(spyFileChange.callCount).toEqual(0);
        trigger(upload, createEvent([validFile]));
        expect(spyFileChange.callCount).toEqual(1);
    });

    it('draggable custom children', () => {
        let props = {
            children: <div className="test"></div>,
        };
        const upload = getUpload(props);
        expect(upload.find(`.${BASE_CLASS_PREFIX}-upload-drag-area-custom`).children().length).toEqual(1);
        expect(upload.exists(`.${BASE_CLASS_PREFIX}-upload-drag-area-custom .test`)).toEqual(true);
    });
});
