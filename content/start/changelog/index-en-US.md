---
category: Getting Started
title: Change Log
subTitle: Change Log
icon: doc-changelog
localeCode: en-US
order: 5
brief: About Semi Design For React Optimization and Update
---

Version：Major.Minor.Patch

-   Major version: Significant performance / usage changes
-   Minor version: New component added / new feature
-   Patch version: bug fix

---

#### 🎉 2.0.0 (2021-10-26)

- 【Breaking Change】
  - Component Changes
    - Icon related
      - Icon component no longer supports type = xxx using built-in icons
      - Custom svg no longer supports plug-in configuration srcSvgPaths
      - The Button icon property no longer supports passing built-in icon names through strings
      - Dropdown deletes the iconType attribute and unifies it into the icon attribute
      - Navigation icons no longer support incoming by string, ReactNode needs to be passed in
      - Notification icons are no longer passed in by string, please use ReactNode uniformly
    - AutoComplete officially discards the onChangeWithObject property
    - Remove onInputChange from Cascader triggerRender
    - Form no longer exports Label components from `semi-ui/index.js`
    - Tree onRightClick renamed onContextMenu
    - Upload dragable renamed draggable
    - Table
      - API that no longer responds when componentDidUpdate
        - DefaultExpandAllRows, please replace with expandAllRows
        - Default ExpandRowKeys, please replace with expandRowKeys
        - Default ExpandAllGroupRows, please replace with expandAllGroupRows
  - Style Changes
    - CSS variable with semi prefix, for example --color-primary = > --semi-color-primary
    - In 2.x, the unified set the width and height of the illustration to `200 * 200px`
    - Design Token Changes
      - Popconfirm
        - $color-popconfirm_body-text 由 --semi-color-tertiary => --semi-color-text-2
        - $color-popconfirm_header_alert-icon 由 #fa7500 => --semi-color-warning
      - Progress
        - $spacing-progress_line_text-marginLeft 由 15px => $spacing-base(16px)
        - $spacing-progress_line_text-marginRight 由 15px => $spacing-base(16px)
      - Radio
        - $spacing-radio_addon_buttonRadio_large-paddingY 由 6px => $spacing-base-tight / 2 (6px)
        - $radius-radio_cardRadioGroup 由 3px => --semi-border-radius-small(3px)
  - Plugin Changes
    - In 2.x, the iconLazyLoad, svgPaths, srcSvgPaths configurations are no longer supported
    - In 2.x, section dark mode and bright mode no longer need to configure themeScope attributes in the plug-in, and the default is built-in. The usage method is updated from adding id #semi-ways-xxx to adding class .semi-ways-xxx.
  - Other Changes
    - Due to the adjustment of the Icon, the way of using icons and illustrations for Icon and Empty components is different from before. Please see for [details](/en-US/start/update-to-v2)

#### 🎉 1.33.0 (2021-10-22)
- 【Fix】
    - Fix that when the Cascader uses changeOnSelect and loadData attributes at the same time, and the last level is not selected, the value can not reset  

#### 🎉 1.33.0-beta.3 (2021-10-19)
- 【Fix】
    - Fix Cascader when the label is ReactNode type, and filterTreeNode is turned on, the search results are not rendered correctly. 
    - Fix the problem that the propTypes of Steps type is missing the "nav" type.

#### 🎉 1.33.0-beta.2 (2021-10-18)
- 【Fix】
    - Fix the problem When Cascader loads asynchronously, the defaultValue is abnormally cleared. 

#### 🎉 1.32.3 (2021-10-18)
- 【Fix】
    - Fix the problem that Select typing similar unescaped characters '(' '/' will throw error

#### 🎉 1.33.0-beta.0 (2021-10-15)
- 【Fix】
    - Fix Tooltip package Select, remote search out of focus. 
    - Fix the problem of missing spaces before and after the highlighted string in the search results in Select search mode. 

#### 🎉 1.32.2 (2021-10-14)
- 【Fix】
    - Fix the problem that the pop-up layer is not displayed when Tooltip motion is false (affects v1.30+) 
    - Fix the problem that if the parent dom enters display none when the Slider is dragging, an error will be triggered 


#### 🎉 1.32.1 (2021-10-11)
- 【Fix】
    - Fix the problem of triggering bubbling when Button is disabled.

#### 🎉 1.32.0 (2021-10-09)
- 【Fix】
     - Fix the issue that Avatar update src does not take effect 
     - Fix the issue that DatePicker displays incorrect dates in Russian and Vietnamese 
     - Fix the size of avatar style is abnormal when Tag size is small and avatarShape is circle 

#### 🎉 1.32.0-beta.0 (2021-09-30)
- 【Feat】
     - TreeSelect supports support loadData/onLoad/loadedKeys 
     - Cascader supports disableStrictly 
     - Tooltip supports wrapperClassName
     - Form formApi.setValue, setError, and setTouched support the use of parent fieldPath to assign values to multiple fields in batches 

#### 🎉 1.31.0 (2021-09-24)
- 【Fix】
     - Form fixes the problem that `validate` may be triggered by mistake due to the same field prefix when validate specifies the validation part of the fields 
     - DatePicker disabledTime callback parameter type error (affecting v1.26 ~ 1.31-beta) 


#### 🎉 1.31.0-beta.1 (2021-09-23)
- 【Fix】
    - When Pagination showQuickJumper is true and a negative number is entered, it will change from not valid to the first page
- 【Style】
    - Remove the padding on the left and right sides when the Pagination type is mini (that is, the default value of the component Token: $spacing-pagination_small-paddingX is changed from 8px to 0)
    - When Pagination showQuickJumper is true, when the total number of pages is only 1 page, styles of quickJumper are automatically disabled. New component Token: $color-pagination_quickjump_text-disabled

#### 🎉 1.31.0-beta.0 (2021-09-18)
- 【Feat】
  - Upload add beforeRemove (callback before deletion) and beforeClear (callback before emptying), which can be used to prevent file removal
  - Pagination adds showQuickJumper to quickly jump to a page
  - DatePicker added rangeSeparator API to support replacement range date separator
  - Table
    - Added the defaultSortOrder API to support setting a default sort order for columns 
    - Added expandRowByClick API to support click row expansion 
- 【Fix】
    - Fixed the problem that the width of the input box changes when the input width is not set and hideSuffix is true, and when the button hover is cleared 
#### 🎉 1.30.2 (2021-09-17)
- 【Style】
    - Fix the problem of the height change style of the header on the right side of the Transfer component

#### 🎉 1.30.1 (2021-09-13)
- 【Fix】
    - Fix the problem that Button prevents the event from bubbling in any situation, causing the Upload to be unavailable

#### 🎉 1.30.0 (2021-09-10)
- 【Fix】
  - Fix Tooltip getPopupContainer error report
  - Fix Pagination error when `total` is too large
  - In disabled Button, it is expected that the click event will not propagate
- 【Chore】
  - Update the type definition of TimePicker defaultValue and value
  - Fix the dts of Card shadows, change'show' to'always'

#### 🎉 1.30.0-beta.1 (2021-09-06)
- 【Fix】
  - Fix Cascader in the case of a long list, after clicking the clear button, the dropdown is misplaced.
- 【Docs】
  - Fix the problem that the name is incorrectly written when introducing the api in the Table document. defaultExpandGroupRows is changed to defaultExpandAllGroupRows, expandGroupRows is changed to expandAllGroupRows.

#### 🎉 1.30.0-beta.0 (2021-09-03)
- 【Feat】
  - CheckboxGroup and RadioGroup support type='card' and type='pureCard' 
  - Tree supports expandAll 
  - Form Field supports incoming ref 
  - TextArea supports showClear and onClear 
  - Treeselect
     - Support disableStrictly 
     - Support expandAll 
  - The theme supports opening the partial dark/bright color mode through configuration. For details, click 
  - Table supports expandAllRows, defaultExpandAllGroupRows, expandAllGroupRows API 
- 【Fix】
  - Tooltip
    - When the container is body, if the body has margins, the position of the pop-up layer is wrong 
    - Fix the issue that onVisibleChange does not occasionally trigger 
    - Fixed the problem that when mouseEnterDalay and mouseLeaveDelay are both 0, the mouse quickly swipes over the pop-up layer and cannot be hidden 
  - When DatePicker type is date, onFocus is not triggered when focusing again after losing focus 
  - Icon lazy loading icon not loaded fix 
  - Calendar fixes the problem of head misalignment 
  - Fix the issue that the slider does not take effect in the controlled mode onAfterChange
- 【Style】
  - Tree and TreeSelect support search highlighting 
  - When CheckboxGroup direction='horizontal', the margin-right of the last checkbox is set to 0 to align with the vertical situation
  - Fix the problem of upload photo wall mode, disabled pointer style is not prohibited
- 【Docs】
  - Fix the problem that the TagGroup demo is not vertically aligned 

#### 🎉 1.29.1 (2021-08-30)
- 【Fix】
  - Fix the problem of unregister error due to stringify exception when adding or deleting rows after onChangeWithObject is turned on using Form.Select in ArrayField 

#### 🎉 1.29.0 (2021-08-27)
- 【Feature】
  - Added Icon, layers
- 【Fix】
  - Fix the issue that the columns cannot be aligned when Table column render returns rowSpan and there are fixed columns 
  - Fix InputNumber formatter has different effects in controlled mode and uncontrolled mode 
  - Fix DatePicker disabled start date cannot modify end date issue 
- 【Style】
  - Cascader search highlight color replaced with --color-primary 
  - Change the extra color of Checkbox and Radio when disabled from --color-text-2 to --color-disabled-text
  - When InputNumber is passed in the disabled prop, add a disabled color to the button 
- 【Chore】
  - Optimized the definition of 13 component types such as Avatar, Banner, DatePicker @xiezhiqiang
  - DatePicker disabledDate parameter exposes rangeEnd value 
  - Optimize Table type definition 

#### 🎉 1.29.0-beta.0 (2021-08-20)
- 【Feature】
    - TagInput
        - Support autoFocus 
        - separator supports array format, allowing multiple separators to be set 
    - Cascader
        - Support onClear 
        - Support showNext, allowing to set the expansion timing of the Dropdown submenu
    - TreeSelect supports searchPosition 
    - Steps support onChange 
    - Switch supports loading 
    - Slider vertical mode supports reverse direction, that is, up-large and down-small 
- 【Style】
    - **The spacing of Space is changed from margin to gap. After turning on wrap, the child element in the last line no longer has a bottom margin, and the last element of each line no longer has a right margin** 
    - The right margin of the selection of TreeSelect is set from 12px to 0 to align the Select component 
- 【Fix】
    - TreeSelect
        - Fix the problem that the drop-down box will not be collapsed if the selected item is selected during single selection
        - Fixed the issue that size is invalid when multiple is used 
    - Slider
        - Fixed the problem that onAfterChange entered parameter values ​​incorrectly in special situations
    - Select
        - Fixed the problem of icon and text wrapping when the virtual list text is too long
    - DatePicker
        - Fix that notifyChange causes an error in formatting date after selecting a date in dateRange controlled mode 
- 【Docs】
    - Introduction of treeData types in Cascader Supplementary Document 
- 【Chore】
    - TreeSelect supplements the dts type definition of triggerRender input parameter and the corresponding document description

#### 🎉 1.28.4 (2021-08-19)
- 【Fix】
    - DatePicker
        - In the dateTimeRange type, fix the problem when determining whether the date is disabled

#### 🎉 1.28.3 (2021-08-19)
- 【Fix】
    - Cascader
        - Fix the error of forEach is not a function when autoMergeValue is false
        - Fix the issue that clearBtn is displayed when the selected item is empty when multiple is true and showClear is true

#### 🎉 1.28.2 (2021-08-18)
- 【Fix】
    - Steps
        - Fix the problem that Steps Component Design Token not work

#### 🎉 1.28.1 (2021-08-16)
- 【Feature】
    - The built-in copywriting of the component supports Traditional Chinese 
- 【Fix】
    - Select
        - Fix the problem that the key is contained in the optionList when controlled multiple selection and onChangeWithObject is true, and the key is lost in the onChange callback when the first selection is made 
        - Fix the issue that after onChangeWithObject is turned on, the option in onChange will additionally include certain internal Select states such as selected, show, etc. 
        - Fix the problem of creating new options when the filter allowCreate is enabled at the same time and the search options are hit. 
    - Calendar
        - Fix the problem of default locale error 
    - Fixed the problem that the icon of UMD product did not decolorize
    - DatePicker
        - **In dateRange and dateTimeRange types, the option of dynamic disable date is supported. For example, when startDate is selected, when endDate is selected, dates smaller than startDate are not selectable.**
        - **In the dateRange and dateTimeRange types, the highlight area of ​​the trigger when selecting a date has been optimized. The previously completed trigger is highlighted and switched to the input area. Contains background and borders. For example, when startDate is selected, the startInput area will be highlighted.**
            - **Note: The trigger of DatePicker has been adjusted to implement this function. Include a layer of div in the outer layer of the input.**
        - The notifyChange is triggered when the repair range selection date is not completed(from v1.26) 
    - TreeSelect error after double-clicking the dropdown box sub-item 
- 【Style】
  - Select.Option adds flex-wrap to avoid the problem of abnormally long text display in some cases when searching
- 【Chore】
  - Typography removes the dangerouslySetInnerHTML attribute in the type definition file
  - Notification type definition issue update, add open attribute, remove non-existent confirm attribute
- 【Docs】
  - Button added noHorizontalPadding documentation 


#### 🎉 1.28.0-beta.0 (2021-08-06)
- 【Feature】
    - Cascader supports  multiple、onExceed、max、maxTagcount、showRestTagsPopover、restTagsPopoverProps、autoMergeValue API 
    - DatePicker add API `syncSwitchMonth`, which allows the dual-panel month to be switched synchronously in the range selection scenario 
    - DatePicker add callback `onPanelChange`, which is triggered when the month is switched around 
- 【Style】
    - Fix the difference between the horizontal margin of +N and the design draft in TagInput, and add 8px to the horizontal inner margin of +N
    - Radio
        - Fix the difference between the default radio background color of the button type and the design draft, from var(--color-fill-1) to var(--color-fill-0)
        - Fix the problem that the button type Radio is not aligned, add align-item: middle
    - Design Token
        - PopConfirm add new component sass token: $radius-popconfirm-popover , you can use it to modify border-radius of popConfirm
        - Add new css global token: --border-radius，can be used to create full-size rounded corners, such as capsule labels, etc.
- 【Fix】
    - Table
        - Fixed the problem of incorrect rendering of selectable cells disabled with controlled rowSelection
        - Fix the problem that the table data is not sorted correctly with controlled columns.sortOrder
        - Fix the problem that if the dataSource is updated when there are filtering items, all the dataSource will be displayed without filtering 
- 【Docs】
    - Add demo of autoExpandParent usage in Tree component documentation
#### 🎉 1.27.3 (2021-08-05)
- 【Fix】
    - Optimize the interactive experience of DatePicker dateRange and dateTimeRange scenes. Support in one selection, you can change startDate or endDate alone, or change at the same time
#### 🎉 1.27.0 (2021-07-30)
- 【Fix】
    - Fixed an issue where SideSheet does not display correctly when SideSheet mask is set to false and width is set to a percentage string 
    - Tag adds support for default size, fix the problem of using default size in InputGroup
