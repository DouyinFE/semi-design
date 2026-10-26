import AIChatInput from '../index';
import { act } from 'react-dom/test-utils';

describe('AIChatInput public notifications', () => {
    it('reports the selected suggestion after inserting it', () => {
        const onSuggestClick = jest.fn();
        const input = new AIChatInput({ onSuggestClick });
        input.editor = { commands: { setContent: jest.fn(), focus: jest.fn() } };
        input.foundation.handleSuggestionSelect('Suggestion');
        expect(input.editor.commands.setContent).toHaveBeenCalledWith('Suggestion');
        expect(onSuggestClick).toHaveBeenCalledTimes(1);
        expect(onSuggestClick).toHaveBeenCalledWith('Suggestion');
    });

    it('reports template visibility changes once, including state changes outside the toggle method', async () => {
        const onTemplateVisibleChange = jest.fn();
        let wrapper;
        await act(async () => {
            wrapper = mount(<AIChatInput showUploadButton={false} onTemplateVisibleChange={onTemplateVisibleChange} />);
        });
        try {
            wrapper.instance().changeTemplateVisible(true);
            expect(onTemplateVisibleChange).toHaveBeenLastCalledWith(true);
            wrapper.instance().changeTemplateVisible(true);
            expect(onTemplateVisibleChange).toHaveBeenCalledTimes(1);
            wrapper.setState({ templateVisible: false });
            expect(onTemplateVisibleChange).toHaveBeenLastCalledWith(false);
            expect(onTemplateVisibleChange).toHaveBeenCalledTimes(2);
        } finally {
            await act(async () => { wrapper.unmount(); });
        }
    });
});
