import React, { useEffect, useRef } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import '../styles/ide.scss';

let runtime = null;
let autoImportComponent = () => void 0;
const ISSSR = typeof window === 'undefined';
export const ISIDE = !ISSSR && window.location.search?.includes('env=ide');

if (ISIDE) {
    const { callNative, createProxy, Runtime } = require('univers-webview');
    runtime = Runtime?.init({ isInIframe: false });
    autoImportComponent = createProxy('ImportCode', callNative)?.autoImportComponent;
}

const formatCode = (code, demoIndex) => {
    const codeArr = code.split('\n');
    const bodyArr = [];
    codeArr.forEach((str) => {
        if (!str.startsWith('export default')) {
            if (str.startsWith('() =>')) {
                str = str.replace('() =>', 'const Demo = () =>');
            }
            bodyArr.push(str);
        }
    });
    return {
        codeString: bodyArr.join('\n'),
        snippetString: '',
    };
};


/**
 * IDE plug-in related functions
 */
export const useIde = (props) => {
    const timer = useRef(null);
    const { wrapperRef } = props;

    const addSnippetsBtn = (demoIndex) => {
        const btnElm = document.createElement('div');
        const svgStr =
            '<svg fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" aria-hidden="true" focusable="false" class="arco-icon arco-icon-code"><path d="M43 22c0-7.732-6.492-14-14.5-14S14 14.268 14 22v.055A9.001 9.001 0 0 0 15 40h13m16.142-5.929-7.07 7.071L30 34.072M37.07 26v15"></path></svg>';
        btnElm.innerHTML = svgStr;
        btnElm.setAttribute('class', 'action-ide');
        btnElm.onclick = () => {
            const codeElem = wrapperRef?.current?.querySelectorAll('.gatsby-live-code-ide');
            if (codeElem?.length && codeElem[demoIndex + 1]) {
                Modal.confirm({
                    title: '插入 Demo 代码',
                    content: '确定在编辑器中插入当前 Demo 代码吗？',
                    onOk: () => {
                        const { codeString } = formatCode(codeElem[demoIndex]?.value || '');
                        autoImportComponent({ codeString, snippetString: '' });
                        const lineNum = codeString?.split('\n')?.length || 0;
                        runtime?.require('tea').behave('importCode-auxo', { num: lineNum });
                    }
                });
            }
        };
        return btnElm;
    };

    const setSandBoxVisible = () => {
        const actions = wrapperRef?.current?.querySelectorAll('.gatsby-live-code div[class^=index-module_actions__]');
        actions?.forEach((action, index) => {
            const snippetsBtn = addSnippetsBtn(index);
            action?.appendChild(snippetsBtn);
        });
    };

    useEffect(() => {
        timer.current = setTimeout(() => {
            ISIDE && setSandBoxVisible();
        }, 1000);

        return () => {
            clearTimeout(timer.current);
        };
    });
};