- 【Style】
    - Tag adds white-space: nowrap, solving the incorrect display of the ultra-long wrap due to the highly fixed display (Tag recommended single line usage, long-content is recommended to use Typography)
- 【Chore】
    - Table dts adds RecordType generic, improve the column.render parameter definition
#### 🎉 1.27.0-beta.0 (2021-07-23)
- 【Feature】
    - Breadcrumb supports renderMore and moreType API, which can customize the rendering of ... area 
    - Select supports keyword highlighting when searching (only when option label/chilren is a pure string text) 
    - In Pagination mini mode, add hoverShowPageSelect API to support hover to quickly switch page numbers 
    - TreeSelect added searchAutoFocus API, which supports automatic focus of the search box in the search function
    - Cascader supports topSlot and bottomSlot API 
    - Modal supports automatically calculating the width of the scroll bar to prevent the content behind the mask from jittering when it pops up 
    - Navigation adds limitIndent API for indentation limit, and new toggleIconPosition API for control expand collapse icon position
    -   - Tree supports drag and drop in renderFullLabel scene
- 【Fix】
    - Fix the problem that Notification has a small probability of failure when the same task queue is quickly displayed and hidden 
    - Fix the logic problem of processing judgment of selecting all/deselecting all and emptying the Transfer components 
- 【Docs】
    - Fix the jump link of the tooltip position in the Dropdown document

#### 🎉 1.26.1 (2021-07-20)
- 【Fix】
    - Fix the problem that DatePicker directly reports an error when switching time 
- 【Style】
    - Fix the problem that the disabled style does not meet expectations when DatePicker has defaultValue 
- 【Docs】
    - Modified and supplemented the content of triggerRender in the Cascader and Select component documents

#### 🎉 1.26.0 (2021-07-18)
- 【Fix】
  - Fix the issue that RadioGroup reports errors when transmitting Radio between levels 
  - Fix the problem that the React.Fragment display in Space does not meet expectations 
  - Fix Collapsible does not keepDom, but renders the DOM during initial folding 
  - Fix the issue that ArrayField was not reset to the initial state when Form reset 
  - Fix an issue where the verification status was not updated correctly when the Form field rules were changed from a valid array to an empty array 
  - Fix an issue where onValueChange was triggered by mistake when the initial value of Form ArrayField was configured through initValue 
  - Fix column misalignment issue when rowSpan of Table header column is 0 
  - Fix DatePicker calling onChange when the date has not changed 
  - Fix the problem that DatePicker disabledDate and disabledTime pass parameters are not adapted to timeZone. 
- 【Style】
  - The color of the selected text in the navigation first-level directory is aligned with the design draft, updated from --color-primary to --color-text-0 
  - Navigation horizontal navigation bar optimizes the interaction details, removes the arrow flip animation 
  - The style of text color after hover in Radio unchecked state, remove var(--color-primary) text highlight
  - Adjusted the width of Table resize hot zone from 1px to 8px 
- 【Chore】
  - Supplement DatePicker triggerRender and renderFullDate type definition
  - Supplement the afterClose type definition of Select
  - Table adds row/column merge example


#### 🎉 1.26.0-beta.2 (2021-07-14)
- 【Fix】
    - Fixed the problem that ArrayField did not return to the initial state when Form reset
    - Fix the problem that the verification status is not updated after Form Field rules is changed from a valid array to an empty array 

#### 🎉 1.26.0-beta.1 (2021-07-14)
- 【Fix】
    - Fix DatePicker split input box is not compatible with triggerRender issue
    - Fix the issue of calling onValueChange when the Form ArrayField is initialized 

#### 🎉 1.26.0-beta.0(2021-07-09)
- [Feature]
    - Radio supports button style
    - TreeSelect supports renderSelectedItem API, can customize the selected item 
    - DatePicker dateRange and dateTimeRange scenes split the input box, and you can change the start or end separately to optimize the interactive experience 
    - Cascader added filterLeafOnly to support searching and selecting non-final data 
- [Fix]
    - Fix the problem that clicking the prefix/suffix of Input will not make the input box focus 
    - Fix the problem that Input uses addonBefore and showClear styles at the same time 
- [Style]
    - Fix the problem that the indent of Tree and TreeSelect levels are inconsistent with the design draft, updated from 8-40-60-100 to 8-28-48-68
    - **Please pay attention to scenarios where the DatePicker type is dateRange or dateTimeRange, the input box DOM is modified, and one input box is split into two input boxes; the inputStyle property will be bound to the two input boxes; the blur behavior is determined by the monitoring input box OnBlur is called when blur is changed to closePanel.**
    - **Please pay attention to the new default height of the Input style. If you customize the padding for the Input, since the Input is a border-box, please set the height of the Input to the default height + custom padding**
- [Docs]
    - Table supplement column.title description, explaining the influence of different parameter types on title rendering
#### 🎉 1.25.0 (2021-07-02)

- 【Fix】
    - Fixed DatePicker placeholder character string not working
    - Fixed height calculation error caused by complex content passed in Collapse
- 【Chore】
    - Update the type definition files of TreeSelect and Tree 
- 【Style】
    - Update Notification width from 320px to auto
#### 🎉 1.25.0-beta.3 (2021-07-01)

- 【Fix】
    - Fix the issue that renderSelectedItem does not trigger execution when Select value=0 and there is no corresponding Option in optionList 

#### 🎉 1.25.0-beta.0 (2021-06-25)

- 【Chore】
    - Optimize the build volume, multi-language package supports tree shaking, this change involves components LocaleProvider, DatePicker, TimePicker, Calendar

#### 🎉 1.24.7 (2021-06-22)

- 【Chore】
    - Optimize build size, multi-language package supports tree shaking. This change involves components LocaleProvider, DatePicker, TimePicker, Calendar.

#### 🎉 1.24.4 (2021-06-21)

- 【Fix】
    - Fix the problem that Navigation calls setState when it is not mounted 
#### 🎉 1.24.2 (2021-06-20)

- 【Fix】
    - Fix the problem that the dropdown layer is too wide after the AutoComplete data changes and does not automatically switch positions 
    - Fix Cascader, Tree internal state loadedKey is accidentally updated
- 【Chore】
    - We added the design tokens page，and all components have  design token part now;

#### 🎉 1.24.1 (2021-06-20)

- 【Fix】
    - Fix DatePicker warning dateFnsLocale prop is marked as required

#### 🎉 1.24.0 (2021-06-18)

- 【Chore】
    - Update Column dts, complete useFullRender type.

#### 🎉 1.24.0-beta.2 (2021-06-17)

- 【Fix】
    - Fix the problem that TimePicker uses Input to modify the time and the interaction is not smooth 

#### 🎉 1.24.0-beta.1 (2021-06-15)

- 【Feature】
    - DatePicker
        - DatePicker added onPresetClick API
    - Upload
        - Upload component added onAcceptInvalid API 
#### 🎉 1.23.5 (2021-06-11)

- 【Fix】
  - Fix the problem that the header of the virtualized table cannot be aligned with the body


#### 🎉 1.23.4 (2021-06-09)

- 【Fix】
  - Fix the issue that input dateStr after DatePicker format does not support multiple languages 

#### 🎉 1.23.1 (2021-06-07)

- 【Fix】
   - Fix the error of prop columns and children JSX columns when Table is transmitted at the same time
   - Fix the problem that the table header and body cannot be aligned in some usage scenarios (passing scroll.y) when the mouse and keyboard are plugged in and out of Table 
   - Fix the problem that Slider does not support dragging on mobile 

#### 🎉 1.23.0 (2021-06-04)

- 【Fix】
  - Transfer
    - Fixed the issue that search results were not updated when dataSource was updated 
    - Fixed an issue where the removal icon was displayed on hover when disabled was selected 
  - Fix the automatic scaling problem of Dropdown.Item icon
  - Removed the disabled attribute added by mistake in .d.ts on floating layer components such as Tooltip and Dropdown (in fact, the component does not provide this API)
  - Fixed the issue that uploading the same file for the second time would fail when replacing a single file 
- 【Style】
  - Optimize Modal animation parameters to reduce the feeling of lag

#### 🎉 1.23.0-beta.0 (2021-05-28)

- 【Feature】
  - AutoComplete
    - Added onChange API, which is triggered when the input box changes / candidates are selected, and always returns the string type
    - **The value type no longer supports the object type (because AutoComplete is an input-enhanced component, non-selection-enhanced)**
  - Toast
    - Add ToastFactory, produce Toast through ToastFactory.create(), solve the problem that getPopupContainer cannot be changed after configuration
  - Icon
    - Added resso brand icon
- 【Fix】
  - Fix the problem of children rendering error caused by incorrect TabPane rendering timing caused by incorrect Tabs activeKey update 
  - Fix the issue that DatePicker has daylight saving time offset in some time zones 
  - Fixed the problem of missing popover arrows (affecting version v1.22.0)
  - Fix the transparent transmission of the Form.TextArea component to the insetLabel property of the native component
  - Fix the problem that the input box can be changed when the value is controlled and equal to "" in AutoComplete
  - Fix the problem of AutoComplete, the priority of defaultValue is higher than value
  - Fix the problem of the wrong type of space .d.ts

#### 🎉 1.22.2 (2021-05-24)
- 【Fix】
  - AutoComplete
    - Fix the problem that the AutoComplete option cannot be selected when clicking on the padding


#### 🎉 1.22.0 (2021-05-21)
- 【Fix】
  - Table
    - Fixed Table Column JSX writing method update data table behavior abnormal problem 
   - Fixed the problem that Table warning that each item in the array needs to be given a separate key
   - Fixed the problem that the replacement function of Upload fails when limit=1
   - Fixed Error caused by defaultValue/value is invalid when Select dynamically switches multiple
   - Fixed DatePicker did not clear the panel date behavior after clicking the clear button
   - Fixed the issue that dateTime cannot be used when setting the time zone in DatePicker 
   - Fixed Pagination's built-in paging capacity Select selector value display does not match after dynamically changing pageSize 

#### 🎉 1.22.0-beta.0 (2021-05-14)
- 【Feature】
  - DatePicker
    - Added topSlot/bottomSlot API to render additional top and bottom areas 
    - format adapts to multiple languages ​​and is consistent with the language provided by LocaleProvider 
  - Transfer
    - Newly added sortableHandle parameter for renderSelectedItem, which is used for draggable scene configuration to customize the selected option rendering
- 【Fix】
  - Form
    - Fix the situation where the error object in errors may be swallowed and become {} when the submit verification fails 
    - Fix the problem that when trigger includes mount and validate is asynchronous verification, the initial verification is not triggered after mounting 
  - Table
    - Fix the problem that all rows of disabled can select the second page data 
    - Fix the problem of sorting failure when using function components (affecting version v1.21) 
    - Fix the issue that the column did not update when dynamically switching rowSelection (affecting version v1.21)
    - Update Table reverse order sorting logic, from ascending order first + reverse => reverse order sorting 
    - Fix the column alignment problem caused by the vertical scroll bar when the table is configured with scroll.y and the current page data is not enough 
  - Radio fixes the problem that advanced will not take effect if div or other tags are nested between group and radio when mode='advanced' 
  - Fix the problem that the className passed into the Card component does not work
  - Fix the problem that the defaultValue not work in Transfer
  - Fixed an issue where the Calendar component displayed an abnormal number of events
  - Fixed the issue that the clear button clicked invalid under conditional rendering of Input 
  - Fixed the problem that InputNumber step is set to 0.1, min is 0, max is 1, and cannot be reached by the plus sign on the right side 
  - Select
    - Fix the problem that ref.selectAll does not take effect when Select onChangeWithObject is true; fix the problem that onChange is not triggered after calling ref.selectAll 
    - Fix the problem of updating the optionList after Select search and changing the number of options, in some cases directly hitting Enter will throw Uncaught TypeError: Cannot read property'_inputCreateOnly' of undefined
  - Fixed the problem that propType check warning was thrown when the Description data key was passed into reactNode
- 【Style】
  - Radio and Checkbox border color are aligned with the design draft, unified update to var(--color-text-3) 
  - Fix the incorrect color of Radio disabled border 
  - Fix the problem that the Avatar label is not vertically centered 
  - Refactor component-based design tokens in order for customization through theme

#### 🎉 1.21.0 (2021-04-30)
- [Fix]
   - Fix the problem that the calendar component displays the time abnormally across months 
   - Fix the error of nested label of title and description of Banner component
   - Fix the problem that the buttons are not highlighted when the Table component is sorted when customizing prefixCls
   - Fix the comma problem in Typography copy, compatible with array type children
- [Chore]
   - Fix the circular dependency problem of Typography component 
