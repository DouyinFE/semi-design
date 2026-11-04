import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Tabs from '../index';
afterEach(cleanup);
it.each([false, true])('skips disabled panes after removing the active child, allDisabled=%s', allDisabled => {
    const disabled = <Tabs.TabPane key="disabled" itemKey="disabled" tab="禁用" disabled>禁用内容</Tabs.TabPane>;
    const current = <Tabs.TabPane key="current" itemKey="current" tab="当前">当前内容</Tabs.TabPane>;
    const available = <Tabs.TabPane key="available" itemKey="available" tab="可用">可用内容</Tabs.TabPane>;
    const { rerender, getByRole } = render(<Tabs>{[disabled, current, ...(!allDisabled ? [available] : [])]}</Tabs>);
    rerender(<Tabs>{[disabled, ...(!allDisabled ? [available] : [])]}</Tabs>);
    expect(getByRole('tab', { name: '禁用' }).getAttribute('aria-selected')).toBe('false');
    if (!allDisabled) expect(getByRole('tab', { name: '可用' }).getAttribute('aria-selected')).toBe('true');
});
