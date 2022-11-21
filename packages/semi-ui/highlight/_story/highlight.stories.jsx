import React from 'react';
import ReactDOM from 'react-dom';

import { Skeleton, Avatar, Button, ButtonGroup, Spin, Highlight } from '../../index';


const searchWords = ['do', 'dollar'];
const sourceString = 'aaa do dollar aaa';

export default {
  title: 'Highlight'
}

export const HighlightTag = () => (
  <h2>
    <Highlight
        component='span'
        sourceString='semi design connect designOps & devOps'
        searchWords={['semi']}
        />
  </h2>
);

HighlightTag.story = {
  name: 'different tag',
};

export const HighlightStyle = () => (
  <h2>
    <Highlight
        component='span'
        sourceString='semi design connect designOps & devOps'
        searchWords={['semi', 'design']}
        highlightStyle={{ backgroundColor: 'var(--semi-color-warning)', borderRadius: 4 }}
    />
  </h2>
);

HighlightStyle.story = {
  name: 'custom style',
};
