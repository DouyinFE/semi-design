---
category: 开始
title: Update 从 1.x 到 2.0
icon: doc-updateV2
localeCode: zh-CN
order: 6
---

## 开始升级

### 升级准备
请将你当前所有已修改的代码提交，checkout 出单独的 git 分支，保证 git 工作区干净

### 安装 Semi 2.0

```bash
npm i @douyinfe/semi-ui@2.0.0
```

### 修改代码

请按照下方变更记录修改你的项目代码，Semi 将在 1 ~ 2周内推出迁移工具，帮助用户从 1.x 迁移至 2.x。

## 2.0 有哪些不兼容的变化

### 🎁 包名的调整

v2.0 Semi 正式开源发布至公网 npm，包名需要调整，去除原有的 `@ies` 前缀，更新为 `@douyinfe` 前缀。

### 🔍 import 路径变化

#### 引入组件

```jsx
// before
import { Select, Input, Form } from '@ies/semi-ui-react';

// after
import { Select, Input, Form } from '@douyinfe/semi-ui';
```


#### 引入 interface（TypeScript项目）

```jsx
// before
import { SelectProps } from '@ies/semi-ui/select' 

// now
import { SelectProps } from '@douyinfe/semi-ui/lib/es/select'
```

#### 引入 locale 资源文件

```jsx
// before
import en_GB from '@ies/semi-ui/locale/source/en_GB'

// now
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB'
```

### 🛠 API 相关的调整
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

### 🎨 样式上的不兼容

- CSS 变量添加 semi 前缀，例如 --color-primary => --semi-color-primary
  - 使用了 Semi CSS Variable 来实现暗色模式等特性的用户，需要将自定义 CSS 中的 variable 统一进行更新
  - 未在自定义组件或页面的中使用 Semi CSS Variable 的用户无需关注，不受影响
- 在 2.x，统一将插画的宽高设置为 `200 * 200px`，如果想模拟 1.x 的宽高，可以给插画设置 `style={{ width: 300, height: 150 }}`。

### 插件调整
如果你使用 Semi 插件，如 `@ies/semi-ui-plugin-webpack` 或 `@ies/semi-ui-plugin-eden` 等进行了高级配置，需要了解以下变更：

- svg 相关
  - 2.x 不再支持 iconLazyLoad、svgPaths、srcSvgPaths 配置；
- 暗色模式相关
  - 2.x 默认已支持局部暗色模式、亮色模式，不再需要在插件配置 themeScope 属性。使用方式由添加 id #semi-always-xxx 更新为添加 class .semi-always-xxx。
### 其他调整

#### Icon/插画使用调整

在 0.x/1.x 版本的 Semi 中，我们强依赖 svg-sprite-loader 将 svg 文件转换为 svg symbol 并在运行时插入 body，使得我们可以仅通过 <Icon type='xxx' / > 以字符串的方式去使用Icon图标。在便捷使用的同时，也带来了一些问题：icon 默认全量引入，无法被 shaking；svg-sprite-loader 与Webpack 强绑定，无法便捷地支持 Rollup、Vite、Snowpack 等其他构建方案。因此 2.0 中，我们去除了与 svg-sprite-loader 的强绑定，Icon 的消费方式需要变更：

Icon 使用调整：
```jsx
// 1.x 默认 iconLazyload 为 false 的情况
<Icon type="home" />

// 1.x 当 iconLazyload 为 true 的情况
import homeSvg from '@ies/semi-icons/semi-icons-home.svg';
<Icon type={homeSvg.id} />

// 2.x 统一使用如下方式使用
import { IconHome } from '@douyinfe/semi-icons';
<IconHome />
```

插画使用调整：

```jsx
// 1.x
import { Empty } from '@ies/semi-ui';
import Construction from '@ies/semi-illustrations/construction.svg';
<Empty image={Construction} />

// 2.x
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationConstruction } from '@douyinfe/semi-illustrations';
<Empty image={<IllustrationConstruction />} />
```

#### Design Token 调整

| 组件       | Sass 变量                                      | 调整前                     | 调整后                          |
| ---------- | ----------------------------------------------- | -------------------------- | ------------------------------- |
| Popconfirm | $color-popconfirm_body-text                     | var(--semi-color-tertiary) | var(--semi-color-text-2)        |
|            | $color-popconfirm_header_alert-icon             | #fa7500                    | var(--semi-color-warning)       |
| Progress   | $spacing-progress_line_text-marginLeft          | 15px                       | $spacing-base                   |
|            | $spacing-progress_line_text-marginRight         | 15px                       | $spacing-base                   |
| Radio      | $spacing-radio_addon_buttonRadio_large-paddingY | 6px                        | $spacing-base-tight / 2         |
|            | $radius-radio_cardRadioGroup                    | 3px                        | var(--semi-border-radius-small) |

## FAQ
### 为什么引用路径发生了变化？
在 1.x 中，Semi 采用源码发布的方式，执行 npm publish 前不会执行预编译，组件库的 scss、jsx/js 会跟随业务代码一同进行编译，2.0 中 npm publish前进行了预编译，对于普通用户来说，预编译可以让 Semi 做到开箱即用：无需让用户编译 Semi 源文件，无需在使用时引入 Semi 插件。由于编译后的结果在 lib/es 下，因此接口和语言包的引用路径发生了变化，但对于组件引用，你无需改变原有的引用路径（因为 package.json main 属性指向 lib/es/index.js）。
### 项目希望升级至 2.0，但项目中使用了 Semi 物料，物料基于 1.x Semi，是否可同时使用？
由于Semi 2.0的包名与1.x并不相同，所以实际上他们会成了两个单独的包，互不影响。

### CSS 变量添加 semi 前缀的原因？
由于业务方微前端应用场景日渐增多，为避免与其他library css variable的命名冲突，规避样式互相影响问题。

### 为什么局部暗色/亮色模式由添加 id 改为添加 class？
id 具有语义上全局唯一的特点，class 则没有这个特点，使用 class 更符合规范。

### 为什么插画的尺寸有变化？
使用插画时，1.x 的插画宽高是 `300 * 150px`，是由于插画 svg 外层嵌套 svg 导致，这一状况导致，原有的插画左右多了空白，不太符合预期。

## 遇到问题
我们列出了已知的所有不兼容变化和相关影响，但是有可能还是有一些场景我们没有考虑到。如果你在升级过程中遇到了问题，欢迎随时通过客服群进行反馈沟通