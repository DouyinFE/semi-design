import SliderFoundation from '@douyinfe/semi-foundation/slider/foundation';

describe('Slider zero-size pointer conversion', () => {
    const modes = [
        { vertical: false, verticalReverse: false, direction: 'ltr' },
        { vertical: false, verticalReverse: false, direction: 'rtl' },
        { vertical: true, verticalReverse: false, direction: 'ltr' },
        { vertical: true, verticalReverse: true, direction: 'ltr' },
    ];
    modes.forEach((mode, index) => {
        [false, true].forEach(range => {
            it(`ignores zero size and resumes after restoring layout in mode ${index}, range=${range}`, () => {
                let length = 300;
                const currentValue = range ? [30, 70] : 30;
                const foundation = new SliderFoundation({
                    getStates: () => ({ min: 0, max: 100, currentValue }),
                    getState: () => currentValue,
                    getProps: () => ({ ...mode, range, step: 1 }),
                    getContext: () => mode.direction,
                    getSliderLengths: () => ({ sliderX: 10, sliderY: 10, sliderWidth: length, sliderHeight: length }),
                });
                const expected = range ? [50, 70] : 50;
                expect(foundation.calculateOutputValue(160, true)).toEqual(expected);
                length = 0;
                expect(foundation.calculateOutputValue(160, true)).toBeUndefined();
                length = 300;
                expect(foundation.calculateOutputValue(160, true)).toEqual(expected);
            });
        });
    });
});
