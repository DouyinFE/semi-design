---
category: 开始
title: Change Log 更新日志
icon: doc-changelog
localeCode: zh-CN
order: 5
brief: 关于 Semi Design For React 优化与更新
---

Semi 版本号遵循**Semver**规范（主版本号-次版本号-修订版本号）：

-   主版本号（major）：重大性能/使用变更
-   次版本号（minor）：添加了新组件/新 feature
-   修订版本号（patch）：bugfix

---

#### 🎉 2.0.0 (2021-10-26)

- 【Breaking Change】
  - 组件相关调整
    - Icon 相关
      - Icon 组件不再支持  type=xxx 方式使用内置 icon
      - 自定义 svg 不再支持插件方式配置 srcSvgPaths
      - Button icon 属性不再支持通过 string 传递内置 icon 名
      - Dropdown 删除 iconType 属性，统一为 icon 属性
      - Navigation icon 不再支持通过 string 方式传入，需要传入 ReactNode
      - Notification icon 不再支持通过 string 方式传入，请统一使用 ReactNode
    - AutoComplete 正式废弃 onChangeWithObject 属性
    - Cascader triggerRender 的入参移除 onInputChange
    - Form 不再从 `semi-ui/index.js` 导出 Label组件，如需使用请用 Form.Label
    - Tree onRightClick 更名为 onContextMenu
    - Upload dragable 更名为 draggable
    - Table
      - 不再在 componentDidUpdate 时响应的 API
        - defaultExpandAllRows，请用 expandAllRows 替换
        - defaultExpandRowKeys，请用 expandRowKeys 替换
        - defaultExpandAllGroupRows，请用 expandAllGroupRows 替换
  - 样式相关调整
    - CSS 变量添加 semi 前缀，例如 --color-primary => --semi-color-primary
    - 在 2.x，统一将插画的宽高设置为 `200 * 200px`，1.x 的尺寸为 `300 * 150px`
    - 设计变量调整
      - Popconfirm
        - $color-popconfirm_body-text 由 --semi-color-tertiary => --semi-color-text-2
        - $color-popconfirm_header_alert-icon 由 #fa7500 => --semi-color-warning
      - Progress
        - $spacing-progress_line_text-marginLeft 由 15px => $spacing-base(16px)
        - $spacing-progress_line_text-marginRight 由 15px => $spacing-base(16px)
      - Radio
        - $spacing-radio_addon_buttonRadio_large-paddingY 由 6px => $spacing-base-tight / 2 (6px)
        - $radius-radio_cardRadioGroup 由 3px => --semi-border-radius-small(3px)
  - 插件相关调整
      - 2.x 不再支持通过 Semi 插件配置 iconLazyLoad、svgPaths、srcSvgPaths
      - 2.x 默认已支持局部暗色/亮色模式，不再需要在插件配置 themeScope。使用方式由 #semi-always-xxx => .semi-always-xxx
  - 其他调整
    - 由于 Icon 方案的调整，Icon、Empty 组件使用 icon、插画的方式与之前不同，具体请看 [1.x 迁移 2.x 指南](/zh-CN/start/update-to-v2)

#### 🎉 1.33.0 (2021-10-22)
- 【Fix】
    - 修复 Cascader组件同时使用 changeOnSelect 和 loadData 属性时，未选到最后一级的情况下，重置value无效 

#### 🎉 1.33.0-beta.3 (2021-10-19)
- 【Fix】
    - 修复 Cascader 当 label 为 ReactNode 类型时，开启 filterTreeNode，搜索结果未正确渲染。 
    - 修复 Steps type 的 propTypes 缺失 "nav" 类型的问题。

#### 🎉 1.33.0-beta.2 (2021-10-18)
- 【Fix】
    - 修复 Cascader 异步加载时，defaultValue 异常清空

#### 🎉 1.32.3 (2021-10-18)
- 【Fix】
    - 修复 Select 搜索时输入 '(' '/'等未转义字符时报错的问题

#### 🎉 1.33.0-beta.0 (2021-10-15)
- 【Fix】
    - 修复 Tooltip 包裹 Select时，远程搜索失焦 
    - 修复 Select 搜索模式下，搜索结果中高亮字符串前后空格丢失的问题 

#### 🎉 1.32.2 (2021-10-14)
- 【Fix】
    - 修复 Tooltip motion 为 false 时弹出层未显示问题（影响v1.30+）
    - 修复 Slider 在拖拽时如果父级 dom  进入 display none 会触发错误的问题 

#### 🎉 1.32.1 (2021-10-11)
- 【Fix】
    - 修复 Button disabled 时，触发冒泡的问题。

#### 🎉 1.32.0 (2021-10-09)
- 【Fix】
    - 修复Avatar更新src不生效问题 
    - 修复 DatePicker 俄语、越南语显示日期错误问题 
    - 修复 Tag size 为 small 且 avatarShape 为 circle 时，avatar 样式大小异常 

#### 🎉 1.32.0-beta.0 (2021-09-30)
- 【Feat】
    - TreeSelect 支持 support loadData/onLoad/loadedKeys 
    - Cascader 支持 disableStrictly 
    - Tooltip 支持 wrapperClassName
    - Form formApi.setValue、setError、setTouched 支持使用父级fieldPath，对多个field进行批量赋值 

#### 🎉 1.31.0 (2021-09-24)
- 【Fix】
    - Form 修复 validate 指定校验部分 fields 时，可能因为 field 前缀相同，而误触发校验的问题 
    - DatePicker disabledTime 回调参数类型错误问题（影响v1.26 ~ 1.31-beta）


#### 🎉 1.31.0-beta.1 (2021-09-23)
- 【Fix】
    - 当Pagination showQuickJumper 为true，输入负数时，由不生效改为跳转至第一页
- 【Style】
    - 去除Pagination type为mini时左右两侧的padding（即组件Token：$spacing-pagination_small-paddingX的默认值由8px变更为0）
    - Pagination showQuickJumper为true时，当总页数只有1页时，quickJumper部分样式自动disabled。新增组件Token：$color-pagination_quickjump_text-disabled

#### 🎉 1.31.0-beta.0 (2021-09-18)
- 【Feat】
  - Upload添加beforeRemove（删除前回调）和beforeClear（清空前回调），可用于阻止移除文件
  - Pagination增加 showQuickJumper 快速跳转至某页
  - DatePicker 新增 rangeSeparator API，支持替换范围日期分隔符
  - Table
    - 新增 defaultSortOrder API，支持给列设置一个默认的排序顺序 
    - 新增 expandRowByClick API，支持点击行展开 
- 【Fix】
    - 修复 Input 未设置宽度且hideSuffix为true，清除按钮 hover 时输入框宽度变化问题 
- 【Style】
    - Pagination 新增组件Token：$spacing-pagination_quickjump_marginLeft、$spacing-pagination_quickjump_input_marginLeft、$spacing-pagination_quickjump_input_marginRight、$font-pagination_quickjump_fontWeight、$width-pagination_quickjump_input_width

#### 🎉 1.30.2 (2021-09-17)
- 【Style】
    - 修复Transfer组件右侧header高度变化样式问题

#### 🎉 1.30.1 (2021-09-13)
- 【Fix】
    - 修复Button 任意情况都阻止了事件冒泡导致Upload不可用的问题（影响范围v1.30.0）

#### 🎉 1.30.0 (2021-09-10)
- 【Fix】
  - 修复 Tooltip getPopupContainer 报错问题
  - 修复 Pagination 传入total过大时报错的问题
  - Button组件disabled后，期望点击事件不冒泡
- 【Chore】
  - 更新 TimePicker defaultValue 和 value 的类型定义
  - 修复 Card shadows 的 dts，将 'show' 改正为 'always'

#### 🎉 1.30.0-beta.1 (2021-09-06)
- 【Fix】
  - 修复 Cascader 在超长列表情况下，点击 clear 按钮后，dropdown 错位的问题
- 【Docs】
  - 修复 Table 文档中，介绍 api 时名称书写有误的问题。defaultExpandGroupRows 改为 defaultExpandAllGroupRows，expandGroupRows 改为 expandAllGroupRows

#### 🎉 1.30.0-beta.0 (2021-09-03)
- 【Feat】
  - CheckboxGroup 和 RadioGroup 支持 type='card' 和 type='pureCard' 
  - Tree 支持 expandAll 
  - Form Field 支持传入 ref 
  - TextArea 支持 showClear 和 onClear 
  - Treeselect 
    - 支持 disableStrictly 
    - 支持 expandAll 
  - 主题支持通过配置打开局部为暗色/亮色模式，详情点击 
  - Table 支持 expandAllRows，defaultExpandAllGroupRows，expandAllGroupRows API 
- 【Fix】
  - Tooltip
    - 修复container 为 body 时，如果 body 存在 margin 造成的弹出层位置错误 
    - 修复 onVisibleChange 偶尔不会触发问题 
    - 修复 mouseEnterDalay 和 mouseLeaveDelay 都为 0 时，鼠标快速划过弹出层无法隐藏问题 
  - 修复 DatePicker type 为 date 时，失焦后再次聚焦没有触发 onFocus 问题 
  - Icon懒加载图标未加载修复 
  - Calendar 修复头部不对齐的问题 
  - 修复 slider 在受控模式 onAfterChange 不生效的问题
- 【Style】
  - Tree 和 TreeSelect 支持搜索高亮 
  - CheckboxGroup direction='horizontal' 时，最后一个 checkbox 设置 margin-right 为 0，以对齐vertical 的情况
  - 修复Upload照片墙模式，disabled指针样式未禁止问题
- 【Docs】
  - 修复 TagGroup demo 没有垂直居中对齐的问题 

#### 🎉 1.29.1 (2021-08-30)
- 【Fix】
  - 修复 ArrayField中使用Form.Select 开启onChangeWithObject后，新增或删除行时由于stringify异常导致unregister错误的问题 

#### 🎉 1.29.0 (2021-08-27)
- 【Feature】
  - 新增Icon，layers
- 【Fix】
  - 修复 Table column render 返回 rowSpan 且有固定列时，列无法对齐问题 
  - 修复 InputNumber  formatter 在受控模式下与非受控模式效果不同问题 
  - 修复 DatePicker 禁用开始日期无法修改结束日期问题 
- 【Style】
  - Cascader 搜索高亮的颜色替换为 --color-primary 
  - Checkbox 和 Radio 在 disabled 时 extra 颜色修改从 --color-text-2 修改为 --color-disabled-text
  - InputNumber 传入 disabled prop 时，对按钮添加禁用颜色 
- 【Chore】
  - 优化 Avatar、Banner、DatePicker 等 13 个组件类型定义 @xiezhiqiang
  - DatePicker disabledDate 参数暴露 rangeEnd 值
  - 优化 Table 类型定义  


#### 🎉 1.29.0-beta.0 (2021-08-20)
- 【Feature】
    - TagInput
        - 支持 autoFocus 
        - separator 支持数组格式，允许设置多个分隔符 
    - Cascader
        - 支持 onClear 
        - 支持 showNext，允许设置 Dropdown 子菜单的展开时机
    - TreeSelect 支持 searchPosition 
    - Steps 支持 onChange 
    - Switch 支持 loading 
    - Slider 垂直模式支持反转方向，即上大下小 
- 【Style】
    - **Space 的间距实现从 margin 修改为 gap 。开启 wrap 后，位于最后一行的子元素不再有下外边距，且每行的最后一个元素不再有右外边距** 
    - TreeSelect 的 selection 的右边距从 12px 设置为 0，以对齐 Select 组件 
- 【Fix】
    - TreeSelect 
        - 修复单选时，若选中已选项目，下拉框不会收起的问题
        - 修复了 multiple 时 size 失效的问题 
    - Slider
        - 修复 onAfterChange 在特殊情景下入参数值不正确的问题 
    - Select
        - 修复虚拟列表文本过长时图标与文本折行问题
    - DatePicker
        - 修复 dateRange 受控模式下选择一个日期后 notifyChange 导致格式化日期报错 
- 【Docs】
    - Cascader 补充文档中 treeData 的类型介绍 
- 【Chore】
    - TreeSelect 补充 triggerRender 入参的 dts 类型定义以及对应的文档说明

#### 🎉 1.28.4 (2021-08-19)
- 【Fix】
    - DatePicker
        - 在 dateTimeRange 类型中，修复判断日期是否为disable时存在的问题

#### 🎉 1.28.3 (2021-08-19)
- 【Fix】
    - Cascader
        - 修复 autoMergeValue 为 false 时报错 forEach is not a function 的报错问题
        - 修复 multiple 为 true 且 showClear 为 true 时，当选中项为空时显示 clearBtn 的问题

#### 🎉 1.28.2 (2021-08-18)
- 【Fix】
    - Steps
        - 修复 Steps 定制组件级Design Token 不生效的问题
#### 🎉 1.28.1 (2021-08-16)
- 【Feature】
    - 组件内置文案支持繁体中文 
- 【Fix】
    - Select
        - 修复受控多选且 onChangeWithObject 为 true 情况下，optionList 中含有 key，第一次选择时onChange 回调中 key 丢失的问题 
        - 修复 onChangeWithObject 打开之后，onChange 里面的 option 会额外包含某些Select内部状态如 selected、show 等的问题 
        - 修复 filter allowCreate 同时开启，搜索选项有命中的情况下，点击任一选项也会造成创建新选项的问题 
    - Calendar
        - 修复默认 locale 错误的问题 
    - 修复 UMD 产物 Icon 图标未去色问题
    - DatePicker
        - **在dateRange 和 dateTimeRange 类型中，支持动态 disable 日期选项。比如当选择了 startDate后，在选择 endDate 时，比 startDate 小的日期不可选**
        - **在dateRange 和 dateTimeRange 类型中，优化了选择日期时trigger的高亮区域。由原来完成的trigger高亮切换为input区域。包含背景和边框。比如在选择startDate时，startInput区域会高亮。**
            - **注：实现该功能调整了DatePicker的trigger。在input外层包括一层div。**
        - 修复范围日期选择器选择一个日期且另一个日期为空时误触发 onChange 引起的报错问题（from v1.26） 
    - TreeSelect 双击下拉框子项目后报错的问题 
- 【Style】
  - Select.Option 增加 flex-wrap，避免搜索时某些情况下过长的文本显示异常的问题
- 【Chore】
  - Typography 移除类型定义文件中的 dangerouslySetInnerHTML 属性
  - Notification 类型定义问题更新，添加 open 属性，移除不存在的 confirm 属性
- 【Docs】
  - Button 补充 noHorizontalPadding 的文档说明 


#### 🎉 1.28.0-beta.0 (2021-08-06)
- 【Feature】
    - Cascader 支持多选，提供 multiple、onExceed、max、maxTagcount、showRestTagsPopover、restTagsPopoverProps、autoMergeValue 这些相关 api 
    - DatePicker新增 API开关： syncSwitchMonth ，允许在范围选择场景下，双面板月份同步切换 
    - DatePicker新增回调：onPanelChange，当月份左右切换时触发 
- 【Style】
    - 修复 TagInput 中 +N 的水平间距和设计稿的差异，为 +N 添加水平内边距 8px
    - Radio
        - 修复按钮类型的 Radio 默认背景色和设计稿的差异，从 var(--color-fill-1) 改为 var(--color-fill-0) 
        - 修复按钮类型的 Radio 不对齐的问题，添加 align-item: middle
    - Design Token
        - Popconfirm 新增 $radius-popconfirm-popover SCSS 变量，通过配置此变量可以自定义本组件border-radius
        - 新增 --border-radius-full（值为9999px） CSS 变量，可用于创建全尺寸圆角，如胶囊标签等
- 【Fix】
    - Table
        - 修复受控更新 rowSelection 时 可选单元格disabled渲染错误的问题
        - 修复受控更新 columns.sortOrder 时表格数据未正确排序的问题
        - 修复在已有筛选项的情况下，更新dataSource，表格数据未经过滤全部展示出来的问题 
- 【Docs】
    - Tree 组件补充 autoExpandParent 的描述 & Demo

#### 🎉 1.27.3 (2021-08-05)
- 【Fix】
    - 优化DatePicker dateRange 和 dateTimeRange 场景的交互体验。支持在一次选择中，可单独改变 startDate 或 endDate以及同时改变 

#### 🎉 1.27.2 (2021-08-03)
- 【Style】
    - 修复RTL 模式下 Select insetLabel右侧边距不对的问题
