import React from 'react';
import { cssClasses } from '@douyinfe/semi-foundation/aiChatDialogue/constants';
import { IconCode, IconWord, IconExcel, IconPdf, IconSendMsgStroked, IconVideo } from '@douyinfe/semi-icons';
import { Reference } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';
import { Image } from '../../../index';
import cls from 'classnames';


export interface ReferenceWidgetProps {
    references: Reference[]
    // onItemClick?: (item: Reference) => void;
}

const prefixCls = cssClasses.PREFIX_REFERENCES;
const referencePrefixCls = cssClasses.PREFIX_REFERENCE;

export const ReferenceWidget = (props: ReferenceWidgetProps) => {

    const { references } = props;

    const renderReferenceIcon = (name: string) => {
        if (name) {
            const extension = name.split('.').pop();
            let icon = null;
            let type = '';
            if (['doc', 'docx'].includes(extension)) {
                icon = <IconWord size="small"/>;
                type = 'word';
            } else if (extension === 'pdf') {
                icon = <IconPdf size="small"/>;
                type = 'pdf';
            } else if (['excel', 'xlsx', 'xls'].includes(extension)) {
                icon = <IconExcel size="small"/>;
                type = 'excel';
            } else if (['json', 'js', 'ts', 'jsx', 'tsx'].includes(extension)) {
                icon = <IconCode size="small"/>;
                type = 'code';
            } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
                icon = <IconVideo size="small"/>;
                type = 'video';
            }

            return icon && <span className={cls(`${referencePrefixCls}-icon`, {
                [`${referencePrefixCls}-icon-${type}`]: type,
            })}>{icon}</span>;
        }
        return null;
    };

    const isImage = (name: string) => {
        if (name) {
            const extension = name.split('.').pop();
            return ['jpeg', 'jpg', 'png', 'gif'].includes(extension);
        }
        return false;
    };

    const renderReferenceImage = (reference: Reference) => {
        if (reference.url && isImage(reference.name)) {
            return <Image className={`${referencePrefixCls}-img`} src={reference.url} width={16} height={16} />;
        }
        return null;
    };

    return (
        <div 
            className={prefixCls} 
        >
            {references.map((reference) => (
                // todo: 确认背景色和一行分布几个
                <div className={referencePrefixCls} key={reference.id}>
                    <IconSendMsgStroked />
                    <span className={`${referencePrefixCls}-content`}>
                        {renderReferenceIcon(reference.name)}
                        {renderReferenceImage(reference)}
                        <span className={`${referencePrefixCls}-name`}>{reference.name || reference.content}</span>
                    </span>
                </div>
            ))}
        </div>
    );
};