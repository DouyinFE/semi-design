import React from 'react';
import Tooltip from '../index';
import { getRef } from '../../_utils/reactRender';

const create = ref => {
    const component = new Tooltip({ ...Tooltip.defaultProps, children: <div ref={ref} /> });
    const child = React.Children.toArray(component.render().props.children).find(child => child.type === 'div');
    return { component, attach: getRef(child) };
};

describe('Tooltip forwarded ref cleanup', () => {
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
        expect(component.triggerEl.current).toBe(null);
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

