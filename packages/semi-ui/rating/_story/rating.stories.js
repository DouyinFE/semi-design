import React from 'react';
import { storiesOf } from '@storybook/react'; // import { withKnobs, text, boolean } from '@storybook/addon-knobs';

import withPropsCombinations from 'react-storybook-addon-props-combinations';
import Rating from '../index';
import Icon from '../../icons';
import { IconLikeHeart } from '@douyinfe/semi-icons';
const stories = storiesOf('Rating', module); // stories.addDecorator(withKnobs);;

stories.add('Rating', () => (
    <div style={{display: 'flex'}}>
        <div style={{ width: '50%' }}>
            <h5>default</h5>
            <Rating />
            <br />
            <h5>allowHalf</h5>
            <Rating allowHalf />
            <br />
            <h5>disabled</h5>
            <Rating disabled defaultValue={4} />
            <br />
            <h5>allowClear = false</h5>
            <Rating allowClear={false} />
            <br />
            <h5>character</h5>
            <Rating character={<IconLikeHeart />} />
            <br />
            <Rating character={'好'} defaultValue={2} disabled />
        </div>
        <div style={{ width: '50%' }}>
            <br />
            <h5>tooltips</h5>
            <Rating tooltips={['terrible', 'bad', 'normal', 'good', 'wonderful']} />
            <br />
            <h5>defaultValue</h5>
            <Rating defaultValue={2} />
            <h5>value</h5>
            <Rating value={3} />
            <br />
            <h5>onHoverChange</h5>
            <Rating onHoverChange={e => console.log(e)} />
            <h5>size</h5>
            <Rating size='small' defaultValue={2} />
            <Rating size='large' defaultValue={2} />
        </div>
    </div>
));

class Demo extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        this.setState({
            value,
        });
    }

    render() {
        const { value } = this.state;
        const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
        return (
            <div>
                <span>How was the help you received: {value ? <span>{desc[value - 1]}</span> : ''}</span>
                <br />
                <Rating tooltips={desc} onChange={this.handleChange} value={value} />
            </div>
        );
    }
}

stories.add('tooltip Rating', () => <Demo />);

const KeyDownDemo = () => {
    return <Rating onKeyDown={event => console.log(event) }/>
}

stories.add('keydown', () => <KeyDownDemo />);
