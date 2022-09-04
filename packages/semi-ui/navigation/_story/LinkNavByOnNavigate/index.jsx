import React, { useMemo } from 'react';
import { IconClose, IconTick } from '@douyinfe/semi-icons';
import { Nav, Typography, Space } from '../../../index';

export default function Demo() {
    const navItems = useMemo(
        () => [
            { itemKey: 'item-without-link', text: '无 link 选项', icon: <IconClose /> },
            { itemKey: 'item-with-link', text: '有 link 选项', link:'/test-link', icon: <IconTick /> },
        ],
        []
    );

    return (
        <Space vertical align="start" spacing="loose">
            <Typography.Title heading={1}>阻止自动跳转的导航栏</Typography.Title>
            <Typography.Paragraph>不使用 <code>onNavigate</code> 时，如果选项中配置了 <code>link</code> 属性则会渲染带 <code>href</code> 属性的 <code>a</code> 标签。此时点击则会发生页面跳转，不利于使用诸如 <code>react-router-dom</code> 等库的 SPA 进行导航。</Typography.Paragraph>
            <Typography.Paragraph>使用 <code>onNavigate</code> 后，会自动在 <code>a</code> 标签的 <code>onClick</code> 事件中添加 <code>e.preventDefault()</code>，并触发 <code>onNavigate</code> API，其回调函数的第一个参数为目标地址。使用 <code>react-router-dom</code> 等库的同学可以监听此端口进行导航。</Typography.Paragraph>
            <Space spacing="loose">
                <Space vertical align="start">
                    <Typography.Title heading={3}>使用 <code>onNavigate</code></Typography.Title>
                    <Nav
                        items={navItems}
                        onClick={clickParams => console.log('[Semi.Nav] onClick triggered:', clickParams)}
                        onSelect={selectParams => console.log('[Semi.Nav] onSelect triggered:', selectParams)}
                        onNavigate={link => console.log('[Semi.Nav] onNavigate triggered:', link)}
                    />
                </Space>
                <Space vertical align="start">
                    <Typography.Title heading={3}>不使用 <code>onNavigate</code></Typography.Title>
                    <Nav
                        items={navItems}
                        onClick={clickParams => console.log('[Semi.Nav] onClick triggered:', clickParams)}
                        onSelect={selectParams => console.log('[Semi.Nav] onSelect triggered:', selectParams)}
                    />
                </Space>
            </Space>
        </Space>
    );
}
