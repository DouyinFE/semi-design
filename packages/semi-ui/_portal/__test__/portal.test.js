import React, { useState, useEffect, useRef } from 'react'
import { clear } from 'jest-date-mock';
import sinon from 'sinon'
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

import Portal from '../index';
import { Form } from '../../form'

import { genAfterEach, genBeforeEach, mount } from '../../_test_/utils';

const wrapCls = `${BASE_CLASS_PREFIX}-portal`;
const wrapSelector = `.${wrapCls}`;

describe(`Portal`, () => {
    beforeEach(() => {
        clear();
        genBeforeEach()();
    });

    afterEach(genAfterEach());

    it(`test appearance(style, initStyle, content)`, async () => {
        const style = {
            backgroundColor: 'red',
            color: 'green'
        }
        const initStyle = {
            color: 'gray',
            fontSize: '32px'
        }

        mount(
            <React.StrictMode>
                <Portal style={style} initStyle={initStyle}>123</Portal>
            </React.StrictMode>
        );

        const doms = document.querySelectorAll(wrapSelector);

        expect(doms.length).toBe(1);
        expect(doms[0].textContent).toBe('123');
        expect(doms[0].style.backgroundColor).toBe(style.backgroundColor);
        expect(doms[0].style.color).toBe(initStyle.color);
        expect(doms[0].style.fontSize).toBe(initStyle.fontSize);
    });

    it('test prefixCls', async () => {
        const prefixCls = 'semi-ok'

        mount(
            <React.StrictMode>
                <Portal prefixCls={prefixCls}>123</Portal>
            </React.StrictMode>
        );

        const doms = document.querySelectorAll(`.${prefixCls}`);
        // check if popover showed or not
        expect(doms.length).toBe(1);
        expect(doms[0].textContent).toBe('123');
        expect(doms[0].className).toBe(prefixCls);
    });

    // issue: https://github.com/DouyinFE/semi-design/issues/1703
    it('test modal with form', async () => {
        const initValue = 'abc'

        const Component = () => {
            const [visible, setVisible] = useState(false)
            const [value, setValue] = useState('')
            const formRef = useRef()

            useEffect(() => {
                if (visible) {
                    setValue(formRef.current.formApi.getValue('value'))
                }
            }, [visible])

            return (
                <React.StrictMode>
                    <div>
                        <button onClick={() => setVisible(v => !v)}>Toggle Portal</button>
                        <div>
                            <span>Value From FromApi: </span>
                            <span id="val">{value}</span>
                        </div>

                        {visible ? <Portal>
                            <Form ref={formRef} initValues={{ value: initValue }}>
                                <Form.Input field="value" />
                            </Form>
                        </Portal> : null}
                    </div>
                </React.StrictMode>
            )
        }

        const ele = mount(<Component />)
        
        expect(ele.find('#val').text()).toBe('');

        ele.find('button').simulate('click');

        expect(ele.find('#val').text()).toBe(initValue);
    })

    it('reactive className & didUpdaate', async () => {
        const didUpdate = sinon.spy()

        const Component = () => {
            const [className, setClassName] = useState('abc')

            useEffect(() => {
                setTimeout(() => {
                    setClassName('edf')
                }, 80)
            }, [])

            return (
                <React.StrictMode>
                    <Portal className={className} didUpdate={didUpdate}>Something</Portal>
                </React.StrictMode>
            )
        }

        mount(<Component />)

        const portalRoot = document.querySelector(wrapSelector)
        expect(portalRoot.className).toBe(`${wrapCls} abc`)
        expect(didUpdate.callCount).toBe(0)

        await new Promise((resolve) => setTimeout(resolve, 100))
        expect(portalRoot.className).toBe(`${wrapCls} edf`)
        expect(didUpdate.callCount).toBe(1)
    })

    it('test getPopupContainer', async () => {

        const Component = () => {
            const shouldEmpty = useRef()
            const shouldRendered = useRef()

            return (
                <React.StrictMode>
                    {/* For root (#shouldEmpty), rendering occurs after the Portal, causing `getPopupContainer` to return an invalid DOM. */}
                    <Portal className="shouldEmpty" getPopupContainer={() => shouldEmpty.current}>shouldEmpty</Portal>
                    <div id="shouldEmpty" ref={shouldEmpty}></div>

                    {/* For root (#shouldRendered), rendering occurs before the Portal, ensuring correct behavior. */}
                    <div id="shouldRendered" ref={shouldRendered}></div>
                    <Portal getPopupContainer={() => shouldRendered.current}>shouldRendered</Portal>
                </React.StrictMode>
            )
        }

        mount(<Component />)

        const shouldEmpty = document.querySelector('#shouldEmpty')
        expect(shouldEmpty.children.length).toBe(0)

        const shouldRendered = document.querySelector('#shouldRendered')
        expect(shouldRendered.children.length).toBe(1)
        expect(shouldRendered.innerHTML).toBe(`<div class="semi-portal">shouldRendered</div>`)
    })
});

describe('Portal SSR/SSG', () => {
    beforeEach(() => {
        clear();
        genBeforeEach()();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        genAfterEach()();
    });

    it('test mock ssr', async () => {
        jest.spyOn(window, 'document', 'get').mockImplementation(() => {
            return undefined;
        })
        expect(document).toBeFalsy()

        expect(() => {
            const portal = new Portal({ children: null })
            portal.render()
        }).not.toThrow();
    })
})
