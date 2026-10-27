import React from 'react';
import { mount } from 'enzyme';
import Footer from '../previewFooter';
import Slider from '../../slider';

describe('Image preview slider lifecycle', () => {
    let wrapper;
    beforeEach(() => { jest.useFakeTimers(); });
    afterEach(() => {
        if (wrapper) wrapper.unmount();
        jest.useRealTimers();
    });

    it('does not notify zoom after the footer is unmounted', () => {
        const onZoomIn = jest.fn();
        wrapper = mount(<Footer zoom={100} onZoomIn={onZoomIn} curPage={1} totalNum={1} />);
        const change = wrapper.find(Slider).prop('onChange');
        change(120);
        change(140);
        onZoomIn.mockClear();
        wrapper.unmount();
        wrapper = null;
        jest.advanceTimersByTime(100);
        expect(onZoomIn).not.toHaveBeenCalled();
    });

    it('keeps the trailing zoom update while mounted', () => {
        const onZoomIn = jest.fn();
        wrapper = mount(<Footer zoom={100} onZoomIn={onZoomIn} curPage={1} totalNum={1} />);
        const change = wrapper.find(Slider).prop('onChange');
        change(120);
        change(140);
        jest.advanceTimersByTime(100);
        expect(onZoomIn).toHaveBeenCalledTimes(2);
        expect(onZoomIn).toHaveBeenLastCalledWith(1.4);
    });
});
