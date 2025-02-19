/* argus-disable unPkgSensitiveInfo */
import React, { useState } from 'react';
import FileCard from '../fileCard';
import { Button, Upload, Toast, Tag, Switch, SideSheet } from '@douyinfe/semi-ui/index';
import { withField, Form } from '../../form/index';
import { IconPlus, IconFile, IconUpload, IconEyeOpened, IconDownload, IconDelete } from '@douyinfe/semi-icons';

export default {
    title: 'Upload',
};

// let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
let action = 'https://api.semi.design/upload';
// action = 'https://jsonplaceholder.typicode.com/posts/';
let actionFail = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
let apiNotExist = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';

let commonProps = {
    action: action,
    onSuccess: (...args) => {
        console.log('onSuccess');
        Toast.success('success');
        console.log(args);
    },
    onProcess: (...args) => {
        console.log('onProcess');
        console.log(args);
    },
    onError: (...args) => {
        Toast.error('onError');
        console.log('onError');
        console.log(args);
    },
    onExceed: (...args) => {
        Toast.warning('onExceed');
        console.log('onExceed');
        console.log(args);
    },
    onSizeError: (...args) => {
        Toast.warning('onSizeError');
        console.log('onSizeError');
        console.log(args);
    },
    onChange: (...args) => {
        console.log('onChange');
        console.log(args);
    },
    onPreviewClick: fileItem => {
        let url = fileItem.url;
        console.log(fileItem);
        window.open(url);
    },
};

export const BasicUsage = () => (
    <>
        <Upload {...commonProps}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
        <Upload style={{ marginTop: 20 }} {...commonProps} showReplace>
            <Button icon={<IconUpload />} theme="light">
                点击上传（可替换）
            </Button>
        </Upload>
        <Upload
            style={{ marginTop: 20 }}
            {...commonProps}
            action={actionFail}
            prompt={<div style={{ display: 'flex', alignItems: 'center' }}>一个404的接口</div>}
        >
            <Button icon={<IconUpload />} theme="light">
                upload接口 404
            </Button>
        </Upload>
        <Upload
            style={{ marginTop: 20 }}
            {...commonProps}
            action={'https://semi.dev.com/api/upload503'}
            prompt={<div style={{ display: 'flex', alignItems: 'center' }}>一个503的接口</div>}
        >
            <Button icon={<IconUpload />} theme="light">
                upload接口503
            </Button>
        </Upload>
        <Upload
            style={{ marginTop: 20 }}
            {...commonProps}
            action={apiNotExist}
            prompt={<div style={{ display: 'flex', alignItems: 'center' }}>一个跨域不能请求的接口</div>}
        >
            <Button icon={<IconUpload />} theme="light">
                upload接口跨域了
            </Button>
        </Upload>
    </>
);

BasicUsage.story = {
    name: 'basic usage',
};

let data = {
    role: 'ies',
    time: new Date().getTime(),
};

let headers = {
    'x-tt-semi-test': 'semi-upload',
};

const getPromptDemo = () => {
    const action = '//semi.design/api/upload';
    const getPrompt = (pos, isListType) => {
        let basicStyle = {
            display: 'flex',
            alignItems: 'center',
            color: 'grey',
            height: isListType ? '100%' : 32,
        };
        let marginStyle = {
            left: { marginRight: 10 },
            right: { marginLeft: 10 },
        };
        let style = { ...basicStyle, ...marginStyle[pos] };

        return <div style={style}>请上传资格认证材料</div>;
    };
    const button = (
        <Button icon={<IconUpload />} theme="light">
            点击上传
        </Button>
    );
    const positions = ['right', 'left', 'bottom'];
    return (
        <>
            {positions.map((pos, index) => (
                <>
                    {index ? (
                        <div
                            style={{
                                marginBottom: 12,
                                marginTop: 12,
                                borderBottom: '1px solid var(--semi-color-border)',
                            }}
                        ></div>
                    ) : null}
                    <Upload action={action} prompt={getPrompt(pos)} promptPosition={pos}>
                        {button}
                    </Upload>
                </>
            ))}
            <div
                style={{
                    marginBottom: 24,
                    marginTop: 24,
                    borderBottom: '1px solid var(--semi-color-border)',
                }}
            ></div>
            {positions.map((pos, index) => (
                <>
                    {index ? (
                        <div
                            style={{
                                marginBottom: 12,
                                marginTop: 12,
                                borderBottom: '1px solid var(--semi-color-border)',
                            }}
                        ></div>
                    ) : null}
                    <Upload
                        action={action}
                        prompt={getPrompt(pos, true)}
                        promptPosition={pos}
                        listType="picture"
                        defaultFileList={defaultFileList}
                    >
                        <React.Fragment>
                            <IconPlus />
                        </React.Fragment>
                    </Upload>
                </>
            ))}
        </>
    );
};

