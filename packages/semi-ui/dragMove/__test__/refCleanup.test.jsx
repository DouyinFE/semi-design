import React from 'react';
import DragMove from '../index';
import { getRef } from '../../_utils/reactRender';

const create = ref => {
    const component = new DragMove({ ...DragMove.defaultProps, children: <div ref={ref} /> });
    const child = component.render();
    return { component, attach: getRef(child) };
};

describe('DragMove forwarded ref cleanup', () => {
    it('returns the child cleanup and clears its internal reference', () => {
        const cleanup = sinon.spy();
        const ref = sinon.spy(() => cleanup);
        const { component, attach } = create(ref);
        const node = document.createElement('div');
        const dispose = attach(node);
        expect(typeof dispose).toBe('function');
        dispose();
        expect(cleanup.callCount).toBe(1);
        expect(ref.args).toEqual([[node]]);
        expect(component.elementRef.current).toBe(null);
    });
    it('keeps forwarding null to ordinary callback refs', () => {
        const ref = sinon.spy();
        const { attach } = create(ref);
        const node = document.createElement('div');
        expect(attach(node)).toBe(undefined);
        expect(attach(null)).toBe(undefined);
        expect(ref.args).toEqual([[node], [null]]);
    });
    it('keeps assigning object refs', () => {
        const ref = { current: null };
        const { attach } = create(ref);
        const node = document.createElement('div');
        attach(node);
        expect(ref.current).toBe(node);
        attach(null);
        expect(ref.current).toBe(null);
    });
});

