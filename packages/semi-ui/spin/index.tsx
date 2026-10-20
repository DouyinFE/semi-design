import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import BaseComponent from '../_base/baseComponent';
import { cssClasses as css, strings } from '@douyinfe/semi-foundation/spin/constants';
import SpinFoundation from '@douyinfe/semi-foundation/spin/foundation';
import SpinIcon from './icon';
import '@douyinfe/semi-foundation/spin/spin.scss';
import { getDefaultPropsFromGlobalConfig } from '../_utils';

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
    children?: React.ReactNode
}

interface SpinState {
    loading: boolean
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

    static __SemiComponentName__ = "Spin";

    static defaultProps = getDefaultPropsFromGlobalConfig(Spin.__SemiComponentName__, {
        size: 'middle',
        spinning: true,
        children: null,
        indicator: null,
        delay: 0,
    });

    constructor(props: SpinProps) {
        super(props);
        this.foundation = new SpinFoundation(this.adapter);

        this.state = {
            loading: Boolean(props.spinning && !props.delay),
        };
    }

    static getDerivedStateFromProps(props: SpinProps) {
        if (!props.delay || props.spinning === false) {
            return {
                loading: props.spinning
            };
        }
        return null;
    }

    get adapter() {
        return {
            ...super.adapter,
            setLoading: (value: boolean) => {
                this.setState({ loading: value });
            }
        };
    }

    componentDidMount() {
        this.foundation.updateLoadingIfNeedDelay();
    }

    componentDidUpdate(prevProps: SpinProps) {
        if (prevProps.spinning !== this.props.spinning || prevProps.delay !== this.props.delay) {
            this.foundation.updateLoadingIfNeedDelay();
        }
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    renderSpin() {
        const { indicator, tip } = this.props;
        const { loading } = this.state;

        return loading ? <div className={`${prefixCls}-wrapper`}>
            {indicator ? (
                <div className={`${prefixCls}-animate`} x-semi-prop="indicator">
                    {indicator}
                </div>
            ) : (
                <SpinIcon />
            )}
            {tip ? <div x-semi-prop="tip">{tip}</div> : null}
        </div> : null;
    }

    render() {
        const { children, style, wrapperClassName, childStyle, size, ...rest } = this.props;
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
            <div className={spinCls} style={style} {...this.getDataAttr(rest)}>
                {this.renderSpin()}
                <div className={`${prefixCls}-children`} style={childStyle} x-semi-prop="children">
                    {children}
                </div>
            </div>
        );
    }
}

export default Spin;
