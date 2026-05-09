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
import Cropper from '../cropper';
import Modal, { type ModalReactProps } from '../modal';
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
    RenderFileListTitleProps,
    CropProps,
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
import { ShowTooltip } from '../typography';

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
    RenderFileListTitleProps,
    CropProps,
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
    onError?: (e: CustomError, file: CustomFile, fileList: Array<FileItem>, xhr: XMLHttpRequest) => void;
    onPastingError?: (error: Error | PermissionStatus) => void;
    onExceed?: (fileList: Array<File>) => void;
    onFileChange?: (files: Array<File>) => void;
    onOpenFileDialog?: () => void;
    onPreviewClick?: (fileItem: FileItem) => void;
    onProgress?: (percent: number, file: CustomFile, fileList: Array<FileItem>) => void;
    onRemove?: (currentFile: CustomFile, fileList: Array<FileItem>, currentFileItem: FileItem) => void;
    onRetry?: (fileItem: FileItem) => void;
    onSizeError?: (file: CustomFile, fileList: Array<FileItem>) => void;
    onSuccess?: (responseBody: any, file: CustomFile, fileList: Array<FileItem>) => void;
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
    fileListTitle?: ReactNode | ((props: RenderFileListTitleProps) => ReactNode);
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
    withCredentials?: boolean;
    showTooltip?: boolean | ShowTooltip;
    /** 启用图片裁切功能，可传入裁切配置对象 */
    crop?: boolean | CropProps;
    /** 裁切前的回调，返回 false 可阻止裁切 */
    beforeCrop?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
    /** 裁切失败的回调 */
    onCropError?: (error: Error) => void;
    /** 自定义裁切弹窗属性 */
    cropModalProps?: ModalReactProps;
}

