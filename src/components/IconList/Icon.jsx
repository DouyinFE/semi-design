/* eslint-disable import/namespace */
import React, { useState } from 'react';
import cls from 'classnames';
import { Typography, Toast } from '@douyinfe/semi-ui';
import copy from 'copy-text-to-clipboard';
import * as SemiIconSet from '@douyinfe/semi-icons';

import './index.scss';

const { Text } = Typography;

const SemiIcon = props => {
    const {
        name,
    } = props;


    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const componentText = `<${name} />`;
        copy(componentText);
        setCopied(true);
        Toast.success({
            content: `${componentText} copied! `,
            duration: 1.5,
            onClose() {
                setCopied(false);
            }
        });
    };

    const className = cls('semi-icons-item', {
        'semi-icons-item-copied': copied
    });

    return (
        <li className={className} onClick={handleCopy}>
            <div className="semi-icons-item-content">
                {React.createElement(SemiIconSet[name])}
            </div>
            <Text size="small" className="semi-icons-item-name">{name}</Text>
        </li>
    );
};

export default SemiIcon;
