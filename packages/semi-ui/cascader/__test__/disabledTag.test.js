import React from 'react';
import { mount } from 'enzyme';
import Cascader from '../index';

describe('Cascader disabled tag removal', () => {
    ['backspace', 'custom trigger'].forEach(source => {
        [true, false].forEach(disabled => {
            it(`${source} respects disabled=${disabled}`, () => {
                const onChange = sinon.spy();
                const treeData = [{
                    label: 'Zhejiang', value: 'zhejiang', children: [
                        { label: 'Hangzhou', value: 'hangzhou' },
                        { label: 'Ningbo', value: 'ningbo', disabled },
                    ],
                }];
                const triggerRender = source === 'custom trigger'
                    ? ({ onRemove }) => <button onClick={() => onRemove('0-1')}>Remove Ningbo</button>
                    : undefined;
                const wrapper = mount(<Cascader
                    multiple
                    filterTreeNode
                    treeData={treeData}
                    defaultValue={ [['zhejiang', 'ningbo']] }
                    onChange={onChange}
                    triggerRender={triggerRender}
                />);
                try {
                    if (source === 'backspace') {
                        wrapper.find('input').simulate('keydown', { key: 'Backspace', keyCode: 8 });
                        expect(wrapper.find('.semi-tag').length).toBe(disabled ? 1 : 0);
                    } else {
                        wrapper.find('button').simulate('click');
                    }
                    expect(onChange.callCount).toBe(disabled ? 0 : 1);
                    if (!disabled) {
                        expect(onChange.firstCall.args[0]).toEqual([]);
                    }
                } finally {
                    wrapper.unmount();
                }
            });
        });
    });
});
