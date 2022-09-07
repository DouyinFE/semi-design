import React, { ReactNode } from "react";
import BaseComponent from "../_base/baseComponent";
import { IconChevronLeft, IconChevronRight, IconMinus, IconPlus, IconRotate, IconDownload } from "@douyinfe/semi-icons";
import { FooterProps, RealSizeSvg, AdaptionSvg } from "./interface";
import PropTypes from "prop-types";
import Tooltip from "../tooltip";
import Divider from "../divider";
import Slider from "../slider";
import Icon from "../icons";
import Button from "../button";
import { cssClasses } from "@douyinfe/semi-foundation/image/constants";
import cls from "classnames";
import PreviewFooterFoundation, { PreviewFooterAdapter } from "@douyinfe/semi-foundation/image/previewFooterFoundation";
import LocaleConsumer from "../locale/localeConsumer";
import { Locale } from "../locale/interface";
import { throttle } from "lodash";

const prefixCls = cssClasses.PREFIX;
const footerPrefixCls = `${cssClasses.PREFIX}-preview-footer`;

let mouseActiveTime: number = 0;

export default class Footer extends BaseComponent<FooterProps> {
    static propTypes = {
        curPage: PropTypes.number,
        totalNum: PropTypes.number,
        disabledPrev: PropTypes.bool,
        disabledNext: PropTypes.bool,
        disableDownload: PropTypes.bool,
        className: PropTypes.string,
        zoom: PropTypes.number,
        ratio: PropTypes.string,
        prevTip: PropTypes.string,
        nextTip: PropTypes.string,
        zoomInTip: PropTypes.string,
        zoomOutTip: PropTypes.string,
        rotateTip: PropTypes.string,
        downloadTip: PropTypes.string,
        adaptiveTip: PropTypes.string,
        originTip: PropTypes.string,
        showTooltip: PropTypes.bool,
        onZoomIn: PropTypes.func,
        onZoomOut: PropTypes.func,
        onPrev: PropTypes.func,
        onNext: PropTypes.func,
        onAdjustRatio: PropTypes.func,
        onRotateLeft: PropTypes.func,
        onDownload: PropTypes.func,
    }

    // 用户可通过Prop传入，下面的问题就暂时不进行国际化
    static defaultProps = {
        min: 10,
        max: 500,
        step: 10,
        showTooltip: false,
        disableDownload: false,
    }

    get adapter(): PreviewFooterAdapter<FooterProps> {
        return {
            ...super.adapter,
            setStartMouseOffset: (time: number) => {
                mouseActiveTime = time;
            }
        };
    }

    foundation: PreviewFooterFoundation;

    constructor(props: FooterProps) {
        super(props);
        this.foundation = new PreviewFooterFoundation(this.adapter);
    }

    changeSliderValue = (type: string): void => {
        this.foundation.changeSliderValue(type);
    };

    handleMinusClick = () => {
        this.changeSliderValue("Minus");
    }

    handlePlusClick = () => {
        this.changeSliderValue("plus");
    }

    handleSlideChange = throttle((value): void => {
        this.foundation.handleValueChange(value);
    }, 50);

    handleRatioClick = (): void => {
        this.foundation.handleRatioClick();
    }

    customRenderViewMenu = (): ReactNode => {
        const { min, max, step, curPage, totalNum, ratio, zoom, disabledPrev, disabledNext, 
            disableDownload, onNext, onPrev, onDownload, renderPreviewMenu, onRotateLeft } 
        = this.props;

        const props = { min, max, step, curPage, totalNum, ratio, zoom, onRotateLeft,
            disabledPrev, disabledNext, disableDownload, onNext, onPrev, onDownload,
            disabledZoomIn: zoom === max,
            disabledZoomOut: zoom === min,
            onRatioClick: this.handleRatioClick,
            onZoomIn: this.handlePlusClick,
            onZoomOut: this.handleMinusClick,
        };
        return renderPreviewMenu(props);
    }

    // According to showTooltip in props, decide whether to use Tooltip to pack a layer
    // 根据props中的showTooltip决定是否使用Tooltip包一层
    getFinalIconElement = (element: ReactNode, content: ReactNode) => {
        const { showTooltip } = this.props;
        return showTooltip ? (
            <Tooltip content={content}>
                {element}
            </Tooltip>
        ): element;
    }

    getLocalTextByKey = (key: string) => (
        <LocaleConsumer<Locale["Image"]> componentName="Image" >
            {(locale: Locale["Image"]) => locale[key]}
        </LocaleConsumer>
    );

