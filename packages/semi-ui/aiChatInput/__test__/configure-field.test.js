import { AIChatInput, getConfigureItem } from '../../index';

const Configure = AIChatInput.Configure;
const Item = getConfigureItem(({ value, onChange }) => <button onClick={() => onChange(!value)}>Change</button>);

describe('Configure field registration', () => {
    let wrapper;
    afterEach(() => wrapper.unmount());

    it('registers the new field and preserves unrelated fields when field changes', () => {
        wrapper = mount(<Configure>
            <Item key="changing" field="a" initValue={1} />
            <Item key="stable" field="keep" initValue={3} />
        </Configure>);
        wrapper.setProps({ children: [
            <Item key="changing" field="b" initValue={2} />,
            <Item key="stable" field="keep" initValue={3} />,
        ] });
        expect(wrapper.instance().getConfigureValue()).toEqual({ b: 2, keep: 3 });
    });

    it('removes the currently registered field when an updated item unmounts', () => {
        wrapper = mount(<Configure><Item field="a" initValue={false} /></Configure>);
        wrapper.setProps({ children: <Item field="b" initValue={false} /> });
        wrapper.find('button').simulate('click');
        wrapper.setProps({ children: null });
        expect(wrapper.instance().getConfigureValue()).toEqual({});
    });

    it('does not turn initValue into a controlled value for an unchanged field', () => {
        wrapper = mount(<Configure><Item field="a" initValue={1} /></Configure>);
        wrapper.setProps({ children: <Item field="a" initValue={2} /> });
        expect(wrapper.instance().getConfigureValue()).toEqual({ a: 1 });
    });
});
