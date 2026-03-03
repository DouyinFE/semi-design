import { Upload } from '../../index';
import { NodeViewWrapper } from '@tiptap/react';
import React, { useState } from 'react';
import { mergeAttributes, Node } from "@tiptap/react";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { isObject } from 'lodash';
import { FileItem, UploadProps } from '../../upload';
import LocaleConsumer from '../../locale/localeConsumer';
import { Locale } from '../../locale/interface';

export const ImageUploadNodeComponent = (props) => {
    const [status, setStatus] = useState<string>();
    const { onChange, onSuccess, getUploadImageSrc, className, ...rest } = props.extension.options;

    const handleChange = (innerProps: any) => {
        const file = innerProps.fileList[0];
        if (file) {
            setStatus(file.status);
        }
        onChange?.(innerProps);
    };

    const handleSuccess = (responseBody: any, file: File, fileList: FileItem[]) => {
        onSuccess?.(responseBody, file, fileList);
        let src = fileList[0].src;
        if (getUploadImageSrc) {
            src = getUploadImageSrc(src);
        } else {
            if (typeof responseBody === 'string') {
                src = responseBody;
            } else if (isObject(responseBody) && (responseBody as any).src) {
                src = (responseBody as any).src;
            }
        }
        const { name } = file;
        const imageNode = {
            type: props.extension.options.type,
            attrs: {
                src: src,
                alt: name,
                title: name,
            }
        };
        const pos = props.getPos();
        props.editor
            .chain()
            .focus()
            .deleteRange({ from: pos, to: pos + props.node.nodeSize })
            .insertContentAt(pos, imageNode)
            .run();
        
    };

    const getDragMainText = (status: string | undefined, locale: Locale['Sidebar']) => {
        if (status === 'validateFail') {
            return locale.validateFailInfo;
        } else if (status === 'uploadFail') {
            return locale.uploadFailInfo;
        }
        return locale.uploadImgInfo;
    };

    return (
        <NodeViewWrapper
            className={'tiptap-image-slot'}
            tabIndex={0}
        >
            <LocaleConsumer componentName="Sidebar" >
                {(locale: Locale['Sidebar']) => (
                    <Upload
                        {...rest}
                        draggable
                        className={status}
                        dragMainText={getDragMainText(status, locale)}
                        onChange={handleChange}
                        onSuccess={handleSuccess}
                    /> )}
            </LocaleConsumer>
        </NodeViewWrapper>
    );
};

export interface ImageUploadNodeOptions extends UploadProps {
    HTMLAttributes?: any;
    getUploadImageSrc?: (uploadProps: any) => string
}

export const ImageUploadNode = Node.create<ImageUploadNodeOptions>({
    name: "imageUpload",
    group: "block",
    draggable: true,
    selectable: true,
    atom: true,
    
    addOptions() {
        return {
            type: "image",
            accept: "image/*",
            limit: 1,
            action: undefined,
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            accept: {
                default: this.options.accept,
            },
            limit: {
                default: this.options.limit,
            },
            maxSize: {
                default: this.options.maxSize,
            },
            action: {
                default: this.options.action,
            },
            minSize: {
                default: this.options.minSize,
            },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="image-upload"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes({ "data-type": "image-upload" }, HTMLAttributes),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageUploadNodeComponent);
    },

});
