---
localeCode: en-US
order: 43
category: Input
title: Upload
icon: doc-upload
width: 50%
brief: File selection upload
---

## Demos

### How to import

```jsx import
import { Upload } from '@douyinfe/semi-ui';
```
### Basic usage

The most basic usage is to place a Button in children, click on the children content (the placed Button) to activate the file selection box, and the upload will start automatically after the selection is completed

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => (
    <Upload action="//semi.design/api/upload">
        <Button icon={<IconUpload />} theme="light">
            Click upload
        </Button>
    </Upload>
);
```

### Add prompt text

Set a custom prompt text through the `prompt` slot
Set the slot position by `promptPosition`, optional `left`, `right`, `bottom`, the default is `right`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    const action = '//semi.design/api/upload';
    const getPrompt = (pos, isListType) => {
        let basicStyle = { display: 'flex', alignItems: 'center', color: 'grey', height: isListType ? '100%' : 32 };
        let marginStyle = {
            left: { marginRight: 10 },
            right: { marginLeft: 10 },
        };
        let style = { ...basicStyle, ...marginStyle[pos] };

        return <div style={style}>Please upload qualification certification materials</div>;
    };
    const button = (
        <Button icon={<IconUpload />} theme="light">
            Click upload
        </Button>
    );
    const positions = ['right', 'left', 'bottom'];
    return (
        <>
            {positions.map((pos, index) => (
                <>
                    {index ? (
                        <div
                            style={{ marginBottom: 12, marginTop: 12, borderBottom: '1px solid var(--semi-color-border)' }}
                        ></div>
                    ) : null}
                    <Upload action={action} prompt={getPrompt(pos)} promptPosition={pos}>
                        {button}
                    </Upload>
                </>
            ))}
        </>
    );
};
```

When listType is picture, the reference object at promptPosition is the whole picture wall list

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    const action = '//semi.design/api/upload';
    const getPrompt = (pos, isListType) => {
        let basicStyle = { display: 'flex', alignItems: 'center', color: 'grey', height: isListType ? '100%' : 32 };
        let marginStyle = {
            left: { marginRight: 10 },
            right: { marginLeft: 10 },
        };
        let style = { ...basicStyle, ...marginStyle[pos] };

        return <div style={style}>Please upload certification materials</div>;
    };
    const defaultFileList = [
        {
            uid: '1',
            name: '1.jpeg',
            status: 'success',
            size: '130kb',
            url:
                'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
        },
        {
            uid: '2',
            name: '2.jpeg',
            size: '222kb',
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        }
    ];
    const positions = ['right', 'bottom'];
    return (
        <>
            {positions.map((pos, index) => (
                <>
                    {index ? (
                        <div
                            style={{ marginBottom: 12, marginTop: 12, borderBottom: '1px solid var(--semi-color-border)' }}
                        ></div>
                    ) : null}
                    <Upload
                        action={action}
                        prompt={getPrompt(pos, true)}
                        promptPosition={pos}
                        listType="picture"
                        defaultFileList={defaultFileList}
                    >
                        <IconPlus size="extra-large" />
                    </Upload>
                </>
            ))}
        </>
    );
};
```

### Click on the avatar to trigger upload

```jsx live=true width=48%
import React from 'react';
import { Upload, Avatar, Toast } from '@douyinfe/semi-ui';
import { IconCamera } from '@douyinfe/semi-icons';

() => {
    const [url, setUrl] = useState('https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png');
    const onSuccess = (response, file) => {
        Toast.success('Avatar updated successfully');
        // const url = response.url;
        setUrl('https://sf6-cdn-tos.douyinstatic.com/obj/ttfe/ies/semi/ttmoment.jpeg');
    };

    const style = {
        backgroundColor: 'var(--semi-color-overlay-bg)',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--semi-color-white)',
    };
    
    const hoverMask = (<div style={style}>
        <IconCamera />
    </div>);

    const api = '//semi.design/api/upload';
    let imageOnly = 'image/*';

    return (
        <Upload
            className="avatar-upload"
            action={api}
            onSuccess={onSuccess}
            accept={imageOnly}
            showUploadList={false}
            onError={() => Toast.error('upload failed')}
        >
            <Avatar src={url} style={{ margin: 4 }} hoverMask={hoverMask} />
        </Upload>
    );
};
```

```css
.avatar-upload .semi-upload-add {
    border-radius: 50%; // Make sure that only the circle is clicked on the hot zone
}
```

### Custom upload attributes

Custom upload attributes can be added by setting `data`, `headers`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    let data = {
        role: 'ies',
        time: new Date().getTime(),
    };
    let headers = {
        'x-tt-semi': 'semi-upload',
    };
    return (
        <Upload action={action} data={data} headers={headers}>
            <Button icon={<IconUpload />} theme="light">
                Click upload
            </Button>
        </Upload>
    );
};
```