#### 🎉 1.27.0 (2021-07-30)
- 【Fix】
    - 修复SideSheet  mask为false且width设置为百分比字符串时，SideSheet没有正确展示的问题 
    - Tag 新增default size，修复在InputGroup中使用default size报错的问题
- 【Style】
    - Tag 增加  white-space: nowrap，解决超长换行文本因高度固定导致的显示不正确问题（Tag建议优先单行使用，内容超长时建议搭配Typography使用）
- 【Chore】
    - Table新增RecordType范型，完善Column.render参数定义
#### 🎉 1.27.0-beta.0 (2021-07-23)
- 【Feature】
    - Breadcrumb 新增 renderMore 和 moreType API，可自定义...区域的渲染 
    - Select 支持搜索时关键字高亮（仅当 option label/chilren 为纯字符串文本时） 
    - Pagination mini 模式下，新增 hoverShowPageSelect API，支持 hover 快速切换页码 
    - TreeSelect 新增 searchAutoFocus API，支持搜索功能中搜索框自动聚焦
    - Cascader 新增 topSlot、bottomSlot API 
    - Modal 现在会自动计算滚动条宽度防止弹出时 mask 背后内容抖动 
    - Navigation 新增 limitIndent API 用于缩进限制，新增 toggleIconPosition API 用于控制 展开收起 icon 位置
    - Tree 支持在 renderFullLabel 场景下拖拽
- 【Fix】
    - 修复 Notification 同一任务队列快速显示隐藏时小概率失效的问题 
    - 修复Transfer组件全选/取消全选，清空的处理判断逻辑问题 
- 【Docs】
    - 修正 Dropdown 文档中 tooltip position 的跳转链接

#### 🎉 1.26.1 (2021-07-20)
- 【Fix】
    - 修复 DatePicker 切换时间直接报错的问题 
- 【Style】
    - 修复 DatePicker 有 defaultValue 时， disabled 样式不符合预期的问题 
- 【Docs】
    - 修改补充了 Cascader 和 Select 组件文档中 triggerRender 的内容

#### 🎉 1.26.0 (2021-07-18)
- 【Fix】
  - Form
    - 修复 Form reset时 ArrayField 没有被重置回初始状态的问题 
    - 修复 Form field rules由有效数组变更为空数组时，重新执行校验，校验状态没有被正确更新的问题 
    - 修复 Form ArrayField 通过initValue配置初始值时，初次渲染也错误触发了onValueChange的问题 
  - DatePicker
    - 修复 DatePicker 在日期未发生改变时也调用 onChange 问题 
    - 修复 DatePicker disabledDate 与 disabledTime 传参未适配 timeZone 问题 
  - 修复 RadioGroup 隔级传 Radio 报错的问题 
  - 修复 Space 中使用 React.Fragment 显示不符合预期的问题 
  - 修复 Collapsible 没有 keepDom，却在初始折叠时渲染了 DOM 的问题 
  - 修复 Table 表头列合并 rowSpan 为 0 时列对不齐问题 
- 【Style】
  - Navigation
    - Navigation 一级目录选中态文字颜色与设计稿对齐， 由 --color-primary ➡️ --color-text-0 
    - Navigation 横向导航栏优化交互细节，去掉箭头的翻转动画 
  - Radio 未 checked 状态下 hover 后文字颜色的样式，移除 var(--color-primary) 文字高亮
  - Table resize 热区的宽度由 1px ➡️ 8px 
- 【Chore】
  - 补充 DatePicker triggerRender 和 renderFullDate 类型定义
  - 补充 Select 的 afterClose 类型定义
  - Table 增加行/列合并示例

#### 🎉 1.26.0-beta.3 (2021-07-15)
- 【Fix】
    - 修复 Select 中.d.ts 遗漏了 afterClose 的问题
    - 修复 Space 中使用 React.Fragment 显示不符合预期的问题 

#### 🎉 1.26.0-beta.2 (2021-07-14)
- 【Fix】
    - 修复 Form reset时 ArrayField未恢复至初始状态的问题 
    - 修复 Form Field rules由有效数组变更为空数组后，校验状态未更新的问题 
    - 修复 RadioGroup 隔级传 Radio 报错的问题 

#### 🎉 1.26.0-beta.1 (2021-07-14)
- 【Fix】
    - 修复 DatePicker 拆分输入框不兼容 triggerRender 问题
    - 修复 Form ArrayField 初始化时调用 onValueChange 问题 
- 【Style】
    - 修复 button 类型的 Radio 未 checked 状态下 hover 后文字颜色的样式与设计稿不一致问题，移除 var(--color-primary) 文字高亮
#### 🎉 1.26.0-beta.0 (2021-07-09)
- 【Feature】
    - Radio 支持 button style
    - TreeSelect 支持 renderSelectedItem API，可自定义已选项 
    - DatePicker  dateRange 和 dateTimeRange 场景对输入框进行拆分，可单独改变 start 或 end，优化交互体验 
    - Cascader 新增 filterLeafOnly，支持搜索并选择非末级数据 
- 【Fix】
    - 修复点击 Input 的 prefix/suffix 不会让输入框 focus 问题 
    - 修复 Input 同时使用 addonBefore 和 showClear 样式问题 
- 【Style】
    - 修复 Tree 和 TreeSelect 层级 indent 与设计稿不一致问题，由 8-40-60-100 更新为 8-28-48-68
    - **请留意 DatePicker type 为 dateRange 或 dateTimeRange 场景，输入框 DOM 发生修改，由一个输入框拆分为两个输入框；inputStyle 属性将绑定到两个输入框上；blur 行为由监控输入框的 blur 修改为 closePanel 时调用 onBlur。**
    - **请留意 Input 的样式新增默认的高度。如果你给 Input 自定义了 padding，由于 Input 为 border-box，请将 Input 的 height 设置为默认高度+自定义padding**
- 【Docs】
    - Table 补充 column.title 描述，解释不同参数类型对 title 渲染的影响
#### 🎉 1.25.0 (2021-07-02)

- 【Fix】
    - 修复 DatePicker placeholder 传空字符串不生效问题
    - 修复 Collapse 传入复杂内容致高度计算错误的问题
- 【Chore】
    - 校准TreeSelect、Tree 的 d.ts ，查漏补缺 
- 【Style】
    -  Notification width 由固定的 320px => auto

#### 🎉 1.25.0-beta.3(2021-07-01)

- 【Fix】
    - 修复 Select value=0 且optionList中无对应Option时，renderSelectedItem未触发执行的问题 

#### 🎉 1.25.0-beta.0 (2021-06-25)

- 【Chore】
    - 优化构建体积，多语言包支持 tree shaking，此次改动涉及组件 LocaleProvider、 DatePicker、TimePicker、Calendar

#### 🎉 1.24.4 (2021-06-21)

- 【Fix】
    - 修复 Navigation 在未挂载时调用 setState 问题 

#### 🎉 1.24.2 (2021-06-20)

- 【Fix】
    - 修复 AutoComplete 数据变化后弹出层过宽没有自动切换位置问题 
    - 修复 Cascader、Tree 修复内部状态 loadedKey 被意外更新的问题
- 【Chore】
    - 增加了设计变量页面，各组件也增加了 DesignToken 的展示

#### 🎉 1.24.1 (2021-06-20)

- 【Fix】
    - 修复 DatePicker 提示 dateFnsLocale required 问题

#### 🎉 1.24.0 (2021-06-18)

- 【Chore】
    - 更新Column dts，完善 useFullRender 类型

#### 🎉 1.24.0-beta.2 (2021-06-17)

- 【Fix】
    - 修复 TimePicker 使用 Input 修改时间交互不顺畅问题 

#### 🎉 1.24.0-beta.1 (2021-06-15)

- 【Feature】
    - DatePicker
        - DatePicker 新增 onPresetClick API
    - Upload
        - Upload组件新增 onAcceptInvalid API 

#### 🎉 1.23.5 (2021-06-11)

- 【Fix】
  - 修复 Table 虚拟化表格无法表头与 body 对不齐问题

#### 🎉 1.23.4 (2021-06-09)

- 【Fix】
  - 修复 DatePicker format 后的 dateStr 不支持多语言问题 

#### 🎉 1.23.1 (2021-06-07)

- 【Fix】
  - 修复 Table 同时传 prop columns 和 children JSX columns 报错问题
  - 修复 Table 插拔键鼠导致部分使用场景（传 scroll.y）下表头与 body 无法列对齐问题 
  - 修复 Slider 不支持移动端拖拽问题 

#### 🎉 1.23.0 (2021-06-04)

- 【Fix】
  - Transfer
    - 修复了当dataSource更新时，未更新搜索结果的问题 
    - 修复了已选项disabled的情况下hover上展示移除图标的问题 
  - 修复Dropdown.Item图标自动缩放问题
  - 移除Tooltip、Dropdown等浮层组件上 .d.ts 误增加的disabled 属性（实际上组件并未提供该API）
  - 修复了Upload在单文件替换时，第二次重复上传相同文件失效的问题 
- 【Style】
  - 优化Modal 动画参数，减少卡顿感

#### 🎉 1.23.0-beta.0 (2021-05-28)

- 【Feature】
  - AutoComplete
    - 新增onChange API，当在输入框变化/候选项选中时触发，一直返回string类型
    - **value不再对object类型支持**
  - Toast
    - 新增ToastFactory，通过ToastFactory.create()生产Toast，解决getPopupContainer配置后无法更改问题
  - Icon 
    - 新增 resso brand icon
- 【Fix】
  - 修复 Tabs activeKey 更新不及时导致 TabPane 渲染时机不正确引起的 children 渲染错误问题  
  - 修复 DatePicker 在某些时区具有夏令时偏移问题 
  - 修复 Popover 小箭头丢失问题（影响版本 v1.22.0）
  - 修复 Form.TextArea 组件透传给原生组件 insetLabel 属性
  - 修复 AutoComplete 当 value 受控且等于""时，输入框可变化的问题
  - 修复 AutoComplete，defaultValue 优先级高于 value 的问题
  - 修复 space .d.ts 部分类型错误的问题

#### 🎉 1.22.2 (2021-05-24)
- 【Fix】
  - AutoComplete
    - 修复AutoComplete选项点击padding处无法选中问题

#### 🎉 1.22.0 (2021-05-21)
- 【Fix】
  - Table
    - 修复 Column JSX 写法更新数据表格行为异常问题 
    - 修复 提醒 array 的每一项需要给单独 key 问题
  - DatePicker 
    - 修复点击清除按钮后没有清除面板日期行为
    - 修复设置时区时 dateTime 时间选择无法使用问题 
  - 修复 Upload 在 limit=1 时，替换功能失效问题
  - 修复 Select 动态切换 multiple 时 defaultValue/value 如果是非法值引起的 Error
  - 修复 Pagination 动态变更 pageSize 后，Pagination 内置的分页容量 Select 选择器值显示不匹配的问题 

#### 🎉 1.22.0-beta.0 (2021-05-14)
- 【Feature】
  - DatePicker
    - 新增 topSlot/bottomSlot API，渲染顶部和底部额外区域 
    - format 适配多语言，与 LocaleProvider 提供的语言保持一致 
  - Transfer
    - renderSelectedItem新增 sortableHandle传参，用于draggable场景配置自定义已选项渲染时候用
- 【Fix】
  - Form
    - 修复submit校验失败时，errors中的error对象可能会被吞掉变成{}的情况 
    - 修复trigger包含mount，且validate为异步检验时，挂载后未触发初次校验的问题 
  - Table
    - 修复 disabled 所有行可以选中第二页数据问题 
    - 修复函数组件使用时排序失效问题（影响版本v1.21) 
    - 修复动态切换 rowSelection 时，列没有更新问题（影响版本v1.21）
    - 更新 Table 逆序排序逻辑，由先升序排+reverse => 逆序排序 
    - 修复 配置 scroll.y 且当前页数据不够时没有显示垂直滚动条导致的列对不齐问题 
  - Radio修复 mode='advanced'时，如果group与radio中间嵌套了 div或其他标签，advanced会不生效的问题 
  - 修复 Card 组件传入 className 没有生效问题 
  - 修复 Transfer 组件 defaultValue 失效问题 
  - 修复 Calendar组件显示更多事件数量显示异常问题
  - 修复 Input 在条件渲染情况下，clear 按钮点击失效的问题 
  - 修复 InputNumber step 设置为 0.1，min 为 0，max 为 1，无法通过右侧加号达到 1 问题 
  - Select  
    - 修复 Select onChangeWithObject 为 true 时，调用ref.selectAll不生效问题；修复调用ref.selectAll后未触发onChange的问题 
    - 修复 Select 搜索后更新optionList将选项个数变更后，某些情况下直接敲击回车抛出 Uncaught TypeError: Cannot read property '_inputCreateOnly' of undefined 的问题 
  - 修复 Description data key传入reactNode时，抛出propType check warning的问题
- 【Style】
  - Radio、Checkbox border color 与设计稿对齐，统一更新为 var(--color-text-3) 
  - 修复 Radio disabled border 颜色不正确问题 
  - 修复 Avatar label 没有垂直居中问题 
  - 对所有组件的组件级别的 Design Token 进行了梳理，以支持通过主题定制组件级样式

#### 🎉 1.21.0 (2021-04-30)
- 【Fix】
  - 修复日历组件在跨月显示时间异常问题 
  - 修复 Banner 组件 title 和 description 嵌套标签报错问题
  - 修复自定义 prefixCls 时 Table 组件排序时按钮不高亮问题
  - 修复 Typography copy 时存在逗号问题，对数组类型的 children 进行兼容
- 【Chore】
  - 修复 Typography 组件存在的循环依赖问题 
