import React, { FunctionComponent } from 'react';
import { Form, useFormState, useFormApi, withField, Input, Button, Upload, withFormApi, withFormState } from '../../index';

import type { FormApi, FormFCChild, FormState } from '../interface';

const treeData = [
    {
        label: '浙江省',
        value: 'zhejiang',
        key: '0',
        children: [
            {
                label: '杭州市',
                value: 'hangzhou',
                key: '0-0',
                children: [
                    {
                        label: '西湖区',
                        value: 'xihu',
                        key: '0-0-0',
                    }
                ],
            }
        ],
    },
];

const htmlInput = (props: any) => {
    let value = props.value || '';
    delete props.validateStatus; // prevent props being transparently transmitted to DOM
    return <input {...props} value={value} />;
};

const FieldB = withField(Input);
const FieldA = withField(htmlInput, { valueKey: 'value', onKeyChangeFnName: 'onChange', valuePath: 'target.value' });

const Fields: FunctionComponent<FormFCChild> = ({ formState, values, formApi }) => {
    const ref = React.useRef();
    return (
    <>
        <Form.Rating field='test' className='fe' count={2}  />

        <Form.Input field='test' />
        <Input size='default' showClear insetLabel />
        <FieldB insetLabel placeholder='fe' fieldClassName='fieldClass-test' field='custom' />

        {/* <Button onClick={() => formApi.setValue('fieldA', 'fe')}>set</Button> */}
        <Form.Select field='test' >
            <Form.Select.Option value="f1"></Form.Select.Option>
            <Form.Select.Option value="f2"></Form.Select.Option>
        </Form.Select>
        <Form.Input field="UserName" label="用户名" />
        <Form.TextArea field="textarea" onKeyDown={(v: any) => console.log(v)}  />
        <Form.Input field="Password" label="密码" />
        <Form.InputNumber field="number" />
        <Form.Rating field="rating" />
        <Form.Switch field="switch" checkedText="on" uncheckedText="off"  />

        <Form.Cascader
            placeholder="请选择所在地区"
            field="area"
            label={{ text: '123', required: true, extra: 123 }}
            treeData={treeData}
        ></Form.Cascader>
        <Form.TimePicker field="time" minuteStep={2}/>
        <Form.AutoComplete field="fe" />

        <Form.TreeSelect field="treeSelect" treeData={treeData}  />
        <Form.Slider field="slider"   />
        <Form.DatePicker field="datepicker"  />
        <Form.CheckboxGroup
            field="type"
            label="申请类型（CheckboxGroup）"
            initValue={['user', 'admin']}
            rules={[{ required: true }]}
        >
            <Form.Checkbox value="admin">admin</Form.Checkbox>
            <Form.Checkbox value="user">user</Form.Checkbox>
            <Form.Checkbox value="guest">guest</Form.Checkbox>
            <Form.Checkbox value="root">root</Form.Checkbox>
        </Form.CheckboxGroup>
        <Form.RadioGroup
            field="radio"
            label="是否独占资源（Radio）"
            rules={[{ type: 'boolean' }, { required: true, message: '必须选择是否独占 ' }]}
        >
            <Form.Radio value={1}>是</Form.Radio>
            <Form.Radio value={0}>否</Form.Radio>
        </Form.RadioGroup>
        <Form.Checkbox field='abc' noLabel>
            我已阅读并清楚相关规定（Checkbox）
        </Form.Checkbox>
        <Form.Label text="fe" required />
        <Form.ErrorMessage error="errorText" />
        <FieldB field="custom" />
        <FieldA field="cuB" />
        <Form.TagInput field='tagInput' ref={ref} ></Form.TagInput>
        <Form.Upload ref={ref} fileName='semi' action='https://test.com' field='file' />
        <Form.Slot />
        <code style={{ marginTop: 30 }}>{JSON.stringify(formState)}</code>
    </>
    )
};
interface IProps {
    [x:string]: any;
}
interface IState {
    visible: boolean;
}

interface FData {
    test: boolean;
    test2: boolean;
    test3: string;
    test4: {
        event: string,
    },
    test5: {
        kkk: {
            jnumber: number
        }
    }
    testK: boolean;
    array: [string, string],
    nestedArray: Array<{
        id: number;
        name: string;
    }>;
    recurNestedArray: Array<{
        obj: Array<{ time: string; rule: string }>
        name: string;
    }>;
    optional?: {
        testL: string;
        testM?: {
            testN?: {
                testO?: Date;
                testP: number;
                testQ: RegExp;
                testR: {
                    R1: string;
                    R2: number;
                    R3: Array<{
                        R31: string;
                        R32: number;
                        R33: boolean;
                    }>;
                },
                testS: Set<string>;
                testT: Map<string, number>;
            }
        };
    };
}