export const Prompt = () => getPromptDemo();

Prompt.story = {
    name: 'prompt',
};

export const CustomDataAndHeaders = () => (
    <>
        <h4>直接返回object</h4>
        <Upload {...commonProps} data={data} headers={headers}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
        <h4>通过函数直接返回object</h4>
        <Upload {...commonProps} data={() => data} headers={() => headers}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
);

CustomDataAndHeaders.story = {
    name: 'custom data and headers',
};

let imageOnly = 'image/*';
let videoOnly = 'video/*';

export const Accept = () => (
    <>
        <Upload {...commonProps} action={action} accept={imageOnly}>
            <Button icon={<IconUpload />} theme="light">
                点击上传image
            </Button>
        </Upload>
        <br />
        <br />
        <Upload {...commonProps} action={action} accept={videoOnly}>
            <Button icon={<IconUpload />} theme="light">
                点击上传video
            </Button>
        </Upload>
    </>
);

Accept.story = {
    name: 'accept',
};

export const Multiple = () => (
    <>
        <Upload {...commonProps} action={action} multiple>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
);

Multiple.story = {
    name: 'multiple',
};

const defaultFileList = [
    {
        uid: '1',
        name: 'jiafang1.jpeg',
        status: 'success',
        size: '130kb',
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
    },
    {
        uid: '2',
        name: 'jiafang2.jpeg',
        status: 'uploadFail',
        size: '222kb',
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
    },
    {
        uid: '3',
        name: 'jiafang3.jpeg',
        status: 'uploading',
        percent: 50,
        size: '222kb',
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
    },
    {
        uid: '4',
        name: 'jiafang3.jpeg',
        status: 'validateFail',
        validateMessage: '文件过大',
        size: '222kb',
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
    },
    {
        uid: '5',
        name: 'jiafang4.jpeg',
        status: 'validating',
        validateMessage: '校验中',
        size: '222kb',
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bag.jpeg',
    },
];

export const DefaultFileList = () => (
    <>
        <Upload {...commonProps} action={action} defaultFileList={defaultFileList}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
);

DefaultFileList.story = {
    name: 'defaultFileList',
};

class ControlledUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: defaultFileList,
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange({ fileList, currentFile, event }) {
        console.log('onChange');
        console.log(fileList);
        console.log(currentFile);
        this.setState({ fileList: fileList });
    }

    render() {
        return (
            <Upload
                {...commonProps}
                action={action}
                onChange={this.onChange}
                fileList={this.state.fileList}
                showRetry={false}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

export const ControlledFileList = () => <ControlledUpload></ControlledUpload>;

ControlledFileList.story = {
    name: 'controlled fileList',
};

export const MaxSizeAndMinSize = () => (
    <>
        <Upload
            {...commonProps}
            action={action}
            maxSize={1024}
            minSize={2}
            showReplace
            defaultFileList={defaultFileList.slice(0, 1)}
            onSizeError={(file, fileList) => Toast.error(`${file.name} size invalid`)}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传（最小2kB，最大1MB）
            </Button>
        </Upload>
    </>
);

MaxSizeAndMinSize.story = {
    name: 'maxSize and minSize',
};

export const PictureListType = () => (
    <>
        <Upload {...commonProps} showReplace action={action} listType="picture" accept="image/*" multiple>
            <React.Fragment>
                <IconPlus size="extra-large" />
            </React.Fragment>
        </Upload>
    </>
);

PictureListType.story = {
    name: 'picture listType',
};

export const PictureListTypeWithDefaultFileList = () => (
    <>
        <Upload
            {...commonProps}
            showReplace={false}
            action={action}
            listType="picture"
            accept="image/*"
            renderPicPreviewIcon={() => <IconEyeOpened style={{ color: 'var(--semi-color-white)', fontSize: 24 }} />}
            defaultFileList={defaultFileList}
        >
            <React.Fragment>
                <IconPlus size="extra-large" />
            </React.Fragment>
        </Upload>
    </>
);

PictureListTypeWithDefaultFileList.story = {
    name: 'picture listType with default file list',
};

export const PictureListTypeWithCustomHeightWidth = () => {
    const urls = [
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/sky.jpg',
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/greenleaf.jpg',
        'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg',
    ];
    const list = defaultFileList.map((item, i) => {
        let newItem = { ...item };
        newItem.url = urls[i];
        return newItem;
    });
    return (
        <>
            <Upload
                {...commonProps}
                showReplace={false}
                action={action}
                listType="picture"
                accept="image/*"
                picHeight={110}
                picWidth={200}
                defaultFileList={list}
            >
                <React.Fragment>
                    <IconPlus size="extra-large" />
                </React.Fragment>
            </Upload>
        </>
    );
};

PictureListTypeWithCustomHeightWidth.story = {
    name: 'picture listType with custom height width',
};

class ManulUploadDemo extends React.Component {
    constructor() {
        super();
        this.state = {
            fileList: [],
        };
        this.onFileChange = this.onFileChange.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.manulUpload = this.manulUpload.bind(this);
        this.uploadRef = React.createRef();
    }

    onFileChange(file) {
        let newFileList = [...this.state.fileList, ...file];
        this.setState({ fileList: newFileList });
    }

    onRemove(file) {
        let { fileList } = this.state;
        fileList.filter(item => item.uid !== file.uid);
        this.setState({ fileList });
    }

    manulUpload() {
        this.uploadRef.current.upload(this.state.fileList);
    }

    render() {
        const { fileList } = this.state;
        return (
            <div>
                <Upload
                    {...commonProps}
                    accept="image/gif, image/png, image/jpeg, image/bmp, image/webp"
                    action={action}
                    uploadTrigger="custom"
                    ref={this.uploadRef}
                    onSuccess={(...v) => console.log(...v)}
                    onError={(...v) => console.log(...v)}
                >
                    <Button icon={<IconPlus />} theme="light">
                        选择文件
                    </Button>
                </Upload>
                <Button icon={<IconUpload />} theme="light" onClick={this.manulUpload}>
                    开始上传
                </Button>
            </div>
        );
    }
}

export const ManulUpload = () => <ManulUploadDemo />;

ManulUpload.story = {
    name: 'manul upload',
};

export const Disabled = () => (
    <>
        <Upload {...commonProps} action={action} disabled defaultFileList={defaultFileList}>
            <Button icon={<IconUpload />} theme="light" disabled>
                点击上传
            </Button>
        </Upload>
    </>
);

Disabled.story = {
    name: 'disabled',
};

export const PreviewFile = () => (
    <>
        <Upload {...commonProps} action={action} previewFile={file => <IconFile size="large" />}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    </>
);

PreviewFile.story = {
    name: 'previewFile',
};

const CustomRenderFileDemo = () => {
    const render = file => {
        return <div style={{ padding: 8, width: 80, height: 32 }}>{file.name}</div>;
    };
    return (
        <>
            <h5>renderFileItem demo：</h5>
            <Upload {...commonProps} action={action} renderFileItem={render}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
            <h5>itemWidth demo：</h5>
            <Upload {...commonProps} action={action} itemStyle={{ width: 150 }} style={{ width: 500 }} multiple>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        </>
    );
};

export const RenderFileItem = () => <CustomRenderFileDemo />;

RenderFileItem.story = {
    name: 'renderFileItem',
};

export const CustomLimit = () => (
    <>
        <Upload
            {...commonProps}
            action={action}
            limit={1}
            uploadTrigger="custom"
            onExceed={() => Toast.error('超出限定数量')}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传, uploadtrigger = custom
            </Button>
        </Upload>
        <Upload {...commonProps} action={action} limit={1} onExceed={() => Toast.error('超出限定数量')}>
            <Button icon={<IconUpload />} theme="light">
                点击上传1
            </Button>
        </Upload>
        <Upload {...commonProps} action={action} limit={2} onExceed={() => Toast.error('超出限定数量')}>
            <Button icon={<IconUpload />} theme="light">
                点击上传2
            </Button>
        </Upload>
    </>
);

CustomLimit.story = {
    name: 'custom limit',
};

export const Draggable = () => (
    <>
        <Upload
            {...commonProps}
            draggable={true}
            // disabled
            accept="application/image/*,.md"
            dragMainText={'点击上传文件或拖拽文件到这里'}
            dragSubText="支持的文件类型：.jpg、.pdf"
        ></Upload>

        <Upload
            {...commonProps}
            style={{ marginTop: 10, height: 300 }}
            // directory
            draggable={true}
            dragMainText={'点击上传文件或拖拽文件到这里'}
        ></Upload>

        <Upload style={{ marginTop: 10, height: 300 }} action={action} draggable={true}>
            <div>
                <IconUpload size="extra-large" />
                自定义拖拽取内容及结构
            </div>
        </Upload>
    </>
);

Draggable.story = {
    name: 'draggable',
};

export const _FileCard = () => (
    <>
        <FileCard name="semi" suffix="jpg" percent={50} showRetry onRetry={v => console.log(v)}></FileCard>
        <FileCard
            name="invalid"
            suffix="jpg"
            size={12321}
            validateStatus="error"
            showRetry
            onRetry={v => console.log(v)}
        ></FileCard>
        <FileCard name="semi.jpg" percent={50} size={10022}></FileCard>
    </>
);

_FileCard.story = {
    name: 'FileCard',
};

class ValidateDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.beforeUpload = this.beforeUpload.bind(this);
        this.afterUpload = this.afterUpload.bind(this);
        this.transformFile = this.transformFile.bind(this);
        this.count = 0;
    }
    transformFile(fileInstance) {
        if (this.count === 0) {
            let newFile = new File([fileInstance], 'newFileName', { type: 'image/png' });
            return newFile;
        } else {
            return fileInstance;
        }
    }

    afterUpload({ response, file }) {
        // 可以根据业务接口返回，决定当次上传是否成功
        if (response.status_code == 200) {
            return {
                autoRemove: false,
                status: 'uploadFail',
                validateMessage: '内容不合法',
                name: 'RenameByServer.jpg',
            };
        } else {
            return {};
        }
    }
    beforeUpload({ file, fileList }) {
        let result;
        if (this.count > 1) {
            result = {
                autoRemove: false,
                fileInstance: file.fileInstance,
                shouldUpload: true,
            };
        } else {
            result = {
                autoRemove: false,
                fileInstance: file.fileInstance,
                status: 'validateFail',
                shouldUpload: false,
            };
        }
        this.count = this.count + 1;
        return result;
    }

    render() {
        return (
            <Upload
                {...commonProps}
                action={action}
                transformFile={this.transformFile}
                // beforeUpload={this.beforeUpload}
                afterUpload={this.afterUpload}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

export const TransformFileBeforeUploadAfterUpload = () => <ValidateDemo />;

TransformFileBeforeUploadAfterUpload.story = {
    name: 'transformFile beforeUpload afterUpload',
};

class AsyncBeforeUploadDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.beforeUpload = this.beforeUpload.bind(this);
        this.count = 0;
    }

    beforeUpload({ file, fileList }) {
        let result;
        return new Promise((reslove, reject) => {
            if (this.count > 1) {
                result = {
                    autoRemove: false,
                    shouldUpload: true,
                };
                this.count = this.count + 1;
                reslove(result);
            } else {
                result = {
                    autoRemove: false,
                    fileInstance: file.fileInstance,
                    status: 'validateFail',
                    shouldUpload: false,
                    validateMessage: `第${this.count + 1}个注定失败`,
                };
                this.count = this.count + 1;
                reject(result);
            }
        });
    }

    render() {
        return (
            <Upload {...commonProps} action={action} beforeUpload={this.beforeUpload}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

export const AsyncBeforeUpload = () => <AsyncBeforeUploadDemo />;

AsyncBeforeUpload.story = {
    name: 'async beforeUpload',
};

class ValidateMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.transformFile = this.transformFile.bind(this);
    }

    render() {
        return (
            <Upload {...commonProps} action={action}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}
export const UploadValidateMessageValidateStatus = () => <ValidateMessage />;

UploadValidateMessageValidateStatus.story = {
    name: 'Upload validateMessage validateStatus',
};

class FormUploadDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.transformFile = this.transformFile.bind(this);
    }

    render() {
        return (
            <Form labelPosition="left">
                {({ formState }) => (
                    <>
                        <Form.Upload
                            {...commonProps}
                            action={action}
                            field="files"
                            label="认证图片上传"
                            extraText="请上传符合规格的图片"
                            name="testName"
                            uploadTrigger="custom"
                            onChange={({ fileList, currentFile }) => {
                                console.log(fileList);
                            }}
                        >
                            <Button icon={<IconUpload />} theme="light">
                                点击上传
                            </Button>
                        </Form.Upload>
                        <code>{JSON.stringify(formState)}</code>
                    </>
                )}
            </Form>
        );
    }
}

export const FormUpload = () => <FormUploadDemo />;

FormUpload.story = {
    name: 'Form.Upload',
};

class CustomRequestDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.transformFile = this.transformFile.bind(this);
        // this.tosClient =
    }

    render() {
        return (
            <Form labelPosition="left">
                {({ formState }) => (
                    <>
                        <Form.Upload
                            {...commonProps}
                            action={action}
                            customRequest={({ onProgress, onSuccess, onError }) => {
                                let count = 0;
                                onError();
                                // let interval = setInterval(() => {
                                //     if (count === 100) {
                                //         clearInterval(interval);
                                //         onSuccess();
                                //     }
                                //     onProgress({ total: 100, loaded: count });
                                //     count += 50;
                                // }, 1000);
                            }}
                            field="files"
                            label="认证图片上传"
                            extraText="请上传符合规格的图片"
                            name="testName"
                        >
                            <Button icon={<IconUpload />} theme="light">
                                点击上传
                            </Button>
                        </Form.Upload>
                    </>
                )}
            </Form>
        );
    }
}

