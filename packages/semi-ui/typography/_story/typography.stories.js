import React from 'react';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

import Icon from '../../icons';
import Typography from '../index';
import { IconLink, IconTick } from '@douyinfe/semi-icons';

export default {
  title: 'Typography'
}

const { Title, Text, Paragraph } = Typography;

export const _Title = () => (
  <div>
    <Title>h1. Semi Design</Title>
    <Title heading={2}>h2. Semi Design</Title>
    <Title heading={3}>h3. Semi Design</Title>
    <Title heading={4}>h4. Semi Design</Title>
    <Title heading={5}>h5. Semi Design</Title>
    <Title heading={6}>h6. Semi Design</Title>
    <Title heading={6} link>
      h6. Semi Design
    </Title>
  </div>
);

export const _Text = () => (
  <div>
    <Text>Text</Text>
    <br />
    <Text type="secondary">Secondary</Text>
    <br />
    <Text type="warning">Warning</Text>
    <br />
    <Text type="danger">Dange</Text>
    <br />
    <Text disabled>Disabled</Text>
    <br />
    <Text mark>Default Mark</Text>
    <br />
    <Text code>Example Code</Text>
    <br />
    <Text underline>Underline</Text>
    <br />
    <Text delete>Deleted</Text>
    <br />
    <Text strong>Strong</Text>
    <br />
    <Text link>链接文本</Text>
    <br />
    <Text link={{ href: 'https://semi.design/' }}>打开网站</Text>
    <br />
    <Text link>
      <IconLink />
      网页链接
    </Text>
  </div>
);

export const TextIcon = () => (
  <div>
    <Text icon={<IconLink />}>Text</Text>
    <br />
    <Text icon={<IconLink />} type="secondary">
      Secondary
    </Text>
    <br />
    <Text icon={<IconLink />} type="warning">
      Warning
    </Text>
    <br />
    <Text icon={<IconLink />} type="danger">
      Dange
    </Text>
    <br />
    <Text icon={<IconLink />} disabled>
      Disabled
    </Text>
    <br />
    <Text icon={<IconLink />} mark>
      Default Mark
    </Text>
    <br />
    <Text icon={<IconLink />} code>
      Example Code
    </Text>
    <br />
    <Text icon={<IconLink />} underline>
      Underline
    </Text>
    <br />
    <Text icon={<IconLink />} delete>
      Deleted
    </Text>
    <br />
    <Text icon={<IconLink />} strong>
      Strong
    </Text>
    <br />
    <Text icon={<IconLink />} link>
      链接文本
    </Text>
    <br />
    <Text icon={<IconLink />} link={{ href: 'https://semi.design/' }}>
      打开网站
    </Text>
    <br />
  </div>
);

TextIcon.story = {
  name: 'Text icon',
};

export const _Paragraph = () => (
  <div>
    <Paragraph>
      Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。
      <br />
      区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
      <br />
      -Semi Design
      以内容优先进行设计，这使得我们更容易搭建基于内容操作（多媒体、视频、音频等）的业务组件。
      <br />
      -更容易地自定义主题。面向公司众多不同的产品业务线，我们能够更快速地自定义具有该产品品牌风格的主题。
      <br />
      -适用国际化场景。组件设计时重视国际化场景，其中设计语言已应用在海外审核、运营等场景。
      <br />
      -效率场景加入人性化关怀。我们坚信追求高效的同时也要加入人性化的关怀，形成正向循环，追求长期的收益。
    </Paragraph>
    <br />
    <Paragraph spacing="extended">
      Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。
      <br />
      区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
      <br />
      -Semi Design
      以内容优先进行设计，这使得我们更容易搭建基于内容操作（多媒体、视频、音频等）的业务组件。
      <br />
      -更容易地自定义主题。面向公司众多不同的产品业务线，我们能够更快速地自定义具有该产品品牌风格的主题。
      <br />
      -适用国际化场景。组件设计时重视国际化场景，其中设计语言已应用在海外审核、运营等场景。
      <br />
      -效率场景加入人性化关怀。我们坚信追求高效的同时也要加入人性化的关怀，形成正向循环，追求长期的收益。
    </Paragraph>
  </div>
);

