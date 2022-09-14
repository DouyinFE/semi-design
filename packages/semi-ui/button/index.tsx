import React from 'react';

import BaseButton, { ButtonProps as BaseButtonProps } from './Button';
import IconButton, { IconButtonProps } from '../iconButton';

export { ButtonProps as BaseButtonProps, HtmlType, Size, Theme, Type } from './Button';

export { HorizontalPaddingType } from '../iconButton';

export { ButtonGroupProps } from './buttonGroup';

export { SplitButtonGroupProps } from './splitButtonGroup';

// eslint-disable-next-line 
export interface ButtonProps extends IconButtonProps {} // TODO check
class Button extends React.PureComponent<ButtonProps> {
    static propTypes = {
        ...BaseButton.propTypes,
        ...IconButton.propTypes,
    };
    static elementType: string;
    constructor(props = {}) {
        super(props);
    }
    render() {
        const props = { ...this.props };
        const hasIcon = Boolean(props.icon); 
        const isLoading = Boolean(props.loading);
        const isDisabled = Boolean(props.disabled);

        if (hasIcon || (isLoading && !isDisabled)) {
            return <IconButton {...props} />;
        } else {
            return <BaseButton {...props} />;
        }
    }
}
Button.elementType = 'Button';

export default Button;
