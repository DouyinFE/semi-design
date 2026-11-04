import OverflowList from '../index';

describe('OverflowList renderMode updates', () => {
    const items = [{ key: 'a' }, { key: 'b' }, { key: 'c' }];
    it('restores all items when changing collapse to scroll with stable items', () => {
        const result = OverflowList.getDerivedStateFromProps({ items, renderMode: 'scroll' }, { prevProps: { items, renderMode: 'collapse' }, visible: [items[0]], overflow: items.slice(1), containerWidth: 100 });
        expect(result.visible).toEqual(items);
        expect(result.overflow).toEqual([]);
        expect(result.overflowStatus).toBe('calculating');
    });
    it('starts collapse calculation when changing back from scroll', () => {
        const result = OverflowList.getDerivedStateFromProps({ items, renderMode: 'collapse' }, { prevProps: { items, renderMode: 'scroll' }, visible: items, overflow: [], containerWidth: 100 });
        expect(result.overflowStatus).toBe('calculating');
        expect(result.visible).toBeDefined();
    });
    it('keeps calculated visibility for unchanged props', () => {
        const props = { items, renderMode: 'collapse' };
        const result = OverflowList.getDerivedStateFromProps(props, { prevProps: props, visible: [items[0]], overflow: items.slice(1), containerWidth: 100 });
        expect(result.visible).toBeUndefined();
        expect(result.overflow).toBeUndefined();
    });
});
