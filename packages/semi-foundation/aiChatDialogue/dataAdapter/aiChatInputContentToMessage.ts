

export default function AiChatInputContentToMessage(inputContent: any) { // todo: 合入 aiChatInput 后补充类型定义
    const { references, attachments, inputContents, setup } = inputContent;

    let inputs: any[] = [];

    if (attachments?.length) { // todo: attachment 允许传递目录？
        attachments.forEach((item: any) => {
            const { name, url } = item;
            // todo: 如何区分文件是 image 还是 file?
            if (name.includes('.png') || name.includes('.jpg') || name.includes('.jpeg')) {
                inputs.push({
                    type: 'input_image',
                    image_url: url,
                    detail: 'auto'
                });
            } else {
                inputs.push({
                    type: 'input_file',
                    file_url: url, // todo: blob URL？
                    name: name,
                });
            }
        });
    }

    if (inputContents?.length) {
        inputContents.forEach((item: any) => {
            inputs.push({
                type: 'input_text',
                text: item.text,
            });
        });
    }

    // todo: mcp 

    return {
        role: "user",
        content: inputs,
        // createdAt: created_at, // todo: 产生消息时给 createdat 还是发送时？
        // model: model, // todo: inputContent 中未包含 model 信息
        references
    };
}
