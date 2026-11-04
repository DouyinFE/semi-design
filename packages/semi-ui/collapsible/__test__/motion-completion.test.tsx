import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import Collapsible from '../index';

const transitionEnd = (element: Element, propertyName: string) => {
    fireEvent(element, Object.assign(new Event('transitionend', { bubbles: true }), { propertyName }));
};

beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => {
    cleanup();
    jest.useRealTimers();
});

it('ignores child transitions and completes a fading collapse only once', () => {
    const onMotionEnd = jest.fn();
    const { container, rerender, queryByText } = render(<Collapsible isOpen fade onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    rerender(<Collapsible isOpen={false} fade onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    const wrapper = container.firstElementChild;
    transitionEnd(queryByText('内容'), 'transform');
    expect(onMotionEnd).not.toHaveBeenCalled();
    expect(queryByText('内容')).not.toBeNull();
    transitionEnd(wrapper, 'opacity');
    expect(onMotionEnd).not.toHaveBeenCalled();
    transitionEnd(wrapper, 'height');
    expect(onMotionEnd).toHaveBeenCalledTimes(1);
    transitionEnd(wrapper, 'opacity');
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onMotionEnd).toHaveBeenCalledTimes(1);
    expect(queryByText('内容')).toBeNull();
});

it('settles a collapse without transition events and cancels its deadline on unmount', () => {
    const onMotionEnd = jest.fn();
    const { container, rerender, queryByText, unmount } = render(<Collapsible isOpen duration={100} onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    rerender(<Collapsible isOpen={false} duration={100} onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    act(() => { jest.advanceTimersByTime(200); });
    expect(queryByText('内容')).toBeNull();
    expect(container.firstElementChild.className).not.toContain('semi-collapsible-transition');
    expect(onMotionEnd).toHaveBeenCalledTimes(1);
    rerender(<Collapsible isOpen duration={100} onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    unmount();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onMotionEnd).toHaveBeenCalledTimes(1);
});

it('replaces the completion deadline when the direction changes', () => {
    const onMotionEnd = jest.fn();
    const { rerender, queryByText } = render(<Collapsible isOpen duration={100} onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    rerender(<Collapsible isOpen={false} duration={100} onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    act(() => { jest.advanceTimersByTime(80); });
    rerender(<Collapsible isOpen duration={100} onMotionEnd={onMotionEnd}><span>内容</span></Collapsible>);
    act(() => { jest.advanceTimersByTime(80); });
    expect(onMotionEnd).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(120); });
    expect(onMotionEnd).toHaveBeenCalledTimes(1);
    expect(queryByText('内容')).not.toBeNull();
});
