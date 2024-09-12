---
category: 开始
title:  Design to Code 设计稿转代码
icon: doc-code
localeCode: zh-CN
order: 4
---

## 简介

Design to code（简称D2C） 是 Semi Design 提供的设计稿转代码功能，支持一键识别 Figma 页面中图层布局 + Semi 组件，像素级还原设计稿，转译为 JSX 和 CSS 代码，快捷预览，
无需从 0 开发。

从此，你可以将 UI 还原的工作交给工具，更专注于实现业务逻辑。

## 基础能力

<div>
    <Row gutter={[20, 60]}>
        <Col span={8}>
            <FeatureCard title='基础 UI 布局还原' >
                支持 flex 布局、absolute 布局
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='精准的Semi 组件识别' >
                已覆盖表单和表格场景 28+ 组件
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='支持输出不同技术栈代码' >
                多种代码风格输出： React + Scss、React + Tailwind 和 JSON Schema
            </FeatureCard>
        </Col>
    </Row>
    <Row gutter={[20, 20]}>
        <Col span={8}>
            <FeatureCard title='支持识别其他主题' >
                支持识别自定义主题后的组件
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='嵌套组件和自定义内容识别' >
                识别设计师修改后的内容，将其识别为 ReactNode
            </FeatureCard>
        </Col>
    </Row>
</div>

## 如何使用


![](https://lf3-files.qingfuwucdn.net/obj/inspirecloud-file/baas/tt38q7/82069cd816533f91_1676604095341.png)

更详细的使用说明，可访问 <a href="/code" target="_blank">https://semi.design/code</a> 查阅


## 使用场景

<div>
    <Row gutter={[20, 20]}>
        <Col span={8}>
            <FeatureCard title='基础页面转码' >
                将基础页面的布局进行还原，适合落地页快速开发
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard title='卡片转码' >
                一键将复杂样式的卡片进行还原，无需关心卡片布局
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
            <FeatureCard title='接入自定义搭建平台' >
                自定义消费 JSON Schema，创建适合你项目的模板代码
            </FeatureCard>
        </Col>
        <Col span={8}>
            <FeatureCard />
        </Col>
    </Row>
</div>

## 实际示例

我们准备了一些 Figma 示例设计稿，以及使用 Semi Figma 插件实际转译的代码 Codesandbox 链接。   

在安装插件后，你可以基于这些现有设计稿，快速体验 / 评估 Semi D2C 的能力


| 截图 & Figma URL                                                                                                                                                                                                                                                                                                                               | 类型                                | 说明                                                | Codesandbox                                                                                  |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=5%3A2092' target="_blank" rel="noreferrer noopener"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/simple-demo-1.jpg' style={{ width:  400 }} /></a>                                               | 不含组件，内容较简单的模块           | 可用于快速还原布局及内容                            | <a href='https://codesandbox.io/s/w1z9yx' target="_blank" rel="noreferrer noopener">Link</a> |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=1%3A275' target="_blank" rel="noreferrer noopener"><img src='https://lf3-files.qingfuwucdn.net/obj/inspirecloud-file/baas/tt38q7/2468f1c4f1756bc0_1676603194364.png' style={{ width:  400 }} /></a>                                                  | 不含组件，内容较多或布局稍复杂的模块 | 可用于快速还原布局及内容                            | <a href='https://codesandbox.io/s/905ncn' target="_blank" rel="noreferrer noopener">Link</a> |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo%EF%BC%88Figma-Community%EF%BC%89?node-id=419%3A90854&t=PMnGQ3VQIoGQZZPl-4' target="_blank"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/semi-code-site/Simple Form.png' style={{ width:  400 }}/></a>    | 含 Semi 表单组件的模块              | 可用于快速还原布局及内容，并识别出 Semi 组件的 Props | <a href='https://codesandbox.io/p/sandbox/simple-form-9gq7fw' target="_blank">Link</a>                           |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo%EF%BC%88Figma-Community%EF%BC%89?node-id=419%3A128959&t=PMnGQ3VQIoGQZZPl-4' target="_blank"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/semi-code-site/Simple Table.png' style={{ width:  400 }} /></a> | 含 Semi Table 组件                  | 可用于快速识别表格列、创建 Table                     | <a href='https://codesandbox.io/s/happy-browser-dt34sr' target="_blank">Link</a>             |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=1%3A276' target="_blank" rel="noreferrer noopener"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/d2c-landing-example.png' style={{ width:  400 }} /></a>                                          | 整页 Landing Page                   | 可用于快速还原布局及内容                            | <a href='https://codesandbox.io/s/cvhhqt' target="_blank" rel="noreferrer noopener">Link</a> |

## 与其他方案的差异

### 更加符合设计师使用习惯

我们在 2021 ~ 2022 年调研了业界常见的 C2D 工具，它们将组件作为一个实例绘制在画布上，无论是创建实例还是切换变体都需要在插件内操作。

然而，在实际的设计流程中，设计师可能并不习惯打开一个插件创建和更新组件。Semi 提供的方案允许设计师继续通过 Figma 原生的方式使用变体，与原有的设计流程一致。

### 可用的设计组件

业界有一些工具支持任意的组件库转为设计组件，但是这些组件目前不具有 auto layout 能力，无法达到设计师可用的标准。另外它们的组件也没有使用设计变量，这导致设计师很难通过 design token 自定义这些组件库。

### 组件识别不依赖标注

Semi D2C 方案提供了精准到组件级 props 的识别能力，并且不需要研发手动对组件进行标注。同时对于自定义组件，我们也额外提供了标注方式将图层识别为组件。业界有一些工具提供了强大的组件标注能力，但由于没有默认提供一套组件库，所以在实际的使用中需要人工将组件以及组件属性进行标注，整体的使用成本较高。

### 更好的 Flex 布局支持

市场上常见的 D2C 工具，有一些具有比较好的 Flex 布局能力支持，但在一些细节上有一定问题。Semi 支持将 Figma 的 auto layout 布局还原为 Flex 布局。另外，如果图层间符合一定规则，也将自动识别为 Flex 布局。


## 更多说明
更多关于Figma 插件的安装，使用，标注自定义组件，Figma 设计变体的使用，D2C的使用受限等细节信息，请查阅 https://semi.design/code