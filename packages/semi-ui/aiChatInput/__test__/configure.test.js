import { AIChatInput, getConfigureItem } from '../../index';

const Configure = AIChatInput.Configure;

describe('Configure change notifications', () => {
    it('keeps its state updater free from parent callbacks', () => {
        const onChange = jest.fn();
        const configure = new Configure({ onChange });
        let complete;
        configure.setState = (update, callback) => {
            const state = { value: { a: 1 } };
            update(state);
            configure.state = update(state);
            complete = callback;
        };
        configure.onChange({ b: 2 });
        expect(onChange).not.toHaveBeenCalled();
        complete();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith({ a: 1, b: 2 }, { b: 2 });
    });

    it('keeps the value snapshot associated with each change', () => {
        const onChange = jest.fn();
        const wrapper = mount(<Configure onChange={onChange} />);
        wrapper.instance().onChange({ a: 1 });
        wrapper.instance().onChange({ b: 2 });
        expect(onChange.mock.calls).toEqual([[{ a: 1 }, { a: 1 }], [{ a: 1, b: 2 }, { b: 2 }]]);
        wrapper.unmount();
    });

    it('removes a field only once and preserves other values', () => {
        const onChange = jest.fn();
        const wrapper = mount(<Configure defaultValue={{ a: 1, b: 2 }} onChange={onChange} />);
        wrapper.instance().onRemove('a');
        wrapper.instance().onRemove('a');
        expect(wrapper.instance().getConfigureValue()).toEqual({ b: 2 });
        expect(onChange.mock.calls).toEqual([[{ b: 2 }]]);
        wrapper.unmount();
    });

    it('keeps initValue in the configuration without forwarding it to the wrapped component', () => {
        let received;
        const Item = getConfigureItem(props => { received = props; return <button />; });
        const wrapper = mount(<Configure><Item field="a" initValue={1} /></Configure>);
        expect(wrapper.instance().getConfigureValue()).toEqual({ a: 1 });
        expect(received.initValue).toBeUndefined();
        wrapper.unmount();
    });
});
