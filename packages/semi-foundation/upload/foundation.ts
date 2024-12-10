import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import isPromise from '../utils/isPromise';
import { getUuidv4 } from '../utils/uuid';
import { strings, numbers } from './constants';
import { getFileSize, byteKB, endsWith, mapFileTree } from './utils';

const {
    FILE_STATUS_UPLOADING,
    FILE_STATUS_SUCCESS,
    FILE_STATUS_UPLOAD_FAIL,
    FILE_STATUS_VALID_FAIL,
    FILE_STATUS_WAIT_UPLOAD,
    DRAG_AREA_DEFAULT,
    DRAG_AREA_LEGAL,
    TRIGGER_AUTO,
} = strings;

export interface XhrError extends Error{
    status: XMLHttpRequest['status'];
    method: string;
    url: string
}

export type FileItemStatus = 'success' | 'uploadFail' | 'validateFail' | 'validating' | 'uploading' | 'wait';

export interface BaseFileItem {
    showReplace?: boolean; // Separately control whether the file will show the Replace button when the upload is successful
    showRetry?: boolean; // Separately control whether the file displays the Retry button
    response?: any;
    event?: Event; // xhr event
    status: FileItemStatus;
    name: string;
    size: string;
    uid: string;
    url?: string;
    fileInstance?: File;
    percent?: number;
    _sizeInvalid?: boolean;
    preview?: boolean;
    validateMessage?: any;
    shouldUpload?: boolean;
    [key: string]: any
}

export interface CustomFile extends File {
    uid?: string;
    _sizeInvalid?: boolean;
    status?: string
}

export interface BeforeUploadObjectResult {
    shouldUpload?: boolean;
    status?: string;
    autoRemove?: boolean;
    validateMessage?: unknown;
    fileInstance?: CustomFile
}

export interface AfterUploadResult {
    autoRemove?: boolean;
    status?: string;
    validateMessage?: unknown;
    name?: string;
    url?: string
}

export interface UploadAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifyFileSelect: (files: Array<CustomFile>) => void;
    notifyError: (error: XhrError, fileInstance: File, fileList: Array<BaseFileItem>, xhr: XMLHttpRequest) => void;
    notifySuccess: (body: any, fileInstance: File, newFileList: Array<BaseFileItem>) => void;
    notifyProgress: (percent: number, fileInstance: File, newFileList: Array<BaseFileItem>) => void;
    notifyRemove: (file: File, newFileList: Array<BaseFileItem>, fileItem: BaseFileItem) => void;
    notifySizeError: (file: File, fileList: Array<BaseFileItem>) => void;
    notifyExceed: (files: Array<File>) => void;
    updateFileList: (newFileList: Array<BaseFileItem>, callback?: () => void) => void;
    notifyBeforeUpload: ({ file, fileList }: { file: BaseFileItem; fileList: Array<BaseFileItem> }) => boolean | BeforeUploadObjectResult | Promise<BeforeUploadObjectResult>;
    notifyAfterUpload: ({ response, file, fileList }: { response: any; file: BaseFileItem; fileList: Array<BaseFileItem> }) => AfterUploadResult;
    resetInput: () => void;
    resetReplaceInput: () => void;
    updateDragAreaStatus: (dragAreaStatus: string) => void;
    notifyBeforeRemove: (file: BaseFileItem, fileList: Array<BaseFileItem>) => boolean | Promise<boolean>;
    notifyBeforeClear: (fileList: Array<BaseFileItem>) => boolean | Promise<boolean>;
    notifyChange: ({ currentFile, fileList }: { currentFile: BaseFileItem | null; fileList: Array<BaseFileItem> }) => void;
    updateLocalUrls: (urls: Array<string>) => void;
    notifyClear: () => void;
    notifyPreviewClick: (file: any) => void;
    notifyDrop: (e: any, files: Array<File>, fileList: Array<BaseFileItem>) => void;
    notifyAcceptInvalid: (invalidFiles: Array<File>) => void;
    registerPastingHandler: (cb?: (params?: any) => void) => void;
    unRegisterPastingHandler: () => void;
    isMac: () => boolean;
    notifyPastingError: (error: Error | PermissionStatus) => void
    // notifyPasting: () => void; 
}

class UploadFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<UploadAdapter<P, S>, P, S> {
    destroyState: boolean = false;
    constructor(adapter: UploadAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        // make sure state reset, otherwise may cause upload abort in React StrictMode, like https://github.com/DouyinFE/semi-design/pull/843
        this.destroyState = false;
        const { disabled, addOnPasting } = this.getProps();
        if (addOnPasting && !disabled) {
            this.bindPastingHandler();
        }
    }

    destroy() {
        const { disabled, addOnPasting } = this.getProps();
        this.releaseMemory();
        if (!disabled) {
            this.unbindPastingHandler();
        }
        this.destroyState = true;
    }

    getError({ action, xhr, message, fileName }: { action: string;xhr: XMLHttpRequest;message?: string;fileName: string }): XhrError {
        const status = xhr ? xhr.status : 0;
        const msg = message || `cannot post ${fileName} to ${action}, xhr status: ${status}'`;
        const err = new Error(msg) as XhrError;
        err.status = status;
        err.method = 'post';
        err.url = action;
        return err;
    }

    getBody(xhr: XMLHttpRequest): any {
        if (!xhr) {
            return;
        }
        const text = xhr.responseText || xhr.response;
        if (!text) {
            return text;
        }
        try {
            return JSON.parse(text);
        } catch (error) {
            return text;
        }
    }

    checkFileSize(file: File): boolean {
        const { size } = file;
        const { maxSize, minSize } = this.getProps();
        let isIllegal = false;
        if (size > maxSize * byteKB || size < minSize * byteKB) {
            isIllegal = true;
        }
        return isIllegal;
    }

    /**
     * 1. 选择文件
     * 2. transform转换. 添加uid
     * 3. 检查文件个数是否超出
     *   若超出，不添加到list中，触发onExceed，中止流程
     *   若未超出，执行以下流程
     * 4. 检查文件尺寸，添加尺寸是否合法的标识
     * 5. 检查uploadTrigger是否为'auto'，若是执行步骤6-8
     * 6. 遍历文件列表触发上传
     *    - 对尺寸不合适的不需要触发上传
     * 7. beforeUpload
     *    - 对beforeUpload中设为不合法的不需要触发上传
     * 8. TODO: check
     * 9. afterUpload
     * 
     * 1. Select file
     * 2. transform, add uid
     * 3. Check whether the number of files exceeds
     *   If it exceeds, it is not added to the list, trigger onExceed, and abort the process
     *   If it is not exceeded, execute the following process
     * 4. check the file size, add the size is legal logo
     * 5. Check whether the uploadTrigger is'auto ', if so, perform steps 6-8
     * 6. Traversing the file list triggers upload
     *    - No need to trigger uploads for inappropriate sizes
     * 7. beforeUpload
     *    - no need to trigger upload if beforeUpload is not set to be valid
     * 8. TODO: check
     * 9. afterUpload
     */
    handleChange(currentFileList: FileList | Array<File>): void {
        const invalidFiles: Array<File> = [];
        const { limit, transformFile, accept } = this.getProps();

        const { fileList } = this.getStates();

        let files = Array.from(currentFileList); // When the selected file
        if (typeof accept !== 'undefined') {
            files = files.filter(item => {
                const isValid = this.checkFileFormat(accept, item);
                if (!isValid) {
                    invalidFiles.push(item);
                }
                return isValid;
            });
            if (invalidFiles.length !== 0) {
                this._adapter.notifyAcceptInvalid(invalidFiles);
            }
            if (files.length === 0) {
                return;
            }
        }

        files = files.map((file: CustomFile) => {
            if (transformFile) {
                file = transformFile(file);
            }
            if (!file.uid) {
                file.uid = getUuidv4();
            }

            if (this.checkFileSize(file)) {
                file._sizeInvalid = true;
                file.status = FILE_STATUS_VALID_FAIL;
                this._adapter.notifySizeError(file, fileList);
            }
            return file;
        });

        const total = fileList.length + files.length;
        if (typeof limit !== 'undefined') {
            // Determine whether the limit is exceeded
            if (total > limit) {
                this._adapter.notifyExceed(files);
                if (limit === 1) {
                    // Replace the current file with the last file
                    files = files.slice(-1);
                    this._adapter.notifyFileSelect(files);
                    this._adapter.resetInput();
                    this.replaceFileList(files);
                    return;
                }
                // If the limit is exceeded, the calculation can add a few more files and continue uploading the remaining files
                const restNum = limit - fileList.length;
                files = files.slice(0, restNum);
            }
        }

        this._adapter.notifyFileSelect(files);
        this._adapter.resetInput();
        this.addFilesToList(files);
    }

