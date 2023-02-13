---
category: 开始
title:  Design to Code 设计稿转代码
icon: doc-code
localeCode: zh-CN
order: 4
---

## 能力介绍

<div>
    <Row gutter={[20, 20]}>
        <Col span={8}>
            <FeatureCard title='基础 UI 还原' >
                支持 flex 布局、absolute 布局
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='Semi 组件识别' >
                已覆盖表单和表格场景 28+ 组件
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='支持输出不同技术栈代码' >
                支持 React + Scss、React + Tailwind 和 JSON Schema
            </FeatureCard>
        </Col>
    </Row>
    <Row gutter={[20, 20]}>
        <Col span={8}>
            <FeatureCard title='支持识别其他主题组件' >
                支持识别自定义主题后的组件
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='嵌套组件和自定义内容识别' >
                识别设计师修改后的内容，将其识别为 ReactNode
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='支持刷新组件圆角、间距' >
                即使 Figma 不支持这些 token，边框、圆角、内外边距、宽高、间距也支持刷新
            </FeatureCard>
        </Col>
    </Row>
</div>

## 使用说明

请直接移步 <a href="https://semi.design/code" target="_blank">semi.design/code</a>

![](https://lf3-files.qingfuwucdn.net/obj/inspirecloud-file/baas/tt38q7/82069cd816533f91_1676604095341.png)

## 使用场景

<div>
    <Row gutter={[20, 20]}>
        <Col span={8}>
            <FeatureCard title='基础页面转码' >
                将基础页面的布局进行还原，适合用于落地页开发
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='卡片转码' >
                一键将卡片进行还原，无需关心卡片布局
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='表格页转码' >
                利用 Semi Variants 搭建运营表格页面，D2C 帮助你自动识别表格列内容
            </FeatureCard>
        </Col>
    </Row>
    <Row gutter={[20, 20]}>
        <Col span={8}>
            <FeatureCard title='表单页转码' >
                利用 Semi Variants 搭建运营表单页，一键将 Semi Form 表单进行还原
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='消费中间产物' >
                自定义消费 JSON Schema，创建适合你项目的模板代码
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard />
        </Col>
    </Row>
</div>

## 使用示例

这里是 Figma 示例设计稿及其对应的使用 Semi Figma 插件转译后的代码 Codesandbox 链接。  

| 截图 & Figma URL                                                                                                                                                                                                                                                                                                                               | 类型                                | 说明                                                | Codesandbox                                                                                  |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=5%3A2092' target="_blank" rel="noreferrer noopener"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/simple-demo-1.jpg' style={{ width:  400 }} /></a>                                               | 不含组件，内容较简单的模块           | 可用于快速还原布局及内容                            | <a href='https://codesandbox.io/s/w1z9yx' target="_blank" rel="noreferrer noopener">Link</a> |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=1%3A275' target="_blank" rel="noreferrer noopener"><img src='https://lf3-files.qingfuwucdn.net/obj/inspirecloud-file/baas/tt38q7/2468f1c4f1756bc0_1676603194364.png' style={{ width:  400 }} /></a>                                                  | 不含组件，内容较多或布局稍复杂的模块 | 可用于快速还原布局及内容                            | <a href='https://codesandbox.io/s/905ncn' target="_blank" rel="noreferrer noopener">Link</a> |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo%EF%BC%88Figma-Community%EF%BC%89?node-id=419%3A90854&t=PMnGQ3VQIoGQZZPl-4' target="_blank"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/semi-code-site/Simple Form.png' style={{ width:  400 }}/></a>    | 含 Semi 表单组件的模块              | 可用于快速还原布局及内容，并识别出 Semi 组件的 Props | <a href='https://codesandbox.io/s/nzsf0j' target="_blank">Link</a>                           |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo%EF%BC%88Figma-Community%EF%BC%89?node-id=419%3A128959&t=PMnGQ3VQIoGQZZPl-4' target="_blank"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/semi-code-site/Simple Table.png' style={{ width:  400 }} /></a> | 含 Semi Table 组件                  | 可用于快速识别表格列、创建 Table                     | <a href='https://codesandbox.io/s/happy-browser-dt34sr' target="_blank">Link</a>             |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=1%3A276' target="_blank" rel="noreferrer noopener"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/d2c-landing-example.png' style={{ width:  400 }} /></a>                                          | 整页 Landing Page                   | 可用于快速还原布局及内容                            | <a href='https://codesandbox.io/s/cvhhqt' target="_blank" rel="noreferrer noopener">Link</a> |

## 与其他方案的差异

### 更加符合设计师使用习惯

在 2021 ~ 2022 年调研了业界常见的 C2D 工具，它们将组件作为一个实例绘制在画布上，无论是创建实例还是切换变体都需要在插件内操作。

然而，在实际的设计流程中，设计师不习惯打开一个插件创建和更新组件。Semi 提供的方案是设计师继续通过 Figma 原生的方式使用变体，与原有的设计流程一致。

### 可用的设计组件

业界有一些工具支持任意的组件库转为设计组件，但是这些组件目前不具有 auto layout 能力，无法达到设计师可用的标准。另外它们的组件也没有使用设计变量，这导致设计师很难自定义这套组件。

### 组件识别不依赖标注

Semi 专注于支持 Semi 组件，Semi D2C 方案不需要研发手动对组件进行标注，如果你有自定义需求也可以使用标注方式将图层识别为组件。业界有一些工具提供了强大的组件标注能力，但由于没有默认提供一套组件库，所以在实际的使用中需要人工将组件以及组件属性进行标注。

### 转码支持 flex 布局

市场上常见的 D2C 工具，有一些具有比较好的 flex 布局能力支持，但在一些细节上有一定问题。Semi 支持将 Figma 的 auto layout 布局还原为 flex 布局。另外，如果图层间符合一定规则，也将自动识别为 flex 布局。