import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ConfigContext, { ContextValue } from '../configProvider/context';
import '@douyinfe/semi-foundation/_portal/portal.scss';

export interface PortalProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    prefixCls?: string;
    className?: string;
    getPopupContainer?: () => HTMLElement;
    didUpdate?: (props: PortalProps) => void;
}

export interface PortalState {
    container: undefined | HTMLElement;
}

const defaultGetContainer = () => document.body;
class Portal extends PureComponent<PortalProps, PortalState> {
    static contextType = ConfigContext;

    static defaultProps = {
        // getPopupContainer: () => document.body,
        prefixCls: `${BASE_CLASS_PREFIX}-portal`,
    };

    static propTypes = {
        children: PropTypes.node,
        prefixCls: PropTypes.string,
        getPopupContainer: PropTypes.func,
        className: PropTypes.string,
        didUpdate: PropTypes.func,
    };

    el: HTMLElement;
    context: ContextValue;
    constructor(props: PortalProps) {
        super(props);
        try {
            this.el = document.createElement('div');
        } catch (e) {
        }
        this.state = {
            container: undefined
        };
    }

    componentDidMount() {
        if (!this.el) {
            this.el = document.createElement('div');
        }
        const { state, props, context } = this;
        const getContainer = props.getPopupContainer || context.getPopupContainer || defaultGetContainer;
        const container = getContainer();
        if (container !== state.container) {
            // const computedStyle = window.getComputedStyle(container);
            // if (computedStyle.position !== 'relative') {
            //    container.style.position = 'relative';
            // }
            container.appendChild(this.el);
            this.addStyle(props.style);
            this.addClass(props.prefixCls, props.className);
            this.setState({ container });
        }
    }

    componentDidUpdate(prevProps: PortalProps) {
        // visible callback
        const { didUpdate } = this.props;
        if (didUpdate) {
            didUpdate(prevProps);
        }
    }

    componentWillUnmount() {
        const { container } = this.state;
        if (container) {
            container.removeChild(this.el);
        }
    }

    addStyle = (style = {}) => {
        if (this.el) {
            for (const key of Object.keys(style)) {
                this.el.style[key] = style[key];
            }
        }
    };

    addClass = (prefixCls: string, ...classNames: string[]) => {
        const { direction } = this.context;
        const cls = classnames(prefixCls, ...classNames, {
            [`${prefixCls}-rtl`]: direction === 'rtl'
        });
        if (this.el) {
            this.el.className = cls;
        }
    };

    render() {
        const { state, props } = this;
        if (state.container) {
            return createPortal(props.children, this.el);
        }
        return null;
    }
}

export default Portal;