### Upload file type

The type of files uploaded can be restricted through the `accept` attribute (the native `html` attribute of `input`).

`accept` supports the following two types of strings:

- A collection of file extensions (recommended), such as .jpg, .png, etc.;
- MIME types collection of file types, please refer to [MDN document](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)

For example, only allowing users to upload PNG and PDF files, `accept` can be written like this: `accept ='.pdf,.png'` or `accept ='application/pdf,image/png'` (the MIME type of PNG and PDF Connect through `,`).

<Notice type="primary" title="Notes">
     <div>Upload will intercept files that do not meet the accept format internally. When files that do not meet the format requirements are intercepted, the onAcceptInvalid method (provided by v1.24) will be triggered;</div>
     <div>accept uses the suffix to avoid the incompatibility between file.type and MIME due to different browsers or operating systems. </div>
</Notice>


```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    let imageOnly = 'image/*';
    let videoOnly = 'video/*';
    let fileLimit = '.pdf,.png,.jpeg';
    return (
        <>
            <Upload action={action} accept={imageOnly} style={{ marginBottom: 12 }}>
                <Button icon={<IconUpload />} theme="light">
                    Upload image
                </Button>
            </Upload>
            <Upload action={action} accept={videoOnly} style={{ marginBottom: 12 }}>
                <Button icon={<IconUpload />} theme="light">
                    Upload video
                </Button>
            </Upload>
            <Upload action={action} accept={fileLimit}>
                <Button icon={<IconUpload />} theme="light">
                    Upload PDF, PNG, JPEG
                </Button>
            </Upload>
        </>
    );
};
```

### Upload folder

By passing in `directory` as `true`, all files in the folder can be uploaded

```jsx live=true
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    return (
        <>
            <Upload action={action} directory>
                <Button icon={<IconUpload />} theme="light">
                    Upload folder
                </Button>
            </Upload>
        </>
    );
};
```

### Select multiple files at once

You can select multiple files to upload at the same time by setting the `multiple` attribute.

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    return (
        <Upload action={action} multiple>
            <Button icon={<IconUpload />} theme="light">
                Click upload
            </Button>
        </Upload>
    );
};
```

### Limit the total number of files

You can limit the maximum number of files that can be uploaded by setting the `limit` property
When `limit` is 1, always replace the current one with the latest upload, and will not trigger the onExceed callback **v1.5.0 takes effect**

```jsx dir="column" live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://semi.design/api/upload';
    let limit = 1;
    let onChange = props => {
        console.log(props.fileList);
    };
    return (
        <Upload
            action={action}
            limit={limit}
            onChange={onChange}
        >
            <Button icon={<IconUpload />} theme="light">
                Click to upload (up to {limit} items)
            </Button>
        </Upload>
    );
};
```

```jsx dir="column" live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://semi.design/api/upload';
    let [disabled, setDisabled] = useState(false);
    let limit = 2;
    let onChange = props => {
        let length = props.fileList.length;
        if (length === limit) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    };
    return (
        <Upload
            action={action}
            limit={limit}
            onExceed={() => Toast.warning(`Up to ${limit} files are allowed to be uploaded`)}
            onChange={onChange}
        >
            <Button icon={<IconUpload />} theme="light" disabled={disabled}>
                Click to upload (up to {limit} items)
            </Button>
        </Upload>
    );
};
```

In the photo wall mode, when the number of uploaded files is equal to the limit, the upload entry will be automatically hidden

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'dyBag.jpeg',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
        },
        {
            uid: '2',
            name: 'dyBag2.jpeg',
            status: 'success',
            size: '222KB',
            preview: true,
            fileInstance: new File([new ArrayBuffer(2048)], 'abc.jpeg', { type: 'image/png' }),
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
        },
    ];
    return (
        <Upload
            action={action}
            limit={2}
            listType="picture"
            accept="image/*"
            defaultFileList={defaultFileList}
            onExceed={() => Toast.warning('Only allow up to 2 files to be uploaded')}
        >
            <IconPlus size="extra-large" />
        </Upload>
    );
};
```

### Limit upload file size

The upload file size limit can be customized through the `maxSize` and `minSize` properties, and the callback when the limit is exceeded can be set by setting `onSizeError`.

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';

    return (
        <>
            <Upload
                action={action}
                maxSize={1024}
                minSize={200}
                onSizeError={(file, fileList) => Toast.error(`${file.name} size invalid`)}
            >
                <Button icon={<IconUpload />} theme="light">
                    Click to upload (minimum 200KB, maximum 1MB)
                </Button>
            </Upload>
        </>
    );
};
```

### Custom preview logic

When `listType` is `list`, you can pass in `previewFile` to view the logic.
For example, when you do not need to preview the image type by thumbnail, you can always return a `<IconFile />` in `previewFile`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload, IconFile } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'dyBag.jpeg',
            status: 'success',
            size: '130KB',
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
        },
    ];
    return (
        <Upload
            defaultFileList={defaultFileList}
            action={action}
            previewFile={file => <IconFile size="large" />}
        >
            <Button icon={<IconUpload />} theme="light">
                Click upload
            </Button>
        </Upload>
    );
};
```

