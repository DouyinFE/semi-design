---
localeCode: zh-CN
order: 53
category: 展示类
title: Image 图片
icon: doc-list
# icon: doc-image
brief: 用于展示和预览图片。
---

## 代码演示

### 如何引入

```jsx import
import { Image, ImagePreview } from '@douyinfe/semi-ui';
```

### 基本用法

通过 `src` 指定图片路径即可获取一个具有预览功能的图片，通过 `width`，`height` 指定图片的宽高

```jsx live=true dir="column"
import React from 'react';
import { Image } from '@douyinfe/semi-ui';

() => (  
    <Image 
        width={360}
        height={200}
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/semi.png"
    />
);
```

### 加载失败的占位图

可通过 `fallback` 自定义加载失败的占位图，该参数类型支持 string 和 ReactNode

```jsx live=true
import React from 'react';
import { Image } from '@douyinfe/semi-ui';

() => (
    <div style={{ display: 'flex', alignItem: 'center', flexDirection: 'column' }}>
        <span>加载失败默认样式</span>
        <Image 
            width={200}
            height={200}
            src="https://load-error.jpeg"
        />
        <br />
        <span>自定义加载失败占位图</span>
        <Image 
            width={200}
            height={200}
            src="https://load-error.jpeg"
            fallback="data:image/png;base64,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"
        />
    </div>
);
```

### 渐进加载

大图可通过`placeholder`实现渐进加载

```jsx live=true
import React from 'react';
import { Image, Button } from '@douyinfe/semi-ui';

() => {
    const [timestamp, setTimestamp] = React.useState('');
    return (  
        <>
            <Image 
                width={200}
                height={200}
                src={`https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/leaf.jpeg?${timestamp}`}
                placeholder={<Image 
                    src='https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/leaf-blur.jpeg'
                    width={200}
                    height={200}
                    preview={false}
                />}
            />
            <br />
            <Button 
                theme={'solid'}
                onClick={() => {
                    setTimestamp(Date.now());
                }}
                style={{ marginTop: 10 }}
            >Reload</Button>
        </>
    );
};
```

### 自定义预览图片

可以通过设置 Image 组件的 `src` 和 `preview` 参数中的 `src` 不同来自定义预览图片

 ```jsx live=true
import React from 'react';
import { Image } from '@douyinfe/semi-ui';

() => {
     return ( 
         <Image 
             width={200}
             height={200}
             src={'https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/leaf-blur.jpeg'}
             preview={{
                 src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/leaf.jpeg'
             }}
         />
     );
};
```

### 多图预览

使用 ImagePreview 包裹 Image 即可实现多图片预览

```jsx live=true dir="column"
import React, { useMemo } from 'react';
import { Image, ImagePreview } from '@douyinfe/semi-ui';

() => {
    const srcList = useMemo(() => ([
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/flower.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/duck.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/swan.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/road.jpeg",
    ]), []);

    return ( 
        <ImagePreview>
            {srcList.map((src, index) => {
                return (
                    <Image 
                        key={index} 
                        src={src} 
                        width={200} 
                        alt={`lamp${index + 1}`} 
                    />
                );
            })}
        </ImagePreview>
    );
};
```

### 单独使用预览组件

预览组件 ImagePreview 可以单独使用，通过 `visible` 和 `onVisibleChange` 控制是否预览，通过 `src` 传入可以预览的图片

```jsx live=true
import React, { useMemo, useCallback } from 'react';
import { ImagePreview, Button } from '@douyinfe/semi-ui';


() => {
    const srcList = useMemo(() => ([
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/flower.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/duck.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/swan.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/road.jpeg",
    ]), []);

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const visibleChange1 = useCallback((v) => {
        setVisible1(v);
    }, []);

    const visibleChange2 = useCallback((v) => {
        setVisible2(v);
    }, []);

    const onButton1Click = useCallback((v) => {
        setVisible1(true);
    }, []);

    const onButton2Click = useCallback((v) => {
        setVisible2(true);
    }, []);

    return ( 
        <>
            <Button onClick={onButton1Click}>Preview single Image</Button>
            <ImagePreview
                src={'https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/flower.jpeg'}
                visible={visible1}
                onVisibleChange={visibleChange1}
            />
            <br /> 
            <Button onClick={onButton2Click} style={{ marginTop: 20 }}>Preview multiple Images</Button>
            <ImagePreview
                src={srcList}
                visible={visible2}
                onVisibleChange={visibleChange2}
            />
        </>
    );
};
```

### 渲染在指定容器

可以通过 `getPopupContainer` 指定预览组件的父级 DOM（需要指定 `position: relative`)，图片预览将会渲染至该 DOM 中

