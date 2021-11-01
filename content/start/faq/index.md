---
category: 开始
title:  FAQ 常见问题
icon: doc-faq
localeCode: zh-CN
order: 7
---



#### 关于发版时间

-   Semi 团队每双周周五进行 minor 正式版发包，中间的周五会发布一次 minor beta 版

#### 各版本之间的关系
-   Semi 版本号遵循Semver规范（主版本号-次版本号-修订版本号），我们会在minor版本新增feature或组件，在patch版本我们仅会进行bug修复，而不会做新功能更新。
-   2.x 各版本之间（即major版本号相同时），API 会保持**向前兼容**，但不同minor版本之间可能存在样式上的调整，当你需要升级时，我们推荐你在changelog页面使用版本Diff功能，检查所有变更并确实是否对你的业务系统有影响。

#### Semi是否支持Tree Shaking
-  Semi执行发包时，发布的其实是esModule源码，因此天然支持tree shaking，不需要再进行额外的配置。
 -  组件的 Scss 也是由组件的index.(j|t)sx负责import的，因此样式也会shaking。简单来说，只有你使用的组件会被打包

#### 为什么 defaultValue、defaultXXX 不起作用？

Semi 组件中，所有的 defaultValue、defaultXXX 传参只会在组件被 mounted 时进行消费（即仅消费一次）。如果你的 defaultXXX 属性是后期进行异步更新的，组件不会重新进行消费该值。如有需要，你应该使用受控的 value，受控的 xxx。
或者直接通过传入一个不一样的`key`值，强制 React 重新挂载该组件。

#### 安装新版本 Semi 后，提示 can't resolve date-fns/esm/_libs/cloneObject.js 或其他有 date-fns 相关的依赖错误

检查下项目中的 package-lock.json，是否有其他包依赖了 date-fns（大概率是 1.x 的），导致 semi 依赖声明的 date-fns 2.x 没有被安装上。手动 install date-fns，确保是 2.x 版本的即可
`npm install date-fns date-fns-tz`

#### Semi 支持 i18n 吗？

Semi 目前支持 14 种语言，具体使用可以查阅 [Semi·LocaleProvider](/zh-CN/other/locale)

#### Semi 的样式是基于 Scss 还是 Less ？为什么不用 CSS Module？

我们的样式基于 Scss，与此我们还使用了 CSS Variable 作为色盘变量。色盘变量和通用变量挂载在 body 下。
不使用 CSS Module 是因为我们希望有固定的 className，为业务方保留修改/覆盖 Semi 样式的能力（虽然不提倡，但有些业务场景下确实需要）

#### Semi 的默认的主题风格跟我们系统的定位不符，可以配置另外的主题吗？

具体请参考 [定制主题](/zh-CN/start/customize-theme) 。在我们的 [主题管理平台](/dsm) 里可以进行样式的配置，你只需要在 webpack.config.js 里指定使用的主题包名即可完成接入（需接入 Semi 插件）。

#### 为什么 Tooltip、Typography 不默认配置 word-break 样式？

不同语言内容（纯英文、中文、中英文混合）对 word-break 的需求不太一致，所以组件层没有做这个预设。可以根据需求，使用 CSS 进行设置。

#### 有新组件需求、或者现有组件 Feature 不能满足我的业务需求，该找谁？

右上角问题反馈，提交 Issue，描述你的需求以及业务场景，Label 选择 `Feature Request` / `New Component Request`

#### 对组件的使用有疑惑？不知道有没有能满足你业务需求场景的组件？

欢迎进我们的 [客服飞书 Lark 群](https://bytedance.feishu.cn/docs/doccnw93Dujm3UCkHRDTMTm1qwe) 进行咨询提问。

#### 希望自定义滚动条的样式？
可以使用 `.semi-light-scrollbar` 类名，会对 webkit (chrome/safari) 的浏览器应用 Semi 的滚动条样式。该类名放在最外层的DOM元素即可，会对所有子元素生效。注：使用了通配符，可能会对性能有影响。其他浏览器可以参考是否有相关的css属性支持滚动条的样式定制。

#### 更多的FAQ
请查阅 https://bytedance.feishu.cn/docs/doccnMRDbkhde6p3dMokfFpcNug