- 【Style】
  - Typography Paragraph margin 设置为 0。**请注意 margin 的默认值有变化，如果你之前没有引入 [reset.css](https://www.npmjs.com/package/reset-css)，它的 margin 会从浏览器继承（1em），而现在默认 margin 为 0**。
- 【Docs】
  - 补充 Typography 组件 component API，component 可以支持自定义 Typography 的渲染元素

#### 🎉 1.21.0-beta.0 (2021-04-25)
- 【New Component】
  - 新增 Card 组件
- 【Feature】
  - TagInput 支持 max、showRestTagsPopover、restTagsPopoverProps、showContentTooltip
  - Form 支持 Form.TagInput
  - Table 支持 expandedRowRender 修改为返回 null 则不渲染展开行 
  - Upload组件支持单文件替换
  - Icon组件新增 onMouseDown onMouseUp onMouseMove api
- 【Fix】
  - TagInput 的 maxTagCount 行为修正，对齐其他组件（超出后显示+N）
  - 修复 Banner 组件 title 和 description 嵌套标签报错问题
- 【Perf】
  - Table 渲染次数优化，对行选择单选场景和全局刷新问题进行了优化 
- 【Chore】
  - 修复 Typography 组件存在的循环依赖问题 
- 【Docs】
  - 补充 Typography 组件 component API，component 可以支持自定义 Typography 的渲染元素
- 【Style】
  - --color-disabled-bg下降一个色阶，引用-grey-1, 提高背景和文字的对比, 提高可读性
  - tietrary button 的 文字颜色 使用 --color-text-1, 同样提升对比度+可读性
  - 对于 borderless + split button , 按钮主体和下拉箭头的 hover state 分开, 用以明确热区


#### 🎉 1.20.3 (2021-04-29)
- 【Fix】
  - Select的Class类型添加open、close等实例调用方法
  - 修复Progress在unmounted时调用setState引起React报错
  - Cascader当有未匹配初始值时，级联异步加载未显示子节点 
  - Breadcrumb noLink的样式修复
  - Upload 进度条调整为在接收到服务器明确响应后才到达100%
  - 修复 DatePicker 可以在受控模式下输入禁用日期问题 
  - 修复 Table sorter 在自定义 prefixCls 场景下点击没有高亮问题


#### 🎉 1.20.0-beta.4 (2021-04-12)
- 【Feature】
  - Upload新增文件夹上传功能 
  - Transfer支持树形穿梭框 
  - TagInput 新增 addOnBlur 和 allowDuplicates api 
  - Table 新增获取虚拟化表格ref的接口，虚拟化表格允许滚动至某行 
  - Anchor 新增默认锚点 
  - Anchor.Link 新增disabled 
- 【Fix】
  - 修复 Navigation item font-weight 错误问题（ 1.18 版本引入）
  - 修复使用 prefixCls 后，Tabs 设置 collapsible，切换 tab 时有报错问题
  - 修复 Form label、Table 筛选器 dropdown item 的 RTL 问题
  - 修复 Anchor 有滚动容器时，点击锚点，滚动容器发生滚动问题 
  - 修复 Table 筛选器筛选结果为空时，显示全部数据问题 
- 【Style】
  - TagInput 标签过长发生截断时，自动显示 ToolTip 
  - Banner 非全屏模式下 title 与 description 添加 2px 间距 
  - Form label font-weight 更新 700 => 600，相对应的 scss 变量 font-weight-bold 也从 700 调整为 600 


#### 🎉 1.19.0 (2021-04-02)
- 【Fix】
  - 修复 Navigation 在初始化时设置二级的 selectedKeys，一级标题没有激活样式的问题 
  - 修复 Table 点击第一个筛选器后 setState 第二个筛选器失效问题 
  - 修复 Avatar 动态修改 hoverMask 不生效的问题
  - TagInput
    - 修复空格交互问题 
    - 修复setInputValue('') 失效 
  - InputNumber
    - 修复受控模式下使用 ⬆️ 和 ⬇️ 按钮输入框没有更新问题 
    - 修复受控模式下传递非法数值没有响应问题 
- 【Style】
  - 移除 Modal fullScreen 时带的 border 样式
  - 修复 Tabs type='line'，size为small时，设置了 tabBarExtraContent 会由于高度撑开时使得 tabBar 的底部 border 样式不对的问题
  - TagInput
    - 修复标签长度超出的样式问题 
    - 修复用 withField 包装后的宽度问题 

#### 🎉 1.19.0-beta.0 (2021-03-26)
- 【New Component】
    - 新增 TagInput 组件 
- 【Fix】
    - AutoComplete 点击回车报错 
    - 修复 Description DataItem 为 null 时报错 
    - 修复 Upload beforeUpload 中返回新的 fileInstance ，未正确执行上传的问题 
    - 修复 Navigation 选中且禁用时样式不正确问题 
- 【Style】
    - DatePicker 面板弹出位置如果在输入框上方，为了方便快速切换月份，日期面板周数固定为 6 周 

#### 🎉 1.18.0 (2021-03-17)
- 【Fix】
  - 修复 Select 多选受控时，未绑定 onChange 函数，点击 tag 上的 x，依然能删除选中的问题 
  - 修复 InputNumber 受控使用时，输入值超出 max 后触发 onNumberChange 问题 
  - 修复 Select 禁用时点击或通过 tab 按钮可以选中问题
- 【Style】
  - Select clear icon 增加 flex-shrink，解决设置 mulitple+showClear，在某些情况下鼠标hover时长度抖动的问题 
- 【Chore】
  - 更新 Table 组件类型定义文件 ，添加 children 到 column

#### 🎉 1.18.0-beta.0 (2021-03-12)
- 【Feature】
  - Select ref 新增method： clearInput 清空Input框、selectAll 全选、deselectAll 取消全选
  - Steps组件改版，新增带连接线与导航类型 
  - Upload组件支持onRetry，onOpenFileDialog与onError时返回原生xhr对象 
  - Tree 组件支持 leafOnly 属性
  - SideSheet 新增keepDOM api
  - Modal 新增 fullScreen api
- 【Fix】
  - 修复 Tree 组件使用 loadedKeys 时的报错

#### 🎉 1.17.0 (2021-03-05)
- 【Feature】
  - 新增 `dislike_thumb`、`unlink` 图标
- 【Fix】
  - 修复 Transfer 导出的 sourcePanelProps 类型声明缺少 selectedItems 
  - 修复 Upload 组件 renderFileItem 参数与声明不一致 
  - 修复 SideSheet closeOnEsc 只有获得焦点才生效的问题
  - 修复 scan 图标填充颜色问题
- 【Docs】
  - 升级官网 live demo 编辑器，增加标签补全、语法提示等

#### 🎉 1.17.0-beta.0 (2021-02-26)
- 【New Component】
  - 新增 Space 组件
- 【Feature】
  - DatePicker 新增小尺寸 
  - Navigation 支持禁用导航栏 
  - 新增葡萄牙语-巴西（pt-BR）语言包 
  - 新增支持 Descriptions JSX写法 
- 【Fix】
  - 修复 Table rowSelection 受控模式下 resizable 使用有问题 
  - 修复 Input suffix icon 与 clear icon 重叠问题 
  - 修复 ArrayField无法remove的问题，受影响版本 1.16.0-beta - 1.16.3 
  - 修复 Tooltip 图标更新导致的样式问题 
  - 修复 Avatar 被Dropdown、Popover等组件包裹时无法正确展示浮层的问题 
  - 修复 Tabs 在 children 为空的 case 下报错的问题 
- 【Style】
  - Navigation 新增 press 状态，选中 hover 等状态 
  - 修复 Table 设置 bordered 属性后，在无数据情况下缺少右边框问题 
  - 移除TimePicker 在俄罗斯语、泰语、土耳其语、越南语时的时分秒文本展示，即仅保留数字不保留单位
- 【Docs】
  - 修复文档 Input type 与类型定义文件不一致问题，type boolean => string，默认值 false => text

#### 🎉 1.16.0 (2021-02-20)
- 【Fix】
  - Timeline组件，children不合规时报错 
  - 修复 DatePicker 动态禁用日期报错 
  - 修复1.16.0-beta版本引入的Radio mode=advanced模式不可用的问题 
- 【Style】
  - 修复 Modal 没有 title 但有 header 时的样式 
- 【Chore】
  - 锁定svgo版本（v1.2.2）、svgo-loader版本

#### 🎉 1.16.0-beta.0 (2021-02-05)
- 【Feature】
  - Select onExceed增加Option作为入参 
  - Dropdown 新增icon、iconType API，更便捷地配置图标 
  - Radio 新增 addonStyle、addonClassName 
  - DatePicker 新增 onClear API，点击清除按钮时触发此回调
  - AutoComplete新增emptyContent与autoFocus API 
  - Modal 新增 afterClose 回调，在动画结束后执行
  - Timeline 新增 dataSource API，支持以数组形式传入 
  - Cascader 支持 onChangeWithObject 
  - Breadcrumb.Item 
    - 支持设置 noLink 去除 hover 和 active 的效果 
    - 支持设置子级的 separator 覆盖父级
- 【Fix】
  - 修复Select 开启虚拟化后，需要点击两次才能选中Option的问题 
  - 修复v1.15版本Form.Upload的受控场景下传入fileList为undefined报错情况
  - 修复 Modal closeOnEsc 必须获取焦点才能退出的问题 
  - 修复 多个 Tabs 情景滚动时，目标 tabs 不正确的问题
  - Table 
    - 修复 sortOrder 失效以及 dataSource 更新后排序失效问题 
    - 修复虚拟化列表在无固定列时表头无法与列对齐问题 
  - DatePicker
    - 修复 minuteStep 步长较大时第二个时间选择器无法使用问题 
    - 修复 needConfirm 不能使用输入框更改选中日期问题 
- 【Perf】
  - Cascader/TreeSelect/Tree单选 点击已选项始终触发onSelect  
- 【Style】
  - 修复 Slider 点击按钮时 border 会向下偏移 1px 以及 box-shadow 不正确问题 
  - 修正Cascader在RTL时insetLabel间距不正确的问题
  - Modal 优化没有title时的样式 
- 【Chore】
  - Cascader Data.value PropTypes 的校验对齐 d.ts 声明 
  - 更新 DateInput / Cascader 类型声明，补充回调函数的入参
  - 修复 BaseForm autoScrollToError 类型报错问题
#### 🎉 1.15.0 (2021-01-29)

- 【Fix】
    - AutoComplete 在失焦情况下自动展开后选项 
    - Upload 组件受控模式未按照 fileList 渲染 
    - 修复 Tree 树形组件，onLoad 和搜索一起使用时，展开逻辑的问题  
    - 修复Select autoFocus时，直接点击外部失焦未触发onBlur事件的问题 
    - 修复 Table 函数式组件 rowSelection 在使用字面量方式时选择失效问题 
- 【Style】
    - 解决Form.Section未引用css变量，在暗色模式下显示不正常的问题
    - Description增加显式line-height声明，防止父级设置了line-height时被继承
- 【Chore】
    - 更新 Form autoScrollToError 类型定义，补充 object 类型

#### 🎉 1.15.0-beta.0 (2021-01-24)

- 【Feat】
    - Cascader级联菜单`onListScroll`监听功能实现，以实现下拉分页等 
    - Form Field组件props增加`fieldStyle`，允许定义整个field区块的内联样式 
    - Select、Cascader、TreeSelect增加`arrowIcon` API，允许自定义右侧下拉箭头Icon 
    - 对齐具有`triggerRender` API的各组件（AutoComplete、Cascader、DatePicker、Select、TimePicker、TreeSelect）入参 
- 【Fix】
  - 修复Form 在使用wrapperCol、labelCol时，声明labelAlign无效的问题 
  - 修复Form submit/getValues/validate时，数组路径下的纯数字field如果超出了JS数组边界，获取的values中，key会被清掉的问题 
  - 修复 DatePicker 可以通过 Input 框选中禁用日期的问题
  - 修复TreeSelect在treeData是空数组，value是[""]的时报错 
  - 修复Tabs在type='button'/'card'模式下，extra内容与tabs-bar未在垂直方向对齐的问题 
  - 修复Tabs动画结束后依然保留有transform属性，导致在某些场景子级元素下z-index失效的问题 
- 【Style】
  - **Body font-family增加`Inter`字体作为优先选项** 
  - **Modal 默认增加边框阴影样式** 
  - **表单中各类Radio、Checkbox与Form Label间距调整** 
  - Tabs去除在type='line'时，第一个Tab bar的padding-left（4px=>0px），更便于与其他Title级别元素实现左对齐 
- 【Docs】
  - Table 组件新增 📚 Semi Table FAQ & 自查手册
  - 增加 Typography.Title 支持省略的 Tooltip 内容自定义的示例 
- 【Chore】
  - 更新 Typography dts，extends HTMLParagraphElement、HTMLSpanElement、HTMLHeadingElement相关属性 

#### 🎉 1.14.0 (2021-01-15)

- 【Fix】
  - 修复火狐浏览器下 Empty 组件的插画未居中的问题 
  - 修复 classnames 包没有声明在组件库包的依赖 (dep & devDep & peerDep) 中的问题
  - 修复Tooltip 的 autoAdjustOverflow 定位问题 
- 【Docs】
  - Modal 文档增加 content 这个 api 的说明 
  - 补充关于create-react-app创建工程接入Semi的说明文档

#### 🎉 1.14.0-beta.0 (2021-01-10)

- 【Feat】
    - AutoComplete 组件添加 validateStatus 属性 
- 【Fix】
    - 修复 Cascader 受控 + 动态加载数据时展示状态的问题
    - 修复 Form.AutoComplete 的内嵌 label 未展示问题
- 【Style】
    - 修复暗色模式下 color-info 系列颜色变量丢失的问题

#### 🎉 1.13.0 (2021-01-04)

- 【Fix】
  - 修复 Navigation 在 SSR 场景下初始化数据时机不正确问题，统一将数据的初始化操作由 componentDidMount => constructor 函数。
- 【Chore】
  - 更新 Checkbox dts 文件中 CheckEvent 接口参数类型，由可选 => 必选
  - 完善 Descriptions dts 文件中 data 参数的类型定义
  - 导出 Form dts 文件中 Field 类型定义 和 Transfer 组件 Item 的类型定义

#### 🎉 1.13.0-beta.0 (2020-12-25)

- 【Feat】
    - DatePicker 
        - 支持 dropdownClassName 和 dropdownStyle
        - 支持通过 autoSwitchDate 配置通过面板上方左右按钮、下拉菜单更改年月时，不会自动切换日期
    - Table 支持使用 renderPagination 自定义分页器
    - Empty
        - 新增 idle 插画
        - 增加暗色模式配套插画，并支持通过 darkModeImage 传入暗色模式下需要使用的插画，以更好地适配暗色模式
    - 新增若干icon，详见 Icon 文档
-   【Fix】
    - 修复 Anchor 在 SSR 场景下 anchorID 失效导致当前 Link 没有高亮显示问题
    - 修复 Tree 的 doubleClick 事件失效的问题
    - 修复 Upload 如果 file 不在 fileList 报错的问题
    - 修复 Tabs 使用单个 TabPane 和 keepDOM=\{false\} 的情况下报错的问题
- 【Style】
    - Tooltip 文本颜色及浮层颜色修改，以更好地适配暗色模式
    - Checkbox 对checked checkbox增加相应的className
- 【Chore】
    - 更新 Checkbox dts， 完善 onChange 入参 e 的类型
    - 更新 DatePicker dts，增加 spacing
- 【Docs】
    - DatePicker 新增关闭时间列表无限循环示例

#### 🎉 1.12.0 (2020-12-18)

-   【Fix】
    - 修复 Cascader Trigger 控制台抛 value required 的 warning
    - 修复BreadCrumbItem的PropTypes校验异常问题
    - 修复Tree组件doubleClick无效的问题

#### 🎉 1.12.0-beta.0 (2020-12-11)

-   【New Component】
    -   新增 SplitButtonGroup 组件 
-   【Feature】
    -   Collapse 支持设置展开/收起按钮位置 
    -   Descriptions 提供一个 hidden 的字段来隐藏行 
    -   Dropdown 组件增加属性 menu，使用 JSON 格式来配置内容
-   【Perf】
    -   Tree 虚拟化勾选卡顿问题优化 
-   【Fix】
    -   同时动态更新 Tree 的 treeData 和 expandedKeys 时数据未被正常更新 
    -   Cascader 自定义的 TriggerRender 未传出 onInputChange
-   【Style】
    -   **替换了出错含义的默认 Icon，从「clear」替换为「alert-circle」（x => !），涉及组件 Form、Toast、Notification、Banner、Modal、Upload** 
    -   修正 disabled Select focus 态的 border 样式
    -   修正 Table header 在深/浅色模式下显示不对称 
-   【Chore】
    -   规范内部代码文件名，将含有 React 内容的 .js => .jsx（仅做重命名，export 未变，对外部使用无影响）

#### 🎉 1.11.0 (2020-12-04)

-   【Fix】
    -   Upload 组件在多文件上传时，保留符合 accept 格式文件继续上传 
    -   BreadcrumbItem 的 icon 属性更新 d.ts，保持 ts 类型与 protoType 类型一致 
-   【Style】
    -   补充拖拽型 Upload disabled 态的样式；修正拖拽型 Upload 拖拽松手后拖拽区仍高亮显示的问题

#### 🎉 1.11.0-beta.0 (2020-11-27)

-   【Feature】
    -   新增多语言包：印尼语、俄语、越南语、马来语、泰语、土耳其语 
    -   Upload onRemove 增加 currentFileItem 入参
    -   Transfer
        -   新增 draggable 拖拽排序功能 
        -   新增 renderSourcePanel、renderSelectedPanel 功能，允许完全自定义组件渲染结构 
    -   Select
        -   新增 onListScroll 滚动回调 
        -   ref 新增 focus()方法 
    -   Avatar 新增 size `default`（40x40）
    -   Grid 支持 gutter 传入数组，同时定义垂直、水平间隔 
    -   Tabs 支持 small、medium、large 尺寸 
    -   TreeSelect searchRender、search、close 方法
    -   Typography link 支持配合 disabled 使用
-   【Fix】
    -   修复 defaultExpandAllRowKeys 与 groupBy 同时使用时未展开所有行 
    -   修复 点击 group 的折叠按钮 onExpand 和 onExpandedRowsChange 未正确传递参数问题 
    -   修复 Table empty 和 pagination d.ts 类型定义不准确问题 
    -   Tree/TreeSelect 修复 renderFullLabel 未传出 style 导致无法开启虚拟化的问题
-   【Perf】
    -   Table
        -   改善虚拟化列表的卡顿问题 
        -   改善较大数据场景下点击选择框时的卡顿问题 
-   【Style】
    -   **TextArea 的 maxCount 字数限制由多行输入框下方 => 内部**
    -   **新增 --color-info 变量，如果使用了自定义主题需要重新发布新版本**
    -   增强 .semi-light-scrollbar 的使用场景，所有子元素均生效

#### 🎉 1.10.0 (2020-11-20)

-   【Fix】
    -   升级 Form rules 校验依赖的 async-validator 版本（3.2.4 => 3.5.0），修复 deep-rules 写法下返回的校验结果不正确的问题 
    -   修复 Upload 的 afterUpload 入参 fileList 在某些情况下包含文件数不全的问题 
    -   Select
        -   修复 Select 受控模式下，value 由有值变为 undefined 时未重新渲染的问题 
        -   修复 Select filter 和 defaultOpen 同时使用时未渲染选择项问题
    -   修复 Avatar size=extra-extra-small 时，overlap 不生效问题 
    -   修复 InputNumber keepFocus 在受控场景下 value 值显示不正常问题 
-   【Perf】
    -   优化 formApi 的 dts，支持泛型传入 @wangqinhong

#### 🎉 1.10.0-beta.0 (2020-11-13)

-   【Feature】
    -   Select 新增 renderOptionItem，高度自定义候选项的渲染 
    -   DatePicker
        -   支持单击选择范围，可以用于周选择、双周选择 
        -   支持 autoFocus API，可以控制输入框聚焦 
    -   InputNumber 支持点击按钮时保持输入框的聚焦状态 
-   【Fix】
    -   修复 Form Field rules 校验规则由无或空数组动态切换至有长度数组如 [{ requried: true }] 时，不起作用的问题 
    -   修复 Form Field 配置 rules，返回校验结果为字符串数组时，未校验通过也触发 onSubmit 而不触发 onSubmitFail 的问题 
    -   修复 DatePicker type=month 时禁用对年不生效问题 
    -   修复 Table 有鼠标场景下 rowSpan 计算错误导致固定列错误滚动问题 

#### 🎉 1.9.0 (2020-11-08)

-   【Feature】
    -   RadioGroup 支持 mode=advanced，允许单选组合取消选中 
-   【Fix】
    -   修复 Tooltip 在 Windows 环境 Edge 浏览器的定位问题 
    -   修复只使用 AutoComplete 未使用 Select 时，在生产环境打包下 Option 样式丢失的问题
    -   修复配合 gar codesandbox 使用时，提示 window getComputedStyle 错误的问题
    -   修复 Select autoFocus 不生效的问题
    -   修复 InputNumber 在点击 up 按钮动态切换 disabled 时，一直触发 onChange 的问题 
        -   **InputNumber 步进器模块的 DOM 结构有所改动（样式不变，Button 标签换成了 span）**

#### 🎉 1.9.0-beta.0 (2020-10-30)

-   【Refactor】
    -   **Spin 优化了 DOM 结构，单独使用的隐藏状态下不再渲染**
-   【Feature】
    -   Form、Field 增加 extraTextPosition 功能 
    -   TreeSelect 支持 outerTopSlot 
    -   Breadcrumb 支持自定义截断个数的 maxItemCount，和 autoCollapse 
    -   Upload 新增 onDrop 回调 
    -   InputNumber 新增 onNumberChange API，用于监听数字是否发生变化 
    -   Anchor 新增 targetOffset API，用户可以设置距离顶部的偏移值 
    -   DatePicker
        -   优化日期选择顺序，允许用户在单选模式下，切换年份或月份更新日期 
        -   支持 range 模式下动态禁止日期 
        -   新增 spacing 配置
    -   InputGroup 支持 DatePicker 
-   【Fix】
    -   修复 Upload 图片墙模式下，无 onPreviewClick 回调的问题
    -   修复 Input mode 动态切换时眼睛按钮的状态问题 
    -   修复 DatePicker format 包含 Hms 时，type 的类型不符合预期问题 
    -   Spin
        -   修复 Spin 嵌套表格时可以点击表格内容问题 
        -   修复 Spin 在卸载时没有 clearTimeout 问题
    -   修复 Popconfirm 在 1.8.x 版本 position 失效的问题
-   【Docs】
    -   DatePicker 更新了文档 disabledDate 参数类型描述，及 disabledTime 的回调入参
-   【Style】
    -   修复 Banner 非全屏模式下左边 icon 高度问题 
    -   Form Field 的 extraText 若传入类型为字符串时，自动应用 font-size:14px, line-height: 20, color: tertiary 的样式；

#### 🎉 1.8.0 (2020-10-23)

-   【Feat】
    -   TreeSelect 支持 optionListStyle API 
-   【Fix】
    -   修复 Table 在过滤器已选择场景下全选逻辑错误的问题（错选为未过滤的全部列）
    -   修复 Table columns.onCell 报错, 提示 can't get style of undefined 
    -   修复 Slider 的 step 不为 1 时不能滑动到 0 的问题 
    -   修复 InputNumber 值达到 min 或 max 时点击按钮还会触发 onChange 事件的问题
    -   修复 TimePicker 中输入框 id 不唯一报错问题
    -   修复 Layout Sider Context.Provider 的 warning
    -   修复 Breadcrumb icon 传入 ReactNode 的报错
    -   修复 Step dts description 属性不能为 ReactNode
    -   修复 Step 当 title 或 description 为 ReactNode 时 hover 提示为 [object Object] 的问题
-   【Style】
    -   InputNumber 值达到 min 或 max 时对应的减少和增加按钮会变成灰色
    -   **TreeSelect/Tree 支持 labelEllipsis，虚拟化状态下默认开启，其余状态默认值统一为 false。并修复 label 不符合预期的自动省略问题。** 详见 
-   【Docs】
    -   对组件 API 列表按照字典序进行排序，提高用户查找效率

#### 🎉 1.8.0-beta.0 (2020-10-16)

-   【Feat】
    -   Tree 支持拖拽（同时使用虚拟化时，暂不支持拖拽）
    -   Cascader 支持异步加载数据
    -   Tree 支持 labelEllipsis，默认开启，如果有特殊的省略需求可以关闭
    -   Upload 增加 onPreviewClick，自定义文件卡片预览的点击操作 
    -   支持国际化 RTL/LTR，适合在多语言场景下切换组件文本的方向 
    -   LocalProvider 新增阿拉伯语支持
-   【Fix】
    -   修复 withField 封装 Functional Component 时会错误 memo 的问题
    -   修复 react-hot-loader 引起的 tabs keepDOM 失效及 breadcrumb 报 warning 的问题
    -   修复 TagGroup showPopover 时提示 map 操作中未传入 key 的 warning 
    -   修复 Upload customRequest onError 传入 status 无效的问题
-   【Perf】
    -   Form 组件 dts 优化：withField dts 添加泛型，导出 formApi 的类型定义
-   【Docs】
    -   补充 Upload 组件 customRequest 自定义请求方法的使用文档
    -   补充 🧾Semi Form FAQ & 自查手册
    -   umd 版本移除代码注释
    -   官网代码实时编辑区，新增展开/收起功能，便于复杂 Demo 的编辑

#### 🎉 1.7.0 (2020-10-10)

-   【Fix】
    -   修复 Resizable Table 表头动态更新的问题
    -   修复 Toast, Notification 静态方法的 dts 返回类型
    -   修复 Step 的 .d.ts 中 不存在 onClick 的问题
-   【Style】

    -   修复 TreeSelect 多选标签的居中对齐

#### 🎉 1.7.0-beta (2020-09-25)

-   【Feat】
    -   Tree，TreeSelect 支持 renderFullLabel ，可以满足 label 各种高度定制化的渲染需求，如父级节点与子级节点勾选逻辑分离 
    -   Semi 支持全局 prefixCls 替换，用户可以根据需求配置前缀名，推荐 SDK 场景下使用，详见
    -   List grid 属性支持 Grid 的 justify, type, align 属性透传 
    -   Typography 增加 success type
-   【Fix】
    -   修复 Form formApi.validate(['a, 'b'']) 手动触发部分校验时，校验结果未根据传入的参数，仍然采用了全量判断的问题 
    -   修复 Form reset 后未能重置 Form.Checkbox 的问题
    -   修复 Tree 组件开启动画时动态删除子节点导致父节点刷新的问题 
    -   修复 Table 表头的全选 checkbox 的展示行为 
-   【Perf】
    -   Tree，TreeSelect
        -   优化 Tree、TreeSelect 组件展开卡顿的问题 
        -   Tree、TreeSelect 支持不传 value 的数据结构，需要保持数据结构一致即或者所有数据都传 value 或者都不传 
-   【Style】
    -   优化 Tree 加载状态的 spin 样式
    -   Select
        -   优化多选时，size='small' / 'large' 不同尺寸下的高度
    -   Tag
        -   对齐所有颜色 Tag 组件的高度（之前 white 时会有所不同），对齐 closable 与否时 Tag 组件的高度

#### 🎉 1.6.0 (2020-09-18)

-   【Fix】
    -   修复 Transfer d.ts onChange 入参类型与实际类型不对的问题 
    -   修复 Slider marks 不包括边界值问题, 修复 Slider vertical-align baseline 导致的高度问题 
    -   修复 Table 选择按钮的高度问题，按钮的 vertical-align 由默认值修改为 bottom 
-   【Docs】
    -   增加相关物料展示，便于使用者更方便查找与组件相关的物料资源

#### 🎉 1.6.0-beta (2020-09-11)

-   【Feat】
    -   Select 新增 innerTopSlot 和 outerTopSlot API
    -   Tag 新增头像 Tag，包括 avatarSrc 和 avatarShape API 
    -   description data 支持 function 类型 
    -   Tree, treeSelect 支持 renderLabel 自定义函数 
    -   Dropdown.Menu 支持 props 透传，Dropdown.Item 支持 onContextMenu 事件绑定 
-   【Fix】
    -   修复 InputGroup children 有 null 节点时报错
    -   修复 Transfer 输入过滤内容时点击清除出现的报错
    -   修复 Pagination 的 pageSize 动态改变时 Select 选中值未跟随改变 
    -   修复 Typography 截断没有溢出仍旧显示了 tooltip 
    -   修复 Table 多列过滤时取交集的结果有误的 bug 
    -   修复 RadioGroup、CheckboxGroup options 用法与 Form 一起使用时，在 production 环境下由于循环依赖引起的报错问题 
    -   修复 CheckboxGroup jsx 声明 children 用法时，disabled 未生效的问题 
    -   修复 DatePicker 组件在 needConfirm 条件下支持输入日期导致不一致的问题 
-   【Style】
    -   Modal title 的 Icon 与文字的对齐方式由 center => flex-start 
    -   修复 List 卡片式空状态居中的样式
    -   Tree, TreeSelect
        -   virtualize 开启后默认 Label 过长文本省略 
        -   expandAction="click" 时交互更新为点击叶子节点可以 clickToHide
    -   Table header 的 sorter 和 filter icon，它们的 margin left 由 8px => 4px 

#### 🎉 1.5.0 (2020-09-04)

-   【Fix】
-   修复 Form 动态切换 disabled 属性时，Form.Switch 禁用属性并未随之更新的问题 
-   修复 Tree 在开启虚拟化后，搜索状态点击选项后第一次无效的问题 
-   修复 Typography ellipsis 响应状态下无限压缩后堆栈溢出的问题
-   修复 Modal, Notification, Toast 组件中的静态属性 dts 丢失的问题
-   【Perf】
    -   移除 TimePicker, DatePicker, Table 引入的全量 lodash，优化打包体积
    -   移除 UMD 包中的 sourcemap

#### 🎉 1.5.0-beta.0 (2020-08-31)

-   【Feat】
    -   Calendar 日视图支持显示多日 
    -   Avatar
        -   支持 imgAttr 透传 img 标签的 html 属性 
        -   增加头像截断功能，新增 overlapFrom，maxCount， renderMore API 
    -   TreeSelect 支持了 clickToHide，单选模式有效，**原搜索状态下默认不会自动收起下拉菜单的交互调整为自动收起** 
    -   Upload
        -   limit 设为 1，已上传一个文件后，再次选择文件上传时，自动替换当前文件 
        -   支持自定义 request 方法
    -   InputNumber 支持悬浮展示按钮；按住 shift 点击按钮增减较大步长 
-   【Style】
    -   InputNumber 的外部按钮默认高度由 30px => 32px，其他 size 情况下也增加 2px
-   【Fix】
-   修复 InputNumber onChange 函数丢失第二个参数问题
-   修复 TextArea onResize .d.ts 类型定义缺失问题
-   修复 Table virtualized.onScroll .d.ts 类型定义错误问题
-   【Docs】
-   补充 formApi.validate() 触发部分 field 校验的使用文档

#### 🎉 1.4.0 (2020-08-21)

-   【Style】
-   修复 datePicker range 模式下的 hover 颜色值为 blue-0
-   【Fix】
-   Tree 修复 label 为 ReactNode 时的 missing key warning 及动画的卡顿问题 
-   修复 autoComplete getPopupContainer 属性不生效的问题
-   修复 InputGroup 的子组件 onFocus, onBlur 被覆盖的问题 
-   修复 Upload 和 Select 部分 dts 属性的错误；从 index.d.ts 中移除了 BreadcrumbItem 的导出

#### 🎉 1.4.0-beta.0 (2020-08-14)

-   【Feat】
    -   css 编译产物增加压缩后版本，semi.min.css。另外对 css 产物的 cdn 引用路径作了修改
    -   DatePicker 支持自定义渲染日期内容和日期单元格 
    -   TreeSelect 支持 onVisibleChange 
    -   Tree 支持 disableStrictly 
    -   Collapse 支持 motion 参数
    -   Pagination 支持动态响应 pageSize 变化
-   【Style】
    -   Table thead 边界宽度 borderWidth 由 1px => 2px
    -   DatePicker 当日单元格增加灰背景色，使其更明显突出
-   【Fix】
    -   修复了 Form.TimePicker 点击清空按钮后未触发 validator 在 1.3 版本中复现的问题
    -   修改了 DatePicker 和 TimePicker onBlur 事件的触发时机，input blur => panel close 
    -   修复 Tree 组件 label 中的所有 icon 都会加上右 margin 的 css 选择器的样式问题
-   【Docs】
    -   更新 Table 组件的文档，修正部分 props 默认值描述错误的问题

#### 🎉 1.3.0 (2020-08-07)

-   【New Component】
-   新增 Anchor 组件 
-   【Feat】
    -   Semi 官方图标库增加线型图标，需要通过自定义 SVG 图标的方式使用
-   【Style】
-   拖拽型 Upload 组件 SubText 对齐方式 靠左 => 居中
-   SideSheet 的关闭按钮与标题的对齐方式 居中对齐 => flex-start
-   【Fix】
    -   修复 Input 组件 size 语法提示错误问题（The type of the property size of the input component is never）
    -   修复 Upload 图片墙模式下，上传失败/校验失败时的状态 icon 展示不正确问题
    -   修复 TextArea autosize 模式传入 ref 时报错的问题 
-   【Perf】
    -   将 Table 依赖的 lodash 替换为 lodash-es（之前存在混用情况），去掉 Avatar 引入的全量 lodash，优化打包体积
    -   Breadcrumb routes 的使用方式支持传入自定义 key

#### 🎉 1.3.0-beta.0 (2020-07-31)

-   【Feat】
    -   提供 UMD 版本构建产物 
    -   `Input` 提供 password 模式 
    -   `SideSheet` 支持 footer，**涉及样式上 padding，margin 等多处调整** 
    -   `Upload` 当 listType 为 picture 图片墙模式时，增加 prompt、promptPosition 的支持，使用对齐普通列表模式 
-   【Fix】
    -   修复 `Tree` TriggerRender 多选模式下 value 值始终为空数组的问题
-   【Perf】
    -   修复 sass-loader 9.x scss 变量未字符串化的 warning 

#### 🎉 1.2.2 (2020-07-26)

-   【Perf】
    -   优化 `Icon` 中的 svg 动画为 css 动画，修复当页面引入有 svg 动画的 `Icon` 或者全量引入（默认）时页面不断重绘的问题。如有单独使用 loading `Icon` 的需要添加 css 动画
    -   `OverflowList` 不再对渲染函数的更新做状态重置，如需重置可以通过更新 key 刷新组件
    -   优化 `Typography` ellipsis 模式下文本动态更新时进行状态重置
-   【Fix】
    -   修复 `Button` height css 被移除，导致父级为 `display:flex` 时，高度不对的问题
    -   修复 `Descriptions` row 不同尺寸下的样式丢失问题

#### 🎉 1.2.0-beta.0 (2020-07-17)

-   【Feat】
    -   命令式的 Modal 组件支持配合 configProvider 使用 
    -   Notification, Toast 支持 useHooks 的用法
    -   Typography 支持 tertiary, quaternary 的 type
-   【Style】
    -   color-text-3 透明度从 0.2 调整为 0.35
    -   Checkbox border 透明度从 0.08 调整为 0.2
    -   提供自定义的 scroll-bar 样式类名，通过 .semi-light-scrollbar 使用
-   【Fix】
    -   fix modal 覆盖 body 的 overflow 样式的问题
    -   修复插鼠标时，固定头部的表格最后一列可能无法对齐的问题
    -   修复 Select 多选情况下 filter 为 true，搜索无数据时按回车报错的问题 

#### 🎉 1.1.0 (2020-07-14)

-   【Fix】
    -   修复 Form.TimePicker 点击清空按钮后没有触发 validator 判断的问题 

#### 🎉 1.1.0-beta.0 (2020-07-03)

-   【New Component】
    -   新增 `OverflowList` 组件
-   【Feat】
    -   `Tabs` 组件折叠功能支持 
    -   `TreeSelect` 组件支持 outerBottomSlot 
    -   `Modal` 非命令式调用支持设置 title 的 icon 
    -   `DatePicker` 支持透传 TimePickerOpts 参数给 TimePicker 
    -   `Table` 合并表头功能支持 
    -   `Table` 支持自定义筛选浮层每一项的渲染方式 
    -   `Table` 支持传入默认的页码 
    -   `Table` 支持切页时自动滚到第一行位置 
    -   `Upload` 增加 onClear 回调 
    -   `Form` `Field` 支持通过 pure 开关，只接管数据流，不插入 Label、ErrorMessage 及相关 DOM 结构 
-   【Fix】
    -   修复 `Tree` 受控的状态过滤搜索值动画出现的闪烁异常等问题 
    -   修复 `Table` 表头较多时数据为空的文案不能正确显示在中间的位置的问题 
    -   修复 `Table` 切页时 sorter 配置不正确的问题 
    -   修复 `Table` 在 rowSelection 为 false 时依旧显示选择列的问题 
    -   修复 `Tooltip` 使用 configProvider 的 getPopupContainer 无效的问题 
-   【Performance】
    -   优化 withField HOC 的 displayName，方便在 react devtool 中定位相关元素 
-   【Style】
    -   `Modal` 命令式 content 与 header 增加 8px 的 spacing
    -   修复 `Banner` 关闭按钮的居中对齐问题

#### 🎉 1.0.0 (2020-06-24)

-   【Fix】
    -   修复 `Tree` 受控的状态过滤搜索值动画出现的闪烁异常等问题 
    -   **`Icon` 按需加载引入路径变更**
-   【Feat】
    -   `List` 组件 renderItem 功能支持自定义 key 
-   【Style】
    -   Tertiary `Button` light 及 borderless 文本颜色由 `color-tertiary` 改为 `color-text-2`

#### 🎉 1.0.0 - beta.0 (2020-06-12)

-   【Fix】
    -   修复 `Cascader` 受控的状态下清空 value 没有回到 placeholder 的问题
    -   修复 `Tree` 的 expandedKeys 手动置空后消失的问题 
    -   修复 `Table` 在开启虚拟化时无法展示空状态的问题
    -   修复 `Form.Upload` 在 uploadTrigger 为 custom 时，选中文件后不会触发 onChange，未同步相应文件列表到 formState 中的问题 
-   【Performance】
    -   优化 `Form.Select` 开启 onChangeWithObject 时，外部调用 formApi.getValues、setValues 容易导致卡顿的问题
    -   优化 `Spin` 的 svg 动画在渲染数据较多时会出现卡顿的问题 
-   【Feat】
    -   **`Empty` 的插画路径变更，同时支持主题换色，兼容暗色模式**
    -   **`Icon` 支持按需加载
    -   `Modal` 支持 keepDOM, lazyRender 默认行为仍保持为销毁 
    -   `Paragraph` 组件支持文字少于 n 行的时候，不显示展开折叠文字 
    -   `ConfigProvider` 支持 getPopupContainer
    -   `Table` emptySlot 外层由 p 修改为 div 组件
-   【Style】
    -   `Typography` link 默认改为无下划线样式，配合 underline 可以在 hover/active 态显示下划线
    -   **`Tab` card 模式下 extra 的内容居中撑高卡片，涉及 DOM 结构调整**
    -   修复在 `Timeline` 中使用 Radio 组件作为 dot 时的样式问题

#### 🎉 1.0.0 - alpha.0 (2020-05-29)

-   【API 调整】
    -   Banner 移除了 `target` 属性，请直接使用 JSX 的写法引入
    -   Breadcrumb 移除了 `BreadcrumbItem` 的用法，请使用 `Breadcrumb.Item` 替代
    -   DatePicker `onChange` 回调的两个入参次序对调，由 `string`，`Date` 变更为 `Date`，`string`，若需要还原，请使用 `onChangeWithDateFirst={false}`
    -   Input, InputNumber 移除了 `clearable` 属性，DatePicker, TimePicker 移除了 `allowClear` 属性，请使用 `showClear` 替代
    -   Select 正式废弃`labelInValue`，请使用 `onChangeWithObject`（0.23.0 开始提供）替换
    -   Select 正式废弃`optionLabelProp`，请使用 `renderSelectedItem`（0.23.0 开始提供）自定义函数替代
    -   TextArea 移除了 `onPressEnter` 属性，请使用 `onEnterPress` 替代
    -   Tree 移除了 `labelInValue` 属性，请使用 `onChangeWithObject` 替代
    -   TreeSelect 移除了 `valueInArray` 属性，请通过 `onChange` 或 `onChangeWithObject` 获取相关节点属性
    -   TreeSelect 移除了 `allowSearchClear` 属性，请使用 `showSearchClear` 替代
    -   Upload 废除了`onXhrFinish` ，新增定制程度更高的 `afterUpload` 代替，二者功能类似，但需 return 的 value 结构不对等，为 breaking change
    -   Upload 对 `beforeUpload` 使用方式修改，与 `afterUpload` 对齐。与 0.x 版本入参，以及 return 的 value 结构均不对等，为 breaking change，注意与 0.x 版本相比，校验失败的文件依然会存在于 fileList 中，不会被自动删除。
    -   具有 `onBlur`, `onFocus` 方法的组件入参统一为 Function(e: Event) 
-   【Refactor】
    -   Banner：DOM 结构/类名/api 调整，样式更新
        -   废弃 `target` 属性
        -   `type` 属性的 default 改为 info ，默认值为 info
        -   新增：`fullMode`, `title`, `description`, `icon`, `closeIcon`, `bordered`
-   【Feat】
    -   Avatar
        -   `size` 新增尺寸：extra-extra-small 20px， 原 small 尺寸大小调整为 24px
    -   Calendar
        -   Event Object 要求必传 `key` 来控制事件的更新与重绘 
        -   新增: `dateGridRender` 允许自定义单元格/列内容及样式 
    -   Collapsible
        -   新增: `collapseHeight` 支持自定义折叠后的高度
    -   Empty
        -   新增: `title`
        -   原 `description` 样式调整为 14px 号字体，次级字体色
    -   Form
        -   Form Props 增加 `showValidateIcon` ，错误信息前自动展示红色 X icon，默认为 true
        -   Form 增加 Form.Upload 模块
        -   Form 增加 Form.Section 模块，用于在布局上对 Fields 进行快速分组
        -   Field Props 增加
            -   `helpText` 放置提示信息（与校验结果共用同一区块展示，两者均有值时，优先展示校验结果）
            -   `extraText` 用于放置额外的提示信息，常显且不会被校验结果覆盖
        -   错误信息支持 reactNode（0.x 版本中在 validate 或者 rules 中 return reactNode 会被认为校验通过，1.0 版本后返回 reactNode 会与返回 string 一样，被视为校验失败）
    -   InputNumber
        -   新增: `hideButtons`用于控制隐藏“增/减”按钮，**废弃原先的 suffix={null} 的方式**。
    -   List
        -   新增: `onRightClick` ，`onClick` 响应相应的鼠标事件 
    -   Modal
        -   新增 `closeOnEsc` 支持通过键盘 Esc 来关闭弹窗，增加 `closeIcon` 支持自定义的关闭按钮
        -   新增 `size` 支持 small, medium, large 及 full-width
    -   SideSheet
        -   新增：`headerStyle`, `afterVisibleChange`, `closeOnEsc`
    -   Spin
        -   新增: `childStyle`
    -   Table
        -   新增 `"middle"`，`"small"` 两种信息密度
    -   Tabs
        -   新增 `keepDOM` ，支持 jsx 的写法中销毁非 active 的面板 
        -   新增 `tabPosition` 支持 tab 在顶部或者左侧 ('left', 'top'),
        -   新增 `lazyRender` 支持 tabPane 的懒加载 
    -   Toast / Notification
        -   新增: `theme` ('light', 'normal') 支持带背景色的通知消息
    -   Tree
        -   新增 `loadData`, `loadedKeys`, `isLeaf` 支持动态加载数据
        -   新增: `onChangeWithObject` 支持返回带有节点信息的 object 为 onChange 的入参
        -   `searchRender` 支持传入 false 来隐藏搜索框
    -   TreeSelect
        -   新增：`onChangeWithObject` 支持返回带有节点信息的 object 为 onChange 的入参
        -   新增：`showClear` 支持清空选项
    -   Typography
        -   copyable 配置新增 `copyTip`，支持自定义 tooltip 内的提示复制文案
    -   Progress
        -   新增：`orbitStroke` 允许自定义轨道颜色
    -   Skeleton
        -   Skeleton.Avatar 新增: `size`，支持 Avatar 组件的相应尺寸 
    -   Upload
        -   增加`renderFileItem`自定义文件卡片的渲染结构，增加`itemStyle`快捷改变 fileItem 的内联样式
        -   增加`showClear`、`showRetry`，增加手动重试机制，增加文件列表快速清空
        -   增加`transformFile`，支持在选择文件后，文件上传前转换文件
        -   增加`onChange`回调，文件上传状态改变的回调，上传中，失败，完成都会调用该回调
        -   增加`validateMessage`、`validateStatus` 可自定义 Upload 整体的校验状态、校验信息展示
        -   选择文件后，文件大小不合法的文件也会被展示在 fileList 中（标红展示但不会激活上传），更清晰地感知具体哪些文件不合法，同理对在`beforeUpload`中设定不上传的文件，也会被展示在 fileList 中
        -   增加 `afterUpload`，支持在上传完成后，更新 fileList 中对应文件状态，支持自动移除文件
        -   修复 `onExceed` 第二个参数不对的问题
        -   支持受控的 `fileList`
        -   拖拽型 Upload 支持传入 `children` 更高自由度地自定义拖拽区内容
        -   照片墙模式下，上传文件数达到 `limit` 时，自动隐藏+ Trigger
-   【Performance】
    -   TextArea 移除了 componentWillReceiveProps 的生命周期函数 
    -   Modal 移除了 componentWillMount 的生命周期函数 
-   【Style】
    -   Breadcrumb
        -   文本颜色调整
        -   tooltip 的默认位置改为 top
        -   调整类名结构，图标文字对齐
    -   Button
        -   **去掉默认的 margin-right**
        -   不同尺寸按钮去掉固定高度，增加对应于不同 size 的 padding
        -   **图标按钮默认主题与按钮主题保持一致(theme="light")**
        -   **不再推荐使用 IconButton，仍然保留导出**
    -   Checkbox
        -   调整 CheckboxGroup 中 Checkbox 的 margin-bottom：16px => 12px，移除 last-of-type 的 margin-bottom
    -   Collapse
        -   增加 header 区域的 hover, active 效果
    -   Empty
        -   插画更新
    -   Form
        -   **错误信息展示时自动添加 ❌ icon（如不需要，可以通过 showValidateIcon 关闭）**
    -   **Input prefix/suffix/addonBefore/addonAfter 样式调整** 
        -   prefix/suffix 传入字符串时不再处理为 Icon，直接映射成字符串；Icon 需要通过 React.Node 的形式传入
        -   传入自定义 reactNode 时不会有 padding，只有 String、Icon 时有自带的 padding
    -   InputNumber
        -   **“上/下”按钮调整到 Input 右侧**
    -   Modal
        -   调整头部及标题样式，声明式和命令式样式统一
    -   Popover / Tooltip
        -   **arrowPointAtCenter 的默认值改为 true**
    -   Progress
        -   LineProgress 条形进度条百分比文字颜色固定为 color-text-0 黑色，不再与进度条填充色保持一致
    -   Pagination
        -   增加 margin-block-start: 0，margin-block-end: 0 的样式声明
    -   Radio
        -   调整 RadioGroup（horizontal / vertical）中 Radio 的 margin-right / margin-bottom: 16px => 12px， 移除 last-of-type 的 margin-right / margin-bottom
        -   horizontal 的 RadioGroup display 调整为 inline-block
    -   Select
        -   调整 clear icon 的显示逻辑，只在展开或者 hover 时显示，且与 arrow icon 共用同一展示区域
    -   SideSheet
        -   支持百分比的宽高设置（涉及 DOM 结构调整）
        -   调整了头部及标题的样式
        -   调整 size='small' 的尺寸 400px => 448px
    -   Steps
        -   调整状态 icon 大小，32px => 24px，其他样式微调，增加 waring status
    -   Spin
        -   普通使用时原 DOM 尺寸 0 x 0 => 对应尺寸的 width, height
    -   Tree
        -   取消最小宽度 minWidth 的限制
    -   TreeSelect
        -   取消默认的最大高度 maxHeight 的限制
    -   Table
        -   **表头背景色改为白色**
    -   Tag
        -   light type 文本颜色加深，改为 8 号色
        -   **去掉默认自带 8px 的 margin-bottom、margin-right**
    -   Typography
        -   Typography.Title 默认 font-weight 为 700
        -   strong 属性 font-weight 600 => 700

#### 🎉 0.37.0 (2020-05-22)

-   【Fix】
    -   修复 `Form` register/ remounted 时只消费了 allowEmpty 没有消费 allowEmptyString 的问题
    -   修复 `Casacader` 使用 triggerRender 时报错 
    -   修复 `TextArea` 受控状态无法输入中文的问题 
    -   修复 `Nav.Item` 点击时的卡顿问题 
    -   修复虚拟化固定列表格宽度为百分比时失效的问题 
    -   修复虚拟化固定列表格 `itemSize` 值过小时行显示错乱的问题 
-   【Perf】
    -   `Select` 支持虚拟化，优化大数据量场景下的性能 
    -   优化虚拟化表格渲染机制，以提升在数据高频变动时的体验 

#### 🎉 0.37.0-beta.0 (2020-05-15)

-   【Feat】
    -   `TextArea` 支持 onResize 回调 
    -   `Modal` 支持 destroyAll 
    -   `Table` 虚拟化支持数据分组 
    -   `Table` 支持获取当前页数据
-   【Fix】
    -   修复 `Textarea` 在 tabs 的第二个 tabPane 没有 autosize 的问题 
    -   修复 `Cascader` 打开 google 翻译进行选择会崩溃的问题 
    -   修复 `Table` 虚拟化 itemSize 过小行无法正常展示的问题 
    -   修复 `Table` 虚拟化 Column.width 传入百分比无法正常现实的问题 
    -   修复 `Upload` 接口 4xx/5xx 时触发 onError 后文件依然展示的问题 
-   【Perf】
    -   优化了 `Table` 虚拟化在数据变动频次较高时渲染时的性能问题 

#### 0.36.0 (2020-05-08)

-   【Feat】
    -   Form.Slot 支持单独配置 labelPosition
    -   Select defaultActiveFirstOption 支持在远程搜索更新 optionList 后再次消费 
    -   为 semi 内置 icon 的增加统一前缀，防止与 window 中同名变量冲突 
    -   Form 在 `Field` 级别增加 stopValidateWithError 开关，出错后短路后续校验 
-   【Fix】
    -   Form ArrayField
        -   嵌套使用时，setValues 后，第二层的 ArrayField 未更新
        -   ArrayFields 下的某个值设置了 initValue，如果这时候去 setValues + isOverride 的话，那某个值不会被 set 成功 
        -   移除某行后，留下一个 null 的问题 
    -   解决 Table 固定列+虚拟化横向滚动轴无法复位的问题 
    -   修复 `Progress` percent 动态由 N -> 99.98 时，由于动画数字会被渲染成 100 的问题 
    -   修复 `Cascader` 受控模式下设置 value 为空值无效而无法清空的问题
    -   修复 `Cascader` 某一层的 children 为空数组时报错
    -   修复 `DatePicker` 时间选择时更新会慢一步的问题 
-   【Style】
    -   Form labelPosition=left 时的 switch，rating 对齐问题 
    -   `Form`，调整 `Form.InputGroup` 的上下间距 margin 16 => marign 0 && padding 12，与 `Field` 对齐 
-   【Perf】
    -   `Form` `ArrayField` 关于初始值的行为对齐 Field，既可通过 initValue 设置，也可以在 `Form` props 中 initValues 设置（本次新增）

#### 🎉 0.35.0 (2020-04-17)

-   【New Component】
    -   新增 `Transfer` 组件
-   【Feat】
    -   `Tree`新增
        -   expandAction ，支持 false, click, doubleClick 的展开逻辑 
        -   onRightClick 右键点击事件 
        -   searchRender 支持自定义搜索框 
    -   `Cascader` 新增
        -   onDropDownVisibleChange
        -   支持 showClear 清空选中态
        -   支持选项的 disabled 状态 
        -   支持 onBlur, onFocus 方法
    -   `Rating` 支持自定义字符的大小
    -   `Table` 支持自定义显示展开按钮 
    -   `Table` 支持固定列与数据分组混合使用 
    -   `Navigation` 支持传入 collapseText 以自定义“收起按钮”文案 
    -   `Form` formApi 增加 getValues 
    -   `Form.Slot` 支持 noLabel 设定 
    -   `Form` 支持配置 disabled，为 true 时，内部的 fields 自动继承 disabled 属性 
    -   `AutoComplete` 支持 onFocus、onBlur 
    -   `Form`的 field props 支持 stopValidateWithError，某个 rule 检验失败后不再触发后续 rules 的校验 
-   【Fix】
    -   修复 `Cascader` 收起下拉框闪动的问题 
    -   修复 `Form` 使用数组型 fieldPath（eg：panels[11]].start ）时，校验后再修改值，errors 信息匹配不上的问题 
    -   修复 `Form` 调用 formApi.validate() ，缺少必填信息触发校验，reject 后补充完信息再 validate，可能仍然被 reject 
    -   修复 `DatePicker` 在多选状态下选择不同月份日期时会跳转到第一个选中日期的月份问题 
    -   修复 `Form` ArrayField 异步 setValues 更新时，值发生变化了，但渲染没有更新的问题 
    -   修复 `Upload` type=picture 时，file List 排列样式不对，+号被换行的问题 
    -   修复 `Form.Switch`在 Safari 浏览器使用报错的问题 
    -   修复 `BackTop` 在卸载时可能 target 已经被移除而报错的问题
