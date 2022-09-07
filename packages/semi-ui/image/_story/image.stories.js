import React, { useState, useCallback } from "react";
import {
    Image,
    Button,
    ImagePreview,
    Row,
    Col,
    Icon,
} from "../../index";
import { 
    IconChevronLeft, 
    IconChevronRight, 
    IconMinus,
    IconPlus,
    IconRotate,
    IconDownload,
} from "@douyinfe/semi-icons";
import { RealSizeSvg, AdaptionSvg} from "../interface";

export default {
    title: "Image",
    parameters: {
      chromatic: { disableSnapshot: true },
    }
}

const srcList1 = [
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/lion.jpeg",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/seaside.jpeg",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/beach.jpeg",
];

const srcList2 = [
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag1.png",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag2.png",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag3.png",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag4.png",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag5.png",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag6.png",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag7.png",
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/imag8.png",
];

export const basicImage = () => (
    <Image 
        width={360}
        height={200}
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/lion.jpeg"
    />
)

export const ControlledImagePreview = () => {
    const [visible, setVisible] = useState(false);

    const handlePreviewVisibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

    const handleClick = useCallback(() => {
        setVisible(!visible);
    }, [visible])

    return (
        <>
            <Button onClick={handleClick}>{visible ? "hide" : "show"}</Button>
            <ImagePreview 
                srcList={srcList1}
                visible={visible}
                onVisibleChange={handlePreviewVisibleChange}

            />
        </>
    )
}

export const BasicPreview = () => {
    const [visible, setVisible] = useState(false);

    const visibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

    return (
        <>  
            <ImagePreview
                visible={visible}
                onVisibleChange={visibleChange}
            >
                <div >
                    {srcList1.map((src, index) => {
                        return (
                            <Image 
                                key={index} 
                                src={src} 
                                width={200} 
                                alt={`lamp${index + 1}`} 
                                preview={index !== 1} 
                            />
                    )})}
                </div>
            </ImagePreview>
        </>
    )
};

// test all call back function
export const TestCallBackFunc = () => {
    const [visible, setVisible] = useState(false);
  
    const visibleChange =  useCallback((v) => {
        console.log("visible change", v);
        setVisible(v);
    }, []);

    const change = useCallback((index) => {
        console.log("change", index);
    } , []);

    const zoomIn = useCallback((zoom) => {
        console.log("zoom in", zoom);
    }, []);

    const zoomOut = useCallback((zoom) => {
        console.log("zoom out", zoom);
    }, []);

    const prev = useCallback((index) => {
        console.log("prev", index);
    }, []);

    const next = useCallback((index) => {
        console.log("next", index);
    }, []);

    const ratioChange = useCallback((type) => {
        console.log("ratio change", type);
    }, []);

    const rotateChange = useCallback((angle) => {
        console.log("rotate change", angle);
    }, []);

    const download = useCallback((src, index) =>{
        console.log("download", src, index);
    }, []);

    return (
        <>  
            <ImagePreview
                visible={visible}
                onVisibleChange={visibleChange}
                preview = {{
                    onChange: change,
                    onClose: close,
                    onZoomIn: zoomIn,
                    onZoomOut: zoomOut,
                    onPrev: prev,
                    onNext: next,
                    onRatioChange: ratioChange,
                    onRotateChange: rotateChange,
                    onDownload: download,
                }}
            >
                <div >
                    {srcList1.map((src, index) => {
                        return (
                            <Image key={index} src={src} width={200} alt={`lamp${index + 1}`} preview={index !== 1}/>
                    )})}
                </div>
            </ImagePreview>
        </>
    )
};

export const GridImage= () => {

    const [visible, setVisible] = useState(false);

    const visibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

    return (
        <>  
            <ImagePreview
                visible={visible}
                onVisibleChange={visibleChange}
                preview={{
                    preLoad: true,
                    preLoadGap: 3,
                    infinite: true,
                }}
            >
                <Row style={{ width: 800 }}>
                    {srcList2.map((src, index) => {
                        return (
                            <Col span={6} style={{ height: 200 }} key={`col${index}`}>
                                <Image key={index} src={src} style={{ width: 200, height: 200 }} width={200} alt={`lamp${index + 1}`} />
                            </Col>
                    )})}
                </Row>
            </ImagePreview>
        </>
    )
};

export const CustomContainer = () => {
    const [visible, setVisible] = useState(false);

    const visibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

    return (
        <>  
            <ImagePreview
                visible={visible}
                onVisibleChange={visibleChange}
                preview={{
                    getPopupContainer: () => {
                        const node = document.getElementById("container");
                        console.log("custom container node", node);
                        return node;
                    }
                }}
            >
                {srcList1.map((src, index) => {
                    return <Image key={index} src={src} width={200} alt={`lamp${index + 1}`} />
                })}
            </ImagePreview>
            <div id="container" style={{ width: 500, height: 500, border: "1px solid black", margin: 20, position: "relative" }} />
        </>
    )
};

export const customRenderFooterMenu = () => {
    const [visible, setVisible] = useState(false);

    const visibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

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
                icon={<IconMinus  size="large" />}
                type="tertiary"
                onClick={disableZoomOut ? onZoomOut : undefined}
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
                    svg={<RealSizeSvg />}
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
    }, [])

    return (
        <>  
            <ImagePreview
                visible={visible}
                onVisibleChange={visibleChange}
                preview={{
                    renderPreviewMenu,
                }}
            >
                {srcList1.map((src, index) => {
                    return <Image key={index} src={src} width={200} alt={`lamp${index + 1}`} />
                })}
            </ImagePreview>
        </>
    );
}

export const CustomRenderTitle = () => {
    const [visible, setVisible] = useState(false);

    const visibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

    return (
        <>  
            <ImagePreview
                visible={visible}
                onVisibleChange={visibleChange}
                preview={
                   {
                        renderHeader: (title) => (
                            <div style={{ background: "green", width:" 100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {title}
                            </div>
                        )
                   }
                }
            >
                <div >
                    {srcList1.map((src, index) => {
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
                    )})}
                </div>
            </ImagePreview>
        </>
    );
}
