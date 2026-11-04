import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Layout from '../index';

let original: typeof window.matchMedia;
let queries: Map<string, { matches: boolean; addListener: any; removeListener: any }>;

beforeEach(() => {
    original = window.matchMedia;
    queries = new Map();
    window.matchMedia = jest.fn(query => {
        const entry = { matches: query.includes('768'), addListener: jest.fn(), removeListener: jest.fn() };
        queries.set(query, entry);
        return entry as any;
    });
});

afterEach(() => {
    cleanup();
    window.matchMedia = original;
});

it('replaces breakpoint subscriptions and reports the new match', () => {
    const onBreakpoint = jest.fn();
    const { rerender } = render(<Layout.Sider breakpoint={['md']} onBreakpoint={onBreakpoint} />);
    expect(onBreakpoint).toHaveBeenLastCalledWith('md', true);
    const md = queries.get('(min-width: 768px)');
    rerender(<Layout.Sider breakpoint={['lg']} onBreakpoint={onBreakpoint} />);
    expect(md.removeListener).toHaveBeenCalledTimes(1);
    expect(onBreakpoint).toHaveBeenLastCalledWith('lg', false);
    const lg = queries.get('(min-width: 992px)');
    rerender(<Layout.Sider breakpoint={['lg']} onBreakpoint={onBreakpoint} />);
    expect(lg.removeListener).not.toHaveBeenCalled();
});

it('removes subscriptions when breakpoints are cleared or the Sider unmounts', () => {
    const { rerender, unmount } = render(<Layout.Sider breakpoint={['md']} />);
    const md = queries.get('(min-width: 768px)');
    rerender(<Layout.Sider breakpoint={[]} />);
    expect(md.removeListener).toHaveBeenCalledTimes(1);
    rerender(<Layout.Sider breakpoint={['md']} />);
    const latestMd = queries.get('(min-width: 768px)');
    expect(latestMd).not.toBe(md);
    unmount();
    expect(latestMd.removeListener).toHaveBeenCalledTimes(1);
});
