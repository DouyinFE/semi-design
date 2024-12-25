---
localeCode: zh-CN
order: 90
category: Plus
title: AudioPlayer 音频播放器
icon: doc-audioplayer
width: 60%
brief: 用于方便用户自定义快捷键及相关操作
showNew: true
---

## 代码演示

### 如何引入
AudioPlayer 从  开始支持

```jsx import
import { AudioPlayer } from '@douyinfe/semi-ui';
```


### 基本用法

基本使用，通过`audioUrl`传入音频地址
audioUrl 可以传入字符串，字符串数组，对象，对象数组, 具体参数参考 [AudioPlayer](#AudioPlayer)

```jsx live=true noInline=true dir="column"
import React from 'react';
import { AudioPlayer } from '@douyinfe/semi-ui';

function Demo() {
    const audioUrl = 'http://music.163.com/song/media/outer/url?id=447925558.mp3';
    const audioUrlArr = [
        'http://music.163.com/song/media/outer/url?id=447925558.mp3',
        'http://music.163.com/song/media/outer/url?id=447925558.mp3',
    ];
    const audioUrlObj = {
        src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
        title: '音频标题',
        cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
    };
    const audioUrlArrObj = [
        {
            src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
            title: '音频标题1',
            cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
        },
        {
            src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
            title: '音频标题2',
            cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
        },
    ];
  
    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginTop: 10 }}>
                <AudioPlayer
                    autoPlay={false}
                    audioUrl={audioUrl}
                />
            </div>
            <div style={{ marginTop: 10 }}>
                <AudioPlayer
                    autoPlay={false}
                    audioUrl={audioUrlObj}
                />
            </div>
            <div style={{ marginTop: 10 }}>
                <AudioPlayer
                    autoPlay={false}
                    audioUrl={audioUrlArr}
                />
            </div>
            <div style={{ marginTop: 10 }}>
                <AudioPlayer
                    autoPlay={false}
                    audioUrl={audioUrlArrObj}
                />
            </div>
        </div>
    );
}

render(Demo);

```


### 隐藏工具栏

showToolbar 设置为false，则隐藏工具栏


```jsx live=true noInline=true dir="column"
import React from 'react';
import { AudioPlayer } from '@douyinfe/semi-ui';

function Demo() {
    const audioUrlObj = {
        src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
        title: '音频标题'
    };
  
    return (
        <div style={{ width: '100%' }}>
            <AudioPlayer
                autoPlay={false}
                audioUrl={audioUrlObj}
                showToolbar={false}
            />
        </div>
    );
}

render(Demo);

```

### 主题

通过 `theme` 设置音频播放器主题，支持 `light` 和 `dark`，默认 `dark`


```jsx live=true noInline=true dir="column"
import React from 'react';
import { AudioPlayer } from '@douyinfe/semi-ui';

function Demo() {
    const audioUrlArrObj = [
        {
            src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
            title: '音频标题1',
            cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
        },
        {
            src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
            title: '音频标题2',
            cover: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg',
        },
    ];
  
    return (
        <div style={{ width: '100%' }}>
            <AudioPlayer
                audioUrl={audioUrlArrObj}
                theme="light"
            />
        </div>
    );
}

render(Demo);

```

## API 参考

### AudioPlayer

| 属性                | 说明                                             | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|--------------|
| audioUrl             | 音频地址                                    | string ｜ string[] ｜ AudioInfo ｜ AudioInfo[]                                 | -  |
| autoPlay            | 自动播放                                     | boolean                                  | false  |
| theme             | 主题                                     | string                                  | dark  |
| showToolbar       | 是否显示工具栏                           | boolean                                  | false   |
| skipDuration       | 跳转时间                                     | number                                  | 10   |
| className         | 类名                           | string                                  | -   |
| style             | 内联样式                           | object                                  | -   |

### AudioInfo

| 属性                | 说明                                          | 类型                              | 默认值    |
|-------------------|------------------------------------------------|---------------------------------|-----------|
| src               | 音频地址                                    | string                          | -  |
| title             | 音频标题                                    | string                          | -  |
| cover             | 封面图片                                    | string                          | -  |


