import React from 'react';
import ReactDOM from 'react-dom';
import { destroyFns, ModalReactProps } from './Modal';
import ConfirmModal from './ConfirmModal';

import '@douyinfe/semi-foundation/modal/modal.scss';
import { IconAlertCircle, IconAlertTriangle, IconHelpCircle, IconInfoCircle, IconTickCircle } from '@douyinfe/semi-icons';

export interface ConfirmProps extends ModalReactProps {
    type: 'success' | 'info' | 'warning' | 'error' | 'confirm'
}

export default function confirm<T>(props: ConfirmProps) {
    // create a dom in adapter?
    const div = document.createElement('div');
    document.body.appendChild(div);

    let currentConfig = { ...props };

    const destroy = () => {
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
        }

        for (let i = 0; i < destroyFns.length; i++) {
            const fn = destroyFns[i];

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            if (fn === close) {
                destroyFns.splice(i, 1);
                break;
            }
        }
    };


    function render(renderProps: ConfirmProps) {
        ReactDOM.render(<ConfirmModal {...renderProps} motion={props.motion}/>, div);
    }

    function close() {
        currentConfig = {
            ...currentConfig,
            visible: false,
        };
        render(currentConfig);
    }

    function update(newConfig: T extends { type: Exclude<ConfirmProps['type'], 'confirm'> } ? ModalReactProps : ConfirmProps) {
        currentConfig = {
            ...currentConfig,
            ...newConfig,
        };
        render(currentConfig);
    }

    render(currentConfig);
    destroyFns.push(close);
    return {
        destroy: close,
        update,
    };
}


export function withInfo(props: ModalReactProps) {
    return {
        type: 'info' as const,
        icon: <IconInfoCircle/>,
        ...props
    };
}

export function withSuccess(props: ModalReactProps) {
    return {
        type: 'success' as const,
        icon: <IconTickCircle/>,
        ...props
    };
}

export function withWarning(props: ModalReactProps) {
    return {
        type: 'warning' as const,
        icon: <IconAlertTriangle/>,
        ...props
    };
}

export function withError(props: ModalReactProps) {
    return {
        type: 'error' as const,
        icon: <IconAlertCircle/>,
        ...props
    };
}

export function withConfirm(props: ModalReactProps) {
    return {
        type: 'confirm' as const,
        icon: <IconHelpCircle/>,
        ...props
    };
}
