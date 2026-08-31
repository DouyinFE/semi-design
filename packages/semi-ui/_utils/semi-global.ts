import type { AutoCompleteProps } from "../autoComplete";
import type { AvatarProps } from "../avatar";
import type { BackTopProps } from "../backtop";
import type { ButtonProps } from "../button";
import type { CascaderProps } from "../cascader";
import type { CheckboxProps } from "../checkbox";
import type { ChatProps } from "../chat/interface";
import type { AIChatInputProps } from "../aiChatInput";
import type { CodeHighlightProps } from "../codeHighlight";
import type { CollapseReactProps } from "../collapse";
import type { CollapsibleProps } from "../collapsible";
import type { ColorPickerReactProps } from "../colorPicker";
import type { CropperProps } from "../cropper";
import type { DatePickerProps } from "../datePicker";
import type { DropdownProps } from "../dropdown";
import type { FeedbackProps } from "../feedback";
import type { InputProps } from "../input";
import type { LottieProps } from "../lottie";
import type { ModalReactProps } from "../modal";
import type { NavProps } from "../navigation";
import type { NoticeReactProps } from "../notification";
import type { OverflowListProps } from "../overflowList";
import type { PinCodeProps } from "../pincode";
import type { PopconfirmProps } from "../popconfirm";
import type { PopoverProps } from "../popover";
import type { ProgressProps } from "../progress";
import type { RadioProps } from "../radio";
import type { SelectProps } from "../select";
import type { SideSheetReactProps } from "../sideSheet";
import type { SliderProps } from "../slider";
import type { SwitchProps } from "../switch";
import type { TabsProps } from "../tabs";
import type { TagProps } from "../tag/interface";
import type { TableProps } from "../table/interface";
import type { TimePickerProps } from "../timePicker";
import type { ToastReactProps } from "../toast";
import type { TooltipProps } from "../tooltip";
import type { TreeProps } from "../tree/interface";
import type { TreeSelectProps } from "../treeSelect";
import type { BaseTypographyProps } from "../typography";
import type { UploadProps } from "../upload";
import type { BaseFormProps } from "../form/interface";
import type { MarkdownRenderProps } from "../markdownRender";
import { SpinProps } from "../spin";

interface SemiGlobalConfig {
    /**
     * Inject `createRoot` from `react-dom/client` for React 19 compatibility.
     * See https://semi.design/zh-CN/ecosystem/react19
     */
    createRoot?: (container: Element | DocumentFragment) => {
        render(children: any): void;
        unmount(): void
    };
    overrideDefaultProps?: {
        "AutoComplete"?: Partial<AutoCompleteProps<any>>;
        "Avatar"?: Partial<AvatarProps>;
        "BackTop"?: Partial<BackTopProps>;
        "Button"?: Partial<ButtonProps>;
        "MarkdownRender"?: Partial<MarkdownRenderProps>;
        Cascader?: Partial<CascaderProps>;
        Chat?: Partial<ChatProps>;
        AIChatInput?: Partial<AIChatInputProps>;
        Checkbox?: Partial<CheckboxProps>;
        CodeHighlight?: Partial<CodeHighlightProps>;
        Collapse?: Partial<CollapseReactProps>;
        Collapsible?: Partial<CollapsibleProps>;
        ColorPicker?: Partial<ColorPickerReactProps>;
        Cropper?: Partial<CropperProps>;
        DatePicker?: Partial<DatePickerProps>;
        Dropdown?: Partial<DropdownProps>;
        Feedback?: Partial<FeedbackProps>;
        Form?: Partial<BaseFormProps<any>>;
        Input?: Partial<InputProps>;
        Lottie?: Partial<LottieProps>;
        Modal?: Partial<ModalReactProps>;
        Navigation?: Partial<NavProps>;
        Notification?: Partial<NoticeReactProps>;
        OverflowList?: Partial<OverflowListProps>;
        PinCode?: Partial<PinCodeProps>;
        Popconfirm?: Partial<PopconfirmProps>;
        Popover?: Partial<PopoverProps>;
        Progress?: Partial<ProgressProps>;
        Radio?: Partial<RadioProps>;
        Select?: Partial<SelectProps<any>>;
        SideSheet?: Partial<SideSheetReactProps>;
        Slider?: Partial<SliderProps>;
        Spin?: Partial<SpinProps>;
        Switch?: Partial<SwitchProps>;
        Table?: Partial<TableProps<any>>;
        Tabs?: Partial<TabsProps>;
        Tag?: Partial<TagProps>;
        TimePicker?: Partial<TimePickerProps>;
        Toast?: Partial<ToastReactProps>;
        Tooltip?: Partial<TooltipProps>;
        Tree?: Partial<TreeProps>;
        TreeSelect?: Partial<TreeSelectProps>;
        Typography?: Partial<BaseTypographyProps>;
        Upload?: Partial<UploadProps>
    }
}

class SemiGlobal {
    config: SemiGlobalConfig = {}
}

export default new SemiGlobal();
