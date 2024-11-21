import React, { useState, useEffect, useRef } from 'react';

import JsonViewer from '../index';
import Button from '../../button';
export default {
    title: 'JsonViewer',
};

const baseStr = `{
	"min_position": 1,
	"has_more_items": true,
	"items_html": "Bike",
	"new_latent_count": 0,
	"data": {
		"length": 22,
		"text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	"numericalArray": [23, 29, 28, 26, 23],
	"StringArray": ["Oxygen", "Oxygen", "Oxygen", "Carbon"],
	"multipleTypesArray": 3,
	"objArray": [
		{},
		{
			"class": "upper",
			"name": "Mark",
			"age": 7
		},
		{
			"class": "upper",
			"name": "Tom",
			"age": 1
		},
		{
			"class": "lower",
			"name": "Jerry",
			"age": 5
		},
		{
			"class": "lower",
			"name": "Alice",
			"age": 3
		}
	]
}`;

export const DefaultJsonViewer = () => {
    const hoverHandler = (value, target) => {
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

    const [autoWrap, setAutoWrap] = useState(true);
    const [lineHeight, setLineHeight] = useState(20);
    const jsonviewerRef = useRef(null);

    return (
        <>
            <JsonViewer
                value={baseStr}
                width={700}
                height={400}
                options={{ lineHeight: lineHeight, autoWrap: autoWrap, formatOptions: { tabSize: 4 } }}
                onValueHover={hoverHandler}
                onChange={onChangeHandler}
                ref={jsonviewerRef}
            />
            <Button onClick={() => setAutoWrap(!autoWrap)}>
                {autoWrap ? 'Disable' : 'Enable'} Auto Wrap
            </Button>
            <Button onClick={() => setLineHeight(lineHeight + 5)}>
                Increase Line Height
            </Button>
            <Button onClick={() => console.log(jsonviewerRef.current.jsonViewer.current.getValue())}>
                Get Value
            </Button>
        </>
    );
};
