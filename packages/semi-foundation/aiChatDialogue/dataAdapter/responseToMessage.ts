import { Response } from './interface';

export default function responseToMessage(response: Response) {
    const { id, model, status, output, output_text, created_at } = response;

    return {
        id: id,
        role: "assistant",
        content: output,
        createdAt: created_at,
        output_text: output_text,
        model: model,
        status: status,
    };
}