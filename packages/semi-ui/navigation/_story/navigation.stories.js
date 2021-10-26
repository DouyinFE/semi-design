import React from 'react';
import { storiesOf } from '@storybook/react';

import Nav from '..';
import Switch from '../../switch';
import AutoOpenDemo from './AutoOpen';
import ControlledSelectedKeys from './ControlledSelectedKeys';
import LinkNavDemo from './LinkNav';
import MountUnmount from './MountUnmount';
import WithRouter from './WithRouter';
import WithChildren from './WithChildren';
import ItemsChange from './ItemsChange';
import DisabledNav from './DisabledNav';
import Button from '../../button';

import { IconMail, IconFolder, IconGift, IconList,
     IconFlag, IconStar, IconCloud, IconEdit,
     IconFile,IconCamera,IconArticle,IconUser,IconAscend,IconDescend,IconSetting,IconUserGroup } from '@douyinfe/semi-icons';

const stories = storiesOf('Navigation', module);

// stories.addDecorator(withKnobs);;

stories.add('普通导航', () => {
    return (
        <div style={{ height: '100vh', display: 'inline-block' }}>
            <Nav onSelect={(...args) => console.log(...args)}>
                <Nav.Item itemKey={'1'} text={'Option 1'} icon={<IconMail />} />
                <Nav.Sub text={'Group 2'} icon={<IconFolder />} stayWhenClick={true} itemKey={'2'}>
                    {['2-1', '2-2'].map(k => (
                        <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k} />
                    ))}
                    <Nav.Item itemKey={'2-3'} text={'Option 2-3'} />
                    <Nav.Sub text={'Group 2-4'} itemKey={'2-4'}>
                        <Nav.Item itemKey={'2-4-1'} text={'Option 2-3-1'} />
                        <Nav.Item itemKey={'2-4-2'} text={'Option 2-3-2'} />
                    </Nav.Sub>
                </Nav.Sub>
                <Nav.Item key={3} itemKey={'3'} text={'Option 3'} icon={<IconGift />} />
                <Nav.Item key={4} itemKey={'4'} text={'Option 4'} icon={<IconList />} />
                <Nav.Sub text={'Group 5'} icon={<IconFlag />} stayWhenClick={true} itemKey={'5'}>
                    {['5-1', '5-2'].map(k => (
                        <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k} />
                    ))}
                </Nav.Sub>
                <Nav.Item itemKey={'6'} text={'Option 6 (with link)'} icon={<IconStar />} link="/star" />
                <Nav.Sub text={'Group 7'} icon={<IconFolder />} stayWhenClick={true} itemKey={'7'}>
                    {['7-1', '7-2'].map(k => (
                        <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k + ' (with link)'} link={`folder/${k}`} />
                    ))}
                    <Nav.Item itemKey={'7-3'} text={'Option 7-3'} />
                </Nav.Sub>
            </Nav>
        </div>
    );
});

class NavApp extends React.Component {
    state = {
        isCollapsed: true,
    };

    updateCollapsed = isCollapsed => {
        this.setState({ isCollapsed });
    };

    render() {
        let { isCollapsed } = this.state;
        return (
            <div style={{ height: '100vh', display: 'inline-block' }}>
                <div>
                    {'收起到左侧'}
                    <Switch defaultChecked={isCollapsed} onChange={v => this.updateCollapsed(v)} />
                </div>
                <Nav isCollapsed={isCollapsed}>
                    <Nav.Item itemKey={'1'} text={'Option 1'} icon={<IconCloud />} />
                    <Nav.Sub text={'Group 2'} icon={<IconEdit />} stayWhenClick={true}>
                        {['2-1', '2-2'].map(k => (
                            <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k} />
                        ))}
                        <Nav.Sub text={'Group 2-3'} icon={<IconFile />}>
                            <Nav.Item itemKey={'2-3-1'} text={'Option 2-3-1'} />
                            <Nav.Item itemKey={'2-3-2'} text={'Option 2-3-2'} />
                        </Nav.Sub>
                    </Nav.Sub>
                    <Nav.Item key={3} itemKey={'3'} text={'Option 3'} icon={<IconCamera />} />
                    <Nav.Item key={4} itemKey={'4'} text={'Option 4'} icon={<IconArticle />} />
                    <Nav.Sub text={'Group 5'} stayWhenClick={true} icon={<IconFolder />}>
                        {['5-1', '5-2'].map(k => (
                            <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k} />
                        ))}
                    </Nav.Sub>
                </Nav>
            </div>
        );
    }
}

stories.add('收起/展开导航', () => <NavApp />);

