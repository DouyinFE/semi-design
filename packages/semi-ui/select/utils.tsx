import React from 'react';
import warning from '@douyinfe/semi-foundation/utils/warning';
import { OptionProps } from './option';
import { OptionGroupProps } from './optionGroup';

const generateOption = (child: React.ReactElement, parent: any, index: number): OptionProps => {
    const childProps = child.props;
    if (!child || !childProps) {
        return null;
    }
    const option = {
        value: childProps.value,
        // Drop-down menu rendering priority label value, children, value in turn downgrade
        label: childProps.label || childProps.children || childProps.value,
        _show: true,
        _selected: false,
        _scrollIndex: index,
        ...childProps,
        _parentGroup: parent,
    };
    return option;
};

const getOptionsFromGroup = (selectChildren: React.ReactNode) => {
    let optionGroups: OptionGroupProps[] = [];
    let options: OptionProps[] = [];

    const emptyGroup: {
        label: string;
        children: OptionProps[];
        _show: boolean;
    } = { label: '', children: [], _show: false };

    // avoid null
    // eslint-disable-next-line max-len
    let childNodes = React.Children.toArray(selectChildren) as React.ReactElement[];
    childNodes = childNodes.filter((childNode) => childNode && childNode.props);    

    let type = '';
    let optionIndex = -1;

    childNodes.forEach((child: React.ReactElement<any, any>) => {
        if (child.type.isSelectOption) {
            type = 'option';
            optionIndex++;
            const option = generateOption(child, undefined, optionIndex);
            emptyGroup.children.push(option);
            options.push(option);
        } else if (child.type.isSelectOptionGroup) {
            type = 'group';
            // Avoid saving children (reactNode) by... removing other props from the group except children, causing performance problems
            // eslint-disable-next-line prefer-const
            let { children, ...restGroupProps } = child.props;
            children = React.Children.toArray(children);
            const childrenOption = children.map((option: React.ReactElement) => {
                optionIndex++;
                return generateOption(option, restGroupProps, optionIndex);
            });
            const group = {
                ...child.props,
                children: childrenOption,
                key: child.key,
            };
            optionGroups.push(group);
            options = options.concat(childrenOption);
        } else {
            warning(true, '[Semi Select] The children of `Select` should be `Select.Option` or `Select.OptionGroup`');
        }
    });
    if (type === 'option') {
        optionGroups = [emptyGroup];
    }
    return { optionGroups, options };
};

export { generateOption, getOptionsFromGroup };
