import React from 'react';
import { mount } from 'enzyme';
import Descriptions from '../index';

describe('Descriptions horizontal input data', () => {
    const createData = () => Array.from({ length: 5 }, (_, index) => ({
        key: 'Field ' + index,
        value: 'Value ' + index,
    }));
    const lastSpan = wrapper => wrapper.find('td').last().prop('colSpan');

    it.each(['left', 'plain'])('recalculates the last span without mutating data with %s alignment', align => {
        const data = createData();
        const before = data.map(item => ({ ...item }));
        const wrapper = mount(<Descriptions layout="horizontal" column={3} align={align} data={data} />);
        try {
            expect(data).toEqual(before);
            expect(lastSpan(wrapper)).toBe(align === 'plain' ? 2 : 3);
            wrapper.setProps({ column: 4 });
            expect(lastSpan(wrapper)).toBe(align === 'plain' ? 4 : 7);
            wrapper.setProps({ column: 2 });
            expect(lastSpan(wrapper)).toBe(align === 'plain' ? 2 : 3);
            wrapper.setProps({ column: 3 });
            expect(lastSpan(wrapper)).toBe(align === 'plain' ? 2 : 3);
            expect(data).toEqual(before);
        } finally {
            wrapper.unmount();
        }
    });

    it('accepts frozen input items when filling the last row', () => {
        const data = Object.freeze(createData().map(item => Object.freeze(item)));
        const wrapper = mount(<Descriptions layout="horizontal" column={3} data={data} />);
        try {
            expect(lastSpan(wrapper)).toBe(3);
        } finally {
            wrapper.unmount();
        }
    });

    it('preserves an explicit span after column changes', () => {
        const data = [{ key: 'Field', value: 'Value', span: 2 }];
        const wrapper = mount(<Descriptions layout="horizontal" column={3} data={data} />);
        try {
            expect(lastSpan(wrapper)).toBe(3);
            wrapper.setProps({ column: 4 });
            expect(lastSpan(wrapper)).toBe(3);
            expect(data[0].span).toBe(2);
        } finally {
            wrapper.unmount();
        }
    });

    it('ignores hidden items without changing their span', () => {
        const data = createData();
        data[3].hidden = true;
        const before = data.map(item => ({ ...item }));
        const wrapper = mount(<Descriptions layout="horizontal" column={3} data={data} />);
        try {
            expect(wrapper.find('td')).toHaveLength(4);
            expect(lastSpan(wrapper)).toBe(5);
            expect(data).toEqual(before);
        } finally {
            wrapper.unmount();
        }
    });

    it('continues to fill the last row for JSX children', () => {
        const wrapper = mount(<Descriptions layout="horizontal" column={3}>
            <Descriptions.Item itemKey="First">One</Descriptions.Item>
            <Descriptions.Item itemKey="Last">Two</Descriptions.Item>
        </Descriptions>);
        try {
            expect(lastSpan(wrapper)).toBe(3);
            wrapper.setProps({ column: 4 });
            expect(lastSpan(wrapper)).toBe(5);
        } finally {
            wrapper.unmount();
        }
    });
});