-   【Style】
    -   `Tree`、 `TreeSelect`、 `Cascader` 、`Select` 组件空状态样式调整
    -   `Rating` 组件新增动画效果 
    -   修复 `Input` 的部分样式
        -   有前后置标签时的 validateStatus 状态的样式
        -   仅有前或后置标签时的圆角
        -   suffix 后缀过长溢出的问题
-   【Perf】
    -   API 调整及控制台警告：原有的 API 仍将支持直至 1.0，但不再推荐使用
        -   `Tree` 增加 onChangeWithObject，替换原有的 labelInValue
        -   `Tree` 增加 showClear，替换原有的 clearable
        -   `TreeSelect` 将在 1.0 版本移除 valueInArray ，推荐通过 onChange 获取相关节点属性
        -   `TreeSelect` 增加 showSearchClear，替换原有的 allowSearchClear
        -   `Input`, `InputNumber` 增加 showClear，替换原有的 clearable
        -   `DatePicker`, `TimePicker` 增加 showClear，替换原有的 allowClear

#### 🎉 0.34.0 (2020-04-03)

-   【New Component】
    -   新增 `Empty` 组件
-   【Fix】
    -   修复 `Tree` `TreeSelect` 单选受控模式下 treeData 改变时未重新处理 value 值问题
    -   修复 `Select` 在 loading 时仍然响应了回车键盘事件问题
    -   修复多个 `Table` 传入的 `Column.title` 为 ReactNode 时可能会有性能问题 
    -   修复 `Tree` 受控模式下 expandedKeys 与搜索状态的自动展开冲突的问题 
    -   修复 `Tree` 搜索框有值时数据动态更新但搜索内容未更新的问题 
    -   修复 `Tree` 和 `TreeSelect` 清空搜索框未触发 onSearch 的问题
    -   修复 `Upload` 上传过程中未展示上传进度条及 defaultFileList 中 status 为 success 时错误展示了进度条的问题
    -   修复 `Grid` span 为 0 的 `Col` 未体现 display:none 特性的问题 
    -   修复 `AutoComplete` 当 data 未为空时 disabled 失效的问题；修复 `Option` hover 样式只响应键盘事件未响应鼠标事件的问题。
