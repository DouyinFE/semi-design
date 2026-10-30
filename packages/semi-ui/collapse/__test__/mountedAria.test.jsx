import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { mount } from 'enzyme';
import Collapse from '../index';

function panels() {
    return <Collapse defaultActiveKey={['a', 'b']} motion={false}><Collapse.Panel itemKey="a" header="A">A body</Collapse.Panel><Collapse.Panel itemKey="b" header="B">B body</Collapse.Panel></Collapse>;
}
function checkRelationships(root) {
    const headers = [...root.querySelectorAll('.semi-collapse-header')];
    const ids = headers.map(node => node.getAttribute('aria-owns'));
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
    ids.forEach(id => expect([...root.querySelectorAll('.semi-collapse-content')].some(node => node.id === id)).toBe(true));
}
describe('Collapse mounted ARIA identifiers', () => {
    it('populates valid ids without a parent update', () => {
        const wrapper = mount(panels());
        try { checkRelationships(wrapper.getDOMNode()); } finally { wrapper.unmount(); }
    });
    it('keeps server ids empty to preserve the SSR compatibility policy', () => {
        const container = document.createElement('div');
        container.innerHTML = renderToString(panels());
        expect([...container.querySelectorAll('.semi-collapse-header')].map(node => node.getAttribute('aria-owns'))).toEqual(['', '']);
    });
    it('fills ids after hydration without an attribute mismatch', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        container.innerHTML = renderToString(panels());
        const errors = rs.spyOn(console, 'error');
        try {
            ReactDOM.hydrate(panels(), container);
            checkRelationships(container);
            expect(errors.mock.calls.filter(args => /did not match|hydration/i.test(args.join(' ')))).toHaveLength(0);
        } finally {
            errors.mockRestore();
            ReactDOM.unmountComponentAtNode(container);
            container.remove();
        }
    });
});
