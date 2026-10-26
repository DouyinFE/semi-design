import OverflowList from '../index';

describe('OverflowList item ref cleanup', () => {
    it('returns cleanup and clears its own item reference', () => {
        const component = new OverflowList(OverflowList.defaultProps);
        const node = document.createElement('span');
        const cleanup = sinon.spy();
        const ref = sinon.spy(() => cleanup);
        const dispose = component.mergeRef(ref, node, 'item');
        expect(typeof dispose).toBe('function');
        dispose();
        expect(cleanup.callCount).toBe(1);
        expect(ref.args).toEqual([[node]]);
        expect(component.itemRefs.item).toBe(null);
    });
    it('keeps forwarding null to ordinary callback refs', () => {
        const component = new OverflowList(OverflowList.defaultProps);
        const node = document.createElement('span');
        const ref = sinon.spy();
        component.mergeRef(ref, node, 'item');
        component.mergeRef(ref, null, 'item');
        expect(ref.args).toEqual([[node], [null]]);
    });
    it('keeps assigning object refs', () => {
        const component = new OverflowList(OverflowList.defaultProps);
        const ref = { current: null };
        const node = document.createElement('span');
        component.mergeRef(ref, node, 'item');
        expect(ref.current).toBe(node);
        component.mergeRef(ref, null, 'item');
        expect(ref.current).toBe(null);
    });
});
