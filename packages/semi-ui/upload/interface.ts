import { ReactNode, CSSProperties, MouseEvent } from 'react';
import { BaseFileItem } from '@douyinfe/semi-foundation/upload/foundation';
import { strings } from '@douyinfe/semi-foundation/upload/constants';
import { ArrayElement } from '../_base/base';
// keep imports minimal; Upload crop modal props type is declared in Upload component

export type PromptPositionType = ArrayElement<typeof strings.PROMPT_POSITION>;
export type UploadListType = ArrayElement<typeof strings.LIST_TYPE>;

export interface BeforeUploadProps {
    file: FileItem;
    fileList: Array<FileItem>
}

export interface AfterUploadProps {
    file: FileItem;
    fileList: Array<FileItem>;
    response: any
}

export interface OnChangeProps {
    fileList: Array<FileItem>;
    currentFile: FileItem
}

export interface customRequestArgs {
    fileName: string; // Current file name
    data: Record<string, any>; // User-set props.data
    file: FileItem;
    fileInstance: File; // Original File Object which extends to the blob, the file object actually acquired by the browser (https://developer.mozilla.org/zh-CN/docs/Web/API/File)
    onProgress: (e?: { total: number; loaded: number }) => any; // The function that should be called during the upload process, the event needs to contain the total and loaded attributes
    onError: (userXhr: { status?: number }, e?: Event) => any; // Functions to call in case of upload error
    onSuccess: (response: any, e?: Event) => any; // The function that should be called after the upload is successful, the response is the request result after the upload is successful
    withCredentials: boolean; // User-set props.with Credentials
    action: string // User-set props.action
}

export interface CustomError extends Error {
    status: number;
    method: string;
    url: string
}

export interface FileItem extends BaseFileItem {
    validateMessage?: ReactNode
}

export interface RenderFileItemProps extends FileItem {
    index?: number;
    previewFile?: (fileItem: RenderFileItemProps) => ReactNode;
    listType: UploadListType;
    onRemove: () => void;
    onRetry: () => void;
    onReplace: () => void;
    key: string;
    showPicInfo?: boolean;
    renderPicInfo?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    renderPicPreviewIcon?: (renderFileItemProps: RenderFileItemProps) => ReactNode;
    renderFileOperation?: (fileItem: RenderFileItemProps) => ReactNode;
    showRetry?: boolean;
    showReplace?: boolean;
    style?: CSSProperties;
    disabled: boolean;
    onPreviewClick: () => void
}

export interface RenderPictureCloseProps {
    className: string;
    remove: (e: MouseEvent) => void
}

export interface RenderFileListTitleProps {
    fileList: Array<FileItem>;
    onClear: () => void;
    clearText: string
}

export interface CropProps {
    /** Crop box aspect ratio (width / height), e.g. 16/9, 1, 4/3 */
    aspectRatio?: number;
    /** Crop box shape */
    shape?: 'rect' | 'round' | 'roundRect';
    /** Minimum zoom ratio */
    minZoom?: number;
    /** Maximum zoom ratio */
    maxZoom?: number;
    /** Zoom step size */
    zoomStep?: number;
    /** Output image quality, range 0 - 1, defaults to 0.92 */
    quality?: number;
    /** Fill color of the area outside the cropped region */
    fill?: string;
    /** Title text of the crop modal (overrides locale value) */
    modalTitle?: string;
    /** Confirm button text of the crop modal (overrides locale value) */
    modalOkText?: string;
    /** Cancel button text of the crop modal (overrides locale value) */
    modalCancelText?: string
}
