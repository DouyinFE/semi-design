import ReactDOM from 'react-dom';
import React from 'react';
import { omit } from 'lodash';

/**
 * The logic of JS for text truncation is referenced from antd typography
 * https://github.com/ant-design/ant-design/blob/master/components/typography/util.tsx
 * 
 * For more thinking and analysis about this function, please refer to Feishu document
 * https://bytedance.feishu.cn/docs/doccnqovjjyoKm2U5O13bj30aTh
 */

let ellipsisContainer: HTMLElement;

function pxToNumber(value: string) {
    if (!value) {
        return 0;
    }
    const match = value.match(/^\d*(\.\d*)?/);
    return match ? Number(match[0]) : 0;
}

function styleToString(style: CSSStyleDeclaration): string {
    // There are some different behavior between Firefox & Chrome.
    // We have to handle this ourself.
    const styleNames = Array.prototype.slice.apply(style);
    return styleNames.map((name: string) => `${name}: ${style.getPropertyValue(name)};`).join('');
}


const getRenderText = (
    originEle: HTMLElement,
    rows: number,
    content = '',
    fixedContent: {
        expand: Node;
        copy: Node
    },
    ellipsisStr: string,
    suffix: string,
    ellipsisPos: string
    // eslint-disable-next-line max-params
) => {
    if (content.length === 0) {
        return '';
    }
    if (!ellipsisContainer) {
        ellipsisContainer = document.createElement('div');
        ellipsisContainer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ellipsisContainer);
    }

    // Get origin style
    const originStyle = window.getComputedStyle(originEle);
    const originCSS = styleToString(originStyle);
    const lineHeight = pxToNumber(originStyle.lineHeight);
    const maxHeight = Math.round(
        lineHeight * (rows + 1) +
        pxToNumber(originStyle.paddingTop) +
        pxToNumber(originStyle.paddingBottom)
    );

    // Set shadow
    ellipsisContainer.setAttribute('style', originCSS);
    ellipsisContainer.style.position = 'fixed';
    ellipsisContainer.style.left = '0';
    ellipsisContainer.style.height = 'auto';
    ellipsisContainer.style.top = '-999999px';
    ellipsisContainer.style.zIndex = '-1000';

    // clean up css overflow
    ellipsisContainer.style.textOverflow = 'clip';
    ellipsisContainer.style.webkitLineClamp = 'none';

    // Render fake container
    ReactDOM.render(
        <></>,
        ellipsisContainer
    );

    // Check if ellipsis in measure div is height enough for content
    function inRange() {
        // console.log('inrange?', ellipsisContainer.scrollHeight, ellipsisContainer.scrollHeight < maxHeight)
        return ellipsisContainer.scrollHeight < maxHeight;
    }

    // ========================= Find match ellipsis content =========================
    // Create origin content holder
    const ellipsisContentHolder = document.createElement('span');
    const ellipsisTextNode = document.createTextNode(suffix);
    ellipsisContentHolder.appendChild(ellipsisTextNode);
    ellipsisContainer.appendChild(ellipsisContentHolder);
    let needTruncated = false;
    // Expand node needs to be added only when text needTruncated
    Object.values(omit(fixedContent, 'expand')).map(
        node => node && ellipsisContainer.appendChild(node.cloneNode(true))
    );
    // Append before fixed nodes
    function appendChildNode(node: ChildNode) {
        ellipsisContentHolder.insertBefore(node, ellipsisTextNode);
    }
    function appendExpandNode() {
        ellipsisContainer.innerHTML = '';
        ellipsisContainer.appendChild(ellipsisContentHolder);
        Object.values(fixedContent).map(node => node && ellipsisContainer.appendChild(node.cloneNode(true)));
    }

    function getCurrentText(text: string, pos: number) {
        const end = text.length;
        if (!pos) {
            return ellipsisStr;
        }
        if (ellipsisPos === 'end' || pos > end - pos) {
            return text.slice(0, pos) + ellipsisStr;
        }
        return text.slice(0, pos) + ellipsisStr + text.slice(end - pos, end);
    }

    // Get maximum text
    function measureText(
        textNode: Text,
        fullText: string,
        startLoc = 0,
        endLoc = fullText.length,
        lastSuccessLoc = 0
    ): string {
        // must truncate text, add expand wrapper if present
        if (endLoc < fullText.length && !needTruncated) {
            needTruncated = true;
            appendExpandNode();
        }
        const midLoc = Math.floor((startLoc + endLoc) / 2);
        const currentText = getCurrentText(fullText, midLoc);
        textNode.textContent = currentText;
        // console.log('calculating....', currentText);
        if (startLoc >= endLoc - 1 && endLoc > 0) { // Loop when step is small
            for (let step = endLoc; step >= startLoc; step -= 1) {
                const currentStepText = getCurrentText(fullText, step);
                textNode.textContent = currentStepText;
                if (inRange() || !currentStepText) {
                    return step === fullText.length ? fullText : currentStepText;
                }
            }
        } else if (endLoc === 0) {
            return ellipsisStr;
        }

        if (inRange()) {
            return measureText(textNode, fullText, midLoc, endLoc, midLoc);
        }
        return measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
    }

    const textNode = document.createTextNode(content);
    appendChildNode(textNode);
    const resText = measureText(textNode, content);
    ellipsisContainer.innerHTML = '';
    return resText;
};

export default getRenderText;