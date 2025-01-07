---
localeCode: en-US
order: 69
category: Plus
title:  Cropper
icon: doc-cropper
dir: column
brief: Freely crop pictures
showNew: true
---

## When to use

Cropper is used to crop pictures. It supports custom cropping box styles. The positions of the cropping box, cropped image can be adjusted by dragging. It can zoom and rotate the cropped pictures.

## Demos

Cropper is supported starting from version v2.73.0.

```jsx
import { Cropper } from '@douyinfe/semi-ui';
```

### Basic usage

Use `sr` to set the cropped image; use `shape` to set the shape of the cropping box, which defaults to square.

```jsx live=true dir=column noInline=true
import { Cropper, Button, RadioGroup, Radio } from '@douyinfe/semi-ui';

const containerStyle = {
  width: 550,
  height: 300,
  margin: 20,
}

function Demo() {
    const ref = useRef(null);
  const [shape, setShape] = useState('rect');

    const onButtonClick = useCallback(() => {
        const value = ref.current.getCropperCanvas();
        const previewContainer = document.getElementById('previewContainer');
        previewContainer.innerHTML = '';
        previewContainer.appendChild(value);
    }, []);

    const onShapeChange = useCallback((e) => {
        setShape(e.target.value);
    }, []);

    return <>
        <RadioGroup onChange={onShapeChange} value={shape}>
            <Radio value={'rect'}>rect</Radio>
            <Radio value={'round'}>round</Radio>
            <Radio value={'roundRect'}>roundRect</Radio>
        </RadioGroup>
        <Cropper
            ref={ref} 
            src={'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/image.png'}
            style={containerStyle}
            shape={shape}
        />
        <Button onClick={onButtonClick}>Get Cropped Image</Button>
        <div id='previewContainer'/>
    </>;
}

render(<Demo />)
```

### Customize crop box ratio

The initial crop box ratio can be passed through `defaultAspectRatio` (default is 1). A fixed crop box ratio can be set via `aspectRatio`.

Setting `defaultAspectRatio` only takes effect on the initial crop box ratio. When dragging, the crop box ratio will change with dragging.

When setting `aspectRatio`, the crop box ratio is fixed, and the crop box will change according to this ratio when dragging.

```jsx live=true dir=column noInline=true
import { Cropper, Button, RadioGroup, Radio } from '@douyinfe/semi-ui';

const containerStyle = {
  width: 550,
  height: 300,
  margin: 20,
}

function Demo() {
    const ref = useRef(null);
    const shape = useState('rect');

    const onButtonClick = useCallback(() => {
        const value = ref.current.getCropperCanvas();
        const previewContainer = document.getElementById('previewContainer-aspect');
        previewContainer.innerHTML = '';
        previewContainer.appendChild(value);
    }, []);

    return <>
        <Cropper
            aspectRatio={3/4}
            ref={ref} 
            src={'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/image.png'}
            style={containerStyle}
        />
        <Button onClick={onButtonClick}>Get Cropped Image</Button>
        <div id='previewContainer-aspect' />
    </>;
}

render(<Demo />)
```

### Controlled rotation/zooming of images

Control image rotation and zoom through `rotate` and `zoom`, and get the latest `zoom` value through `onZoomChange`

```jsx live=true dir=column noInline=true
import { Cropper, Button, Slider } from '@douyinfe/semi-ui';

const containerStyle = {
  width: 550,
  height: 300,
  margin: 20,
}

const actionStyle = {
  marginTop: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content'
}

function Demo() {
  const [rotate, setRotate] = useState(0);
  const [zoom, setZoom] = useState(1);
  const ref = useRef();

  const onZoomChange = useCallback((value) => {
    setZoom(value);
  })

  const onSliderChange = useCallback((value) => {
    setRotate(value);
  }, []);

  const onButtonClick = useCallback(() => {
    const value = ref.current.getCropperCanvas();
    const previewContainer = document.getElementById('previewContainer-control');
    previewContainer.innerHTML = '';
    previewContainer.appendChild(value);
  }, []);

  return (
      <div id='cropper-container'>
           <Cropper 
              ref={ref} 
              src={'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/image.png'}
              style={containerStyle}
              rotate={rotate}
              zoom={zoom}
              onZoomChange={onZoomChange}
           />
           <div style={actionStyle} >
            <span>Rotate</span>
            <Slider
              style={{ width: 500}}
              value={rotate}
              step={1}
              min={-360}
              max={360}
              onChange={onSliderChange}
            />
           </div>
           <div style={actionStyle} >
            <span>Zoom</span>
            <Slider
              style={{ width: 500}}
              value={zoom}
              step={0.1}
              min={0.1}
              max={3}
              onChange={onZoomChange}
            />
           </div>
           <br />
           <Button onClick={onButtonClick}>Get Cropped Image</Button>
           <br />
           <div >
            <div id='previewContainer-control'
            />
          </div>
      </div>
  );
};

render(<Demo />)
```

### Crop box settings

The crop box style can be customized through `cropperBoxStyle`, `cropperBoxClassName`. You can use `showResizeBox` to set whether to display the adjustment blocks at the corners of the crop box.

```jsx live=true dir=column noInline=true
import { Cropper, Button, Switch } from '@douyinfe/semi-ui';

const containerStyle = {
  width: 550,
  height: 300,
  margin: 20,
}

const centerStyle = {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    width: 'fit-content'
}

function Demo() {
    const ref = useRef(null);

    const onButtonClick = useCallback(() => {
        const value = ref.current.getCropperCanvas();
        const previewContainer = document.getElementById('previewContainer-cropperBox');
        previewContainer.innerHTML = '';
        previewContainer.appendChild(value);
    }, []);

    return <>
        <strong>showResizeBox = false，and change the outline color of cropper box</strong>
        <Cropper
            ref={ref} 
            src={'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/image.png'}
            style={containerStyle}
            cropperBoxStyle={{ outlineColor: 'var(--semi-color-bg-0)'}}
            showResizeBox={false}
        />
        <Button onClick={onButtonClick}>Get Cropped Image</Button>
        <div id='previewContainer-cropperBox'/>
    </>;
}

render(<Demo />)
```

### API

| PROPERTIES | INSTRUCTIONS | TYPE | DEFAULT |
|-----|------|-----|------|
| aspectRatio | Crop box width to height ratio | number | - |
| className | className | string | - |
| cropperBoxClassName | The class name passed to the crop box | string | - |
| cropperBoxStyle | The style passed to the crop box | CSSProperties | - |
| defaultAspectRatio | Initial crop box ratio | number | 1 |
| imgProps | Attributes passed through to the img tag | object | - |
| fill | The fill color of the non-picture parts in the cropped result | string | 'rgba(0, 0, 0, 0)'  |
| maxZoom | Maximum zoom factor | number | 3 |
| minZoom | Minimum zoom factor | number | 0.1 |
| onZoomChange | Callback during zoom transformation | (zoom: number) => void | - |
| rotate | rotation angle | number | - |
| shape | Crop box shape | 'rect' \| 'round' \| 'roundRect' | 'rect' |
| src | The address of the cropped image | string | - |
| showResizeBox | Whether to display the adjustment block of the cropping box | boolean | true |
| style | Style  | CSSProperties | - |
| zoom | Zoom value | number | - |
| zoomStep | Zoom step size | number | 0.1 |

### Methods

Methods bound to component instances can be called through ref to achieve certain special interactions

| Name    | Description  |
|---------|--------------|
| getCropperCanvas  | Get the canvas of the cropped image |

## Design Token

<DesignToken/>
