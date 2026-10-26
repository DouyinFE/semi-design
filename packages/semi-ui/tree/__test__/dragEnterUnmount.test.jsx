import React, { useState } from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import Tree from '../index';

const data = [{ key: 'source', label: 'Source' }, { key: 'target', label: 'Target', children: [{ key: 'child', label: 'Child' }] }];
beforeEach(() => { rs.useFakeTimers(); });
afterEach(() => { cleanup(); rs.useRealTimers(); });
function start(container) {
    fireEvent.dragStart(container.querySelector('[data-key="source"]'));
}
it.each([false, true])('keeps normal drag-enter callbacks with auto expansion %s', autoExpandWhenDragEnter => {
    const onDragEnter = rs.fn();
    const { container } = render(<Tree treeData={data} draggable motion={false} autoExpandWhenDragEnter={autoExpandWhenDragEnter} onDragEnter={onDragEnter} />);
    start(container);
    fireEvent.dragEnter(container.querySelector('[data-key="target"]'), { clientY: 0 });
    act(() => { rs.advanceTimersByTime(500); });
    expect(onDragEnter).toHaveBeenCalledTimes(1);
});
it.each([false, true])('does not notify after business unmount with auto expansion %s', async autoExpandWhenDragEnter => {
    const onDragEnter = rs.fn();
    function Demo() {
        const [mounted, setMounted] = useState(true);
        return <div onDragEnterCapture={() => Promise.resolve().then(() => setMounted(false))}>{mounted && <Tree treeData={data} draggable motion={false} autoExpandWhenDragEnter={autoExpandWhenDragEnter} onDragEnter={onDragEnter} />}</div>;
    }
    const { container } = render(<Demo />);
    start(container);
    await act(async () => { fireEvent.dragEnter(container.querySelector('[data-key="target"]'), { clientY: 0 }); await Promise.resolve(); });
    act(() => { rs.advanceTimersByTime(500); });
    expect(container.querySelector('[role="tree"]')).toBeNull();
    expect(onDragEnter).not.toHaveBeenCalled();
});
it('clears every pending drag-enter callback on unmount', () => {
    const onDragEnter = rs.fn();
    const { container, unmount } = render(<Tree treeData={data} draggable motion={false} autoExpandWhenDragEnter={false} onDragEnter={onDragEnter} />);
    start(container);
    fireEvent.dragEnter(container.querySelector('[data-key="target"]'), { clientY: 0 });
    fireEvent.dragEnter(container.querySelector('[data-key="target"]'), { clientY: 0 });
    unmount();
    act(() => { rs.advanceTimersByTime(500); });
    expect(onDragEnter).not.toHaveBeenCalled();
});
