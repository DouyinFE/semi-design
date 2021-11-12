import React from 'react';
import Badge from '../index';

export default {
  title: 'Badge',
}

const style = {
  width: '42px',
  height: '42px',
  borderRadius: '4px',
  background: '#eee',
  display: 'inline-block',
  verticalAlign: 'middle',
};

export const Default = () => (
  <div>
    <Badge count={5}>
      <a style={style}></a>
    </Badge>
    <Badge dot>
      <a style={style}></a>
    </Badge>
    <Badge count={5} />
    <Badge dot />
  </div>
);

export const MaxCount = () => (
  <div>
    <Badge count={99}>
      <a style={style}></a>
    </Badge>
    <Badge count={100}>
      <a style={style}></a>
    </Badge>
    <Badge count={99} overflowCount={10}>
      <a style={style}></a>
    </Badge>
    <Badge count={1000} overflowCount={999}>
      <a style={style}></a>
    </Badge>
  </div>
);

export const Type = () => (
  <div>
    <Badge count={5} type="primary">
      <a style={style}></a>
    </Badge>
    <Badge count={5} type="secondary">
      <a style={style}></a>
    </Badge>
    <Badge count={5} type="tertiary">
      <a style={style}></a>
    </Badge>
    <Badge count={5} type="warning">
      <a style={style}></a>
    </Badge>
    <Badge count={5} type="danger">
      <a style={style}></a>
    </Badge>
    <Badge dot type="primary">
      <a style={style}></a>
    </Badge>
  </div>
);

export const Theme = () => (
  <div>
    <Badge count={5} theme="solid">
      <a style={style}></a>
    </Badge>
    <Badge count={5} theme="light">
      <a style={style}></a>
    </Badge>
    <Badge count={5} theme="inverted">
      <a style={style}></a>
    </Badge>
    <Badge dot theme="solid">
      <a style={style}></a>
    </Badge>
    <Badge dot theme="light">
      <a style={style}></a>
    </Badge>
    <Badge dot theme="inverted">
      <a style={style}></a>
    </Badge>
  </div>
);