import MarkdownRender from '../index';
import * as semiComponents from "../components/index"
export default {
    title: 'MarkdownRender'
}



export const Basic = ()=>{
    return <MarkdownRender mdxRaw={"# Two 🍰 is: {Math.PI * 2}"} components={semiComponents}/>
}

export const A = ()=>{
    return  <MarkdownRender mdxRaw={"[Semi Design](https://semi.design)"} components={semiComponents}/>
}

export const Image = ()=>{
    return <MarkdownRender mdxRaw={"![Semi Design](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg)"} components={semiComponents}/>
}

export const li = ()=>{
    return <MarkdownRender mdxRaw={`
- 列表1
- 列表2
- 列表3
    `} components={semiComponents}/>
}
export const Table = ()=>{
    return <MarkdownRender mdxRaw={`
| a | b  |  c |  d  |
| - | :- | -: | :-: |
| 1 | 2 | 3 | 4 |
| 21 | 22 | 23 | 24 |
| 31 | 32 | 33 | 34 |
| 41 | 42 | 43 | 44 |
    `} components={semiComponents}/>
}
