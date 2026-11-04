import Portal from '../index';
import Modal from '../../modal';
import { renderToString } from 'react-dom/server';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

describe('Portal', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders nothing during server rendering where document is unavailable', () => {
        const getPopupContainer = sinon.spy(() => document.body);
        const doc = global.document;
        delete global.document;
        let html;
        try {
            html = renderToString(<Portal getPopupContainer={getPopupContainer}><span>content</span></Portal>);
        } finally {
            global.document = doc;
        }
        expect(html).toBe('');
        expect(getPopupContainer.called).toBe(false);
    });

    it('does not leave a discarded StrictMode constructor container in the DOM', () => {
        const wrapper = mount(<React.StrictMode><Portal><span>content</span></Portal></React.StrictMode>);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-portal`).length).toBe(1);
        wrapper.unmount();
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-portal`).length).toBe(0);
    });

    it('connects the container before child layout effects and autofocus run', () => {
        const connected = [];
        function Child() {
            const ref = React.useRef();
            React.useLayoutEffect(() => {
                connected.push(document.body.contains(ref.current));
            }, []);
            return <input id="portal-autofocus" ref={ref} autoFocus />;
        }
        const wrapper = mount(<Portal><Child /></Portal>);
        expect(connected).toEqual([true]);
        expect(document.activeElement.id).toBe('portal-autofocus');
        wrapper.unmount();
    });

    it('renders children on the first commit so parent mount effects can read their refs', () => {
        const seen = {};
        function Parent() {
            const ref = React.useRef(null);
            React.useLayoutEffect(() => { seen.layoutEffect = !!ref.current; }, []);
            React.useEffect(() => { seen.effect = !!ref.current; }, []);
            return <Portal><input ref={ref} /></Portal>;
        }
        class ClassParent extends React.Component {
            ref = React.createRef();
            componentDidMount() { seen.didMount = !!this.ref.current; }
            render() { return <Portal><input ref={this.ref} /></Portal>; }
        }
        mount(<Parent />).unmount();
        mount(<ClassParent />).unmount();
        expect(seen).toEqual({ layoutEffect: true, effect: true, didMount: true });
    });

    it('lets a Modal parent focus content from an effect when visible flips to true', () => {
        function Parent({ visible }) {
            const ref = React.useRef(null);
            React.useEffect(() => {
                if (visible) {
                    ref.current.focus();
                }
            }, [visible]);
            return <Modal visible={visible} motion={false} footer={null}><input id="modal-input" ref={ref} /></Modal>;
        }
        const wrapper = mount(<Parent visible={false} />);
        expect(() => wrapper.setProps({ visible: true })).not.toThrow();
        expect(document.activeElement.id).toBe('modal-input');
        wrapper.unmount();
        document.body.style.cssText = '';
    });

    it('renders into a custom container with its class and styles', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const wrapper = mount(<Portal getPopupContainer={() => container} className="custom-portal" style={{ zIndex: 123 }}>
            <span>custom content</span>
        </Portal>);
        expect(container.querySelector('.custom-portal').style.zIndex).toBe('123');
        expect(container.textContent).toBe('custom content');
        wrapper.unmount();
        expect(container.childElementCount).toBe(0);
    });

    it('removes its container when the parent immediately unmounts it after mounting', () => {
        class Parent extends React.Component {
            state = { visible: true };
            componentDidMount() {
                this.setState({ visible: false });
            }
            render() {
                return this.state.visible ? <Portal><span>content</span></Portal> : null;
            }
        }
        const wrapper = mount(<Parent />);
        expect(document.querySelectorAll(`.${BASE_CLASS_PREFIX}-portal`).length).toBe(0);
        wrapper.unmount();
    });

    it('reuses the same container el when re-attached after simulated remount (React StrictMode)', () => {
        const wrapper = mount(
            <Portal>
                <span id="portal-child">portal content</span>
            </Portal>
        );
        const el1 = document.querySelector(`.${BASE_CLASS_PREFIX}-portal`);
        expect(el1).toBeTruthy();
        expect(el1.querySelector('#portal-child')).toBeTruthy();

        // Simulate what React 18+ StrictMode does right after mount:
        // componentWillUnmount (detaches el) followed by componentDidMount (restores).
        wrapper.instance().componentWillUnmount();
        expect(document.querySelector(`.${BASE_CLASS_PREFIX}-portal`)).toBeNull();
        wrapper.instance().componentDidMount();

        const el2 = document.querySelector(`.${BASE_CLASS_PREFIX}-portal`);
        // The same node must be reused: createPortal's container identity is preserved,
        // so React will NOT unmount & remount the portal subtree on the next render.
        expect(el2).toBe(el1);
        expect(el2.querySelector('#portal-child')).toBeTruthy();
        wrapper.unmount();
    });

    it('removes container el from DOM on unmount', () => {
        const wrapper = mount(
            <Portal>
                <span>x</span>
            </Portal>
        );
        expect(document.querySelector(`.${BASE_CLASS_PREFIX}-portal`)).toBeTruthy();
        wrapper.unmount();
        expect(document.querySelector(`.${BASE_CLASS_PREFIX}-portal`)).toBeNull();
    });
});
