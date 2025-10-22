export const RESPONSE_DATA = {
    "id": "resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41",
    "object": "response",
    "created_at": 1741476777,
    "status": "completed",
    "error": null,
    "incomplete_details": null,
    "instructions": null,
    "max_output_tokens": null,
    "model": "gpt-4o-2024-08-06",
    "output": [
        {
            "id": "rs_6876cf02e0bc8192b74af0fb64b715ff06fa2fcced15a5ac",
            "type": "reasoning",
            "status": "completed",
            "summary": [
                {
                    "type": "summary_text",
                    "text": "**Answering a simple question**\n\nI\u2019m looking at a straightforward question: the capital of France is Paris. It\u2019s a well-known fact, and I want to keep it brief and to the point. Paris is known for its history, art, and culture, so it might be nice to add just a hint of that charm. But mostly, I\u2019ll aim to focus on delivering a clear and direct answer, ensuring the user gets what they\u2019re looking for without any extra fluff."
                }
            ]
        },
        {
            "type": "message",
            "id": "msg_67ccd3acc8d48190a77525dc6de64b4104becb25c45c1d41",
            "status": "completed",
            "role": "assistant",
            "content": [
                {
                    "type": "output_text",
                    "text": "The image depicts a scenic landscape with a wooden boardwalk or pathway leading through lush, green grass under a blue sky with some clouds. The setting suggests a peaceful natural area, possibly a park or nature reserve. There are trees and shrubs in the background.",
                    "annotations": [
                        {
                            "title": '快乐星球',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": '快乐星球是一个快乐的地方',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        },
                        {
                            "title": '快乐星球',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": '快乐星球是一个快乐的地方',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        },
                        {
                            "title": '快乐星球',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": '快乐星球是一个快乐的地方',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        },
                        {
                            "title": '快乐星球',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": '快乐星球是一个快乐的地方',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        },
                        {
                            "title": '快乐星球',
                            "url": 'https://semi.design/zh-CN/start/getting-started',
                            "detail": '快乐星球是一个快乐的地方',
                            "logo": 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
                        }
                    ]
                }
            ]
        },
        {
            "id": "fc_12345xyz",
            "call_id": "call_12345xyz",
            "type": "function_call",
            "name": "get_weather",
            "status": "completed",
            "arguments": "{\"location\":\"Paris, France\"}"
        },
        {
            "id": "ctc_6890e975e86c819c9338825b3e1994810694874912ae0ea6",
            "type": "custom_tool_call",
            "status": "completed",
            "call_id": "call_aGiFQkRWSWAIsMQ19fKqxUgb",
            "input": "print(\"hello world\")",
            "name": "code_exec"
        }
    ],
    "parallel_tool_calls": true,
    "previous_response_id": null,
    "reasoning": {
        "effort": null,
        "summary": null
    },
    "store": true,
    "temperature": 1,
    "text": {
        "format": {
            "type": "text"
        }
    },
    "tool_choice": "auto",
    "tools": [],
    "top_p": 1,
    "truncation": "disabled",
    "usage": {
        "input_tokens": 328,
        "input_tokens_details": {
            "cached_tokens": 0
        },
        "output_tokens": 52,
        "output_tokens_details": {
            "reasoning_tokens": 0
        },
        "total_tokens": 380
    },
    "user": null,
    "metadata": {}
};