import React from 'react';
import AudioPlayer from '../index';

export default {
    title: 'AudioPlayer',
};

export const DefaultAutoPlay = () => {
    const audioUrl = 'http://m10.music.126.net/20241218110843/57a53b2ae73e9c8a571024ae067788e2/ymusic/5353/0f0f/0358/d99739615f8e5153d77042092f07fd77.mp3'; // 替换为实际的音频URL
    const audioUrlArray = [
        'http://m10.music.126.net/20241218110843/57a53b2ae73e9c8a571024ae067788e2/ymusic/5353/0f0f/0358/d99739615f8e5153d77042092f07fd77.mp3',
        'http://m10.music.126.net/20241218110843/57a53b2ae73e9c8a571024ae067788e2/ymusic/5353/0f0f/0358/d99739615f8e5153d77042092f07fd77.mp3',
    ];
    return (
        <div style={{ width: 300 }}>
            <AudioPlayer
                autoPlay={false}
                audioTitle='音频标题'
                audioUrl={audioUrlArray}
                audioCover='https://picsum.photos/50/50'
            />
        </div>
    );
};
