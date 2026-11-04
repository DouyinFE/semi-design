import React from 'react';
import { mount } from 'enzyme';
import { rstest } from '@rstest/core';
import DialogueContent from '../widgets/dialogueContent';

describe('AIChatDialogue optional annotation click', () => {
    let wrapper;
    const citation = { type: 'url_citation', title: 'Semi Design', url: 'https://semi.design/' };
    const message = { id: '1', role: 'assistant', status: 'completed', content: [{ type: 'message', content: [{
        type: 'output_text', text: '正文', annotations: [citation, { type: 'file_citation', file_id: 'file-1' }, { type: 'container_file_citation', file_id: 'file-2' }],
    }] }] };
    afterEach(() => { wrapper?.unmount(); });

    it('allows clicking annotations without onAnnotationClick', () => {
        wrapper = mount(<DialogueContent message={message} />);

        expect(() => wrapper.find('.semi-ai-chat-dialogue-annotation-wrapper').simulate('click')).not.toThrow();
    });

    it.each(['Enter', ' '])('allows %s keyboard activation without onAnnotationClick', key => {
        wrapper = mount(<DialogueContent message={message} />);
        const preventDefault = rstest.fn();

        expect(() => wrapper.find('.semi-ai-chat-dialogue-annotation-wrapper').simulate('keydown', { key, preventDefault })).not.toThrow();
        expect(preventDefault).toHaveBeenCalledTimes(1);
    });

    it('passes the filtered annotation list to a provided callback once', () => {
        const onAnnotationClick = rstest.fn();
        wrapper = mount(<DialogueContent message={message} onAnnotationClick={onAnnotationClick} />);

        wrapper.find('.semi-ai-chat-dialogue-annotation-wrapper').simulate('click');

        expect(onAnnotationClick).toHaveBeenCalledTimes(1);
        expect(onAnnotationClick).toHaveBeenCalledWith([citation]);
    });
});