    // Triggered when replacing a single file
    handleReplaceChange(currentFileList: FileList | Array<File>): void {
        if (currentFileList.length === 0) {
            return;
        }
        const { transformFile, uploadTrigger, accept } = this.getProps();
        const { replaceIdx, fileList } = this.getStates();
        let newFile = Array.from(currentFileList).pop() as CustomFile;
        if (typeof accept !== 'undefined') {
            if (!this.checkFileFormat(accept, newFile)) {
                this._adapter.notifyAcceptInvalid([newFile]);
                return;
            }
        }
        if (transformFile) {
            newFile = transformFile(newFile);
        }
        if (!newFile.uid) {
            newFile.uid = getUuidv4();
        }
        if (this.checkFileSize(newFile)) {
            newFile._sizeInvalid = true;
            newFile.status = FILE_STATUS_VALID_FAIL;
            this._adapter.notifySizeError(newFile, fileList);
        }
        this._adapter.notifyFileSelect([newFile]);
        const newFileItem = this.buildFileItem(newFile, uploadTrigger);
        const newFileList = [...fileList];
        newFileList.splice(replaceIdx, 1, newFileItem);
        this._adapter.notifyChange({ currentFile: newFileItem, fileList: newFileList });
        this._adapter.updateFileList(newFileList, () => {
            this._adapter.resetReplaceInput();
            if (!newFileItem._sizeInvalid) {
                this.upload(newFileItem);
            }
        });
    }

    buildFileItem(fileInstance: CustomFile, uploadTrigger: string): BaseFileItem {
        const { _sizeInvalid, status } = fileInstance;
        try {
            // can't use ... to get rest property on File Object
            delete fileInstance._sizeInvalid;
            delete fileInstance.status;
        } catch (error) {}

        const _file: BaseFileItem = {
            status: (status ? status : uploadTrigger === TRIGGER_AUTO ? FILE_STATUS_UPLOADING : FILE_STATUS_WAIT_UPLOAD) as any,
            name: fileInstance.name,
            size: getFileSize(fileInstance.size),
            uid: fileInstance.uid,
            percent: 0,
            fileInstance,
            url: this._createURL(fileInstance),
        };

        if (_sizeInvalid) {
            _file._sizeInvalid = true;
        }

        // If it is an image, preview; if it is a pdf, you can jump to
        if (this.isImage(fileInstance)) {
            _file.preview = true;
        }

        return _file;
    }

    replaceFileList(files: Array<CustomFile>): void {
        const { uploadTrigger } = this.getProps();
        const currentFiles = files.map(item => this.buildFileItem(item, uploadTrigger));
        this._adapter.notifyChange({ fileList: currentFiles, currentFile: currentFiles[0] });
        this._adapter.updateFileList(currentFiles, () => {
            if (uploadTrigger === TRIGGER_AUTO) {
                this.startUpload(currentFiles);
            }
        });
    }

