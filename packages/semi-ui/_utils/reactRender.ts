import type * as React from 'react';
import * as ReactDOM from 'react-dom';
import semiGlobal from './semi-global';

const fullClone: Record<string, any> = { ...ReactDOM };
const legacyRender: any = fullClone.render;
const legacyUnmount: any = fullClone.unmountComponentAtNode;
const legacyFindDOMNode: any = fullClone.findDOMNode;

const { version } = ReactDOM;
const mainVersion = Number((version || '').split('.')[0]);

// React 版本兼容性检查
let hasWarnedVersionMismatch = false;
function checkVersionCompatibility() {
    if (hasWarnedVersionMismatch) {
        return;
    }
    // 如果是 React 19+ 但没有注入 createRoot，在首次使用时会通过 warnCreateRootNotFound 警告
    // 如果是 React < 18 但用户注入了 createRoot，给出警告
    if (mainVersion < 18 && typeof semiGlobal.config?.createRoot === 'function') {
        hasWarnedVersionMismatch = true;
        console.warn(
            `[Semi UI] createRoot was injected but React version is ${version} (< 18). ` +
            'This configuration is unusual and may cause unexpected behavior.'
        );
    }
}

function toggleWarning(skip: boolean) {
    const internals = fullClone.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        ?? fullClone.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (internals && typeof internals === 'object') {
        internals.usingClientEntryPoint = skip;
    }
}

/**
 * Resolve `createRoot` with 3-level fallback:
 * 1. semiGlobal.config.createRoot (user injection, required for React 19)
 * 2. fullClone.createRoot (auto-discovery from react-dom default export, works in React 18)
 * 3. undefined → triggers console.error guiding user to inject
 */
function resolveCreateRoot(): CreateRootFn | undefined {
    if (typeof semiGlobal.config?.createRoot === 'function') {
        return semiGlobal.config.createRoot as CreateRootFn;
    }
    if (typeof fullClone.createRoot === 'function') {
        return fullClone.createRoot;
    }
    return undefined;
}

let hasWarnedCreateRoot = false;

function warnCreateRootNotFound() {
    if (hasWarnedCreateRoot) {
        return;
    }
    hasWarnedCreateRoot = true;
    console.error(
        '[Semi UI] createRoot is not available. ' +
        'If you are using React 19, please inject createRoot before using Semi components. ' +
        'For details, see: https://semi.design/zh-CN/ecosystem/react19\n' +
        '[Semi UI] createRoot 不可用。' +
        '如果您正在使用 React 19，请在使用 Semi 组件前注入 createRoot。' +
        '详情请参阅：https://semi.design/zh-CN/ecosystem/react19'
    );
}

// ========================== Render ==========================

const MARK = '__semi_react_root__';

type CreateRootFn = (container: Element | DocumentFragment) => {
    render(children: React.ReactNode): void;
    unmount(): void;
};

type ContainerType = (Element | DocumentFragment) & {
    [MARK]?: ReturnType<CreateRootFn>;
};

export function render(node: React.ReactElement, container: ContainerType) {
    checkVersionCompatibility();
    const createRoot = resolveCreateRoot();
    if (createRoot) {
        toggleWarning(true);
        const root = container[MARK] || createRoot(container);
        toggleWarning(false);
        root.render(node);
        container[MARK] = root;
    } else if (legacyRender) {
        legacyRender(node, container);
    } else {
        warnCreateRootNotFound();
    }
}

export function unmount(container: ContainerType) {
    // 优先检查是否有 createRoot 创建的 root，而不是检查 createRoot 是否可用
    // 这样可以正确处理：用 legacyRender 渲染后，用户又注入了 createRoot 的情况
    if (container[MARK]) {
        container[MARK].unmount();
        delete container[MARK];
    } else if (legacyUnmount) {
        legacyUnmount(container);
    }
    // 如果既没有 root 也没有 legacyUnmount，可能是：
    // 1. 容器从未被渲染过
    // 2. 容器已经被卸载过了
    // 这两种情况都不需要警告，静默处理即可
}

// ======================== findDOMNode ========================

/**
 * React 16/17/18: use ReactDOM.findDOMNode to resolve real DOM from component instance.
 * React 19: findDOMNode is removed; returns null for non-HTMLElement instances.
 * 
 * 注意：findDOMNode 可能返回 Text 节点，但我们只返回 Element 类型以保证类型安全。
 */
export function resolveDOM(instance: any): Element | null {
    if (!instance) {
        return null;
    }
    // 已经是 Element，直接返回
    if (instance instanceof Element) {
        return instance;
    }
    // 尝试使用 findDOMNode (React 16/17/18)
    if (legacyFindDOMNode) {
        try {
            const node = legacyFindDOMNode(instance as React.ReactInstance);
            // findDOMNode 可能返回 Text 节点，我们只返回 Element
            if (node instanceof Element) {
                return node;
            }
            return null;
        } catch (e) {
            // findDOMNode 可能在某些情况下抛出错误（如 StrictMode 警告）
            return null;
        }
    }
    return null;
}

// ========================= getRef ===========================

/**
 * React 16/17/18: ref is a top-level property on the element (element.ref).
 * React 19: ref is moved into element.props.ref.
 * 
 * 使用版本检测来确定 ref 的位置，避免在 React 18 中错误地读取 props.ref。
 */
export function getRef(element: any): React.Ref<any> | null {
    if (!element) {
        return null;
    }
    // React 19+: ref 在 props 中
    if (mainVersion >= 19) {
        return element.props?.ref ?? null;
    }
    // React 16/17/18: ref 在顶层
    return element.ref ?? null;
}
