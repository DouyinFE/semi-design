/* eslint-disable max-len */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { noop, stubFalse, isDate, get, isFunction } from 'lodash';
import ConfigContext from '../configProvider/context';
import DatePickerFoundation, { DatePickerAdapter, DatePickerFoundationProps, DatePickerFoundationState, DayStatusType, PresetType, Type } from '@douyinfe/semi-foundation/datePicker/foundation';
import { cssClasses, strings, numbers } from '@douyinfe/semi-foundation/datePicker/constants';
import { strings as popoverStrings, numbers as popoverNumbers } from '@douyinfe/semi-foundation/popover/constants';
import BaseComponent from '../_base/baseComponent';
import Popover from '../popover/index';
import DateInput, { DateInputProps } from './dateInput';
import MonthsGrid, { MonthsGridProps } from './monthsGrid';
import QuickControl from './quickControl';
import Footer from './footer';
import Trigger from '../trigger';
import YearAndMonth, { YearAndMonthProps } from './yearAndMonth';
import '@douyinfe/semi-foundation/datePicker/datePicker.scss';
import { Locale } from '../locale/interface';
import { RangeType } from '@douyinfe/semi-foundation/datePicker/inputFoundation';
import { TimePickerProps } from '../timePicker/TimePicker';

export interface DatePickerProps extends DatePickerFoundationProps {
    timePickerOpts?: TimePickerProps;
    bottomSlot?: React.ReactNode;
    insetLabel?: React.ReactNode;
    prefix?: React.ReactNode;
    topSlot?: React.ReactNode;
    renderDate?: (dayNumber?: number, fullDate?: string) => React.ReactNode;
    renderFullDate?: (dayNumber?: number, fullDate?: string, dayStatus?: DayStatusType) => React.ReactNode;
    triggerRender?: (props: DatePickerProps) => React.ReactNode;
    onBlur?: React.MouseEventHandler<HTMLInputElement>;
    onClear?: React.MouseEventHandler<HTMLDivElement>;
    onFocus?: (e: React.MouseEvent, rangeType: RangeType) => void;
    onPresetClick?: (item: PresetType, e: React.MouseEvent<HTMLDivElement>) => void;
    locale?: Locale['DatePicker'];
    dateFnsLocale?: Locale['dateFnsLocale'];
}

export type DatePickerState = DatePickerFoundationState;

