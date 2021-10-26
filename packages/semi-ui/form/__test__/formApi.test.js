// formApi test
import { Form, Select, Button } from '../../index';
import { noop } from 'lodash-es';
import { sleep as baseSleep } from '../../_test_/utils/index';
const sleep = (ms = 200) => baseSleep(ms);

function getForm(props) {
    return mount(<Form {...props}></Form>, {
        attachTo: document.getElementById('container'),
    });
}

const Option = Select.Option;
const FormSelect = (
    <Form.Select label="business" field="business" style={{ width: 200 }}>
        <Option value="abc">Abc</Option>
        <Option value="hotsoon">Hotsoon</Option>
        <Option value="topbuzz">TopBuzz</Option>
    </Form.Select>
);

const FormInput = <Form.Input field="name" />;

const FieldCls = `.semi-form-field`;

const fields = (
    <>
        {FormInput}
        {FormSelect}
    </>
);

describe('Form-formApi', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        // Avoid `attachTo: document.body` Warning
        const div = document.createElement('div');
        div.setAttribute('id', 'container');
        document.body.appendChild(div);
    });

    afterEach(() => {
        const div = document.getElementById('container');
        if (div) {
            document.body.removeChild(div);
        }
    });
    it('formApi-getFieldExist', () => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let spyGet = sinon.spy(getFormApi);
        let props = {
            getFormApi: spyGet,
            children: FormInput,
        };
        const form = getForm(props);
        expect(formApi.getFieldExist('name')).toEqual(true);
        expect(formApi.getFieldExist('business')).toEqual(false);
    });

    it('formApi-getInitValue / getInitValues', () => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let initValues = {
            name: 'semi',
            business: 'abc',
        };
        let props = {
            initValues,
            getFormApi,
            children: fields,
        };
        const form = getForm(props);
        expect(formApi.getInitValue('name')).toEqual('semi');
        expect(formApi.getInitValue('business')).toEqual('abc');
        expect(formApi.getInitValue('notExistField')).toEqual(undefined);
        expect(formApi.getInitValue()).toEqual(initValues);
        expect(formApi.getInitValues()).toEqual(initValues);
    });

    it('formApi-getTouched', () => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let props = {
            getFormApi,
            children: fields,
        };
        const form = getForm(props);
        let event = {};
        form.find(`.semi-input`).simulate('blur', event);
        expect(formApi.getTouched('name')).toEqual(true);
        expect(!formApi.getTouched('business')).toEqual(true);
    });

    it('formApi-getValue', () => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let props = {
            getFormApi,
            children: fields,
        };
        const form = getForm(props);
        // get specific field value
        expect(formApi.getValue('name')).toEqual(undefined);
        let event = { target: { value: 'semi' } };
        form.find(`.semi-input`).simulate('change', event);
        expect(formApi.getValue('name')).toEqual('semi');
        // get all field's value
        expect(formApi.getValue()).toEqual({ name: 'semi' });
        expect(formApi.getValues()).toEqual({ name: 'semi' });
    });


    it('formApi-getError', done => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let errorMessage = 'not muji';
        const props = {
            getFormApi,
            children: (
                <Form.Input
                    trigger="change"
                    field="name"
                    rules={[{ validator: (rule, value) => value === 'muji', message: errorMessage }]}
                />
            ),
        };
        const form = getForm(props);
        let event = { target: { value: 'semi' } };
        form.find(`.semi-input`).simulate('change', event);
        setTimeout(() => {
            expect(formApi.getError('name')).toEqual(errorMessage);
            done();
        }, 300);
    });

    it('formApi-getFormState', done => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        const props = {
            getFormApi,
            children: (
                <Form.Input
                    trigger="change"
                    field="name"
                    rules={[{ validator: (rule, value) => value === 'muji', message: 'not muji' }]}
                />
            ),
        };
        const form = getForm(props);
        let event = { target: { value: 'semi' } };
        form.find(`.semi-input`).simulate('change', event);
        let expectFormState = {
            values: { name: 'semi' },
            errors: { name: 'not muji' },
            touched: { name: true },
        };
        setTimeout(() => {
            expect(formApi.getFormState()).toEqual(expectFormState);
            done();
        }, 300);
    });

    it('formApi-setError', () => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        const props = {
            getFormApi,
            children: <Form.Input trigger="change" field="name" fieldClassName="test" />,
        };
        const form = getForm(props);
        let errorMessage = 'not muji';
        formApi.setError('name', errorMessage);
        let expectFormState = {
            values: {},
            errors: { name: errorMessage },
            touched: {},
        };
        expect(formApi.getFormState()).toEqual(expectFormState);
        form.update();
        expect(form.find(`.test .semi-form-field-error-message`).text()).toEqual(errorMessage);
    });

    it('formApi-setTouched', () => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let props = {
            getFormApi,
            children: fields,
        };
        const form = getForm(props);
        let event = {};
        form.find(`.semi-input`).simulate('blur', event);
        expect(formApi.getTouched('name')).toEqual(true);
        expect(!formApi.getTouched('business')).toEqual(true);
    });

    it('formApi-setValue', () => {
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let props = {
            getFormApi,
            children: fields,
        };
        let expectVal = 'semi';
        const form = getForm(props);
        formApi.setValue('name', expectVal);

        expect(formApi.getValue('name')).toEqual(expectVal);
        expect(form.find(`.semi-input`).instance().value).toEqual(expectVal);
    });

    it('formApi-reset', () => {
        let formApi = null;
        const props = {
            children: fields,
            getFormApi: api => {
                formApi = api;
            },
            initValues: {
                name: 'a',
            },
        };
        const form = getForm(props);
        let event = { target: { value: 'b' } };
        form.find(`.semi-input`).simulate('change', event);
        formApi.reset();
        expect(form.find(`.semi-input`).instance().value).toEqual('a');
        expect(formApi.getFormState()).toEqual({
            values: { name: 'a' },
            errors: {},
            touched: {},
        });
    });

    it('formApi-setValues-override', () => {
        let formApi = null;
        const props = {
            children: fields,
            getFormApi: api => {
                formApi = api;
            },
            initValues: {
                name: 'a',
                extraKeyA: 'uno',
            },
        };
        const form = getForm(props);
        let expectVal = {
            name: 'semi',
            business: 'abc',
            extraKeyB: 'Kay tse',
        };
        formApi.setValues(expectVal, { isOverride: true });
        expect(formApi.getValue()).toEqual(expectVal);
    });

    it('formApi-setValues-merge', () => {
        let formApi = null;
        let initValues = {
            name: 'a',
            extraKeyA: 'uno',
        };
        const props = {
            children: fields,
            getFormApi: api => {
                formApi = api;
            },
            initValues,
        };
        const form = getForm(props);
        let expectVal = {
            name: 'semi',
            business: 'abc',
            extraKeyB: 'not exist',
        };
        let mergeVal = { name: 'semi', business: 'abc', extraKeyA: 'uno' };
        formApi.setValues(expectVal);
        expect(formApi.getValue()).toEqual(mergeVal);
    });

    it('formApi-validate, validate all field, specail field', async () => {
        let fields = (
            <>
                <Form.Input field="a.b"  className='ab' validate={(val) => val ? '' : 'ab-err'} />
                <Form.Input field="a.c"  className='ac' validate={(val) => val ? '' : 'ac-err'} />
            </>
        )
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let formProps = { 
            children: fields,
            getFormApi,
        };
        let form = getForm(formProps);
        formApi.validate().then(values=>{}).catch(error=> {});
        await sleep(400);
        expect(formApi.getFormState().errors).toEqual({ a: { b: 'ab-err', c: 'ac-err'}});
        formApi.reset();
        formApi.validate(['a.c']).then(values=>{}).catch(error=> {});
        await sleep(300);
        expect(formApi.getFormState().errors).toEqual({ a: { c: 'ac-err'}});
    });

    it('formApi-validate, nested field', async () => {
        let fields = (
            <>
                <Form.Input field="a.b"  className='ab' validate={(val) => val ? '' : 'ab-err'} />
                <Form.Input field="a.c"  className='ac' validate={(val) => val ? '' : 'ac-err'} />
                <Form.Input field="e"  className='e' validate={(val) => val ? '' : 'e-err'} />
            </>
        )
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let formProps = { 
            children: fields,
            getFormApi,
        };
        let form = getForm(formProps);
        formApi.validate(['a']).then(values=>{}).catch(error=> {});
        await sleep(300);
        expect(formApi.getFormState().errors).toEqual({ a: { b: 'ab-err', c: 'ac-err' }});
    })

    it('formApi-setValue, when include nested field', async () => {
        let fields = (
            <>
                <Form.Input field="a.b"  className='ab' validate={(val) => val ? '' : 'ab-err'} />
                <Form.Input field="a.c"  className='ac' validate={(val) => val ? '' : 'ac-err'} />
                <Form.Input field="e"  className='e' validate={(val) => val ? '' : 'e-err'} />
            </>
        )
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let formProps = { 
            children: fields,
            getFormApi,
        };
        let form = getForm(formProps);
        formApi.setValue('a', { b: 'semi-b', c: 'semi-c'})
        await sleep(300);
        expect(formApi.getFormState().values).toEqual({ a: { b: 'semi-b', c: 'semi-c' }});
        expect(form.find('.ab .semi-input').instance().value).toEqual('semi-b');
        expect(form.find('.ac .semi-input').instance().value).toEqual('semi-c');
        expect(form.find('.e .semi-input').instance().value).toEqual('');
    });

    it('formApi-setEror, when include nested field', async () => {
        let fields = (
            <>
                <Form.Input field="a.b"  className='ab' validate={(val) => val ? '' : 'ab-err'} />
                <Form.Input field="a.c"  className='ac' validate={(val) => val ? '' : 'ac-err'} />
                <Form.Input field="e"  className='e' validate={(val) => val ? '' : 'e-err'} />
            </>
        )
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let formProps = { 
            children: fields,
            getFormApi,
        };
        let form = getForm(formProps);
        formApi.setError('a', { b: 'ab-err', c: 'ac-err'});
        form.update();
        await sleep(500);
        expect(formApi.getFormState().errors).toEqual({ a: { b: 'ab-err', c: 'ac-err' }});
        expect(form.find('.ab .semi-form-field-error-message span').at(1).text()).toEqual('ab-err');
        expect(form.find('.ac .semi-form-field-error-message span').at(1).text()).toEqual('ac-err');
    });

    it('formApi-setTouched, when include nested field', async () => {
        let fields = (
            <>
                <Form.Input field="a.b"  className='ab' validate={(val) => val ? '' : 'ab-err'} />
                <Form.Input field="a.c"  className='ac' validate={(val) => val ? '' : 'ac-err'} />
                <Form.Input field="e"  className='e' validate={(val) => val ? '' : 'e-err'} />
            </>
        )
        let formApi = null;
        let getFormApi = api => {
            formApi = api;
        };
        let formProps = { 
            children: fields,
            getFormApi,
        };
        let form = getForm(formProps);
        formApi.setTouched('a', { b: true, c: true })
        await sleep(300);
        expect(formApi.getFormState().touched).toEqual({ a: { b: true, c: true }});
    })

    // it('formApi-submitForm', () => {
    //     // submit should call validate first
    // });
});