const FCDemo = () => {
    const formApi = useFormApi<FData>();
    let optional = formApi.getValue('optional');
    let testO = formApi.getValue('optional.testM.testN.testO');
    let year = testO?.getFullYear();
    let testP = formApi.getValue('optional.testM.testN.testP');
    testP = testP + 1;
    let testSet = formApi.getValue('optional.testM.testN.testS');
    let testMap = formApi.getValue('optional.testM.testN.testT');
    testMap.entries();

    let NotExist = formApi.getValue('optional.testM.testN.NotExist');

    // ✅ 应该合法的, 注意，setValue只对 fieldPath做校验，对 value 不做严格校验
    formApi.setValue('test3', '123');
    formApi.setValue('test4.event', 123);
    formApi.setValue('test5.kkk', 123);
    formApi.setValue('test5.kkk.jnumber', 'abc');
    formApi.setValue('array[0]', '2025')
    formApi.setValue('array.0', '2025')
    formApi.setValue('nestedArray[0].id', 123)
    formApi.setValue('nestedArray[0].name', 'abc')
    formApi.setValue('recurNestedArray[0].obj', 123);
    formApi.setValue('recurNestedArray[0].obj[0].time', 123);
    formApi.setValue('recurNestedArray[1].name', 123);


    // ❌ 无法通过类型校验，应抛出错误的
    formApi.setValue('test5.kkk.notExist', 123);
    formApi.setValue('keyNotExist', 123);
    formApi.setValue('test4.notExist', 123);
    formApi.setValue('test4.notExist', 123);
    formApi.setValue('nestedArray[0].notExist', 123);

    formApi.setValue('recurNestedArray[0].name.notExist', 123);
    formApi.setValue('recurNestedArray[0].name[0].notExist', 123);
    formApi.setValue('recurNestedArray[1].obj.notExist', 123);
    
    // get 应该合法的
    let test3 = formApi.getValue('test3');
    let test4 = formApi.getValue('test4');
    let test4event = formApi.getValue('test4.event');
    let test5kkk = formApi.getValue('test5.kkk');
    let test5kkkjnumber = formApi.getValue('test5.kkk.jnumber');
    let recurNestedArrayObjTime = formApi.getValue('recurNestedArray[0].obj[0].time');
    let testM = formApi.getValue('optional.testM');
    let testL = formApi.getValue('optional.testL');

    // ❌ 无法通过类型校验，应抛出错误的
    let a = formApi.getValue('keyNotExist');
    let b = formApi.getValue('test5.kkk.notExist');
    let c = formApi.getValue('test4.notExist');
    let testNoExist = formApi.getValue('optional.NotExist');
}

class WithoutGenericsType extends React.Component<IProps, IState> {

    formApi: FormApi

    constructor(props: any) {
        super(props);
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    setData() {
        const formApi = this.formApi;
        formApi.setValue('test3', 123);
        formApi.setValue('test8', 123);
        formApi.setValue('test4.event', 123);
        formApi.setValue('test5.kkk', 123);
        formApi.setValue('test5.kkk.jjj', 123);
        formApi.setValue('test5.kkk.ppp', 123);
        formApi.setValue('test4.5', 123);
    }

    render() {
        return (
            <>
                <Form
                    getFormApi={this.getFormApi}
                    onSubmit={values => console.log(values.test2)}
                    onChange={formState => formState.values.test}
                    validateFields={values => ({ test4: 'test4 empty', test2: '' })}
                >
                </Form>
            </>
        );
    }
}


interface CodeProps {
    type?: 'email' | 'phone';
    test?: 'a' | 'b' | 'c';
    onSend?: () => Promise<void>
}

class CodeC extends React.Component<CodeProps & { formState?: FormState, formApi?: FormApi }, IState> {
    state: IState = {
        visible: false,
    };
    render() {
        const { formState } = this.props;

        return <div>
            t
        </div>;
    }
}


const t = () => (<CodeC type='email'></CodeC>);
const DoubleWrap = withFormState(withFormApi(CodeC));
const OneWrap = withFormApi(CodeC);


const FormWithChildren = () => (<Form>
    {({ formState, formApi, values }) => (
        <>
            <Form.Input field='fe'>
            </Form.Input>

            <DoubleWrap type='email' test='c'></DoubleWrap>
            <OneWrap type='email'></OneWrap>
            <CodeC type='email'></CodeC>

            <Form.DatePicker field='role' />
        </>
    )
    }
</Form>);


