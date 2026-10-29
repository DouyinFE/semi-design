import React from 'react';
import { mount } from 'enzyme';
import Radio from '../index';

function Note({ name }) { const [memo, setMemo] = React.useState(name); return <input className="memo" data-name={name} value={memo} onChange={e => setMemo(e.target.value)} />; }
describe('RadioGroup child keys', () => {
    it('preserves keyed child state after reordering and insertion', () => {
        const render = names => <Radio.Group>{names.map(name => <Radio key={name} value={name}><Note name={name} /></Radio>)}</Radio.Group>;
        const wrapper = mount(render(['A', 'B']));
        try {
            wrapper.find('input.memo').first().simulate('change', { target: { value: 'edited A' } });
            wrapper.setProps({ children: render(['B', 'A']).props.children });
            expect(wrapper.find('input.memo').map(node => [node.prop('data-name'), node.prop('value')])).toEqual([['B', 'B'], ['A', 'edited A']]);
            wrapper.setProps({ children: render(['C', 'B', 'A']).props.children });
            expect(wrapper.find('input.memo').map(node => [node.prop('data-name'), node.prop('value')])).toEqual([['C', 'C'], ['B', 'B'], ['A', 'edited A']]);
        } finally { wrapper.unmount(); }
    });
});