export const EllipsisSingle = () => (
  <div>
    <Paragraph ellipsis style={{ width: 350 }}>
      这是一个单行截断的例子： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ expandable: true }} style={{ width: 350 }}>
      单行截断并且支持展开：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ expandable: true }} style={{ width: 350 }}>
      单行截断，支持展开但其实没有溢出哦
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ expandable: true, expandText: 'Show More' }} style={{ width: 350 }}>
      单行截断并且支持展开，自定义展开文本： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ expandText: 'Show More' }} style={{ width: 350 }}>
      单行截断，自定义展开文本但是不能展开哦： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ showTooltip: true }} style={{ width: 350 }}>
      单行截断，展示tooltip： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ showTooltip: true }} style={{ width: 350 }}>
      展示tooltip，但是其实没有溢出哦
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{ suffix: '喵喵喵', expandText: 'Show More', expandable: true }}
      style={{ width: 250 }}
    >
      单行截断，有suffix哦： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{ suffix: '喵喵喵', expandText: 'Show More', expandable: true }}
      style={{ width: '50%' }}
    >
      单行截断，要自动适配宽度才可以： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
  </div>
);

EllipsisSingle.story = {
  name: 'Ellipsis single',
};

export const EllipsisMultiple = () => (
  <div>
    <Paragraph ellipsis={{ rows: 3 }} style={{ width: 300 }}>
      这是一个多行截断的例子： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{ rows: 9, expandable: true, collapsible: true, collapseText: '折叠我' }}
      style={{ width: 300 }}
    >
      如果支持折叠但其实没有达到溢出的高度，仍旧会显示文本
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 9, expandable: true }} style={{ width: 300 }}>
      如果支持折叠但其实没有达到溢出的高度，仍旧会显示文本
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, expandable: true }} style={{ width: 280 }}>
      多行截断并且支持展开：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{ expandable: true, rows: 3, expandText: 'Show More' }}
      style={{ width: 250 }}
    >
      多行截断并且支持展开，自定义展开文本： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, expandText: 'Show More' }} style={{ width: 250 }}>
      多行截断，自定义展开文本但是不能展开哦： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, showTooltip: true }} style={{ width: 250 }}>
      多行截断，展示tooltip： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, showTooltip: { type: 'popover' } }} style={{ width: 250 }}>
      多行截断，展示popover： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{ rows: 3, expandText: 'Show More', showTooltip: { type: 'popover' } }}
      style={{ width: 250 }}
    >
      多行截断，有展开文字但是不能展开所以不能展示popover： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, showTooltip: true }} style={{ width: 250 }}>
      展示tooltip，但是其实没有溢出哦
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, suffix: '喵喵喵', expandable: true }} style={{ width: 250 }}>
      多行截断，有suffix哦： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, suffix: '喵喵喵', expandable: true }} style={{ width: '50%' }}>
      多行截断，要自动适配宽度才可以： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
  </div>
);

EllipsisMultiple.story = {
  name: 'Ellipsis multiple',
};

export const EllipsisChaos = () => (
  <div>
    <Paragraph ellipsis={{ rows: 3 }} style={{ width: 300 }}>
      不可以有非文本，要抛出来warning： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。
      <br />{' '}
      设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis copyable style={{ width: 350 }}>
      还可以复制哦： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      ellipsis
      copyable={{
        successTip: (
          <span>
            <IconTick />
          </span>
        ),
      }}
      style={{ width: 350 }}
    >
      不要复制成功了： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis link style={{ width: 350 }}>
      是一个链接呢： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      link
      ellipsis={{ expandable: true, rows: 3, expandText: 'Show More' }}
      style={{ width: 250 }}
    >
      是一个链接还能展开呢： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      link
      copyable
      ellipsis={{ expandable: true, rows: 3, expandText: 'Show More' }}
      style={{ width: 250 }}
    >
      是一个链接还能展开呢还能复制呢： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Title heading={2} ellipsis={{ showTooltip: true }} style={{ width: 250 }}>
      是个2号标题哦： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Title>
    <br />
    <Title heading={4} link ellipsis={{ showTooltip: true }} style={{ width: 250 }}>
      是个4号标题链接呢： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Title>
    <br />
    <Text
      type="warning"
      ellipsis={{ rows: 3, showTooltip: { type: 'popover' } }}
      style={{ width: 250 }}
    >
      是个警告文本呢： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Text>
    <br />
    <Title
      icon={<IconLink />}
      heading={5}
      link
      ellipsis={{ showTooltip: true }}
      style={{ width: 250 }}
    >
      是个5号标题链接还有个小小的图标啦： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Title>
  </div>
);

EllipsisChaos.story = {
  name: 'Ellipsis chaos',
};

