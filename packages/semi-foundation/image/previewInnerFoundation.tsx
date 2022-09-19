import BaseFoundation, { DefaultAdapter } from "../base/foundation";
import KeyCode from "../utils/keyCode";
import { getPreloadImagArr, downloadImage, isTargetEmit } from "./utils";

export interface PreviewInnerAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getIsInGroup: () => boolean;
    notifyChange: (index: number) => void;
    notifyZoom: (zoom: number, increase: boolean) => void;
    notifyClose: () => void;
    notifyVisibleChange: (visible: boolean) => void;
    notifyRatioChange: (type: string) => void;
    notifyRotateChange: (angle: number) => void;
    notifyDownload: (src: string, index: number) => void;
    registerKeyDownListener: () => void;
    unregisterKeyDownListener: () => void;
    getMouseActiveTime: () => number;
    getStopTiming: () => boolean;
    setStopTiming: (value: boolean) => void;
    getStartMouseDown: () => {x: number, y: number};
    setStartMouseDown: (x: number, y: number) => void;
    setMouseActiveTime: (time: number) => void;
}

const NOT_CLOSE_TARGETS = ["icon", "footer"];
const STOP_CLOSE_TARGET = ["icon", "footer", "header"];

export default class PreviewInnerFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PreviewInnerAdapter<P, S>, P, S> {
    constructor(adapter: PreviewInnerAdapter<P, S>) {
        super({ ...adapter });
    }

    beforeShow() {
        this._adapter.registerKeyDownListener();
    }

    afterHide() {
        this._adapter.unregisterKeyDownListener();
    }

    handleRatio(type: string) {
        this.setState({
            ratio: type,
        } as any);
    }

    handleViewVisibleChange = () => {
        const nowTime = new Date().getTime();
        const mouseActiveTime = this._adapter.getMouseActiveTime();
        const stopTiming = this._adapter.getStopTiming();
        const { viewerVisibleDelay } = this.getProps();
        const { viewerVisible } = this.getStates();
        if (nowTime - mouseActiveTime > viewerVisibleDelay && !stopTiming) {
            viewerVisible && this.setState({
                viewerVisible: false,
            } as any);
        }
    }

    handleMouseMoveEvent = (e: any, event: string) => {
        const isTarget = isTargetEmit(e.nativeEvent, STOP_CLOSE_TARGET);
        if (isTarget && event === "over") {
            this._adapter.setStopTiming(true);
        } else if (isTarget && event === "out") {
            this._adapter.setStopTiming(false);
        }
    }

    handleMouseMove = (e: any) => {
        this._adapter.setMouseActiveTime(new Date().getTime());
        this.setState({
            viewerVisible: true,
        } as any);
    }

    handleMouseUp = (e: any) => {
        const { maskClosable } = this.getProps();
        let couldClose = !isTargetEmit(e.nativeEvent, NOT_CLOSE_TARGETS);
        const { clientX, clientY } = e;
        const { x, y } = this._adapter.getStartMouseDown();
        if (clientX !== x || y !== clientY) {
            couldClose = false;
        }
        if (couldClose && maskClosable) {
            this.handlePreviewClose();
        }
    }

    handleMouseDown = (e: any) => {
        const { clientX, clientY } = e;
        this._adapter.setStartMouseDown(clientX, clientY);
    }

    handleKeyDown = (e: any) => {
        const { closeOnEsc } = this.getProps();
        if (closeOnEsc && e.keyCode === KeyCode.ESC) {
            e.stopPropagation();
            this._adapter.notifyVisibleChange(false);
            this._adapter.notifyClose();
            return;
        }
    }

    handleSwitchImage = (direction: string) => {
        const step = direction === "prev" ? -1 : 1;
        const { imgSrc, currentIndex: currentIndexInState } = this.getStates();
        const srcLength = imgSrc.length;
        const newIndex = (currentIndexInState + step + srcLength) % srcLength;
        if ("currentIndex" in this.getProps()) {
            if (this._adapter.getIsInGroup()) {
                const setCurrentIndex = this._adapter.getContext("setCurrentIndex");
                setCurrentIndex(newIndex);
            }
        } else {
            this.setState({
                currentIndex: newIndex,
            } as any);
        }
        this._adapter.notifyChange(newIndex);
        this.setState({
            direction,
            rotation: 0,
        } as any);
        this._adapter.notifyRotateChange(0);
    }  

    handleDownload = () => {
        const { currentIndex, imgSrc } = this.getStates();
        const downloadSrc = imgSrc[currentIndex];
        const downloadName = downloadSrc.slice(downloadSrc.lastIndexOf("/") + 1);
        downloadImage(downloadSrc, downloadName);
        this._adapter.notifyDownload(downloadSrc, currentIndex);
    }

    handlePreviewClose = () => {
        this._adapter.notifyVisibleChange(false);
        this._adapter.notifyClose();
    }

    handleAdjustRatio = (type: string) => {
        this.setState({
            ratio: type,
        } as any);
        this._adapter.notifyRatioChange(type);
    }

