import React from 'react';
import sinon from 'sinon';
import { getByRole } from '@testing-library/dom';
import AutoComplete from '../index';

const data = ['Alpha', 'Beta', 'Gamma'];
const press = (wrapper, keyCode) => wrapper.find('input').simulate('keyDown', { keyCode, preventDefault() {} });
const getInput = wrapper => getByRole(wrapper.find('input').getDOMNode().parentElement, 'combobox');

describe('AutoComplete combobox relationships', () => {
    it('exposes the closed input as a named combobox', () => {
        const wrapper = mount(<AutoComplete data={data} aria-label="Search choices" motion={false} />);
        try {
            const input = getInput(wrapper);
            expect(input.getAttribute('aria-label')).toEqual('Search choices');
            expect(input.getAttribute('aria-expanded')).toEqual('false');
            expect(input.getAttribute('aria-autocomplete')).toEqual('list');
            expect(input.hasAttribute('aria-controls')).toEqual(false);
            expect(input.hasAttribute('aria-activedescendant')).toEqual(false);
        } finally {
            wrapper.unmount();
        }
    });

    it('links default-open instances to separate option lists', () => {
        const first = mount(<AutoComplete data={data} defaultOpen motion={false} />);
        const second = mount(<AutoComplete data={data} defaultOpen motion={false} />);
        try {
            const firstInput = getInput(first);
            const secondInput = getInput(second);
            expect(firstInput.getAttribute('aria-expanded')).toEqual('true');
            expect(secondInput.getAttribute('aria-expanded')).toEqual('true');
            const firstId = firstInput.getAttribute('aria-controls');
            const secondId = secondInput.getAttribute('aria-controls');
            expect(firstId).not.toEqual(secondId);
            expect(document.getElementById(firstId).getAttribute('role')).toEqual('listbox');
            expect(document.getElementById(secondId).getAttribute('role')).toEqual('listbox');
        } finally {
            first.unmount();
            second.unmount();
        }
    });

    it('points to the keyboard-highlighted option and clears relationships after selection', () => {
        const onSelect = sinon.spy();
        const wrapper = mount(<AutoComplete data={data} defaultActiveFirstOption motion={false} onSelect={onSelect} />);
        try {
            wrapper.find('input').simulate('focus');
            press(wrapper, 40);
            const input = getInput(wrapper);
            const firstId = input.getAttribute('aria-activedescendant');
            expect(document.getElementById(firstId).textContent).toEqual('Alpha');
            press(wrapper, 40);
            const activeId = input.getAttribute('aria-activedescendant');
            expect(activeId).not.toEqual(firstId);
            expect(document.getElementById(activeId).getAttribute('role')).toEqual('option');
            expect(document.getElementById(activeId).textContent).toEqual('Beta');
            press(wrapper, 13);
            expect(onSelect.firstCall.args[0]).toEqual('Beta');
            expect(input.getAttribute('aria-expanded')).toEqual('false');
            expect(input.hasAttribute('aria-controls')).toEqual(false);
            expect(input.hasAttribute('aria-activedescendant')).toEqual(false);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps a real option target with renderItem and preserves selected object data', () => {
        const objectData = [{ value: 'a', label: 'Alpha', id: 'user-a', optionId: 'data-a' }, { value: 'b', label: 'Beta', id: 'user-b', optionId: 'data-b' }];
        const onSelect = sinon.spy();
        const wrapper = mount(<AutoComplete data={objectData} defaultActiveFirstOption motion={false} renderItem={item => <strong>Candidate {item.label}</strong>} onSelectWithObject onSelect={onSelect} />);
        try {
            wrapper.find('input').simulate('focus');
            press(wrapper, 40);
            press(wrapper, 40);
            const input = getInput(wrapper);
            const active = document.getElementById(input.getAttribute('aria-activedescendant'));
            expect(active.getAttribute('role')).toEqual('option');
            expect(active.textContent).toEqual('Candidate Beta');
            expect(active.querySelector('strong').textContent).toEqual('Candidate Beta');
            press(wrapper, 13);
            expect(onSelect.firstCall.args[0].value).toEqual('b');
            expect(onSelect.firstCall.args[0].id).toEqual('user-b');
            expect(onSelect.firstCall.args[0].optionId).toEqual('data-b');
            expect(onSelect.firstCall.args[0]._optionId).toEqual(undefined);
            onSelect.resetHistory();
            wrapper.find('input').simulate('click');
            wrapper.find('.semi-autocomplete-option').at(1).simulate('click');
            expect(onSelect.firstCall.args[0].id).toEqual('user-b');
            expect(onSelect.firstCall.args[0].optionId).toEqual('data-b');
            expect(onSelect.firstCall.args[0]._optionId).toEqual(undefined);
        } finally {
            wrapper.unmount();
        }
    });

    it('does not reference an active option when the list is empty', () => {
        const wrapper = mount(<AutoComplete data={[]} defaultOpen defaultActiveFirstOption motion={false} />);
        try {
            expect(getInput(wrapper).hasAttribute('aria-activedescendant')).toEqual(false);
        } finally {
            wrapper.unmount();
        }
    });

    it('does not reference a generated id when a custom option replaces the DOM', () => {
        const customData = [{ value: 'a', label: 'Alpha', renderOptionItem: () => <span role="option">Custom DOM</span> }];
        const wrapper = mount(<AutoComplete data={customData} defaultOpen defaultActiveFirstOption motion={false} />);
        try {
            expect(getInput(wrapper).hasAttribute('aria-activedescendant')).toEqual(false);
            expect(wrapper.find('span[role="option"]').text()).toEqual('Custom DOM');
        } finally {
            wrapper.unmount();
        }
    });
});
