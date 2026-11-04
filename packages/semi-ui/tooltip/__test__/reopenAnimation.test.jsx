import React from 'react';
import { mount, genBeforeEach, genAfterEach } from '../../_test_/utils/tooltip';
import Tooltip from '../index';
import Dropdown from '../../dropdown';

['Tooltip', 'Dropdown'].forEach(kind => {
    describe(`${kind} reopening during animation`, () => {
        let wrapper;
        const instance = () => kind === 'Tooltip' ? wrapper.instance() : wrapper.instance().tooltipRef.current;
        const finishAnimation = () => instance().renderPortal().props.children.props.children.props.onAnimationEnd();
        const settle = () => new Promise(resolve => setTimeout(resolve, 100));

        beforeEach(genBeforeEach());
        afterEach(genAfterEach());

        const render = async props => {
            wrapper = mount(kind === 'Tooltip'
                ? <Tooltip visible trigger="custom" content="tip" {...props}><button>target</button></Tooltip>
                : <Dropdown visible trigger="custom" render={<Dropdown.Menu><Dropdown.Item>item</Dropdown.Item></Dropdown.Menu>} {...props}><button>target</button></Dropdown>);
            await settle();
            finishAnimation();
        };

        afterEach(() => wrapper && wrapper.unmount());

        [false, true].forEach(keepDOM => {
            it(`replays a show requested during leave with keepDOM=${keepDOM}`, async () => {
                await render({ keepDOM });
                wrapper.setProps({ visible: false });
                expect(instance().isAnimating).toBe(true);
                wrapper.setProps({ visible: true });
                finishAnimation();
                await settle();
                expect(instance().state.visible).toBe(true);
                expect(instance().state.displayNone).toBe(false);
            });
        });

        it('keeps a later hide as the final request', async () => {
            await render({});
            wrapper.setProps({ visible: false });
            wrapper.setProps({ visible: true });
            wrapper.setProps({ visible: false });
            finishAnimation();
            await settle();
            expect(instance().state.visible).toBe(false);
        });

        it('still reopens immediately with motion disabled', async () => {
            await render({ motion: false });
            wrapper.setProps({ visible: false });
            wrapper.setProps({ visible: true });
            await settle();
            expect(instance().state.visible).toBe(true);
        });
    });
});
