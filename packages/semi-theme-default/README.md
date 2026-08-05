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

## 与 Tailwind 搭配

使用 `css/layer.css` 入口将主题归入 `semi` 层，详见 [Tailwind 搭配文档](https://semi.design/zh-CN/start/ecosystem)。

## License

MIT
