import React from 'react';
import Label from '../label';

describe('Form.Label style ownership', () => {
    it('does not change the caller style when applying width', () => {
        const style = { color: 'navy' };
        const wrapper = mount(<Label text="Name" style={style} width={80} />);
        expect(style).toEqual({ color: 'navy' });
        expect(wrapper.find('label').prop('style')).toEqual({ color: 'navy', width: 80 });
        wrapper.setProps({ width: 160 });
        expect(style).toEqual({ color: 'navy' });
        expect(wrapper.find('label').prop('style').width).toBe(160);
        wrapper.unmount();
    });

    it('accepts frozen style with width', () => {
        const style = Object.freeze({ color: 'navy' });
        const wrapper = mount(<Label text="Name" style={style} width={120} />);
        expect(wrapper.find('label').prop('style')).toEqual({ color: 'navy', width: 120 });
        wrapper.unmount();
    });

    it('allows labels to share one style with different widths', () => {
        const style = { color: 'navy' };
        const wrapper = mount(<div><Label text="First" style={style} width={80} /><Label text="Second" style={style} width={160} /><div className="neighbor" style={style}>Neighbor</div></div>);
        expect(wrapper.find('label').at(0).prop('style').width).toBe(80);
        expect(wrapper.find('label').at(1).prop('style').width).toBe(160);
        expect(wrapper.find('.neighbor').prop('style')).toEqual({ color: 'navy' });
        wrapper.unmount();
    });
});

