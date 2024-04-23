import * as React from 'react'
import { useCallback, useMemo, useRef } from 'react';
import { Cascader, Input } from '../../index';
import CodeHighlight from '../index';


export const CodeHighlight = () => {

    return <CodeHighlight code={
        `"import * as React from 'react"
const Test = ()=>{
return <div>test</div>
}
        `
    }/>
}
