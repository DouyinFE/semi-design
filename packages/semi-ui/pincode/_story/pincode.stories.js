import Pagination from '../../pagination';
import React,{useState} from 'react';
import PinCode from '../index';

export default {
    title: 'PinCode'
}

export const PinCodeBasic = () => (
    <>
      <PinCode size={'small'} onComplete={v=>alert(v)} onChange={v=>{
          console.log(v)
      }}/>
        <PinCode size={'default'} onComplete={v=>alert(v)} onChange={v=>{
            console.log(v)
        }}/>
        <PinCode size={'large'} onComplete={v=>alert(v)} onChange={v=>{
            console.log(v)
        }}/>
    </>
);

export const PinCodeControl = () => {
    const [value,setValue] = useState("123");
    const [currentIndex,setCurrentIndex] = useState(0)
    return <>
        <button onClick={()=>setCurrentIndex(2)}>focus third</button>
        <PinCode format={"mixed"} onComplete={v=>alert(v)} activeIndex={currentIndex} value={value} onChange={v=>{
            console.log(v)
            setValue(v)
        }}/>
    </>
}
