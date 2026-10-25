import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Toast, { ToastFactory } from '../index';
import Notification from '../../notification';
import semiGlobal from '../../_utils/semi-global';

describe('Message calls before the first root commit', () => {
    let queued;
    let roots;
    let api;
    let previousCreateRoot;

    beforeEach(() => {
        queued = [];
        roots = [];
        previousCreateRoot = semiGlobal.config.createRoot;
        semiGlobal.config.createRoot = container => {
            let active = true;
            const root = {
                render: node => queued.push(() => { if (active) ReactDOM.render(node, container); }),
                unmount: () => { active = false; ReactDOM.unmountComponentAtNode(container); },
            };
            roots.push(root);
            return root;
        };
    });

    const flush = async () => {
        await act(async () => {
            while (queued.length) queued.shift()();
            await Promise.resolve();
        });
    };

    afterEach(async () => {
        await flush();
        api.destroyAll();
        await flush();
        roots.forEach(root => root.unmount());
        document.querySelectorAll('.semi-toast-wrapper,.semi-notification-wrapper').forEach(node => node.remove());
        semiGlobal.config.createRoot = previousCreateRoot;
    });

    ['Toast', 'ToastFactory', 'Notification'].forEach(kind => {
        describe(kind, () => {
            const selector = kind === 'Notification' ? '.semi-notification-wrapper' : '.semi-toast-wrapper';
            const show = (content, id) => api.info({ content, title: content, id, duration: 0, motion: false });
            const containers = () => document.querySelectorAll(selector);
            const text = () => Array.from(containers()).map(node => node.textContent).join('');

            beforeEach(() => {
                api = kind === 'Notification' ? Notification : kind === 'Toast' ? Toast : ToastFactory.create();
            });

            it(`${kind} shares one pending container`, async () => {
                show('first'); show('second');
                expect(containers().length).toBe(1);
                await flush();
                expect(text()).toContain('first');
                expect(text()).toContain('second');
                api.destroyAll();
                await flush();
                expect(containers().length).toBe(0);
            });

            it(`${kind} updates the same pending id`, async () => {
                show('first', 'same'); show('second', 'same');
                await flush();
                expect(containers().length).toBe(1);
                expect(text()).not.toContain('first');
                expect(text()).toContain('second');
            });

            it(`${kind} closes a message before mounting`, async () => {
                const id = show('closed'); api.close(id); show('kept');
                await flush();
                expect(text()).not.toContain('closed');
                expect(text()).toContain('kept');
            });

            it(`${kind} cancels the first mount on destroyAll`, async () => {
                show('cancelled'); api.destroyAll();
                await flush();
                expect(containers().length).toBe(0);
            });

            it(`${kind} preserves a new container when a pending one is destroyed`, async () => {
                show('old'); api.destroyAll(); show('new');
                await flush();
                expect(containers().length).toBe(1);
                expect(text()).not.toContain('old');
                expect(text()).toContain('new');
            });

            it(`${kind} keeps operations after mounting working`, async () => {
                show('before', 'same'); await flush();
                show('after', 'same'); await flush();
                expect(text()).not.toContain('before');
                expect(text()).toContain('after');
            });
        });
    });
});
