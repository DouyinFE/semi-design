import React, { useState, useCallback, useMemo } from "react";
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

export const ShowOperationTooltip = () => (
    <Image 
        width={360}
        height={200}
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/lion.jpeg"
        preview={{
            showTooltip: true,
        }}
    />
)

export const ControlledPreviewSingle = () => {
    const [visible, setVisible] = useState(false);

    const handlePreviewVisibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

    const handleClick = useCallback(() => {
        setVisible(!visible);
    }, [visible])

    return (
        <>
            <Button onClick={handleClick}>{visible ? "hide" : "show single"}</Button>
            <ImagePreview 
                src={"https://lf3-static.bytednsdoc.com/obj/eden-cn/9130eh7pltbfnuhog/lion.jpeg"}
                visible={visible}
                onVisibleChange={handlePreviewVisibleChange}
            />
        </>
    )
}

export const ControlledPreviewMultiple = () => {
    const [visible, setVisible] = useState(false);

    const handlePreviewVisibleChange = useCallback((v) => {
        setVisible(v);
    }, []);

    const handleClick = useCallback(() => {
        setVisible(!visible);
    }, [visible])

    return (
        <>
            <Button onClick={handleClick}>{visible ? "hide" : "show multiple"}</Button>
            <ImagePreview 
                src={srcList1}
                visible={visible}
                onVisibleChange={handlePreviewVisibleChange}
            />
        </>
    )
}

export const BasicPreview = () => (
    <ImagePreview>
        {srcList1.map((src, index) => {
            return (
                <Image 
                    key={index} 
                    src={src} 
                    width={200} 
                    alt={`lamp${index + 1}`}
                />
        )})}
    </ImagePreview>
);

// test all call back function
export const TestCallBackFunc = () => {
  
    const visibleChange =  useCallback((v) => {
        console.log("visible change", v);
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
                onVisibleChange={visibleChange}
                onChange={change}
                onClose={close}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onPrev={prev}
                onNext={next}
                onRatioChange={ratioChange}
                onRotateChange={rotateChange}
                onDownload={download}
            >
                <div >
                    {srcList1.map((src, index) => {
                        return (
                            <Image key={index} src={src} width={200} alt={`lamp${index + 1}`} />
                    )})}
                </div>
            </ImagePreview>
        </>
    )
};

export const GridImage= () => (
    <>  
        <ImagePreview
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
);

export const CustomContainer = () => {
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
                    position: "relative",
                }} 
            >
                <ImagePreview
                    getPopupContainer={() => {
                        const node = document.getElementById("container");
                        return node;
                    }}
                    style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
        
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
}

export const customRenderFooterMenu = () => {
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
    }, []);

    return (
        <>  
            <ImagePreview
                renderPreviewMenu={renderPreviewMenu}
            >
                {srcList1.map((src, index) => {
                    return <Image key={index} src={src} width={200} alt={`lamp${index + 1}`} />
                })}
            </ImagePreview>
        </>
    );
}

export const CustomRenderTitle = () => (
    <>  
        <ImagePreview
            renderHeader={(title) => (
                <div
                    style={{ 
                        background: "green", 
                        width: "100%", 
                        height: "100%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                    }}
                >
                    {title}
                </div>
            )}
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
