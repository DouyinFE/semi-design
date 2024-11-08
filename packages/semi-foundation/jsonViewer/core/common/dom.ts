/**
 * create element
 * @param tag tagName
 * @param className className
 * @returns element
 */
export function elt(tag: string, className: string, style?: { [key: string]: string }): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    if (style) {
        setStyles(el, style);
    }
    return el;
}

/**
 * set styles
 * @param element element
 * @param styles styles
 */
export function setStyles(element: HTMLElement, styles: { [key: string]: string }) {
    for (const [key, value] of Object.entries(styles)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element.style[key as any] = value;
    }
}

/**
 * get line element by child node
 * @param node node
 * @returns line element
 */
export function getLineElement(node: Node): HTMLElement | null {
    return node.parentElement?.closest('.view-line') || null;
}
