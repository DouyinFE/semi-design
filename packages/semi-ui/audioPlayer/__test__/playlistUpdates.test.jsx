import React from 'react';
import { mount } from 'enzyme';
import AudioPlayer from '../index';

describe('AudioPlayer playlist updates', () => {
    let wrapper;
    let play;
    const playlist = [{ title: 'First', src: 'first.wav' }, { title: 'Second', src: 'second.wav' }, { title: 'Third', src: 'third.wav' }];
    beforeEach(() => { play = rstest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(); });
    afterEach(() => { wrapper?.unmount(); play.mockRestore(); });

    function next() {
        wrapper.find('button').at(2).simulate('click');
    }

    it('selects a valid track before rendering a shortened object playlist', () => {
        wrapper = mount(<AudioPlayer audioUrl={playlist} showToolbar={false} />);
        next(); next();
        expect(wrapper.state('currentIndex')).toBe(2);
        expect(() => wrapper.setProps({ audioUrl: playlist.slice(0, 1) })).not.toThrow();
        expect(wrapper.state('currentIndex')).toBe(0);
        expect(wrapper.find('audio').prop('src')).toBe('first.wav');
        expect(wrapper.find('.semi-audio-player-info-title').text()).toBe('First');
        wrapper.setProps({ audioUrl: playlist });
        expect(wrapper.find('audio').prop('src')).toBe('first.wav');
    });

    it('accepts a shortened string playlist', () => {
        wrapper = mount(<AudioPlayer audioUrl={playlist.map(item => item.src)} showToolbar={false} />);
        next(); next();
        expect(() => wrapper.setProps({ audioUrl: ['first.wav'] })).not.toThrow();
        expect(wrapper.state('currentIndex')).toBe(0);
        expect(wrapper.find('audio').prop('src')).toBe('first.wav');
    });

    it('preserves the current track when its index still exists', () => {
        wrapper = mount(<AudioPlayer audioUrl={playlist} showToolbar={false} />);
        next();
        wrapper.setProps({ audioUrl: playlist.slice(0, 2) });
        expect(wrapper.state('currentIndex')).toBe(1);
        expect(wrapper.find('audio').prop('src')).toBe('second.wav');
    });

    it('preserves the selected track on unrelated prop updates', () => {
        wrapper = mount(<AudioPlayer audioUrl={playlist} showToolbar={false} />);
        next(); next();
        wrapper.setProps({ theme: 'light' });
        expect(wrapper.state('currentIndex')).toBe(2);
        expect(wrapper.find('audio').prop('src')).toBe('third.wav');
    });
});
