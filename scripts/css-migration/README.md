# Semi 样式 css 化迁移工具

把 semi-foundation 的 scss 源码转换为"嵌套 css 真源"，并用三向验证保证与 sass 编译产物语义等价。

## 工具

| 文件 | 作用 |
|---|---|
| `compileLegacy.js` | 复刻 gulpfile 的 sass 编译（注入 theme），产出旧产物基线 |
| `generateTokens.js` | 扫描 variables.scss → 生成 `semi-theme-default/css/token.css`（3991 个 `--semi-cssvar-*` 变量）+ 冲突检测 |
| `transformScss.js` | 核心转换器：scss → 嵌套 css（& 展开/mixin 内联/@for 展开/变量→token） |
| `sassEval.js` | sass 表达式求值服务（循环边界、条件、算术——"语义求值交给 sass"） |
| `diff.js` + `normalize.js` | 规范化 diff 验证器（:is 展开、颜色/简写/顺序归一、token 代入） |
| `verify.js` | 三向验证：旧产物 vs（真源 → token 代入 → postcss-nested 编译）逐规则 diff |

## 用法

```bash
# 生成 token.css（全量变量 + 冲突检测）
node generateTokens.js

# 转换 + 验证单个组件（零差异 = 通过）
node verify.js button
node verify.js tooltip

# 批量验证
for c in $(ls ../../packages/semi-foundation | grep -vE "node_modules|lib|README|package.json|tsconfig|getBabelConfig|gulpfile|scripts|_portal|_utils|keyframes|base"); do
  node verify.js $c 2>&1 | tail -1
done
```

## 现状

- **76/80 有样式组件三向验证零差异**（dragMove/icons/lottie/utils 无 scss）
- **阶段 2 完成：80 个 css 真源已落库**（78 组件主文件 + iconButton/textarea 独立子文件 + base + portal，子文件 rtl/variables 等已内联）
- 277 个 scss 文件已加 FROZEN 冻结标记（仅保留用于旧版构建链路兼容）
- token 命名规则：`$name` → `--semi-cssvar-<name>`（下划线/连字符原样保留）

## 阶段 3：构建链路

- **semi-foundation / semi-ui gulpfile**：新增 `compileCss` 任务（css 真源 → postcss-nested 编译 → lib/es + lib/cjs），scss 编译链路保留
- **semi-scss-compile**：新增 `compileCss`（css 真源 + token.css + global/animation 合并 → semi.css），规则集等价验证通过
- **主题包 css 产物**（semi-theme-default/css/）：`token.css`（3997 变量）+ `global.css` + `animation.css`（纯 css，css-loader 可直接处理）

## 阶段 4：打包插件（css 真源链路）

- **semi-webpack**：`semi-css-theme-loader`（注入 token/global/animation + prefixCls 文本替换）+ plugin 拦截 `lib/*.css`
- **semi-vite**：`transformSemiCssTheme` + load 时 css 直连（css 存在优先，回退 scss）
- **semi-rspack**：`semi-css-theme-loader` + `createCssThemeLoaderRule`

## 工具

```bash
# 批量转换并落库 css 真源（读冻结后的 scss，剔除冻结 banner）
node batchConvert.js

# 验证落库的 css 文件（读文件而非重新转换）
node verifyFiles.js            # 全部（78 零差异 + 4 无 scss）
node verifyFiles.js button     # 单个

# scss 冻结标记（幂等）
node freezeScss.js

# 生成主题包 css 产物（token.css + global.css + animation.css + 冲突检测）
node generateTokens.js

# 验证 semi.css 聚合产物（规则集等价 + 无残留）
node verifySemiCss.js
```

## 阶段 6：视觉回归（渲染级等价）

`visualDiff.js`：用 Chrome headless（puppeteer-core）对代表性组件 DOM 分别加载旧产物（sass 编译值版 + global/animation）和新产物（css 真源 + token.css + global/animation），逐元素对比 computed style（浏览器层叠求值结果）。

```bash
node visualDiff.js                        # 默认 5 个组件
node visualDiff.js button input grid ...  # 指定组件
```

**发现并修复的真 bug**：Chrome 不支持 `@media` 里的 `var()`——grid 的响应式断点（`@media (min-width: var(--semi-cssvar-width-grid_screen-md-min))`）在渲染时不生效。已修复：transformScss 对 @media params 做 token 编译期代入（静态值，与 sass 产物一致）。