-   【Feat】
    -   `Typography` 的 ellipsis 功能扩展 
        -   支持文本、标题及段落的截断
        -   支持单行、多行截断；支持常显后缀；支持中间、末尾两种截断方式
        -   支持展开、折叠及自定义文本
        -   支持配置 tooltip 的展示参数
    -   `Breadcrumb` 截断逻辑优化 
        -   从字符数截断改为宽度截断，默认为 150px
        -   新增 api showTooltip 支持配置截断宽度，中间/末尾截断方式等
    -   `Modal` 新增 maskFixed 属性
    -   `Toast`、`Notification` 新增 getPopupContainer 属性 
    -   `Toast`、`Notification` 的 destroyAll 方法改为同时销毁容器 
    -   `Tree` 、`TreeSelect` 新增 autoExpandParent 属性 
    -   `TreeSelect` 新增 autoAdjustOverflow 属性
    -   `Select` 增加 close()、open() method，可用于手动控制弹窗展开/关闭 
    -   `Select` 多选模式下支持将某个已选项禁止删除；增加 onClear 回调 
    -   `TextArea` 支持 validateStatus
    -   `Form` onValueChange 增加第二个参数 changedValues，具体反映当前发生变化的 field 
    -   `Table` 支持在有固定列时可以不传 scroll.x 与 Column.width 以自动设置宽度 
    -   `Table` 支持将多种内容渲染至同一单元格内 
    -   浮层类组件统一支持参数 stopPropagation，以阻止浮层上元素点击事件冒泡
    -   浮层类组件支持自定义 Trigger 
    -   `Tooltip`/`Popover`/`Popconfirm` 支持小三角指向元素中心 
