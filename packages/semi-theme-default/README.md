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

## 自定义主题包约定（重要）

**只有默认主题包（semi-theme-default）的 css 带 `body` / `:host` 选择器**（提供全页零配置默认值）。

自定义主题包（DSM 导出或自行生成）的 css **只挂 `.semi-theme-<主题名>` 容器类，绝不能带 `body` / `:host` 选择器**——否则业务方局部引入主题时，`body` 上的变量定义会**覆盖全局默认主题**（污染整个页面）。

```css
/* ✅ 自定义主题包正确写法：只挂容器类 */
.semi-theme-brand { --semi-color-primary: #ff4d4f; --semi-color-primary-hover: #e64545; }
/* ❌ 错误写法：body 选择器会污染全页 */
body { --semi-color-primary: #ff4d4f; }
```

**业务方使用自定义主题包**：容器同时加 `.semi-theme`（挂载完整变量链）与主题容器类：

```html
<div class="semi-theme semi-theme-brand"><!-- 该区域使用自定义主题 --></div>
```

生成自定义主题包时使用 `--scope` 参数（生成工具支持）：`node generateTokens.js --scope brand`，产物选择器为 `.semi-theme-brand`（不含 body/:host）。

## 与 Tailwind 搭配

使用 `css/layer.css` 入口将主题归入 `semi` 层，详见 [Tailwind 搭配文档](https://semi.design/zh-CN/start/ecosystem)。

## License

MIT
