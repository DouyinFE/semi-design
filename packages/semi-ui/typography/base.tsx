import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/typography/constants';
import Typography from './typography';
import Copyable from './copyable';
import { IconSize as Size } from '../icons/index';
import { isUndefined, omit, merge, isString } from 'lodash';
import Tooltip from '../tooltip/index';
import Popover from '../popover/index';
import getRenderText from './util';
import warning from '@douyinfe/semi-foundation/utils/warning';
import isEnterPress from '@douyinfe/semi-foundation/utils/isEnterPress';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';
import { Ellipsis, EllipsisPos, ShowTooltip, TypographyBaseSize, TypographyBaseType } from './interface';
import { CopyableConfig, LinkType } from './title';
import { BaseProps } from '../_base/baseComponent';
import { isSemiIcon } from '../_utils';

export interface BaseTypographyProps extends BaseProps {
    copyable?: CopyableConfig | boolean;
    delete?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    ellipsis?: Ellipsis | boolean;
    mark?: boolean;
    underline?: boolean;
    link?: LinkType;
    strong?: boolean;
    type?: TypographyBaseType;
    size?: TypographyBaseSize;
    style?: React.CSSProperties;
    className?: string;
    code?: boolean;
    children?: React.ReactNode;
    component?: React.ElementType;
    spacing?: string;
    heading?: string
}

interface BaseTypographyState {
    editable: boolean;
    copied: boolean;
    isOverflowed: boolean;
    ellipsisContent: React.ReactNode;
    expanded: boolean;
    isTruncated: boolean;
    prevChildren: React.ReactNode
}
const prefixCls = cssClasses.PREFIX;
const ELLIPSIS_STR = '...';

const wrapperDecorations = (props: BaseTypographyProps, content: React.ReactNode) => {
    const { mark, code, underline, strong, link, disabled } = props;
    let wrapped = content;
    const wrap = (isNeeded: boolean | LinkType, tag: string) => {
        let wrapProps = {};
        if (!isNeeded) {
            return;
        }
        if (typeof isNeeded === 'object') {
            wrapProps = { ...isNeeded };
        }
        wrapped = React.createElement(tag, wrapProps, wrapped);
    };
    wrap(mark, 'mark');
    wrap(code, 'code');
    wrap(underline && !link, 'u');
    wrap(strong, 'strong');
    wrap(props.delete, 'del');
    wrap(link, disabled ? 'span' : 'a');
    return wrapped;
};

export default class Base extends Component<BaseTypographyProps, BaseTypographyState> {
    static propTypes = {
        children: PropTypes.node,
        copyable: PropTypes.oneOfType([
            PropTypes.shape({
                text: PropTypes.string,
                onCopy: PropTypes.func,
                successTip: PropTypes.node,
                copyTip: PropTypes.node,
            }),
            PropTypes.bool,
        ]),
        delete: PropTypes.bool,
        disabled: PropTypes.bool,
        // editable: PropTypes.bool,
        ellipsis: PropTypes.oneOfType([
            PropTypes.shape({
                rows: PropTypes.number,
                expandable: PropTypes.bool,
                expandText: PropTypes.string,
                onExpand: PropTypes.func,
                suffix: PropTypes.string,
                showTooltip: PropTypes.oneOfType([
                    PropTypes.shape({
                        type: PropTypes.string,
                        opts: PropTypes.object,
                    }),
                    PropTypes.bool,
                ]),
                collapsible: PropTypes.bool,
                collapseText: PropTypes.string,
                pos: PropTypes.oneOf(['end', 'middle']),
            }),
            PropTypes.bool,
        ]),
        mark: PropTypes.bool,
        underline: PropTypes.bool,
        link: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        spacing: PropTypes.oneOf(strings.SPACING),
        strong: PropTypes.bool,
        size: PropTypes.oneOf(strings.SIZE),
        type: PropTypes.oneOf(strings.TYPE),
        style: PropTypes.object,
        className: PropTypes.string,
        icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        heading: PropTypes.string,
        component: PropTypes.string,
    };

    static defaultProps = {
        children: null as React.ReactNode,
        copyable: false,
        delete: false,
        disabled: false,
        // editable: false,
        ellipsis: false,
        icon: '',
        mark: false,
        underline: false,
        strong: false,
        link: false,
        type: 'primary',
        spacing: 'normal',
        size: 'normal',
        style: {},
        className: '',
    };

    wrapperRef: React.RefObject<any>;
    expandRef: React.RefObject<any>;
    copyRef: React.RefObject<any>;
    rafId: ReturnType<typeof requestAnimationFrame>;
    expandStr: string;
    collapseStr: string;