    addFilesToList(files: Array<CustomFile>): void {
        const fileList = this.getState('fileList').slice();
        const { uploadTrigger } = this.getProps();
        const currentFiles = files.map(item => this.buildFileItem(item, uploadTrigger));
        currentFiles.forEach(file => {
            const index = fileList.findIndex((item: BaseFileItem) => item.uid === file.uid);
            if (index !== -1) {
                fileList[index] = file;
            } else {
                fileList.push(file);
                this._adapter.notifyChange({ fileList, currentFile: file });
            }
        });
        this._adapter.updateFileList(fileList, () => {
            if (uploadTrigger === TRIGGER_AUTO) {
                this.startUpload(currentFiles);
            }
        });
    }

    // 插入多个文件到指定位置
    // Insert files to the specified location
    insertFileToList(files: Array<CustomFile>, index: number): void {
        const { limit, transformFile, accept, uploadTrigger } = this.getProps();
        const { fileList } = this.getStates();

        const unAcceptFileList = [];

        // 当次选中的文件
        // current selected file
        let currentFileList = Array.from(files);
        if (typeof accept !== 'undefined') {
            currentFileList = currentFileList.filter(item => {
                const isValid = this.checkFileFormat(accept, item);
                if (!isValid) {
                    unAcceptFileList.push(item);
                }
                return isValid;
            });
            if (unAcceptFileList.length !== 0) {
                this._adapter.notifyAcceptInvalid(unAcceptFileList);
            }
            if (currentFileList.length === 0) {
                return;
            }
        }
        currentFileList = currentFileList.map(file => {
            if (!file.uid) {
                file.uid = getUuidv4();
            }

            if (this.checkFileSize(file)) {
                file._sizeInvalid = true;
                file.status = FILE_STATUS_VALID_FAIL;
                this._adapter.notifySizeError(file, fileList);
            }

            if (transformFile) {
                file = transformFile(file);
            }
            return file;
        });
        const total = fileList.length + currentFileList.length;
        if (typeof limit !== 'undefined') {
            // 判断是否超出限制
            // Determine whether the limit is exceeded
            if (total > limit) {
                if (limit === 1) {
                    // 使用最后面的文件对当前文件进行替换
                    // Use the last file to replace the current file
                    currentFileList = currentFileList.slice(-1);
                    this._adapter.notifyFileSelect(currentFileList);
                    this._adapter.resetInput();
                    this.replaceFileList(currentFileList);
                    return;
                }
                // 如果超出了限制，则计算还能添加几个文件，将剩余的文件继续上传
                // If the limit is exceeded, several files can be added to the calculation, and the remaining files will continue to be uploaded
                const restNum = limit - fileList.length;
                currentFileList = currentFileList.slice(0, restNum);
                this._adapter.notifyExceed(currentFileList);
            }
        }

        const fileItemList = currentFileList.map(file => this.buildFileItem(file, uploadTrigger));
        const newFileList = fileList.slice();
        if (typeof index !== 'undefined') {
            newFileList.splice(index, 0, ...fileItemList);
        } else {
            newFileList.push(...fileItemList);
        }

        this._adapter.notifyFileSelect(currentFileList);
        this._adapter.notifyChange({ fileList: newFileList, currentFile: null });
        this._adapter.updateFileList(newFileList, () => {
            if (uploadTrigger === TRIGGER_AUTO) {
                this.startUpload(fileItemList);
            }
        });
    }

    /* istanbul ignore next */
    manualUpload(): void {
        // find the list of files that have not been uploaded
        const waitToUploadFileList = this.getState('fileList').filter((item: BaseFileItem) => item.status === FILE_STATUS_WAIT_UPLOAD);
        this.startUpload(waitToUploadFileList);
    }

    startUpload(fileList: Array<BaseFileItem>): void {
        fileList.forEach(file => {
            if (!file._sizeInvalid) {
                this.upload(file);
            }
        });
    }