### Custom list operation area

When `listType` is `list`, you can customize the list operation area by passing in `renderFileOperation`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload, IconDownload, IconEyeOpened, IconDelete } from '@douyinfe/semi-icons';

() => {
    let action = 'https://api.semi.design/upload';

    const defaultFileList = [
        {
            uid: '1',
            name: 'dyBag.jpeg',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
        }
    ];
    const renderFileOperation = (fileItem) => (
        <div style={{ display: 'flex', columnGap: 8, padding: '0 8px' }}>
            <Button icon={<IconEyeOpened></IconEyeOpened>} type="tertiary" theme="borderless" size="small"></Button>
            <Button icon={<IconDownload></IconDownload>} type="tertiary" theme="borderless" size="small"></Button>
            <Button onClick={e=>fileItem.onRemove()} icon={<IconDelete></IconDelete>} type="tertiary" theme="borderless" size="small"></Button>
        </div>
    );
    return (
        <Upload action={action} defaultFileList={defaultFileList} itemStyle={{ width: 300 }} renderFileOperation={renderFileOperation}>
            <Button icon={<IconUpload />} theme="light">Upload</Button>
        </Upload>
    );
};
```

### Default file list

The uploaded files can be displayed through `defaultFileList`. When you need to preview the thumbnail of the default file, you can set the `preview` attribute of the corresponding `item` in `defaultFileList` to `true`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';

    const defaultFileList = [
        {
            uid: '1',
            name: 'dyBag.jpeg',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
        },
        {
            uid: '2',
            name: 'abc.jpeg',
            status: 'uploadFail',
            size: '222KB',
            preview: true,
            fileInstance: new File([new ArrayBuffer(2048)], 'abc.jpeg', { type: 'image/png' }),
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        },
    ];

    return (
        <>
            <Upload action={action} defaultFileList={defaultFileList}>
                <Button icon={<IconUpload />} theme="light">
                    Click upload
                </Button>
            </Upload>
        </>
    );
};
```

### Controlled component

When `fileList` is passed in, it is used as a controlled component. Need to listen to the onChange callback, and pass the fileList back to Upload (note that a new array object needs to be passed in)

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    const initList = [
        {
            uid: '1',
            name: 'dyBag.jpeg',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        },
        {
            uid: '2',
            name: 'dy.jpeg',
            status: 'uploading',
            size: '222KB',
            percent: 50,
            preview: true,
            fileInstance: new File([new ArrayBuffer(2048)], 'dy2.jpeg', { type: 'image/jpeg' }),
            url:
                'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
        },
    ];

    const [list, updateList] = useState(initList);

    const onChange = ({ fileList, currentFile, event }) => {
        console.log('onChange');
        console.log(fileList);
        console.log(currentFile);
        let newFileList = [...fileList]; // spread to get new array
        updateList(newFileList);
    };

    return (
        <Upload
            action="//semi.design/api/upload"
            onChange={onChange}
            fileList={list}
            showRetry={false}
        >
            <Button icon={<IconUpload />} theme="light">
                Click upload
            </Button>
        </Upload>
    );
};
```

### Photo Wall

Set `listType ='picture'`, users can upload pictures and display thumbnails in the list

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'dy.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
        },
    ];
    return (
        <>
            <Upload action={action} listType="picture" accept="image/*" multiple defaultFileList={defaultFileList}>
                <IconPlus size="extra-large" />
            </Upload>
        </>
    );
};
```

Set `showPicInfo`, you can view the basic information of the picture

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    let action = '//semi.design/api/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: '1.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        },
        {
            uid: '2',
            name: '2.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        },
    ];
    return (
        <>
            <Upload action={action} listType="picture" showPicInfo accept="image/*" multiple defaultFileList={defaultFileList}>
                <IconPlus size="extra-large" />
            </Upload>
        </>
    );
};
```

You can customize the preview icon through `renderPicPreviewIcon`, `onPreviewClick`, when the replacement icon `showReplace` is displayed, the preview icon will no longer be displayed. <br />
When you need to customize the preview/replacement function, you need to turn off the replacement function and use `renderPicPreviewIcon` to listen for icon click events. <br />
`onPreviewClick` listens for the click event of the single image container

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus, IconEyeOpened } from '@douyinfe/semi-icons';

() => {
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
    const handlePreview = (file) => {
        const feature = "width=300,height=300";
        window.open(file.url, 'imagePreview', feature);
    };
    return (
        <>
            <Upload
                action={action}
                listType="picture"
                showPicInfo
                accept="image/*"
                multiple
                defaultFileList={defaultFileList}
                onPreviewClick={handlePreview}
                renderPicPreviewIcon={()=><IconEyeOpened style={{ color: 'var(--semi-color-white)', fontSize: 24 }} />}
            >
                <IconPlus size="extra-large" />
            </Upload>
        </>
    );
};
```

