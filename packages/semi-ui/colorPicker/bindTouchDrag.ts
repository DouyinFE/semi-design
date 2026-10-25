export default function bindTouchDrag(
    element: HTMLElement,
    onMove: (touch: Touch) => void,
    onGrabbingChange: (grabbing: boolean) => void
) {
    let dragging = false;
    const move = (event: TouchEvent) => {
        if (dragging && event.touches.length === 1) {
            event.preventDefault();
            onMove(event.touches[0]);
        }
    };
    const start = (event: TouchEvent) => {
        if (event.touches.length === 1) {
            dragging = true;
            onGrabbingChange(true);
            move(event);
        }
    };
    const end = () => {
        if (dragging) {
            dragging = false;
            onGrabbingChange(false);
        }
    };

    // Non-passive listeners prevent page panning and synthesized mouse events.
    element.addEventListener('touchstart', start, { passive: false });
    element.addEventListener('touchmove', move, { passive: false });
    element.addEventListener('touchend', end);
    element.addEventListener('touchcancel', end);
    return () => {
        element.removeEventListener('touchstart', start);
        element.removeEventListener('touchmove', move);
        element.removeEventListener('touchend', end);
        element.removeEventListener('touchcancel', end);
    };
}
