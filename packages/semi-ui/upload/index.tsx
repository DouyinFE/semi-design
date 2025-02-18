import React, { ReactNode, CSSProperties, RefObject, ChangeEvent, DragEvent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { noop, pick } from 'lodash';
import UploadFoundation from '@douyinfe/semi-foundation/upload/foundation';
import { strings, cssClasses } from '@douyinfe/semi-foundation/upload/constants';
import FileCard from './fileCard';
import BaseComponent from '../_base/baseComponent';
import LocaleConsumer from '../locale/localeConsumer';
import { IconUpload } from '@douyinfe/semi-icons';
import type {
    FileItem,
    RenderFileItemProps,
    UploadListType,
    PromptPositionType,
    BeforeUploadProps,
    AfterUploadProps,
    OnChangeProps,
    customRequestArgs,
    CustomError,
    RenderPictureCloseProps,
} from './interface';
import { Locale } from '../locale/interface';
import '@douyinfe/semi-foundation/upload/upload.scss';

import type {
    CustomFile,
    UploadAdapter,
    BeforeUploadObjectResult,
    AfterUploadResult,
    FileItemStatus
} from '@douyinfe/semi-foundation/upload/foundation';
import type { ValidateStatus } from '../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;

export type {
    FileItem,
    FileItemStatus,
    RenderFileItemProps,
    UploadListType,
    PromptPositionType,
    BeforeUploadProps,
    AfterUploadProps,
    OnChangeProps,
    customRequestArgs,
    CustomError,
    BeforeUploadObjectResult,
    AfterUploadResult,
};

export interface UploadProps {
    accept?: string;
    action: string;
    afterUpload?: (object: AfterUploadProps) => AfterUploadResult;
    beforeUpload?: (
        object: BeforeUploadProps
    ) => BeforeUploadObjectResult | Promise<BeforeUploadObjectResult> | boolean;
    beforeClear?: (fileList: Array<FileItem>) => boolean | Promise<boolean>;
    beforeRemove?: (file: FileItem, fileList: Array<FileItem>) => boolean | Promise<boolean>;
    capture?: boolean | 'user' | 'environment' | undefined;
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
    addOnPasting?: boolean;
    fileList?: Array<FileItem>;
    fileName?: string;
    headers?: Record<string, any> | ((file: File) => Record<string, string>);
    hotSpotLocation?: 'start' | 'end';
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
    onPastingError?: (error: Error | PermissionStatus) => void;
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
    picHeight?: string | number;
    picWidth?: string | number;
    renderFileItem?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    renderPicInfo?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    renderThumbnail?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    renderPicPreviewIcon?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    renderPicClose?: (renderPicCloseProps: RenderPictureCloseProps) => ReactNode;
    renderFileOperation?: (fileItem: RenderFileItemProps) => ReactNode;
    showClear?: boolean;
    showPicInfo?: boolean; // Show pic info in picture wall
    showReplace?: boolean; // Display replacement function
    showRetry?: boolean;
    showUploadList?: boolean;
    style?: CSSProperties;
    timeout?: number;
    transformFile?: (file: File) => FileItem;
    uploadTrigger?: 'auto' | 'custom';
    validateMessage?: ReactNode;
    validateStatus?: ValidateStatus;
    withCredentials?: boolean
}

export interface UploadState {
    dragAreaStatus: 'default' | 'legal' | 'illegal'; // Status of the drag zone
    fileList: Array<FileItem>;
    inputKey: number;
    localUrls: Array<string>;
    replaceIdx: number;
    replaceInputKey: number
}

class Upload extends BaseComponent<UploadProps, UploadState> {
    static propTypes = {
        accept: PropTypes.string, // Limit allowed file types
        action: PropTypes.string.isRequired,
        addOnPasting: PropTypes.bool,
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
        hotSpotLocation: PropTypes.oneOf(['start', 'end']),
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
        onPastingError: PropTypes.func,
        previewFile: PropTypes.func, // Custom preview
        prompt: PropTypes.node,
        promptPosition: PropTypes.oneOf<UploadProps['promptPosition']>(strings.PROMPT_POSITION),
        picWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        picHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        renderFileItem: PropTypes.func,
        renderPicPreviewIcon: PropTypes.func,
        renderFileOperation: PropTypes.func,
        renderPicClose: PropTypes.func,
        renderPicInfo: PropTypes.func,
        renderThumbnail: PropTypes.func,
        showClear: PropTypes.bool,
        showPicInfo: PropTypes.bool,
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
        hotSpotLocation: 'end',
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
        onPastingError: noop,
        promptPosition: 'right' as const,
        showClear: true,
        showPicInfo: false,
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

    /**
     * Notes: 
     *   The input parameter and return value here do not declare the type, otherwise tsc may report an error in form/fields.tsx when wrap after withField
     *   `The types of the parameters "props" and "nextProps" are incompatible.
           The attribute "action" is missing in the type "Readonly<any>", but it is required in the type "UploadProps".`
     *   which seems to be a bug, remove props type declare here
     */
    static getDerivedStateFromProps(props) {
        const { fileList } = props;
        if ('fileList' in props) {
            return {
                fileList: fileList || [],
            };
        }
        return null;
    }

    get adapter(): UploadAdapter<UploadProps, UploadState> {
        return {
            ...super.adapter,
            notifyFileSelect: (files): void => this.props.onFileChange(files),
            notifyError: (error, fileInstance, fileList, xhr): void =>
                this.props.onError(error, fileInstance, fileList, xhr),
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
            notifyBeforeUpload: ({
                file,
                fileList,
            }): boolean | BeforeUploadObjectResult | Promise<BeforeUploadObjectResult> =>
                this.props.beforeUpload({ file, fileList }),
            notifyAfterUpload: ({ response, file, fileList }): AfterUploadResult =>
                this.props.afterUpload({ response, file, fileList }),
            resetInput: (): void => {
                this.setState(prevState => ({
                    inputKey: Math.random(),
                }));
            },
            resetReplaceInput: (): void => {
                this.setState(prevState => ({
                    replaceInputKey: Math.random(),
                }));
            },
            isMac: (): boolean => {
                return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            },
            registerPastingHandler: (cb?: (e: KeyboardEvent) => void): void => {
                document.body.addEventListener('keydown', cb);
                this.pastingCb = cb;
            },
            unRegisterPastingHandler: (): void => {
                if (this.pastingCb) {
                    document.body.removeEventListener('keydown', this.pastingCb);
                }
            },
            notifyPastingError: (error): void => this.props.onPastingError(error),
            updateDragAreaStatus: (dragAreaStatus: string): void =>
                this.setState({ dragAreaStatus } as { dragAreaStatus: 'default' | 'legal' | 'illegal' }),
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
    pastingCb: null | ((params: any) => void);

    componentDidMount(): void {
        this.foundation.init();
    }

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

    /**
     * ref method
     * insert files at index
     * @param files Array<CustomFile>
     * @param index number
     * @returns
     */
    insert = (files: Array<CustomFile>, index?: number): void => {
        return this.foundation.insertFileToList(files, index);
    };

    /**
     * ref method
     * manual upload by user
     */
    upload = (): void => {
        this.foundation.manualUpload();
    };

    /**
     * ref method
     * manual open file select dialog
     */
    openFileDialog = (): void => {
        this.onClick();
    };

    renderFile = (file: FileItem, index: number, locale: Locale['Upload']): ReactNode => {
        const { name, status, validateMessage, _sizeInvalid, uid } = file;
        const {
            previewFile,
            listType,
            itemStyle,
            showPicInfo,
            renderPicInfo,
            renderPicClose,
            renderPicPreviewIcon,
            renderFileOperation,
            renderFileItem,
            renderThumbnail,
            disabled,
            onPreviewClick,
            picWidth,
            picHeight,
        } = this.props;
        const onRemove = (): void => this.remove(file);
        const onRetry = (): void => {
            this.foundation.retry(file);
        };
        const onReplace = (): void => {
            this.replace(index);
        };
        const fileCardProps = {
            ...pick(this.props, ['showRetry', 'showReplace', '']),
            ...file,
            previewFile,
            listType,
            onRemove,
            onRetry,
            index,
            key: uid || `${name}${index}`,
            style: itemStyle,
            disabled,
            showPicInfo,
            renderPicInfo,
            renderPicPreviewIcon,
            renderPicClose,
            renderFileOperation,
            renderThumbnail,
            onReplace,
            onPreviewClick:
                typeof onPreviewClick !== 'undefined'
                    ? (): void => this.foundation.handlePreviewClick(file)
                    : undefined,
            picWidth,
            picHeight
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
        const { listType } = this.props;
        if (listType === strings.FILE_LIST_PIC) {
            return this.renderFileListPic();
        }

        if (listType === strings.FILE_LIST_DEFAULT) {
            return this.renderFileListDefault();
        }

        return null;
    };

    renderFileListPic = () => {
        const { showUploadList, limit, disabled, children, draggable, hotSpotLocation, picHeight, picWidth } = this.props;
        const { fileList: stateFileList, dragAreaStatus } = this.state;
        const fileList = this.props.fileList || stateFileList;
        const showAddTriggerInList = limit ? limit > fileList.length : true;
        const dragAreaBaseCls = `${prefixCls}-drag-area`;
        const uploadAddCls = cls(`${prefixCls}-add`, {
            [`${prefixCls}-picture-add`]: true,
            [`${prefixCls}-picture-add-disabled`]: disabled,
        });
        const fileListCls = cls(`${prefixCls}-file-list`, {
            [`${prefixCls}-picture-file-list`]: true,
        });
        const dragAreaCls = cls({
            [`${dragAreaBaseCls}-legal`]: dragAreaStatus === strings.DRAG_AREA_LEGAL,
            [`${dragAreaBaseCls}-illegal`]: dragAreaStatus === strings.DRAG_AREA_ILLEGAL,
        });
        const mainCls = `${prefixCls}-file-list-main`;
        const addContentProps = {
            role: 'button',
            className: uploadAddCls,
            onClick: this.onClick,
            style: {
                height: picHeight,
                width: picWidth
            }
        };
        const containerProps = {
            className: fileListCls,
        };
        const draggableProps = {
            onDrop: this.onDrop,
            onDragOver: this.onDragOver,
            onDragLeave: this.onDragLeave,
            onDragEnter: this.onDragEnter,
        };
        if (draggable) {
            Object.assign(addContentProps, draggableProps, { className: cls(uploadAddCls, dragAreaCls) });
        }
        const addContent = (
            <div {...addContentProps} x-semi-prop="children">
                {children}
            </div>
        );

        if (!showUploadList || !fileList.length) {
            if (showAddTriggerInList) {
                return addContent;
            }
            return null;
        }

        return (
            <LocaleConsumer componentName="Upload">
                {(locale: Locale['Upload']) => (
                    <div {...containerProps}>
                        <div className={mainCls} role="list" aria-label="picture list">
                            {showAddTriggerInList && hotSpotLocation === 'start' ? addContent : null}
                            {fileList.map((file, index) => this.renderFile(file, index, locale))}
                            {showAddTriggerInList && hotSpotLocation === 'end' ? addContent : null}
                        </div>
                    </div>
                )}
            </LocaleConsumer>
        );
    };

    renderFileListDefault = () => {
        const { showUploadList, limit, disabled } = this.props;
        const { fileList: stateFileList } = this.state;
        const fileList = this.props.fileList || stateFileList;
        const fileListCls = cls(`${prefixCls}-file-list`);
        const titleCls = `${prefixCls}-file-list-title`;
        const mainCls = `${prefixCls}-file-list-main`;
        const showTitle = limit !== 1 && fileList.length;
        const showClear = this.props.showClear && !disabled;
        const containerProps = {
            className: fileListCls,
        };

        if (!showUploadList || !fileList.length) {
            return null;
        }

        return (
            <LocaleConsumer componentName="Upload">
                {(locale: Locale['Upload']) => (
                    <div {...containerProps}>
                        {showTitle ? (
                            <div className={titleCls}>
                                <span className={`${titleCls}-choosen`}>{locale.selectedFiles}</span>
                                {showClear ? (
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={this.clear}
                                        className={`${titleCls}-clear`}
                                    >
                                        {locale.clear}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}

                        <div className={mainCls} role="list" aria-label="file list">
                            {fileList.map((file, index) => this.renderFile(file, index, locale))}
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

    renderAddContent = () => {
        const { draggable, children, listType, disabled } = this.props;
        const uploadAddCls = cls(`${prefixCls}-add`);
        if (listType === strings.FILE_LIST_PIC) {
            return null;
        }
        if (draggable) {
            return this.renderDragArea();
        }
        return (
            <div role="button" tabIndex={0} aria-disabled={disabled} className={uploadAddCls} onClick={this.onClick}>
                {children}
            </div>
        );
    };

    renderDragArea = (): ReactNode => {
        const { dragAreaStatus } = this.state;
        const { children, dragIcon, dragMainText, dragSubText, disabled } = this.props;
        const dragAreaBaseCls = `${prefixCls}-drag-area`;
        const dragAreaCls = cls(dragAreaBaseCls, {
            [`${dragAreaBaseCls}-legal`]: dragAreaStatus === strings.DRAG_AREA_LEGAL,
            [`${dragAreaBaseCls}-illegal`]: dragAreaStatus === strings.DRAG_AREA_ILLEGAL,
            [`${dragAreaBaseCls}-custom`]: children,
        });

        return (
            <LocaleConsumer componentName="Upload">
                {(locale: Locale['Upload']): ReactNode => (
                    <div
                        role="button"
                        tabIndex={0}
                        aria-disabled={disabled}
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
                                <div className={`${dragAreaBaseCls}-icon`} x-semi-prop="dragIcon">
                                    {dragIcon || <IconUpload size="extra-large" />}
                                </div>
                                <div className={`${dragAreaBaseCls}-text`}>
                                    <div className={`${dragAreaBaseCls}-main-text`} x-semi-prop="dragMainText">
                                        {dragMainText || locale.mainText}
                                    </div>
                                    <div className={`${dragAreaBaseCls}-sub-text`} x-semi-prop="dragSubText">
                                        {dragSubText}
                                    </div>
                                    <div className={`${dragAreaBaseCls}-tips`}>
                                        {dragAreaStatus === strings.DRAG_AREA_LEGAL && (
                                            <span className={`${dragAreaBaseCls}-tips-legal`}>{locale.legalTips}</span>
                                        )}
                                        {dragAreaStatus === strings.DRAG_AREA_ILLEGAL && (
                                            <span className={`${dragAreaBaseCls}-tips-illegal`}>
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
            ...rest
        } = this.props;
        const uploadCls = cls(
            prefixCls,
            {
                [`${prefixCls}-picture`]: listType === strings.FILE_LIST_PIC,
                [`${prefixCls}-disabled`]: disabled,
                [`${prefixCls}-default`]: validateStatus === 'default',
                [`${prefixCls}-error`]: validateStatus === 'error',
                [`${prefixCls}-warning`]: validateStatus === 'warning',
                [`${prefixCls}-success`]: validateStatus === 'success',
            },
            className
        );
        const inputCls = cls(`${prefixCls}-hidden-input`);
        const inputReplaceCls = cls(`${prefixCls}-hidden-input-replace`);
        const promptCls = cls(`${prefixCls}-prompt`);
        const validateMsgCls = cls(`${prefixCls}-validate-message`);

        const dirProps = directory ? { directory: 'directory', webkitdirectory: 'webkitdirectory' } : {};

        return (
            <div className={uploadCls} style={style} x-prompt-pos={promptPosition} {...this.getDataAttr(rest)}>
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
                {this.renderAddContent()}
                {prompt ? (
                    <div className={promptCls} x-semi-prop="prompt">
                        {prompt}
                    </div>
                ) : null}

                {validateMessage ? (
                    <div className={validateMsgCls} x-semi-prop="validateMessage">
                        {validateMessage}
                    </div>
                ) : null}
                {this.renderFileList()}
            </div>
        );
    }
}
export default Upload;
