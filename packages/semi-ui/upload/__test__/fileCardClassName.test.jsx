import React from 'react';
import { mount } from 'enzyme';
import Upload from '../index';
describe('Upload.FileCard public className', ()=>{
    it.each(['list', 'picture'])('applies and updates the caller class for %s', listType=>{
        const wrapper = mount(<Upload.FileCard name="file" listType={listType} className="caller-one"/>);
        try {const node = wrapper.find('[role="listitem"]').hostNodes().getDOMNode();expect(node.classList.contains('caller-one')).toBe(true);wrapper.setProps({ className: 'caller-two' });expect(node.classList.contains('caller-two')).toBe(true);expect(node.classList.contains('caller-one')).toBe(false);wrapper.setProps({ className: undefined });expect(node.classList.contains('caller-two')).toBe(false);} finally {wrapper.unmount();}
    });
    it('retains the existing inline style', ()=>{
        const wrapper = mount(<Upload.FileCard name="file" style={{ padding: 12 }}/>);
        try {expect(wrapper.find('[role="listitem"]').hostNodes().getDOMNode().style.padding).toBe('12px');} finally {wrapper.unmount();}
    });
});

