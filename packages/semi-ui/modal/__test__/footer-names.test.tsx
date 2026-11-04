import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Modal from '../Modal';
import ConfigProvider from '../../configProvider';
import enUS from '../../locale/source/en_US';

afterEach(cleanup);

it('uses the default Chinese footer text as accessible names', () => {
    const { getByRole } = render(<Modal visible motion={false}>Content</Modal>);
    expect(getByRole('button', { name: '取消' })).not.toBeNull();
    expect(getByRole('button', { name: '确定' })).not.toBeNull();
});

it('uses custom footer text as accessible names', () => {
    const { getByRole } = render(<Modal visible motion={false} okText="提交" cancelText="放弃">Content</Modal>);
    expect(getByRole('button', { name: '放弃' })).not.toBeNull();
    expect(getByRole('button', { name: '提交' })).not.toBeNull();
});

it('uses the active locale for footer accessible names', () => {
    const { getByRole } = render(<ConfigProvider locale={enUS}><Modal visible motion={false}>Content</Modal></ConfigProvider>);
    expect(getByRole('button', { name: 'Cancel' })).not.toBeNull();
    expect(getByRole('button', { name: 'Confirm' })).not.toBeNull();
});

it('preserves explicit accessible names in button props', () => {
    const { getByRole } = render(<Modal visible motion={false} okText="提交" cancelText="放弃"
        okButtonProps={{ 'aria-label': '确认付款' }} cancelButtonProps={{ 'aria-label': '取消付款' }}>Content</Modal>);
    expect(getByRole('button', { name: '确认付款' })).not.toBeNull();
    expect(getByRole('button', { name: '取消付款' })).not.toBeNull();
});
