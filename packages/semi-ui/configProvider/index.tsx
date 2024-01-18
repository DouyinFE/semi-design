import React from 'react';
import PropTypes from 'prop-types';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import DefaultLocale from '../locale/source/zh_CN';
import Context, { ContextValue } from './context';
import type { AnchorProps } from "@douyinfe/semi-ui/anchor";
import type { AutoCompleteProps } from "@douyinfe/semi-ui/autoComplete";
import type { AvatarProps } from "@douyinfe/semi-ui/avatar";
import type { BackTopProps } from "@douyinfe/semi-ui/backtop";
import type { BadgeProps } from "@douyinfe/semi-ui/badge";
import type { BannerProps } from "@douyinfe/semi-ui/banner";
import type { BreadcrumbProps } from "@douyinfe/semi-ui/breadcrumb";
import type { ButtonProps } from "@douyinfe/semi-ui/button";
import type { CalendarProps } from "@douyinfe/semi-ui/calendar";
import type { CardProps } from "@douyinfe/semi-ui/card";
import type { CarouselProps } from "@douyinfe/semi-ui/carousel/interface";
import type { CascaderProps } from "@douyinfe/semi-ui/cascader";
import type { CheckboxProps } from "@douyinfe/semi-ui/checkbox";
import type { CollapseReactProps } from "@douyinfe/semi-ui/collapse";
import type { CollapsibleProps } from "@douyinfe/semi-ui/collapsible";
import type { DatePickerProps } from "@douyinfe/semi-ui/datePicker";
import type { DescriptionsProps } from "@douyinfe/semi-ui/descriptions";
import type { DividerProps } from "@douyinfe/semi-ui/divider";
import type { DropdownProps } from "@douyinfe/semi-ui/dropdown";
import type { EmptyProps } from "@douyinfe/semi-ui/empty";
import type { BaseFormProps } from "@douyinfe/semi-ui/form";
import type { ColProps, RowProps } from "@douyinfe/semi-ui/grid";
import type { HighlightProps } from "@douyinfe/semi-ui/highlight";
import type { IconProps } from "@douyinfe/semi-icons";
import type { ImageProps } from "@douyinfe/semi-ui/image";
import type { InputProps } from "@douyinfe/semi-ui/input";
import type { InputNumberProps } from "@douyinfe/semi-ui/inputNumber";
import type { BasicLayoutProps } from "@douyinfe/semi-ui/layout";
import type { ListProps } from "@douyinfe/semi-ui/list";
import type { ModalReactProps } from "@douyinfe/semi-ui/modal";
import type { NavProps } from "@douyinfe/semi-ui/navigation";
import type { NoticeReactProps } from "@douyinfe/semi-ui/notification";
import type { OverflowListProps } from "@douyinfe/semi-ui/overflowList";
import type { PaginationProps } from "@douyinfe/semi-ui/pagination";
import type { PopconfirmProps } from "@douyinfe/semi-ui/popconfirm";
import type { PopoverProps } from "@douyinfe/semi-ui/popover";
import type { ProgressProps } from "@douyinfe/semi-ui/progress";
import type { RadioProps } from "@douyinfe/semi-ui/radio";
import type { RatingProps } from "@douyinfe/semi-ui/rating";
import type { ScrollListProps } from "@douyinfe/semi-ui/scrollList";
import type { SelectProps } from "@douyinfe/semi-ui/select";
import type { SideSheetReactProps } from "@douyinfe/semi-ui/sideSheet";
import type { SkeletonProps } from "@douyinfe/semi-ui/skeleton";
import type { SliderProps } from "@douyinfe/semi-ui/slider";
import type { SpaceProps } from "@douyinfe/semi-ui/space";
import type { SpinProps } from "@douyinfe/semi-ui/spin";
import type { StepsProps } from "@douyinfe/semi-ui/steps";
import type { SwitchProps } from "@douyinfe/semi-ui/switch";
import type { TableProps } from "@douyinfe/semi-ui/table";
import type { TabsProps } from "@douyinfe/semi-ui/tabs";
import type { TagProps } from "@douyinfe/semi-ui/tag";
import type { TagInputProps } from "@douyinfe/semi-ui/tagInput";
import type { TimelineProps } from "@douyinfe/semi-ui/timeline";
import type { TimePickerProps } from "@douyinfe/semi-ui/timePicker";
import type { ToastReactProps } from "@douyinfe/semi-ui/toast";
import type { TooltipProps } from "@douyinfe/semi-ui/tooltip";
import type { TransferProps } from "@douyinfe/semi-ui/transfer";
import type { TreeProps } from "@douyinfe/semi-ui/tree";
import type { TreeSelectProps } from "@douyinfe/semi-ui/treeSelect";
import type { BaseTypographyProps } from "@douyinfe/semi-ui/typography";
import type { UploadProps } from "@douyinfe/semi-ui/upload";

