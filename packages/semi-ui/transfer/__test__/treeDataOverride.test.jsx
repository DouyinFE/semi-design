import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import Transfer from '../index';

afterEach(cleanup);

describe('Transfer tree data overrides', () => {
    const source = [{ key: 'a', value: 'a', label: 'Source A' }];
    const tree = [{ key: 'b', value: 'b', label: 'Tree B' }];

    it('selects an item from the overridden tree', () => {
        const onChange = sinon.spy();
        const { container, getByText } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: tree }} onChange={onChange} />);
        fireEvent.click(getByText('Tree B'));
        expect(onChange.calledOnce).toBe(true);
        expect(onChange.firstCall.args[0]).toEqual(['b']);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Tree B');
    });

    it('uses the overridden tree for initial and updated controlled values', () => {
        const { container, rerender } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: tree }} value={['b']} />);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Tree B');
        const updated = [{ key: 'c', value: 'c', label: 'Tree C' }];
        rerender(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: updated }} value={['c']} />);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Tree C');
    });

    it('uses the overridden tree for an initial default selection', () => {
        const { container } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: tree }} defaultValue={['b']} />);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Tree B');
    });

    it('shows an empty source when the overridden tree is empty', () => {
        const { container } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: [] }} />);
        expect(container.querySelector('.semi-transfer-left').textContent).not.toContain('Source A');
        expect(container.querySelector('.semi-transfer-left').textContent).toContain('暂无');
    });
});