Set `hotSpotLocation` to customize the order of click hotspots, the default is at the end of the photo wall list

```jsx live=true width=48%
import React from 'react';
import { Upload, Select, RadioGroup, Radio } from '@douyinfe/semi-ui';
import { IconPlus, IconEyeOpened } from '@douyinfe/semi-icons';

() => {
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
    const handlePreview = (file) => {
        const feature = "width=300,height=300";
        window.open(file.url, 'imagePreview', feature);
    };
    const [hotSpotLocation, setLocation] = useState('end');
    return (
        <>
            <RadioGroup
                value={hotSpotLocation}
                type='button'
                onChange={e => setLocation(e.target.value)}>
                <Radio value='start'>start</Radio>
                <Radio value='end'>end</Radio>
            </RadioGroup>
            <hr />
            <Upload
                action={action}
                listType="picture"
                showPicInfo
                accept="image/*"
                multiple
                hotSpotLocation={hotSpotLocation}
                defaultFileList={defaultFileList}
                onPreviewClick={handlePreview}
            >
                <IconPlus size="extra-large" />
            </Upload>
        </>
    );
};
```

### Photo Wall With Preview
With the Image component, through the renderThumbnail API, you can click on the image to enlarge the preview

```jsx live=true width=48%
import React from 'react';
import { Upload, Image } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    let action = 'https://api.semi.design/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'music.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url:
                'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        }
    ];
    return (
        <>
            <Upload
                action={action}
                listType="picture"
                accept="image/*"
                multiple
                defaultFileList={defaultFileList}
                renderThumbnail={(file) => (<Image src={file.url} />)}
            >
                <IconPlus size="extra-large" />
            </Upload>
        </>
    );
};
```

### Photo Wall Width/Height
By setting picHeight, picWidth (provided after v2.42), the width and height of picture wall elements can be uniformly set

```jsx live=true dir="column"
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    let action = 'https://api.semi.design/upload';
    const defaultFileList = [
        {
            uid: '1',
            name: 'image-1.jpg',
            status: 'success',
            size: '130KB',
            preview: true,
            url:
                'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
        }
    ];
    return (
        <>
            <Upload
                action={action}
                listType="picture"
                accept="image/*"
                multiple
                defaultFileList={defaultFileList}
                picHeight={110}
                picWidth={200}
            >
                <IconPlus size="extra-large" style={{ margin: 4 }} />
                Click to add picture
            </Upload>
        </>
    );
};
```

### Disabled

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    const defaultFileList = [
        {
            uid: '1',
            name: 'dyBag.jpeg',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png',
        },
        {
            uid: '2',
            name: 'abc.jpeg',
            status: 'validateFail',
            size: '222KB',
            preview: true,
            url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png',
        },
    ];
    let action = '//semi.design/api/upload';
    return (
        <>
            <Upload action={action} disabled defaultFileList={defaultFileList}>
                <Button icon={<IconUpload />} theme="light" disabled>
                    Click upload
                </Button>
            </Upload>
        </>
    );
};
```

### Manually trigger upload

`uploadTrigger='custom'`, the upload will not be triggered automatically after the file is selected. Need to manually call the upload method on the ref to trigger

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload, IconPlus } from '@douyinfe/semi-icons';

class ManulUploadDemo extends React.Component {
    constructor() {
        super();
        this.manulUpload = this.manulUpload.bind(this);
        this.uploadRef = React.createRef();
    }

    manulUpload() {
        this.uploadRef.current.upload();
    }

    render() {
        let action = '//semi.design/api/upload';
        return (
            <div>
                <Upload
                    accept="image/gif, image/png, image/jpeg, image/bmp, image/webp"
                    action={action}
                    uploadTrigger="custom"
                    ref={this.uploadRef}
                    onSuccess={(...v) => console.log(...v)}
                    onError={(...v) => console.log(...v)}
                >
                    <Button icon={<IconPlus />} theme="light" style={{ marginRight: 8 }}>
                        Select a document
                    </Button>
                </Upload>
                <Button icon={<IconUpload />} theme="light" onClick={this.manulUpload}>
                    Start upload
                </Button>
            </div>
        );
    }
}
```

### Drag and drop upload

`draggable='true'`, you can use the drag and drop function