```jsx live=true dir="column"
import React, { useMemo } from 'react';
import { Image, ImagePreview } from '@douyinfe/semi-ui';

() => {
    const srcList = useMemo(() => ([
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/flower.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/duck.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/swan.jpeg",
    ]), []);

    return ( 
        <>
            <div 
                id="container" 
                style={{ 
                    height: 400, 
                    position: "relative" 
                }} 
            >
                <ImagePreview
                    getPopupContainer={() => {
                        const node = document.getElementById("container");
                        return node;
                    }}
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
        
                    }}
                >
                    {srcList.map((src, index) => {
                        return (
                            <Image 
                                key={index} 
                                src={src} 
                                width={200} 
                                alt={`lamp${index + 1}`} 
                            />
                        );
                    })}
                </ImagePreview>
            </div>
        </>
    );
};
```

### 自定义预览底部操作区

可以使用 `renderPreviewMenu` 自定义预览底部操作区域

```jsx live=true dir="column"
import React, { useMemo, useCallback } from 'react';
import { Image, ImagePreview, Button, Icon } from '@douyinfe/semi-ui';
import { IconChevronLeft, IconChevronRight, IconMinus, IconPlus, IconRotate, IconDownload, IconRealSizeStroked, IconWindowAdaptionStroked } from "@douyinfe/semi-icons";

() => {
    const srcList = useMemo(() => ([
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/flower.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/duck.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/swan.jpeg",
    ]), []);

    const renderPreviewMenu = useCallback((props) => {
        const {
            ratio,
            disabledPrev,
            disabledNext,
            disableZoomIn,
            disableZoomOut,
            disableDownload,
            onDownload,
            onNext,
            onPrev,
            onRotateLeft,
            onRatioClick,
            onZoomIn,
            onZoomOut,
        } = props;
        return (
            <div 
                style={{ 
                    background: "grey", 
                    height: 40, 
                    width: 280, 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    borderRadius: 3,
                }}
            >
                <Button
                    icon={<IconChevronLeft size="large" />}
                    type="tertiary"
                    onClick={!disabledPrev ? onPrev : undefined}
                    disabled={disabledPrev}
                />
                <Button
                    icon={<IconChevronRight size="large" />}
                    type="tertiary"                     
                    onClick={!disabledNext ? onNext : undefined}
                    disabled={disabledNext}
                />
                <Button
                    icon={<IconMinus size="large" />}
                    type="tertiary"
                    onClick={!disableZoomOut ? onZoomOut : undefined}
                    disabled={disableZoomOut} 
                />
                <Button
                    icon={<IconPlus size="large" />}
                    type="tertiary"
                    onClick={!disableZoomIn ? onZoomIn : undefined} 
                    disabled={disableZoomIn}
                />
                <Button
                    icon={ratio === "adaptation" ? <IconRealSizeStroked size="large" /> : <IconWindowAdaptionStroked size="large" />}
                    type="tertiary"
                    onClick={onRatioClick} 
                />
                <Button
                    icon={<IconRotate size="large" />}
                    type="tertiary"
                    onClick={onRotateLeft}
                />
                <Button
                    icon={<IconDownload size="large" />}
                    type="tertiary"
                    onClick={!disableDownload ? onDownload : undefined}
                    disabled={disableDownload}
                />
            </div>);
    }, []);


    return ( 
        <ImagePreview renderPreviewMenu={renderPreviewMenu}>
            {srcList.map((src, index) => {
                return (
                    <Image 
                        key={index} 
                        src={src} 
                        width={200} 
                        alt={`lamp${index + 1}`} 
                    />
                );
            })}
        </ImagePreview>
    );
};
```

### 自定义预览顶部展示区

通过 `renderHeader` 可以自定义预览顶部展示区

```jsx live=true dir="column"
import React, { useMemo } from 'react';
import { Image, ImagePreview } from '@douyinfe/semi-ui';

() => {
    const srcList = useMemo(() => ([
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/flower.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/duck.jpeg",
    ]), []);

    return (
        <>  
            <ImagePreview
                renderHeader={(title) => (
                    <div 
                        style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ background: "black", padding: '0 10px' }}>自定义标题：{title}</span>
                    </div>
                )}
            >
                <div >
                    {srcList.map((src, index) => {
                        return (
                            <Image 
                                key={index} 
                                src={src} 
                                width={200} 
                                alt={`lamp${index + 1}`} 
                                preview={{
                                    previewTitle: `lamp${index + 1}`,
                                }} 
                            />
                        );
                    })}
                </div>
            </ImagePreview>
        </>
    );
};
```

## API 参考

### Image

| 属性              | 说明                                    | 类型              | 默认值 | 版本 |
|-------------------|---------------------------------------|-------------------|------|------|
| style             | 自定义样式                              | CSSProperties     | - | |
| className         | 自定义样式类名                           | string            | - | |
| src               | 图片获取地址                             | string            | - | |
| width             | 图片显示宽度                             | CSSProperties     | - | |
| height            | 图片显示高度                             | CSSProperties     | - | |
| alt               | 图像描述                                | string            | - | |
| placeholder       | 图片未加载时候的占位内容                   | ReactNode         | - | |
| fallback          | 加载失败容错地址或者自定义加载失败时的显示内容 | string \| reactNode  | - | |
| preview           | 预览参数，为 false 时候禁用预览            | boolean \| ImagePreview | - | |
| crossOrigin       | 透传给原生 img 标签的 crossorigin         | 'anonymous'｜'use-credentials'| - | |
| onError           | 加载错误回调                              | (event: Event) => void | - | |
| onLoad            | 加载成功回调                              | (event: Event) => void | - | |

