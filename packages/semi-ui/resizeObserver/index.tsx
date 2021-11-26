import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import ResizeObserver from 'resize-observer-polyfill';

/** A parallel type to `ResizeObserverEntry` (from resize-observer-polyfill). */
export interface ResizeEntry {
    contentRect: DOMRectReadOnly;
    target: Element;
}

export interface ReactResizeObserverProps extends BaseProps {
    onResize?: (entries: ResizeEntry[]) => void;
    observeParent?: boolean;
}

export default class ReactResizeObserver extends BaseComponent<ReactResizeObserverProps> {
    static propTypes = {
        onResize: PropTypes.func,
        observeParent: PropTypes.bool,
    };

    static defaultProps = {
        onResize: () => {}, // eslint-disable-line
        observeParent: false,
    };
    observer: ResizeObserver;
    childNode: any;
    element: Element;
    _parentNode: HTMLElement;

    constructor(props: ReactResizeObserverProps) {
        super(props);
        this.observer = new ResizeObserver(props.onResize);
    }

    componentDidMount() {
        this.observeElement();
    }

    componentDidUpdate(prevProps: ReactResizeObserverProps) {
        this.observeElement(this.props.observeParent !== prevProps.observeParent);
    }

    componentWillUnmount() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    getElement = () => {
        try {
            // using findDOMNode for two reasons:
            // 1. cloning to insert a ref is unwieldy and not performant.
            // 2. ensure that we resolve to an actual DOM node (instead of any JSX ref instance).
            // eslint-disable-next-line
            return findDOMNode(this.childNode || this);
        } catch (error) {
            // swallow error if findDOMNode is run on unmounted component.
            return null;
        }
    };

    observeElement(force = false) {
        const element = this.getElement();
        if (!(element && element instanceof Element)) {
            // stop everything if not defined
            this.observer.disconnect();
            return;
        }

        if (element === this.element && !force) {
            // abort if given same element -- nothing to update (unless forced)
            return;
        } else {
            // clear observer list if new element
            this.observer.disconnect();
            // remember element reference for next time
            this.element = element;
        }

        // observer callback is invoked immediately when observing new elements
        this.observer.observe(element);

        if (
            this.props.observeParent &&
            element.parentNode &&
            element.parentNode.ownerDocument &&
            element.parentNode.ownerDocument.defaultView &&
            element.parentNode instanceof element.parentNode.ownerDocument.defaultView.HTMLElement
        ) {
            this._parentNode = element.parentNode;
            this.observer.observe(this._parentNode);
        }
    }

    mergeRef = (ref: any, node: HTMLDivElement) => {
        this.childNode = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (typeof ref === 'object' && ref && 'current' in ref) {
            ref.current = node;
        }
    };

    render() {
        const child = React.Children.only(this.props.children);
        const { ref } = child as React.ComponentPropsWithRef<any>;
        return React.cloneElement(child as React.ReactElement, {
            ref: (node: HTMLDivElement) => this.mergeRef(ref, node),
        });
    }
}
