import React from 'react';
import { cleanup, fireEvent, render, within } from '@testing-library/react';
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

    it('preserves selected source items hidden by the overridden tree', () => {
        const onChange = sinon.spy();
        const { container, getByText } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: tree }} defaultValue={['a']} onChange={onChange} />);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Source A');
        fireEvent.click(getByText('Tree B'));
        expect(onChange.lastCall.args[0]).toEqual(['a', 'b']);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Source A');
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Tree B');
        fireEvent.click(within(container.querySelector('.semi-transfer-left')).getByText('Tree B'));
        expect(onChange.lastCall.args[0]).toEqual(['a']);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Source A');
    });

    it('keeps controlled values from the original data source', () => {
        const { container } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: tree }} value={['a']} />);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Source A');
    });

    it('supports object-valued Tree callbacks while preserving hidden selections', () => {
        const onChange = sinon.spy();
        const { container } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData: tree, onChangeWithObject: true }} defaultValue={['a']} onChange={onChange} />);
        const left = container.querySelector('.semi-transfer-left');
        fireEvent.click(within(left).getByText('Tree B'));
        expect(onChange.lastCall.args[0]).toEqual(['a', 'b']);
        fireEvent.click(within(left).getByText('Tree B'));
        expect(onChange.lastCall.args[0]).toEqual(['a']);
    });

    it('supports object-valued Tree callbacks with the original data source', () => {
        const onChange = sinon.spy();
        const { container } = render(<Transfer type="treeList" dataSource={source} treeProps={{ onChangeWithObject: true }} onChange={onChange} />);
        const left = container.querySelector('.semi-transfer-left');
        fireEvent.click(within(left).getByText('Source A'));
        expect(onChange.lastCall.args[0]).toEqual(['a']);
        fireEvent.click(within(left).getByText('Source A'));
        expect(onChange.lastCall.args[0]).toEqual([]);
    });

    it('preserves a controlled selection with object-valued Tree callbacks', () => {
        const onChange = sinon.spy();
        const dataSource = [...source, ...tree];
        const { container } = render(<Transfer type="treeList" dataSource={dataSource} treeProps={{ onChangeWithObject: true }} value={['a']} onChange={onChange} />);
        const left = container.querySelector('.semi-transfer-left');
        fireEvent.click(within(left).getByText('Tree B'));
        expect(onChange.lastCall.args[0]).toEqual(['a', 'b']);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Source A');
    });

    it.each([false, true])('selects mapped tree fields with object callbacks %s', onChangeWithObject => {
        const onChange = sinon.spy();
        const keyMaps = { key: 'id', value: 'val', label: 'name', children: 'nodes' };
        const treeData = [{ id: 'parent', val: 'parent', name: 'Parent', nodes: [{ id: 'b', val: 'b', name: 'Mapped B' }] }];
        const { container } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData, keyMaps, onChangeWithObject }} defaultValue={['a']} onChange={onChange} />);
        const left = container.querySelector('.semi-transfer-left');
        fireEvent.click(within(left).getByText('Mapped B'));
        expect(onChange.lastCall.args[0]).toEqual(['a', 'b']);
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Source A');
        expect(container.querySelector('.semi-transfer-right').textContent).toContain('Mapped B');
    });

    it('uses a mapped key when the tree node has no value', () => {
        const onChange = sinon.spy();
        const treeData = [{ id: 'b', name: 'Mapped B' }];
        const { getByText } = render(<Transfer type="treeList" dataSource={source} treeProps={{ treeData, keyMaps: { key: 'id', value: 'val', label: 'name' } }} onChange={onChange} />);
        fireEvent.click(getByText('Mapped B'));
        expect(onChange.lastCall.args[0]).toEqual(['b']);
    });
});