### ImagePreview

| 属性               | 说明                    | 类型              | 默认值 | 版本 |
|-------------------|-------------------------|------------------|-------|-----|
| style             | 自定义样式               | CSSProperties    | - | |
| className         | 自定义样式类名            | string           | - | |
| src               | 图片列表信息              | string \| string[] | - | |
| visible           | 受控属性，是否预览         | boolean         | - | |
| defaultVisible    | 首次是否开启预览           | boolean         | - | |
| currentIndex      | 受控属性，当前预览图片下标  | number               | - | |
| defaultCurrentIndex | 首次展示图片下标        | number             | - | |
| infinite          | 是否无限循环              | boolean       | - | |
| closeOnEsc        | 点击 esc 关闭预览         | boolean        | true | |
| previewTitle      | 自定义预览 title          | ReactNode      | - | |
| maskClosable      | 点击遮罩是否可关闭         | boolean        | true | |
| closable          | 是否显示关闭按钮           | boolean        | true | |
| zoomStep          | 图片每次缩小/放大比例       | number        | 0.1 | |
| lazyLoad          | 是否开启懒加载             | boolean      | true | |
| lazyLoadMargin    | 传给 options 中的rootMargin 参数，参考 [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API#interfaces) | string | "0px 100px 100px 0px" | |
| preLoad           | 是否开启预加载             | boolean        | true | |
| preLoadGap        | 预加载的步长               | number         | 2 | |
| viewerVisibleDelay | 隐藏预览操作按钮前的无操作时长 | number         | 10000 | |
| disableDownload   | 禁用下载                  | boolean        | false | |
| zIndex            | 预览层层级                | number        | 1070 | |
| showTooltip       | 是否展示底部操作区提示      | boolean        | false | |
| prevTip           | 上一步操作按钮提示         | string         | "上一步" | |
| nextTip           | 下一步操作按钮提示         | string         | "下一步" | |
| zoomInTip         | 放大操作按钮提示           | string         | "放大" | |
| zoomOutTip        | 缩小操作按钮提示           | string        | "缩小" | |
| rotate            | 旋转                    | string         | "旋转" | |
| downloadTip       | 下载操作按钮提示          | string         | "下载" | |
| adaptiveTip       | 适应页面操作按钮提示       | string        | "适应页面" | |
| originTip         | 原始尺寸操作按钮提示       | string        | "原始尺寸" | |
| renderHeader      | 自定义渲染预览顶部信息     | (info: ReactNode) => ReactNode  | - | |
| renderPreviewMenu | 自定义渲染预览底部菜单信息  | (props: MenuProps) => ReactNode;| - | |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 container `position: relative` | () => HTMLElement;  | - | |
| onVisibleChange   | 切换可见状态触发的回调   | (visible: boolean, preVisible: boolean) => void | - | |
| onChange          | 切换图片触发的事件  | (index: number) => void | - | |
| onClose           | 点击关闭按钮时的回调函数  | () => void | - | |
| onZoomIn          | 图片放大时的回调函数  | (zoom: number) => void | - | |
| onZoomOut         | 图片缩小时的回调函数  | (zoom: number) => void | - | |
| onDownload        | 图片下载回调函数     | (src: string, index: number) => void | - | |
| onPrev            | 向前切换图片的回调   | (index: number) => void | - | |
| onNext            | 向后切换图片的回调   | (index: number) => void | - | |
| onRotateLeft      | 旋转图片的回调      | (angle: number) => void | - | |

### MenuProps

| 属性               | 说明                     | 类型    |
|-------------------|--------------------------|--------|
| zoom              | 当前图片缩放比例            | number |
| max               | 图片缩放最大比例            | number |
| min               | 图片缩放最小比例            | number |
| step              | 缩放的比例步长              | number |
| curPage           | 当前图片页下标              | number |
| totalNum          | 可预览的总图片数            | number |
| ratio             | 原始尺寸或适应页面按钮状态  | "adaptation" \| "realSize"|
| disabledPrev      | 是否禁用向左切换按钮         | boolean |
| disabledNext      | 是否禁用向右切换按钮         | boolean |
| disableDownload   | 是否禁用下载按钮            | boolean |
| onZoomIn          | 图片放大时的调用函数         | () => void |
| onZoomOut         | 图片缩小时的调用函数         | () => void |
| onDownload        | 图片下载的调用函数           | () => void |
| onPrev            | 向前切换图片的调用函数       | () => void |
| onNext            | 向后切换图片的调用函数       | () => void |
| onRotateLeft      | 逆时针旋转图片的调用函数     | () => void |
| onRotateRight     | 顺时针旋转图片的调用函数     | () => void |

## 设计变量

<DesignToken/>