import { Resizable } from '../index';

describe('Resizable size during dragging', () => {
    let wrapper;
    afterEach(() => wrapper?.unmount());
    it('applies the current flex basis without changing the caller style', () => {
        const style = { flexBasis: 200 };
        wrapper = mount(<Resizable style={style} defaultSize={{ width: 200, height: 120 }} />);
        wrapper.setState({ isResizing: true, width: 280, flexBasis: 280 });
        expect(wrapper.find('.semi-resizable-resizable').getDOMNode().style.flexBasis).toBe('280px');
        expect(style.flexBasis).toBe(200);
    });
});
