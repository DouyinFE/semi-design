import DialogueAvatar from '../widgets/dialogueAvatar';
import Avatar from '../../avatar';

describe('AIChatDialogue avatar colors', () => {
    it('uses the configured role color and updates it when the role changes', () => {
        const wrapper = mount(<DialogueAvatar role={{ name: 'User', color: 'red' }} message={{ id: 'message', role: 'user' }} />);
        expect(wrapper.find(Avatar).prop('color')).toBe('red');
        wrapper.setProps({ role: { name: 'User', color: 'green' } });
        expect(wrapper.find(Avatar).prop('color')).toBe('green');
        wrapper.unmount();
    });

    it('keeps the default avatar color when no role color is configured', () => {
        const wrapper = mount(<DialogueAvatar role={{ name: 'User' }} message={{ id: 'message', role: 'user' }} />);
        expect(wrapper.find(Avatar).prop('color')).toBe('grey');
        wrapper.unmount();
    });
});
