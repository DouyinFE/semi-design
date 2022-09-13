export const isTargetEmit = (event, targetClasses): boolean => {
    // e.path is the event-triggered bubbling path, which stores each node through which bubbling passes.
    // e.path.length-4 is to remove elements above the root node, such as body, html, document, window
    const isTarget = event?.path?.slice(0, event.path.length - 4).some((node): boolean => {
        if (node.className && typeof node.className === "string") {
            return targetClasses.some(c => node.className.includes(c));
        }
        return false;
    });
    return isTarget;
};

export const downloadImage = (src: string, filename: string): void => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = "anonymous";
    image.onload = (e): void => {
        const eleLink = document.createElement("a");
        eleLink.download = filename;
        eleLink.style.display = "none";
        eleLink.download = filename;
        eleLink.href = src;
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        eleLink.href = canvas.toDataURL("image/jpeg");
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    };
};

export const crossMerge = (leftArr = [], rightArr = []) => {
    let newArr = [];
    const leftLen = leftArr.length;
    const rightLen = rightArr.length;
    const crossLength = leftLen <= rightLen ? leftLen : rightLen;
    (new Array(crossLength).fill(0)).forEach((item, index) => {
        newArr.push(rightArr[index]);
        newArr.push(leftArr[index]);
    });
    if (leftLen > rightLen) {
        newArr = newArr.concat(leftArr.slice(rightLen, leftLen));
    } else if (leftLen < rightLen) {
        newArr = newArr.concat(rightArr.slice(leftLen, rightLen));
    }
    return newArr;
};

export const getPreloadImagArr = (imgSrc: string[], currentIndex: number, preLoadGap: number, infinite: boolean) => {
    const beginIndex = currentIndex - preLoadGap;
    const endIndex = currentIndex + preLoadGap;
    const srcLength = imgSrc.length;
    let leftArr = [];
    let rightArr = [];
    if ( preLoadGap >= Math.floor(srcLength / 2)) {
        if (infinite) {
            leftArr = imgSrc.concat(imgSrc).slice(beginIndex + srcLength < 0 ? 0 : beginIndex + srcLength, currentIndex + srcLength);
            rightArr = imgSrc.concat(imgSrc).slice(currentIndex + 1, endIndex + 1 < 2 * srcLength ? endIndex + 1 : 2 * srcLength);
        } else {
            leftArr = imgSrc.slice(0, currentIndex);
            rightArr = imgSrc.slice(currentIndex + 1, srcLength);
        }
    } else {
        if (infinite) {
            leftArr = imgSrc.concat(imgSrc).slice(beginIndex + srcLength, currentIndex + srcLength);
            rightArr = imgSrc.concat(imgSrc).slice(currentIndex + 1, endIndex + 1);
        } else {
            if (beginIndex >= 0 && endIndex < srcLength) {
                leftArr = imgSrc.slice(beginIndex, currentIndex);
                rightArr = imgSrc.slice(currentIndex + 1, endIndex + 1);
            } else if (beginIndex < 0) {
                leftArr = imgSrc.slice(0, currentIndex);
                rightArr = imgSrc.slice(currentIndex + 1, 2 * preLoadGap + 1);
            } else {
                rightArr = imgSrc.slice(currentIndex + 1, srcLength);
                leftArr = imgSrc.slice(srcLength - 2 * preLoadGap - 1, currentIndex);
            }
        }
    }
    const result = crossMerge(leftArr.reverse(), rightArr);
    const duplicateResult = Array.from(new Set(result));
    return duplicateResult;
};