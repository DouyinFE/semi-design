import React, { PureComponent, ReactNode, MouseEventHandler, MouseEvent, CSSProperties, SVGProps, FC } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/upload/constants';
import { getFileSize } from '@douyinfe/semi-foundation/upload/utils';
import { IconAlertCircle, IconClose, IconFile, IconRefresh } from '@douyinfe/semi-icons';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';

import IconButton from '../iconButton/index';
import Progress from '../progress/index';
import Tooltip from '../tooltip/index';
import Spin from '../spin/index';
import { isElement } from '../_base/reactUtils';
import { RenderFileItemProps } from './interface';

const prefixCls = cssClasses.PREFIX;

const ErrorSvg: FC<SVGProps<SVGSVGElement>> = (props = {}) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="7.99992" cy="7.99992" r="6.66667" fill="white" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.3332 8.00008C15.3332 12.0502 12.0499 15.3334 7.99984 15.3334C3.94975 15.3334 0.666504 12.0502 0.666504 8.00008C0.666504 3.94999 3.94975 0.666748 7.99984 0.666748C12.0499 0.666748 15.3332 3.94999 15.3332 8.00008ZM8.99984 11.6667C8.99984 11.1145 8.55212 10.6667 7.99984 10.6667C7.44755 10.6667 6.99984 11.1145 6.99984 11.6667C6.99984 12.219 7.44755 12.6667 7.99984 12.6667C8.55212 12.6667 8.99984 12.219 8.99984 11.6667ZM7.99984 3.33341C7.27573 3.33341 6.7003 3.94171 6.74046 4.66469L6.94437 8.33495C6.97549 8.89513 7.4388 9.33341 7.99984 9.33341C8.56087 9.33341 9.02419 8.89513 9.05531 8.33495L9.25921 4.66469C9.29938 3.94171 8.72394 3.33341 7.99984 3.33341Z" fill="#F93920"
        />
    </svg>
);

const ReplaceSvg: FC<SVGProps<SVGSVGElement>> = (props = {}) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="14" cy="14" r="14" fill="#16161A" fillOpacity="0.6" />
        <path d="M9 10.25V18.25L10.25 13.25H17.875V11.75C17.875 11.4739 17.6511 11.25 17.375 11.25H14L12.75 9.75H9.5C9.22386 9.75 9 9.97386 9 10.25Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 18.25L19 13.25H10.2031L9 18.25H18Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DirectorySvg: FC<SVGProps<SVGSVGElement>> = (props = {}) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M6 17V7.58824C6 7.26336 6.26863 7 6.6 7H10.5L12 8.76471H16.05C16.3814 8.76471 16.65 9.02806 16.65 9.35294V11.1176H7.5L6 17ZM6 17L7.44375 11.1176H18L16.8 17L6 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

);

export interface FileCardProps extends RenderFileItemProps {
    className?: string;
    style?: CSSProperties;
}


class FileCard extends PureComponent<FileCardProps> {
    static propTypes = {
        className: PropTypes.string,
        disabled: PropTypes.bool,
        listType: PropTypes.string,
        name: PropTypes.string,
        onPreviewClick: PropTypes.func,
        onRemove: PropTypes.func,
        onReplace: PropTypes.func,
        onRetry: PropTypes.func,
        percent: PropTypes.number,
        preview: PropTypes.bool,
        previewFile: PropTypes.func,
        showReplace: PropTypes.bool,
        showRetry: PropTypes.bool,
        size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        status: PropTypes.string,
        style: PropTypes.object,
        url: PropTypes.string,
        validateMessage: PropTypes.node,
        index: PropTypes.number
    };

    static defaultProps = {
        listType: strings.FILE_LIST_DEFAULT,
        name: '',
        onRemove: (): void => undefined,
        onRetry: (): void => undefined,
        preview: false,
        size: '',
    };

    transSize(size: string | number): string {
        if (typeof size === 'number') {
            return getFileSize(size);
        }
        return size;
    }