<Notice type="primary" title="Notice">
    <div>When the directory is true, because the browser automatically imposes restrictions, it is not allowed to select a single file when clicking upload. When dragging, we think it is more reasonable to allow folders and files to be dragged, so no additional interception processing is performed.</div>
</Notice>

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';

() => (
    <Upload
        action="//semi.design/api/upload"
        draggable={true}
        dragMainText="Click to upload the file or drag and drop the file here"
        dragSubText="Support any type of file"
    ></Upload>
);
```

You can quickly set the content of the drag area through `dragIcon`, `dragMainText`, `dragSubText`

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconBolt } from '@douyinfe/semi-icons';

() => <Upload
    action="//semi.design/api/upload"
    dragIcon={<IconBolt />}
    draggable={true}
    accept="application/pdf,.jpeg"
    dragMainText={'Click to upload the file or drag and drop the file here'}
    dragSubText="Only supports jpeg, pdf"
    style={{ marginTop: 10 }}
></Upload>;
```

You can also pass in ReactNode through `children` to completely customize the display of the drag area

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconBolt } from '@douyinfe/semi-icons';

() => (<Upload
    action="//semi.design/api/upload"
    dragIcon={<IconBolt />}
    draggable={true}
    accept="application/pdf,.jpeg"
    style={{ marginTop: 10 }}
>
    <div className="components-upload-demo-drag-area">
        <img
            src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png"
            height="96"
            alt="upload"
            style={{ borderRadius: 4 }}
        />
        <div
            style={{
                fontSize: 14,
                marginTop: 8,
                flexBasis: '100%',
                textAlign: 'center',
                color: 'var(--semi-color-tertiary)',
            }}
        >
            Wow, you can really dance.
        </div>
    </div>
</Upload>
);
```

The scss style is as follows

```scss
.components-upload-demo-drag-area {
    border-radius: var(--semi-border-radius-small);
    border: 2px dashed var(--semi-color-border);
    width: 100%;
    padding: 12px;
    background-color: var(--semi-color-tertiary-light-default);
    display: flex;
    cursor: pointer;
    flex-wrap: wrap;
    justify-content: center;
    &:hover {
        background-color: var(--semi-color-primary-light-default);
        border-color: var(--semi-color-primary);
    }
}
```

### Custom check before upload

The file status can be updated through the `beforeUpload` hook, which is to verify the file after selecting the file before uploading online, `({ file: FileItem, fileList: Array<FileItem> }) => beforeUploadResult | Promise | boolean` During synchronization verification, a boolean (true means the verification passed, false means the verification failed, and the verification failure will prevent the file from uploading online) or an Object object. The specific structure is as follows

```ts
// beforeUploadResult:
{
     fileInstance?: File,
     status?:'success' |'uploadFail' |'validateFail' |'validating' |'uploading' |'wait',
     validateMessage?: React.ReactNode | string, // file validation information
     shouldUpload: boolean, // Whether to upload. The default is true, if it is false, the fileItem will only be displayed in the list, and the upload operation will not be triggered
     autoRemove: boolean, // Whether to remove the file from the fileList, the default is false
}
```

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

class ValidateDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.beforeUpload = this.beforeUpload.bind(this);
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

    beforeUpload({ file, fileList }) {
        let result;
        if (this.count > 0) {
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
                action="//semi.design/api/upload"
                transformFile={this.transformFile}
                beforeUpload={this.beforeUpload}
            >
                <Button icon={<IconUpload />} theme="light">
                    Click upload (synchronize check before upload)
                </Button>
            </Upload>
        );
    }
}
```

In the case of asynchronous verification, a Promise must be returned. Promise resolve means that the verification is passed, and reject means that the verification fails and the upload will not be triggered.
Object can be passed in when resolve/reject (the structure is the same as beforeUploadResult)

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

class AsyncBeforeUploadDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.beforeUpload = this.beforeUpload.bind(this);
        this.count = 0;
    }

    beforeUpload({ file, fileList }) {
        let result;
        return new Promise((resolve, reject) => {
            if (this.count > 1) {
                result = {
                    autoRemove: false,
                    shouldUpload: true,
                };
                this.count = this.count + 1;
                resolve(result);
            } else {
                result = {
                    autoRemove: false,
                    fileInstance: file.fileInstance,
                    status: 'validateFail',
                    shouldUpload: false,
                    validateMessage: `${this.count + 1} is doomed to fail`,
                };
                this.count = this.count + 1;
                reject(result);
            }
        });
    }

    render() {
        return (
            <Upload action="//semi.design/api/upload" beforeUpload={this.beforeUpload}>
                <Button icon={<IconUpload />} theme="light">
                    Click upload (asynchronous verification before upload)
                </Button>
            </Upload>
        );
    }
}
```

### Update file information after upload

The file status, verification information, and file name can be updated through the `afterUpload` hook.
`({ response: any, file: FileItem, fileList: Array<FileItem> }) => afterUploadResult`
afterUpload is triggered when the upload is completed (xhr.onload) and no error occurs, it needs to return an Object object (asynchronous return is not supported), the specific structure is as follows

```ts
// afterUploadResult:
{
    status?:'success' |'uploadFail' |'validateFail' |'validating' |'uploading' |'wait',
    validateMessage?: React.ReactNode | string, // file validation information
    autoRemove?: boolean, // Whether to remove the file from the fileList, the default is false
    name?: string;
    // The URL for previewing image file, usually the storage address returned by the Server after receiving response, supported since v2.63.
    // Previous versions can also manually update the controlled properties in the fileList through onChange callback.
    url?: string; // support after v2.63
}
```

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

class ValidateDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.count = 0;
    }

    afterUpload({ response, file }) {
        // It can be returned according to the business interface to determine whether the upload is successful.
        if (response.status_code === 200) {
            return {
                autoRemove: false,
                status: 'uploadFail',
                validateMessage: 'The content is illegal',
                name: 'RenameByServer.jpg',
            };
        } else {
            return {};
        }
    }

    render() {
        return (
            <Upload action="//semi.design/api/upload" afterUpload={this.afterUpload}>
                <Button icon={<IconUpload />} theme="light">
                    Click upload
                </Button>
            </Upload>
        );
    }
}
```

### Custom request

When customRequest is passed in, it is equivalent to using the custom request method to replace the upload built-in xhr request, and the user needs to take over the upload behavior by himself.
The file object of the current operation can be obtained in the input parameters, and the user implements the upload process by himself, and calls onProgress, onError, and onSuccess in the customRequest input parameters when appropriate to update the internal state of the Upload component
customRequest contains the following input parameters

