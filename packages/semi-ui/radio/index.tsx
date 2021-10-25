import Group from './radioGroup';
import Radio from './radio';

class RadioWithGroup extends Radio {
    static Group = Group;
}

export default RadioWithGroup;
export { RadioWithGroup, Radio };
export { RadioInnerMode, RadioInnerProps } from './radioInner';
export { RadioGroupProps, OptionItem } from './radioGroup';
export { RadioDisplayMode, RadioType, RadioProps, RadioChangeEvent } from './radio';