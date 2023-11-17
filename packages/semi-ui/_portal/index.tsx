import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ConfigContext, { ContextValue } from '../configProvider/context';
import '@douyinfe/semi-foundation/_portal/portal.scss';

export interface PortalProps {
    children: React.ReactNode;
    prefixCls?: string;
    /**
     * @deprecated
     * Prefer using `initStyle` due to non-reactive constraints.
     * For compatibility, `style` and `initStyle` will be merged by `Object.assign({}, style, initStyle)`
     */
    style?: React.CSSProperties;
    initStyle?: React.CSSProperties;
    className?: string;

    /**
     * Only called at `constructor` and `componentDidMount`
     */
    getPopupContainer?: () => HTMLElement;
    didUpdate?: (props: PortalProps) => void
}

export interface PortalState {
    container: undefined | HTMLElement
}

const defaultGetContainer = () => document.body;

const createEl = (initStyle: React.CSSProperties = {}) => {
    const el = document.createElement('div');

    for (const key of Object.keys(initStyle)) {
        el.style[key] = initStyle[key];
    }

    return el;
};

class Portal extends PureComponent<PortalProps, PortalState> {
    static contextType = ConfigContext;

    static defaultProps = {
        // getPopupContainer: () => document.body,
        prefixCls: `${BASE_CLASS_PREFIX}-portal`,
    };

    static propTypes = {
        children: PropTypes.node,
        prefixCls: PropTypes.string,
        style: PropTypes.object,
        initStyle: PropTypes.object,
        className: PropTypes.string,

        getPopupContainer: PropTypes.func,
        didUpdate: PropTypes.func,
    };

    el: HTMLElement;
    context: ContextValue;

    constructor(props: PortalProps, context: ContextValue) {
        super(props);
        /**
         * Unlike other implementations, we initize `container` and `el` immediately to get children's refs in this tick.
         * See issue: https://github.com/DouyinFE/semi-design/issues/1703
         * 
         * We only append `el` to `container` at `componentDidMount` to fix react18 strict mode error.
         */
        this.state = {
            container: this.getContainer(context)
        };
        this.el = createEl(Object.assign({}, props.style, props.initStyle));
    }

    componentDidMount() {
        const container = this.getContainer();
        if (this.el.parentElement !== container) {
            if (container) {
                container.appendChild(this.el);
                this.setState({ container });
            } else {
                this.el.parentElement?.removeChild(this.el);
            }

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

    private getContainer(context: ContextValue = this.context) {
        const getContainer = this.props.getPopupContainer || context.getPopupContainer || defaultGetContainer;
        const container = getContainer();
        return container;
    }

    private patchClassNameToEl() {
        if (!this.el) {
            return;
        }

        const { prefixCls, className } = this.props;
        const { direction } = this.context;

        const cls = classnames(
            prefixCls,
            className,
            {
                [`${prefixCls}-rtl`]: direction === 'rtl'
            }
        );

        this.el.className = cls;
    }

    render() {
        const container = this.state.container;
        if (!container) {
            return null;
        }

        this.patchClassNameToEl();

        return createPortal(this.props.children, this.el);
    }
}

export default Portal;
