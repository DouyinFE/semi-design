import React from 'react';
import { mount } from 'enzyme';
import Upload from '../index';
describe('Upload picture add keyboard access', ()=>{
    it('exposes the enabled add trigger in the tab order', ()=>{
        const wrapper = mount(<Upload action="/upload" listType="picture"/>);
        try {expect(wrapper.find('.semi-upload-picture-add').hostNodes().getDOMNode().tabIndex).toBe(0);} finally {wrapper.unmount();}
    });
    it.each(['Enter', ' '])('opens the file input from %j', key=>{
        const wrapper = mount(<Upload action="/upload" listType="picture"/>);
        const input = wrapper.find('input[type="file"]').at(0).getDOMNode(), click = rs.spyOn(input, 'click');
        try {wrapper.find('.semi-upload-picture-add').simulate('keydown', { key, preventDefault: rs.fn() });expect(click).toHaveBeenCalledTimes(1);} finally {click.mockRestore();wrapper.unmount();}
    });
    it('does not activate the disabled add trigger', ()=>{
        const wrapper = mount(<Upload action="/upload" listType="picture" disabled/>);
        const input = wrapper.find('input[type="file"]').at(0).getDOMNode(), click = rs.spyOn(input, 'click');
        try {expect(wrapper.find('.semi-upload-picture-add').hostNodes().getDOMNode().tabIndex).toBe(-1);wrapper.find('.semi-upload-picture-add').simulate('keydown', { key: 'Enter', preventDefault: rs.fn() });expect(click).not.toHaveBeenCalled();} finally {click.mockRestore();wrapper.unmount();}
    });
    it('preserves native activation of a custom child button', () => {
        const childClick = rs.fn();
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<Upload action="/upload" listType="picture"><button onClick={childClick}>Add</button></Upload>, { attachTo: container });
        const input = wrapper.find('input[type="file"]').at(0).getDOMNode();
        const click = rs.spyOn(input, 'click');
        try {
            const button = wrapper.find('button').getDOMNode();
            const key = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
            button.dispatchEvent(key);
            expect(key.defaultPrevented).toBe(false);
            expect(click).not.toHaveBeenCalled();
            button.click();
            expect(childClick).toHaveBeenCalledTimes(1);
            expect(click).toHaveBeenCalledTimes(1);
        } finally {
            click.mockRestore();
            wrapper.unmount();
            container.remove();
        }
    });
});