export default class DatePicker extends BaseComponent<DatePickerProps, DatePickerState> {
    static contextType = ConfigContext;
    static propTypes = {
        type: PropTypes.oneOf(strings.TYPE_SET),
        size: PropTypes.oneOf(strings.SIZE_SET),
        density: PropTypes.oneOf(strings.DENSITY_SET),
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.array]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.array]),
        defaultPickerValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object,
            PropTypes.array,
        ]),
        disabledTime: PropTypes.func,
        disabledTimePicker: PropTypes.bool,
        hideDisabledOptions: PropTypes.bool,
        format: PropTypes.string,
        disabled: PropTypes.bool,
        multiple: PropTypes.bool,
        max: PropTypes.number, // only work when multiple is true
        placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        presets: PropTypes.array,
        onChange: PropTypes.func,
        onChangeWithDateFirst: PropTypes.bool,
        weekStartsOn: PropTypes.number,
        disabledDate: PropTypes.func,
        timePickerOpts: PropTypes.object, // When dateTime, dateTimeRange, pass through the props to timePicker
        showClear: PropTypes.bool, // Whether to show the clear button
        onOpenChange: PropTypes.func,
        open: PropTypes.bool,
        defaultOpen: PropTypes.bool,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
        className: PropTypes.string,
        prefixCls: PropTypes.string,
        prefix: PropTypes.node,
        insetLabel: PropTypes.node,
        zIndex: PropTypes.number,
        position: PropTypes.oneOf(popoverStrings.POSITION_SET),
        getPopupContainer: PropTypes.func,
        onCancel: PropTypes.func,
        onConfirm: PropTypes.func,
        needConfirm: PropTypes.bool,
        inputStyle: PropTypes.object,
        timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        triggerRender: PropTypes.func,
        stopPropagation: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        autoAdjustOverflow: PropTypes.bool,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onClear: PropTypes.func,
        style: PropTypes.object,
        autoFocus: PropTypes.bool,
        inputReadOnly: PropTypes.bool, // Text box can be entered
        validateStatus: PropTypes.oneOf(strings.STATUS),
        renderDate: PropTypes.func,
        renderFullDate: PropTypes.func,
        spacing: PropTypes.number,
        startDateOffset: PropTypes.func,
        endDateOffset: PropTypes.func,
        autoSwitchDate: PropTypes.bool,
        dropdownClassName: PropTypes.string,
        dropdownStyle: PropTypes.object,
        topSlot: PropTypes.node,
        bottomSlot: PropTypes.node,
        dateFnsLocale: PropTypes.object, // isRequired, but no need to add isRequired key. ForwardStatics function pass static properties to index.jsx, so there is no need for user to pass the prop.
        // Support synchronous switching of months
        syncSwitchMonth: PropTypes.bool,
        // Callback function for panel date switching
        onPanelChange: PropTypes.func,
        rangeSeparator: PropTypes.string,
    };

    static defaultProps = {
        onChangeWithDateFirst: true,
        autoAdjustOverflow: true,
        stopPropagation: true,
        motion: true,
        prefixCls: cssClasses.PREFIX,
        // position: 'bottomLeft',
        zIndex: popoverNumbers.DEFAULT_Z_INDEX,
        type: 'date',
        size: 'default',
        density: 'default',
        disabled: false,
        multiple: false,
        defaultOpen: false,
        disabledHours: noop,
        disabledMinutes: noop,
        disabledSeconds: noop,
        hideDisabledOptions: false,
        onBlur: noop,
        onFocus: noop,
        onClear: noop,
        onCancel: noop,
        onConfirm: noop,
        onChange: noop,
        onOpenChange: noop,
        onPanelChange: noop,
        onPresetClick: noop,
        weekStartsOn: numbers.WEEK_START_ON,
        disabledDate: stubFalse,
        disabledTime: stubFalse,
        inputReadOnly: false,
        spacing: numbers.SPACING,
        autoSwitchDate: true,
        syncSwitchMonth: false,
        rangeSeparator: strings.DEFAULT_SEPARATOR_RANGE,
    };

    triggerElRef: React.MutableRefObject<HTMLElement>;
    panelRef: React.RefObject<HTMLDivElement>;
    monthGrid: React.RefObject<MonthsGrid>;
    rangeInputStartRef: React.RefObject<HTMLElement>;
    rangeInputEndRef: React.RefObject<HTMLElement>;
    focusRecordsRef: React.RefObject<{ rangeStart: boolean; rangeEnd: boolean }>;
    clickOutSideHandler: (e: MouseEvent) => void;
    _mounted: boolean;

    foundation: DatePickerFoundation;

    constructor(props: DatePickerProps) {
        super(props);
        this.state = {
            panelShow: props.open || props.defaultOpen,
            isRange: false,
            inputValue: null, // Staging input values
            value: [], // The currently selected date, each date is a Date object
            cachedSelectedValue: null, // Save last selected date
            prevTimeZone: null,
            motionEnd: false, // Monitor if popover animation ends
            rangeInputFocus: undefined, // Optional'rangeStart ',' rangeEnd ', false
            autofocus: props.autoFocus || (this.isRangeType(props.type, props.triggerRender) && (props.open || props.defaultOpen))
        };

        this.adapter.setCache('cachedSelectedValue', null);
        this.triggerElRef = React.createRef();
        this.panelRef = React.createRef();
        this.monthGrid = React.createRef();
        this.rangeInputStartRef = React.createRef();
        this.rangeInputEndRef = React.createRef();
        this.focusRecordsRef = React.createRef();
        // @ts-ignore ignore readonly
        this.focusRecordsRef.current = {
            rangeStart: false,
            rangeEnd: false
        };

        this.foundation = new DatePickerFoundation(this.adapter);
    }

    get adapter(): DatePickerAdapter {
        return {
            ...super.adapter,
            togglePanel: panelShow => {
                this.setState({ panelShow });
                if (!panelShow) {
                    this.focusRecordsRef.current.rangeEnd = false;
                    this.focusRecordsRef.current.rangeStart = false;
                }
            },
            registerClickOutSide: () => {
                if (this.clickOutSideHandler) {
                    this.adapter.unregisterClickOutSide();
                    this.clickOutSideHandler = null;
                }
                this.clickOutSideHandler = e => {
                    if (this.adapter.needConfirm()) {
                        return;
                    }
                    const triggerEl = this.triggerElRef && this.triggerElRef.current;
                    const panelEl = this.panelRef && this.panelRef.current;
                    const isInTrigger = triggerEl && triggerEl.contains(e.target as Node);
                    const isInPanel = panelEl && panelEl.contains(e.target as Node);
                    if (!isInTrigger && !isInPanel && this._mounted) {
                        this.foundation.closePanel(e);
                    }
                };
                document.addEventListener('mousedown', this.clickOutSideHandler);
            },
            unregisterClickOutSide: () => {
                document.removeEventListener('mousedown', this.clickOutSideHandler);
            },
            notifyBlur: (...args) => this.props.onBlur(...args),
            notifyFocus: (...args) => this.props.onFocus(...args),
            notifyClear: (...args) => this.props.onClear(...args),
            notifyChange: (...args) => this.props.onChange(...args),
            notifyCancel: (...args) => this.props.onCancel(...args),
            notifyConfirm: (...args) => this.props.onConfirm(...args),
            notifyOpenChange: (...args) => this.props.onOpenChange(...args),
            notifyPresetsClick: (...args) => this.props.onPresetClick(...args),
            updateValue: value => this.setState({ value }),
            updatePrevTimezone: prevTimeZone => this.setState({ prevTimeZone }),
            updateCachedSelectedValue: cachedSelectedValue => {
                let _cachedSelectedValue = cachedSelectedValue;
                if (cachedSelectedValue && !Array.isArray(cachedSelectedValue)) {
                    _cachedSelectedValue = [...cachedSelectedValue as any];
                }
                this.setState({ cachedSelectedValue: _cachedSelectedValue });
            },
            updateInputValue: inputValue => {
                this.setState({ inputValue });
            },
            needConfirm: () =>
                ['dateTime', 'dateTimeRange'].includes(this.props.type) && this.props.needConfirm === true,
            typeIsYearOrMonth: () => ['month', 'year'].includes(this.props.type),
            setMotionEnd: motionEnd => this.setState({ motionEnd }),
            setRangeInputFocus: rangeInputFocus => {
                if (rangeInputFocus !== this.state.rangeInputFocus) {
                    this.setState({ rangeInputFocus });
                }
                switch (rangeInputFocus) {
                    case 'rangeStart':
                        const inputStartNode = get(this, 'rangeInputStartRef.current');
                        inputStartNode && inputStartNode.focus();
                        /**
                         * 解决选择完startDate，切换到endDate后panel被立马关闭的问题。
                         * 用户打开panel，选了startDate后，会执行setRangeInputFocus('rangeEnd'),focus到endDateInput，
                         * 同时会走到datePicker/foundation.js中的handleSelectedChange方法，在这个方法里会根据focusRecordsRef来判断是否可以关闭panel。
                         * 如果在setRangeInputFocus里同步修改了focusRecordsRef的状态为true，那在handleSelectedChange里会误判startDate和endDate都已经完成选择，
                         * 导致endDate还没选就关闭了panel
                         *
                         * Fix the problem that the panel is closed immediately after switching to endDate after starting Date is selected.
                         * The user opens the panel and after starting Date is selected, setRangeInputFocus ('rangeEnd') will be executed, focus to endDateInput,
                         * At the same time, it will go to the handleSelectedChange method in datePicker/foundation.js, where it will be determined whether the panel can be closed according to focusRecordsRef.
                         * If the status of focusRecordsRef is modified synchronously in setRangeInputFocus to true, then in handleSelectedChange it will be misjudged that both begDate and endDate have completed the selection,
                         * resulting in the panel being closed before endDate is selected
                         */
                        setTimeout(() => {
                            this.focusRecordsRef.current.rangeStart = true;
                        }, 0);
                        break;
                    case 'rangeEnd':
                        const inputEndNode = get(this, 'rangeInputEndRef.current');
                        inputEndNode && inputEndNode.focus();
                        /**
                         * 解决选择完startDate，切换到endDate后panel被立马关闭的问题。
                         * 用户打开panel，选了startDate后，会执行setRangeInputFocus('rangeEnd'),focus到endDateInput，
                         * 同时会走到datePicker/foundation.js中的handleSelectedChange方法，在这个方法里会根据focusRecordsRef来判断是否可以关闭panel。
                         * 如果在setRangeInputFocus里同步修改了focusRecordsRef的状态为true，那在handleSelectedChange里会误判startDate和endDate都已经完成选择，
                         * 导致endDate还没选就关闭了panel
                         *
                         * Fix the problem that the panel is closed immediately after switching to endDate after starting Date is selected.
                         * The user opens the panel and after starting Date is selected, setRangeInputFocus ('rangeEnd') will be executed, focus to endDateInput,
                         * At the same time, it will go to the handleSelectedChange method in datePicker/foundation.js, where it will be determined whether the panel can be closed according to focusRecordsRef.
                         * If the status of focusRecordsRef is modified synchronously in setRangeInputFocus to true, then in handleSelectedChange it will be misjudged that both begDate and endDate have completed the selection,
                         * resulting in the panel being closed before endDate is selected
                         */
                        setTimeout(() => {
                            this.focusRecordsRef.current.rangeEnd = true;
                        }, 0);
                        break;
                    default:
                        return;
                }
            },
            couldPanelClosed: () => this.focusRecordsRef.current.rangeStart && this.focusRecordsRef.current.rangeEnd,
            isEventTarget: e => e && e.target === e.currentTarget,
        };
    }

    isRangeType(type: Type, triggerRender: DatePickerProps['triggerRender']) {
        return /range/i.test(type) && !isFunction(triggerRender);
    }

    componentDidUpdate(prevProps: DatePickerProps) {
        if (prevProps.value !== this.props.value) {
            this.foundation.initFromProps({
                ...this.props,
            });
        } else if (this.props.timeZone !== prevProps.timeZone) {
            this.foundation.initFromProps({
                value: this.state.value,
                timeZone: this.props.timeZone,
                prevTimeZone: prevProps.timeZone,
            });
        }

        if (prevProps.open !== this.props.open) {
            this.foundation.initPanelOpenStatus();
        }
    }

    componentDidMount() {
        this._mounted = true;
        super.componentDidMount();
    }

    componentWillUnmount() {
        this._mounted = false;
        super.componentWillUnmount();
    }

    setTriggerRef = (node: HTMLDivElement) => (this.triggerElRef.current = node);

    // Called when changes are selected by clicking on the selected date
    handleSelectedChange: MonthsGridProps['onChange'] = (v, options) => this.foundation.handleSelectedChange(v, options);

    // Called when the year and month change
    handleYMSelectedChange: YearAndMonthProps['onSelect'] = item => this.foundation.handleYMSelectedChange(item);

    disabledDisposeDate: MonthsGridProps['disabledDate'] = (date, ...rest) => this.foundation.disabledDisposeDate(date, ...rest);
    disabledDisposeTime: MonthsGridProps['disabledTime'] = (date, ...rest) => this.foundation.disabledDisposeTime(date, ...rest);

    renderMonthGrid(locale: Locale['DatePicker'], localeCode: string, dateFnsLocale: Locale['dateFnsLocale']) {
        const {
            type,
            multiple,
            max,
            weekStartsOn,
            timePickerOpts,
            defaultPickerValue,
            format,
            hideDisabledOptions,
            disabledTimePicker,
            renderDate,
            renderFullDate,
            startDateOffset,
            endDateOffset,
            autoSwitchDate,
            density,
            syncSwitchMonth,
            onPanelChange,
            timeZone,
            triggerRender
        } = this.props;
        const { value, cachedSelectedValue, motionEnd, rangeInputFocus } = this.state;

        // const cachedSelectedValue = this.adapter.getCache('cachedSelectedValue');

        let defaultValue = value;

        if (this.adapter.needConfirm()) {
            defaultValue = cachedSelectedValue;
        }

        return (
            <MonthsGrid
                ref={this.monthGrid}
                locale={locale}
                localeCode={localeCode}
                dateFnsLocale={dateFnsLocale}
                weekStartsOn={weekStartsOn}
                type={type}
                multiple={multiple}
                max={max}
                format={format}
                disabledDate={this.disabledDisposeDate}
                hideDisabledOptions={hideDisabledOptions}
                disabledTimePicker={disabledTimePicker}
                disabledTime={this.disabledDisposeTime}
                defaultValue={defaultValue}
                defaultPickerValue={defaultPickerValue}
                timePickerOpts={timePickerOpts}
                isControlledComponent={!this.adapter.needConfirm() && this.isControlled('value')}
                onChange={this.handleSelectedChange}
                renderDate={renderDate}
                renderFullDate={renderFullDate}
                startDateOffset={startDateOffset}
                endDateOffset={endDateOffset}
                autoSwitchDate={autoSwitchDate}
                motionEnd={motionEnd}
                density={density}
                rangeInputFocus={rangeInputFocus}
                setRangeInputFocus={this.handleSetRangeFocus}
                isAnotherPanelHasOpened={this.isAnotherPanelHasOpened}
                syncSwitchMonth={syncSwitchMonth}
                onPanelChange={onPanelChange}
                timeZone={timeZone}
                focusRecordsRef={this.focusRecordsRef}
                triggerRender={triggerRender}
            />
        );
    }

    renderQuickControls() {
        const { presets, type } = this.props;
        return (
            <QuickControl
                type={type}
                presets={presets}
                onPresetClick={(item, e) => this.foundation.handlePresetClick(item, e)}
            />
        );
    }

    handleOpenPanel = () => this.foundation.openPanel();
    handleInputChange: DatePickerFoundation['handleInputChange'] = (...args) => this.foundation.handleInputChange(...args);
    handleInputComplete: DatePickerFoundation['handleInputComplete'] = v => this.foundation.handleInputComplete(v);
    handleInputBlur: DateInputProps['onBlur'] = e => this.foundation.handleInputBlur(get(e, 'nativeEvent.target.value'), e);
    handleInputFocus: DatePickerFoundation['handleInputFocus'] = (...args) => this.foundation.handleInputFocus(...args);
    handleInputClear: DatePickerFoundation['handleInputClear'] = e => this.foundation.handleInputClear(e);
    handleTriggerWrapperClick: DatePickerFoundation['handleTriggerWrapperClick'] = e => this.foundation.handleTriggerWrapperClick(e);
    handleSetRangeFocus: DatePickerFoundation['handleSetRangeFocus'] = rangeInputFocus => this.foundation.handleSetRangeFocus(rangeInputFocus);
    handleRangeInputBlur = (value: any, e: any) => this.foundation.handleRangeInputBlur(value, e);
    handleRangeInputClear: DatePickerFoundation['handleRangeInputClear'] = e => this.foundation.handleRangeInputClear(e);
    handleRangeEndTabPress: DatePickerFoundation['handleRangeEndTabPress'] = e => this.foundation.handleRangeEndTabPress(e);
    isAnotherPanelHasOpened = (currentRangeInput: RangeType) => {
        if (currentRangeInput === 'rangeStart') {
            return this.focusRecordsRef.current.rangeEnd;
        } else {
            return this.focusRecordsRef.current.rangeStart;
        }
    };

    renderInner(extraProps?: Partial<DatePickerProps>) {
        const {
            type,
            format,
            multiple,
            disabled,
            showClear,
            insetLabel,
            placeholder,
            validateStatus,
            inputStyle,
            prefix,
            locale,
            dateFnsLocale,
            triggerRender,
            size,
            inputReadOnly,
            rangeSeparator
        } = this.props;
        const { value, inputValue, rangeInputFocus } = this.state;
        // This class is not needed when triggerRender is function
        const isRangeType = this.isRangeType(type, triggerRender);
        const inputCls = classnames(`${cssClasses.PREFIX}-input`, {
            [`${cssClasses.PREFIX}-range-input`]: isRangeType,
            [`${cssClasses.PREFIX}-range-input-${size}`]: isRangeType && size,
            [`${cssClasses.PREFIX}-range-input-active`]: isRangeType && rangeInputFocus && !disabled,
            [`${cssClasses.PREFIX}-range-input-disabled`]: isRangeType && disabled,
            [`${cssClasses.PREFIX}-range-input-${validateStatus}`]: isRangeType && validateStatus,
        });
        const phText = placeholder || locale.placeholder[type]; // i18n
        // These values should be passed to triggerRender, do not delete any key if it is not necessary
        const props = {
            ...extraProps,
            placeholder: phText,
            disabled,
            inputValue,
            value,
            onChange: this.handleInputChange,
            onEnterPress: this.handleInputComplete,
            // TODO: remove in next major version
            block: true,
            inputStyle,
            showClear,
            insetLabel,
            type,
            format,
            multiple,
            validateStatus,
            inputReadOnly,
            // onClick: this.handleOpenPanel,
            onBlur: this.handleInputBlur,
            onFocus: this.handleInputFocus,
            onClear: this.handleInputClear,
            prefix,
            size,
            autofocus: this.state.autofocus,
            dateFnsLocale,
            rangeInputStartRef: this.rangeInputStartRef,
            rangeInputEndRef: this.rangeInputEndRef,
            rangeInputFocus,
            rangeSeparator,
            onRangeBlur: this.handleRangeInputBlur,
            onRangeClear: this.handleRangeInputClear,
            onRangeEndTabPress: this.handleRangeEndTabPress,
        };

        return (
            <div
                onClick={this.handleTriggerWrapperClick}
                className={inputCls}>
                {typeof triggerRender === 'function' ? (
                    <Trigger
                        {...props}
                        triggerRender={triggerRender}
                        componentName="DatePicker"
                        componentProps={{ ...this.props }}
                    />
                ) : (
                    <DateInput {...props} />
                )}
            </div>
        );
    }

    handleConfirm = (e: React.MouseEvent) => this.foundation.handleConfirm();

    handleCancel = (e: React.MouseEvent) => this.foundation.handleCancel();

    renderFooter = (locale: Locale['DatePicker'], localeCode: string) => {
        if (this.adapter.needConfirm()) {
            return (
                <Footer
                    {...this.props}
                    locale={locale}
                    localeCode={localeCode}
                    onConfirmClick={this.handleConfirm}
                    onCancelClick={this.handleCancel}
                />
            );
        }

        return null;
    };

    renderPanel = (locale: Locale['DatePicker'], localeCode: string, dateFnsLocale: Locale['dateFnsLocale']) => {
        const { dropdownClassName, dropdownStyle, density, topSlot, bottomSlot } = this.props;
        const wrapCls = classnames(
            cssClasses.PREFIX,
            {
                [cssClasses.PANEL_YAM]: this.adapter.typeIsYearOrMonth(),
                [`${cssClasses.PREFIX}-compact`]: density === 'compact',
            },
            dropdownClassName
        );

        return (
            <div ref={this.panelRef} className={wrapCls} style={dropdownStyle}>
                {topSlot && <div className={`${cssClasses.PREFIX}-topSlot`}>{topSlot}</div>}
                {this.adapter.typeIsYearOrMonth() ?
                    this.renderYearMonthPanel(locale, localeCode) :
                    this.renderMonthGrid(locale, localeCode, dateFnsLocale)}
                {this.renderQuickControls()}
                {bottomSlot && <div className={`${cssClasses.PREFIX}-bottomSlot`}>{bottomSlot}</div>}
                {this.renderFooter(locale, localeCode)}
            </div>
        );
    };

    renderYearMonthPanel = (locale: Locale['DatePicker'], localeCode: string) => {
        const { density } = this.props;

        const date = this.state.value[0];
        let year = 0;
        let month = 0;

        if (isDate(date)) {
            year = date.getFullYear();
            month = date.getMonth() + 1;
        }

        return (
            <YearAndMonth
                locale={locale}
                localeCode={localeCode}
                disabledDate={this.disabledDisposeDate}
                noBackBtn
                monthCycled
                onSelect={this.handleYMSelectedChange}
                currentYear={year}
                currentMonth={month}
                density={density}
            />
        );
    };

    wrapPopover = (children: React.ReactNode) => {
        const { panelShow } = this.state;
        // rtl changes the default position
        const { direction } = this.context;
        const defaultPosition = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
        const {
            motion,
            zIndex,
            position = defaultPosition,
            getPopupContainer,
            locale,
            localeCode,
            dateFnsLocale,
            stopPropagation,
            autoAdjustOverflow,
            spacing,
        } = this.props;
        const mergedMotion = this.foundation.getMergedMotion(motion);
        return (
            <Popover
                getPopupContainer={getPopupContainer}
                // wrapWhenSpecial={false}
                autoAdjustOverflow={autoAdjustOverflow}
                zIndex={zIndex}
                motion={mergedMotion}
                content={this.renderPanel(locale, localeCode, dateFnsLocale)}
                trigger="custom"
                position={position}
                visible={panelShow}
                stopPropagation={stopPropagation}
                spacing={spacing}
            >
                {children}
            </Popover>
        );
    };

    render() {
        const { style, className, prefixCls } = this.props;
        const outerProps = {
            style,
            className: classnames(className, { [prefixCls]: true }),
            ref: this.setTriggerRef,
        };

        const inner = this.renderInner();
        const wrappedInner = this.wrapPopover(inner);

        return <div {...outerProps}>{wrappedInner}</div>;
    }
}
