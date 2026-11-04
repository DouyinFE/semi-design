import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import AudioPlayer from '../index';
import ConfigProvider from '../../configProvider';
import enUS from '../../locale/source/en_US';
afterEach(cleanup);
it('uses the configured locale after a native media error', () => {
    const { container, getByText } = render(<ConfigProvider locale={enUS}><AudioPlayer audioUrl={{ src: 'missing.mp3', title: 'Audio' }} /></ConfigProvider>);
    fireEvent.error(container.querySelector('audio'));
    expect(getByText(enUS.AudioPlayer.mediaError)).not.toBeNull();
});
