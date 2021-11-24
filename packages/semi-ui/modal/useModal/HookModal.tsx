import React, { PropsWithChildren } from 'react';
import ConfirmModal from '../ConfirmModal';
import { get } from 'lodash-es';
import { ConfirmProps } from '../confirm';
import { Motion } from '../../_base/base';

interface HookModalProps {
    afterClose: (...args: any[]) => void;
    config: ConfirmProps;
    motion?: Motion;
}

export interface HookModalRef {
    destroy: () => void;
    update: (newConfig: ConfirmProps) => void
}

// eslint-disable-next-line max-len
const HookModal = ({ afterClose, config, ...props }: PropsWithChildren<HookModalProps>, ref: React.Ref<any>) => {
    const [innerConfig, setInnerConfig] = React.useState(config);

    React.useImperativeHandle(ref, () => ({
        destroy: () => {
            setInnerConfig(originConfig => ({
                ...originConfig,
                visible: false,
            }));
        },
        update: newConfig => {
            setInnerConfig(originConfig => ({
                ...originConfig,
                ...newConfig,
            }));
        },
    }));

    const { motion } = props;
    const mergedMotion =
        typeof motion === 'undefined' || motion ?
            {
                ...(motion as any),
                didLeave: (...args: any[]) => {
                    const didLeave = get(props.motion, 'didLeave');

                    if (typeof didLeave === 'function') {
                        didLeave(...args);
                    }
                    afterClose();
                },
            } :
            false;

    return (
        <ConfirmModal
            {...innerConfig}
            // visible={!visible ? visible : undefined}
            motion={mergedMotion}
        />
    );
};

export default React.forwardRef<HookModalRef, HookModalProps>(HookModal);
