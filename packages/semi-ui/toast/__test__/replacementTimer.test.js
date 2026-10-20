import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import Toast from '../index';

describe.each([false, true])('Toast replacement with motion=%s', motion => {
    beforeEach(() => { rs.useFakeTimers(); });
    afterEach(async () => {
        Toast.destroyAll();
        await Promise.resolve();
        rs.useRealTimers();
    });

    it.each([0, 1])('starts replacement duration=%s from its own creation', duration => {
        const onClose = rs.fn();
        Toast.info({ id: 'a', content: 'old', duration: 1, motion });
        act(() => { rs.advanceTimersByTime(800); });
        act(() => {
            ReactDOM.unstable_batchedUpdates(() => {
                Toast.close('a');
                Toast.info({ id: 'a', content: 'replacement', duration, motion, onClose });
            });
        });
        act(() => { rs.advanceTimersByTime(201); });
        expect(onClose).not.toHaveBeenCalled();
        expect(document.body.textContent).toContain('replacement');
        act(() => { rs.advanceTimersByTime(799); });
        expect(onClose).toHaveBeenCalledTimes(duration === 0 ? 0 : 1);
        if (duration && motion) {
            act(() => { Simulate.animationEnd(document.querySelector('.semi-toast')); });
        }
        if (duration) {
            expect(document.body.textContent).not.toContain('replacement');
        } else {
            act(() => { rs.advanceTimersByTime(10000); });
            expect(onClose).not.toHaveBeenCalled();
            expect(document.body.textContent).toContain('replacement');
        }
    });

    it('keeps replacement timer metadata when another toast is added in the batch', () => {
        const onClose = rs.fn();
        Toast.info({ id: 'a', content: 'old', duration: 1, motion });
        act(() => { rs.advanceTimersByTime(800); });
        act(() => {
            ReactDOM.unstable_batchedUpdates(() => {
                Toast.close('a');
                Toast.info({ id: 'a', content: 'persistent', duration: 0, motion, onClose });
                Toast.info({ id: 'b', content: 'other', duration: 0, motion });
            });
        });
        act(() => { rs.advanceTimersByTime(10000); });
        expect(onClose).not.toHaveBeenCalled();
        expect(document.body.textContent).toContain('persistent');
        expect(document.body.textContent).toContain('other');
        act(() => {
            ReactDOM.unstable_batchedUpdates(() => {
                Toast.close('a');
                Toast.close('b');
            });
        });
        if (motion) {
            act(() => {
                document.querySelectorAll('.semi-toast').forEach(node => Simulate.animationEnd(node));
            });
        }
        expect(document.querySelectorAll('.semi-toast')).toHaveLength(0);
    });
});
