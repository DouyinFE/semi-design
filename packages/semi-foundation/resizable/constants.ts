import { BASE_CLASS_PREFIX } from "../base/constants";

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-resizable`,
} as const;

const strings = {
};

export { cssClasses, strings };

export function getDirection(component: HTMLElement, e: MouseEvent): string {
    const rect = component.getBoundingClientRect();
    const edgeThreshold = 10;
    const isTop = Math.abs(e.clientY - rect.top) < edgeThreshold;
    const isBottom = Math.abs(e.clientY - rect.bottom) < edgeThreshold;
    const isLeft = Math.abs(e.clientX - rect.left) < edgeThreshold;
    const isRight = Math.abs(e.clientX - rect.right) < edgeThreshold;

    if (isTop && isLeft) {
        return 'nw';
    } else if (isTop && isRight) {
        return 'ne';
    } else if (isBottom && isLeft) {
        return 'sw';
    } else if (isBottom && isRight) {
        return 'se';
    } else if (isTop) {
        return 'n';
    } else if (isBottom) {
        return 's';
    } else if (isLeft) {
        return 'w';
    } else if (isRight) {
        return 'e';
    } else {
        return null;
    }
}