- [Style]
   - Typography Paragraph margin is set to 0. **Please note that the default value of margin has changed if you did not introduce [reset.css] (https://www.npmjs.com/package/reset-css), its margin will inherit from the browser (1em), and now the default margin is 0**.
- [Docs]
   - Supplement Typography component API, component can support custom Typography rendering elements

#### 🎉 1.21.0-beta.2 (2021-04-27)
- 【New Component】
  - New Card component
- 【Feature】
  - TagInput supports max, showRestTagsPopover, restTagsPopoverProps, showContentTooltip
  - Support Form.TagInput
  - Table supports expandedRowRender, modify it to return null, then the expanded row will not be rendered 
  - Upload component supports single file replacement
  - Icon component added onMouseDown onMouseUp onMouseMove api
- 【Fix】
  - The maxTagCount behavior of TagInput is corrected, aligning to other components (display +N after exceeding)
  - Fix the error of nested tag of title and description of Banner component
- 【Perf】
  - Table rendering times are optimized, row selection single-select scene and global refresh issues are optimized 
- 【Chore】
  - Fix the circular dependency problem of the Typography component 
- 【Docs】
  - Update Typography component docs, component prop can support custom Typography rendering elements
- 【Style】
  - --color-disabled-bg down a color scale, quote -grey-1, improve the contrast between background and text, improve readability
  - Use --color-text-1 for the text color of tietrary button, which also improves contrast + readability
  - For borderless + split button, the hover state of the button body and the drop-down arrow are separated to clarify the hot zone


#### 🎉 1.20.3 (2021-04-29)
-【Fix】
  - Add open, close and other instance call methods to the Class type of Select
  - Fixed an issue where Progress called setState when it was unmounted, causing React to report an error
  - Cascader does not display child nodes when there is an unmatched initial value 
  - Breadcrumb noLink style fix
  - The Upload progress bar is adjusted to reach 100% after receiving a clear response from the server
  - Fix DatePicker can enter the disabled date issue in controlled mode 
  - Fix the problem that Table sorter is not highlighted when clicking on the custom prefixCls scene


#### 🎉 1.20.0-beta.4 (2021-04-12)
- 【Feature】
  - Upload support upload directory 
  - Transfer supports tree shuttle box 
  - TagInput added addOnBlur and allowDuplicates api
  - Table adds an interface to get the virtualized table ref 
  - Anchor adds default anchor point 
  - Anchor.Link added disabled 
- 【Fix】
  - Fix Navigation item font-weight error (introduced in version 1.18)
  - After using prefixCls, Tabs is set to collapsible, and there is an error when switching tabs
  - Fix the RTL problem of Form label and Table filter dropdown item
  - Fix that when the Anchor has a scroll container, click on the anchor and the scroll container will scroll 
  - Fix the problem of displaying all data when the Table filter result is empty 
- 【Style】
  - Display ToolTip when TagInput tag is too long and truncated 
  - Add 2px margin between title and description in Banner non-full screen mode 
  - Form label font-weight update from 700 to 600, the corresponding scss variable font-weight-bold is also adjusted from 700 to 600 


#### 🎉 1.19.0 (2021-04-02)
- 【Fix】
  - Fix the issue where the second-level selectedKeys was set when Navigation was initialized, and the first-level title did not have an activated style
  - Fix the problem that the dynamic modification of Avatar does not take effect in hoverMask
  - Fix the problem that the second filter in setState becomes invalid after clicking the first filter in Table 
  - TagInput
    - Fix the space interaction problem of TagInput 
    - Fix TagInput setInputValue('') invalidation 
  - InputNumber
    - Fix the problem that the input box of ⬆️ and ⬇️ buttons in InputNumber controlled mode is not updated 
    - Fix the problem that there is no response when the illegal value is passed in InputNumber under controlled mode 
- 【Style】
  - Removed the border style in Modal fullScreen
  - Fix the problem that when Tabs type='line' and size is small, setting tabBarExtraContent will cause the bottom border of the tabBar to be incorrectly styled when the height is stretched
  - TagInput
    - Fix TagInput label length exceeding problem 
    - Fix the width problem of TagInput wrapped with withField 

#### 🎉 1.19.0-beta.0 (2021-03-26)
- 【New Component】
    - TagInput 
- 【Fix】
    - Fix error when pressing enter in AutoComplete 
    - Fix null error in Description DataItem
    - Fix incorrectly execution of uploading new fileInstance when calling Upload beforeUpload  
    - Fix Navigation selected and disabled style 
- 【Style】
    - If DatePicker popup position is set to top, week panel will be fixed to show 6 weeks 
#### 🎉 1.18.0 (2021-03-17)
- 【Fix】
   - Fix the problem that the onChange function is not bind when the Select multi-select is controlled. Clicking the x on the tag can still delete the selected item 
   - Fix the issue that onNumberChange is triggered after the input value exceeds max when InputNumber is controlled 
   - Fix the problem that the Select can be actived by clicking or through the tab button when the Select is disabled
- 【Style】
   - Select clear icon adds flex-shrink to solve the problem of setting mulitple+showClear, and in some cases the length jitter when the mouse is hovered 
- 【Chore】
   - Update the Table component type definition file and add children to column

#### 🎉 1.18.0-beta.0 (2021-03-12)
- 【Feature】
   - New methods for Select ref: clearInput to clear the Input box, selectAll to select all, deselectAll to deselect all
   - The Steps component has been revised and added a new type with connecting lines and navigation 
   - Upload component supports onRetry, onOpenFileDialog and onError return native xhr objects 
   - Tree component supports leafOnly attribute
   - SideSheet added keepDOM api
   - Modal adds fullScreen api
- 【Fix】
   - Fix the error when the Tree component uses loadedKeys
#### 🎉 1.17.0 (2021-03-05)
- 【Feature】
  -  Added `dislike_thumb` and `unlink` icons
- 【Fix】
  -  Fix that the sourcePanelProps type declaration exported by Transfer is missing selectedItems 
  -  Fix the upload component renderFileItem parameter is inconsistent with the declaration 
  -  Fix the problem that SideSheet closeOnEsc only takes effect when it gets the focus
  -  Fix the filling color problem of scan icon
- 【Docs】
  -  Upgrade the official website live demo editor

#### 🎉 1.17.0-beta.0 (2021-02-26)
- 【New Component】
  - Added Space component
- 【Feature】
  - DatePicker adds small size 
  - Navigation supports disabling the navigation bar 
  - Added Portuguese-Brazil (pt-BR) language pack 
  - Added support for Descriptions JSX writing 
- 【Fix】
  - Fix resizable usage problem in Table rowSelection controlled mode 
  - Fix the overlap between Input suffix icon and clear icon 
  - Fix the problem that ArrayField cannot be removed, affected version 1.16.0-beta-1.16.3 
  - Fix the style problem caused by Tooltip icon update 
  - Fixed an issue where the Avatar could not display the floating layer correctly when it was wrapped by Dropdown, Popover and other components
  - Fix the problem of Tabs reporting errors in cases where children are empty 
- 【Style】
  - Navigation adds press status, select hover and other statuses 
  - Fix the problem of missing the right border when there is no data after setting the bordered property of Table 
  - Removed the text display of hours, minutes and seconds in TimePicker in Russian, Thai, Turkish, and Vietnamese, that is, only the number is retained, but the unit is not retained
- 【Docs】
  - Fix the problem that the input type of the document is inconsistent with the type definition file, type boolean => string, the default value is false => text

#### 🎉 1.16.0 (2021-02-20)
- 【Fix】
  - Timeline component, report an error when children are not compliant 
  - Fix DatePicker dynamically disabled date reporting error 
  - Fix the problem that Radio mode=advanced mode introduced in version 1.16.0-beta is not available 
- 【Style】
  - Fix the style when Modal has no title but header 
- 【Chore】
  - Lock the svgo version (v1.2.2), svgo-loader version

#### 🎉 1.16.0-beta.0 (2021-02-05)
- 【Feature】
  - Select onExceed adds Option as input parameter 
  - Dropdown adds icon and iconType API, which makes it easier to configure icons 
  - Radio added addonStyle, addonClassName 
  - DatePicker added onClear API, this callback is triggered when the clear button is clicked
  - AutoComplete added emptyContent and autoFocus API 
  - Modal adds afterClose callback, which will be executed after the animation ends
  - Timeline added dataSource API, which supports passing in as an array 
  - Cascader supports onChangeWithObject 
  - Breadcrumb.Item 
    - Support setting noLink to remove the effect of hover and active
    - Support setting the separator of the child to override the parent
- 【Fix】
  - Fix the problem that you need to click twice to select Option after Select is enabled for virtualization 
  - Fix the error report that the incoming fileList is undefined in the controlled scenario of Form.Upload of version v1.15
  - Fixed an issue where Modal closeOnEsc must be focused to exit
  - Fixed the problem of incorrect target tabs when scrolling multiple Tabs scenarios
  - Table
    - Fix sortOrder invalidation and sort invalidation problem after dataSource update 
    - Fix the problem that the header of the virtualized list cannot be aligned with the column when there is no fixed column 
  - DatePicker
    - Fix the problem that the second time selector cannot be used when the minuteStep step is large 
    - Fix the issue that the needConfirm cannot use the input box to change the selected date 
- 【Perf】
  - Cascader/TreeSelect/Tree single selection Clicking on the selected option always triggers onSelect 
- 【Style】
  - Fixed the issue that the border would shift down by 1px and the box-shadow was incorrect when the button was clicked on the Slider 
  - Fixed the problem of incorrect insetLabel spacing when Cascader was in RTL
  - Modal optimize the style when there is no title 
- 【Chore】
  - Cascader Data.value PropTypes verification alignment d.ts statement 
  - Update the DateInput / Cascader type declaration and add the input parameters of the callback function
  - Fix the error of BaseForm autoScrollToError type

#### 🎉 1.15.0 (2021-01-29)

- 【Fix】
  - AutoComplete auto expand option list in out of focus 
  - Upload controlled mode not rendered according to fileList 
  - Fix the issue of expansion logic when using onLoad and search together in Tree component 
  - Fix the problem that when selecting autoFocus, directly clicking on the external out of focus does not trigger the onBlur event 
  - Fix Table functional component rowSelection failure when using literal value 
- 【Style】
  - Solve the problem that Form.Section does not reference css variables and displays abnormal in dark mode
  - Description Add an explicit line-height declaration to prevent inheritance when the parent sets the line-height
- 【Chore】
  - Update Form autoScrollToError type definition to supplement object type

#### 🎉 1.15.0-beta.0 (2021-01-24)

- 【Feat】
    - Cascader cascading menu `onListScroll` monitoring function is implemented to realize drop-down paging, etc. 
    - Added `fieldStyle` to Form Field component props, allowing to define the inline style of the entire field block 
    - Add the `arrowIcon` API for Select, Cascader, and TreeSelect to allow customizing the right drop-down arrow Icon 
    - Align the components (AutoComplete, Cascader, DatePicker, Select, TimePicker, TreeSelect) with the `triggerRender` API into the parameters 
- 【Fix】
  - Fixed an issue where Form declared labelAlign invalid when using wrapperCol and labelCol 
  - Fixed the issue that if the pure digital field under the array path exceeds the boundary of the JS array during Form submit, the key will be cleared during submission 
  - Fixed the issue that DatePicker can select the disabled date through the Input box
  - Fixed TreeSelect reporting an error when treeData is an empty array and value is empty string array 
  - Fix the problem that the extra content and the tabs-bar are not aligned in the vertical direction when the tabs are in type='button'/'card' mode 
- 【Style】
  - **Body font-family adds `Inter` font as a priority option** 
  - **Modal adds border shadow style by default** 
  - **Adjust the spacing between various Radio, Checkbox and Form Labels in the form** 
  - Tabs remove the padding-left of the first Tab bar when type='line' (4px=>0px), which makes it easier to align left with other Title level elements 
- 【Docs】
  - Table component added 📚 Semi Table FAQ & Self-Check Manual
  - Add Typography.Title to support omitted Tooltip content customization example #973; Add the use example of link text button
- 【Chore】
  - Update Typography dts，extends HTMLParagraphElement、HTMLSpanElement、HTMLHeadingElement 

#### 🎉 1.14.0 (2021-01-15)
- 【Fix】
  - Fix Empty Illustration not centered in FireFox 
  - Fix autoAdjustOverflow positioning problem in Tooltip  
- 【Docs】
  - Add content api documentation to Modal 
  - Add documentation for how to use Semi with create-react-app


#### 🎉 1.14.0-beta.0 (2021-01-10)

- 【Feat】
    - Add validateStatus prop to AutoComplete component 
- 【Fix】
    - Fix the problem of displaying state when Cascader is controlled and dynamically loading data
    - Fix the problem of Form.AutoComplete embedded label does not show correctly
- 【Style】
    - Fix the problem of missing color-info series color variables in dark mode

#### 🎉 1.13.0 (2021-01-04)

- 【Fix】
    - Fix the problem that Navigation initializes data at incorrect timing in SSR scenarios, and unified the data initialization operation by componentDidMount => constructor function.

- 【Chore】
  - Update the CheckEvent interface parameter type in the Checkbox dts file, from optional => mandatory
  - Improve the type definition of the data parameter in the Descriptions dts file
  - Export the Field type definition and the type definition of the Transfer component Item in the Form dts file


#### 🎉 1.13.0-beta.0 (2020-12-25)

- 【Feat】
    - DatePicker 
        - Supports dropdownClassName and dropdownStyle
        - Supports autoSwitchDate prop. When changing the year and month through the left and right buttons at the top of the panel and the drop-down menu, the date will not be automatically switched
    - Table supports using renderPagination custom pagination
    - Empty
        - Added `idle` illustration
        - Add dark mode matching illustrations, and support the introduction of illustrations that need to be used in dark mode through `darkModeImage` to better adapt to dark mode
    - added some icons
- 【Fix】
    - Fix Anchor anchorID failure in SSR scenarios causing the current Link not to be highlighted
    - Fix the problem that the doubleClick event of Tree fails
    - Fix Upload error if file is not in fileList
    - Fix an error when Tabs uses a single TabPane and keepDOM = \{false\}
- 【Style】
    - Tooltip text color and floating layer color modification to better adapt to dark mode
    - Checkbox adds a corresponding className to the checked checkbox
- 【Chore】
    - Update Checkbox dts to improve the type of onChange input parameter e
    - Update DatePicker dts, increase spacing
- 【Docs】
    - DatePicker adds a closed time list infinite loop example

#### 🎉 1.12.0 (2020-12-18)

-   【Fix】
    -   Fixed the warning of value required in the Cascader Trigger console
    -   Fixed the problem of abnormal verification of PropTypes of BreadCrumb.Item
    -   Fix the missing problem of Tree onDoubleClick dts

#### 🎉 1.12.0-beta.0 (2020-12-11)

-   【New Component】
    -   Semi adds a component named SplitButtonGroup 
-   【Feat】
    -   Collapse supports setting the position of the expand / collapse button 
    -   Descriptions provide a hidden prop to hide rows 
    -   Dropdown adds the menu prop to configure the content in JSON format
-   【Perf】
    -   Optimization of Tree virtualization full selection performance problem 
-   【Fix】
    -   Fixed that the data was not updated normally when Tree's treeData and expandedKeys were dynamically updated at the same time 
    -   Fixed that Cascader custom triggeRrender did not send out onInputChange
-   【Style】
    -   **The default icon with error meaning is replaced from "clear" to "alert circle" (x => !), involving the components Form, Toast, Notification, Banner, Modal and Upload** 
    -   Modify the border style of disabled Select focus state
    -   Table header displays asymmetry in dark / light mode 
-   【Chore】
    -   Standardize the internal code filename, and change .js =>. jsx with React content (only rename, export unchanged, no impact on external use) 

#### 🎉 1.11.0 (2020-12-04)

-   【Fix】
    -   When uploading multiple files, the Upload component retains the accept format file to continue uploading 
    -   The icon property of BreadcrumbItem updates d.ts to keep the ts type consistent with the protoType type 
-   【Style】
    -   Added the style of the drag-and-drop Upload disabled state; fixed the problem that the drag area is still highlighted after the drag-and-drop Upload is dragged and released
-   【Chore】

#### 🎉 1.11.0-beta.0 (2020-11-27)

-   【Feature】
    -   New language packs: Indonesian, Russian, Vietnamese, Malay, Thai, Turkish 
    -   Upload onRemove adds currentFileItem as third parameter
    -   Transfer
        -   Added draggable sorting 
        -   Added renderSourcePanel and renderSelectedPanel functions, allowing complete customization of component rendering structure 
    -   Select
        -   Added onListScroll scroll callback 
        -   ref added focus() method 
    -   Avatar added size `default`（40x40）
    -   Grid supports gutter to pass in arrays, while defining vertical and horizontal intervals 
    -   Tabs support small, medium and large size
    -   TreeSelect supports searchRender, search and close methods
    -   Typography link supports the use with disabled
-   【Fix】
    -   Fix that all rows are not expanded when defaultExpandAllRowKeys and groupBy are used at the same time 
    -   Fixed the problem that the parameters onExpand and onExpandedRowsChange were not passed correctly when clicking the collapsed buttons of the group 
    -   Fix the problem of inaccurate definition of Table empty and pagination d.ts 
    -   Tree/TreeSelect fixed the issue that renderFullLabel could not turn on virtualization because it did not transfer out style
-   【Perf】
    -   Table
        -   Improve the stuttering problem of the virtualization list 
        -   Improve the freeze problem when clicking the selection box in a large data scenario 
-   【Style】
    -   **The maxCount of TextArea is limited by the multi-line input box below => internal**
    -   **Add --color-info variables: if you are using custom theme, you need to publish a new version**
    -   Enforce the ability of .semi-light-scrollbar to take effect on all decendants elements

#### 🎉 1.10.0 (2020-11-20)

-   【Fix】
    -   Upgrade the async-validator version (3.2.4 = > 3.5.0) for the verification dependency of Form rules, and fix the problem of incorrect verification results returned under the deep-rules writing method 
    -   Fixed the problem of error number of files in the input parameter fileList of Upload afterUpload API 
    -   Select
        -   Fixed the issue of not rerendering when value changed from value to undefined in select controlled mode 
        -   Fixed a problem where Select option list were not rendered when filter and defaultOpen used together
    -   Fix the problem that overlap doesn't work when Avatar size=extra-extra-small 
    -   Fixed the error display of InputNumber keepfocus value in controlled case 
-   【Perf】
    -   Optimize dts of formApi and support passing generics @wangqinhong

#### 🎉 1.10.0-beta.0 (2020-11-13)

-   【Feature】
    -   Select add renderOptionItem API, highly customized option rendering 
    -   DatePicker
        -   Support single click selection range, which can be used for weekly selection and biweekly selection 
        -   Support autoFocus API which can control focus status of input box 
    -   InputNumber supports keeping the input box focused when you click add or minus button 
-   【Fix】
    -   Fixed a problem in which the Form field rules validation rules do not work when they are dynamically switched from null or empty arrays to arrays with length, such as `[{requried: true}]` 
    -   Fixed the problem that when the Form field configuration rules returns a string array, onsubmit will be triggered without onSubmitFail if the verification result is a string array 
    -   Fixed disableDate invalid for year when datepicker type = month 
    -   Fixed column scrolling error caused by rowSpan calculation error in Table with mouse 

#### 🎉 1.9.0 (2020-11-08)

-   【Feature】
    -   RadioGroup supports mode=advanced, allowing single-select combination to uncheck 
-   【Fix】
    -   Fix the positioning problem of Tooltip in Edge browser in Windows environment 
    -   Fix the problem that Option styles are lost in the production environment when only AutoComplete is used without Selec
    -   Fix the problem that window getComputedStyle is wrong when used with gar codesandbox
    -   Fix the problem that Select autoFocus does not take effect
    -   Fixed the problem that InputNumber keeps triggering onChange when clicking the up button to dynamically switch disabled 

#### 🎉 1.9.0-beta.0 (2020-10-30)

-   【Refactor】
    -   **Spin optimizes the DOM structure, used alone in hidden state no longer render**
-   【Feature】
    -   Form、Field support extraTextPosition 
    -   TreeSelect supports outerTopSlot 
    -   Breadcrumb supports maxItemCount and autoCollapse 
    -   Upload supports onDrop 
    -   InputNumber supports onNumberChange 
    -   Anchor supports targetOffset API to customize offset from top 
    -   DatePicker
        -   Optimize date selection order to allow users to switch year or month update dates in radio mode 
        -   Support dynamic disable date in range mode 
        -   Adds support to spacing
    -   InputGroup supports DatePicker 
-   【Fix】
    -   Fixed no callback on PreviewClick in Upload wall mode
    -   Fix the status of the eye button when switching password mode dynamically 
    -   Fix an issue where type does not match expectations when DatePicker format contains Hms 
    -   Spin
        -   Fix an issue where you can click on table contents when nesting tables in Spin 
        -   Fixed Spin not clearTimeout when unmount
    -   Fix Popconfirm position not working properly in v1.8.x
-   【Docs】
    -   Update DatePicker disabledDate and disabledTime api documentation
-   【Style】
    -   Fix left icon height issue in Banner non-full screen mode 
    -   Apply font-size:14px, line-height: 20, color: tertiary when Form.Field extraText is ReactNode

#### 🎉 1.8.0 (2020-10-23)

-   【Feat】
    -   TreeSelect supports optionListStyle API 
-   【Fix】
    -   Fixed the problem of Table selecting all logic errors in filter selected scenarios
    -   Fixed Table columns.onCell can't get style of undefined 
    -   Fixed the problem that the Slider could not slide to 0 when the step of the slider was not 1 
    -   Fixed an issue where clicking the button also triggers the onChange event when the Inputnumber value reaches min or max
    -   Fixed the error of input box id not unique in TimePicker
    -   Fixed Layout Sider Context.Provider warning
    -   Fixed warning when Breadcrumb icon passes into ReactNode
    -   Fixed Step dts description attribute cannot be ReactNode
    -   Fixed the problem that when Step title or description is ReacNode, hover prompts [object object object]
-   【Style】
    -   The corresponding decrease and increase buttons will turn gray when the Inputnumber value reaches min or max
    -   **Treeselect/Tree support labelElipsis, which is enabled by default in virtualization state, and the default value of other states is unified to false. And fix the incomplete display of label.** See more 
-   【Docs】
    -   The component API list is sorted in dictionary order to improve search efficiency

#### 🎉 1.8.0-beta.0 (2020-10-16)

-   【Feat】
    -   Tree supports drag and drop (when virtualization is used at the same time, drag and drop is temporarily not supported)
    -   Cascader supports asynchronous loading of data
    -   Tree supports labelEllipsis, which is turned on by default, and can be turned off if there are special omission requirements
    -   Upload add onPreviewClick to customize the click operation of the file card preview 
    -   Support international RTL/LTR, suitable for switching the direction of component text in multilingual scenarios 
    -   LocalProvider adds Arabic language support
-   【Fix】
    -   Fix the problem of wrong memo when withField encapsulates Functional Component
    -   Fix the problem of tabs keepDOM failure and breadcrumb reporting warning caused by react-hot-loader
    -   Fixed the warning that no key was passed in the map operation when TagGroup showPopover 
    -   Fix the invalid status of Upload customRequest onError
-   【Perf】
    -   Form component dts optimization: withField dts add generics, export the type definition of formApi
-   【Docs】
    -   Add usage document of upload component customRequest custom request method
    -   Add 🧾Semi Form FAQ & Self-Inspection Manual
    -   UMD version removes code comments

#### 🎉1.7.0 (2020-10-10)

-   【Fix】
    -   Fix the issue of dynamic update of Resizable Table header
    -   Fix the dts return type of Toast and Notification static methods
    -   Fix the problem that onClick does not exist in Step's .d.ts
-   【Style】
    -   Fix the center alignment of TreeSelect multi-select label

#### 🎉 1.7.0-beta (2020-09-18)

-   【Feat】
    -   Tree and Treeselect support renderFullLabel API, which can meet various highly customized rendering requirements of the label, such as the logical separation of parent node and child node 
    -   Semi supports global prefixCls replacement 
    -   List grid property supports passing grid's justify, type and align attributes 
    -   Typography adds success type
-   【Fix】
    -   Fix Form formApi.validate(['a', 'b']) when manually triggering partial verification, the verification results are not based on the input parameters, and the problem of full judgment is still adopted 
    -   Fix the problem that failed to reset Form.Checkbox after reset Form
    -   Fix the problem where the parent node was refreshed due to the dynamic deletion of child nodes when Tree was animated 
    -   Fix display behavior of select all button in Table header 
-   【Perf】
    -   Tree，TreeSelect
        -   Optimize performance issue of Tree and TreeSelect 
        -   Tree and Treeselect support data structures that do not transfer value. The data structures need to be consistent 
-   【Style】
    -   Optimize the spin style of Tree loading state
    -   Select
        -   Optimize the height of small size and large size in multi selection
    -   Tag
        -   Align the height of all color Tag, and align the height of Tag when it is closed or not

#### 🎉 1.6.0 (2020-09-18)

-   【Fix】
    -   Fix the problem that the input parameter type of Transfer d.ts onChange is not correct with the actual type 
    -   Fix Slider marks not including boundary value issue; Fix the height problem caused by Slider vertical-align baseline 
    -   Fix the height problem of the Table selection button. The vertical align of the button was changed from the default value to bottom 
-   【Docs】
    -   Increase the display of related materials to make it easier for users to find material resources related to components

#### 🎉 1.6.0-beta (2020-09-11)

-   【Feat】
    -   Select add innerTopSlot and outerTopSlot API (MR)
    -   Tag add avatar Tag, including avatarSc and avatarShape API 
    -   description data supports function type 
    -   Tree, tree Select supports renderLabel to customize label 
    -   Dropdown.Menu supports props passing down, Dropdown.Item supports onContextMenu event binding 
-   【Fix】
    -   Fixed error when InputGroup children have null nodes
    -   Fixed error when clearing Transfer entered filtered content
    -   Fixed Pagination's pageSize dynamic change when Select selected value does not follow change 
    -   Fixed Typography truncation without overflow still showing tooltip 
    -   Fixed the result of the intersection was incorrect during Table multi-column filtering 
    -   Fixed the error report caused by circular dependency in the production environment when the usage of RadioGroup and CheckboxGroup options are used with Form 
    -   Fixed the problem that disabled does not take effect when CheckboxGroup jsx declares children usage 
    -   Fixed DatePicker allow input date when needConfirm 
-   【Style】
    -   Modal title Icon aligned with text by center => flex-start 
    -   Fix List card-style empty state centered style
    -   Tree, Tree Select
        -   Default Label long text omitted after virtualize is turned on 
        -   Interactive update when clicking Action = "click" to click the leaf node can click ToHide
    -   Tableheader's sorter and filter icon, their margin left by 8px => 4px 

#### 🎉 1.5.0 (2020-09-04)

-   【Fix】
-   Fixed Form.Switch disabled property is not updated when the Form dynamically switches the disabled property 
-   Fixed stack overflow after infinite compression in response state of Typography ellipsis
-   Fix searching status in virtualize Tree causing selection not responde first time 
-   Fixed dts file loss problem of Modal, Notification and Toast
-   【Perf】
-   Removed full import of TimePicker, DatePicker and Table to optimize packing size
-   Removed the sourcemap of UMD package

#### 🎉 1.5.0-beta.0 (2020-08-31)

-   【Feat】
    -   Calendar day view supports displaying multiple days 
    -   Avatar
        -   Support `imgAttr` to pass through HTML attributes of img tag 
        -   Add the truncation function and overlapfrom, maxcount, rendermore API 
    -   Treeselect supports clickToHide, and radio mode is valid 
    -   Upload
        -   If limit is set to 1, after a file has been uploaded, the current file will be automatically replaced when the file is uploaded again 
        -   Support custom request method
    -   InputNumber supports hovering display buttons; press shift and click button to increase or decrease larger step size 
-   【Style】
    -   The default height of the external button of InputNumber is changed from 30px to 32px
-   【Fix】
-   Fixed missing second parameter for InputNumber onChange function
-   Fixed missing TextArea onResize .d.ts type definition
-   Fixed missing Table virtualized.onScroll .d.ts type definition
-   【Docs】
-   Updated formApi.validate() field validation doc

#### 🎉 1.4.0 (2020-08-21)

-   【Style】
-   Fix hover color in datePicker range mode: blue-0 => primary-light-default
-   【Fix】
    -   Fix missing key warning and animation when Tree label is ReactNode 
-   Fix autoComplete getPopupContainer props not working
-   Fix InputGroup onFocus, onBlur on child component overwritten problem 
-   Fix some dts props typo in Upload and Select；remove BreadcrumbItem from index.d.ts

#### 🎉 1.4.0-beta.0 (2020-08-14)

-   【Feat】
    -   DatePicker supports custom rendering of date content and date box 
    -   TreeSelect supports onVisibleChange API 
    -   Tree supports disableStrictly API 
    -   Collapse supports motion parameter
-   【Style】
    -   Change Table thead borderWidth from 1px to 2px
    -   DatePicker current date adds gray background to make it more prominent
-   【Fix】
    -   Fix click the clear button does not trigger the validator problem in Form.TimePicker 1.3 version
    -   Update DatePicker and TimePicker onBlur event trigger time from input blur to panel close 
    -   Fix the style problem of CSS selector with right margin added to all icons in Tree label
-   【Docs】
    -   Icon component adds stroked icon list
    -   Update the document of Table component and fix the problem of some props default value description error

#### 🎉 1.3.0 (2020-08-07)

-   【New Component】
-   Added `Anchor` 
-   【Feat】
    -   Added stroked icon to the Semi official icon library, which needs to be used as user-defined way
-   【Style】
-   Adjust Subtext alignment of dragable `Upload` component from left to center
-   Alignment of Sidesheet's close button and title from center to flex-start
-   【Fix】
-   Fix Input component size syntax prompts error
-   Fix the incorrect display of icon when upload failed/validate failed in Upload listType=picture
-   Fix TextArea autosize mode passing ref error #714
-   【Perf】
    -   Replace Table dependency from lodash to lodash-es, remove the full lodash imported by Avatar and optimize the packing volume
    -   Breadcrumb routes support passing custom key

#### 🎉 1.3.0-beta.0 (2020-07-31)

-   【Feat】
    -   Semi provides UMD version 
    -   `Input` provides password mode 
    -   `SideSheet` adds support to footer，**containing changes in padding, margin, etc** 
    -   `Upload` adds support to promt, promptPosition for listType=picture mode 
-   【Fix】
    -   Fix value always empty using `Tree` TriggerRender in multiple mode
-   【Perf】
    -   Fix unquoted variables warning for interpolation in sass-loader 9.x 

#### 🎉 1.2.2 (2020-07-26)

-   【Perf】
    -   Optimize the SVG animation in `Icon` to CSS animation, and fix the problem of page redrawing. If you need to use loading `Icon` alone, please add CSS animation
    -   `OverflowList` does not reset the state of the render function any more. If you need to reset, you can refresh the component by updating the `key`
    -   Optimize the status reset of text dynamic update in `Typography` `ellipsis` mode
-   【Fix】
    -   Fix `Button` height style bug
    -   Fix style loss in `Descriptions` `row` with different sizes

#### 🎉 1.2.0-beta.0 (2020-07-17)

-   【Feat】
    -   Imperative Modal component supports use with configProvider 
    -   Notification, Toast supports usage of useHooks
    -   Typography supports tertiary and quaternary types
-   【Style】
    -   Adjust the transparency of color-text-3 from 0.2 to 0.35
    -   Checkbox border transparency adjusted from 0.08 to 0.2
    -   Provide custom scroll-bar style class name, use through .semi-light-scrollbar
-   【Fix】
    -   Fix modal to cover the overflow style of body
    -   Fix the problem that the last column of the table with fixed head may not be aligned when the mouse is inserted
    -   Fix the problem that the filter is true in the case of multiple selections in Select, and an error is reported when the search has no data 

#### 🎉 1.1.0 (2020-07-14)

-   【Fix】
    -   Fix the problem that Form.TimePicker does not trigger validator judgment after clicking the clear button 

#### 🎉 1.1.0-beta.0 (2020-07-03)

-   【New Component】
    -   Added `OverflowList`
-   【Feat】
    -   `Tabs` component folding function support 
    -   `TreeSelect` component supports outerBottomSlot 
    -   `Modal` non-command call supports setting title icon 
    -   `DatePicker` supports transparent transmission of TimePickerOpts parameters to TimePicker 
    -   `Table` merge table header function support 
    -   `Table` supports custom rendering of each item of floating layer 
    -   `Table` supports incoming default page number 
    -   `Table` supports automatic scrolling to the first row when cutting pages 
    -   `Upload` adds onClear callback 
    -   `Form` `Field` supports pure switch to only take over the data stream without inserting Label, ErrorMessage and related DOM structures 
-   【Fix】
    -   Fixed tree flickering abnormality in the state-controlled state filter search value animation 
    -   Fix the problem that the copy with empty data cannot be displayed correctly in the middle when there are many `Table` headers 
    -   Fix the problem that the sorter configuration is incorrect when the `Table` is switching page 
    -   Fix the problem that `Table` still displays selected columns when rowSelection is false 
    -   Fix `Tooltip`'s getPopupContainer using configProvider is invalid 
-   【Performance】
    -   Optimized displayName of withField HOC to facilitate positioning related elements in react devtool 
-   【Style】
    -   `Modal` imperative content and header add 8px spacing
    -   Fix the center alignment problem of `Banner` close button

#### 🎉 1.0.0 (2020-06-24)

-   【Fix】
    -   Fix `Tree` animation flashes etc. when in controlled expandedKeys mode and using with showFiltereOnly 
    -   `Icon` loading on demand path changed
-   【Feat】
    -   `List` renderItem method supports custom key 
-   【Style】
    -   Tertiary `Button` light and borderless mode change text color from `color-tertiary` to `color-text-2`

#### 🎉 1.0.0 - beta.0 (2020-06-12)

-   【Fix】
    -   Fix the problem that the empty value in `Cascader` is not returned to placeholder under the controlled state
    -   Fixed an issue where `Tree`'s expandedKeys disappeared after manually emptying 
    -   Fix the problem that `Table` cannot display empty status when virtualization is enabled
    -   Fix `Form.Upload` when uploadTrigger is custom, onChange will not be triggered after the file is selected, and the corresponding file list is not synchronized to formState 
-   【Performance】
    -   Optimized `Form.Select` to enable onChangeWithObject, external calls to formApi.getValues and setValues are likely to cause stuck problems
    -   Optimize `Spin` svg animation stuck issue when rendering with large amount of data 
-   【Feat】
    -   `Icon` supports loading on demand
    -   `Modal` supports keepDOM, the default behavior of lazyRender remains to be destroyed 
    -   `Paragraph` component supports less than n lines of text, does not display expanded and collapsed text 
    -   `ConfigProvider` supports getPopupContainer
    -   `Table` emptySlot outer layer changed from p to div component
-   【Style】
    -   `Typography` link is changed to no underline style by default, and underline can display underline in hover/active state
    -   In `Tab` card mode, the extra content is centered to support the card, which involves DOM structure adjustment
    -   Fix styling issue when using `Radio` as dot in Timeline

#### 🎉 1.0.0 - alpha.0 (2020-05-29)

-   【API Adjustment】

    -   Banner removed the `target` attribute, please directly use the JSX wording
    -   Breadcrumb removed the usage of`BreadcrumbItem`, please use `Breadcrumb.Item` instead
    -   The order of the two parameters of the DatePicker `onChange` callback is reversed, changed from `string` and `Date` to `Date` and `string`, if you need to restore, please use `onChangeWithDateFirst={false}`
    -   Input, InputNumber removed the`clearable` attribute, DatePicker, TimePicker removed the `allowClear` attribute, please use`showClear` instead
    -   Select officially deprecated `labelInValue`, please use`onChangeWithObject` (available since 0.23.0) instead
    -   Select officially deprecated `optionLabelProp`, please use`renderSelectedItem` ( Available since 0.23.0) Custom function replacement
    -   TextArea removed `onPressEnter` property, please use`onEnterPress` instead
    -   Tree removed `labelInValue` property, please use`onChangeWithObject` instead
    -   TreeSelect removed `valueInArray` Properties, please get related node properties through `onChange` or`onChangeWithObject`
    -   TreeSelect removes the `allowSearchClear` attribute, please use`showSearchClear` instead
    -   Upload abolished `onXhrFinish` and added a more customized`afterUpload` instead The functions of the two are similar, but the value structure that needs to be returned is not equal. For breaking change
    -   Upload, the use method of `beforeUpload` is modified and aligned with`afterUpload`. The value structure of the return is not equivalent to the 0.x version. It is a breaking change. Note that compared with the 0.x version, the file that failed verification will still exist in the fileList and will not be automatically deleted.
    -   Component input parameters with `onBlur`,`onFocus` methods are unified as Function (e: Event) 

-   【Refactor】
    -   Banner: DOM structure / class name / api adjustment, style update
        -   remove `target` attribute
        -   default of`type` attribute changed to info, default value is info
        -   new api: `fullMode`,`title`, `description` , `icon`,`closeIcon`, `bordered`
-   【Feat】
    -   Avatar
        -   New size of `size`: extra-extra-small 20px, the original small size is adjusted to 24px
    -   Calendar
        -   Event Object It is required to pass`key` to control the update and redraw of events 
        -   Added: `dateGridRender` allows custom cell / column content and style 
    -   Collapsible
        -   Added: `collapseHeight` to support custom folded height
    -   Empty
        -   Added:`title`
        -   Original `description` style adjusted to 14px font, secondary font Color
    -   Form
        -   Form Props add `showValidateIcon`, automatically display red X icon before error message, the default is true
        -   Form adds Form.Upload module
        -   Form adds Form.Section module, used to quickly group Fields on the layout
        -   Field Props add
            -   `helpText` placement prompt information (share the same block display with the verification result, when both have values, the verification result is displayed first)
            -   `extraText` is used to place additional prompt information, often displayed and will not Overwritten by verification result
        -   error message supports reactNode (return reactNode in validate or rules in version 0.x will be considered to pass verification, and return to reactNode after version 1.0 will be the same as the return of string, which is regarded as verification failure)
    -   InputNumber
        -   New: `hideButtons` is used to control the hiding of the" increase / decrease "buttons, ** discard the original suffix = {null} method **.
    -   List
        -   Added: `onRightClick`,`onClick` responds to corresponding mouse events 
    -   Modal
        -   Added `closeOnEsc`Support to close the popup window by keyboard Esc, add `closeIcon` to support custom close button
        -   add `size` support small, medium, large and full-width
    -   SideSheet
        -   add:`headerStyle`, `afterVisibleChange`, `closeOnEsc`
    -   Spin
        -   Added:`childStyle`
    -   Table
        -   Two types of information density `"middle"` and `"small"` have been added.
    -   Tabs
        -   Added `keepDOM`, which supports the destruction of non-active panels in jsx writing 
        -   Added `tabPosition` to support tab at the top or left ('left', 'top'),
        -   Added`lazyRender` to support lazy loading of tabPane 
    -   Toast / Notification
        -   Added: `theme`('light', 'normal') Support notification message with background color
    -   Tree
        -   Added `loadData`, `loadedKeys`,`isLeaf` Support dynamic loading of data
        -   New: `onChangeWithObject` Support to return with node information The object is the input parameter of onChange
        -   `searchRender` supports false to hide the search box
    -   TreeSelect
        -   New:`onChangeWithObject` supports returning the object with node information is the input parameter of onChange
        -   New: `showClear` supports clearing Options
    -   Typography
        -   copyable Supports `copyTip`，to customize copy tooltip text
    -   Progress
        -   Added: `orbitStroke` allows custom track colors
    -   Skeleton
        -   Skeleton.Avatar Added:`size`, supports the corresponding size of Avatar components 
    -   Upload
        -   add `renderFileItem` custom file card rendering structure, add`itemStyle` to quickly change the inline style of fileItem
        -   add `showClear`,`ShowRetry`, add manual retry mechanism, add file list to quickly clear
        -   add `transformFile`, support to convert files after file selection, before file upload
        -   add`onChange` callback, callback for file upload status change, uploading , If it fails, the callback will be called after completion
        -   add `validateMessage`,`validateStatus` to customize the overall verification status of Upload and display the verification information
        -   after selecting the file, the file with illegal file size will also be displayed in fileList ( It is shown in red but uploading will not be activated), and it is clearer which specific files are illegal. Similarly, files that are not uploaded in `beforeUpload` will also be displayed in the fileList
        -   add`afterUpload`, support After the upload is complete, update the status of the corresponding file in the fileList and support automatic file removal
        -   Fix the problem of the wrong second parameter of `onExceed`
        -   Support the controlled`fileList`
        -   Drag-and-drop Upload supports incoming `children` More freedom Customize the content of the drag zone in degrees
        -   in the photo wall mode, when the number of uploaded files reaches the limit, it will be automatically hidden + Trigger
-   【Performance】
    -   TextArea removes life-cycle method of componentWillReceiveProps 
    -   Modal removes life-cycle method of componentWillMount 
-   【Style】
    -   Breadcrumb
        -   Text color adjustment
        -   The default position of the tooltip is changed to top
        -   Adjust the class name structure, icon text alignment
    -   Button
        -   Remove the default margin-right
        -   Remove the fixed height of buttons of different sizes, add padding corresponding to different sizes
        -   Iconbutton The default theme is the same as the button theme (theme = "light")
        -   IconButton is no longer recommended but still exported
    -   Checkbox
        -   Adjust the margin-bottom of Checkbox in CheckboxGroup: 16px => 12px, remove the margin of last-of-type -bottom
    -   Collapse
        -   Added hover, active effect in header area
    -   Empty
        -   Illustrations update
    -   Form
        -   Automatically added when error message is displayed ❌ icon (if not required, you can close it with showValidateIcon)
    -   Input prefix / suffix / addonBefore / addonAfter style adjustment 
        -   prefix / suffix is no longer processed as Icon when passing in a string, and is directly mapped into a string; Icon needs to be passed in the form of React.Node
        -   there will be no padding when passing in a custom reactNode, only the String and Icon have their own padding
    -   InputNumber
        -"Up / Down" button is adjusted to the right of Input
    -   Modal
        -   Adjust the head and title style, unified declarative and imperative styles
    -   Popover / Tooltip
        -   Change default value of arrowPointAtCenter from false to true
    -   Progress
        -   LineProgress bar progress bar percentage text color is fixed to color-text-0 black , No longer consistent with the fill color of the progress bar
    -   Pagination
        -   increase the style declaration of margin-block-start: 0, margin-block-end: 0
    -   Radio
        -   adjust the margin-right / margin of Radio in RadioGroup (horizontal / vertical) -bottom: 16px => 12px, remove margin-right / margin-bottom of last-of-type-horizontal RadioGroup display is adjusted to inline-block
    -   Select
        -   adjust display logic of clear icon, only display when expanded or hover , And share the same display area with the arrow icon
    -   SideSheet
        -   Support width and height settings for percentage (involving DOM structure adjustment) 
    -   Steps
        -   adjusted the size of the status icon, 32px => 24px, fine-tuned other styles, increased the waring status
    -   Spin
        -   the original DOM size when used normally 0 x 0 => corresponding width, height
    -   Tree
        -   remove the minWidth restriction
    -   TreeSelect
        -   remove the default maxHeight restriction
    -   Table
        -   change table header background color to white
    -   Tag
        -   light type text color darkens, changed to Color No.8
        -   remove the margin-bottom and margin-right that comes with 8px by default
    -   Typography
        -   Typography.Title default font-weight to 700
        -   strong props change font-weight 600 => 700

#### 0.37.0 (2020-05-22)

-   【Fix】
    -   Fixed the issue that only allowEmpty was not consumed when `Form` register / remounted and allowEmptyString was not consumed
    -   Fix `Casacader` error when using triggerRender 
    -   Fix the problem that `TextArea` cannot input Chinese in controlled state 
    -   Fix the stuck issue when the `Nav.Item` is clicked 
    -   Fix the problem that the fixed `Column.width` is a percentage failure 
    -   Fix the problem that the `itemSize` value of the virtualized `Table` is too small when the row is displayed 
-   【Perf】
    -   `Select` supports virtualize and optimizes performance in large data scenarios 
    -   Optimize the virtual table rendering mechanism to improve the experience when the data changes frequently 

#### 0.37.0-beta.0 (2020-05-15)

-   【Feat】
    -   `TextArea` supports onResize callback 
    -   `Modal` supports destroyAll 
    -   `Table` virtualization supports data grouping 
    -   `Table` supports getting current page data
-   【Fix】
    -   Fixed the problem that `Textarea` does not have autosize in the second tabPane of tabs 
    -   Fixed `Cascader` crashing when opening Google Translate for selection 
    -   Fixed the problem that the `Table` virtualization itemSize is too small and the rows cannot be displayed normally 
    -   Fixed the problem that the incoming percentage of `Table` virtualization Column.width cannot be normal and realistic 
    -   Fixed the problem that the file is still displayed after onError is triggered when `Upload` action 4xx / 5xx 
-   【Perf】
    -   Optimized the performance of `Table`virtualization when rendering when the frequency of data changes is high 

#### 0.36.0 (2020-05-08)

-   【Feat】
    -   Form.Slot supports individual customized abelPosition
    -   Select defaultActiveFirstOption supports to be consumed again after updating optionList in remote search 
-   【Fix】
    -   Form ArrayField
        -   Inner ArrayField not updated after setValues in nested usage
        -   A value under ArrayFields is set with initValue. If setValues + isOverride at this time, the value will not be set successfully 
        -   After removing a row, leaving a null 
    -   Fix Table fixed column + virtualized horizontal scrollbar positioning issue 
-   【Style】

    -   Fix alignment issue of switch and rating in Form when labelPosition=left 

#### 0.36.0-beta.0 (2020-04-24)

-   【Feat】
    -   Add a unified prefix for the built-in icon of semi to prevent conflicts with variables of the same name in window 
    -   `Form` add stopValidateWithError switch at the `Field` level, short-circuit subsequent verification after error 
-   【Fix】
    -   Fix the issue that when `Progress` percent is dynamically changed from N-> 99.98, the animation number will be rendered as 100 
    -   Fix the problem that setting the value to null in the `Cascader` controlled mode is invalid and cannot be cleared
    -   Fixed an error when `Cascader`'s children's layer is an empty array
    -   Fix the problem that the update of `DatePicker` will slow down one step when the time is selected 
-   【Perf】
    -   `Form` `ArrayField` aligns the field about the initial value behavior, which can be set either through initValue or initValues in Form props (newly added this time)
-   【Style】
    -   `Form`, adjust the upper and lower spacing of `Form.InputGroup` margin 16 => marign 0 && padding 12, align with `Field` 

#### 0.35.0 (2020-04-17)

-   【New Component】
    -   Add new component `Transfer`
-   【Feat】
    -   `Tree` adds support to following apis:
        -   expandAction supports expand logic including false, click, doubleClick 
        -   onRightClick 
        -   searchRender to render custom search box 
    -   `Cascader` add support to following apis:
        -   onDropDownVisibleChange
        -   showClear to clear value with clear button
        -   support disabled status for options 
        -   onBlur, onFocus
    -   `Rating` adds support to customize character size
    -   `Table` supports the custom display of the expand button 
    -   `Table` supports the usage of fixed columns and grouping data 
    -   `Navigation` supports the param "collapseText" to modify the title of the collapse button 
    -   `Form` formApi supported getValues() 
    -   `Form.Slot` supported noLabel 
    -   `Form` supports the configuration of disabled. When it is true, the internal fields automatically inherit the disabled attribute 
    -   `AutoComplete` supports onFocus, onBlur 
    -   `Form` field props support stopValidateWithError, after a certain rule test fails, it will not trigger subsequent rule verification 
-   【Fix】
    -   Fix `Cascader` flashing problem when dropdown close 
    -   Fix the problem that when `Form` uses array fieldPath (eg: panels [11]]. Start), the value is modified after verification, and the error information does not match 
    -   Fix `Form` calls formApi.validate (), lack of required information triggers verification, after rejecting, add information and then validate, may still be rejected 
    -   Fix `DatePicker` will jump to the month of the first selected date when selecting different month dates in multi-selection state 
    -   When `Form` ArrayField asynchronous setValues update, the value has changed, but the rendering has not been updated 
    -   Fixed the problem that the file list arrangement style is incorrect and the + sign is wrapped when `Upload` type = picture 
    -   Fixed `Form.Switch` error when using Safari browser 
    -   Fixed the issue that target in `BackTop` might have been removed when unmounting
