import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Toast from '../index';

const show = (id, content) => Toast.info({ id, content, duration: 0, motion: false });
const contents = () => Array.from(document.querySelectorAll('.semi-toast-content'), node => node.textContent);

describe('Toast batched list updates', () => {
    beforeEach(async () => { Toast.destroyAll(); await Promise.resolve(); });
    afterEach(async () => { Toast.destroyAll(); await Promise.resolve(); });

    it.each(['update', 'close'])('preserves %s before adding another toast in the same batch', operation => {
        show('first', 'old');
        act(() => {
            ReactDOM.unstable_batchedUpdates(() => {
                if (operation === 'update') { show('first', 'new'); } else { Toast.close('first'); }
                show('second', 'other');
            });
        });
        expect(contents()).toEqual(operation === 'update' ? ['new', 'other'] : ['other']);
    });

    it('keeps multiple additions and updates a toast added in the same batch', () => {
        show('seed', 'seed');
        act(() => {
            ReactDOM.unstable_batchedUpdates(() => {
                show('first', 'first');
                show('second', 'second');
                show('first', 'updated');
            });
        });
        expect(contents()).toEqual(['seed', 'updated', 'second']);
    });

    it('keeps changes to different existing toasts in the same batch', () => {
        show('first', 'first');
        show('second', 'second');
        act(() => {
            ReactDOM.unstable_batchedUpdates(() => {
                show('first', 'updated');
                Toast.close('second');
            });
        });
        expect(contents()).toEqual(['updated']);
    });
});
