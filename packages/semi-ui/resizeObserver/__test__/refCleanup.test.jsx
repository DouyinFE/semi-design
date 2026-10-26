import ResizeObserverComponent from '../index';

describe('ResizeObserver forwarded ref cleanup', () => {
    it('returns the child cleanup and clears its own reference when it runs', () => {
        const component = new ResizeObserverComponent({});
        const node = document.createElement('div');
        const cleanup = sinon.spy();
        const ref = sinon.spy(() => cleanup);
        const dispose = component.mergeRef(ref, node);
        expect(typeof dispose).toBe('function');
        dispose();
        expect(cleanup.callCount).toBe(1);
        expect(ref.callCount).toBe(1);
        expect(ref.firstCall.args[0]).toBe(node);
        expect(component.childNode).toBe(null);
    });
    it('keeps forwarding null for ordinary callback refs', () => {
        const component = new ResizeObserverComponent({});
        const node = document.createElement('div');
        const ref = sinon.spy();
        expect(component.mergeRef(ref, node)).toBe(undefined);
        expect(component.mergeRef(ref, null)).toBe(undefined);
        expect(ref.args).toEqual([[node], [null]]);
    });
    it('keeps updating object refs', () => {
        const component = new ResizeObserverComponent({});
        const node = document.createElement('div');
        const ref = { current: null };
        component.mergeRef(ref, node);
        expect(ref.current).toBe(node);
        component.mergeRef(ref, null);
        expect(ref.current).toBe(null);
    });
});
