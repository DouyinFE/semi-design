import React, { useRef } from 'react';
import { render, fireEvent, cleanup, screen, act, waitFor } from '@testing-library/react';
import { Form, ArrayField, Button } from '@douyinfe/semi-ui';

describe('ArrayField Index Insert', () => {
    afterEach(cleanup);

    function ArrayFieldInsertDemo({ initialValues = { tasks: [{ name: 'task-0' }, { name: 'task-1' }, { name: 'task-2' }] } }) {
        const formApiRef = useRef();

        return (
            <Form initValues={initialValues} getFormApi={api => { formApiRef.current = api; }}>
                <ArrayField field="tasks">
                    {({ add, addWithInitValue, arrayFields }) => (
                        <>
                            <button data-testid="add-default" onClick={() => add()}>add()</button>
                            <button data-testid="add-at-0" onClick={() => add(0)}>add(0)</button>
                            <button data-testid="add-at-1" onClick={() => add(1)}>add(1)</button>
                            <button data-testid="add-at-end" onClick={() => add(arrayFields.length)}>add(end)</button>
                            <button data-testid="add-out-of-range" onClick={() => add(100)}>add(100)</button>
                            <button data-testid="add-negative" onClick={() => add(-5)}>add(-5)</button>
                            <button data-testid="add-with-init-at-0" onClick={() => addWithInitValue({ name: 'inserted' }, 0)}>addWithInitValue(0)</button>
                            <button data-testid="add-with-init-default" onClick={() => addWithInitValue({ name: 'appended' })}>addWithInitValue()</button>
                            <button
                                data-testid="get-values"
                                onClick={() => {
                                    const val = formApiRef.current.getValue('tasks');
                                    document.getElementById('form-values').textContent = JSON.stringify(val);
                                }}
                            >
                                getValues
                            </button>
                            {arrayFields.map(({ field, key, remove }, index) => (
                                <div key={key} data-testid={`task-${index}`}>
                                    <Form.Input field={`${field}[name]`} noLabel />
                                    <button data-testid={`remove-${index}`} onClick={remove}>remove</button>
                                </div>
                            ))}
                            <div data-testid="count">{arrayFields.length}</div>
                        </>
                    )}
                </ArrayField>
                <div id="form-values" data-testid="form-values" />
            </Form>
        );
    }

    it('add() without index should append to end', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);
        expect(getByTestId('count').textContent).toBe('3');

        fireEvent.click(getByTestId('add-default'));
        expect(getByTestId('count').textContent).toBe('4');

        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values[0]).toEqual({ name: 'task-0' });
        expect(values[1]).toEqual({ name: 'task-1' });
        expect(values[2]).toEqual({ name: 'task-2' });
    });

    it('add(0) should insert at beginning without shifting existing values', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);

        fireEvent.click(getByTestId('add-at-0'));
        expect(getByTestId('count').textContent).toBe('4');

        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values[0]).toBeNull();
        expect(values[1]).toEqual({ name: 'task-0' });
        expect(values[2]).toEqual({ name: 'task-1' });
        expect(values[3]).toEqual({ name: 'task-2' });
    });

    it('add(1) should insert at index 1 without shifting existing values', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);

        fireEvent.click(getByTestId('add-at-1'));
        expect(getByTestId('count').textContent).toBe('4');

        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values[0]).toEqual({ name: 'task-0' });
        expect(values[1]).toBeNull();
        expect(values[2]).toEqual({ name: 'task-1' });
        expect(values[3]).toEqual({ name: 'task-2' });
    });

    it('add(length) should behave same as append', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);

        fireEvent.click(getByTestId('add-at-end'));
        expect(getByTestId('count').textContent).toBe('4');

        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values[0]).toEqual({ name: 'task-0' });
        expect(values[1]).toEqual({ name: 'task-1' });
        expect(values[2]).toEqual({ name: 'task-2' });
    });

    it('add(100) out-of-range should clamp to end', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);

        fireEvent.click(getByTestId('add-out-of-range'));
        expect(getByTestId('count').textContent).toBe('4');

        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values[0]).toEqual({ name: 'task-0' });
        expect(values[1]).toEqual({ name: 'task-1' });
        expect(values[2]).toEqual({ name: 'task-2' });
    });

    it('add(-5) negative index should clamp to 0', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);

        fireEvent.click(getByTestId('add-negative'));
        expect(getByTestId('count').textContent).toBe('4');

        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values[0]).toBeNull();
        expect(values[1]).toEqual({ name: 'task-0' });
        expect(values[2]).toEqual({ name: 'task-1' });
        expect(values[3]).toEqual({ name: 'task-2' });
    });

    it('add() on empty array should work', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo initialValues={{ tasks: [] }} />);
        expect(getByTestId('count').textContent).toBe('0');

        fireEvent.click(getByTestId('add-default'));
        expect(getByTestId('count').textContent).toBe('1');
    });

    it('add(0) on empty array should work', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo initialValues={{ tasks: [] }} />);

        fireEvent.click(getByTestId('add-at-0'));
        expect(getByTestId('count').textContent).toBe('1');
    });

    it('addWithInitValue with index should insert value at specified position in form state', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);

        fireEvent.click(getByTestId('add-with-init-at-0'));
        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values.length).toBe(4);
        expect(values[0]).toEqual({ name: 'inserted' });
        expect(values[1]).toEqual({ name: 'task-0' });
        expect(values[2]).toEqual({ name: 'task-1' });
        expect(values[3]).toEqual({ name: 'task-2' });
    });

    it('addWithInitValue without index should append value in form state', () => {
        const { getByTestId } = render(<ArrayFieldInsertDemo />);

        fireEvent.click(getByTestId('add-with-init-default'));
        fireEvent.click(getByTestId('get-values'));
        const values = JSON.parse(getByTestId('form-values').textContent);
        expect(values.length).toBe(4);
        expect(values[0]).toEqual({ name: 'task-0' });
        expect(values[1]).toEqual({ name: 'task-1' });
        expect(values[2]).toEqual({ name: 'task-2' });
        expect(values[3]).toEqual({ name: 'appended' });
    });

    it('onClick={add} should not break when event object is passed', () => {
        const Demo = () => (
            <Form initValues={{ items: ['a', 'b'] }}>
                <ArrayField field="items">
                    {({ add, arrayFields }) => (
                        <>
                            <button data-testid="add-direct" onClick={add}>add</button>
                            <div data-testid="count">{arrayFields.length}</div>
                        </>
                    )}
                </ArrayField>
            </Form>
        );

        const { getByTestId } = render(<Demo />);
        expect(getByTestId('count').textContent).toBe('2');

        fireEvent.click(getByTestId('add-direct'));
        expect(getByTestId('count').textContent).toBe('3');
    });
});
