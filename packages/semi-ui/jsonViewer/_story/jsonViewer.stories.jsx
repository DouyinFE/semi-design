import React, { useState } from 'react';

import JsonViewer from '../index';

export default {
    title: 'JsonViewer',
};

const baseStr = `{
    "min_position": 9,
    "has_more_items": true,
    "items_html": "Bike",
    "new_latent_count": 0,
    "url": "https://picsum.photos/100/100",
    "data": {
       "length": 22,
       "text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    "numericalArray": [
       23,
       29,
       28,
       26,
       23
    ],
    "StringArray": [
       "Oxygen",
       "Oxygen",
       "Oxygen",
       "Carbon"
    ],
    "multipleTypesArray": 3,
    "objArray": [
       {
          
       },
       {
          "class": "upper",
          "age": 7
       },
       {
          "class": "upper",
          "age": 1
       },
       {
          "class": "lower",
          "age": 5
       },
       {
          "class": "lower",
          "age": 3
       }
    ]
 }`;

export const DefaultJsonViewer = () => {
    const hoverHandler = ({ value, target }) => {
        const el = document.createElement('div');
        el.style.backgroundColor = '#f5f5f5';
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.border = '1px solid #0080ff';
        if (value.startsWith('"http')) {
            const img = document.createElement('img');
            const regex = /["']/g;
            const src = value.replace(regex, '');
            img.src = src;
            el.appendChild(img);
        } else {
            el.innerHTML = 'This is a self -defined rendering of the user';
        }
        return el;
    };

    const onChangeHandler = value => {
        console.log(value, 'value');
    };

    return (
        <JsonViewer
            value={baseStr}
            width={700}
            height={400}
            options={{ lineHeight: 20, autoHeight: true }}
            hoverHandler={hoverHandler}
            onChange={onChangeHandler}
        />
    );
};
