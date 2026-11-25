import Slider from '..';

describe('Slider release bounds', () => {
    it('bounds the release callback after max changes', () => {
        const onAfterChange = sinon.spy();
        const wrapper = mount(<Slider defaultValue={80} onAfterChange={onAfterChange} />);
        wrapper.setProps({ max: 60 });
        wrapper.instance().adapter.onHandleUpAfter();
        expect(onAfterChange.lastCall.args[0]).toEqual(60);
        wrapper.unmount();
    });
});
