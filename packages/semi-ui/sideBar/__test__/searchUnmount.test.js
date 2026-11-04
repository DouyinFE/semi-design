import React from 'react';
import { mount } from 'enzyme';
import MCPConfigureContent from '../mcpConfigure/content';

const options = [{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta' }];

describe('MCP search lifecycle', () => {
    let wrapper;

    beforeEach(() => { jest.useFakeTimers(); });
    afterEach(() => {
        if (wrapper) wrapper.unmount();
        jest.useRealTimers();
    });

    it('does not call a consumer filter after unmount', () => {
        const filter = jest.fn(() => true);
        wrapper = mount(<MCPConfigureContent options={options} filter={filter} />);
        wrapper.find('input[type="text"]').simulate('change', { target: { value: 'a' } });
        wrapper.find('input[type="text"]').simulate('change', { target: { value: 'ab' } });
        filter.mockClear();
        wrapper.unmount();
        wrapper = null;
        jest.advanceTimersByTime(400);
        expect(filter).not.toHaveBeenCalled();
    });

    it('keeps the trailing search while mounted', () => {
        const filter = jest.fn(() => true);
        wrapper = mount(<MCPConfigureContent options={options} filter={filter} />);
        wrapper.find('input[type="text"]').simulate('change', { target: { value: 'a' } });
        wrapper.find('input[type="text"]').simulate('change', { target: { value: 'ab' } });
        filter.mockClear();
        jest.advanceTimersByTime(400);
        expect(filter).toHaveBeenCalledTimes(2);
        expect(filter).toHaveBeenCalledWith('ab', options[0]);
    });
});
