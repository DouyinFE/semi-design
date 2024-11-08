import { CompletionItem } from './jsonTypes';

export type JSONCompletionItem = CompletionItem & { insertText: string };

export interface CompletionsCollector {
    add(suggestion: JSONCompletionItem & { insertText: string }): void;
    error(message: string): void;
    setAsIncomplete(): void;
    getNumberOfProposals(): number
}
