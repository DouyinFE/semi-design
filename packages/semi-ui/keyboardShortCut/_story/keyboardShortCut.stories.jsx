import React, { useState } from 'react';
import { Button } from '@douyinfe/semi-ui'
import { KeyboardShortCut } from '../../index';

export default {
  title: 'KeyboardShortCut'
}

export const Demo = () => {
  const hotKeys = ["Meta","k"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <pre>{cnt}</pre>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick}></KeyboardShortCut>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} content={["⌘", "k"]}></KeyboardShortCut>
      <span>clickable</span>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} clickable={true}></KeyboardShortCut>
    </div>
  );
}

Demo.story = {
  name: 'demo',
};

export const Demo2 = () => {
  const hotKeys = ["Meta", "ArrowDown"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  const button = () => {
    return (
      <div>
        <Button>{cnt}</Button>
      </div>
    )
  }
  return (
    <div>
      <span>{hotKeys}</span>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} render={button}
      ></KeyboardShortCut>
    </div>

  );
}

export const Demo3 = () => {
  const hotKeys = ["Meta", "Alt", "k"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <pre>{cnt}</pre>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick}></KeyboardShortCut>
      <KeyboardShortCut hotKeys={["Meta", "Shift", "k"]} onClick={onClick}></KeyboardShortCut>
    </div>
    
  );
}

export const Demo4 = () => {
  const hotKeys = ["Meta", "s"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }

  const target = <input id="test" placeholder='test for target'></input>
  return (
    <div>
      {target}
      <pre>{cnt}</pre>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} getListenerTarget={() => document.getElementById("test")}></KeyboardShortCut>
    </div>
    
  );
}