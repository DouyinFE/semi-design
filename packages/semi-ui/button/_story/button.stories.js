import React, { useState } from 'react';
import { storiesOf } from '@storybook/react'; // import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import withPropsCombinations from 'react-storybook-addon-props-combinations';
import { strings, numbers, cssClasses } from '@douyinfe/semi-foundation/button/constants';
import Button from '../index';
import ButtonGroup from '../buttonGroup';
import SplitButtonGroup from '../splitButtonGroup';
import Dropdown from '../../dropdown';
import { Tooltip, Switch } from '@douyinfe/semi-ui';
import { IconTick, IconEdit, IconTwitter, IconUser,IconCopy,IconSearch,IconPlay } from '@douyinfe/semi-icons';
import Collapse from '../../collapse';

const stories = storiesOf('Button', module); // stories.addDecorator(withKnobs);;

stories.add('button', () => <Button type="primary">UI semi</Button>);
stories.add('danger', () => <Button type="danger">hello button</Button>);
stories.add('warning', () => <Button type="warning">hello button</Button>);
stories.add('with icon', () => (
    <>
        <Button icon={<IconTick />}>hello button</Button>
        <br />
        <Button icon={<IconEdit />} noHorizontalPadding={false} ghost={false}>
            Edit me
        </Button>
        <Button icon={<IconUser />} />
    </>
));
stories.add(
    'combination show',
    withPropsCombinations(
        Button,
        {
            disabled: [false, true],
            children: ['hello button'],
            size: strings.sizes,
            type: strings.btnTypes,
            theme: strings.themes, // block: [false, true],
            // ghost: [false, true],
            // light: [false, true],
        },
        {
            showSource: false,
        }
    )
);
stories.add('button group', () => (
    <div>
        <ButtonGroup disabled>
            <Button>复制</Button>
            <Button type="primary">查找</Button>
            <Button type="danger">粘贴</Button>
        </ButtonGroup>
        <br />
        <ButtonGroup>
            <Button icon={<IconCopy />} theme={'solid'} />
            <Button icon={<IconSearch />} theme={'solid'} />
            <Button icon={<IconPlay />} theme={'solid'} />
        </ButtonGroup>
        <br />

        <ButtonGroup size={'large'}>
            <Button icon={<IconCopy />} theme={'solid'} />
            <Button icon={<IconSearch />} theme={'solid'} />
            <Button icon={<IconPlay />} theme={'solid'} />
        </ButtonGroup>
        <br />

        <ButtonGroup size={'small'}>
            <Button icon={<IconCopy />} theme={'solid'} />
            <Button icon={<IconSearch />} theme={'solid'} />
            <Button icon={<IconPlay />} theme={'solid'} />
        </ButtonGroup>
        <br />

        <ButtonGroup>
            <Button icon={<IconCopy />} theme={'solid'}>
                拷贝
            </Button>
            <Button icon={<IconSearch />} theme={'solid'}>
                搜索
            </Button>
            <Button icon={<IconPlay />} theme={'solid'}>
                播放
            </Button>
        </ButtonGroup>
        <br />

        <ButtonGroup size={'large'}>
            <Button icon={<IconCopy />} theme={'solid'}>
                拷贝
            </Button>
            <Button icon={<IconSearch />} theme={'solid'}>
                搜索
            </Button>
            <Button icon={<IconPlay />} theme={'solid'}>
                播放
            </Button>
        </ButtonGroup>
        <br />

        <ButtonGroup size={'small'}>
            <Button icon={<IconCopy />} theme={'solid'}>
                拷贝
            </Button>
            <Button icon={<IconSearch />} theme={'solid'}>
                搜索
            </Button>
            <Button icon={<IconPlay />} theme={'solid'}>
                播放
            </Button>
        </ButtonGroup>
        <br />
    </div>
));
stories.add('button loading', () => {
    function LoadingDemo() {
        const [loading, setLoading] = useState(false);
        return (
            <div
                style={{
                    maxWidth: 400,
                    maxHeight: 300,
                    padding: 50,
                }}
            >
                <div>
                    <Switch checked={loading} onChange={loading => setLoading(loading)} />
                </div>
                <Button loading={loading}>保存</Button>
                <Button loading={loading} type="danger" theme="solid">
                    删除
                </Button>
                <Button loading={loading} type="danger" theme="solid" disabled>
                    删除
                </Button>
                <Button loading={loading} type="danger" theme="solid" block>
                    删除
                </Button>
                <Tooltip content={loading ? '正在保存' : '保存'}>
                    <Button loading={loading}>保存</Button>
                </Tooltip>
                <Button icon={<IconEdit />} loading={loading} />
                <Tooltip content={loading ? '载入中' : '编辑'}>
                    <Button icon={<IconEdit />} loading={loading} />
                </Tooltip>
                <Tooltip content={loading ? '载入中' : '编辑'}>
                    <Button icon={<IconEdit />} loading={loading} theme="solid" />
                </Tooltip>
                <Tooltip content={loading ? '载入中' : '编辑'}>
                    <Button icon={<IconEdit />} loading={loading} theme="solid" type="danger" />
                </Tooltip>
                <Tooltip content={loading ? '载入中' : '编辑'}>
                    <Button icon={<IconEdit />} loading={loading} theme="solid" type="warning" disabled />
                </Tooltip>
            </div>
        );
    }

    return <LoadingDemo />;
});
const menu = [
    {
        node: 'title',
        name: '标题一',
    },
    {
        node: 'item',
        name: '编辑项目',
        onClick: () => console.log('编辑项目点击'),
    },
    {
        node: 'item',
        name: '重置项目',
        type: 'secondary',
    },
    {
        node: 'divider',
    },
    {
        node: 'item',
        name: '从项目创建模版',
        type: 'tertiary',
    },
    {
        node: 'item',
        name: '复制项目',
        type: 'warning',
    },
    {
        node: 'divider',
    },
    {
        node: 'item',
        name: '删除项目',
        type: 'danger',
    },
];
const content = '批量通过';
stories.add('split button', () => (
    <>
        <p>基础</p>
        <SplitButtonGroup>
            <Button theme="solid" type="primary">
                前面
            </Button>
            <Button theme="solid" type="primary">
                后面
            </Button>
        </SplitButtonGroup>
        <br />
        <SplitButtonGroup>
            <Button theme="solid" type="primary">
                One
            </Button>
        </SplitButtonGroup>
        <br />
        <SplitButtonGroup>
            <Button size="small" theme="solid" type="primary">
                前面
            </Button>
            <Button size="small" theme="solid" type="primary">
                中间
            </Button>
            <Button size="small" theme="solid" type="primary">
                后面
            </Button>
            <Dropdown trigger="click" menu={menu} position="bottomRight">
                <Button size="small" theme="solid" type="primary" icon={<IconTwitter />}></Button>
            </Dropdown>
        </SplitButtonGroup>
    </>
));

stories.add('button stopPropagation when disabled', () => (
    <>
        <Collapse>
            <Collapse.Panel header={<>title<Button>按钮</Button></>} itemKey="1">
                <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
            </Collapse.Panel>
            <Collapse.Panel header={<>title<Button disabled>按钮</Button></>} itemKey="2">
                <p>Hi, bytedance dance dance. This is the docsite of Semi UI. </p>
            </Collapse.Panel>
        </Collapse>
        <div onClick={() => console.log('div')}>
            <span>正常冒泡</span>
            <Button onClick={() => console.log('button')}>按钮</Button>
        </div>
        <div onClick={() => console.log('div')}>
            <span>禁用 Button 后，阻止冒泡</span>
            <Button disabled onClick={() => console.log('button')}>按钮</Button>
        </div>
    </>
));
