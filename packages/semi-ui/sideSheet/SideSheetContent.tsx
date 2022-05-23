import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/sideSheet/constants';
import Button from '../iconButton';
import { noop } from 'lodash';
import { IconClose } from '@douyinfe/semi-icons';

let uuid = 0;
const prefixCls = cssClasses.PREFIX;


export interface SideSheetContentProps {
    onClose?: (e: React.MouseEvent) => void;
    mask?: boolean;
    maskStyle?: CSSProperties;
    maskClosable?: boolean;
    title?: React.ReactNode;
    closable?: boolean;
    headerStyle?: CSSProperties;
    width: CSSProperties['width'];
    height: CSSProperties['height'];
    style: CSSProperties;
    bodyStyle?: CSSProperties;
    className: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    'aria-label'?: string;
}

export default class SideSheetContent extends React.PureComponent<SideSheetContentProps> {
    static propTypes = {
        onClose: PropTypes.func,
    };

    static defaultProps = {
        onClose: noop,
    };
    private sideSheetId: string;
    private timeoutId: number;

    componentDidMount() {
        this.sideSheetId = `sidesheet-${uuid++}`;
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
    }

    onMaskClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            this.close(e);
        }
    };

    close = (e: React.MouseEvent) => {
        const { onClose } = this.props;
        onClose && onClose(e);
    };


    getMaskElement() {
        const {
            mask,
            maskStyle,
            maskClosable,
        } = this.props;
        if (mask) {
            return (
                <div
                    aria-hidden={true}
                    key="mask"
                    className={`${prefixCls}-mask`}
                    style={maskStyle}
                    onClick={maskClosable ? this.onMaskClick : null}
                />
            );
        }
        return null;
    }

    renderHeader() {
        const {
            title,
            closable,
            headerStyle,
        } = this.props;
        let header, closer;
        if (title) {
            header = (
                <div className={`${prefixCls}-title`}>
                    {this.props.title}
                </div>
            );
        }
        if (closable) {
            closer = (
                <Button
                    className={`${prefixCls}-close`}
                    key="close-btn"
                    onClick={this.close}
                    type="tertiary"
                    icon={<IconClose/>}
                    theme="borderless"
                    size="small"
                />
            );
        }
        return (
            <div className={`${prefixCls}-header`} role={'heading'} aria-level={1} style={{ ...headerStyle }}>
                {header}
                {closer}
            </div>
        );
    }

    getDialogElement() {
        const { ...props } = this.props;
        const style: CSSProperties = {};
        if (props.width) {
            style.width = props.width;
            // When the mask is false, the width is set on the wrapper. At this time, sidesheet-inner does not need to set the width again, otherwise, the percentage will be accumulated repeatedly when the width is a percentage
            if (!props.mask) {
                style.width = '100%';
            }
        }
        if (props.height) {
            style.height = props.height;
        }
        const header = this.renderHeader();
        const dialogElement = (
            <div
                key="dialog-element"
                role="dialog"
                tabIndex={-1}
                className={`${prefixCls}-inner ${prefixCls}-inner-wrap`}
                // onMouseDown={this.onDialogMouseDown}
                style={{ ...props.style, ...style }}
                // id={this.dialogId}
            >
                <div className={`${prefixCls}-content`}>
                    {header}
                    <div className={`${prefixCls}-body`} style={props.bodyStyle}>
                        {props.children}
                    </div>
                    {props.footer ? (
                        <div className={`${prefixCls}-footer`}>
                            {props.footer}
                        </div>
                    ) : null}
                </div>
            </div>
        );
        return dialogElement;
    }

    render() {
        const {
            mask,
            className,
            width,
        } = this.props;
        const wrapperCls = cls(className, {
            [`${prefixCls}-fixed`]: !mask,
        });
        const wrapperStyle: CSSProperties = {};
        if (!mask && width) {
            wrapperStyle.width = width;
        }
        return (
            <div className={wrapperCls} style={wrapperStyle}>
                {this.getMaskElement()}
                {this.getDialogElement()}
            </div>
        );
    }
}
