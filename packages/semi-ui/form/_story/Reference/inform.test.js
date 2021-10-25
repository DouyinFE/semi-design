import React from 'react';
// import {
//     storiesOf
// } from '@storybook/react';

import { Form, Text } from 'informed';
import { TextArea } from '@douyinfe/semi-ui';

// import { Form, asField } from '../src/index';
// import Input from '../../input/index';
// import Select from '../../select/index';

// const stories = storiesOf('informed', module);

// // // stories.addDecorator(withKnobs);;

// const validate = value => {
//     return !value || value.length < 5
//         ? 'Field must be at least five characters'
//         : undefined;
// };

// const ErrorText = asField(({
//         fieldState,
//         fieldApi,
//         ...props
//     }) => {
//     const {value} = fieldState;
//     const {setValue, setTouched} = fieldApi;
//     const {
//         onChange,
//         onBlur,
//         initialValue,
//         forwardedRef,
//         ...rest
//     } = props;
//     return (
//         <React.Fragment>
//             <Input
//                 {...rest}
//                 ref={forwardedRef}
//                 value={!value && value !== 0 ? '' : value}
//                 onChange={(value, e) => {
//                     setValue(e.target.value);
//                     if (onChange) {
//                         onChange(e);
//                     }

//                 }}
//                 onBlur={e => {
//                     setTouched();
//                     if (onBlur) {
//                         onBlur(e);
//                     }
//                 }}
//                 />
//             </React.Fragment>
//     );
// });

// const FromScratch = () => (
//     <div>
//     <Form id='custom-form-2'>
//       {({formApi, formState}) => (
//         <React.Fragment>
//           <label>
//             First name:
//             <ErrorText
//                 field='name'
//                 validate={validate}
//                 validateOnChange
//                 validateOnBlur
//                 />
//           </label>
//           <button type='submit'>Submit</button>
//         <code>{JSON.stringify(formState)}</code>
//         </React.Fragment>
//     )}
//     </Form>
//   </div>
// );

// stories.add('Form施工现场', () => (<FromScratch />));

const submit = values => window.alert(`Form successfully submitted with ${JSON.stringify(values)}`);

const validate = value => {
    if (!value) {
        return '不能为空';
    }
};

class InformDemo extends React.Component {
    render() {
        return (
            <Form onSubmit={submit}>
                {({ formState, values }) => (
                    <>
                        <Text field="panels[11].name" validateOnBlur />
                        <Text field="panels[11].type" validateOnBlur />
                        <button type="submit">Submit</button>
                        <TextArea value={JSON.stringify(formState)} />
                    </>
                )}
            </Form>
        );
    }
}

export { InformDemo };
