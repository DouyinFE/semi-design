import type { BrowserAIProps as FoundationBrowserAIProps } from '@douyinfe/semi-foundation/browserAI/interface';
import type { AIChatDialogueProps } from '../aiChatDialogue/interface';
import type { AIChatInputProps } from '../aiChatInput/interface';
import type { Message } from '@douyinfe/semi-foundation/aiChatDialogue/foundation';

export interface BrowserAIProps extends FoundationBrowserAIProps {
    dialogueProps?: Partial<AIChatDialogueProps>;
    inputProps?: Partial<AIChatInputProps>
}

export interface BrowserAIState {
    engine: any | null;
    loading: boolean;
    error: string | null;
    chats: Message[];
    isGenerating: boolean;
    messages: any[];
    references: any[];
    abortController: AbortController | null
}

