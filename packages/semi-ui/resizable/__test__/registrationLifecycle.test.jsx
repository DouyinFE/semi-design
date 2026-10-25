import React from 'react';
import { mount } from 'enzyme';
import { ResizeGroup, ResizeItem, ResizeHandler } from '../index';

describe('ResizeGroup registrations', () => {
    let wrapper;
    const render = ({ items = ['A', 'B', 'C'], direction = 'horizontal', ...props } = {}) =>
        <ResizeGroup direction={direction}>{items.map((id, index) => <React.Fragment key={id}>
            {index > 0 && <ResizeHandler />}
            <ResizeItem {...props}><div>{id}</div></ResizeItem>
        </React.Fragment>)}</ResizeGroup>;
    const update = props => wrapper.setProps(render(props).props);

    beforeEach(() => {
        jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
            return this.classList.contains('semi-resizable-group') ? 900 : this.classList.contains('semi-resizable-handler') ? 10 : 300;
        });
        jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(200);
    });
    afterEach(() => {
        wrapper?.unmount();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    ['horizontal', 'vertical'].forEach(direction => {
        it(`unregisters removed nodes and reindexes remaining handlers in ${direction}`, () => {
            const onResizeStart = jest.fn();
            wrapper = mount(render({ direction, onResizeStart }));
            update({ direction, items: ['B', 'C'], onResizeStart });
            const group = wrapper.instance();
            expect(group.itemRefs.size).toBe(2);
            expect(group.handlerRefs.size).toBe(1);
            expect(() => group.foundation.ensureConstraint.flush()).not.toThrow();
            wrapper.find(ResizeHandler).instance().onMouseDown({ clientX: 0, clientY: 0, target: document.body });
            expect(group.state.curHandler).toBe(0);
            expect(onResizeStart).toHaveBeenCalledTimes(2);
        });
    });

    it('inserts new items in DOM order and recalculates their space', () => {
        wrapper = mount(render());
        update({ items: ['A', 'D', 'B', 'C'] });
        const group = wrapper.instance();
        expect(Array.from(group.itemRefs.values()).map(ref => ref.current.textContent)).toEqual(['A', 'D', 'B', 'C']);
        expect(group.itemRefs.get(1).current.style.width).toContain('25%');
    });

    it('keeps a valid layout when only one item remains', () => {
        wrapper = mount(render());
        update({ items: ['C'] });
        expect(wrapper.instance().itemRefs.size).toBe(1);
        expect(wrapper.instance().handlerRefs.size).toBe(0);
        expect(wrapper.find(ResizeItem).getDOMNode().style.width).toBe('calc(100% - 0px)');
    });

    it('updates min, max and all resize callbacks without remounting', () => {
        const oldCallback = jest.fn();
        const nextCallback = jest.fn();
        wrapper = mount(render({ min: '50px', max: '850px', onResizeStart: oldCallback, onChange: oldCallback, onResizeEnd: oldCallback }));
        update({ min: '250px', max: '450px', onResizeStart: nextCallback, onChange: nextCallback, onResizeEnd: nextCallback });
        const group = wrapper.instance();
        expect(group.adapter.getItemMin(0)).toBe('250px');
        expect(group.adapter.getItemMax(0)).toBe('450px');
        const event = { clientX: 0, clientY: 0, target: document.body };
        group.foundation.onResizeStart(0, event, 'mouse');
        group.foundation.onMouseMove({ ...event, clientX: -50 });
        group.foundation.onResizeEnd(event);
        expect(oldCallback).not.toHaveBeenCalled();
        expect(nextCallback).toHaveBeenCalledTimes(6);
    });

    it('does not reset user sizes when only callbacks change', () => {
        wrapper = mount(render());
        const node = wrapper.find(ResizeItem).at(0).getDOMNode();
        node.style.width = 'calc(70% - 5px)';
        update({ onChange: jest.fn() });
        expect(node.style.width).toBe('calc(70% - 5px)');
    });

    it('cancels a queued constraint check on unmount', () => {
        jest.useFakeTimers();
        wrapper = mount(render());
        wrapper.instance().foundation.ensureConstraint();
        wrapper.unmount();
        wrapper = null;
        expect(() => jest.runOnlyPendingTimers()).not.toThrow();
    });

    ['mouse', 'touch'].forEach(type => {
        it(`removes active ${type} drag listeners on unmount`, () => {
            wrapper = mount(render());
            const foundation = wrapper.instance().foundation;
            foundation.onResizeStart(0, { clientX: 0, clientY: 0, target: document.body }, type);
            const remove = jest.spyOn(window, 'removeEventListener');
            wrapper.unmount();
            wrapper = null;
            expect(remove).toHaveBeenCalledWith(type === 'mouse' ? 'mouseup' : 'touchend', foundation.onResizeEnd);
        });
    });
});