export interface ConfigProviderProps extends ContextValue {}

export default class ConfigProvider extends React.Component<ConfigProviderProps> {

    constructor(props: ConfigProviderProps) {
        super(props);
    }


    static propTypes = {
        locale: PropTypes.object,
        timeZone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        getPopupContainer: PropTypes.func,
        direction: PropTypes.oneOf(['ltr', 'rtl']),
    };

    static defaultProps = {
        locale: DefaultLocale,
        direction: 'ltr',
    };


    static overrideDefaultProps: {
        // "Anchor"?: Partial<AnchorProps>;
        "AutoComplete"?: Partial<AutoCompleteProps<any>>;
        "Avatar"?: Partial<AvatarProps>;
        // BackTop?: Partial<BackTopProps>;
        // Badge?: Partial<BadgeProps>;
        // Banner?: Partial<BannerProps>;
        // Breadcrumb?: Partial<BreadcrumbProps>;
        // Button?: Partial<ButtonProps>;
        // Calendar?: Partial<CalendarProps>;
        // Card?: Partial<CardProps>;
        // Carousel?: Partial<CarouselProps>;
        Cascader?: Partial<CascaderProps>;
        // Checkbox?: Partial<CheckboxProps>;
        Collapse?: Partial<CollapseReactProps>;
        Collapsible?: Partial<CollapsibleProps>;
        DatePicker?: Partial<DatePickerProps>;
        // Descriptions?: Partial<DescriptionsProps>;
        // Divider?: Partial<DividerProps>;
        Dropdown?: Partial<DropdownProps>;
        // Empty?: Partial<EmptyProps>;
        // Form?: Partial<BaseFormProps>;
        // Row?: Partial<RowProps>;
        // Col?: Partial<ColProps>;
        // Highlight?: Partial<HighlightProps>;
        // Icon?: Partial<IconProps>;
        // Image?: Partial<ImageProps>;
        // Input?: Partial<InputProps>;
        // InputNumber?: Partial<InputNumberProps>;
        // Layout?: Partial<BasicLayoutProps>;
        // List?: Partial<ListProps<any>>;
        Modal?: Partial<ModalReactProps>;
        Navigation?: Partial<NavProps>;
        Notification?: Partial<NoticeReactProps>;
        OverflowList?: Partial<OverflowListProps>;
        // Pagination?: Partial<PaginationProps>;
        Popconfirm?: Partial<PopconfirmProps>;
        Popover?: Partial<PopoverProps>;
        // Progress?: Partial<ProgressProps>;
        // Radio?: Partial<RadioProps>;
        // Rating?: Partial<RatingProps>;
        // ScrollList?: Partial<ScrollListProps>;
        Select?: Partial<SelectProps>;
        SideSheet?: Partial<SideSheetReactProps>;
        // Skeleton?: Partial<SkeletonProps>;
        // Slider?: Partial<SliderProps>;
        // Space?: Partial<SpaceProps>;
        // Spin?: Partial<SpinProps>;
        // Steps?: Partial<StepsProps>;
        // Switch?: Partial<SwitchProps>;
        // Table?: Partial<TableProps>;
        Tabs?: Partial<TabsProps>;
        // Tag?: Partial<TagProps>;
        // TagInput?: Partial<TagInputProps>;
        // Timeline?: Partial<TimelineProps>;
        TimePicker?: Partial<TimePickerProps>;
        Toast?: Partial<ToastReactProps>;
        Tooltip?: Partial<TooltipProps>
        // Transfer?: Partial<TransferProps>;
        // Tree?: Partial<TreeProps>;
        // TreeSelect?: Partial<TreeSelectProps>;
        // Typography?: Partial<BaseTypographyProps>;
        // Upload?: Partial<UploadProps>
    } = {}  


    renderChildren() {
        const { direction, children } = this.props;
        if (direction === 'rtl') {
            return (
                <div className={`${BASE_CLASS_PREFIX}-rtl`}>
                    {children}
                </div>
            );
        }
        return children;
    }

    render() {
        const { children, direction, ...rest } = this.props;
        return (
            <Context.Provider
                value={{
                    direction,
                    ...rest,
                }}
            >
                {this.renderChildren()}
            </Context.Provider>
        );
    }
}