    upload(file: BaseFileItem): void {
        const { beforeUpload } = this.getProps();
        if (typeof beforeUpload === 'undefined') {
            this.post(file);
            return;
        }
        if (typeof beforeUpload === 'function') {
            const { fileList } = this.getStates();
            const buResult = this._adapter.notifyBeforeUpload({ file, fileList });
            switch (true) {
                // sync validate - boolean
                case buResult === true: {
                    this.post(file);
                    break;
                }
                case buResult === false: {
                    const newResult = { shouldUpload: false, status: strings.FILE_STATUS_VALID_FAIL };
                    this.handleBeforeUploadResultInObject(newResult, file);
                    break;
                }
                // async validate
                case buResult && isPromise(buResult): {
                    Promise.resolve(buResult as Promise<BeforeUploadObjectResult>).then(
                        resolveData => {
                            let newResult = { shouldUpload: true };
                            const typeOfResolveData = Object.prototype.toString.call(resolveData).slice(8, -1);
                            if (typeOfResolveData === 'Object') {
                                newResult = { ...newResult, ...resolveData };
                            }
                            this.handleBeforeUploadResultInObject(newResult, file);
                        },
                        rejectVal => {
                            let newResult = { shouldUpload: false, status: strings.FILE_STATUS_VALID_FAIL };
                            const typeOfRejectData = Object.prototype.toString.call(rejectVal).slice(8, -1);
                            if (typeOfRejectData === 'Object') {
                                newResult = { ...newResult, ...rejectVal };
                            }
                            this.handleBeforeUploadResultInObject(newResult, file);
                        });
                    break;
                }

                // sync validate - object
                case typeof buResult === 'object':
                    // inject to fileList
                    this.handleBeforeUploadResultInObject(buResult as BeforeUploadObjectResult, file);
                    break;
                default:
                    break;
            }
        }
    }

    // handle beforeUpload result when it's an object
    handleBeforeUploadResultInObject(buResult: Partial<BeforeUploadObjectResult>, file: BaseFileItem): void {
        const { shouldUpload, status, autoRemove, validateMessage, fileInstance } = buResult;
        let newFileList: Array<BaseFileItem> = this.getState('fileList').slice();
        if (autoRemove) {
            newFileList = newFileList.filter(item => item.uid !== file.uid);
        } else {
            const index = this._getFileIndex(file, newFileList);
            if (index < 0) {
                return;
            }
            status ? (newFileList[index].status = status as any) : null;
            validateMessage ? (newFileList[index].validateMessage = validateMessage) : null;
            if (fileInstance) {
                fileInstance.uid = file.uid; // reuse recent file uid
                newFileList[index].fileInstance = fileInstance;
                newFileList[index].size = getFileSize(fileInstance.size);
                newFileList[index].name = fileInstance.name;
                newFileList[index].url = this._createURL(fileInstance);
            }
            newFileList[index].shouldUpload = shouldUpload;
        }

        this._adapter.updateFileList(newFileList);
        this._adapter.notifyChange({ fileList: newFileList, currentFile: file });

        if (shouldUpload) {
            this.post(file);
        }
    }

