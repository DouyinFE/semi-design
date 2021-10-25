/* argus-disable unPkgSensitiveInfo */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Breadcrumb from '../index';
import Popover from '../../popover';
import { IconMore, IconArrowRight, IconHome, IconArticle, IconChevronRight, IconArticle } from '@douyinfe/semi-icons';

const stories = storiesOf('Breadcrumb', module);
stories.add('regular breadcrumb', () => (
    <div>
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    name: 'home',
                },
                'breadcrumb',
                'default',
            ]}
            onClick={item => console.log(item)}
        />
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    icon: <IconHome />,
                    href: '#',
                },
                {
                    path: '/breadcrumb',
                    name: 'breadcrumb',
                    icon: <IconChevronRight />,
                },
                'icon',
            ]}
            onClick={item => console.log(item)}
        />
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    name: 'home',
                },
                'breadcrumb',
                'separator',
                'string',
            ]}
            onClick={item => console.log(item)}
            separator={'>'}
        />
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    name: 'home',
                },
                'breadcrumb',
                'separator',
                'with icon',
            ]}
            onClick={item => console.log(item)}
            separator={<IconArrowRight size={'small'} />}
        />
        <Breadcrumb routes={['首页', '当这个页面标题很长时需要省略', '详情页']} onClick={item => console.log(item)} />
        <Breadcrumb
            routes={['首页', '当层级很多的时候', '又一层很长需要省略的时候', '再一层', '上上一层', '上一层', '详情页']}
            onClick={item => console.log(item)}
        />
    </div>
));
stories.add('compact breadcrumb', () => (
    <div>
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    name: 'home',
                },
                'breadcrumb',
                'compact',
            ]}
            onClick={item => console.log(item)}
            compact={true}
        />
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    icon: <IconHome />,
                },
                {
                    path: '/breadcrumb',
                    name: 'breadcrumb',
                    icon: <IconChevronRight />,
                },
                'icon',
            ]}
            onClick={item => console.log(item)}
            compact={true}
        />
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    name: 'home',
                },
                'breadcrumb',
                'separator',
                'string',
            ]}
            onClick={item => console.log(item)}
            separator={'>'}
            compact={true}
        />
        <Breadcrumb
            routes={[
                {
                    path: '/home',
                    name: 'home',
                },
                'breadcrumb',
                'separator',
                'icon',
            ]}
            onClick={item => console.log(item)}
            separator={<IconArrowRight size={'small'} />}
            compact={true}
        />
        <Breadcrumb
            routes={['首页', '当这个页面标题很长时需要省略', '详情页']}
            onClick={item => console.log(item)}
            compact={true}
        />
        <Breadcrumb
            routes={['首页', '当层级很多的时候', '又一层很长需要省略的时候', '再一层', '上上一层', '上一层', '详情页']}
            onClick={item => console.log(item)}
            compact={true}
        />
    </div>
));
stories.add('breadcrumbitem', () => (
    <div>
        <Breadcrumb onClick={item => console.log(item)}>
            <Breadcrumb.Item onClick={item => console.log('child', item)}>home</Breadcrumb.Item>
            <Breadcrumb.Item href="#">breadcrumb</Breadcrumb.Item>
            <Breadcrumb.Item>default</Breadcrumb.Item>
        </Breadcrumb>
        <Breadcrumb onClick={item => console.log(item)}>
            <Breadcrumb.Item icon={<IconHome />}></Breadcrumb.Item>
            <Breadcrumb.Item>breadcrumb</Breadcrumb.Item>
            <Breadcrumb.Item>default</Breadcrumb.Item>
        </Breadcrumb>
        <Breadcrumb separator={'>'} onClick={item => console.log(item)}>
            <Breadcrumb.Item>home</Breadcrumb.Item>
            <Breadcrumb.Item href="#">breadcrumb</Breadcrumb.Item>
            <Breadcrumb.Item>separator</Breadcrumb.Item>
        </Breadcrumb>
        <Breadcrumb compact={true} onClick={item => console.log(item)}>
            <Breadcrumb.Item>home</Breadcrumb.Item>
            <Breadcrumb.Item>breadcrumb</Breadcrumb.Item>
            <Breadcrumb.Item>compact</Breadcrumb.Item>
        </Breadcrumb>
        <Breadcrumb onClick={item => console.log(item)}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>当这个页面标题很长时需要省略</Breadcrumb.Item>
            <Breadcrumb.Item>详情页</Breadcrumb.Item>
        </Breadcrumb>
        <Breadcrumb onClick={item => console.log(item)}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>当层级很多的时候</Breadcrumb.Item>
            <Breadcrumb.Item>又一层很长需要省略的时候</Breadcrumb.Item>
            <Breadcrumb.Item>再一层</Breadcrumb.Item>
            <Breadcrumb.Item>上上一层</Breadcrumb.Item>
            <Breadcrumb.Item>上一层</Breadcrumb.Item>
            <Breadcrumb.Item>详情页</Breadcrumb.Item>
        </Breadcrumb>
        <Breadcrumb></Breadcrumb>
    </div>
));
stories.add('test', () => (
    <div>
        <Breadcrumb onClick={item => console.log(item)}>
            <Breadcrumb.Item onClick={item => console.log('child', item)}>home jump</Breadcrumb.Item>
            <Breadcrumb.Item href="#">breadcrumb</Breadcrumb.Item>
            <Breadcrumb.Item>
                <h1>default</h1>
            </Breadcrumb.Item>
        </Breadcrumb>
        <Breadcrumb>
            <Breadcrumb.Item icon={<IconHome />}></Breadcrumb.Item>
            <Breadcrumb.Item icon={<IconArticle />}>
                <h5>breadcrumb</h5>
            </Breadcrumb.Item>
            <Breadcrumb.Item>with icon</Breadcrumb.Item>
        </Breadcrumb>
    </div>
));
const serpator = '-'; // 用于拼接 restItem 数组项的分隔符

