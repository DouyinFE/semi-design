import * as React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar, Annotation, MCPConfigure } from '../../index';

describe('Sidebar list keys', () => {
    it('user render callbacks do not trigger missing key warning', () => {
        const spy = rs.spyOn(console, 'error').mockImplementation(() => {});
        const div = document.createElement('div');
        document.body.appendChild(div);
        const options = [{ key: 'a', name: 'A', icon: null }, { key: 'b', name: 'B', icon: null }];
        const info = [{ key: 'k', header: 'H', annotations: [{ title: 't1' }, { title: 't2' }] }];
        const mcp = [{ value: 'x', label: 'X', desc: 'dx', icon: 'i' }, { value: 'y', label: 'Y', desc: 'dy', icon: 'i' }];
        // React dedups key warnings per owner, so each case is asserted separately
        const cases = [
            <Annotation key="annotation" visible motion={false} info={info} activeKey={['k']} renderItem={(c) => <p>{c.title}</p>} />,
            <Sidebar key="options" visible motion={false} options={options} activeKey="a" renderOptionItem={(o) => <span>{o.name}</span>} />,
            <MCPConfigure key="mcp" visible motion={false} options={mcp} renderItem={({ option }) => <em>{option.label}</em>} />,
        ];
        cases.forEach(el => {
            ReactDOM.render(el, div);
            ReactDOM.unmountComponentAtNode(div);
        });
        const keyWarnings = spy.mock.calls.filter(c => String(c[0]).includes('unique "key" prop'));
        spy.mockRestore();
        expect(keyWarnings.length).toBe(0);
    });
});
