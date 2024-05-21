import React from "react";
import { FileItem } from '../upload/interface';
import Image from '../image';
import { IconBriefStroked, IconClear } from '@douyinfe/semi-icons';
import { PIC_SUFFIX_ARRAY, PIC_PREFIX, cssClasses } from '@douyinfe/semi-foundation/chat/constants';
import cls from 'classnames';

const { PREFIX_ATTACHMENT, } = cssClasses;

interface AttachmentProps {
    className?: string;
    attachment?: FileItem[];
    onClear?: (item: FileItem) => void;
    showClear?: boolean
}

const Attachment = React.memo((props: AttachmentProps) => {
    const { attachment, onClear, showClear = true, className } = props;

    return (
        <div 
            className={cls(PREFIX_ATTACHMENT, { [className]: className })}
        >
            {
                attachment.map(item => {
                    const suffix = item?.name.split('.').pop();
                    const isImg = item?.fileInstance?.type?.startsWith(PIC_PREFIX) || PIC_SUFFIX_ARRAY.includes(suffix);
                    const realType = suffix ?? item?.fileInstance?.type?.split('/').pop();
                    return <div 
                        className={`${PREFIX_ATTACHMENT}-item`}
                        key={item.uid}
                    >
                        {isImg ? (
                            <Image
                                className={`${PREFIX_ATTACHMENT}-img`}
                                width={60}
                                height={60}
                                src={item.url}
                            />
                        ) : (
                            <a
                                href={item.url}
                                target="_blank"
                                className={`${PREFIX_ATTACHMENT}-file`} rel="noreferrer"
                            >
                                <IconBriefStroked size="extra-large" className={`${PREFIX_ATTACHMENT}-file-icon`}/>
                                <div className={`${PREFIX_ATTACHMENT}-file-info`}>
                                    <span className={`${PREFIX_ATTACHMENT}-file-title`}>{item.name}</span>
                                    <span className={`${PREFIX_ATTACHMENT}-file-metadata`}>
                                        <span className={`${PREFIX_ATTACHMENT}-file-type`}>{realType}</span>
                                        {realType ? ' · ' : ''}{item.size}
                                    </span>
                                </div>
                            </a>
                        )}
                        {showClear && <IconClear 
                            size="large" 
                            className={`${PREFIX_ATTACHMENT}-clear`}
                            onClick={()=> {
                                onClear && onClear(item);
                            }}
                        />}
                    </div>;
                })
            }
        </div>
    );  
});

export default Attachment;
