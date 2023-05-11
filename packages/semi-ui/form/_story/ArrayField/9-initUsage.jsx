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

function InitDemo() {
    const formRef = useRef();
    const formInitValues = {
        data: [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
            // { name: 'Semi DSM', role: 'Designer' },
        ]
    };

    const arrayFieldInitValue = [
        { name: 'Semi D2C', role: 'Engineer' },
        // { name: 'Semi C2D', role: 'Designer' },
    ];

    return (
        <Form ref={formRef} initValues={formInitValues}>
            {/* <ArrayField field="data">
                {({ add, addWithInitValue, arrayFields }) => (
                    <React.Fragment>
                        <Space>
                            <Button htmlType='reset'>Reset</Button>
                            <Button id='add' onClick={add} icon={<IconPlusCircle />} type="primary">Add</Button>
                            <Button
                                id='addWithInit'
                                onClick={() => addWithInitValue({ name: `Semi New-${arrayFields.length + 1}`, role: 'Designer' })}
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
                        <Button htmlType='reset'>Reset</Button>
                    </React.Fragment>
                )}
            </ArrayField> */}
            <ArrayField field="dataB" initValue={arrayFieldInitValue}>
                {({ add, addWithInitValue, arrayFields }) => (
                    <React.Fragment>
                        <Space>
                            <Button id='add' onClick={add} icon={<IconPlusCircle />} type="primary">Add</Button>
                            <Button
                                id='addWithInit'
                                onClick={() => addWithInitValue({ name: `Semi New-${arrayFields.length + 1}`, role: 'Designer' })}
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
                                        />
                                        <Form.Input
                                            id={`dataB-${i}-role`}
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
            </ArrayField>

            {/* <ArrayField field="dataC">
                {({ add, addWithInitValue, arrayFields }) => (
                    <React.Fragment>
                        <Space>
                            <Button id='add' onClick={add} icon={<IconPlusCircle />} type="primary">Add</Button>
                            <Button
                                id='addWithInit'
                                onClick={() => addWithInitValue({ name: `Semi New-${arrayFields.length + 1}`, role: 'Designer' })}
                                icon={<IconPlusCircle />}
                                type="primary">
                                Add with row initValue
                            </Button>
                        </Space>
                        {
                            arrayFields.map(({ field, key, remove }, i) => (
                                <div key={key} style={{ display: 'flex', width: 600 }} id={`dataC-${i}`} className='line'>
                                    <Space>
                                        <Form.Input
                                            id={`dataC-${i}-name`}
                                            field={`${field}[name]`}
                                            label={`${field}.name`}
                                            style={{ width: 200 }}
                                            initValue={'Semi DSM'}
                                        />
                                        <Form.Input
                                            id={`dataC-${i}-role`}
                                            field={`${field}[role]`}
                                            label={`${field}.role`}
                                            style={{ width: 200 }}
                                            initValue={'Designer'}
                                        />
                                    </Space>
                                    <Button style={{ margin: "36px 0 0 12px" }} type="danger" icon={<IconMinusCircle/>} onClick={remove}>remove this line</Button>
                                </div>
                            ))
                        }
                    </React.Fragment>
                )}
            </ArrayField>       */}
            <FormStateTree></FormStateTree>
        </Form>
    );
}

InitDemo.storyName = 'ArrayField-init';

export default InitDemo;