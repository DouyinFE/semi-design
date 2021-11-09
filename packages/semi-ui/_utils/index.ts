/* eslint-disable max-len */
/* argus-disable unPkgSensitiveInfo */
import React from 'react';
import { cloneDeepWith, set, get } from 'lodash';
import warning from '@douyinfe/semi-foundation/utils/warning';
import { findAll } from '@douyinfe/semi-foundation/utils/getHighlight';
/**
 * stop propagation
 *
 * @param {React.MouseEvent<HTMLElement>} e React mouse event object
 * @param {boolean} noImmediate Skip stopping immediate propagation
 */
export function stopPropagation(e: React.MouseEvent, noImmediate?: boolean) {
    if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
    }

    if (!noImmediate && e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
        e.nativeEvent.stopImmediatePropagation();
    }
}

/**
 *
 * @param {any} value
 * @param {Function} customizer
 * @returns {any}
 * use in Table, Form, Navigation
 */
export function cloneDeep(value: any, customizer?: (value: any) => void) {
    return cloneDeepWith(value, v => {
        if (typeof customizer === 'function') {
            return customizer(v);
        }
        if (typeof v === 'function' || React.isValidElement(v)) {
            return v;
        }
        if (Object.prototype.toString.call(v) === '[object Error]') {
            return v;
        }
        if (Array.isArray(v) && v.length === 0) {
            const keys: string[] = Object.keys(v);
            if (keys.length) {
                const newArray: any[] = [];
                keys.forEach(key => {
                    set(newArray, key, v[key]);
                });
                // internal-issues:887
                warning(
                    get(process, 'env.NODE_ENV') !== 'production',
                    `[Semi] You may use an out-of-bounds array. In some cases, your program may not behave as expected.
                    The maximum length of an array is 4294967295.
                    Please check whether the array subscript in your data exceeds the maximum value of the JS array subscript`
                );
                return newArray;
            } else {
                return undefined;
            }
        }
        return undefined;
    });
}

/**
 * [getHighLightTextHTML description]
 *
 * @param   {string} sourceString [source content text]
 * @param   {Array<string>} searchWords [keywords to be highlighted]
 * @param   {object} option
 * @param   {true}      option.highlightTag [The tag wrapped by the highlighted content, mark is used by default]
 * @param   {true}      option.highlightClassName
 * @param   {true}      option.highlightStyle
 * @param   {boolean}   option.caseSensitive
 *
 * @return  {Array<object>}
 */
export const getHighLightTextHTML = ({
    sourceString = '',
    searchWords = [],
    option = { autoEscape: true, caseSensitive: false }
}: GetHighLightTextHTMLProps) => {
    const chunks: HighLightTextHTMLChunk[] = findAll({ sourceString, searchWords, ...option });
    const markEle = option.highlightTag || 'mark';
    const highlightClassName = option.highlightClassName || '';
    const highlightStyle = option.highlightStyle || {};
    return chunks.map((chunk: HighLightTextHTMLChunk) => {
        const { end, start, highlight } = chunk;
        const text = sourceString.substr(start, end - start);
        if (highlight) {
            return React.createElement(
                markEle,
                {
                    style: highlightStyle,
                    className: highlightClassName,
                },
                text
            );
        } else {
            return text;
        }
    });
};

export interface RegisterMediaQueryOption {
    match?: (e: MediaQueryList | MediaQueryListEvent) => void;
    unmatch?: (e: MediaQueryList | MediaQueryListEvent) => void;
    callInInit?: boolean;
}

/**
 * register matchFn and unMatchFn callback while media query
 * @param {string} media media string
 * @param {object} param param object
 * @returns function
 */
export const registerMediaQuery = (media: string, { match, unmatch, callInInit = true }: RegisterMediaQueryOption): () => void => {
    if (typeof window !== 'undefined') {
        const mediaQueryList = window.matchMedia(media);
        function handlerMediaChange(e: MediaQueryList | MediaQueryListEvent): void {
            if (e.matches) {
                match && match(e);
            } else {
                unmatch && unmatch(e);
            }
        }
        callInInit && handlerMediaChange(mediaQueryList);
        mediaQueryList.addEventListener('change', handlerMediaChange);
        return (): void => mediaQueryList.removeEventListener('change', handlerMediaChange);
    }
    return null;
};
export interface GetHighLightTextHTMLProps {
    sourceString?: string;
    searchWords?: any[];
    option: HighLightTextHTMLOption;
}

export interface HighLightTextHTMLOption {
    highlightTag?: string;
    highlightClassName?: string;
    highlightStyle?: Record<string, any>;
    caseSensitive: boolean;
    autoEscape: boolean;
}

export interface HighLightTextHTMLChunk {
    start?: number;
    end?: number;
    highlight?: any;
}

/**
 * Determine whether the incoming element is a built-in icon
 * @param icon 元素
 * @returns boolean
 */
export const isSemiIcon = (icon: any): boolean => React.isValidElement(icon) && get(icon.type, 'elementType') === 'Icon';
