---
localeCode: en-US
order: 53
category: Show
title: Image
icon: doc-list
# icon: doc-image
brief: Used to display and preview images.
---

## Demos

### How to import

```jsx import
import { Image, ImagePreview } from '@douyinfe/semi-ui';
```

### Basic usage

You can get an image with preview function by specifying the image path through `src`, and specify the width and height of the image through `width`, `height`

```jsx live=true
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

### Loading failed placeholder

You can customize the placeholder for failed loading through `fallback`, which supports string and ReactNode

```jsx live=true
import React from 'react';
import { Image } from '@douyinfe/semi-ui';

() => (
    <div style={{ display: 'flex', alignItem: 'center', flexDirection: 'column' }}>
        <span>Failed to load default style</span>
        <Image 
            width={200}
            height={200}
            src="https://load-error.jpeg"
        />
        <br />
        <span>Custom loading failed placeholder map</span>
        <Image 
            width={200}
            height={200}
            src="https://load-error.jpeg"
            fallback="data:image/png;base64,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"
        />
    </div>
);
```

### Progressive loading

Large images can be progressively loaded through `placeholder`

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

### Customize the preview image

You can customize the preview image by setting the `src` of the Image component to be different from the `src` in the `preview` parameter

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

### Multi-image preview

Use ImagePreview to wrap Image to achieve multi-image preview

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

### Use the preview component alone

The preview component ImagePreview can be used alone, through `visible` and `onVisibleChange` to control whether to preview, and `src` to pass in the image that can be previewed

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

### Render in the specified container

You can specify the parent DOM of the preview component through `getPopupContainer` (you need to specify `position: relative`), and the image preview will be rendered into this DOM

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

### Customize the bottom operation area of the preview

The bottom action area of the preview can be customized using `renderPreviewMenu`

```jsx live=true dir="column"
import React, { useMemo, useCallback } from 'react';
import { Image, ImagePreview, Button, Icon } from '@douyinfe/semi-ui';
import { IconChevronLeft, IconChevronRight, IconMinus, IconPlus, IconRotate, IconDownload } from "@douyinfe/semi-icons";

