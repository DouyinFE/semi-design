---
category: Getting Started
title:  Design to Code
subTitle: Dark Mode
icon: doc-code
localeCode: en-US
order: 4
---

## Introduction

Design to code (D2C) is a design draft conversion code tool provided by `Semi Design`, which supports one-click recognition of layer layout + Semi components in Figma pages, restores design drafts at the pixel level, translates them into JSX and CSS codes, and quickly previews them.
No need to start from 0.

From now, you can let the tool take care of UI restoration, focus more on your business logic.

## Abilities

<div>
     <Row gutter={[20, 80]}>
         <Col span={8}>
             <FeatureCard title='Support basic UI layout transcode'>
                 Support flex layout, absolute layout
             </FeatureCard>
         </Col>
         <Col span={8}>
             <FeatureCard title='Support Semi components'>
                Support the identification of Semi components and Semi Icons, covering 28+ components in form and table scenarios
             </FeatureCard>
         </Col>
         <Col span={8}>
             <FeatureCard title='Support exporting different stack codes' >
                 Multiple code style output：React + Scss, React + Tailwind and JSON Schema
             </FeatureCard>
         </Col>
     </Row>
</div>
<div>
     <Row gutter={[20, 20]}>
         <Col span={8}>
             <FeatureCard title='Support to identify other theme components'>
                 Support for identifying components behind custom themes
             </FeatureCard>
         </Col>
         <Col span={8}>
             <FeatureCard title='Nested components and custom content recognition'>
                 Recognize what the designer has modified to identify it as a ReactNode
             </FeatureCard>
         </Col>
     </Row>
</div>

## How to use

![](https://lf3-files.qingfuwucdn.net/obj/inspirecloud-file/baas/tt38q7/1aaf72252f553443_1676606724044.png)

Please move directly to <a href="https://semi.design/code" target="_blank">semi.design/code</a>
## Application scenario

<div>
     <Row gutter={[20, 20]}>
         <Col span={8}>
             <FeatureCard title='Basic page transcode' >
                Restore the layout of the basic page, suitable for landing page rapid development
             </FeatureCard>
         </Col>
         <Col span={8}>
             <FeatureCard title='Card transcode' >
                One-click to restore the card, no need to care about the card layout
             </FeatureCard>
         </Col>
         <Col span={8}>
             <FeatureCard title='Form page transcode' >
                Use Semi Variants to build the operation table page, D2C helps you automatically identify the table column content
             </FeatureCard>
         </Col>
     </Row>
     <Row gutter={[20, 20]}>
         <Col span={8}>
             <FeatureCard title='Form page transcode' >
                Use Semi Variants to build an operation form page, and restore the Semi Form form with one click
             </FeatureCard>
         </Col>
         <Col span={8}>
             <FeatureCard title='Access to custom build platform'>
                Customize consumption JSON Schema and create template code suitable for your project
             </FeatureCard>
         </Col>
         <Col span={8}>
             <FeatureCard />
         </Col>
     </Row>
</div>

## Examples

Here is a link to the Figma example mockup and its corresponding Codesandbox transpiled using the Semi Figma plugin.

| Screenshot & Figma URL                                                                                                                                                                                                                                                                                                                         | Draft Type                                                                                        | Desciption                                                                                          | Codesandbox                                                                                  |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=5%3A2092' target="_blank" rel="noreferrer noopener"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/simple-demo-1.jpg' style={{ width:  400 }} /></a>                                               | A module with simple content without components                                                   | Can be used to quickly restore layout and content                                                   | <a href='https://codesandbox.io/s/w1z9yx' target="_blank" rel="noreferrer noopener">Link</a> |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=1%3A275' target="_blank" rel="noreferrer noopener"><img src='https://lf3-files.qingfuwucdn.net/obj/inspirecloud-file/baas/tt38q7/2468f1c4f1756bc0_1676603194364.png' style={{ width:  400 }} /></a>                                                  | Modules that do not contain components, have more content, or have a slightly more complex layout | Can be used to quickly restore layout and content                                                   | <a href='https://codesandbox.io/s/905ncn' target="_blank" rel="noreferrer noopener">Link</a> |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo%EF%BC%88Figma-Community%EF%BC%89?node-id=419%3A90854&t=PMnGQ3VQIoGQZZPl-4' target="_blank"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/semi-code-site/Simple Form.png' style={{ width:  400 }}/></a>    | Module with Semi Form Components                                                                  | Can be used to quickly restore the layout and content, and identify the Props of the Semi component | <a href='https://codesandbox.io/p/sandbox/simple-form-9gq7fw' target="_blank">Link</a>                           |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo%EF%BC%88Figma-Community%EF%BC%89?node-id=419%3A128959&t=PMnGQ3VQIoGQZZPl-4' target="_blank"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/semi-code-site/Simple Table.png' style={{ width:  400 }} /></a> | Module with Semi Table Components                                                                 | Can be used to quickly identify table columns, create Table                                         | <a href='https://codesandbox.io/s/happy-browser-dt34sr' target="_blank">Link</a>             |
| <a href='https://www.figma.com/file/TlLeWouyImYUexTmhdLiIn/D2C-Getting-Start-Demo?node-id=1%3A276' target="_blank" rel="noreferrer noopener"><img src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/semi-linker/d2c-landing-example.png' style={{ width:  400 }} /></a>                                          | Full landing page                                                                                 | Can be used to quickly restore layout and content                                                   | <a href='https://codesandbox.io/s/cvhhqt' target="_blank" rel="noreferrer noopener">Link</a> |

## Comparisons

### More in line with the designer's usage habits

We investigated the common C2D tools in the industry in 2021~2022. They all draw the component as an instance on the canvas. Whether it is creating an instance or switching variants, it needs to be operated within the plug-in.

However, in the actual design process, designers are not used to opening a plugin to create and update components. The solution provided by Semi is that designers continue to use variants in the native way of Figma, which is consistent with the original design process.

### Powerful Design Components

There are some tools in the industry that support converting arbitrary component libraries into design components, but these components currently do not have auto layout capabilities and cannot meet the standards available to designers. In addition, their components do not use design variables, which makes it difficult for designers to customize this set of components.

### Component identification does not depend on annotations

Semi focuses on supporting Semi components. The Semi D2C solution does not require R&D to manually label components. If you have custom requirements, you can also use labeling to identify layers as components. There are some tools in the industry that provide powerful component labeling capabilities, but since there is no component library provided by default, it is necessary to manually label components and component properties in actual use.

### Transcoding supports flex layout

We have researched some common D2C tools on the market, and some of them have relatively good flex layout support, but there are certain problems in some details. Semi supports reverting Figma's auto layout to flex layout. In addition, if certain rules are met between layers, it will also be automatically recognized as a flex layout.