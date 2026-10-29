import React from 'react';
import { act } from 'react-dom/test-utils';
import Row from '../row';
import Col from '../col';

describe('Row responsive gutter updates', () => {
    let wide, queries;
    beforeEach(() => {
        wide = false;
        queries = [];
        rs.spyOn(window, 'matchMedia').mockImplementation(media => {
            const listeners = new Set();
            const query = {
                media,
                get matches() { return media.includes('max-width') ? !wide : wide; },
                addListener: listener => listeners.add(listener),
                removeListener: listener => listeners.delete(listener),
                emit: () => listeners.forEach(listener => listener(query)),
            };
            queries.push(query);
            return query;
        });
    });
    afterEach(() => { rs.restoreAllMocks(); });
    const gutter = { xs: 8, xxl: 48 };
    const padding = wrapper => { wrapper.update(); return wrapper.find('.semi-col').prop('style').paddingLeft; };

    it('uses the current breakpoint when a numeric gutter becomes responsive', () => {
        const wrapper = mount(<Row gutter={0}><Col span={12}>Column</Col></Row>);
        try {
            wrapper.setProps({ gutter });
            expect(padding(wrapper)).toBe(4);
            act(() => { wide = true; queries.forEach(query => query.emit()); });
            expect(padding(wrapper)).toBe(24);
            wrapper.setProps({ gutter: 10 });
            act(() => { wide = false; queries.forEach(query => query.emit()); });
            expect(padding(wrapper)).toBe(5);
            wrapper.setProps({ gutter });
            expect(padding(wrapper)).toBe(4);
        } finally { wrapper.unmount(); }
    });

    it('keeps initially responsive and array gutters working', () => {
        const wrapper = mount(<Row gutter={[gutter, 12]}><Col span={12}>Column</Col></Row>);
        try {
            expect(padding(wrapper)).toBe(4);
            wrapper.setProps({ gutter: [{ xs: 16, xxl: 64 }, 12] });
            expect(padding(wrapper)).toBe(8);
            act(() => { wide = true; queries.forEach(query => query.emit()); });
            expect(padding(wrapper)).toBe(32);
        } finally { wrapper.unmount(); }
    });
});
