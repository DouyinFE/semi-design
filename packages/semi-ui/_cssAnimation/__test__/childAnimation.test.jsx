import CSSAnimation from '../index';
import Modal from '../../modal';
import { act } from 'react-dom/test-utils';

describe('CSS animation event targets', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());
    it('keeps animating when a descendant animation ends', () => {
        const onAnimationEnd = sinon.spy();
        wrapper = mount(<CSSAnimation animationState="leave" startClassName="leaving" onAnimationEnd={onAnimationEnd}>
            {({ animationEventsNeedBind }) => <div className="animated-parent" {...animationEventsNeedBind}><span className="animated-child">Child</span></div>}
        </CSSAnimation>);
        wrapper.find('.animated-child').simulate('animationEnd');
        expect(onAnimationEnd.callCount).toBe(0);
        expect(wrapper.state('isAnimating')).toBe(true);
        wrapper.find('.animated-parent').simulate('animationEnd');
        expect(onAnimationEnd.callCount).toBe(1);
        expect(wrapper.state('isAnimating')).toBe(false);
    });
    it('waits for other finite animations on the same element', () => {
        const onAnimationEnd = sinon.spy();
        wrapper = mount(<CSSAnimation animationState="leave" startClassName="leaving" onAnimationEnd={onAnimationEnd}>
            {({ animationEventsNeedBind }) => <div className="animated-parent" {...animationEventsNeedBind} />}
        </CSSAnimation>);
        const node = wrapper.find('.animated-parent').getDOMNode();
        const animation = { animationName: 'slow', playState: 'running', effect: { getComputedTiming: () => ({ endTime: 2000 }) }, finished: new Promise(() => {}) };
        node.getAnimations = () => [animation];
        wrapper.find('.animated-parent').simulate('animationEnd');
        expect(onAnimationEnd.callCount).toBe(0);
        expect(wrapper.state('isAnimating')).toBe(true);
        animation.playState = 'finished';
        wrapper.find('.animated-parent').simulate('animationEnd');
        expect(onAnimationEnd.callCount).toBe(1);
        expect(wrapper.state('isAnimating')).toBe(false);
    });
    it('finishes if the remaining animation is cancelled', async () => {
        const onAnimationEnd = sinon.spy();
        wrapper = mount(<CSSAnimation animationState="leave" startClassName="leaving" onAnimationEnd={onAnimationEnd}>
            {({ animationEventsNeedBind }) => <div className="animated-parent" {...animationEventsNeedBind} />}
        </CSSAnimation>);
        const node = wrapper.find('.animated-parent').getDOMNode();
        let cancel;
        const animation = { animationName: 'slow', playState: 'running', effect: { getComputedTiming: () => ({ endTime: 2000 }) }, finished: new Promise((resolve, reject) => { cancel = reject; }) };
        node.getAnimations = () => [animation];
        wrapper.find('.animated-parent').simulate('animationEnd');
        await act(async () => { animation.playState = 'idle'; cancel(new Error('cancelled')); await Promise.resolve(); });
        expect(onAnimationEnd.callCount).toBe(1);
    });
    it('ignores cancellation from an earlier animation after reopening', async () => {
        const onAnimationEnd = sinon.spy();
        wrapper = mount(<CSSAnimation animationState="leave" startClassName="leaving" onAnimationEnd={onAnimationEnd}>
            {({ animationEventsNeedBind }) => <div className="animated-parent" {...animationEventsNeedBind} />}
        </CSSAnimation>);
        const node = wrapper.find('.animated-parent').getDOMNode();
        let cancel;
        const animation = { animationName: 'slow', playState: 'running', effect: { getComputedTiming: () => ({ endTime: 2000 }) }, finished: new Promise((resolve, reject) => { cancel = reject; }) };
        node.getAnimations = () => [animation];
        wrapper.find('.animated-parent').simulate('animationEnd');
        wrapper.setProps({ animationState: 'enter', startClassName: 'entering' });
        await act(async () => { animation.playState = 'idle'; cancel(new Error('cancelled')); await Promise.resolve(); });
        expect(onAnimationEnd.callCount).toBe(0);
    });
    it('does not wait for infinite animations or CSS transitions', () => {
        const onAnimationEnd = sinon.spy();
        wrapper = mount(<CSSAnimation animationState="leave" startClassName="leaving" onAnimationEnd={onAnimationEnd}>
            {({ animationEventsNeedBind }) => <div className="animated-parent" {...animationEventsNeedBind} />}
        </CSSAnimation>);
        const node = wrapper.find('.animated-parent').getDOMNode();
        node.getAnimations = () => [
            { animationName: 'infinite', playState: 'running', effect: { getComputedTiming: () => ({ endTime: Infinity }) } },
            { playState: 'running', effect: { getComputedTiming: () => ({ endTime: 2000 }) } },
        ];
        wrapper.find('.animated-parent').simulate('animationEnd');
        expect(onAnimationEnd.callCount).toBe(1);
    });
    it('does not remain open when only an infinite animation is present', () => {
        const onAnimationEnd = sinon.spy();
        wrapper = mount(<CSSAnimation animationState="leave" startClassName="leaving" onAnimationEnd={onAnimationEnd}>
            {({ animationEventsNeedBind }) => <div className="animated-parent" {...animationEventsNeedBind} />}
        </CSSAnimation>);
        const node = wrapper.find('.animated-parent').getDOMNode();
        node.getAnimations = () => [{ animationName: 'infinite', playState: 'running', effect: { getComputedTiming: () => ({ endTime: Infinity }) } }];
        wrapper.find('.animated-parent').simulate('animationStart');
        expect(onAnimationEnd.callCount).toBe(1);
    });
    it('keeps an infinite entry animation running', () => {
        const onAnimationEnd = sinon.spy();
        wrapper = mount(<CSSAnimation animationState="enter" startClassName="entering" onAnimationEnd={onAnimationEnd}>
            {({ animationEventsNeedBind }) => <div className="animated-parent" {...animationEventsNeedBind} />}
        </CSSAnimation>);
        const node = wrapper.find('.animated-parent').getDOMNode();
        node.getAnimations = () => [{ animationName: 'infinite', playState: 'running', effect: { getComputedTiming: () => ({ endTime: Infinity }) } }];
        wrapper.find('.animated-parent').simulate('animationStart');
        expect(onAnimationEnd.callCount).toBe(0);
        expect(wrapper.state('isAnimating')).toBe(true);
    });
    it('waits for the Modal content animation rather than a child animation', () => {
        const afterClose = sinon.spy();
        wrapper = mount(<Modal visible motion mask={false} afterClose={afterClose}><span className="modal-child">Child</span></Modal>);
        wrapper.find('.semi-modal-content').simulate('animationEnd');
        wrapper.setProps({ visible: false });
        wrapper.find('.modal-child').simulate('animationEnd');
        expect(afterClose.callCount).toBe(0);
        expect(document.querySelector('.semi-modal-content')).not.toBe(null);
        wrapper.find('.semi-modal-content').simulate('animationEnd');
        expect(afterClose.callCount).toBe(1);
    });
    it('does not close a masked Modal while its content animation is still running', () => {
        const afterClose = sinon.spy();
        wrapper = mount(<Modal visible motion afterClose={afterClose}>Content</Modal>);
        wrapper.find('.semi-modal-content').simulate('animationEnd');
        wrapper.find('.semi-modal-mask').simulate('animationEnd');
        wrapper.setProps({ visible: false });
        const content = wrapper.find('.semi-modal-content').getDOMNode();
        const animation = { animationName: 'slow', playState: 'running', effect: { getComputedTiming: () => ({ endTime: 2000 }) }, finished: new Promise(() => {}) };
        content.getAnimations = () => [animation];
        wrapper.find('.semi-modal-mask').simulate('animationEnd');
        expect(afterClose.callCount).toBe(0);
        animation.playState = 'finished';
        wrapper.find('.semi-modal-content').simulate('animationEnd');
        expect(afterClose.callCount).toBe(1);
    });
});
