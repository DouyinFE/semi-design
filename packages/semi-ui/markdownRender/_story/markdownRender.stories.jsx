import MarkdownRender from '../index';
import * as semiComponents from "../components/index"
export default {
    title: 'MarkdownRender'
}


export const Basic = ()=>{
    return <MarkdownRender raw={"# Two 🍰 is: {Math.PI * 2}"} components={semiComponents}/>
}

export const A = ()=>{
    return  <MarkdownRender raw={"[Semi Design](https://semi.design)"} components={semiComponents}/>
}

export const Image = ()=>{
    return <MarkdownRender raw={"![Semi Design](https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg)"} components={semiComponents}/>
}

export const li = ()=>{
    return <MarkdownRender raw={`
- 列表1
- 列表2
- 列表3
    `} components={semiComponents}/>
}
export const Table = ()=>{
    return <MarkdownRender raw={`
| a | b  |  c |  d  |
| - | :- | -: | :-: |
| 1 | 2 | 3 | 4 |
| 21 | 22 | 23 | 24 |
| 31 | 32 | 33 | 34 |
| 41 | 42 | 43 | 44 |
    `} components={semiComponents}/>
}

export const WithSymbol = ()=>{
    return <MarkdownRender raw={`
test \\\\{ cxode } test
    `} components={semiComponents} format={"md"}/>
}

