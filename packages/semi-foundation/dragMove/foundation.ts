interface DragMoveProps {
    // The element being dragged and moved
    element: HTMLElement;
    // The element that triggers the drag event，default is element
    handler?: HTMLElement;
    // The element that constrains the movement range, This element requires relative positioning
    constrainer?: HTMLElement | 'parent';
    onMouseDown?: (e: MouseEvent) => void;
    onMouseMove?: (e: MouseEvent) => void;
    onMouseUp?: (e: MouseEvent) => void;
    onTouchStart?: (e: TouchEvent) => void;
    onTouchMove?: (e: TouchEvent) => void;
    onTouchEnd?: (e: TouchEvent) => void;
    onTouchCancel?: (e: TouchEvent) => void
}

export function isRelative(el) {
    return window.getComputedStyle(el).position === 'relative';
}

export function maxMin(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

class DragMove {
    element: HTMLElement;
    constrainNode: HTMLElement;
    handler: HTMLElement;
    xMax: number;
    xMin: number;
    yMax: number;
    yMin: number;
    startOffsetX: number;
    startOffsetY: number;
    props: DragMoveProps;
    
    constructor(props: DragMoveProps) {
        this.props = props;
        if (!props.element) {
            throw new Error('drag element must be a valid element');
        }
        this.element = props.element;
        this.handler = props.handler || props.element;
        this.element.style.position = 'absolute';
        this.handler.style.cursor = 'move';
        if (props.constrainer) {
            if (props.constrainer === 'parent') {
                this.constrainNode = props.element.parentNode as HTMLElement;
            } else {
                this.constrainNode = props.constrainer;
            }
        }
    }

    init() {
        this.handler.addEventListener('mousedown', this.onMouseDown);
        this.handler.addEventListener('touchstart', this.onTouchStart);
        // Calculate the range within which an element can move
        if (this.constrainNode) {
            let node = this.element;
            let startX = 0;
            let startY = 0;
            while (node !== this.constrainNode && node !== null) {
                if (isRelative(node)) {
                    startX -= node.offsetLeft;
                    startY -= node.offsetTop;
                }
                node = node.parentNode as any;
            }
            this.xMin = startX;
            this.xMax = startX + this.constrainNode.offsetWidth - this.element.offsetWidth;
            this.yMin = startY;
            this.yMax = startY + this.constrainNode.offsetHeight - this.element.offsetHeight;
        }
    }

    destroy() {
        this.handler.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        this.handler.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
        document.removeEventListener('touchcancel', this.onTouchCancel);
    }

    onMouseDown = (e: MouseEvent) => {
        // prevent default behavior, avoid other element(like img, text) be selected
        e.preventDefault();
        const { onMouseDown } = this.props;
        onMouseDown?.(e);

        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);

        // store origin offset
        this.startOffsetX = e.clientX - this.element.offsetLeft;
        this.startOffsetY = e.clientY - this.element.offsetTop;
    }

    onTouchStart = (e: TouchEvent) => {
        e.preventDefault();

        const { onTouchStart, element } = this.props;
        onTouchStart?.(e);

        document.addEventListener('touchend', this.onTouchEnd);
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchcancel', this.onTouchCancel);

        const touch = e.targetTouches[0];
        this.startOffsetX = touch.clientX - element.offsetLeft;
        this.startOffsetY = touch.clientY - element.offsetTop;
    }

    onMouseMove = (e: MouseEvent) => {
        const { onMouseMove, constrainer } = this.props;
        onMouseMove?.(e);

        let newLeft = e.clientX - this.startOffsetX;
        let newTop = e.clientY - this.startOffsetY;
        if (constrainer) {
            newLeft = maxMin(newLeft, this.xMin, this.xMax);
            newTop = maxMin(newTop, this.yMin, this.yMax); 
        }
        requestAnimationFrame(() => {
            this.element.style.left = newLeft + 'px';
            this.element.style.top = newTop + 'px';
        }); 
    }

    onTouchMove = (e: TouchEvent) => {
        const { onTouchMove, constrainer } = this.props;
        onTouchMove?.(e);
        
        const touch = e.targetTouches[0];
        let newLeft = touch.clientX - this.startOffsetX;
        let newTop = touch.clientY - this.startOffsetY;
        if (constrainer) {
            newLeft = maxMin(newLeft, this.xMin, this.xMax);
            newTop = maxMin(newTop, this.yMin, this.yMax); 
        }
        this.element.style.left = newLeft + 'px';
        this.element.style.top = newTop + 'px';
    }

    onMouseUp = (e: MouseEvent) => {
        const { onMouseUp } = this.props;
        onMouseUp?.(e);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    onTouchEnd = (e: TouchEvent) => {
        const { onTouchEnd } = this.props;
        onTouchEnd?.(e);
        document.removeEventListener('touchend', this.onTouchEnd);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchcancel', this.onTouchCancel);
    }

    onTouchCancel = (e: TouchEvent) => {
        const { onTouchCancel } = this.props;
        onTouchCancel?.(e);
        document.removeEventListener('touchend', this.onTouchEnd);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchcancel', this.onTouchCancel);
    }
}

export default DragMove;