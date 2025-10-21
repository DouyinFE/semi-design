import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AIChatDialogue, RadioGroup, Radio, Button, Input, Toast, ChatCompletionToMessage, StreamingChatCompletionToMessage, StreamingResponseToMessage } from '../../index';
import { IconSearch, IconFile, IconCode, IconTerminal } from '@douyinfe/semi-icons';
import CustomRenderContentItem from './CustomRenderContentItem';
import RenderConfigContentItem from './RenderConfig';
import ResponseToMessageDemo from './DataAdapter/responseToMessage';
import StreamingChatCompletionToMessageDemo from './DataAdapter/streamingChatCompletionToMessage';
import StreamingResponseToMessageDemo from './DataAdapter/streamingResponseToMessage';
import ChatCompletionToMessageDemo from './DataAdapter/chatCompletionToMessage';
// import { RESPONSE_CHUNKS, REFUSAL_CHUNKS, REASONING_CHUNKS, FUNCTION_CALL_CHUNKS, CUSTOM_TOOL_CALL_CHUNKS, MCP_CHUNKS } from './Data/StreamingResponseData'

export default {
  title: 'AIChatDialogue',
}

const defaultMessages = [{
  id: '1',
  role: 'user',
  content: '你好',
}, {
  id: '2',
  role: 'assistant',
  content: '你好呀，请问有什么可以帮助您的吗～你好呀，请问有什么可以帮助您的吗～你好呀，请问有什么可以帮助您的吗～',
  status: 'completed',
}, {
  id: '3',
  role: 'user',
  content: [{
      type: 'message',
      content: [{
          type: 'input_text',
          text: '帮我生成类似的图片',
      }],
  }, {
      type: 'message',
      content: [{
          type: 'input_image',
          image_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
          file_id: 'demo-file-id'
      }, {
        type: 'input_image',
        image_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
        file_id: 'demo-file-id'
      }
    ],
  }],
  status: 'completed',
}, {
  id: '4',
  role: 'assistant',
  content: [{
    type: 'message',
    role: 'assistant',
    content: [{
        type: 'output_text',
        text: '好的，请稍等',
    }],
  }],
  status: 'completed',
}];

const loadingMessages = [{
  id: '1',
  role: 'assistant',
  status: 'in_progress',
}];

const multiModalityMessage = [{
  id: '1',
  role: 'user',
  content: '你好',
}, {
  id: '2',
  role: 'assistant',
  content: '你好呀，请问有什么可以帮助您的吗？',
  status: 'completed',
}, {
  id: '3',
  role: 'user',
  content: [{
    type: 'message',
    content: [{
      type: "input_text",
      text: "帮我根据下面文件的内容，生成一个简单的 semi design 代码使用示例",
    },{
      type: 'input_file',
      file_url: 'https://www.berkshirehathaway.com/letters/2024ltr.pdf',
      filename: '2024ltr.pdf',
      size: '100KB',
    },{
      type: 'input_file',
      file_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/edit-bag.jpeg',
      filename: 'edit-bag.jpeg',
      size: '100KB',
    },
    {
      type: 'input_file',
      file_url: 'https://www.berkshirehathaway.com/letters/2024ltr.docx',
      filename: 'i-am-word.docx',
      size: '1000KB',
    }
  ],
  }],
  status: 'completed',
}, {
  id: '4',
  role: 'assistant',
  content: [{
    type: 'message',
    content: [{
      type: 'output_text',
      text: "以下是一个 Semi 代码的使用示例：\n\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n",
    }],
  }],
  status: 'completed',
}];

