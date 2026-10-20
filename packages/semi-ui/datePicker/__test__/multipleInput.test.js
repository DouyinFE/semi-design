import DatePicker from '../index';
import BaseDatePicker from '../datePicker';
import { format } from 'date-fns';

describe('DatePicker multiple input', () => {
    it.each([
        ['2021-06-01,2021-06-01,2021-06-15', ['2021-06-01', '2021-06-15']],
        ['2021-06-15,2021-06-01,2021-06-15', ['2021-06-15', '2021-06-01']],
        ['2021-06-01,2021-06-01', ['2021-06-01']],
        ['2021-06-01,2021-06-15', ['2021-06-01', '2021-06-15']],
    ])('confirms unique dates on Enter for %s', (value, expected) => {
        const onChange = sinon.spy();
        const wrapper = mount(<DatePicker type="date" multiple motion={false} onChange={onChange} />);
        const input = wrapper.find('input');

        input.simulate('change', { target: { value } });
        input.simulate('keypress', { key: 'Enter', target: { value } });

        expect(input.getDOMNode().value).toBe(expected.join(','));
        expect(onChange.lastCall.args[0].map(date => format(date, 'yyyy-MM-dd'))).toEqual(expected);
        expect(onChange.lastCall.args[1]).toEqual(expected);
        wrapper.unmount();
    });

    it.each(['parseMultipleInput', 'parseMultipleInputLoose'])('%s deduplicates before applying max', method => {
        const wrapper = mount(<DatePicker type="date" multiple max={2} motion={false} />);
        const foundation = wrapper.find(BaseDatePicker).instance().foundation;
        const result = foundation[method]('2021-06-15,2021-06-01,2021-06-15', ',', true);

        expect(result.map(date => format(date, 'yyyy-MM-dd'))).toEqual(['2021-06-15', '2021-06-01']);
        expect(foundation[method]('2021-06-01,2021-06-15,2021-06-20', ',', true)).toEqual([]);
        wrapper.unmount();
    });
});
