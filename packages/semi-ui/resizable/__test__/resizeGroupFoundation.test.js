import { ResizeGroupFoundation } from '../../../semi-foundation/resizable/group';

/**
 * Reproduces #3336 at the foundation level: when a ResizeGroup is mounted inside a
 * display:none container, the group and its handlers report offset size 0, so item
 * sizes are computed with a `- 0px` handler offset. After the container becomes
 * visible the sizes must be recalculated (handleGroupResize), otherwise the two items
 * plus the handler overflow the group by the handler size.
 *
 * The jsdom ResizeObserver mock never fires a callback, so we drive handleGroupResize
 * directly to emulate the group becoming measurable.
 */
function createMockAdapter({ groupEl, handlerEls, itemEls, direction }) {
    return {
        getProp: key => ({ direction }[key]),
        getProps: () => ({ direction }),
        getState: () => undefined,
        getStates: () => ({}),
        getContext: () => undefined,
        getContexts: () => ({}),
        getGroupRef: () => groupEl,
        getHandler: i => handlerEls[i],
        getHandlerCount: () => handlerEls.length,
        getItem: i => itemEls[i],
        getItemCount: () => itemEls.length,
        getItemMin: () => undefined,
        getItemMax: () => undefined,
        getItemDefaultSize: () => undefined,
        getItemStart: () => undefined,
        getItemChange: () => undefined,
        getItemEnd: () => undefined,
        registerEvents: () => {},
        unregisterEvents: () => {},
    };
}

const makeEl = size => ({ offsetWidth: size, offsetHeight: size, style: {} });

describe('ResizeGroupFoundation - recalc after becoming visible (#3336)', () => {
    it('recalculates item sizes with the handler offset once the group is measurable', () => {
        // vertical group, 2 items + 1 handler, mounted inside display:none => all sizes 0
        const groupEl = makeEl(0);
        const handlerEls = [makeEl(0)];
        const itemEls = [makeEl(0), makeEl(0)];
        const adapter = createMockAdapter({ groupEl, handlerEls, itemEls, direction: 'vertical' });
        const foundation = new ResizeGroupFoundation(adapter);

        foundation.init();

        // initial (hidden) layout: 50% each, handler offset 0 => `- 0px`
        expect(foundation.sizeInitialized).toBe(false);
        expect(itemEls[0].style.height).toContain('- 0px');
        expect(itemEls[1].style.height).toContain('- 0px');

        // become visible: group 100px tall, handler 10px
        groupEl.offsetHeight = 100;
        groupEl.offsetWidth = 100;
        handlerEls[0].offsetHeight = 10;
        handlerEls[0].offsetWidth = 10;

        foundation.handleGroupResize();

        // recalculated: each item reserves half of the handler (10 / 2 = 5px)
        expect(foundation.sizeInitialized).toBe(true);
        expect(itemEls[0].style.height).toBe('calc(50% - 5px)');
        expect(itemEls[1].style.height).toBe('calc(50% - 5px)');
    });

    it('does not re-run initSpace on later resizes (keeps user drag results)', () => {
        const groupEl = makeEl(100);
        const handlerEls = [makeEl(10)];
        const itemEls = [makeEl(50), makeEl(50)];
        const adapter = createMockAdapter({ groupEl, handlerEls, itemEls, direction: 'vertical' });
        const foundation = new ResizeGroupFoundation(adapter);

        foundation.init();
        expect(foundation.sizeInitialized).toBe(true);

        // simulate the user having dragged item 0
        itemEls[0].style.height = 'calc(70% - 5px)';
        itemEls[1].style.height = 'calc(30% - 5px)';

        // a later group resize must not reset the layout back to the default 50/50
        groupEl.offsetHeight = 200;
        foundation.handleGroupResize();

        expect(itemEls[0].style.height).toBe('calc(70% - 5px)');
        expect(itemEls[1].style.height).toBe('calc(30% - 5px)');
    });
});