export const FormCustomRequest = () => <CustomRequestDemo />;

FormCustomRequest.story = {
    name: 'Form.CustomRequest',
};

class AutoReplace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Upload {...commonProps} action={action} limit={1} name="testName">
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}

export const AutoReplaceLimit1 = () => <AutoReplace />;

AutoReplaceLimit1.story = {
    name: 'AutoReplace limit=1',
};

function DirectoryUpload() {
    return (
        <>
            <Upload {...commonProps} directory>
                <Button icon={<IconUpload />} theme="light">
                    点击上传文件夹
                </Button>
            </Upload>
            <Upload {...commonProps} directory accept="image/png">
                <Button icon={<IconUpload />} theme="light">
                    点击上传文件夹并指定图片格式
                </Button>
            </Upload>
            <Upload
                {...commonProps}
                style={{ marginTop: 10, height: 300 }}
                accept="image/png"
                draggable={true}
                dragMainText={'拖拽文件夹上传'}
                onDrop={console.log}
                directory
            ></Upload>
        </>
    );
}

export const _DirectoryUpload = () => <DirectoryUpload />;

_DirectoryUpload.story = {
    name: 'directory upload',
};

function ForbiddenRemove() {
    const [fileList, $fileList] = useState(defaultFileList);
    return (
        <>
            <Upload
                fileList={fileList}
                onChange={f => {
                    $fileList(f.fileList);
                }}
                beforeRemove={(file, currentList) => currentList.length > 2}
                beforeClear={list => list.length > 2}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        </>
    );
}

