import React, { useState, useRef } from 'react';
import { Form, Col, Row, Button, ArrayField, Space } from '@douyinfe/semi-ui';
import { IconMinusCircle, IconPlusCircle } from '@douyinfe/semi-icons';

function ManualSetDemo() {
    const formRef = useRef();
    const formInitValues = {
        data: [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
            // { name: 'Semi DSM', role: 'Designer' },
        ]
    };

    const getFormApi = () => {
        const formApi = formRef.current.formApi;  
        return formApi;
    };

    const setValueSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', [
            { name: 'Semi D2C-0', role: 'Engineer-0' },
            { name: 'Semi C2D-1', role: 'Designer' },
        ]);
    };

    const removeHeadSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', [
            { name: 'Semi C2D', role: 'Designer' },
            { name: 'Semi DSM', role: 'Designer' },
        ]);
    };

    const removeTailSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
        ]);
    };

    const removeMiddleSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi DSM', role: 'Designer' },
        ]);
    };

    const removeAllSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', []);
    };

    const addHeadSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', [
            { name: 'Semi DSM', role: 'Designer' },
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
        ]);
    };

    const addMiddleSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi DSM', role: 'Designer' },
            { name: 'Semi C2D', role: 'Designer' },
        ]);
    };

    const addTailSync = () => {
        const formApi = getFormApi();
        formApi.setValue('data', [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
            { name: 'Semi DSM', role: 'Designer' },
        ]);
    };

    
    return (
        <Form ref={formRef} initValues={formInitValues}>
            <div>
                <Space>
                    <Button id='updateSync' onClick={setValueSync}>setValueSync</Button>
                    <Button id='addHeadSync' onClick={addHeadSync}>addHeadSync</Button>
                    <Button id='addMiddleSync' onClick={addMiddleSync}>addMiddleSync</Button>
                    <Button id='addTailSync' onClick={addTailSync}>addTailSync</Button>
                </Space>
            </div>
            <div style={{ marginTop: 12, marginBottom: 12 }}>
                <Space>
                    <Button id='removeHeadSync' onClick={removeHeadSync} icon={<IconMinusCircle />} type='danger'>removeHeadSync</Button>
                    <Button id='removeTailSync' onClick={removeTailSync} icon={<IconMinusCircle />} type='danger'>removeTailSync</Button>
                    <Button id='removeMiddleSync' onClick={removeMiddleSync} icon={<IconMinusCircle />} type='danger'>removeMiddleSync</Button>
                    <Button id='removeAllSync' onClick={removeAllSync} icon={<IconMinusCircle />} type='danger'>removeAllSync</Button>
                </Space>
            </div>
            <ArrayField field="data">
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
            </ArrayField>
        </Form>
    );
}

ManualSetDemo.storyName = 'ArrayField-ManualSet Sync';

export default ManualSetDemo;