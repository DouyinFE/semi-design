import Chat from '../index';
import InputBox from '../inputBox';

describe('Chat onInputChange', () => {
    it('reports the documented value and attachment fields', () => {
        const onInputChange = jest.fn();
        const wrapper = mount(<Chat onInputChange={onInputChange} />);
        const attachment = [{ uid: 'attachment', name: 'file.txt' }];
        wrapper.find(InputBox).prop('onInputChange')({ inputValue: 'Message', attachment });
        expect(onInputChange).toHaveBeenCalledTimes(1);
        expect(onInputChange).toHaveBeenCalledWith({ value: 'Message', attachment });
        wrapper.unmount();
    });
});
