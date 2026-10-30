import AIChatInput from '../index';

describe('AIChatInput reference deletion', () => {
    const reference = { id: 'reference', type: 'text', content: 'Reference' };

    it('allows deleting a reference without the optional callback', () => {
        const input = new AIChatInput({ references: [reference] });
        expect(() => input.handleReferenceDelete(reference)).not.toThrow();
    });

    it('passes the selected reference to the provided callback once', () => {
        const onReferenceDelete = jest.fn();
        const input = new AIChatInput({ references: [reference], onReferenceDelete });
        input.handleReferenceDelete(reference);
        expect(onReferenceDelete).toHaveBeenCalledTimes(1);
        expect(onReferenceDelete).toHaveBeenCalledWith(reference);
    });
});