    getIconChevronLeft = () => {
        const { disabledPrev, onPrev, prevTip } = this.props;
        const icon = <IconChevronLeft
            size="large"
            className={disabledPrev ? `${prefixCls}-disabled` : ""}
            onClick={!disabledPrev ? onPrev : undefined}
        />;
        const content = prevTip ?? this.getLocalTextByKey('prevTip');
        return this.getFinalIconElement(icon, content);
    }

    getIconChevronRight = () => {
        const { disabledNext, onNext, nextTip } = this.props;
        const icon = <IconChevronRight
            size="large"
            className={disabledNext ? `${prefixCls}-disabled` : ""}
            onClick={!disabledNext ? onNext : undefined}
        />;
        const content = nextTip ?? this.getLocalTextByKey('nextTip');
        return this.getFinalIconElement(icon, content);
    }

    getIconMinus = () => {
        const { zoomOutTip, zoom, min } = this.props;
        const disabledZoomOut = zoom === min;
        const icon = <IconMinus 
            size="large" 
            onClick={!disabledZoomOut ? this.handleMinusClick : undefined} 
            className={disabledZoomOut ? `${prefixCls}-disabled` : ""}
        />;
        const content = zoomOutTip ?? this.getLocalTextByKey("zoomOutTip");
        return this.getFinalIconElement(icon, content);
    }

    getIconPlus = () => {
        const { zoomInTip, zoom, max } = this.props;
        const disabledZoomIn = zoom === max;
        const icon = <IconPlus 
            size="large" 
            onClick={!disabledZoomIn ? this.handlePlusClick : undefined}  
            className={disabledZoomIn ? `${prefixCls}-disabled` : ""}
        />;
        const content = zoomInTip ?? this.getLocalTextByKey('zoomInTip');
        return this.getFinalIconElement(icon, content);
    }

    getIconRatio = () => {
        const { ratio, originTip, adaptiveTip } = this.props;
        const icon = <Icon
            svg={ratio === "adaptation" ? <RealSizeSvg /> : <AdaptionSvg />}
            size="large"
            className={cls(`${footerPrefixCls}-gap`)}
            onClick={this.handleRatioClick}
        />;
        let content: any;
        if (ratio === "adaptation") {
            content = originTip ?? this.getLocalTextByKey("originTip");
        } else {
            content = adaptiveTip ?? this.getLocalTextByKey("adaptiveTip");
        }
        return this.getFinalIconElement(icon, content);
    }

    getIconRotate = () => {
        const { rotateTip, onRotateLeft } = this.props;
        const icon = <IconRotate
            size="large"
            onClick={onRotateLeft}
        />;
        const content = rotateTip ?? this.getLocalTextByKey("rotateTip");
        return this.getFinalIconElement(icon, content);
    }

    getIconDownload = () => {
        const { downloadTip, onDownload, disableDownload } = this.props;
        const icon = <IconDownload
            size="large"
            onClick={!disableDownload ? onDownload : undefined}
            className={cls(`${footerPrefixCls}-gap`,
                {
                    [`${prefixCls}-disabled`] : disableDownload,
                },
            )}
        />;
        const content = downloadTip ?? this.getLocalTextByKey("downloadTip");
        return this.getFinalIconElement(icon, content);
    }


    render() {
        const { 
            min, 
            max,
            step,
            curPage,
            totalNum,
            zoom,
            showTooltip,
            className,
            renderPreviewMenu,
        } = this.props;

        if (renderPreviewMenu) {
            return (
                <div className={`${footerPrefixCls}-wrapper`}>
                    {this.customRenderViewMenu()}
                </div>
            ); 
        }

        return (
            <section className={cls(footerPrefixCls, `${footerPrefixCls}-wrapper`, className)}>
                {this.getIconChevronLeft()}
                <div className={`${footerPrefixCls}-page`}>
                    {curPage}/{totalNum}
                </div>
                {this.getIconChevronRight()}
                <Divider layout="vertical" />
                {this.getIconMinus()}
                <Slider
                    value={zoom}
                    min={min}
                    max={max}
                    step={step}
                    tipFormatter={(v): string => `${v}%`}
                    tooltipVisible={showTooltip ? undefined : false }
                    onChange={this.handleSlideChange}
                />
                {this.getIconPlus()}
                {this.getIconRatio()}
                <Divider layout="vertical" />
                {this.getIconRotate()}
                {this.getIconDownload()}
            </section>
        );
    }
}




