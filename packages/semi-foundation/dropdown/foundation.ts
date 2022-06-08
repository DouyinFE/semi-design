import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { handlePrevent, setFocusToFirstItem, setFocusToLastItem } from '../utils/a11y';

export interface DropdownAdapter extends Partial<DefaultAdapter> {
    setPopVisible(visible: boolean): void;
    notifyVisibleChange(visible: boolean): void;
}

export default class DropdownFoundation extends BaseFoundation<DropdownAdapter> {
    handleVisibleChange(visible: boolean) {
        this._adapter.setPopVisible(visible);
        this._adapter.notifyVisibleChange(visible);
    }

    getMenuItemNodes(target: any): HTMLElement[] {
        const id = target.attributes['data-popupId'].value;
        const menuWrapper = document.getElementById(id);
        // if has dropdown item, the item must wrapped by li
        return menuWrapper ? Array.from(menuWrapper.getElementsByTagName('li')).filter(item => item.ariaDisabled === "false") : null;
    }

    setFocusToFirstMenuItem(target: any): void {
        const menuItemNodes = this.getMenuItemNodes(target);
        menuItemNodes && setFocusToFirstItem(menuItemNodes);
    }

    setFocusToLastMenuItem(target: any): void {
        const menuItemNodes = this.getMenuItemNodes(target);
        menuItemNodes && setFocusToLastItem(menuItemNodes);
    }

    handleKeyDown(event: any): void {
        switch (event.key) {
            case ' ':
            case 'Enter':
                event.target.click();
                handlePrevent(event);
                break;
            case 'ArrowDown':
                this.setFocusToFirstMenuItem(event.target);
                handlePrevent(event);
                break;
            case 'ArrowUp':
                this.setFocusToLastMenuItem(event.target);
                handlePrevent(event);
                break;
            default:
                break;
        }
    }
}
