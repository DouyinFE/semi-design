---
category: 生态与帮助
title: Change Log 更新日志
icon: doc-changelog
localeCode: zh-CN
order: 16
brief: 关于 Semi Design For React 优化与更新。我们提供了版本间的 Changelog Diff，你可以通过 hover 版本号唤出 Diff 控件。如果你想查看单个组件的变更历史，可以通过对应组件文档的 版本对比 按钮查看
---

Semi 版本号遵循 **Semver** 规范（主版本号 - 次版本号 - 修订版本号）：
-   主版本号（major）：大版本更新，一般为重大性能/使用变更，允许做 API 级别的 breaking change
-   次版本号（minor）：Semi 固定每两周发布一个 minor 版本，包括以下类型变更：添加了新组件/新 feature，或者设计规范样式更新，或者不合理交互的变更，但不会对组件 API 做删减或功能变更。
-   修订版本号（patch）：仅会进行 bugfix，发布时间不限
-   不同版本间的详细关系，可查阅 [FAQ](/zh-CN/start/faq)


#### 🎉 2.93.0 (2026-03-16)
- 【Feat】
    - TextArea 组件新增行号支持，通过 showLineNumber 属性开启 [#2890](https://github.com/DouyinFE/semi-design/issues/2890) [#3146](https://github.com/DouyinFE/semi-design/pull/3146)
    - AIChatDialogue 组件新增 scrollToTop 方法，支持滚动回到顶部 [#3021](https://github.com/DouyinFE/semi-design/issues/3021) [#3145](https://github.com/DouyinFE/semi-design/pull/3145)
    - AIChatInput 组件新增 showPlaceholderWhenSkillOnly 属性，支持当仅有技能时展示 placeholder [#3086](https://github.com/DouyinFE/semi-design/issues/3086) [#3144](https://github.com/DouyinFE/semi-design/pull/3144)
- 【Chore】
    - semi-foundation package.json exports 新增 lib/cjs 路径映射，支持通过 lib/cjs 路径直接导入

#### 🎉 2.92.2 (2026-03-04)
- 【Fix】
    - 修复 `@douyinfe/semi-ui/react19-adapter` 因 package.json exports 缺少声明导致无法导入的问题
    - 修复 `packages/semi-ui/tsconfig.json` 缺少 `@douyinfe/semi-illustrations` 路径映射导致编译失败的问题

#### 🎉 2.92.1 (2026-03-04)
- 【Fix】
    - 修复 AIChatDialogue PropTypes 与 TypeScript 类型定义不一致的问题 [#3141](https://github.com/DouyinFE/semi-design/pull/3141)

#### 🎉 2.92.0 (2026-03-03)
- 【Feat】
    - 统一 React 19 支持方案，使用 adapter 模式替代双包方案，React 19 用户只需导入 `@douyinfe/semi-ui/react19-adapter` [#3140](https://github.com/DouyinFE/semi-design/pull/3140)
    - AIChatInput 支持通过 renderUploadButton 自定义上传按钮 UI [#3087](https://github.com/DouyinFE/semi-design/issues/3087) [#3139](https://github.com/DouyinFE/semi-design/pull/3139)
    - AIChatInput 支持 onPaste 回调监听输入框粘贴事件 [#3132](https://github.com/DouyinFE/semi-design/issues/3132) [#3137](https://github.com/DouyinFE/semi-design/pull/3137)
    - @douyinfe/semi-next 支持透传 @douyinfe/semi-webpack-plugin 全量 options [#3115](https://github.com/DouyinFE/semi-design/issues/3115) [#3128](https://github.com/DouyinFE/semi-design/pull/3128)
- 【Fix】
    - 修复 AIChatInput 删除附件时未触发 uploadProps.onRemove，且 beforeRemove 无法阻断的问题 [#3100](https://github.com/DouyinFE/semi-design/issues/3100) [#3138](https://github.com/DouyinFE/semi-design/pull/3138)
    - 修复 Upload 组件在受控 fileList 模式下，toggle visible 导致 blob URL 失效的问题 [#3122](https://github.com/DouyinFE/semi-design/issues/3122) [#3130](https://github.com/DouyinFE/semi-design/pull/3130)
    - 修复 MarkdownRender 组件渲染 GFM 单列表格时内容丢失的问题 [#3077](https://github.com/DouyinFE/semi-design/issues/3077) [#3129](https://github.com/DouyinFE/semi-design/pull/3129)

#### 🎉 2.91.0 (2026-02-06)
- 【Fix】
    - 修复 semi-webpack/semi-rspack 正则匹配问题，支持匹配 @douyinfe/semi-ui-19 等带数字后缀包名 [#3127](https://github.com/DouyinFE/semi-design/pull/3127)
- 【Docs】
    - 新增 Claude CLI 安装指南，用于 Semi MCP 配置 [@guowei-gong](https://github.com/guowei-gong) [#3124](https://github.com/DouyinFE/semi-design/pull/3124)

#### 🎉 2.91.0-beta.0 (2026-01-14)
- 【Feat】
    - 新增 Sidebar 组件 [#3104](https://github.com/DouyinFE/semi-design/pull/3104)
- 【Docs】
    - 优化 Button、Select、Checkbox、Input、Radio、Switch、Tabs、Navigation、Cascader、Table、Datepicker、Upload 等 10 枚组件的 token 描述 [#3055](https://github.com/DouyinFE/semi-design/pull/3055)

#### 🎉 2.90.12 (2026-01-13)
- 【Fix】
    - 修复 Select 组件在多选模式下，当 defaultValue 数量超过 max 时，再选择新值 onExceed 回调未被触发的问题
- 【Feat】
    - AudioPlayer 组件新增国际化支持，支持通过 LocaleProvider 配置多语言文案

#### 🎉 2.90.10 (2026-01-08)
- 【Fix】
    - 修复 MarkdownRender 在运行 一些插件的时候报错 async 的问题

#### 🎉 2.90.8 (2026-01-08)
- 【Fix】
    - 修复 UserGuide 在运行 target 函数实际不正确，导致用户在指引不存在 dom 的时候报错的问题 [#3112](https://github.com/DouyinFE/semi-design/issues/3112)

#### 🎉 2.90.1 (2025-12-19)
- 【Chore】
    - 去除 @douyinfe/semi-json-viewer-core 构建产物中的 Optional chaining (?.) [#3103](https://github.com/DouyinFE/semi-design/pull/3103)


#### 🎉 2.90.0 (2025-12-26)
- 【Feat】
    - AIChatInput 新增加 sendHotKey API  [#3098](https://github.com/DouyinFE/semi-design/issues/3098) [#3099](https://github.com/DouyinFE/semi-design/pull/3099)
- 【Chore】
    - AIChatInput 的 placeholder API 增加函数类型支持说明 [#3093](https://github.com/DouyinFE/semi-design/pull/3093)
- 【Style】
    - AIChatInput 的 input-slot 显式设置 box-sizing 为 content-box，避免用户项目中 tailwindCss 引入，或者其他全局样式设置的影响  [#3094](https://github.com/DouyinFE/semi-design/issues/3094) [#3095](https://github.com/DouyinFE/semi-design/pull/3095)
- 【Docs】
    - 数据可视化官网文档更新 [#3092](https://github.com/DouyinFE/semi-design/pull/3092)


#### 🎉 2.89.1 (2025-12-19)
- 【Fix】
    - 修复 AIChatInput 中当 generating 为 true 时，按下 enter 会错误调用 onStopGenerate 回调问题 [#3089](https://github.com/DouyinFE/semi-design/pull/3089)

#### 🎉 2.90.0-beta.0 (2025-12-15)
- 【Feat】
    - AIChatInput 新增加 showUploadButton API 用于控制是否展示上传按钮 [#3073](https://github.com/DouyinFE/semi-design/pull/3073)
    - AIChatInput 中的 Configure.Mcp 新增加 showConfigure API 用于设置是否显示配置按钮 [#3059](https://github.com/DouyinFE/semi-design/issues/3059)
    - AIChatInput 新增加 keepSkillAfterSend 用于设置是否在发送时候删除技能 [#3046](https://github.com/DouyinFE/semi-design/pull/3046)
    - AIChatInput 新增加 immediatelyRender API [#3056](https://github.com/DouyinFE/semi-design/issues/3056) 
    - Chat 组件新增加 canSend API [#3063](https://github.com/DouyinFE/semi-design/pull/3063)
    - TagInput 支持 split API 用于支持用户自定义分隔符处理函数 [#2983](https://github.com/DouyinFE/semi-design/issues/2983)
- 【Fix】
    - 修复在 vite 项目中使用 AIChatDialogue 组件报错 "Prism is not defined" 问题 [#3085](https://github.com/DouyinFE/semi-design/pull/3085)
    - 修复多层 Table 嵌套时候，外层 Table 的 bordered 设置为 true 导致内层 Table 也有边框问题 [#3082](https://github.com/DouyinFE/semi-design/issues/3082) 
- 【Docs】
    - 修正 Feedback API 列表参数类型错误[@yihouhgz](https://github.com/yihouhgz) [#3081](https://github.com/DouyinFE/semi-design/pull/3081)

#### 🎉 2.89.0 (2025-12-05)
- 【Fix】
    - 修复向空的 inputSlot 中粘贴内容时候，仅粘贴了文本，无 inputSlot 样式问题  [#3049](https://github.com/DouyinFE/semi-design/issues/3049) [#3050](https://github.com/DouyinFE/semi-design/pull/3050)
    - 修复当选中 inputSlot 中的所有内容并粘贴 nearing 时候，仅粘贴了文本，无 inputSlot 样式问题   [#3049](https://github.com/DouyinFE/semi-design/issues/3049) [#3050](https://github.com/DouyinFE/semi-design/pull/3050)
    - 修复 semi-theme-loader 在用户自定义主题的 custom.css 中有 body 选择器时，custom.css 中的内容未生效问题 [#3078](https://github.com/DouyinFE/semi-design/pull/3078)
    - 修复 React v19 下 Toast/Notification 首次调用可能出现 TypeError 的问题 [#3053](https://github.com/DouyinFE/semi-design/pull/3053)
    - 修复 AIChatDialogue renderDialogueTitle 未返回 message 参数问题 [#3068](https://github.com/DouyinFE/semi-design/pull/3068)
    - 修复 VideoPlayer 自动播放时仍旧显示暂停图标问题 [#3072](https://github.com/DouyinFE/semi-design/pull/3072)
- 【Chore】
    - 修复  AIChatInput 的 extensions API 类型错误问题 [#3048](https://github.com/DouyinFE/semi-design/pull/3048)

#### 🎉 2.89.0-beta.0 (2025-12-01)
- 【Fix】
    - 修复 JsonViewer RequestIdleCallback 在 Safari 浏览器不兼容问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#3054](https://github.com/DouyinFE/semi-design/pull/3054)
    - 修复 FloatButtonGroup 未传入 onClick 时，点击出现 TypeError 问题 [#3052](https://github.com/DouyinFE/semi-design/pull/3052)

#### 🎉 2.88.3 (2025-11-24)
- 【Fix】
    - 修复 AIChatInput 中 setContentWhileSaveTool 方法调用后结果不正确问题  [#3040](https://github.com/DouyinFE/semi-design/issues/3040)
    - 修复当通过 setContent 设置内容时，如果 skillSlot 的 html 字符串参数中间有空格时候，参数解析仅保留空格前内容问题  [#3040](https://github.com/DouyinFE/semi-design/issues/3040)
    - 修复 AIChatInput 的自定义扩展的 addPasteRules 不生效问题。[#3042](https://github.com/DouyinFE/semi-design/pull/3042)
    - 修复 AIChatInput 在删除上传文件时候，未触发 onUploadChange 回调问题 [#3044](https://github.com/DouyinFE/semi-design/pull/3044)
    - 修复 FloatButtonGroup 中点击项目未触发 onClick 问题 [#3043](https://github.com/DouyinFE/semi-design/pull/3043)
    - 修复 InputNumber 在设置小数步长时，进退位计算精度不正确问题 [#3026](https://github.com/DouyinFE/semi-design/pull/3026)
- 【Chore】
    - 修复 DragMove 类型定义错误问题 [#3022](https://github.com/DouyinFE/semi-design/issues/3022)

#### 🎉 2.88.2 (2025-11-18)
- 【Fix】
    - 修复在 React v19 下 Semi 组件内 Tooltip 的使用问题 [#2743](https://github.com/DouyinFE/semi-design/issues/2743) [#3039](https://github.com/DouyinFE/semi-design/pull/3039)

#### 🎉 2.88.1 (2025-11-17)
- 【Docs】
    - 增加 React v19 适配文档 [#3028](https://github.com/DouyinFE/semi-design/pull/3028)
- 【Feat】
    - 新增适配 React v19 逻辑的包 @douyinfe/semi-ui-19 [#2996](https://github.com/DouyinFE/semi-design/pull/2996)
- 【Fix】
    - 修复 Chat 的输入框中无上传失败提示 [#3035](https://github.com/DouyinFE/semi-design/pull/3035)
    - 修复 Chat 的输入框中上传文件还未完成就允许发送 [#3035](https://github.com/DouyinFE/semi-design/pull/3035)
    - 修复 AIChatInput 的发送热键和子定义扩展的热键冲突问题 [#3033](https://github.com/DouyinFE/semi-design/issues/3033) [#3034](https://github.com/DouyinFE/semi-design/pull/3034)

#### 🎉 2.88.0 (2025-11-12)
- 【Fix】
    - 修复  AIChatInput 中 defaultContent 类型定义错误问题 [#3027](https://github.com/DouyinFE/semi-design/pull/3027)
    - 修复 AIChatInput 中技能变化时候，onSkillChange 未生效问题 [#3027](https://github.com/DouyinFE/semi-design/pull/3027)
    - 修复 AIChatInput 中 onContentChange 转换结果中，无 skillSlot 数据问题 [#3027](https://github.com/DouyinFE/semi-design/pull/3027)
    - 更新 chatInputToChatCompletion 返回值以适应用户使用情况 [#3024](https://github.com/DouyinFE/semi-design/pull/3024)
    - 将 AIChatDialogue 和 AIChatInput 所有接口定义在组件 index 文件中导出 [#3024](https://github.com/DouyinFE/semi-design/pull/3024)
    - 修复 Chat 组件的返回底部按钮在 Chat 尺寸变化后不需要显示时还可见问题 [#2999](https://github.com/DouyinFE/semi-design/pull/2999)
    -  完善 semi-extract-css-content-loader 中的纯 css 内容抽取逻辑 [#3014](https://github.com/DouyinFE/semi-design/pull/3014)
- 【Style】
    - 设置 Image 中所有的 img 节点的 max-width 为 none，避免同时使用 tailwind 时放大显示错误问题 [#3015](https://github.com/DouyinFE/semi-design/pull/3015)
    - 设置 Cropper 中的 img 的 max-width 为 none，避免 tailwindCSS 中对 img 的 max-width 设置影响 Cropper 样式 [#3011](https://github.com/DouyinFE/semi-design/pull/3011)
- 【Chore】
    - Radio/RadioGroup 的 value/defaultValue 增加 boolean 类型 [#3019](https://github.com/DouyinFE/semi-design/pull/3019)

#### 🎉 2.88.0-beta.1 (2025-11-10)
- 【Feat】
    - 新增加 IconRealSize 等 10 个线性图标，IconScissorsStroked 等 33 个面性图标。 [#3016](https://github.com/DouyinFE/semi-design/pull/3016)
    - 新增阿塞拜疆 (az)、保加利亚 (bg)、加泰罗尼亚 (ca)、捷克 (cs_CZ)、宿务 (ceb_PH)、丹麦 (da)、希腊 (el_GR)、西班牙（拉美）(es_419)、爱沙尼亚 (et)、波斯 (fa_IR)、菲律宾 (fil_PH)、芬兰 (fi_FI)、法语（加）(fr_CA)、爱尔兰 (ga)、希伯来 (he_IL)、印地 (hi_IN)、克罗地亚 (hr)、匈牙利 (hu_HU)、冰岛 (is)、爪哇 (jv_ID)、哈萨克 (kk)、高棉 (km_KH)、立陶宛 (lt)、拉脱维亚 (lv)、缅甸 (my_MM)、挪威 (nb)、葡萄牙 (pt)、斯洛伐克 (sk)、斯洛文尼亚 (sl)、阿尔巴尼亚 (sq)、斯瓦希里 (sw)、乌克兰 (uk_UA)、乌尔都 (ur)、乌兹别克 (uz) 等 34 种语言翻译 [#3018](https://github.com/DouyinFE/semi-design/pull/3018)
- 【Style】
    - 修改 IconHourglass 图标，UI 样式有变化 [#3016](https://github.com/DouyinFE/semi-design/pull/3016)

#### 🎉 2.88.0-beta.0 (2025-10-30)
- 【New Component】
    - 新增 AI 聊天输入框组件 AIChatInput [#2997](https://github.com/DouyinFE/semi-design/pull/2997)
    - 新增 AI 聊天对话组件 AIChatDialogue [#2997](https://github.com/DouyinFE/semi-design/pull/2997)
    - 新增悬浮按钮组件 FloatButton [#2997](https://github.com/DouyinFE/semi-design/pull/2997)
    - 新增反馈组件 Feedback [#2997](https://github.com/DouyinFE/semi-design/pull/2997)
- 【Feat】
    - 新增 AI Token，AI ICON [#2997](https://github.com/DouyinFE/semi-design/pull/2997)
    - Tag/Button 新增加 colorful API [#2997](https://github.com/DouyinFE/semi-design/pull/2997)

#### 🎉 2.87.1 (2025-10-16)
- 【Fix】
    - 修复部分 chrome V140，141 版本中，Tree/TreeSelect 在收起后，再次展开出现错误问题 [#3005](https://github.com/DouyinFE/semi-design/issues/3005)
    - 修复部分 chrome V140，141 版本中，Collapsible 收起动画不生效问题 [#3006](https://github.com/DouyinFE/semi-design/pull/3006)

#### 🎉 2.87.0 (2025-10-15)
- 【Style】
    - Dropdown, Modal, SideSheet, Popover, Tooltip 增加 backdrop-filter 设置相关 token [#2981](https://github.com/DouyinFE/semi-design/issues/2981) [#2985](https://github.com/DouyinFE/semi-design/pull/2985)

#### 🎉 2.87.0-beta.0 (2025-09-08)
- 【Fix】
    - JsonViewer 键盘事件兼容 window [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2979](https://github.com/DouyinFE/semi-design/pull/2979)


#### 🎉 2.86.0 (2025-09-01)
- 【Fix】
    - 修复 Folding Model 初始化问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2972](https://github.com/DouyinFE/semi-design/pull/2972)
    - 修复自定义主题传入 prefix JsonViewer 样式丢失问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2926](https://github.com/DouyinFE/semi-design/pull/2926)
    - 修复多选，可搜索的 Cascader 在内容太长时，内容未正确缩略问题 [#2967](https://github.com/DouyinFE/semi-design/issues/2967) [#2970](https://github.com/DouyinFE/semi-design/pull/2970)
    - 修复 TagInput 中可拖拽的 tag 在内容太长时，内容未正确缩略问题 [#2970](https://github.com/DouyinFE/semi-design/pull/2970)
    - 修复 TreeSelect 在 disabled 情况下，点击会有意外的聚焦样式问题 [#2968](https://github.com/DouyinFE/semi-design/issues/2968) [#2969](https://github.com/DouyinFE/semi-design/pull/2969)
- 【Style】
    - 增加禁用态的 TagInput 的背景色 token，$color-tagInput_disabled-bg [#2973](https://github.com/DouyinFE/semi-design/pull/2973)

#### 🎉 2.86.0-beta.0 (2025-08-19)
- 【Fix】
    - 修复 InputNumber 组件透传 props 时过滤 currency/内部参数，避免 defaultCurrency 等污染原生 DOM 属性 [#2961](https://github.com/DouyinFE/semi-design/pull/2961)

#### 🎉 2.85.0 (2025-08-11)
- 【Fix】
    - 修复 light 主题 Badge 单独使用时样式不符合预期问题 [#2929](https://github.com/DouyinFE/semi-design/issues/2929) [#2930](https://github.com/DouyinFE/semi-design/pull/2930)
    - 修复 AutoComplete 在 data 更新后，在有搜索的情况下，没有高亮匹配项问题 [AutoComplete] data 更新后，在有搜索的情况下，没有高亮匹配项，按回车会出现 [#2952](https://github.com/DouyinFE/semi-design/pull/2952)
    - 修复 Table 中 fixed 列在 hover 时候，无 hover 背景色问题，影响版本 2.79.0-2.84.0 [#2953](https://github.com/DouyinFE/semi-design/pull/2953)


#### 🎉 2.85.0-beta.0 (2025-08-05)
- 【Feat】
    - Input/TextArea 增加 onCompositionStart/onCompositionEnd/onCompositionUpdate 的回调 [#2922](https://github.com/DouyinFE/semi-design/pull/2922)
    - semi webpack 和 rspack 插件在 sass-loader 中添加内置 silenceDeprecations 选项（'import', 'legacy-js-api', 'global-builtin'）静默 sass 相关的弃用警告 [#2944](https://github.com/DouyinFE/semi-design/pull/2944)
    - Image 组件增加 renderCloseIcon/renderLeftIcon/renderRightIcon API [@rubbishmaker](https://github.com/rubbishmaker) [#2919](https://github.com/DouyinFE/semi-design/pull/2919)
- 【Fix】
    - 修复 tooltip 在某些场景有 updateState warning 的问题 [#2682](https://github.com/DouyinFE/semi-design/issues/2682) [#2928](https://github.com/DouyinFE/semi-design/pull/2928)
    - 修复 JsonViewer 错误信息不展示问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2943](https://github.com/DouyinFE/semi-design/pull/2943)


#### 🎉 2.84.0 (2025-07-29)
- 【Fix】
    - 修复 InputNumber 因为 js 精度计算有误问题 [#2937](https://github.com/DouyinFE/semi-design/pull/2937)
    - 修复 Slider 在可滚动条件下点击或者拖动方式更新 handle 位置不正确问题 [#2932](https://github.com/DouyinFE/semi-design/pull/2932)
- 【Style】
    - 修复 type 为 solid，color 为 white 的 Tag 的关闭图标颜色错误问题 [#2935](https://github.com/DouyinFE/semi-design/pull/2935)

#### 🎉 2.84.0-beta.0 (2025-07-21)
- 【Fix】
    - 修复 collapsible Tabs 导致未在视口内触发的页面异常滚动行为 [#2918](https://github.com/DouyinFE/semi-design/pull/2918)
- 【Feat】
    - 支持配置全局的 Spin 的指示器，新增 $animation_duration-button_icon_loading，$animation_duration-button_icon_customIcon_loading 设计 token 用于配置 button 中不同类型的 loading 的动画时长   [#2695 ](https://github.com/DouyinFE/semi-design/issues/2695) [#2897](https://github.com/DouyinFE/semi-design/pull/2897)
    
#### 🎉 2.83.0 (2025-07-14)
- 【Fix】
    - 修复 JsonViewer 全选删除后继续删除报错问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2896](https://github.com/DouyinFE/semi-design/pull/2896)
    - 修复 JsonViewer 始光标删除行为报错问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2896](https://github.com/DouyinFE/semi-design/pull/2896)
    - 修复 JsonViewer 选区边界问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2896](https://github.com/DouyinFE/semi-design/pull/2896)
    - 修复 JsonViewer 代码补全无法点击问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2896](https://github.com/DouyinFE/semi-design/pull/2896)
    - 修复 JsonViewer 代码补全布尔类型提示问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2896](https://github.com/DouyinFE/semi-design/pull/2896)
    - 修复 JsonViewer 拖动选择复制删除不完全问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2896](https://github.com/DouyinFE/semi-design/pull/2896)
    - 修复 Modal 中的 height 设置未生效问题，影响版本 2.82.0-2.82.1  [#2899 ](https://github.com/DouyinFE/semi-design/issues/2899) [#2901](https://github.com/DouyinFE/semi-design/pull/2901)


#### 🎉 2.83.0-beta.0 (2025-07-09)
- 【Style】
    - 修复 BreadCrumb 的 item 在 noLink 模式下的样式问题 [#2883](https://github.com/DouyinFE/semi-design/issues/2883) [#2884](https://github.com/DouyinFE/semi-design/pull/2884)

#### 🎉 2.82.1 (2025-07-02)
- 【Fix】
    - 修复 Modal 在 fullScreen 为 true 时候，并没有铺满整个屏幕问题。影响版本：v2.82.0  [#2880](https://github.com/DouyinFE/semi-design/issues/2880) [#2881](https://github.com/DouyinFE/semi-design/pull/2881)
- 【Style】
    - Input 的 placeholder 长度超出时候，省略超出长度的内容  [#2869](https://github.com/DouyinFE/semi-design/issues/2869) [#2872](https://github.com/DouyinFE/semi-design/pull/2872)


#### 🎉 2.82.0 (2025-06-27)
- 【Style】
    - 修复 Select 在 multiple/small 尺寸时候，如果 border 的 token 设置不为 1，则最小高度会不正确问题。废弃默认尺寸最小宽度设置 token $height-select_multiple_content_wrapper-minHeight   [#2877](https://github.com/DouyinFE/semi-design/issues/2877) [#2878](https://github.com/DouyinFE/semi-design/pull/2878)

#### 🎉 2.82.0-beta.0 (2025-06-23)
- 【Feat】
    - Modal 支持 modalRender 参数自定义渲染弹窗 [#2655](https://github.com/DouyinFE/semi-design/issues/2655)
- 【Fix】
  - 修复 DatePicker 在 monthRange 且多语言情况下，点击月份无法自动滚动到非禁用项问题  [#2870](https://github.com/DouyinFE/semi-design/issues/2870) [#2871](https://github.com/DouyinFE/semi-design/pull/2871)

#### 🎉 2.81.0 (2025-06-16)
- 【Fix】
    - 修复 Input、TextArea 组件在同时设置 maxLength 和 getValueLength 时候，中文输入会在未输入完成时候被截断 [#2858](https://github.com/DouyinFE/semi-design/issues/2858) [#2859](https://github.com/DouyinFE/semi-design/pull/2859)
- 【Style】
    - 对于范围类型的 DatePicker，增加其中设置的 hover/active 状态下的 input 背景色的优先级 [#2856](https://github.com/DouyinFE/semi-design/pull/2856)
- 【Design Token】
    - 增加 $color-button_disabled_outline_text-default 用于设置边框模式的 Button 的禁用状态文字颜色  [#2861](https://github.com/DouyinFE/semi-design/issues/2861) [#2857](https://github.com/DouyinFE/semi-design/pull/2857)


#### 🎉 2.81.0-beta.0 (2025-06-10)
- 【Style】
    - 调整 range 类型的 DatePicker 中 input-wrapper 层的高度，让内容居中 [#2855](https://github.com/DouyinFE/semi-design/pull/2855)
- 【Fix】
    - 修复 Select 在分组 label 为 ReactNode 的情况下，filter 后 optionList 展示有误问题 [#2854](https://github.com/DouyinFE/semi-design/pull/2854)
    - 修改 Tooltip 中获取 container 的 position 时机，提升组件初始化的性能 [#2841](https://github.com/DouyinFE/semi-design/pull/2841)

#### 🎉 2.80.0 (2025-05-19)
- 【Fix】
    - 修复单选，受控 value 且 value 为 undefined，异步加载，showNext 为 hover 的 cascader 在同时加载多个项目时的显示问题  [#2831](https://github.com/DouyinFE/semi-design/issues/2831) [#2832](https://github.com/DouyinFE/semi-design/pull/2832)

#### 🎉 2.80.0-beta.0 (2025-05-14)
- 【Feat】
    - 新增 VideoPlayer 组件 [#2822](https://github.com/DouyinFE/semi-design/pull/2822)

#### 🎉 2.79.0 (2025-05-08)
- 【Feat】
    - Upload 添加文件名超长时弹出文件名提示功能 [@yatbfm](https://github.com/yatbfm) [#2753](https://github.com/DouyinFE/semi-design/pull/2753)
- 【Fix】
    - 修复 Switch 组件 loading 加 disabled 态 hover 后样式问题 [@LonelySnowman](https://github.com/LonelySnowman) [#2778](https://github.com/DouyinFE/semi-design/pull/2778)
    - 修复 Table 组件在 onHeaderCell 中通过 style 设置表头背景色时候，fixed 表头中不生效问题 [#2814](https://github.com/DouyinFE/semi-design/issues/2814)
- 【Style】
    - Dropdown 增加 $radius-dropdown_item token 用于设置面板中的各选项圆角 [#2817](https://github.com/DouyinFE/semi-design/pull/2817)
    - ScrollList 最外层增加 overflow: hidden 的样式设置 [#2818](https://github.com/DouyinFE/semi-design/pull/2818)
    - 修复禁用，选中的 Checkbox 组件内部的对勾在悬停状态时，颜色未受到正确 token 控制问题 [#2819](https://github.com/DouyinFE/semi-design/pull/2819)
    - 增加 $color-radio_checked-icon-disabled token 用于允许用户配置选中，禁用状态下的 Radio 的原点颜色 [#2820](https://github.com/DouyinFE/semi-design/pull/2820)
- 【Chore】
    - Webpack/Rspack 插件的 web components loader 增加其他组件的样式插入支持。增加的组件为 AudioPlayer，Chat，CodeHighlight，ColorPicker，Cropper，HotKeys，JsonViewer，MarkdownRender，PinCode，Resizable，UserGuide，ButtonGroup，SplitButton，List，TimePicker。[#2812](https://github.com/DouyinFE/semi-design/pull/2812)
    - 当 Tree 组件 key 错传为 number 时抛出 warning [@LonelySnowman](https://github.com/LonelySnowman) [#2773](https://github.com/DouyinFE/semi-design/pull/2773)


#### 🎉 2.79.0-beta.0 (2025-04-23)
- 【Style】
    - 修改 Progress 中背景色和进度颜色的实现方式，保证主题配置生效 [#2808](https://github.com/DouyinFE/semi-design/pull/2808)
    - 修复 Chat 内容区域的宽度被内容中的 table 撑开，滚动区域为整条内容的问题，修改后滚动区域在 table 内部  [#2776](https://github.com/DouyinFE/semi-design/issues/2776) [#2775](https://github.com/DouyinFE/semi-design/pull/2775)
- 【Design Token】
    - Chat 增加 $width-chat_chatBox_avatar 用于设置头像宽度 [#2775](https://github.com/DouyinFE/semi-design/pull/2775)
    - 增加 Cascader 在大尺寸/小尺寸下的内边距 token 设置，包括$spacing-cascader_small_selection-paddingLeft，$spacing-cascader_small_selection-paddingRight 等 token [#2809](https://github.com/DouyinFE/semi-design/pull/2809)
    - 增加 Button 在小尺寸/大尺寸上的字体设置 token，包括$font-button_small-fontSize， $font-button_small-lineHeight，$font-button_small-fontWeight 等 token [#2809](https://github.com/DouyinFE/semi-design/pull/2809)
    - 修改 Popover 中箭头的背景色和边框颜色的实现方式，保证在 DSM 配置中可以通过主题配置的方式修改 Popover 的箭头的背景色和边框颜色。新增加 $color-popover-arrow-border, $color-popover-arrow-bg 两个和箭头相关的 Token。 [#2806](https://github.com/DouyinFE/semi-design/pull/2806)
    - 增加 inputNumber 在 innerButton 模式下步进器的圆角 token $radius-inputNumber_inner [#2809](https://github.com/DouyinFE/semi-design/pull/2809)
- 【Fix】
    - 修复在排序热区为整个表头时候，在伸缩结束后，会触发意外的排序问题  [#2802](https://github.com/DouyinFE/semi-design/issues/2802) [#2803](https://github.com/DouyinFE/semi-design/pull/2803)

#### 🎉 2.78.0 (2025-04-08)
- 【Fix】
    - BackTop 组件的 target 不存在时候的兜底操作，避免 TypeError [#2786](https://github.com/DouyinFE/semi-design/pull/2786)
    - 修复 Chat 组件在解析消息的 content 为数组的文本内容时，markdownRenderProps 未生效问题 [#2794](https://github.com/DouyinFE/semi-design/pull/2794)
    - 修复 Collapse Tabs 初次加载无法将 activeTab 滚动到视口内问题 [#2787](https://github.com/DouyinFE/semi-design/pull/2787)
- 【Style】
    - 修复 Table 中具有排序的表头单元格在明暗切换时候的闪动 [#2795](https://github.com/DouyinFE/semi-design/pull/2795)
- 【Design Token】
    - ScrollList 新增 $color-scrollList_header-bg 用于控制 header 颜色 [#2789](https://github.com/DouyinFE/semi-design/pull/2789)

#### 🎉 2.78.0-beta.0 (2025-04-01)
- 【Feat】
    - Cropper 增加 preview API 用于支持实时预览裁切效果  [#2783](https://github.com/DouyinFE/semi-design/issues/2783)
#### 🎉 2.77.0 (2025-03-25)
- 【Fix】
    - 修复 UserGuide 在气泡模式下点击穿透的问题 [#2764](https://github.com/DouyinFE/semi-design/pull/2764)
    - 修复 Navigation 的 header 的图标在收起模式下没有居中问题  [#2675](https://github.com/DouyinFE/semi-design/issues/2675)
    - 修复 JsonViewer 搜索框未支持 i18n 多语言适配的问题 [#2766](https://github.com/DouyinFE/semi-design/pull/2766)
    - 修复 JsonViewer 不开启自动换行时长文本折叠问题，修复行号展示问题 [#2756](https://github.com/DouyinFE/semi-design/pull/2756)

#### 🎉 2.77.0-beta.0 (2025-03-18)
- 【New Component】
    - 新增新手引导组件 UserGuide [#2733](https://github.com/DouyinFE/semi-design/pull/2733)
- 【Feat】
    - InputNumber 支持货币模式 [#2742](https://github.com/DouyinFE/semi-design/pull/2742)
- 【Fix】
    - 修复了当 MarkdownRender 中的默认表格 table，使用 JSX 组件的标题 或 标题使用加粗，数量≥2，会出现后面列覆盖前面列的情况。 [@ByteLan](https://github.com/ByteLan) [#2746](https://github.com/DouyinFE/semi-design/pull/2746)
    - 更正荷兰、波兰和瑞典国家的 locale code（nl_NL -> nl-NL，pl_PL -> pl-PL，sv_SE -> sv-SE）[#2742](https://github.com/DouyinFE/semi-design/pull/2742)

#### 🎉 2.76.1 (2025-03-17)
- 【Style】
    - Style: 对输入类型的组件，insetLabel 和 prefix 的样式保持一致。删除 insetLabel 相关不必要的 token, 增加 $font-cascader_prefix_suffix_fontWeight，$spacing-input_prefix_suffix-marginX，$font-input_prefix_suffix-fontWeight，$font-select_prefix_suffix-fontWeight，$spacing-tagInput_prefix_suffix-marginX，$font-tagInput_prefix_suffix-fontWeight， $font-treeSelect_prefix_suffix_fontWeight 用于管理前后缀字重，外边距。[BUG] 统一 prefix/suffix和insetLabel 的 token [#2752](https://github.com/DouyinFE/semi-design/issues/2752)

#### 🎉 2.76.0 (2025-03-07)
- 【Fix】
    - 修复 JsonViewer 类型错误问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2748](https://github.com/DouyinFE/semi-design/pull/2748)

#### 🎉 2.76.0-beta.0 (2025-03-04)
- 【Feat】
    - Chat 支持 enableUpload API 用于支持用户设置上传行为  [#2735](https://github.com/DouyinFE/semi-design/issues/2735) [#2739](https://github.com/DouyinFE/semi-design/pull/2739)
    - 允许 RadioGroup options 传入 addonStyles/addonClassName/addonId/extraId 选项至 Radio 组件 [@SaltyfishEd](https://github.com/SaltyfishEd) [#2706](https://github.com/DouyinFE/semi-design/pull/2706)
    - JsonViewer 新增自定义渲染功能 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2676](https://github.com/DouyinFE/semi-design/pull/2676)
- 【Fix】
    - Nav 新增选择器样式为 renderWrapper 场景提供 hover 样式 [#2691](https://github.com/DouyinFE/semi-design/pull/2691)
    - 修复 JsonViewer 搜索框弹出位置 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2738](https://github.com/DouyinFE/semi-design/pull/2738)
    - 修复 TimePicker 在不填默认值的情况下，不同时区用户打开模版选中的默认值不同问题 [#2727](https://github.com/DouyinFE/semi-design/pull/2727)
    - 修复 Nav.item 传入非建议属性 children 不提示 ts 报错问题 [#2711](https://github.com/DouyinFE/semi-design/pull/2711)
- 【Style】
    - 修复在 Chat 组件的对话框操作按钮间隔错误问题（影响版本 2.71.1-2.75.0） [#2739](https://github.com/DouyinFE/semi-design/pull/2739)
    - 修改 Cascader 默认的空数据展示样式，和 TreeSelect/Select 保持一致  [#2703](https://github.com/DouyinFE/semi-design/issues/2703) [#2725](https://github.com/DouyinFE/semi-design/pull/2725)


#### 🎉 2.75.0 (2025-02-21)
- 【Design Token】
    - Select 新增 $color-select_prefix_suffix_text-default，Cascader 新增 $color-cascader_prefix_suffix_text-default，TreeSelect 新增 $color-treeSelect_prefix_text-default 用于控制控制前后缀颜色。另外，将前后缀的 font-size 和 font-weight 的设置和 insetLabal 的设置保持统一（**注意：修改前后样式有变化**） [#2721](https://github.com/DouyinFE/semi-design/issues/2721)
- 【Fix】
    - 修复 Chrome v133 版本无障碍渲染 aria 属性 Bug 导致的点击 DatePicker 月份选择器后 Chrome 崩溃问题 [#2723](https://github.com/DouyinFE/semi-design/pull/2723)
    - 修复 Resizable 无法在触摸屏使用问题 [#2697](https://github.com/DouyinFE/semi-design/issues/2697) [#2712](https://github.com/DouyinFE/semi-design/pull/2712)
    - 去除 Typography 中过时 React 语法 ReactDOM.render() 的使用，改为其他方式清空用于测试合适省略长度的容器  [#2699](https://github.com/DouyinFE/semi-design/issues/2699)
    - 修复 Form 使用 formApi.scrollToField 时，若页面存在多个 Form，且 Field 同名时，仅可滚动到首个同名 Field DOM 的问题 [#2719](https://github.com/DouyinFE/semi-design/pull/2719)
    - 修复 Form.InputGroup 仅配置 extraText，未配置 extraPosition 时，extraText 未能正确显示的问题 [#2719](https://github.com/DouyinFE/semi-design/pull/2719)
- 【Chore】
    - 修复 Form formApi.scrollToError TS 类型定义错误的问题 [#2719](https://github.com/DouyinFE/semi-design/pull/2719)

#### 🎉 2.75.0-beta.1 (2025-02-19)
- 【Docs】
    - List 组件拖拽 Demo 更新为用 dnd-kit 实现 [#2717](https://github.com/DouyinFE/semi-design/pull/2717)
- 【Feat】
    - Upload 在图片墙场景下添加 renderPicClose 用于自定义关闭图标 [#2714](https://github.com/DouyinFE/semi-design/pull/2714)
    - Tree/TreeSelect 支持 expandIcon API 用于自定义展开图标  [#2704](https://github.com/DouyinFE/semi-design/issues/2704) 
- 【Fix】
    - 修复 Pagination 的页容量切换器在多语言场景无法切换语言问题  [#2696 ](https://github.com/DouyinFE/semi-design/issues/2696) [#2698](https://github.com/DouyinFE/semi-design/pull/2698)
    - 修复 PinCode 组件 format='number' 情况下，iOS 端输入被打断问题（输入一个数字后，自动从数字/字符键盘切换到字母键盘） [@SaltyfishEd](https://github.com/SaltyfishEd) [#2702](https://github.com/DouyinFE/semi-design/pull/2702)

#### 🎉 2.74.0 (2025-02-07)
- 【Fix】
    - 修复 List 组件 dataSource 为空时被 Spin 组件遮挡问题 [@LonelySnowman](https://github.com/LonelySnowman) [#2693](https://github.com/DouyinFE/semi-design/pull/2693)
    - 修复 TreeSelect 在开启搜索并且 treeData 为 undefined 时，关闭面板时候的 TypeError [#2694](https://github.com/DouyinFE/semi-design/pull/2694)
    - 修复类型为 basic 的 Steps icon 和 title 未与 line 居中对齐问题  [#2688](https://github.com/DouyinFE/semi-design/issues/2688) [#2689](https://github.com/DouyinFE/semi-design/pull/2689)
    - 修复单选，可搜索的 Select 在面板打开状态下失去焦点后，无法再次通过点击 trigger 聚焦问题 [#2668](https://github.com/DouyinFE/semi-design/pull/2668)
    - 修复 AudioPlayer 倍速弹出层样式白边问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2685](https://github.com/DouyinFE/semi-design/pull/2685)
    - AudioPlay 组件内部 ref 使用修改，兼容其他框架[@rashagu](https://github.com/rashagu) [#2673](https://github.com/DouyinFE/semi-design/pull/2673)

#### 🎉 2.74.0-beta.0 (2025-01-20)
- 【Feat】
  - Chat 组件支持 markdownRenderProps API，用于设置对话渲染的 MarkdownRender 组件  [#2640 ](https://github.com/DouyinFE/semi-design/issues/2640) [#2679](https://github.com/DouyinFE/semi-design/pull/2679)
- 【Fix】
  - 修复 JsonViewer 输入小写 z 无效的问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2680](https://github.com/DouyinFE/semi-design/pull/2680)

#### 🎉 2.73.0 (2025-01-13)
- 【Fix】
    - 修复 JsonViewer 未配置默认参数问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2670](https://github.com/DouyinFE/semi-design/pull/2670)
    - 修复 JsonViewer 是否重新 init 的判断条件 [@rashagu](https://github.com/rashagu) [#2667](https://github.com/DouyinFE/semi-design/pull/2667)

#### 🎉 2.73.0-beta.0 (2025-01-07)
- 【New Component】
    - 新增 AudioPlayer 音频播放器组件 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2650](https://github.com/DouyinFE/semi-design/pull/2650)
    - 新增 Cropper 图片裁切组件 [#2642](https://github.com/DouyinFE/semi-design/pull/2642)
- 【Feat】
    - JsonViewer 新增只读模式 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2658](https://github.com/DouyinFE/semi-design/pull/2658)
    - JsonViewer 支持隐藏搜索 Icon [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2658](https://github.com/DouyinFE/semi-design/pull/2658)
    - JsonViewer 新增 Json 格式错误信息提示功能 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2638](https://github.com/DouyinFE/semi-design/pull/2638)
    - JsonViewer Core 包热更新问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2638](https://github.com/DouyinFE/semi-design/pull/2638)
- 【Fix】
    - 修复 JsonViewer 点击非内容区域下光标问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2658](https://github.com/DouyinFE/semi-design/pull/2658)
    - 修复 JsonViewer 自动缩进后光标问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2658](https://github.com/DouyinFE/semi-design/pull/2658)
    - 修复 JsonViewer 折叠后复制内容缺失问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2658](https://github.com/DouyinFE/semi-design/pull/2658)
    - 修复 JsonViewer 搜索框中文输入法输入问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2651](https://github.com/DouyinFE/semi-design/pull/2651)
    - 修复 JsonViewer Undo&Redo 文本模型不同步问题 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2638](https://github.com/DouyinFE/semi-design/pull/2638)
    - 修复 DragMove 中设置 handler 后，DragMove 的子元素仍然可以被拖动问题  [#2661 ](https://github.com/DouyinFE/semi-design/issues/2661) [#2662](https://github.com/DouyinFE/semi-design/pull/2662)
    - 修复 Button 在项目内不存在 Spin 组件时 Loading 的显示问题 [#2664](https://github.com/DouyinFE/semi-design/pull/2664)
- 【Chore】
    - JsonViewer 重构折叠模型底层数据结构 [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2658](https://github.com/DouyinFE/semi-design/pull/2658)
    - 新增 JsonViewer E2E 测试  [@anjiazhuyouxing](https://github.com/anjiazhuyouxing) [#2626](https://github.com/DouyinFE/semi-design/pull/2626)

#### 🎉 2.72.2 (2025-01-06)
- 【Fix】
    - 修复 Cascader 的 placeHolder，searchPlaceholder 无法动态更新问题 [#2663](https://github.com/DouyinFE/semi-design/pull/2663)

#### 🎉 2.72.1 (2025-01-02)
- 【Fix】
    - 修复在 display 为 none 时，Typography 的 JS 省略计算错误问题 [#2656](https://github.com/DouyinFE/semi-design/pull/2656)

#### 🎉 2.72.0 (2024-12-20)
- 【Fix】
  - 修复 JsonViewer 使用中文输入法错误的问题 [#2616](https://github.com/DouyinFE/semi-design/pull/2616)
  - 修复 代码提示框点击无法隐藏的问题 [#2616](https://github.com/DouyinFE/semi-design/pull/2616)
  - 修复多次回车导致的渲染问题 [#2616](https://github.com/DouyinFE/semi-design/pull/2616)
  - 修复滚动条显示异常的问题 [#2623](https://github.com/DouyinFE/semi-design/pull/2623)

#### 🎉 2.72.0-beta.0 (2024-12-16)
- 【Feat】
    - Table onChange 新增 extra.changeType API，用于表示 change 类型  [#1238](https://github.com/DouyinFE/semi-design/issues/1238) [#2617](https://github.com/DouyinFE/semi-design/pull/2617)
- 【Fix】
    - 修复 Carousel 在 children 中渲染 state 的值不更新问题 [#2634](https://github.com/DouyinFE/semi-design/pull/2634)

#### 🎉 2.71.3 (2024-12-17)
- 【Fix】
  - 修复 Tree 组件 treeDataSimpleJson 模式下，onChange 回调结果错误问题  [#2508 ](https://github.com/DouyinFE/semi-design/issues/2508) [#2601](https://github.com/DouyinFE/semi-design/pull/2601)
  - 修复竖向 Navigation 在收起状态下 disabled subNavItem 展示不符合预期问题 [#2637](https://github.com/DouyinFE/semi-design/pull/2637)


#### 🎉 2.71.2 (2024-12-13)
- 【Fix】
    - 去除 Collapsible 组件更新时多余的属性前后是否变化对比 [#2631](https://github.com/DouyinFE/semi-design/pull/2631)
    - 修复在 React18 下无论是否动画开启，快速移动鼠标在 tooltip trigger 上时，概率性 dom 只透明但不消失，导致无法点击页面元素的问题 [#2605](https://github.com/DouyinFE/semi-design/pull/2605)
    - 修复 Chat 组件 mode 动态变化未生效问题 [#2625](https://github.com/DouyinFE/semi-design/pull/2625)
    - 设置图片预览的 img 节点的 max-width 为 none，避免同时使用 tailwind 时放大显示错误问题 [#2624](https://github.com/DouyinFE/semi-design/pull/2624)

####  🎉 2.71.1 (2024-12-11)
- 【Feat】
    - 图标模式按钮新增 $height-button_iconOnly_small $width-button_iconOnly_small $height-button_iconOnly_default $width-button_iconOnly_default $height-button_iconOnly_large $width-button_iconOnly_large token [#2618](https://github.com/DouyinFE/semi-design/pull/2618)

#### 🎉 2.71.0 (2024-12-06)
- 【Fix】
    - 对于非展示状态的 Tooltip，页面尺寸变化时不做位置计算 [#2606](https://github.com/DouyinFE/semi-design/pull/2606) 

#### 🎉 2.70.2 (2024-12-04)
- 【Fix】
    - 修复 Datepicker 类型为 monthRange 时，面板默认选中的年月无法选中跨年情况 [#2608](https://github.com/DouyinFE/semi-design/pull/2608)

#### 🎉 2.71.0-beta.0 (2024-12-02)

- 【New Component】
    - 新增 DragMove 组件，通过拖拽改变定位 [#2595](https://github.com/DouyinFE/semi-design/pull/2595)
    - 新增 JsonViewer 组件，支持百万行级 JSON 数据的展示与编辑 [#2561](https://github.com/DouyinFE/semi-design/pull/2561)
- 【Feat】
    - Table 新增 shouldCellUpdate API，用于自定义单元格的是否需重新渲染 [#2584](https://github.com/DouyinFE/semi-design/pull/2584)
    - Cascader 支持 checkRelation API 用于设置选项关联性  [#2582](https://github.com/DouyinFE/semi-design/issues/2582)
    - Highlight Highlight 支持针对不同关键字使用不同高亮样式  [#2600](https://github.com/DouyinFE/semi-design/pull/2600)
    - `@douyinfe/semi-icons-lab` 增加新图标：IconChart、IconChat、IconCodeHighlight、IconLottie、IconMarkdown、IconPincode、IconVersionOne、IconWebComponents、IconJsonViewer [#2583](https://github.com/DouyinFE/semi-design/pull/2583)
- 【Chore】
    - 修改 `@douyinfe/semi-icons` 中 SVG Path 数字精度，保留两位小数，全量图标 min 包体积 450 kb -> 278kb [#2583](https://github.com/DouyinFE/semi-design/pull/2583)
    - 修改 `@douyinfe/semi-illustrations` SVG Path 数字精度，保留两位小数，减少构建体积，全量插画 min 包体积 283k -> 165k [#2602](https://github.com/DouyinFE/semi-design/pull/2602)
    - 修复 Lottie 组件类型报错问题 [#2593](https://github.com/DouyinFE/semi-design/pull/2593)
- 【Perf】
    - Select renderOption 相关的逻辑推迟在候选项展示后再执行，减少不必要的渲染 [#2598](https://github.com/DouyinFE/semi-design/issues/2598)
- 【Fix】
    - 修复 js 省略 的 Typography 未设置宽度时，省略计算错误问题 [#2591](https://github.com/DouyinFE/semi-design/issues/2591)
    - 修复 MarkdownRender 的 table 在一些 markdown 内容语法不正确时候的报错，增加兜底尝试 [#2590](https://github.com/DouyinFE/semi-design/pull/2590)

#### 🎉 2.70.1 (2024-11-25)
- 【Fix】
    - 修复 Chat 组件对话框中的文件 url 错误导致点击文件无法正确打开文件问题 [#2589](https://github.com/DouyinFE/semi-design/pull/2589)

#### 🎉 2.70.0 (2024-11-22)
- 【Fix】
    - 修复拖动 Chat 组件内部文件时候，错误显示放置区域问题 [#2569](https://github.com/DouyinFE/semi-design/issues/2569)

#### 🎉 2.70.0-beta.0 (2024-11-18)
- 【Fix】
    - 当 Transfer 的左侧面板中除去被禁用项外的其他项目都被选中时，操作按钮应当显示取消全选 [#2575](https://github.com/DouyinFE/semi-design/issues/2575)
    - 修复计算中浮点数导致伸缩框组件尺寸的误差，浏览器拖动导致的最大最小值失效的问题，以及 strictMode 引起的问题 [@Nathon2Y](https://github.com/Nathon2Y) [#2551](https://github.com/DouyinFE/semi-design/pull/2551)
    - 修复当单选，搜索框在 trigger 时，TreeSelect 的 placeholder 被遮挡问题，影响版本 2.61.0-2.69.0 [#2566](https://github.com/DouyinFE/semi-design/pull/2566)
- 【Feat】
    - ResizeGroup 的伸缩方向支持动态切换 [@Nathon2Y](https://github.com/Nathon2Y) [#2551](https://github.com/DouyinFE/semi-design/pull/2551)
    - MarkdownRender 新增 remarkGfm 开关用于防止低版本 safari 不支持环视断言报错的问题 [#2576](https://github.com/DouyinFE/semi-design/pull/2576)

#### 🎉 2.69.2 (2024-11-19)
- 【Fix】
    - 修复点击触发排序的表头会透出被遮盖的内容问题，影响版本 2.65.0-2.69.1 [#2578](https://github.com/DouyinFE/semi-design/pull/2578)

#### 🎉 2.69.1 (2024-11-15)
- 【Fix】
    - 修复 MonthRange DatePicker 在存在 disabledDate 情况下点击非禁用年份不跳转问题 [#2569](https://github.com/DouyinFE/semi-design/pull/2569)
    - 修复 ArrayField 被条件渲染时，add 第一次点击未能正确添加行的问题 [#2568](https://github.com/DouyinFE/semi-design/pull/2568)
    - 修复日语场景下 Table pageText 翻译不正确问题 [#2573](https://github.com/DouyinFE/semi-design/pull/2573)

#### 🎉 2.69.0 (2024-11-08)
- 【Fix】
    - 插画包 @douyinfe/semi-illustrations 中的 clip-rule & stroke-width 修改为 clipRule & strokeWidth

#### 🎉 2.69.0-beta.0 (2024-11-04)
- 【Feat】
    - Chat 的自定义渲染会话框中的 renderChatBoxAvatar 增加 message 参数 [#2557](https://github.com/DouyinFE/semi-design/pull/2557)
    - Chat 的自定义渲染会话框中的 renderChatBoxContent 增加 defaultActionsObj 参数，用于透出详细节点参数信息 [#2557](https://github.com/DouyinFE/semi-design/pull/2557)
    - Chat 的自定义渲染输入框增加 detailProps 参数用于透出传递详细节点参数信息 [#2557](https://github.com/DouyinFE/semi-design/pull/2557)
    - Navigation 新增 subDropdownProps 支持 [#2555](https://github.com/DouyinFE/semi-design/pull/2555)
- 【Fix】
    - 修复 Chat 的消息对比逻辑在前后消息为不同的空数组时的 TypeError [#2557](https://github.com/DouyinFE/semi-design/pull/2557)

#### 🎉 2.68.4 (2024-11-04)
- 【Fix】
    - 修复 Chat Foundation 存在 React 特有的 event.persist 调用，其他框架 Adapter 兼容时存在的问题 [#2543](https://github.com/DouyinFE/semi-design/pull/2543) [@rashagu](https://github.com/rashagu)
- 【Style】
    - 修复 Select 在 filter、showClear 开启，点击 clearIcon 且失焦后，placeholder 透明度不正确的问题 [#2547](https://github.com/DouyinFE/semi-design/pull/2547)
    - Chat 组件样式的 align-items 属性的 start/end 修改为 flex-start/flex-end，避免某些工程中 css 编译可能存在的 warning 问题[2546](https://github.com/DouyinFE/semi-design/pull/2546)

#### 🎉 2.68.3 (2024-10-23)
- 【Fix】
    - 修复 TreeSelect 设置了 keyMaps 后，在搜索状态中，点击展开按钮后，选项文本展示错误问题 [#2541](https://github.com/DouyinFE/semi-design/pull/2541) 

#### 🎉 2.68.2 (2024-10-21)
- 【Fix】
    - 修复 `$z-resizable_handler` token 未定义问题，影响版本 v2.68.0-beta.0 - 2.68.1  [#2539](https://github.com/DouyinFE/semi-design/issues/2539) 

#### 🎉 2.68.0 (2024-10-18)
- 【Fix】
    - 修复亮色模式下，IllustrationFailure 和 IllustrationNoContent 曲线未完全闭合问题 [#2535](https://github.com/DouyinFE/semi-design/pull/2535)
    - 修复 Table 类型定义不生效问题，影响版本 v2.31.0-beta.0 - 2.67.2  [#2477](https://github.com/DouyinFE/semi-design/issues/2477) [#2534](https://github.com/DouyinFE/semi-design/pull/2534)

#### 🎉 2.68.0-beta.0 (2024-10-16)
- 【New Component】
    - 新增伸缩框组件，根据用户鼠标拖拽修改组件大小。**组件新增 Token `z-resizable_handler`(用户如果使用了自定义主题，需要重新发布主题获取该 token)**[@Nathon2Y](https://github.com/Nathon2Y) [#2458](https://github.com/DouyinFE/semi-design/pull/2458)
- 【Feat】
    - Datepicker 的 onClickoutSide 增加 event 参数 [#2531](https://github.com/DouyinFE/semi-design/pull/2531)
    - Cascader 新增加 expandIcon API，用于支持用户自定义展开图标  [#2513](https://github.com/DouyinFE/semi-design/issues/2513) [#2528](https://github.com/DouyinFE/semi-design/pull/2528)

#### 🎉 2.67.2 (2024-10-16)
- 【Fix】
    - 修复 Select disabled 禁用但 focus 的情况下，在某些特殊的主题包配置中，背景色不符合预期的现象 [#2532](https://github.com/DouyinFE/semi-design/pull/2532)
    - 修复 icon Spin 使用固定 id 导致在 Tabs 中展示不符合预期问题 [#2526](https://github.com/DouyinFE/semi-design/pull/2526)
    - 修复 Cascader 面板 icon 宽度错误问题，影响版本 2.67.0～2.67.1 [#2529](https://github.com/DouyinFE/semi-design/pull/2529)
- 【Design Token】
    - Select 组件新增 Token： `$color-select_input_disabled-border-focus`、`$color-select_input_disabled-border-focus` 定制禁用态 focus 背景色样式、定制禁用 focus 边框
    - 新增加 $width-cascader-option-icon 用于表示面板中的 icon 的宽度 [#2529](https://github.com/DouyinFE/semi-design/pull/2529)

#### 🎉 2.67.1 (2024-10-11)
- 【Fix】
    - 修复 Select 通过 method close 方法关闭弹层后，点击外部区域无法移除聚焦样式问题 [#2466](https://github.com/DouyinFE/semi-design/pull/2466)
    - 修复 DatePicker 在受控状态下选择后，第一次打开面板选中态未展示问题（影响 v2.64 ~ v2.67）  [#2521 ](https://github.com/DouyinFE/semi-design/issues/2521) [#2522](https://github.com/DouyinFE/semi-design/pull/2522)
    - 修复 Rspack plugin 在 win32 平台不生效的问题 [#2517](https://github.com/DouyinFE/semi-design/pull/2517)

#### 🎉 2.67.0 (2024-09-27)
- 【Fix】
    - 修复 Typography 在 strong 属性为 true 时，省略计算存在误差问题 [@pandoralink](https://github.com/pandoralink) [#2506](https://github.com/DouyinFE/semi-design/pull/2506)

#### 🎉 2.67.0-beta.0 (2024-09-23)
- 【Feat】
    - Form 新增 onErrorChange 回调 [#2484](https://github.com/DouyinFE/semi-design/pull/2484)
    - Chat 组件支持通过 renderDivider 自定义渲染分割线 [#2471](https://github.com/DouyinFE/semi-design/issues/2474)
- 【Fix】
    - 修复 PinCode 在非受控模式下，onChange 不触发的问题 [#2509](https://github.com/DouyinFE/semi-design/pull/2509)
    - 修复 PinCode value 为空字符串时 onChange 不触发的问题 [#2502](https://github.com/DouyinFE/semi-design/issues/2502) [@koderx](https://github.com/koderx)
    - 修复 AutoComplete 选项多于一页时，使用键盘 ArrowUp、ArrowDown 切换时无法自动滚动至视图中的问题 [#1530](https://github.com/DouyinFE/semi-design/issues/1530)
    - **修复 AutoComplete 的子组件 className 大小写与父组件 (.semi-autocomplete) 不一致的问题（.semi-autoComplete-option -> .semi-autocompelte-option），一致改为小写** [#2501](https://github.com/DouyinFE/semi-design/pull/2501)
    - 修改 Cascader, TreeSelect 当 emptyContent 为 null 的行为，同 Select 保持一致 [#2476](https://github.com/DouyinFE/semi-design/pull/2476)
    - 修复 Select 在 使用 IrenderOptionItem 时使用键盘上下键选择选项后，未能自动滚动至视图内的问题 [#2263](https://github.com/DouyinFE/semi-design/issues/2263)
    - Upload 在 React StrictMode 下上传请求无法正确发出的问题（影响范围 v2.64.0-2.66.1）[#2410](https://github.com/DouyinFE/semi-design/issues/2410)
    - 修复 Cascader 在有 suffix 并设置了 showClear 的情况下，清除图标位置和清除图标位置不同问题 [#2493](https://github.com/DouyinFE/semi-design/pull/2493)
- 【Style】
    - 修改 Chat 组件聊天框中的图片展示以及输入框中的上传图片展示效果，从填充到保持宽高比例填充 (object-fit 从 fill -> cover)，防止图片变形 [#2496](https://github.com/DouyinFE/semi-design/pull/2496)
    - 将 Cascader 的 trigger 中内容区域和 icon 间距和 select/treeSelect 保持一致 [#2472](https://github.com/DouyinFE/semi-design/issues/2472) 
    - 修复 Cascader 面板选项在 rtl 模式下，样式不符合预期问题 [#2475](https://github.com/DouyinFE/semi-design/pull/2475)
    - **修改 Cascader 中样式名称不合理的命名，undisabled -> enable** [#2494](https://github.com/DouyinFE/semi-design/pull/2494)
    - 修改 Select 在设置 suffix 情况下，后缀和下拉图标的位置关系未与 TreeSelect/Cascader 保持一致问题（如有其他位置需求，可通过设置 flex 的 order 属性自行调整位置）[#2493](https://github.com/DouyinFE/semi-design/pull/2493)
    - 修复位于 InputGroup 中间位置的 InputNumber，DatePicker，Time Pick，AutoComplete 的圆角不为 0 问题 [#2489](https://github.com/DouyinFE/semi-design/issues/2489)

#### 🎉 2.66.1 (2024-09-12)
- 【Fix】
  - 优化 Datepicker 在马来语、俄语、越南语、阿拉伯语 的星期一 - 星期日的文案展示; 优化 Table 左下角文案在日语、印尼语、越南语时的展示 [#2486](https://github.com/DouyinFE/semi-design/pull/2486)

#### 🎉 2.66.0 (2024-09-10)
- 【Fix】
  - 修复 Tooltip 在动画开启状态快速滑入并滑出，tooltip 正常消失但是 dom 不卸载的问题 [#2461](https://github.com/DouyinFE/semi-design/pull/2461)
  - 修复 Upload addOnPasting 在 SideSheet 中无法上传的问题  [#2478](https://github.com/DouyinFE/semi-design/issues/2478)
  - 修复单选的 Cascader，在 React 版本大于 18 情况下，异步加载数据展开行为异常问题  [#2212](https://github.com/DouyinFE/semi-design/issues/2212) 
  - **针对上个 Beta 新增的 快捷键组件 Hotkeys 进行了一些 API 的微调，更符合实际使用场景** [#2463](https://github.com/DouyinFE/semi-design/issues/2463)
- 【Chore】
  - 新增 ConfigConsumer 导出，用于手动获取 ConfigProvider 内的值 [#2468](https://github.com/DouyinFE/semi-design/pull/2468)
  - HotKeys 增加 static `Keys`属性 [@Nathon2Y](https://github.com/Nathon2Y) [#2463](https://github.com/DouyinFE/semi-design/pull/2463)

#### 🎉 2.66.0-beta.0 (2024-09-02)
- 【New Component】
    - 添加快捷键组件，支持用户自定义快捷键组合并触发回调 [@Nathon2Y](https://github.com/Nathon2Y) [#2418](https://github.com/DouyinFE/semi-design/pull/2418)
- 【Feat】
    - Tabs 增加 slash 类型 [#2416](https://github.com/DouyinFE/semi-design/pull/2416)
    - Tabs 的 renderArrow 支持 defaultNode 参数 [#2416](https://github.com/DouyinFE/semi-design/pull/2416)
    - Tabs 的所有类型支持 closable (此前仅 card 类型支持 closable） [#2416](https://github.com/DouyinFE/semi-design/pull/2416)
    - Tabs 支持通过 dropdownProps API 设置滚动折叠模式下的 dropdown 参数  [#2416](https://github.com/DouyinFE/semi-design/pull/2416)
- 【Fix】
    - 修复 Form.Upload 图片墙模式下 error 样式被遮挡问题 [#2449](https://github.com/DouyinFE/semi-design/pull/2449)
    - 修复 Collapse Tabs 在 tab 设置为 jsx 情况下会崩溃问题（影响范围：2.65.0） [#2464](https://github.com/DouyinFE/semi-design/pull/2464)
    - 修复 Dropdown onVisibleChange 在一些场景未定义时报错的问题 [#2454](https://github.com/DouyinFE/semi-design/pull/2454)
    - 修复 Chat 组件内容显示部分解析未转义字符时候的 SyntaxError [#2452](https://github.com/DouyinFE/semi-design/pull/2452)
    - 修复 Chat 组件在消息流式更新的同时，滚动消息列表，消息流式更新会导致列表意外滚动到底部问题 [#2451](https://github.com/DouyinFE/semi-design/pull/2451)
- 【Chore】
    - Avatar，AvatarGroup 的 size API 类型修改为 string #2443  [#2446 ](https://github.com/DouyinFE/semi-design/issues/2446) [#2459](https://github.com/DouyinFE/semi-design/pull/2459)

#### 🎉 2.65.0 (2024-08-23)
- 【Fix】
    - 修复 Slider 在 range 受控模式下，拖动一个 handle 可能导致另一个 handle 抖动的问题 [#2438](https://github.com/DouyinFE/semi-design/issues/2438) [#2442](https://github.com/DouyinFE/semi-design/pull/2442)
    - 修复 Slider，在 range 模式下，min handler 可以拖动到 max handler 右侧，意外交换两个 handler 的问题 [#2438](https://github.com/DouyinFE/semi-design/issues/2438) [#2442](https://github.com/DouyinFE/semi-design/pull/2442)
    - 修复 Button 在 children 直接传入 icon 时，垂直方向不居中的问题  [#2402](https://github.com/DouyinFE/semi-design/issues/2402) [#2440](https://github.com/DouyinFE/semi-design/pull/2440)
    - 修复 markdown render 渲染仅包含标题的表格时崩溃 [#2436](https://github.com/DouyinFE/semi-design/pull/2436) [@tgz](https://github.com/tgz)

#### 🎉 2.65.0-beta.0 (2024-08-20)
- 【Feat】
  - 优化 Table 的排序交互，仅有排序功能时，支持点击整个表头 column 触发排序。Column 支持 showSortTooltip API 支持设置是否显示 tooltip，默认为 true [#2413](https://github.com/DouyinFE/semi-design/pull/2413)
  - MarkdownRender 支持 RemarkPlugin 和 RehypePlugins 插件 [#2433](https://github.com/DouyinFE/semi-design/pull/2433)
  - Tree、TreeSelect 的 renderLabel API 增加 searchWord 参数，用于透出当前搜索框输入值 [#2412](https://github.com/DouyinFE/semi-design/pull/2412)
  - Datepicker 支持 leftSlot、rightSlot [@LuyangFE](https://github.com/LuyangFE) [#2409](https://github.com/DouyinFE/semi-design/pull/2409) 
  - Typograph 组件支持自定义复制区域渲染 [@sylingd](https://github.com/sylingd) [#2408](https://github.com/DouyinFE/semi-design/pull/2408)
- 【Perf】
  - 优化 Input、TextArea getValueLength 判断次数 [#2432](https://github.com/DouyinFE/semi-design/pull/2432)
- 【Chore】
  - Image 组件 interface 支持原生 img 元素属性 [#2427](https://github.com/DouyinFE/semi-design/pull/2427)
- 【Fix】
  - 修复 Chat 中消息为空数组时，发送消息后的类型错误 [#2411](https://github.com/DouyinFE/semi-design/pull/2411)
  - 修复 Table aria-level 在树形数据为空时错误的问题  [#2359](https://github.com/DouyinFE/semi-design/issues/2359)
  - 修复 Table 树形数据为空且 expandIcon 为 false 时缩进错误的问题  [#2425](https://github.com/DouyinFE/semi-design/issues/2425)
  - 修复 Collapse Tabs 在快速点击左右箭头情况下造成的箭头禁用情况不正确问题 [#2415](https://github.com/DouyinFE/semi-design/issues/2415)
  - 修复 Chat 组件在 showStopGenerate 为 true 时，消息的 status 为 error 会展示停止按钮问题 [#2422](https://github.com/DouyinFE/semi-design/pull/2422)
  - 修复 Cascader 搜索后以及多选，弹出层的位置未重新计算，导致内容较长的面板被遮挡问题 [#2417](https://github.com/DouyinFE/semi-design/pull/2417)
  - 修复 Cascader 多选场景，通过点击 trigger 中已选项的关闭 icon 取消选中，弹出层位置未重新计算问题 [#2417](https://github.com/DouyinFE/semi-design/pull/2417)
  - 修复 DatePicker 点击选择的日期两次后，选中态颜色丢失 [#2389](https://github.com/DouyinFE/semi-design/pull/2389)

#### 🎉 2.64.0 (2024-08-12)
- 【Fix】
  - 修复 Tooltip triggerDOM 特殊场景下未定义的问题 [commit](https://github.com/DouyinFE/semi-design/commit/05878dd7b7c20f2e924f8e0b3cf71ad0eaa3aaf3)

#### 🎉 2.64.0-beta.0 (2024-08-05)
- 【New Component】
  - 新增 颜色选择器 ColorPicker 组件，用户快速选择颜色，支持滴管屏幕取色 [#2218](https://github.com/DouyinFE/semi-design/pull/2218)
- 【Feat】
    - Calendar 日视图中起止时间完全相同的事件支持并排显示，不互相遮盖 [#2393](https://github.com/DouyinFE/semi-design/pull/2393)
- 【Fix】
    - 修复鼠标滚轮缩放图片后，拖动了图片，再次缩放后会重置回中心位置的问题 [@l123wx](https://github.com/l123wx) [#2293](https://github.com/DouyinFE/semi-design/pull/2293)
    - 修复 Modal 在 SSR 时 document 不存在的问题（影响范围 2.62.0~2.63.0） [#2395](https://github.com/DouyinFE/semi-design/pull/2395)
    - 修复 DatePicker 选中日期在关闭面板后未重置问题  [#2387](https://github.com/DouyinFE/semi-design/issues/2387) [#2388](https://github.com/DouyinFE/semi-design/pull/2388)
    - 当 Tree 的 searchRender 为 false 时，去除顶部多余的高度。[#2386](https://github.com/DouyinFE/semi-design/pull/2386)
    - 修复 Upload 在组件卸载后，仍然可能因为上传异步请求触发 onChange、onError、onSuccess 回调的问题  [#2391](https://github.com/DouyinFE/semi-design/pull/2391)

#### 🎉 2.63.0 (2024-07-26)
- 【Fix】
    - 修复 TimePicker 在 onChangeWithDateFirst false 情况下为先选后一个时间导致 invalid time value 问题 [#2376](https://github.com/DouyinFE/semi-design/pull/2376)
- 【Style】
    - 修复 Cascader 在无选项情况下，emptyContent 在 hover 时，背景色会超出弹出层区域 [#2377](https://github.com/DouyinFE/semi-design/pull/2377)
    - 修复 Sass 版本大于等于 1.77.7，不推荐使用嵌套规则后的声明问题 [#2366](https://github.com/DouyinFE/semi-design/issues/2366) [#2370](https://github.com/DouyinFE/semi-design/pull/2370)
    - 增加 Upload 组件中上传错误的 icon 的 font-size 设置的优先级，防止因为编译后 css 文件顺序导致生效的 font-size 不一致问题 [#2372](https://github.com/DouyinFE/semi-design/pull/2372)
- 【Chore】
    - 修复 Form 中 formAPI 缺少 getFormProps 类型定义问题 [#2367](https://github.com/DouyinFE/semi-design/pull/2367)

#### 🎉 2.63.0-beta.0 (2024-07-22)
- 【New Component】
    - 新增 Chat 组件用于渲染对话列表 [#2248](https://github.com/DouyinFE/semi-design/pull/2248)
- 【Fix】
    - 修复 Form ArrayField addWithInitValue 时未对入参 clone 做作用域隔离的问题   [#2351](https://github.com/DouyinFE/semi-design/issues/2351)
    - 修复 Upload 使用 renderThumbnail 搭配 Image 组件使用时，宽高度恒定的问题  [#2343](https://github.com/DouyinFE/semi-design/issues/2343)
- 【Feat】
    - Form 新增 stopPropagation 可用于阻止嵌套 Form 场景下，submit、reset 事件同时在多级容器触发的问题 [#2355](https://github.com/DouyinFE/semi-design/issues/2355)
    - Upload 支持 afterUpload 中 return url 修改预览链接 [#2346](https://github.com/DouyinFE/semi-design/pull/2346)

#### 🎉 2.62.1 (2024-07-16)
- 【Fix】
  - 修复 TreeSelect 启用 showFilteredOnly 并且搜索框在 trigger 中的 treeSelect 面板，在搜索后再次打开显示不正确问题 [#2345](https://github.com/DouyinFE/semi-design/pull/2345)
  - 修复 Upload 使用 renderThumbnail 搭配 Image 组件使用时，宽高度恒定的问题  [#2343](https://github.com/DouyinFE/semi-design/issues/2343) [#2344](https://github.com/DouyinFE/semi-design/pull/2344)
  - 修复 Form 未透传 id 属性到 form 元素 DOM 的问题 

#### 🎉 2.62.0 (2024-07-12)
- 【Fix】
  - Carousel 仅有一个 children 且 autoPlay 为 true 时不执行任何切换操作 [#2334](https://github.com/DouyinFE/semi-design/pull/2334)
  - 修复 Modal 在 getPopupContainer 中如果返回 document.body 异常的问题 [#2335](https://github.com/DouyinFE/semi-design/pull/2335)
  - 修复 Table 在 dataSource 为空时，存在非预期的 borderRadius 的问题 [#2337](https://github.com/DouyinFE/semi-design/pull/2337)
- 【Chore】
  - Table Column jsx 写法支持传入 RecordType 泛型  [#2314](https://github.com/DouyinFE/semi-design/issues/2314) [#2320](https://github.com/DouyinFE/semi-design/pull/2320)  

#### 🎉 2.62.0-beta.0 (2024-07-05)
- 【New Component】
    - 新增验证码输入组件 PinCode 用于快速便捷输入验证码  [#2130](https://github.com/DouyinFE/semi-design/issues/2130) [#2209](https://github.com/DouyinFE/semi-design/pull/2209)
    - 新增 Lottie 组件用于便捷渲染 Lottie 动画 [#2297](https://github.com/DouyinFE/semi-design/pull/2297)
    - 新增 CodeHighlight 代码高亮组件，用于高亮网页中显示代码 [#2203](https://github.com/DouyinFE/semi-design/pull/2203)
    - 新增 MarkdownRender 渲染组件，用于渲染 markdown 格式内容 [#2203](https://github.com/DouyinFE/semi-design/pull/2196)
- 【Feat】
    - TreeSelect, Cascader 支持通过 esc 按键关闭弹出层 [#2329](https://github.com/DouyinFE/semi-design/pull/2329)
- 【Style】
    - 修复 theme 为 outline 的 ButtonGroup 样式错误问题 [#2328](https://github.com/DouyinFE/semi-design/pull/2328)
- 【Fix】
    - 修复 Select 在 value 受控时，若多个 label text 相同，使用 reactNode 写法时无法正确选中的问题  [#2284 ](https://github.com/DouyinFE/semi-design/issues/2284) [#2311](https://github.com/DouyinFE/semi-design/pull/2311)
- 【Chore】
    - 更新 Table getCheckboxProps 和 rowSelection 类型定义  [#2234](https://github.com/DouyinFE/semi-design/issues/2234) [#2321](https://github.com/DouyinFE/semi-design/pull/2321)

#### 🎉 2.61.0 (2024-06-24)
- 【Docs】
  - 新增 web components 适配文档 [#2313](https://github.com/DouyinFE/semi-design/pull/2313)

#### 🎉 2.60.1 (2024-06-19)
- 【Fix】
    - 修复 Typography 组件中 icon 大小和 size 设置未保持一致问题，影响版本 2.59.0-2.60.1 [#2308](https://github.com/DouyinFE/semi-design/pull/2308)

#### 🎉 2.61.0-beta.0 (2024-06-18)
- 【Feat】
    - Breadcrumb 支持通过 activeIndex 受控当前高亮导航项 [#2301](https://github.com/DouyinFE/semi-design/pull/2301)
    - Select 支持 searchPosition 配置 [#2298](https://github.com/DouyinFE/semi-design/pull/2298)
    - Form 组件 formApi 增加 scrollToError，支持手动滚动至校验错误处 [#2294](https://github.com/DouyinFE/semi-design/pull/2294)
    - Tree、TreeSelect 增加 autoMergeValue API [@LuyangFE](https://github.com/LuyangFE) [#2233](https://github.com/DouyinFE/semi-design/pull/2233)
    - Tabs 添加 arrowPosition 设置滚动折叠模式下，箭头切换器的渲染位置 [#2288](https://github.com/DouyinFE/semi-design/pull/2288)
    - Tabs 添加 renderArrow 用于自定义滚动折叠模式下，箭头左右切换器的渲染 [#2288](https://github.com/DouyinFE/semi-design/pull/2288)
    - Tabs 添加 visibleTabsStyle 用于设置滚动区域样式 [#2288](https://github.com/DouyinFE/semi-design/pull/2288)
    - Tabs 添加 onVisibleTabsChange 用于在 tabs 溢出时获取未隐藏的项目 [#2288](https://github.com/DouyinFE/semi-design/pull/2288)
    - Tabs 增加 showRestInDropdown 用于控制可折叠 Tabs Dropdown 面板的显隐 [#2289](https://github.com/DouyinFE/semi-design/pull/2289)
    - OverflowList 在 scroll 模式下添加 onVisibleStateChange 用于在溢出时获取未隐藏的项目 [#2288](https://github.com/DouyinFE/semi-design/pull/2288)
    - Avatar size 支持传入合法的 width 属性值例如 "10px" [#2290](https://github.com/DouyinFE/semi-design/pull/2290)
- 【Fix】
    - 修复 Pagination 因位置变化下拉菜单位置没有跟随变化的问题 [2307](https://github.com/DouyinFE/semi-design/pull/2307)
    - 修复 Tooltip 在快速移动下，可能由于 React 未正确触发 onMouseLeave 导致的未消失的问题 [#2306](https://github.com/DouyinFE/semi-design/pull/2306)
    - Table 组件配置 virtualized 虚拟化后 align 失效的问题。 [@icwoker](https://github.com/icwoker) [#2300](https://github.com/DouyinFE/semi-design/pull/2300)
    - 修复单选，可搜索，搜索框在 trigger 的 TreeSelect，当 trigger 中的选中项想要展示 Tooltip 时 (比如 label 为 ReactNode，并且有 Tooltip，或者使用 renderSelectedItem 自定义渲染已选项目，其中有 Tooltip)，tooltip 无法被触发问题  [#2291](https://github.com/DouyinFE/semi-design/issues/2291) [#2292](https://github.com/DouyinFE/semi-design/pull/2292)

#### 🎉 2.60.0 (2024-06-07)
- 【Docs】
    - 更新对 Transfer 的 filter API 说明 [#2280](https://github.com/DouyinFE/semi-design/pull/2280)
- 【Fix】
    - 修复 AutoComplete 因为 autofocus 拼写导致的在开发环境下抛出 warning 的问题 [#2285](https://github.com/DouyinFE/semi-design/pull/2285)
    - 修复 Form labelAlign 设为 right 时，对齐样式在 label 带 extra 情况下不生效的问题 [#2281](https://github.com/DouyinFE/semi-design/pull/2281)

#### 🎉 2.60.0-beta.0 (2024-06-04)
- 【Fix】
    - 修复 input 在 small size 状态下，文字略微向下偏移的问题 [@lmsccc](https://github.com/lmsccc) [#2270](https://github.com/DouyinFE/semi-design/pull/2270)
    - 修复 tab 在 scrollIntoView 后显示不完整的问题 [@l123wx](https://github.com/l123wx) [#2247](https://github.com/DouyinFE/semi-design/pull/2247)
- 【Style】
    - 显式设置 Spin 下的 svg 的 display 属性为 inline，防止 tailwind 默认 svg 设置对 Spin 造成影响 [#2272](https://github.com/DouyinFE/semi-design/pull/2272)

#### 🎉 2.59.1 (2024-05-29)
- 【Fix】
    - 修复 Select Option 传入 data-*属性未生效的问题 [#2258](https://github.com/DouyinFE/semi-design/pull/2258)
    - 修复 Toast 在多条长度不同的 toast 弹出时，没有居中而是左对齐的问题 [#2257](https://github.com/DouyinFE/semi-design/pull/2257)
    - 修复 TreeSelect 在 defaultOpen 模式时候，点击外部没有无法关闭弹出层问题 [#2254](https://github.com/DouyinFE/semi-design/pull/2254)
    - 修复 Avatar 在设置了 border/topSlot/bottomSlot API 情况下，无法触发 onClick、onMouseEnter、onMouseLeave 事件问题 [#2255](https://github.com/DouyinFE/semi-design/pull/2255)
    - **修复 Badge className 作用范围不正确的问题，功能对齐其他组件，作用于 DOM 最外层** 
    - 修正 Badge API 定义，增加更语义的 countStyle API，作用与现有 style API 保持一致（旧 API props.style 仍可使用，效果不变，但不再于文档中推荐）
- 【Chore】
    - 修复 FormApi 在未传入泛型时，调用 setValue 时会有 string 类型不能赋值给 never 的类型报错问题（影响范围，v2.59.0） [#2259](https://github.com/DouyinFE/semi-design/pull/2259)
    - 优化 FormApi getValue 对于嵌套路径的类型提示，对齐 setValue 行为 [#2259](https://github.com/DouyinFE/semi-design/pull/2259)
    - 修复 TextArea 的 onBlur/onFocus 类型定义错误问题 [#2261](https://github.com/DouyinFE/semi-design/pull/2261)
    - 修复 Semi Webpack plugin 中的 webcomponentPath 参数类型定义错误问题  [#2260](https://github.com/DouyinFE/semi-design/pull/2260)

#### 🎉 2.59.0 (2024-05-24)
- 【Chore】
    - Form 组件 FormApi setValue 类型定义更新，优化嵌套路径的提示  [#1737](https://github.com/DouyinFE/semi-design/issues/1737)
    - 移除 @douyinfe/semi-theme-default 中不恰当的依赖声明 [#2252](https://github.com/DouyinFE/semi-design/pull/2252)
- 【Fix】
    - 修复 StrictMode 开启时，dev 环境下，Form 校验结果无法正常返回的问题（影响范围：v2.57.0 - v2.59.0-beta.0） [@nekocode](https://github.com/nekocode) [#2210](https://github.com/DouyinFE/semi-design/pull/2211)

#### 🎉 2.59.0-beta.0 (2024-05-20)
- 【Feat】
  - Typography 的 size API 支持 inherit 属性 [#2244](https://github.com/DouyinFE/semi-design/pull/2244)
  - Tree 的 icon API 支持函数类型  [#2236 ](https://github.com/DouyinFE/semi-design/issues/2236) [#2237](https://github.com/DouyinFE/semi-design/pull/2237)
  - 实现 Webpack & Rspack 插件用于对 web components 中的 semi 组件进行样式插入 [#2221](https://github.com/DouyinFE/semi-design/pull/2221)
  - 提供 TailwindCSS 混用时的最佳实践，解决一系列样式问题 [#2235](https://github.com/DouyinFE/semi-design/pull/2235)
  - Tabs 新增 more api，用于将一部分 tabs 收起到下拉菜单中 [#2226](https://github.com/DouyinFE/semi-design/pull/2226)
  - Button 新增 outline 边框模式主题 [#2224](https://github.com/DouyinFE/semi-design/pull/2224)
- 【Fix】
  - 修复溢出的 Tab 在“activeKey”变动后没有 "scrollIntoView" 的问题 [@l123wx](https://github.com/l123wx) [#2241](https://github.com/DouyinFE/semi-design/pull/2241)
  - 修复 Slider 在特殊场景下触发事件时机异常的问题 [@zzc6332](https://github.com/zzc6332) [#2186](https://github.com/DouyinFE/semi-design/pull/2186)
  - 修复 Tree 组件中 renderFulllabel 的透传的 className 样式受到 li 标签限制问题 [#2238](https://github.com/DouyinFE/semi-design/pull/2238)
- 【Chore】
  - WebpackPlugin 增加 cssLayer 配置项，允许用户自定义样式优先级顺序 [#2235](https://github.com/DouyinFE/semi-design/pull/2235)

#### 🎉 2.58.1 (2024-05-22)
- 【Design Token】
  - Tabs 新增 `$font-tabs_bar_large-fontSize` `$font-tabs_bar_medium-fontSize` `$font-tabs_bar_small-fontSize`

#### 🎉 2.58.0 (2024-05-11)
- 【Fix】
    - 修复 Slider 在添加了 scale 样式后，拖拽不正常，点击轨道跳转不正常的问题 [#2223](https://github.com/DouyinFE/semi-design/pull/2223)
    - 修复在 safari/ firefox 浏览器在暗色模式下的样式错误 (影响版本：2.56.0-2.57.0)  [#2225](https://github.com/DouyinFE/semi-design/issues/2225) [#2229](https://github.com/DouyinFE/semi-design/pull/2229)
  
#### 🎉 2.58.0-beta.0 (2024-05-06)
- 【Feat】
    - Nav.Item 支持透传 data-* 参数到 DOM [@meixg](https://github.com/meixg)[#2217](https://github.com/DouyinFE/semi-design/pull/2217)
    - Table 兼容 dnd-kit，更新 Table 拖拽排序 demo 为 dnd-kit  [#997](https://github.com/DouyinFE/semi-design/issues/997) 
- 【Style】
    - 修复 TagIput 在 Form 表单中使用 insetLabel 时，样式与其他组件未对齐的问题 [#2216](https://github.com/DouyinFE/semi-design/pull/2216)
- 【Design Token】
    - TagInput 增加 $color-tagInput_prefix-text-default、$spacing-tagInput_insetLabel-marginRight、$font-tagInput_insetLabel-fontWeight 三个 Token
  [#2216](https://github.com/DouyinFE/semi-design/pull/2216)
- 【Fix】
    - 修复 Table 表头 text-align 在 RTL 模式下对齐不正确的问题 [#2172](https://github.com/DouyinFE/semi-design/issues/2172)
    - 修复 Table onGroupedRow className 不生效问题 [#2185](https://github.com/DouyinFE/semi-design/issues/2185) 
    - 修复 Table components 类型定义问题 [#2197](https://github.com/DouyinFE/semi-design/pull/2197)
  
- #### 🎉 2.57.0 (2024-04-26)
- 【Fix】
    - 修复 Field 卸载后，异步校验的结果仍然会写至 formState 的问题 [@sylingd](https://github.com/sylingd) [#2206](https://github.com/DouyinFE/semi-design/pull/2206)
    - 修复 TreeSelect 受控 value，设置了 defaultExpandedKeys，远程加载 treeData 时，defaultExpandedKeys 未生效问题（影响版本 2.49.2-2.56.3） [#2191](https://github.com/DouyinFE/semi-design/pull/2191)
    - 修复 TreeSelect 在多选，自定义 trigger，checkRelation 为 unRelated 情况下，选中项未通过 triggerRender 透出问题  [#2188](https://github.com/DouyinFE/semi-design/issues/2188)
    - 修复 Tooltip 在挂载时，如果 Cursor 已经在 trigger 的 dom 上，且 React 复用了 trigger dom 作为 tooltip 的 children，tooltip 不会展示的问题 [#2199](https://github.com/DouyinFE/semi-design/pull/2199)
    - 修复 Input 和 TextArea 设置 defaultValue 在长文本情况下，autoFocus 光标未滚动到末尾的问题  [#2193](https://github.com/DouyinFE/semi-design/issues/2193)
    - 移除 Banner `.semi-banner-content` 中无效的 css 规则 [#2204](https://github.com/DouyinFE/semi-design/pull/2204)
- 【Design Token】
    - Checkbox 新增 `$color-checkbox_cardType-border-default` [#2208](https://github.com/DouyinFE/semi-design/pull/2208)


#### 🎉 2.57.0-beta.0 (2024-04-22)
- 【Feat】
  - Modal 支持 modalContentClass 来设置 content 的 props [#2162](https://github.com/DouyinFE/semi-design/pull/2162) [@18852819321](https://github.com/18852819321)
  - 给树形选择器 TreeSelect 的 onSearch 方法添加了`filteredNodes`入参，用来获取筛选后的节点列表 [@Hokori23](https://github.com/Hokori23) [#2155](https://github.com/DouyinFE/semi-design/pull/2155)
  - Form 组件 FormApi 增加 getFormProps，可在 formApi 中读取组件的 props 如 disabled、trigger 等属性 [#2184](https://github.com/DouyinFE/semi-design/pull/2184)
- 【Fix】
  - 修复 Select 单选时，受控且 filter 开启模式下，选择 Option 后文本会闪烁一次后更正的问题 [#2170](https://github.com/DouyinFE/semi-design/pull/2170)

#### 🎉 2.56.3 (2024-04-19)
- 【Fix】
    - 修复 Modal footerFill 打开后，取消按钮带有左边距的问题 [#2177](https://github.com/DouyinFE/semi-design/pull/2177)
    - 修复单选，可搜索，远程加载的 TreeSelect 在选择选项后，选项展开状态异常问题 [#2178](https://github.com/DouyinFE/semi-design/issues/2178) [#2179](https://github.com/DouyinFE/semi-design/pull/2179)
    - 修复 Upload 将 addOnPasting 切换为 false 后，粘贴上传依然触发的问题 [#2176](https://github.com/DouyinFE/semi-design/pull/2176)
    - 修复 TreeSelect 在搜索后选项变化，面板位置未自动调整问题 [#2181](https://github.com/DouyinFE/semi-design/pull/2181)
    - 修改 locale 越南语翻译中不准确的表达 [@ruaruababa](https://github.com/ruaruababa) [#2154](https://github.com/DouyinFE/semi-design/pull/2154)
- 【Docs】
    - 数据可视化文档更新 [#2182](https://github.com/DouyinFE/semi-design/pull/2182)

#### 🎉 2.56.2 (2024-04-17)
- 【Design Token】
  - Button 修改 splitButton radius token 名称为 `$radius-button_splitButtonGroup_first_topLeft`、`$radius-button_splitButtonGroup_first_bottomLeft`、`$radius-button_splitButtonGroup_last_topRight`、`$radius-button_splitButtonGroup_last_bottomRight` Token


#### 🎉 2.56.1 (2024-04-15)
- 【Design Token】
  - Button 增加 `$radius-splitButtonGroup_first_topLeft`、`$radius-splitButtonGroup_first_bottomLeft`、`$radius-splitButtonGroup_last_topRight`、`$radius-splitButtonGroup_last_bottomRight` Token


#### 🎉 2.56.0 (2024-04-12)
- 【Fix】
    - 修复 Locale ro 语言类型定义与其他语言不一致问题 [#2157](https://github.com/DouyinFE/semi-design/pull/2157)
    - 修复使用 js 省略的 Typography 组件，children 为 模版字符串时的显示异常及省略异常  [#2167 ](https://github.com/DouyinFE/semi-design/issues/2167) [#2169](https://github.com/DouyinFE/semi-design/pull/2169)
    - 修复 Select filter 在未选中任何项时，高度不正确的问题。(影响版本 v2.56.0-beta.0) [#2159](https://github.com/DouyinFE/semi-design/pull/2159)
    - 修复 Typography 单行 css 省略的精确性问题  [#1731 ](https://github.com/DouyinFE/semi-design/issues/1731) [#2089](https://github.com/DouyinFE/semi-design/pull/2089)

#### 🎉 2.56.0-beta.0 (2024-04-03)
- 【Feat】
    - WebComponent 场景支持：clickOutSide 增加对 Shadow DOM 场景的支持，涉及组件包括 AutoComplete、Calendar、Cascader、DatePicker、Select、TagInput、TimePicker、Tooltip、TreeSelect [@changlin2569](https://github.com/changlin2569) [#1381](https://github.com/DouyinFE/semi-design/issues/1381) 
    - WebComponent 场景支持：通过 :host, :host-context 伪类选择器将 css variable 注入 shadow dom，保障 Shadow DOM 下的 Semi 组件样式正确  [#2142](https://github.com/DouyinFE/semi-design/issues/2142) 
    - Backtop 点击增加 throttle，防止 duration 内重复触发 [@OnlyWick](https://github.com/OnlyWick) [#2125](https://github.com/DouyinFE/semi-design/pull/2125)
- 【Fix】
    - 修复 Typography 单行 css 省略的精确性问题  [#1731](https://github.com/DouyinFE/semi-design/issues/1731) 
    - 修复 Select 多选且 filter 开启的情况下，选择多行后，最后一行的标签垂直间隔于其他行不同的问题 [#1667](https://github.com/DouyinFE/semi-design/issues/1667)
- 【Style】
    - 修复 Form.RadioGroup 在 type=button/card 时与普通 RadioGroup 的高度不一致的样式问题  [@nekocode](https://github.com/nekocode) [#1954](https://github.com/DouyinFE/semi-design/issues/1954)
    - 修复 RadioGroup 在父级若有 overflow:hidden 的情况下选中后样式不对的问题 [@nekocode](https://github.com/nekocode) [#2126](https://github.com/DouyinFE/semi-design/issues/2126)
- 【Design Token】
    - Select 增加 `$height-select_multiple_input_small`、`$height-select_multiple_input_default`、`$height-select_multiple_input_large` 三个 token 可用于指定开启搜索时的 input 的高度 [#2151](https://github.com/DouyinFE/semi-design/pull/2151)


#### 🎉 2.55.5 (2024-04-02)
- 【Fix】
  - 修复 Tree 组件中 checkRelation 为 unRelated 时，由于 value 不在 treeData 中导致的类型错误 [#2147](https://github.com/DouyinFE/semi-design/pull/2147)
  - 修复受控 Cascader 中 value 不在 TreeData 内时的类型错误 [#2146](https://github.com/DouyinFE/semi-design/pull/2146)
  - 修复 Slider 在一些场景下 tooltip 在 鼠标移走时不自动隐藏的问题（影响范围 2.49.0 ~ 2.55.4）[#2148](https://github.com/DouyinFE/semi-design/pull/2148)

#### 🎉 2.55.3 (2024-04-01)
- 【Fix】
  - 修复 Select 多选开启 onChangWithObject 且 value 受控，当前 value 并不存在于 optionList 中，更新了 value 中的其他属性后渲染未重新执行的问题 [#2139](https://github.com/DouyinFE/semi-design/pull/2139)

#### 🎉 2.55.1 (2024-03-25)
- 【Fix】
  - 修复 collapse & collapsible keepDOM 失效的问题（影响版本 2.54.0-beta.0 ~ 2.55.0）[#2140](https://github.com/DouyinFE/semi-design/pull/2140)
  - 修正 collapse 的 lazyRender 默认值，由 2.54.0 设置的 true 改为更合适的 false，保持未设置 lazyRender 的用例与 2.54 前行为的一致性（影响版本 2.54.0-beta.0 ~ 2.55.0）[#2140](https://github.com/DouyinFE/semi-design/pull/2140)

#### 🎉 2.55.0 (2024-03-22)
- 【Fix】
  - 修复 Table 表头选择状态在数据为空时错误被选中问题（影响 v2.51 ~ v2.54 版本）[#2128](https://github.com/DouyinFE/semi-design/issues/2128)
  - 修复 Split Button 在 children Button className 变化时丢失样式的问题

#### 🎉 2.55.0-beta.0 (2024-03-18)
- 【Fix】
    - 修复 TabBar 在 SSR 时渲染为空 [@nekocode](https://github.com/nekocode)
    - 修复由于 Sortable 的默认拖拽感应延迟时间过长导致 Transfer 在快速拖动时拖拽不成功问题
    - 修复 Nav 在 selectedKeys 变化后 openKeys 未保存上一次状态问题（影响 v2.54.1）[#2115](https://github.com/DouyinFE/semi-design/issues/2115)
- 【Chore】
    - 升级 webpack、rspack 构建插件，支持消费在 Semi DSM 中配置的自定义 css 配置，可用于将覆写的 CSS 或任意与 Semi 组件无关的 css 聚进主题包样式

#### 🎉 2.54.1 (2024-03-11)
- 【Fix】
    - 修复 Navigation 组件在 react 17 下 selectedKeys 未生效问题
    - 修复 Navigation 组件 openKeys 在 selectedKeys 更新后未生效问题
  
#### 🎉 2.54.0 (2024-03-08)
- 【Fix】
  - 修复 js 截断计算中没有将展开按钮占据的宽度计算在内问题 (影响范围 v2.54.0-beta.0)
- 【Chore】
  - Upload 增加 FileItemStatus TS interface 导出

#### 🎉 2.54.0-beta.0 (2024-03-04)
- 【Feat】
    - Toast 组件支持 theme 全局配置 [@LonelySnowman](https://github.com/LonelySnowman) [#2099](https://github.com/DouyinFE/semi-design/issues/2099)
    - Collapsible 组件新增 lazyRender 属性 [@changlin2569](https://github.com/changlin2569) [#2100](https://github.com/DouyinFE/semi-design/issues/2100)
    - Descriptions 组件支持横向布局 [@LonelySnowman](https://github.com/LonelySnowman) [#1534](https://github.com/DouyinFE/semi-design/issues/1534) 
    - Cascader 支持通过 ref 调用 search 方法  [#2098](https://github.com/DouyinFE/semi-design/issues/2098)
    - ImagePreview 增加 onDownLoadError 回调 API [#2093](https://github.com/DouyinFE/semi-design/pull/2093)
- 【Fix】
    - 修复 Table expandedRowKeys 与 defaultExpandAllGroupRows 同时使用时未生效问题 [#2085](https://github.com/DouyinFE/semi-design/issues/2085)
    - 修复在某些特殊场景下 Typography 的 Ellipsis 功能在第一次 hover 时候闪烁的问题 [#2107](https://github.com/DouyinFE/semi-design/pull/2107)

#### 🎉 2.53.3 (2024-02-26)
- 【Fix】
  - 修复 Avatar border 类型错误的问题

#### 🎉 2.53.2 (2024-02-26)
- 【Fix】
    - 修复 SSR 场景下使用 TextArea autoSize ResizeObserver 里访问空元素的错误 [@nekocode](https://github.com/nekocode)

#### 🎉 2.53.1 (2024-02-26)
- 【Fix】
    - 修复 TimePicker 中同时使用 timeZone 和 disabledHours 时显示值不符合预期问题 [#2083](https://github.com/DouyinFE/semi-design/pull/2083)
    - 修复 Badge 组件 proptypes 未包含 success 类型导致 type 传入参数校验报错的问题 [@matozz](https://github.com/matozz) [#2091](https://github.com/DouyinFE/semi-design/pull/2091)
  
#### 🎉 2.53.0 (2024-02-23)
- 【Fix】
  - 修复 Sidesheet Portal 在 visible 不显示的时候仍然挂载的问题 [#2094](https://github.com/DouyinFE/semi-design/pull/2094)
  - 修复 TagInput 的 onKeyDown 参数类型定义错误问题 
- 【Docs】
  - 修复 Tabs 组件文档中的 tabPosition 参数类型错误 [@miyuesc](https://github.com/miyuesc) [#2090](https://github.com/DouyinFE/semi-design/pull/2090)

####  🎉 2.52.3 (2024-02-22)
- 【Fix】
    - 修复 Cascader 的 treeData 中 value 类型为 number 则面板未显示选中问题（影响范围 v2.51.0-v2.52.2)

#### 🎉 2.52.2 (2024-02-19)
- 【Fix】
  - 修复 ResizeObsever 在非浏览器环境不存在的问题。问题影响范围 (2.52.1, 2.53.0-beta.0)

#### 🎉 2.52.1 (2024-02-18)
- 【Fix】
  - 修复 vite 上使用主题报错的问题，问题影响范围 (2.52.0)
- 【Chore】
  - 去除 ResizeObserver polyfill

#### 🎉 2.53.0-beta.0 (2024-02-08)
- 【Perf】
    - 提升 Typography 开启 Ellipsis 下 性能，减少 render 和计算次数 [#1970](https://github.com/DouyinFE/semi-design/pull/1970)
    - 去除多余的 clone 操作；对于必要的克隆操作，使用 fast-copy 的 copy 调用替换 lodash 的 cloneDeep 调用。涉及组件：DatePicker，Table，OverflowList，Form，Tree，TreeSelect，Cascader [#2002](https://github.com/DouyinFE/semi-design/pull/2002)
- 【Feat】
    - 支持全局设置部分组件的默认 Props [#2029](https://github.com/DouyinFE/semi-design/pull/2029)


#### 🎉 2.52.0 (2024-02-06)
- 【Fix】
  - Dropdown 添加 overflow-y:auto 防止设置 border-radius 时样式不正确的问题
  - 修复 Select 点击清除按钮以后，点击外部不触发 onBlur 问题  [#1989](https://github.com/DouyinFE/semi-design/issues/1989)
  - 修复 Image 在特殊情况下会向 undefined 地址请求的问题 [#2063](https://github.com/DouyinFE/semi-design/issues/2063) [@nekocode](https://github.com/nekocode)
  - 修复 TimePicker value 传入 undefined 时类型错误的问题 [#2066](https://github.com/DouyinFE/semi-design/issues/2066)
  - 修复 Cascader 在搜索内容为英文逗号时选项面板显示全部选项问题 [#2030](https://github.com/DouyinFE/semi-design/pull/2030)
  - 修复多选，showClear 的 Cascader 在点击清除按钮后，选项面板没有从搜索状态切换到普通状态问题 [#2030](https://github.com/DouyinFE/semi-design/pull/2030)
  - 修复 Select 部分 border width token 不正确的问题 [#2065](https://github.com/DouyinFE/semi-design/pull/2065)
  - 修复当浮层组件的 popupContainer 或其父级缩放后，定位不准确的问题 [#2034](https://github.com/DouyinFE/semi-design/pull/2034)
  - 修复 resizable Table 行选择隐藏时多出来一列  [#2036](https://github.com/DouyinFE/semi-design/issues/2036)
  - 修复 DatePicker 点击清除按钮后，面板年月值不会还原到初始状态问题 [#2048](https://github.com/DouyinFE/semi-design/pull/2048)
  - 修复 DatePicker prop value 传入非法值 NaN 触发无限更新问题  [#1846](https://github.com/DouyinFE/semi-design/issues/1846)
  - 修复 Select 的 renderOptionItem 入参中没有 Option 的 className 的问题 [#2037](https://github.com/DouyinFE/semi-design/pull/2037)
  - 修复 modal 在不打开直接卸载时候，会将 body 上原有的 overflow: hidden 删除的问题 (影响范围 2.51.0~2.51.3)
- 【Chore】
  - Form withField 引入 utility-types 的类型声明从 import 改为 import type，对使用方无影响

#### 🎉 2.52.0-beta.0 (2024-01-31)
- 【Fix】
    - 修复 Table getCurrentPageData 的类型  [@marshcat0](https://github.com/marshcat0)
    - 修复 Dropdown 点击子菜单事件 onClick 函数执行时机过早的问题，可能导致用户在 onClick 函数内无法 Focus Dropdown 外部元素并触发外部元素的 Blur，影响范围，2.43.0-beta.0 ~ 2.50.0-beta.0 [#2003](https://github.com/DouyinFE/semi-design/pull/2003)
- 【Feat】
    - Avatar 新增 `border` `bottomSlot` `topSlot` 用于控制边框，添加顶部和底部额外内容，新增 `contentMotion` 和 border `motion` 用于开启额外动效 [#2022](https://github.com/DouyinFE/semi-design/pull/2022)
    - Modal 配置项新增 `footerFill` API，用于控制 Modal 默认底部按钮是否撑满排列 [#2022](https://github.com/DouyinFE/semi-design/pull/2022)
    - Slider 新增 `handleDot`，用于控制滑块内部是否展示圆点 [#2022](https://github.com/DouyinFE/semi-design/pull/2022)
    - Table 支持使用 renderFilterDropdown 自定义筛选器 dropdown 内容  [#2015](https://github.com/DouyinFE/semi-design/issues/2015)
    - Table 组件 rowSelection 新增 renderCell 渲染选择框  [@changlin2569](https://github.com/changlin2569)
    - TreeSelect 组件支持 onClear API  [#1331 ](https://github.com/DouyinFE/semi-design/issues/1331) [@changlin2569](https://github.com/changlin2569)
    - DatePicker presets start 和 end 支持函数类型  [#2038](https://github.com/DouyinFE/semi-design/issues/2038)


#### 🎉 2.51.4 (2024-01-31)
- 【Fix】
    - 修复 Cascader 在 keyEntities 中的 key 生成规则变化后，triggerRender 的参数中的 value 参数和原来不一致问题（影响范围 2.51.0~2.51.3）[#2051](https://github.com/DouyinFE/semi-design/pull/2051)

#### 🎉 2.51.3 (2024-01-19)
- 【Fix】
    - 修复 Table propTypes 被打包工具移除掉导致报错问题 [#2031](https://github.com/DouyinFE/semi-design/pull/2031)

#### 🎉 2.51.2 (2024-01-19)
- 【Fix】
    - 修复 TextArea autosize 未监听文本域宽度变化 [#2026](https://github.com/DouyinFE/semi-design/issues/2026)
    - 修复受控 DatePicker dateTimeRange + needConfirm 时选择一个日期时输入框回显错误 [#2024](https://github.com/DouyinFE/semi-design/issues/2024)
    - 修复 ImagePreview 组件在预览时点击关闭按钮边缘时触发 onClose/onPreview 两次问题 [#2027](https://github.com/DouyinFE/semi-design/pull/2027)

#### 🎉 2.51.1 (2024-01-18)
- 【Fix】
    - 修复当 Modal 未收起时直接时直接卸载 Modal 导致页面可能滚动异常的问题 [#2023](https://github.com/DouyinFE/semi-design/pull/2023)

#### 🎉 2.51.0 (2024-01-12)
- 【Fix】
    - 修复有 maxLength 的 TextArea 在中文输入时，点击外部触发 blur，回显内容不符合 maxLength 设置问题  [#2005](https://github.com/DouyinFE/semi-design/issues/2005)
    - 修复 Cascader 中 autoMergeValue 为 false，value 为 [] 时的 typeError [#2017](https://github.com/DouyinFE/semi-design/pull/2017)
- 【Style】
    - ImagePreview 预览层的默认 zIndex 从 1000 调整为 1070 [#2021](https://github.com/DouyinFE/semi-design/pull/2021)

#### 🎉 2.51.0-beta.0 (2024-01-09)
- 【Feat】
    - Dropdown.Item 支持透传 data-* 属性到 dom
    - ImagePreview 增加 previewCls，previewStyle 用于设置预览的样式
    - Image 增加 onClick API
- 【Perf】
    - 优化 Cascader 在多选，leafOnly，可搜索，受控情况下在千级叶子节点量级时被选中出现卡顿问题 [#1999](https://github.com/DouyinFE/semi-design/pull/1999)
- 【Fix】
    - 修复 Table 所有行全选且禁用时表头选择未选中问题  [#2001](https://github.com/DouyinFE/semi-design/issues/2001)
    - 修复配置了 onSelectWithObject 的受控 AutoComplete 在点击 clear 清空按钮时报错的问题 [#2013](https://github.com/DouyinFE/semi-design/issues/2013)
    - 修复 Image 在未展示时也默认创建 portal DOM 节点的问题  [#2004](https://github.com/DouyinFE/semi-design/issues/2004)
    - 修复 Image 的 closable 参数不生效问题 


#### 🎉 2.50.1 (2024-01-04)
- 【Fix】
    - 修复 Tree 在支持 showLine 后，renderFullLabel 时缩进错误问题（影响范围：v2.50.0）[#2007](https://github.com/DouyinFE/semi-design/pull/2007)
    - 修复 Tree 在支持 showLine 后，rtl 模式下连接线和选项文字部分重合问题（影响范围：v2.50.0）[#2007](https://github.com/DouyinFE/semi-design/pull/2007)
- 【Style】
    - 修复 BreadCrumb 中 active 项 font-weight 错误问题（影响范围 v2.47-2.50）[#2008](https://github.com/DouyinFE/semi-design/pull/2008)

#### 🎉 2.50.0 (2024-01-02)
- 【Fix】
  - ImagePreview 中打开预览，切换预览图片时，zoom 改变不需要通过 onZoomIn/onZoomOut 回调透出  [#2000](https://github.com/DouyinFE/semi-design/issues/2000)
  - 修复在图片预览时切换图片触发意外的 onRotateLeft 回调

#### 🎉 2.50.0-beta.0 (2023-12-26)
- 【Feat】
    - Tree, TreeSelect 新增 showLine api  [#1801](https://github.com/DouyinFE/semi-design/issues/1801) [@Yan-XiaoMing](https://github.com/Yan-XiaoMing)
    - Table 列支持自定义排序 icon
- 【Style】
    - 修改 Tree/TreeSelect 的选项每行缩进的 CSS 实现，对于缩进层级大于 20 层的，不再有限制。 [@Yan-XiaoMing](https://github.com/Yan-XiaoMing)
- 【Fix】
    - 修复 Notification 的 Id 类型不正确的问题
    - 
#### 🎉 2.49.2 (2023-12-26)
- 【Fix】
    - 修复 Select 在单选情况下，点击外部后再次选择选项失败问题（影响范围 v2.49.0）
    - 修复受控 expandedKeys 的 TreeSelect 中，showFilteredOnly 不生效问题  [#1542 ](https://github.com/DouyinFE/semi-design/issues/1542)
    - 修复 DatePicker 类型为 monthRange 时，限制日期范围不符合预期问题。
    - 修复在全局设置 box-sizing 为 border-box 后，vertical 的 basic step 样式错误问题  [#1985 ](https://github.com/DouyinFE/semi-design/issues/1985)
    - 去除 TreeSelect/Select 的 triggerRender 的 props 的可选类型设置  [#532 ](https://github.com/DouyinFE/semi-design/issues/532)
    - 修复 `Notification.addNotice()` 未使用通过 `Notification.config()` 设置的全局配置的问题 [@lideming](https://github.com/lideming)

#### 🎉 2.49.0 (2023-12-15)
- 【Fix】
    - Image 支持在预览页面的任何位置通过面板和鼠标滚动进行缩放 [#1890](https://github.com/DouyinFE/semi-design/pull/1890)
    - Image 预览的初始尺寸做了调整。调整前，预览初始尺寸为适应页面的宽高；调整后，如果图片宽高小于适应页面的宽高，则预览初始宽高和图片宽高相同，否则以适应页面宽高进行缩放 [#1890](https://github.com/DouyinFE/semi-design/pull/1890)
    - 修复 Select 单选选择选项后，点击外部不触发 onblur 事件问题 [#1977](https://github.com/DouyinFE/semi-design/pull/1977)

#### 🎉 2.49.0-beta.0 (2023-12-11)
- 【Feat】
    - Table 支持 keepDOM，在折叠时不销毁被折叠的行 [#1969](https://github.com/DouyinFE/semi-design/pull/1969)
    - Calendar 新增 minEventHeight api 以支持在日、多日以及周视图下，当 event start 和 end 非常接近时，event dom 结构存在且有最小高度的展示 [#702](https://github.com/DouyinFE/semi-design/issues/702) 
    - TimePicker 新增 stopPropagation 用于判断是否阻止弹出层上的点击事件冒泡 [#1966](https://github.com/DouyinFE/semi-design/pull/1966)
    - SideSheet 组件支持自定义 closeIcon [@LonelySnowman](https://github.com/LonelySnowman) [#1948](https://github.com/DouyinFE/semi-design/issues/1948)
- 【Fix】
    - 修复 Slider 把手上的 tooltip 在拖动时偶尔闪烁的问题 [#1935](https://github.com/DouyinFE/semi-design/pull/1935)
    - 修复 Typography JS 截断对于不换行文本的计算错误 [@marshcat0](https://github.com/marshcat0)
    - 修复 Radio pure card 在 Safari 下点击热区不正确的问题 [@nekocode](https://github.com/nekocode) [#1959](https://github.com/DouyinFE/semi-design/issues/1959)
- 【Docs】
    - 新增 VChart 图表介绍


#### 🎉 2.48.0 (2023-12-01)
- 【Fix】
    - **修复 TimePicker format 为 HH 时，defaultValue 设置不正确问题。（注意：若原先 default 或 value 传入的值类型不合法，例如数字格式的时间戳以字符串形式传入，将不再尝试进行类型转换）**
- 【Docs】
    - 增加 @douyinfe/semi-icons-lab 的使用说明



#### 🎉 2.48.0-beta.0 (2023-11-27)
- 【Feat】
    - Slider 新增 `showMarkLabel` 控制 label 显隐， `tooltipOnMark` 在 mark 上显示 tooltip，`showArrow` 控制 tooltip 的三角形显隐
    - 字符串类型头像，字符长度可根据头像宽度自动调整  [#1917 ](https://github.com/DouyinFE/semi-design/issues/1917) [@LonelySnowman](https://github.com/LonelySnowman)
- 【Fix】
    - 修复虚拟化表格 showHeader 为 false 时表格体渲染空问题  [#726](https://github.com/DouyinFE/semi-design/issues/726)
    - 修复 Input 仅使用 addOnBefore 的情况下 borderRadius 不正确的问题  [#1912 ](https://github.com/DouyinFE/semi-design/issues/1912)

#### 🎉 2.47.1 (2023-11-28)
- 【Fix】
    - 修复 Select Group 分组场景使用 Option，未显式声明 key 属性时，filter 后列表筛选错误的问题，影响范围 (v2.46.0-v2.47.0) [#1939](https://github.com/DouyinFE/semi-design/pull/1939)
    - 修复 Dropdown item 在没有声明 onClick 时点击报错的问题，影响范围 v2.47.0 [#1936](https://github.com/DouyinFE/semi-design/issues/1936)


#### 🎉 2.47.0 (2023-11-17)
- 【Fix】
    - 修复 Table 分页器在同时传入 pageSize 和 showSizeChanger 时点击分页器返回第一页问题  [#1885](https://github.com/DouyinFE/semi-design/issues/1885)
    - 修复 Dropdown Item 右键和中键也会触发 onClick 的问题 [#1914](https://github.com/DouyinFE/semi-design/pull/1914) (影响范围：2.43.0-beta.0 ~ 2.46.1) 

#### 🎉 2.47.0-beta.0 (2023-11-15)
- 【Feat】
    - Tree/TreeSelect 支持 keyMaps API，用于自定义节点中的字段 [#1274](https://github.com/DouyinFE/semi-design/issues/1274) [#316](https://github.com/DouyinFE/semi-design/issues/316)
    - DatePicker 内嵌输入类型，支持粘贴合法日期字符串到第一个输入框后自动拆分日期与时间并选择对应日期 [#1787](https://github.com/DouyinFE/semi-design/issues/1787)
    - Table sorter 支持 sortOrder 参数 [#1897](https://github.com/DouyinFE/semi-design/pull/1897)
    - Popconfirm 增加 api：showCloseIcon 控制关闭图标展示 [#1898](https://github.com/DouyinFE/semi-design/issues/1898) [@Yan-XiaoMing](https://github.com/Yan-XiaoMing)
- 【Design token】
    - Typography 新增 $font-typography_normalText-regular-fontWeight $font-typography_smallText-regular-fontWeight $font-typography_normalParagraph-regular-fontWeight $font-typography_smallParagraph-regular-fontWeight [#1878](https://github.com/DouyinFE/semi-design/pull/1878)
    - 新增 `$color-button_disabled-bg-primary`  `$color-button_disabled-bg-secondary` `$color-button_disabled-bg-danger` `$color-button_disabled-bg-warning` `$color-button_disabled-bg-tertiary`  `$color-button_disabled_light-bg-primary` `$color-button_disabled_light-bg-secondary` `$color-button_disabled_light-bg-danger` `$color-button_disabled_light-bg-warning` `$color-button_disabled_light-bg-tertiary` [#1904](https://github.com/DouyinFE/semi-design/pull/1904)
    - 新增 `--semi-color-data-0` 系列 css variables [#1907](https://github.com/DouyinFE/semi-design/pull/1907)

#### 🎉 2.46.1 (2023-11-07)
- 【Fix】
    - 修复 Pagination popoverZIndex 在 SizeChanger 上不生效的问题

#### 🎉 2.46.0 (2023-11-03)
- 【Fix】
    - 修复 Calendar 高度不足以容纳一个事件时，更新事件后不展示「还有 x 项」问题
    - 修复 AutoComplete 中 onBlur 和 onSelect 的调用顺序不一致问题  [#1880 ](https://github.com/DouyinFE/semi-design/issues/1880)
    - 修复 Select 使用 JSX 传入 Option 时，Option 传入的 key 未在渲染时生效的问题

#### 🎉 2.46.0-beta.0 (2023-10-30)
- 【Feat】
    - Typography 的 showTooltip API 增加 renderTooltip 支持自定义渲染弹出层组件  [#1853](https://github.com/DouyinFE/semi-design/issues/1853)
- 【Fix】
    - 修复 InputNumber 在受控模式且聚焦时 formatter [#1870](https://github.com/DouyinFE/semi-design/pull/1870)
    - 修复 ide 在 ssr 场景下 dom error [#1875](https://github.com/DouyinFE/semi-design/pull/1875) [@tank0317](https://github.com/tank0317)
    - 修复异步加载数据的 Cascader 中由于 loadingKeys 更新不及时导致加载完成的节点状态错误问题  [#1867](https://github.com/DouyinFE/semi-design/issues/1867)
    - 修复由于用户 TreeData 不符合规范，被解构数据为 null 导致 TypeError 问题 [#1873](https://github.com/DouyinFE/semi-design/pull/1873)
- 【Design Token】
    - Select 新增 color-select-option-bg-selected [#1871](https://github.com/DouyinFE/semi-design/pull/1871)

#### 🎉 2.45.0 (2023-10-20)
- 【Fix】
    - 修复 resizable Table 宽度在行选择时错误设置为初始值问题（影响 v2.32~v2.44）
    - 修复 select ellipsisTrigger 在某些边界条件下更新不正确的问题
    - 修复 checkRelation 为 unRelated 的 Tree/TreeSelect 中，异步加载数据导致已选状态丢失问题
    - 修复 select ellipsisTrigger 更多数量显示错误的问题 [#1560](https://github.com/DouyinFE/semi-design/issues/1560) [@Jon-Millent](https://github.com/Jon-Millent)
   
#### 🎉 2.45.0-beta.0 (2023-10-13)
- 【Fix】
    - 修复 Select 虚拟化与 renderCreateItem 同时使用时，自定义创建选项显示位置不正确的问题  [#1856](https://github.com/DouyinFE/semi-design/issues/1856)
    - 去掉 TreeSelect/Tree 的 getDerivedState 中对 TreeData 是否变化的多余比较
- 【Design Token】
    - Anchor 新增 $color-anchor_title_active-text-hover $color-anchor_title-bg $color-anchor_title_active-bg
    - Datepicker 新增 $color-datepicker_range_trigger-border-focus
- 【Feat】
    - Notification 支持修改已弹出的内容
    - Tooltip API spacing 支持在两个轴上定义距离
    - Textarea `autosize` 支持对象参数 `{minRows: number, maxRows: number}` [@hehehai](https://github.com/hehehai)

#### 🎉 2.44.0 (2023-09-22)
- 【Fix】
    - 修复当 Image 高度设置非常小时候图片显示不全或者未显示问题 [#1838](https://github.com/DouyinFE/semi-design/issues/1838)
    - 修复 Step 部分伪类样式不正确的问题 [#1836](https://github.com/DouyinFE/semi-design/pull/1836)

#### 🎉 2.44.0-beta.0 (2023-09-19)
- 【Feat】
    - Cascader 的搜索结果面板支持虚拟化 [#1815](https://github.com/DouyinFE/semi-design/pull/1815)
    - Tag 增加 API：suffixIcon、prefixIcon [#1832](https://github.com/DouyinFE/semi-design/pull/1832)
- 【Fix】
    - 修复 Tooltip 默认文本内容时包裹 span 的 display 设置为 inline-block 导致缩略文本失效问题 [#1831](https://github.com/DouyinFE/semi-design/issues/1831)
    - 更新 tooltip 自动调整位置策略，在视口原方向空间不足，反向空间足够的情况下，统一转为反向 [#1812](https://github.com/DouyinFE/semi-design/pull/1812)

#### 2.43.2 (2023-09-15)
- 【Style】
  - Popconfirm icon 为 null 时，body 部分不保留 marginLeft 左间距 [#1828](https://github.com/DouyinFE/semi-design/pull/1828)
  - Table column filter Dropdown 增加默认最大高度 290px [#1647](https://github.com/DouyinFE/semi-design/issues/1647)
- 【Design Token】
  - Table 新增设计变量： $height-table_column_filter_dropdown
- 【Fix】
  - 修复 Calendar 月视图事件渲染结果不符合预期问题 [#1825](https://github.com/DouyinFE/semi-design/issues/1825) 

#### 2.43.1 (2023-09-11)
- 【Fix】
  - 修复 Popover Trigger 传入 ContextMenu 类型提示错误的问题 [@boenfu](https://github.com/boenfu) [#1819](https://github.com/DouyinFE/semi-design/issues/1819) 
  - 修复 React18 strict mode 下 portal 不弹出的问题 [#1769](https://github.com/DouyinFE/semi-design/issues/1769)


#### 2.43.0 (2023-09-08)
- 【Fix】
    - 修复在 Firefox 浏览器中，中文输入无法正常显示问题（影响版本 2.26.0～2.42.4）  [#1810](https://github.com/DouyinFE/semi-design/issues/1810)
    - 修复 ImagePreview 在 lazyLoad 模式下，滚动容器，视区图片未加载问题 [#1817](https://github.com/DouyinFE/semi-design/pull/1817)


#### 🎉 2.43.0-beta.0 (2023-09-04)
- 【Feat】
    - Tree 和 TreeSelect 的 renderFullLabel 回调增加 filtered 和 searchWord 参数
    - Upload 新增 API：addOnPasting，支持读取粘贴板中的图片，自动添加到 fileList 中 [@ChuTingzj](https://github.com/ChuTingzj)  [#1612](https://github.com/DouyinFE/semi-design/issues/1612)
- 【Fix】
    - 修复嵌套 Dropdown 时，Item 的点击在极个别场景不生效的问题。
    - 修复 resizable Table onHeaderCell 失效问题 [#1796](https://github.com/DouyinFE/semi-design/issues/1796)

#### 🎉 2.42.3 (2023-09-01)
- 【Fix】
    - Fix: 修复 Table baseRow onMouseLeave 报错问题 [#1794](https://github.com/DouyinFE/semi-design/pull/1794)

#### 🎉 2.42.2 (2023-08-28)
- 【Fix】
    - 修复当 Image 文件名称带 query 参数时候，图片下载后因文件名错误无法打开问题 [@nekocode](https://github.com/nekocode) [#1782](https://github.com/DouyinFE/semi-design/pull/1784)
    - 修复 js 截断策略下的 Typography，当判断为不截断，鼠标移入内容出现意外 tooltip 问题 [#1788](https://github.com/DouyinFE/semi-design/pull/1788)
    - 修复 OverflowList 组件在部分场景 key 报警告的问题 [#1786](https://github.com/DouyinFE/semi-design/pull/1786)
    - 修复 弹层组件 和 Navigation 在部分场景内存泄漏的问题。Thanks [@boliangleung](https://github.com/boliangleung) [#1785](https://github.com/DouyinFE/semi-design/pull/1785)

#### 🎉 2.42.1 (2023-08-25)
- 【Style】
    - 设置 datePicker 的内嵌标签的 font-family 为 $font-family-regular，和其他组件的内嵌标签保持一致 [#1780](https://github.com/DouyinFE/semi-design/pull/1780)

#### 🎉 2.42.0-beta.0 (2023-08-21)
- 【Feat】
    - Tooltip、Popover、Dropdown 增加 trigger=contextMenu 右键点击触发  [#396](https://github.com/DouyinFE/semi-design/issues/396)
    - Form 增加 stopValidateWithError、trigger API，允许统一配置所有 Field 的 stopValidateWithError、trigger 属性  [#640](https://github.com/DouyinFE/semi-design/issues/640)
    - Table column 支持设置 resize 属性 [#1762](https://github.com/DouyinFE/semi-design/issues/1762) [#1650](https://github.com/DouyinFE/semi-design/issues/1650)
    - Upload 新增 picWidth、picHeight 快速设置图片墙模式下图片展示宽高  [#1757](https://github.com/DouyinFE/semi-design/issues/1757)
    - Split Button 支持深层嵌套 Button [#487](https://github.com/DouyinFE/semi-design/issues/487)
    - Toast 支持堆叠模式，优化多个 toast 同时弹出时的显示体验 [#1746](https://github.com/DouyinFE/semi-design/pull/1746)
- 【Fix】
    - 修复 InputNumber 在受控模式下 formatter 错误问题  [#1672](https://github.com/DouyinFE/semi-design/issues/1672)
    - 修复 collapse aria_owns 在 SSR 下 Client 和 Server 属性不匹配的问题  [#1763](https://github.com/DouyinFE/semi-design/issues/1763)
    - Upload preview 为 true 时，增加对其他类型文件的预览兜底，防止 pdf 等其他类型文件加载失败时显示 x 裂图
- 【Style】
    - 当 Tree/TreeSelect 开启搜索，并且 treeNodeFilterProp 不为 label 时，仅高亮搜索内容而不是整行高亮  [#1711](https://github.com/DouyinFE/semi-design/issues/1711)
    - Typography ellipsis showTooltip 设为 popover 时，移除默认自带的 240px width，与 Popover 单独使用时保持一致  [#1766](https://github.com/DouyinFE/semi-design/issues/1766)

#### 🎉 2.41.3 (2023-08-17)
- 【Style】
  - Select loading wrapper 增加显式 box-sizing 声明，防止某些特殊情况下（例如全局重置了所有 DOM 的 box-sizing 为 border-box）时，loading 展示高度不对 [#1507](https://github.com/DouyinFE/semi-design/issues/1507)
- 【Chore】
  - Table 依赖的 react-resizable 版本从 v1 升级到 v3 [#1768](https://github.com/DouyinFE/semi-design/pull/1768) [#1683](https://github.com/DouyinFE/semi-design/issues/1683)

#### 🎉 2.41.2 (2023-08-14)
- 【Fix】
  - 修复 Table 表头与表体单元格在 sticky 开启时未对齐问题 [#1760](https://github.com/DouyinFE/semi-design/issues/1760)


#### 🎉 2.41.1 (2023-08-11)
- 【Feat】
  - Slider 新增 onMouseUp API 
- 【Fix】
  - 修复 Slider 鼠标移出窗口后松手再移回的场景下，handle 一直跟随鼠标的问题 [#1412](https://github.com/DouyinFE/semi-design/issues/1412)
  - SideSheet 新增自动计算滚动条宽度逻辑防止弹出时 mask 背后内容抖动
  - 修复 Input 和 TextArea autoFoucs 大小写不正确的问题 [#1608](https://github.com/DouyinFE/semi-design/issues/1608)


#### 🎉 2.41.0-beta.0 (2023-08-07)
- 【Refactor】
    - 使用 @dnd-kit/sortable 替换 react-sortable-hoc 实现 Transfer/Taginput 中拖拽 [#1683](https://github.com/DouyinFE/semi-design/issues/1683)
- 【Style】
    - Taginput 拖拽过程交互有修改，从原来的拖拽中 tag 位置发生变化修改为通过 tag 前的竖线标识拖拽中的 tag 可被放下的位置。TagInput 新增和拖拽相关的 token，$width-tagInput_sortable_item_over，$color-tagInput_sortable_item_over-bg [#1738](https://github.com/DouyinFE/semi-design/pull/1738)
- 【Fix】
    - 修复 ImagePreview 中 defaultCurrentIndex 错误的类型定义
    - 修复 document is not defined 错误 [@nekocode](https://github.com/nekocode)

#### 🎉 2.40.0 (2023-07-28)
- 【Style】
    - 删除 Button 组件中的不必要的 margin [#1732](https://github.com/DouyinFE/semi-design/pull/1732)
    - Skeleton 的默认圆角从 4px 修改为 --semi-border-radius-small(3px) [#1739](https://github.com/DouyinFE/semi-design/pull/1739)

#### 🎉 2.40.0-beta.0 (2023-07-25)
- 【Feat】
    - Form onSubmit、onSubmitFail 增加 event 参数透出  [#1728](https://github.com/DouyinFE/semi-design/issues/1728)
    - Image 的 renderPreview Menu API 支持 menuItems 参数 
    - Image, ImagePreview 提供 setDownloadName API 支持设置下载文件名称
- 【Fix】
    - 修复所有弹层组件挂载 Children 延迟一个宏任务的问题 [#1703](https://github.com/DouyinFE/semi-design/issues/1703)
    - 修复 TimePicker 在受控且 type 为 timeRange 情况下，选择两次结束时间后开始时间被自动填充为当前时间问题  [#1716](https://github.com/DouyinFE/semi-design/issues/1716)
    - 修复 TimePicker 在受控情况下将 value 设为 undefined 却显示了当前时间的问题
    - 修复 Upload 当调用 ref method 手动上传的时候会重复上传已提交的文件的问题 [@nekocode](https://github.com/nekocode) [#1720](https://github.com/DouyinFE/semi-design/issues/1720) 
- 【Style】
    - Radio addon 与 extra 的间距由 0 调整为 4px
- 【Design Token】
    - Radio 新增 Token：$spacing-radio_content-rowGap 
#### 🎉 2.39.3 (2023-07-25)
- 【Fix】
    - 修复 Tree 组件在虚拟话情况下每次 render 会重新渲染问题 [#1725](https://github.com/DouyinFE/semi-design/issues/1725)

#### 🎉 2.39.2 (2023-07-19)
- 【Fix】
    - 修复 Upload showReplace 时，上传合法文件后使用 replace 替换新文件，未正确执行 size check 的问题 [#1712](https://github.com/DouyinFE/semi-design/issues/1712)
- 【Perf】
    -  优化 Pagination small size 在亿级别数据时展示卡顿的问题 [#1714](https://github.com/DouyinFE/semi-design/pull/1714)
- 【Chore】
    - 统一 Form Foundation 中导入类型 ScrollIntoViewOptions 大小写 [#1713](https://github.com/DouyinFE/semi-design/pull/1713) [@rashagu](https://github.com/rashagu)



#### 🎉 2.39.1 (2023-07-18)
- 【Fix】
  - 修复 Form validate.then() 中的 values 入参未做作用域隔离，会受到 Field DOM 挂载、卸载影响的问题 [#1710](https://github.com/DouyinFE/semi-design/pull/1710)

#### 🎉 2.39.0 (2023-07-14)
- 【Fix】
  - Semi Webpack Plugin 修改 theme loader 引用 animation.scss 相关的逻辑，对 pnpm 场景下某些特殊目录组织兼容，解决部分项目升级构建工具后，Popover、Tooltip 等可能由于动画无法正确执行，浮层无法收起的问题 [#1704](https://github.com/DouyinFE/semi-design/pull/1704)
  - 移除 Checkbox 最外层侧 flex-wrap，解决某些特殊内容可能被意外换行的问题 [#1700](https://github.com/DouyinFE/semi-design/pull/1700)
- 【Style】
  - 移除 disabled switch 的 knob 元素在 active 态的 x 轴位移 [#1697](https://github.com/DouyinFE/semi-design/pull/1697)

#### 🎉 2.39.0-beta.0 (2023-07-10)
- 【Style】
    - 修复 TreeSelect 中在展示长 label 时内容超出 trigger 框问题  [#623](https://github.com/DouyinFE/semi-design/issues/623)
- 【Fix】
    - 修复 Anchor 在部分场景下，点击无法跳转问题 [#1688](https://github.com/DouyinFE/semi-design/pull/1688)
    
#### 🎉 2.38.2 (2023-07-10)
- 【Fix】
    - 修复 TextArea placeholder 动态更新时，未重新计算高度的问题 [@nekocode](https://github.com/nekocode) [#1690](https://github.com/DouyinFE/semi-design/pull/1690)
- 【Docs】
    - 更正英文文档中存在中文跳转链接的问题 [@ederzz](https://github.com/ederzz) [#1691](https://github.com/DouyinFE/semi-design/pull/1691)

#### 🎉 2.38.1 (2023-07-05)
- 【Fix】
    - 修复当 AutoComplete 的面板在打开时，点击外部无法关闭选项面板问题（影响范围 2.38.0）

#### 🎉 2.38.0 (2023-06-30)
- 【Fix】
    - 修复 AutoComplete 长按无法选中，onSelect 未触发问题 [#1665](https://github.com/DouyinFE/semi-design/issues/1665)
    - 修复 Cascader 禁用态 Tag 背景色与其他输入类组件不一致问题 [#1651](https://github.com/DouyinFE/semi-design/pull/1651)
    - 修复 min-Width 属性大小写拼写错误导致的 warning，影响范围 (2.37.0-beta.0 - 2.38.0-beta.0)  [#1680](https://github.com/DouyinFE/semi-design/issues/1680)
    - 修复 tooltip 在 custom trigger 的情况下，特殊场景小概率不消失的问题 [#1676](https://github.com/DouyinFE/semi-design/pull/1676)
    - 修复 Select 在 changeWithObject 时，option 中入如果传入 id 无法出现的 onChange 回调的 value 值中问题 [#1678](https://github.com/DouyinFE/semi-design/issues/1678)
- 【Design Token】
    - Toast padding token 拆分细化，$spacing-toast_content-paddingY 拆分为 $spacing-toast_content-paddingTop、$spacing-toast_content-paddingBottom，$spacing-toast_content-paddingX 拆分为 $spacing-toast_content-paddingLeft、$spacing-toast_content-paddingRight [#1674](https://github.com/DouyinFE/semi-design/pull/1674)

#### 🎉 2.37.1 (2023-06-28)
- 【Design Token】
    - card 类型的 Radio 新增 3 个 token：$color-radio_cardRadioGroup-bg-default 用于控制默认状态下的背景色，$color-radio_cardRadioGroup_border-default 用于控制默认状态下边框背景色，$color-radio_cardRadioGroup_disabled-bg-active 用于控制禁用状态并按下的背景色 [#1675](https://github.com/DouyinFE/semi-design/pull/1675)

#### 🎉 2.38.0-beta.0 (2023-06-26)
- 【Feat】
  - Tree 的 onSearch 新增 filterExpandedKeys 参数
  - Badge 新增 success 类型
- 【Fix】
  - 修复 toast useToast 返回值在用户函数 re render 后失效的问题
  - 修复 disabled 的 Cascader 无法通过 hover +N 部分显示多余 Tag 问题
  - 修复 ImagePreview 中 className 不生效问题  [#1657](https://github.com/DouyinFE/semi-design/issues/1657)
- 【Chore】
  - 更正 Form formApi.reset 入参类型的问题
- 【Style】
  - 在 disabled 情况下，点击 Cascader 不触发 focus 样式


#### 🎉 2.37.0 (2023-06-09)
- 【Fix】
    - 修复 TreeSelect searchAutoFocus 的 preventScroll 未生效问题
    - 修复 Input 在 autofocus 为 true 时 preventScroll 未生效问题
    - 修复 Upload 在 beforeUpload 中更新 fileInstance 后，未更新缩略图渲染的问题

#### 🎉 2.37.0-beta.0 (2023-06-05)
- 【Feat】
    - Pagination 新增 disabled API [#1641](https://github.com/DouyinFE/semi-design/pull/1641)
    - DatePicker 内嵌输入框在 trigger 上增加 clear 按钮 [#1638](https://github.com/DouyinFE/semi-design/issues/1638)
    - 为所有组件添加 data-* 类属性透传的功能 [#1597](https://github.com/DouyinFE/semi-design/issues/1597)
- 【Fix】
    - DatePicker preset 面板标题支持 i18n [#1643](https://github.com/DouyinFE/semi-design/pull/1643)
    - 修复 DatePicker insetInput 内嵌输入框 placeholder 占位文本错误问题 [#1638](https://github.com/DouyinFE/semi-design/issues/1638)
    - 修复 DatePicker 范围输入框 clear 按钮默认颜色不对问题 [#1638](https://github.com/DouyinFE/semi-design/issues/1638)
    - 仅当 Dropdown panel 可见时，才触发上下箭头按下事件的 stopPropagation 和 preventDefault [#1640](https://github.com/DouyinFE/semi-design/pull/1640)
- 【Style】
    - 设置 Tooltip、Toast、Notification 中内容的默认换行换行规则 [#1623](https://github.com/DouyinFE/semi-design/pull/1623)

#### 🎉 2.36.0 (2023-05-26)
- 【Fix】
  - 修复 Calander 日历多日模式中，range 包括时间时不显示非全天日程的问题 [@sylingd](https://github.com/sylingd)
  - 修复 Upload customRequest onSuccess 中 event 参数实为可选，ts 类型声明却为必填的问题 
  - 修复 ImagePreview IntersectionObserver 在 SSR 场景报错的问题（影响范围 2.34 ~ 2.36.0-beta.0）[#1595](https://github.com/DouyinFE/semi-design/issues/1595)

#### 🎉 2.36.0-beta.0 (2023-05-22)
- 【Feat】
  - DatePicker 支持设置滚轮的开始年和结束年 [#1620](https://github.com/DouyinFE/semi-design/issues/1620)
  - Calendar 支持自定义渲染顶部事件 [@sylingd](https://github.com/sylingd)
  - Calendar 支持自定义日期文案 [@sylingd](https://github.com/sylingd)
  - Nav 增加 expandIcon 自定义下拉箭头；Nav.Footer 增加 onClick 回调 [#1611](https://github.com/DouyinFE/semi-design/issues/1611)
  - Anchor 的 showTooltip API 支持 object 类型设置
  - Typography.Title 新增 weight API，用于控制字重
  - Select ref 新增 search 方法暴露
- 【Fix】
  - 修复 TimePicker 在 date-fns-tz 版本 >= 1.3.8 时 timeZone 转换问题 [#1604](https://github.com/DouyinFE/semi-design/issues/1604)
  - 修复 Tabs 中通过 tab API 传入的 ReactNode 中的 Radio，Checkbox 样式错误问题  [#1615](https://github.com/DouyinFE/semi-design/issues/1615)
  - 修复 Calendar 在改变 displayValue 时，事件渲染错误 [@sylingd](https://github.com/sylingd)
  - 修复 Typography 中省略未开启时仍抛出 ellipsis warning 的问题
  - 修复 Table  表头 column align 对齐 bug（影响范围 v2.34 ~ 2.35） [#1599](https://github.com/DouyinFE/semi-design/issues/1599)
  - 移除 DatePicker 最外层 vertical-align top 样式  [#1561](https://github.com/DouyinFE/semi-design/issues/1561)
  - 修复 Select handleInputChange 参数类型与 Input onChange 参数类型不匹配问题
- 【Design Token】
  - Typography 新增 `$font-typography_title1-fontWeight` `$font-typography_title2-fontWeight` `$font-typography_title3-fontWeight` `$font-typography_title4-fontWeight` `$font-typography_title5-fontWeight` `$font-typography_title6-fontWeight` 用于分别控制不同级别 Header 字重
- 【Docs】
  - Tabs、Typography 增加 Notice 注意事项
  - Slider 修正部分书写错误内容 [@inottn](https://github.com/inottn)


#### 🎉 2.35.0 (2023-05-12)
- 【Fix】
    - 修复 collapsible Tabs 切换 tab 后，Dropdown item 异常问题
    - 修复 select 单选和 renderSelectedItem 情况下，defaultValue 为 null 时不显示 placeholder 问题
    - 修复 部分场景下垂直 slider 点击跳转值错误的问题

#### 🎉 2.35.0-beta.0 (2023-05-10)
- 【Fix】
    - Avatar、Cascader、Form、Input 的字重定义使用默认 $font-weight-bold

#### 🎉 2.34.2 (2023-05-09)
- 【Fix】
    - 修复 Input type=search 且 showClear 为 true 时，原生清除按钮与 Semi 清除按钮同时显示的问题  [#1598](https://github.com/DouyinFE/semi-design/issues/1598)
    - 修复 DatePicker disabledDate 无法选择禁用边界日期问题  [#1592](https://github.com/DouyinFE/semi-design/issues/1592)

#### 🎉 2.34.1 (2023-05-06)
- 【Fix】
  - 修复 BreadCrumb 在设置 moreType 为 popover，MaxItem 为非默认值时候，弹出层中内容个数不正确问题 [#1590](https://github.com/DouyinFE/semi-design/pull/1590)
  - 修复 DatePicker timeZone 为整数值时的判断逻辑，使用 IANA Etc/GMT 替换 IANA 地区标识 [#1585](https://github.com/DouyinFE/semi-design/issues/1585)

#### 🎉 2.34.0 (2023-04-28)
- 【Fix】
  - 修复 Table SSR 时渲染不正确的问题  [#1466](https://github.com/DouyinFE/semi-design/issues/1466)
  - 修复 Form.InputGroup 不受 Form disabled 控制的问题 [#1575](https://github.com/DouyinFE/semi-design/pull/1575) [@xiaoqqchen](https://github.com/xiaoqqchen)
  - 修复 Typography 在父级或自身设置 white-space 为 nowrap 时截断出错问题 [#1577](https://github.com/DouyinFE/semi-design/issues/1577)
  - 修复 懒加载模式下 Image 的 src 变化，图片无法正常加载问题 [#1526](https://github.com/DouyinFE/semi-design/issues/1526)


#### 🎉 2.34.0-beta.0 (2023-04-25)
- 【Feat】
  - 新增 Rspack plugin，支持 Rspack 工程配置主题、prefixCls 等 [@Asuka109](https://github.com/Asuka109)
  - Cascader 级联选择框新增 focus/blur 方法  [#566](https://github.com/DouyinFE/semi-design/issues/566) [@meakle](https://github.com/meakle)
  - Table 列支持通过配置 ellipsis 或 ellipsis.showTitle API 实现文本内容缩略 [#1318](https://github.com/DouyinFE/semi-design/issues/1318)
- 【Style】
  - Table 文本默认换行样式从 break-all 修改为 break-word  [#1318](https://github.com/DouyinFE/semi-design/issues/1318)
  - BreadCrumb 中 icon 和文本间距从 8px 修改为 4px（影响面 v2.0.0～v2.33.1）
- 【Fix】
  - 修复 TimePicker range 模式先选择结束时间，会导致报错的问题  [#1563](https://github.com/DouyinFE/semi-design/issues/1563)
  - Steps 更改为只在 Steps 传入 onChange 或 Steps.Step 传入 onClick 时，才会 hover 时展示 hover 态。
  - 修复 RadioGroup 父级容器高度会跟随 RadioGroup 选项不同而变化的问题  [#1573](https://github.com/DouyinFE/semi-design/issues/1573)
  - 修复 Calendar 组件月视图中，最后一周日期样式错误 [@sylingd](https://github.com/sylingd)
  - Typography resize 后可能会丢失省略 [@marshcat0](https://github.com/marshcat0)
  - Typography resize 后展开状态可能会被变成折叠 [@marshcat0](https://github.com/marshcat0)
  - Typography 展开按钮可能会在不需要折叠时出现 [@marshcat0](https://github.com/marshcat0)
- 【Breaking Change】
  - **为了解决单词换行问题，Table 换行样式从 break-all 修改为 break-word。如果非 fixed 表格某列设置固定了宽度，原来这一列的单元格文本会折行，现在会撑开展示，导致其他列宽度减少** [#1318](https://github.com/DouyinFE/semi-design/issues/1318)

#### 🎉 2.33.1 (2023-04-21)
- 【Fix】
    - 修复 Popover StopPropagation 未对 Portal 弹层内触发的 focus、blur 做阻止冒泡的问题 [#1557](https://github.com/DouyinFE/semi-design/pull/1559)
    - 修复 Input 关于 noBg props 报错的问题，影响范围 2.33.0-beta.0 - 2.33.0
    - 修复 修复 Table hideExpandedColumn 为 false 时 indent 问题 [#1556](https://github.com/DouyinFE/semi-design/issues/1556)
  
#### 🎉 2.33.0 (2023-04-14)
- 【Fix】
    - 修复 Transfer 中可拖拽 item 使用 label 作 SortableItem 的 key 导致相同 label 的 item 无法拖动问题
    - 修复使用 cjs 产物时，Webpack plugin 配置的 prefixCls 不生效的问题 [#1544](https://github.com/DouyinFE/semi-design/pull/1544)
    - 修复 Sidesheet 在 mask=false 时，mask 背景内容无法点击的问题，影响范围 2.32.0-beta.0 ~ 2.33.0-beta.0 [#1550](https://github.com/DouyinFE/semi-design/pull/1550)
    - 修复 DatePicker disabledDate 回调中的 rangeStart 和 rangeEnd 使用缓存值问题 [#777](https://github.com/DouyinFE/semi-design/issues/777)

#### 🎉 2.33.0-beta.0 (2023-04-10)
- 【Feat】
    - 表单输入类组件 Input TextArea Select Cascader TimePicker DatePicker TreeSelect 新增 borderless api 用于显示无边框组件 [#1537](https://github.com/DouyinFE/semi-design/pull/1537)
    - Collapse 新增 clickHeaderToExpand 用于设置点击响应热区 [#1537](https://github.com/DouyinFE/semi-design/pull/1537)
- 【Fix】
    - 将 Typography 中的 copy/copied icon 垂直对齐方式从 text-bottom 改为 middle [#1533](https://github.com/DouyinFE/semi-design/pull/1533)
    - 对齐表单输入类组件 Input TextArea Select Cascader TimePicker DatePicker TreeSelect 的 hover 和 active 态 [#1537](https://github.com/DouyinFE/semi-design/pull/1537)
    - 修复 Typography 的 copyable 类型错误 [@baranwang](https://github.com/baranwang) [#1546](https://github.com/DouyinFE/semi-design/pull/1546)

#### 🎉 2.32.1 (2023-04-06)
- 【Fix】
    - 修复 Tooltip 配合 loading button 使用在生产环境可能会报错的问题 [#1540](https://github.com/DouyinFE/semi-design/pull/1540)
    - 修复 Navigation 使用 JSX 写法配置 Footer、Header，在生产环境下可能未能正确识别的问题 [#1540](https://github.com/DouyinFE/semi-design/pull/1540)
    - 修复 Table 使用 JSX Children 写法配置 Columns 时，在生产环境下可能未能正确识别 Column 的问题 [#1540](https://github.com/DouyinFE/semi-design/pull/1540)
    - 修复 Tab Pane 类名存在多余空格的问题 [#1536](https://github.com/DouyinFE/semi-design/pull/1536)
-  【Docs】
    - 更正 Table 的 onFilter 中 filteredValue 参数错误的类型定义 [#1538](https://github.com/DouyinFE/semi-design/pull/1538)

#### 🎉 2.32.0 (2023-03-31)
- 【Fix】
    - 修复 Spin 因为 .semi-spin-wrapper div 高度不正确导致位置上移问题 [#1507](https://github.com/DouyinFE/semi-design/issues/1507)
    - 修复 resizable Table 与 form 标签同时存在在 dev 环境下报错问题 [#1506](https://github.com/DouyinFE/semi-design/issues/1506)
    - 修复 Table 设置斑马纹无效问题（影响范围：v2.29 - 2.32）
    - 修复 Modal getPopupContainer 执行时机不正确的问题，预期为 Modal 打开时执行

#### 🎉 2.32.0-beta.0 (2023-03-28)
- 【Design Token】
  - Modal 提供 `$spacing-modal_content_fullscreen-top` 用于控制全屏时顶部高度，Sidesheet 新增 `$color-sideSheet_header-borderBottom` `$width-sideSheet_header-borderBottom` 用于在 header 下添加分割线， `$width-sideSheet_size-small` `$width-sideSheet_size-medium` `$width-sideSheet_size-large` 控制默认展开宽度
- 【Feat】
  - DatePicker 新增 type monthRange
  - TreeSelect、Cascader、Select 的 TriggerRender API 参数支持 onSearch 和 onRemove 分别用于支持自定义 trigger 启动搜索，删除单个已选项
  - TreeSelect 新增 clickTriggerToHide 参数支持设置在面板打开状态下，点击 Trigger 部分是否触发面板关闭
  - DatePicker 支持 open、close、focus、blur 方法和 onClickOutside 回调  [#566](https://github.com/DouyinFE/semi-design/issues/566)
- 【Fix】
  - 修复 DatePicker type month 开启上下方位快捷选择面板样式不符合预期问题，开启 insetInput 前后面板宽度不一致问题
  - 更改 Switch 中 state 在 constructor 中的初始设置，避免在其他组件中使用时候出现不符合预期的动画


#### 🎉 2.31.3 (2023-03-31)
- 【Fix】
    - 修复 DatePicker 在 date-fns-tz 版本 >= 1.3.8 时 timeZone 转换问题  [#1522](https://github.com/DouyinFE/semi-design/issues/1522)

#### 🎉 2.31.2 (2023-03-24)
- 【Fix】
    - 修复 Nav tooltip 相关延迟 props 不生效的问题  [#1454](https://github.com/DouyinFE/semi-design/issues/1454)
    - 修复 Select remote 且 autoClearSearchValue 为 false 时，更新 optionList 后未正确显示的问题（影响范围：v2.28 - 2.31）[#1386](https://github.com/DouyinFE/semi-design/issues/1386)

#### 🎉 2.31.1 (2023-03-22)
- 【Chore】
    - Semi Webpack Plugin 增加直接从 Compiler Instance 中获取 NormalModule 的逻辑 [#1503](https://github.com/DouyinFE/semi-design/pull/1503)

#### 🎉 2.31.0 (2023-03-17)
- 【Fix】
    - 修复 ImagePreview 组件中预览图片改变 ratio 状态并切换图片后，新图片 ratio 不正确问题 [#1494](https://github.com/DouyinFE/semi-design/issues/1494)
    - 修复 Carousel props.children 更新后组件未重新更新问题  [#1482](https://github.com/DouyinFE/semi-design/issues/1482)
    - 修复 Carousel ref method play 与 autoPlay.hoverToPause 的 mouseEnter 事件冲突，未拥有最高优先级问题
    - 修复 Table 全选后翻页表头选择框状态错误问题  [#325](https://github.com/DouyinFE/semi-design/issues/325)
    - Select onSearch 提供第二个入参，解决无法区分 1 选择后自动清空 input 触发 onSearch、2 主动使用 backspace 清空 input 触发 onSearch 3 点击 clear icon 触发 onSearch 等不同场景的问题   [#867](https://github.com/DouyinFE/semi-design/issues/867)
    - 修复 Popconfirm 确认按钮与取消按钮在返回 promise 时没有展示 loading 问题（影响 2.30 ~ 2.31 版本）  [#1489](https://github.com/DouyinFE/semi-design/issues/1489)
    - 修复对于单选，可搜索且搜索框在 Trigger 中，虚拟化的 TreeSelect，用户需要点击两次选项才能选中问题  [#1487](https://github.com/DouyinFE/semi-design/issues/1487)

#### 🎉 2.31.0-beta.0 (2023-03-13)
- 【Feat】
    - Table 固定列支持 RTL，Table 支持 direction prop  [#1471](https://github.com/DouyinFE/semi-design/issues/1471)
    - Typography 的复制节点支持自定义  [#1420](https://github.com/DouyinFE/semi-design/issues/1420)
    - Popover Tooltip 等带弹层组件支持 keepDOM，支持设置关闭时是否保留内部组件不销毁 [#1481](https://github.com/DouyinFE/semi-design/pull/1481)
- 【Fix】
    - 修复 Table column align 在 RTL 时未自动切换问题  [#1471](https://github.com/DouyinFE/semi-design/issues/1471)
    - 修复对于单选，可搜索，受控的 Cascader 在搜索状态下，value 改变导致搜索值发生变化问题  [#1472](https://github.com/DouyinFE/semi-design/issues/1472)
    - 使用可选操作符替换冗余的类型定义 [@thinkasany](https://github.com/thinkasany) [#1464](https://github.com/DouyinFE/semi-design/pull/1464)
- 【Style】
    - 根据 children 类型处理 Tag 组件中内容样式，children 是 String 则能够自定文本省略，否则样式对齐 [#1475](https://github.com/DouyinFE/semi-design/pull/1475)
    - 修复单选，可搜索的 Cascader，size 为 small 或 large 时，其输入框光标位置不正确问题  [#1468](https://github.com/DouyinFE/semi-design/issues/1468)

---
#### 🎉 2.30.2 (2023-03-09)
- 【Fix】
    - Form 有 id 传入时，x-form-id 优先使用传入的 id
    - 修复 Tooltip 下 Tag 无法通过键盘聚集问题
    - 修复 Modal 在命令式调用时，danger type 底部按钮颜色不正确的问题，影响范围 v2.0.0 - v2.30.1

#### 🎉 2.30.1 (2023-02-27)
- 【Fix】
  - 修复 Dropdown showTick 失效问题（影响范围 2.27.1 ~ 2.30.0）[#1457](https://github.com/DouyinFE/semi-design/issues/1457)

#### 🎉 2.30.0 (2023-02-23)
- 【Fix】
  - 修复 Modal 在命令式调用关闭后，未删除多余 div 的问题  [#1415](https://github.com/DouyinFE/semi-design/issues/1415)
  - TreeSelect 修复部分场景下，hover 时 border 颜色异常的问题 [#1416](https://github.com/DouyinFE/semi-design/pull/1446)
  - 修复 TreeSelect 中 onBlur/onFocus 调用时机错误问题 [#1414](https://github.com/DouyinFE/semi-design/pull/1444)
  - 修复 TreeSelect 中 preventScroll 未声明及未透传问题 [#1414](https://github.com/DouyinFE/semi-design/pull/1444)
  - 修复 Tooltip 在右侧被遮挡时浮层漂移到视口左侧 [#1449](https://github.com/DouyinFE/semi-design/pull/1449)
- 【Design Token】
  - Select 新增 `$color-select-bg-focus` [#1416](https://github.com/DouyinFE/semi-design/pull/1446)

#### 🎉 2.30.0-beta.0 (2023-02-20)
- 【Breaking Change】
    - **修改 Numeral 组件中 rule 为 percentages 时候的计算规则**
- 【Feat】
    - Popconfirm 支持 A11y 键盘和焦点  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Cascader 支持通过 ref 调用 open/close 方法 
    - 优化 DatePicker 面板底部日期的展示格式，根据不同 locale 语言习惯配置 [@jacob-lcs](https://github.com/jacob-lcs)
- 【Style】
    - solid Tag 关闭按钮增加 hover 态颜色 var(--semi-color-white）和 active 态颜色 var(--semi-color-white)(opacity 0.9)，default 颜色从 var(--semi-color-white）改为 var(--semi-color-white)(opacity 0.8)。
- 【Fix】
    - 修复 DatePicker 多选面板移动问题  [#1422](https://github.com/DouyinFE/semi-design/issues/1422)
    - 修复 nl-NL 语言包 localeCode 错误的问题，影响范围 (v2.29.0-beta.0) [@jacob-lcs](https://github.com/jacob-lcs)

#### 🎉 2.29.0 (2023-02-10)
- 【Feat】
    - Locale 增加瑞典语：sv_SE、波兰语：pl_PL、荷兰语：nl_NL 支持 [i18n] 增加瑞典语、波兰语、荷兰语的支持 [#1410](https://github.com/DouyinFE/semi-design/issues/1410)
- 【Fix】
    - 优化俄语、阿拉伯语、罗马尼亚语种单复数文本显示问题
    - 修复 DatePicker 内嵌输入框受控模式下 dateTimeRange 回显错误问题 [#1413](https://github.com/DouyinFE/semi-design/issues/1413)
- 【Design Token】
    - Table Design Token 变更，修改以下 Token 默认值：$color-table_body-bg-default、$color-table-bg-default，由 var(--semi-color-bg-2) 变更为 var(--semi-color-bg-1)，$color-table_th-bg-default 值从 transparent 改为 var(--semi-color-bg-1) [#1418](https://github.com/DouyinFE/semi-design/pull/1418)

#### 🎉 2.29.0-beta.0 (2023-02-06)
- 【Feat】
    - Form.InputGroup 支持配置 extraText, extraTextPosition，对齐 Field Component [#1313](https://github.com/DouyinFE/semi-design/issues/1313)
    - DatePicker insetInput 输入框支持传入 placeholder [#1343](https://github.com/DouyinFE/semi-design/issues/1343)
    - Transfer 新增 renderSourceHeader，renderSelectedHeader 支持用户能够自定义左右面板头部信息 [#1403](https://github.com/DouyinFE/semi-design/issues/1403)
    - Locale 增加瑞典语：sv_SE、波兰语：pl_PL、荷兰语：nl_NL 支持 [#1410](https://github.com/DouyinFE/semi-design/issues/1410)
- 【Fix】
    - 修复 DatePicker 输入日期后面板未更新问题 [#1398](https://github.com/DouyinFE/semi-design/issues/1398)
    - 修复 visible 属性变化时，trigger 不为 hover 和 focus 的 tooltip 也延迟了展示/隐藏的问题 [@marshcat0](https://github.com/marshcat0)
    - 优化 俄语、阿拉伯语、罗马尼亚语种下单复数文本显示问题，涉及组件 Pagination、Transfer、Calendar [#1411](https://github.com/DouyinFE/semi-design/pull/1411)
- 【Docs】
    - 优化 Form 组件英文文档描述 及 Demo 
- 【Design Token】
    - Slider 新增` $spacing-slider_handle-translateY`、`$spacing-slider_vertical_handle-translateX`、`$spacing-slider_dot-translateX`、`$spacing-slider_vertical_dot-translateY` Token，用于控制水平和垂直状态 把手和数值刻度线的水平和垂直偏移 [#1391](https://github.com/DouyinFE/semi-design/pull/1391)
  
#### 🎉 2.28.1 (2023-01-31)
- 【Fix】
    - 修复 DatePicker 选择时间范围时面板移动问题 [#1221](https://github.com/DouyinFE/semi-design/issues/1221)
    - 修复 React18 严格模式下 overflowList 没有正常显示问题 [#1393](https://github.com/DouyinFE/semi-design/issues/1393)
    - 修复 Inputgroup 下 Select 出现 不符合预期的滚动条的问题 [#1395](https://github.com/DouyinFE/semi-design/issues/1395)
    - 修复 Select loading spin 垂直方向未居中的问题 
-  【Docs】
    - Locale Demo 更新，增加 Form、Image、Transfer 示例 [@jacob-lcs](https://github.com/jacob-lcs)

#### 🎉 2.28.0 (2023-01-18)
- 【Fix】
    - 修复 TagInput showContentTooltip 类型不完整问题
    - 修复 TimePicker 选择模式为 normal 和 wheel 时，滚动条表现不一致问题 [@frowhy](https://github.com/frowhy)
-  【Docs】
    - 快速开始：更新 NextJs 项目接入指引
    - 快速开始：更新 Remix 项目接入指引  

#### 🎉 2.28.0-beta.1 (2023-01-17)
- 【Feat】
    - Select 新增 expandRestTagsOnClick API，默认值为 false，在多选且 maxTagCount 存在情况下，打开面板状态下可以展示剩余 tag [#1353](https://github.com/DouyinFE/semi-design/pull/1353)
    - 新增 TabItem 组件，用于 C2D 中 TabItem 变体生成 [#1374](https://github.com/DouyinFE/semi-design/pull/1374)
    - Cascader 新增 filterSorter API 支持对搜索后结果进行排序  [#1355](https://github.com/DouyinFE/semi-design/issues/1355)
    - Cascader 新增 filterRender  API 对搜索后结果进行自定义渲染  [#1350](https://github.com/DouyinFE/semi-design/issues/1350)
    - Cascader / TreeSelect / Tree 的 filterTreeNode API 函数形式增加 data 参数  [#1104](https://github.com/DouyinFE/semi-design/issues/1104)
    - webpack 插件新增 overrideLoaderList 选项，支持更细粒度自定义 semi 相关样式所用 loaders [#1382](https://github.com/DouyinFE/semi-design/pull/1382)
    - 声明式使用 Modal 时，可通过 onOK onCancel 返回 promise 来自动控制对应按钮的 loading 态 [#1369](https://github.com/DouyinFE/semi-design/issues/1369)
    - Select 新增 ellipsisTrigger API，默认值为 false，可以在设置 maxTagCount 情况下对溢出部分的 tag 做自适应处理，当宽度不足时，最后一个 tag 内容作截断处理。开启该功能后会有一定性能损耗，不推荐在大表单场景下使用 [#1353](https://github.com/DouyinFE/semi-design/pull/1353)
- 【Fix】
    - 修复 OverflowList 在 display flex 布局下不展示问题 [#1353](https://github.com/DouyinFE/semi-design/pull/1353)
    - 修复 OverflowList 在第一个 item 就溢出情况下不触发 onOverflow 回调问题 [#1353](https://github.com/DouyinFE/semi-design/pull/1353)
    - 修复 OverflowList items 改变后靠近顶部溢出部分 items 数量不符合预期问题  [#1362](https://github.com/DouyinFE/semi-design/issues/1362)
    - 修复 Select 受控模式下 autoClearSearchValue 为 false 时未生效的问题  [#1386](https://github.com/DouyinFE/semi-design/issues/1386)
    - 修复 Layout 挂载 has-sider className 慢一个任务周期的问题  [#1361](https://github.com/DouyinFE/semi-design/issues/1361)
- 【Design Token】
    - Toast 新增 token 用于定制多色样式下不同背景色 `$color-toast_warning_light-icon` `$color-toast_success_light-icon` `$color-toast_info_light-icon` `$color-toast_danger_light-icon` [#1371](https://github.com/DouyinFE/semi-design/pull/1371)

#### 🎉 2.27.1 (2023-01-12)
- 【Fix】
    - **修复 Form Field 级别校验，使用 props.rules 时存在竞态异步，后执行的校验会被前执行的校验覆盖的问题  [#1375](https://github.com/DouyinFE/semi-design/issues/1375) [@SyMind](https://github.com/SyMind) (注意：如果原先存在对单次值修改，触发多次重复校验逻辑。例如本身 props.trigger 已配置为 change，又在 onChange 回调中手动调用 formApi.validate 对其进行了校验等，前面执行的校验将会被丢弃，即 promise pending，不再 resolve 或 reject)**
    - 修复 Form Field 级别校验，使用 props.validate 时存在竞态异步，后执行的校验会被前执行的校验覆盖的问题  [#1375 ](https://github.com/DouyinFE/semi-design/issues/1375)
- 【Docs】
    - 修改 Cascader / TreeSelect / Tree 文档中 treeData API 类型名，使其和 Ts 代码 interface 一致

#### 🎉 2.27.0 (2023-01-06)
- 【Fix】
    - 修复 Select 在配置了 outerBottomSlot、outTopSlot、innerBottomSlot、innerTopSlot 后，hover 到 Slot 中，Option 仍保持 focus 样式，易使用户产生疑惑的问题 [#1370](https://github.com/DouyinFE/semi-design/pull/1370)
    - 修复 Tabs 滚动折叠有概率失效问题 [#693](https://github.com/DouyinFE/semi-design/issues/693)
    - 修复 Transfer 内部变量 prefixcls 未使用小驼峰，与其他组件有差异的问题（对使用侧无影响）[@MarchYuanx](https://github.com/MarchYuanx) [#1365](https://github.com/DouyinFE/semi-design/pull/1365)

#### 🎉 2.27.0-beta.0 (2023-01-03)
- 【Fix】
    - 修复 SSR 场景下 TabBar 中的 uuid 不匹配警告  [#1351](https://github.com/DouyinFE/semi-design/issues/1351)
- 【Design Token】
    - Form 的 label section 新增上边距 token `$spacing-form_label-marginTop` `$spacing-form_section_text-paddingTop` `$spacing-form_section_text-marginTop`
    - DatePicker range 模式下新增 trigger 边框相关 token (宽度 `$width-datepicker_range_trigger-border`，各种状态下的颜色 `$color-datepicker_range_trigger-border` `$color-datepicker_range_trigger-border-hover` `$color-datepicker_range_trigger-border-active`)
    - breadcrumb 新增 `$font-breadcrumb_loose-fontSize` `$font-breadcrumb_compact-fontSize` 
    - Descriptions 新增 `$font-descriptions_key_small-fontSize` `$font-descriptions_value_small-fontSize` `$font-descriptions_key_medium-fontSize` `$font-descriptions_value_medium-fontSize` `$font-descriptions_key_large-fontSize` `$font-descriptions_value_large-fontSize`
    - SideSheet 新增 `$font-sideSheet_title-fontSize` 
    - Steps 修正部分 Token 描述

#### 🎉 2.26.0 (2022-12-27)
- 【Fix】
    - 修复 TagInput 在中文输入时，会将拼音的长度用于判断是否超出 maxLength 的问题  [#1347](https://github.com/DouyinFE/semi-design/issues/1347)

#### 🎉 2.26.0-beta.0 (2022-12-19)
- 【Feat】
    - Table 筛选器功能支持不传 filters，筛选功能通过受控使用  [#1201](https://github.com/DouyinFE/semi-design/issues/1201)
- 【Fix】
    - 修复空字符串但没有达到最大宽度时，却展示了"展开/折叠"按钮及省略号 [@weeqe](https://github.com/weeqe) [#621](https://github.com/DouyinFE/semi-design/issues/621)
    - 修复 TreeSelect 中当 checkRelation 为 unRelated, 且 value 不存在于 TreeData 时的 TypeError 问题  [#1206](https://github.com/DouyinFE/semi-design/issues/1206) 
    - 修复 Grid 组件 span 设置为 0，在响应式模式下异常显示的问题 [@edc-hui](https://github.com/edc-hui) [#1314](https://github.com/DouyinFE/semi-design/issues/1314)

#### 🎉 2.25.2 (2022-12-19)
- 【Fix】
    - 修复 Tooltip position 为 topLeft 时，自动调整位置不正确问题 [#1344](https://github.com/DouyinFE/semi-design/pull/1344)
    - 修复 TagInput 可拖动时样式错误问题 [#1339](https://github.com/DouyinFE/semi-design/pull/1339)
    - 修复 semi-icons 以及 semi-illustration 中不同 svg 中的元素 id 相同导致同时使用时显示有误问题 [#1337](https://github.com/DouyinFE/semi-design/pull/1337)
    - 修复当 Select 中选项为空，并且 emptyContent=null 时候仍然有下拉框的问题 [#1340](https://github.com/DouyinFE/semi-design/pull/1340)
    - 修复 OverflowList collapse 模式下 item 数量大于 50 时会造成 react 超出最大更新深度问题

#### 🎉 2.25.0 (2022-12-09)
- 【Fix】
  - 修复 disabled switch 被 Tooltip 或 Popover 等组件包裹，且 trigger 为 hover 时，在 chrome 浏览器下，鼠标移开后未能正确隐藏的问题 [#1333](https://github.com/DouyinFE/semi-design/pull/1333)
  - 修复 Image 多余参数未透传至 img 节点的问题 [#1334](https://github.com/DouyinFE/semi-design/pull/1334)
  - 修复 部分组件在 React18 下动画闪烁的问题 [#1270](https://github.com/DouyinFE/semi-design/pull/1270), [#1257](https://github.com/DouyinFE/semi-design/issues/1257)
  - 修复 TimePicker、TagInput 在 InputGroup 中圆角以及高度不对的问题 [#1268](https://github.com/DouyinFE/semi-design/issues/1268) [@edc-hui](https://github.com/edc-hui)
#### 🎉 2.25.0-beta.0 (2022-12-06)
- 【Feat】
  - Select、Cascader、Input、InputNumber、TreeSelect、AutoComplete、Datepicker、TimePicker 增加 clearIcon，允许覆盖清除按钮 [#1309](https://github.com/DouyinFE/semi-design/issues/1309)
  - Cascader、Select、DatePicker、TimePicker、TreeSelect 增加 dropdownMargin 配置，Dropdown、Popover 增加 margin 配置，作用同 tooltip margin
  - type 为 timeRange 的 TimePicker 组件，支持传入数组格式的 panelHeader 和 panelFooter 来设置不同的头部和底部[#1316](https://github.com/DouyinFE/semi-design/issues/1316) [@zk8080](https://github.com/zk8080)
  - TreeSelect 增加 position 参数控制弹出层方向 
- 【Fix】
  - 修复虚拟化 Table 无数据时高度展示不正确问题
  - 修复 Tooltip 通过 style 定制 opacity 透明度时可能导致的闪烁的问题
- 【Style】
  - Tag 关闭按钮增加 hover 态和 active 态颜色
  - 优化 Tag 在内容超出长度时的展示方式，自动省略 [@SyMind](https://github.com/SyMind)


#### 🎉 2.24.3 (2022-12-05)
- 【Chore】
    - 优化 Form HOC：`withFormState`、`withFormApi`的类型定义  [#1323](https://github.com/DouyinFE/semi-design/pull/1323)
    - 优化 Nav 的类型定义，callback 类 props 入参增加可选类型

#### 🎉 2.24.1 (2022-11-25)
- 【Fix】
    - 修复 DatePicker 月份选择 disabledDate 交互问题  [#520](https://github.com/DouyinFE/semi-design/issues/520)

#### 🎉 2.24.0 (2022-11-25)
- 【Fix】
    - 修复 TreeSelect 中当 searchAutoFocus 为 true，并且 searchPosition 在 dropdown 中，打开选项面板导致页面滚动问题  [#1306 ](https://github.com/DouyinFE/semi-design/issues/1306)
    - 修复 Tabs 折叠滚动情况下，因为 scrollIntoView 参数带来的过多页面滚动干扰
    - 修复 Input 派生的其他 Input 类组件（如 InputNumber）点击前/后缀不会正常聚焦 Input  [#1237 ](https://github.com/DouyinFE/semi-design/issues/1237)
    - 修复 InputNumber 设置 innerButtons 为 true 时聚焦样式问题  [#1144 ](https://github.com/DouyinFE/semi-design/issues/1144)

#### 🎉 2.23.7 (2022-11-23)
- 【Fix】
    - 修复单张图片在预览时无法显示自定义 Header 问题

#### 🎉 2.23.6 (2022-11-23)
- 【Fix】
    - 修复 Tooltip trigger 被遮挡时弹层也被遮挡问题

#### 🎉 2.24.0-beta.1 (2022-11-22)
- 【Style】
    - 调整 Highlight 样式，默认背景高亮
- 【Design Token】
    - Design Token 调整，@douyinfe/semi-theme-default 新增全局 Token `--semi-color-highlight-bg`、`--semi-color-highlight`

#### 🎉 2.24.0-beta.0 (2022-11-21)
- 【New Component】
    - 新增 Highlight 组件 [#1281](https://github.com/DouyinFE/semi-design/pull/1281)
- 【Feat】
    - Nav 支持透传 getPopupContainer，可用于局部暗色模式下指定弹出层容器， [#1277](https://github.com/DouyinFE/semi-design/issues/1277)
    - ImagePreview 新增 crossOrigin 参数  [#1284 ](https://github.com/DouyinFE/semi-design/issues/1284)
    - Form Field 组件增加将 props.name 透传至底层组件消费的功能，不再进行拦截（可影响 Form.Input、Form.Upload、Form.CheckboxGroup、Form.RadioGroup 及其他用 withField 封装的自定义组件）。原有对 field wrapper classname 的影响依然保留  [#1266](https://github.com/DouyinFE/semi-design/issues/1266)
    - Navigation 新增 renderWrapper API 用于更便捷地与 react-router、next、gatsby 等路由库结合 [#1249](https://github.com/DouyinFE/semi-design/pull/1249)
- 【Perf】
    - 缓存 withField HOC 中的 FieldComponent 组件，在默认 shouldMemo 场景下避免组件重复计算，降低复杂表单场景下带来的重复性能消耗 [#1228](https://github.com/DouyinFE/semi-design/pull/1228)
- 【Style】
    - 修改 Cascader/TreeSelect 中用到的 TagInput 的样式 [#1278](https://github.com/DouyinFE/semi-design/pull/1278)
- 【Fix】
    - 修复 Image 组件在预览图片的时候，鼠标滚轮事件会穿透弹层，导致弹层之下的内容滚动问题 [#1289](https://github.com/DouyinFE/semi-design/pull/1289) [@edc-hui](https://github.com/edc-hui)
    - TimePicker 在生产环境输出 console log [@jukrb0x](https://github.com/jukrb0x)
    - 修复 Select 单选模式下，filter 开启情况下，点击选择收起列表时，会闪烁一次的问题 [#1207](https://github.com/DouyinFE/semi-design/issues/1207)

#### 🎉 2.23.3 (2022-11-15)
- 【Style】
    - Form 组件 Design Token 修正，`$spacing-form_label_extra_posBottom-marginTop`、`$spacing-form_label_extra_posMid-marginBottom`、`$spacing-form_label_extra_posMid-marginTop`更正为更符合语义的 `$spacing-form_extra_posBottom-marginTop`、`$spacing-form_extra_posMid-marginBottom`、`$spacing-form_extra_posMid-marginTop`，并更正相关文档描述 [#1272](https://github.com/DouyinFE/semi-design/pull/1272)
- 【Fix】
    - 修复 Select 多选时，删除 Tag 不触发聚集却有聚集样式问题
    
#### 🎉 2.23.2 (2022-11-14)
- 【Fix】
    - 修复 React 18 + NextJS SSR 环境下 Input 组件关于 style props 报错的问题 [#1262](https://github.com/DouyinFE/semi-design/issues/1262) [#1181](https://github.com/DouyinFE/semi-design/issues/1181)
- 【Style】
    - 修复 TagInput 中多行内容时，最后一行与其他行行间距不一致的问题 [#1263](https://github.com/DouyinFE/semi-design/pull/1263)
    - 修复 Form Label 标签右侧边距丢失的问题（影响范围 v2.23.1） [#1258](https://github.com/DouyinFE/semi-design/pull/1258)
    - Switch 组件 Design Token 更新，新增 `$spacing-switch_knob-left`；`$motion-switch_unchecked-translateX`更正为更符合语义的 `$spacing-switch_unchecked-translateX`; [#1267](https://github.com/DouyinFE/semi-design/pull/1267)

#### 🎉 2.23.1 (2022-11-11)
- 【Fix】
    - 修复 Popover 中的 Transfer 在拖拽时导致 Popover 意外关闭问题  [#1226](https://github.com/DouyinFE/semi-design/issues/1226)
    - 修复 弹出层中的 Transfer/ TagInput 在拖拽时被拖拽项消失问题  [#1149](https://github.com/DouyinFE/semi-design/issues/1149)
    - 更正 Table 分页器 在越南语 (vi_VN) 展示时翻译错误问题 [#1252](https://github.com/DouyinFE/semi-design/pull/1252) [@MrFatMeow](https://github.com/MrFatMeow) 
    - 修复 Select 和 Tooltip 组件未处理 props.value / props.rePosKey 传入 NaN 的情况 [#763](https://github.com/DouyinFE/semi-design/issues/763)  [@edc-hui](https://github.com/edc-hui)
    - 修复 SideSheet 中挂载 children 时机延迟的问题（影响版本 v2.22.beta.0 - v2.23.beta.0） [#1255](https://github.com/DouyinFE/semi-design/pull/1255)
    - 修复 Dropdown 在 trigger 为 click 时，会触发屏幕滚动到顶部问题
- 【Design Token】
    - Form 组件 Design Token 更新，`$spacing-form_label_small-paddingTop` 修正为 `$spacing-form_switch_rating_marginY`，去掉无实际作用的 `$spacing-form_label-paddingRight`；更正更准确的中文描述 [#1258](https://github.com/DouyinFE/semi-design/pull/1258)
    - Tabs 组件 Design Token 更新，增加折叠箭头按钮相关的 Token，允许单独对 Tabs 中的箭头按钮定制样式 [#1251](https://github.com/DouyinFE/semi-design/pull/1251)

#### 🎉 2.23.0-beta.1 (2022-11-08)
- 【Feat】
    - Tooltip 新增 margin 参数，计算溢出时的增加的冗余值，autoAdjustOverflow 提供更智能的位置调整策略
    - 新增 IconConnectionPoint1、IconConnectionPoint2、IconCalendarStroked、IconConfigStroked、IconIssueStroked、IconStoryStroked、IconVersionStroked 等 icon
- 【Style】
    - Cascader 的菜单项中右侧图标增加左侧外边距

#### 🎉 2.23.0-beta.0 (2022-11-07)
- 【Fix】
  - 修复 Navigation item 在有参数 link 情况下跳转链接热区与 onSelect 热区不一致问题
  - 更正 DatePicker 在土耳其语（tr_TR）展示时周六、周日翻译的文本 [@habibokumus](https://github.com/habibokumus)
  - 修复 Table 在固定列情况下，滚动条位置不符合预期问题。
- 【Feat】
  - TagInput 的 renderTagItem API 增加 onClose 参数支持删除标签  [#1219](https://github.com/DouyinFE/semi-design/issues/1219)
  - Transfer 提供 search 方法支持用户手动触发搜索
- 【Chore】
  - Form interface 更新，Form 标签增加泛型传入，指定 Values 类型 [@Hokori23](https://github.com/Hokori23)
  - 增加 Image 组件的测试用例  [#1216](https://github.com/DouyinFE/semi-design/issues/1216)
  
#### 🎉 2.22.3 (2022-11-02)
- 【Docs】
    - 站点新增无障碍（A11y）支持

#### 🎉 2.22.2 (2022-10-31)
- 【Fix】
    - 修复 Tooltip、Popover 组件关闭时闪烁问题（影响 v2.22）[#1225](https://github.com/DouyinFE/semi-design/issues/1225)

#### 🎉 2.22.0 (2022-10-28)
- 【Fix】
    - 修复 DatePicker type="month" 下 年月选择模式为 normal 和 wheel 时，宽度不一致问题

#### 🎉 2.22.0-beta.2 (2022-10-26)
- 【Fix】
  - 修复 Select 中 restTagsPopoverProps API 未设置为可选导致 ts 报错问题

#### 🎉 2.22.0-beta.1 (2022-10-26)
- 【Feat】
  - Navigation 新增 A11y 键盘和焦点适配 [#1195](https://github.com/DouyinFE/semi-design/pull/1195)
  - Typography 新增 Numeral 组件，基于 Text 组件，添加了属性：rule, precision, truncate, parser, 以提供需要单独处理文本中数值的能力 [@uiuing](https://github.com/uiuing) [#1136](https://github.com/DouyinFE/semi-design/issues/1136)
  - 导出 LocaleConsumer 组件 [@Hokori23](https://github.com/Hokori23) [#1196](https://github.com/DouyinFE/semi-design/pull/1196)
  - TreeSelect 增加 showRestTagsPopover 和 restTagsPopoverProps 参数，支持通过 popover 展示多余 tag [#1210](https://github.com/DouyinFE/semi-design/pull/1210)
  - Select 中增加 showRestTagsPopover 和 restTagsPopoverProps，支持通过 popover 展示多余 tag [#1212](https://github.com/DouyinFE/semi-design/pull/1212)
  - Modal、SideSheet、Tabs、Popover 和 Tooltip 等弹层组件动画效果从 js 改为 css 实现，新增动画 Token，可支持在 DSM 中以主题形式自定义动画 [#1150](https://github.com/DouyinFE/semi-design/pull/1150)
  - 优化 ScrollList 在 wheel 模式下的动画效果 [#1211](https://github.com/DouyinFE/semi-design/pull/1211)
  - DatePicker 中新增 yearAndMonthOpts API，可用于控制年月选择器的 ScrollListItem [#1211](https://github.com/DouyinFE/semi-design/pull/1211)
  - DatePicker disabledDate API 第二个参数新增 rangeInputFocus 参数，用于根据当前选择状态动态禁用日期 [#1198](https://github.com/DouyinFE/semi-design/pull/1198)
- 【Fix】
  - 修复 hook 方式使用 Modal  motion=false 不生效的问题 [#1217](https://github.com/DouyinFE/semi-design/pull/1217)
  - 更新 Table 组件 Columns 属性的 render 的类型 [@Assone](https://github.com/Assone) [#1209](https://github.com/DouyinFE/semi-design/pull/1209)
  - 修复 Cascader 当 motion 为 false 时，搜索选中值后，在面板收起后再打开面板显示仍然是搜索后的选项  [#1199](https://github.com/DouyinFE/semi-design/issues/1199)
  - 修复 Foundation 代码中含有 React 特有 API 调用的问题 [#1189](https://github.com/DouyinFE/semi-design/issues/1189)
  - 修复 Table defaultFiltertedValue 和 defaultSortOrder 未包含在 onChange 中问题  [#1188](https://github.com/DouyinFE/semi-design/issues/1188)
  - 修复 Popover、ToolTip、Dropdown 等弹层组件在 motion 为 true 时，Children 展示会触发两次的问题 [#1174](https://github.com/DouyinFE/semi-design/issues/1174)
  - 将 NodeList 中实现展开/收起动画的组件由 Tree 中的 Collapse 组件改为公共的 Collapsible 组件 [#1182](https://github.com/DouyinFE/semi-design/pull/1182)
  - 修复 Collapsible 祖先元素从渲染树中移除导致高度计算异常，无法展开的问题 [#1174](https://github.com/DouyinFE/semi-design/issues/1174)
  - 修复 Collapsible 内容区从渲染树移除导致高度计算异常，无法展开的问题 [#1174](https://github.com/DouyinFE/semi-design/issues/1174)
  - 修复 Collapsible 内容区域高度变化导致收起时高度变化区域的收起动画不展示的问题 [#1174](https://github.com/DouyinFE/semi-design/issues/1174)
- 【Style】
  - 修复某些打包策略导致 Dropdown 中的 NavItem 的 padding 不符合预期问题 [#1204](https://github.com/DouyinFE/semi-design/pull/1204)
- 【Docs】
  - 更新 Table 组件 Columns 属性的文档 [@Assone](https://github.com/Assone) [#1209](https://github.com/DouyinFE/semi-design/pull/1209)
- 【Breaking Change】
  - **将 TimePicker 和 DatePicker 中用到的 ScrollListItem 由 mode wheel 改为 mode normal，使其更好适配 PC 端**


#### 🎉 2.21.1 (2022-10-13)
- 【Fix】
  - 修复 Modal 在 关闭后 esc 触发事件回调的问题



#### 🎉 2.21.0 (2022-10-12)
- 【Fix】
  - 修复 Carousel 通过左右按钮或者方法切换 index 时没有更新计时器问题
- 【Docs】
  - 文档站点首页更新，增加 showcase


#### 🎉 2.21.0-beta.1 (2022-10-10)
- 【Fix】
  - 修复 AutoComplete 在 onBlur 回调中 e.target 是 null 的问题

#### 🎉 2.21.0-beta.0 (2022-10-08)
- 【Feat】
  - Table 新增表头 sticky API
  - AutoComplete 新增 onKeyDown API
  - Upload 组件对外暴露 openFileDialog 方法，使用户可以手动打开文件选择窗口
  - LocaleProvider 新增罗马尼亚语（ro） [@jacob-lcs](https://github.com/jacob-lcs)
- 【Fix】
  - 修复 Dropdown 下 children onKeydown 拿不到事件问题
  - 修复 Carousel 通过左右按钮或者方法切换 index 时没有更新计时器问题
  - 修复 Select 在 filter 为 true, input 框为空情况下，关闭面板后触发 onSearch 问题
- 【Style】
  - Avatar 方形头像增加圆角
  
#### 🎉 2.20.8 (2022-10-11)
- 【Fix】
  - 修复 Select 虚拟化时，第一个 Option 选项位置偏移的问题  [#1178](https://github.com/DouyinFE/semi-design/pull/1178)
- 【Style】
  - Select 的 maxHeight 默认值（Option 浮层最大高度）、虚拟化默认高度由 300px -> 270px
- 【Design Token】
  - Select Design Token 变更，废弃 `$spacing-select_option_first-marginTop`、`$spacing-select_option_last-marginBottom` 两个 Token；
修改 以下 Token 默认值：`$spacing-select_option_list-paddingTop` 、`$spacing-select_option_list-paddingBottom` ，由 0 变更为 `$spacing-extra-tight` (4px)
- 【Chore】
    - Form 增加 RuleItem Interface export 


#### 🎉 2.20.7 (2022-10-10)
- 【Fix】
  - 修复只引入 ImagePreview 单独使用，未引入 Image 组件时样式丢失的问题 [#1175](https://github.com/DouyinFE/semi-design/pull/1175)

#### 🎉 2.20.3 (2022-09-28)
- 【Fix】
  - 修复 ButtonGroup 关于 key warning 的问题
  - 修复 SSR 场景下 withField、Form Field 相关组件关于  useLayoutEffect warning 的问题 [#1140](https://github.com/DouyinFE/semi-design/pull/1140)
  - 修复 typescript 4.8.3 下部分类型报错的问题
  - 修改 modal 聚焦逻辑，自动聚焦到弹窗内第一个可被聚焦的元素上
  
#### 🎉 2.20.2 (2022-09-27)
- 【Fix】
  - 修复 @douyinfe/semi-icons 关于 corejs 报错的问题

#### 🎉 2.20.1 (2022-09-27)
- 【Style】
  - Image 全局 sass 变量加上 !default 用于主题配置容错 [#1151](https://github.com/DouyinFE/semi-design/pull/1151)

#### 🎉 2.20.0 (2022-09-23)
- 【Fix】
  - 修复 Form.InputGroup 不支持 FormProps.wrapperCol、labelCol 布局的问题
  - 修复 Image 预览放大后拖拽问题
  - 修复 DataPicker 组件 foundation 中包含 React 相关类型定义问题 [@rashagu](https://github.com/rashagu)
  - 修复 Navigation、Tree 组件 foundation 在高版本 typescript 中报错问题 [@rashagu](https://github.com/rashagu)
  - 修复受控 Tree 在远程加载数据时展开不成功 [#1124](https://github.com/DouyinFE/semi-design/issues/1124)
  - 修复 ButtonGroup 未支持 style API 问题
  - 修复虚拟化 Table 在有左边固定列时，首次渲染左边固定列会有多余的 box-shadow 问题 [#1134](https://github.com/DouyinFE/semi-design/issues/1134)

#### 🎉 2.20.0-beta.1 (2022-09-20)
- 【Fix】
    - 修复 @douyinfe/semi-foundation Image 相关未导出的问题

#### 🎉 2.20.0-beta.0 (2022-09-19)

- 【New Component】
   - 新增 Image 组件（新增了基础 sass、全局 sass 变量，使用自定义主题的需要重新发布）[#344](https://github.com/DouyinFE/semi-design/issues/344) 
- 【Feat】
    - Tag 新增 shape 选择，可选 square、circle [#89](https://github.com/DouyinFE/semi-design/issues/89)
    - Progress 支持根据进度自动填充渐变颜色，根据进度预设自动切换颜色 [#1092](https://github.com/DouyinFE/semi-design/issues/1092) [@uiuing](https://github.com/uiuing)
    - Toast 支持新增通过 ID 动态修改内容 [#1035](https://github.com/DouyinFE/semi-design/issues/1035) [@gwsbhqt](https://github.com/gwsbhqt)
    - Skeleton.Avatar 支持 shape 属性 [#1117](https://github.com/DouyinFE/semi-design/issues/1117) [@MuxinFeng](https://github.com/MuxinFeng)
- 【Chore】
    -  移除 @douyinfe/semi-ui 发包产物中的 ts 源码，仅保留 lib、dist 目录
    -  修改部分组件 scss 的写法，将除法转换为乘法及 math.div 语法，避免 sass 高版本编译时重复抛出 warning 的问题 

#### 🎉 2.19.0 (2022-09-09)
- 【Fix】
    - 修复当 Datepicker 的 type 为 dateTime 时，切换年月会导致时间部分被重置为 8 点 [#1078](https://github.com/DouyinFE/semi-design/issues/1078) [@rojer95](https://github.com/rojer95)
    - 修复锚点组件的子节点单行文本前面的空白处，点击不能选中的问题 [#512](https://github.com/DouyinFE/semi-design/issues/512) [@edc-hui](https://github.com/edc-hui)
    - 修复面板关闭时，Select onblur 事件未被触发问题 [#1110](https://github.com/DouyinFE/semi-design/issues/1110)
    - 修复 Calendar weekStartsOn 改变后，事件渲染的位置没有跟着改变问题 [#1101](https://github.com/DouyinFE/semi-design/issues/1101)
    - 修复在 DropDown 中使用 Input，Input onEnterPress 事件不生效问题 [#1102](https://github.com/DouyinFE/semi-design/issues/1102)
    - 修复 TagGroup 污染传入 tagList 数据问题  [#1107](https://github.com/DouyinFE/semi-design/issues/1107)
    - 修复 Anchor 间距可触发选中后，键盘聚焦样式被遮挡问题 
- 【Chore】
    - 移除 semi-foundation、semi-ui 中的 corejs 依赖 [#1095](https://github.com/DouyinFE/semi-design/issues/1095)

#### 🎉 2.19.0-beta.0 (2022-09-05)
- 【Feat】
  - Popconfirm onOk、onCancel 支持 Promise 类型返回值，异步关闭 [#1056 ](https://github.com/DouyinFE/semi-design/issues/1056)
- 【Fix】
  - 修复 Popconfirm 多行内容样式错误 [#868](https://github.com/DouyinFE/semi-design/issues/868)
  - 修复 DefaultTabBar 类型有误  [#1077](https://github.com/DouyinFE/semi-design/pull/1077)
  - 修复 Form 级别设置 autoComplete 为 false 出现 TS 报错问题
  - 修复 Slider 在传入部分 steps 值时定位显示不正确的问题， [#1043](https://github.com/DouyinFE/semi-design/issues/1043)
  - 修复 Tag tagKey 类型定义错误问题 [#1081](https://github.com/DouyinFE/semi-design/pull/1081)
  - 修复 RadioGroup 第一次渲染时 value 不正确问题 [#1060](https://github.com/DouyinFE/semi-design/pull/1060)
- 【Style】
  - Sidesheet body 添加 overflow: auto 默认样式，内容超出时不再需要自行通过 props.bodyStyle 添加 overflow 相关样式 [#1098](https://github.com/DouyinFE/semi-design/pull/1098)
- 【Refactor】
  - 使用 flex 布局和 gap 替换 Checkbox 中的 margin 布局 [#1073](https://github.com/DouyinFE/semi-design/pull/1073)
  - ButtonGroup 中的分割线使用 span 标签代替 border-right [#1065](https://github.com/DouyinFE/semi-design/pull/1065)
  - 重构了 Radio 的布局，去掉了一些绝对定位，使用 flex 布局代替 [#1060](https://github.com/DouyinFE/semi-design/pull/1060)
- 【Breaking Change】
  - 使用 CheckboxGroup 时，如果给子级 Checkbox 嵌套一层 div 或者 span 等元素，这时 Checkbox 将不带 margin-bottom。单独给每个 Checkbox 嵌套元素样式上不受影响 [#1073](https://github.com/DouyinFE/semi-design/pull/1073)

#### 🎉 2.18.2 (2022-08-31)

- 【Fix】
    - 更新 @douyinfe/semi-webpack-plugin，修复使用自定义主题时，提示无法处理 animation.scss 的报错问题  [#1072](https://github.com/DouyinFE/semi-design/issues/1072)
- 【Docs】
    -  新增[全局文案规范](/zh-CN/)、组件级文案规范

#### 🎉 2.18.0 (2022-08-26)
- 【Feat】
    - Checkbox & Radio 增加 type API
- 【Chore】
    - 移除 semi-animation-react 的 peerDependences : react-dom、react、prop-type
- 【Fix】
    - 修复 Tabs collapse 模式在某些宽度下会反复横跳，导致闪烁不停的问题  [#1039 ](https://github.com/DouyinFE/semi-design/issues/1039)
    - 修复 Transfer 的 emptyContent 参数的 left 不生效  [#1068 ](https://github.com/DouyinFE/semi-design/issues/1068)
    - 修复 React 18 createRoot + strictMode 严格模式下，使用 useFormApi 得到空值问题  [#1063 ](https://github.com/DouyinFE/semi-design/issues/1063)
- 【Docs】
    -  Popover / Popconfirm / Dropdown 新增 FAQ

#### 🎉2.18.0-beta.0（2022-08-24）
- 【Feat】
    - Anchor、AutoComplete、Breadcrumb、Carousel、Cascader、Checkbox、DatePicker、Dropdown、Input、InputNumber、Navigation、Pagination、Radio、Rating、ScrollList、Select、SideSheet、Slider、Steps、Switch、Table、Tabs、TagInput、TimePicker、Transfer、Tree  26 个组件增加动效相关设计变量 [#984](https://github.com/DouyinFE/semi-design/issues/984)
    - Anchor 新增 A11y 焦点适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Form Label 增加 optional 配置项，打开时自动于 Label Text 后追加（可选）文本标识  [#869](https://github.com/DouyinFE/semi-design/issues/869)
    - Calendar 提供 weekStartsOn，设置周起始日  [#1020](https://github.com/DouyinFE/semi-design/issues/1020)
    - Tree 增加支持虚拟化场景下的 scrollTo 方法  [#1024](https://github.com/DouyinFE/semi-design/issues/1024)
    - TagGroup 增加 onTagClose 回调
- 【Fix】
    - 修复 Select 勾选 icon 会闪烁的问题 [@linjunc](https://github.com/linjunc)
    - 修复 TagGroup closable 关闭后，数量指示器不变的问题 [#945](https://github.com/DouyinFE/semi-design/issues/945) [@linjunc](https://github.com/linjunc)
    - 修复 居中 Modal 在少数 1080p 显示器上文字模糊的问题
- 【Style】
    - Table 增大排序按钮的点击热区（由仅 icon 区扩大为包含 title 和 sorting 的区域，若 title 为完全自定义渲染，不受影响）[#1031](https://github.com/DouyinFE/semi-design/pull/1031)


#### 🎉2.17.1 (2022-08-17)

- 【Fix】
    - 修复 Table filter 影响数据原有排序问题 [#1036](https://github.com/DouyinFE/semi-design/issues/1036)
    - 修复 AutoComplete 通过 tab 聚焦或者 autoFocus 聚焦后，输入值改变后不打开面板的问题 (影响范围 v2.14 - 2.17.0)

#### 🎉2.17.0 (2022-08-12)

- 【Fix】
  - 修复 Chromium 104 breakchange fit-content css 导致的 popover、dropdown 样式问题 [#1022](https://github.com/DouyinFE/semi-design/issues/1022) [Chromium Issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1350958)
  - 修复 AvatarGroup 组件中 size 属性在 TS 定义中没有值 default 的问题 [@AnoyiX](https://github.com/AnoyiX)
  - 修复 TimePicker 由有值变化为 undefined 时渲染未更新的问题 [#918](https://github.com/DouyinFE/semi-design/issues/918) [@linjunc](https://github.com/linjunc)
  - 修复 Tree 的 renderFullLabel 使用 checkbox 选择不中的问题（影响范围 v2.15.0 - v2.16.1）

#### 🎉 2.17.0-beta.1 (2022-08-09)
- 【Fix】
    - 修复 Empty 组件在 body theme-mode attribute 为非预期值时意外判定为暗色模式的问题 [#1023](https://github.com/DouyinFE/semi-design/issues/1023)
    - 修复 cascader 的 treeData 和 value 动态更新，选中值显示不正确的问题 [#703](https://github.com/DouyinFE/semi-design/issues/703)

#### 🎉 2.17.0-beta.0 (2022-08-09)
- 【Feat】
    - Select 新增 A11y 键盘和焦点适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - DatePicker 快捷选择面板支持方位选择 [#895](https://github.com/DouyinFE/semi-design/issues/895)
    - TagInput 支持拖拽排序 [#707](https://github.com/DouyinFE/semi-design/issues/707)
    - Collapse.Panel 新增 API disabled 和 showArrow  [#188](https://github.com/DouyinFE/semi-design/issues/188)
- 【Fix】
    - 修复 Tooltip trigger 为 hover 时，点击 children 后再点击弹层，弹层会隐藏问题  [#977](https://github.com/DouyinFE/semi-design/issues/977)

#### 🎉 2.16.1 (2022-08-05)
- 【Fix】
    - 修复在 Dropdown 中使用输入类组件，无法输入字母和数字问题
    - 修复 windows edge 浏览器 password input 默认 icon 的问题 [@linjunc](https://github.com/linjunc)
    - 修复点击 switch 边缘无法触发 change 的问题 [@linjunc](https://github.com/linjunc)
- 【Chore】
    - 更新 @douyinfe/semi-foundation 中部分 handle 函数名称拼写错误问题，对用户无影响 [@linjunc](https://github.com/linjunc)

#### 🎉 2.16.0 (2022-07-29)
- 【Fix】
    - 修复 Input 按下态颜色错误问题，修复 Input 和 TextArea 在 validateStatus 下按下态颜色不统一问题 [#662](https://github.com/DouyinFE/semi-design/issues/662)
- 【Chore】
    - 将 prop-types 移到 dependencies，从 peerDependencies 移除 @types/react 和 @types/react-dom [#993](https://github.com/DouyinFE/semi-design/issues/993)

#### 🎉 2.16.0-beta.0 (2022-07-25)
- 【Feat】
    - Cascader 新增 position API 控制弹层方向
    - Slider 新增 A11y 焦点及键盘适配 [#205](https://github.com/DouyinFE/semi-design/issues/205)
- 【Fix】
    - 修复当 Button 的 noHorizontalPadding 参数类型为 string 时不生效问题
    - 修复可拖拽的 Transfer 禁用 item 后右侧面板中的 item 仍然能够删除且不可拖动的问题
    - 允许用户通过 ButtonGroup 中的 Button 的参数单独定制 Button 的 type 和 theme
    - 修复多选时，换行后 TreeSelect 箭头宽度不统一问题
- 【Docs】
    - Icon 更新自定义图标示例

#### 🎉 2.15.1 (2022-07-19)
- 【Fix】
    - 修复 @douyinfe/semi-illustrations 插画按需加载失效的问题 [#961](https://github.com/DouyinFE/semi-design/issues/961)
    - 修复自定义属性 data-popupId 名称没有小写导致的 warning[#969](https://github.com/DouyinFE/semi-design/issues/969)（影响范围 2.15.0）

#### 🎉 2.15.0 (2022-07-15)
- 【Fix】
    - 修复多选状态下的 TreeSelect/Tree 被 CheckboxGroup 包裹后，点击任何选项将所有选项显示为被选中的问题， [#750](https://github.com/DouyinFE/semi-design/issues/750)
    - 修复 DatePicker 在 triggerRender 范围选择场景选择日期交互问题 [#676](https://github.com/DouyinFE/semi-design/issues/676)

#### 🎉 2.15.0-beta.0 (2022-07-11)
- 【Feat】
    - Rating 新增 A11y 焦点及键盘适配
    - Dropdown 新增 A11y 键盘和焦点适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - LocaleProvider 新增 德语（de）、意大利语（it）、法语（fr） [@jacob-lcs](https://github.com/jacob-lcs)
    - Cascader 等 15 组件新增 preventScroll 属性，用于阻止组件内 focus 方法导致页面滚动（可用于解决 Safari 浏览器聚焦时可能导致页面异常滚动的问题）
    - Tooltip returnFocusOnClose 支持 trigger hover 和 focus
- 【Fix】
    - 修复 TreeSelect 当搜索框在 trigger 中且搜索框中有值时，二次点击会导致搜索框收起并清空搜索值的问题。
    - 修复 Cascader 单选状态下同时设置 filterTreeNode & displayRender，选项显示错误问题
    - 修复 List 空状态 Padding 问题 [@rojer95](https://github.com/rojer95)
    - 修复 InputGroup 在子级设置 disabled 为 false 不生效问题
    - 修复 Tree 搜索结果高亮大小写敏感问题
    - 修复虚拟化 Table 空数据时虚拟列表占位问题  [#942](https://github.com/DouyinFE/semi-design/issues/942)
    - 修复部分 Form Field 组件（例如 Form.Upload、Form.Switch）传入 ref 时 ts 类型检查报错，提示不存在 ref 属性的问题

#### 🎉 2.14.0 (2022-07-01)
- 【Fix】
  - 修复 Spin 组件在暗色模式下个别场景内容物有黑色矩形的问题
- 【Chore】
    - 优化 Form interface BaseFormApi 类型定义 [#933](https://github.com/DouyinFE/semi-design/issues/933)

#### 🎉 2.14.0-beta.0 (2022-06-28)
- 【Feat】
    - Input 新增 A11y 键盘适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Avatar 新增 A11y 焦点及键盘适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Radio 新增 A11y 焦点及键盘适配 [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - AutoComplete A11y 优化键盘适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
- 【Fix】
    - 修复 Input 传 defaultValue 会报错问题 [#537](https://github.com/DouyinFE/semi-design/issues/537)
    - 修复设置 collapsible = true 时，Tabs 滚动到视窗外时 TabBar 出现箭头
    - 修复部分组件 foundation 中包含 React 相关类型定义问题  [#923](https://github.com/DouyinFE/semi-design/issues/923)
    - Tooltip/Popover trigger=custom 时，对 disabled 元素不再自动包裹 span [#919](https://github.com/DouyinFE/semi-design/issues/919)
- 【Breaking Change】
    - Input 中的密码按钮改为常显，之前是 hover 或 focus 输入框时显示  [#205](https://github.com/DouyinFE/semi-design/issues/205)
- 【Style】
    - 修复 TagInput suffix 文本颜色，从 --semi-color-text-1 修改为 --semi-color-text-2
    - 更新了 secondary 全局颜色变量，将引用的色阶由 blue 改为 light-blue，修改前 secondary 颜色变量与 primary 相同，修改后视觉上对比度弱于 primary。Button、Badge、Steps、Dropdown 组件受影响。
    - 更新 Select、Cascader、TreeSelect size='large' 时 placeholder 与单选的文字大小，14px -> 16px。与 Input 组件对齐 [#859](https://github.com/DouyinFE/semi-design/issues/859)

#### 🎉 2.13.0 (2022-06-20)
- 【Fix】
    - 修复当设置 onChangeWithObject，mutiple 后，value 传入的值为 undefined 时时，Cascader 崩溃的问题。（影响范围 v2.0.4 - v 2.12.0）[#905](https://github.com/DouyinFE/semi-design/issues/905)
    - 修复 esm / cjs 构建产物，滚动条样式部分场景失效的问题
- 【Style】
    - Modal、TanPane、Upload 增加 color text 声明，解决暗色模式下，当未在 body 容器统一声明 color 时，文本颜色对比度不足的问题
    - 解决 TimePicker range 模式，在暗色模式下 border-radius 显示不正确的问题
    - disabled 的 TagInput 可以显示+N 部分 popover 的内容
- 【Design Token】
    - Tabs 增加 $color-tabs_tab-pane-text-default，Upload 增加 $color-upload_drag_area_main-text 等若干 Token
- 【Docs】
    - 增加 searchRender API 和 search 方法的示例

#### 🎉 2.13.0-beta.0 (2022-06-14)
- 【Feat】
    - InputNumber 新增 A11y 键盘适配。支持在输入框同时按住 shift 和上下箭头调整较大的数字范围
    - Checkbox 新增 A11y 键盘和焦点适配 [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - TagInput 点击 prefix、suffix 自动聚焦至内部 Input [#874](https://github.com/DouyinFE/semi-design/issues/874) [@yykoypj](https://github.com/yykoypj)
    - Form.TagInput 支持 labelPosition: 'inset' 内嵌标签 [#874](https://github.com/DouyinFE/semi-design/issues/874) [@yykoypj](https://github.com/yykoypj)
- 【Fix】
    - 修复 Select filter、showClear 为 true 时，点击 clear icon 时，只触发 onClear，未触发 onSearch 的问题及通过 clear icon 清除搜索项后，未重置候选 Option 列表的问题  [#867](https://github.com/DouyinFE/semi-design/issues/867)
    - 修复 Select filter 为 true，失去焦点，input 输入被自动重置时，未触发 onSearch 的问题  [#867](https://github.com/DouyinFE/semi-design/issues/867)
    - 修复 InputNumber 如果设置了必填验证，在表单中初始化时会触发验证，行为与其他表单不一致的问题 [@rojer95](https://github.com/rojer95)
    - 修复 AutoComplete defaultActiveFirstOption 某些场景不生效的问题 [#892](https://github.com/DouyinFE/semi-design/issues/892)
- 【Breaking Change】
    - InputNumber 调整 shiftStep 默认值，由 1 调整为 10
- 【Design Token】
    - 更新 Avatar、Button、Radio、Steps、Switch、Tag 等组件样式文件中的 color white 为 --semi-white
    - Button 组件新增 borderless 模式下文字颜色 token [#898](https://github.com/DouyinFE/semi-design/pull/898)


#### 🎉 2.12.0 (2022-06-06)
- 【Fix】
    - 修复 Timeline 嵌套使用时最后一项样式异常的问题 [#865](https://github.com/DouyinFE/semi-design/issues/865)
    - 修复 Select 开启虚拟化且无数据时 emptyContent 高度不对的问题 [#839](https://github.com/DouyinFE/semi-design/pull/839) [@tianenpang](https://github.com/tianenpang)

#### 🎉 2.12.0-beta.5 (2022-05-31)
- 【Fix】
    - 修复 Tooltip、Popover、Select 等带浮层组件，在 React 18 下使用，关闭时会闪烁的问题 [#715](https://github.com/DouyinFE/semi-design/issues/715)
    - 修复 FocusHandle 错误引用了 lodash-es 导致的报错问题（问题影响范围 v2.12.0-beta.0 - v2.12.0-beta.2）

#### 🎉 2.12.0-beta.0 (2022-05-30)

- 【Feat】
    - Modal 新增 A11y 键盘和焦点适配 [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Tabs 新增 A11y 键盘和焦点适配 [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Tag 新增 A11y 键盘和焦点适配   [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Progress stroke 支持传入渐变色  [#456](https://github.com/DouyinFE/semi-design/issues/456) [@vecpeng](https://github.com/vecpeng)
    - Slider 支持点击 marks 改变滑块位置 [#618](https://github.com/DouyinFE/semi-design/issues/618) [@huruji](https://github.com/huruji)
- 【Fix】
    - 修复 TreeSelect 在参数 checkRelation 为 unRelated，treeData 为 `[]` 时的 TypeError
    - 修复 InputNumber 在 readonly 模式下可以用过步进器修改 value [@zwlafk](https://github.com/zwlafk)
- 【Design Token】
    - Tag solid 模式关闭按钮新增颜色 token `$color-tag_close-icon_deep-default`


#### 🎉 2.11.2 (2022-05-24)
- 【Chore】
    - 修复 Nav.Item 通过 linkOptions 配置 href 属性时，ts 类型检查报错的问题 [#856](https://github.com/DouyinFE/semi-design/issues/856) [@SunriseFox](https://github.com/SunriseFox)

#### 🎉 2.11.0 (2022-05-23)
- 【Fix】
    - 修复 useModal typescript 返回类型不严谨的问题 [#833](https://github.com/DouyinFE/semi-design/issues/833)
- 【Chore】
    - 简化部分组件的 interface 类型声明 [#838](https://github.com/DouyinFE/semi-design/pull/838) [@huruji](https://github.com/huruji)

#### 🎉 2.11.0-beta.1 (2022-05-20)
- 【Fix】
  -  修复 DatePicker 错误引用 _utils/parse ts 源文件导致报错的问题

#### 🎉 2.10.2 (2022-05-20)
- 【Fix】
    - 修复 Table onHeaderRow 在配置 scroll 属性时不生效问题  [#849](https://github.com/DouyinFE/semi-design/issues/849)
    - 修复 Select aria-controls 在 SSR 场景不一致问题  [#840](https://github.com/DouyinFE/semi-design/issues/840)

#### 🎉 2.11.0-beta.0 (2022-05-18)
- 【Feat】
    - DatePicker 内嵌输入框输入完整日期后，时间输入框自动填充默认时间  [#294](https://github.com/DouyinFE/semi-design/issues/294)
    - DatePicker 范围选择支持输入开始日期或结束日期后，面板显示指定日期  [#294](https://github.com/DouyinFE/semi-design/issues/294)
- 【Fix】
    - 修复内嵌输入框确认日期选择，输入日期后没有确认也会直接选中日期问题  [#742](https://github.com/DouyinFE/semi-design/issues/742)
    - 修复 React 18 createRoot + strictMode 严格模式下，使用 Form、Tabs、Nav、SideSheet、Table 组件时提示 `can't get properties of undefined` 的问题 #745  [#795 ](https://github.com/DouyinFE/semi-design/issues/795)
    - 修复 Upload 组件在 directory 和 draggable 为 true 时上传，上传列表文件不符合预期问题  [#827](https://github.com/DouyinFE/semi-design/issues/827)
    - 修复单个 Checkbox 使用时因为参数类型问题导致控制台出现 warning 提示
    - 修复 Checkbox、Radio、Tooltip ARIA id 在 SSR 时不一致问题  [#719](https://github.com/DouyinFE/semi-design/issues/719)
    - 规范 TagGroup tagList props 类型

#### 🎉 2.10.1 (2022-05-10)
- 【Fix】
    - 修复 Select 位于 Popover 内时，点击 Option 会导致外层 Popover 也收起的问题（问题影响范围 v2.5- v2.10） [#818](https://github.com/DouyinFE/semi-design/issues/818)

#### 🎉 2.10.0 (2022-05-07)
- 【Fix】
    - 修复 Form 组件在`Nextjs`中使用时，`x-form-id`在服务端和客户端不匹配的报错问题  [#808](https://github.com/DouyinFE/semi-design/issues/808) [@xuerzong](https://github.com/xuerzong)
    - 修复 InputNumber 在有 precision 配置时，输入非法字符不会置空的问题 [#786](https://github.com/DouyinFE/semi-design/issues/786) [@MuxinFeng](https://github.com/MuxinFeng)
    - 修复 Carousel 自动播放时点击箭头切换或指示器切换不能即时响应问题
    - 修复 InputNumber 受控使用且设置最小值，格式化传入的值到范围内时未 notifyChange 问题  [#812](https://github.com/DouyinFE/semi-design/issues/812)
    - 修复 ButtonGroup 传入 多个 children 时 ts 类型检查报错的问题 [#811](https://github.com/DouyinFE/semi-design/issues/811)
- 【Docs】
    - A11y：Switch、Bannner 增加 键盘和焦点 行为说明
    - 更新 Tabs 组件 FAQ
- 【Chore】
    - 更新 @douyinfe/semi-foundation 中部分函数名称拼写错误问题，对用户无影响 [#660](https://github.com/DouyinFE/semi-design/pull/660)

#### 🎉 2.10.0-beta.0 (2022-04-29)
- 【New Component】
    - 新组件轮播图 Carousel  [#678](https://github.com/DouyinFE/semi-design/issues/678)
- 【Fix】
    - 修复 Cascader 在多选时，设定 displayProp 非 value/label 时候出错问题
- 【Feat】
    - Switch 新增 A11y 键盘和焦点适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - Banner 新增 A11y 键盘和焦点适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
- 【Chore】
  - @douyinfe/semi-icons、@douyinfe/semi-illustrations 更新 peerDependency 中的 react 版本声明：16/17 -> 16/17/18

#### 🎉 2.9.1 (2022-04-26)
- 【Fix】
    - 修复 Tooltip 在有动画情况下有概率浮层打开时闪烁
    - 修复 TimePicker 组件 use12Hours 下，pm/am 无法正确设置问题 [#776](https://github.com/DouyinFE/semi-design/issues/776), 修复 TimePicker 组件向上选择选项后点击清除无法回到预期位置问题
    - 修复 Form Field validate 特殊情景下内部使用旧值的问题 [#796](https://github.com/DouyinFE/semi-design/issues/796)
- 【Style】
    - 修复 Select focus 和 hover 同时应用，border 颜色不正常的问题

#### 🎉 2.9.0 (2022-04-22)
- 【Fix】
    - 修复 TagInput 在 Form 内使用时，敲击回车会导致 submit 事件触发的问题 [#767](https://github.com/DouyinFE/semi-design/issues/767)
    - 修复 Modal 命令式调用后遗留无用 div 的问题
    - 修复 Collapse 将部分 props 透传至 DOM 导致存在无用属性 warning 的问题
    - 去除 Form label `user-select:none` 默认样式，允许用户选中
    - 修复 Cascader 清除按钮键盘事件不响应问题

#### 🎉 2.9.0-beta.0 (2022-04-18)
- 【New Component】
    - 新增分割线 Divider 组件 [#721](https://github.com/DouyinFE/semi-design/issues/721) [@ZeroCodeLin](https://github.com/ZeroCodeLin)
- 【Feat】
    - Description 组件的 data 键值支持传入 ReactNode [#734](https://github.com/DouyinFE/semi-design/issues/734) [@oddguan](https://github.com/oddguan)
- 【Fix】
    - 修复 Slider 组件受控情况下点击滑轨部分仍然可以触发值变更的问题 [#768](https://github.com/DouyinFE/semi-design/issues/768)
    - 修复 Badge 不能搭配 Tooltip 使用的问题 [#761](https://github.com/DouyinFE/semi-design/issues/761) 
    - 修复 validateStatus 类型检查缺少 success [#746](https://github.com/DouyinFE/semi-design/issues/746) [@rojer95](https://github.com/rojer95)
- 【Style】
    - **更新 Avatar 文本内容居中方式，由绝对定位改为由 flex 布局居中。如果你覆盖了 display 为 inline-block，这时文本居中会失效** [#774](https://github.com/DouyinFE/semi-design/issues/774)
#### 🎉 2.8.1 (2022-04-19)
- 【Fix】
    - 更新组件的 ts 类型定义，解决 @types/react v18 移除默认 children 声明后带来的类型检查报错 [#755](https://github.com/DouyinFE/semi-design/issues/755)

#### 🎉 2.8.0 (2022-04-08)
- 【Fix】
    - 升级 @douyinfe/semi-ui 依赖的 react-sortable-hoc 版本（v1.11.0 -> v2.0.0），解决 pnpm 场景下使用 react 17 时，由于 unmeet peerDependency 中 react 版本未满足的报错问题， [#747](https://github.com/DouyinFE/semi-design/issues/747)

#### 🎉 2.8.0-beta.1 (2022-04-03)
- 【Fix】
    - 修复 Select 搜索时因为字符未转义导致报错的问题 [#734](https://github.com/DouyinFE/semi-design/issues/734) [@boenfu](https://github.com/boenfu)

#### 🎉 2.8.0-beta.0 (2022-04-02)
- 【Fix】
    - 修复 useNotification 每次获得 ID 都相同的问题
    - 修复当 inputnumber 初始值为空时，如果设置了 precision，内容会被初始化为 0 且进行精度格式化的问题 [@rojer95](https://github.com/rojer95)
    - 修复 DatePicker defaultPickerValue 传数字时面板渲染错误问题  [#735](https://github.com/DouyinFE/semi-design/issues/735)
- 【Feat】
    - Popover 新增 A11y 键盘和焦点适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
- 【Style】
    - Form Label 的 extra 元素 CSS 样式调整：display: block -> flex，修复 extra 中放置 Icon 时未居中对齐的问题 [#324](https://github.com/DouyinFE/semi-design/issues/324)


#### 🎉 2.7.1 (2022-03-30)
- 【Fix】
    - 修复 Button 点击后聚焦样式问题（影响 2.5.0 ~ 2.7.0，Safari 兼容性有问题，其行为与 2.5.0 之前一致）[#730](https://github.com/DouyinFE/semi-design/pull/730)
    - 修复 Tooltip 在组件卸载后仍然执行 setState 问题  [#727](https://github.com/DouyinFE/semi-design/issues/727)

#### 🎉 2.7.0 (2022-03-25)
- 【Perf】
    - 优化 Select 多选且配置了 maxTagCount 时，renderSelectedItem 的执行次数 [#709](https://github.com/DouyinFE/semi-design/issues/709)
- 【Chore】
    - useFormApi 增加泛型传入 [@so2liu](https://github.com/so2liu)
- 【Fix】
    - 修复 RadioGroup value 为 NaN 时，触发 Maximum update depth exceeded 的问题 [#712](https://github.com/DouyinFE/semi-design/issues/712) [@oddguan](https://github.com/oddguan)
    - 修复 TreeSelect 展开节点后若垂直方向剩余空间不足，未自动调整展开方向的问题


#### 🎉 2.7.0-beta.0 (2022-03-18)
- 【Feat】
    - DatePicker 支持内嵌样式输入框  [#294](https://github.com/DouyinFE/semi-design/issues/294)
    - TreeSelect onSearch 新增 filterExpandedKeys 参数  [#328](https://github.com/DouyinFE/semi-design/issues/328)
    
- 【Fix】
    - 修复 Cascader 在单选且非搜索模式下，label 为 ReactNode 时，trigger 异常显示 [object object] 的问题。  [#592](https://github.com/DouyinFE/semi-design/issues/592)
    - ButtonGroup 支持 className  [#704](https://github.com/DouyinFE/semi-design/issues/704) [@yaogengzhu](https://github.com/yaogengzhu)
    - 修复 Tree 组件 value 在初始时会影响节点的展开，而更新 treeData 后，却不会再影响节点的展开  [#257](https://github.com/DouyinFE/semi-design/issues/257)
    - 修复 TreeSelect 非完全受控问题  [#328](https://github.com/DouyinFE/semi-design/issues/328)

#### 🎉 2.6.0 (2022-03-11)
- 【Fix】
    - 修复 Table 展开任意行时其他展开行会重复渲染问题  [#686](https://github.com/DouyinFE/semi-design/issues/686)
    - 修复 Navigation limitIndent 为 false 时的缺失 key 的警告 [#679](https://github.com/DouyinFE/semi-design/issues/679)
    - 修复 Tag 有父级包裹时，父元素存在 3px 留白问题 [#518](https://github.com/DouyinFE/semi-design/issues/518) [@yangjiaxin1995](https://github.com/yangjiaxin1995)

#### 🎉 2.5.1 (2022-03-08)
- 【Fix】
    - 修复 Tooltip content 中组件无法 autoFocus 的问题 [#675](https://github.com/DouyinFE/semi-design/issues/675)


#### 🎉 2.6.0-beta.0 (2022-03-04)
- 【Feat】
    - A11y：Calendar、ScrollList、Cascader、DatePicker 无障碍语义化适配  [#205](https://github.com/DouyinFE/semi-design/issues/205)
- 【Style】
    - 微调默认主题的 5 个 CSS token 和 Table 空文本颜色以更好地支持 WCAG 标准  [#205](https://github.com/DouyinFE/semi-design/issues/205)
    - 修复 Cascader 在多选模式换行时标签对齐样问题 [@chenc041](https://github.com/chenc041)
    - Button 新增焦点样式 [#205](https://github.com/DouyinFE/semi-design/issues/205)
-  【Design Token】
   - Cascader 组件级 Token：移除 $spacing-cascader_selection_tag-marginX，新增 $spacing-cascader_selection_tag-marginLeft 和 $spacing-cascader_selection_tag-marginRight [#636](https://github.com/DouyinFE/semi-design/issues/636) 
- 【Fix】
    - 修复 `Table` 表头文字不支持选中的问题  [#638](https://github.com/DouyinFE/semi-design/issues/638) [@chenc041](https://github.com/chenc041)
    - 修复 Form.RadioGroup 与 RadioGroup 在 type=button 时高度不一致的问题，去除多余 padding [#677](https://github.com/DouyinFE/semi-design/issues/677)
    - 修复 Form 组件使用 formApi setValue/setError/setTouched 针对数组型 fieldPath 删除某项后，赋值后不符合预期的问题  [#604](https://github.com/DouyinFE/semi-design/issues/604)
    - 修复 disabled Input 的文本颜色通过自定义 CSS 或者主题定制，将其设定为某些特定颜色时，在 Safari 下无法显示 disabled 文本的问题
    - 修复 Form Field 组件在已配置 id 的情况下，label 的 for 属性未优先采用 id 的问题 [#683](https://github.com/DouyinFE/semi-design/issues/683)
-  【Docs】
    - A11y：Button 增加 键盘和焦点 行为说明

#### 🎉 2.5.0 (2022-02-24)
- 【Fix】
    - 修复 resizable Table 动态删除列时列宽计算错误问题  [#650](https://github.com/DouyinFE/semi-design/issues/650)
    - Select 组件当用键盘上下键操作时，增加自动滚动交互，调整聚焦 option 的相对位置  [#607](https://github.com/DouyinFE/semi-design/issues/607) [@chenzn1](https://github.com/chenzn1)
    - 修复 next.js 项目使用 @douyinfe/semi-next 插件后，webpack.resolve.alias 配置失效的问题  [#630](https://github.com/DouyinFE/semi-design/issues/630)
    - 修复 DatePicker open 受控时关闭面板后输入框聚焦态没有清空问题  [#528](https://github.com/DouyinFE/semi-design/issues/528)
    - 修复 Tooltip 在 React17 里如果父级有阻止点击事件冒泡弹出层收起会失效 **(Tooltip、Popover 对 clickOutSide 行为监听的事件判断由 click 变更为 mousedown )** [#593](https://github.com/DouyinFE/semi-design/issues/593) [@chenc041](https://github.com/chenc041)

#### 🎉 2.5.0-beta.0 (2022-02-18)
- 【Fix】
    - 修复 slider 在 shadowRoot、WebComponent 或其他 DocumentFragment 下报错的问题
    - 修复 Table JSX columns 表头合并问题  [#619](https://github.com/DouyinFE/semi-design/issues/619)
    - 修复 Cascader 在多选时 treeData 更新会异常清空已选值，而该已选值是是存在于新 treeData 中的  [#622 ](https://github.com/DouyinFE/semi-design/issues/622)
- 【Feat】
    - Upload 组件升级改造 [#556](https://github.com/DouyinFE/semi-design/issues/556)
        - 照片墙支持显示遮罩，并支持自定义预览图标定制
        - 照片墙支持点击上传热区移至头部
        - 文件列表支持自定义操作区
    - Table 支持 defaultFilteredValue API，用于给定列默认的筛选值
    - TreeSelect 支持父子节点选中关系脱离  [#522](https://github.com/DouyinFE/semi-design/issues/522)
    - Tree 支持父子节点选中关系脱离  [#522](https://github.com/DouyinFE/semi-design/issues/522)
    - Tooltip `leftTopOver` 和 `rightTopOver` 位置支持自动调整位置
- 【Style】
    - 更新 Cascader 在 hover 时描边样式变量 [@Carlosfengv](https://github.com/Carlosfengv)

#### 🎉 2.4.1 (2022-02-16)
- 【Fix】
    - @douyinfe/semi-ui 添加 dependency 声明：@douyinfe/semi-animation，避免在 pnpm 场景下可能存在的依赖声明缺失问题 [#626](https://github.com/DouyinFE/semi-design/issues/626)
    - 修复使用 Form.Input/TextArea 且 labelPosition 设置为 inset 时，insetLabelId 被意外透传至 input/textarea dom 上导致 warning 的问题，修复 TimePicker onChangeWithDateFirst 被意外透传至 input dom 上导致 warning 的问题 [#624](https://github.com/DouyinFE/semi-design/issues/624)
- 【Style】
    - 优化 TagInput 组件样式变量引用关系 [@Carlosfengv](https://github.com/Carlosfengv)
#### 🎉 2.4.0 (2022-02-11)
- 【Fix】
    - TimePicker 崩溃问题  [#585](https://github.com/DouyinFE/semi-design/issues/585)
    - 修复 Nav limitIndent 在折叠态后，子菜单通过 dropdown 形式展示时，也被消费，从而导致了多余的空白间隔的问题
    - 修复 Typograph 组件截断错误，当设置 whiteSpace 为 'pre-line' 且 expandable
    - 修复 TreeSelect 当 treeData 较大时，由于多余的转化为 Set 的操作，造成 update 变得很慢  [#521 ](https://github.com/DouyinFE/semi-design/issues/521)
    - 修复 TreeSelect 在单选且非受控时，treeData 更新后，已选值会被异常清空的问题  [#515](https://github.com/DouyinFE/semi-design/issues/515)
- 【Style】
    - 更新了 Button、Input、Modal、Select、ScrollList、TreeSelect 的部分 Sass 变量，抽取了部分默认样式为 Sass 变量以方便 DSM 修改组件默认样式 [#570](https://github.com/DouyinFE/semi-design/pull/570)

#### 🎉 2.4.0-beta.0 (2022-01-28)
- 【Feat】
    - TimePicker 支持 `onChangeWithDateFirst` API  [#555](https://github.com/DouyinFE/semi-design/issues/555)
- 【Fix】
    - 修复 Select 使用 renderCreateItem 自定义时，新建选项需要点击两次的问题  [#574](https://github.com/DouyinFE/semi-design/issues/574)
    - 修复 InputNumber 按钮右键点击时数字自动增/减问题  [#540](https://github.com/DouyinFE/semi-design/issues/540)
    - 修复 Table columns 变化后分页器返回到第一页问题  [#381](https://github.com/DouyinFE/semi-design/issues/381)
    - 修复 Tree 同时使用虚拟化和 renderFullLabel 时，滚动项目发生抖动的问题  [#527](https://github.com/DouyinFE/semi-design/issues/527)
- 【Style】
    - 修复 TextArea readonly 模式下光标显示为禁用问题 [@chenc041](https://github.com/chenc041)  [#535](https://github.com/DouyinFE/semi-design/issues/535)
    - 修复 Table 固定列 z-index 层级过高问题

#### 🎉 2.3.1 (2022-01-21)
- 【Chore】
    - 修复 List 组件传递 datasource 属性时，renderItem 类型丢失 [#393](https://github.com/DouyinFE/semi-design/issues/393) [@chenc041](https://github.com/chenc041)
    - 修复 Dropdown menu 类型定义异常问题 
- 【Fix】
    - 修复 InputNumber 传入 defaultValue 时警告问题 [#537](https://github.com/DouyinFE/semi-design/issues/537) [@chenc041](https://github.com/chenc041)

#### 🎉 2.3.0 (2022-01-14)
- 【Fix】
    - 修复 Notification 显示收起顺序 [#531](https://github.com/DouyinFE/semi-design/pull/531)
    - 修复 Upload 照片墙模式下移除按钮的边缘点击不可用的问题 [@pdsuwwz](https://github.com/pdsuwwz) [#525](https://github.com/DouyinFE/semi-design/pull/525)
    - 去除了 Collapse、SideSheet、Avatar、Spin 组件中无效的 aria-label [#536](https://github.com/DouyinFE/semi-design/pull/536)

#### 🎉 2.3.0-beta.0 (2022-01-07)
- 【Fix】
    - 修复 Form 使用 formApi.setValue、setError、setTouch 中用父级 fieldPath，对多个嵌套 field 进行批量赋值时，可能存在卡顿的问题（影响版本 v1.32~v2.2）
    - 修复 Form formApi.validate 局部校验触发范围不准确的问题 [#510](https://github.com/DouyinFE/semi-design/issues/510)
    - 修复 Tooltip 计算 adjustOverflow 时未将 spacing 纳入，导致内容超出（但未超过 8px）后仍未自动切换方向的问题  [#491](https://github.com/DouyinFE/semi-design/issues/491)
    - 修复 Tooltip 展现浮层默认方向空间不足，触发 adjustOverflow 自动切换方向时会闪烁的问题  [#69](https://github.com/DouyinFE/semi-design/issues/69)
    - 修复 Tree handleNodeDragOver 内部 event 传参不恰当的问题  [#345 ](https://github.com/DouyinFE/semi-design/issues/345)
    - 修复 TreeSelect 当 searchPosition 为 trigger 时，maxTagCount 不生效的问题  [#498 ](https://github.com/DouyinFE/semi-design/issues/498)
    - 修复 TagInput 设置 value 为 undefined 无法生效的问题  [#483 ](https://github.com/DouyinFE/semi-design/issues/483)
    - 修复 Slider 点击刻度不生效的问题
    - 修复 Table 非受控分页在翻页之后，更新 state 会重置分页状态，跳转到第一页  [#348](https://github.com/DouyinFE/semi-design/issues/348) [@chenc041](https://github.com/chenc041)
- 【Feat】
    - Select 支持 autoClearSearchValue，允许选中后保留当前搜索关键字
    - Slider 拖动时添加鼠标 grabbing 样式
    - A11y: 40+ 组件增加无障碍语义化支持 [#205](https://github.com/DouyinFE/semi-design/issues/205)
        - Button 新增 aria-label 属性，禁用时 Button 具有 aria-disabled 属性
        - Checkbox 的 role 为 checkbox，CheckboxGroup 的 role 为 list，它的直接子元素为 listitem，新增 aria-label 属性，用于解释选择框的作用；aria-disabled 表示当前的禁用状态；aria-checked 表示当前的选中状态
        - Empty 插图的 aria-hidden 为 true
        - Form 为 Form.Field 增加 label 和错误信息无障碍支持
        - Icon 组件 role 为 img，它的 aria-label 默认为组件的文件名；Icon 内部的 svg 元素为装饰元素，默认设置了 aria-hidden 以不被屏幕阅读器阅读
        - InputGroup 给 Label 新增 name 默认值，以便关联对应的 field
        - Modal 增加 open 前后 focus 位置处理，打开后聚焦在弹出层，关闭后聚焦在打开前聚焦的位置
        - Radio 的 aria-labelledby 默认指向 addon 节点，用于解释 Radio 的内容，aria-describedby 默认指向 extra 节点，用于补充解释 Radio 的内容
        - Select trigger 与弹出层的 role 为 combobox 和 listbox，trigger 绑定了一些 aria-* 属性表示与弹出层的关系；Option 上具有 aria-selected 和 aria-disabled 属性表示当前项的选中状态
        - Slider 的 role 为 slider，同时设置了 aria-valuenow 等属性描述它的当前状态；纵向时 aria-orientation 为 vertical；当 aria-valuenow 的值不容易理解时，支持通过 API aria-valuetext 传递一个字符串使其更友好，也可以通过 geAriaValueText 方法得到 aria-valuetext 的值。[#490](https://github.com/DouyinFE/semi-design/issues/490)
        - Table 的行、单元格添加了 role 和 aria-* 属性
        - Tooltip 具有 tooltip role，遵循 WAI-ARIA 规范中对于 Tooltip 的定义；content 的 wrapper 会被自动添加 id 属性，用于与 children 的 aria-describedby 匹配，关联 content 与 children
        - Tree 支持传入 aria-label 来表示该 Tree 作用，同时组件内部为 Tree 和 TreeNode 设置了相应的 role 和 aria-*属性。[#493](https://github.com/DouyinFE/semi-design/issues/493)
        - TreeSelect 支持传入 aria-label、aria-errormessage 等属性表示 TreeSelect 的作用和当前状态，同时为子节点设置了相关 aria-* 属性。[#493](https://github.com/DouyinFE/semi-design/issues/493)
        - Popover 的 trigger 为 hover 时，Popover 的 content 具有 tooltip role，trigger 为 click、custom 时，Popover 的 content 具有 dialog role
        - 其他组件详情请看各组件文档，点击这里查看[无障碍设计指导](https://semi.design/zh-CN/start/accessibility)

#### 🎉 2.2.2 (2021-12-31)
- 【Fix】
    - 修复 Transfer 在 type 是 groupList 场景下，title 属性传入 ReactElement 类型导致 key-warning [@JontyyYang](https://github.com/JontyyYang)
    - 修复 DatePicker 范围选择 preset 日期设置为 null 或 undefined，选择日期后面板没有关闭问题  [#338](https://github.com/DouyinFE/semi-design/issues/338)
    - 修复 dateRange 类型 DatePicker，triggerRender 传入时选择完日期面板没有关闭问题  [#422](https://github.com/DouyinFE/semi-design/issues/422)
    - 修复 InputNumber 精度格式化在受控模式下不正确问题
    - 修复 IconFastForward 拼写错误 [@clark-cui](https://github.com/clark-cui)

#### 🎉 2.2.1 (2021-12-29)

- 【Fix】
    - 修复 DatePicker 在 needConfirm 模式时，点击取消按钮输入框日期未返回到已选中日期问题 [#457](https://github.com/DouyinFE/semi-design/issues/457)
    - **优化 DatePicker 交互细节，确认选择模式 click outside 不再关闭面板，需通过点击取消关闭面板** [#457](https://github.com/DouyinFE/semi-design/issues/457)
    - 修复 DatePicker 确认选择模式 footer 按钮间距不正确问题 [#457](https://github.com/DouyinFE/semi-design/issues/457)
    - 修复 DatePicker RTL 模式下，年切换按钮方向错误问题 [#457](https://github.com/DouyinFE/semi-design/issues/457)
    - 修复 Table head row paddingY 与设计稿不符问题，统一调整为 8px [#460](https://github.com/DouyinFE/semi-design/issues/460)

#### 🎉 2.2.0 (2021-12-24)

- 【Fix】
    - 修复 Tabs 在 umd 方式使用时，tabPlane tab props 不接受动态更新的问题
- 【Docs】
    - 完善 Navigation  API 文档 [#451](https://github.com/DouyinFE/semi-design/pull/451) [@linjunc](https://github.com/linjunc)

#### 🎉 2.2.0-beta.1 (2021-12-23)

- 【Fix】
    - 修复 DatePicker 输入非法年份导致组件崩溃问题 [#422](https://github.com/DouyinFE/semi-design/issues/422)
    - 修复 Notification 多色模式下，背景色透明导致的内容穿透 [#430](https://github.com/DouyinFE/semi-design/issues/430)
    - 修复 Vite 构建 CSS 时抛出 @charset utf-8 相关 warning 的问题 [#403](https://github.com/DouyinFE/semi-design/issues/403)
    - 修复 Select 多选使用 backSpace 删除已选项后，下拉列表数据显示不正确的问题 [#444](https://github.com/DouyinFE/semi-design/issues/444)
    - 修复 Empty 在切换暗色模式时显示 this.updateMode 未定义问题 [#452](https://github.com/DouyinFE/semi-design/issues/452)
    - 修复 Safari<=13 版本的响应式报错问题 [#442](https://github.com/DouyinFE/semi-design/issues/442)

#### 🎉 2.2.0-beta.0 (2021-12-17)

- 【Feat】
    - Timeline.Item 支持 onClick [#402](https://github.com/DouyinFE/semi-design/issues/402)
    - Cascader 
        - 支持仅回显叶子节点，提供 leafOnly API [#256](https://github.com/DouyinFE/semi-design/issues/256)
        - 支持多选时点击叶子节点即可选中，提供 enableLeafClick API [#302](https://github.com/DouyinFE/semi-design/issues/302) [@btea](https://github.com/btea)
        - 支持自定义分隔符，提供 separator API [#408](https://github.com/DouyinFE/semi-design/issues/408)
    - Upload [#342](https://github.com/DouyinFE/semi-design/issues/342)
        - 支持通过 ref 调用 insert 方法 
        - 支持 props showPicInfo
        - 使用 gap 控制 FileCard 间隔
    - Icon [#260](https://github.com/DouyinFE/semi-design/issues/260)
        - 添加 double_chevron_left,double_chevron_right 图标
        - Icon 支持跟随当前上下文字体大小
    - LocaleProvider 新增西班牙语语言包 [@chenjunxyf](https://github.com/chenjunxyf)
    - Select 新增 inputProps，便于用户在 filter 为 true 时可实现一些特殊功能。例如传入 onCompositionEnd，onKeyDown 事件监听等
    - DatePicker [#260](https://github.com/DouyinFE/semi-design/issues/260)
        - 新增年份切换按钮
        - 优化范围选择交互逻辑，避免出现两个面板是相同月份场景
- 【Fix】
    - Select
        - 修复 Select renderSelectedItem 返回的 isRenderInTag 为 false 时会报 key 的 warning 的问题 [#320](https://github.com/DouyinFE/semi-design/issues/320)
        - 修复 Select 搜索高亮关键字时 warning 提示 mark 标签 key 缺失的问题
    - 修复 Cascader multiple+disabled 时标签样式与设计稿不符 [#400](https://github.com/DouyinFE/semi-design/issues/400)
    - 修复 Description type='plain' 时，key 或 itemKey 为 node 时渲染不正确的问题 [#406](https://github.com/DouyinFE/semi-design/issues/406)
    - 修复 Pagination 同时使用 hideOnSingePage 与 showSizeChanger 时，总页数只有 1 时，sizeChanger 会消失无法再切换的问题 [#252](https://github.com/DouyinFE/semi-design/issues/252)
    - 修复 通过 webpack plugin variables 方式定义 Select 组件 Design Token 时不生效的问题 [#375](https://github.com/DouyinFE/semi-design/issues/375) [@summerstream](https://github.com/summerstream)
    - 修复 Rating 组件设置 size 为 number 后 UI 错误
    - 修复 Timeline 自定义 dot 水平对齐的问题 [#395](https://github.com/DouyinFE/semi-design/issues/395) [@chenc041](https://github.com/chenc041)
- 【Docs】
    - 完善 semi-ui package.json [@chenc041](https://github.com/chenc041)

#### 🎉 2.1.5 (2021-12-10)

- 【Fix】
  - Timeline.time ts 定义支持 ReactNode 类型 [#359](https://github.com/DouyinFE/semi-design/issues/359) [@chenc041](https://github.com/chenc041)
  - 修复 Tree 组件 onContextMenu 阻止冒泡的问题 [#364](https://github.com/DouyinFE/semi-design/issues/364) [@Nctdtman](https://github.com/Nctdtman)
  - 修复 Select/Checkbox/Button 缺少 id 的问题 [#353](https://github.com/DouyinFE/semi-design/issues/353)
  - 修复 Nav  footer、header dts 定义相反了的问题
  - 修复 Table fixed 单元格 z-index 过小问题，从 1 调整为 101 [#391](https://github.com/DouyinFE/semi-design/issues/391)
  - 修复 Form Field 在未声明 field 属性时使用时下丢失 ref 的问题
- 【Style】
  - 修复 --overlay-bg token 命名不规范的问题。修改为 --color-overlay-bg
#### 🎉 2.1.4 (2021-12-03)

- 【Fix】
  - Checkbox onChange 回调的入参 event 增加 nativeEvent.stopImmediatePropagation [#343](https://github.com/DouyinFE/semi-design/issues/343)
  - 修复 Cascader 多选时点击 Checkbox 在某些场景下触发冒泡 [#343](https://github.com/DouyinFE/semi-design/issues/343)
  - 修复 ButtonGroup 的 children 不是 ReactElement 报错的问题 [#318](https://github.com/DouyinFE/semi-design/issues/318) 
  - 修复 Rating 组件当父级设置 line-height 时半星展示错误 [#346](https://github.com/DouyinFE/semi-design/issues/346)
  - Checkbox/Radio
    - 修复鼠标移入/移出选中按钮过程中，鼠标出现状态切换的样式问题 [#319](https://github.com/DouyinFE/semi-design/issues/319) 
    - 修复选中态 hover/active 时选中按钮会出现外边框的问题 [#319](https://github.com/DouyinFE/semi-design/issues/319) 
    - 优化卡片类型 selected+disabled 态的样式 [#319](https://github.com/DouyinFE/semi-design/issues/319) 

#### 🎉 2.1.3 (2021-11-30)

- 【Fix】
  - 修复在源码构建过程中，替换 ImportDeclaration 中 source 的 bug

#### 🎉 2.1.2 (2021-11-30)

- 【Feature】
  - 支持 Next.js [#153](https://github.com/DouyinFE/semi-design/issues/153)
  - 替换飞书 Logo 图标
- 【Fix】
  - 修复 AutoComplete 的样式问题
  - 修复 InputNumber 在编辑器没有 API 语法提示问题 [#327](https://github.com/DouyinFE/semi-design/issues/327)
  - 修复 Input focus 时 hover 态边框颜色错误问题 [#332](https://github.com/DouyinFE/semi-design/issues/332)

#### 🎉 2.1.1 (2021-11-26)

- 【Fix】
  - 提供 semi-icons、semi-illustrations 的 UMD 产物，解决 UMD 场景下无法使用 icon 的问题 [#215](https://github.com/DouyinFE/semi-design/issues/215)

#### 🎉 2.1.0 (2021-11-26)

- 【Fix】
  - 修复 Collapsible 组件在 content 有 margin 时展开/收起卡顿的问题 [@ChelesteWang](https://github.com/ChelesteWang)
- 【Style】
  - Timeline 新增 $color-timeline_item_content-text-default Sass 变量，用于配置时间轴标题文字颜色
- 【Docs】
  - 增加对局部模块应用暗色模式、亮色模式的 Demo 例子 [#301](https://github.com/DouyinFE/semi-design/issues/301)
  - 更新 Table 示例，使用更符合使用场景的示例代码，对一些常见问题添加备注 [#315](https://github.com/DouyinFE/semi-design/issues/315)
  - List 增加与 Checkbox、Radio、Input、Pagination 搭配使用的 Demo 示例；增加拖拽排序的 Demo 示例；增加键盘响应事件的 Demo 示例

#### 🎉 2.1.0-beta.3 (2021-11-24)

- 【Fix】
  - 更新部分组件的 ts 类型定义，修复 tsconfig.json 开启 strict: true 且 skipLibCheck 为 false 时 build 报错的问题 [#283](https://github.com/DouyinFE/semi-design/issues/283)

#### 🎉 2.1.0-beta.1 (2021-11-24)

- 【Fix】
  - Select
    - 修复虚拟化使用崩溃的问题 [#308](https://github.com/DouyinFE/semi-design/issues/308)
    - 修复 Option children 不是 string 时的渲染问题
  - 修复 TreeSelect leafOnly 和 searchPosition='hover' 同时开启时报错的问题 [#306](https://github.com/DouyinFE/semi-design/issues/306)
  - 修复 Cascader 多选时，triggerRender 入参中 value 为空的问题 [259](https://github.com/DouyinFE/semi-design/issues/259)
  - 修复 Tree 的 interface ExpanedOtherProps 命名不正确的问题，将其修正为 ExpandedOtherProps [297](https://github.com/DouyinFE/semi-design/issues/297)

#### 🎉 2.1.0-beta.0 (2021-11-19)

- 【Feature】
  - Tabs 新增 关闭可选项 closable API [@xieyezi](https://github.com/xieyezi)
  - TagInput 新增 onKeyDown API [#255](https://github.com/DouyinFE/semi-design/issues/255)
  - Tooltip、Popover、Popconfirm 新增 onClickOutSide API，更易于在 trigger='custom'情况下实现点击空白处关闭的行为 [#268](https://github.com/DouyinFE/semi-design/issues/268)
- 【Fix】
  - 修复 Radio 在某些主题包下可能存在的垂直方向未对齐问题：Radio $height-radio_inner_min 值由 继承 $spacing-base-loose 改为固定 20px，避免受不同主题包影响 
  - 修复 Tabs 点击激活状态的 tab 仍触发 onChange 的问题 [#208](https://github.com/DouyinFE/semi-design/issues/208)
  - 修复 Collapsible 组件默认打开时，组件高度没有完全展开问题 [#85](https://github.com/DouyinFE/semi-design/issues/85)
  - 修复 Slider value 受控时点击轨道未触发 onAfterChange 的问题
  - 修复 Select，AutoComplete UMD CSS 丢失问题
- 【Chore】
  - 修复 TreeSelect 的 renderSelectedItem ts 类型不准确问题 [#265](https://github.com/DouyinFE/semi-design/issues/265)
  - Typescript Interface 相关变更 [#277](https://github.com/DouyinFE/semi-design/issues/277)
    - Form 增加 WithFieldOption 的导出
    - Notification 增加 ConfigProps 的导出
    - Toast 增加 ConfigProps 的导出
    - Upload 增加 BeforeUploadObjectResult、AfterUploadResult 的导出
    - Cascader 增加 CascaderType 和 ShowNextType 的导出


#### 🎉 2.0.8 (2021-11-11)

- 【Fix】
  - 修复 Modal afterClose 部分场景失效

#### 🎉 2.0.7 (2021-11-10)

- 【Fix】
  - 修复 Icon 包缺少 classnames 依赖问题 [#231](https://github.com/DouyinFE/semi-design/issues/231)
- 【Style】
  - Table 修复了固定列/表头场景，所有列均不设置宽度时表格对不齐问题 [#247](https://github.com/DouyinFE/semi-design/issues/247)


#### 🎉 2.0.6 (2021-11-10)

- 【Style】
  - Table 移除固定列/固定表头时在表头插入的滚动轴列，使用 overflow-y 方案模拟滚动轴 [#164](https://github.com/DouyinFE/semi-design/issues/164)


#### 🎉 2.0.5 (2021-11-09)

- 【Style】
  - 修复 Input 组件 hover 时 border 样式问题 [#204](https://github.com/DouyinFE/semi-design/issues/204)
- 【Perf】
  - Modal 使用 CSS 动画，优化打开和关闭时的动画效果 [#236](https://github.com/DouyinFE/semi-design/issues/236)

#### 🎉 2.0.4 (2021-11-08)
- 【Fix】
  - 修复 Cascader 单选时，defaultValue 为 disabled 节点时选中会被过滤的问题 [#183](https://github.com/DouyinFE/semi-design/issues/183)
  - 修复 Cascader 多选且开启 onChangeWithObject，defaultValue 为 object[] 没有生效的问题 [#184](https://github.com/DouyinFE/semi-design/issues/184) 
  - 修复 Select 支持打开下拉框后，无法自动滚动到已选中的项目的问题 [#169](https://github.com/DouyinFE/semi-design/issues/169) 
  - 修复 Table resizable 表格问题 [#154](https://github.com/DouyinFE/semi-design/issues/154)
- 【Docs】
  - 优化了共建文档 [#224](https://github.com/DouyinFE/semi-design/issues/224) [@btea](https://github.com/btea)

#### 🎉 2.0.3 (2021-11-06)

- 【Fix】
  - 修复 Tree / TreeSelect 在 loading 状态下 item 高度变大的问题 [#181](https://github.com/DouyinFE/semi-design/issues/181)
  - 修复 TagInput 在 separator 不为 string 或 array 时输入值会被清空的问题 [#182](https://github.com/DouyinFE/semi-design/issues/182)
  - 修复 Form 通过 setValues 重置 ArrayField 时，formState 已生效，UI 渲染未同步更新的问题 [#211](https://github.com/DouyinFE/semi-design/issues/211)
- 【Docs】
  - 介绍页增加 pnpm 安装方式 [#27](https://github.com/DouyinFE/semi-design/pull/27) [@Sepush](https://github.com//Sepush)
- 【Chore】
  - 日语语言包优化 Pagination、DatePicker 组件的两处文案 [#135](https://github.com/DouyinFE/semi-design/pull/135) [@Void-YY](https://github.com//Void-YY)


#### 🎉 2.0.2 (2021-11-04)

- 【Fix】
  - 修复 Toast 的类型定义 [#166](https://github.com/DouyinFE/semi-design/issues/166)
  - 修复 Radio value / defaultValue 的类型定义，从 string 改正为 string | number [#159](https://github.com/DouyinFE/semi-design/issues/159)
  - 修复 Transfer 在 treeList 类型下搜索问题 [#163](https://github.com/DouyinFE/semi-design/issues/163)
  - 修复 DatePicker type=month 时，计算机设置为美东时区，无法选中日期问题 [#173](https://github.com/DouyinFE/semi-design/issues/173)
  - 修复 List 类型定义错误问题 [#156](https://github.com/DouyinFE/semi-design/issues/156)
  - 修复 Select 组件 renderSelectedItems 类型定义问题 [#160](https://github.com/DouyinFE/semi-design/issues/160)
  - 修复 Tooltip 事件回调没有正确移除问题 [#192](https://github.com/DouyinFE/semi-design/issues/192)
- 【Style】
  - Switch 新增 Token：$color-switch_disabled-bg-hover，$color-switch_disabled-bg-active，定制 disabled 态的背景颜色 [#115](https://github.com/DouyinFE/semi-design/issues/115)
- 【Docs】
  - 优化一些文档问题 [#165](https://github.com/DouyinFE/semi-design/issues/165) [#175](https://github.com/DouyinFE/semi-design/issues/175) [@YufeeXing](https://github.com//YufeeXing) [@BestDingSheng](https://github.com//BestDingSheng)
- 【Chore】
  - Anchor 新增 max-height、max-width 测试用例 [#151](https://github.com/DouyinFE/semi-design/issues/151) [@songjianet](https://github.com//songjianet)


#### 🎉 2.0.1 (2021-11-01)

- 【Fix】
  - 修复 TreeSelect 选中节点后会展开其子节点并立即关闭，造成视觉跳闪的感觉 [#78](https://github.com/DouyinFE/semi-design/issues/78)
  - 修复 Progress 组件 size 改变时渲染错误 [#94](https://github.com/DouyinFE/semi-design/issues/94)
  - 修复 Collapsible 组件默认打开时，组件高度没有完全展开问题 [#85](https://github.com/DouyinFE/semi-design/issues/85) [@Janlay884181317](https://github.com//Janlay884181317)
  - 修复 Navigation items 类型定义报错问题 [#35](https://github.com/DouyinFE/semi-design/issues/35)
  - 修复 Navigation.Header linkOptions 传 target 类型报错问题 [#120](https://github.com/DouyinFE/semi-design/issues/120) [@boenfu](https://github.com//boenfu)
  - 修复 Table Column.render text 类型报错问题，由 string => any [#144](https://github.com/DouyinFE/semi-design/issues/144)
  - 修复 TextArea 组件 TextAreaProps 类型定义报错问题 [#149](https://github.com/DouyinFE/semi-design/issues/149)
- 【Style】
  - 更新 Form 组件 Token，$spacing-form_label_posLeft-marginRight 的值：4px -> 0px，将 labelPosition='left' 时  Label 的右边距对齐（无论其是否位于 Form.InputGroup 中）。并修正 Form.InputGroup 中 Label 在 labelPosition='left' 时未垂直居中的问题 [#67](https://github.com/DouyinFE/semi-design/issues/67)
  - Anchor 的组件修改 Token 拼写问题，更新 $radis-anchor_slide => $radius-anchor_slide [#92](https://github.com/DouyinFE/semi-design/issues/92) [@btea](https://github.com//btea)
- 【Docs】
  - 优化了 Navigation、Upload、TreeSelect、TimePicker、Switch、Select、Rating、Form、DatePicker、Notification 等组件的示例文档、修正了一些拼写错误问题。[@songjianet](https://github.com//songjianet) [@wangzhitao](https://github.com//wangzhitao) [@pleiades-embers](https://github.com//pleiades-embers) [@jaydonyin](https://github.com//jaydonyin) [@jukrb0x](https://github.com//jukrb0x) [@GoldSubmarine](https://github.com//GoldSubmarine) [@wangzt-arch](https://github.com//wangzt-arch) [@ivan0525](https://github.com//ivan0525) [@Shigma](https://github.com//Shigma) [@GoldSubmarine](https://github.com//GoldSubmarine) [@WscatsWscats](https://github.com//WscatsWscats) [@oddguan](https://github.com//oddguan) （排名不分先后，相同的场景不一一批注）
  - 帮助完善了 README、CONTRIBUTING、介绍等文档  [@ChelesteWang](https://github.com//ChelesteWang) [@Timeless0911](https://github.com//Timeless0911) [@niexq](https://github.com//niexq) [@Pingren](https://github.com//Pingren) [@oddguan](https://github.com//oddguan) [@noahziheng](https://github.com//noahziheng) [@Aaron00101010](https://github.com//Aaron00101010) [@Faithree](https://github.com//Faithree)

#### 🎉 2.0.0 (2021-10-26)

- 【Breaking Change】
  - 组件相关调整
    - Icon 相关
      - Icon 组件不再支持  type=xxx 方式使用内置 icon
      - 自定义 svg 不再支持插件方式配置 srcSvgPaths
      - Button icon 属性不再支持通过 string 传递内置 icon 名，不再支持 iconType 属性
      - Dropdown 删除 iconType 属性，统一为 icon 属性
      - Navigation icon 不再支持通过 string 方式传入，需要传入 ReactNode
      - Notification icon 不再支持通过 string 方式传入，请统一使用 ReactNode
    - AutoComplete 正式废弃 onChangeWithObject 属性
    - Cascader triggerRender 的入参移除 onInputChange
    - Form 不再从 `semi-ui/index.js` 导出 Label 组件，如需使用请用 Form.Label
    - Tree onRightClick 更名为 onContextMenu
    - Upload dragable 更名为 draggable
    - Tooltip 不再支持 disabled 属性，依赖 Tooltip 的组件（如 Popover、Dropdown 等）透传给 Tooltip disabled 将失效
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

#### 🎉 1.33.1 - 1.38.x
- 【Docs】
  - 字节跳动用户，若需要查询该区间段的 changelog 变更，请通过内网域名访问，在右上角 Header 中切换至 1.x 文档站点查阅。该部分变更与 v2.0 - 2.4 重合，因此不在此处再次列举

#### 🎉 1.33.0 (2021-10-22)
- 【Fix】
    - 修复 Cascader 组件同时使用 changeOnSelect 和 loadData 属性时，未选到最后一级的情况下，重置 value 无效 

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
    - 修复 Tooltip 包裹 Select 时，远程搜索失焦 
    - 修复 Select 搜索模式下，搜索结果中高亮字符串前后空格丢失的问题 

#### 🎉 1.32.2 (2021-10-14)
- 【Fix】
    - 修复 Tooltip motion 为 false 时弹出层未显示问题（影响 v1.30+）
    - 修复 Slider 在拖拽时如果父级 dom  进入 display none 会触发错误的问题 

#### 🎉 1.32.1 (2021-10-11)
- 【Fix】
    - 修复 Button disabled 时，触发冒泡的问题。

#### 🎉 1.32.0 (2021-10-09)
- 【Fix】
    - 修复 Avatar 更新 src 不生效问题 
    - 修复 DatePicker 俄语、越南语显示日期错误问题 
    - 修复 Tag size 为 small 且 avatarShape 为 circle 时，avatar 样式大小异常 

#### 🎉 1.32.0-beta.0 (2021-09-30)
- 【Feat】
    - TreeSelect 支持 support loadData/onLoad/loadedKeys 
    - Cascader 支持 disableStrictly 
    - Tooltip 支持 wrapperClassName
    - Form formApi.setValue、setError、setTouched 支持使用父级 fieldPath，对多个 field 进行批量赋值 
- 【Fix】
    - **修正 Form ArrayField 设置 initValue，其下属的 Field 也设置 initValue 时，通过 ArrayField Props 配置的初始值反而比通过 Field Props 配置的初始值权重高的问题。对齐 Form Props、Field Props 的优先级生效规则，遵循子级配置权重最高的原则**

#### 🎉 1.31.0 (2021-09-24)
- 【Fix】
    - Form 修复 validate 指定校验部分 fields 时，可能因为 field 前缀相同，而误触发校验的问题 
    - DatePicker disabledTime 回调参数类型错误问题（影响 v1.26 ~ 1.31-beta）


#### 🎉 1.31.0-beta.1 (2021-09-23)
- 【Fix】
    - 当 Pagination showQuickJumper 为 true，输入负数时，由不生效改为跳转至第一页
- 【Style】
    - 去除 Pagination type 为 mini 时左右两侧的 padding（即组件 Token：$spacing-pagination_small-paddingX 的默认值由 8px 变更为 0）
    - Pagination showQuickJumper 为 true 时，当总页数只有 1 页时，quickJumper 部分样式自动 disabled。新增组件 Token：$color-pagination_quickjump_text-disabled

#### 🎉 1.31.0-beta.0 (2021-09-18)
- 【Feat】
  - Upload 添加 beforeRemove（删除前回调）和 beforeClear（清空前回调），可用于阻止移除文件
  - Pagination 增加 showQuickJumper 快速跳转至某页
  - DatePicker 新增 rangeSeparator API，支持替换范围日期分隔符
  - Table
    - 新增 defaultSortOrder API，支持给列设置一个默认的排序顺序 
    - 新增 expandRowByClick API，支持点击行展开 
- 【Fix】
    - 修复 Input 未设置宽度且 hideSuffix 为 true，清除按钮 hover 时输入框宽度变化问题 
- 【Style】
    - Pagination 新增组件 Token：$spacing-pagination_quickjump_marginLeft、$spacing-pagination_quickjump_input_marginLeft、$spacing-pagination_quickjump_input_marginRight、$font-pagination_quickjump_fontWeight、$width-pagination_quickjump_input_width

#### 🎉 1.30.2 (2021-09-17)
- 【Style】
    - 修复 Transfer 组件右侧 header 高度变化样式问题

#### 🎉 1.30.1 (2021-09-13)
- 【Fix】
    - 修复 Button 任意情况都阻止了事件冒泡导致 Upload 不可用的问题（影响范围 v1.30.0）

#### 🎉 1.30.0 (2021-09-10)
- 【Fix】
  - 修复 Tooltip getPopupContainer 报错问题
  - 修复 Pagination 传入 total 过大时报错的问题
  - Button 组件 disabled 后，期望点击事件不冒泡
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
    - 修复 container 为 body 时，如果 body 存在 margin 造成的弹出层位置错误 
    - 修复 onVisibleChange 偶尔不会触发问题 
    - 修复 mouseEnterDalay 和 mouseLeaveDelay 都为 0 时，鼠标快速划过弹出层无法隐藏问题 
  - 修复 DatePicker type 为 date 时，失焦后再次聚焦没有触发 onFocus 问题 
  - Icon 懒加载图标未加载修复 
  - Calendar 修复头部不对齐的问题 
  - 修复 slider 在受控模式 onAfterChange 不生效的问题
- 【Style】
  - Tree 和 TreeSelect 支持搜索高亮 
  - CheckboxGroup direction='horizontal' 时，最后一个 checkbox 设置 margin-right 为 0，以对齐 vertical 的情况
  - 修复 Upload 照片墙模式，disabled 指针样式未禁止问题
- 【Docs】
  - 修复 TagGroup demo 没有垂直居中对齐的问题 

#### 🎉 1.29.1 (2021-08-30)
- 【Fix】
  - 修复 ArrayField 中使用 Form.Select 开启 onChangeWithObject 后，新增或删除行时由于 stringify 异常导致 unregister 错误的问题 

#### 🎉 1.29.0 (2021-08-27)
- 【Feature】
  - 新增 Icon，layers
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
    - **Space 的间距实现从 margin 修改为 gap。开启 wrap 后，位于最后一行的子元素不再有下外边距，且每行的最后一个元素不再有右外边距** 
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
        - 在 dateTimeRange 类型中，修复判断日期是否为 disable 时存在的问题

#### 🎉 1.28.3 (2021-08-19)
- 【Fix】
    - Cascader
        - 修复 autoMergeValue 为 false 时报错 forEach is not a function 的报错问题
        - 修复 multiple 为 true 且 showClear 为 true 时，当选中项为空时显示 clearBtn 的问题

#### 🎉 1.28.2 (2021-08-18)
- 【Fix】
    - Steps
        - 修复 Steps 定制组件级 Design Token 不生效的问题
#### 🎉 1.28.1 (2021-08-16)
- 【Feature】
    - 组件内置文案支持繁体中文 
- 【Fix】
    - Select
        - 修复受控多选且 onChangeWithObject 为 true 情况下，optionList 中含有 key，第一次选择时 onChange 回调中 key 丢失的问题 
        - 修复 onChangeWithObject 打开之后，onChange 里面的 option 会额外包含某些 Select 内部状态如 selected、show 等的问题 
        - 修复 filter allowCreate 同时开启，搜索选项有命中的情况下，点击任一选项也会造成创建新选项的问题 
    - Calendar
        - 修复默认 locale 错误的问题 
    - 修复 UMD 产物 Icon 图标未去色问题
    - DatePicker
        - **在 dateRange 和 dateTimeRange 类型中，支持动态 disable 日期选项。比如当选择了 startDate 后，在选择 endDate 时，比 startDate 小的日期不可选**
        - **在 dateRange 和 dateTimeRange 类型中，优化了选择日期时 trigger 的高亮区域。由原来完成的 trigger 高亮切换为 input 区域。包含背景和边框。比如在选择 startDate 时，startInput 区域会高亮。**
            - **注：实现该功能调整了 DatePicker 的 trigger。在 input 外层包括一层 div。**
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
    - DatePicker 新增 API 开关：syncSwitchMonth，允许在范围选择场景下，双面板月份同步切换 
    - DatePicker 新增回调：onPanelChange，当月份左右切换时触发 
- 【Style】
    - 修复 TagInput 中 +N 的水平间距和设计稿的差异，为 +N 添加水平内边距 8px
    - Radio
        - 修复按钮类型的 Radio 默认背景色和设计稿的差异，从 var(--color-fill-1) 改为 var(--color-fill-0) 
        - 修复按钮类型的 Radio 不对齐的问题，添加 align-item: middle
    - Design Token
        - Popconfirm 新增 $radius-popconfirm-popover Scss 变量，通过配置此变量可以自定义本组件 border-radius
        - 新增 --border-radius-full（值为 9999px）CSS 变量，可用于创建全尺寸圆角，如胶囊标签等
- 【Fix】
    - Table
        - 修复受控更新 rowSelection 时 可选单元格 disabled 渲染错误的问题
        - 修复受控更新 columns.sortOrder 时表格数据未正确排序的问题
        - 修复在已有筛选项的情况下，更新 dataSource，表格数据未经过滤全部展示出来的问题 
- 【Docs】
    - Tree 组件补充 autoExpandParent 的描述 & Demo

#### 🎉 1.27.3 (2021-08-05)
- 【Fix】
    - 优化 DatePicker dateRange 和 dateTimeRange 场景的交互体验。支持在一次选择中，可单独改变 startDate 或 endDate 以及同时改变 

#### 🎉 1.27.2 (2021-08-03)
- 【Style】
    - 修复 RTL 模式下 Select insetLabel 右侧边距不对的问题
#### 🎉 1.27.0 (2021-07-30)
- 【Fix】
    - 修复 SideSheet  mask 为 false 且 width 设置为百分比字符串时，SideSheet 没有正确展示的问题 
    - Tag 新增 default size，修复在 InputGroup 中使用 default size 报错的问题
- 【Style】
    - Tag 增加  white-space: nowrap，解决超长换行文本因高度固定导致的显示不正确问题（Tag 建议优先单行使用，内容超长时建议搭配 Typography 使用）
- 【Chore】
    - Table 新增 RecordType 范型，完善 Column.render 参数定义
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
    - 修复 Transfer 组件全选/取消全选，清空的处理判断逻辑问题 
- 【Docs】
    - 修正 Dropdown 文档中 tooltip position 的跳转链接

#### 🎉 1.26.1 (2021-07-20)
- 【Fix】
    - 修复 DatePicker 切换时间直接报错的问题 
- 【Style】
    - 修复 DatePicker 有 defaultValue 时，disabled 样式不符合预期的问题 
- 【Docs】
    - 修改补充了 Cascader 和 Select 组件文档中 triggerRender 的内容

#### 🎉 1.26.0 (2021-07-18)
- 【Fix】
  - Form
    - 修复 Form reset 时 ArrayField 没有被重置回初始状态的问题 
    - 修复 Form field rules 由有效数组变更为空数组时，重新执行校验，校验状态没有被正确更新的问题 
    - 修复 Form ArrayField 通过 initValue 配置初始值时，初次渲染也错误触发了 onValueChange 的问题 
  - DatePicker
    - 修复 DatePicker 在日期未发生改变时也调用 onChange 问题 
    - 修复 DatePicker disabledDate 与 disabledTime 传参未适配 timeZone 问题 
  - 修复 RadioGroup 隔级传 Radio 报错的问题 
  - 修复 Space 中使用 React.Fragment 显示不符合预期的问题 
  - 修复 Collapsible 没有 keepDom，却在初始折叠时渲染了 DOM 的问题 
  - 修复 Table 表头列合并 rowSpan 为 0 时列对不齐问题 
- 【Style】
  - Navigation
    - Navigation 一级目录选中态文字颜色与设计稿对齐，由 --color-primary ➡️ --color-text-0 
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
    - 修复 Form reset 时 ArrayField 未恢复至初始状态的问题 
    - 修复 Form Field rules 由有效数组变更为空数组后，校验状态未更新的问题 
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
    - **请留意 Input 的样式新增默认的高度。如果你给 Input 自定义了 padding，由于 Input 为 border-box，请将 Input 的 height 设置为默认高度 + 自定义 padding**
- 【Docs】
    - Table 补充 column.title 描述，解释不同参数类型对 title 渲染的影响
#### 🎉 1.25.0 (2021-07-02)

- 【Fix】
    - 修复 DatePicker placeholder 传空字符串不生效问题
    - 修复 Collapse 传入复杂内容致高度计算错误的问题
- 【Chore】
    - 校准 TreeSelect、Tree 的 d.ts，查漏补缺 
- 【Style】
    -  Notification width 由固定的 320px => auto

#### 🎉 1.25.0-beta.3(2021-07-01)

- 【Fix】
    - 修复 Select value=0 且 optionList 中无对应 Option 时，renderSelectedItem 未触发执行的问题 

#### 🎉 1.25.0-beta.0 (2021-06-25)

- 【Chore】
    - 优化构建体积，多语言包支持 tree shaking，此次改动涉及组件 LocaleProvider、DatePicker、TimePicker、Calendar

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
    - 更新 Column dts，完善 useFullRender 类型

#### 🎉 1.24.0-beta.2 (2021-06-17)

- 【Fix】
    - 修复 TimePicker 使用 Input 修改时间交互不顺畅问题 

#### 🎉 1.24.0-beta.1 (2021-06-15)

- 【Feature】
    - DatePicker
        - DatePicker 新增 onPresetClick API
    - Upload
        - Upload 组件新增 onAcceptInvalid API 

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
    - 修复了当 dataSource 更新时，未更新搜索结果的问题 
    - 修复了已选项 disabled 的情况下 hover 上展示移除图标的问题 
  - 修复 Dropdown.Item 图标自动缩放问题
  - 移除 Tooltip、Dropdown 等浮层组件上 .d.ts 误增加的 disabled 属性（实际上组件并未提供该 API）
  - 修复了 Upload 在单文件替换时，第二次重复上传相同文件失效的问题 
- 【Style】
  - 优化 Modal 动画参数，减少卡顿感

#### 🎉 1.23.0-beta.0 (2021-05-28)

- 【Feature】
  - AutoComplete
    - 新增 onChange API，当在输入框变化/候选项选中时触发，一直返回 string 类型
    - **value 不再对 object 类型支持**
  - Toast
    - 新增 ToastFactory，通过 ToastFactory.create() 生产 Toast，解决 getPopupContainer 配置后无法更改问题
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
    - 修复 AutoComplete 选项点击 padding 处无法选中问题

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
    - renderSelectedItem 新增 sortableHandle 传参，用于 draggable 场景配置自定义已选项渲染时候用
- 【Fix】
  - Form
    - 修复 submit 校验失败时，errors 中的 error 对象可能会被吞掉变成{}的情况 
    - 修复 trigger 包含 mount，且 validate 为异步检验时，挂载后未触发初次校验的问题 
  - Table
    - 修复 disabled 所有行可以选中第二页数据问题 
    - 修复函数组件使用时排序失效问题（影响版本 v1.21) 
    - 修复动态切换 rowSelection 时，列没有更新问题（影响版本 v1.21）
    - 更新 Table 逆序排序逻辑，由先升序排+reverse => 逆序排序 
    - 修复 配置 scroll.y 且当前页数据不够时没有显示垂直滚动条导致的列对不齐问题 
  - Radio 修复 mode='advanced'时，如果 group 与 radio 中间嵌套了 div 或其他标签，advanced 会不生效的问题 
  - 修复 Card 组件传入 className 没有生效问题 
  - 修复 Transfer 组件 defaultValue 失效问题 
  - 修复 Calendar 组件显示更多事件数量显示异常问题
  - 修复 Input 在条件渲染情况下，clear 按钮点击失效的问题 
  - 修复 InputNumber step 设置为 0.1，min 为 0，max 为 1，无法通过右侧加号达到 1 问题 
  - Select  
    - 修复 Select onChangeWithObject 为 true 时，调用 ref.selectAll 不生效问题；修复调用 ref.selectAll 后未触发 onChange 的问题 
    - 修复 Select 搜索后更新 optionList 将选项个数变更后，某些情况下直接敲击回车抛出 Uncaught TypeError: Cannot read property '_inputCreateOnly' of undefined 的问题 
  - 修复 Description data key 传入 ReactNode 时，抛出 propType check warning 的问题
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
  - Upload 组件支持单文件替换
  - Icon 组件新增 onMouseDown onMouseUp onMouseMove api
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
  - --color-disabled-bg 下降一个色阶，引用-grey-1, 提高背景和文字的对比，提高可读性
  - tietrary button 的 文字颜色 使用 --color-text-1, 同样提升对比度 + 可读性
  - 对于 borderless + split button , 按钮主体和下拉箭头的 hover state 分开，用以明确热区


#### 🎉 1.20.3 (2021-04-29)
- 【Fix】
  - Select 的 Class 类型添加 open、close 等实例调用方法
  - 修复 Progress 在 unmounted 时调用 setState 引起 React 报错
  - Cascader 当有未匹配初始值时，级联异步加载未显示子节点 
  - Breadcrumb noLink 的样式修复
  - Upload 进度条调整为在接收到服务器明确响应后才到达 100%
  - 修复 DatePicker 可以在受控模式下输入禁用日期问题 
  - 修复 Table sorter 在自定义 prefixCls 场景下点击没有高亮问题


#### 🎉 1.20.0-beta.4 (2021-04-12)
- 【Feature】
  - Upload 新增文件夹上传功能 
  - Transfer 支持树形穿梭框 
  - TagInput 新增 addOnBlur 和 allowDuplicates api 
  - Table 新增获取虚拟化表格 ref 的接口，虚拟化表格允许滚动至某行 
  - Anchor 新增默认锚点 
  - Anchor.Link 新增 disabled 
- 【Fix】
  - 修复 Navigation item font-weight 错误问题（1.18 版本引入）
  - 修复使用 prefixCls 后，Tabs 设置 collapsible，切换 tab 时有报错问题
  - 修复 Form label、Table 筛选器 dropdown item 的 RTL 问题
  - 修复 Anchor 有滚动容器时，点击锚点，滚动容器发生滚动问题 
  - 修复 Table 筛选器筛选结果为空时，显示全部数据问题 
- 【Style】
  - TagInput 标签过长发生截断时，自动显示 ToolTip 
  - Banner 非全屏模式下 title 与 description 添加 2px 间距 
  - Form label font-weight 更新 700 => 600，相对应的 Scss 变量 font-weight-bold 也从 700 调整为 600 


#### 🎉 1.19.0 (2021-04-02)
- 【Fix】
  - 修复 Navigation 在初始化时设置二级的 selectedKeys，一级标题没有激活样式的问题 
  - 修复 Table 点击第一个筛选器后 setState 第二个筛选器失效问题 
  - 修复 Avatar 动态修改 hoverMask 不生效的问题
  - TagInput
    - 修复空格交互问题 
    - 修复 setInputValue('') 失效 
  - InputNumber
    - 修复受控模式下使用 ⬆️ 和 ⬇️ 按钮输入框没有更新问题 
    - 修复受控模式下传递非法数值没有响应问题 
- 【Style】
  - 移除 Modal fullScreen 时带的 border 样式
  - 修复 Tabs type='line'，size 为 small 时，设置了 tabBarExtraContent 会由于高度撑开时使得 tabBar 的底部 border 样式不对的问题
  - TagInput
    - 修复标签长度超出的样式问题 
    - 修复用 withField 包装后的宽度问题 

#### 🎉 1.19.0-beta.0 (2021-03-26)
- 【New Component】
    - 新增 TagInput 组件 
- 【Fix】
    - AutoComplete 点击回车报错 
    - 修复 Description DataItem 为 null 时报错 
    - 修复 Upload beforeUpload 中返回新的 fileInstance，未正确执行上传的问题 
    - 修复 Navigation 选中且禁用时样式不正确问题 
- 【Style】
    - DatePicker 面板弹出位置如果在输入框上方，为了方便快速切换月份，日期面板周数固定为 6 周 

#### 🎉 1.18.0 (2021-03-17)
- 【Fix】
  - 修复 Select 多选受控时，未绑定 onChange 函数，点击 tag 上的 x，依然能删除选中的问题 
  - 修复 InputNumber 受控使用时，输入值超出 max 后触发 onNumberChange 问题 
  - 修复 Select 禁用时点击或通过 tab 按钮可以选中问题
- 【Style】
  - Select clear icon 增加 flex-shrink，解决设置 mulitple+showClear，在某些情况下鼠标 hover 时长度抖动的问题 
- 【Chore】
  - 更新 Table 组件类型定义文件，添加 children 到 column

#### 🎉 1.18.0-beta.0 (2021-03-12)
- 【Feature】
  - Select ref 新增 method：clearInput 清空 Input 框、selectAll 全选、deselectAll 取消全选
  - Steps 组件改版，新增带连接线与导航类型 
  - Upload 组件支持 onRetry，onOpenFileDialog 与 onError 时返回原生 xhr 对象 
  - Tree 组件支持 leafOnly 属性
  - SideSheet 新增 keepDOM api
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
  - 新增葡萄牙语 - 巴西（pt-BR）语言包 
  - 新增支持 Descriptions JSX 写法 
- 【Fix】
  - 修复 Table rowSelection 受控模式下 resizable 使用有问题 
  - 修复 Input suffix icon 与 clear icon 重叠问题 
  - 修复 ArrayField 无法 remove 的问题，受影响版本 1.16.0-beta - 1.16.3 
  - 修复 Tooltip 图标更新导致的样式问题 
  - 修复 Avatar 被 Dropdown、Popover 等组件包裹时无法正确展示浮层的问题 
  - 修复 Tabs 在 children 为空的 case 下报错的问题 
- 【Style】
  - Navigation 新增 press 状态，选中 hover 等状态 
  - 修复 Table 设置 bordered 属性后，在无数据情况下缺少右边框问题 
  - 移除 TimePicker 在俄罗斯语、泰语、土耳其语、越南语时的时分秒文本展示，即仅保留数字不保留单位
- 【Docs】
  - 修复文档 Input type 与类型定义文件不一致问题，type boolean => string，默认值 false => text

#### 🎉 1.16.0 (2021-02-20)
- 【Fix】
  - Timeline 组件，children 不合规时报错 
  - 修复 DatePicker 动态禁用日期报错 
  - 修复 1.16.0-beta 版本引入的 Radio mode=advanced 模式不可用的问题 
- 【Style】
  - 修复 Modal 没有 title 但有 header 时的样式 
- 【Chore】
  - 锁定 svgo 版本（v1.2.2）、svgo-loader 版本

#### 🎉 1.16.0-beta.0 (2021-02-05)
- 【Feature】
  - Select onExceed 增加 Option 作为入参 
  - Dropdown 新增 icon、iconType API，更便捷地配置图标 
  - Radio 新增 addonStyle、addonClassName 
  - DatePicker 新增 onClear API，点击清除按钮时触发此回调
  - AutoComplete 新增 emptyContent 与 autoFocus API 
  - Modal 新增 afterClose 回调，在动画结束后执行
  - Timeline 新增 dataSource API，支持以数组形式传入 
  - Cascader 支持 onChangeWithObject 
  - Breadcrumb.Item 
    - 支持设置 noLink 去除 hover 和 active 的效果 
    - 支持设置子级的 separator 覆盖父级
- 【Fix】
  - 修复 Select 开启虚拟化后，需要点击两次才能选中 Option 的问题 
  - 修复 v1.15 版本 Form.Upload 的受控场景下传入 fileList 为 undefined 报错情况
  - 修复 Modal closeOnEsc 必须获取焦点才能退出的问题 
  - 修复 多个 Tabs 情景滚动时，目标 tabs 不正确的问题
  - Table 
    - 修复 sortOrder 失效以及 dataSource 更新后排序失效问题 
    - 修复虚拟化列表在无固定列时表头无法与列对齐问题 
  - DatePicker
    - 修复 minuteStep 步长较大时第二个时间选择器无法使用问题 
    - 修复 needConfirm 不能使用输入框更改选中日期问题 
- 【Perf】
  - Cascader/TreeSelect/Tree单选 点击已选项始终触发 onSelect  
- 【Style】
  - 修复 Slider 点击按钮时 border 会向下偏移 1px 以及 box-shadow 不正确问题 
  - 修正 Cascader 在 RTL 时 insetLabel 间距不正确的问题
  - Modal 优化没有 title 时的样式 
- 【Chore】
  - Cascader Data.value PropTypes 的校验对齐 d.ts 声明 
  - 更新 DateInput / Cascader 类型声明，补充回调函数的入参
  - 修复 BaseForm autoScrollToError 类型报错问题
#### 🎉 1.15.0 (2021-01-29)

- 【Fix】
    - AutoComplete 在失焦情况下自动展开后选项 
    - Upload 组件受控模式未按照 fileList 渲染 
    - 修复 Tree 树形组件，onLoad 和搜索一起使用时，展开逻辑的问题  
    - 修复 Select autoFocus 时，直接点击外部失焦未触发 onBlur 事件的问题 
    - 修复 Table 函数式组件 rowSelection 在使用字面量方式时选择失效问题 
- 【Style】
    - 解决 Form.Section 未引用 CSS 变量，在暗色模式下显示不正常的问题
    - Description 增加显式 line-height 声明，防止父级设置了 line-height 时被继承
- 【Chore】
    - 更新 Form autoScrollToError 类型定义，补充 object 类型

#### 🎉 1.15.0-beta.0 (2021-01-24)

- 【Feat】
    - Cascader 级联菜单`onListScroll`监听功能实现，以实现下拉分页等 
    - Form Field 组件 props 增加`fieldStyle`，允许定义整个 field 区块的内联样式 
    - Select、Cascader、TreeSelect 增加`arrowIcon` API，允许自定义右侧下拉箭头 Icon 
    - 对齐具有`triggerRender` API 的各组件（AutoComplete、Cascader、DatePicker、Select、TimePicker、TreeSelect）入参 
- 【Fix】
  - 修复 Form 在使用 wrapperCol、labelCol 时，声明 labelAlign 无效的问题 
  - 修复 Form submit/getValues/validate时，数组路径下的纯数字field如果超出了JS数组边界，获取的values中，key会被清掉的问题 
  - 修复 DatePicker 可以通过 Input 框选中禁用日期的问题
  - 修复 TreeSelect 在 treeData 是空数组，value 是[""]的时报错 
  - 修复 Tabs 在 type='button'/'card'模式下，extra 内容与 tabs-bar 未在垂直方向对齐的问题 
  - 修复 Tabs 动画结束后依然保留有 transform 属性，导致在某些场景子级元素下 z-index 失效的问题 
- 【Style】
  - **Body font-family 增加`Inter`字体作为优先选项** 
  - **Modal 默认增加边框阴影样式** 
  - **表单中各类 Radio、Checkbox 与 Form Label 间距调整** 
  - Tabs 去除在 type='line'时，第一个 Tab bar 的 padding-left（4px=>0px），更便于与其他 Title 级别元素实现左对齐 
- 【Docs】
  - Table 组件新增 📚 Semi Table FAQ & 自查手册
  - 增加 Typography.Title 支持省略的 Tooltip 内容自定义的示例 
- 【Chore】
  - 更新 Typography dts，extends HTMLParagraphElement、HTMLSpanElement、HTMLHeadingElement 相关属性 

#### 🎉 1.14.0 (2021-01-15)

- 【Fix】
  - 修复火狐浏览器下 Empty 组件的插画未居中的问题 
  - 修复 classnames 包没有声明在组件库包的依赖 (dep & devDep & peerDep) 中的问题
  - 修复 Tooltip 的 autoAdjustOverflow 定位问题 
- 【Docs】
  - Modal 文档增加 content 这个 api 的说明 
  - 补充关于 create-react-app 创建工程接入 Semi 的说明文档

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
    - 新增若干 icon，详见 Icon 文档
-   【Fix】
    - 修复 Anchor 在 SSR 场景下 anchorID 失效导致当前 Link 没有高亮显示问题
    - 修复 Tree 的 doubleClick 事件失效的问题
    - 修复 Upload 如果 file 不在 fileList 报错的问题
    - 修复 Tabs 使用单个 TabPane 和 keepDOM=\{false\} 的情况下报错的问题
- 【Style】
    - Tooltip 文本颜色及浮层颜色修改，以更好地适配暗色模式
    - Checkbox 对 checked checkbox 增加相应的 className
- 【Chore】
    - 更新 Checkbox dts，完善 onChange 入参 e 的类型
    - 更新 DatePicker dts，增加 spacing
- 【Docs】
    - DatePicker 新增关闭时间列表无限循环示例

#### 🎉 1.12.0 (2020-12-18)

-   【Fix】
    - 修复 Cascader Trigger 控制台抛 value required 的 warning
    - 修复 BreadCrumbItem 的 PropTypes 校验异常问题
    - 修复 Tree 组件 doubleClick 无效的问题

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
        -   ref 新增 focus() 方法 
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
    -   修复 Table columns.onCell 报错，提示 can't get style of undefined 
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
    -   Tree，TreeSelect 支持 renderFullLabel，可以满足 label 各种高度定制化的渲染需求，如父级节点与子级节点勾选逻辑分离 
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
    -   修复 Slider marks 不包括边界值问题，修复 Slider vertical-align baseline 导致的高度问题 
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
        -   增加头像截断功能，新增 overlapFrom，maxCount，renderMore API 
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
    -   修复 Tree 组件 label 中的所有 icon 都会加上右 margin 的 CSS 选择器的样式问题
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
    -   修复 sass-loader 9.x Scss 变量未字符串化的 warning 

#### 🎉 1.2.2 (2020-07-26)

-   【Perf】
    -   优化 `Icon` 中的 svg 动画为 CSS 动画，修复当页面引入有 svg 动画的 `Icon` 或者全量引入（默认）时页面不断重绘的问题。如有单独使用 loading `Icon` 的需要添加 CSS 动画
    -   `OverflowList` 不再对渲染函数的更新做状态重置，如需重置可以通过更新 key 刷新组件
    -   优化 `Typography` ellipsis 模式下文本动态更新时进行状态重置
-   【Fix】
    -   修复 `Button` height CSS 被移除，导致父级为 `display:flex` 时，高度不对的问题
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
    -   优化 withField HOC 的 displayName，方便在 React devtool 中定位相关元素 
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
        -   `type` 属性的 default 改为 info，默认值为 info
        -   新增：`fullMode`, `title`, `description`, `icon`, `closeIcon`, `bordered`
-   【Feat】
    -   Avatar
        -   `size` 新增尺寸：extra-extra-small 20px，原 small 尺寸大小调整为 24px
    -   Calendar
        -   Event Object 要求必传 `key` 来控制事件的更新与重绘 
        -   新增：`dateGridRender` 允许自定义单元格/列内容及样式 
    -   Collapsible
        -   新增：`collapseHeight` 支持自定义折叠后的高度
    -   Empty
        -   新增：`title`
        -   原 `description` 样式调整为 14px 号字体，次级字体色
    -   Form
        -   Form Props 增加 `showValidateIcon` ，错误信息前自动展示红色 X icon，默认为 true
        -   Form 增加 Form.Upload 模块
        -   Form 增加 Form.Section 模块，用于在布局上对 Fields 进行快速分组
        -   Field Props 增加
            -   `helpText` 放置提示信息（与校验结果共用同一区块展示，两者均有值时，优先展示校验结果）
            -   `extraText` 用于放置额外的提示信息，常显且不会被校验结果覆盖
        -   错误信息支持 ReactNode（0.x 版本中在 validate 或者 rules 中 return ReactNode 会被认为校验通过，1.0 版本后返回 ReactNode 会与返回 string 一样，被视为校验失败）
    -   InputNumber
        -   新增：`hideButtons`用于控制隐藏“增/减”按钮，**废弃原先的 suffix={null} 的方式**。
    -   List
        -   新增：`onRightClick` ，`onClick` 响应相应的鼠标事件 
    -   Modal
        -   新增 `closeOnEsc` 支持通过键盘 Esc 来关闭弹窗，增加 `closeIcon` 支持自定义的关闭按钮
        -   新增 `size` 支持 small, medium, large 及 full-width
    -   SideSheet
        -   新增：`headerStyle`, `afterVisibleChange`, `closeOnEsc`
    -   Spin
        -   新增：`childStyle`
    -   Table
        -   新增 `"middle"`，`"small"` 两种信息密度
    -   Tabs
        -   新增 `keepDOM` ，支持 jsx 的写法中销毁非 active 的面板 
        -   新增 `tabPosition` 支持 tab 在顶部或者左侧 ('left', 'top'),
        -   新增 `lazyRender` 支持 tabPane 的懒加载 
    -   Toast / Notification
        -   新增：`theme` ('light', 'normal') 支持带背景色的通知消息
    -   Tree
        -   新增 `loadData`, `loadedKeys`, `isLeaf` 支持动态加载数据
        -   新增：`onChangeWithObject` 支持返回带有节点信息的 object 为 onChange 的入参
        -   `searchRender` 支持传入 false 来隐藏搜索框
    -   TreeSelect
        -   新增：`onChangeWithObject` 支持返回带有节点信息的 object 为 onChange 的入参
        -   新增：`showClear` 支持清空选项
    -   Typography
        -   copyable 配置新增 `copyTip`，支持自定义 tooltip 内的提示复制文案
    -   Progress
        -   新增：`orbitStroke` 允许自定义轨道颜色
    -   Skeleton
        -   Skeleton.Avatar 新增：`size`，支持 Avatar 组件的相应尺寸 
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
        -   照片墙模式下，上传文件数达到 `limit` 时，自动隐藏 + Trigger
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
        -   **图标按钮默认主题与按钮主题保持一致 (theme="light")**
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
        -   传入自定义 ReactNode 时不会有 padding，只有 String、Icon 时有自带的 padding
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
        -   调整 RadioGroup（horizontal / vertical）中 Radio 的 margin-right / margin-bottom: 16px => 12px，移除 last-of-type 的 margin-right / margin-bottom
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
    -   解决 Table 固定列 + 虚拟化横向滚动轴无法复位的问题 
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
        -   expandAction，支持 false, click, doubleClick 的展开逻辑 
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
    -   修复 `Form` 使用数组型 fieldPath（eg：panels[11]].start）时，校验后再修改值，errors 信息匹配不上的问题 
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
        -   `TreeSelect` 将在 1.0 版本移除 valueInArray，推荐通过 onChange 获取相关节点属性
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
        -   间距调整，首行左边距改为 8px，缩进改为 20px，文本和图标间距改为 8px
    -   修改`Tooltip`的 border radius 为 6px
-   【Docs】
    -   补充 AutoComplete 文档

#### 0.25.0 (2019-11-15)

-   【Feat】
    -   `Table` 组件分页功能非受控条件下支持传入自定义的 `total` 
    -   `Collapse`, `Collapsible` 支持 keepDOM，隐藏时不销毁 DOM 节点 
    -   `Toast`，`Notification` 支持全局配置出现位置 (top, bottom, left, right)、时长 duration 
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
    -  Semi 全局变量更新
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
    -  Semi 增加全局字体 font-family 的声明
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
    -  `Select`optionLabelProp 为 value，且受控时，已选项渲染错误问题
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
    -  🎉🎉 Semi 支持暗色模式 🎉🎉
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
    -  修复`TreeSelect`多选模式下选中项标签乱序，受控时下拉菜单折叠后仍会自动展开的问题
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

