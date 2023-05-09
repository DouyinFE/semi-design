import React, { useState, useRef } from 'react';
import { Form, Col, Row, Button, ArrayField, Space } from '@douyinfe/semi-ui';
import { IconMinusCircle, IconPlusCircle, IconRefresh } from '@douyinfe/semi-icons';

const NestDemo = () => {
    const formRef = useRef();

    const getFormApi = () => {
        const formApi = formRef.current.formApi;  
        return formApi;
    };

    const formInitValues = {
        data: [
            {
                name: '0',
                rules: [
                    { desc: '0-0-desc', type: '0-0-type' },
                    { desc: '0-1-desc', type: '0-1-type' },
                ],
            },
            {
                name: '1',
                rules: [
                    { desc: '1-0-desc', type: '1-0-type' }
                ],
            }
        ]
    };

    // const change = () => {
        
    // };

    return (
        <Form
            ref={formRef}
            initValues={formInitValues}
            labelPosition='inset'
        >
            <ArrayField field='data'>
                {({ add, arrayFields, addWithInitValue }) => (
                    <React.Fragment>
                        <Space>
                            <Button htmlType='reset' theme='solid' type='secondary' icon={<IconRefresh />}>Reset</Button>
                        </Space>
                        {
                            arrayFields.map(({ field, key, remove }, i) => (
                                <div key={key} style={{ width: 800, display: 'flex', flexWrap: 'wrap' }} id={`data-${i}`} className='line'>
                                    {/* {key} */}
                                    <Space>
                                        <Form.Input
                                            field={`${field}.name`}
                                            label={`${field}.name`}
                                            style={{ width: 700 }}
                                            id={`data-${i}-name`}
                                        >
                                        </Form.Input>
                                        <Button
                                            onClick={() => addWithInitValue({
                                                name: arrayFields.length,
                                                rules: [
                                                    { desc: `${arrayFields.length}-0-desc`, type: `${arrayFields.length}-0-type` }
                                                ]
                                            })}
                                            icon={<IconPlusCircle/>}
                                            id={`data-${i}-add`} 
                                            disabled={i !== arrayFields.length - 1}
                                        />
                                        <Button
                                            type='danger'
                                            onClick={remove}
                                            id={`data-${i}-remove`} 
                                            icon={<IconMinusCircle />}
                                        />
                                    </Space>
                           
                                    <ArrayField field={`${field}.rules`}>
                                        {({ add: addNested, arrayFields: nestedArrayFields, addWithInitValue: addNestedWithInitValue }, ) => (
                                            <React.Fragment>
                                                {
                                                    nestedArrayFields.map(({ field: f, key: k, remove: r }, n) => (
                                                        <section className='rules' key={k} style={{ display: 'flex', flexWrap: 'wrap', marginLeft: 36 }}>
                                                            <Space>
                                                                {/* {k} */}
                                                                <Form.Input
                                                                    style={{ width: 280, marginRight: 12 }}
                                                                    field={`${f}.type`}
                                                                    label={`${f}.type`}
                                                                    id={`data-${i}-rule-${n}-type`} 
                                                                />
                                                                <Form.Input
                                                                    style={{ width: 280 }}
                                                                    field={`${f}.desc`}
                                                                    label={`${f}.desc`}
                                                                    id={`data-${i}-rule-${n}-desc`} 
                                                                />
                                                                <Button
                                                                    onClick={() => addNestedWithInitValue({ type: `${i}-${n+1}-type`, desc: `${i}-${n+1}-desc` })}
                                                                    icon={<IconPlusCircle/>}
                                                                    id={`data-${i}-rule-${n}-add`}
                                                                    disabled={n !== nestedArrayFields.length - 1}
                                                                >
                                                                    add new line
                                                                </Button>
                                                                <Button
                                                                    type='danger'
                                                                    onClick={r}
                                                                    id={`data-${i}-rule-${n}-remove`} 
                                                                    icon={<IconMinusCircle />}
                                                                />
                                                            </Space>
                                                        </section>
                                                    ))
                                                }
                                            </React.Fragment>
                                        )}
                                    </ArrayField>
                                </div>
                            ))
                        }
                    </React.Fragment>
                )}
            </ArrayField>
        </Form>
    );
};

NestDemo.storyName = 'ArrayField-Nested Level 2';

export default NestDemo;

// class NestArrayField extends React.Component {
//     change = () => {
//         let number = this.formApi.getValue('number');
//         let newData = {
//             group: [
//                 { name: Math.random().toString().slice(0, 3), items: [ { itemName: Math.random(), type: '0-1' } ] },
//                 // { name: Math.random(), items: [ { itemName: Math.random(), type: '0-1' } ] },
//             ]
//         };
//         this.formApi.setValues(newData, { isOverride: true });
//     }
// }