    post(file: BaseFileItem): void {
        const { fileInstance } = file;
        const option = this.getProps();

        if (typeof XMLHttpRequest === 'undefined') {
            return;
        }

        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        const { action } = option;

        // add data
        let { data } = option;
        if (data) {
            if (typeof data === 'function') {
                data = data(fileInstance);
            }

            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
        }

        // add file
        const fileName = option.name || option.fileName || fileInstance.name;

        if (option.customRequest) {
            return option.customRequest({
                fileName,
                data,
                file,
                fileInstance,
                onProgress: (e?: ProgressEvent) => this.handleProgress({ e, fileInstance }),
                onError: (userXhr: XMLHttpRequest, e?: ProgressEvent) => this.handleError({ e, xhr: userXhr, fileInstance }),
                onSuccess: (response: any, e?: ProgressEvent) => this.handleSuccess({ response, fileInstance, e, isCustomRequest: true }),
                withCredentials: option.withCredentials,
                action: option.action,
            });
        }

        formData.append(fileName, fileInstance);
        xhr.open('post', action, true);

        if (option.withCredentials && 'withCredentials' in xhr) {
            xhr.withCredentials = true;
        }

        if (xhr.upload) {
            xhr.upload.onprogress = (e: ProgressEvent): void => {
                if (!this.destroyState) {
                    this.handleProgress({ e, fileInstance });
                } else {
                    xhr.abort();
                }
            };
        }

        // Callback function after upload is completed
        xhr.onload = (e: ProgressEvent): void => {
            if (!this.destroyState) {
                this.handleOnLoad({ e, xhr, fileInstance });
            }
        };

        xhr.onerror = (e: ProgressEvent): void => {
            if (!this.destroyState) {
                this.handleError({ e, xhr, fileInstance });
            }
        };

        // add headers
        let headers = option.headers || {};
        if (typeof headers === 'function') {
            headers = headers(fileInstance);
        }

        for (const item in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, item) && headers[item] !== null) {
                xhr.setRequestHeader(item, headers[item]);
            }
        }

        xhr.send(formData);
    }

    handleProgress({ e, fileInstance }: { e?: ProgressEvent; fileInstance: File }): void {
        const { fileList } = this.getStates();
        const newFileList = fileList.slice();
        let percent = 0;
        if (e.total > 0) {
            percent = Number(((e.loaded / e.total) * 100 * numbers.PROGRESS_COEFFICIENT).toFixed(0)) || 0;
        }
        const index = this._getFileIndex(fileInstance, newFileList);
        if (index < 0) {
            return;
        }
        newFileList[index].percent = percent;
        newFileList[index].status = FILE_STATUS_UPLOADING;

        this._adapter.notifyProgress(percent, fileInstance, newFileList);
        this._adapter.updateFileList(newFileList);
        this._adapter.notifyChange({ fileList: newFileList, currentFile: newFileList[index] });
    }

    handleOnLoad({ e, xhr, fileInstance }: { e?: ProgressEvent; xhr: XMLHttpRequest; fileInstance: File }): void {
        const { fileList } = this.getStates();
        const index = this._getFileIndex(fileInstance, fileList);
        if (index < 0) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            this.handleError({ e, xhr, fileInstance });
        } else {
            this.handleSuccess({ e, xhr, fileInstance, index } as any);
        }
    }

    handleSuccess({ e, fileInstance, isCustomRequest = false, xhr, response }: { e?: ProgressEvent; fileInstance: CustomFile; isCustomRequest?: boolean; xhr?: XMLHttpRequest; response?: any }): void {
        const { fileList } = this.getStates();
        let body: any = null;
        const index = this._getFileIndex(fileInstance, fileList);
        if (index < 0) {
            return;
        }
        if (isCustomRequest) {
            // use when pass customRequest
            body = response;
        } else {
            body = this.getBody(xhr);
        }
        const newFileList = fileList.slice();
        const { afterUpload } = this.getProps();

        newFileList[index].status = FILE_STATUS_SUCCESS;
        newFileList[index].percent = 100;
        this._adapter.notifyProgress(100, fileInstance, newFileList);
        newFileList[index].response = body;
        e ? (newFileList[index].event = e) : null;

        if (afterUpload && typeof afterUpload === 'function') {
            const { autoRemove, status, validateMessage, name, url } =
                this._adapter.notifyAfterUpload({
                    response: body,
                    file: newFileList[index],
                    fileList: newFileList,
                }) || {};
            status ? (newFileList[index].status = status) : null;
            validateMessage ? (newFileList[index].validateMessage = validateMessage) : null;
            name ? (newFileList[index].name = name) : null;
            url ? (newFileList[index].url = url) : null;
            autoRemove ? newFileList.splice(index, 1) : null;
        }
        this._adapter.notifySuccess(body, fileInstance, newFileList);
        this._adapter.notifyChange({ fileList: newFileList, currentFile: newFileList[index] });
        this._adapter.updateFileList(newFileList);
    }

    _getFileIndex(file: CustomFile | BaseFileItem, fileList: Array<BaseFileItem>): number {
        return fileList.findIndex(item => item.uid === file.uid);
    }

    handleRemove(file: BaseFileItem): void {
        const { disabled } = this.getProps();
        if (disabled) {
            return;
        }
        const { fileList } = this.getStates();

        Promise.resolve(this._adapter.notifyBeforeRemove(file, fileList)).then(res => {
            // prevent remove while user return false
            if (res === false) {
                return;
            }

            const newFileList = fileList.slice();
            const index = this._getFileIndex(file, fileList);
            if (index < 0) {
                return;
            }
            newFileList.splice(index, 1);

            this._adapter.notifyRemove(file.fileInstance, newFileList, file);
            this._adapter.updateFileList(newFileList);
            this._adapter.notifyChange({ fileList: newFileList, currentFile: file });
        });
    }

    handleError({ e, xhr, fileInstance }: { e?: ProgressEvent;xhr: XMLHttpRequest;fileInstance: CustomFile }): void {
        const { fileList } = this.getStates();
        const index = this._getFileIndex(fileInstance, fileList);
        if (index < 0) {
            return;
        }
        const { action } = this.getProps();
        const newFileList = fileList.slice();
        const error = this.getError({ action, xhr, fileName: fileInstance.name });

        newFileList[index].status = FILE_STATUS_UPLOAD_FAIL;
        newFileList[index].response = error;
        newFileList[index].event = e;

        this._adapter.notifyError(error, fileInstance, newFileList, xhr);
        this._adapter.updateFileList(newFileList);
        this._adapter.notifyChange({ currentFile: newFileList[index], fileList: newFileList });
    }

    handleClear() {
        const { disabled } = this.getProps();
        const { fileList } = this.getStates();
        if (disabled) {
            return;
        }

        Promise.resolve(this._adapter.notifyBeforeClear(fileList)).then(res => {
            if (res === false) {
                return;
            }
            this._adapter.updateFileList([]);
            this._adapter.notifyClear();
            this._adapter.notifyChange({ fileList: [] } as any);
        }).catch(error => {
            // if user pass reject promise, no need to do anything
        });
    }

    _createURL(fileInstance: CustomFile): string {
        // https://stackoverflow.com/questions/31742072/filereader-vs-window-url-createobjecturl
        const url = URL.createObjectURL(fileInstance);
        const { localUrls } = this.getStates();
        const newUrls = localUrls.slice();
        newUrls.push(url);
        this._adapter.updateLocalUrls(newUrls);
        return url;
    }

    // 释放预览文件所占用的内存
    // Release memory used by preview files
    releaseMemory(): void {
        const { localUrls }: { localUrls: Array<string> } = this.getStates();
        localUrls.forEach(url => {
            this._releaseBlob(url);
        });
    }

    _releaseBlob(url: string): void {
        try {
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }
    }

    isImage(file: CustomFile): boolean {
        return /(webp|svg|png|gif|jpg|jpeg|bmp|dpg)$/i.test(file.type);
    }

    /* istanbul ignore next */
    isMultiple(): boolean {
        return Boolean(this.getProp('multiple'));
    }

    _dragEnterTarget: EventTarget;

    handleDragEnter(e: any): void {
        e.preventDefault();
        e.stopPropagation();
        this._dragEnterTarget = e.currentTarget;
        const { disabled } = this.getProps();
        if (!disabled) {
            this._adapter.updateDragAreaStatus(DRAG_AREA_LEGAL);
        }
    }

    async handleDirectoryDrop(e: any): Promise<void> {
        const fileList = this.getState('fileList').slice();
        const items = [].slice.call(e.dataTransfer.items);
        const files = await mapFileTree(items);
        this.handleChange(files);
        this._adapter.updateDragAreaStatus(DRAG_AREA_DEFAULT);
        this._adapter.notifyDrop(e, files, fileList);
    }

    handleDrop(e: any): void {
        // Block file opening in browser
        e.preventDefault();
        e.stopPropagation();
        const { disabled, directory } = this.getProps();
        const fileList = this.getState('fileList').slice();
        if (!disabled) {
            if (directory) {
                this.handleDirectoryDrop(e);
                return;
            }
            const files: File[] = Array.from(e.dataTransfer.files);
            this.handleChange(files);
            this._adapter.updateDragAreaStatus(DRAG_AREA_DEFAULT);
            this._adapter.notifyDrop(e, files, fileList);
        }
    }

    handleDragOver(e: any): void {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDragLeave(e: any): void {
        e.preventDefault();
        e.stopPropagation();
        // 防止拖拽进入子元素时触发的dragLeave也被处理
        // Prevent dragLeave triggered when dragging into a child element is also handled
        // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
        if (this._dragEnterTarget === e.target) {
            this._adapter.updateDragAreaStatus(DRAG_AREA_DEFAULT);
        }
    }

    // 拖拽上传时，需要对文件的格式进行校验
    // When dragging and uploading, you need to verify the file format
    checkFileFormat(accept: string, file: File): boolean {
        const acceptTypes = accept
            .split(',')
            .map(type => type.trim())
            .filter(type => type);
        const mimeType = file.type || '';
        // Get the large class to which MIMEtype belongs, eg: image/jpeg = > image, application/= > application
        const baseMimeType = mimeType.replace(/\/.*$/, '');

        return acceptTypes.some(type => {
            // When accepted as a suffix filename such as [.jpeg]
            if (type.charAt(0) === '.') {
                const fileName = file.name || '';
                const acceptExtension = type.split('.').pop().toLowerCase();
                return endsWith(fileName.toLowerCase(), acceptExtension);
            }
            // When accepted as a general class such as [image/*] or [video/*]
            if (/\/\*$/.test(type)) {
                const acceptBaseMimeType = type.replace(/\/.*$/, '');
                return baseMimeType === acceptBaseMimeType;
            }
            // When accepted as a full MIME types string
            if (/^[^\/]+\/[^\/]+$/.test(type)) {
                return mimeType === type;
            }
            return false;
        });
    }

    retry(fileItem: BaseFileItem): void {
        const { onRetry } = this.getProps();
        if (onRetry && typeof onRetry === 'function') {
            onRetry(fileItem);
        }
        this.post(fileItem);
    }

    handlePreviewClick(fileItem: BaseFileItem): void {
        this._adapter.notifyPreviewClick(fileItem);
    }

    readFileFromClipboard(clipboardItems) {
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                // types maybe: text/plain, image/png, text/html
                if (type.startsWith('image')) {
                    clipboardItem.getType(type).then(blob => {
                        return blob.arrayBuffer();
                    }).then((buffer) => {
                        const format = type.split('/')[1];
                        const file = new File([buffer], `upload.${format}`, { type });
                        this.handleChange([file]);
                    });
                }
            }
        }
    }

    handlePasting(e: any) {
        const isMac = this._adapter.isMac();
        const isCombineKeydown = isMac ? e.metaKey : e.ctrlKey;
        const { addOnPasting } = this.getProps();
        if (addOnPasting) {
            if (isCombineKeydown && e.code === 'KeyV') {
                // https://github.com/microsoft/TypeScript/issues/33923
                const permissionName = 'clipboard-read' as PermissionName;
                // The main thread should not be blocked by clipboard, so callback writing is required here. No await here
                navigator.permissions
                    .query({ name: permissionName })
                    .then(result => {
                        if (result.state === 'granted' || result.state === 'prompt') {
                            // user has authorized or will authorize
                            navigator.clipboard.read().then(clipboardItems => {
                                // Process the data read from the pasteboard
                                // Check the returned data type to determine if it is image data, and process accordingly
                                this.readFileFromClipboard(clipboardItems);
                            });
                        } else {
                            this._adapter.notifyPastingError(result);
                        }
                    })
                    .catch(error => {
                        this._adapter.notifyPastingError(error);
                    });
            }
        }
    }

    bindPastingHandler(): void {
        this._adapter.registerPastingHandler((event) => this.handlePasting(event));
    }

    unbindPastingHandler() {
        this._adapter.unRegisterPastingHandler();
    }
}

export default UploadFoundation;
