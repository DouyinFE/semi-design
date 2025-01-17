import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Form, ArrayField } from '@douyinfe/semi-ui';

describe('ArrayField Indexed Insert', () => {
    it('should add items at different indexes correctly', () => {
        const Demo = () => {
            const [formState, setFormState] = React.useState({
                tasks: [{ name: '初始任务' }]
            });

            const handleValueChange = (values) => {
                setFormState(values);
            };

            return (
                <Form 
                    initValues={formState} 
                    onValueChange={handleValueChange}
                >
                    <ArrayField field="tasks">
                        {({ add, arrayFields }) => (
                            <>
                                <button onClick={() => add()}>默认添加到末尾</button>
                                <button onClick={() => add(0)}>添加到第一个位置后</button>
                                <button onClick={() => add(1)}>添加到第二个位置后</button>
                                <button onClick={() => add(arrayFields.length - 1)}>添加到倒数第二个位置</button>
                                {arrayFields.map(({ field, key }, index) => (
                                    <div 
                                        key={key} 
                                        data-testid={`task-${index}`}
                                    >
                                        Task {index}
                                    </div>
                                ))}
                            </>
                        )}
                    </ArrayField>
                </Form>
            );
        };

        const { getAllByTestId, getByText } = render(<Demo />);

        // 默认添加到末尾
        fireEvent.click(getByText('默认添加到末尾'));
        let tasks = getAllByTestId(/task-/);
        expect(tasks.length).toBe(2);

        // 添加到第一个位置后
        fireEvent.click(getByText('添加到第一个位置后'));
        tasks = getAllByTestId(/task-/);
        expect(tasks.length).toBe(3);

        // 添加到第二个位置后
        fireEvent.click(getByText('添加到第二个位置后'));
        tasks = getAllByTestId(/task-/);
        expect(tasks.length).toBe(4);

        // 添加到倒数第二个位置
        fireEvent.click(getByText('添加到倒数第二个位置'));
        tasks = getAllByTestId(/task-/);
        expect(tasks.length).toBe(5);
    });
});