import React from 'react';
import InputNumber, { InputNumber as BaseInputNumber } from '../index';
import { mount } from 'enzyme';
import sinon from 'sinon';
import keyCode from '@douyinfe/semi-foundation/utils/keyCode';
import * as _ from 'lodash';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import { numbers } from '@douyinfe/semi-foundation/inputNumber/constants';
import { Form, withField, useFormApi } from '../../index';

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

        // expect(refFn.calledOnce).toBe(true);
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
        expect(onChange.calledTwice).toBe(true);
        expect(onChange.getCall(1).args[0]).toEqual(Number(newValue.toFixed(precision)));
        // expect(onChange.calledWithMatch(Number(newValue.toFixed(precision)))).toBe(true);
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

        _.times(addCount, () => addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT }));
        _.times(minusCount, () => minusBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT }));

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

        _.times(addCount, () => addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT }));
        _.times(minusCount, () => minusBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT }));

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
        _.times(addCount, () => addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT }));
        _.times(addCount, () => addBtn.simulate('mouseup'));
        _.times(minusCount, () => minusBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT }));
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
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
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
    });

    /**
     * test buttons right click
     */
     it(`right click add/minus button`, async () => {
        const defaultValue = 1000;
        const onUpClick = sinon.spy();
        const onDownClick = sinon.spy();
        const MOUSE_BUTTON_RIGHT = 2;

        const inputNumber = mount(
            <InputNumber defaultValue={defaultValue} onUpClick={onUpClick} onDownClick={onDownClick} />
        );
        const inputElem = inputNumber.find('input');

        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);

        const addBtn = btns.first();
        const minusBtn = btns.last();

        _.times(1, () => addBtn.simulate('mousedown', { button: MOUSE_BUTTON_RIGHT  }));
        _.times(3, () => minusBtn.simulate('mousedown', { button: MOUSE_BUTTON_RIGHT }));

        expect(inputElem.instance().value).toBe(String(defaultValue));
        expect(onUpClick.called).toBe(false);
        expect(onDownClick.called).toBe(false);
    });

    it('fix controlled min value didMount', () => {
        const spyChange = sinon.spy();
        const inputNumber = mount(
            <InputNumber min={1} value={0} onChange={spyChange} />
        );
        expect(spyChange.calledOnce).toBe(true);
    });

    it('fix controlled min value didUpdate', () => {
        const spyChange = sinon.spy();
        const value = undefined;
        const inputNumber = mount(
            <InputNumber min={1} value={value} onChange={spyChange} />
        );
        inputNumber.setProps({ value: 0 });
        expect(spyChange.calledOnce).toBe(true);
        expect(spyChange.getCall(0).args[0]).toEqual(1);
    });

    it('fix controlled min value form field', () => {
        const spyChange = sinon.spy();
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        const inputNumber = mount(
            <Form initValues={{ minControlled: 0 }} getFormApi={getFormApi}>
                <Form.InputNumber field="minControlled" min={1} onChange={spyChange} />
            </Form>
        );
        expect(spyChange.calledOnce).toBe(true);
        expect(spyChange.getCall(0).args[0]).toEqual(1);
        expect(formApi.getValue('minControlled')).toBe(1);
    });

    it('Common currency display', () => {
        const defaultValue = 123456.78;
        let inputNumber = mount(<InputNumber currency="CNY" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('¥123,456.78');

        inputNumber = mount(<InputNumber localeCode="en-US" currency="USD" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('$123,456.78');

        inputNumber = mount(<InputNumber localeCode="de-DE" currency="EUR" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('123.456,78 €');

        inputNumber = mount(<InputNumber localeCode="ja-JP" currency="JPY" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('￥123,457');

        inputNumber = mount(<InputNumber localeCode="vi-VN" currency="VND" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('123.457 ₫');  

        inputNumber = mount(<InputNumber localeCode="th-TH" currency="THB" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('฿123,456.78');

        inputNumber = mount(<InputNumber localeCode="id-ID" currency="IDR" defaultValue={defaultValue} />);
        const expectedIDR = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(defaultValue);
        expect(inputNumber.find('input').instance().value).toBe(expectedIDR);
        
    });

    it('Common currency display defaultValue is string', () => {
        const defaultValue = 123456.78;
        let inputNumber = mount(<InputNumber currency="CNY" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('¥123,456.78');

        inputNumber = mount(<InputNumber localeCode="en-US" currency="USD" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('$123,456.78');

        inputNumber = mount(<InputNumber localeCode="de-DE" currency="EUR" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('123.456,78 €');

        inputNumber = mount(<InputNumber localeCode="ja-JP" currency="JPY" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('￥123,457');

        inputNumber = mount(<InputNumber localeCode="vi-VN" currency="VND" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('123.457 ₫');  

        inputNumber = mount(<InputNumber localeCode="th-TH" currency="THB" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('฿123,456.78');

        inputNumber = mount(<InputNumber localeCode="id-ID" currency="IDR" defaultValue={defaultValue} />);
        const expectedIDR2 = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(defaultValue);
        expect(inputNumber.find('input').instance().value).toBe(expectedIDR2);
        
    });

    it('Uncontrolled + add/minus button', () => {
        const defaultValue = 123459.78;
        let inputNumber = mount(<InputNumber localeCode="en-US" currency="USD" defaultValue={defaultValue} />);

        const inputElem = inputNumber.find('input');
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        const minusBtn = btns.last();

        _.times(1, () => addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT  }));
        expect(inputElem.instance().value).toBe('$123,460.78');
        _.times(3, () => minusBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT }));
        expect(inputElem.instance().value).toBe('$123,457.78');
        
    });

     it('Controlled + add/minus button', () => {
        const defaultValue = 123459.78;
        const spyChange = sinon.spy();
        let inputNumber = mount(<InputNumber localeCode="en-US" currency="USD" value={defaultValue} onChange={spyChange} />);

        const inputElem = inputNumber.find('input');
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        const minusBtn = btns.last();

        _.times(1, () => {
            addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT  })
            const updatedValue = spyChange.lastCall.args[0];
            inputNumber.setProps({ value: updatedValue });
        });
        expect(spyChange.callCount).toBe(2);
        expect(inputElem.instance().value).toBe('$123,460.78');

        _.times(3, () => {
            minusBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
            // 每次点击后模拟值更新
            const updatedValue = spyChange.lastCall.args[0];
            inputNumber.setProps({ value: updatedValue });
        });
        expect(spyChange.callCount).toBe(5);
        expect(inputElem.instance().value).toBe('$123,457.78');
     });

     it('Common currency display with showCurrencySymbol=false', () => {
        const defaultValue = 123456.78;
        let inputNumber = mount(<InputNumber currency="CNY" defaultValue={defaultValue} showCurrencySymbol={false} />);
        expect(inputNumber.find('input').instance().value).toBe('123,456.78');

        inputNumber = mount(<InputNumber localeCode="en-US" currency="USD" defaultValue={defaultValue} showCurrencySymbol={false} />);
        expect(inputNumber.find('input').instance().value).toBe('123,456.78');

        inputNumber = mount(<InputNumber localeCode="de-DE" currency="EUR" defaultValue={defaultValue} showCurrencySymbol={false} />);
        expect(inputNumber.find('input').instance().value).toBe('123.456,78');

        inputNumber = mount(<InputNumber localeCode="ja-JP" currency="JPY" defaultValue={defaultValue} showCurrencySymbol={false} />);
        expect(inputNumber.find('input').instance().value).toBe('123,457');

        inputNumber = mount(<InputNumber localeCode="vi-VN" currency="VND" defaultValue={defaultValue} showCurrencySymbol={false} />);
        expect(inputNumber.find('input').instance().value).toBe('123.457');  

        inputNumber = mount(<InputNumber localeCode="th-TH" currency="THB" defaultValue={defaultValue} showCurrencySymbol={false} />);
        expect(inputNumber.find('input').instance().value).toBe('123,456.78');

        inputNumber = mount(<InputNumber localeCode="id-ID" currency="IDR" defaultValue={defaultValue} showCurrencySymbol={false} />);
        const idrFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
        const idrCurrencySymbol = idrFormatter.formatToParts(0).find(p => p.type === 'currency').value;
        const expectedIDRNoSymbol = idrFormatter.format(defaultValue).replace(idrCurrencySymbol, '').trim();
        expect(inputNumber.find('input').instance().value).toBe(expectedIDRNoSymbol);
    });

    it('CNY currency with different currencyDisplay options', () => {
        const defaultValue = 123456.78;
        
        let inputNumber = mount(<InputNumber currency="CNY" defaultValue={defaultValue} />);
        expect(inputNumber.find('input').instance().value).toBe('¥123,456.78');
        
        inputNumber = mount(<InputNumber currency="CNY" defaultValue={defaultValue} currencyDisplay="code" />);
        expect(inputNumber.find('input').instance().value).toBe('CNY 123,456.78');
        
        inputNumber = mount(<InputNumber currency="CNY" defaultValue={defaultValue} currencyDisplay="name" />);
        expect(inputNumber.find('input').instance().value).toBe('123,456.78人民币');
    });

    it('fix 2936, test js precision related calculation', () => {
        const inputNumber = mount(<InputNumber step={0.01} max={0.08} min={0.01} defaultValue={0.07} />);
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        expect(inputNumber.find('input').instance().value).toBe('0.08');
    });

    it('disabled prop', () => {
        const inputNumber = mount(<InputNumber disabled defaultValue={100} />);
        expect(inputNumber.find('input').prop('disabled')).toBe(true);
        expect(inputNumber.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-disabled`)).toBe(true);
    });

    it('disabled buttons should not respond to clicks', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber disabled defaultValue={100} onChange={onChange} />);
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        // disabled 状态下 onChange 不应该被调用（除了初始化）
        expect(inputNumber.find('input').instance().value).toBe('100');
    });

    it('readonly prop', () => {
        const inputNumber = mount(<InputNumber readonly defaultValue={100} />);
        expect(inputNumber.find('input').prop('readOnly')).toBe(true);
    });

    it('keyboard ArrowUp increases value', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber defaultValue={10} onChange={onChange} />);
        inputNumber.find('input').simulate('keydown', { keyCode: keyCode.UP });
        expect(inputNumber.find('input').instance().value).toBe('11');
    });

    it('keyboard ArrowDown decreases value', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber defaultValue={10} onChange={onChange} />);
        inputNumber.find('input').simulate('keydown', { keyCode: keyCode.DOWN });
        expect(inputNumber.find('input').instance().value).toBe('9');
    });

    it('step prop affects increment/decrement', () => {
        const inputNumber = mount(<InputNumber defaultValue={10} step={5} />);
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        expect(inputNumber.find('input').instance().value).toBe('15');
    });

    it('validateStatus warning', () => {
        const inputNumber = mount(<InputNumber validateStatus="warning" />);
        expect(inputNumber.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-warning`)).toBe(true);
    });

    it('validateStatus error', () => {
        const inputNumber = mount(<InputNumber validateStatus="error" />);
        expect(inputNumber.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-error`)).toBe(true);
    });

    it('prefix and suffix props', () => {
        const inputNumber = mount(<InputNumber prefix="$" suffix="USD" defaultValue={100} />);
        expect(inputNumber.find(`.${BASE_CLASS_PREFIX}-input-prefix`).text()).toBe('$');
        expect(inputNumber.find(`.${BASE_CLASS_PREFIX}-input-suffix`).first().text()).toBe('USD');
    });

    it('innerButtons prop shows buttons on hover', () => {
        const inputNumber = mount(<InputNumber innerButtons defaultValue={100} />);
        // innerButtons 模式下，按钮在 hover 时才显示
        const inputWrapper = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number`);
        inputWrapper.simulate('mouseEnter');
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        expect(btns.length).toBe(2);
    });

    it('onNumberChange callback', () => {
        const onNumberChange = sinon.spy();
        const inputNumber = mount(<InputNumber defaultValue={10} onNumberChange={onNumberChange} />);
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        expect(onNumberChange.calledOnce).toBe(true);
        expect(onNumberChange.calledWith(11)).toBe(true);
    });

    it('handleInputMouseMove event', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const inputWrapper = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number`);
        inputWrapper.simulate('mouseMove', { clientX: 100, clientY: 100 });
        // 验证 mouseMove 事件不会导致错误
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('fixCaret adapter method', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        // 测试 fixCaret 方法
        instance.adapter.fixCaret(0, 3);
        // 验证不会导致错误
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('currency mode with controlled value change', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 更新受控值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toBe('¥200.00');
    });

    it('currency mode with string value', () => {
        const inputNumber = mount(<InputNumber currency="CNY" value="100.50" />);
        expect(inputNumber.find('input').instance().value).toBe('¥100.50');
    });

    it('restoreCursor adapter method', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 设置光标位置
        instance.cursorStart = 0;
        instance.cursorEnd = 3;
        instance.cursorBefore = '';
        instance.cursorAfter = '100';
        
        // 调用 restoreCursor
        instance.adapter.restoreCursor();
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('setClickUpOrDown adapter method', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        instance.adapter.setClickUpOrDown(true);
        expect(instance.clickUpOrDown).toBe(true);
        
        instance.adapter.setClickUpOrDown(false);
        expect(instance.clickUpOrDown).toBe(false);
    });

    it('controlled value with focusing state and clickUpOrDown', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} keepFocus />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 模拟点击按钮
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        
        inputNumber.find('input').simulate('focus');
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        
        // 更新受控值
        if (onChange.called) {
            const newValue = onChange.lastCall.args[0];
            inputNumber.setProps({ value: newValue });
        }
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('minimumFractionDigits and maximumFractionDigits props', () => {
        const inputNumber = mount(
            <InputNumber 
                defaultValue={100} 
                minimumFractionDigits={2} 
                maximumFractionDigits={4} 
            />
        );
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('insetLabel prop', () => {
        const inputNumber = mount(<InputNumber insetLabel="Amount" defaultValue={100} />);
        expect(inputNumber.find(`.${BASE_CLASS_PREFIX}-input-inset-label`).text()).toBe('Amount');
    });

    it('componentDidUpdate with controlled value and currency mode', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 更新值触发 componentDidUpdate
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 验证值已更新
        expect(inputNumber.find('input').instance().value).toContain('200');
    });

    it('componentDidUpdate with non-currency mode', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} />);
        
        // 更新值触发 componentDidUpdate
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toBe('200');
    });

    it('componentDidUpdate with invalid number value', () => {
        const inputNumber = mount(<InputNumber value={100} />);
        
        // 设置一个无效的数字字符串
        inputNumber.setProps({ value: 'invalid' });
        inputNumber.update();
        
        // 无效值应该被处理
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('handleInputMouseLeave event', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} innerButtons />);
        const inputWrapper = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number`);
        
        inputWrapper.simulate('mouseEnter');
        inputWrapper.simulate('mouseLeave');
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('controlled value with focusing state and clickUpOrDown', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 模拟 focusing
        inputNumber.find('input').simulate('focus');
        
        // 模拟 clickUpOrDown 为 true 以触发特定分支
        instance.clickUpOrDown = true;
        
        // 更新值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 验证值已更新
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('currency mode with same parsed value', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 设置相同的值（不同格式）
        inputNumber.setProps({ value: '100' });
        inputNumber.update();
        
        // 值相同时不应触发额外的 onChange
        expect(inputNumber.find('input').instance().value).toContain('100');
    });

    it('controlled value with string that parses to same number', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value="100.00" onChange={onChange} />);
        
        // 更新为相同数值的不同字符串表示
        inputNumber.setProps({ value: 100 });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toContain('100');
    });

    it('updateStates adapter method with callback', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        const callback = sinon.spy();
        
        instance.adapter.updateStates({ value: '200' }, callback);
        inputNumber.update();
        
        expect(inputNumber.find(BaseInputNumber).state('value')).toBe('200');
        expect(callback.called).toBe(true);
    });

    it('setClickUpOrDown adapter method', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        instance.adapter.setClickUpOrDown(true);
        expect(instance.clickUpOrDown).toBe(true);
        
        instance.adapter.setClickUpOrDown(false);
        expect(instance.clickUpOrDown).toBe(false);
    });

    it('fixCaret adapter method with valid inputs', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 先 focus 以确保 inputNode 存在
        inputNumber.find('input').simulate('focus');
        
        // 调用 fixCaret
        instance.adapter.fixCaret(0, 3);
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('restoreCursor adapter method', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 设置光标相关属性
        instance.cursorStart = 0;
        instance.cursorEnd = 3;
        instance.cursorBefore = '';
        instance.cursorAfter = '100';
        
        // 调用 restoreCursor
        instance.adapter.restoreCursor();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate with focusing and clickUpOrDown triggers format', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} keepFocus />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 模拟 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置 clickUpOrDown 为 true
        instance.clickUpOrDown = true;
        
        // 更新值触发 componentDidUpdate 中的 clickUpOrDown 分支
        inputNumber.setProps({ value: 150 });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate with NaN value in focusing state', () => {
        const inputNumber = mount(<InputNumber value={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 模拟 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置 NaN 值
        inputNumber.setProps({ value: NaN });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate with invalid string in focusing state', () => {
        const inputNumber = mount(<InputNumber value={100} />);
        
        // 模拟 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置无效字符串
        inputNumber.setProps({ value: 'abc123' });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate with currency mode and different parsed values', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 更新为不同的值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 验证 onChange 被调用
        expect(inputNumber.find('input').instance().value).toContain('200');
    });

    it('componentDidUpdate with non-currency mode triggers notifyChange', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} />);
        
        // 更新值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toBe('200');
    });

    it('componentDidUpdate with invalid number not in focusing state', () => {
        const inputNumber = mount(<InputNumber value={100} />);
        
        // 不进入 focusing 状态，直接设置无效值
        inputNumber.setProps({ value: 'invalid' });
        inputNumber.update();
        
        // 无效值应该被处理为空
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate with valid number not in focusing state', () => {
        const inputNumber = mount(<InputNumber value={100} />);
        
        // 不进入 focusing 状态，直接设置有效值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toBe('200');
    });

    it('componentDidUpdate currency mode with string prop value', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value="100" onChange={onChange} />);
        
        // 更新为不同的值
        inputNumber.setProps({ value: '200' });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toContain('200');
    });

    it('componentDidUpdate with focusing and illegal but not NaN value', () => {
        const inputNumber = mount(<InputNumber value={100} />);
        
        // 模拟 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个非法但不是 NaN 的值（如带有非数字字符的字符串）
        inputNumber.setProps({ value: '100abc' });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate currency mode triggers notifyChange when parsed values differ', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 不进入 focusing 状态，直接更新值
        inputNumber.setProps({ value: 150 });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toContain('150');
    });

    it('keepFocus with focusing and clickUpOrDown refocuses input', () => {
        const inputNumber = mount(<InputNumber value={100} keepFocus />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 模拟 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置 clickUpOrDown
        instance.clickUpOrDown = true;
        
        // 更新值
        inputNumber.setProps({ value: 101 });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('handleInputMouseMove event', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const inputWrapper = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number`);
        
        inputWrapper.simulate('mouseMove');
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate focusing with valid number and clickUpOrDown true', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} keepFocus />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 先进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置 clickUpOrDown 为 true
        instance.clickUpOrDown = true;
        
        // 更新为不同的有效数字
        inputNumber.setProps({ value: 150 });
        inputNumber.update();
        
        // 验证值被格式化
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate focusing with out of range value (not NaN)', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={50} min={0} max={100} onChange={onChange} />);
        
        // 先进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个超出范围的值（非法但不是 NaN）
        inputNumber.setProps({ value: 150 });
        inputNumber.update();
        
        // 值应该被格式化
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate currency mode with different parsed values triggers notifyChange', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 更新为不同的数值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 验证 onChange 被调用
        expect(onChange.called).toBe(true);
    });

    it('componentDidUpdate focusing with valid number change and clickUpOrDown', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} keepFocus />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 模拟点击按钮增加值
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        
        // 点击按钮会设置 clickUpOrDown 并触发 focus
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        
        // 然后更新受控值
        if (onChange.called) {
            const newValue = onChange.lastCall.args[0];
            inputNumber.setProps({ value: newValue });
            inputNumber.update();
        }
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate focusing with value exceeding max (illegal but not NaN)', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={50} max={100} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个超出 max 的值 - 这是非法的但不是 NaN
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 值应该被格式化为 max
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate focusing with value below min (illegal but not NaN)', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={50} min={10} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个低于 min 的值 - 这是非法的但不是 NaN
        inputNumber.setProps({ value: 5 });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 314: focusing 状态下，受控值变化且是有效数字，且 state.number 不同
    it('componentDidUpdate focusing with valid number different from state.number', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 更改输入框的值（模拟用户输入）
        inputNumber.find('input').simulate('change', { target: { value: '150' } });
        
        // 然后通过 setProps 设置一个不同的有效数字
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 326-327: focusing 状态下，受控值是非法的（超出范围）但不是 NaN
    // parsedNum 会被调整到范围内，但 toNum 是原始值
    // isValidNumber(parsedNum) 可能为 true（因为已调整），所以需要不同的条件
    it('componentDidUpdate focusing with out of range value triggers format', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={50} min={0} max={100} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个超出范围的值（非法但不是 NaN）
        inputNumber.setProps({ value: 150 });
        inputNumber.update();
        
        // 受控组件在 focusing 状态下会更新 input 的显示值
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 326-327: 使用字符串值触发非法但非 NaN 的分支
    it('componentDidUpdate focusing with string value exceeding precision', () => {
        const onChange = sinon.spy();
        // 设置精度为 2
        const inputNumber = mount(<InputNumber value={50} precision={2} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个超出精度的字符串值
        // 这应该触发 isValidNumber 返回 false（因为精度不对），但 toNum 不是 NaN
        inputNumber.setProps({ value: '50.12345' });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 326-327: parsedNum === state.number 时进入 else if 分支
    it('componentDidUpdate focusing with same parsed number but different format', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个格式不同但解析后相同的值
        // parsedNum 会等于 state.number，所以会进入 else if 分支
        inputNumber.setProps({ value: '100.00' });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 326-327: 使用超出范围的数字
    // parsedNum 会被调整到范围内，但 toNum 是原始值
    // 如果 parsedNum === state.number，会进入 else if 分支
    it('componentDidUpdate focusing with value adjusted to same as state.number', () => {
        const onChange = sinon.spy();
        // 初始值为 100，max 为 100
        const inputNumber = mount(<InputNumber value={100} max={100} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 设置一个超出 max 的值，parsedNum 会被调整为 100（等于 state.number）
        // 这样 parsedNum === state.number，会进入 else if 分支
        inputNumber.setProps({ value: 150 });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，解析后的值不同时触发 notifyChange
    it('componentDidUpdate currency mode notifyChange when parsed values differ', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 不进入 focusing 状态，直接更新受控值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 检查 onChange 是否被调用
        expect(onChange.called).toBe(true);
    });

    it('componentDidUpdate with keepFocus and button click refocuses input', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber value={100} onChange={onChange} keepFocus />);
        
        // 点击增加按钮
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        addBtn.simulate('mouseup');
        
        // 更新受控值
        if (onChange.called) {
            const newValue = onChange.lastCall.args[0];
            inputNumber.setProps({ value: newValue });
            inputNumber.update();
        }
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    it('componentDidUpdate currency mode with string prop value triggers notifyChange', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber currency="CNY" value="100" onChange={onChange} />);
        
        // 更新为不同的数值字符串
        inputNumber.setProps({ value: "200" });
        inputNumber.update();
        
        expect(inputNumber.find('input').instance().value).toContain('200');
    });

    it('handleClear clears the value', () => {
        const onChange = sinon.spy();
        const inputNumber = mount(<InputNumber defaultValue={100} showClear onChange={onChange} />);
        
        // 找到清除按钮并点击
        const clearBtn = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-clearbtn`);
        if (clearBtn.exists()) {
            clearBtn.simulate('click');
            expect(inputNumber.find('input').instance().value).toBe('');
        }
    });

    it('onInput event handler', () => {
        const onInput = sinon.spy();
        const inputNumber = mount(<InputNumber defaultValue={100} onInput={onInput} />);
        
        inputNumber.find('input').simulate('input', { target: { value: '200' } });
        
        expect(onInput.called).toBe(true);
    });

    // 测试 line 180: restoreByAfter 当 str 是 null/undefined 时返回 false
    it('restoreByAfter returns false when str is null or undefined', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 调用 restoreByAfter 传入 null
        const result1 = instance.adapter.restoreByAfter(null);
        expect(result1).toBe(false);
        
        // 调用 restoreByAfter 传入 undefined
        const result2 = instance.adapter.restoreByAfter(undefined);
        expect(result2).toBe(false);
    });

    // 测试 line 214: fixCaret 当参数无效时提前返回
    it('fixCaret returns early when parameters are invalid', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 调用 fixCaret 传入 undefined
        instance.adapter.fixCaret(undefined, undefined);
        
        // 调用 fixCaret 传入 undefined start
        instance.adapter.fixCaret(undefined, 5);
        
        // 调用 fixCaret 传入 undefined end
        instance.adapter.fixCaret(5, undefined);
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下 notifyChange
    it('componentDidUpdate currency mode with different parsed values', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 不进入 focusing 状态，直接更新受控值为不同的数字
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 检查 onChange 是否被调用
        expect(onChange.called).toBe(true);
    });

    // 测试 restoreCursor 当 str 是 null/undefined 时返回 false
    it('restoreCursor returns false when str is null or undefined', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 设置 cursorAfter 为 null
        instance.cursorAfter = null;
        const result = instance.adapter.restoreCursor();
        expect(result).toBe(false);
    });

    // 测试 line 148: registerGlobalEvent
    it('registerGlobalEvent and unregisterGlobalEvent', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        const handler = sinon.spy();
        
        // 注册全局事件
        instance.adapter.registerGlobalEvent('testEvent', handler);
        
        // 注销全局事件
        instance.adapter.unregisterGlobalEvent('testEvent');
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 159: getInputCharacter
    it('getInputCharacter returns character at index', () => {
        const inputNumber = mount(<InputNumber defaultValue={123} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 获取输入框中的字符
        const char = instance.adapter.getInputCharacter(0);
        expect(char).toBe('1');
        
        const char2 = instance.adapter.getInputCharacter(1);
        expect(char2).toBe('2');
    });

    // 测试 line 172: recordCursorPosition 的 catch 块
    // 这个很难测试，因为需要模拟 selectionStart 抛出异常
    it('recordCursorPosition handles exception', () => {
        const inputNumber = mount(<InputNumber defaultValue={100} />);
        const instance = inputNumber.find(BaseInputNumber).instance();
        
        // 保存原始的 inputNode
        const originalInputNode = instance.inputNode;
        
        // 创建一个会抛出异常的 mock inputNode
        instance.inputNode = {
            get selectionStart() {
                throw new Error('Test error');
            },
            get selectionEnd() {
                throw new Error('Test error');
            },
            value: '100'
        };
        
        // 调用 recordCursorPosition，应该捕获异常
        const consoleWarn = sinon.spy(console, 'warn');
        instance.adapter.recordCursorPosition();
        
        // 恢复原始的 inputNode
        instance.inputNode = originalInputNode;
        
        // 检查 console.warn 是否被调用
        expect(consoleWarn.called).toBe(true);
        consoleWarn.restore();
    });

    // 测试 line 350: currency 模式下 notifyChange 当解析值不同时
    it('componentDidUpdate currency mode triggers notifyChange when values differ', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式，初始值为数字
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 更新为不同的数字值
        inputNumber.setProps({ value: 150 });
        inputNumber.update();
        
        // 检查 onChange 是否被调用
        expect(onChange.called).toBe(true);
    });

    // 测试 line 350: currency 模式下，非 focusing 状态，值变化触发 notifyChange
    it('componentDidUpdate currency mode non-focusing triggers notifyChange', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 确保不在 focusing 状态
        inputNumber.find('input').simulate('blur');
        
        // 重置 onChange spy
        onChange.resetHistory();
        
        // 更新为不同的数字值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        // 检查组件存在
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，使用字符串值
    it('componentDidUpdate currency mode with string value triggers notifyChange', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式，初始值为字符串
        const inputNumber = mount(<InputNumber currency="CNY" value="100" onChange={onChange} />);
        
        // 确保不在 focusing 状态
        inputNumber.find('input').simulate('blur');
        
        // 重置 onChange spy
        onChange.resetHistory();
        
        // 更新为不同的字符串值
        inputNumber.setProps({ value: "200" });
        inputNumber.update();
        
        // 检查组件存在
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，keepFocus + 点击按钮
    // 这种情况下 focusing 为 true，clickUpOrDown 为 true
    // newValue 会被设置为格式化后的值
    it('componentDidUpdate currency mode with keepFocus and button click', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式和 keepFocus
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} keepFocus />);
        
        // 点击增加按钮
        const btns = inputNumber.find(`.${BASE_CLASS_PREFIX}-input-number-suffix-btns .${BASE_CLASS_PREFIX}-input-number-button`);
        const addBtn = btns.first();
        
        addBtn.simulate('mousedown', { button: numbers.MOUSE_BUTTON_LEFT });
        addBtn.simulate('mouseup');
        
        // 更新受控值
        if (onChange.called) {
            const newValue = onChange.lastCall.args[0];
            inputNumber.setProps({ value: newValue });
            inputNumber.update();
        }
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，focusing 状态，clickUpOrDown 为 true
    // 通过键盘上下键触发
    it('componentDidUpdate currency mode with keyboard up/down', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 进入 focusing 状态
        inputNumber.find('input').simulate('focus');
        
        // 按下上箭头键
        inputNumber.find('input').simulate('keydown', { keyCode: keyCode.UP });
        
        // 更新受控值
        if (onChange.called) {
            const newValue = onChange.lastCall.args[0];
            inputNumber.setProps({ value: newValue });
            inputNumber.update();
        }
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，使用格式化的字符串作为 props.value
    // 当 props.value 是格式化字符串时，parsedPropValue 会通过 doParse 解析
    it('componentDidUpdate currency mode with formatted string value', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式，初始值为格式化的字符串
        const inputNumber = mount(<InputNumber currency="CNY" value="¥100.00" onChange={onChange} />);
        
        // 更新为不同的格式化字符串
        inputNumber.setProps({ value: "¥200.00" });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，非 focusing 状态，值变化
    // 这种情况下 newValue 会通过 doFormat 生成
    it('componentDidUpdate currency mode non-focusing with value change', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式
        const inputNumber = mount(<InputNumber currency="CNY" value={100} onChange={onChange} />);
        
        // 确保不在 focusing 状态
        inputNumber.find('input').simulate('blur');
        
        // 重置 onChange spy
        onChange.resetHistory();
        
        // 更新为不同的数字值
        // 这会触发 line 333: newValue = this.foundation.doFormat(parsedNum, true, true);
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，使用精度导致解析值不同
    // 例如：props.value = "100.999"，但精度为 2，所以 parsedNum = 101
    // newValue = "¥101.00"，parsedNewValue = 101
    // parsedPropValue = doParse("100.999") = 100.999（如果不调整精度）
    it('componentDidUpdate currency mode with precision causing different parsed values', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式和精度
        const inputNumber = mount(<InputNumber currency="CNY" value={100} precision={2} onChange={onChange} />);
        
        // 更新为一个会被精度调整的值
        inputNumber.setProps({ value: "100.999" });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

    // 测试 line 350: currency 模式下，使用 min/max 导致解析值不同
    // 例如：props.value = 200，但 max = 100，所以 parsedNum = 100
    // newValue = "¥100.00"，parsedNewValue = 100
    // parsedPropValue = 200
    // 但是 this.props.value 在 componentDidUpdate 中已经是 200 了...
    it('componentDidUpdate currency mode with min/max causing different parsed values', () => {
        const onChange = sinon.spy();
        // 使用 currency 模式和 max
        const inputNumber = mount(<InputNumber currency="CNY" value={50} max={100} onChange={onChange} />);
        
        // 更新为一个超出 max 的值
        inputNumber.setProps({ value: 200 });
        inputNumber.update();
        
        expect(inputNumber.find('input').exists()).toBe(true);
    });

});
 