import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import Button from '../../button/index';
import Spin from '../index';

const stories = storiesOf('Spin', module);

// stories.addDecorator(withKnobs);;

const Example1 = () => (
    <div style={{marginLeft: 30}}>
        <div style={{ marginTop: 20 }}>size:small</div>
        <Spin size="small" />
        <div style={{ marginTop: 20 }}>size:middle</div>
        <Spin size="middle" />
        <div style={{ marginTop: 20 }}>size:large</div>
        <Spin size="large" />
    </div>
);

stories.add('spin default', () => <Example1 />);

const Example2 = () => {
    const [visible, setVisible] = useState(true);
    return (
        <div>
            <Spin spinning={visible} tip='loading'>
                <div style={{ 'background-color': '#e6f7ff', 'border': '1px solid #91d5ff' }}>
                    <p>yoyoyoyoyo</p>
                    <p>yoyoyoyoyo</p>
                    <p>yoyoyoyoyo</p>
                </div>
            </Spin>
            <div style={{marginTop:30}}>
                    <Button onClick={()=>{setVisible(!visible)}} style={{ marginRight:20 }}>受控</Button>
            </div>   
        </div>        
    )

}

stories.add('spin has text', () => <Example2 />);


const Example3 = () => {
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    return (
        <div style={{marginLeft:30}}>
            <div style={{marginTop:30}}>
                <Button onClick={()=>{setVisible1(!visible1)}} style={{ marginRight:20 }}>延迟显示spin</Button>
                <Spin delay={1000} spinning={visible1}>
                </Spin>
            </div> 
            <div style={{marginTop:30}}>
                    <Button onClick={()=>{setVisible2(!visible2)}} style={{ marginRight:20 }}>受控显示spin</Button>
                    <Spin spinning={visible2}>
                    </Spin>
            </div>            
        </div>
       
    )

}


stories.add('spin has delay', () => <Example3 />);