const reasoningMessage = [{
  id: '1',
  role: 'user',
  content: '我是谁？',
}, {
  id: '2',
  role: 'assistant',
  content: [{
      "id": "rs_02175871288540800000000000000000000ffffac1598778c9aa5",
      "type": "reasoning",
      "summary": [
          {
              "type": "summary_text",
              "text": "\n用户问“我是谁？”，这是一个哲学问题，也可能是在寻求自我认知的帮助。首先，我需要考虑用户可能的背景，可能是在反思自己，或者遇到了身份认同的困惑。\n\n的“我思故我在”，强调思考是存在的证明。但用户可能更需要具体的、贴近生活的回答，而不是纯粹的哲学理论。\n\n然后，考虑到用户可能是在寻求个人层面的答案，我应该引导他们从多个维度思考，比如个人经历、价值观、关系中的角色等。每个人的“我”是多方面的，包括身体、思想、情感、社会角色等。\n\n还要注意语气要温暖，给予支持，避免显得抽象。可能需要提醒用户，“我是谁”是一个动态的问题，会随着经历和成长而变化，没有唯一的答案，重要的是自我探索的过程。\n\n另外，用户可能有潜在的需求，比如感到迷茫，需要被理解，或者想找到自己的定位。这时候，除了提供思考的角度，还要鼓励他们关注自己的感受和经历，接纳自己的复杂性。\n\n总结一下，回答的结构可以是：先承认这是一个深刻的问题，然后从不同维度（思想、情感、经历、关系等）给出思考方向，强调自我探索的重要性，最后给予鼓励和接纳的态度。"
          }
      ],
      "status": "completed"
  },
  {
      "type": "message",
      "role": "assistant",
      "content": [
          {
              "type": "output_text",
              "text": "“我是谁？”是人类永恒的追问，它没有标准答案，却藏在你每一次选择、每一段经历、每一份感受里。或许可以试着从这些角度触摸答案：\n\n\n### **你是“正在思考的自己”**  \n当你问出这个问题时，“思考”本身就证明了你的存在——就像笛卡尔说的“我思故我在”。你会好奇、会迷茫、会追问意义，这种对“自我”的觉察，正是“你”最独特的印记。\n\n\n### **你是“经历的总和”**  \n你走过的路、遇过的人、读过的书、摔过的跤，甚至那些深夜里悄悄流过的眼泪，都在悄悄塑造你。或许某件小事曾让你突然看清自己想要什么，或许某次失去让你学会了珍惜——这些碎片拼起来，就是独一无二的“你”。\n\n\n### **你是“关系中的坐标”**  \n在父母眼里，你可能是永远长不大的孩子；在朋友心里，你或许是靠谱的倾听者；在爱人身边，你可能会卸下所有防备……这些不同的“角色”不是你的全部，但它们折射出你与世界的连接，让“你”变得立体而温暖。\n\n\n### **你更是“未完成的可能性”**  \n“我是谁”从来不是一个终点，而是一条流动的河。今天的你可能还在迷茫，但明天的你或许会因为一个决定、一次尝试，突然发现自己新的一面。不必急着定义自己，带着好奇去探索、去犯错、去成长——你比你想象中更有潜力。\n\n\n最后想说：不必纠结“我应该是谁”，先问问“我想成为谁”。接纳自己的不完美，拥抱自己的真实感受，你本身的存在，就已经很有意义啦。 🌟"
          }
      ],
      "status": "completed",
      "id": "msg_02175871289105600000000000000000000ffffac15987799214a"
  }],
  status: 'completed',
}];

const toolCallMessage = [{
  id: '1',
  role: 'user',
  content: '帮我制作北京旅游攻略',
}, {
  id: '2',
  role: 'assistant',
  content: [{
    type: 'function_call',
    name: 'create_travel_guide',
    arguments: "{\"city\":\"北京\"}",
    status: 'completed',
  },{
    type: 'function_call',
    name: 'create_travel_guide1',
    arguments: "{\"city\":\"北京\"}",
    status: 'completed',
  }], 
  status: 'completed',
}];

const annotationMessage = [{
  id: '1',
  role: 'user',
  content: '什么是快乐星球？',
}, {
  id: '2',
  role: 'assistant',
  content: [{
    type: 'message',
    content: [{
      type: 'output_text',
      text: '恭喜你，你已经掌握了快乐星球的所有知识！',
      annotations: [
        {
          title: '快乐星球',
          url: 'https://semi.design/zh-CN/start/getting-started',
          detail: '快乐星球是一个快乐的地方',
          logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
        },
        {
          title: '快乐星球',
          url: 'https://semi.design/zh-CN/start/getting-started',
          detail: '快乐星球是一个快乐的地方',
          logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
        },
        {
          title: '快乐星球',
          url: 'https://semi.design/zh-CN/start/getting-started',
          detail: '快乐星球是一个快乐的地方',
          logo: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
        }
      ]
    }],
  }],
  status: 'completed',
}];

const referenceMessage = [{
  id: '1',
  role: 'user',
  content: '什么是快乐星球？',
  references: [
    {
      id: '1',
      type: 'text',
      content: '测试文本，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字,这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字',
    },
    {
        id: '2',
        name: '飞书文档.docx',
    },
    {
        id: '3',
        name: '飞书文档.pdf',
    },
    {
        id: '4',
        name: 'Music.mp4',
    },
    {
        id: '5',
        name: 'Image.jpeg',
        url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/Resso.png'
    },
    {
        id: '6',
        name: 'code.json',
    }
  ]
}];

