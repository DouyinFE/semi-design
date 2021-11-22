/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, get } from 'lodash-es';

import ConfigContext from '../configProvider/context';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import { strings, cssClasses } from '@douyinfe/semi-foundation/timePicker/constants';
import Popover from '../popover';
import { numbers as popoverNumbers } from '@douyinfe/semi-foundation/popover/constants';
import TimePickerFoundation, { TimePickerAdapter } from '@douyinfe/semi-foundation/timePicker/foundation';
import isNullOrUndefined from '@douyinfe/semi-foundation/utils/isNullOrUndefined';
import Combobox from './Combobox';
import TimeInput from './TimeInput';

import { PanelShape, PanelShapeDefaults } from './PanelShape';
import { TimeShape } from './TimeShape';

import '@douyinfe/semi-foundation/timePicker/timePicker.scss';
import Trigger from '../trigger';

import { InputSize } from '../input';
import { Position } from '../tooltip';
import { ScrollItemProps } from '../scrollList/scrollItem';
import { Locale } from '../locale/interface';
import { Motion } from '../_base/base';

export interface Panel {
    panelHeader?: React.ReactNode;
    panelFooter?: React.ReactNode;
}

export type BaseValueType = string | number | Date;

export type Type = 'time' | 'timeRange';

export type TimePickerProps = {
    autoAdjustOverflow?: boolean;
    autoFocus?: boolean; // TODO: autoFocus did not take effect
    className?: string;
    clearText?: string;
    dateFnsLocale?: Locale['dateFnsLocale'];
    defaultOpen?: boolean;
    defaultValue?: BaseValueType | BaseValueType[];
    disabled?: boolean;
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    focusOnOpen?: boolean;
    format?: string;
    getPopupContainer?: () => HTMLElement;
    hideDisabledOptions?: boolean;
    hourStep?: number;
    id?: string;
    inputReadOnly?: boolean;
    inputStyle?: React.CSSProperties;
    insetLabel?: React.ReactNode;
    locale?: Locale['TimePicker'];
    localeCode?: string;
    minuteStep?: number;
    motion?: Motion;
    open?: boolean;
    panelFooter?: React.ReactNode;
    panelHeader?: React.ReactNode;
    panels?: Panel[]; // FIXME:
    placeholder?: string;
    popupClassName?: string;
    popupStyle?: React.CSSProperties;
    position?: Position;
    prefixCls?: string;
    rangeSeparator?: string;
    scrollItemProps?: ScrollItemProps;
    secondStep?: number;
    showClear?: boolean;
    size?: InputSize;
    style?: React.CSSProperties;
    timeZone?: string | number;
    triggerRender?: (props?: any) => React.ReactNode;
    type?: Type;
    use12Hours?: boolean;
    validateStatus?: ValidateStatus;
    value?: BaseValueType | BaseValueType[];
    zIndex?: number | string;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: TimePickerAdapter['notifyChange'];
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onOpenChange?: (open: boolean) => void;
};

export interface TimePickerState {
    open: boolean;
    value: Date[];
    inputValue: string;
    currentSelectPanel: string | number;
    isAM: [boolean, boolean];
    showHour: boolean;
    showMinute: boolean;
    showSecond: boolean;
    invalid: boolean;
}


