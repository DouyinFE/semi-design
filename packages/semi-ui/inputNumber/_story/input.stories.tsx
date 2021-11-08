import React, { useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import InputNumber from '../index';
import { Input, Button } from '../../index';

const stories = storiesOf('InputNumber', module);

stories.add('default', () => {
    const Demo = () => {
        return (
            <div>
                <InputNumber defaultValue={123} />
            </div>
        );
    };

    return <Demo />;
});

stories.add('fix input string can bypass max value limit #38', () => {
    const Demo = () => {
        const [value, setValue] = useState(10);
        const [inputValue, setInputValue] = useState('');
        const [value2, setValue2] = useState<number | string>(1020);
        const log = value => {
            console.log('changed: ', value, 'typeof value: ', typeof value);
        }
        const handleChange = value => {
            log(value);
            setValue(value);
        }

        const handleInputChange = inputValue => {
            setInputValue(inputValue);
        }

        return (
            <div>
                <div>
                    <label>max=20</label>
                    <InputNumber max={20} defaultValue={10} onChange={log} />
                </div>
                <div>
                    <label>max=20 controlled mode</label>
                    <InputNumber max={20} value={value} onChange={handleChange} />
                </div>
                <div style={{ marginTop: 20 }}>
                    <Input onChange={handleInputChange} style={{ width: 200 }} />
                    <Button onClick={() => setValue2(inputValue)}>set props</Button>
                    <div>
                        {`inputValue=${inputValue}`}
                        <InputNumber max={20} value={value2} />
                    </div>
                </div>
            </div>
        );
    };

    return <Demo />;
});
