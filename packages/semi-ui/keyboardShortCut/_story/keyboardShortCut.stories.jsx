import React, { useState } from 'react';
import { Button } from '@douyinfe/semi-ui'
import { KeyboardShortCut } from '../../index';

export default {
  title: 'KeyboardShortCut'
}

export const Demo = () => {
  const hotKeys = ["Alt","k"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick}></KeyboardShortCut>
      <div>clickable</div>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} clickable={true}></KeyboardShortCut>
      <pre>{cnt}</pre>
    </div>
  );
}

Demo.story = {
  name: 'demo',
};

export const render = () => {
  const hotKeys = ["r"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  const button = () => {
    return (
      <div>
        <Button>{"按下R即可加一"}</Button>
      </div>
    )
  }
  return (
    <div>
      <span>{" cnt:" + cnt}</span>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} render={button}
      ></KeyboardShortCut>
    </div>

  );
}

export const combine = () => {
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

export const target = () => {
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

export const disabled = () => {
  const hotKeys = ["Meta", "k"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <KeyboardShortCut hotKeys={hotKeys} onClick={onClick} disabled></KeyboardShortCut>
      <pre>{cnt}</pre>
    </div>
  );
}