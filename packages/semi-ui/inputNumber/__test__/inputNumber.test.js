import React from 'react';
import InputNumber, { InputNumber as BaseInputNumber } from '../index';
import { mount } from 'enzyme';
import sinon from 'sinon';
import keyCode from '@douyinfe/semi-foundation/utils/keyCode';
import * as _ from 'lodash';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import { Form, withField } from '../../index';

const log = (...args) => console.log(...args);
const times = (n = 0, fn) => {
    if (typeof n === 'number' && typeof fn === 'function') {
        for (let i = 0; i < n; i++) {
            fn(i);
        }
    }
};

describe(`InputNumber`, () => {
    /**
     * test appearance
     */
    it(`with 'defaultValue', 'showClear', 'size', 'suffix', 'ref'`, () => {
        const defaultValue = 1020;
        const sizeEntries = [
            ['default', `${BASE_CLASS_PREFIX}-input-default`],
            ['large', `${BASE_CLASS_PREFIX}-input-large`],
            ['small', `${BASE_CLASS_PREFIX}-input-small`],
        ];
        const showClear = true;

        sizeEntries.forEach(([size, className]) => {
            const inputNumber = mount(<InputNumber showClear={showClear} defaultValue={defaultValue} size={size} />);
            expect(inputNumber.find('input').hasClass(className)).toBe(true);
        });

        const inputNumberWithoutBtn = mount(<InputNumber defaultValue={defaultValue} hideButtons={true} />);
        expect(inputNumberWithoutBtn.find('button').length).toBe(0);

        /**
         * ref object
         */
        const refObject = { current: undefined };
        const inputNumberWithRefObject = mount(<InputNumber defaultValue={defaultValue} ref={refObject} />);

        expect(inputNumberWithRefObject.find('input').getDOMNode()).toBe(refObject.current);

        /**
         * ref function
         */
        let refNode = null;
        const refFn = sinon.spy(node => (refNode = node));
        const inputNumberWithRefFn = mount(<InputNumber defaultValue={defaultValue} ref={refFn} />);

        expect(refFn.calledOnce).toBe(true);
        expect(inputNumberWithRefFn.find('input').getDOMNode()).toBe(refNode);
    });

    /**
     * test events
     */
    it(`with 'value', 'onBlur', 'onChange', 'onInput', 'onFocus', 'onKeyDown'`, () => {
        const onChange = sinon.spy(log);
        const oldValue = 1020;
        const newValue = 1301;
        const newValidStr = '1309';
        const newInvalidValue = `1301fd`;
        const emptyValue = '';
        const event = {
            target: {
                value: newInvalidValue,
            },
        };

        const onBlur = sinon.spy();
        const onFocus = sinon.spy();
        const onKeyDown = sinon.spy();

        const inputNumber = mount(
            <InputNumber value={oldValue} onChange={onChange} onBlur={onBlur} onFocus={onFocus} onKeyDown={onKeyDown} />
        );

        inputNumber.find('input').simulate('change', event);

        expect(onChange.calledOnce).toBe(true);
        expect(onChange.calledWithMatch(event.target.value)).toBe(true);

        /**
         * set an invalid value and blur
         */
        inputNumber.find('input').simulate('focus');
        inputNumber.setProps({ value: newInvalidValue });
        inputNumber.find('input').simulate('blur');
        expect(onBlur.calledOnce).toBe(true);
        expect(inputNumber.find('input').instance().value).toBe(oldValue.toString());

        /**
         * empty
         */
        inputNumber.setProps({ value: emptyValue });
        expect(inputNumber.find('input').getDOMNode().value).toBe('');

        /**
         * focusing and set a valid value
         */
        inputNumber.find('input').simulate('focus');
        inputNumber.setProps({ value: newValue });
        inputNumber.find('input').simulate('blur');
        expect(inputNumber.find('input').instance().value).toBe(newValue.toString());

        /**
         * focusing and set a invalid value
         */
        inputNumber.find('input').simulate('focus');
        inputNumber.setProps({ value: newInvalidValue });
        inputNumber.find('input').simulate('blur');
        expect(inputNumber.find('input').instance().value).toBe(newValue.toString());

        /**
         * focusing and set a valid value string
         */
        inputNumber.find('input').simulate('focus');
        inputNumber.setProps({ value: newValidStr });
        inputNumber.find('input').simulate('blur');
        expect(inputNumber.find('input').instance().value).toBe(newValidStr);

        /**
         * press up arrow button and down arrow button
         *
         * @summary this testing not worked in jest
         */
        const upArrowPressedCount = 3;
        const downArrowPressedCount = 1;

        _.times(upArrowPressedCount, () => {
            inputNumber.find('input').simulate('keydown', { keyCode: keyCode.UP });
            // inputNumber.find('input').simulate('keypress', { key: 'ArrowUp' });
        });
        _.times(downArrowPressedCount, () => {
            inputNumber.find('input').simulate('keydown', { keyCode: keyCode.DOWN });
            // inputNumber.find('input').simulate('keypress', { key: 'ArrowDown' });
        });
        // expect(inputNumber.find('input').instance().value).toBe(
        //     String(Number(newValidStr) + upArrowPressedCount - downArrowPressedCount)
        // );
        expect(onKeyDown.called).toBe(true);
    });

    /**
     * test limits
     */
    it(`with 'max', 'min', 'value', 'onChange', 'precision', 'parser', 'formatter'`, () => {
        const oldValue = 1020.245;
        const newValue = 1302.921;
        const min = 1000;
        const max = 1300;
        const event = {
            target: {
                value: newValue,
            },
        };
        const precision = 2;
        const formatter = value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const parser = value => value.replace(/\$\s?|(,*)/g, '');

        const onChange = sinon.spy();
        const onBlur = sinon.spy();

        const inputNumber = mount(
            <InputNumber
                value={oldValue}
                onChange={onChange}
                min={min}
                max={max}
                onBlur={onBlur}
                precision={precision}
                formatter={formatter}
                parser={parser}
            />
        );
        const inputElem = inputNumber.find('input');

        inputElem.simulate('change', event);
        expect(onChange.calledOnce).toBe(true);
        expect(onChange.calledWithMatch(Number(newValue.toFixed(precision)))).toBe(true);
        expect(inputElem.instance().value).toBe(formatter(newValue));

        inputElem.simulate('blur');
        expect(onBlur.calledOnce).toBe(true);

        inputNumber.setProps({ value: newValue });
        expect(inputElem.instance().value).toBe(formatter(max.toFixed(precision)));

        inputNumber.setProps({ value: min - 100 });
        expect(inputElem.instance().value).toBe(formatter(min.toFixed(precision)));
    });

    /**
     * test buttons
     */
    it(`click add/minus button, 'onUpClick', 'onDownClick'`, async () => {
        const defaultValue = 1000;
        const onUpClick = sinon.spy();
        const onDownClick = sinon.spy();

        const inputNumber = mount(
            <InputNumber defaultValue={defaultValue} onUpClick={onUpClick} onDownClick={onDownClick} />
        );
        const inputElem = inputNumber.find('input');

        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);

        const addBtn = btns.first();
        const minusBtn = btns.last();

        const addCount = 3;
        const minusCount = 1;

        _.times(addCount, () => addBtn.simulate('mousedown'));
        _.times(minusCount, () => minusBtn.simulate('mousedown'));

        expect(inputElem.instance().value).toBe(String(defaultValue + addCount - minusCount));
        expect(onUpClick.called).toBe(true);
        expect(onDownClick.called).toBe(true);
    });

    it(`click inner add/minus button, 'onUpClick', 'onDownClick'`, async () => {
        const defaultValue = 1000;
        const onUpClick = sinon.spy();
        const onDownClick = sinon.spy();

        const inputNumber = mount(
            <InputNumber defaultValue={defaultValue} onUpClick={onUpClick} onDownClick={onDownClick} innerButtons={true} />
        );
        const inputElem = inputNumber.find('input');
        const inputWrapper = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number`);
        inputWrapper.simulate('mouseEnter');
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);

        const addBtn = btns.first();
        const minusBtn = btns.last();

        const addCount = 3;
        const minusCount = 1;

        _.times(addCount, () => addBtn.simulate('mousedown'));
        _.times(minusCount, () => minusBtn.simulate('mousedown'));

        expect(inputElem.instance().value).toBe(String(defaultValue + addCount - minusCount));
        expect(onUpClick.called).toBe(true);
        expect(onDownClick.called).toBe(true);
    });

    it('shiftStep prop', () => {
        // shiftStep test
        const inputNumber = mount(<InputNumber shiftStep={100} />);
        expect(inputNumber.props().shiftStep).toEqual(100);
        inputNumber.setProps({ shiftStep: 5 });
        inputNumber.update();
        expect(inputNumber.props().shiftStep).toEqual(5);
    });

    /**
     * test input focus, click button focus & default behavior without keepFocus prop
     */
    it('keepFocus prop', async () => {
        const defaultValue = 1;
        const onBlur = sinon.spy();
        const onFocus = sinon.spy();

        const inputNumber = mount(
            <InputNumber defaultValue={defaultValue} onBlur={onBlur} onFocus={onFocus} keepFocus={true} />
        );
        const inputElem = inputNumber.find('input');
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        const minusBtn = btns.last();

        // default focus
        expect(inputNumber.find(`.${BASE_CLASS_PREFIX}-input-wrapper-focus`).length).toBe(0);


        // click button focus
        const addCount = 3;
        const minusCount = 1;
        _.times(addCount, () => addBtn.simulate('mousedown'));
        _.times(addCount, () => addBtn.simulate('mouseup'));
        _.times(minusCount, () => minusBtn.simulate('mousedown'));
        _.times(minusCount, () => minusBtn.simulate('mouseup'));
        expect(inputElem.instance().value).toBe(String(defaultValue + addCount - minusCount));
        expect(inputNumber.find(BaseInputNumber).state('focusing')).toBeTruthy();
        inputNumber.find('input').simulate('blur');
        expect(inputNumber.find(BaseInputNumber).state('focusing')).toBeFalsy();

        // default behavior without keepFocus prop
        inputNumber.setProps({ keepFocus: false });
        inputNumber.update();
        addBtn.simulate('mousedown');
        addBtn.simulate('mouseup');
        expect(inputNumber.find(BaseInputNumber).state('focusing')).toBeFalsy();
    });

    it('controlled value out of range', () => {
        const max = 100;
        const event = {
            target: {
                value: max + 1,
            },
        };
        const onChange = sinon.spy();
        const onNumberChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={max} onNumberChange={onNumberChange} onChange={onChange} max={max} />);
        inputNumber.find('input').simulate('change', event);

        expect(onChange.calledOnce).toBe(true);
        expect(onChange.calledWithMatch(event.target.value)).toBe(true);
        // 受控超出范围时不应调用onNumberChange
        expect(onNumberChange.called).toBe(false);
        expect(inputNumber.find(BaseInputNumber).state('number')).toBe(max);
    });

    it('controlled value given NaN', () => {
        const initValue = 1;
        const newValue = NaN;
        const voidString = "";
        const inputNumber = mount(<InputNumber value={initValue} />);
        expect(inputNumber.find('input').instance().value).toBe(String(initValue));
        expect(inputNumber.find(BaseInputNumber).state('number')).toBe(initValue);
        inputNumber.setProps({ value: newValue });
        expect(inputNumber.find('input').instance().value).toBe(voidString);
        expect(inputNumber.find(BaseInputNumber).state('number')).toBe(null);

    });

    it('fix number minus bug', () => {
        const initValue = 0.9;
        const inputNumber = mount(<InputNumber defaultValue={initValue} step={0.1} max={1} />);
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const inputElem = inputNumber.find('input');
        const addBtn = btns.first();
        addBtn.simulate('mousedown');
        expect(inputElem.instance().value).toBe("1");
    })

    // Fix controlled setValue not processed by parser and formatter
    it('fix controlled setValue', () => {
        const onNumberChange = sinon.spy();
        const CustomInput = withField(InputNumber, { onKeyChangeFnName: 'onNumberChange' });
        const App = (
            <Form onValueChange={(v)=>console.log(v)}>
                <CustomInput
                    field='custom'
                    formatter={value => `${value}`.replace(/\D/g, '')}
                    onNumberChange={onNumberChange}
                />
            </Form>
        );

        const inputNumber = mount(App);
        const inputElem = inputNumber.find('input');
        const event = { target: { value: 'abc' }};
        inputElem.simulate('change', event);
        expect(onNumberChange.calledOnce).toBe(false);
        expect(inputElem.instance().value).toBe('');
        const newEvent = { target: { value: '123' }};
        inputElem.simulate('change', newEvent);
        expect(onNumberChange.calledOnce).toBe(true);
        expect(inputElem.instance().value).toBe('123');
    })
});