stories.add('基于配置渲染的导航', () => (
    <div style={{ border: '1px solid black', height: '100vh', display: 'inline-block' }}>
        <Nav
            items={[
                { itemKey: 'user', text: '用户管理', icon: <IconUser />, link: '/user' },
                { itemKey: 'union', text: '公会中心', icon: <IconUser />, link: '/star' },
                {
                    text: '任务平台',
                    icon: <IconSetting />,
                    itemKey: 'job',
                    items: ['任务管理', '用户任务查询'],
                },
            ]}
            onSelect={key => console.log(key)}
        />
    </div>
));

stories.add('横向导航', () => (
    <div>
        <Nav
            mode="horizontal"
            items={[
                '1',
                { itemKey: '2', text: 'Option 2 Option 2 Option 2 Option 2', icon: <IconCamera /> },
                {
                    text: 'Group 3',
                    itemKey: '3',
                    icon: <IconFile />,
                    items: ['3-1', '3-2', { text: 'Group 3-3', items: ['3-3-1', '3-3-2'] }],
                },
            ]}
            onSelect={key => console.log(key)}
        />
    </div>
));

class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            isCollapsed: false,
            defaultOpenKeys: ['2', '2-3'],
            mode: 'vertical',
            navHeight: '100vh',
        };
    }

    updateCollapsed(isCollapsed) {
        this.setState({ isCollapsed });
    }

    render() {
        let { isCollapsed, defaultOpenKeys, mode, navHeight } = this.state;
        let logo = '//lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/logo_huoshan.png';
        let testIcon = '//lf1-cdn-tos.bytescm.com/obj/mosaic-legacy/da9d0015af0f09667998';
        let vigoIcon = '//lf1-cdn-tos.bytescm.com/obj/mosaic-legacy/504100070cbe0498d66f';
        return (
            <div>
                <Nav
                    isCollapsed={isCollapsed}
                    defaultOpenKeys={defaultOpenKeys}
                    style={{ height: navHeight }}
                    mode={mode}
                >
                    <Nav.Header logo={<img src={logo} />} text="互娱运营" />
                    <Nav.Item
                        itemKey={'1'}
                        text={<strong>火山运营</strong>}
                        icon={<img width="20" height="20" src={vigoIcon} />}
                    />
                    <Nav.Sub
                        itemKey={'2'}
                        text={<span>抖音运营</span>}
                        icon={<img width="20" height="20" src={testIcon} />}
                        stayWhenClick={true}
                    >
                        {['2-1', '2-2'].map(k => (
                            <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k} />
                        ))}
                    </Nav.Sub>
                    <Nav.Footer>
                        <Button
                            title="展开/收起切换"
                            icon={isCollapsed ? <IconAscend /> : <IconDescend />}
                            onClick={() => this.updateCollapsed(!isCollapsed)}
                        />
                    </Nav.Footer>
                </Nav>
            </div>
        );
    }
}
stories.add('配logo，展开/收起切换', () => <Demo />);

class HorizontalDemo extends React.Component {
    render() {
        return (
            <div style={{ width: '100%' }}>
                <Nav
                    bodyStyle={{ height: 320 }}
                    items={[
                        { itemKey: 'user', text: '用户管理', icon: <IconUser /> },
                        { itemKey: 'union', text: '公会中心', icon: <IconStar /> },
                        {
                            itemKey: 'union-management',
                            text: '公会管理',
                            icon: <IconUserGroup />,
                            items: ['公告设置', '公会查询', '信息录入'],
                        },
                        {
                            itemKey: 'approve-management',
                            text: '审批管理',
                            icon: <IconEdit />,
                            items: [
                                '入驻审核',
                                {
                                    itemKey: 'operation-management',
                                    text: '运营管理',
                                    items: ['人员管理', '人员变更'],
                                },
                            ],
                        },
                        {
                            text: '任务平台',
                            icon: <IconSetting />,
                            itemKey: 'job',
                            items: ['任务管理', '用户任务查询'],
                        },
                    ]}
                    onSelect={key => console.log(key)}
                    header={{
                        logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                        text: '直播运营后台',
                    }}
                    footer={{
                        collapseButton: true,
                    }}
                />
            </div>
        );
    }
}
stories.add('配logo，横向导航栏', () => <HorizontalDemo />);

stories.add('auto open', () => <AutoOpenDemo />);

stories.add(`link nav`, () => <LinkNavDemo />);

stories.add(`mount unmount`, () => <MountUnmount />);

stories.add(`controlled selected keys`, () => <ControlledSelectedKeys />);

stories.add(`with router`, () => <WithRouter />);

stories.add(`with children`, () => <WithChildren />);

stories.add(`nav cannot set item to 0 dynaicly`, () => <ItemsChange />);

stories.add(`disabled nav`, () => <DisabledNav />);