-   【Style】
    -   `DatePicker` 日期选择面板样式更新 
    -   `AutoComplete` 输入建议列表中，选中项不再加粗显示

#### 🎉 0.33.0 (2020-03-20)

-   【Fix】
    -   修复 `Navigation` selectedKeys 受控条件下出现组件内部 state 未更新的情况 
    -   修复 `Table` 组件分组渲染模式下异步设置 dataSource 数据无法显示的问题 
    -   修复 `DatePicker` 在传入 needConfirm 时点击 preset 会略过确认环节的问题
    -   修复 `Select` 在 trigger 为 click 的 `Popover` 中使用时，showClear 为 true 时，点击清除按钮会导致 `Popover` 收起的问题
-   【Feat】
    -   `Table` 多项特性支持与优化
        -   固定列优化，采用 "position: sticky;" 定位的方式替代老版本中渲染多个表格的方案
        -   虚拟化支持，覆盖大规模数据渲染场景 
        -   开启虚拟化后支持无限滚动 
        -   默认禁止表头的文字选中 
        -   优化固定列场景下 hover 态不跟手的问题 
        -   支持使用 div 等自定义元素替代 table/tbody/tr 等元素 
        -   已展开行增加额外的 className: semi-table-row-expanded
    -   `DatePicker` 支持指定默认时间选择 
    -   `Form` 多项功能支持
        -   新增 autoScrollToError，校验后自动滚动至第一个错误字段 
        -   formApi.validate / reset 支持校验/重置特定 field 
        -   新增 formApi.scrollToField(field)，用于手动触发滚动至指定 field
        -   `Form.Label` 增加 extra 属性，便于在 required 标识符后添加内容 
    -   `Typography` copyable 支持 successTip 自定义复制成功后的文案 
    -   `Cascader` 支持传入的 defaultValue 不存在于数据中时直接映射成字符串 
    -   `Modal` 支持 getPopupContainer 
-   【Style】
    -   `Checkbox`，`Radio` 样式调整：相关颜色改为 Primary 
    -   表单输入类控件禁用态样式调整 

#### 🎉 0.32.0 (2020-03-06)

-   【Refactor】
    -   `Tree` 组件重构，重点优化千/万级别节点渲染性能 
        -   新增 disabled, emptyContent, showFilteredOnly 
    -   `TreeSelect` 组件重构
        -   新增 allowSearchClear, defaultExpandAll, defaultExpandedKeys, defaultOpen 
        -   支持 onFocus/onBlur 方法 
        -   修复多选模式下点击 checkbox 取消勾选会触发下拉菜单关闭的问题
-   【Feat】
    -   日期选择器支持禁用时间选择 
    -   增加部分函数式组件的 propTypes 挂载 
    -   `Modal` 命令式调用支持 destroy，update 方法 
    -   `Upload` 支持 data / headers 通过 (file) => object 方式传入 
    -   `Table`增加 Checkbox 的禁用效果，并取消在有效数据项 key 数组为空时表头 Checkbox 为选中态的逻辑 
-   【Fix】
    -   修复日期选择器中自定义 preset 点击时无法触发 onChange 的问题 
    -   修复 `Slider` 范围选择器最小值不为 0 时滑块定位的问题 
    -   修复 `List.Item` 的 jsx 写法不支持 grid 和 layout 及报错的问题 
    -   修复 `Form.Select` 中使用分组功能报错的问题 
    -   修复 `Select` outerBottomSlot 中存在 checked 的 Checkbox 时，点击导致 Select 收起的问题 
    -   修复 `Form.CheckboxGroup` 未带有 initValue 时，操作后再 reset，UI 渲染未更新的问题 
-   【Style】
    -   `Navigation` 文字颜色修改为 "--color-text-1" 
    -   `Form.Label`，当`labelPosition`为 top 时，增加 label 标签的`display:block`显式声明，防止有些未配置 reset/normalize 的系统使用时，label 高度不对
    -   `Form` layout='vertical'时，对 Field 的上下间距进行调整。垂直排列的 Form 会更加宽松（marginTop/Bottom 折叠后 16px => paddingTop/Bottom 叠加 24px）。原有的 Form 高度会发生变化。 

#### 🎉 0.31.0 (2020-02-21)

- 【Feat】
    -   `Select`提供分组功能`OptGroup` 
    -   `Select`增加 onFocus、onBlur 回调 
    -   提供 `ConfigProvider` 组件，支持时区配置 
    -   `Form.Slot`支持脱离`Form`使用 
    -   `Slider` 支持 `railStyle`，可用于实现分段轨道色 
    -   `RadioGroup` 支持 `direction` 
    -   `Step` 增加 `onClick` 支持及自动添加 `cursor:pointer` 
    -   `TagGroup` 支持 `showPopover`，将剩余的 `+N` 内容通过浮层展示 
-  【Fix】
    -   修复 `Select` allowCreate 输入不存在的 label 后，不选任何项直接 clickOutSide，然后点击 Select 展开，'创建 xxx' 的候选项仍然存在的问题 
    -   修复 `Form` labelWidth 对 Form.InpurGroup 不生效问题 
    -   修复 `DatePicker` 组件月份选择时可能导致年份列表有错位的问题 
    -   修复 format 与 type 冲突时会导致 `DatePicker` 崩溃的问题 
    -   修复 `ButtonGroup` 中使用多个图标按钮时首个按钮的内边距不正确的问题 
    -   修复 `.d.ts` 中未使用 `import * as React` 的问题 
    -   修复 `TagGroup` 不传 key 时的 warning
    -   修复 `Slider` 提示文本不居中及 disable 样式 
    -   修复 `InputGroup` 父级的 `style` 透传并且覆盖了 `children` 的样式
    -   修复 `Step` 组件 className 不生效问题
    -   修复 `Upload` 组件 withCredentials 失效问题
-  【Style】
    -   更新 `Select` Option 表示选中态钩子的大小
    -   更新 `Pagination` showTotal 内容的间隔，数字左右加一空格
    -   修正 `Select` multiple filter 时 input 框偏左样式 
-   【Docs】
    -   移除 Modal 命令式调用中错误的 visible 声明
    -   补充 Tooltip 与 Popconfirm / Popover 直接嵌套使用的例子

#### 🎉 0.30.0 (2020-02-07)

-   【Feat】
    -   `InputNumber` 在失去焦点时如果内容发生变化也进行一次 onChange 
    -   `Dropdown` 出现时为触发器元素增加样式名 
    -   `Table` 开启了行选择或者展开功能时如果 dataSource 中每个数据项不存在 key 属性或者没有使用 rowKey 指定作为主键的属性名则控制台会有报错提示 
-   【Fix】
    -   修复 `Form` .d.ts onChange 声明遗漏的问题
    -   修复 `Table` 无数据文案会处于表格横向滚动轴之下的问题 
    -   修复 `Table` 固定列后，表头未对齐的问题 
    -   修复 `Table` 使用 JSX 声明 column 且存在固定列且内容换行时会导致行无法对齐的问题 
-   【Perf】
    -   `Collapsible` 优化重构
        -   修复使用 keepDOM 控制台报 warning 的问题 
        -   优化嵌套使用的逻辑，不需要再手动传入动画节点 
-   【Style】

    -   `Table` 组件选择框大小调整 

#### 0.29.0 (2020-01-10)

-   【Feat】
    -   `SideSheet`
        -   新增 `size`, `disableScroll`, `getPopupContainer` 
        -   当设置 `mask={false}` 时允许在外部进行操作 
        -   新增功能后 `SideSheet` 的类名发生如下变更：`semi-modal-wrap` => `semi-sidesheet-inner-wrap`, `semi-modal` => `semi-sidesheet-inner`, 其余`semi-modal-x` => `semi-sidesheet-x`
    -   `Table`
        -   支持分组展示数据 
        -   支持透传参数给过滤器浮层 
        -   数据个数为 0 时不展示分页区文案 
        -   支持对子级数据进行本地过滤或排序 
    -   `Calendar`, `Typography` 支持 i18n
    -   `PopConfirm` 新增 `okButtonProps`, `cancelButtonProps`
-   【Fix】
    -   `Modal`
        -   修复 d.ts 声明对 `content` 等属性的遗漏 
        -   修复默认 visible 为 true，及命令式调用时滚动穿透的问题 
    -   修复 `SideSheet` 设置 motion={false} 时会直接弹出的问题 
    -   修复 `DatePicker` 在 "dateTimeRange" 模式下修改时间会导致日期也发生变化的问题 
    -   修复 `DatePicker` dts 声明中缺失 className 和 style 的问题 
    -   修复 `Table` 中展开按钮未垂直居中的问题 
    -   修复 `InputNumber` 在设置了 "max" 参数后无法输入的问题 
-   【Style】
    -   `Modal` 改变高度 height 时保持 footer 吸底
    -   `Notification` content 与 title 同宽
    -   `Select` 组件多选且可搜索时，失去焦点后自动清空 `Input` 输入

#### 0.28.0 (2019-12-27)

-   【Feat】
    -   增加 .d.ts 以在 vscode 等 IDE 中提供更友好的语法提示 
    -   `Form`新增 Form.AutoComplete 
    -   `Form.Slot`支持传入 error 
    -   `Modal`组件命令式调用 onOk 支持 Promise resolve 再关闭对话框 
    -   `Cascader`、`TreeSelect`支持 insetLabel、prefix、suffix 
    -   `Cascader`、`TreeSelect`支持 validateStatus 
    -   `Rating` 组件 allowHalf 属性下支持展示除 0.5 以外的小数 
    -   `Upload` 移除拖拽型上传组件 onDropEnter 时的类型检测及相应样式（因浏览器策略限制，拖拽未松手时并不能获取文件详细信息）原因详见 
