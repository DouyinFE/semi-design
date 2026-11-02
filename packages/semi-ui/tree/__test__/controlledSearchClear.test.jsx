import React, { useState } from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Tree from '../index';

const data = [{ key: 'parent', label: 'Parent', children: [{ key: 'child', label: 'Selected child' }] }];
afterEach(cleanup);
function clearSearch(container) {
    fireEvent.change(container.querySelector('input'), { target: { value: 'Selected' } });
    fireEvent.change(container.querySelector('input'), { target: { value: '' } });
}
it('keeps a controlled parent collapsed when search is cleared', () => {
    const onExpand = rs.fn();
    const { container } = render(<Tree treeData={data} value="child" expandedKeys={[]} filterTreeNode motion={false} onExpand={onExpand} />);
    clearSearch(container);
    expect(container.querySelector('[data-key="parent"]').getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[data-key="child"]')).toBeNull();
    expect(onExpand).not.toHaveBeenCalled();
});
it('preserves uncontrolled selected-ancestor expansion after clearing search', () => {
    const { container } = render(<Tree treeData={data} defaultValue="child" filterTreeNode motion={false} />);
    clearSearch(container);
    expect(container.querySelector('[data-key="parent"]').getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[data-key="child"]')).not.toBeNull();
});
it('lets the parent accept the expansion keys returned by onSearch', () => {
    function Demo() {
        const [keys, setKeys] = useState([]);
        return <Tree treeData={data} value="child" expandedKeys={keys} filterTreeNode motion={false} onSearch={(_value, nextKeys) => setKeys(nextKeys)} />;
    }
    const { container } = render(<Demo />);
    clearSearch(container);
    expect(container.querySelector('[data-key="parent"]').getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('[data-key="child"]')).not.toBeNull();
});