export const _ForbiddenRemove = () => <ForbiddenRemove />;

_ForbiddenRemove.story = {
    name: 'forbidden remove',
};

export const CustomListOperation = () => {
    const renderFileOperation = fileItem => {
        return (
            <div style={{ display: 'flex', columnGap: 8, padding: '0 8px' }}>
                <Button icon={<IconEyeOpened></IconEyeOpened>} type="tertiary" theme="borderless" size="small"></Button>
                <Button icon={<IconDownload></IconDownload>} type="tertiary" theme="borderless" size="small"></Button>
                <Button
                    onClick={e => fileItem.onRemove()}
                    icon={<IconDelete></IconDelete>}
                    type="tertiary"
                    theme="borderless"
                    size="small"
                ></Button>
            </div>
        );
    };
    return (
        <Upload defaultFileList={defaultFileList} itemStyle={{ width: 300 }} renderFileOperation={renderFileOperation}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    );
};

CustomListOperation.story = {
    name: 'custom list operation',
};

export const TestReplaceFunc = () => (
    <>
        <Upload
            {...commonProps}
            action={action}
            accept=".md,image/*,video/*"
            maxSize={1024}
            minSize={0}
            transformFile={fileInstance => {
                return fileInstance;
            }}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传（最小0kB，最大1MB）
            </Button>
        </Upload>
        <Upload
            {...commonProps}
            action={action}
            accept="image/*"
            maxSize={1024}
            minSize={0}
            transformFile={fileInstance => {
                return fileInstance;
            }}
        >
            <Button icon={<IconUpload />} theme="light">
                只接受image点击上传（最小0kB，最大1MB）
            </Button>
        </Upload>
        <Upload
            {...commonProps}
            action={action}
            accept=".md,image/*,video/*"
            maxSize={1024}
            minSize={200}
            transformFile={fileInstance => {
                return fileInstance;
            }}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传（最小200kB，最大1MB）
            </Button>
        </Upload>
    </>
);

