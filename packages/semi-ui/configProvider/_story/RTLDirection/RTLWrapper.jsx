import React, { useState } from 'react';
import { ButtonGroup, Button, ConfigProvider } from '@douyinfe/semi-ui';

export default function RTLWrapper({ children, onDirectionChange }) {
    const [direction, setDirection] = useState();
    const handleDirectionChange = dir => {
        setDirection(dir);
        onDirectionChange(dir);
    };

    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <ButtonGroup>
                    <Button onClick={() => handleDirectionChange('ltr')}>LTR</Button>
                    <Button onClick={() => handleDirectionChange('rtl')}>RTL</Button>
                </ButtonGroup>
            </div>
            <ConfigProvider direction={direction}>
                {children}
            </ConfigProvider>
        </>
    );
}