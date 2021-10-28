---
localeCode: zh-CN
order: 32
category: 输入类
title: Upload 上传
icon: doc-upload
width: 48%
brief: 文件选择上传
---

## 代码演示

### 如何引入

```jsx import
import { Upload } from '@douyinfe/semi-ui';
```
### 基本

最基本的用法，在 children 内放置一个 Button，点击 children 内容（即放置的 Button）激活文件选择框，选择完成后自动开始上传

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

<Upload action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859">
    <Button icon={<IconUpload />} theme="light">
        点击上传
    </Button>
</Upload>
```

### 添加提示文本

通过 `prompt` 插槽，设置自定义提示文本  
通过 `promptPosition` 设置插槽位置，可选 `left`、`right`、`bottom`，默认为 `right`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    const action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    const getPrompt = (pos, isListType) => {
        let basicStyle = { display: 'flex', alignItems: 'center', color: 'grey', height: isListType ? '100%' : 32 };
        let marginStyle = {
            left: { marginRight: 10 },
            right: { marginLeft: 10 },
        };
        let style = { ...basicStyle, ...marginStyle[pos] };

        return <div style={style}>请上传资格认证材料</div>;
    };
    const button = (
        <Button icon={<IconUpload />} theme="light">
            {' '}
            点击上传{' '}
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

当 listType 为 picture 时，promptPosition 位置的参照对象为图片墙列表整体

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    const action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    const getPrompt = (pos, isListType) => {
        let basicStyle = { display: 'flex', alignItems: 'center', color: 'grey', height: isListType ? '100%' : 32 };
        let marginStyle = {
            left: { marginRight: 10 },
            right: { marginLeft: 10 },
        };
        let style = { ...basicStyle, ...marginStyle[pos] };

        return <div style={style}>请上传萌宠认证材料</div>;
    };
    const defaultFileList = [
        {
            uid: '1',
            name: 'jiafang1.jpeg',
            status: 'success',
            size: '130kb',
            url:
                'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/bf8647bffab13c38772c9ff94bf91a9d.jpg',
        },
        {
            uid: '2',
            name: 'jiafang2.jpeg',
            size: '222kb',
            url:
                'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dbf7351bb779433d17c4f50478cf42f7.jpg',
        },
        {
            uid: '5',
            name: 'jiafang3.jpeg',
            percent: 50,
            size: '222kb',
            url:
                'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/8bd8224511db085ed74fea37205aede5.jpg',
        },
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

### 点击头像触发上传

```jsx live=true width=48%
import React from 'react';
import { Upload, Avatar, Toast } from '@douyinfe/semi-ui';
import { IconCamera } from '@douyinfe/semi-icons';

() => {
    const [url, setUrl] = useState('https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg');
    const onSuccess = (response, file) => {
        Toast.success('头像更新成功');
        setUrl('https://sf6-cdn-tos.douyinstatic.com/obj/ttfe/ies/semi/ttmoment.jpeg');
    };

    const style = {
        backgroundColor: 'rgba(0,0,0,.4)',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
    };
    
    const hoverMask =  (<div style={style}>
        <IconCamera />
    </div>);

    const api = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    let imageOnly = 'image/*';

    return (
        <Upload
            className="avatar-upload"
            action={api}
            onSuccess={onSuccess}
            accept={imageOnly}
            showUploadList={false}
            onError={() => Toast.error('上传失败')}
        >
            <Avatar src={url} style={{ margin: 4 }} hoverMask={hoverMask} />
        </Upload>
    )
}
```

```css
.avatar-upload .semi-upload-add {
    border-radius: 50%; // 确保只有圆是点击热区
}
```

### 自定义上传属性

通过设置 `data`、`headers` 可添加自定义上传属性

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
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
                点击上传
            </Button>
        </Upload>
    );
};
```

### 上传文件类型

