/* eslint-disable no-param-reassign */
import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ToastListFoundation, {
    ToastListAdapter,
    ToastListProps,
    ToastListState
} from '@douyinfe/semi-foundation/toast/toastListFoundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/toast/constants';
import BaseComponent from '../_base/baseComponent';
import Toast from './toast';
import '@douyinfe/semi-foundation/toast/toast.scss';
import ToastTransition from './ToastTransition';
import getUuid from '@douyinfe/semi-foundation/utils/uuid';
import useToast from './useToast';
import { ConfigProps, ToastInstance, ToastProps, ToastState } from '@douyinfe/semi-foundation/toast/toastFoundation';
import { Motion } from '_base/base';

export { ToastTransitionProps } from './ToastTransition';
export interface ToastReactProps extends ToastProps{
    style?: CSSProperties;
    icon?: React.ReactNode;
    content: React.ReactNode;
}

export {
    ConfigProps,
    ToastListProps,
    ToastListState,
    ToastState
};

const createBaseToast = () => class ToastList extends BaseComponent<ToastListProps, ToastListState> {
    static ref: ToastList;
    static useToast: typeof useToast;
    static defaultOpts: ToastReactProps & { motion: Motion } = {
        motion: true,
        zIndex: 1010,
        content: '',
    };
    static propTypes = {
        content: PropTypes.node,
        duration: PropTypes.number,
        onClose: PropTypes.func,
        icon: PropTypes.node,
        direction: PropTypes.oneOf(strings.directions),
    };

    static defaultProps = {};
    static wrapperId: null | string;

    constructor(props: ToastListProps) {
        super(props);
        this.state = {
            list: [],
            removedItems: [],
        };
        this.foundation = new ToastListFoundation(this.adapter);
    }

    get adapter(): ToastListAdapter {
        return {
            ...super.adapter,
            updateToast: (list: ToastInstance[], removedItems: ToastInstance[]) => {
                this.setState({ list, removedItems });
            },
        };
    }

    static create(opts: ToastReactProps) {
        const id = getUuid('toast');
        // this.id = id;
        if (!ToastList.ref) {
            const div = document.createElement('div');
            if (!this.wrapperId) {
                this.wrapperId = getUuid('toast-wrapper').slice(0, 26);
            }
            div.className = cssClasses.WRAPPER;
            div.id = this.wrapperId;
            div.style.zIndex = String(typeof opts.zIndex === 'number' ?
                opts.zIndex : ToastList.defaultOpts.zIndex);
            ['top', 'left', 'bottom', 'right'].map(pos => {
                if (pos in ToastList.defaultOpts || pos in opts) {
                    const val = opts[pos] ? opts[pos] : ToastList.defaultOpts[pos];
                    div.style[pos] = typeof val === 'number' ? `${val}px` : val;
                }
            });
            // document.body.appendChild(div);
            if (ToastList.defaultOpts.getPopupContainer) {
                const container = ToastList.defaultOpts.getPopupContainer();
                container.appendChild(div);
            } else {
                document.body.appendChild(div);
            }
            ReactDOM.render(React.createElement(
                ToastList,
                { ref: instance => (ToastList.ref = instance) }
            ),
            div,
            () => {
                ToastList.ref.add({ ...opts, id });
            });
        } else {
            const node = document.querySelector(`#${this.wrapperId}`) as HTMLElement;
            ['top', 'left', 'bottom', 'right'].map(pos => {
                if (pos in opts) {
                    node.style[pos] = typeof opts[pos] === 'number' ? `${opts[pos]}px` : opts[pos];
                }
            });
            ToastList.ref.add({ ...opts, id });
        }
        return id;
    }

    static close(id: string) {
        if (ToastList.ref) {
            ToastList.ref.remove(id);
        }
    }

    static destroyAll() {
        if (ToastList.ref) {
            ToastList.ref.destroyAll();
            const wrapper = document.querySelector(`#${this.wrapperId}`);
            ReactDOM.unmountComponentAtNode(wrapper);
            wrapper && wrapper.parentNode.removeChild(wrapper);
            ToastList.ref = null;
            this.wrapperId = null;
        }
    }
    static getWrapperId() {
        return this.wrapperId;
    }
    static info(opts: Omit<ToastReactProps, 'type'> | string) {
        if (typeof opts === 'string') {
            opts = { content: opts };
        }
        return this.create({ ...ToastList.defaultOpts, ...opts, type: 'info' });
    }

    static warning(opts: Omit<ToastReactProps, 'type'> | string) {
        if (typeof opts === 'string') {
            opts = { content: opts };
        }
        return this.create({ ...ToastList.defaultOpts, ...opts, type: 'warning' });
    }

    static error(opts: Omit<ToastReactProps, 'type'> | string) {
        if (typeof opts === 'string') {
            opts = { content: opts };
        }
        return this.create({ ...ToastList.defaultOpts, ...opts, type: 'error' });
    }

    static success(opts: Omit<ToastReactProps, 'type'> | string) {
        if (typeof opts === 'string') {
            opts = { content: opts };
        }
        return this.create({ ...ToastList.defaultOpts, ...opts, type: 'success' });
    }

    static config(opts: ConfigProps) {
        ['top', 'left', 'bottom', 'right'].forEach(pos => {
            if (pos in opts) {
                ToastList.defaultOpts[pos] = opts[pos];
            }
        });

        if (typeof opts.zIndex === 'number') {
            ToastList.defaultOpts.zIndex = opts.zIndex;
        }
        if (typeof opts.duration === 'number') {
            ToastList.defaultOpts.duration = opts.duration;
        }
        if (typeof opts.getPopupContainer === 'function') {
            ToastList.defaultOpts.getPopupContainer = opts.getPopupContainer;
        }
    }

    add(opts: ToastInstance) {
        return this.foundation.addToast(opts);
    }

    remove(id: string) {
        return this.foundation.removeToast(id);
    }

    destroyAll() {
        return this.foundation.destroyAll();
    }

    render() {
        let { list } = this.state;
        const { removedItems } = this.state;
        list = Array.from(new Set([...list, ...removedItems]));

        return (
            <React.Fragment>
                {list.map((item, index) =>
                    (item.motion ? (
                        <ToastTransition key={item.id || index} motion={item.motion}>
                            {removedItems.find(removedItem => removedItem.id === item.id) ?
                                null :
                                transitionStyle => (
                                    <Toast
                                        {...item}
                                        style={{ ...transitionStyle, ...item.style }}
                                        close={id => this.remove(id)}
                                    />
                                )}
                        </ToastTransition>
                    ) : (
                        <Toast {...item} style={{ ...item.style }} close={id => this.remove(id)} />
                    ))
                )}
            </React.Fragment>
        );
    }


}


export class ToastFactory {
    static create(config?: ConfigProps): ReturnType<typeof createBaseToast> {
        const newToast = createBaseToast()
        newToast.useToast = useToast;
        config && newToast.config(config);
        return newToast;

    }
}
export default ToastFactory.create();
