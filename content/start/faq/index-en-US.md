---
category: Getting Started
title:  Frequently Asked Questions
subTitle: Frequently Asked Questions
icon: doc-faq
localeCode: en-US
order: 7
---



#### What is the relationship between Semi 2.x (open source version) and Semi 1.x?
 - The Semi v2.0 version is refactored based on v1.x using ts, which brings a better ts experience and a more out-of-the-box engineering solution, which solves the coexistence of multi-component libraries in the micro front-end scenario Style conflict issues, etc. All subsequent long-term work of the Semi team will be based on the v2.x version
 - At present, v2.0 and v1.x will still be maintained in parallel for a period of time. Feature addition on v1.x will be gradually stopped in the future, and only necessary bug fix changes will be provided.
 - For new projects, we recommend that you directly use 2.x [@douyin/semi-ui](https://semi.design) for development. For existing projects, we also recommend that you upgrade as soon as possible. In order to reduce the cost of upgrading, we provide a cli tool one-click migration (@ies/semi-codemod-v2) that can help you automatically complete up to 90% of the migration and modification (limited by the AST implementation principle, there are still a small number of cases that require manual labor review modification, but not much 😉)
 - Upgrade from Semi 1.x to Semi 2.x for detailed operation steps [From v1 to v2](https://semi.design/zh-CN/start/update-to-v2)

#### Relationship between versions

- The Semi version number follows the Semver specification (major version number-minor version number-revision number). We will add features or components to the minor version. In the patch version, we will only fix bugs and not update new features.
- Between 2.x versions (that is, when the major version number is the same), the API will remain **forward compatible**, but there may be style adjustments between different minor versions. When you need to upgrade, we recommend you Use the version Diff function on the changelog page to check all changes and whether they really affect your business system.

#### Why is defaultValue, default XXX not working?

Property like `defaultValue`, `defaultXXX` will only be consumed once when the component mount. If your `defaultXXX` property is updated asynchronously later, the component will not reconsume the value. If necessary, you should use controlled `value`, controlled `XXX`.
Or force React to remount the component by passing in a different `key`.

#### Does Semi support i18n?
As of 2021-10, Semi supports 14 languages. See [Semi·LocaleProvider](/en-US/other/locale) for details.

#### Who should I look for if there is a new component requirement, or an existing component Feature does not meet my business needs?

You can submit your issue to describe your needs. Issue Label Please select `Feature Request` / `New Component Request`. We will handle these needs with high quality.

#### Confused about the use of components? I wonder if there are components that can meet your business needs scenarios?

Welcome to ours [Customer Service Lark Group](https://bytedance.feishu.cn/docs/doccnw93Dujm3UCkHRDTMTm1qwe) For a consultation question.

#### Is the style of Semi based on Scss or Less? Why not use CSS Module?

Our style is based on Scss, and we also use CSS Variable as the color wheel variable. Color variables and common variables are mounted under `body`. CSS Module is not used because we want to have a fixed className and retain the ability to modify / override Semi style for our users(although it is not recommended, it is really needed sometime).

#### Semi's default theme style does not match the positioning of our system. Can i configure another theme?

Please refer to [Custom theme](/en-US/start/customize-theme) . In [Semi DSM](/dsm) You can configure the style. You only need to specify the theme package name in `webpack.config.js` to complete the access.

#### Why Tooltip、Typography does not set style word-break to all or word?  
   Content in difference languages (e.g. English, Chinese, combination of English and Chinese) may require different styles in terms of word-break, so Semi does not use a default setting. You could use corresponding CSS styles to your own needs.

#### More FAQ
Please refer to https://bytedance.feishu.cn/docs/doccnMRDbkhde6p3dMokfFpcNug