    renderValidateMessage(): ReactNode {
        const { status, validateMessage } = this.props;
        let content = null;
        switch (true) {
            case typeof validateMessage === 'string' && status === strings.FILE_STATUS_VALIDATING:
                content = (<><Spin size="small" wrapperClassName={`${prefixCls}-file-card-icon-loading`} />{validateMessage}</>);
                break;
            case typeof validateMessage === 'string':
                content = (<><IconAlertCircle className={`${prefixCls}-file-card-icon-error`} />{validateMessage}</>);
                break;
            case isElement(validateMessage):
                content = validateMessage;
                break;
            default:
                break;
        }
        return content;
    }

    renderPicValidateMsg(): ReactNode {
        const { status, validateMessage } = this.props;
        let icon = null;
        switch (true) {
            case validateMessage && status === strings.FILE_STATUS_VALIDATING:
                icon = (<Spin size="small" wrapperClassName={`${prefixCls}-picture-file-card-icon-loading`} />);
                break;
            case validateMessage && (status === strings.FILE_STATUS_VALID_FAIL || status === strings.FILE_STATUS_UPLOAD_FAIL):
                icon = (<div className={`${prefixCls}-picture-file-card-icon-error`}><ErrorSvg /></div>);
                break;
            default:
                break;
        }
        return icon ? <Tooltip content={validateMessage} trigger="hover" position="bottom">{icon}</Tooltip> : null;
    }

    renderPic(locale: Locale['Upload']): ReactNode {
        const { url, percent, status, disabled, style, onPreviewClick, showPicInfo, renderPicInfo, renderThumbnail, name, index } = this.props;
        const showProgress = status === strings.FILE_STATUS_UPLOADING && percent !== 100;
        const showRetry = status === strings.FILE_STATUS_UPLOAD_FAIL && this.props.showRetry;
        const showReplace = status === strings.FILE_STATUS_SUCCESS && this.props.showReplace;
        const filePicCardCls = cls({
            [`${prefixCls}-picture-file-card`]: true,
            [`${prefixCls}-picture-file-card-disabled`]: disabled,
            [`${prefixCls}-picture-file-card-show-pointer`]: typeof onPreviewClick !== 'undefined',
            [`${prefixCls}-picture-file-card-error`]: status === strings.FILE_STATUS_UPLOAD_FAIL,
            [`${prefixCls}-picture-file-card-uploading`]: showProgress
        });
        const closeCls = `${prefixCls}-picture-file-card-close`;
        const retry = (
            <div
                className={`${prefixCls}-picture-file-card-retry`} onClick={e => this.onRetry(e)}>
                <IconRefresh className={`${prefixCls}-picture-file-card-icon-retry`} />
            </div>
        );
        const replace = (
            <Tooltip trigger="hover" position="top" content={locale.replace} showArrow={false} spacing={4}>
                <div
                    className={`${prefixCls}-picture-file-card-replace`} onClick={(e): void => this.onReplace(e)}>
                    <ReplaceSvg className={`${prefixCls}-picture-file-card-icon-replace`} />
                </div>
            </Tooltip>

        );

        const picInfo = typeof renderPicInfo === 'function' ? renderPicInfo(this.props) : (
            <div className={`${prefixCls }-picture-file-card-pic-info`}>{index + 1}</div>
        );

        const thumbnail = typeof renderThumbnail === 'function' ? renderThumbnail(this.props) : <img src={url} alt={`picture of ${name}`} />;

        return (
            <div className={filePicCardCls} style={style} onClick={onPreviewClick}>
                {thumbnail}
                {showProgress ? <Progress percent={percent} type="circle" size="small" orbitStroke={'#FFF'} /> : null}
                {showRetry ? retry : null}
                {showReplace && replace}
                {showPicInfo && picInfo}
                {!disabled && (
                    <div className={closeCls}>
                        <IconClose size="extra-small" onClick={e => this.onRemove(e)} />
                    </div>
                )}
                {this.renderPicValidateMsg()}
            </div>
        );
    }

