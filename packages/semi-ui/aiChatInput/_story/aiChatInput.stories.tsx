import React, { useCallback, useState } from 'react';
import { AIChatInput } from '../../index';
import { storiesOf } from '@storybook/react';
import { uploadProps } from './constant';
import ReferSlot from './referSlot';
import { IconUpload } from '@douyinfe/semi-icons';

const stories = storiesOf('AIChatInput', module);

const outerStyle = { margin: 12, maxHeight: 300 };

stories.add('default', () => {
  const [generating, setGenerating] = useState(false);
    const onContentChange = useCallback((content) => {
      console.log('onContentChange', content);
    }, []);
  
    const onUploadChange = useCallback((fileList) => {
      console.log('onUploadChange', fileList);
    }, []);
  
    const toggleGenerate = useCallback(() => {
      setGenerating(value => !value);
    }, []);
    
    return (
      <AIChatInput
        extensions={[ReferSlot]}
        generating={generating}
        defaultContent={''}
        placeholder={'输入内容或者上传内容'} 
        uploadProps={uploadProps}
        onContentChange={onContentChange}
        onUploadChange={onUploadChange}
        onPaste={(e) => {
          const text = e.clipboardData?.getData('text/plain');
          console.log('onPaste', { textLength: text?.length, text });
        }}
        style={outerStyle}
        onMessageSend={toggleGenerate}
        onStopGenerate={toggleGenerate}
      />
    );
});

stories.add('renderUploadButton', () => {
  const [generating, setGenerating] = useState(false);
  const toggleGenerate = useCallback(() => {
    setGenerating(value => !value);
  }, []);

  return (
    <AIChatInput
      extensions={[ReferSlot]}
      generating={generating}
      defaultContent={''}
      placeholder={'自定义上传按钮 UI（仍保留粘贴上传能力）'}
      uploadProps={uploadProps}
      renderUploadButton={({ openFileDialog, disabled }) => (
        <button
          type="button"
          disabled={disabled}
          className="semi-button semi-button-borderless"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          <IconUpload />
        </button>
      )}
      style={outerStyle}
      onMessageSend={toggleGenerate}
      onStopGenerate={toggleGenerate}
    />
  );
});

stories.add('onPaste', () => {
  return (
    <AIChatInput
      placeholder={'粘贴到输入框以触发 onPaste'}
      uploadProps={uploadProps}
      style={outerStyle}
      onPaste={(e) => {
        const text = e.clipboardData?.getData('text/plain') || '';
        console.log('onPaste', { textLength: text.length, text });
      }}
    />
  );
});