export default class TimePicker extends BaseComponent<TimePickerProps, TimePickerState> {
    static contextType = ConfigContext;
    static propTypes = {
        prefixCls: PropTypes.string,
        clearText: PropTypes.string,
        value: TimeShape,
        inputReadOnly: PropTypes.bool,
        disabled: PropTypes.bool,
        showClear: PropTypes.bool,
        defaultValue: TimeShape,
        open: PropTypes.bool,
        defaultOpen: PropTypes.bool,
        onOpenChange: PropTypes.func,
        position: PropTypes.any,
        getPopupContainer: PropTypes.func,
        placeholder: PropTypes.string,
        format: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        popupClassName: PropTypes.string,
        popupStyle: PropTypes.object,
        disabledHours: PropTypes.func,
        disabledMinutes: PropTypes.func,
        disabledSeconds: PropTypes.func,
        hideDisabledOptions: PropTypes.bool,
        onChange: PropTypes.func,
        use12Hours: PropTypes.bool,
        hourStep: PropTypes.number,
        minuteStep: PropTypes.number,
        secondStep: PropTypes.number,
        focusOnOpen: PropTypes.bool,
        autoFocus: PropTypes.bool,
        size: PropTypes.oneOf(strings.SIZE),
        panels: PropTypes.arrayOf(PropTypes.shape(PanelShape)),
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        locale: PropTypes.object,
        localeCode: PropTypes.string,
        dateFnsLocale: PropTypes.object,
        zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        insetLabel: PropTypes.node,
        validateStatus: PropTypes.oneOf(strings.STATUS),
        type: PropTypes.oneOf<TimePickerProps['type']>(strings.TYPES),
        rangeSeparator: PropTypes.string,
        triggerRender: PropTypes.func,
        timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        scrollItemProps: PropTypes.object,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
        autoAdjustOverflow: PropTypes.bool,
        ...PanelShape,
        inputStyle: PropTypes.object,
    };

    static defaultProps = {
        autoAdjustOverflow: true,
        getPopupContainer: () => document.body,
        showClear: true,
        zIndex: popoverNumbers.DEFAULT_Z_INDEX,
        rangeSeparator: strings.DEFAULT_RANGE_SEPARATOR,
        onOpenChange: noop,
        clearText: 'clear',
        prefixCls: cssClasses.PREFIX,
        inputReadOnly: false,
        style: {},
        className: '',
        popupClassName: '',
        popupStyle: { left: '0px', top: '0px' },
        disabledHours: () => [] as number[],
        disabledMinutes: () => [] as number[],
        disabledSeconds: () => [] as number[],
        hideDisabledOptions: false,
        // position: 'bottomLeft',
        onFocus: noop,
        onBlur: noop,
        onChange: noop,
        use12Hours: false,
        focusOnOpen: false,
        onKeyDown: noop,
        size: 'default' as const,
        type: strings.DEFAULT_TYPE,
        ...PanelShapeDefaults,
        // format: strings.DEFAULT_FORMAT,
        // open and value controlled
    };

    foundation: TimePickerFoundation;
    timePickerRef: React.MutableRefObject<HTMLDivElement>;
    savePanelRef: React.RefObject<HTMLDivElement>;

    clickOutSideHandler: (e: MouseEvent) => void;


    constructor(props: TimePickerProps) {
        super(props);
        const { format = strings.DEFAULT_FORMAT } = props;

        this.state = {
            open: props.open || props.defaultOpen || false,
            value: [], // Date[]
            inputValue: '', // time string
            currentSelectPanel: 0,
            isAM: [true, false],
            showHour: Boolean(format.match(/HH|hh|H|h/g)),
            showMinute: Boolean(format.match(/mm/g)),
            showSecond: Boolean(format.match(/ss/g)),
            invalid: undefined
        };

        this.foundation = new TimePickerFoundation(this.adapter);
        this.timePickerRef = React.createRef();
        this.savePanelRef = React.createRef();
    }

    get adapter(): TimePickerAdapter<TimePickerProps, TimePickerState> {
        return {
            ...super.adapter,
            togglePanel: show => {
                this.setState({ open: show });
            },
            registerClickOutSide: () => {
                if (this.clickOutSideHandler) {
                    this.adapter.unregisterClickOutSide();
                }
                this.clickOutSideHandler = e => {
                    const panel = this.savePanelRef && this.savePanelRef.current;
                    const isInPanel = e.target && panel && panel.contains(e.target as Node);
                    const isInTimepicker =
                        this.timePickerRef &&
                        this.timePickerRef.current &&
                        this.timePickerRef.current.contains(e.target as Node);
                    if (!isInTimepicker && !isInPanel) {
                        const clickedOutside = true;
                        this.foundation.hanldePanelClose(clickedOutside, e);
                    }
                };
                document.addEventListener('mousedown', this.clickOutSideHandler);
            },
            setInputValue: (inputValue, cb) => this.setState({ inputValue }, cb),
            unregisterClickOutSide: () => {
                if (this.clickOutSideHandler) {
                    document.removeEventListener('mousedown', this.clickOutSideHandler);
                    this.clickOutSideHandler = null;
                }
            },
            notifyOpenChange: (...args) => this.props.onOpenChange(...args),
            notifyChange: (...args) => this.props.onChange && this.props.onChange(...args),
            notifyFocus: (...args) => this.props.onFocus && this.props.onFocus(...args),
            notifyBlur: (...args) => this.props.onBlur && this.props.onBlur(...args),
            isRangePicker: () => this.props.type === strings.TYPE_TIME_RANGE_PICKER,
        };
    }

