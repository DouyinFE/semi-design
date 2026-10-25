import React from 'react';
import { mount } from 'enzyme';
import TagGroup from '../group';

function StatefulLabel() {
    const [count, setCount] = React.useState(0);
    return <button onClick={() => setCount(value => value + 1)}>{count}</button>;
}

describe('TagGroup ReactNode keys', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());

    it('preserves child state when group size changes without tagKey', () => {
        const tagList = [{ children: <StatefulLabel /> }];
        wrapper = mount(<TagGroup tagList={tagList} size="small" />);
        wrapper.find('button').simulate('click');
        expect(wrapper.find('button').text()).toBe('1');
        wrapper.setProps({ size: 'large' });
        expect(wrapper.find('button').text()).toBe('1');
    });

    it('keeps explicit keys attached to their labels when tags reorder', () => {
        const first = { tagKey: 'a', children: <StatefulLabel /> };
        const second = { tagKey: 'b', children: <StatefulLabel /> };
        wrapper = mount(<TagGroup tagList={[first, second]} />);
        wrapper.find('button').at(0).simulate('click');
        wrapper.setProps({ tagList: [second, first] });
        expect(wrapper.find('button').at(0).text()).toBe('0');
        expect(wrapper.find('button').at(1).text()).toBe('1');
    });

    it('preserves custom mode children when group props change', () => {
        wrapper = mount(<TagGroup mode="custom" tagList={[<StatefulLabel key="custom" />]} size="small" />);
        wrapper.find('button').simulate('click');
        wrapper.setProps({ size: 'large' });
        expect(wrapper.find('button').text()).toBe('1');
    });

    it('keeps the generated tagKey argument in close callbacks', () => {
        const onTagClose = rstest.fn();
        wrapper = mount(<TagGroup tagList={[{ children: <span>Label</span>, closable: true }]} onTagClose={onTagClose} />);
        wrapper.find('.semi-tag-close').simulate('click', { stopPropagation() {}, nativeEvent: { stopImmediatePropagation() {} } });
        expect(onTagClose).toHaveBeenCalled();
        expect(typeof onTagClose.mock.calls[0][2]).toBe('number');
    });
});
