import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface UserGuideAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S>{
    notifyChange: (current: number) => void;
    notifyPrev: (current: number) => void;
    notifyNext: (current: number) => void;
    notifySkip: () => void;
    // notifyClose: () => void;
    notifyFinish: () => void;
    setCurrent: (current: number) => void
}


export default class UserGuideFoundation <P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<UserGuideAdapter<P, S>, P, S> {
    constructor(adapter: UserGuideAdapter<P, S>) {
        super({ ...adapter });
    }

    init() {
    }

    destroy() {
    }

    _notifyChange(current: number): void {
        const { current: stateCurrent } = this.getStates();
        if (stateCurrent !== current) {
            this._adapter.notifyChange(current);
        }
    }

    getIsControlledComponent(): boolean {
        return this._isInProps('current');
    }

    handlePrev = () => {
        const { current } = this.getStates();
        if (this.getIsControlledComponent()) {
            this._notifyChange(current);
            this._adapter.notifyPrev(current);
        } else if (current > 0) {
            this._adapter.setCurrent(current - 1);
            this._adapter.notifyPrev(current - 1);
        }
    };

    handleNext = () => {
        const { steps } = this.getProps();
        const { current } = this.getStates();
        if (this.getIsControlledComponent()) {
            this._notifyChange(current);
            current < steps.length - 1 ? this._adapter.notifyNext(current) : this._adapter.notifyFinish();
        } else if (current < steps.length - 1) {
            this._adapter.setCurrent(current + 1);
            this._adapter.notifyNext(current + 1);
        } else {
            this._adapter.setCurrent(0);
            this._adapter.notifyFinish();
        }
    };

    handleSkip = () => {
        const { current } = this.getStates();
        if (this.getIsControlledComponent()) {
            this._notifyChange(current);
        } 
        this._adapter.notifySkip();
    };

    // handleClose = () => {
    //     const { current } = this.getProps();
    //     if (this.getIsControlledComponent()) {
    //         this._notifyChange(current);
    //     } 
    //     this._adapter.notifyClose();
    // };
} 