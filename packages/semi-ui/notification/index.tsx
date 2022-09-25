import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ConfigContext, { ContextValue } from '../configProvider/context';
import NotificationListFoundation, {
    ConfigProps, NotificationListAdapter,
    NotificationListProps,
    NotificationListState
} from '@douyinfe/semi-foundation/notification/notificationListFoundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/notification/constants';
import Notice from './notice';
import BaseComponent from '../_base/baseComponent';
import '@douyinfe/semi-foundation/notification/notification.scss';
import NoticeTransition from './NoticeTransition';
import getUuid from '@douyinfe/semi-foundation/utils/uuid';
import useNotification from './useNotification';
import { NoticeInstance, NoticePosition, NoticeProps, NoticeState } from '@douyinfe/semi-foundation/notification/notificationFoundation';
// TODO: Automatic folding + unfolding function when there are more than N

export type { NoticeTransitionProps } from './NoticeTransition';
export interface NoticeReactProps extends NoticeProps{
    style?: CSSProperties;
}

export type {
    NoticeState,
    NotificationListProps,
    NotificationListState,
    ConfigProps
};

export type NoticesInPosition = { top: NoticeInstance[];
    topLeft: NoticeInstance[];
    topRight: NoticeInstance[];
    bottom: NoticeInstance[];
    bottomLeft: NoticeInstance[];
    bottomRight: NoticeInstance[];
};


let ref: NotificationList = null;
const defaultConfig = {
    duration: 3,
    position: 'topRight' as NoticePosition,
    motion: true,
    content: '',
    title: '',
    zIndex: 1010,
};

