import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../tooltip/index';
import { cssClasses } from '@douyinfe/semi-foundation/typography/constants';
import copy from 'copy-text-to-clipboard';
import cls from 'classnames';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import LocaleConsumer from '../locale/localeConsumer';
import { IconCopy, IconTick } from '@douyinfe/semi-icons';
import { BaseProps } from '../_base/baseComponent';
import { Locale } from '../locale/interface';
import isEnterPress from '@douyinfe/semi-foundation/utils/isEnterPress';

const prefixCls = cssClasses.PREFIX;
export interface CopyableProps extends BaseProps {
    content?: string;
    copyTip?: React.ReactNode;
    duration?: number;
    forwardRef?: React.RefObject<any>;
    successTip?: React.ReactNode;
    onCopy?: (e: React.MouseEvent, content: string, res: boolean) => void;
}
interface CopyableState {
    copied: boolean;
    item: string;
}
export class Copyable extends React.PureComponent<CopyableProps, CopyableState> {
    static propTypes = {
        content: PropTypes.string,
        onCopy: PropTypes.func,
        successTip: PropTypes.node,
        copyTip: PropTypes.node,
        duration: PropTypes.number,
        style: PropTypes.object,
        className: PropTypes.string,
    };

    static defaultProps = {
        content: '',
        onCopy: noop,
        duration: 3,
        style: {},
        className: '',
    };

    _timeId: ReturnType<typeof setTimeout>;

    constructor(props: CopyableProps) {
        super(props);
        this.state = {
            copied: false,
            item: '',
        };
    }

    componentWillUnmount() {
        if (this._timeId) {
            clearTimeout(this._timeId);
            this._timeId = null;
        }
    }

    copy = (e: React.MouseEvent) => {
        const { content, duration, onCopy } = this.props;
        const res = copy(content);
        onCopy && onCopy(e, content, res);
        this.setCopied(content, duration);
    };

    setCopied = (item: string, timer: number) => {
        this.setState({
            copied: true,
            item,
        });
        this._timeId = setTimeout(() => {
            this.resetCopied();
        }, timer * 1000);
    };

    resetCopied = () => {
        if (this._timeId) {
            clearTimeout(this._timeId);
            this._timeId = null;
            this.setState({
                copied: false,
                item: '',
            });
        }
    };

    renderSuccessTip = () => {
        const { successTip } = this.props;
        if (typeof successTip !== 'undefined') {
            return successTip;
        }
        return (
            <LocaleConsumer componentName="Typography">
                {(locale: Locale['Typography']) => (
                    <span>
                        <IconTick />
                        {locale.copied}
                    </span>
                )}
            </LocaleConsumer>
        );
    };

    render() {
        const { style, className, forwardRef, copyTip } = this.props;
        const { copied } = this.state;
        const finalCls = cls(className, {
            [`${prefixCls}-action-copy`]: !copied,
            [`${prefixCls}-action-copied`]: copied,
        });

        return (
            <LocaleConsumer componentName="Typography">
                {(locale: Locale['Typography']) => (
                    <span style={{ marginLeft: '4px', ...style }} className={finalCls} ref={forwardRef}>
                        {copied ? (
                            this.renderSuccessTip()
                        ) : (
                            <Tooltip content={typeof copyTip !== 'undefined' ? copyTip : locale.copy}>
                                {/* TODO: replace `a` tag with `span` in next major version
                                NOTE: may have effect on style */}
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a className={`${prefixCls}-action-copy-icon`}>
                                    <IconCopy
                                        role="button"
                                        tabIndex={0}
                                        onClick={this.copy}
                                        onKeyPress={e => isEnterPress(e) && this.copy(e as any)}
                                    />
                                </a>
                            </Tooltip>
                        )}
                    </span>
                )}
            </LocaleConsumer>
        );
    }
}

export default Copyable;