-   【Style】
    -   Adjust styles for empty content for `Tree`、 `TreeSelect`、 `Cascader` 、`Select`
    -   Add animation to `Rating` 
    -   Fix `Input` styles for:
        -   ValidateStatus with append / preprend
        -   Border-radius with only append or preprend
        -   Suffix overflow
-   【Perf】
    -   API adjustment and console warning: The original API will still be supported until 1.0, but it is no longer recommended
        -   `Tree` adds onChangeWithObject to replace labelInValue
        -   `Tree` adds showClear to replace clearable
        -   `TreeSelect` will remove valueInArray in v1.0.0-rc, it is recommended to get related node properties through onChange
        -   `TreeSelect` adds showSearchClear to replace allowSearchClear
        -   `Input`, InputNumber add showClear, replace clearable
        -   `DatePicker`, `TimePicker` add showClear, replace allowClear

#### 0.34.0 (2020-04-03)

-   【New Component】
    -   `Empty` component
-   【Feat】
    -   `Typography` ellipsis feature extension 
        -   Supports truncation of Text, Title and Paragraph
        -   Supports single-line, multi-line truncation; supports fixed suffix; supports truncated position from end or middle
        -   Supports for expandable, collapsible and custom text tip
        -   Supports properties to configure tooltip
    -   `Breadcrumb` truncation logic optimization 
        -   Changed from truncation at certain text length to width truncation.
        -   Supports showTooltip prop to configure truncation width, position, etc.
    -   `Modal` supports maskFixed
    -   `Toast`、`Notification` supports getPopupContainer 
    -   destroyAll method for `Toast`, `Notification` changed to destroy wrapper as well 
    -   `Tree` 、`TreeSelect` supports autoExpandParent 
    -   `TreeSelect` supports autoAdjustOverflow
    -   `Select` adds close () and open () methods, which can be used to manually control popup expansion / closing 
    -   `Select` to prevent a selected item from being deleted in the multiple selection mode; add onClear callback 
    -   `Form` onValueChange adds second parameter: changedValues, which specifically reflects the currently changed field 
    -   `TextArea` supports validateStatus
    -   `Table` supports setting scroll width without setting scroll.x and Column.width to set width automatically 
    -   `Table` supports rendering multiple contents into the same cell 
    -   Floating layer component supports custom Trigger 
    -   Floating layer components uniformly support the parameter stopPropagation to prevent element click events on the floating layer from bubbling
    -   `Tooltip`/`Popover`/`Popconfirm` supports small triangle pointing to the center of the element 
