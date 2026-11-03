import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import AudioPlayer from '../index';
import Popover from '../../popover';

describe('AudioPlayer popup themes', () => {
    ['light', 'dark'].forEach(theme => {
        it(`keeps the ${theme} theme on portaled controls and updates it`, async () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            const wrapper = mount(<AudioPlayer audioUrl="test.wav" theme={theme} />, { attachTo: container });
            try {
                await act(async () => {
                    wrapper.find('.semi-audio-player-control-speed').simulate('mouseenter');
                    await new Promise(resolve => setTimeout(resolve, 150));
                });
                wrapper.update();
                const menu = document.querySelector('.semi-audio-player-control-speed-menu');
                expect(menu).not.toBeNull();
                expect(container.contains(menu)).toBe(false);
                expect(menu.classList.contains(`semi-audio-player-control-speed-menu-${theme}`)).toBe(true);
                const nextTheme = theme === 'light' ? 'dark' : 'light';
                wrapper.setProps({ theme: nextTheme });
                expect(menu.classList.contains(`semi-audio-player-control-speed-menu-${nextTheme}`)).toBe(true);
                expect(menu.classList.contains(`semi-audio-player-control-speed-menu-${theme}`)).toBe(false);

                await act(async () => {
                    wrapper.find(Popover).first().find('span').first().simulate('mouseenter');
                    await new Promise(resolve => setTimeout(resolve, 150));
                });
                wrapper.update();
                const volume = document.querySelector('.semi-audio-player-control-volume');
                expect(volume).not.toBeNull();
                expect(container.contains(volume)).toBe(false);
                expect(volume.classList.contains(`semi-audio-player-control-volume-${nextTheme}`)).toBe(true);
                wrapper.setProps({ theme });
                expect(volume.classList.contains(`semi-audio-player-control-volume-${theme}`)).toBe(true);
                expect(volume.classList.contains(`semi-audio-player-control-volume-${nextTheme}`)).toBe(false);
            } finally {
                wrapper.unmount();
                container.remove();
            }
        });
    });
});
