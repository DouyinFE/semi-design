import React from 'react';
import { useIntl } from 'react-intl';

import SearchModal from './SearchModal';
import { recommendItemInterface } from './SearchModal/index.interface';
export default () => {
    const intl = useIntl();
    const recommendList = [
        {
            img: 'search-start',
            title: intl.locale === 'en-US' ? 'Quick Start' : '快速开始',
            content: intl.locale === 'en-US' ? 'Component' : '组件',
            url:
                intl.locale === 'en-US'
                    ? 'https://semi.design/en-US/start/getting-started'
                    : 'https://semi.design/zh-CN/start/getting-started',
        },
        {
            img: 'search-form',
            title: intl.locale === 'en-US' ? 'Form' : '表单',
            content: intl.locale === 'en-US' ? 'Component' : '组件',
            url:
                intl.locale === 'en-US'
                    ? 'https://semi.design/en-US/components/form'
                    : 'https://semi.design/zh-CN/components/form',
        },
        {
            img: 'search-table',
            title: intl.locale === 'en-US' ? 'Table' : '表格',
            content: intl.locale === 'en-US' ? 'Component' : '组件',
            url:
                intl.locale === 'en-US'
                    ? 'https://semi.design/en-US/components/table'
                    : 'https://semi.design/zh-CN/components/table',
        },
        {
            img: 'search-site',
            title: intl.locale === 'en-US' ? 'Semi Material Market' : 'Semi 物料市场',
            disable: false,
            content: intl.locale === 'en-US' ? 'Site' : '站点',
            url: 'https://semi.design/material',
        },
        {
            img: 'search-design',
            title: intl.locale === 'en-US' ? 'Design Language' : '了解设计语言',
            disable: true,
            content: intl.locale === 'en-US' ? 'Design' : '设计规范',
            url:
                intl.locale === 'en-US'
                    ? 'https://semi.design/design/en-US/handbook/intro'
                    : 'https://semi.design/design/zh-CN/handbook/intro',
        },
        {
            img: 'search-icon',
            title: intl.locale === 'en-US' ? 'Icon' : '图标',
            content: intl.locale === 'en-US' ? 'Component' : '组件',
            url:
                intl.locale === 'en-US'
                    ? 'https://semi.design/en-US/basic/icon'
                    : 'https://semi.design/zh-CN/basic/icon',
        },
    ];

    return <SearchModal key={Math.random()} recommendList={recommendList} intl={intl} />;
};