const failedMessage = [{
  id: '1',
  role: 'user',
  content: '什么是快乐星球？',
  status: 'failed',
}];


const roleConfig = {
  user:  {
      name: 'User',
      avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png'
  },
  assistant: {
      name: 'Assistant',
      avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
  },
  system: {
      name: 'System',
      avatar: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png'
  }
}


export const AlignAndMode = () => {
  const [messages, setMessage] = useState(defaultMessages);
  const [mode, setMode] = useState('bubble');
  const [align, setAlign] = useState('leftRight');

  const onAlignChange = useCallback((e) => {
      setAlign(e.target.value);
  }, []);

  const onModeChange = useCallback((e) => {
      setMode(e.target.value);
  }, []); 

  const onChatsChange = useCallback((chats) => {
      setMessage(chats);
  }, []);

  return (
      <>
          <span style={{ display: 'flex', flexDirection: 'column', rowGap: '8px'}}>
              <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px'}}>
                  模式
                  <RadioGroup onChange={onModeChange} value={mode} type={"button"}>
                      <Radio value={'bubble'}>气泡</Radio>
                      <Radio value={'noBubble'}>非气泡</Radio>
                      <Radio value={'userBubble'}>用户会话气泡</Radio>
                  </RadioGroup>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px'}}>
                  会话布局方式
                  <RadioGroup onChange={onAlignChange} value={align} type={"button"}>
                      <Radio value={'leftRight'}>左右分布</Radio>
                      <Radio value={'leftAlign'}>左对齐</Radio>
                  </RadioGroup>
              </span>
          </span>
          <AIChatDialogue 
              key={align + mode}
              align={align}
              mode={mode}
              chats={messages}
              roleConfig={roleConfig}
              onChatsChange={onChatsChange}
              // onMessageReset={onMessageReset}
          />
      </>
  );
}

export const Loading = () => {
  return (
    <AIChatDialogue 
      align="leftRight"
      mode="bubble"
      chats={loadingMessages}
      roleConfig={roleConfig}
    />
  )
}

export const Action = () => {
  const [messages, setMessage] = useState(defaultMessages);
  const [selected, setSelected] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);

  const onChatsChange = useCallback((chats) => {
      setMessage(chats);
  }, []);

  const onSelect = useCallback((selectionId) => {
    console.log('onSelect', selectionId);
  }, []);

  const onCancel = useCallback(() => {
    const index = messages.findIndex(item => item.id === editMessageId);
    const newChat = {
        ...messages[index],
        isEditing: false,
    };
    const newChats = [...messages];
    newChats.splice(index, 1, newChat);
    setMessage(newChats);
  }, [editMessageId, messages]);

  // todo: 确认消息编辑交互形态
  const messageEditRender = (message) => {
    let value = message.content;

    const onChange = (curValue) => {
      value = curValue;
    }

    const onSubmit = () => {
      const index = messages.findIndex(item => item.id === editMessageId);
      const newChat = {
          ...messages[index],
          isEditing: false,
          content: value,
      };
      const newChats = [...messages];
      newChats.splice(index, 1, newChat);
      setMessage(newChats);
    };

    return (
      <div style={{ width: '100%', marginTop: '5px' }}>
        <Input defaultValue={value} onChange={onChange} />
        <div>
          <Button style={{ marginTop: '10px' }} type='primary' onClick={onSubmit}>保存</Button>
          <Button style={{ marginTop: '10px', marginLeft: '10px' }} type='primary' onClick={onCancel}>取消</Button>
        </div>
      </div>
    );
  }

  const onMessageEdit = useCallback((message) => {
    setEditMessageId(message.id);
    console.log('onMessageEdit', message);
  }, []);

  const onMessageReset = useCallback((e) => {
    setTimeout(() => {
        setMessage((message) => {
            const lastMessage = message[message.length - 1];
            const newLastMessage = {
                ...lastMessage,
                status: 'completed',
                content: 'This is a mock reset message.',
            }
            return [...message.slice(0, -1), newLastMessage]
        })
    }, 2000);
  })

  return (
    <AIChatDialogue 
      align="leftRight"
      mode="bubble"
      chats={messages}
      roleConfig={roleConfig}
      selecting={selected}
      onMessageCopy={(message) => {
        console.log('onMessageCopy', message);
      }}
      onMessageDelete={() => {
        console.log('onMessageDelete');
      }}
      onMessageReset={onMessageReset}
      onMessageGoodFeedback={(message) => {
        console.log('onMessageGoodFeedback', message.id);
      }}
      onMessageBadFeedback={() => {
        console.log('onMessageBadFeedback');
      }}
      onChatsChange={onChatsChange}
      onMessageShare={() => {
        console.log('onMessageShare', selected);
        setSelected(!selected);
      }}
      onMessageEdit={onMessageEdit}
      onSelect={onSelect}
      messageEditRender={messageEditRender}
    />
  )
}

