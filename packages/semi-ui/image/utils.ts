export const throttle = (fn, threshold): ((e: any) => void) => {
    let prev = Date.now();
    return function (): void {
        // eslint-disable-next-line prefer-rest-params
        const args = arguments;
        const now = Date.now();
        if (now - prev > threshold) {
            prev = now;
            fn.apply(this, args);
        }
    };
};

export const isTargetEmit = (event, targetClasses): boolean => {
    // e.path is the event-triggered bubbling path, which stores each node through which bubbling passes.
    // e.path.length-4 is to remove elements above the root node, such as body, html, document, window
    const isTarget = event.path.slice(0, event.path.length - 4).some((node): boolean => {
        if (node.className && typeof node.className === 'string') {
            return targetClasses.some(c => node.className.includes(c));
        }
        return false;
    });
    return isTarget;
};

export const downloadImage = (src: string, filename: string): void => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'anonymous';
    image.onload = (e): void => {
        const eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        eleLink.download = filename;
        eleLink.href = src;
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        eleLink.href = canvas.toDataURL('image/jpeg');
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };
};
