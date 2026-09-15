import React from 'react';
import { mount } from 'enzyme';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import Progress from '../index';

const getProgress = (props = {}) => mount(<Progress {...props} />);

describe('Progress', () => {
    it('percent pass invalid value like NaN', () => {
        const p = getProgress({ percent: 30 });
        function testNaN() {
            p.setProps({ percent: NaN });
        }
        expect(testNaN).toThrow('');
    });

    it('render successfully', () => {
        const p = getProgress();
        const node = p.find(`.${BASE_CLASS_PREFIX}-progress`);
        expect(node.length).toEqual(1);
    });
    it('render circle progress', () => {
        const p = getProgress({ type: 'circle' });
        const node = p.find(`svg.${BASE_CLASS_PREFIX}-progress-circle-ring`);
        expect(node.length).toEqual(1);
    });
    it('process change success', () => {
        const p = getProgress({ type: 'circle', percent: 30 });
        p.setProps({ percent: 50 });
        const percentNumber = p.state('percentNumber');
        setTimeout(() => {
            expect(percentNumber).toEqual(50);
        }, 500);
    });

    it('classname & style', () => {
        const p = getProgress({ className: 'test', color: 'red' });
        const node = p.find(`.${BASE_CLASS_PREFIX}-progress`);
        expect(node.length).toEqual(1);
    });
    it('showInfo', () => {
        const p = getProgress({ showInfo: true, percent: 50 });
        expect(p.exists('.semi-progress-line-text')).toEqual(true);
    });

    it('stroke & size & orbitStroke', () => {
        let props = {
            stroke: '#fc8800',
            size: 'small',
            orbitStroke: '#f93920',
        };
        const p = getProgress(props);
        expect(p.exists('.semi-progress-large'));
    });

    it('Gradient Accuracy [strokeGradient true & stroke type is Array]', () => {
        let props = {
            stroke: [
                {
                    percent: 50,
                    color: '#fff',
                },
                {
                    percent: 52,
                    color: 'rgba(0, 0, 0, 0)',
                },
            ],
            strokeGradient: true,
            percent: 51,
            type: 'circle',
        };
        const p = getProgress(props);
        const style = p
            .find('.semi-progress-circle-ring-inner')
            .at(0)
            .getDOMNode()
            .getAttribute('style');
        expect(style).toEqual("stroke: #8080807f;");
    });

    it('Gradient Accuracy [strokeGradient false & stroke type is Array]', () => {
        let props = {
            stroke: [
                {
                    percent: 3,
                    color: '#fff',
                },
            ],
            percent: 90,
            type: 'circle',
        };
        const p = getProgress(props);
        const style = p
            .find('.semi-progress-circle-ring-inner')
            .at(0)
            .getDOMNode()
            .getAttribute('style');
        expect(style).toEqual("stroke: #ffffffff;");
    });

    it('Gradient Compatibility [strokeGradient true & stroke type is Array]', () => {
        let props = {
            stroke: [
                { percent: 0, color: 'red' },
                { percent: 10, color: '#b2140c' },
                { percent: 50, color: 'rgb(0, 99, 167)' },
                { percent: 100, color: 'hsla(125, 50%, 46% / 1)' },
            ],
            strokeGradient: true,
            percent: 55,
            type: 'circle',
        };
        const p = getProgress(props);
        const style = p
            .find('.semi-progress-circle-ring-inner')
            .at(0)
            .getDOMNode()
            .getAttribute('style');
        expect(style).toEqual("stroke: #066b9dff;");
    });

    it('direction', () => {
        const p = getProgress({ direction: 'vertical' });
        expect(p.exists('.semi-progress-vertical')).toEqual(true);
    });

    it('format', () => {
        let props = {
            percent: 70,
            showInfo: true,
            format: () => 'semi',
            type: 'circle',
        };
        const p = getProgress(props);
        expect(p.find('.semi-progress-circle-text').text()).toEqual('semi');
    });

    it('strokeLinecap & strokeWidth', () => {
        let props = {
            percent: 70,
            strokeLinecap: 'square',
            type: 'circle',
            strokeWidth: 10,
        };
        const p = getProgress(props);
        let firstCircle = p
            .find('circle')
            .at(0)
            .getDOMNode();
        expect(firstCircle.getAttribute('stroke-linecap')).toEqual('square');
        expect(firstCircle.getAttribute('stroke-width')).toEqual('10');
    });

    it('width', () => {
        let props = {
            width: 120,
            type: 'circle',
        };
        const p = getProgress(props);
        let svgRing = p
            .find('.semi-progress-circle-ring')
            .at(0)
            .getDOMNode();
        expect(svgRing.getAttribute('width')).toEqual('120');
    });

    it('motion = false', () => {
        let props = {
            motion: false,
            percent: 70,
            showInfo: true,
        };
        const p = getProgress(props);
        expect(p.find('.semi-progress-line-text').text()).toEqual('70%');
        p.setProps({ percent: 80 });
        p.update();
        expect(p.find('.semi-progress-line-text').text()).toEqual('80%');
        p.unmount();
    });

    it('pass invalid percent like 101, -1', () => {
        let props = {
            percent: 101,
            showInfo: true,
        };
        const p = getProgress(props);
        expect(p.find('.semi-progress-line-text').text()).toEqual('100%');

        let minProps = {
            percent: -2,
            showInfo: true,
        };
        const minp = getProgress(minProps);
        expect(minp.find('.semi-progress-line-text').text()).toEqual('0%');
    });

    it('line indeterminate ignores percent/showInfo and renders animation class', () => {
        const p = getProgress({ indeterminate: true, percent: 50, showInfo: true });
        // wrapper 带 indeterminate class
        expect(p.exists('.semi-progress-indeterminate')).toEqual(true);
        // inner 使用动画 class，且不写死 width
        const inner = p.find('.semi-progress-track-inner-indeterminate');
        expect(inner.length).toEqual(1);
        expect(inner.getDOMNode().style.width).toEqual('');
        // showInfo 被忽略：不渲染百分比文案
        expect(p.exists('.semi-progress-line-text')).toEqual(false);
        // role=progressbar 不设置 aria-valuenow
        expect(p.getDOMNode().getAttribute('aria-valuenow')).toBeNull();
        p.unmount();
    });

    it('line indeterminate default false keeps percent width', () => {
        const p = getProgress({ percent: 30, showInfo: true });
        expect(p.exists('.semi-progress-indeterminate')).toEqual(false);
        const inner = p.find('.semi-progress-track-inner');
        expect(inner.getDOMNode().getAttribute('style')).toContain('width: 30%');
        expect(p.exists('.semi-progress-line-text')).toEqual(true);
        p.unmount();
    });

    it('circle indeterminate renders fixed arc and rotating animation class, hides text', () => {
        const p = getProgress({ type: 'circle', indeterminate: true, percent: 30, showInfo: true });
        const inner = p.find('.semi-progress-circle-ring-inner-indeterminate');
        expect(inner.length).toEqual(1);
        // 弧长为 30% 周长：dasharray = 0.3 * circumference / circumference
        const dasharray = inner.getDOMNode().getAttribute('stroke-dasharray');
        expect(dasharray).toContain(' ');
        const [arc, total] = dasharray.split(' ').map(Number);
        expect(Number((arc / total).toFixed(3))).toBeCloseTo(0.3, 3);
        expect(inner.getDOMNode().getAttribute('stroke-dashoffset')).toEqual('0');
        // 背景轨道保持完整圆环，不随前景弧变为 30%
        const trackDasharray = p.find('.semi-progress-circle-ring-track').getDOMNode().getAttribute('stroke-dasharray');
        const [trackArc, trackTotal] = trackDasharray.split(' ').map(Number);
        expect(trackArc).toEqual(trackTotal);
        // showInfo 被忽略：不渲染百分比文案
        expect(p.exists('.semi-progress-circle-text')).toEqual(false);
        // 不设置 aria-valuenow
        expect(p.getDOMNode().getAttribute('aria-valuenow')).toBeNull();
        p.unmount();
    });

    it('circle indeterminate default false keeps percent dashoffset', () => {
        const p = getProgress({ type: 'circle', percent: 30, showInfo: true });
        expect(p.exists('.semi-progress-circle-ring-inner-indeterminate')).toEqual(false);
        const inner = p.find('.semi-progress-circle-ring-inner').hostNodes();
        expect(inner.getDOMNode().getAttribute('stroke-dashoffset')).not.toEqual('0');
        expect(p.exists('.semi-progress-circle-text')).toEqual(true);
        p.unmount();
    });

    it('vertical line indeterminate uses vertical animation class', () => {
        const p = getProgress({ direction: 'vertical', indeterminate: true, percent: 50 });
        const inner = p.find('.semi-progress-track-inner-indeterminate');
        expect(inner.length).toEqual(1);
        expect(inner.getDOMNode().getAttribute('class')).toContain('semi-progress-track-inner-indeterminate');
        p.unmount();
    });
});