    constructor(props: BaseTypographyProps) {
        super(props);
        this.state = {
            editable: false,
            copied: false,
            // ellipsis
            // if text is overflow in container
            isOverflowed: true,
            ellipsisContent: props.children,
            expanded: false,
            // if text is truncated with js
            isTruncated: true,
            prevChildren: null,
        };
        this.wrapperRef = React.createRef();
        this.expandRef = React.createRef();
        this.copyRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.ellipsis) {
            this.getEllipsisState();
            window.addEventListener('resize', this.onResize);
        }
    }

    static getDerivedStateFromProps(props: BaseTypographyProps, prevState: BaseTypographyState) {
        const { prevChildren } = prevState;
        const newState: Partial<BaseTypographyState> = {};
        newState.prevChildren = props.children;

        if (props.ellipsis && prevChildren !== props.children) {
            // reset ellipsis state if children update
            newState.isOverflowed = true;
            newState.ellipsisContent = props.children;
            newState.expanded = false;
            newState.isTruncated = true;
        }
        return newState;
    }

    componentDidUpdate(prevProps: BaseTypographyProps) {
        // Render was based on outdated refs and needs to be rerun
        if (this.props.children !== prevProps.children) {
            this.forceUpdate();
            if (this.props.ellipsis) {
                this.getEllipsisState();
            }
        }
    }

    componentWillUnmount() {
        if (this.props.ellipsis) {
            window.removeEventListener('resize', this.onResize);
        }
        if (this.rafId) {
            window.cancelAnimationFrame(this.rafId);
        }
    }

    onResize = () => {
        if (this.rafId) {
            window.cancelAnimationFrame(this.rafId);
        }
        this.rafId = window.requestAnimationFrame(this.getEllipsisState.bind(this));
    };

    // if need to use js overflowed:
    // 1. text is expandable 2. expandText need to be shown  3. has extra operation 4. text need to ellipse from mid
    canUseCSSEllipsis = () => {
        const { copyable } = this.props;
        const { expandable, expandText, pos, suffix } = this.getEllipsisOpt();
        return !expandable && isUndefined(expandText) && !copyable && pos === 'end' && !suffix.length;
    };

    /**
     * whether truncated
     *  rows < = 1 if there is overflow content, return true
     *  rows > 1 if there is overflow height, return true
     * @param {Number} rows
     * @returns {Boolean}
     */
    shouldTruncated = (rows: number) => {
        if (!rows || rows < 1) {
            return false;
        }
        const updateOverflow =
            rows <= 1 ?
                this.wrapperRef.current.scrollWidth > this.wrapperRef.current.offsetWidth :
                this.wrapperRef.current.scrollHeight > this.wrapperRef.current.offsetHeight;
        return updateOverflow;
    };

    showTooltip = () => {
        const { isOverflowed, isTruncated, expanded } = this.state;
        const { showTooltip, expandable, expandText } = this.getEllipsisOpt();
        const overflowed = !expanded && (isOverflowed || isTruncated);
        const noExpandText = !expandable && isUndefined(expandText);
        const show = noExpandText && overflowed && showTooltip;
        if (!show) {
            return show;
        }
        const defaultOpts = {
            type: 'tooltip',
            opts: {},
        };
        if (typeof showTooltip === 'object') {
            if (showTooltip.type && showTooltip.type.toLowerCase() === 'popover') {
                return merge(
                    {
                        opts: {
                            style: { width: '240px' },
                            showArrow: true,
                        },
                    },
                    showTooltip
                );
            }
            return { ...defaultOpts, ...showTooltip };
        }
        return defaultOpts;
    };

    getEllipsisState() {
        const { rows, suffix, pos } = this.getEllipsisOpt();
        const { children } = this.props;
        // wait until element mounted
        if (!this.wrapperRef || !this.wrapperRef.current) {
            this.onResize();
            return false;
        }
        const { expanded } = this.state;
        const updateOverflow = this.shouldTruncated(rows);
        const canUseCSSEllipsis = this.canUseCSSEllipsis();

        if (!rows || rows < 0 || expanded) {
            return undefined;
        }

        if (canUseCSSEllipsis) {
            // isOverflowed needs to be updated to show tooltip when using css ellipsis
            this.setState({
                isOverflowed: updateOverflow,
                isTruncated: false
            });

            return undefined;
        }

        const extraNode = [this.expandRef.current, this.copyRef && this.copyRef.current];
        warning(
            'children' in this.props && typeof children !== 'string',
            "[Semi Typography] 'Only children with pure text could be used with ellipsis at this moment."
        );
        const content = getRenderText(
            ReactDOM.findDOMNode(this.wrapperRef.current) as HTMLElement,
            rows,
            children as string,
            extraNode,
            ELLIPSIS_STR,
            suffix,
            pos
        );
        this.setState({
            ellipsisContent: content,
            isOverflowed: updateOverflow,
            isTruncated: children !== content,
        });
        return undefined;
    }

    /**
     * Triggered when the fold button is clicked to save the latest expanded state
     * @param {Event} e
     */
    toggleOverflow = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const { onExpand, expandable, collapsible } = this.getEllipsisOpt();
        const { expanded } = this.state;
        onExpand && onExpand(!expanded, e);
        if ((expandable && !expanded) || (collapsible && expanded)) {
            this.setState({ expanded: !expanded });
        }
    };

    getEllipsisOpt = (): Ellipsis => {
        const { ellipsis } = this.props;
        if (!ellipsis) {
            return {};
        }
        const opt = {
            rows: 1,
            expandable: false,
            pos: 'end' as EllipsisPos,
            suffix: '',
            showTooltip: false,
            collapsible: false,
            expandText: (ellipsis as Ellipsis).expandable ? this.expandStr : undefined,
            collapseText: (ellipsis as Ellipsis).collapsible ? this.collapseStr : undefined,
            ...(typeof ellipsis === 'object' ? ellipsis : null),
        };
        return opt;
    };

    renderExpandable = () => {
        const { expanded, isTruncated } = this.state;
        if (!isTruncated) return null;

        const { expandText, expandable, collapseText, collapsible } = this.getEllipsisOpt();
        const noExpandText = !expandable && isUndefined(expandText);
        const noCollapseText = !collapsible && isUndefined(collapseText);
        let text;

        if (!expanded && !noExpandText) {
            text = expandText;
        } else if (expanded && !noCollapseText) {
            text = collapseText;
        }
        if (!noExpandText || !noCollapseText) {
            return (
                // TODO: replace `a` tag with `span` in next major version
                // NOTE: may have effect on style
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                    role="button"
                    tabIndex={0}
                    className={`${prefixCls}-ellipsis-expand`}
                    key="expand"
                    ref={this.expandRef}
                    aria-label={text}
                    onClick={this.toggleOverflow}
                    onKeyPress={e => isEnterPress(e) && this.toggleOverflow(e as any)}
                >
                    {text}
                </a>
            );
        }
        return null;
    };

    /**
     * 获取文本的缩略class和style
     *
     * 截断类型：
     *  - CSS 截断，仅在 rows=1 且没有 expandable、pos、suffix 时生效
     *  - JS 截断，应对 CSS 无法阶段的场景
     * 相关变量
     *  props:
     *      - ellipsis:
     *          - rows
     *          - expandable
     *          - pos
     *          - suffix
     *  state:
     *      - isOverflowed，文本是否处于overflow状态
     *      - expanded，文本是否处于折叠状态
     *      - isTruncated，文本是否被js截断
     *
     * Get the abbreviated class and style of the text
     *
     * Truncation type:
     *  -CSS truncation, which only takes effect when rows = 1 and there is no expandable, pos, suffix
     *  -JS truncation, dealing with scenarios where CSS cannot stage
     * related variables
     *  props:
     *      -ellipsis:
     *          -rows
     *          -expandable
     *          -pos
     *          -suffix
     *  state:
     *      -isOverflowed, whether the text is in an overflow state
     *      -expanded, whether the text is in a collapsed state
     *      -isTruncated, whether the text is truncated by js
     * @returns {Object}
     */
    getEllipsisStyle = () => {
        const { ellipsis } = this.props;
        const { expandable } = this.getEllipsisOpt();
        if (!ellipsis) {
            return {
                ellipsisCls: '',
                ellipsisStyle: {},
                // ellipsisAttr: {}
            };
        }
        const { rows } = this.getEllipsisOpt();
        const { expanded } = this.state;
        const useCSS = !expanded && this.canUseCSSEllipsis();
        const ellipsisCls = cls({
            [`${prefixCls}-ellipsis`]: true,
            [`${prefixCls}-ellipsis-single-line`]: rows === 1,
            [`${prefixCls}-ellipsis-multiple-line`]: rows > 1,
            [`${prefixCls}-ellipsis-overflow-ellipsis`]: rows === 1 && useCSS,
        });
        const ellipsisStyle = useCSS && rows > 1 ? { WebkitLineClamp: rows } : {};
        return {
            ellipsisCls,
            ellipsisStyle,
        };
    };

    renderEllipsisText = (opt: Ellipsis) => {
        const { suffix } = opt;
        const { children } = this.props;
        const { isTruncated, expanded, ellipsisContent } = this.state;
        if (expanded || !isTruncated) {
            return (
                <>
                    {children}
                    {suffix && suffix.length ? suffix : null}
                </>
            );
        }
        return (
            <span>
                {ellipsisContent}
                {/* {ELLIPSIS_STR} */}
                {suffix}
            </span>
        );
    };

    renderOperations() {
        return (
            <>
                {this.renderExpandable()}
                {this.renderCopy()}
            </>
        );
    }

    renderCopy() {
        const { copyable, children } = this.props;
        if (!copyable) {
            return null;
        }
        let copyContent: string;
        let hasObject = false;
        if (Array.isArray(children)) {
            copyContent = '';
            children.forEach(value => {
                if (typeof value === 'object') {
                    hasObject = true;
                }
                copyContent += String(value);
            });
        } else if (typeof children !== 'object') {
            copyContent = String(children);
        } else {
            hasObject = true;
            copyContent = String(children);
        }

        warning(
            hasObject,
            'Children in Typography is a object, it will case a [object Object] mistake when copy to clipboard.'
        );
        const copyConfig = {
            content: copyContent,
            duration: 3,
            ...(typeof copyable === 'object' ? copyable : null),
        };
        return <Copyable {...copyConfig} forwardRef={this.copyRef} />;
    }

    renderIcon() {
        const { icon, size } = this.props;
        if (!icon) {
            return null;
        }
        const iconSize: Size = size === 'small' ? 'small' : 'default';
        return (
            <span className={`${prefixCls}-icon`} x-semi-prop="icon">
                {isSemiIcon(icon) ? React.cloneElement((icon as React.ReactElement), { size: iconSize }) : icon}
            </span>
        );
    }

    renderContent() {
        const {
            component,
            children,
            className,
            type,
            spacing,
            disabled,
            style,
            ellipsis,
            icon,
            size,
            link,
            heading,
            ...rest
        } = this.props;
        const textProps = omit(rest, [
            'strong',
            'editable',
            'mark',
            'copyable',
            'underline',
            'code',
            // 'link',
            'delete',
        ]);
        const iconNode = this.renderIcon();
        const ellipsisOpt = this.getEllipsisOpt();
        const { ellipsisCls, ellipsisStyle } = this.getEllipsisStyle();
        let textNode = ellipsis ? this.renderEllipsisText(ellipsisOpt) : children;
        const linkCls = cls({
            [`${prefixCls}-link-text`]: link,
            [`${prefixCls}-link-underline`]: this.props.underline && link,
        });
        textNode = wrapperDecorations(
            this.props,
            <>
                {iconNode}
                {this.props.link ? <span className={linkCls}>{textNode}</span> : textNode}
            </>
        );
        const hTagReg = /^h[1-6]$/;
        const wrapperCls = cls(className, ellipsisCls, {
            // [`${prefixCls}-primary`]: !type || type === 'primary',
            [`${prefixCls}-${type}`]: type && !link,
            [`${prefixCls}-${size}`]: size,
            [`${prefixCls}-link`]: link,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-${spacing}`]: spacing,
            [`${prefixCls}-${heading}`]: isString(heading) && hTagReg.test(heading),
        });
        return (
            <Typography
                className={wrapperCls}
                style={{ ...style, ...ellipsisStyle }}
                component={component}
                forwardRef={this.wrapperRef}
                {...textProps}
            >
                {textNode}
                {this.renderOperations()}
            </Typography>
        );
    }

    renderTipWrapper() {
        const { children } = this.props;
        const showTooltip = this.showTooltip();
        const content = this.renderContent();
        if (showTooltip) {
            const { type, opts } = showTooltip as ShowTooltip;
            if (type.toLowerCase() === 'popover') {
                return (
                    <Popover content={children} position="top" {...opts}>
                        {content}
                    </Popover>
                );
            }
            return (
                <Tooltip content={children} position="top" {...opts}>
                    {content}
                </Tooltip>
            );
        } else {
            return content;
        }
    }

    render() {
        return (
            <LocaleConsumer componentName="Typography">
                {(locale: Locale['Typography']) => {
                    this.expandStr = locale.expand;
                    this.collapseStr = locale.collapse;
                    return this.renderTipWrapper();
                }}
            </LocaleConsumer>
        );
    }
}
