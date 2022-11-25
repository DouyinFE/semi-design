import defaultLocale from '../locale/source/zh_CN';

export interface ModalLocale {
    confirm: string;
    cancel: string
}

let runtimeLocale: ModalLocale = {
    ...defaultLocale.Modal,
};

export function changeConfirmLocale(newLocale?: ModalLocale) {
    if (newLocale) {
        runtimeLocale = {
            ...runtimeLocale,
            ...newLocale,
        };
    } else {
        runtimeLocale = {
            ...defaultLocale.Modal,
        };
    }
}

export function getConfirmLocale() {
    return runtimeLocale;
}
