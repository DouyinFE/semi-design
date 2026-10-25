import CropperFoundation from '../../../semi-foundation/cropper/foundation';

function createCropper(zoom, props = {}) {
    const state = {
        zoom,
        imgData: { width: 400 * zoom, height: 300 * zoom, centerPoint: { x: 200, y: 150 } },
    };
    const notifyZoomChange = rs.fn();
    const foundation = new CropperFoundation({
        getStates: () => state,
        getProps: () => ({ maxZoom: 3, minZoom: 0.1, zoomStep: 0.1, ...props }),
        setState: update => Object.assign(state, update),
        notifyZoomChange,
    });
    const wheel = deltaY => foundation.handleWheel({
        deltaY,
        preventDefault: rs.fn(),
        currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
        clientX: 200,
        clientY: 150,
    });
    return { state, notifyZoomChange, wheel };
}

describe('Cropper wheel zoom boundaries', () => {
    it('reaches a decimal maximum after consecutive zoom steps', () => {
        const { state, notifyZoomChange, wheel } = createCropper(1, { maxZoom: 1.2 });
        wheel(-1);
        wheel(-1);
        expect(state.zoom).toBe(1.2);
        expect(state.imgData.width).toBeCloseTo(480);
        expect(state.imgData.centerPoint).toEqual({ x: 200, y: 150 });
        expect(notifyZoomChange.mock.calls.map(([zoom]) => zoom)).toEqual([1.1, 1.2]);
    });

    it('reaches a decimal minimum without losing a zoom step', () => {
        const { state, notifyZoomChange, wheel } = createCropper(0.3, { minZoom: 0.2 });
        wheel(1);
        expect(state.zoom).toBe(0.2);
        expect(state.imgData.width).toBeCloseTo(80);
        expect(notifyZoomChange).toHaveBeenCalledWith(0.2);
    });

    it.each([
        [1.2, { maxZoom: 1.2 }, -1],
        [0.2, { minZoom: 0.2 }, 1],
        [1.2, { maxZoom: 1.25 }, -1],
        [0.3, { minZoom: 0.25 }, 1],
        [1, {}, 0],
    ])('preserves zoom %s when the wheel step is outside the range or zero', (zoom, props, deltaY) => {
        const { state, notifyZoomChange, wheel } = createCropper(zoom, props);
        const imgData = state.imgData;
        wheel(deltaY);
        expect(state.zoom).toBe(zoom);
        expect(state.imgData).toBe(imgData);
        expect(notifyZoomChange).not.toHaveBeenCalled();
    });
});