-   【Fix】
    -   修复`Select`多选 + maxTagCount + width 宽度不足而 option 内容过长，已选择项位置偏移可能展示不出来的问题 
    -   修复`Form`如果不设置 allowEmpty，ArrayField 中 Field onChange 时，新 add 的 Item 条数可能会变化的问题 
    -   修复`ArrayField`与`Collapse`配合使用表现异常的情况 
    -   修复`Select` 自定义 renderCreateItem 时，缺少 key 会抛出 warning 的问题 
    -   修复`DatePicker`点击清除按钮后，再点击日期按钮无法进行日期选择 
    -   修复`DatePicker`点击清除按钮无法触发 onChange 
    -   修复`DatePicker`禁用状态下`Popover`会给 DateInput 包上一层 span 导致 display 变化的问提 
    -   修复 `DatePicker` 传入 1970 年以前的时间戳无法通过验证 
    -   修复 `DatePicker` 浮层选中条未居中且底部圆角模糊的问题 
    -   修复 `DatePicker` 传入 allowClear={false} 后 focus 状态下日历图标不显示的问题 
    -   修复 `InputGroup` 内含有 null 导致报错 
    -   修复 `InputNumber` 设置 max/min 只对点击改变有效，输入没有限制的问题 
    -   修复 `InputNumber` 在 form reset 时没有清空的问题 
    -   修复 `Checkbox` 组件外层 div 如果定义了 onClick 事件会先于内层的 onChange 触发的问题 
    -   修复 `Collapse` 组件 onChange 回调的入参。应该与 activeKey 相对应，而不是单个 panel 的 itemKey 
    -   修复`Collapsible` 在 Table expandRowRender 中无法默认展开 
    -   修复 `Table` 在 dataSource 变动后会清空选中行 key 数组的问题 
    -   修复 `Table` 展开按钮没有垂直居中的问题 
    -   修复 `Table` 选择/展开按钮点击时没有阻止冒泡的问题 
    -   修复`TreeSelect`受控 value 值全选子节点没有自动选中父节点 
    -   修复`Form.CheckboxGroup`在使用 formApi.setValues 重置值之后，某些 checkbox 需要点击两次才生效的问题
    -   修复`Spin`在嵌套使用中 size 样式被覆盖的问题
    -   修复`Upload` onError 回调入参错误；
    -   修复`Form.Select` allowCreate 时按回车，事件冒泡触发 form submit 的问题 
-   【Performance】
    -   解决`Form.Select`自定义 OptionNode 渲染并开启 onChangeWithObject 时出现的卡顿问题 
    -   `InputNumber` 组件交互优化 
    -   解决`Table` 的列 fixed 后，滚动卡顿比较严重 
-   【Style】
    -   `Pagination`中内置的 Select 默认设置 clickToHide，点击可收起。user-select 改为 none 
    -   `Breadcrumb`中的 Popover 位置从 bottom 改为 bottomLeft
    -   `TreeSelect`，`Cascader` 无数据时 hover, active 无样式 
    -   `Typorgraphy` 的 copyable 文本与复制图标间距改为 4px

#### 0.27.0 (2019-12-13)

-   【New Component】
    -   新增 `Typography` 组件 
-   【Feat】
    -   `Nav` 支持在未传入 defaultOpenKeys/openKeys 时展开选中项的所有父级 SubNav（如果该选中项为 SubNav 的子项）
    -   `Nav` Nav.Sub 组件支持传入 dropdownStyle，控制 maxHeight 及 overflow 等属性 
    -   `Table` 支持分页区域文案国际化，支持传入 formatPageText 自定义分页区域文案 
    -   `Table` 支持树形数据展示 
    -   `Form`增加 Form.ErrorMessage、Form.Slot 导出 
    -   `Form` Field 支持传入 labelPosition、labelAlign、labelWidth 属性，可覆盖 Form 的设置 
    -   `Form` 增加 wrapperCol、labelCol 快速布局配置
    -   `Form` withField 增加 shouldMemo 配置，以支持 stateful component 
    -   `Form` Field label 属性兼容，支持传入 object 
    -   `Form` Field 增加 convert，允许在 UI 更新前，对组件的值进行二次修改 
    -   `Form` Field trigger 属性，支持多个触发时机同时配置 
    -   `Select`、`AutoComplete`增加 autoAdjustOverflow 浮层自适应开关 
    -   `Cascader` 展开后再次展开回到上次展开的状态 
    -   `Notification` 支持点击通知的 onClick 事件 
    -   `Breadcrumb` 组件样式和代码优化 
        -   截断层级改为第二级到倒数第三级
        -   新增 renderItem 属性，可配合 routes 使用
        -   onClick 回调参数改为：function(item: route, e: Event)
        -   Route object 支持 href 属性，作为链接目的地
-   【Fix】
    -   修复 `DatePicker` 可能出现内存泄露的问题 
    -   修复 `DatePicker` 在 Safari 浏览器下可能出现崩溃的问题 
    -   修复 `DropdownItem` 在 disabled 状态下未阻止 DOM 事件的问题 
    -   修复 `Table` 使用 JSX 语法糖定义 Column 时传入 key 控制台会报警的问题 
    -   修复 `Table` 可能出现两行同时处于 hover 状态的问题 
    -   修复 `Table` 可能无法展开额外行的问题
    -   修复 `AutoComplete` defaultValue 某些情况不生效问题 
    -   修复 `Banner` onClose 回调参数 
    -   修复 `Avatar` extra-small 字号大小问题
    -   修复 `Breadcrumb` a 标签嵌套问题，传入 href 时渲染为 a 标签，否则为 span 标签
    -   修复 `Cascader` 和 `TreeSelect` 的 placeholder 换行问题 
    -   修复 `Cascader` 组件渲染数据未按传入的顺序 
    -   修复 `Icon` 组件自定义 icon 驼峰命名被转为小写而无法显示 
    -   修复 `Form` form 级别自定义校验 validateFields 返回 errors 更新后，Field 上对应的 errors 信息未移除的问题（即某些 Field 校验由非法=>合法时）
    -   修复 `Form` Form Field.rules required 配置更新，实际未生效问题 
    -   修复`Pagination` popoverPosition 未控制所有的下属弹出层问题
    -   `Pagination` 点击当前页页码不应触发 onPageChange 
    -   `Pagination` 异步更新 total，且未按受控模式使用时，自动将当前页设为 1 作兼容
    -   `Select` disabled 时 clear icon 不应展示；Input 等输入类组件 disabled 时 clear icon 不应展示
    -   `Input` 组件 clearable button 点击后需要阻止冒泡 
-   【Style】
    -   `DatePicker` type=dateTime，底部 switch 部分 active 项移除 hover 效果、移除 cursor:pointer 效果
-   【Docs】
    -   更新`Form`、`AutoComplete`使用文档
    -   更新`快速开始`文档

#### 0.26.0 (2019-11-29)

-   【Refactor】
    -   重构`AutoComplete`，不再基于 Select 进行封装，修正交互细节 
-   【Feat】
    -   `Select`、`AutoComplete` position 支持传入除'top'/'bottom'外的其他配置（对齐 Popover、Tooltip）
    -   `Select`新增 onSelect、onDeselect 回调 
    -   `Dropdown`增加 Dropdown.Title，增加 showTick；Dropdown.Item 增加 active，type 
    -   `Pagination`增加 hideOnSinglePage，总页数小于 2 时自动隐藏分页器 
-   【Fix】
    -   修复`AutoComplete` showClear 未生效，文档示例错误问题 
    -   修复`Pagination`total 为 0 时右侧为 disbaled 问题
    -   修复 `Popconfirm` 组件标题为空时有占位的问题 
    -   修复 `Table` 组件 `onChange` 回调内更新状态时导致无法进行行选择的问题 
    -   `Slider` 组件代码优化，修复受控状态下 onChange 调用了两次及可以拖动的问题 
    -   修复 `Tree` 组件受控状态下切换 value 值之前的节点状态未保留的问题 
    -   修复 `BreadcrumbItem` 未导出的问题
    -   修复`Select`点击清除按钮时，onChange 未被触发问题 
    -   修复`Select`直接子后代如果存在 null 时抛出 error 问题 
    -   修复`Tabs`组件若 mounted 时 TabPane 为空，挂载后通过异步更新 TabPanes 后，首个 Tab 未能自动激活问题 
    -   修复`InputNumber`点击步进器设置的值可小于 min 值的问题 
    -   修复`Table`分页组件 pageSize 变动时未触发 Table 的 onChange 问题 
    -   修复`Table`组件 defaultExpandAllRows 为 true 条件下数据变动时表格行无法自动展开的问题 
    -   修复`DatePicker`在受控模式下，使用 format 会报错的问题 
    -   修复`Popconfirm`组件 position 为 left 时中文文案会换行的问题 
    -   修复`Popconfirm`组件在 title 为空时 icon 不与 content 平齐的问题 
    -   修复 `Slider` 在覆层中滑动迟钝的问题 
    -   修复 `Breadcrumb` 的 Item 组件 onClick 不起作用的问题 
    -   修复 `BackTop` 组件内存泄露的问题 
    -   修复 `Input` 组件长按清除按钮消失的问题 
    -   修复 `Input` 组件 placeholder 不居中的问题 
    -   修复 `Spin` 组件 wrapperClassName 未随状态更新的问题
-   【Style】
    -   `Tree` 和 `TreeSelect` 设计调整 
        -   节点样式默认打开 blockNode；
        -   展开箭头增加 hover 和 active 的效果；
        -   间距调整，首行左边距改为 8px ，缩进改为 20px，文本和图标间距改为 8px
    -   修改`Tooltip`的 border radius 为 6px
-   【Docs】
    -   补充 AutoComplete 文档

#### 0.25.0 (2019-11-15)

-   【Feat】
    -   `Table` 组件分页功能非受控条件下支持传入自定义的 `total` 
    -   `Collapse`, `Collapsible` 支持 keepDOM，隐藏时不销毁 DOM 节点 
    -   `Toast`，`Notification` 支持全局配置出现位置(top, bottom, left, right)、时长 duration 
    -   `Toast`，`Notification` 支持支持 destroyAll 
    -   `Toast`，`Notification` 新增 showClose 支持不显示关闭按钮 
    -   `Toast`新增 icon, textMaxWidth
    -   `Radio`、`Checkbox` 支持 extra 传入副文本 
    -   `Switch`支持 checkedText / uncheckedText 开/关 状态文本传入 
-   【Fix】
    -   修复 `Dropdown` 在 trigger 为 hover 时传入 clickToHide=true 选择选项浮层无法自动关闭的问题 
    -   修复 `Tabs` 组件 TabPane `props.tabs`更新后，tabs 的渲染没有跟随更新的问题 
    -   修复 `Breadcrumb` 组件非真值的路径引起报错的问题
    -   修复 `Collapse` 组件 `defaultActiveKey` 为 string 时没有相应面板展开的问题 
    -   修复 `Slider` 组件在 `Form` 中使用时起点，终点时会被遮盖的问题 
    -   修复 `Slider` 组件在 range 模式下，使用受控 value，组件调用爆栈问题 
    -   修复`Table`组件分页功能在非受控情况下，更新了 dataSource 后页码数未更新问题 
    -   修复`CheckboxGroup`组件直接子元素为原生 DOM 时，被透传 prefixCls prop 抛出 error 问题 
    -   修复`Table`同时传入 rowKey 和 rowSelection 时无法进行行选择的问题 
    -   【fix】`Pagination`组件 total 小于 10 时，下一页的按钮未被 disabled 
    -   【fix】`Table`className 影响了 tr 元素 
    -   【fix】`Calendar`组件全天 event 的排序问题
-   【Style】
    -   `Toast`，`Notification`，`Modal` 的 info 图标改蓝色 
    -   `Button` 组件文案默认不可选中 
    -   `Toast`，`Notification` 交互优化，hover 时不消失 
    -   `Select` 多选 Tag 左边距调整 12px => 4px 
    -   `TimePicker` 选项增加 :active 效果 
    -   `CheckboxGroup` 垂直间距调整 
    -   `Pagination` 分页器下拉菜单样式与 Select 统一 
-   【Perf】
    -   Radio、Checkbox 代码优化，移除即将废弃的 unsafe 的生命周期相关逻辑 
-   【Docs】
    -   补充了 `Table` 组件 `onRow` 用法 
    -   修复实时编辑框超过一定宽度后会消失的问题 

#### 0.24.0 (2019-11-01)

-   【Feat】
    -   `Select`组件增加 remote 优化远程搜索体验
    -   `Form` Field 增加 fieldClassName 配置
    -   `Dropdown`组件支持点击选择选项后自动关闭浮层 
    -   `TimePicker`增加 inputStyle 配置 
-   【Style】
    -   `Dropdown`组件去除 minWidth 限制 
    -   `Select` clear 按钮 hover 效果对齐`Input`, 多选 placeholder 颜色修正 
-   【Fix】
    -   `Form.InputGroup`兼容直接子级为 null 的情况 
    -   修复`DatePicker`组件输入框清空按钮点击无效的问题 
    -   修复`Select` value 为 undefined 时，动态更新 optionList 报错问题
    -   修复`Select` 初始 optionList 为空数组，value 受控传入非空的值，异步更新 optionList 后，已选择项渲染没有随之变更问题 
    -   修复`Form` Field 级别容器未传入必需的 field 属性时，直接抛错问题

#### 0.23.0 (2019-10-28)

-   【Feat】
    -  `Select` 调整 
        -   增加 suffix、prefix 支持
        -   增加 showArrow，控制是否展示右侧下拉箭头；增加 showClear，控制右侧是否自动展示清除 Icon
        -   增加 clickToHide 参数，控制 Select 展开时，点击选择框是否自动收起
        -   增加 onMouseEnter、onMouseLeave 回调
        -   去除 value 必须在 optionList 中有对应的 option 的限制
        -   增加 renderCreateItem，自定义创建新标签时的渲染内容
        -   增加 onCreate 回调，创建新标签时触发
        -   增加 onExceed 回调，多选超出数量限制时触发
        -   增加 onChangeWithObject，替换原有的 labelInValue（原有的 API 仍将支持，但不再推荐使用）
        -   增加 renderSelectedItem，自定义已选择标签的渲染，替换原有的 optionLabelProp = 'children' / 'value'（原有的 API 仍将支持，但不再推荐使用）
    -   `TimePicker` 支持时间范围选择模式 
    -   `Tree` 组件 onSelect 增加选中节点的回调入参，function(selectedKey:string, selected: bool, selectedNode: object)
-   【Fix】
    - 修复浮层类组件（`Popover`/`Tooltip`/`Select`/`Dropdown`等）在 edge 浏览器下位置错误的问题 
    -  修复 `Tree` 组件更新节点后选中项未展开的问题 
    -  修复 `Tabs` 按钮模式 hover 状态背景闪烁
-   【Style】
    - `Table` 去掉了表头 hover 效果 
    - `DatePicker` 年月选择模式表盘宽度调整 

#### 0.22.0 (2019-10-18)
-   【Feat】
    -   `Table` 支持 `onRow`/`onHeaderRow`/`onCell`/`onHeaderCell` 用法，用户可以自定义行或单元格事件 
    -  `Tree` 组件支持受控的 expandKeys 
    -  `Tree` onChange 可获取除 value 外的其他属性 
    -  `Form`组件 formApi.setValues 支持配置 isOverride，给 formState.values 赋值时是否直接覆盖，可对 Form 中未存在的 field 进行提前赋值 
    -  `Form`支持 TreeSelect、Cascader、Rating 
    - `Form`新增 allowEmpty 属性，当设置为 true 时，value 为空的 field key 也会于 formState.values 中存在
    - `Select` Option 支持 showTick、className、style 配置
-   【Fix】
    - 修复 `Form`调用 formApi.setValues 对 arrayField 进行重新赋值后，ArrayField 没有重新渲染问题
    - 修复 `Table` 组件 `JSX` 写法 `title` 为 `ReactNode` 时会造成卡顿的问题 
    - 修复 `Tabs` 动态修改 pane 报错
    - 修复 `TextArea` 的 onPressEnter 方法
    - 修复 `Modal` 在 Modal 内部点击按下，然后移到 Modal 外部松开点击时造成的弹窗关闭
- 【Style】
    -  `Modal` 取消按钮改为 tertiary light button 
    -  `Radio` 和 `Checkbox` 文本支持触发 :hover 以及 :active 
    - `Input`、`Input`、`DatePicker`、`TimePicker` insetLabel 左边距调整 8=>12 
- 【Docs】
    -  `Modal` 组件在命令式支持自定义 icon 


#### 0.21.0 (2019-10-12)
-   【Feat】
    -   `DatePicker` 支持 type="month" 进行年月选择 
    -   `InputNumber` 支持长按时连续加减 
    -   `ButtonGroup` 支持传入特定按钮的参数
    -   `Upload` 支持拖拽上传 
    -   `Tree`, `TreeSelect` 更新 onSelect, onChange 的回调入参
    -   `Modal` 新增 header 属性 