() => {
    const srcList = useMemo(() => ([
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/flower.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/duck.jpeg",
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/swan.jpeg",
    ]), []);

    function RealSizeSvg() {
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1 5C1 3.89543 1.89543 3 3 3H21C22.1046 3 23 3.89543 23 5V19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V5ZM21 5L3 5V19H21V5Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M5 9C5 8.44772 5.44772 8 6 8H7C7.55228 8 8 8.44772 8 9V15C8 15.5523 7.55228 16 7 16C6.44772 16 6 15.5523 6 15V10C5.44772 10 5 9.55228 5 9Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M15 9C15 8.44772 15.4477 8 16 8H17C17.5523 8 18 8.44772 18 9V15C18 15.5523 17.5523 16 17 16C16.4477 16 16 15.5523 16 15V10C15.4477 10 15 9.55228 15 9Z" fill="white"/>
            <path d="M13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10Z" fill="white"/>
            <path d="M13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14Z" fill="white"/>
        </svg>;
    }

    function AdaptionSvg() {
        return <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7 9C7 7.89543 7.89543 7 9 7H15C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9ZM15 9H9V15H15V9Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M15 3C15 2.44772 15.4477 2 16 2H21C21.5523 2 22 2.44772 22 3V8C22 8.55228 21.5523 9 21 9C20.4477 9 20 8.55228 20 8V4H16C15.4477 4 15 3.55228 15 3Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M9 21C9 21.5523 8.55228 22 8 22L3 22C2.44772 22 2 21.5523 2 21L2 16C2 15.4477 2.44771 15 3 15C3.55228 15 4 15.4477 4 16L4 20L8 20C8.55228 20 9 20.4477 9 21Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M3 9C2.44772 9 2 8.55228 2 8L2 3C2 2.44772 2.44771 2 3 2L8 2C8.55228 2 9 2.44771 9 3C9 3.55228 8.55228 4 8 4L4 4L4 8C4 8.55228 3.55228 9 3 9Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M21 15C21.5523 15 22 15.4477 22 16L22 21C22 21.5523 21.5523 22 21 22L16 22C15.4477 22 15 21.5523 15 21C15 20.4477 15.4477 20 16 20L20 20L20 16C20 15.4477 20.4477 15 21 15Z" fill="white"/>
        </svg>;
    }

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
                    icon={<Icon
                        svg={ratio === "adaptation" ? <RealSizeSvg /> : <AdaptionSvg />}
                        size="large"
                    />}
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

### Customize the preview top display area

You can customize the preview top display area through `renderHeader`

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
                        <span style={{ background: "black", padding: '0 10px' }}>Custom title:{title}</span>
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

## API reference

### Image

| Properties       |Instructions                          | Type             | Default | Version |
|------------------|--------------------------------------|------------------|---------|---------|
| style            | custom style                         | CSSProperties     | - | |
| className        | custom style class name              | string            | - | |
| src              | Image acquisition address            | string            | - | |
| width            | Image display width                  | number            | - | |
| height           | Image display height                 | CSSProperties     | - | |
| alt              | Image description                    | string            | - | |
| placeholder      | Placeholder content when the image is not loaded | ReactNode | - | |
| fallback         | Custom loading failed display content | string \|reactNode  | - | |
| preview          | Preview parameter, when false, disable preview   | boolean \| ImagePreview | - | |
| crossOrigin      | Passthrough to the crossorigin of the native img tag | 'anonymous' \| 'use-credentials' |-| |
| onError          | Load error callback                  | (event: Event) => void | - | |
| onLoad           | Load success callback                | (event: Event) => void | - | |

### ImagePreview

| Properties       | Instructions            | Type            | Default | Version |
|------------------|-------------------------|-----------------|---------|---------|
| style            | Custom style            | CSSProperties   | - | |
| className        | Custom style class name | string          | - | |
| srcList          | Image list information  | string \| string[] | - | |
| visible          | Controlled property, whether to preview  | boolean | - | |
| currentIndex     | Controlled property, the current preview image subscript | string \| string[] | - | |
| defaultCurrentIndex | First display image subscript | string \| string[] | - | |
| infinite         | Whether to loop infinitely  | boolean        | - | |
| closeOnEsc       | Hit esc to close the preview | boolean        | true | |
| previewTitle     | Custom preview title     | ReactNode      | - | |
| maskClosable     | Whether the mask can be closed by clicking | Boolean  | true | |
| closable         | Whether to show the close button   | Boolean | true | |
| zoomStep         | Image reduction/enlargement ratio each time | number | 0.1 | |
| lazyLoad         | Whether to enable lazy loading ｜ boolean      | false | |
| preLoad          | Whether to enable preloading | boolean | true | |
| preLoadGap       | Preloaded step size      |number         | 2 | |
| viewerVisibleDelay | The length of time of inactivity before hiding the preview action button | number | 10000 | |
| disableDownload  | Disable downloads        |boolean        | false | |
| zIndex           | Preview layer hierarchy  |boolean        | false | |
| showTooltip      | Whether to display the bottom operation area prompt | boolean | - | |
| prevTip          | Previous operation button prompt   | string  | "Previous" | |
| nextTip          | Next action button prompt   | string  | "Next" | |
| zoomInTip        | Zoom in on action button tips | string | "Zoom in" | |
| zoomOutTip       | Zoom out action button prompt | string | "Zoom out" | |
| rotate           | Rotate                   |string        | "Rotate" | |
| downloadTip      | Download action button prompt | string  | "Download" | |
| adaptiveTip      | Adapt to page action button prompts |string  | "Adapt to the page" | |
| originTip        | Original Size Action Button Tips |string  | "Original size" | |
| renderHeader     | Custom render preview top info  |(info: any) => ReactNode  | false | |
| renderPreviewMenu | Custom render preview bottom menu information | (props: MenuProps) => ReactNode; | - | |
| getPopupContainer | Specify the parent DOM, and the pop-up layer will be rendered into the DOM. For customization, you need to set container `position: relative`|() => HTMLElement;  | () => document.body | |
| onVisibleChange  | Callback triggered by toggle visible state   | (visible: boolean, preVisible: boolean) => void  | - | |
| onChange         | Event triggered by switching pictures  | (index: number) => void | - | |
| onClose          | The callback function when the close button is clicked  | (index: number) => void | - | |
| onZoomIn         | The callback function when the image is zoomed in  | (zoom: number) => void | - | |
| onZoomOut        | The callback function when the image is zoomed out  | (zoom: number) => void | - | |
| onDownload       | Image download callback function  | (src: string, index: number) => void | - | |
| onPrev           | Callback for switching the picture forward  | (index: number) => void | - | |
| onNext           | Callback for switching pictures backwards   | (index: number) => void | - | |
| onRotateLeft     | Callback for rotating the image     | (angle: number) => void | - | |

### MenuProps

| Properties       | Instructions            | Type             |
|------------------|-------------------------|------------------|
| zoom             | Current image magnification ratio    | number |
| max              | The maximum ratio of image zoom      | number |
| min              | The minimum ratio of image scaling   | number |
| step             | Step size of scaling                 | number |
| curPage          | Current image page subscript         | number |
| totalNum         | The total number of images that can be previewed | number |
| ratio            | Original size or Fit to page button state  | "adaptation" \| "realSize" |
| disabledPrev     | Whether to disable the left toggle button  | boolean |
| disabledNext     | Whether to disable the right toggle button | boolean |
| disableDownload  | Whether to disable the download button     | boolean |
| onZoomIn         | Call function when the image is zoomed in  | () => void |
| onZoomOut        | Call function when the image is zoomed out | () => void |
| onDownload       | Call function when the image is downloaded | () => void |
| onPrev           | Call function to switch the picture forward  | () => void |
| onNext           | Call function to switch the picture backward | () => void |
| onRotateLeft     | Call function to rotate the image counterclockwise | () => void |
| onRotateRight    | Call function to rotate the image clockwise | () => void |

## Design Token

<DesignToken/>