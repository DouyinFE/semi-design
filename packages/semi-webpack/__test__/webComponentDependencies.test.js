import loader from '../src/semi-web-component-loader';

describe('web component dependency styles', () => {
    const dependencies = {
        AIChatInput: ['aiChatInput/aiChatInput', 'select/select', 'radio/radio', 'upload/upload', 'progress/progress'],
        AIChatDialogue: ['aiChatDialogue/aiChatDialogue', 'avatar/avatar', 'checkbox/checkbox', 'markdownRender/markdownRender', 'button/button'],
        Feedback: ['feedback/feedback', 'input/textarea', 'radio/radio', 'checkbox/checkbox', 'modal/modal', 'sideSheet/sideSheet'],
        FloatButton: ['floatButton/floatButton', 'badge/badge'],
        Sidebar: ['sidebar/sidebar', 'button/button', 'resizable/resizable', 'jsonViewer/jsonViewer', 'collapse/collapse', 'upload/upload'],
    };

    Object.entries(dependencies).forEach(([component, paths]) => {
        it(`loads the styles used by ${component}`, () => {
            const output = loader(`/*SEMI_INSERT_STYLE_BEGIN${JSON.stringify([component])}SEMI_INSERT_STYLE_END*/`);
            paths.forEach(path => expect(output).toContain(`@douyinfe/semi-foundation/lib/es/${path}.scss`));
            expect(output).toContain('@douyinfe/semi-icons/lib/es/styles/icons.scss');
            expect(output).not.toContain('/aIChat');
        });
    });

    it('loads shared dependencies once when multiple components are requested', () => {
        const output = loader('/*SEMI_INSERT_STYLE_BEGIN["AIChatInput","Sidebar","FloatButton"]SEMI_INSERT_STYLE_END*/');
        expect(output.match(/import\("@douyinfe\/semi-foundation\/lib\/es\/button\/button.scss"\)/g)).toHaveLength(1);
        expect(output.match(/import\("@douyinfe\/semi-icons\/lib\/es\/styles\/icons.scss"\)/g)).toHaveLength(1);
    });
});
