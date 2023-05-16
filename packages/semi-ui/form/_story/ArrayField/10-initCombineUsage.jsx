import React, { useState, useRef } from 'react';
import { Form, Col, Row, Button, ArrayField, Space, useFormState } from '@douyinfe/semi-ui';
import { IconMinusCircle, IconPlusCircle } from '@douyinfe/semi-icons';

import { JSONTree } from 'react-json-tree';

const FormStateTree = () => {
    const formState = useFormState();
    return (
        <JSONTree
            shouldExpandNodeInitially={() => true}
            hideRoot
            data={formState}
        />
    );
};

function InitCombineDemo() {
    const formRef = useRef();

    return (
        <Form ref={formRef} initValues={{
            data: [
                { name: 'NameInFormProp', role: 'RoleInFormProp' },
            ]
        }}>
            <div>
                <Button htmlType='reset'>Reset</Button>
            </div>
            {/* <ArrayField field="data"
                initValue={[{ name: 'NameInArrayFieldProp', role: 'RoleInArrayFieldProp' }]}
            >
                {({ add, addWithInitValue, arrayFields }) => (
                    <React.Fragment>
                        <Space>
                            <Button id='dataAdd' onClick={add} icon={<IconPlusCircle />} type="primary">Add</Button>
                            <Button
                                id='dataAddWithInit'
                                onClick={() => addWithInitValue({ name: `Data-${arrayFields.length + 1}`, role: 'Designer' })}
                                icon={<IconPlusCircle />}
                                type="primary">
                                Add with row initValue
                            </Button>
                        </Space>
                        {
                            arrayFields.map(({ field, key, remove }, i) => (
                                <div key={key} style={{ display: 'flex', width: 600 }} id={`data-${i}`} className='line'>
                                    <Space>
                                        <Form.Input
                                            id={`data-${i}-name`}
                                            field={`${field}[name]`}
                                            label={`${field}.name`}
                                            style={{ width: 200 }}
                                        />
                                        <Form.Input
                                            id={`data-${i}-role`}
                                            field={`${field}[role]`}
                                            label={`${field}.role`}
                                            style={{ width: 200 }}
                                        />
                                    </Space>
                                    <Button style={{ margin: "36px 0 0 12px" }} type="danger" icon={<IconMinusCircle/>} onClick={remove}>remove this line</Button>
                                </div>
                            ))
                        }
                    </React.Fragment>
                )}
            </ArrayField> */}
            <ArrayField field="dataB" initValue={[{ name: 'NameInArrayFieldProp', role: 'RoleInArrayFieldProp' }]}>
                {({ add, addWithInitValue, arrayFields }) => (
                    <React.Fragment>
                        <Space>
                            <Button id='dataBAdd' onClick={add} icon={<IconPlusCircle />} type="primary">Add</Button>
                            <Button
                                id='dataBAddWithInit'
                                onClick={() => addWithInitValue({ name: `Data-${arrayFields.length + 1}`, role: 'Designer' })}
                                icon={<IconPlusCircle />}
                                type="primary">
                                Add with row initValue
                            </Button>
                        </Space>
                        {
                            arrayFields.map(({ field, key, remove }, i) => (
                                <div key={key} style={{ display: 'flex', width: 600 }} id={`dataB-${i}`} className='line'>
                                    <Space>
                                        <Form.Input
                                            id={`dataB-${i}-name`}
                                            field={`${field}[name]`}
                                            label={`${field}.name`}
                                            style={{ width: 200 }}
                                            initValue={'NameInFieldProp'}
                                        />
                                        <Form.Input
                                            id={`dataB-${i}-role`}
                                            field={`${field}[role]`}
                                            label={`${field}.role`}
                                            style={{ width: 200 }}
                                            initValue={'RoleInFieldProp'}
                                        />
                                    </Space>
                                    <Button style={{ margin: "36px 0 0 12px" }} type="danger" icon={<IconMinusCircle/>} onClick={remove}>remove this line</Button>
                                </div>
                            ))
                        }
                    </React.Fragment>
                )}
            </ArrayField>
            <FormStateTree></FormStateTree>
        </Form>
    );
}

InitCombineDemo.storyName = 'ArrayField-init combine';

export default InitCombineDemo;