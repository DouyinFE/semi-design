import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from '../_base/baseComponent';
import cls from 'classnames';
import ConfigContext from '../configProvider/context';
import { cssClasses, strings } from '@douyinfe/semi-foundation/rating/constants';
import PropTypes from 'prop-types';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import Item from './item';
import Tooltip from '../tooltip';
import RatingFoundation, { RatingAdapter } from '@douyinfe/semi-foundation/rating/foundation';

import '@douyinfe/semi-foundation/rating/rating.scss';

export { RatingItemProps } from './item';
export interface RatingProps {
    disabled?: boolean;
    value?: number;
    defaultValue?: number;
    count?: number;
    allowHalf?: boolean;
    allowClear?: boolean;
    style?: React.CSSProperties;
    prefixCls?: string;
    onChange?: (value: number) => void;
    onHoverChange?: (value: number) => void;
    className?: string;
    character?: React.ReactNode;
    tabIndex?: number;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onClick?: (e: React.MouseEvent | React.KeyboardEvent, index: number) => void;
    autoFocus?: boolean;
    size?: 'small' | 'default' | number;
    tooltips?: string[];
}

export interface RatingState {
    value: number;
    hoverValue: number;
    focused: boolean;
    clearedValue: number;
}

export default class Rating extends BaseComponent<RatingProps, RatingState> {
    static contextType = ConfigContext;
    static propTypes = {
        disabled: PropTypes.bool,
        value: PropTypes.number,
        defaultValue: PropTypes.number,
        count: PropTypes.number,
        allowHalf: PropTypes.bool,
        allowClear: PropTypes.bool,
        style: PropTypes.object,
        prefixCls: PropTypes.string,
        onChange: PropTypes.func,
        onHoverChange: PropTypes.func,
        className: PropTypes.string,
        character: PropTypes.node,
        tabIndex: PropTypes.number,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onKeyDown: PropTypes.func,
        autoFocus: PropTypes.bool,
        size: PropTypes.oneOfType([PropTypes.oneOf(strings.SIZE_SET), PropTypes.number]),
        tooltips: PropTypes.arrayOf(PropTypes.string),
    };

    static defaultProps = {
        defaultValue: 0,
        count: 5,
        allowHalf: false,
        allowClear: true,
        style: {},
        prefixCls: cssClasses.PREFIX,
        onChange: noop,
        onHoverChange: noop,
        tabIndex: 0,
        size: 'default' as const,
    };

    stars: Record<string, Item>;
    rate: HTMLUListElement = null;

    foundation: RatingFoundation;

    constructor(props: RatingProps) {
        super(props);
        const value = props.value === undefined ? props.defaultValue : props.value;
        this.stars = {};
        this.state = {
            value,
            focused: false,
            hoverValue: undefined,
            clearedValue: null,
        };

        this.foundation = new RatingFoundation(this.adapter);
    }

    static getDerivedStateFromProps(nextProps: RatingProps, state: RatingState) {
        if ('value' in nextProps && nextProps.value !== undefined) {
            return {
                ...state,
                value: nextProps.value,
            };
        }
        return state;
    }

    get adapter(): RatingAdapter<RatingProps, RatingState> {
        return {
            ...super.adapter,
            focus: () => {
                const { disabled } = this.props;
                if (!disabled) {
                    this.rate.focus();
                }
            },
            getStarDOM: (index: number) => {
                const instance = this.stars && this.stars[index];
                // eslint-disable-next-line react/no-find-dom-node
                return ReactDOM.findDOMNode(instance) as Element;
            },
            notifyHoverChange: (hoverValue: number, clearedValue: number) => {
                const { onHoverChange } = this.props;
                this.setState({
                    hoverValue,
                    clearedValue,
                });
                onHoverChange(hoverValue);
            },
            updateValue: (value: number) => {
                const { onChange } = this.props;
                if (!('value' in this.props)) {
                    this.setState({
                        value,
                    });
                }
                onChange(value);
            },
            clearValue: (clearedValue: number) => {
                this.setState({
                    clearedValue,
                });
            },
            notifyFocus: (e: React.FocusEvent) => {
                const { onFocus } = this.props;
                this.setState({
                    focused: true,
                });
                onFocus && onFocus(e);
            },
            notifyBlur: (e: React.FocusEvent) => {
                const { onBlur } = this.props;
                this.setState({
                    focused: false,
                });
                onBlur && onBlur(e);
            },
            notifyKeyDown: (e: React.KeyboardEvent) => {
                const { onKeyDown } = this.props;
                this.setState({
                    focused: false,
                });
                onKeyDown && onKeyDown(e);
            },
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    onHover = (event: React.MouseEvent, index: number) => {
        this.foundation.handleHover(event, index);
    };

    onMouseLeave = () => {
        this.foundation.handleMouseLeave();
    };

    onClick: RatingProps['onClick'] = (event, index) => {
        this.foundation.handleClick(event, index);
    };

    onFocus: RatingProps['onFocus'] = e => {
        this.foundation.handleFocus(e);
    };

    onBlur: RatingProps['onBlur'] = e => {
        this.foundation.handleBlur(e);
    };

    onKeyDown: RatingProps['onKeyDown'] = event => {
        const { value } = this.state;
        this.foundation.handleKeyDown(event, value);
    };

    focus = () => {
        const { disabled } = this.props;
        if (!disabled) {
            this.rate.focus();
        }
    };

    blur = () => {
        const { disabled } = this.props;
        if (!disabled) {
            this.rate.blur();
        }
    };

    saveRef = (index: number) => (node: Item) => {
        this.stars[index] = node;
    };

    saveRate = (node: HTMLUListElement) => {
        this.rate = node;
    };

    render() {
        const { count, allowHalf, style, prefixCls, disabled, className, character, tabIndex, size, tooltips } =
            this.props;
        const { value, hoverValue, focused } = this.state;
        const itemList = [...Array(count).keys()].map(ind => {
            const content = (
                <Item
                    ref={this.saveRef(ind)}
                    index={ind}
                    count={count}
                    prefixCls={`${prefixCls}-star`}
                    allowHalf={allowHalf}
                    value={hoverValue === undefined ? value : hoverValue}
                    onClick={this.onClick}
                    onHover={this.onHover}
                    key={ind}
                    disabled={disabled}
                    character={character}
                    focused={focused}
                    size={size}
                />
            );
            if (tooltips) {
                const text = tooltips[ind] ? tooltips[ind] : '';
                const showTips = hoverValue - 1 === ind;
                return (
                    <Tooltip visible={showTips} trigger="custom" content={text} key={`${ind}-${showTips}`}>
                        {content}
                    </Tooltip>
                );
            }
            return content;
        });
        const listCls = cls(
            prefixCls,
            {
                [`${prefixCls}-disabled`]: disabled,
            },
            className
        );
        return (
            <ul
                className={listCls}
                style={style}
                onMouseLeave={disabled ? null : this.onMouseLeave}
                tabIndex={disabled ? -1 : tabIndex}
                onFocus={disabled ? null : this.onFocus}
                onBlur={disabled ? null : this.onBlur}
                onKeyDown={disabled ? null : this.onKeyDown}
                ref={this.saveRate as any}
                role="radiogroup"
            >
                {itemList}
            </ul>
        );
    }
}
