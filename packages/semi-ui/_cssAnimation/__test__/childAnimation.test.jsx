import CSSAnimation from '../index';
import Modal from '../../modal';

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
});
