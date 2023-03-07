import React from 'react';
import BaseDatePicker from '../../datePicker';
import { DatePicker } from '../../../index';

class FeatRefClass extends React.Component {
    ref: React.RefObject<BaseDatePicker>;
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    handleFocus() {
        console.log('focus');
    }

    render() {
        return (
            <>
                <button onClick={() => this.ref.current.open()}>open</button>
                <button onClick={() => this.ref.current.close()}>close</button>
                <DatePicker onFocus={this.handleFocus} motion={false} type="dateTime" ref={this.ref} />
            </>
        );
    }
}

Demo.storyName = 'ref methods class 写法';
export default function Demo() {
    return (
        <FeatRefClass />
    );
}