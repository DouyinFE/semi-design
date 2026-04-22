import React from 'react';
import { mount } from 'enzyme';
import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import OverflowList from '../index';

describe('OverflowList', () => {
    // it('render basic', () => {
    //     const node = mount(
    //         <OverflowList
    //             items={[{ key: 'alarm' }, { key: 'bookmark' }, { key: 'camera' }, { key: 'duration' }]}
    //             visibleItemRenderer={item => <div>{item.key}</div>}
    //             overflowRenderer={() => null}
    //         />
    //     );
    //     expect(node.find(`.${BASE_CLASS_PREFIX}-overflow-list`).exists()).toEqual(true);
    //     // expect(node.find(`.${BASE_CLASS_PREFIX}-overflow-list-spacer`).exists()).toEqual(true);
    // });
    it('render scroll', () => {
        const node = mount(
            <OverflowList
                items={[{ key: 'alarm' }, { key: 'bookmark' }, { key: 'camera' }, { key: 'duration' }]}
                visibleItemRenderer={item => <div>{item.key}</div>}
                overflowRenderer={() => [null, null]}
                renderMode="scroll"
            />
        );
        expect(node.find(`.${BASE_CLASS_PREFIX}-overflow-list`).exists()).toEqual(true);
        expect(node.find(`.${BASE_CLASS_PREFIX}-overflow-list-scroll-wrapper`).exists()).toEqual(true);
        node.unmount();
    });

    it('keeps collapse content visible when items update after first measurement', () => {
        const node = mount(
            <OverflowList
                items={[{ key: 'alarm' }, { key: 'bookmark' }]}
                visibleItemRenderer={item => <div>{item.key}</div>}
                overflowRenderer={() => null}
            />
        );

        node.setState({
            overflowStatus: 'normal',
            pivot: 1,
            visible: [{ key: 'alarm' }, { key: 'bookmark' }],
            overflow: [],
        });

        node.setProps({
            items: [{ key: 'alarm' }, { key: 'bookmark' }, { key: 'camera' }],
        });
        node.update();

        expect(node.find(`.${BASE_CLASS_PREFIX}-overflow-list`).prop('style').visibility).toEqual('visible');
        node.unmount();
    });
});
