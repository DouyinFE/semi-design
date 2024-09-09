import React, { useState } from 'react';
import { Button, Tag } from '@douyinfe/semi-ui'
import { HotKeys, Keys } from '../../index';

export default {
  title: 'HotKeys'
}

export const Demo = () => {
  const hotKeys = [HotKeys.Keys.Control, Keys.K]
  const [cnt, setCnt] = useState(0)
  const onHotKey = (e) => {
    console.log(e)
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={hotKeys} content={["Control", "K"]} onHotKey={onHotKey} onClick={onHotKey} mergeMetaCtrl></HotKeys>
      <pre id='pre'>{cnt}</pre>
    </div>
  );
}

export const renderButton = () => {
  const hotKeys = [Keys.R]
  const [cnt, setCnt] = useState(0)
  const onHotKey = () => {
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
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey} render={button} clickable></HotKeys>
    </div>

  );
}

export const renderNull = () => {
  const hotKeys = ["r"]
  const [cnt, setCnt] = useState(0)
  const onHotKey = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <span>{" cnt:" + cnt}</span>
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey} render={null} clickable></HotKeys>
    </div>

  );
}

export const combine = () => {
  const hotKeys = [Keys.Meta, Keys.Alt, "k"]
  const [cnt, setCnt] = useState(0)
  const onHotKey = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <pre id='pre'>{cnt}</pre>
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey}></HotKeys>
      <HotKeys hotKeys={["Meta", "Shift", "k"]} onHotKey={onHotKey}></HotKeys>
    </div>
    
  );
}

export const target = () => {
  const hotKeys = ["Meta", Keys.S]
  const [cnt, setCnt] = useState(0)
  const onHotKey = () => {
    setCnt(cnt+1)
  }
  
  const target = <input id="test" placeholder='test for target'></input>
  return (
    <div>
      {target}
      <pre id='pre'>{cnt}</pre>
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey} getListenerTarget={() => document.getElementById("test")}></HotKeys>
    </div>
    
  );
}

export const disabled = () => {
  const hotKeys = ["Meta", "k"]
  const [cnt, setCnt] = useState(0)
  const onHotKey = () => {
    setCnt(cnt+1)
  }
  return (
    <div>
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey} disabled></HotKeys>
      <pre id='pre'>{cnt}</pre>
    </div>
  );
}

export const hotKeys = () => {
  const hotKeys = ["Meta", "k"]
  const [cnt, setCnt] = useState(0)
  const onHotKey = () => {
    setCnt(cnt+1)
  }
  const button = () => {
    return (
      <div>
        <Tag>{"Press R To do ..."}</Tag>
      </div>
    )
  }
  return (
    <div style={{ 
      width: '195px', height: '129px', 
      border: '1px solid var(--semi-color-border)',
      boxSizing: 'border-box',
      backgroundColor: 'rgb(249,249,249)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      rowGap: '5px',
    }}>
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey} disabled={true}></HotKeys>
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey} content={['⌘ ','⏎']}></HotKeys>
      <HotKeys hotKeys={hotKeys} onHotKey={onHotKey} render={button} clickable></HotKeys>
    </div>
  );
}