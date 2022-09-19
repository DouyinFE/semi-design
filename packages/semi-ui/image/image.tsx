/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import BaseComponent from "../_base/baseComponent";
import { ImageProps, ImageStates } from "./interface";
import PropTypes from "prop-types";
import { cssClasses } from "@douyinfe/semi-foundation/image/constants";
import cls from "classnames";
import { IconUploadError, IconEyeOpened } from "@douyinfe/semi-icons";
import Spin from "../spin";
import PreviewInner from "./previewInner";
import "@douyinfe/semi-foundation/image/image.scss";
import { PreviewContext, PreviewContextProps } from "./previewContext";
import ImageFoundation, { ImageAdapter } from "@douyinfe/semi-foundation/image/imageFoundation";
import LocaleConsumer from "../locale/localeConsumer";
import { Locale } from "../locale/interface";
import { isObject } from "lodash";

const prefixCls = cssClasses.PREFIX;

export default class Image extends BaseComponent<ImageProps, ImageStates> {
    static isSemiImage = true;
    static contextType = PreviewContext;
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        src: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        alt: PropTypes.string,
        placeholder: PropTypes.node,
        fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        preview: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        onLoad: PropTypes.func,
        onError: PropTypes.func,
        crossOrigin: PropTypes.string,
        imageID: PropTypes.number,
    }

    static defaultProps = {
        preview: true,
    };

    get adapter(): ImageAdapter<ImageProps, ImageStates> {
        return {
            ...super.adapter,
            getIsInGroup: () => this.isInGroup(),
        };
    }

    context: PreviewContextProps;
    foundation: ImageFoundation;

    constructor(props: ImageProps) {
        super(props);
        this.state = {
            src: "",
            loadStatus: "loading",
            previewVisible: false,
        };

        this.foundation = new ImageFoundation(this.adapter);
    }

    static getDerivedStateFromProps(props: ImageProps, state: ImageStates) {
        const willUpdateStates: Partial<ImageStates> = {};

        if (props.src !== state.src) {
            willUpdateStates.src = props.src;
            willUpdateStates.loadStatus = "loading";
        }

        return willUpdateStates;
    }

    isInGroup() {
        return Boolean(this.context && this.context.isGroup);
    }

    isLazyLoad() {
        if (this.context) {
            return this.context.lazyLoad;
        }
        return false;
    }

    handleClick = (e) => {
        this.foundation.handleClick(e);
    };

    handleLoaded = (e) => {
        this.foundation.handleLoaded(e);
    }

    handleError = (e) => {
        this.foundation.handleError(e);
    }

    handlePreviewVisibleChange = (visible: boolean) => {
        this.foundation.handlePreviewVisibleChange(visible);
    }

    renderDefaultLoading = () => {
        const prefixClsName = `${prefixCls}-status`;
        return (
            <div className={cls(prefixClsName, `${prefixClsName}-loading`)}>
                <div className={cls(`${prefixClsName}-inner`, `${prefixClsName}-inner-loading`)}>
                    <Spin />
                    <span className={`${prefixClsName}-inner-text`}>{this.getLocalTextByKey("loading")}</span>
                </div>
            </div>
        );
    };

    renderDefaultError = () => {
        const prefixClsName = `${prefixCls}-status`;
        return (
            <div className={cls(prefixClsName, `${prefixClsName}-error`)}>
                <div className={cls(`${prefixClsName}-inner`, `${prefixClsName}-inner-error`)}>
                    <IconUploadError size={"extra-large"} className={`${prefixClsName}-inner-icon`}/>
                    <span className={`${prefixClsName}-inner-text`}>{this.getLocalTextByKey("loadError")}</span>
                </div>
            </div>
        );
    };

    renderLoad = () => {
        const prefixClsName = `${prefixCls}-status`;
        const { placeholder } = this.props;
        return (
            placeholder ? (
                <div className={prefixClsName}> 
                    {placeholder}
                </div>
            ) : this.renderDefaultLoading()
        );
    }

    renderError = () => {
        const { fallback } = this.props;
        const prefixClsName = `${prefixCls}-status`;
        const fallbackNode = typeof fallback === "string" ? (<img style={{ width: "100%", height: "100%" }}src={fallback} alt="fallback"/>) : fallback;
        return (
            fallback ? (
                <div className={prefixClsName}>
                    {fallbackNode}
                </div>
            ) :this.renderDefaultError()
        );
    }

    renderExtra = () => {
        const { loadStatus } = this.state;
        return (
            <div className={`${prefixCls}-overlay`}>
                {loadStatus === "error" && this.renderError()}
                {loadStatus === "loading" && this.renderLoad()}
            </div>
        );
    }

    getLocalTextByKey = (key: string) => (
        <LocaleConsumer<Locale["Image"]> componentName="Image" >
            {(locale: Locale["Image"]) => locale[key]}
        </LocaleConsumer>
    );

    renderMask = () => (<div className={`${prefixCls}-mask`}>
        <div className={`${prefixCls}-mask-info`}>
            <IconEyeOpened size="extra-large"/>
            <span className={`${prefixCls}-mask-info-text`}>{this.getLocalTextByKey("preview")}</span>
        </div>
    </div>)

    render() {
        const { src, loadStatus, previewVisible } = this.state;
        const { width, height, alt, style, className, crossOrigin, preview } = this.props;
        const outerStyle = Object.assign({ width, height }, style);
        const outerCls = cls(prefixCls, className);
        const canPreview = loadStatus === "success" && preview && !this.isInGroup();
        const showMask = preview && loadStatus === "success";
        const previewSrc = isObject(preview) ? ((preview as any).src ?? src) : src;
        const previewProps = isObject(preview) ? preview : {};
        return ( 
            // eslint-disable jsx-a11y/no-static-element-interactions
            // eslint-disable jsx-a11y/click-events-have-key-events
            <div
                style={outerStyle}
                className={outerCls}
                onClick={this.handleClick}
            >
                <img
                    src={this.isInGroup() && this.isLazyLoad() ? undefined : src}
                    data-src={src}
                    alt={alt}
                    className={`${prefixCls}-img`}
                    width={width}
                    height={height}
                    crossOrigin={crossOrigin}
                    onError={this.handleError}
                    onLoad={this.handleLoaded}
                />
                {showMask && this.renderMask()}
                {loadStatus !== "success" && this.renderExtra()}
                {canPreview && 
                    <PreviewInner
                        {...previewProps}
                        src={previewSrc}
                        visible={previewVisible}
                        onVisibleChange={this.handlePreviewVisibleChange}
                    />
                }
            </div>
        );
    } 
}
