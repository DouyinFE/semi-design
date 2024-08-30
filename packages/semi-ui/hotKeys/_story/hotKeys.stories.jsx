import React, { useState } from 'react';
import { Button } from '@douyinfe/semi-ui'
import { HotKeys } from '../../index';

export default {
  title: 'HotKeys'
}

export const Demo = () => {
  const hotKeys = ["Alt","k"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={hotKeys} onClick={onClick}></HotKeys>
      <pre id='pre'>{cnt}</pre>
    </div>
  );
}

export const Clickable = () => {
  const hotKeys = ["Alt","k"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <div>clickable</div>
      <HotKeys hotKeys={hotKeys} onClick={onClick} clickable={true}></HotKeys>
      <pre id='pre'>{cnt}</pre>
    </div>
  );
}

export const renderButton = () => {
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
      <pre id='pre'>{" cnt:" + cnt}</pre>
      <HotKeys hotKeys={hotKeys} onClick={onClick} render={button} clickable></HotKeys>
    </div>

  );
}

export const renderNull = () => {
  const hotKeys = ["r"]
  const [cnt, setCnt] = useState(0)
  const onClick = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <span>{" cnt:" + cnt}</span>
      <HotKeys hotKeys={hotKeys} onClick={onClick} render={null} clickable></HotKeys>
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
      <pre id='pre'>{cnt}</pre>
      <HotKeys hotKeys={hotKeys} onClick={onClick}></HotKeys>
      <HotKeys hotKeys={["Meta", "Shift", "k"]} onClick={onClick}></HotKeys>
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
      <pre id='pre'>{cnt}</pre>
      <HotKeys hotKeys={hotKeys} onClick={onClick} getListenerTarget={() => document.getElementById("test")}></HotKeys>
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
      <HotKeys hotKeys={hotKeys} onClick={onClick} disabled></HotKeys>
      <pre id='pre'>{cnt}</pre>
    </div>
  );
}