import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { PaginationAdapter } from '../pagination/foundation';


export interface PinCodeAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {

}


class PinCodeFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<PinCodeAdapter<P, S>, P, S> {

    constructor(adapter: PinCodeAdapter<P, S>) {
        super({ ...adapter });
    }




}


export default PinCodeFoundation;