-   【Style】
    -   `DatePicker` date selection panel style update 
-   【Fix】
    -   Fix `Tree` `TreeSelect` not recollecting value in single controlled mode when treeData changed
    -   Fixed conflict between expandedKeys in `Tree` controlled mode and automatic expansion in search status 
    -   Fix searching results not updated when search input has a value and treeData is dynamically updated in `Tree` 
    -   Fix clearing search value not triggering onSearch in `Tree` and `TreeSelect`
    -   Fix the problem that the `Upload` progress bar is not displayed during the Upload process and the status bar in the defaultFileList is successful.
    -   Fix the problem that `Col` with `Grid` span 0 does not reflect the display: none feature 
    -   Fix the problem that `AutoComplete` is disabled when data is not empty; fix the problem that `Option` hover style only responds to keyboard events but not mouse events;
    -   Fix `Select` still react enter keyboard events while loading
    -   Fixed a performance issue when the `Column.title` passed to multiple Tables was ReactNode 

#### 0.33.0 (2020-03-20)

-   【Fix】
    -   Fix the situation where the component internal state is not updated under the `Navigation` selectedKeys controlled condition 
    -   Fixed the problem that dataSource cannot be displayed asynchronously in the `Table` component group rendering mode 
    -   Fixed an issue where `DatePicker` would skip the confirmation replacement when clicking the preset when confirmation is needed in the future
    -   Fixed the issue that when `Select` is used in `Popover` with trigger as click, and click on the clear button when showClear is true
