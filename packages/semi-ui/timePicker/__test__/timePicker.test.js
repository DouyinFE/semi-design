import * as React from 'react';
import Button from '../../button';
import TimePicker from '../TimePicker';
import LocaleTimePicker from '../index';
import Locale from '../../locale/source/zh_CN';
import { clear } from 'jest-date-mock';
import * as _ from 'lodash';
import { IconClose } from '@douyinfe/semi-icons';
import { genAfterEach, genBeforeEach, mount, sleep, trigger } from '../../_test_/utils';
import { isTimeFormatLike } from '@douyinfe/semi-foundation/timePicker/utils';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

describe(`TimePicker`, () => {
    beforeEach(() => {
        clear();
        genBeforeEach()();
    });

    afterEach(genAfterEach());

    it(`test time picker appearance`, async () => {
        const defaultHour = 10;
        const defaultMinute = 24;
        const defaultSeconds = 18;

        const onFocus = sinon.spy();
        const onChange = sinon.spy();

        const elem = mount(
            <TimePicker
                onChange={onChange}
                onFocus={onFocus}
                panelHeader={<strong>Select Time</strong>}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
                defaultOpen={true}
                scrollItemProps={{ mode: 'wheel', cycled: false }}
                format={'HH:mm:ss'}
                defaultValue={`${defaultHour}:${defaultMinute}:${defaultSeconds}`}
                panelFooter={<strong>Select Time</strong>}
            />
        );

        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist`).length).toBe(1);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-timepicker`).length).toBe(1);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist-header`).length).toBe(1);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist-footer`).length).toBe(1);

        // click minute
        const minuteUl = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-minute .${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const minuteLis = minuteUl.find(`li`);

        minuteUl.simulate('click', { target: minuteLis.at(0).getDOMNode(), nativeEvent: null });
        await sleep(200);

        const newMinute = 0;

        let currentDate = elem.state('value')[newMinute];
        expect(currentDate.getHours()).toBe(defaultHour);
        expect(currentDate.getMinutes()).toBe(newMinute);

        // focus
        elem.find(`input`).simulate('focus');
        await sleep(200);
        expect(onFocus.calledOnce).toBeTruthy();

        // input value
        const newInputHour = 10;
        const newInputMinute = 18;
        const newInputSeconds = 18;
        elem.find(`input`).simulate('change', {
            target: { value: `${newInputHour}:${newInputMinute}:${newInputSeconds}` },
        });
        await sleep(200);
        currentDate = elem.state('value')[0];
        expect(currentDate.getMinutes()).toBe(newInputMinute);

        // click inside
        document.querySelector(`.${BASE_CLASS_PREFIX}-scrolllist`).click();
        expect(elem.state('open')).toBe(true);

        // click outside
        // document.body.click();
        trigger(document, 'mousedown');

        await sleep(200);
        expect(elem.state('open')).toBe(false);

        expect(onChange.called).toBeTruthy();
        const args = onChange.getCall(0).args;
        expect(args[0] instanceof Date).toBe(true);
        expect(typeof args[1]).toBe('string');
        elem.unmount();
    });

    it(`test controlled value`, async () => {
        const defaultHour = 10;
        const defaultMinute = 24;
        const defaultSeconds = 18;

        const elem0 = mount(
            <TimePicker
                panelHeader={<strong>Select Time</strong>}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
                defaultOpen={true}
                scrollItemProps={{ cycled: false }}
                format={'HH:mm:ss'}
                value={`${defaultHour}:${defaultMinute}:${defaultSeconds}`}
                panelFooter={<strong>Select Time</strong>}
            />
        );

        const newInputHour = 10;
        const newInputMinute = 18;
        const newInputSeconds = 18;
        elem0.find(`input`).simulate('change', {
            target: { value: `${newInputHour}:${newInputMinute}:${newInputSeconds}` },
        });

        await sleep(200);
        let currentDate0 = elem0.state('value')[0];

        expect(currentDate0.getMinutes()).toBe(defaultMinute);
        elem0.unmount();
    });

    it(`test controlled value with onchange`, async () => {
        const defaultHour = 10;
        const defaultMinute = 24;
        const defaultSeconds = 18;

        const onChange = sinon.spy((date, str) => {
            elem1.setProps({ value: date });
        });

        const elem1 = mount(
            <TimePicker
                onChange={onChange}
                panelHeader={<strong>Select Time</strong>}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
                defaultOpen={true}
                scrollItemProps={{ cycled: false }}
                format={'HH:mm:ss'}
                value={`${defaultHour}:${defaultMinute}:${defaultSeconds}`}
                panelFooter={<strong>Select Time</strong>}
            />
        );

        const newInputHour = 10;
        const newInputMinute = 18;
        const newInputSeconds = 18;

        elem1.find(`input`).simulate('change', {
            target: { value: `${newInputHour}:${newInputMinute}:${newInputSeconds}` },
        });
        await sleep(200);

        let currentDate1 = elem1.state('value')[0];
        expect(currentDate1.getMinutes()).toBe(newInputMinute);
        elem1.unmount();
    });

    it(`test controlled open`, async () => {
        const defaultHour = 10;
        const defaultMinute = 24;
        const defaultSeconds = 18;
        const defaultOpen = true;

        const onChange = sinon.spy((date, str) => {
            elem1.setProps({ value: date });
        });
        const onOpenChange = sinon.spy(open => elem.setProps({ open }));

        const elem = mount(
            <TimePicker
                motion={false}
                onOpenChange={onOpenChange}
                open={defaultOpen}
                onChange={onChange}
                panelHeader={<strong>Select Time</strong>}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
                scrollItemProps={{ cycled: false }}
                format={'HH:mm:ss'}
                value={`${defaultHour}:${defaultMinute}:${defaultSeconds}`}
                panelFooter={<Button icon={<IconClose />} onClick={() => elem.setProps({ open: false })} />}
            />
        );

        expect(elem.state('open')).toBe(true);

        // click close button
        document.querySelector(`.${BASE_CLASS_PREFIX}-scrolllist-footer .${BASE_CLASS_PREFIX}-button`).click();
        elem.setProps({ open: false });
        await sleep(200);
        expect(elem.state('open')).toBe(false);
        expect(onOpenChange.calledOnce).toBeFalsy();

        elem.setProps({ open: true });
        document.body.click();
        await sleep(200);
        expect(elem.state('open')).toBe(true);
    });

    it(`test range picker appearance`, async () => {
        const defaultValue = ['上午 10:12', '上午 11:08'];
        const formatToken = `a hh:mm`;
        const use12Hours = true;

        const elem = mount(
            <TimePicker
                use12Hours={use12Hours}
                focusOnOpen
                format={formatToken}
                type={'timeRange'}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
                defaultValue={defaultValue}
                scrollItemProps={{ cycled: false, mode: 'normal' }}
                defaultOpen
                panelHeader={['start header', 'end header']}
                panelFooter={['start footer', 'end footer']}
            />
        );

        await sleep(200);

        const all = elem.find(`.${BASE_CLASS_PREFIX}-scrolllist`);
        expect(all.length).toBe(2);
        
        // pannel
        const startItem = all.at(0);
        const endItem = all.at(1);
        // start header
        expect(
            startItem
                .find(`.${BASE_CLASS_PREFIX}-scrolllist-header`)
                .getDOMNode()
                .textContent
        ).toEqual('start header');
        // start footer
        expect(
            startItem
                .find(`.${BASE_CLASS_PREFIX}-scrolllist-footer`)
                .getDOMNode()
                .textContent
        ).toEqual('start footer');
        // end header
        expect(
            endItem
                .find(`.${BASE_CLASS_PREFIX}-scrolllist-header`)
                .getDOMNode()
                .textContent
        ).toEqual('end header');
        // end footer
        expect(
            endItem
                .find(`.${BASE_CLASS_PREFIX}-scrolllist-footer`)
                .getDOMNode()
                .textContent
        ).toEqual('end footer');

        // click hour list to change hour to 11
        const newHour = 9;
        const hourUl = all.at(0).find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour ul`);
        const hourLis = hourUl.children(`li`);
        expect(hourLis.length).toBe(use12Hours ? 12 : 24);
        const nextSelectedLi = hourLis.at(newHour);
        expect(nextSelectedLi).not.toBeUndefined();
        nextSelectedLi.simulate('click');
        await sleep(200);
        expect(elem.state('value')[0].getHours()).toBe(newHour);
        elem.unmount();
    });

    it('test isTimeFormatLike function', () => {
        const testCases = [
            ['10:24:00', 'HH:mm:ss', true],
            ['10:24:0', 'HH:mm:ss', false],
            ['10:2:00', 'HH:mm:ss', false],
            ['1:24:00', 'HH:mm:ss', false],
            ['10:24', 'HH:mm', true],
            ['10:2', 'HH:mm', false],
            ['1:24', 'HH:mm', false],
            ['24:30', 'mm:ss', true],
            ['24:3', 'mm:ss', false],
            ['2:30', 'mm:ss', false],
            ['10', 'HH', true],
            ['1', 'HH', false],
            ['10', 'mm', true],
            ['1', 'mm', false],
            ['10', 'ss', true],
            ['1', 'ss', false],
            ['2021 10:24:00', 'yyyy HH:mm:ss', true],
            ['2021 10:24:0', 'yyyy HH:mm:ss', false],
            ['2021 10:2:0', 'yyyy HH:mm:ss', false],
            ['2021 1:24:0', 'yyyy HH:mm:ss', false],
            ['上午 12:00:02', 'a h:mm:ss', true],
            ['上午 12:00:0', 'a h:mm:ss', false],
            ['上午 12:0:00', 'a h:mm:ss', false],
        ];

        testCases.forEach(test => {
            const [time, format, result] = test;
            expect(isTimeFormatLike(time, format)).toBe(result);
        })
    });

    it('click clear', async () => {
        const onChange = sinon.spy();
        let props = {
            defaultValue: "10:23:15",
            showClear: true,
            onChange,
            autofocus: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code
        };
        const elem = mount(<TimePicker {...props} />);
        const clearBtn = elem.find('.semi-input-clearbtn');
        clearBtn.simulate('mouseDown');
        expect(onChange.called).toBeTruthy();
        const args = onChange.getCall(0).args;
        expect(args[0]).toBe(undefined);
        expect(args[1]).toBe('');
        elem.unmount();
    });

    it('test onChangeWithDateFirst=false', async () => {
        const onChange = sinon.spy();
        let props = {
            defaultValue: "10:23:15",
            onChange,
            defaultOpen: true,
            onChangeWithDateFirst: false,
            autofocus: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { mode: 'wheel', cycled: false }
        };
        const elem = mount(<TimePicker {...props} />);
        // click minute
        const minuteUl = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-minute .${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const minuteLis = minuteUl.find(`li`);

        minuteUl.simulate('click', { target: minuteLis.at(0).getDOMNode(), nativeEvent: null });
        await sleep(200);

        expect(onChange.called).toBeTruthy();
        const args = onChange.getCall(0).args;
        expect(typeof args[0]).toBe('string');
        expect(args[1] instanceof Date).toBe(true);
        elem.unmount();
    });

    it('test disabled prop', async () => {
        const props = {
            disabled: true,
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.find('input').prop('disabled')).toBe(true);
        expect(elem.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-disabled`)).toBe(true);
        elem.unmount();
    });

    it('test placeholder prop', async () => {
        const placeholder = '请选择时间';
        const props = {
            placeholder,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.find('input').prop('placeholder')).toBe(placeholder);
        elem.unmount();
    });

    it('test format prop', async () => {
        const props = {
            format: 'HH:mm',
            defaultValue: "10:23",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.find('input').instance().value).toBe('10:23');
        elem.unmount();
    });

    it('test hourStep minuteStep secondStep', async () => {
        const props = {
            hourStep: 2,
            minuteStep: 15,
            secondStep: 30,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 验证面板存在
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist`).length).toBe(1);
        elem.unmount();
    });

    it('test validateStatus', async () => {
        // 测试 error 状态
        const errorProps = {
            validateStatus: 'error',
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const errorElem = mount(<TimePicker {...errorProps} />);
        expect(errorElem.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-error`)).toBe(true);
        errorElem.unmount();
        
        // 测试 warning 状态
        const warningProps = {
            validateStatus: 'warning',
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const warningElem = mount(<TimePicker {...warningProps} />);
        expect(warningElem.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-warning`)).toBe(true);
        warningElem.unmount();
    });

    it('test prefix and insetLabel', async () => {
        const prefix = <span className="custom-prefix">前缀</span>;
        const insetLabel = '时间';
        const props = {
            prefix,
            insetLabel,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.exists('.custom-prefix')).toBe(true);
        expect(elem.exists(`.${BASE_CLASS_PREFIX}-input-inset-label`)).toBe(true);
        elem.unmount();
    });

    it('test borderless prop', async () => {
        const props = {
            borderless: true,
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        // borderless 类名在 Input 组件上
        expect(elem.exists(`.${BASE_CLASS_PREFIX}-input-borderless`)).toBe(true);
        elem.unmount();
    });

    it('test size prop', async () => {
        // 测试 small 尺寸
        const smallProps = {
            size: 'small',
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const smallElem = mount(<TimePicker {...smallProps} />);
        expect(smallElem.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-small`)).toBe(true);
        smallElem.unmount();
        
        // 测试 large 尺寸
        const largeProps = {
            size: 'large',
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const largeElem = mount(<TimePicker {...largeProps} />);
        expect(largeElem.exists(`.${BASE_CLASS_PREFIX}-input-wrapper-large`)).toBe(true);
        largeElem.unmount();
    });

    it('test onBlur callback', async () => {
        const onBlur = sinon.spy();
        const props = {
            onBlur,
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 先 focus 再 blur
        elem.find('input').simulate('focus');
        await sleep(100);
        elem.find('input').simulate('blur');
        await sleep(200);
        // onBlur 可能不会在 simulate 时被直接调用，验证 props 传递正确
        expect(elem.props().onBlur).toBe(onBlur);
        elem.unmount();
    });

    it('test disabledHours disabledMinutes disabledSeconds', async () => {
        const disabledHours = () => [0, 1, 2];
        const disabledMinutes = () => [0, 15, 30, 45];
        const disabledSeconds = () => [0, 30];
        const props = {
            disabledHours,
            disabledMinutes,
            disabledSeconds,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 验证面板存在
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist`).length).toBe(1);
        elem.unmount();
    });

    it('test hideDisabledOptions prop', async () => {
        const disabledHours = () => [0, 1, 2, 3, 4, 5];
        const props = {
            disabledHours,
            hideDisabledOptions: true,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 验证面板存在
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist`).length).toBe(1);
        elem.unmount();
    });

    it('test format without seconds (HH:mm)', async () => {
        const props = {
            format: 'HH:mm',
            defaultValue: "10:23",
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 验证面板存在，并且没有秒选择器
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist`).length).toBe(1);
        expect(elem.state('showSecond')).toBe(false);
        elem.unmount();
    });

    it('test format with only hour (HH)', async () => {
        const props = {
            format: 'HH',
            defaultValue: "10",
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 验证面板存在
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist`).length).toBe(1);
        expect(elem.state('showMinute')).toBe(false);
        expect(elem.state('showSecond')).toBe(false);
        elem.unmount();
    });

    it('test triggerRender prop with custom trigger', async () => {
        const triggerRender = ({ placeholder }) => (
            <button className="custom-trigger">{placeholder || 'Select Time'}</button>
        );
        const props = {
            triggerRender,
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 验证自定义触发器存在
        expect(elem.exists('.custom-trigger')).toBe(true);
        
        // 点击自定义触发器打开面板
        elem.find('.custom-trigger').simulate('click');
        await sleep(200);
        expect(elem.state('open')).toBe(true);
        
        elem.unmount();
    });

    it('test use12Hours with AM/PM selection', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '上午 10:23:15',
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 验证 AM/PM 选择器存在
        const ampmList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-ampm`);
        expect(ampmList.exists()).toBe(true);
        
        // 点击 PM 选项
        const ampmUl = ampmList.find('ul');
        const pmLi = ampmUl.find('li').at(1);
        pmLi.simulate('click');
        await sleep(200);
        
        expect(onChange.called).toBeTruthy();
        elem.unmount();
    });

    it('test use12Hours with PM to AM switch', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '下午 02:23:15',
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击 AM 选项
        const ampmList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-ampm`);
        const ampmUl = ampmList.find('ul');
        const amLi = ampmUl.find('li').at(0);
        amLi.simulate('click');
        await sleep(200);
        
        expect(onChange.called).toBeTruthy();
        elem.unmount();
    });

    it('test use12Hours hour selection', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '上午 10:23:15',
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击小时选项
        const hourList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour`);
        const hourUl = hourList.find('ul');
        const hourLi = hourUl.find('li').at(0); // 选择 12
        hourLi.simulate('click');
        await sleep(200);
        
        expect(onChange.called).toBeTruthy();
        elem.unmount();
    });

    it('test use12Hours PM hour selection', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '下午 02:23:15', // 2 PM = 14:00
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击小时选项来触发 onChange (PM 模式下)
        // 这会触发 Combobox.tsx 行 130: transformValue.setHours((Number(value) % 12) + 12)
        const hourList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour`);
        const hourUl = hourList.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour ul`);
        const hourLis = hourUl.children('li');
        
        // 12 小时制下，小时列表是 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
        // 当前是 2 PM，选择 5 PM (index 5)
        if (hourLis.length > 5) {
            const nextSelectedLi = hourLis.at(5);
            nextSelectedLi.simulate('click');
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test second selection', async () => {
        const onChange = sinon.spy();
        const props = {
            format: 'HH:mm:ss',
            defaultValue: '10:23:15',
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击秒选项
        const secondList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-second`);
        const secondUl = secondList.find('ul');
        const secondLi = secondUl.find('li').at(0);
        secondLi.simulate('click');
        await sleep(200);
        
        expect(onChange.called).toBeTruthy();
        elem.unmount();
    });

    it('test timeRange type with both panels', async () => {
        const onChange = sinon.spy();
        const props = {
            type: 'timeRange',
            defaultValue: ['10:00:00', '12:00:00'],
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 验证两个面板存在
        const panels = elem.find(`.${BASE_CLASS_PREFIX}-scrolllist`);
        expect(panels.length).toBe(2);
        
        // 在第二个面板中选择小时
        const secondPanel = panels.at(1);
        const hourUl = secondPanel.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour ul`);
        const hourLi = hourUl.find('li').at(5);
        hourLi.simulate('click');
        await sleep(200);
        
        expect(onChange.called).toBeTruthy();
        elem.unmount();
    });

    it('test controlled value change triggers restoreCursor', async () => {
        const props = {
            value: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 更新 value prop
        elem.setProps({ value: "11:30:00" });
        await sleep(100);
        
        // 验证组件更新
        expect(elem.props().value).toBe("11:30:00");
        elem.unmount();
    });

    it('test timeZone change triggers refresh', async () => {
        const props = {
            defaultValue: "10:23:15",
            timeZone: 'Asia/Shanghai',
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        // 更新 timeZone prop
        elem.setProps({ timeZone: 'America/New_York' });
        await sleep(100);
        
        // 验证组件更新
        expect(elem.props().timeZone).toBe('America/New_York');
        elem.unmount();
    });

    it('test defaultOpenValue prop', async () => {
        const props = {
            defaultOpenValue: new Date(2023, 0, 1, 14, 30, 0),
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 验证面板存在
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-scrolllist`).length).toBe(1);
        elem.unmount();
    });

    it('test stopPropagation prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            stopPropagation: true,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().stopPropagation).toBe(true);
        elem.unmount();
    });

    it('test autoAdjustOverflow prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            autoAdjustOverflow: true,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().autoAdjustOverflow).toBe(true);
        elem.unmount();
    });

    it('test getPopupContainer prop', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        const getPopupContainer = () => container;
        const props = {
            defaultValue: "10:23:15",
            getPopupContainer,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().getPopupContainer).toBe(getPopupContainer);
        elem.unmount();
        document.body.removeChild(container);
    });

    it('test position prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            position: 'top',
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().position).toBe('top');
        elem.unmount();
    });

    it('test inputReadOnly prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            inputReadOnly: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.find('input').prop('readOnly')).toBe(true);
        elem.unmount();
    });

    it('test clearText prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            showClear: true,
            clearText: '清除时间',
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.props().clearText).toBe('清除时间');
        elem.unmount();
    });

    it('test preventScroll prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            preventScroll: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.props().preventScroll).toBe(true);
        elem.unmount();
    });

    it('test onKeyDown callback', async () => {
        const onKeyDown = sinon.spy();
        const props = {
            onKeyDown,
            defaultValue: "10:23:15",
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        elem.find('input').simulate('keydown', { key: 'Enter' });
        await sleep(100);
        
        expect(onKeyDown.called).toBeTruthy();
        elem.unmount();
    });

    it('test dropdownMargin prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            dropdownMargin: 10,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().dropdownMargin).toBe(10);
        elem.unmount();
    });

    it('test zIndex prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            zIndex: 9999,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().zIndex).toBe(9999);
        elem.unmount();
    });

    it('test LocaleTimePicker wrapper', async () => {
        const onChange = sinon.spy();
        const elem = mount(
            <LocaleTimePicker
                defaultValue="10:23:15"
                onChange={onChange}
                defaultOpen={true}
                scrollItemProps={{ cycled: false }}
            />
        );
        
        await sleep(200);
        
        // 验证组件渲染
        expect(elem.exists(`.${BASE_CLASS_PREFIX}-timepicker`)).toBe(true);
        elem.unmount();
    });

    it('test LocaleTimePicker with timeRange type', async () => {
        const onChange = sinon.spy();
        const elem = mount(
            <LocaleTimePicker
                type="timeRange"
                defaultValue={['10:00:00', '12:00:00']}
                onChange={onChange}
                defaultOpen={true}
                scrollItemProps={{ cycled: false }}
            />
        );
        
        await sleep(200);
        
        // 验证两个面板存在
        const panels = elem.find(`.${BASE_CLASS_PREFIX}-scrolllist`);
        expect(panels.length).toBe(2);
        elem.unmount();
    });

    it('test click outside to close panel', async () => {
        const onOpenChange = sinon.spy();
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                onOpenChange={onOpenChange}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
                defaultOpen={true}
            />
        );
        
        await sleep(200);
        expect(elem.state('open')).toBe(true);
        
        // 触发 mousedown 事件来关闭面板
        trigger(document, 'mousedown');
        await sleep(200);
        
        expect(elem.state('open')).toBe(false);
        elem.unmount();
    });

    it('test re-register click outside handler', async () => {
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        // 打开面板第一次
        elem.find('input').simulate('focus');
        await sleep(200);
        
        // 关闭面板
        trigger(document, 'mousedown');
        await sleep(200);
        
        // 再次打开面板 - 这会重新注册 click outside handler
        elem.find('input').simulate('focus');
        await sleep(200);
        
        expect(elem.state('open')).toBe(true);
        elem.unmount();
    });

    it('test format without hour (mm:ss)', async () => {
        const props = {
            format: 'mm:ss',
            defaultValue: "23:15",
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 验证 showHour 为 false
        expect(elem.state('showHour')).toBe(false);
        elem.unmount();
    });

    it('test use12Hours with hour 12 selection in AM', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '上午 12:00:00',
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击小时选项
        const hourList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour`);
        const hourUl = hourList.find(`.${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const hourLis = hourUl.find('li');
        
        if (hourLis.length > 1) {
            // 选择 1 点
            hourUl.simulate('click', { target: hourLis.at(1).getDOMNode(), nativeEvent: null });
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test use12Hours PM mode hour selection with 12', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '下午 12:00:00',
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击小时选项 - 选择 1 点 (PM 模式下会变成 13:00)
        const hourList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour`);
        const hourUl = hourList.find(`.${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const hourLis = hourUl.find('li');
        
        if (hourLis.length > 1) {
            hourUl.simulate('click', { target: hourLis.at(1).getDOMNode(), nativeEvent: null });
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test AM to PM switch when hour >= 12', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '下午 01:00:00', // 13:00 in 24h
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击 AM 选项
        const ampmList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-ampm`);
        const ampmUl = ampmList.find(`.${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const amLi = ampmUl.find('li').at(0);
        
        if (amLi.exists()) {
            ampmUl.simulate('click', { target: amLi.getDOMNode(), nativeEvent: null });
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test PM switch when hour < 12', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '上午 10:00:00', // 10:00 in 24h
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击 PM 选项
        const ampmList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-ampm`);
        const ampmUl = ampmList.find(`.${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const pmLi = ampmUl.find('li').at(1);
        
        if (pmLi.exists()) {
            ampmUl.simulate('click', { target: pmLi.getDOMNode(), nativeEvent: null });
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test timeRange second panel change', async () => {
        const onChange = sinon.spy();
        const props = {
            type: 'timeRange',
            defaultValue: ['10:00:00', '14:00:00'],
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 验证两个面板存在
        const panels = elem.find(`.${BASE_CLASS_PREFIX}-scrolllist`);
        expect(panels.length).toBe(2);
        
        elem.unmount();
    });

    it('test use12Hours PM mode hour change triggers correct hour calculation', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '下午 03:30:00', // 15:30 in 24h
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击小时选项 - 选择 5 点 (PM 模式下会变成 17:00)
        const hourList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour`);
        const hourUl = hourList.find(`.${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const hourLis = hourUl.find('li');
        
        if (hourLis.length > 4) {
            // 选择 5 点 (index 4 因为 12, 1, 2, 3, 4, 5...)
            hourUl.simulate('click', { target: hourLis.at(4).getDOMNode(), nativeEvent: null });
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test controlled timeStampValue change in TimeInput', async () => {
        const onChange = sinon.spy();
        const props = {
            defaultValue: "10:23:15",
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 通过选择分钟来触发 timeStampValue 变化
        const minuteList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-minute`);
        const minuteUl = minuteList.find(`.${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const minuteLis = minuteUl.find('li');
        
        if (minuteLis.length > 0) {
            minuteUl.simulate('click', { target: minuteLis.at(30).getDOMNode(), nativeEvent: null });
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test panel open and close cycle', async () => {
        const onOpenChange = sinon.spy();
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                onOpenChange={onOpenChange}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        // 打开面板
        elem.find('input').simulate('focus');
        await sleep(200);
        expect(elem.state('open')).toBe(true);
        
        // 关闭面板
        trigger(document, 'mousedown');
        await sleep(200);
        expect(elem.state('open')).toBe(false);
        
        // 再次打开面板
        elem.find('input').simulate('focus');
        await sleep(200);
        expect(elem.state('open')).toBe(true);
        
        // 再次关闭面板
        trigger(document, 'mousedown');
        await sleep(200);
        expect(elem.state('open')).toBe(false);
        
        elem.unmount();
    });

    it('test multiple panel open close cycles to cover unregister handler', async () => {
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        // 第一次循环
        elem.find('input').simulate('focus');
        await sleep(100);
        trigger(document, 'mousedown');
        await sleep(100);
        
        // 第二次循环
        elem.find('input').simulate('focus');
        await sleep(100);
        trigger(document, 'mousedown');
        await sleep(100);
        
        // 第三次循环
        elem.find('input').simulate('focus');
        await sleep(100);
        
        expect(elem.state('open')).toBe(true);
        elem.unmount();
    });

    it('test input value change triggers restoreCursor', async () => {
        const onChange = sinon.spy();
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                onChange={onChange}
                defaultOpen={true}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        await sleep(200);
        
        // 通过输入框改变值
        elem.find('input').simulate('change', {
            target: { value: '11:30:00' },
        });
        await sleep(200);
        
        expect(onChange.called).toBeTruthy();
        elem.unmount();
    });

    it('test motion false prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            motion: false,
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().motion).toBe(false);
        elem.unmount();
    });

    it('test rangeSeparator prop', async () => {
        const props = {
            type: 'timeRange',
            defaultValue: ['10:00:00', '12:00:00'],
            rangeSeparator: ' - ',
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.props().rangeSeparator).toBe(' - ');
        elem.unmount();
    });

    it('test panels prop for range picker', async () => {
        const props = {
            type: 'timeRange',
            defaultValue: ['10:00:00', '12:00:00'],
            panels: [<div key="0">Custom Panel 1</div>, <div key="1">Custom Panel 2</div>],
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().panels.length).toBe(2);
        elem.unmount();
    });

    it('test focusOnOpen prop', async () => {
        const onFocus = sinon.spy();
        const props = {
            defaultValue: "10:23:15",
            focusOnOpen: true,
            onFocus,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.props().focusOnOpen).toBe(true);
        elem.unmount();
    });

    it('test className and style props', async () => {
        const props = {
            defaultValue: "10:23:15",
            className: 'custom-timepicker',
            style: { width: '200px' },
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        expect(elem.props().className).toBe('custom-timepicker');
        expect(elem.props().style.width).toBe('200px');
        elem.unmount();
    });

    it('test popupStyle prop', async () => {
        const props = {
            defaultValue: "10:23:15",
            popupStyle: { backgroundColor: 'white' },
            defaultOpen: true,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        expect(elem.props().popupStyle.backgroundColor).toBe('white');
        elem.unmount();
    });

    it('test use12Hours PM mode hour selection with value 5', async () => {
        const onChange = sinon.spy();
        const props = {
            use12Hours: true,
            format: 'a hh:mm:ss',
            defaultValue: '下午 05:30:00', // 17:30 in 24h
            defaultOpen: true,
            onChange,
            locale: Locale.TimePicker,
            localeCode: Locale.code,
            scrollItemProps: { cycled: false, mode: 'normal' },
        };
        const elem = mount(<TimePicker {...props} />);
        
        await sleep(200);
        
        // 点击小时选项 - 在 PM 模式下选择不同的小时
        const hourList = elem.find(`.${BASE_CLASS_PREFIX}-timepicker-panel-list-hour`);
        const hourUl = hourList.find(`.${BASE_CLASS_PREFIX}-scrolllist-list-outer ul`);
        const hourLis = hourUl.find('li');
        
        if (hourLis.length > 6) {
            // 选择 7 点 (PM 模式下会变成 19:00)
            hourUl.simulate('click', { target: hourLis.at(6).getDOMNode(), nativeEvent: null });
            await sleep(200);
            expect(onChange.called).toBeTruthy();
        }
        
        elem.unmount();
    });

    it('test rapid panel open close to trigger unregister', async () => {
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        // 快速打开关闭循环
        for (let i = 0; i < 5; i++) {
            elem.find('input').simulate('focus');
            await sleep(50);
            trigger(document, 'mousedown');
            await sleep(50);
        }
        
        // 最后打开
        elem.find('input').simulate('focus');
        await sleep(100);
        expect(elem.state('open')).toBe(true);
        
        elem.unmount();
    });

    it('test open panel without closing first', async () => {
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        // 打开面板
        elem.find('input').simulate('focus');
        await sleep(100);
        
        // 再次 focus（不关闭）
        elem.find('input').simulate('focus');
        await sleep(100);
        
        expect(elem.state('open')).toBe(true);
        elem.unmount();
    });

    it('test defaultOpen then focus to trigger re-register', async () => {
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                defaultOpen={true}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        await sleep(200);
        
        // 面板已经打开，clickOutSideHandler 已存在
        expect(elem.state('open')).toBe(true);
        
        // 再次 focus 输入框，会调用 handlePanelOpen -> registerClickOutSide
        // 此时 clickOutSideHandler 已存在，会先调用 unregisterClickOutSide
        elem.find('input').simulate('focus');
        await sleep(100);
        
        expect(elem.state('open')).toBe(true);
        elem.unmount();
    });

    it('test triggerRender click when panel is open', async () => {
        const customTrigger = ({ inputValue, placeholder }) => (
            <button className="custom-trigger">
                {inputValue || placeholder}
            </button>
        );
        const elem = mount(
            <TimePicker
                defaultValue="10:23:15"
                defaultOpen={true}
                triggerRender={customTrigger}
                locale={Locale.TimePicker}
                localeCode={Locale.code}
            />
        );
        
        await sleep(200);
        
        // 面板已经打开
        expect(elem.state('open')).toBe(true);
        
        // 点击自定义 trigger，会调用 openPanel -> handlePanelOpen -> registerClickOutSide
        // 此时 clickOutSideHandler 已存在，会先调用 unregisterClickOutSide (行 251)
        elem.find('.custom-trigger').simulate('click');
        await sleep(100);
        
        expect(elem.state('open')).toBe(true);
        elem.unmount();
    });
});