- 【Fix】  
    - 修复 `InputNumber` 在受控条件下传入 formatter 和 parser 无法正常格式化的问题 
    -  修复 `InputNumber` 设置了 precision 后无法使用退格键的问题 
    - 修复 `Table` 固定表头时，如果传入了超长文本会导致列无法对齐的问题 
    - 修复 Safari 浏览器下，`Select` 选项过多时下拉菜单溢出显示，未正常滚动问题
    - 修复 `Select` 设置了 width='100%'，在 `Tabs` 下使用，初次渲染下拉菜单宽度错误问题
    - 修复 `Form` 的 ArrayField 未对 initValue 作 deepClone 隔离问题，同时此次更新对 onSubmit、onSubmitFail、formApi.setValue、formApi.getValue 中的值都做了 clone 隔离
    - 修复 `DatePicker` 中 dateInput 的 foundation 在初次 render 时未初始化导致的报错问题
    - 修复 `Tree` 组件 label 为节点类型 setState 后 defaultExpandAll 失效
    - 修复 `Input` prefix 为中文时的换行问题 
-  【Style】
    - 修复 `Modal` 底部的 spacing 
    - 重命名 `Icon` 中的 forward_1 图标为 fast_forward
    - `Radio` 增加 active 态 
    - `Switch` 设计调整，增加 size 属性。修改了默认的尺寸大小 
-  【Docs】
    - 新增 `Collapsible` 嵌套使用的文档样例 

#### 0.20.0 (2019-09-26)
-   【Feat】
    -  `Navigation` 动效优化，导航项选中态样式优化 
    -  `Tree` 支持 labelInValue 
    -  `Tree` 支持 defaultExpandedKeys 
    -  `Tree`, `TreeSelect` 增加动画，可以通过 motion, motionExpand 来控制是否开启 
-   【Fix】
    - `Slider` 的定位计算和交互进行优化，修复兼容性 bug
    - 垂直 `Slider` 拖动时滑块偏移 
    - `Slider` range 出现滑块错位无效值问题 
    - `Slider` 在 Edge 浏览器中无法使用直接报错 (part of 
    - 修复 `Tabs` 切换时底部会闪烁一条滚动条的问题 

#### 0.19.0 (2019-09-22)
-   【New Component】
    - 新增 `Collapsible` 组件 
-   【Feat】
    - `Tree` 组件新增 icon 支持自定义图标; 新增 directory 支持目录树样式 
    - `Tree` 组件 label 属性支持 ReactNode 类型
    - `Cascader`，`TreeSelect` 组件支持二次点击收起 
    - `Popover` 支持显示小三角 
    - `Popconfirm` 支持受控展示 
    - `Progress`条形进度条支持展示百分比文本; showInfo 默认值由 true 改为 false 
-   【Refactor】
    - 对 `Input` 组件的 DOM 结构、样式、className 进行了优化调整
-   【Fix】
    - 修复 `Input` 组件 prefix 计算宽度不准的问题 
-   【Style】
    - 修复 `Avatar` 组件字母不居中的问题 
    - 修复 `Breadcrumb` 组件分隔符不居中的问题 
    - `Collapse` DOM 结构调整、增加动画
    - `Progress`DOM 结构调整、增加动画
-   【Perf】
    - `Button` 加载状态使用新图标（同 Spin）
    - `Table` 可伸缩列交互优化，反馈更明显 
-   【Fix】
    - 修复 `TimePicker` 在 focus 时可能无法展现的问题 
    - 修复 `Tooltip` 浮层无法正确展现导致输入框切换时闪烁 
    - 修复 `RadioGroup` 设置 disabled 时子选项未生效的问题
    - 修复 `Form` Field 设置 initValue 为 0 时无效问题
    - 修复 `Select` 多选未设 maxTagCount 时 Input 光标错位问题
    - 修复 `Grid` Col=24 样式失效问题

#### 0.18.0 (2019-09-16)
-   【New Component】
    - 新增 `List` 组件
-   【Feat】
    - `Select` 支持键盘操作、支持二次点击收起
    - `Select` 新增 allowCreate 支持搜索中创建条目
    - `Select` 新增 maxTagCount 支持多选超出限制显示+N
    - `Tag` 新增 TagGroup
    - `DatePicker`、`TimePicker`、`Input`、`InputNumber` 等组件支持 error 状态、warning 状态展示
    - `DatePicker` 支持 `onConfirm`/`onCancel` 回调
    - `InputNumber` 输入格式和显示格式统一
    - `Tooltip`/`Popover` 等浮层类组件支持水平/垂直方向上的边缘检测和自动定位
-   【Fix】
    - 修复 `TimePicker` 滚动时偶有无法选中的问题
    - 修复 `Select` 多选模式下选择数达到 max 后，再次选择无法取消问题
    - 修复 `Select` multiple、filter 均为 true 时 placeholder 显示问题
-   【Style】
    - 修改 `Select` 内嵌标签的 className、增大 insetLabel 的左右间距，统一 Input、Select 的 insetLabel 样式。对 Select multiple 为 true 的 DOM 结构、样式进行了优化调整

#### 0.17.0 (2019-09-06)
-   【Feat】
    - `Button` 支持 `loading` 态
    - `Cascader` 组件支持受控
    - `Navigation` 组件 `onSelect` 回调支持返回原始配置对象
    - `Upload` 增加 prompt、promptPosition 配置提示文本及位置
    - `Form`组件存在多个 field，调用 reset、validate、setValues 时，onValueChange、onChange 触发多次调整为只触发一次
-   【Fix】
    - `Upload` 修复 uploadTrigger 为'custom'时，limit 数量限制失效问题
    - 修复`Pagination`组件，选中较后的页码后，再将每页容量切换到更大数值，当前页在新的页码表中无对应值导致的渲染错误问题（当前页页码由不变改为折算）
    - 修复`Select`组件，当 label 为 ReactNode，且开启了 filter 时已选项会渲染为\[Object Object\]问题
-   【Perf】
    - `Popover` / `Tooltip` 等浮层类组件动效调整
    -  优化`Form`组件集中 validate 的性能
-   【Style】
    - 更新了 `--color-text-2` 的色值
    - `Tab` 更新交互样式
    - `Form`组件当 labelPosition 为 left 时，自动为每个 field 的 label 增加上下`padding：6px`，以达到跟 field 的第一行文本对齐

#### 0.16.0 (2019-08-30)
-   【New Component】
    -  新增 `TimeLine` 组件
-   【Feat】
    -  semi 全局变量更新
    -  `BackTop` 组件增加动画，增加 duration 属性
    -  `Modal` 组件增加 centered 属性，并且更新默认样式的定位
    -  `Cascader` 组件支持动态更新子节点
    -  `Badge` 组件增加 position 属性，并且支持自定义 node
    -   `Toast`，`Notification` 的 duration 属性支持小数
    -   `Table` 支持列伸缩、JSX 描述 columns、文档增加行拖拽排序的 Demo
-   【Fix】
    -  `Tree`, `TreeSelect` 支持动态更新子节点
    -  `Form` setValues 时触发多次 onChange、onValuesChange 改为只触发一次
-   【Style】
    -  `Navigation` 组件样式优化，功能优化
    -  semi 增加全局字体 font-family 的声明
-   【Perf】
    -  `Select`、`Tooltip`、`Popover` 等浮层动效优化与调整
    -  `Table` 组件底层优化，滚动错位问题修复

#### 0.15.0 (2019-08-23)
-   【New Component】
    -  新增`Tree` 组件
-   【Feat】
    -  `Upload`增加 uploadTrigger 可手动触发上传功能；增加 onXhrFinish 回调；增加提示文本 slot：prompt
-   【Fix】
    -  `Form`的 initValues、initValue 没有做深克隆隔离，field 卸载时可能影响源数据
    -  `Select`optionLabelProp 为 value,且受控时，已选项渲染错误问题
    -  `TextArea`在 Form 中无法重置及初始状态没有 resize 的问题
    -  修复多个`Spin`同时存在时样式覆盖的问题
    -  修复 CheckboxGroup Context 在生产环境下打包可能为 undefined 导致的无法勾选问题
    - 修复`CheckboxGroup`direction props 的类型
-   【Style】
    - `Select`去除 v0.10.0 引入的 min-width：120px；修复下拉层宽度计算错误问题；修改 dropdownMatchSelectWidth 的定义：下拉菜单的 width 是否等于 select 的宽度=>下拉菜单的 min-width 是否等于 select 的宽度
-   【Perf】
    -  优化`TreeSelect`只渲染显示的节点

#### 0.14.0 (2019-08-19)
-   【Feat】
    -  `Select`、`AutoComplete`增加 labelInValue、loading 属性
    -  `CheckboxGroup`支持指定 direction 切换水平/垂直布局
    - `Table` 支持自定义渲染展开按钮。
    -  `Select`、`Input`、`DatePicker`、`TimePicker`支持 insetLabel，`Form`labelPosition 支持 inset
-   【Fix】
    -  `Spin`为包裹元素时阻止下层点击事件
    -   修复`Form` labelPosition='inset'时 noLabel 属性失效问题
    -   `TextArea`传入 className/style 移至外层包裹元素
    -   修复`Notification`, `Toast`ref 为 null 的报错
    -   修复`Form` 使用 withField 封装函数式组件时 props 丢失问题
    -   修复`Select` multiple 模式下 placeholder 无效问题
    -   修复`Select` optionList 动态修改时没有重新渲染问题
    -   修复`Select` filter 为 true 时，optionList 动态改变后，input 显示值错误问题

#### 0.10.2 (2019-08-09)
-   【New Component】
    -  `Form`新增 Form.Slot 组件，新增 labelCol、wrapperCol prop
-   【Feat】
    -  `Select`新增 dropdownMatchSelectWidth，默认下拉框与选择框同宽，且将最小宽度改为 120px
    -  `Select`新增 optionList prop，支持以数组形式传入 option
    - `Select` bottomSlot 拆分为 innerBottomSlot 与 outerBottomSlot
-   【Fix】
    -  `RadioGroup`传入 className/style 无效
    -  `Form` RadioGroup initValue 设为 0 时无效
    -  `Switch` uncontroller => controller component 报错问题
    - `Form`修复 onChange/onValuesChange 回调值为 undefined 问题
    -  修复`TextArea`在 Form 中使用 maxCount 会报错的问题
    -  修复`Modal`的 footer null 值和 bodyStyle 无效的问题
    -  修复`DatePicker`、`TimePicker`未被`LocaleProvider`包裹时抛出的 locale error
    -  修复`Tab` 选中项的图标样式

#### 0.7.0 (2019-08-06)
-   【Feat】
    -  🎉🎉i18n 支持。目前支持语言：中英日韩，已支持组件`DatePicker`、`TimePicker`、`Modal`、`Pagination`、`Select`、`Table`、`Cascader`
    -  `DatePicker` props 新增 className, prefix
    -  `Input` props 新增 hideSuffix
    -  `Select`支持 dropdownClassName、dropdownStyle、支持 bottomSlot 弹出层底部插槽
-   【Fix】
    - 修复`Input` prefix 为节点时的 padding 计算错误
    - i18n Panigation 切换 locale 时 pageSizeChanger 不更新

#### 0.5.0 (2019-08-05)
-   【Feat】
    -  🎉🎉 semi 支持暗色模式 🎉🎉
    -  `ScrollList` 支持卷轴滚动以及无限循环滚动模式
-   【Style】
    - 优化 `TimePicker` 组件样式
-   【Fix】
    - 修复`Collapse.Panel` className 被覆盖的问题
    - 修复`Calendar`月视图每月首日日期不高亮的问题

#### 0.3.0 (2019-07-30)
-   【New Component】
    - 新增`Calendar`日历组件
    - 新增`Rating`评分组件
-   【Feat】
    -  `Upload`新增 previewFile 允许自定义预览
    -  `Collapse`props 的`defaultActivekey`和`activeKey`支持传入字符串数组
    -  `Form` formApi 增加 submitForm()
-   【Fix】
    -  calendar date-fns 引用报错
    -  `Upload`修复 onRemove file 对象无法取到 uid 问题
    -  `Form` InputGroup errorMessage 展示错误问题，优化了写法，无需再手动加 noLabel 属性
    -  `Progress`设定上下限 100%、0%

#### 0.1.3 (2019-07-30)
-   【New Component】
    -  新增`SideSheet`组件
    -  新增`Skeleton`组件
    -  新增`Progress`进度条组件
-   【Feat】
    -  支持在基于 webpack 的项目中使用 semi-ui 组件库
    -  `Form`支持 InputGroup；自定义校验 validate 支持 return ReactNode；Label 支持传入 ReactNode
    -  `TreeSelect`支持受控
    -  `Upload` listType='picture'未上传完成时，展示进度条，不直接预览图片
    -  `Avatar`props 新增 onClick, onMouseEnter, onMouseLeave, hoverMask
-   【Style】
    - 给各组件添加动效/动画
    - 取消`treeSelect`的下拉菜单 option list 的最大高度限制，可通过 dropDownStyle 属性自由设置
-   【Fix】
    -  修复`Banner`关闭后未销毁 dom 节点的问题
    -  InputGroup 自动给内含元素增加 key 属性
    -  修复`Select` className 无效问题
    -  修复`TreeSelect`多选模式下选中项标签乱序, 受控时下拉菜单折叠后仍会自动展开的问题
    -  `Tag`传入 visible 属性时是否展示完全由 visible 控制
    -  `Form` 采用 rules 校验时，rules 语法有错误时直接抛错
    -  修复`Form` syncValidate 从 error 变回 success 时，错误提示未清除
    -  修复`DatePicker`clear 点击偶现无效
    -  修复`Datepicker`placeholder 失效
    -  修复`TreeSelect`下拉选项按数据传入的数据展示，且下拉菜单设置最大高度
    -  修复`Table`pagination pageSize 失效
    -  修复`InputNumber`设置了 min、max 上下界后，前面仍可手动输入负号的问题

#### 0.0.25 (2019-07-11)
-   【New Component】
    -  新增`TreeSelect`组件
    -  新增`Upload`组件
    -  新增`SideSheet`组件
    -  新增`Cascader`组件
    -  新增`Layout`组件
    -  新增`Avatar`组件
    -  新增`BackTop`组件
-   【Feat】
    -  `DatePicker`、`TimePicker`增加 inputReadOnly 属性
    -  `TreeSelect`props 新增 valueInArray，支持回调返回当前节点的各级路径 value 值的数组
    -  `Upload`支持为所有文件格式创建跳转链接，props 支持 disabled、name
-   【Fix】
    -  `TreeSelect`多选模式下的返回值当父级节点被选中时，只返回父级节点而不返回父级子节点
    -  修复`Upload`图片墙模式不显示关闭图标，同文件删除后上传失效的问题
    -  修复`InputNumber`disabled 状态无效的问题


#### 0.0.11 (2019-06-28)
-   【New Component】
    -  新增`Badge`组件
    -  新增`Descriptions`组件
    -  新增`Collapse`组件
    -  新增 Form.TextArea
-   【Feat】
    -  `Nav`增加受控的 selectedKeys 和 openKeys props
    -  所有组件统一支持 className、style props 传入
    -  `DatePicker`props 新增：onOpenChange、allowClear、open、defaultOpen
    -  `Modal`弹出时，自动禁止 body 的滚动
    -  `Button`废弃了 ghost prop
-   【Fix】
    -  修复`Table`render index 为 undefined 的问题
    -  修复`Collapse` style 无效
    -  修复`Checkbox` value 为 number 时类型校验报错
    -  修复`Tabs`activeKey 受控无效的问题
    -  修复`Select`Options 动态变化后选相同的 option 时，已选项显示错误问题
    -  `Select` 非 filter 模式 placeholder 无效
    -  `Nav`选中子项，Sub 没有高亮
    -  修复`portal`弹出层 z-index
    -  `Notification` point-event 穿透问题
    -  `porta`l 弹出层在滚动容器内的定位错误问题
-   【style】
    - `Button`样式优化

#### 0.0.1 (2019-05-13)
-   【New Component】
    - 正式发布以下组件 Button、Switch、Pagination、Notification、Tag、Tooltip、Popover、Dropdown、Select、Checkbox、Icon、Toast、DatePicker、Form、Tabs、TimePicker、Radio、Soin、AutoComplete、Slider、Step、Modal、Nav、InputNumber、Input、Grid、ScrollList、Table