-   【Feat】
    -   Support some features and optimization for `Table`
        -   Fixed column optimization, using "position: sticky;" positioning instead of rendering multiple tables in the old version
        -   Supports virtualization, covering large-scale data rendering scenarios 
        -   Supports infinite scrolling after enabling virtualization 
        -   Prohibit text selection in header 
        -   Optimized the problem that the hover state does not follow in the fixed column scenario 
        -   Supports custom elements such as div instead of elements such as table/tbody/tr 
        -   Expanded row adds extra className: semi-table-row-expanded
    -   `DatePicker` supports specifying default time selection 
    -   Support some features for `Form`
        -   Support autoScrollToError, which is used to automatically scroll to the first error field after validation finish， 
        -   formApi.validate / reset supports validation / reset of specific fields 
        -   Added formApi.scrollToField (field), which is used to manually trigger scroll to the specified field
        -   `Form.Label` adds extra attribute to add content after required identifier 
    -   `Typography` copyable supports successTip to customize tip when copied successfully 
    -   `Cascader` supports defaultValue directly rendered as string when not available in data list 
    -   `Modal` supports getPopupContainer 
-   【Style】
    -   Style changed for `Checkbox` & `Radio` : Secondary color related variables changed to Primary 
    -   Disabled style updated for all Input type components 

#### 0.32.0 (2020-03-06)

-   【Refactor】
    -   `Tree`, focus on optimizing the rendering performance of large amount of nodes 
        -   New api: disabled, emptyContent, showFilteredOnly 
    -   `TreeSelect`
        -   New api: allowSearchClear, defaultExpandAll, defaultExpandedKeys, defaultOpen 
        -   Support onFocus/onBlur method 
        -   Fixed issue that uncheck checkbox will lead to unexpected closing dropdown menu
-   【Feat】
    -   `DatePicker` supports disabling time selection 
    -   Add propTypes to some functional components 
    -   `Modal` function call supports destroy( ), and update( ) 
    -   `Upload` supports passing in data/headers in the manner of (file) => object 
    -   `Table` adds the disable effect of Checkbox, and cancels the logic that the checkbox of the table header is selected when the valid data item key array is empty. 
-   【Fix】
    -   Fixed the issue where onChange could not be triggered when a custom preset was clicked in the date picker 
    -   Fixed `Slider` position problems in range mode with min value set 
    -   Fixed `List.Item` used in jsx not supporting grid and layout 
    -   Fixed `Form.Select` throws error using group 
    -   Fix the problem that when the checked `Checkbox` exists in Select outerBottomSlot, clicking causes the `Select` to collapse 
    -   Fix the problem that UI rendering is not updated when `Form.CheckboxGroup` does not carry initValue 
-   【Style】
    -   `Navigation` text color changed to "--color-text-1" 
    -   `Form.Label`, when labelPosition is top, add explicit `display: block` declaration of label element to make sure the height of label is correct when using in systems without reset / normalize
    -   When `Form` layout = 'vertical', adjust the vertical spacing of the field. Forms arranged vertically will be more loose (marginTop / Bottom folded 16px => paddingTop / Bottom superimposed 24px). The height of Form will change. 

#### 0.31.0 (2020-02-21)

-   【feat】

    -   `Select` support grouping option via `OptGroup` 
    -   `Select` add `onFocus`/`onBlur` callback 
    -   Provide `ConfigProvider` component to support time zone configuration 
    -   `Form.Slot` supports use without`Form` 
    -   `Slider` supports`railStyle`, which can be used to implement segmented track colors 
    -   `RadioGroup` supports`direction` 
    -   `Step` Add `onClick` support and automatically add `cursor: pointer` 
    -   `TagGroup` supports`showPopover`, displaying the remaining `+ N` content through a floating layer 

-   【fix】

    -   Fix `Select` allowCreate input non-existent label, click outSide without selecting any item, then click Select to expand, 'create xxx' candidate still exists 
    -   Fix `Form` labelWidth not working for `Form.InpurGroup` 
    -   Fix the problem that the date list may cause the year list to be misplaced when the month is selected by the `DatePicker` component 
    -   Fix `DatePicker` crash when `format` and `type` conflict 
    -   Fixed the problem of incorrect padding of the first button when using multiple icon buttons in `ButtonGroup` 
    -   Fixed the issue that `import * as React` was not used in`.d.ts` 
    -   Fix warning when `TagGroup` doesn't pass key
    -   Fix `Slider` hint text is not centered and disable style 
    -   Fix style of `InputGroup` parent pass through and override children's `style`
    -   Fix the `Step` component's `className` not taking effect
    -   Fix the problem of the `Upload` component `withCredentials`

-   【style】

    -   Update the size of `Select` Option Icon tick
    -   Update the interval of `Pagination` showTotal content, add a space around the number
    -   Fixed the left side of the input box when passes `multiple` and `filter` to `Select` 

-   【docs】
    -   emoved wrong visible in Modal imperative calls
    -   Added examples of Tooltip and Popconfirm / Popover nesting directly

#### 0.30.0 (2020-02-07)

-   【feat】

    -   `InputNumber` is also performed once if the content changes when losing focus. 
    -   `Dropdown` adds style name to trigger element. 
    -   `Table` When the row selection or expansion function is enabled, if there is no key attribute for each data item in the dataSource or the attribute name specified as the primary key with rowKey is not used, the console will report an error. 

-   【Fix】

    -   Fix missing `Form` .d.ts onChange declaration.
    -   Fixed the issue that the `Table` dataless copy would be below the horizontal scroll axis of the table. 
    -   Fix table header misalignment after fixed table. 
    -   Fix using JSX column in `Table` leading to misalignment of fixed column with wrapping content 

*   【Perf】

    -   `Collapsible` optimization refactoring.
        -   Fix warning issue when using keepDOM console. 
        -   Optimize the logic for nesting, no need to manually pass in animation nodes. 

*   【Style】

    -   `Table` component selection box resizing. 

#### 0.29.0 (2020-01-10)

-   【feat】

    -   `SideSheet`

        -   Added `size`,`disableScroll`, `getPopupContainer` 
        -   Allow external operations when setting `mask = {false}` 
        -   The class name of `SideSheet` has changed as follows:`semi-modal-wrap` => `semi-sidesheet-inner-wrap`,`semi-modal` => `semi-sidesheet-inner`, the rest `semi-modal-x` =>`semi-sidesheet-x`

    -   `Table`

        -   Support group display data 
        -   Support transparent pass parameter to filter floating layer 
        -   Pagination copy is not displayed when the number of data is 0 
        -   Support local filtering or sorting of child data 

    -   `Calendar`,`Typography` supports i18n
    -   `PopConfirm` added `okButtonProps`, `cancelButtonProps`

-   【Fix】
    -   `Modal`
        -   Fix omission of d.ts declaration for properties such as content 
        -   Fixed the issue of default visible is true and scroll penetration when imperative call 
    -   Fixed `SideSheet` popping up when setting motion = {false} 
    -   Fixed the issue that DatePicker will change the date in "dateTimeRange" mode 
    -   Fix missing className and style in `DatePicker` dts declaration 
    -   Fix the issue that the expand button in Table is not centered vertically 
    -   Fixed `InputNumber` being unable to input after setting" max "parameter 
-   【Style】
    -   `Modal` keep footer bottom when changing height
    -   `Notification` content is the same width as the title
    -   When the `Select` component is multi-selectable and searchable, the input is automatically cleared after losing focus

#### 0.28.0 (2019-12-27)

-   【feat】

    -   Add `.d.ts` to provide more friendly syntax tips in IDEs such as vscode 
    -   `Form` New Form. AutoComplete 
    -   `Form.Slot` supports incoming error 
    -   The `Modal` component imperative calls onOk support Promise and then close the dialog box 
    -   `Cascader`, `TreeSelect` support insetLabel, prefix, collectix 
    -   `Cascader`, `TreeSelect` support validateStatus 
    -   The `Rating` component allowhalf attribute supports the display of decimals other than 0.5 
    -   `Upload` type detection and corresponding styles when removing the drag-and-drop upload component onDropEnter (file details are not available when dragging is not loose due to browser policy constraints) are detailed in 

