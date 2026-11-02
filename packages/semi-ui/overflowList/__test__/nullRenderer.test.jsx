import React from 'react';
import { mount } from 'enzyme';
import OverflowList from '../index';

const items = [{ key: 'hidden' }, { key: 'visible' }];

describe('OverflowList null renderer in collapse mode', () => {
    let wrapper;

    afterEach(() => wrapper && wrapper.unmount());

    it('supports the default renderer with nonempty items', () => {
        wrapper = mount(<OverflowList items={items} />);
        expect(wrapper.find('.semi-overflow-list-item').length).toBe(2);
        expect(wrapper.text()).toBe('');
    });

    it('renders other items when one renderer result is null', () => {
        wrapper = mount(<OverflowList items={items}
            visibleItemRenderer={item => item.key === 'hidden' ? null : <span>{item.key}</span>} />);
        expect(wrapper.find('span').text()).toBe('visible');
    });

    it('can replace null results with visible elements', () => {
        wrapper = mount(<OverflowList items={items} visibleItemRenderer={() => null} />);
        wrapper.setProps({ visibleItemRenderer: item => <span>{item.key}</span> });
        expect(wrapper.find('span').map(node => node.text())).toEqual(['hidden', 'visible']);
    });

    it('preserves element refs and event handlers', () => {
        const ref = React.createRef();
        const onClick = rstest.fn();
        wrapper = mount(<OverflowList items={[items[1]]}
            visibleItemRenderer={() => <button ref={ref} onClick={onClick}>visible</button>} />);
        wrapper.find('button').simulate('click');
        expect(ref.current).toBe(wrapper.find('button').getDOMNode());
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
