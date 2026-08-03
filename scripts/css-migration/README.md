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

- 75/80 有样式组件三向验证零差异（dragMove/icons/lottie/utils 无 scss）
- grid 已知边界：@for + mixin 参数链（`loop-grid-columns-rtl($index)` 实参为外层局部变量）未解决
- token 命名规则：`$name` → `--semi-cssvar-<name>`（下划线/连字符原样保留）