export const Selecting = () => {
    const hintsExample = [
      "Semi 组件库有哪些常用组件？",
      "能否展示一个使用 Semi 组件库构建的页面示例？",
      "Semi 组件库有官方文档吗？",
    ]
    const ref = useRef(null);
    const [align, setAlign] = useState('leftRight');
    const [select, setSelect] = useState(true);
    const [selection, setSelection] = useState('allSelect');
    const [hints, setHints] = useState(hintsExample);

    useEffect(() => {
        ref.current.selectAll();
    }, []);

    const onAlignChange = useCallback((e) => {
        setAlign(e.target.value);
    }, []);

    const onSelectChange = useCallback((e) => {
        setSelect(e.target.value);
    }, []);

    const onSelectionChange = useCallback((e) => {
        if(e.target.value === 'allSelect') {
            ref.current.selectAll();
        } else {
            ref.current.deselectAll();
        }
        setSelection(e.target.value);
    }, []);

    const onSelect = useCallback((selectionId) => {
        console.log('onSelect', selectionId);
    }, []);

    const onHintClick = useCallback((hint) => {
      setHints([]);
  }, []);

    return (
        <div>
        <span style={{ display: 'flex', flexDirection: 'column', rowGap: '8px'}}>
            <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px'}}>
                会话布局方式
                <RadioGroup onChange={onAlignChange} value={align} type={"button"}>
                    <Radio value={'leftRight'}>左右分布</Radio>
                    <Radio value={'leftAlign'}>左对齐</Radio>
                </RadioGroup>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px'}}>
                是否开启选择
                <RadioGroup onChange={onSelectChange} value={select} type={"button"}>
                    <Radio value={true}>开启</Radio>
                    <Radio value={false}>关闭</Radio>
                </RadioGroup>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', columnGap: '10px'}}>
                选择方式
                <RadioGroup onChange={onSelectionChange} value={selection} type={"button"}>
                    <Radio value={'allSelect'}>全选</Radio>
                    <Radio value={'cancelSelect'}>取消全选</Radio>
                </RadioGroup>
            </span>
        </span>
        
        <AIChatDialogue 
            ref={ref}
            align={align}
            mode="bubble"
            chats={defaultMessages}
            selecting={select}
            onSelect={onSelect}
            roleConfig={roleConfig}
            hints={hints}
            onHintClick={onHintClick}
        />
      </div>
    )
}

export const Editing = () => {
    const [messages, setMessage] = useState(defaultMessages);
    const [editMessageId, setEditMessageId] = useState(null);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onMessageEdit = useCallback((message) => {
        setEditMessageId(message.id);
        console.log('onMessageEdit', message);
    }, []);

    const onCancel = useCallback(() => {
      const index = messages.findIndex(item => item.id === editMessageId);
      const newChat = {
          ...messages[index],
          isEditing: false,
      };
      const newChats = [...messages];
      newChats.splice(index, 1, newChat);
      setMessage(newChats);
    }, [editMessageId, messages]);
  
    // todo: 确认消息编辑交互形态
    const messageEditRender = (message) => {
      let value = message.content;
  
      const onChange = (curValue) => {
        value = curValue;
      }
  
      const onSubmit = () => {
        const index = messages.findIndex(item => item.id === editMessageId);
        const newChat = {
            ...messages[index],
            isEditing: false,
            content: value,
        };
        const newChats = [...messages];
        newChats.splice(index, 1, newChat);
        setMessage(newChats);
      };
  
      return (
        <div style={{ width: '100%', marginTop: '5px' }}>
          <Input defaultValue={value} onChange={onChange} />
          <div style={{ display: 'flex', flexDirection: 'row-reverse', columnGap: '10px' }}>
            <Button style={{ marginTop: '10px' }} type='primary' onClick={onSubmit}>发送</Button>
            <Button style={{ marginTop: '10px', marginLeft: '10px' }} type='primary' onClick={onCancel}>取消</Button>
          </div>
        </div>
        // <Input defaultValue={value} onChange={onChange} />
      );
    }
  
    return (
      <AIChatDialogue 
          align="leftRight"
          mode="bubble"
          chats={messages}
          roleConfig={roleConfig}
          onChatsChange={onChatsChange}
          onMessageEdit={onMessageEdit}
          messageEditRender={messageEditRender}
      />
    )
}