通过 `accept 属性（`input` 的原生 `html` 属性）可以限制上传的文件类型。

`accept` 支持传入以下两种类型字符串：

- 文件后缀名集合（推荐），如 .jpg、.png 等；
- 文件类型的 MIME types 集合，可参考[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)  

例如只允许用户上传 PNG 和 PDF 文件，`accept` 可以这样写： `accept = '.pdf,.png'` 或 `accept = 'application/pdf,image/png'`（将 PNG 与 PDF 的 MIME type 通过`,`连接起来即可）。

<Notice type="primary" title="注意事项">
    <div>Upload 会在内部拦截掉不符合 accept 格式的文件，当拦截到不符合格式要求的文件时，会触发 onAcceptInvalid 方法（v1.24提供）；</div>
    <div>accept 使用后缀可以避免因为浏览器或者操作系统的不同导致 file.type 与 MIME 不兼容问题。</div>
</Notice>


```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    let imageOnly = 'image/*';
    let videoOnly = 'video/*';
    let fileLimit = '.pdf,.png,.jpeg';
    return (
        <>
            <Upload action={action} accept={imageOnly} style={{ marginBottom: 12 }}>
                <Button icon={<IconUpload />} theme="light">
                    上传图片
                </Button>
            </Upload>
            <Upload action={action} accept={videoOnly} style={{ marginBottom: 12 }}>
                <Button icon={<IconUpload />} theme="light">
                    上传视频
                </Button>
            </Upload>
            <Upload action={action} accept={fileLimit}>
                <Button icon={<IconUpload />} theme="light">
                    上传 PDF, PNG, JPEG
                </Button>
            </Upload>
        </>
    );
};
```

### 上传文件夹

通过传入 `directory` 为 `true`，可以支持上传文件夹下的所有文件

```jsx live=true
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    return (
        <>
            <Upload action={action} directory>
                <Button icon={<IconUpload />} theme="light">
                    上传文件夹
                </Button>
            </Upload>
        </>
    );
};
```

### 一次选中多个文件

通过设置 `multiple` 属性可以支持同时选中多个文件上传。

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    return (
        <Upload action={action} multiple>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    );
};
```

### 限制文件总数量

通过设置 `limit` 属性可以限制最大可上传的文件数  
当 `limit` 为1时，始终用最新上传的代替当前，并不会触发onExceed回调**v1.5.0生效**

```jsx dir="column" live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https:https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    let limit = 1;
    let onChange = props => {
        console.log(props.fileList)
    };
    return (
        <Upload
            action={action}
            limit={limit}
            onChange={onChange}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传（最多{limit}项）
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
    let action = 'https:https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
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
            onExceed={() => Toast.warning(`最多只允许上传${limit}个文件`)}
            onChange={onChange}
        >
            <Button icon={<IconUpload />} theme="light" disabled={disabled}>
                点击上传（最多{limit}项）
            </Button>
        </Upload>
    );
};
```

照片墙模式下，当已上传文件数量等于 limit 时，会自动隐藏上传入口

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    const defaultFileList = [
        {
            uid: '1',
            name: 'vigo.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://sf6-cdn-tos.douyinstatic.com/img/ee-finolhu/c2a65140483e4a20802d64af5fec1b39~noop.image',
        },
        {
            uid: '2',
            name: 'vigo2.jpeg',
            status: 'success',
            size: '222KB',
            preview: true,
            fileInstance: new File([new ArrayBuffer(2048)], 'vigo2.jpeg', { type: 'image/png' }),
            url: 'https://sf6-cdn-tos.douyinstatic.com/img/ee-finolhu/c2a65140483e4a20802d64af5fec1b39~noop.image',
        },
    ];
    return (
        <Upload
            action={action}
            limit={2}
            listType="picture"
            accept="image/*"
            defaultFileList={defaultFileList}
            onExceed={() => Toast.warning('最多只允许上传2个文件')}
        >
            <IconPlus size="extra-large" />
        </Upload>
    );
};
```

### 限制上传文件大小

通过 `maxSize` 和 `minSize` 属性可以自定义上传文件大小的限制，通过设置 `onSizeError` 可以设置超出限制时的回调。

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';

    return (
        <>
            <Upload
                action={action}
                maxSize={1024}
                minSize={200}
                onSizeError={(file, fileList) => Toast.error(`${file.name} size invalid`)}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传（最小 200KB，最大 1MB）
                </Button>
            </Upload>
        </>
    );
};
```

