import React from 'react';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { Form, ArrayField } from '@douyinfe/semi-ui';

const initialData = ['初始任务1', '初始任务2'];

describe('ArrayField Insert', () => {
    afterEach(cleanup);

    function getArrayFieldDemo(props = {}) {
        const {
            initialValues = { tasks: initialData },
            arrayFieldProps = {},
            onAdd
        } = props;

        const Demo = () => {
            return (
                <Form initValues={initialValues}>
                    <ArrayField field="tasks" {...arrayFieldProps}>
                        {({ add, arrayFields }) => (
                            <>
                                <button
                                    data-testid="add-default"
                                    onClick={() => {
                                        add();
                                        onAdd && onAdd();
                                    }}
                                >
                                    默认添加
                                </button>
                                <button
                                    data-testid="add-first"
                                    onClick={() => {
                                        add(0);
                                        onAdd && onAdd();
                                    }}
                                >
                                    添加到第一个位置
                                </button>
                                <button
                                    data-testid="add-last"
                                    onClick={() => {
                                        add(arrayFields.length);
                                        onAdd && onAdd();
                                    }}
                                >
                                    添加到末尾
                                </button>
                                <button
                                    data-testid="add-middle"
                                    onClick={() => {
                                        add(1);
                                        onAdd && onAdd();
                                    }}
                                >
                                    添加到中间位置
                                </button>
                                <button
                                    data-testid="add-outofrange"
                                    onClick={() => {
                                        add(100);
                                        onAdd && onAdd();
                                    }}
                                >
                                    添加到超出范围的索引
                                </button>
                                {arrayFields.map(({ field, key }, index) => (
                                    <div
                                        key={key}
                                        data-testid={`task-${index}`}
                                    >
                                        Task {index}: {field}
                                    </div>
                                ))}
                                <div data-testid="tasks-length">{arrayFields.length}</div>
                            </>
                        )}
                    </ArrayField>
                </Form>
            );
        };

        return render(<Demo />);
    }

    it('should add items at different positions', () => {
        const { getAllByTestId } = getArrayFieldDemo();

        // 添加到第一个位置
        fireEvent.click(getAllByTestId('add-first')[0]);
        let tasks = getAllByTestId(/task-/);
        let tasksLength = getAllByTestId('tasks-length')[0];

        expect(tasks.length).toBe(3);
        expect(tasksLength.textContent).toBe('3');

        // 添加到末尾位置
        const addLastButton = screen.getByText('添加到末尾');
        fireEvent.click(addLastButton);

        tasks = getAllByTestId(/task-/);
        tasksLength = getAllByTestId('tasks-length')[0];

        expect(tasks.length).toBe(4);
        expect(tasksLength.textContent).toBe('4');
    });

    it('should add items to non-empty array', () => {
        const { getAllByTestId } = getArrayFieldDemo();

        fireEvent.click(getAllByTestId('add-default')[0]);
        const tasks = getAllByTestId(/task-/);
        const tasksLength = getAllByTestId('tasks-length')[0];

        expect(tasks.length).toBe(3);
        expect(tasksLength.textContent).toBe('3');
    });

    it('should add items to empty array', () => {
        const { getAllByTestId } = getArrayFieldDemo({
            initialValues: { tasks: [] }
        });

        fireEvent.click(getAllByTestId('add-default')[0]);
        const tasks = getAllByTestId(/task-/);
        const tasksLength = getAllByTestId('tasks-length')[0];

        expect(tasks.length).toBe(1);
        expect(tasksLength.textContent).toBe('1');
    });

    it('should add items to middle position', () => {
        const { getAllByTestId } = getArrayFieldDemo();

        // 添加到中间位置
        const addMiddleButton = screen.getByText('添加到中间位置');
        fireEvent.click(addMiddleButton);

        const tasks = getAllByTestId(/task-/);
        const tasksLength = getAllByTestId('tasks-length')[0];

        expect(tasks.length).toBe(3);
        expect(tasksLength.textContent).toBe('3');
    });

    it('should handle out of range index', () => {
        const { getAllByTestId } = getArrayFieldDemo();

        // 添加到超出范围的索引
        const addOutOfRangeButton = screen.getByText('添加到超出范围的索引');
        fireEvent.click(addOutOfRangeButton);

        const tasks = getAllByTestId(/task-/);
        const tasksLength = getAllByTestId('tasks-length')[0];

        expect(tasks.length).toBe(3);
        expect(tasksLength.textContent).toBe('3');
    });
});