TestReplaceFunc.story = {
    name: 'test replace func',
};

class InsertUpload extends React.Component {
    constructor() {
        super();
        this.onFileChange = this.onFileChange.bind(this);
        this.insert1 = this.insert1.bind(this);
        this.insert2 = this.insert2.bind(this);
        this.insert3 = this.insert3.bind(this);
        this.uploadRef1 = React.createRef();
        this.uploadRef2 = React.createRef();
        this.uploadRef3 = React.createRef();
        this.file = null;
    }

    onFileChange(file) {
        delete file[0].uid;
        this.file = file;
    }

    insert1() {
        // test file number limit
        this.uploadRef1.current.insert(this.file, 0);
    }

    insert2() {
        this.uploadRef2.current.insert(this.file, 0);
    }

    insert3() {
        // test size limit
        this.uploadRef3.current.insert(this.file, 0);
    }

    render() {
        let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
        return (
            <div>
                <Upload
                    action={action}
                    ref={this.uploadRef1}
                    accept=".md,image/*,video/*"
                    onSuccess={(...v) => console.log(...v)}
                    onError={(...v) => console.log(...v)}
                    onFileChange={this.onFileChange}
                    maxSize={1024}
                    minSize={0}
                    limit={1}
                    transformFile={fileInstance => {
                        return fileInstance;
                    }}
                >
                    <Button icon={<IconPlus />} theme="light" style={{ marginRight: 8 }}>
                        选择文件 limit 1
                    </Button>
                </Upload>
                <Upload
                    action={action}
                    ref={this.uploadRef2}
                    accept=".md,image/*,video/*"
                    onSuccess={(...v) => console.log(...v)}
                    onError={(...v) => console.log(...v)}
                    onFileChange={this.onFileChange}
                    maxSize={1024}
                    minSize={0}
                    limit={2}
                    transformFile={fileInstance => {
                        return fileInstance;
                    }}
                >
                    <Button icon={<IconPlus />} theme="light" style={{ marginRight: 8 }}>
                        选择文件 limit 2
                    </Button>
                </Upload>
                <Upload
                    {...commonProps}
                    action={action}
                    ref={this.uploadRef3}
                    accept=".md,image/*,video/*"
                    onSuccess={(...v) => console.log(...v)}
                    onError={(...v) => console.log(...v)}
                    onFileChange={this.onFileChange}
                    maxSize={1024}
                    minSize={200}
                    limit={1}
                    transformFile={fileInstance => {
                        return fileInstance;
                    }}
                >
                    <Button icon={<IconPlus />} theme="light" style={{ marginRight: 8 }}>
                        选择文件 size 限制
                    </Button>
                </Upload>
                <Button icon={<IconUpload />} theme="light" onClick={this.insert1}>
                    插入首项上传1
                </Button>
                <Button icon={<IconUpload />} theme="light" onClick={this.insert2}>
                    插入首项上传2
                </Button>
                <Button icon={<IconUpload />} theme="light" onClick={this.insert3}>
                    插入首项上传3
                </Button>
            </div>
        );
    }
}

export const Insert = () => <InsertUpload></InsertUpload>;

Insert.story = {
    name: 'insert',
};

class ClickToOpenUpload extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.uploadRef = React.createRef();
    }

    onClick() {
        // open file select dialog
        this.uploadRef.current.openFileDialog();
    }

    render() {
        let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
        return (
            <div>
                <Button icon={<IconUpload />} theme="light" onClick={this.onClick}>
                    点我打开文件选择窗口
                </Button>
                <div style={{ marginTop: 50 }}>
                    <Tag color="blue" type="light">
                        文件列表
                    </Tag>
                    <Upload
                        {...commonProps}
                        action={action}
                        ref={this.uploadRef}
                        onSuccess={(...v) => console.log(...v)}
                        onError={(...v) => console.log(...v)}
                    ></Upload>
                </div>
            </div>
        );
    }
}

export const ClickToOpenUploadDemo = () => <ClickToOpenUpload></ClickToOpenUpload>;

ClickToOpenUploadDemo.story = {
    name: 'click to open upload demo',
};

