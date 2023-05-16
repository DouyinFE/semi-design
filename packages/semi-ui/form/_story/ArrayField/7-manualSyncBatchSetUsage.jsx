import React, { useState, useRef } from 'react';
import { Form, Col, Row, Button, ArrayField, Space, useFormState } from '@douyinfe/semi-ui';
import { IconMinusCircle, IconPlusCircle, IconRefresh } from '@douyinfe/semi-icons';
import { JSONTree } from 'react-json-tree';

// TODO

//  Async setValues
//  Sync setValues
//  Async setValues, override
//  Sync setValues, override

// 0 -> 3
// 3 -> 0
// 3 -> 2
// 2 -> 3

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

function SetValues() {
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

    const setValuesAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({
            data: [
                { name: 'Semi D2C-0', role: 'Engineer-0' },
                { name: 'Semi C2D-1', role: 'Designer' },
            ]
        }, { isOverride: true });
        // }, 200);
    };

    const removeHeadAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({ data: [
            { name: 'Semi C2D', role: 'Designer' },
            { name: 'Semi DSM', role: 'Designer' },
        ] }, { isOverride: true });
        // }, 200);

    };

    const removeTailAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({ data: [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
        ] }, { isOverride: true });
        // }, 200);
    };

    const removeMiddleAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({ data: [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi DSM', role: 'Designer' },
        ] }, { isOverride: true });
        // }, 200);

    };

    const removeAllAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({}, { isOverride: true });
        // }, 200);

    };

    const addHeadAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({ data: [
            { name: 'Semi DSM', role: 'Designer' },
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
        ] }, { isOverride: true });
        // }, 200);
    };

    const addMiddleAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({ data: [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi DSM', role: 'Designer' },
            { name: 'Semi C2D', role: 'Designer' },
        ] }, { isOverride: true });
        // }, 200);
    };

    const addTailAsync = () => {
        const formApi = getFormApi();
        // setTimeout(() => {
        formApi.setValues({ data: [
            { name: 'Semi D2C', role: 'Engineer' },
            { name: 'Semi C2D', role: 'Designer' },
            { name: 'Semi DSM', role: 'Designer' },
        ] }, { isOverride: true });
        // }, 200);
    };

    
    return (
        <Form ref={formRef} initValues={formInitValues}>
            <div>
                <Space>
                    <Button id='updateAsync' onClick={setValuesAsync}>setValuesAsync</Button>
                    <Button id='addHeadAsync' onClick={addHeadAsync}>addHeadAsync</Button>
                    <Button id='addMiddleAsync' onClick={addMiddleAsync}>addMiddleAsync</Button>
                    <Button id='addTailAsync' onClick={addTailAsync}>addTailAsync</Button>
                </Space>
            </div>
            <div style={{ marginTop: 12, marginBottom: 12 }}>
                <Space>
                    <Button id='removeHeadAsync' onClick={removeHeadAsync} icon={<IconMinusCircle />} type='danger'>removeHeadAsync</Button>
                    <Button id='removeTailAsync' onClick={removeTailAsync} icon={<IconMinusCircle />} type='danger'>removeTailAsync</Button>
                    <Button id='removeMiddleAsync' onClick={removeMiddleAsync} icon={<IconMinusCircle />} type='danger'>removeMiddleAsync</Button>
                    <Button id='removeAllAsync' onClick={removeAllAsync} icon={<IconMinusCircle />} type='danger'>removeAllAsync</Button>
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
            <FormStateTree></FormStateTree>
        </Form>
    );
}

SetValues.storyName = 'ArrayField-ManualBatchSet Sync';

export default SetValues;