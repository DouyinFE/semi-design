import { act } from 'react-dom/test-utils';
import { Form, ArrayField } from '../index';

describe('ArrayField registration lifecycle', () => {
    const initial = [{ name: 'initial' }];
    const replacement = [{ name: 'replacement one' }, { name: 'replacement two' }];
    const next = [{ name: 'one' }, { name: 'two' }, { name: 'three' }];
    const renderArray = (key, initValue) => (
        <ArrayField key={key} field="rows" initValue={initValue}>
            {({ arrayFields }) => arrayFields.map(({ field, key: rowKey }) => (
                <Form.Input key={rowKey} field={field + '.name'} />
            ))}
        </ArrayField>
    );

    it('publishes ArrayField defaults before rendering rows that read Form values', async () => {
        function Schedule({ open }) {
            return open ? (
                <Form>
                    {({ values }) => (
                        <ArrayField field="rows" initValue={initial}>
                            {({ arrayFields }) => arrayFields.map(({ key: rowKey }, index) => (
                                <output key={rowKey}>{values.rows[index].name}</output>
                            ))}
                        </ArrayField>
                    )}
                </Form>
            ) : null;
        }
        const wrapper = mount(<Schedule open={false} />);
        try {
            for (let i = 0; i < 2; i++) {
                await act(async () => wrapper.setProps({ open: true }));
                wrapper.update();
                expect(wrapper.find('output').text()).toBe('initial');
                await act(async () => wrapper.setProps({ open: false }));
            }
        } finally {
            wrapper.unmount();
        }
    });

    it.each(['setValues', 'setValue'])('updates all rows after replacing the same field with %s', async operation => {
        let api;
        const wrapper = mount(<Form getFormApi={value => { api = value; }}>{renderArray('first', initial)}</Form>);
        try {
            await act(async () => {
                wrapper.setProps({ children: renderArray('second', replacement) });
            });
            await act(async () => {
                if (operation === 'setValues') {
                    api.setValues({ rows: next }, { isOverride: true });
                } else {
                    api.setValue('rows', next);
                }
            });
            wrapper.update();
            expect(api.getValues().rows).toEqual(next);
            expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(['one', 'two', 'three']);
        } finally {
            wrapper.unmount();
        }
    });

    it('resets the replacement using its own initial rows', async () => {
        let api;
        const wrapper = mount(<Form getFormApi={value => { api = value; }}>{renderArray('first', initial)}</Form>);
        try {
            await act(async () => {
                wrapper.setProps({ children: renderArray('second', replacement) });
            });
            await act(async () => {
                api.setValues({ rows: next }, { isOverride: true });
            });
            await act(async () => {
                api.reset();
            });
            wrapper.update();
            expect(api.getValues().rows).toEqual(replacement);
            expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(['replacement one', 'replacement two']);
        } finally {
            wrapper.unmount();
        }
    });

    it('removes the registration when the field is actually unmounted', async () => {
        let api;
        const wrapper = mount(<Form getFormApi={value => { api = value; }}>{renderArray('first', initial)}</Form>);
        try {
            await act(async () => {
                wrapper.setProps({ children: null });
            });
            await act(async () => {
                api.reset();
            });
            expect(api.getValues()).toEqual({});
        } finally {
            wrapper.unmount();
        }
    });

    it('registers again after a StrictMode style simulated unmount and remount', async () => {
        let api;
        const wrapper = mount(<Form getFormApi={value => { api = value; }}>{renderArray('first', initial)}</Form>);
        try {
            // React 18+ StrictMode runs componentWillUnmount then componentDidMount on the same instance
            const instance = wrapper.find(ArrayField).instance();
            await act(async () => {
                instance.componentWillUnmount();
                instance.componentDidMount();
            });
            await act(async () => {
                api.setValue('rows', next);
            });
            await act(async () => {
                api.reset();
            });
            wrapper.update();
            expect(api.getValues().rows).toEqual(initial);
            expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(['initial']);
        } finally {
            wrapper.unmount();
        }
    });

    it('keeps parent componentDidMount setValues working', async () => {
        let api;
        class InitializeOnMount extends React.Component {
            componentDidMount() {
                api.setValues({ rows: next }, { isOverride: true });
            }
            render() {
                return <Form getFormApi={value => { api = value; }}>{renderArray('first', [])}</Form>;
            }
        }
        let wrapper;
        try {
            await act(async () => {
                wrapper = mount(<InitializeOnMount />);
            });
            wrapper.update();
            expect(api.getValues().rows).toEqual(next);
            expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(['one', 'two', 'three']);
        } finally {
            wrapper.unmount();
        }
    });

    it.each([false, true])('preserves writes and reset before the ArrayField mounts (reset: %s)', async reset => {
        let api;
        class ResetOnMount extends React.Component {
            componentDidMount() {
                api.setValue('rows', next);
                if (reset) {
                    api.reset();
                }
            }
            render() {
                return null;
            }
        }
        let wrapper;
        try {
            await act(async () => {
                wrapper = mount(<Form getFormApi={value => { api = value; }}>
                    <ResetOnMount />
                    {renderArray('first', initial)}
                </Form>);
            });
            wrapper.update();
            const expected = reset ? initial : next;
            expect(api.getValues().rows).toEqual(expected);
            expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(expected.map(row => row.name));
        } finally {
            wrapper.unmount();
        }
    });

    it('updates nested array fields after their parent rows change', async () => {
        let api;
        const wrapper = mount(<Form getFormApi={value => { api = value; }}>
            <ArrayField field="groups" initValue={[{ rows: initial }]}>
                {({ arrayFields }) => arrayFields.map(({ key, field }) => (
                    <ArrayField key={key} field={field + '.rows'}>
                        {({ arrayFields: nested }) => nested.map(({ key: nestedKey, field: nestedField }) => (
                            <Form.Input key={nestedKey} field={nestedField + '.name'} />
                        ))}
                    </ArrayField>
                ))}
            </ArrayField>
        </Form>);
        try {
            await act(async () => {
                api.setValues({ groups: [{ rows: replacement }, { rows: initial }] }, { isOverride: true });
            });
            wrapper.update();
            expect(api.getValues().groups).toEqual([{ rows: replacement }, { rows: initial }]);
            expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(['replacement one', 'replacement two', 'initial']);
        } finally {
            wrapper.unmount();
        }
    });
});