```ts
{
     // current file name
     fileName: string,
     // props.data set by the user
     data: object,
     // FileItem, refer to the following document for the specific structure
     file: FileItem,
     // original File Object which extends Blob, the file object actually obtained by the browser (https://developer.mozilla.org/zh-CN/docs/Web/API/File)
     fileInstance: File,
     // Function that should be called during upload, event needs to include total and loaded attributes
     onProgress: (event: {total: number, loaded: number }) => any,
     // Function to be called when upload error
     onError: (userXhr: {status: number }, e: event) => any,
      // The function that should be called after the upload is successful, response is the request result after the upload is successful
     onSuccess: (response: any, e?: event) => any,
     // props.withCredentials set by the user
     withCredentials: boolean,
     // props.action set by the user
     action: string,
}
```

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    const mockRequest = ({ file, onProgress, onError, onSuccess }) => {
        let count = 0;
        let interval = setInterval(() => {
            if (count === 100) {
                clearInterval(interval);
                onSuccess();
                return;
            }
            onProgress({ total: 100, loaded: count });
            count += 20;
        }, 500);
    };

    return (
        <Upload action="//semi.design/api/upload" customRequest={mockRequest}>
            <Button icon={<IconUpload />} theme="light">
                Click upload
            </Button>
        </Upload>
    );
};
```

## API Reference

---

|Property | Description | Type | Default Value | Version |
|--- | --- | --- | --- | --- |
|accept | `html` Native attribute, accept uploaded [file type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept). <br/>The value of `accept` is the [MIME types string](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types) or file that you allow to select the file Suffix (.jpg, etc.) | string | | |
|action | File upload address, required | string | | |
|afterUpload | Hook after the file upload, update the file status according to the returned object | function(auProps) => afterUploadResult | | 1.0.0 |
|beforeClear|Call back before clearing the file, judge whether to continue removing according to the return value, return false, Promise.resolve(false), Promise.reject() will prevent removal|(fileList: Array<FileItem \>) => boolean \| Promise||1.31.0|
|beforeRemove|Callback before removing the file, judge whether to continue removing according to the return value, return false, Promise.resolve(false), Promise.reject() will prevent removal|(file: <FileItem\>, fileList: Array<FileItem \>) => boolean \| Promise||1.31.0|
|beforeUpload | The hook before uploading the file, according to the return object to update the file status, control whether to upload | function(buProps) => beforeUploadResult \| Promise \| boolean | | 1.0.0 |
|capture | The way of media shooting in the file upload control | boolean \| string \| undefined | | |
|className | class name | string | | |
|customRequest | Asynchronous request method for custom upload | (object: customRequestArgs) => void | | 1.5.0 |
|data | Additional parameters attached to the upload or the method to return the uploaded additional parameters| object\|(file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)) => object | {} | |
|defaultFileList | List of uploaded files | Array<FileItem\> | [] | |
|directory | Folder type upload | boolean | false | 1.20.0 |
|disabled | Whether to disable | boolean | false | |
|dragIcon | Icon on the left side of the drag area | ReactNode | `<IconUpload />` | 0.22.0 |
|dragMainText | Main text of the drag area | ReactNode |'Click to upload the file or drag and drop the file here' | 0.22.0 |
|dragSubText | Drag area help text | ReactNode |'' | 0.22.0 |
|draggable | Whether to support drag and drop upload | boolean | false | 0.22.0 |
|fileList | A list of uploaded files. When this value is passed in, upload is a controlled component | Array<FileItem\> | | 1.0.0 |
|fileName | has the same function as name and is mainly used in Form.Upload. In order to avoid conflicts with the props.name of Field, a renamed props is provided here | string | | 1.0.0 |
|headers | The headers attached to the upload or the method to return the uploaded additional headers| object\|(file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)) = > object | {} | |
|hotSpotLocation | 照片墙点击热区的放置位置，可选值 `start`, `end` | string | 'end' | 2.5.0 |
|itemStyle | Inline style of fileCard | CSSProperties | | 1.0.0 |
|limit | Maximum number of files allowed to be uploaded | number | | |
|listType | File list display type, optional `picture`, `list` | string |'list' | |
|maxSize | Maximum file size limit, in KB | number | | |
|minSize | Minimum file size limit, unit KB | number | | |
|multiple | Whether to allow multiple files to be selected at a time | boolean | false | |
|name | File name used when uploading | string |'' | |
|onAcceptInvalid | Triggered when the received file does not conform to the accept specification (generally because the folder selects all types of files / drags and drops files that do not conform to the format) | (files: File[]) => void | | 1.24 .0 |
|onChange | Called when the file status changes, including upload success, failure, upload, the callback input parameter is Object, including fileList, currentFile, etc.| ({fileList: Array<FileItem\>, currentFile?: FileItem}) = > void | | 1.0.0 |
|onClear | Callback when click to clear | () => void | | 1.1.0 |
|onDrop | Triggered when the dragged element is released on the drag area | (e, files: Array<File\>, fileList: Array<FileItem\>) => void | | 1.9.0 |
|onError | Callback when uploading error| (error: Error, file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList: Array<FileItem\> , xhr: XMLHttpRequest) => void | | |
|onExceed | Callback when the total number of uploaded files exceeds `limit` | (fileList:Array<FileItem\>) => void | | |
|onFileChange | Callback after file selection | (Array<File\>) => void | | |
|onOpenFileDialog | Triggered when opening the system file system file selection pop-up window | () => void | | 1.18.0 |
|onPreviewClick | Callback when the file card is clicked | (fileItem: FileItem) => void | | 1.8.0 |
|onProgress | Callback when uploading files| (percent: number, file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList: Array<FileItem\> ) => void | | |
|onRemove | Callback for removing files| (currentFile: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList:Array<FileItem\>, currentFileItem: FileItem ) => void | | |
|onRetry | Upload retry callback | (file: <FileItem\>) => void | | 1.18.0 |
|onSizeError | File size invalid callback| (file:[File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList:Array<FileItem\>) => void | | |
|onSuccess | Callback after successful upload| (responseBody: object, file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList:Array<FileItem\> ) => void | |
|picHeight | Set picture display height when listType='picture' | string\|number |  | 2.42.0 |
|picWidth | Set picture display width when listType='picture' | string\|number |  | 2.42.0 |
|previewFile | Customize the preview logic, the content returned by this function will replace the original thumbnail | (fileItem: FileItem) => ReactNode | | |
|prompt | Custom slot, which can be used to insert prompt text. Different from writing directly in `children`, the content of `prompt` will not trigger upload when clicked.<br/>(In the picture wall mode, the incoming prompt is only supported after v1.3.0) | ReactNode | | |
|promptPosition | The position of the prompt text. When the listType is list, the reference object is the children element; when the listType is picture, the reference object is the picture list. Optional values ​​`left`, `right`, `bottom`<br/> (In picture wall mode, promptPosition is only supported after v1.3.0) | string |'right' | |
|renderFileItem | Custom rendering of fileCard | (renderProps: RenderFileItemProps) => ReactNode | | 1.0.0 |
|renderFileOperation | Custom list item operation area | (renderProps: RenderFileItemProps)=>ReactNode | | 2.5.0 |
|renderPicInfo| Custom photo wall information, only valid in photo wall mode| (renderProps: RenderFileItemProps)=>ReactNode | | 2.2.0 |
|renderPicPreviewIcon| The preview icon displayed when customizing the photo wall hover, only valid in photo wall mode | (renderProps: RenderFileItemProps)=>ReactNode | | 2.5.0 |
|renderThumbnail| Custom picture wall thumb, only valid in photo wall mode| (renderProps: RenderFileItemProps)=>ReactNode | | 2.2.0 |
|showClear | When limit is not 1 and the current number of uploaded files is greater than 1, whether to show the clear button | boolean | true | 1.0.0 |
|showPicInfo| Whether to display picture information, only valid in photo wall mode | boolean| false | 2.2.0 |
|showReplace | When the upload is successful, whether to display the replace button inside the fileCard | boolean | false | 1.21.0 |
|showRetry | When uploading fails, whether to display the retry button inside the fileCard | boolean | true | 1.0.0 |
|showUploadList | Whether to display the file list | boolean | true | |
|style | Style | CSSProperties | | |
|transformFile | After selecting the file, the callback function before uploading the file can be used to customize the conversion processing of the file | (file:[File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)) => FileItem | | 1.0.0 |
|uploadTrigger | Trigger upload timing, optional values ​​`auto`, `custom` | string |'auto' | |
|validateMessage | Upload the overall error message | ReactNode | | 1.0.0 |
|withCredentials | Whether to bring cookie information | boolean | false | |

## Accessibility

The Upload component is an interactive control that can trigger file selection when clicking or dragging. After the file is selected, the status will be displayed in the file list.

### ARIA

- Add `role="button"` to clickable elements
- Add `role="list"` to the file list and describe it with `aria-label`

## Interfaces

### FileItem Interface

<Notice title='Notice'>
    uid is the unique identifier of the file, and upload update and delete logic strongly relies on this value.
    If the current file is selected and added by upload, uid will be automatically generated.
    If it is passed in by props.defaultFileList or props.fileList, it must be passed, and you need to ensure that it will not be repeated
</Notice>

```ts
interface FileItem {
    event?: event, // xhr event
    fileInstance?: File, // original File Object which extends Blob, the file object actually obtained by the browser (https://developer.mozilla.org/zh-CN/docs/Web/API/File)
    name: string,
    percent?: number, // upload progress percentage
    preview: boolean, // Whether to preview according to url
    response?: any, // xhr's response, response body when the request is successful, and corresponding error when the request fails
    shouldUpload?: boolean; // Should you continue to upload
    showReplace?: boolean, // Separately control whether the file displays the replace button
    showRetry?: boolean, // Separately control whether the file displays the retry button
    size: string, // file size, unit kb
    status: string, //'success' |'uploadFail' |'validateFail' |'validating' |'uploading' |'wait';
    uid: string, // The unique identifier of the file. If the current file is selected and added by upload, the uid will be automatically generated. If it is defaultFileList, you need to ensure that it will not be repeated
    url: string,
    validateMessage?: ReactNode | string,
}
```

## Methods

Some internal methods provided by Upload can be accessed through ref:

|Name | Description | Type | Version|
|----|----|----|----|
| insert | Upload file, when index is passed, it will be inserted at the specified position, if not passed, it will be inserted at the end | (files: Array<File\>, index?: number) => void | 2.2.0 |
| upload | Start upload manually, use with uploadTrigger="custom" | () => void | |
| openFileDialog | open file select Dialog | () => void | 2.21.0 |

## Content Guidelines
- Upload button
   - For the copywriting specification of the form button, refer to [The content Guidelines of the Button component]()
- Help text
   - The help text is written in sentences, the first letter is capitalized, and periods may not be required
- Error message
   - Clearly tell the user why the file cannot be uploaded, and tell the user how to upload it successfully
   - Help texts are written using sentences, capitalized
   - Concise language that users can read at a glance, such as `File size must be less than 20MB`, `File type must be .gif, .jpg, .png or .svg`

## Design Tokens
<DesignToken/>

## FAQ

- When will the retry button appear?
    - When `showRetry` is true and the upload of the current file fails due to a network error, the retry button will be displayed. Other statuses such as verification failed, upload successful, etc. will not display the retry button.
- When will the replace button appear?
    - When `showReplace` is true and the current file status is uploaded, the replace button will be displayed.
- Where did Semi save the pictures?
    - Semi is not responsible for the preservation of the image, you need to customize the action when you use the Upload component. You can choose to set action as your own server address or image service address.
- Didn’t call the XXX method after uploading the picture?
    - If you set `accept`, you can try to remove the accept attribute, and then see if the modified method is called. After removing it, the method is called to explain that the file type obtained by accept in the current environment does not match the set accept, and the upload behavior is terminated early. You can make a breakpoint to upload/foundation.js checkFileFormat function to see if the actual value of file.type obtained meets expectations.

<Notice title={"About the progress bar"}>The progress bar indicates the upload progress. The upload progress is divided into two parts: data upload and server return. If all the data has been sent, but the server does not return a response, the progress bar will stay at 90%. The user upload is not completed. At this time, the request in the developer tool will be pending, which is normal. </Notice>
