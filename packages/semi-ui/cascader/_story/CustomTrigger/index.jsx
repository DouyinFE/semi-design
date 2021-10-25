import React from 'react';
import { AutoComplete, Icon, Button, Cascader } from '@douyinfe/semi-ui';

export default function Demo() {
    const treeData = [
        {
            label: '浙江省',
            value: 'zhejiang',
            children: [
                {
                    label: '杭州市',
                    value: 'hangzhou',
                    children: [
                        {
                            label: '西湖区',
                            value: 'xihu',
                        },
                        {
                            label: '萧山区',
                            value: 'xiaoshan',
                        },
                        {
                            label: '临安区',
                            value: 'linan',
                        },
                    ],
                },
                {
                    label: '宁波市',
                    value: 'ningbo',
                    children: [
                        {
                            label: '海曙区',
                            value: 'haishu',
                        },
                        {
                            label: '江北区',
                            value: 'jiangbei',
                        },
                    ],
                },
            ],
        },
    ];
    return (
        <Cascader
            style={{ width: 300, display: 'inline-block' }}
            treeData={treeData}
            placeholder="请选择所在地区"
            triggerRender={({ value, placeholder }) => <Button block>{value && value[0] && value[0].displayText || placeholder}</Button>}
        />
    );
}
