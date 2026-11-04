import React from 'react';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import AutoComplete from '../index';

const data = ['Alpha', 'Beta', 'Gamma'];
const press = (wrapper, keyCode) => wrapper.find('input').simulate('keyDown', { keyCode, preventDefault() {} });
const paste = (wrapper, value) => {
    act(() => { wrapper.find('input').simulate('change', { target: { value } }); });
    wrapper.update();
};

describe('AutoComplete focus when search reopens the panel', () => {
    it.each([true, false])('selects the pasted match with defaultActiveFirstOption=%s', defaultActiveFirstOption => {
        const onSelect = sinon.spy();
        const wrapper = mount(<AutoComplete data={data} defaultActiveFirstOption={defaultActiveFirstOption} motion={false} onSelect={onSelect} />);
        try {
            wrapper.find('input').simulate('focus');
            wrapper.find('input').simulate('click');
            press(wrapper, 40);
            press(wrapper, 40);
            press(wrapper, 27);
            paste(wrapper, 'Beta');
            press(wrapper, 13);
            expect(onSelect.calledOnce).toEqual(true);
            expect(onSelect.firstCall.args[0]).toEqual('Beta');
        } finally {
            wrapper.unmount();
        }
    });

    it('selects a match on the first input', () => {
        const onSelect = sinon.spy();
        const wrapper = mount(<AutoComplete data={data} motion={false} onSelect={onSelect} />);
        try {
            wrapper.find('input').simulate('focus');
            paste(wrapper, 'Beta');
            press(wrapper, 13);
            expect(onSelect.calledOnce).toEqual(true);
            expect(onSelect.firstCall.args[0]).toEqual('Beta');
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps matching input while the panel is open', () => {
        const onSelect = sinon.spy();
        const wrapper = mount(<AutoComplete data={data} defaultActiveFirstOption motion={false} onSelect={onSelect} />);
        try {
            wrapper.find('input').simulate('focus');
            wrapper.find('input').simulate('click');
            paste(wrapper, 'Beta');
            press(wrapper, 13);
            expect(onSelect.calledOnce).toEqual(true);
            expect(onSelect.firstCall.args[0]).toEqual('Beta');
        } finally {
            wrapper.unmount();
        }
    });
});