### 自定义预览逻辑

`listType` 为 `list` 时，可以通过传入 `previewFile` 览逻辑。  
例如你不需要对图片类型进行缩略图预览时，可以在 `previewFile` 中恒定返回一个`<IconFile />`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload, IconFile } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    const defaultFileList = [
        {
            uid: '1',
            name: 'vigo.png',
            status: 'success',
            size: '130KB',
            url: 'https://sf6-cdn-tos.douyinstatic.com/img/ee-finolhu/c2a65140483e4a20802d64af5fec1b39~noop.image',
        },
    ];
    return (
        <Upload
            defaultFileList={defaultFileList}
            action={action}
            previewFile={file => <IconFile size="large" />}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    );
};
```

### 默认文件列表

通过 `defaultFileList` 可以展示已上传的文件。当需要预览默认文件的缩略图时，你可以将 `defaultFileList` 内对应 `item` 的 `preview` 属性设为 `true`

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';

    const defaultFileList = [
        {
            uid: '1',
            name: 'vigo.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://sf6-cdn-tos.douyinstatic.com/img/ee-finolhu/c2a65140483e4a20802d64af5fec1b39~noop.image',
        },
        {
            uid: '2',
            name: 'vigo2.jpeg',
            status: 'uploadFail',
            size: '222KB',
            preview: true,
            fileInstance: new File([new ArrayBuffer(2048)], 'vigo2.jpeg', { type: 'image/png' }),
            url: 'https://sf6-cdn-tos.douyinstatic.com/img/ee-finolhu/c2a65140483e4a20802d64af5fec1b39~noop.image',
        },
    ];

    return (
        <>
            <Upload action={action} defaultFileList={defaultFileList}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        </>
    );
};
```

### 受控组件

