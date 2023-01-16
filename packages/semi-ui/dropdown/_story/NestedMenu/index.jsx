import { Dropdown, Tag } from '@douyinfe/semi-ui';
import React, { useMemo } from 'react';


const subMenu = [
    // { node: 'title', name: 'a-1-title' },
    { node: 'item', name: 'a-1-1', type: 'primary', children: [] },
    { node: 'item', name: 'a-1-2', type: 'secondary' },
    // { node: 'title', name: 'a-2' },
    { node: 'item', name: 'a-2-1', type: 'tertiary' },
];

const menu = [
    { node: 'title', name: '分组1' },
    { node: 'item', name: 'a', type: 'primary', children: subMenu },
    { node: 'item', name: 'b', type: 'secondary' },
    { node: 'divider' },
    { node: 'title', name: '分组2' },
    { node: 'item', name: 'tertiary', type: 'tertiary' },
    { node: 'item', name: 'warning', type: 'warning', active: true },
    { node: 'item', name: 'danger', type: 'danger' },
];

function Demo() {

    return (
        <div style={{ margin: 100 }}>
            <Dropdown
                menu={menu}
            >
                <Tag>Hover Me</Tag>
            </Dropdown>
        </div>
    );
}

export default Demo;
