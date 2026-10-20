import BaseFoundation, { DefaultAdapter } from '../base/foundation';


export interface SpinAdapter extends Partial<DefaultAdapter> {
    setLoading: (val: boolean) => void
}

class SpinFoundation extends BaseFoundation<SpinAdapter> {
    _timer: ReturnType<typeof setTimeout>;

    static get spinDefaultAdapter(): SpinAdapter {
        return {
            getProp: () => undefined,
            setLoading: val => undefined
        };
    }

    constructor(adapter: SpinAdapter) {
        super({ ...SpinFoundation.spinDefaultAdapter, ...adapter });
    }

    updateLoadingIfNeedDelay() {
        this.destroy();
        const { spinning: propsSpinning, delay: propsDelay } = this._adapter.getProps();
        if (propsSpinning && propsDelay) {
            this._timer = setTimeout(() => {
                this._timer = null;
                this._adapter.setLoading(this.getProp('spinning'));
            }, propsDelay);
        }
    }

    destroy() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
}

export default SpinFoundation;
