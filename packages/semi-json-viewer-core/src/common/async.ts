/** Based on https://github.com/microsoft/vscode-json-languageservice with modifications for custom requirements */

export const setTimeout0IsFaster = (typeof (globalThis as any).postMessage === 'function' && !(globalThis as any).importScripts);

export const setTimeout0 = (() => {
    if (setTimeout0IsFaster) {
        interface IQueueElement {
            id: number;
            callback: () => void
        }
        const pending: IQueueElement[] = [];

        globalThis.addEventListener('message', (e: any) => {
            if (e.data && e.data.vscodeScheduleAsyncWork) {
                for (let i = 0, len = pending.length; i < len; i++) {
                    const candidate = pending[i];
                    if (candidate.id === e.data.vscodeScheduleAsyncWork) {
                        pending.splice(i, 1);
                        candidate.callback();
                        return;
                    }
                }
            }
        });
        let lastId = 0;
        return (callback: () => void) => {
            const myId = ++lastId;
            pending.push({
                id: myId,
                callback: callback
            });
            globalThis.postMessage({ vscodeScheduleAsyncWork: myId }, '*');
        };
    }
    return (callback: () => void) => setTimeout(callback);
})();

export interface IDisposable {
    dispose(): void
}
type IdleApi = Pick<typeof globalThis, 'requestIdleCallback' | 'cancelIdleCallback'>;

export let runWhenGlobalIdle: (callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable;

export let _runWhenIdle: (targetWindow: IdleApi, callback: (idle: IdleDeadline) => void, timeout?: number) => IDisposable;

(function () {
    const safeGlobal: any = globalThis;
    if (typeof safeGlobal.requestIdleCallback !== 'function' || typeof safeGlobal.cancelIdleCallback !== 'function') {
        _runWhenIdle = (_targetWindow, runner, timeout?) => {
            setTimeout0(() => {
                if (disposed) {
                    return;
                }
                const end = Date.now() + 15; // one frame at 64fps
                const deadline: IdleDeadline = {
                    didTimeout: true,
                    timeRemaining() {
                        return Math.max(0, end - Date.now());
                    }
                };
                runner(Object.freeze(deadline));
            });
            let disposed = false;
            return {
                dispose() {
                    if (disposed) {
                        return;
                    }
                    disposed = true;
                }
            };
        };
    } else {
        _runWhenIdle = (targetWindow: typeof safeGlobal, runner, timeout?) => {
            const handle: number = targetWindow.requestIdleCallback(runner, typeof timeout === 'number' ? { timeout } : undefined);
            let disposed = false;
            return {
                dispose() {
                    if (disposed) {
                        return;
                    }
                    disposed = true;
                    targetWindow.cancelIdleCallback(handle);
                }
            };
        };
    }
    runWhenGlobalIdle = (runner, timeout) => _runWhenIdle(globalThis, runner, timeout);
})();

