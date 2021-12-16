import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import BaseComponent from '../_base/baseComponent';
import { cssClasses as css, strings } from '@douyinfe/semi-foundation/spin/constants';
import SpinFoundation from '@douyinfe/semi-foundation/spin/foundation';
import SpinIcon from './icon';
import '@douyinfe/semi-foundation/spin/spin.scss';

const prefixCls = css.PREFIX;

export type SpinSize = 'small' | 'large' | 'middle';

export interface SpinProps {
    size?: SpinSize;
    spinning?: boolean;
    indicator?: React.ReactNode;
    delay?: number;
    tip?: React.ReactNode;
    wrapperClassName?: string;
    style?: React.CSSProperties;
    childStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

interface SpinState {
    delay: number;
    loading: boolean;
}
class Spin extends BaseComponent<SpinProps, SpinState> {
    static propTypes = {
        size: PropTypes.oneOf(strings.SIZE),
        spinning: PropTypes.bool,
        children: PropTypes.node,
        indicator: PropTypes.node,
        delay: PropTypes.number,
        tip: PropTypes.node,
        wrapperClassName: PropTypes.string,
        childStyle: PropTypes.object,
        style: PropTypes.object,
    };

    static defaultProps: SpinProps = {
        size: 'middle',
        spinning: true,
        children: null,
        indicator: null,
        delay: 0,
    };

    constructor(props: SpinProps) {
        super(props);
        this.foundation = new SpinFoundation(this.adapter);

        this.state = {
            delay: props.delay,
            loading: true,
        };
    }

    static getDerivedStateFromProps(props: SpinProps) {
        if (!props.delay) {
            return {
                loading: props.spinning
            };
        }
        if (props.spinning === false) {
            return {
                delay: 0,
                loading: false
            };
        }
        return {
            delay: props.delay
        };
    }

    get adapter() {
        return {
            ...super.adapter,
            setLoading: (value: boolean) => {
                this.setState({ loading: value });
            }
        };
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    renderSpin() {
        const { indicator, tip } = this.props;
        const { loading } = this.state;
        const spinIconCls = cls({
            [`${prefixCls}-animate`]: loading,
        });

        return (
            loading ? (
                <div className={`${prefixCls}-wrapper`}>
                    {indicator ? <div className={spinIconCls}>{indicator}</div> : <SpinIcon />}
                    {tip ? <div>{tip}</div> : null}
                </div>
            ) : null
        );
    }

    render() {
        this.foundation.updateLoadingIfNeedDelay();
        const { children, style, wrapperClassName, childStyle, size } = this.props;
        const { loading } = this.state;
        const spinCls = cls(
            prefixCls,
            wrapperClassName,
            {
                [`${prefixCls}-${size}`]: size,
                [`${prefixCls}-block`]: children,
                [`${prefixCls}-hidden`]: !loading,
            }
        );

        return (
            <div className={spinCls} style={style}>
                {this.renderSpin()}
                <div className={`${prefixCls}-children`} style={childStyle}>{children}</div>
            </div>
        );
    }
}

export default Spin;
