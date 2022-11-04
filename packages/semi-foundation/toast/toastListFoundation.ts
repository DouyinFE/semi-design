import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { ToastInstance, ToastProps } from '../toast/toastFoundation';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ToastListProps{

}

export interface ToastListState{
    list: ToastInstance[];
    removedItems: ToastInstance[];
    updatedItems: ToastInstance[]
}

export interface ToastListAdapter extends DefaultAdapter<ToastListProps, ToastListState>{
    updateToast: (list: ToastListState['list'], removedItems: ToastListState['removedItems'], updatedItems: ToastListState['updatedItems']) => void
}

export default class ToastListFoundation extends BaseFoundation<ToastListAdapter> {


    constructor(adapter: ToastListAdapter) {
        super({ ...ToastListFoundation.defaultAdapter, ...adapter });
    }

    hasToast(id: string) {
        const toastList = this._adapter.getState('list') as ToastListState['list'];
        return toastList.map(({ id }) =>id).includes(id);
    }

    addToast(toastOpts: ToastProps) {
        const toastList = this._adapter.getState('list') as ToastListState['list'];
        // const id = getUuid('toast');
        // let toastOpts = { ...opts, id };
        // console.log(toastOpts);
        toastList.push(toastOpts);
        this._adapter.updateToast(toastList, [], []);
        // return id;
    }

    updateToast(id: string, toastOpts: ToastProps) {
        let toastList = this._adapter.getState('list') as ToastListState['list'];
        toastList = toastList.map((toast) => toast.id === id ? { ...toast, ...toastOpts }: toast);
        const updatedItems = toastList.filter((toast => toast.id === id));
        this._adapter.updateToast(toastList, [], updatedItems);
    }

    removeToast(id: string) {
        let toastList = this._adapter.getState('list') as ToastListState['list'];
        const removedItems: ToastListState['removedItems'] = [];
        toastList = toastList.filter(toastOpts => {
            if (toastOpts.id === id) {
                removedItems.push(toastOpts);
                return false;
            }
            return true;
        });
        this._adapter.updateToast(toastList, removedItems, []);
    }

    destroyAll() {
        const toastList = this._adapter.getState('list');
        if (toastList.length > 0) {
            this._adapter.updateToast([], toastList, []);
        }
    }
}
