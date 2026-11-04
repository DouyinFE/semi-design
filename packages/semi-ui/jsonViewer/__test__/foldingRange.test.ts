import { FoldSource, FoldingRegions } from '@douyinfe/semi-json-viewer-core/model/foldingRange';

describe('JsonViewer folding regions', () => {
    it('finds nested and sibling regions', () => {
        const ranges = [
            { startLineNumber: 1, endLineNumber: 12 },
            { startLineNumber: 2, endLineNumber: 5 },
            { startLineNumber: 7, endLineNumber: 10 },
        ].map(range => ({ ...range, type: undefined, isCollapsed: false, source: FoldSource.provider }));
        const regions = FoldingRegions.fromFoldRanges(ranges);

        expect(regions.getParentIndex(0)).toBe(-1);
        expect(regions.getParentIndex(1)).toBe(0);
        expect(regions.getParentIndex(2)).toBe(0);
        expect(regions.findRange(8)).toBe(2);
        expect(regions.findRange(6)).toBe(0);
    });

    it('preserves parent relationships beyond 65535 regions', () => {
        const ranges = Array.from({ length: 65537 }, (_, index) => ({
            startLineNumber: index * 4 + 1,
            endLineNumber: index * 4 + 4,
            type: undefined,
            isCollapsed: false,
            source: FoldSource.provider,
        }));
        ranges.push({ ...ranges[65536], startLineNumber: 65536 * 4 + 2, endLineNumber: 65536 * 4 + 3 });
        const regions = FoldingRegions.fromFoldRanges(ranges);

        expect(regions.length).toBe(65538);
        expect(regions.getParentIndex(65536)).toBe(-1);
        expect(regions.getParentIndex(65537)).toBe(65536);
        expect(regions.findRange(65536 * 4 + 2)).toBe(65537);
        regions.setCollapsed(65537, true);
        expect(regions.isCollapsed(65537)).toBe(true);
    });
});
