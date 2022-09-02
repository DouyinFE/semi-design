import React, { ReactNode } from 'react';
import BaseComponent from '../_base/baseComponent';
import { IconChevronLeft, IconChevronRight, IconMinus, IconPlus, IconRotate, IconDownload } from '@douyinfe/semi-icons';
import { throttle } from './utils';
import { FooterProps, RealSizeSvg, AdaptionSvg } from './interface';
import PropTypes from 'prop-types';
import Tooltip from '../tooltip';
import Divider from '../divider';
import Slider from '../slider';
import Icon from '../icons';
import Button from '../button';
import { cssClasses } from '@douyinfe/semi-foundation/image/constants';
import cls from 'classnames';
import PreviewFooterFoundation, { PreviewFooterAdapter } from '@douyinfe/semi-foundation/image/previewFooterFoundation';

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
        prevTip: '上一张',
        nextTip: '下一张',
        zoomInTip: '放大',
        zoomOutTip: '缩小',
        rotateTip: '旋转',
        downloadTip: '下载',
        adaptiveTip: '适应页面',
        originTip: '原始尺寸',
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

    changeSliderValue = (type): void => {
        this.foundation.changeSliderValue(type);
    };

    handleMinusClick = () => {
        this.changeSliderValue('Minus');
    }

    handlePlusClick = () => {
        this.changeSliderValue('plus');
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

    render() {
        const { 
            min, 
            max,
            step,
            curPage,
            totalNum,
            ratio,
            prevTip, 
            nextTip, 
            zoom,
            zoomInTip, 
            zoomOutTip, 
            rotateTip, 
            downloadTip, 
            originTip,
            adaptiveTip,
            disabledPrev, 
            disabledNext, 
            disableDownload,
            showTooltip,
            onNext,
            onPrev,
            onDownload,
            onRotateLeft,
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

        const disabledZoomIn = zoom === max;
        const disabledZoomOut = zoom === min;

        return (
            <section className={cls(footerPrefixCls, `${footerPrefixCls}-wrapper`, className,)}>
                <Tooltip content={prevTip}>
                    <IconChevronLeft
                        size="large"
                        className={disabledPrev ? `${prefixCls}-disabled` : ''}
                        onClick={!disabledPrev ? onPrev : undefined}
                    />
                </Tooltip>
                <div className={`${prefixCls}-page`}>
                    {curPage}/{totalNum}
                </div>
                <Tooltip content={nextTip}>
                    <IconChevronRight
                        size="large"
                        className={disabledNext ? `${prefixCls}-disabled` : ''}
                        onClick={!disabledNext ? onNext : undefined}
                    />
                </Tooltip>
                <Divider layout="vertical" />
                <Tooltip content={zoomOutTip}>
                    <IconMinus 
                        size="large" 
                        onClick={this.handleMinusClick} 
                        className={disabledZoomOut ? `${prefixCls}-disabled` : ''}
                    />
                </Tooltip>
                <div>
                    <Slider
                        value={zoom}
                        min={min}
                        max={max}
                        step={step}
                        tipFormatter={(v): string => `${v}%`}
                        tooltipVisible={showTooltip}
                        onChange={this.handleSlideChange}
                    />
                </div>
                <Tooltip content={zoomInTip}>
                    <IconPlus 
                        size="large" 
                        onClick={this.handlePlusClick} 
                        className={disabledZoomIn ? `${prefixCls}-disabled` : ''}
                    />
                </Tooltip>
                <Tooltip content={ratio === 'adaptation' ? originTip : adaptiveTip}>
                    <Icon
                        svg={ratio === 'adaptation' ? <RealSizeSvg /> : <AdaptionSvg />}
                        size="large"
                        style={{ marginLeft: 16 }}
                        onClick={this.handleRatioClick}
                    />
                </Tooltip>
                <Divider layout="vertical" />
                <span className={`${prefixCls}-operation`}>
                    <Tooltip content={rotateTip}>
                        <Button
                            onClick={onRotateLeft}
                            icon={<IconRotate size="large" />}
                            type="tertiary"
                        />
                    </Tooltip>
                    <Tooltip content={downloadTip}>
                        <Button
                            type="tertiary"
                            onClick={onDownload}
                            icon={<IconDownload size="large" />}
                            disabled={disableDownload}
                        />
                    </Tooltip>
                </span>
            </section>
        );
    }
}