-   【fix】

    -   Fix the problem that `Select` multi-selection + maxTag Count + width width is insufficient and option content is too long, and the selected item location offset may not be displayed 
    -   Fixed an issue where the number of newly added Item entries may change when Field on Change in ArrayField is not set 
    -   Repair of abnormalities in the use of `ArrayField` in conjunction with `Collapse` 
    -   Fixed the issue of warning when the `Select` custom renderCreate Item, missing key 
    -   Fix `DatePicker` After clicking the Clear button, then clicking the Date button will not be able to select the date 
    -   Fix `DatePicker` Click on the Clear button and cannot trigger onChange 
    -   Fix the `DatePicker` disable state `Popover` will give the DateInput package a layer of span that causes a change in display 
    -   Fix the timestamp of the introduction of `Date Picker` before 1970 could not pass verification 
    -   Fix the problem that the `DatePicker` floating layer selection bar is not centered and the bottom rounded corners are blurred 
    -   Fix an issue where the calendar icon is not displayed in the focus state after `DatePicker` passes in allowClear = {false} 
    -   Fix errors caused by null in `Input Group` 
    -   Fix the `InputNumber` setting max min valid only for click changes, with no limit for input 
    -   Fix the problem that `InputNumber` was not emptied at formreset 
    -   Fixed an issue where the `Checkbox` component outer div would have been triggered before the onChange in the inner layer if the onClick event had been defined 
    -   Fix the entry of the `Collapse` component on Change callback. Should correspond to activeKey, not the itemKey for a single panel 
    -   Fix `Collapsible 'cannot be expanded by default in Tablewalks Row Render 
    -   Fixed an issue where `Table` empties the selected row key array after a dataSource change 
    -   Fix the problem of no vertical centering on the `Table` expansion button 
    -   Fixed an issue where the `Table` select expand button did not prevent bubbles when clicked 
    -   Fix `TreeSelect` Controlled Value Full Selective Child Node No Automatically Selected Parent Node 
    -   Fix the problem that some checkboxes need to be clicked twice to take effect after resetting values using formApi.setValues 
    -   Fixed an issue where the size style of `Spin` was overwritten in nested use 
    -   Fixed a `Upload`onError callback entry error; 
    -   Fixed the issue of `Form.Select` allow Create by pressing return, event bubbling triggering formsubmit 

-   【Performance】

    -   Resolves the Cotton problem that occurs when `Form.Select` customizes OptionNode rendering and opens onChangeWithObject 
    -   `InputNumber` component interaction optimization 
    -   After solving the column fixation of `Table`, the rolling Cotton is more serious 

-   【Style】
    -   In `Pagination`, the built-in Select default setting clickToHide, click to put it away. The user-select is changed to none 
    -   Popover position in `Breadcrumb` changed from bottom to bottom Left
    -   `TreeSelect`, `Cascader` hover when no data, active no style 
    -   Copable text of `Typorgraphy` with copy icons spacing changed to 4px

#### 0.27.0 (2019-12-13)

-   【New component】
    -   New `Typography` component 
-   【feat】

    -   `Nav` supports all parent SubNav (if the selected item is a subitem of SubNav) when the default OpenKeys openKeys is not passed in 
    -   The `Nav`Nav.Sub component supports incoming dropdown Style, controlling properties such as maxHeight and overflow 
    -   `Table` supports the internationalization of paging regional texts and the introduction of format PageText custom paging regional texts 
    -   `Table` supports tree data presentation 
    -   `Form` adds Form.ErrorMessage, Form.Slot export 
    -   `Form`Field supports incoming labelPosition, labelAlign, labelWidth properties to override Form settings 
    -   `Form` adds wrapper Col, label Col fast layout configuration
    -   `Form` with Field adds the should Memo configuration to support stateful component 
    -   The `Form` Fieldlabel attribute is compatible and supports incoming object 
    -   `Form` Field adds convert to allow for secondary modification of component values before UI updates 
    -   `Form` Fieldtrigger attribute, which supports simultaneous configuration of multiple trigger times 
    -   `Select`, `AutoComplete` Add AutoAdJust Overflow Floating Layer Adaptive Switch 
    -   The `Cascader` unfolds again and returns to the last unfolding state 
    -   `Notification`supports onClick notifications 
    -   `Breadcrumb` component style and code optimization 
        -   Truncated level to level two to bottom three.
        -   Add the renderItem attribute, which can be used in conjunction with the
        -   The onClick callback parameter is changed to function (item: route, e: Event)
        -   Routeobject supports href properties as link destinations

-   【fix】

    -   Fix a possible memory leak in `DatePicker` 
    -   Fixed an issue where `DatePicker` could crash under the Safari browser 
    -   Fixed an issue where `DropdownItem` did not block a DOM event in a limited state 
    -   Fixed an issue where the incoming key console would alarm when `Table` defined Column using JSX syntax sugar 
    -   Fix the problem that `Table` may have two rows in hover state at the same time 
    -   Fixed an issue where `Table` may not be able to expand additional lines
    -   Fix the ineffectiveness of certain cases of `AutoComplete` default value 
    -   Fix the `Banner` on Close callback parameter 
    -   Fixed the `Avatar` extra-small font size problem
    -   Fix the `Breadcrumb` a tag nesting problem, rendering as a tag when passing href, otherwise as span tag 
    -   Repair of placeholder swaps for `Cascader` and `Tree Select` 
    -   Fix `Cascader` component rendering data not in incoming order 
    -   Fix `Icon` component custom icon hump naming is changed to lowercase and cannot be displayed 
    -   Fixed an issue where the corresponding check information on Field was not removed after the `Form`form level custom check validateFields returned the update (i.e. when some Field checks were illegal = > legal) 
    -   Fix `FormField.rules required configuration update, actual not effective issue 
    -   Fixed the problem of `Pagination`popover Position not controlling all subordinate pop-up layers
    -   `Pagination` Clicking on the current page should not trigger onPageChange 
    -   When `Pagination`updates total asynchronously and is not used in controlled mode, it automatically sets the current page to 1 for compatibility
    -   The clearicon should not be displayed when `Select` is displayed; the clearicon should not be displayed when the input class component such as Input is displayed
    -   The `Input` component clearable button needs to prevent bubbling when clicked 

-   【Style】

    -   `DatePicker` type = dateTime, the bottom switch part active item removes the hover effect, removes the cursor: pointer effect

-   【Docs】
    -   Update `Form`, `AutoComplete` use documents
    -   Update the `Quick Start 'document

#### 0.26.0 (2019-11-29)

-   【refactor】

    -   Refactoring `AutoComplete`, no longer encapsulating based on Select, correcting the interaction details 

-   【feat】

    -   `Select`, `AutoComplete` position supports incoming configurations other than 'top' / 'bottom' (aligned with Popover, Tooltip)
    -   `Select` Add on Select, on Deselect callback 
    -   `Dropdown` adds Dropdown.Title, adds showTick; Dropdown.Item adds active, type 
    -   `Pagination 'adds hideOnSingle Page and automatically hides the page divider when the total number of pages is less than 2 

-   【fix】

    -   Fix `AutoComplete` showClear not effective, document sample error problem 
    -   Fix disbaled problem on the right when `Pagination`total is 0
    -   Fixed an issue with the `Popconfirm` component titled space occupancy 
    -   Fixed an issue where row selection could not be made when updating state within the `Table` component `onChange` callback 
    -   `Slider` component code optimization to fix an issue where onChange is called twice and can be dragged in a controlled state 
    -   Fixed an issue where the node state was not retained before switching value values in the controlled state of the `Tree` component 
    -   Fixed an unexported problem with `BreadcrumbItter`
    -   Fix the problem that onChange was not triggered when `Select` clicked the clear button 
    -   Fix the error problem thrown by `Select` direct offspring if null exists 
    -   Fix the problem that the first Tab is not automatically activated after the Tab Pane is empty when the Tab Pane is installed and updated asynchronously 
    -   Fix the problem that the value set by the `InputNumber` click on the stepper can be less than the min value 
    -   Fix the Table` paging component pageSize change problem that did not trigger Table on Change 
    -   Fix the problem that the table row cannot expand automatically when the `Table` component defaultExpandAllRows is true 
    -   Fixed an issue where `DatePicker` would report an error using format in controlled mode 
    -   Fix the problem that Chinese copywriting will change lines when the `Popconfirm` component position is left 
    -   Fixed an issue where the `Popconfirm` component is not aligned with content when the title is empty 

-   【Style】

    -   Adjustments to the design of `Tree` and `TreeSelect` 
        -   The node style opens blockNode by default;
        -   Spread the arrow to increase the effect of hover and active;
        -   Spacing adjustment, first line left distance to 8px, indent to 20px, text and icon spacing to 8px
    -   Modify the border radius of `Tooltip` to 6px

-   【Docs】
    -   Supplementary AutoComplete documentation

#### 0.25.5 (2019-11-21)

-   【fix】
    -   Fix the problem of `Slider` slow sliding in cladding 
    -   Fixed an issue where the Item component onClick of `Breadcrumb` did not work 
    -   Fix a memory leak in the `BackTop` component 

#### 0.25.2 (2019-11-19)

-   【fix】
    -   Fixed an issue where the `Input` component disappeared by pressing the cleanup button 
    -   Fix the problem that the `Input` component placeholder is not centered 
    -   Fixed an issue where the `Spin` component wrapper ClassName was not updated with the status

#### 0.25.0 (2019-11-15)

-   【feat】

    -   The `Table` component paging function supports the passing of custom `total` 
    -   `Collapse`, `Collapsible`supports keepDOM and does not destroy DOM nodes when hidden 
    -   `Toast`, `Notification`supports global configuration with location (top, bottom, left, right), duration 
    -   `Toast`, `Notification`support destroy All 
    -   `Toast`, `Notification`new showClose support does not display the Close button 
    -   `Toast` new icon, text Max Width
    -   `Radio`, `Checkbox` support extra incoming subtext 
    -   `Switch` supports checked Text unchecked Text on off status text incoming 

-   【fix】

    -   Fixed an issue where `Dropdown` passed clickToHide = true selection option floating layer cannot automatically close when trigger is hover 
    -   Fixed the issue that the `Tabs` component Tab Pane`props.tabs` was updated and the rendering of the tabs did not follow the update 
    -   Fixed the error reporting problem caused by the path of the non-true value of the `Breadcrumb` component
    -   Fix an issue where the `Collapse` component `defaultActive Key` is string without corresponding panel expansion 
    -   Fix the problem that the `Slider` component is covered when used in `Form` 
    -   Fix the `Slider` component in range mode, using controlled value, component invocation stack problem 
    -   Fixed the issue of unupdated page numbers after updating dataSource in an uncontrolled situation with the `Table` component paging function 
    -   Fixed the error problem thrown by the transmitted prefix Clsprop when the 'Checkbox Group` component direct subelement is native DOM 
    -   Fixed an issue where row selection could not be made when `Table` was passed into both row Key and row Selection 

-   【Style】

    -   Change the info icons of `Toast`, `Notification`, `Modal` to blue 
    -   `Button` component copy is not selected by default 
    -   `Toast`, `Notification`interaction optimization, hover time does not disappear 
    -   `Select` multi-selection Tag left distance adjustment 12px = > 4px 
    -   The `TimePicker` option is added: active effect 
    -   `Checkbox Group` vertical spacing adjustment 
    -   `Pagination` Page divider drop-down menu style unified with Select 

-   【perf】

    -   Radio, Checkbox code optimization to remove the lifecycle-related logic of the soon-to-be-discarded unsafe 

-   【Docs】
    -   Supplementary use of `Table` component `on Row` 
    -   Fixed an issue where real-time edit boxes disappear when they exceed a certain width 

#### 0.24.3 (2019-11-03)

-   [fix] When the `Pagination`component total is less than 10, the button on the next page is not checked 
-   [fix] `Table` className affects the tr element 
-   [fix] sorting problem of `Calendar` components all-day event

#### 0.24.0 (2019-11-01)

-   [feat] `Select` component adds remote optimization remote search experience
-   [feat] `Form` Field adds fieldClassName configuration 
-   [feat] `Dropdown` component supports the automatic closing of the Floating Layer 
-   [feat] `TimePicker` adds inputStyle configuration 

-   [style] `Dropdown` component removes min Width limitation 
-   [style] `Select` clear button hover effect alignment `Input`, multi-choice placeholder color correction 

-   [fix] `Form. Input Group` is compatible with a direct sublevel null 
-   [fix] Fix the problem of the `DatePicker` component input box emptying button click invalid 
-   [fix] Fix the error reporting problem of dynamically updating optionList when the `Select` value is undefined
-   [fix] Fix the `Select` initial optionList is an empty array, the value is controlled to pass in non-empty values, and after updating optionList asynchronously, the selected item rendering does not change with it 
-   [fix] Direct error problem when the `Form` Field level container does not pass in the required field attribute 

#### 0.23.0 (2019-10-28)

-   [feat] `Select` Adjustment 
    -   Add influx, prefix support
    -   Add showArrow to control whether to display the right drop-down arrow; add showClear to control whether the right side automatically displays clear Icon
    -   Add the clickToHide parameter to control whether or not Select is automatically put away when Select is expanded
    -   Increase on Mouse Enter, on Mouse Leave pullback
    -   Remove the limitation that the value must have the corresponding option in the option List
    -   Add renderCreate Item, customize the rendering content when creating a new label
    -   Add onCreate callback, triggering when creating a new tab
    -   Increase on Exceed callback, triggered when multiple selections exceed the number limit
    -   Add onChange With Object to replace the original label In Value (the original API will still be supported but is no longer recommended)
    -   Add renderSelected Item, customize the rendering of the selected label, and replace the original option Label Prop = 'children' / 'value' (the original API will still be supported, but is no longer recommended)
-   [feat] `TimePicker` supports time range selection mode 
-   [feat] `Tree` Component on Select adds callback entry to the selected node, function(selectedKey:string, selected: bool, selectedNode: object)
-   [fix] Fixed an issue where floating layer class components (`Popover` `Tooltip` `Select` `Dropdown`, etc.) were misplaced under the edge browser 
-   [fix] Fixed an issue where the selected item did not expand after the `Tree` component update node 
-   [fix] Fix `Tabs` button mode hover state background flicker
-   [style] `Table` removes the hover effect 
-   [Style] `Date Picker` Year Selection Mode Dial Width Adjustment 

#### 0.22.0 (2019-10-18)

-   [feat] `Table` supports `on Row` `on Header Row` `on Cell` `on Header Cell` usage, and users can customize row or cell events 
-   [feat] `Tree` Component Supports Controlled LifeKeys 
-   [feat] `Tree` on Change obtains attributes other than value 
-   [feat] `Form` component formApi.setValues supports configuring isOverride, whether it is directly overwritten when assigning values to formState.values, and can be assigned in advance to fields that do not exist in the Form 
-   [feat] `Form` supports Tree Select, Cascader, Rating 
-   [feat] `Form` adds the allowEmpty attribute, and when set to true, the fieldkey with empty value also exists in formState.values 
-   [feat] `Select` Option supports showTick, className, style configuration
-   [fix] Fixed that ArrayField did not rerender after the `Form` call formApi.setValues to reassign ArrayField 
-   [fix] Fix the problem of Cotton when the `Table` component `JSX` is written `title`as `ReactNode` 
-   [fix] Fix `Tabs` dynamic modification pane error reporting
-   [fix] onPressEnter method for repairing `TextArea`
-   [fix] Fix the pop-up window closed when `Modal` clicks and presses inside Modal and then moves to the outside of Modal to loosen the click
-   [Style] `Modal` Cancel Button Replace with Lightlight Button 
-   [style] `Radio` and `Checkbox` text support triggers: hover and: active 
-   [style] `Input`, `Input`, `Date Picker`, `Time Picker` ins et Label left distance adjustment 8 = > 12 
-   [doc] `Modal` component supports custom icon in imperative 

#### 0.21.0 (2019-10-12)

-   [feat] `DatePicker` support type = "month" for annual selection 
-   [feat] `Input Number` supports continuous addition and subtraction of long press times 
-   [feat] `Button Group` supports parameters for passing in specific buttons
-   [feat] `Upload` supports drag-and-drop upload 
-   [feat] `Tree`, `TreeSelect` update on Select, on Change callback entry reference 
-   [feat] `Modal` new header attribute 
-   [fix] Fix the problem that `Input Number` passed in for matter and parser cannot be formatted properly under controlled conditions 
-   [fix] Fixed an issue where `InputNumber` could not use the back key after setting precision 
-   [fix] When fixing the `Table` fixed header, if extra-long text is passed, the column cannot be aligned 
-   [fix] Fix the 'Select` option under the Safari browser when the drop-down menu overflows and does not scroll properly 
-   [fix] Fixed `Select` set width = '100%', used under `Tabs`, first rendered drop-down menu width error problem
-   [fix] Fix the `Form` ArrayField did not make a deep Clone isolation problem for initValue, and this update has clone isolation for the values in onSubmit, onSubmit Fail, formApi.setValue, formApi.getValue
-   [fix] Fix the error reporting problem caused by the foundation of dateInput in `DatePicker` not initialized at the time of the initial render
-   [fix] Default Expand All failure after fixes `Tree` component label as node type setState 
-   [fix] Fix the problem of changing lines when `Input` prefix is in Chinese 
-   [Style] Fix spacing at the bottom of `Modal` 
-   [style] rename the forward _ 1 icon in `Icon` as fast _ forward
-   [style] `Radio` adds active state 
-   [style] `Switch` design adjustment to add size property. Modified the default size 
-   [doc] Add a sample document for `Collapsible`nesting 

#### 0.20.0 (2019-09-26)

