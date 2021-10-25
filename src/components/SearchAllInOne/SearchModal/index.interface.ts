import { ReactElement } from "react";

export interface resultItemInterface {
    img?: string | ReactElement;
    title: string | ReactElement | string[];
    type: string | ReactElement;
    context: string | ReactElement | string[]
    url: string;
}
export interface recommendItemInterface {
    img: string | ReactElement,
    title: string | ReactElement,
    content: string | ReactElement
    url: string
}
export interface mdxInfoInterface {
    "slug": string,
    "title": string,
    "brief"?: string,
    folder?: string
}

export interface nodeInterface {
    "uniqueID": string,
    "type": 'heading' | 'text' | 'code' | 'jsx' | 'list' | 'listItem' | 'root' | 'strong' | 'paragraph' | 'table' | 'tableCell',
    "value": string,
    "parent": string | null,
    "anchor": string,
    "mdxInfo": mdxInfoInterface,
    "meanfulType": 'heading' | 'code' | 'jsx' | 'list' | 'listItem' | 'root' | 'strong' | 'paragraph' | 'table'
}
export interface searchDataInterface {
    'zh-CN'?: {
        mdxInfoList: mdxInfoInterface[],
        nodeMap: {
            [propName: string]: nodeInterface
        }
    },
    'en-US'?: {
        mdxInfoList: mdxInfoInterface[],
        nodeMap: {
            [propName: string]: nodeInterface
        }
    }
}
export interface searchFuncResultItemInterface {
    text: string;
    type: 'heading' | 'code' | 'jsx' | 'list' | 'listItem' | 'root' | 'strong' | 'paragraph' | 'table' | 'brief' | 'title';
    url: string;
    mdxInfo: mdxInfoInterface
    context?: string[]
}