class NotificationList extends BaseComponent<NotificationListProps, NotificationListState> {
    static contextType = ConfigContext;
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        direction: PropTypes.oneOf(strings.directions),
    };
    static defaultProps = {};
    static useNotification: typeof useNotification;
    private static wrapperId: string;
    private noticeStorage: NoticeInstance[];
    private removeItemStorage: NoticeInstance[];


    constructor(props: NotificationListProps) {
        super(props);
        this.state = {
            notices: [],
            removedItems: [],
        };
        this.noticeStorage = [];
        this.removeItemStorage = [];

        this.foundation = new NotificationListFoundation(this.adapter);
    }

    context: ContextValue;

    get adapter(): NotificationListAdapter {
        return {
            ...super.adapter,
            updateNotices: (notices: NoticeInstance[], removedItems: NoticeInstance[] = []) => {
                this.noticeStorage = [...notices];
                this.removeItemStorage = [...removedItems];
                // setState is async sometimes and react often merges state, so use "this" , make sure other code always get right data.
                this.setState({ notices, removedItems });
            },
            getNotices: () => this.noticeStorage,
        };
    }

    static addNotice(notice: NoticeProps) {
        const id = getUuid('notification');
        if (!ref) {
            const { getPopupContainer } = notice;
            const div = document.createElement('div');
            if (!this.wrapperId) {
                this.wrapperId = getUuid('notification-wrapper').slice(0, 32);
            }
            div.className = cssClasses.WRAPPER;
            div.id = this.wrapperId;
            div.style.zIndex = String(typeof notice.zIndex === 'number' ? notice.zIndex : defaultConfig.zIndex);
            if (getPopupContainer) {
                const container = getPopupContainer();
                container.appendChild(div);
            } else {
                document.body.appendChild(div);
            }
            ReactDOM.render(React.createElement(NotificationList, { ref: instance => (ref = instance) }), div, () => {
                ref.add({ ...notice, id });
            });
        } else {
            ref.add({ ...notice, id });
        }
        return id;
    }

    static removeNotice(id: string) {
        if (ref) {
            ref.remove(id);
        }

        return id;
    }

    static info(opts: NoticeProps) {
        return this.addNotice({ ...defaultConfig, ...opts, type: 'info' });
    }

    static success(opts: NoticeProps) {
        return this.addNotice({ ...defaultConfig, ...opts, type: 'success' });
    }

    static error(opts: NoticeProps) {
        return this.addNotice({ ...defaultConfig, ...opts, type: 'error' });
    }

    static warning(opts: NoticeProps) {
        return this.addNotice({ ...defaultConfig, ...opts, type: 'warning' });
    }

    static open(opts: NoticeProps) {
        return this.addNotice({ ...defaultConfig, ...opts, type: 'default' });
    }

    static close(id: string) {
        return this.removeNotice(id);
    }

    static destroyAll() {
        if (ref) {
            ref.destroyAll();
            const wrapper = document.querySelector(`#${this.wrapperId}`);
            ReactDOM.unmountComponentAtNode(wrapper);
            wrapper && wrapper.parentNode.removeChild(wrapper);
            ref = null;
            this.wrapperId = null;
        }
    }

    static config(opts: ConfigProps) {
        ['top', 'left', 'bottom', 'right'].map(pos => {
            if (pos in opts) {
                defaultConfig[pos] = opts[pos];
            }
        });

        if (typeof opts.zIndex === 'number') {
            defaultConfig.zIndex = opts.zIndex;
        }
        if (typeof opts.duration === 'number') {
            defaultConfig.duration = opts.duration;
        }
        if (typeof opts.position === 'string') {
            defaultConfig.position = opts.position as NoticePosition;
        }
    }

    add = (noticeOpts: NoticeProps) => this.foundation.addNotice(noticeOpts);

    remove = (id: string | number) => {
        this.foundation.removeNotice(String(id));
    };

    destroyAll = () => this.foundation.destroyAll();

    renderNoticeInPosition = (
        notices: NoticeInstance[],
        position: NoticePosition,
        removedItems: NoticeInstance[] = []
    ) => {
        const className = cls(cssClasses.LIST);
        // TODO notifyOnClose
        if (notices.length) {
            const style = this.setPosInStyle(notices[0]);
            return (
                // @ts-ignore
                <div placement={position} key={position} className={className} style={style}>
                    {notices.map((notice, index) =>
                        (notice.motion ? (
                            <NoticeTransition key={notice.id || index} position={position} motion={notice.motion}>
                                {removedItems.find(item => item.id === notice.id) ?
                                    null :
                                    transitionStyle => (
                                        <Notice
                                            {...notice}
                                            style={{ ...transitionStyle, ...notice.style }}
                                            key={notice.id}
                                            close={this.remove}
                                        />
                                    )}
                            </NoticeTransition>
                        ) : (
                            <Notice {...notice} style={{ ...notice.style }} key={notice.id} close={this.remove} />
                        ))
                    )}
                </div>
            );
        }
        return null;
    };

    setPosInStyle(noticeInstance: NoticeInstance) {
        const style = {};
        ['top', 'left', 'bottom', 'right'].forEach(pos => {
            if (pos in noticeInstance) {
                const val = noticeInstance[pos];
                style[pos] = typeof val === 'number' ? `${val}px` : val;
            }
        });
        return style;
    }

    render() {
        let { notices } = this.state;
        const { removedItems } = this.state;
        notices = Array.from(new Set([...notices, ...removedItems]));
        const noticesInPosition: NoticesInPosition = {
            top: [],
            topLeft: [],
            topRight: [],
            bottom: [],
            bottomLeft: [],
            bottomRight: [],
        };
        notices.forEach(notice => {
            const direction = notice.direction || this.context.direction;
            const defaultPosition = direction === 'rtl' ? 'topLeft' : 'topRight';
            const position = notice.position || defaultPosition;
            noticesInPosition[position].push(notice);
        });
        const noticesList = Object.entries(noticesInPosition).map(obj => {
            const pos = obj[0];
            const noticesInPos = obj[1];
            return this.renderNoticeInPosition(noticesInPos, pos as NoticePosition, removedItems);
        });

        return <React.Fragment>{noticesList}</React.Fragment>;
    }


}

NotificationList.useNotification = useNotification;

export default NotificationList;
