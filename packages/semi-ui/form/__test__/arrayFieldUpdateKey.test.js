import { act } from 'react-dom/test-utils';
import { Form, ArrayField } from '../index';

describe('ArrayField updates in the same millisecond', () => {
    it.each(['setValues', 'add then setValue'])('renders every row after %s', async operation => {
        const clock = sinon.useFakeTimers({ now: 1700000000000, toFake: ['Date'] });
        let wrapper;
        try {
            let api;
            let addRow;
            wrapper = mount(<Form getFormApi={value => { api = value; }}>
                <ArrayField field="rows" initValue={[{ name: 'one' }]}>
                    {({ add, arrayFields }) => {
                        addRow = add;
                        return arrayFields.map(({ field, key }) => <Form.Input key={key} field={`${field}.name`} />);
                    }}
                </ArrayField>
            </Form>);
            const rows = [{ name: 'first' }, { name: 'second' }, { name: 'third' }];
            await act(async () => {
                if (operation === 'setValues') {
                    api.setValues({ rows }, { isOverride: true });
                } else {
                    addRow();
                    api.setValue('rows', rows);
                }
            });
            wrapper.update();
            expect(api.getValues().rows).toEqual(rows);
            expect(wrapper.find('input').map(input => input.prop('value'))).toEqual(['first', 'second', 'third']);
        } finally {
            if (wrapper) { wrapper.unmount(); }
            clock.restore();
        }
    });
});