export const MultiModality = () => {
    const [messages, setMessage] = useState(multiModalityMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onFileClick = useCallback((file) => {
        console.log('onFileClick', file);
    }, []);
  
    return (
      <AIChatDialogue 
        align="leftRight"
        mode="bubble"
        chats={messages}
        roleConfig={roleConfig}
        onChatsChange={onChatsChange}
        onFileClick={onFileClick}
        disabledFileClick={true}
      />
    )
}

export const Reasoning = () => {
    const [messages, setMessage] = useState(reasoningMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);
  
    return (
      <AIChatDialogue 
        align="leftRight"
        mode="userBubble"
        chats={messages}
        roleConfig={roleConfig}
        onChatsChange={onChatsChange}
      />
    )
}

export const ToolCall = () => {
    const [messages, setMessage] = useState(toolCallMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);
  
    return (
      <AIChatDialogue 
          align="leftRight"
          mode="bubble"
          chats={messages}
          roleConfig={roleConfig}
          onChatsChange={onChatsChange}
      />
    )
}

export const Annotation = () => {
    const [messages, setMessage] = useState(annotationMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const onAnnotationClick = useCallback((annotation) => {
        console.log('onAnnotationClick', annotation);
        Toast.success('Ready to open the sidebar!');
    }, []);
  
    return (
      <AIChatDialogue 
          align="leftRight"
          mode="bubble"
          chats={messages}
          roleConfig={roleConfig}
          onChatsChange={onChatsChange}
          onAnnotationClick={onAnnotationClick}
      />
    )
}

export const Reference = () => {
    const [messages, setMessage] = useState(referenceMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);
  
    return (
      <AIChatDialogue 
          align="leftRight"
          mode="bubble"
          chats={messages}
          roleConfig={roleConfig}
          onChatsChange={onChatsChange}
      />
    )
}

export const CustomRender = CustomRenderContentItem;

export const RenderConfig = RenderConfigContentItem;

export const Failed = () => {
    const [messages, setMessage] = useState(failedMessage);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    return (
      <AIChatDialogue 
          align="leftRight"
          mode="bubble"
          chats={messages}
          roleConfig={roleConfig}
          onChatsChange={onChatsChange}
      />
    )
}

export const Hints = () => {
    const hintsExample = [
        "Semi 组件库有哪些常用组件？",
        "能否展示一个使用 Semi 组件库构建的页面示例？",
        "Semi 组件库有官方文档吗？",
    ]

    const [messages, setMessage] = useState(defaultMessages);
    const [hints, setHints] = useState(hintsExample);
  
    const onChatsChange = useCallback((chats) => {
        console.log('onChatsChange', chats);
        setMessage(chats);
    }, []);

    const onHintClick = useCallback((hint) => {
        setHints([]);
    }, []);

    return (
      <AIChatDialogue 
          align="leftRight"
          mode="bubble"
          chats={messages}
          roleConfig={roleConfig}
          onChatsChange={onChatsChange}
          hints={hints}
          onHintClick={onHintClick}
      />
    )
}


export const ResponseToMessageStory = () => <ResponseToMessageDemo />;
ResponseToMessageStory.storyName =  'adapter: response';

export const ChatCompletionToMessageStory = () => <ChatCompletionToMessageDemo />;
ChatCompletionToMessageStory.storyName =  'adapter: chatCompletion';

export const StreamingResponseToMessageStory = () => <StreamingResponseToMessageDemo />;
StreamingResponseToMessageStory.storyName =  'adapter: streaming response';

export const StreamingChatCompletionToMessageStory = () => <StreamingChatCompletionToMessageDemo />;
StreamingChatCompletionToMessageStory.storyName =  'adapter: streaming chatCompletion';



