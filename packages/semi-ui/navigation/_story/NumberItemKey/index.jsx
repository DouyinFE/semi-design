import React from 'react';
import { Nav } from '@douyinfe/semi-ui';
import { IconSemiLogo } from '@douyinfe/semi-icons';
import { IconDescriptions, IconIntro, IconTree, IconAvatar, IconTreeSelect, IconTabs } from '@douyinfe/semi-icons-lab';

export default function NumberItemKey() {
    return (
        <Nav
            bodyStyle={{ height: 320 }}
            // openKeys={[3]}
            items={[
                { itemKey: 1, text: '用户管理', icon: <IconAvatar /> },
                { itemKey: 2, text: '活动管理', icon: <IconDescriptions /> },
                {
                    text: '任务平台',
                    icon: <IconTree />,
                    itemKey: 3,
                    items: ['任务管理', '用户任务查询'],
                },
            ]}
            onSelect={data => console.log('trigger onSelect: ', data)}
            onClick={data => console.log('trigger onClick: ', data)}
        />
    );
};

