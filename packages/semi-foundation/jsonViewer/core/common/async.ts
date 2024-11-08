/** reference from https://github.com/microsoft/vscode */
export function runWhenGlobalIdle(callback: (idleDeadline: IdleDeadline) => void) {
    const handler = window.requestIdleCallback(callback);
    let disposed = false;

    return {
        dispose: () => {
            if (disposed) {
                return;
            }
            disposed = true;
            window.cancelIdleCallback(handler);
        },
    };
}