const renderMore = restItem => {
    const content = (
        <>
            {restItem.map((item, idx) => (
                <React.Fragment key={`restItem-${idx}`}>
                    {item}
                    {idx !== restItem.length - 1 && (
                        <span
                            style={{
                                color: 'var(--semi-color-text-2)',
                                marginRight: '6px',
                            }}
                        >
                            {serpator}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </>
    );
    return (
        <Popover
            content={content}
            style={{
                padding: 12,
            }}
            showArrow
        >
            <IconMore />
        </Popover>
    );
};

stories.add('renderMore', () => (
    <div
        style={{
            margin: '100px',
        }}
    >
        <Breadcrumb renderMore={restItem => renderMore(restItem)} onClick={(item, e) => console.log(item, e)}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>当层级很多的时候</Breadcrumb.Item>
            <Breadcrumb.Item>又一层</Breadcrumb.Item>
            <Breadcrumb.Item>再一层</Breadcrumb.Item>
            <Breadcrumb.Item>上上一层</Breadcrumb.Item>
            <Breadcrumb.Item>上一层</Breadcrumb.Item>
            <Breadcrumb.Item>详情页</Breadcrumb.Item>
        </Breadcrumb>
        <br />
        <br />
        <div>
            <Breadcrumb
                renderMore={restItem => renderMore(restItem)}
                onClick={(item, e) => console.log(item, e)}
                routes={[
                    {
                        path: '/',
                        href: '/',
                        icon: <IconHome />,
                    },
                    {
                        path: '/breadcrumb',
                        href: '/components/breadcrumb',
                        name: 'breadcrumb',
                        icon: <IconArticle />,
                    },
                    {
                        path: '/breadcrumb',
                        href: '/components/breadcrumb',
                        name: 'breadcrumb',
                        icon: <IconArticle />,
                    },
                    {
                        path: '/breadcrumb',
                        href: '/components/breadcrumb',
                        name: 'breadcrumb',
                        icon: <IconArticle />,
                    },
                    'with icon',
                ]}
            />
        </div>
    </div>
));