    handleRotateImage = (direction: string) => {
        const { rotation } = this.getStates();
        const newRotation = rotation + (direction === "left" ? 90 : (-90));
        this.setState({
            rotation: newRotation,
        } as any);
        this._adapter.notifyRotateChange(newRotation);
    }

    handleZoomImage = (newZoom: number) => {
        const { zoom } = this.getStates();
        this._adapter.notifyZoom(newZoom, newZoom > zoom);
        this.setState({
            zoom: newZoom,
        } as any);
    }

    // 当 visible 改变之后，预览组件完成首张图片加载后，启动预加载
    // 如： 1，2，3，4，5，6，7，8张图片， 点击第 4 张图片，preLoadGap 为 2
    // 当 visible 从 false 变为 true ，首先加载第 4 张图片，当第 4 张图片加载完成后，
    // 再按照 5，3，6，2的顺序预先加载这几张图片
    // When visible changes, the preview component finishes loading the first image and starts preloading
    // Such as: 1, 2, 3, 4, 5, 6, 7, 8 pictures, click the 4th picture, preLoadGap is 2
    // When visible changes from false to true , load the 4th image first, when the 4th image is loaded,
    // Preload these pictures in the order of 5, 3, 6, 2
    preloadGapImage = () => {
        const { preLoad, preLoadGap, infinite, currentIndex } = this.getProps();

        const { imgSrc }= this.getStates();
        if (!preLoad || typeof preLoadGap !== "number" || preLoadGap < 1){
            return;
        }

        const preloadImages = getPreloadImagArr(imgSrc, currentIndex, preLoadGap, infinite);
        const Img = new Image();
        let index = 0;
        function callback(e: any){
            index++;
            if (index < preloadImages.length) {
                Img.src = preloadImages[index];
            }
        }
        Img.onload = (e) => {
            this.setLoadSuccessStatus(Img.src);
            callback(e);
        };
        Img.onerror = callback;
        Img.src = preloadImages[0];  
    }

    // 在切换左右图片时，当被切换图片完成加载后，根据方向决定下一个预加载的图片
    // 如： 1，2，3，4，5，6，7，8张图片
    // 当 preLoadGap 为 2， 从第 5 张图片进行切换
    // - 如果向 右 切换到第 6 张，则第 6 张图片加载动作结束后（无论加载成功 or 失败），会预先加载第 8 张；
    // - 如果向 左 切换到第 4 张，则第 4 张图片加载动作结束后（无论加载成功 or 失败），会预先加载第 2 张；
    // When switching the left and right pictures, when the switched picture is loaded, the next preloaded picture is determined according to the direction
    // Such as: 1, 2, 3, 4, 5, 6, 7, 8 pictures
    // When preLoadGap is 2, switch from the 5th picture
    // - If you switch to the 6th image(direction is next), the 8th image will be preloaded after the 6th image is loaded (whether it succeeds or fails to load);
    // - If you switch to the 4th image(direction is prev), the second image will be preloaded after the 4th image is loaded (whether it succeeds or fails to load);
    preloadSingleImage = () => {
        const { preLoad, preLoadGap, infinite } = this.getProps();
        const { imgSrc, currentIndex, direction, imgLoadStatus } = this.getStates();
        if (!preLoad || typeof preLoadGap !== "number" || preLoadGap < 1){
            return;
        }
        // 根据方向决定preload那个index
        // Determine the index of preload according to the direction
        let preloadIndex = currentIndex + (direction === "prev" ? -1 : 1) * preLoadGap;
        if (preloadIndex < 0 || preloadIndex >= imgSrc.length) {
            if (infinite) {
                preloadIndex = (preloadIndex + imgSrc.length) % imgSrc.length;
            } else {
                return;
            }
        }
        // 如果图片没有加载成功过，则进行预加载
        // If the image has not been loaded successfully, preload it
        if (!imgLoadStatus[preloadIndex]) {
            const Img = new Image();
            Img.onload = (e) => {
                this.setLoadSuccessStatus(imgSrc[preloadIndex]);
            };
            Img.src = imgSrc[preloadIndex];
        }
    }

    setLoadSuccessStatus = (src: string) => {
        const { imgLoadStatus } = this.getStates();
        const status = { ...imgLoadStatus };
        status[src] = true;
        this.setState({
            imgLoadStatus: status,
        } as any);
    }

    onImageLoad = (src: string) => {
        const { preloadAfterVisibleChange } = this.getStates();
        this.setLoadSuccessStatus(src);
        // 当 preview 中当前加载的图片加载完成后，
        // 如果是在visible change之后的第一次加载，则启动加载该currentIndex左右preloadGap范围的图片
        // 如果是非第一次加载，是在左右切换图片，则根据方向预先加载单张图片
        // When the currently loaded image in Preview is loaded,
        // - It is the first load after visible change, start loading the images in the preloadGap range around the currentIndex
        // - It is not the first load, the image is switched left and right, and a single image is preloaded according to the direction
        if (preloadAfterVisibleChange) {
            this.preloadGapImage();
            this.setState({
                preloadAfterVisibleChange: false,
            } as any);
        } else {
            this.preloadSingleImage();
        }
    }   
}