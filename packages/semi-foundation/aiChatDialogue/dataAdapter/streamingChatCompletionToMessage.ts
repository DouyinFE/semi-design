import { Message } from 'aiChatDialogue/foundation';
import { ChatCompletionChunk, ChatCompletionFunctionToolCall } from './interface';
 

// 状态对象：记录每个请求 id + choice index 已处理的 chunk 数量
export interface StreamingChatState {
    processedCountByIndex?: Record<string, number>
}

export default function streamingChatCompletionToMessage(chatCompletionChunks: ChatCompletionChunk[], state?: StreamingChatState): { messages: Message[]; state?: StreamingChatState } { // There may be N answers, so the return value is a Message array

    const groupedChunks = groupByIndex(chatCompletionChunks);

    const results = groupedChunks.map((chatCompletionChunks: ChatCompletionChunk[], groupIndex: number) => {
        const id = chatCompletionChunks[0].id;
        const status = getStatus(chatCompletionChunks);
        let textContent = '';
        let refusal = '';
        let functionCall = { name: '', arguments: '' };
        let toolCalls = {};

        // 基于 state 增量处理：仅处理新到达的 chunk 片段
        const stateKey = `${id}:${chatCompletionChunks[0]?.choices?.[0]?.index ?? groupIndex}`;
        const processedCount = state?.processedCountByIndex?.[stateKey] ?? 0;
        const start = processedCount > 0 ? Math.min(processedCount, chatCompletionChunks.length) : 0;
        const chunksToProcess = state ? chatCompletionChunks.slice(start) : chatCompletionChunks;

        // 若提供了 state 且本次没有新增内容，则跳过该 index
        if (state && chunksToProcess.length === 0) {
            return null;
        }

        chunksToProcess.map((chunk: ChatCompletionChunk) => {
            const delta = chunk.choices[0].delta;
            if (delta?.content) {
                textContent += delta.content;
            }
            if (delta?.refusal) {
                refusal += delta.refusal;
            }
            if (delta?.function_call) {
                if (delta.function_call.name) {
                    functionCall.name += delta.function_call.name;
                }
                functionCall.arguments += delta.function_call.arguments;
            }
            if (delta?.tool_calls) {
                delta?.tool_calls.forEach((toolCall: ChatCompletionFunctionToolCall) => {
                    if (toolCalls[toolCall.id]) {
                        if (toolCall.function.name) {
                            toolCalls[toolCall.id].name += toolCall.function.name;
                        }
                        toolCalls[toolCall.id].arguments += toolCall.function.arguments;
                    } else {
                        toolCalls[toolCall.id] = {
                            ...(toolCall as ChatCompletionFunctionToolCall).function,
                            type: 'function_call',
                            status: status,
                            id: toolCall.id,
                        };
                    }
                });
            }
        });

        const toolCallsArray = Object.values(toolCalls) as ChatCompletionFunctionToolCall[];

        const outputMessage = [
            textContent !== '' && {
                type: 'output_text',
                text: textContent,
            },
            refusal !== '' && {
                type: 'refusal',
                refusal: refusal,
            },
        ].filter(Boolean);


        const outputResult = [
            outputMessage.length > 0 && {
                type: 'message',
                id: id,
                role: 'assistant',
                status: status,
                content: outputMessage
            },
            functionCall.name !== '' && {
                type: 'function_call',
                status: status,
                ...functionCall
            },
            ...toolCallsArray,
        ].filter(Boolean);

        // 更新 state：记录该 index 已处理到的 chunk 数量
        if (state) {
            if (!state.processedCountByIndex) {
                state.processedCountByIndex = {};
            }
            state.processedCountByIndex[stateKey] = chatCompletionChunks.length;
        }

        return {
            id: id,
            role: "assistant",
            content: outputResult,
            status: status,
        };
    }).filter(Boolean) as Message[];
    
    return {
        messages: results,
        state: state
    };
}

const groupByIndex = (chatCompletionChunks: ChatCompletionChunk[]) => {
    const groupedChunks = [];
    chatCompletionChunks.forEach((chunk) => {
        const curIndex = chunk.choices[0].index;
        if (!groupedChunks[curIndex]) {
            groupedChunks[curIndex] = [];
        }
        groupedChunks[curIndex].push(chunk);
    });
    return groupedChunks;
};

const getStatus = (chatCompletionChunks: ChatCompletionChunk[]) => {
    const lastChunk = chatCompletionChunks[chatCompletionChunks.length - 1];
    return lastChunk.choices[0].finish_reason !== null ? 'completed' : 'in_progress';
};