export const EllipsisCollapsible = () => (
  <div>
    <Paragraph
      ellipsis={{
        rows: 3,
        expandable: true,
        collapsible: true,
        onExpand: (bool, e) => console.log(bool, e),
      }}
      style={{ width: 300 }}
    >
      Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{
        rows: 3,
        expandable: true,
        collapsible: true,
        collapseText: 'show less',
        onExpand: (bool, e) => console.log(bool, e),
      }}
      style={{ width: 300 }}
    >
      自定义的收起：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{
        rows: 3,
        expandable: true,
        collapsible: false,
        collapseText: 'show less',
        onExpand: (bool, e) => console.log(bool, e),
      }}
      style={{ width: 300 }}
    >
      不让你收起来略：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      copyable
      ellipsis={{
        rows: 3,
        expandable: true,
        collapsible: true,
        onExpand: (bool, e) => console.log(bool, e),
      }}
      style={{ width: 300 }}
    >
      又可以复制啦：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph
      link
      ellipsis={{
        rows: 3,
        expandable: true,
        collapsible: true,
        onExpand: (bool, e) => console.log(bool, e),
      }}
      style={{ width: 300 }}
    >
      又来测试链接啦啦啦：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
  </div>
);

EllipsisCollapsible.story = {
  name: 'Ellipsis collapsible?',
};

export const EllipsisFromCenter = () => (
  <div>
    <Paragraph
      ellipsis={{
        rows: 3,
        pos: 'middle',
        expandable: true,
        collapsible: true,
        onExpand: (bool, e) => console.log(bool, e),
      }}
      style={{ width: 300 }}
    >
      多行中间截断还能展开和折叠：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, pos: 'middle', showTooltip: true }} style={{ width: 300 }}>
      多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：多行中间截断不能展开和折叠：
    </Paragraph>
    <br />
    <Paragraph
      ellipsis={{
        pos: 'middle',
        expandable: true,
        collapsible: true,
        onExpand: (bool, e) => console.log(bool, e),
      }}
      style={{ width: 300 }}
    >
      单行中间截断还能展开和折叠： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ pos: 'middle', expandable: true }} style={{ width: 300 }}>
      单行中间截断还能展开超厉害： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ pos: 'middle' }} style={{ width: '50%' }}>
      单行中间截断： Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph ellipsis={{ rows: 3, pos: 'middle', expandable: true }} style={{ width: '50%' }}>
      自动适配的多行中间截断：Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Title heading={3} ellipsis={{ pos: 'middle' }} style={{ width: '50%' }}>
      我是一个酷炫的从中间折断的3号标题
    </Title>
    <br />
    <Text ellipsis={{ pos: 'middle' }} style={{ width: '50%' }}>
      通常のテキストでさえ、切り捨てる機能が必要です
    </Text>
    <br />
    <br />
    <Text link ellipsis={{ pos: 'middle' }} style={{ width: '50%' }}>
      Even ordinary text wants to have the ability to truncate from center
    </Text>
  </div>
);

EllipsisFromCenter.story = {
  name: 'Ellipsis from center',
};

export const Copyable = () => (
  <div>
    <Paragraph copyable>
      Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。 区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有四大优势。
    </Paragraph>
    <br />
    <Paragraph copyable>点击右边的图标复制文本。</Paragraph>
    <br />
    <Paragraph spacing="extended" copyable>
      Semi Design 是由互娱社区前端团队与 UED
      团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
      Web 应用。
      <br />
      区别于其他的设计系统而言，Semi Design
      以用户中心、内容优先、设计人性化为设计理念，具有以下优势：
      <br />
      -Semi Design
      以内容优先进行设计，这使得我们更容易搭建基于内容操作（多媒体、视频、音频等）的业务组件。
      <br />
      -更容易地自定义主题。面向公司众多不同的产品业务线，我们能够更快速地自定义具有该产品品牌风格的主题。
      <br />
      -适用国际化场景。组件设计时重视国际化场景，其中设计语言已应用在海外审核、运营等场景。
      <br />
      -效率场景加入人性化关怀。我们坚信追求高效的同时也要加入人性化的关怀，形成正向循环，追求长期的收益。➡️
    </Paragraph>
    <br />
    <Paragraph spacing="extended" copyable>
      <span>
        Semi Design 是由互娱社区前端团队与 UED
        团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
        Web 应用。 ➡️
      </span>
    </Paragraph>
  </div>
);
