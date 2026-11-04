import Hint from '../hint';

describe('Chat hint keyboard activation', () => {
    it('makes default hints focusable and activates them with Enter and Space', () => {
        const onHintClick = jest.fn();
        const wrapper = mount(<Hint value={['Suggestion']} onHintClick={onHintClick} />);
        const hint = wrapper.find('.semi-chat-hint-item');
        expect(hint.prop('role')).toBe('button');
        expect(hint.prop('tabIndex')).toBe(0);
        const preventDefault = jest.fn();
        hint.simulate('keydown', { key: 'Enter', preventDefault });
        hint.simulate('keydown', { key: ' ', preventDefault });
        expect(preventDefault).toHaveBeenCalledTimes(2);
        expect(onHintClick.mock.calls).toEqual([['Suggestion'], ['Suggestion']]);
        wrapper.unmount();
    });

    it('does not activate a hint for an unrelated key', () => {
        const onHintClick = jest.fn();
        const wrapper = mount(<Hint value={['Suggestion']} onHintClick={onHintClick} />);
        wrapper.find('.semi-chat-hint-item').simulate('keydown', { key: 'ArrowRight' });
        expect(onHintClick).not.toHaveBeenCalled();
        wrapper.unmount();
    });
});
