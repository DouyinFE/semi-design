import React, { ReactNode } from 'react';
import HookModal, { HookModalRef } from './HookModal';
import { ConfirmProps, withConfirm, withError, withInfo, withSuccess, withWarning } from '../confirm';
import { ModalReactProps } from '../Modal';

let uuid = 0;

function usePatchElement(): ([ReactNode[], (element: ReactNode) => () => void]) {
    const [elements, setElements] = React.useState<ReactNode[]>([]);

    function patchElement(element: ReactNode) {
        setElements(originElements => [...originElements, element]);

        return () => {
            setElements(originElements => originElements.filter(ele => ele !== element));
        };
    }

    return [elements, patchElement];
}

export default function useModal() {
    const [elements, patchElement] = usePatchElement();

    // eslint-disable-next-line max-len
    function getConfirmFunc(withFunc: (typeof withConfirm | typeof withInfo | typeof withSuccess | typeof withError | typeof withWarning)) {
        return function hookConfirm(config: ModalReactProps) {
            uuid += 1;

            const modalRef = React.createRef<HookModalRef>();

            // eslint-disable-next-line prefer-const
            let closeFunc: () => void;
            const modal = (
                <HookModal
                    key={`semi-modal-${uuid}`}
                    config={withFunc(config)}
                    ref={modalRef}
                    afterClose={() => {
                        closeFunc();
                    }}
                />
            );

            closeFunc = patchElement(modal);

            return {
                destroy: () => {
                    if (modalRef.current) {
                        modalRef.current.destroy();
                    }
                },
                update: (newConfig: ConfirmProps) => {
                    if (modalRef.current) {
                        modalRef.current.update(newConfig);
                    }
                },
            };
        };
    }

    return [
        {
            info: getConfirmFunc(withInfo),
            success: getConfirmFunc(withSuccess),
            error: getConfirmFunc(withError),
            warning: getConfirmFunc(withWarning),
            confirm: getConfirmFunc(withConfirm),
        },
        <>{elements}</>,
    ];
}
