import React, { useContext, useCallback } from 'react';
import useNotification from '../../useNotification';
import { Button, ConfigProvider } from '../../../index';
import Context from './context';

function App({ children, globalVars }) {
    return <Context.Provider value={{ title: '1111', ...globalVars }}>{children}</Context.Provider>;
}

export default function Demo() {
    const [Notice, elements] = useNotification();

    const addNotice = () => {
        Notice.addNotice({
            content: 'Hello World',
            position: 'top',
            title: <Context.Consumer>{({ title }) => <strong>{title}</strong>}</Context.Consumer>,
        });
    };

    return (
        <div>
            <App globalVars={{ title: '2222' }}>{elements}</App>
            <div>
                <Button onClick={addNotice}>Add Notice</Button>
            </div>
        </div>
    );
}
