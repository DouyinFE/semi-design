import NotificationItem from '../notice';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

describe('Notification close lifecycle', () => {
    it('does not start a close timer for a notice mounted during leave', () => {
        const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
        const onClose = sinon.spy();
        const notice = mount(<NotificationItem duration={0.8} onClose={onClose} isClosing />);
        try {
            clock.tick(800);
            expect(onClose.called).toBe(false);
            notice.setProps({ isClosing: false });
            clock.tick(800);
            expect(onClose.calledOnce).toBe(true);
        } finally {
            notice.unmount();
            clock.restore();
        }
    });

    it('does not notify again when the pointer leaves a closing notice', () => {
        const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
        const onClose = sinon.spy();
        const notice = mount(<NotificationItem duration={0.8} onClose={onClose} />);
        try {
            clock.tick(800);
            expect(onClose.calledOnce).toBe(true);
            notice.setProps({ isClosing: true });
            notice.find(`.${BASE_CLASS_PREFIX}-notification-notice`).simulate('mouseEnter');
            notice.find(`.${BASE_CLASS_PREFIX}-notification-notice`).simulate('mouseLeave');
            clock.tick(800);
            expect(onClose.calledOnce).toBe(true);
            notice.setProps({ isClosing: false });
            notice.find(`.${BASE_CLASS_PREFIX}-notification-notice`).simulate('mouseLeave');
            clock.tick(800);
            expect(onClose.calledTwice).toBe(true);
        } finally {
            notice.unmount();
            clock.restore();
        }
    });
});
