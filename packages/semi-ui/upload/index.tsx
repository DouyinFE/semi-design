/* eslint-disable max-len */
import React, { ReactNode, CSSProperties, RefObject, ChangeEvent, DragEvent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash-es';
import UploadFoundation, { BaseFileItem, UploadAdapter, BeforeUploadObjectResult, AfterUploadResult } from '@douyinfe/semi-foundation/upload/foundation';
import { strings, cssClasses } from '@douyinfe/semi-foundation/upload/constants';
import FileCard from './fileCard';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import LocaleConsumer from '../locale/localeConsumer';
import { IconUpload } from '@douyinfe/semi-icons';
import { FileItem, RenderFileItemProps, UploadListType, PromptPositionType, BeforeUploadProps, AfterUploadProps, OnChangeProps, customRequestArgs, CustomError } from './interface';
import { Locale } from '../locale/interface';
import '@douyinfe/semi-foundation/upload/upload.scss';

const prefixCls = cssClasses.PREFIX;

export { FileItem, RenderFileItemProps, UploadListType, PromptPositionType, BeforeUploadProps, AfterUploadProps, OnChangeProps, customRequestArgs, CustomError, BeforeUploadObjectResult, AfterUploadResult };

export interface UploadProps {
    accept?: string;
    action: string;
    afterUpload?: (object: AfterUploadProps) => AfterUploadResult;
    beforeUpload?: (object: BeforeUploadProps) => BeforeUploadObjectResult | Promise<BeforeUploadObjectResult> | boolean;
    beforeClear?: (fileList: Array<FileItem>) => boolean | Promise<boolean>;
    beforeRemove?: (file: FileItem, fileList: Array<FileItem>) => boolean | Promise<boolean>;
    capture?: boolean | string | undefined;
    children?: ReactNode;
    className?: string;
    customRequest?: (object: customRequestArgs) => void;
    data?: Record<string, any> | ((file: File) => Record<string, unknown>);
    defaultFileList?: Array<FileItem>;
    directory?: boolean;
    disabled?: boolean;
    dragIcon?: ReactNode;
    dragMainText?: ReactNode;
    dragSubText?: ReactNode;
    draggable?: boolean;
    fileList?: Array<FileItem>;
    fileName?: string;
    headers?: Record<string, any> | ((file: File) => Record<string, string>);
    itemStyle?: CSSProperties;
    limit?: number;
    listType?: UploadListType;
    maxSize?: number;
    minSize?: number;
    multiple?: boolean;
    name?: string;
    onAcceptInvalid?: (files: File[]) => void;
    onChange?: (object: OnChangeProps) => void;
    onClear?: () => void;
    onDrop?: (e: Event, files: Array<File>, fileList: Array<FileItem>) => void;
    onError?: (e: CustomError, file: File, fileList: Array<FileItem>, xhr: XMLHttpRequest) => void;
    onExceed?: (fileList: Array<File>) => void;
    onFileChange?: (files: Array<File>) => void;
    onOpenFileDialog?: () => void;
    onPreviewClick?: (fileItem: FileItem) => void;
    onProgress?: (percent: number, file: File, fileList: Array<FileItem>) => void;
    onRemove?: (currentFile: File, fileList: Array<FileItem>, currentFileItem: FileItem) => void;
    onRetry?: (fileItem: FileItem) => void;
    onSizeError?: (file: File, fileList: Array<FileItem>) => void;
    onSuccess?: (responseBody: any, file: File, fileList: Array<FileItem>) => void;
    previewFile?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    prompt?: ReactNode;
    promptPosition?: PromptPositionType;
    renderFileItem?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    showClear?: boolean;
    showReplace?: boolean; // Display replacement function
    showRetry?: boolean;
    showUploadList?: boolean;
    style?: CSSProperties;
    timeout?: number;
    transformFile?: (file: File) => FileItem;
    uploadTrigger?: 'auto' | 'custom';
    validateMessage?: ReactNode;
    validateStatus?: ValidateStatus;
    withCredentials?: boolean;
}

export interface UploadState {
    dragAreaStatus: 'default' | 'legal' | 'illegal'; // Status of the drag zone
    fileList: Array<FileItem>;
    inputKey: number;
    localUrls: Array<string>;
    replaceIdx: number;
    replaceInputKey: number;
}

class Upload extends BaseComponent<UploadProps, UploadState> {
    static propTypes = {
        accept: PropTypes.string, // Limit allowed file types
        action: PropTypes.string.isRequired,
        afterUpload: PropTypes.func,
        beforeClear: PropTypes.func,
        beforeRemove: PropTypes.func,
        beforeUpload: PropTypes.func,
        children: PropTypes.node,
        className: PropTypes.string,
        customRequest: PropTypes.func,
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // Extra parameters attached when uploading
        defaultFileList: PropTypes.array,
        directory: PropTypes.bool, // Support folder upload
        disabled: PropTypes.bool,
        dragIcon: PropTypes.node,
        dragMainText: PropTypes.node,
        dragSubText: PropTypes.node,
        draggable: PropTypes.bool,
        fileList: PropTypes.array, // files had been uploaded
        fileName: PropTypes.string, // same as name, to avoid props conflict in Form.Upload
        headers: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        itemStyle: PropTypes.object,
        limit: PropTypes.number, // 最大允许上传文件个数
        listType: PropTypes.oneOf<UploadProps['listType']>(strings.LIST_TYPE),
        maxSize: PropTypes.number, // 文件大小限制，单位kb
        minSize: PropTypes.number, // 文件大小限制，单位kb
        multiple: PropTypes.bool,
        name: PropTypes.string, // file name
        onAcceptInvalid: PropTypes.func,
        onChange: PropTypes.func,
        onClear: PropTypes.func,
        onDrop: PropTypes.func,
        onError: PropTypes.func,
        onExceed: PropTypes.func, // Callback exceeding limit
        onFileChange: PropTypes.func, // Callback when file is selected
        onOpenFileDialog: PropTypes.func,
        onPreviewClick: PropTypes.func,
        onProgress: PropTypes.func,
        onRemove: PropTypes.func,
        onRetry: PropTypes.func,
        onSizeError: PropTypes.func, // Callback with invalid file size
        onSuccess: PropTypes.func,
        previewFile: PropTypes.func, // Custom preview
        prompt: PropTypes.node,
        promptPosition: PropTypes.oneOf<UploadProps['promptPosition']>(strings.PROMPT_POSITION),
        renderFileItem: PropTypes.func,
        showClear: PropTypes.bool,
        showReplace: PropTypes.bool,
        showRetry: PropTypes.bool,
        showUploadList: PropTypes.bool, // whether to show fileList
        style: PropTypes.object,
        timeout: PropTypes.number,
        transformFile: PropTypes.func,
        uploadTrigger: PropTypes.oneOf<UploadProps['uploadTrigger']>(strings.UPLOAD_TRIGGER), // auto、custom
        validateMessage: PropTypes.node,
        validateStatus: PropTypes.oneOf<UploadProps['validateStatus']>(strings.VALIDATE_STATUS),
        withCredentials: PropTypes.bool,
    };

    static defaultProps: Partial<UploadProps> = {
        defaultFileList: [],
        disabled: false,
        listType: 'list' as const,
        multiple: false,
        onAcceptInvalid: noop,
        onChange: noop,
        beforeRemove: () => true,
        beforeClear: () => true,
        onClear: noop,
        onDrop: noop,
        onError: noop,
        onExceed: noop,
        onFileChange: noop,
        onOpenFileDialog: noop,
        onProgress: noop,
        onRemove: noop,
        onRetry: noop,
        onSizeError: noop,
        onSuccess: noop,
        promptPosition: 'right' as const,
        showClear: true,
        showReplace: false,
        showRetry: true,
        showUploadList: true,
        uploadTrigger: 'auto' as const,
        withCredentials: false,
    };

    static FileCard = FileCard;

    constructor(props: UploadProps) {
        super(props);
        this.state = {
            fileList: props.defaultFileList || [],
            replaceIdx: -1,
            inputKey: Math.random(),
            replaceInputKey: Math.random(),
            // Status of the drag zone
            dragAreaStatus: 'default',
            localUrls: [],
        };
        this.foundation = new UploadFoundation(this.adapter);
        this.inputRef = React.createRef<HTMLInputElement>();
        this.replaceInputRef = React.createRef<HTMLInputElement>();
    }

    static getDerivedStateFromProps(props: UploadProps): Partial<UploadState> | null {
        const { fileList } = props;
        if ('fileList' in props) {
            return {
                fileList: fileList || []
            };
        }
        return null;
    }

    get adapter(): UploadAdapter<UploadProps, UploadState> {
        return {
            ...super.adapter,
            notifyFileSelect: (files): void => this.props.onFileChange(files),
            notifyError: (error, fileInstance, fileList, xhr): void => this.props.onError(error, fileInstance, fileList, xhr),
            notifySuccess: (responseBody, file, fileList): void => this.props.onSuccess(responseBody, file, fileList),
            notifyProgress: (percent, file, fileList): void => this.props.onProgress(percent, file, fileList),
            notifyRemove: (file, fileList, fileItem): void => this.props.onRemove(file, fileList, fileItem),
            notifySizeError: (file, fileList): void => this.props.onSizeError(file, fileList),
            notifyExceed: (fileList): void => this.props.onExceed(fileList),
            updateFileList: (fileList, cb): void => {
                if (typeof cb === 'function') {
                    this.setState({ fileList }, cb);
                } else {
                    this.setState({ fileList });
                }
            },
            notifyBeforeUpload: ({ file, fileList }): boolean | BeforeUploadObjectResult | Promise<BeforeUploadObjectResult> => this.props.beforeUpload({ file, fileList }),
            notifyAfterUpload: ({ response, file, fileList }): AfterUploadResult => this.props.afterUpload({ response, file, fileList }),
            resetInput: (): void => {
                this.setState(prevState => ({
                    inputKey: Math.random()
                }));
            },
            resetReplaceInput: (): void => {
                this.setState(prevState => ({
                    replaceInputKey: Math.random()
                }));
            },
            updateDragAreaStatus: (dragAreaStatus: string): void => this.setState({ dragAreaStatus } as { dragAreaStatus: 'default' | 'legal' | 'illegal' }),
            notifyChange: ({ currentFile, fileList }): void => this.props.onChange({ currentFile, fileList }),
            updateLocalUrls: (urls): void => this.setState({ localUrls: urls }),
            notifyClear: (): void => this.props.onClear(),
            notifyPreviewClick: (file): void => this.props.onPreviewClick(file),
            notifyDrop: (e, files, fileList): void => this.props.onDrop(e, files, fileList),
            notifyAcceptInvalid: (invalidFiles): void => this.props.onAcceptInvalid(invalidFiles),
            notifyBeforeRemove: (file, fileList): boolean | Promise<boolean> => this.props.beforeRemove(file, fileList),
            notifyBeforeClear: (fileList): boolean | Promise<boolean> => this.props.beforeClear(fileList),
        };
    }

    foundation: UploadFoundation;
    inputRef: RefObject<HTMLInputElement> = null;
    replaceInputRef: RefObject<HTMLInputElement> = null;

    componentWillUnmount(): void {
        this.foundation.destroy();
    }

    onClick = (): void => {
        const { inputRef, props } = this;
        const { onOpenFileDialog } = props;
        const isDisabled = Boolean(this.props.disabled);
        if (isDisabled || !inputRef || !inputRef.current) {
            return;
        }
        inputRef.current.click();
        if (onOpenFileDialog && typeof onOpenFileDialog) {
            onOpenFileDialog();
        }
    };

    onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { files } = e.target;
        this.foundation.handleChange(files);
    };

    replace = (index: number): void => {
        this.setState({ replaceIdx: index }, () => {
            this.replaceInputRef.current.click();
        });

    };

    onReplaceChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { files } = e.target;
        this.foundation.handleReplaceChange(files);
    };

    clear = (): void => {
        this.foundation.handleClear();
    };

    remove = (fileItem: FileItem): void => {
        this.foundation.handleRemove(fileItem);
    };

    upload = (): void => {
        const { fileList } = this.state;
        this.foundation.startUpload(fileList);
    };

    renderFile = (file: FileItem, index: number, locale: Locale['Upload']): ReactNode => {
        const { name, status, validateMessage, _sizeInvalid } = file;
        const { previewFile, listType, itemStyle, showRetry, renderFileItem, disabled, onPreviewClick, showReplace } = this.props;
        const onRemove = (): void => this.remove(file);
        const onRetry = (): void => {
            this.foundation.retry(file);
        };
        const onReplace = (): void => {
            this.replace(index);
        };
        const fileCardProps = {
            ...file,
            previewFile,
            listType,
            onRemove,
            onRetry,
            key: `${name}${index}`,
            showRetry: typeof file.showRetry !== 'undefined' ? file.showRetry : showRetry,
            style: itemStyle,
            disabled,
            showReplace: typeof file.showReplace !== 'undefined' ? file.showReplace : showReplace,
            onReplace,
            onPreviewClick: typeof onPreviewClick !== 'undefined' ? (): void => this.foundation.handlePreviewClick(file) : undefined,
        };

        if (status === strings.FILE_STATUS_UPLOAD_FAIL && !validateMessage) {
            fileCardProps.validateMessage = locale.fail;
        }

        if (_sizeInvalid && !validateMessage) {
            fileCardProps.validateMessage = locale.illegalSize;
        }

        if (typeof renderFileItem === 'undefined') {
            return <FileCard {...fileCardProps} />;
        } else {
            return renderFileItem(fileCardProps);
        }
    };

    renderFileList = (): ReactNode => {
        const { showUploadList, listType, limit, disabled, children } = this.props;
        const { fileList: stateFileList } = this.state;
        const fileList = this.props.fileList || stateFileList;
        const isPicType = listType === strings.FILE_LIST_PIC;
        const showAddTriggerInList = isPicType && (limit ? limit > fileList.length : true);
        const uploadAddCls = cls(`${prefixCls }-add`, {
            [`${prefixCls }-picture-add`]: isPicType,
            [`${prefixCls}-picture-add-disabled`]: disabled
        });
        const addContent = (
            <div className={uploadAddCls} onClick={this.onClick}>
                {children}
            </div>
        );

        if (!showUploadList || !fileList.length) {
            if (showAddTriggerInList) {
                return addContent;
            }
            return null;
        }

        const fileListCls = cls(`${prefixCls }-file-list`, {
            [`${prefixCls }-picture-file-list`]: isPicType,
        });
        const titleCls = `${prefixCls }-file-list-title`;
        const mainCls = `${prefixCls }-file-list-main`;
        const showTitle = limit !== 1 && fileList.length && listType !== strings.FILE_LIST_PIC;
        const showClear = this.props.showClear && !disabled;

        return (
            <LocaleConsumer componentName="Upload">
                {(locale: Locale['Upload']): ReactNode => (
                    <div className={fileListCls}>
                        {showTitle ? (
                            <div className={titleCls}>
                                <span className={`${titleCls }-choosen`}>{locale.selectedFiles}</span>
                                {showClear ? (
                                    <span onClick={this.clear} className={`${titleCls }-clear`}>
                                        {locale.clear}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}

                        <div className={mainCls}>
                            {fileList.map((file, index) => this.renderFile(file, index, locale))}
                            {showAddTriggerInList ? addContent : null}
                        </div>
                    </div>
                )}
            </LocaleConsumer>
        );
    };

    onDrop = (e: DragEvent<HTMLDivElement>): void => {
        this.foundation.handleDrop(e);
    };

    onDragOver = (e: DragEvent<HTMLDivElement>): void => {
        // When a drag element moves within the target element
        this.foundation.handleDragOver(e);
    };

    onDragLeave = (e: DragEvent<HTMLDivElement>): void => {
        this.foundation.handleDragLeave(e);
    };

    onDragEnter = (e: DragEvent<HTMLDivElement>): void => {
        this.foundation.handleDragEnter(e);
    };

    renderDragArea = (): ReactNode => {
        const { dragAreaStatus } = this.state;
        const { children, dragIcon, dragMainText, dragSubText } = this.props;
        const dragAreaBaseCls = `${prefixCls }-drag-area`;
        const dragAreaCls = cls(dragAreaBaseCls, {
            [`${dragAreaBaseCls }-legal`]: dragAreaStatus === strings.DRAG_AREA_LEGAL,
            [`${dragAreaBaseCls }-illegal`]: dragAreaStatus === strings.DRAG_AREA_ILLEGAL,
            [`${dragAreaBaseCls }-custom`]: children,
        });

        return (
            <LocaleConsumer componentName="Upload">
                {(locale: Locale['Upload']): ReactNode => (
                    <div
                        className={dragAreaCls}
                        onDrop={this.onDrop}
                        onDragOver={this.onDragOver}
                        onDragLeave={this.onDragLeave}
                        onDragEnter={this.onDragEnter}
                        onClick={this.onClick}
                    >
                        {children ? (
                            children
                        ) : (
                            <>
                                <div className={`${dragAreaBaseCls }-icon`}>
                                    {dragIcon || <IconUpload size="extra-large" />}
                                </div>
                                <div className={`${dragAreaBaseCls }-text`}>
                                    <div className={`${dragAreaBaseCls }-main-text`}>
                                        {dragMainText || locale.mainText}
                                    </div>
                                    <div className={`${dragAreaBaseCls }-sub-text`}>{dragSubText}</div>
                                    <div className={`${dragAreaBaseCls }-tips`}>
                                        {dragAreaStatus === strings.DRAG_AREA_LEGAL && (
                                            <span className={`${dragAreaBaseCls }-tips-legal`}>{locale.legalTips}</span>
                                        )}
                                        {dragAreaStatus === strings.DRAG_AREA_ILLEGAL && (
                                            <span className={`${dragAreaBaseCls }-tips-illegal`}>
                                                {locale.illegalTips}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </LocaleConsumer>
        );
    };

    render(): ReactNode {
        const {
            style,
            className,
            multiple,
            accept,
            disabled,
            children,
            capture,
            listType,
            prompt,
            promptPosition,
            draggable,
            validateMessage,
            validateStatus,
            directory,
        } = this.props;
        const uploadCls = cls(prefixCls, {
            [`${prefixCls }-picture`]: listType === strings.FILE_LIST_PIC,
            [`${prefixCls }-disabled`]: disabled,
            [`${prefixCls }-default`]: validateStatus === 'default',
            [`${prefixCls }-error`]: validateStatus === 'error',
            [`${prefixCls }-warning`]: validateStatus === 'warning',
            [`${prefixCls }-success`]: validateStatus === 'success',
        }, className);
        const uploadAddCls = cls(`${prefixCls }-add`);
        const inputCls = cls(`${prefixCls }-hidden-input`);
        const inputReplaceCls = cls(`${prefixCls }-hidden-input-replace`);
        const promptCls = cls(`${prefixCls }-prompt`);
        const validateMsgCls = cls(`${prefixCls }-validate-message`);

        const dirProps = directory ? { directory: 'directory', webkitdirectory: 'webkitdirectory' } : {};

        const addContent =
            listType !== strings.FILE_LIST_PIC ? (
                <div className={uploadAddCls} onClick={this.onClick}>
                    {children}
                </div>
            ) : null;
        return (
            <div className={uploadCls} style={style} x-prompt-pos={promptPosition}>
                <input
                    key={this.state.inputKey}
                    capture={capture}
                    multiple={multiple}
                    accept={accept}
                    onChange={this.onChange}
                    type="file"
                    autoComplete="off"
                    tabIndex={-1}
                    className={inputCls}
                    ref={this.inputRef}
                    {...dirProps}
                />
                <input
                    key={this.state.replaceInputKey}
                    multiple={false}
                    accept={accept}
                    onChange={this.onReplaceChange}
                    type="file"
                    autoComplete="off"
                    tabIndex={-1}
                    className={inputReplaceCls}
                    ref={this.replaceInputRef}
                />
                {draggable ? this.renderDragArea() : addContent}
                {prompt ? <div className={promptCls}>{prompt}</div> : null}

                {validateMessage ? <div className={validateMsgCls}>{validateMessage}</div> : null}
                {this.renderFileList()}
            </div>
        );
    }
}

export default Upload;
