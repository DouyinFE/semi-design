> The default theme package of Semi Design.

By default, the theme package will be automatically installed as dependence of `@douyinfe/semi-foundation`.

You can make a custom theme through [Semi Design System](https://semi.design/dsm).

## Directory Structure

```
├── package.json
├── css
│   ├── token.css        // Design Token（--semi-cssvar-*，3997 个，定义在 body 与 .semi-theme 容器）
│   ├── global.css       // 全局色板与语义色板（--semi-color-* 等，含亮/暗两套，定义在 body / .semi-always-light / .semi-always-dark / .semi-theme 容器）
│   ├── animation.css    // 动效变量（transition 时长/函数/延迟）
│   └── layer.css        // Tailwind 等原子类库搭配入口：@import 三文件 layer(semi)
```

## 主题变量与作用域

主题变量（`--semi-cssvar-*` / `--semi-color-*`）定义在 **`body`（零配置全页生效）** 与 **`.semi-theme` 容器（任意 scope div 生效）** 上：

```html
<!-- 全页默认：无需任何配置 -->
<button class="semi-button semi-button-primary">默认主题</button>

<!-- 任意容器内生效：容器加 .semi-theme 类 -->
<div class="semi-theme">
    <button class="semi-button semi-button-primary">容器内主题</button>
</div>

<!-- 局部暗色：容器加 .semi-theme.semi-always-dark -->
<div class="semi-theme semi-always-dark">
    <button class="semi-button semi-button-primary">暗色容器</button>
</div>
```

- 业务方在任意 scope div 上覆盖变量即可实现局部换主题（无需重新编译）：

```css
.theme-a { --semi-cssvar-color-primary: #ff4d4f; --semi-color-primary: #ff4d4f; }
```

```html
<div class="semi-theme theme-a"><!-- 该区域组件使用红色主色 --></div>
```

- 多主题分区互不干扰：不同容器覆盖不同变量，嵌套容器内层覆盖外层。
- 暗色容器（`.semi-always-dark` / `theme-mode="dark"`）内同时提供暗色 cssvar，组件 `var(--semi-cssvar-*)` 引用在容器内解析为暗色值。

## 主题优先级与 body 占位语义

**默认主题包（semi-theme-default）的全局变量定义在 `html body`（特异性 0,0,2）**——高于普通 `body`（0,0,1）规则：

- 业务方在**局部容器**（`.semi-theme` 或自定义类）内覆盖变量不受影响（类选择器 0,1,0 及以上 > 0,0,2）
- 业务方若想**全局覆盖**默认主题变量，需使用 `html body { --x: v }`、`body { --x: v !important }` 或容器类（旧写法 `body { --x: v }` 因特异性低于默认主题而失效）

## 自定义主题包约定（重要）

自定义主题包（DSM 导出或 `node generateTokens.js --scope <name>` 生成）的 css 挂 **`body`（兜底版）+ `.semi-theme-<主题名>`（容器版）** 双选择器，不带 `:host`：

```css
/* 自定义主题包产物结构（--scope brand）*/
body { --semi-color-primary: #ff4d4f; }               /* 兜底版：仅当 body 上没有其他主题时生效 */
.semi-theme-brand { --semi-color-primary: #ff4d4f; }  /* 容器版：任意容器加类即生效 */
```

**body 占位语义**：由于默认主题的全局变量定义在 `html body`（0,0,2），自定义主题的 `body` 兜底版（0,0,1）在**默认主题已挂载时自动失效**（不会覆盖全页默认主题）；当业务方**不引入默认主题**、单独使用自定义主题时，兜底版生效（全页使用自定义主题）。因此：

- 同时引入默认主题 + 自定义主题 → 全页保持默认，自定义主题只在其容器内生效（不污染）
- 只引入自定义主题 → 全页使用自定义主题
- 多个自定义主题的兜底版同时存在时，后加载者生效（同一时刻 body 上只应挂一个全局主题；多主题分区请使用容器版）

**业务方使用自定义主题包**：容器加 `.semi-theme`（挂载完整变量链）与主题容器类：

```html
<div class="semi-theme semi-theme-brand"><!-- 该区域使用自定义主题 --></div>
```

## 与 Tailwind 搭配

使用 `css/layer.css` 入口将主题归入 `semi` 层，详见 [Tailwind 搭配文档](https://semi.design/zh-CN/start/ecosystem)。

## License

MIT
