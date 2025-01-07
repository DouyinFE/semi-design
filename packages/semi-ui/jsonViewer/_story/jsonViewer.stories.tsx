import React, { useRef, useState } from "react"
import JsonViewer from "../index"



export default {
    title: 'JsonViewer',
}

const baseStr = `{
    "min_position": 9,
    "has_more_items": true,
    "items_html": "Bike",
    "new_latent_count": 0,
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
               onChange={onChangeHandler}
               ref={jsonviewerRef}
           />
       </>
   );
};