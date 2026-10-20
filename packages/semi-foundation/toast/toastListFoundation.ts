import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { ToastInstance, ToastProps } from '../toast/toastFoundation';

export interface ToastListProps{

}

export interface ToastListState{
    list: ToastInstance[];
    removedItems: ToastInstance[];
    updatedItems: ToastInstance[];
    mouseInSide: boolean
}

export interface ToastListAdapter extends DefaultAdapter<ToastListProps, ToastListState>{
    updateToast: (list: ToastListState['list'], removedItems: ToastListState['removedItems'], updatedItems: ToastListState['updatedItems']) => void;
    handleMouseInSideChange: (mouseInSideChange: boolean) => void;
    getInputWrapperRect: () => DOMRect | null
}

export default class ToastListFoundation extends BaseFoundation<ToastListAdapter> {
    // Keep operations synchronous while the adapter batches rendered state updates.
    private toastList: ToastListState['list'];

    constructor(adapter: ToastListAdapter) {
        super({ ...ToastListFoundation.defaultAdapter, ...adapter });
        this.toastList = this._adapter.getState('list');
    }

    hasToast(id: string) {
        const toastList = this.toastList;
        return toastList.map(({ id }) => id).includes(id);
    }

    handleMouseInSideChange = (mouseInSideChange: boolean) => {
        this._adapter.handleMouseInSideChange(mouseInSideChange);
    }

    getInputWrapperRect = () => {
        return this._adapter.getInputWrapperRect();
    }

    private updateList(removedItems: ToastInstance[] = []) {
        const renderedList = this._adapter.getState('list');
        // Reused instances need new timers, including same-id replacements before the next render.
        const updatedItems = this.toastList.filter(item =>
            renderedList.some(rendered => rendered.id === item.id && rendered !== item)
        );
        this._adapter.updateToast(this.toastList, removedItems, updatedItems);
    }

    addToast(toastOpts: ToastProps) {
        this.toastList = [...this.toastList, toastOpts];
        this.updateList();
    }

    updateToast(id: string, toastOpts: ToastProps) {
        let toastList = this.toastList;
        toastList = toastList.map((toast) => toast.id === id ? { ...toast, ...toastOpts } : toast);
        this.toastList = toastList;
        this.updateList();
    }

    removeToast(id: string) {
        let toastList = this.toastList;
        const removedItems: ToastListState['removedItems'] = [];
        toastList = toastList.filter(toastOpts => {
            if (toastOpts.id === id) {
                removedItems.push(toastOpts);
                return false;
            }
            return true;
        });
        this.toastList = toastList;
        this.updateList(removedItems);
    }

    destroyAll() {
        const toastList = this.toastList;
        if (toastList.length > 0) {
            this.toastList = [];
            this._adapter.updateToast([], toastList, []);
        }
    }
}
