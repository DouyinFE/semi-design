import React, { PureComponent } from 'react';
// import cls from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash-es';

import IconButton from '../iconButton';
import Button from '../button';
import { cssClasses, strings } from '@douyinfe/semi-foundation/datePicker/constants';
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons';
import { PanelType } from '@douyinfe/semi-foundation/datePicker/monthsGridFoundation';

const prefixCls = cssClasses.NAVIGATION;

interface NavigationProps {
    forwardRef?: React.Ref<HTMLDivElement>;
    monthText?: string;
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
}

export default class Navigation extends PureComponent<NavigationProps> {
    static propTypes = {
        monthText: PropTypes.string,
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
        panelType: PropTypes.oneOf([strings.PANEL_TYPE_LEFT, strings.PANEL_TYPE_RIGHT])
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
            onMonthClick,
            onNextMonth,
            onPrevMonth,
            density,
            shouldBimonthSwitch,
            panelType
        } = this.props;

        const btnTheme = 'borderless';
        const iconBtnSize = density === 'compact' ? 'default' : 'large';
        const btnNoHorizontalPadding = true;
        const buttonSize = density === 'compact' ? 'small' : 'default';
        // Enable dual-panel synchronous switching, and the current panel is the left panel
        const bimonthSwitchWithLeftPanel = shouldBimonthSwitch && panelType === strings.PANEL_TYPE_LEFT;
        // Enable dual-panel synchronous switching, and the current panel is the right panel
        const bimonthSwitchWithRightPanel = shouldBimonthSwitch && panelType === strings.PANEL_TYPE_RIGHT;

        const ref = forwardRef || this.navRef;
        return (
            <div className={prefixCls} ref={ref}>
                {
                    !bimonthSwitchWithRightPanel &&
                    (
                        <IconButton
                            icon={<IconChevronLeft size={iconBtnSize} />}
                            size={buttonSize}
                            onClick={onPrevMonth}
                            theme={btnTheme}
                            noHorizontalPadding={btnNoHorizontalPadding}
                        />
                    )
                }
                <div className={`${prefixCls}-month`}>
                    <Button onClick={onMonthClick} theme={btnTheme} size={buttonSize}>
                        <span>{monthText}</span>
                    </Button>
                </div>
                {
                    !bimonthSwitchWithLeftPanel &&
                    (
                        <IconButton
                            icon={<IconChevronRight size={iconBtnSize} />}
                            size={buttonSize}
                            onClick={onNextMonth}
                            theme={btnTheme}
                            noHorizontalPadding={btnNoHorizontalPadding}
                        />
                    )
                }
            </div>
        );
    }
}
