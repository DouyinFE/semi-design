import { AIChatInput } from '@douyinfe/semi-ui';
import { useRef, useState } from 'react';

// 从 constant.jsx 里拿的测试用 skills
const skills = [
  {
    key: 'code',
    label: '代码生成',
    value: '/代码生成',
    hasTemplate: true,
  },
  {
    key: 'translate',
    label: '翻译',
    value: '/翻译',
    hasTemplate: false,
  },
  {
    key: 'summarize',
    label: '总结',
    value: '/总结',
    hasTemplate: true,
  },
  {
    key: 'write-email',
    label: '写邮件',
    value: '/写邮件',
    hasTemplate: false,
  },
];

function App() {
  const [hasSkill, setHasSkill] = useState(false);
  const aiChatInputRef = useRef<any>(null);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>AIChatInput - 当仅有技能时展示 placeholder</h1>

      <h3>测试用例 1：开启 showPlaceholderWhenSkillOnly，只有技能时显示 placeholder</h3>
      <AIChatInput
        placeholder="请输入内容，或者用 / 唤起技能选择"
        skills={skills}
        showPlaceholderWhenSkillOnly={true}
        onSkillChange={skill => {
          setHasSkill(true);
          console.log('选择了技能:', skill);
        }}
        style={{ marginBottom: 24 }}
      />

      <h3>测试用例 2：不开启 showPlaceholderWhenSkillOnly（默认行为）</h3>
      <AIChatInput
        placeholder="请输入内容，或者用 / 唤起技能选择"
        skills={skills}
        style={{ marginBottom: 24 }}
      />

      <h3>测试用例 2：默认选择技能，期望仍然显示 placeholder</h3>
      <AIChatInput
        ref={aiChatInputRef}
        placeholder="请输入内容，或者用 / 唤起技能选择"
        skills={skills}
        defaultContent={`${skills[0].value}`}
      />
    </div>
  );
}

export default App;
