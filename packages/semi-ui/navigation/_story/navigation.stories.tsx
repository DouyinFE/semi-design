import React from 'react';
import { storiesOf } from '@storybook/react';

import Nav from '..';

const stories = storiesOf('Navigation', module);

stories.add(`default`, () => {
    const Demo = () => {
        let logo = '//lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/logo_huoshan.png';

        return (
            <div style={{ height: '100vh', display: 'inline-block' }}>
                <Nav onSelect={(...args: any[]) => console.log(...args)}>
                    <Nav.Header logo={<img src={logo} />} text={'火山运营'} />
                    <Nav.Item itemKey={'1'} text={'Option 1'} icon="mail" link="/mail" />
                    <Nav.Sub text={'Group 2'} icon="folder" stayWhenClick={true} itemKey={'2'}>
                        {['2-1', '2-2'].map(k => (
                            <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k} link={`folder/${k}`} />
                        ))}
                        <Nav.Item itemKey={'2-3'} text={'Option 2-3'} />
                        <Nav.Sub text={'Group 2-4'} itemKey={'2-4'}>
                            <Nav.Item itemKey={'2-4-1'} text={'Option 2-3-1'} />
                            <Nav.Item itemKey={'2-4-2'} text={'Option 2-3-2'} />
                        </Nav.Sub>
                    </Nav.Sub>
                    <Nav.Item key={3} itemKey={'3'} text={'Option 3'} icon="gift" />
                    <Nav.Item key={4} itemKey={'4'} text={'Option 4'} icon="list" />
                    <Nav.Sub text={'Group 5'} icon="flag" stayWhenClick={true} itemKey={'5'}>
                        {['5-1', '5-2'].map(k => (
                            <Nav.Item key={k} itemKey={String(k)} text={'Option ' + k} />
                        ))}
                    </Nav.Sub>
                    <Nav.Footer collapseButton  />
                </Nav>
            </div>
        );
    };

    return <Demo />;
});