当传入`fileList`时，作为受控组件使用。需要监听 onChange 回调，并且将 fileList 回传给 Upload（注意需传入一个新的数组对象）

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    const initList = [
        {
            uid: '1',
            name: 'vigo.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/e82f3b261133d2b20d85e8483c203112.jpg',
        },
        {
            uid: '2',
            name: 'jiafang.jpeg',
            status: 'uploading',
            size: '222KB',
            percent: 50,
            preview: true,
            fileInstance: new File([new ArrayBuffer(2048)], 'jiafang.jpeg', { type: 'image/jpeg' }),
            url:
                'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/4a55704fb0b8b85eaccdb4ed22469f57.jpg',
        },
    ];

    const [list, updateList] = useState(initList);

    const onChange = ({ fileList, currentFile, event }) => {
        console.log('onChange');
        console.log(fileList);
        console.log(currentFile);
        let newFileList = [...fileList]; // spread to get new array
        updateList(newFileList);
    }

    return (
        <Upload
            action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859"
            onChange={onChange}
            fileList={list}
            showRetry={false}
        >
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    )
}
```

### 照片墙

设置 `listType = 'picture'`，用户可以上传图片并在列表中显示缩略图

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';

() => {
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    const defaultFileList = [
        {
            uid: '1',
            name: 'jiafang.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url:
                'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/e82f3b261133d2b20d85e8483c203112.jpg',
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

### 禁用

```jsx live=true width=48%
import React from 'react';
import { Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';

() => {
    const defaultFileList = [
        {
            uid: '1',
            name: 'vigo.png',
            status: 'success',
            size: '130KB',
            preview: true,
            url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/e82f3b261133d2b20d85e8483c203112.jpg',
        },
        {
            uid: '2',
            name: 'vigo2.jpeg',
            status: 'validateFail',
            size: '222KB',
            preview: true,
            url: 'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/e82f3b261133d2b20d85e8483c203112.jpg',
        },
    ];
    let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
    return (
        <>
            <Upload action={action} disabled defaultFileList={defaultFileList}>
                <Button icon={<IconUpload />} theme="light" disabled>
                    点击上传
                </Button>
            </Upload>
        </>
    );
};
```

### 手动触发上传

`uploadTrigger='custom'`，选中文件后将不会自动触发上传。需要手动调用 `ref` 上的 `upload` 方法触发

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
        let action = 'https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859';
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
                        选择文件
                    </Button>
                    <Button icon={<IconUpload />} theme="light" onClick={this.manulUpload}>
                        开始上传
                    </Button>
                </Upload>
            </div>
        );
    }
}
```

### 拖拽上传

`draggable='true'`，可以使用拖拽功能

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';

() => (
    <Upload
        action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859"
        draggable={true}
        dragMainText={'点击上传文件或拖拽文件到这里'}
        dragSubText="支持任意类型文件"
    ></Upload>
);
```

可以通过 `dragIcon`、`dragMainText`、`dragSubText` 快捷设置拖拽区内容

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconBolt } from '@douyinfe/semi-icons';

() => <Upload
    action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859"
    dragIcon={<IconBolt />}
    draggable={true}
    accept="application/pdf,.jpeg"
    dragMainText={'点击上传文件或拖拽文件到这里'}
    dragSubText="仅支持jpeg、pdf"
    style={{ marginTop: 10 }}
></Upload>
```

还可以通过 `children` 传入 ReactNode，完全自定义拖拽区的显示

```jsx live=true width=48%
import React from 'react';
import { Upload } from '@douyinfe/semi-ui';
import { IconBolt } from '@douyinfe/semi-icons';

() => (<Upload
    action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859"
    dragIcon={<IconBolt />}
    draggable={true}
    accept="application/pdf,.jpeg"
    style={{ marginTop: 10 }}
>
    <div className="components-upload-demo-drag-area">
        <img
            src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/0f2a32f27eab90a296814fbc26103b2b.jpg"
            height="96"
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
)
```

Scss 样式如下

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

### 上传前自定义校验

可通过 `beforeUpload` 钩子，对文件状态进行更新，这是在网络上传前，选择文件后进行校验，`({ file: FileItem, fileList: Array<FileItem> }) => beforeUploadResult | Promise | boolean` 同步校验时需返回 boolean（true 为校验通过，false 为校验失败，校验失败会阻止文件网络上传）或者一个 Object 对象，具体结构如下

```ts
// beforeUploadResult:
{
    fileInstance?: File,
    status?: 'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait',
    validateMessage?: React.ReactNode | string, // 文件的校验信息
    shouldUpload: boolean, // 是否需要上传。默认为true，如果为false，该fileItem只会被展示在列表中，不会触发上传操作
    autoRemove: boolean, // 是否从fileList中移除该文件，默认为false
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
                action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859"
                transformFile={this.transformFile}
                beforeUpload={this.beforeUpload}
            >
                <Button icon={<IconUpload />} theme="light">
                    点击上传（上传前同步校验）
                </Button>
            </Upload>
        );
    }
}
```

异步校验时，需返回 Promise，Promise resolve 代表检验通过，reject 代表校验失败，不会触发上传。  
resolve/reject 时可以传入 object（结构同上 beforeUploadResult）

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
                    validateMessage: `第${this.count + 1}个注定失败`,
                };
                this.count = this.count + 1;
                reject(result);
            }
        });
    }

    render() {
        return (
            <Upload action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859" beforeUpload={this.beforeUpload}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传（上传前异步校验）
                </Button>
            </Upload>
        );
    }
}
```

### 上传后更新文件信息

可以通过 `afterUpload` 钩子，对文件状态，校验信息，文件名进行更新。  
`({ response: any, file: FileItem, fileList: Array<FileItem> }) => afterUploadResult`  
afterUpload 在上传完成后(xhr.onload)且没有发生错误的情况下触发，需返回一个 Object 对象（不支持异步返回），具体结构如下

```ts
// afterUploadResult:
{
    status?: 'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait',
    validateMessage?: React.ReactNode | string, // 文件的校验信息
    autoRemove: boolean, // 是否从fileList中移除该文件，默认为false
    name: string,
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
        // 可以根据业务接口返回，决定当次上传是否成功
        if (response.status_code === 200) {
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

    render() {
        return (
            <Upload action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859" afterUpload={this.afterUpload}>
                <Button icon={<IconUpload />} theme="light">
                    点击上传
                </Button>
            </Upload>
        );
    }
}
```

### 自定义请求

当传入 customRequest 时, 相当于使用的自定义的请求方法替换了 upload 内置的 xhr 请求，用户需要自行接管上传行为。  
可在入参中获取到当前操作的 file 对象，用户自行实现上传过程，并且在适当的时候调用 customRequest 入参中的 onProgress、onError、onSuccess 以更新 Upload 组件内部状态  
customRequest 包含以下入参

```ts
{
    // 当前文件名称
    fileName: string,
    // 用户设置的props.data
    data: object,
    // FileItem，具体结构参考下面的文档
    file: FileItem,
    // original File Object which extends Blob, 浏览器实际获取到的文件对象(https://developer.mozilla.org/zh-CN/docs/Web/API/File)
    fileInstance: File,
    // 上传过程中应调用的函数，event需要包含 total、loaded属性
    onProgress: (event: { total: number, loaded: number }) => any,
    // 上传出错时应调用的函数
    onError: (userXhr: { status: number }, e: event) => any,
     // 上传成功后应调用的函数, response为上传成功后的请求结果
    onSuccess: (response: any, e: event) => any,
    // 用户设置的props.withCredentials
    withCredentials: boolean,
    // 用户设置的props.action
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
        <Upload action="https://run.mocky.io/v3/d6ac5c9e-4d39-4309-a747-7ed3b5694859" customRequest={mockRequest}>
            <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button>
        </Upload>
    );
};
```

## API 参考

---

|属性 | 说明 | 类型 | 默认值 | 版本 |
|--- | --- | --- | --- | --- |
|accept | `html` 原生属性，接受上传的[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)。<br/>`accept` 的值为你允许选择文件的[MIME types 字符串](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)或文件后缀（.jpg等） | string | |  |
|action | 文件上传地址，必填 | string |  |  |
|afterUpload | 文件上传后的钩子，根据 return 的 object 更新文件状态 | function(auProps) => afterUploadResult |  | 1.0.0 |
|beforeClear|清空文件前回调，按照返回值来判断是否继续移除，返回false、Promise.resolve(false)、Promise.reject()会阻止移除|(fileList: Array<FileItem \>) => boolean \| Promise||1.31.0|
|beforeRemove|移除文件前的回调，按照返回值来判断是否继续移除，返回false、Promise.resolve(false)、Promise.reject()会阻止移除|(file: <FileItem\>, fileList: Array<FileItem \>) => boolean \| Promise||1.31.0|
|beforeUpload | 上传文件前的钩子，根据 return 的 object 更新文件状态，控制是否上传 | function(buProps) => beforeUploadResult \| Promise \| boolean |  | 1.0.0 |
|capture | 文件上传控件中媒体拍摄的方式 | boolean \| string \| undefined | | |
|className | 类名 | string |  |  |
|customRequest | 自定义上传使用的异步请求方法 | (object: customRequestArgs) => void |  | 1.5.0 |
|data | 上传时附带的额外参数或返回上传额外参数的方法 | object\|(file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)) => object | {} |  |
|defaultFileList | 已上传的文件列表 | Array<FileItem\> | [] |  |
|directory | 文件夹类型上传 | boolean | false | 1.20.0 |
|disabled | 是否禁用 | boolean | false |  |
|dragIcon | 拖拽区左侧 Icon | ReactNode | `<IconUpload />` | 0.22.0 |
|dragMainText | 拖拽区主文本 | ReactNode | '点击上传文件或拖拽文件到这里' | 0.22.0 |
|dragSubText | 拖拽区帮助文本 | ReactNode | '' | 0.22.0 |
|draggable | 是否支持拖拽上传 | boolean | false | 0.22.0 |
|fileList | 已上传的文件列表，传入该值时，upload 即为受控组件 | Array<FileItem\> |  | 1.0.0 |
|fileName | 作用与 name 相同，主要在 Form.Upload 中使用，为了避免与 Field 的 props.name 冲突，此处另外提供一个重命名的 props | string |  | 1.0.0 |
|headers | 上传时附带的 headers 或返回上传额外 headers 的方法 | object\|(file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)) => object | {} |  |
|itemStyle | fileCard 的内联样式 | CSSProperties |  | 1.0.0 |
|limit | 最大允许上传文件个数 | number |  |  |
|listType | 文件列表展示类型，可选`picture`、`list` | string | 'list' |  |
|maxSize | 文件体积最大限制，单位 KB | number |  |  |
|minSize | 文件体积最小限制，单位 KB | number |  |  |
|multiple | 是否允许单次选中多个文件 | boolean | false |  |
|name | 上传时使用的文件名 | string | '' |  |
|onAcceptInvalid | 当接收到的文件不符合accept规范时触发（一般是因为文件夹选择了全部类型文件/拖拽不符合格式的文件时触发） | (files: File[]) => void | | 1.24.0 |
|onChange | 文件状态发生变化时调用，包括上传成功，失败，上传中，回调入参为 Object，包含 fileList、currentFile 等值 | ({fileList: Array<FileItem\>, currentFile?: FileItem}) => void |  | 1.0.0 |
|onClear | 点击清空时的回调 | () => void |  | 1.1.0 |
|onDrop | 当拖拽的元素在拖拽区上被释放时触发 | (e, files: Array<File\>, fileList: Array<FileItem\>) => void |  | 1.9.0 |
|onError | 上传错误时的回调 | (error: Error, file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList: Array<FileItem\>, xhr: XMLHttpRequest) => void |  |  |
|onExceed | 上传文件总数超出 `limit` 时的回调 | (fileList:Array<FileItem\>) => void |  |  |
|onFileChange | 选中文件后的回调 | (Array<File\>) => void |  |  |
|onOpenFileDialog | 打开系统文系统文件选择弹窗时触发 | () => void |  | 1.18.0 |
|onPreviewClick | 点击文件卡片时的回调 | (fileItem: FileItem) => void |  | 1.8.0 |
|onProgress | 上传文件时的回调 | (percent: number, file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList: Array<FileItem\>) => void |  |  |
|onRemove | 移除文件的回调 | (currentFile: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList:Array<FileItem\>, currentFileItem: FileItem) => void |  |  |
|onRetry | 上传重试的回调 | (file: <FileItem\>) => void |  | 1.18.0 |
|onSizeError | 文件尺寸非法的回调 | (file:[File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList:Array<FileItem\>) => void |  |  |
|onSuccess | 上传成功后的回调 | (responseBody: object, file: [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File), fileList:Array<FileItem\>) => void |  |
|previewFile | 自定义预览逻辑，该函数返回内容将会替换原缩略图 | (fileItem: FileItem) => ReactNode |  |  |
|prompt | 自定义插槽，可用于插入提示文本。与直接在 `children` 中写的区别时，`prompt` 的内容在点击时不会触发上传<br/>（图片墙模式下，v1.3.0 后才支持传入 prompt） | ReactNode |  |  |
|promptPosition | 提示文本的位置，当 listType 为 list 时，参照物为 children 元素；当 listType 为 picture 时，参照物为图片列表。可选值 `left`、`right`、`bottom`<br/>（图片墙模式下，v1.3.0 后才支持使用 promptPosition） | string | 'right' |  |
|renderFileItem | fileCard 的自定义渲染 | (renderProps: RenderFileItemProps) => ReactNode |  | 1.0.0 |
|showClear | 在 limit 不为 1 且当前已上传文件数大于 1 时，是否展示清空按钮 | boolean | true | 1.0.0 |
|showReplace | 上传成功时，是否展示在 fileCard 内部展示替换按钮 | boolean | false | 1.21.0 |
|showRetry | 上传失败时，是否展示在 fileCard 内部展示重试按钮 | boolean | true | 1.0.0 |
|showUploadList | 是否显示文件列表 | boolean | true |  |
|style | 样式 | CSSProperties |  |  |
|transformFile | 选中文件后，上传文件前的回调函数，可用于对文件进行自定义转换处理 | (file:[File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)) => FileItem |  | 1.0.0 |
|uploadTrigger | 触发上传时机，可选值 `auto`、`custom` | string | 'auto' |  |
|validateMessage | Upload 整体的错误信息 | ReactNode |  | 1.0.0 |
|withCredentials | 是否带上 Cookie 信息 | boolean | false |  |


## Interfaces
### FileItem Interface

<Notice title='注意'>
    uid为文件唯一标识符，Upload的更新、删除等逻辑对该值强依赖。  
    如果当前文件是通过upload选中添加的，会自动生成uid。  
    如果是props.defaultFileList或者props.fileList传入的, 必传，且需要自行保证不会重复  
</Notice>

```ts
interface FileItem {
    event? : event,  // xhr event
    fileInstance?: File, // original File Object which extends Blob, 浏览器实际获取到的文件对象(https://developer.mozilla.org/zh-CN/docs/Web/API/File)
    name: string,
    percent? : number, // 上传进度百分比
    preview: boolean, // 是否根据url进行预览
    response?: any, // xhr的response, 请求成功时为respoonse body，请求失败时为对应 error
    shouldUpload?: boolean; // 是否应该继续上传
    showReplace?: boolean, // 单独控制该file是否展示替换按钮
    showRetry?: boolean, // 单独控制该file是否展示重试按钮
    size: string, // 文件大小，单位kb
    status: string, // 'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait';
    uid: string, // 文件唯一标识符，如果当前文件是通过upload选中添加的，会自动生成uid。如果是defaultFileList, 需要自行保证不会重复
    url: string,
    validateMessage?: ReactNode | string,
}
```

### RenderFileItemProps Interface

```ts
interface RenderFileItemProps extends FileItem {
    previewFile: (fileItem: FileItem) => ReactNode; // 自定义预览元素
    listType: 'picture' | 'list'; // 文件列表展示类型
    onRemove: () => void; // 移除
    onRetry: () => void; // 重试
    onReplace: () => void; // 替换文件
    key: string; // Item key
    showRetry: boolean; // 是否展示重试
    showReplace: boolean; // 是否展示替换
    style: CSSProperties; // 传入的itemStyle
    disabled: boolean; // 是否禁用
    onPreviewClick: () => void; // 点击预览
}
```

## 设计变量
<DesignToken/>


## FAQ

-   什么时候会展示重试按钮？
    -   当 `showRetry` 为 true，且当前文件是由于网络原因错误导致的上传失败时，会展示重试按钮。其他如校验失败，上传成功等状态是不会展示重试按钮的。
-   什么时候会展示替换按钮？
    -   当 `showReplace` 为true，且当前文件状态为已上传时，会展示替换按钮。
-   Semi Upload把图片存到哪里了？
    -   Semi Upload不负责图片的保存，当你使用 Upload 组件时需要自定义 action。你可以选择把 action 设置为自己的服务器地址或者图片服务地址。
-   Form.Upload props.name无效？
    - Form.Field 中有props.name，Upload也有props.name，同名props会冲突。使用Form.Upload时，可以转为使用 props.fileName，避免冲突
-   上传图片后没有调用 XXX 方法？
    - 如果你设置了 `accept`，可以尝试把 accept 属性去掉，然后再看是否调用了改方法。去掉后调用了该方法说明，accept 在当前环境下获取的 file type 与设置的 accept 不符，上传行为提前终止。可以打个断点到 upload/foundation.js checkFileFormat 函数，看下获取的 file.type 真实值是否符合预期。

<Notice title={"关于进度条"}>进度条表示上传进度，上传进度分为数据上载和服务器返回两部分，如果数据已经全部发出，但是服务器没有返回响应，进度条会停留在90%提示用户上传并没有完成，此时开发者工具中请求会处于 pending, 这是正常现象。仅当服务器返回响应，上传流程才真正结束，上传进度会达到100%</Notice>


<!-- ## 相关物料

```material
82
``` -->
