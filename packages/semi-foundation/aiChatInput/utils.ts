import { Attachment, Reference } from "./interface";
import { strings } from './constants';

export function getAttachmentType(item: Attachment | Reference) {
    const { type, name, fileInstance } = item ?? {};
    if (type) {
        return type;
    }
    const suffix = name?.split('.').pop();
    return suffix ?? fileInstance?.type?.split('/').pop() ?? 'UNKNOWN';
}

export function isImageType(item: Attachment | Reference) {
    const { name, fileInstance } = item ?? {};
    const suffix = name?.split('.').pop();
    return fileInstance?.type?.startsWith(strings.PIC_PREFIX) || strings.PIC_SUFFIX_ARRAY.includes(suffix);
}

export function getContentType(type: string) {
    const objMap = new Map([
        // 文档
        ['docx', 'word'], ['doc', 'word'], ['txt', 'word'], ['epub', 'word'], ['mobi', 'word'],
        // 代码
        ['js', 'code'], ['ts', 'code'], ['jsx', 'code'], ['tsx', 'code'], ['java', 'code'], ['py', 'code'], ['c', 'code'],
        ['cpp', 'code'], ['go', 'code'], ['rust', 'code'], ['php', 'code'], ['sql', 'code'], ['html', 'code'], ['css', 'code'],
        ['scss', 'code'], ['less', 'code'], ['md', 'code'], ['json', 'code'],
        // 表格
        ['xlsx', 'excel'], ['xls', 'excel'], ['pptx', 'ppt'], ['ppt', 'ppt'],  
        // 视频
        ['mp4', 'video'], ['mkv', 'video'], ['avi', 'video'], ['mov', 'video'], ['wmv', 'video'],
        ['prores', 'video'], ['flv', 'video'], ['ts', 'video'], ['webm', 'video'], ['3gp', 'video'],
        // 音频
        ['flac', 'audio'], ['wav', 'audio'], ['alac', 'audio'], ['ape', 'audio'], ['mp3', 'audio'],
        ['aac', 'audio'], ['ogg', 'audio'], ['wma', 'audio'], ['m4a', 'audio'], ['amr', 'audio'],
        ['midi', 'audio'],
        // 图片
        ['png', 'image'], ['jpg', 'image'], ['jpeg', 'image'], ['gif', 'image'], ['bmp', 'image'], ['webp', 'image'],
        // pdf
        ['pdf', 'pdf'],
    ]);
    const result = objMap.get(type) ?? 'unknown';
    return result;
}

export function transformSelectSlot(obj: any) {
    const { attrs = {} } = obj;
    const { value = '' } = attrs;
    return {
        type: 'text',
        text: value,
    };
}

export function transformSkillSlot(obj: any) {
    const { type, attrs } = obj;
    const { value, info } = attrs;
    return {
        type,
        value,
        ...(JSON.parse(info) ?? {}),
    };
}

export function transformInputSlot(obj: any) {
    const { content = [], attrs } = obj;
    const text = content?.[0]?.text ?? '';
    return {
        type: 'text',
        text: (text !== strings.ZERO_WIDTH_CHAR && text.length) ? text : attrs?.placeholder,
    };
}

export function transformText(obj: any) {
    return { ...obj };
}

export const transformMap = new Map([
    ['text', transformText],
    ['selectSlot', transformSelectSlot],
    ['inputSlot', transformInputSlot],
    ['toolSlot', transformSkillSlot],
]);

export function transformJSONResult(input: any, customTransformObj: Map<string, (obj: any) => any> = new Map()) {
    const output: any[] = [];

    const traverse = (obj: any) => {
        const { type, content = [] } = obj;
        let result: any;
        switch (type) {
            case 'doc':
                content.forEach((item: any) => {
                    traverse(item);
                });
                break;
            case 'paragraph':
                if (output.length > 0) {
                    const lastItem = output[output.length - 1];
                    if (lastItem && lastItem.type === 'text') {
                        lastItem.text += '/n';
                    } else {
                        output.push({ type: 'text', text: '/n' });
                    }
                }
                content.forEach((item: any) => {
                    traverse(item);
                });
                break;
            default:
                const transformFn = transformMap.get(type) ?? customTransformObj.get(type);
                result = transformFn?.(obj);
                break;
        }
        if (result) {
            if (result.type === 'text') {
                const lastItem = output[output.length - 1];
                if (lastItem && lastItem.type === 'text') {
                    lastItem.text += result.text;
                } else {
                    output.push(result);
                }
            } else {
                output.push(result);
            }
        }
    };

    traverse(input);
    return output;
}