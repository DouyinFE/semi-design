import React from 'react';
import { mount } from 'enzyme';
import Anchor from '../index';
import Typography from '../../typography';

describe('Anchor shared Tooltip options', () => {
    it('does not change the caller position when one Anchor overrides it', () => {
        const showTooltip = { type: 'tooltip', opts: { position: 'left', motion: false } };
        const wrapper = mount(<Anchor showTooltip={showTooltip} position="right"><Anchor.Link href="#first" title="first" /></Anchor>);
        try { expect(showTooltip.opts.position).toBe('left'); }
        finally { wrapper.unmount(); }
    });

    it('keeps another Anchor using the shared options at its original position', () => {
        const showTooltip = { type: 'tooltip', opts: { position: 'left', motion: false } };
        const wrapper = mount(<div>
            <Anchor showTooltip={showTooltip} position="right"><Anchor.Link href="#first" title="first" /></Anchor>
            <Anchor showTooltip={showTooltip}><Anchor.Link href="#second" title="second" /></Anchor>
        </div>);
        try {
            const options = wrapper.find(Typography.Text).map(node => node.prop('ellipsis').showTooltip.opts);
            expect(options).toEqual([{ position: 'right', motion: false }, { position: 'left', motion: false }]);
        } finally { wrapper.unmount(); }
    });

    it('preserves the position override with boolean showTooltip', () => {
        const wrapper = mount(<Anchor showTooltip position="right"><Anchor.Link href="#first" title="first" /></Anchor>);
        try { expect(wrapper.find(Typography.Text).prop('ellipsis').showTooltip.opts.position).toBe('right'); }
        finally { wrapper.unmount(); }
    });
});