const PreviewFallbackDemo = () => {
    let action = 'https://api.semi.design/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'test.pdf',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/githubdemo/collapse.pdf',
        },
        {
            uid: '2',
            name: 'normal.png',
            status: 'success',
            size: '120KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
        },
    ];

    const SmartPreview = props => {
        const [src, setSrc] = useState(props.src);
        const fallback = () => {
            setSrc(
                'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg'
            );
        };
        return <img src={src} onError={fallback} />;
    };

    const previewFile = file => {
        return <SmartPreview src={file.url} />;
    };

    return (
        <>
            <Upload
                defaultFileList={defaultFileList}
                action={action}
                // previewFile={previewFile}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
            <Upload
                listType="picture"
                defaultFileList={defaultFileList}
                action={action}
                // renderThumbnail={previewFile}
            >
                <IconPlus size="extra-large" />
            </Upload>
        </>
    );
};

export const PreviewFallback = () => <PreviewFallbackDemo></PreviewFallbackDemo>;

PreviewFallback.story = {
    name: 'preview other type',
    delay: 300,
};

export const AddOnPasting = () => {
    const [addOnPasting, switchAddOnPasting] = useState(true);

    return (
        <div style={{ width: 800, height: 500 }}>
            <Upload
                addOnPasting={addOnPasting}
                action={action}
                // {...commonProps}
                onChange={e => console.log(e)}
            >
                <Button>点击或粘贴上传</Button>
            </Upload>
            <Button
                type="danger"
                theme="solid"
                onClick={() => {
                    navigator.clipboard
                        .write([])
                        .then(() => alert('clear'))
                        .catch(error => console.log(error));
                }}
            >
                清空clipboard
            </Button>
            <Switch checked={addOnPasting} onChange={e => switchAddOnPasting(e)}></Switch>
        </div>
    );
};


export const AddOnPastingInSidesheet = () => {
    const [addOnPasting, switchAddOnPasting] = useState(true);
    const [visible, setVisible] = useState(false);
    const change = () => {
        setVisible(!visible);
    };
    return (
        <div style={{ width: 800, height: 500 }}>
            <Button onClick={change}>Open SideSheet</Button>
            <SideSheet title="滑动侧边栏" visible={visible} onCancel={change}>
                <p>This is the content of a basic sidesheet.</p>
                <p>Here is more content...</p>
                <Upload
                    addOnPasting={addOnPasting}
                    action={action}
                    // {...commonProps}
                    onChange={e => console.log(e)}
                >
                    <Button>点击或粘贴上传</Button>
                </Upload>
                <Button
                    type="danger"
                    theme="solid"
                    onClick={() => {
                        navigator.clipboard
                            .write([])
                            .then(() => alert('clear'))
                            .catch(error => console.log(error));
                    }}
                >
                    清空clipboard
                </Button>
                <Switch checked={addOnPasting} onChange={e => switchAddOnPasting(e)}></Switch>
            </SideSheet>
        </div>
    );
};

let first = true;

export const Unmount = () => {
    let action = 'https://api.semi.design/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'music.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        },
    ];
    const [a, setA] = React.useState(true);

    const toggle = () => {
        console.log('ready to toggle', !a);
        setA(!a);
    };

    return (
        <>
            {a && (
                <Upload
                    action={action}
                    listType="picture"
                    accept="image/*"
                    multiple
                    defaultFileList={defaultFileList}
                    onChange={value => {
                        console.log('change');
                    }}
                >
                    <IconPlus size="extra-large" />
                </Upload>
            )}
            <button onClick={toggle}>toggle upload mount</button>
        </>
    );
};

export const fix2448 = () => {
    let action = 'http://xxx';
    return (
        <>
            <Form>
                <Form.Upload action={action} listType="picture" accept="image/*" multiple>
                    <IconPlus size="extra-large" />
                </Form.Upload>
            </Form>
        </>
    );
};

export const CustomPicCloseIcon = () => {
    let action = 'https://api.semi.design/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'dy.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url:
                'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
        },
    ];
    const renderPicClose = ({ className, remove }) => (
        <div className={className} onClick={remove}>delete</div>
    )
    return (
        <>
            <Upload 
                renderPicClose={renderPicClose}
                action={action} listType="picture" accept="image/*" multiple defaultFileList={defaultFileList}
            >
                <IconPlus size="extra-large" />
            </Upload>
        </>
    );
};
