import React, { useState, useCallback } from 'react';
import { Button, Feedback, TextArea } from '../../index';

export default {
  title: 'Feedback',
}

export const Default = () => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [visible6, setVisible6] = useState(false);
  const [visible7, setVisible7] = useState(false);
  const [visible8, setVisible8] = useState(false);
  return (
      <div>
          <Button onClick={() => setVisible1(!visible1)} >
            Open Feedback: Modal, Input
          </Button>
          <Feedback
            visible={visible1}
            onOk={() => setVisible1(false)}
            onCancel={() => setVisible1(false)}
            title="Why did you choose this rating?"
            type='text'
            mode='modal'
          />
          <br /><br />
          <Button onClick={() => setVisible2(!visible2)}>
            Open Feedback: Modal, emoji
          </Button>
          <Feedback
            visible={visible2}
            onOk={() => setVisible2(false)}
            onCancel={() => setVisible2(false)}
            title="Why did you choose this rating?"
            type='emoji'
            mode='modal'
          />
          <br /><br />
          <Button onClick={() => setVisible3(!visible3)}>
            Open Feedback: Modal, radio
          </Button>
          <Feedback
            visible={visible3}
            onOk={() => setVisible3(false)}
            onCancel={() => setVisible3(false)}
            title="Why did you choose this rating?"
            type='radio'
            mode='modal'
            radioGroupProps={{
              options: ['Guest', 'Developer', 'Maintainer'],
            }}
          />
          <br /><br />
          <Button onClick={() => setVisible4(!visible4)}>
            Open Feedback: Modal, checkbox
          </Button>
          <Feedback
            visible={visible4}
            onOk={() => setVisible4(false)}
            onCancel={() => setVisible4(false)}
            title="Why did you choose this rating?"
            type='checkbox'
            mode='modal'
            checkboxGroupProps={{
              options: ['抖音', '火山', '皮皮虾']
            }}
          />
          {/* sidesheet */}
          <br /><br />
          <Button onClick={() => setVisible5(!visible5)} >
            Open Feedback: SideSheet, Input
          </Button>
          <Feedback
            visible={visible5}
            onOk={() => setVisible5(false)}
            onCancel={() => setVisible5(false)}
            title="Why did you choose this rating?"
            type='text'
            mode='popup'
          />
          <br /><br />
          <Button onClick={() => setVisible6(!visible6)}>
            Open Feedback: SideSheet, emoji
          </Button>
          <Feedback
            visible={visible6}
            onOk={() => setVisible6(false)}
            onCancel={() => setVisible6(false)}
            title="Why did you choose this rating?"
            type='emoji'
            mode='popup'
          />
          <br /><br />
          <Button onClick={() => setVisible7(!visible7)}>
            Open Feedback: SideSheet, radio
          </Button>
          <Feedback
            visible={visible7}
            onOk={() => setVisible7(false)}
            onCancel={() => setVisible7(false)}
            title="Why did you choose this rating?"
            type='radio'
            mode='popup'
            radioGroupProps={{
              options: ['Guest', 'Developer', 'Maintainer'],
            }}
          />
          <br /><br />
          <Button onClick={() => setVisible8(!visible4)}>
            Open Feedback: SideSheet, checkbox
          </Button>
          <Feedback
            visible={visible8}
            onOk={() => setVisible8(false)}
            onCancel={() => setVisible8(false)}
            title="Why did you choose this rating?"
            type='checkbox'
            mode='popup'
            motion={false}
            checkboxGroupProps={{
              options: ['抖音', '火山', '皮皮虾']
            }}
          />

      </div>
  )
}

export const PromiseOK = () => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const onOK = useCallback(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        setVisible1(false)
      }, 2000);
    })
  }, [setVisible1])

  const onOK2 = useCallback(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        setVisible2(false)
      }, 2000);
    })
  }, [setVisible2])

  return <div>
    <Button onClick={() => setVisible1(!visible1)} >
      Open Feedback: Modal, text
    </Button>
    <Feedback
      width={400}
      height={400}
      visible={visible1}
      onOk={onOK}
      onCancel={() => setVisible1(false)}
      title="Why did you choose this rating?"
      type='text'
      mode='modal'
    />
    <br /><br />
    <Button onClick={() => setVisible2(!visible2)} >
      Open Feedback: SideSheet, text
    </Button>
    <Feedback
      width={400}
      height={400}
      visible={visible2}
      onOk={onOK2}
      onCancel={() => setVisible2(false)}
      title="Why did you choose this rating?"
      type='text'
      mode='modal'
    />
  </div>
}

export const WidthHeight = () => {
  const [visible1, setVisible1] = useState(false);

  return <div>
    <Button onClick={() => setVisible1(!visible1)} >
      Open Feedback: Modal, Input
    </Button>
    <Feedback
      width={400}
      height={400}
      visible={visible1}
      onOk={() => setVisible1(false)}
      onCancel={() => setVisible1(false)}
      title="Why did you choose this rating?"
      type='text'
      mode='modal'
    />
  </div>
}

export const customContent = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const hideFeedback = useCallback(() => {
    setVisible(false);
  }, []);

  const onTextAreaChange = useCallback((value) => {
    setValue(value);
  }, []);

  return <div>
    <Button onClick={() => setVisible(!visible)} >
      Open Feedback: Modal, Input
    </Button>
    <Feedback
      visible={visible}
      onOk={hideFeedback}
      onCancel={hideFeedback}
      okButtonProps={{
        disabled: !Boolean(value),
      }}
      title="Why did you choose this rating?"
      type='custom'
      mode='modal'
      renderContent={() => {
        return <>
          <span>这是一段自定义的内容</span>
          <TextArea
            onChange={onTextAreaChange}
          />
        </>
      }}
    />
  </div>
}

