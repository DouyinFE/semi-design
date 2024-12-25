import React from 'react';
import AudioPlayer from '../index';

export default {
    title: 'AudioPlayer',
};

export const DefaultAutoPlay = () => {
    const audioUrl = 'http://m10.music.126.net/20241218110843/57a53b2ae73e9c8a571024ae067788e2/ymusic/5353/0f0f/0358/d99739615f8e5153d77042092f07fd77.mp3'; // 替换为实际的音频URL
    const audioUrlArray = [
        'http://music.163.com/song/media/outer/url?id=447925558.mp3',
        'http://music.163.com/song/media/outer/url?id=447925558.mp3',
    ];
    const audioInfo = {
        title: '音频标题',
        cover: 'https://picsum.photos/50/50',
        src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
    };
    const audioInfoArray = [
        {
            title: '音频标题1',
            cover: 'https://picsum.photos/50/50',
            src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
        },
        {
            title: '音频标题2',
            cover: 'https://picsum.photos/100/100',
            src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
        },
        {
            title: '音频标题3',
            cover: 'https://picsum.photos/150/150',
            src: 'http://music.163.com/song/media/outer/url?id=447925558.mp3',
        },
    ];
    return (
        <div>
            <AudioPlayer
                autoPlay={false}
                audioUrl={audioInfoArray}
            />
        </div>
    );
};
