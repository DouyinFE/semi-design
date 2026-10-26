import React from 'react';
import { cleanup, render } from '@testing-library/react';
import VideoPlayer from '../index';
afterEach(cleanup);
it('uses an updated playbackRateList without remounting the player', () => {
    const { rerender, getByText, queryByText } = render(<VideoPlayer src="clip.webm" playbackRateList={[{ label: '旧1倍', value: 1 }]} />);
    rerender(<VideoPlayer src="clip.webm" playbackRateList={[{ label: '新1倍', value: 1 }, { label: '1.5倍', value: 1.5 }]} />);
    expect(getByText('新1倍')).not.toBeNull();
    expect(queryByText('旧1倍')).toBeNull();
});
