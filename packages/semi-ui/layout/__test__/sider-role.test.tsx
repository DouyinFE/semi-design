import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Layout from '../index';

afterEach(cleanup);

it.each(['navigation', 'region'] as const)('passes an explicit Sider role %s to its landmark', role => {
    const { getByRole } = render(<Layout.Sider role={role} aria-label="账户导航" />);
    expect(getByRole(role, { name: '账户导航' }).tagName).toBe('ASIDE');
});
