---
category: Getting Started
title:  From 1.x to 2.0
icon: doc-updateV2
localeCode: en-US
order: 6
---

## Start upgrade

### Upgrade preparation
Please submit all your currently modified code and checkout a separate git branch to ensure that the git workspace is clean

### Install Semi 2.0

```bash
npm i @douyinfe/semi-ui@2.0.0
```

### Modify code

Please follow the change record below to modify your project code. Semi will launch a migration tool within 1 to 2 weeks to help users migrate from 1.x to 2.x.

## What are the incompatible changes in 2.0

### 🎁 Package name adjustment

v2.0 Semi is officially released to the public network npm, the package name needs to be adjusted, the original `@ies` prefix is removed, and the `@douyinfe` prefix is used.

### 🔍 Import path change

#### Import components

```jsx
// before
import { Select, Input, Form } from '@ies/semi-ui';

// now
import { Select, Input, Form } from '@douyinfe/semi-ui';
```

#### Import interface（TypeScript project）

```jsx
// before
import { SelectProps } from '@ies/semi-ui/select' 

// now
import { SelectProps } from '@douyinfe/semi-ui/lib/es/select'
```

#### Import locale language packages

```jsx
// before
import en_GB from '@ies/semi-ui/locale/source/en_GB'

// now
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB'
```

### 🛠 API related adjustments
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

### 🎨 Style incompatibility

- CSS variable with semi prefix, for example --color-primary = > --semi-color-primary
  - Users who use Semi CSS Variable to implement features such as dark mode need to update the variables in custom CSS uniformly
  - Users who do not use Semi CSS Variable in custom components or pages need not pay attention and are not affected
- In 2.x, the unified set the width and height of the illustration to `200 * 200px`. If you want to simulate the width and height of 1.x, you can set style = {{width: 300, height: 150}} to the illustration.
### Plugin adjustment
If you use Semi plug-ins, such as `@ies/semi-ui-plugin-webpack` or `@ies/semi-ui-plugin-eden` etc. to achieve some advanced configuration, you need to understand the following changes:

- Svg related
  - The iconLazyLoad, svgPaths, srcSvgPaths configurations are no longer supported.
- Dark mode related
  - Local dark mode and bright mode no longer need to configure themeScope attributes in the plug-in, and the default is built-in. The usage method is updated from adding id #semi-ways-xxx to adding class .semi-ways-xxx.
### Other adjustments

#### Icon/Illustration use adjustment

In the 0.x/1.x version of Semi, we strongly rely on svg-sprite-loader to convert svg files to svg symbols and insert body at runtime, so that we can use Icon icons only through < Icon type = 'xxx'/> in the form of string. While convenient to use, it also brings some problems: icon is introduced in full by default and cannot be shaken; svg-sprite-loader is strongly bound to Webpack and cannot easily support Rollup, Vite, Snowpack and other construction schemes. Therefore, in 2.0, we removed the strong binding with svg-sprite-loader, and the consumption mode of Icon needs to be changed:
Icon usage adjustment:

```jsx
// 1.x default iconLazyload is false
<Icon type="home" />

// 1.x when iconLazyload is true
import homeSvg from '@ies/semi-icons/semi-icons-home.svg';
<Icon type={homeSvg.id} />

// 2.x use the following methods uniformly
import { IconHome } from '@douyinfe/semi-icons';
<IconHome />
```

Illustration Adjustment:

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

#### Design Token adjustment

| Component  | Sass Variable                                   | Before                     | After                           |
| ---------- | ----------------------------------------------- | -------------------------- | ------------------------------- |
| Popconfirm | $color-popconfirm_body-text                     | var(--semi-color-tertiary) | var(--semi-color-text-2)        |
|            | $color-popconfirm_header_alert-icon             | #fa7500                    | var(--semi-color-warning)       |
| Progress   | $spacing-progress_line_text-marginLeft          | 15px                       | $spacing-base                   |
|            | $spacing-progress_line_text-marginRight         | 15px                       | $spacing-base                   |
| Radio      | $spacing-radio_addon_buttonRadio_large-paddingY | 6px                        | $spacing-base-tight / 2         |
|            | $radius-radio_cardRadioGroup                    | 3px                        | var(--semi-border-radius-small) |


## FAQ

### Why has the reference path changed?
In 1.x, Semi uses source code publishing. It will not perform precompilation before performing npm publishing. The scss and jsx/js of the component library will be compiled together with the business code. In 2.0, precompilation was performed before npm publishing. For ordinary users, precompilation can make Semi work out of the box: there is no need for users to compile Semi source files, and there is no need to introduce Semi plug-ins when using them. Since the compiled results are under lib/es, the reference path of the interface and language package has changed, but for component references, you do not need to change the original reference path (because package.json main attribute points to lib/es/index.js).

### The project wants to upgrade to 2.0, but the Semi material is used in the project. The material is based on 1.x Semi. Can it be used at the same time?
Since Semi 2.0 does not have the same package name as 1.x, they will actually be two separate packages that do not affect each other.

### Why do CSS variables add semi prefixes?
Due to the increasing number of business micro front-end application scenarios, in order to avoid naming conflicts with other library css variables and avoid the problem of mutual influence of styles.

### Why is the local dark/bright mode changed from add id to add class?
ID is semantically globally unique, while class does not. Using class is more in line with the specification.

### Why has the size of the illustration changed?
When using illustrations, the width and height of the illustration of 1.x is `300 * 150px`, which is caused by the nesting of the outer layer of the illustration svg. This situation leads to more white space left and right in the original illustration, which is not quite in line with expectations. 

### Encounter problems

We list all known incompatible changes and related impacts, but there may be some scenarios that we have not considered. If you encounter problems during the upgrade process, please feel free to communicate through the customer service group