    renderFile(locale: Locale["Upload"]) {
        const { name, size, percent, url, showRetry: propsShowRetry, showReplace: propsShowReplace, preview, previewFile, status, style, onPreviewClick } = this.props;
        const fileCardCls = cls({
            [`${prefixCls}-file-card`]: true,
            [`${prefixCls}-file-card-fail`]: status === strings.FILE_STATUS_VALID_FAIL || status === strings.FILE_STATUS_UPLOAD_FAIL,
            [`${prefixCls}-file-card-show-pointer`]: typeof onPreviewClick !== 'undefined',
        });
        const previewCls = cls({
            [`${prefixCls}-file-card-preview`]: true,
            [`${prefixCls}-file-card-preview-placeholder`]: !preview || previewFile
        });
        const infoCls = `${prefixCls}-file-card-info`;
        const closeCls = `${prefixCls}-file-card-close`;
        const replaceCls = `${prefixCls}-file-card-replace`;
        const showProgress = !(percent === 100 || typeof percent === 'undefined') && status === strings.FILE_STATUS_UPLOADING;
        // only show retry when upload fail & showRetry is true, no need to show during validate fail
        const showRetry = status === strings.FILE_STATUS_UPLOAD_FAIL && propsShowRetry;
        const showReplace = status === strings.FILE_STATUS_SUCCESS && propsShowReplace;
        const fileSize = this.transSize(size);
        let previewContent: ReactNode = preview ? (<img src={url} />) : (<IconFile size="large" />);
        if (previewFile) {
            previewContent = previewFile(this.props);
        }
        return (
            <div className={fileCardCls} style={style} onClick={onPreviewClick}>
                <div className={previewCls}>
                    {previewContent}
                </div>
                <div className={`${infoCls}-main`}>
                    <div className={`${infoCls}-main-text`}>
                        <span className={`${infoCls}-name`}>
                            {name}
                        </span>
                        <span>
                            <span className={`${infoCls}-size`}>{fileSize}</span>
                            {showReplace && (
                                <Tooltip trigger="hover" position="top" showArrow={false} content={locale.replace}>
                                    <IconButton
                                        onClick={e => this.onReplace(e)}
                                        type="tertiary"
                                        theme="borderless"
                                        size="small"
                                        icon={<DirectorySvg />}
                                        className={replaceCls}
                                    />
                                </Tooltip>
                            )}

                        </span>

                    </div>
                    {showProgress ? (<Progress percent={percent} style={{ width: '100%' }} />) : null}
                    <div className={`${infoCls}-main-control`}>
                        <span className={`${infoCls}-validate-message`}>
                            {this.renderValidateMessage()}
                        </span>
                        {showRetry ? <span className={`${infoCls}-retry`} onClick={e => this.onRetry(e)}>{locale.retry}</span> : null}
                    </div>
                </div>
                <IconButton
                    onClick={e => this.onRemove(e)}
                    type="tertiary"
                    icon={<IconClose />}
                    theme="borderless"
                    size="small"
                    className={closeCls}
                />
            </div>
        );
    }

    onRemove(e: MouseEvent): void {
        e.stopPropagation();
        this.props.onRemove(this.props, e);
    }

    onReplace(e: MouseEvent): void {
        e.stopPropagation();
        this.props.onReplace(this.props, e);
    }

    onRetry(e: MouseEvent): void {
        e.stopPropagation();
        this.props.onRetry(this.props, e);
    }

    render() {
        const { listType } = this.props;
        if (listType === strings.FILE_LIST_PIC) {
            return (
                <LocaleConsumer componentName="Upload">
                    {(locale: Locale["Upload"]) => (this.renderPic(locale))}
                </LocaleConsumer>
            );
        }

        if (listType === strings.FILE_LIST_DEFAULT) {
            return (
                <LocaleConsumer componentName="Upload">
                    {(locale: Locale["Upload"]) => (this.renderFile(locale))}
                </LocaleConsumer>
            );
        }

        return null;
    }
}

export default FileCard;