-   [feat] `Navigation` dynamic efficiency optimization, navigation item selected state style optimization 
-   [feat] `Tree` supports labelInValue 
-   [feat] `Tree` support defaultExpanded Keys 
-   [feat] `Tree`, `TreeSelect` add animation to control whether it is turned on or not via motion, motion Expand 
-   [fix] `Slider` location computing and interaction optimized to fix compatibility bugs
-   [fix] Slider offset when dragging vertically `Slider` 
-   [fix] `Slider` range dislocated invalid value of slider 
-   [fix] `Slider` cannot be used for direct error reporting in the Edge browser (part of 
-   [fix] Fixed an issue where a scrollbar flashes at the bottom when `Tabs` switches 

#### 0.19.0 (2019-09-22)

-   [feat] New `Collapsible 'component 
-   [feat] `Tree` component Add icon to support custom icons; Add directory to support directory tree style 
-   [feat] `Tree` component label attribute supports ReactNode type
-   [feat] `Cascader`, `TreeSelect` component supports second click to put away 
-   [feat] `Popover` support display small triangle 
-   [feat] `Popaffirm` Supports Controlled Showcase 
-   [feat] `Progress`bar progress bar supports display percentage text; showInfo default changed from true to false 
-   [refactor] optimizes and adjusts the DOM structure, style, className of the `Input` component
-   [fix] Fix the problem of inaccurate computational width of the `Input` component prefix 
-   [style] Fix the problem that `Avatar` component letters are not centered 
-   [style] Fix the problem that the `Breadcrumb` component delimiter is not centered 
-   [Style] `Collapse` DOM Structural Adjustment, Increase Animation
-   [Style] `Progress`DOM Structural Adjustment, Increase Animation
-   [perf] `Button` Load Status Use New Icon (with Spin)
-   [perf] `Table` Scalable Column Interaction Optimization, Feedback More Significant 
-   [fix] Fix an issue that `TimePicker` may not be displayed at focus 
-   [fix] Fix 'Tooltip` Floating Layer Failure to Display Proper Causes Flicker when Input Box Switches 

#### 0.18.6 (2019-09-18)

-   [fix] Fixed an issue where the suboption did not take effect when the `RadioGroup` setting

#### 0.18.5

-   [fix] Fixed an invalid problem when the `Form` Field setting init Value is 0

#### 0.18 .4

-   [fix] Fix the dislocation of the Input cursor when the `Select` multi-selection does not set maxTag Count
-   [fix] Fix the `Grid` Col = 24 style failure problem

#### 0.18.0 (2019-09-16)

-   [feat] `Select` supports keyboard operation, supports second-click put away
-   [feat] `Select` new allowCreate supports creating entries in search
-   [feat] `Select` new maxTag Count support multi-selection beyond the limit display + N
-   [feat] `Tag` New Tag Group
-   [feat] Add the `List` component
-   [feat] `DatePicker`, `TimePicker`, `Input`, `InputNumber` and other components support error status and warning status display
-   [feat] `Date Picker` support `on Confirm` / `on Cancel` callback
-   [Feat] `Input Number` Input Format and Display Format Uniform
-   [Feat] Floating layer class components such as `Tooltip` / `Popover` support edge detection and automatic positioning in horizontal / vertical directions
-   [fix] Fixed an occasional unselected problem when `TimePicker` scrolling
-   [fix] After the number of selections in `Select` multi-selection mode reaches max, select again can't cancel the problem
-   [fix] Fix placeholder display problem when `Select` multiple and filter are true
-   [Style] Modify the className of the `Select` embedded label, increase the left and right spacing of Inset Label, and unify the inset Label style of Input and Select. Optimize and adjust the DOM structure and style of Select multiple to true

#### 0.17.0

-   [Feat] `Button` supports `loading` state
-   [feat] `Cascader` component supports controlled
-   [feat] `Navigation` component `onSelect` callback supports the return of the original configuration object
-   [feat] `Upload` Add prompt, prompt Position configuration prompt text and location
-   [fix] `Upload` Fix the limit limit failure problem when upload Trigger is' custom '
-   [perf] Dynamic effect adjustment of floating layer components such as `Popover` / `Tooltip`
-   [Style] Updated `--Color value of color-text-2`
-   [style] `Tab` Update Interactive Style

#### 0.16 .3

-   [Perf] Optimizing the performance of validate in the `Form` component set
-   [fix] Fix the `Pagination`component, select the later page number, and then switch the capacity per page to a larger value. The rendering error problem caused by the current page has no corresponding value in the new page number table (the current page number is changed from constant to converted)
-   [fix] Fix the `Select` component, when the label is ReactNode and the filter is turned on, the option is rendered as\ [ObjectObject\] problem
-   [Style] `Form` Component When the label Position is left, it automatically adds up and down `padding: 6px` to the label of each field to align with the first line of text of the field
-   [feat] The `Form` component has multiple fields. When reset, validate, setValues are called, the onValueChange, onChange trigger is adjusted several times to trigger only once

#### 0.16.0

-   [Feat] Add the `TimeLine` component
-   [feat] semi global variable update
-   [feat] `Back Top` component adds animation, adds character attribute
-   [Feat] `Modal` component adds centered properties and updates the positioning of the default style
-   [feat] `Cascader` component supports dynamic update subnodes
-   [feat] `Badge` component adds position properties and supports custom node
-   [feat] The attributes of `Toast`, `Notification`support decimals
-   [Feat] `Navigation` Component Style Optimization, Functional Optimization
-   [Perf] Optimization and Adjustment of Floating Layer Dynamic Efficiency of `Select`, `Tooltip`, `Popover`
-   [perf] `Table` component bottom optimization, scrolling dislocation problem repair

#### 0.15.7

-   [fix] `Tree`, `TreeSelect` support dynamic update subnodes

#### 0.15.5

-   [fix] `Form` set Values to trigger multiple onChange, onValues Change to trigger only once

#### 0.15 .3

-   [style] semi adds global font font-family statement

#### 0.15.1

-   [feat] `Table` Demo that supports column scaling, JSX description columns, document addition row drag sorting

#### 0.15.0

-   [feat] `Upload` Add upload Trigger to manually trigger upload; add onXhr Finish callback; add prompt text slot: prompt
-   [Feat] Add a `Tree` component
-   [style] `Select` removes min-width: 120px introduced by v0.10.0; fixes the problem of miscalculation of the width of the drop-down layer; modifies the definition of dropdown Match Select Width: whether the width of the drop-down menu is equal to the width of select = > whether the min-width of the drop-down menu is equal to the width of select
-   [fix] 'Form` initValues, initValue are not deeply cloned isolated and may affect the source data when the field is unloaded
-   [fix] `Select` option Label Prop is value, and controlled, option rendering error problem
-   [fix] `TextArea`cannot be reset in the Form and the initial state has no resize problem
-   [fix] Fix the problem of style coverage when multiple `Spin` exist at the same time

#### 0.14.6

-   [fix] Fixed an unchecked problem that Checkbox Group Context packaging in a production environment may cause undefined

#### 0.14.5

-   [perf] Optimize `TreeSelect` render only the nodes displayed
-   [fix] Fix the type of direction props of `Checkbox Group`

#### 0.14.0

-   [feat] `Select`, `AutoComplete` Increase label In Value, loading properties
-   [feat] `Checkbox Group`supports specified direction switching horizontal / vertical layout

#### 0.13.0

-   [feat] `Table` supports custom rendering expansion buttons.

#### 0.12.6

-   [fix] `Spin` is a package element to block the lower-level click event

#### 0.12.5

-   [fix] Fix the noLabel attribute failure problem when `Form`labelPosition = 'inset'

#### 0.11.23

-   [fix] `TextArea`incoming className / style moved to the outer package element

#### 0.11.22

-   [fix] Fix the error of `Notification`, `Toast` ref for null

#### 0.11.15

-   [fix] Fix props loss when `Form` uses withField encapsulated functional components
-   [fix] Fix the problem of placeholder invalidity in `Select` multiple mode

#### 0.11.11

-   [fix] Fixed the `Select` option List dynamic modification without rerendering problem
-   [fix] Fix the input display value error problem after the optionList dynamically changes when the `Select` filter is true

#### 0.11.8

-   [feat] `Select`, `Input`, `DatePicker`, `TimePicker` support inset Label, `Form` label Position support inset

#### 0.10.2

-   [fix] `RadioGroup` incoming className / style invalid
-   [fix] `Form` Radio Group init Value is invalid when set to 0
-   [fix] `Switch` un controller = > controller component error reporting problem

#### 0.10.0

-   [feat] `Select`Add dropdown Match Select Width, the default drop-down box is the same width as the selection box, and change the minimum width to 120px

#### 0.9.5

-   [feat] `Form` New Form.Slot component, new label Col, wrapper Colprop
-   [feat] `Select` Add option List prop to support passing option in array
-   [fix] `Form` Fix on Change / on Values Change callback value for undefined problem

#### 0.8.5

-   [fix] Fixed an issue where `TextArea` would report an error using maxCount in the Form

#### 0.8.3

-   [fix] Fix the problem that the footer null value of `Modal` and bodyStyle are invalid

#### 0.8.2

-   [fix] Fix locale error thrown when `DatePicker`, `TimePicker` is not wrapped by `LocaleProvider`

#### 0.8.1

-   [fix] Fix the icon style of the `Tab` selected item

#### 0.8.0

-   [feat] `Select` BottomSlot split into inner BottomSlot and outer BottomSlot

#### 0.7.0

-   [feat] `DatePicker` props add class name, prefix
-   [feat] `Input`props new hide Suffix
-   [fix] Fix padding calculation error when `Input` prefix is a node

#### 0.6.2

-   [fix] pageSize Changer is not updated when i18n Panigation switches locale

#### 0.6.1

-   [feat] `Select` supports dropdown ClassName, dropdown Style, support bottomSlot pop-up layer bottom slot
-   [feat] i18n support. Current support language: China, Britain, Japan and South Korea, have supported components `DatePicker`, `TimePicker`, `Modal`, `Pagination`, `Select`, `Table`, `Cascader`

#### 0.5.0

-   [feat] `ScrollList` supports scroll and infinite loop scroll mode
-   [perf] Optimize the `TimePicker` component style

#### 0.4.1

-   [fix] Fix the problem that `Collapse.Panel` className is overwritten
-   [fix] Fix the problem that the first date of the `Calendar` month view is not highlighted on the first day of each month

#### 0.4.0

-   [feat] semi supports dark mode

#### 0.3.0

-   [feat] `Upload` new preview File allows custom previews

#### 0.2.1

-   [feat] Add the `Calendar` calendar component
-   [feat] Add a `rating` scoring component
-   [feat] `default Activekey` and `activeKey` support incoming string arrays for `Collapse` props

#### 0.1.7

-   [fix] calendar date-fns reference error

#### 0.1.6

-   [feat] `Form`form Api adds submit Form ()
-   [fix] `Upload` fix the problem that the onRemovefile object cannot get uid
-   [fix] `Form` Input Group error Message displays error problems, optimizes writing, no need to manually add noLabel properties
-   [fix] `Progress`sets upper and lower limits of 100%, 0%

#### 0.1.3

-   [Feat] Add the `Progress`progress bar component

#### 0.0.50

-   [Style] Cancel the maximum height limit for the drop-down menu optionlist of `Tree Select` and can be set freely through the dropDown Style attribute
-   [fix] Fix the problem of not destroying the dom node after the `Banner` is closed

#### 0.0.49

-   [fix] Input Group automatically adds key attributes to the included element

#### 0.0.45

-   [feat] `Form` supports Input Group; custom check validate supports return ReactNode; Label supports incoming ReactNode

#### 0.0.43

-   [fix] Fix the invalid problem of `Select` className

#### 0.0.37

-   [fix] fix the problem of random order of selected item labels in `TreeSelect` multi-selection mode, and when controlled, the drop-down menu will still expand automatically after folding

#### 0.0.35

-   [feat] `Tree Select` support controlled
-   [fix] whether the display is completely controlled by visible when `Tag` passes in the visible attribute
-   [feat] When `Upload` listType = 'picture' is not uploaded, display the progress bar and do not preview the picture directly
-   When `Form` is checked with rules, throw the wrong directly when there is an error in the rules syntax

#### 0.0.34

-   [fix] Fix `Form` syncValidate when changing back from error to success, the error prompt is not cleared
-   [fix] Fix `DatePicker` clear click is invalid

#### 0.0.33

-   [fix] Fix `Datepicker` placeholder failure

#### 0.0.32

-   [fix] Fix the `TreeSelect`drop-down option is displayed according to the data incoming, and the drop-down menu sets the maximum height

#### 0.0.31

-   [feat] `Avatar` props add onClick, onMouseEnter, onMouseLeave, hoverMask

#### 0.0.30

-   [fix] Fix `Table` pagination pageSize failure

#### 0.0.28

-   [Feat] Add dynamic / animation to each component

#### 0.0.27

-   [feat] Add the `Side Sheet` component
-   [Feat] Add a `Skeleton` component

#### 0.0.26

-   [fix] Fix the problem that the negative number can still be entered manually in front after the `Input Number` has set the upper and lower bounds of min and max

#### 0.0.23

-   [feat] Add the `Side Sheet` component
-   [feat] `DatePicker`, `TimePicker` increase the inputReadOnly attribute

#### 0.0.20

-   [feat] `Tree Select` props adds value In Array, supports callbacks to return an array of path value values at all levels of the current node
-   [Feat] Add the `Cascader` component
-   [Feat] Add the `Layout` component
-   [Feat] New `Avatar` component
-   [feat] Add the `Back Top` component

#### 0.0.18

-   [fix] Return value in `TreeSelect` Multiple Selection Mode When the parent node is selected, only the parent node is returned and not the parent child node is returned

#### 0.0.16

-   [fix] Fix the problem that the `Upload` picture wall mode does not display the off icon, upload failure after the same file is deleted
-   [feat] `Upload` supports the creation of jump links for all file formats, props supports photography, name

#### 0.0.15

-   [fix] Fix the problem that the `Input Number` status is invalid

#### 0.0.14

-   [feat] Add the `Tree Select` component
-   [Feat] New `Upload` component

#### 0.0.11

-   [fix] Fix the problem that the `Table` render index is undefined

#### 0.0.10 - alpha.12

-   [fix] Fix `Collapse` style invalid
-   [fix] Fix type check error when `Checkbox` value is number

#### 0.0.10 - alpha.11

-   [fix] Fix the problem that `Tabs` active Key is not controlled

#### 0.0.10 - alpha.10

-   [fix] When the same option is selected after the `Select` Options dynamic change, the error problem has been displayed by the option

#### 0.0.10 - alpha.9

-   [feat] `Nav` Increases Controlled Keys and Open Keys props
-   [Feat] All components uniformly support className, styleprops incoming

#### 0.0.10 - alpha.8

-   [Feat] Add the `Badge` component
-   [feat] `DatePicker` props new: on Open Change, allow Clear, open, defaultOpen

#### 0.0.10 - alpha.7

-   [Feat] Add the `Describement` component
-   [feat] Add the `Collapse` component
-   [fix] Fix the `portal` pop-up layer z-index

#### 0.0.10 - alpha.6

-   [feat] Add Form. TextArea
-   [fix] `Notification`point-event penetration problem
-   [fix] mispositioning of the `porta`l pop-up layer in the scrolling container
-   [Feat] When `Modal` pops up, automatically prohibit the scroll of the body

#### 0.0.10 - alpha.5

-   [Style] `Button` Style Optimization

#### 0.0.10 - alpha.4

-   [fix] `Select` non-filter mode placeholder invalid
-   [fix] `Nav` selects the subitem, Sub is not highlighted
-   [Feat] `Button` abandoned ghost prop
