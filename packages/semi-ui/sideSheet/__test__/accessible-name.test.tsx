import React from 'react';
import { cleanup, render } from '@testing-library/react';
import SideSheet from '../index';
afterEach(cleanup);
it('uses the explicit accessible name on its dialog', () => {
    const { getByRole } = render(<SideSheet visible motion={false} aria-label="账户设置">内容</SideSheet>);
    expect(getByRole('dialog', { name: '账户设置' })).not.toBeNull();
});