export interface UploadState {
    dragAreaStatus: 'default' | 'legal' | 'illegal'; // Status of the drag zone
    fileList: Array<FileItem>;
    inputKey: number;
    // Track objectURL created by Upload (legacy, kept for compatibility)
    localUrls: Array<string>;
    replaceIdx: number;
    replaceInputKey: number;
    // Cropper state
    cropperVisible: boolean;
    cropperFile: File | null;
    cropperSrc: string;
    pendingFiles: File[];
    isReplaceOperation: boolean; // Flag to indicate if this is a replace operation
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
        fileListTitle: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
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
        showTooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        crop: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        beforeCrop: PropTypes.func,
        onCropError: PropTypes.func,
        cropModalProps: PropTypes.object,
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
        showTooltip: true,
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
            // Cropper state
            cropperVisible: false,
            cropperFile: null,
            cropperSrc: '',
            pendingFiles: [],
            isReplaceOperation: false,
        };
        this.foundation = new UploadFoundation(this.adapter);
        this.inputRef = React.createRef<HTMLInputElement>();
        this.replaceInputRef = React.createRef<HTMLInputElement>();
        this.cropperRef = React.createRef<Cropper>();
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
            registerPastingHandler: (cb?: (e: KeyboardEvent | ClipboardEvent) => void): void => {
                // Wrap the callback to intercept cropping
                const wrappedCb = (e: KeyboardEvent | ClipboardEvent) => {
                    const { crop } = this.props;
                    
                    // Handle keydown event (Ctrl/Cmd+V) with crop interception
                    if (crop && e.type === 'keydown' && 'code' in e) {
                        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                        const isCombineKeydown = isMac ? e.metaKey : e.ctrlKey;
                        
                        if (isCombineKeydown && e.code === 'KeyV') {
                            // Check if navigator.clipboard is available
                            if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
                                const permissionName = 'clipboard-read' as PermissionName;
                                navigator.permissions
                                    .query({ name: permissionName })
                                    .then(result => {
                                        if (result.state === 'granted' || result.state === 'prompt') {
                                            navigator.clipboard.read().then(clipboardItems => {
                                                const files: File[] = [];
                                                const processClipboardItems = async () => {
                                                    for (const clipboardItem of clipboardItems) {
                                                        for (const type of clipboardItem.types) {
                                                            if (type.startsWith('image')) {
                                                                const blob = await clipboardItem.getType(type);
                                                                const buffer = await blob.arrayBuffer();
                                                                const format = type.split('/')[1];
                                                                const file = new File([buffer], `paste.${format}`, { type });
                                                                files.push(file);
                                                            }
                                                        }
                                                    }
                                                    
                                                    if (files.length > 0) {
                                                        const imageFiles = files.filter(file => this.isImageFile(file));
                                                        
                                                        if (imageFiles.length > 0) {
                                                            // Start cropping
                                                            this.handleCropFiles(files);
                                                        } else {
                                                            // No images, let foundation handle it
                                                            this.foundation.handleChange(files);
                                                        }
                                                    }
                                                };
                                                processClipboardItems();
                                            }).catch(error => {
                                                this.props.onPastingError(error);
                                            });
                                        }
                                    })
                                    .catch(error => {
                                        this.props.onPastingError(error);
                                    });
                                // Don't call original callback, we've handled it
                                return;
                            }
                        }
                    }
                    
                    // Otherwise, call original callback
                    cb?.(e);
                };
                
                document.body.addEventListener('keydown', wrappedCb);
                this.pastingCb = wrappedCb;
            },
            unRegisterPastingHandler: (): void => {
                if (this.pastingCb) {
                    document.body.removeEventListener('keydown', this.pastingCb);
                }
            },
            registerPasteEventHandler: (cb?: (e: ClipboardEvent) => void): void => {
                // Wrap the callback to intercept cropping
                const wrappedCb = (e: ClipboardEvent) => {
                    const { crop } = this.props;
                    
                    // If crop is enabled and this is a paste event with files
                    if (crop && e.clipboardData && e.clipboardData.items) {
                        const items = e.clipboardData.items;
                        const files: File[] = [];
                        
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            if (item.kind === 'file') {
                                const file = item.getAsFile();
                                if (file) {
                                    files.push(file);
                                }
                            }
                        }
                        
                        if (files.length > 0) {
                            const imageFiles = files.filter(file => this.isImageFile(file));
                            
                            if (imageFiles.length > 0) {
                                // Intercept and start cropping
                                e.preventDefault();
                                this.handleCropFiles(files);
                                return;
                            }
                        }
                    }
                    
                    // Otherwise, call original callback
                    cb?.(e);
                };
                
                document.body.addEventListener('paste', wrappedCb);
                this.pasteEventCb = wrappedCb;
            },
            unRegisterPasteEventHandler: (): void => {
                if (this.pasteEventCb) {
                    document.body.removeEventListener('paste', this.pasteEventCb);
                }
            },
            notifyPastingError: (error): void => this.props.onPastingError(error),
            updateDragAreaStatus: (dragAreaStatus: string): void =>
                this.setState({ dragAreaStatus } as { dragAreaStatus: 'default' | 'legal' | 'illegal' }),
            notifyChange: ({ currentFile, fileList }): void => this.props.onChange({ currentFile, fileList }),
            updateLocalUrls: (urls: Array<string>): void => this.setState({ localUrls: urls }),
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
    cropperRef: RefObject<Cropper> = null;
    pastingCb: null | ((params: any) => void) = null;
    pasteEventCb: null | ((params: any) => void) = null;

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
        const { crop } = this.props;
        
        if (crop && files && files.length > 0) {
            // Check if any files are images that need cropping
            const imageFiles = Array.from(files).filter(file => this.isImageFile(file));
            
            if (imageFiles.length > 0) {
                // Start cropping process
                this.handleCropFiles(Array.from(files));
                return;
            }
        }
        
        this.foundation.handleChange(files);
    };

    /**
     * Check if file is an image
     */
    isImageFile = (file: File): boolean => {
        return file.type.startsWith('image/');
    };

    /**
     * Handle files that may need cropping
     * Note: Currently only processes the first image file for cropping.
     * Multiple image cropping can be extended in the future if needed.
     */
    handleCropFiles = async (files: File[]): Promise<void> => {
        const { beforeCrop, onCropError } = this.props;
        
        // Filter image files that need cropping
        const imageFiles = files.filter(file => this.isImageFile(file));
        const nonImageFiles = files.filter(file => !this.isImageFile(file));
        
        // Check beforeCrop hook
        if (beforeCrop) {
            try {
                const shouldCrop = await beforeCrop(imageFiles[0], files);
                if (shouldCrop === false) {
                    // Skip cropping, process files directly
                    this.foundation.handleChange(files);
                    return;
                }
            } catch (error) {
                // If beforeCrop throws, fallback to normal upload flow to avoid blocking user
                console.error('beforeCrop error:', error);
                onCropError?.(error as Error);
                this.foundation.handleChange(files);
                return;
            }
        }
        
        // Store all files for later processing
        // Currently only the first image is cropped.
        // Other selected files (including additional images) will be uploaded without cropping.
        if (imageFiles.length > 0) {
            const restFiles = [...imageFiles.slice(1), ...nonImageFiles];
            this.setState({
                cropperVisible: true,
                cropperFile: imageFiles[0],
                cropperSrc: URL.createObjectURL(imageFiles[0]),
                pendingFiles: restFiles,
                isReplaceOperation: false,
            });
        } else {
            // No images to crop, process directly
            this.foundation.handleChange(files);
        }
    };

    /**
     * Handle crop confirmation
     */
    handleCropOk = async (): Promise<void> => {
        const { cropperFile, pendingFiles, isReplaceOperation } = this.state;
        const { crop, onCropError } = this.props;
        
        try {
            // Get cropped canvas
            const cropperInstance = this.cropperRef.current;
            if (!cropperInstance) {
                throw new Error('Cropper instance not found');
            }
            
            const canvas = cropperInstance.getCropperCanvas();
            
            // Convert canvas to blob
            const cropConfig = typeof crop === 'object' ? crop : {};
            const quality = cropConfig.quality ?? 0.92;
            const type = cropperFile?.type || 'image/png';
            
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (b) => {
                        if (b) {
                            resolve(b);
                        } else {
                            reject(new Error('Failed to create blob'));
                        }
                    },
                    type,
                    quality
                );
            });
            
            // Create new File from blob
            const croppedFile = new File([blob], cropperFile?.name || 'cropped-image.png', {
                type,
                lastModified: Date.now(),
            });
            
            // Close cropper and clean up
            this.handleCropCancel();
            
            // Process files based on operation type
            if (isReplaceOperation) {
                // For replace operation, only pass the cropped file
                this.foundation.handleReplaceChange([croppedFile]);
            } else {
                // For normal upload, combine cropped file with other pending files
                const allFiles = [croppedFile, ...pendingFiles];
                this.foundation.handleChange(allFiles as any);
            }
            
        } catch (error) {
            console.error('Crop error:', error);
            if (onCropError) {
                onCropError(error as Error);
            }
        }
    };

    /**
     * Handle crop cancellation
     */
    handleCropCancel = (): void => {
        const { cropperSrc } = this.state;
        
        // Revoke object URL
        if (cropperSrc) {
            URL.revokeObjectURL(cropperSrc);
        }
        
        this.setState({
            cropperVisible: false,
            cropperFile: null,
            cropperSrc: '',
            pendingFiles: [],
            isReplaceOperation: false,
            // Reset input so selecting the same file again can trigger onChange
            inputKey: Math.random(),
        });
    };

    replace = (index: number): void => {
        this.setState({ replaceIdx: index }, () => {
            this.replaceInputRef.current.click();
        });
    };

    onReplaceChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { files } = e.target;
        const { crop } = this.props;

        if (crop && files && files.length > 0) {
            const imageFiles = Array.from(files).filter(file => this.isImageFile(file));

            if (imageFiles.length > 0) {
                // For replace, we need to handle cropping specially
                // Store the replace context so we can replace after cropping
                this.setState({
                    replaceIdx: this.state.replaceIdx,
                });
                // Start cropping process - handleCropFiles will eventually call foundation.handleChange
                // But we need a different flow for replace...
                // Actually, we should handle replace differently
                this.handleReplaceCropFiles(Array.from(files));
                return;
            }
        }

        this.foundation.handleReplaceChange(files);
    };

    /**
     * Handle files that need cropping for replace operation
     */
    handleReplaceCropFiles = async (files: File[]): Promise<void> => {
        const { beforeCrop, onCropError } = this.props;
        const { replaceIdx } = this.state;

        const imageFiles = files.filter(file => this.isImageFile(file));

        // Check beforeCrop hook
        if (beforeCrop) {
            try {
                const shouldCrop = await beforeCrop(imageFiles[0], files);
                if (shouldCrop === false) {
                    // Skip cropping, process replace directly
                    this.foundation.handleReplaceChange(files);
                    return;
                }
            } catch (error) {
                // If beforeCrop throws, fallback to normal replace flow
                console.error('beforeCrop error:', error);
                onCropError?.(error as Error);
                this.foundation.handleReplaceChange(files);
                return;
            }
        }

        // For replace, only first image is processed
        if (imageFiles.length > 0) {
            this.setState({
                cropperVisible: true,
                cropperFile: imageFiles[0],
                cropperSrc: URL.createObjectURL(imageFiles[0]),
                pendingFiles: [], // No pending files for replace
                isReplaceOperation: true,
            });
        } else {
            // No images to crop, process replace directly
            this.foundation.handleReplaceChange(files);
        }
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
            showTooltip,
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
            picHeight,
            showTooltip,
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
        const { showUploadList, limit, disabled, fileListTitle } = this.props;
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
                {(locale: Locale['Upload']) => {
                    let titleContent: ReactNode;
                    
                    if (typeof fileListTitle === 'function') {
                        // 函数形式：用户完全控制标题区域
                        titleContent = fileListTitle({
                            fileList,
                            onClear: this.clear,
                            clearText: locale.clear,
                        });
                    } else {
                        // ReactNode 或默认值：显示标题文字和清空按钮
                        titleContent = (
                            <>
                                <span className={`${titleCls}-choosen`}>{fileListTitle || locale.selectedFiles}</span>
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
                            </>
                        );
                    }
                    
                    return (
                        <div {...containerProps}>
                            {showTitle ? (
                                <div className={titleCls}>
                                    {titleContent}
                                </div>
                            ) : null}

                            <div className={mainCls} role="list" aria-label="file list">
                                {fileList.map((file, index) => this.renderFile(file, index, locale))}
                            </div>
                        </div>
                    );
                }}
            </LocaleConsumer>
        );
    };

    onDrop = (e: DragEvent<HTMLDivElement>): void => {
        // Block file opening in browser
        e.preventDefault();
        e.stopPropagation();
        
        const { crop, directory, disabled } = this.props;
        const fileList = this.state.fileList.slice();
        
        // If disabled, do nothing
        if (disabled) {
            return;
        }
        
        // If directory upload, delegate to foundation (folder upload doesn't support cropping)
        if (directory) {
            this.foundation.handleDrop(e);
            return;
        }
        
        const files = Array.from(e.dataTransfer.files);
        
        // If crop is enabled and there are image files, intercept for cropping
        if (crop && files.length > 0) {
            const imageFiles = files.filter(file => this.isImageFile(file));
            
            if (imageFiles.length > 0) {
                // Update drag area status
                this.setState({ dragAreaStatus: 'default' as const });
                // Notify drop callback
                // Use nativeEvent to match public API typing: onDrop(e: Event, ...)
                // React DragEvent is not assignable to DOM Event in TS.
                const eventForCb: Event = (e as any).nativeEvent || (e as any);
                this.props.onDrop(eventForCb, files, fileList);
                // Start cropping process
                this.handleCropFiles(files);
                return;
            }
        }
        
        // Fall back to foundation's default handling
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

    renderCropperModal = (): ReactNode => {
        const { cropperVisible, cropperSrc } = this.state;
        const { crop, cropModalProps } = this.props;
        const cropConfig = typeof crop === 'object' ? crop : {};
        const {
            style: modalStyle,
            bodyStyle: modalBodyStyle,
            ...restModalProps
        } = (cropModalProps || {}) as ModalReactProps;
        
        return (
            <LocaleConsumer componentName="Upload">
                {(locale: Locale['Upload']) => {
                    const modalTitle = cropConfig.modalTitle || locale.cropTitle || '裁切图片';
                    const modalOkText = cropConfig.modalOkText || locale.cropOk || '确定';
                    const modalCancelText = cropConfig.modalCancelText || locale.cropCancel || '取消';
                    
                    return (
                        <Modal
                            {...restModalProps}
                            width={600}
                            title={modalTitle}
                            visible={cropperVisible}
                            onOk={this.handleCropOk}
                            onCancel={this.handleCropCancel}
                            okText={modalOkText}
                            cancelText={modalCancelText}
                            style={{ height: 500, ...(modalStyle || {}) }}
                            bodyStyle={{ height: 400, ...(modalBodyStyle || {}) }}
                        >
                            {cropperSrc && (
                                <Cropper
                                    ref={this.cropperRef}
                                    src={cropperSrc}
                                    shape={cropConfig.shape || 'rect'}
                                    aspectRatio={cropConfig.aspectRatio}
                                    minZoom={cropConfig.minZoom}
                                    maxZoom={cropConfig.maxZoom}
                                    zoomStep={cropConfig.zoomStep}
                                    fill={cropConfig.fill}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            )}
                        </Modal>
                    );
                }}
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
                {this.renderCropperModal()}
            </div>
        );
    }
}
export default Upload;
