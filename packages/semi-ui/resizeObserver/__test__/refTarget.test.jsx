import React from 'react';
import ResizeObserverComponent from '../index';

describe('ResizeObserver child ref changes', () => {
    let originalObserver;
    let observe;
    let disconnect;
    let wrapper;
    beforeEach(() => {
        originalObserver = globalThis.ResizeObserver;
        observe = sinon.spy();
        disconnect = sinon.spy();
        globalThis.ResizeObserver = class { observe = observe; disconnect = disconnect; };
    });
    afterEach(() => { wrapper?.unmount(); globalThis.ResizeObserver = originalObserver; });
    it('observes a new DOM root rendered by a child without a parent update', () => {
        const Child = React.forwardRef((props, ref) => {
            const [changed, setChanged] = React.useState(false);
            return React.createElement(changed ? 'section' : 'div', { ref }, <button onClick={() => setChanged(true)}>Swap</button>);
        });
        wrapper = mount(<ResizeObserverComponent><Child /></ResizeObserverComponent>);
        expect(observe.lastCall.args[0].tagName).toBe('DIV');
        wrapper.find('button').simulate('click');
        expect(observe.lastCall.args[0].tagName).toBe('SECTION');
    });
    it('continues forwarding the child object ref', () => {
        const ref = React.createRef();
        wrapper = mount(<ResizeObserverComponent><div ref={ref} /></ResizeObserverComponent>);
        expect(ref.current).toBe(wrapper.find('div').getDOMNode());
        wrapper.unmount();
        wrapper = null;
        expect(ref.current).toBe(null);
    });
    it('also observes the new parent when observeParent is enabled', () => {
        const Child = React.forwardRef((props, ref) => {
            const [changed, setChanged] = React.useState(false);
            return changed ? <section><div ref={ref}><button onClick={() => setChanged(false)}>Swap</button></div></section>
                : <article><div ref={ref}><button onClick={() => setChanged(true)}>Swap</button></div></article>;
        });
        wrapper = mount(<ResizeObserverComponent observeParent><Child /></ResizeObserverComponent>);
        expect(observe.lastCall.args[0].tagName).toBe('ARTICLE');
        wrapper.find('button').simulate('click');
        expect(observe.lastCall.args[0].tagName).toBe('SECTION');
    });
});
