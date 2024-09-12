import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import IconButton from '../iconButton';
import Button from '../button';
import { cssClasses, strings } from '@douyinfe/semi-foundation/datePicker/constants';
import { IconChevronLeft, IconChevronRight, IconDoubleChevronLeft, IconDoubleChevronRight } from '@douyinfe/semi-icons';
import { PanelType } from '@douyinfe/semi-foundation/datePicker/monthsGridFoundation';
import type { Locale } from '../locale/interface';

const prefixCls = cssClasses.NAVIGATION;

interface NavigationProps {
    forwardRef?: React.Ref<HTMLDivElement>;
    monthText?: string;
    monthNumber?: string;
    density?: string;
    onMonthClick?: (e: React.MouseEvent) => void;
    onNextMonth?: () => void;
    onPrevMonth?: () => void;
    onNextYear?: () => void;
    onPrevYear?: () => void;
    navPrev?: React.ReactNode;
    navNext?: React.ReactNode;
    // Whether to switch synchronously for two panels
    shouldBimonthSwitch?: boolean;
    // Panel type, divided into left panel and right panel
    panelType?: PanelType;
    localeCode: Locale['code']
}

export default class Navigation extends PureComponent<NavigationProps> {
    static propTypes = {
        monthText: PropTypes.string,
        monthNumber: PropTypes.string,
        density: PropTypes.string,
        onMonthClick: PropTypes.func,
        onNextMonth: PropTypes.func,
        onPrevMonth: PropTypes.func,
        onNextYear: PropTypes.func,
        onPrevYear: PropTypes.func,
        navPrev: PropTypes.node,
        navNext: PropTypes.node,
        // Whether to switch synchronously for two panels
        shouldBimonthSwitch: PropTypes.bool,
        // Panel type, divided into left panel and right panel
        panelType: PropTypes.oneOf([strings.PANEL_TYPE_LEFT, strings.PANEL_TYPE_RIGHT]),
        localeCode: PropTypes.string,
    };

    static defaultProps = {
        monthText: '',
        onMonthClick: noop,
        onNextMonth: noop,
        onPrevMonth: noop,
        onNextYear: noop,
        onPrevYear: noop,
    };

    navRef: React.RefObject<HTMLDivElement>;

    constructor(props: NavigationProps) {
        super(props);
        this.navRef = React.createRef();
    }

    render() {
        const {
            forwardRef,
            monthText,
            monthNumber,
            onMonthClick,
            onNextMonth,
            onPrevMonth,
            onPrevYear,
            onNextYear,
            density,
            shouldBimonthSwitch,
            panelType,
            localeCode
        } = this.props;

        const btnTheme = 'borderless';
        const iconBtnSize = density === 'compact' ? 'default' : 'large';
        const btnNoHorizontalPadding = true;
        const buttonSize = density === 'compact' ? 'small' : 'default';
        const isLeftPanel = panelType === strings.PANEL_TYPE_LEFT;
        const isRightPanel = panelType === strings.PANEL_TYPE_RIGHT;

        // syncSwitchMonth and the current panel is the left
        const hiddenLeftPanelRightButtons = shouldBimonthSwitch && isLeftPanel;
        // syncSwitchMonth and the current panel is the right
        const hiddenRightPanelLeftButtons = shouldBimonthSwitch && isRightPanel;
        // `visibility: hidden` will keep the icon in position
        const leftButtonStyle: React.CSSProperties = {};
        const rightButtonStyle: React.CSSProperties = {};
        if (hiddenRightPanelLeftButtons) {
            leftButtonStyle.visibility = 'hidden';
        }
        if (hiddenLeftPanelRightButtons) {
            rightButtonStyle.visibility = 'hidden';
        }

        // some special case, detail please refer issue https://github.com/DouyinFE/semi-design/issues/2487
        let monthTextButtonCls = '';
        if (density) {
            let textOverflowMonth = [];
            if (localeCode == 'ms-MY') {
                textOverflowMonth = [1, 2, 9, 10, 11, 12];
                console.log(monthNumber);
            } else if (localeCode == 'th-TH') {
                textOverflowMonth = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12];
            } else if (localeCode == 'tr-TR') {
                textOverflowMonth = [2, 4, 5, 6, 7, 8, 11, 12];
            }
            textOverflowMonth.includes(Number(monthNumber)) ? monthTextButtonCls = `${prefixCls}-month-without-padding` : '';
        }

        const monthTextBtnWrapperCls = cls([`${prefixCls}-month`, monthTextButtonCls]);

        const ref = forwardRef || this.navRef;
        return (
            <div className={prefixCls} ref={ref}>
                <IconButton
                    key="double-chevron-left"
                    aria-label="Previous year"
                    icon={<IconDoubleChevronLeft aria-hidden size={iconBtnSize} />}
                    size={buttonSize}
                    theme={btnTheme}
                    noHorizontalPadding={btnNoHorizontalPadding}
                    onClick={onPrevYear}
                    style={leftButtonStyle}
                />
                <IconButton
                    key="chevron-left"
                    aria-label="Previous month"
                    icon={<IconChevronLeft aria-hidden size={iconBtnSize} />}
                    size={buttonSize}
                    onClick={onPrevMonth}
                    theme={btnTheme}
                    noHorizontalPadding={btnNoHorizontalPadding}
                    style={leftButtonStyle}
                />
                <div className={monthTextBtnWrapperCls}>
                    <Button onClick={onMonthClick} theme={btnTheme} size={buttonSize}>
                        <span>{monthText}</span>
                    </Button>
                </div>
                <IconButton
                    key="chevron-right"
                    aria-label="Next month"
                    icon={<IconChevronRight aria-hidden size={iconBtnSize} />}
                    size={buttonSize}
                    onClick={onNextMonth}
                    theme={btnTheme}
                    noHorizontalPadding={btnNoHorizontalPadding}
                    style={rightButtonStyle}
                />
                <IconButton
                    key="double-chevron-right"
                    aria-label="Next year"
                    icon={<IconDoubleChevronRight aria-hidden size={iconBtnSize} />}
                    size={buttonSize}
                    theme={btnTheme}
                    noHorizontalPadding={btnNoHorizontalPadding}
                    onClick={onNextYear}
                    style={rightButtonStyle}
                />
            </div>
        );
    }
}