    static getDerivedStateFromProps(nextProps: TimePickerProps, prevState: TimePickerState) {
        if ('open' in nextProps && nextProps.open !== prevState.open) {
            return {
                open: nextProps.open,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps: TimePickerProps) {
        // if (this.isControlled('open') && this.props.open != null && this.props.open !== prevProps.open) {
        //     this.foundation.setPanel(this.props.open);
        // }

        if (this.isControlled('value') && this.props.value !== prevProps.value) {
            this.foundation.refreshProps({
                ...this.props,
            });
        } else if (this.props.timeZone !== prevProps.timeZone) {
            this.foundation.refreshProps({
                timeZone: this.props.timeZone,
                __prevTimeZone: prevProps.timeZone,
                value: this.state.value,
            });
        }
    }

    onCurrentSelectPanelChange = (currentSelectPanel: string) => {
        this.setState({ currentSelectPanel });
    };

    handlePanelChange = (
        value: { isAM: boolean; value: string; timeStampValue: number },
        index: number
    ) => this.foundation.handlePanelChange(value, index);

    handleInput = (value: string) => this.foundation.handleInputChange(value);

    createPanelProps = (index = 0) => {
        const { panels, panelFooter, panelHeader, locale } = this.props;

        const panelProps = {
            panelHeader,
            panelFooter,
        };

        if (this.adapter.isRangePicker()) {
            const defaultHeaderMap = {
                0: locale.begin,
                1: locale.end,
            };

            panelProps.panelHeader = get(
                panels,
                index,
                isNullOrUndefined(panelHeader) ? get(defaultHeaderMap, index, null) : panelHeader
            );
            panelProps.panelFooter = get(panels, index, panelFooter);
        }

        return panelProps;
    };

    getPanelElement() {
        const { prefixCls, type } = this.props;
        const { isAM, value } = this.state;

        const format = this.foundation.getDefaultFormatIfNeed();

        const timePanels = [
            <Combobox
                {...this.props}
                key={0}
                format={format}
                isAM={isAM[0]}
                timeStampValue={value[0]}
                prefixCls={`${prefixCls}-panel`}
                onChange={v => this.handlePanelChange(v, 0)}
                onCurrentSelectPanelChange={this.onCurrentSelectPanelChange}
                {...this.createPanelProps(0)}
            />,
        ];

        if (type === strings.TYPE_TIME_RANGE_PICKER) {
            timePanels.push(
                <Combobox
                    {...this.props}
                    key={1}
                    format={format}
                    isAM={isAM[1]}
                    timeStampValue={value[1]}
                    prefixCls={`${prefixCls}-panel`}
                    onChange={v => this.handlePanelChange(v, 1)}
                    onCurrentSelectPanelChange={this.onCurrentSelectPanelChange}
                    {...this.createPanelProps(1)}
                />
            );
        }

        const wrapCls = classNames({
            [cssClasses.RANGE_PANEL_LISTS]: this.adapter.isRangePicker(),
        });

        return (
            <div ref={this.savePanelRef} className={wrapCls}>
                {timePanels.map(panel => panel)}
            </div>
        );
    }

    getPopupClassName() {
        const { use12Hours, prefixCls, popupClassName } = this.props;
        const { showHour, showMinute, showSecond } = this.state;
        let selectColumnCount = 0;
        if (showHour) {
            selectColumnCount += 1;
        }
        if (showMinute) {
            selectColumnCount += 1;
        }
        if (showSecond) {
            selectColumnCount += 1;
        }
        if (use12Hours) {
            selectColumnCount += 1;
        }
        return classNames(
            `${prefixCls}-panel`,
            popupClassName,
            {
                [`${prefixCls}-panel-narrow`]: (!showHour || !showMinute || !showSecond) && !use12Hours,
                [cssClasses.RANGE_PICKER]: this.adapter.isRangePicker(),
            },
            `${prefixCls}-panel-column-${selectColumnCount}`
        );
    }

    focus() {
        // TODO this.picker is undefined, confirm keep this func or not
        // this.picker.focus();
    }

    blur() {
        // TODO this.picker is undefined, confirm keep this func or not
        // this.picker.blur();
    }

    handlePanelVisibleChange = (visible: boolean) => this.foundation.handleVisibleChange(visible);

    openPanel = () => {
        this.foundation.handlePanelOpen();
    };

    handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        this.foundation.handleFocus(e);
    };

    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => this.foundation.handleInputBlur(e);

    setTimePickerRef: React.LegacyRef<HTMLDivElement> = node => (this.timePickerRef.current = node);

    render() {
        const {
            prefixCls,
            placeholder,
            disabled,
            defaultValue,
            className,
            popupStyle,
            size,
            style,
            locale,
            localeCode,
            zIndex,
            getPopupContainer,
            insetLabel,
            inputStyle,
            showClear,
            panelHeader,
            panelFooter,
            rangeSeparator,
            onOpenChange,
            popupClassName: propPopupClassName,
            hideDisabledOptions,
            use12Hours,
            minuteStep,
            hourStep,
            secondStep,
            scrollItemProps,
            triggerRender,
            motion,
            autoAdjustOverflow,
            ...rest
        } = this.props;
        const format = this.foundation.getDefaultFormatIfNeed();
        const position = this.foundation.getPosition();
        const useCustomTrigger = typeof triggerRender === 'function';

        const { open, inputValue, invalid, value } = this.state;
        const popupClassName = this.getPopupClassName();

        const headerPrefix = classNames({
            [`${prefixCls}-header`]: true,
        });

        const panelPrefix = classNames({
            [`${prefixCls}-panel`]: true,
            [`${prefixCls}-panel-${ size}`]: size,
        });

        const inputProps = {
            ...rest,
            disabled,
            prefixCls,
            size,
            showClear: disabled ? false : showClear,
            style: inputStyle,
            value: inputValue,
            onFocus: this.handleFocus,
            insetLabel,
            format,
            locale,
            localeCode,
            invalid,
            placeholder,
            onChange: this.handleInput,
            onBlur: this.handleBlur,
        };

        const outerProps = {} as { onClick: () => void };

        if (useCustomTrigger) {
            outerProps.onClick = this.openPanel;
        }

        return (
            <div
                ref={this.setTimePickerRef}
                className={classNames({ [prefixCls]: true }, className)}
                style={style}
                {...outerProps}
            >
                <Popover
                    getPopupContainer={getPopupContainer}
                    zIndex={zIndex as number}
                    prefixCls={panelPrefix}
                    contentClassName={popupClassName}
                    style={popupStyle}
                    content={this.getPanelElement()}
                    trigger={'custom'}
                    position={position}
                    visible={disabled ? false : Boolean(open)}
                    motion={motion}
                    autoAdjustOverflow={autoAdjustOverflow}
                >
                    {useCustomTrigger ? (
                        <Trigger
                            triggerRender={triggerRender}
                            disabled={disabled}
                            value={value}
                            inputValue={inputValue}
                            onChange={this.handleInput}
                            placeholder={placeholder}
                            componentName={'TimePicker'}
                            componentProps={{ ...this.props }}
                        />
                    ) : (
                        <span className={headerPrefix}>
                            <TimeInput {...inputProps} />
                        </span>
                    )}
                </Popover>
            </div>
        );
    }
}
